import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from '../employees/schemas/employee.schema';
import { Leave } from '../leaves/schemas/leave.schema';
import { Separation } from '../separations/schemas/separation.schema';

type DashboardLeave = Pick<Leave, 'employeeId' | 'employeeName' | 'leaveType' | 'fromDate' | 'toDate'>;

const HOLIDAYS_2026 = [
  { name: "New Year's Day", date: '2026-01-01', day: 'Thursday' },
  { name: 'Republic Day', date: '2026-01-26', day: 'Monday' },
  { name: 'Ugadi', date: '2026-03-19', day: 'Thursday' },
  { name: 'Labour Day', date: '2026-05-01', day: 'Friday' },
  { name: 'Janmashtami', date: '2026-09-04', day: 'Friday' },
  { name: 'Ganesh Chaturthi', date: '2026-09-14', day: 'Monday' },
  { name: 'Gandhi Jayanti', date: '2026-10-02', day: 'Friday' },
  { name: 'Dussehra', date: '2026-10-20', day: 'Tuesday' },
  { name: 'Diwali', date: '2026-11-09', day: 'Monday' },
  { name: 'Christmas Day', date: '2026-12-25', day: 'Friday' },
];

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(Leave.name) private leaveModel: Model<Leave>,
    @InjectModel(Separation.name) private separationModel: Model<Separation>,
  ) {}

  private parseDob(dob?: string) {
    if (!dob) return null;
    const parts = dob.trim().split(/[-/]/);
    if (parts.length !== 3) return null;
    let day: number;
    let month: number;
    let year: number;
    if (parts[0].length === 4) {
      year = Number(parts[0]);
      month = Number(parts[1]) - 1;
      day = Number(parts[2]);
    } else {
      day = Number(parts[0]);
      month = Number(parts[1]) - 1;
      year = Number(parts[2]);
    }
    if (!day || month < 0 || !year) return null;
    return { day, month, year };
  }

  private getUpcomingBirthdays(employees: Employee[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();

    return employees
      .filter((employee) => employee.status === 'Active')
      .map((employee) => {
        const parsed = this.parseDob(employee.dob);
        if (!parsed || parsed.month !== currentMonth) return null;
        const next = new Date(today.getFullYear(), parsed.month, parsed.day);
        if (next < today) return null; // already passed in this month
        const daysUntil = Math.ceil((next.getTime() - today.getTime()) / 86400000);
        const age = next.getFullYear() - parsed.year;
        return {
          name: employee.name,
          employeeId: employee.employeeId,
          date: next.toISOString().split('T')[0],
          daysUntil,
          label: next.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          age,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a!.daysUntil - b!.daysUntil)
      .slice(0, 5);
  }

  private getNextHoliday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = HOLIDAYS_2026
      .map((holiday) => ({ ...holiday, at: new Date(`${holiday.date}T00:00:00`) }))
      .filter((holiday) => holiday.at >= today)
      .sort((a, b) => a.at.getTime() - b.at.getTime());
    const next = upcoming[0];
    if (!next) return null;
    const daysUntil = Math.ceil((next.at.getTime() - today.getTime()) / 86400000);
    return {
      name: next.name,
      date: next.date,
      day: next.day,
      daysUntil,
      label: next.at.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
  }

  private getWeekDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = new Date(today);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date.toISOString().split('T')[0];
    });
  }

  private scaleChartHeights(values: number[]) {
    const max = Math.max(...values, 0);
    const min = Math.min(...values, max);
    if (max <= 0) return values.map(() => 0);
    if (max === min) return values.map(() => 82);

    const floor = 22;
    const range = max - min;
    return values.map((value) => Math.round(floor + ((value - min) / range) * (100 - floor)));
  }

  private getWeeklyAttendance(activeCount: number, leaves: DashboardLeave[], activeEmployeeIds: Set<string>) {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dates = this.getWeekDates();
    const present = dates.map((date) => {
      const onLeaveForDay = new Set(
        leaves
          .filter((leave) => leave.fromDate <= date && leave.toDate >= date)
          .map((leave) => String(leave.employeeId || '').toUpperCase().trim())
          .filter((employeeId) => employeeId && activeEmployeeIds.has(employeeId)),
      );
      return Math.max(0, activeCount - onLeaveForDay.size);
    });
    return {
      labels,
      dates,
      present,
      total: activeCount,
      heights: this.scaleChartHeights(present),
    };
  }

  async getStats() {
    const employees = await this.employeeModel.find().exec();
    const today = new Date().toISOString().split('T')[0];
    const weekDates = this.getWeekDates();
    const activeEmployees = employees.filter((employee) => employee.status !== 'Inactive');
    const totalEmployees = activeEmployees.length;
    const activeEmployeeIds = new Set(
      activeEmployees.map((employee) => String(employee.employeeId || '').toUpperCase().trim()).filter(Boolean),
    );
    const employeeById = new Map(
      activeEmployees.map((employee) => [String(employee.employeeId || '').toUpperCase().trim(), employee]),
    );

    const [pendingLeaves, activeApprovedLeaves, pendingSeparations, inExitSeparations] = await Promise.all([
      this.leaveModel.countDocuments({ status: 'Pending' }),
      this.leaveModel.find({
        status: 'Approved',
        toDate: { $gte: weekDates[0] },
        fromDate: { $lte: weekDates[6] },
      }).lean().exec(),
      this.separationModel.countDocuments({ status: { $in: ['Pending', 'Manager_Review', 'Retention'] } }),
      this.separationModel.countDocuments({ status: 'In_Exit' }),
    ]);

    const todayLeaveByEmployee = new Map<string, any>();
    for (const leave of activeApprovedLeaves) {
      const employeeId = String(leave.employeeId || '').toUpperCase().trim();
      if (!employeeId || !activeEmployeeIds.has(employeeId)) continue;
      if (leave.fromDate <= today && leave.toDate >= today && !todayLeaveByEmployee.has(employeeId)) {
        const employee = employeeById.get(employeeId);
        todayLeaveByEmployee.set(employeeId, {
          employeeId,
          name: leave.employeeName || employee?.name || employeeId,
          department: employee?.department || '',
          leaveType: leave.leaveType,
          fromDate: leave.fromDate,
          toDate: leave.toDate,
        });
      }
    }

    const onLeaveEmployees = [...todayLeaveByEmployee.values()].sort((a, b) => a.name.localeCompare(b.name));
    const onLeave = onLeaveEmployees.length;
    const present = Math.max(0, totalEmployees - onLeave);
    const absent = Math.max(0, totalEmployees - present);


    const inactiveCount = employees.filter((e) => e.status === 'Inactive').length;
    const attritionRate = employees.length > 0
      ? Number(((inactiveCount / employees.length) * 100).toFixed(1))
      : 0;

    return {
      totalEmployees,
      onLeave,
      onLeaveEmployees,
      leaveRequests: pendingLeaves,
      pendingSeparations,
      inExitSeparations,
      attritionRate,
      attendance: {
        present,
        absent,
        onLeave,
      },
      weeklyAttendance: this.getWeeklyAttendance(totalEmployees, activeApprovedLeaves, activeEmployeeIds),
      upcomingBirthdays: this.getUpcomingBirthdays(employees),
      nextHoliday: this.getNextHoliday(),
    };
  }
}

const Modules = (() => {
  const icons = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    leave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    timesheet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="15" x2="8" y2="19"/><line x1="12" y1="15" x2="12" y2="19"/><line x1="16" y1="15" x2="16" y2="19"/></svg>',
    employees: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    recruitment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
    payroll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    performance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    grievance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>',
    reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    separation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="11" x2="23" y2="11"/></svg>'
  };

  const ROLE_NAV = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'timesheet', label: 'Timesheet', icon: 'timesheet' },
      { id: 'employees', label: 'Employees', icon: 'employees' },
      { id: 'leave', label: 'Leave Request', icon: 'leave' },
      { id: 'recruitment', label: 'Recruitment', icon: 'recruitment' },
      { id: 'grievance', label: 'Grievance', icon: 'grievance' },
      { id: 'payroll', label: 'Payroll', icon: 'payroll' },
      { id: 'performance', label: 'Performance', icon: 'performance' },
      { id: 'separation', label: 'Separation', icon: 'separation' },
      { id: 'reports', label: 'Reports', icon: 'reports' }
    ],
    hr_manager: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'timesheet', label: 'Timesheet', icon: 'timesheet' },
      { id: 'employees', label: 'Employees', icon: 'employees' },
      { id: 'leave', label: 'Leave Request', icon: 'leave' },
      { id: 'recruitment', label: 'Recruitment', icon: 'recruitment' },
      { id: 'grievance', label: 'Grievance', icon: 'grievance' },
      { id: 'payroll', label: 'Payroll', icon: 'payroll' },
      { id: 'performance', label: 'Performance', icon: 'performance' },
      { id: 'separation', label: 'Separation', icon: 'separation' }
    ],
    employee: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'timesheet', label: 'Timesheet', icon: 'timesheet' },
      { id: 'leave', label: 'Leave Request', icon: 'leave' },
      { id: 'separation', label: 'Separation', icon: 'separation' },
      { id: 'recruitment', label: 'Recruitment', icon: 'recruitment' },
      { id: 'grievance', label: 'Grievance', icon: 'grievance' },
      { id: 'payroll', label: 'Payroll', icon: 'payroll' }
    ],
    project_manager: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'timesheet', label: 'Timesheet', icon: 'timesheet' },
      { id: 'leave', label: 'Leave Request', icon: 'leave' },
      { id: 'separation', label: 'Separation', icon: 'separation' },
      { id: 'recruitment', label: 'Recruitment', icon: 'recruitment' },
      { id: 'grievance', label: 'Grievance', icon: 'grievance' },
      { id: 'payroll', label: 'Payroll', icon: 'payroll' }
    ],
    reporting_manager: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'timesheet', label: 'Timesheet', icon: 'timesheet' },
      { id: 'leave', label: 'Leave Request', icon: 'leave' },
      { id: 'separation', label: 'Separation', icon: 'separation' },
      { id: 'recruitment', label: 'Recruitment', icon: 'recruitment' },
      { id: 'grievance', label: 'Grievance', icon: 'grievance' },
      { id: 'payroll', label: 'Payroll', icon: 'payroll' },
      { id: 'performance', label: 'Performance', icon: 'performance' }
    ],
    ca: [
      { id: 'employees', label: 'Employees', icon: 'employees' },
      { id: 'payroll', label: 'Payroll', icon: 'payroll' }
    ]
  };

  const PERMS = {
    'leave.approval': ['admin', 'hr_manager', 'project_manager', 'reporting_manager'],
    'payroll.list': ['admin', 'hr_manager', 'ca'],
    'payroll.process': ['admin', 'hr_manager', 'ca'],
    'recruitment.pipeline': ['admin', 'hr_manager'],
    'recruitment.post': ['admin', 'hr_manager'],
    'recruitment.refer': ['admin', 'hr_manager', 'employee', 'project_manager', 'reporting_manager'],
    'employees.onboard': ['hr_manager', 'hr'],
    'employees.view': ['admin', 'hr_manager', 'hr', 'ca'],
    'employees.edit': ['admin', 'hr_manager', 'hr'],
    'performance.manage': ['admin', 'hr_manager', 'hr', 'reporting_manager'],
    'grievance.manage': ['admin', 'hr_manager', 'hr'],
    'separation.submit': ['admin', 'hr_manager', 'employee', 'project_manager', 'reporting_manager'],
    'separation.approval': ['admin', 'hr_manager', 'reporting_manager', 'project_manager'],
    'separation.manager_review': ['admin', 'hr_manager', 'reporting_manager', 'project_manager'],
    'separation.exit_manage': ['admin', 'hr_manager', 'reporting_manager', 'ca', 'project_manager'],
    'separation.analytics': ['admin', 'hr_manager']
  };

  function effectiveRole(role) {
    const raw = String(role || '').trim().toLowerCase();
    const normalized = raw.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (['manager', 'reporting_manager', 'reporting-manager', 'reporting manager'].includes(normalized)) return 'reporting_manager';
    if (['project_manager', 'project-manager', 'project manager'].includes(normalized)) return 'project_manager';
    if (['hr', 'hr_manager', 'hr-manager', 'hr manager', 'human_resource', 'human_resources', 'human-resource', 'human-resources'].includes(normalized)) return 'hr_manager';
    if (['ca', 'chartered_accountant'].includes(normalized)) return 'ca';
    return normalized;
  }

  function canAccess(user, feature) {
    return PERMS[feature]?.includes(effectiveRole(user.role)) ?? false;
  }

  function isLeaveApprover(user) {
    return canAccess(user, 'leave.approval');
  }

  function isSeparationApprover(user) {
    return canAccess(user, 'separation.approval');
  }
  function getDefaultSub(page, user) {
    if (page === 'leave' && user && isLeaveApprover(user)) return 'approval';
    if (page === 'separation' && user && isSeparationApprover(user)) return 'approvals';
    if (page === 'separation' && user && canAccess(user, 'separation.exit_manage')) return 'exit';
    const role = effectiveRole(user?.role);
    if (page === 'payroll' && user && ['admin', 'hr_manager', 'ca'].includes(role)) return 'list';
    return DEFAULT_SUB[page] || '';
  }

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function formatRupee(amount) {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  }

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
    { name: 'Christmas Day', date: '2026-12-25', day: 'Friday' }
  ];

  function parseDob(dob) {
    if (!dob) return null;
    const parts = String(dob).trim().split(/[-/]/);
    if (parts.length !== 3) return null;
    let day; let month; let year;
    if (parts[0].length === 4) {
      year = Number(parts[0]); month = Number(parts[1]) - 1; day = Number(parts[2]);
    } else {
      day = Number(parts[0]); month = Number(parts[1]) - 1; year = Number(parts[2]);
    }
    if (!day || month < 0 || !year) return null;
    return { day, month, year };
  }

  function getUpcomingBirthdays(employees) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    return employees
      .filter(e => e.status === 'Active')
      .map((employee) => {
        const parsed = parseDob(employee.dob);
        if (!parsed || parsed.month !== currentMonth) return null;
        const next = new Date(today.getFullYear(), parsed.month, parsed.day);
        if (next < today) return null; // already passed in this month
        const daysUntil = Math.ceil((next - today) / 86400000);
        const age = next.getFullYear() - parsed.year;
        return {
          name: employee.name,
          employeeId: employee.employeeId,
          daysUntil,
          label: next.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          age
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5);
  }

  function getNextHoliday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = HOLIDAYS_2026
      .map(h => ({ ...h, at: new Date(`${h.date}T00:00:00`) }))
      .filter(h => h.at >= today)
      .sort((a, b) => a.at - b.at);
    const next = upcoming[0];
    if (!next) return null;
    return {
      name: next.name,
      date: next.date,
      day: next.day,
      daysUntil: Math.ceil((next.at - today) / 86400000),
      label: next.at.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
  }

  function getWeeklyAttendanceData(employees, dashboard) {
    const activeCount = employees.filter(e => e.status !== 'Inactive').length;
    let labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = new Date(today);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDayMonth = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const formatFullDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const dateRange = `${formatDayMonth(monday)} - ${formatFullDate(sunday)}`;
    
    const serverWeekly = dashboard?.weeklyAttendance;
    
    let present = [];
    let dates = [];
    let total = activeCount;
    
    if (Array.isArray(serverWeekly?.present) && serverWeekly.present.length) {
      present = serverWeekly.present.map(value => Number(value) || 0);
      labels = serverWeekly.labels?.length ? serverWeekly.labels : labels;
      dates = serverWeekly.dates || [];
      total = Number(serverWeekly.total) || activeCount;
    } else {
      const activeIds = new Set(employees
        .filter(e => e.status !== 'Inactive')
        .map(e => String(e.employeeId || '').toUpperCase().trim())
        .filter(Boolean));
      const leaves = Store.getLeaves().filter(l => l.status === 'Approved');
      dates = labels.map((_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      });
      present = dates.map(date => {
        const onLeaveForDay = new Set(leaves
          .filter(l => l.fromDate <= date && l.toDate >= date)
          .map(l => String(l.employeeId || '').toUpperCase().trim())
          .filter(id => id && activeIds.has(id)));
        return Math.max(0, activeCount - onLeaveForDay.size);
      });
    }

    const maxVal = Math.max(...present, 16);
    const chartMax = Math.ceil(maxVal / 4) * 4;

    return {
      labels,
      dates,
      present,
      total,
      heights: present.map(v => Math.round((v / chartMax) * 100)),
      dateRange,
      chartMax
    };
  }

  function scaleChartHeights(values) {
    const max = Math.max(...values, 0);
    if (max <= 0) return values.map(() => 0);
    return values.map(value => Math.round((value / max) * 100));
  }

  function getTodayOnLeave(employees, dashboard) {
    if (Array.isArray(dashboard?.onLeaveEmployees)) return dashboard.onLeaveEmployees;
    const todayDate = new Date();
    const today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
    const employeeById = new Map(employees.map(e => [String(e.employeeId || '').toUpperCase().trim(), e]));
    const byEmployee = new Map();
    Store.getLeaves()
      .filter(l => l.status === 'Approved' && l.fromDate <= today && l.toDate >= today)
      .forEach((leave) => {
        const employeeId = String(leave.employeeId || '').toUpperCase().trim();
        const employee = employeeById.get(employeeId);
        if (!employee || employee.status === 'Inactive' || byEmployee.has(employeeId)) return;
        byEmployee.set(employeeId, {
          employeeId,
          name: leave.employeeName || employee.name || employeeId,
          department: employee.department || '',
          leaveType: leave.leaveType,
          fromDate: leave.fromDate,
          toDate: leave.toDate
        });
      });
    return [...byEmployee.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  function renderOnLeaveDropdown(people) {
    return `
      <details class="stat-details">
        <summary>${people.length ? 'View employees' : 'No employees on leave'}</summary>
        <div class="stat-details-menu">
          ${people.length === 0 ? '<div class="stat-detail-empty">Everyone is available today</div>' : people.map(person => `
            <div class="stat-detail-row">
              <strong>${person.name}</strong>
              <span>${person.employeeId}${person.department ? ` · ${person.department}` : ''}</span>
              <small>${person.leaveType === 'sick' ? 'Sick Leave' : 'Annual Leave'} · ${formatDate(person.fromDate)} - ${formatDate(person.toDate)}</small>
            </div>
          `).join('')}
        </div>
      </details>`;
  }
  function statusBadge(status) {
    const cls = {
      Approved: 'badge-approved',
      Rejected: 'badge-rejected',
      Deleted: 'badge-deleted',
      Pending: 'badge-pending'
    }[status] || 'badge-pending';
    return `<span class="badge ${cls}">${status}</span>`;
  }

  function leaveTypeBadge(type) {
    const cls = type === 'sick' ? 'badge-sick' : 'badge-annual';
    const label = type === 'sick' ? 'Sick Leave' : 'Annual Leave';
    return `<span class="badge ${cls}">${label}</span>`;
  }

  function separationStatusBadge(status) {
    const cls = {
      Completed: 'badge-approved',
      Rejected: 'badge-rejected',
      Withdrawn: 'badge-deleted',
      Pending: 'badge-pending',
      Manager_Review: 'badge-pending',
      Retention: 'badge-annual',
      In_Exit: 'badge-sick',
      Approved: 'badge-approved'
    }[status] || 'badge-pending';
    const label = (status || 'Pending').replace(/_/g, ' ');
    return `<span class="badge ${cls}">${label}</span>`;
  }

  function renderSeparationApprovalBoxes(approvals) {
    const a = Store.normalizeSeparationApprovals(approvals);
    const steps = Store.SEPARATION_APPROVAL_STEPS.filter(s => a[s.key] !== 'N/A');

    return `<div class="approval-tracker">
    ${steps.map(s => {
      const st = a[s.key] || 'Pending';

      const cls =
        st === 'Approved' ? 'approved' :
          st === 'Rejected' ? 'rejected' :
            st === 'Cancelled' ? 'cancelled' : 'pending';

      return `
        <div class="approval-box ${cls}">
          <div class="approval-stage-label">${s.label}</div>
          <div class="approval-stage-status">${st}</div>
        </div>
      `;
    }).join('')}
  </div>`;
  }
  const EXIT_STEP_ORDER = [
    'knowledge_transfer',
    'manager_clearance',
    'it_clearance',
    'admin_clearance',
    'hr_clearance',
    'finance_clearance',
    'exit_interview',
    'final_settlement',
    'deactivation'
  ];
  function renderExitSteps(sep) {
    if (!['Approved', 'In_Exit', 'Completed'].includes(sep.status)) return '';
    const user = Store.getUser();
    const exitSteps = sep.exitSteps || {};
    console.log('SEP:', sep);
    console.log('STATUS:', sep.status);
    const steps = Store.EXIT_STEP_LABELS;
    const entries = EXIT_STEP_ORDER.map(key => [key, steps[key]]);
    const done = key => exitSteps?.[key]?.status === 'Completed';
    const clearanceSteps = ['it_clearance', 'admin_clearance', 'hr_clearance', 'finance_clearance', 'exit_interview'];
    const isAvailable = (key) => {
      if (key === 'knowledge_transfer') return true;
      if (!done('knowledge_transfer')) return false;
      if (key === 'manager_clearance') return true;
      if (!done('manager_clearance')) return false;
      if (clearanceSteps.includes(key)) return true;
      if (key === 'final_settlement') return clearanceSteps.every(done);
      if (key === 'deactivation') return done('final_settlement');
      return false;
    };

    return `<div class="exit-steps-grid">
${entries.map(([key, label]) => {
      const step = exitSteps?.[key] || { status: 'Pending' };
      const available = isAvailable(key);
      const status = step.status || 'Pending';
      const separationCancelled =
        sep.status === 'Withdrawn' ||
        sep.status === 'Cancelled';
      
      const canAct = user && Store.isExitStepAvailable(sep, key, user);

      const cls = separationCancelled
        ? 'locked'
        : status === 'Completed'
          ? 'approved'
          : status === 'In Progress'
            ? 'pending'
            : available
              ? 'pending available'
              : 'locked';

      return `
<div class="approval-box exit-step-box ${cls}">
    <span class="approval-label">${label}</span>
   <span class="exit-step-status">
    ${separationCancelled
          ? 'Cancelled'
          : status === 'Completed'
          ? 'Completed'
          : available
            ? 'Pending'
            : 'Locked'
        }
    ${canAct ? `<button class="btn btn-primary btn-sm btn-update-step-inline" data-update-exit="${sep.id}" data-step-key="${key}" type="button" style="margin-left: 10px; padding: 2px 8px; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; height: 24px;">Update</button>` : ''}
</span>
</div>`;
    }).join('')}
</div>`;
  }
  function formatRoleName(role) {
    const key = effectiveRole(role);
    const names = {
      hr_manager: 'HR Manager',
      project_manager: 'Project Manager',
      reporting_manager: 'Reporting Manager',
      admin: 'Admin',
      employee: 'Employee',
      ca: 'CA'
    };
    return names[key] || (key || '').replace(/_/g, ' ');
  }

  function renderApprovalBoxes(approvals) {
    const a = Store.normalizeApprovals(approvals);
    const steps = Store.APPROVAL_STEPS.filter(s => a[s.key] !== 'N/A');
    return `<div class="approval-tracker">${steps.map(s => {
      const st = a[s.key] || 'Pending';
      const cls = st === 'Approved' ? 'approved'
        : st === 'Rejected' ? 'rejected'
        : st === 'Cancelled' ? 'cancelled'
        : 'pending';
      return `<div class="approval-box ${cls}"><span class="approval-label">${s.label}</span><span class="approval-status">${st}</span></div>`;
    }).join('')}</div>`;
  }

  function renderTimesheet(user, subPage) {
    const role = effectiveRole(user.role);
    const view = subPage || 'mine';

    if (view === 'employees' && ['admin', 'hr_manager'].includes(role)) {
      return renderEmployeeTimesheetsOverview({
        title: 'All Employees — Today',
        hint: 'Live punch-in, punch-out, and activity for every active employee (read-only)',
        rows: Store.getTeamTimesheets() || [],
        showDepartment: true,
      });
    }

    if (view === 'team' && role === 'reporting_manager') {
      return renderEmployeeTimesheetsOverview({
        title: 'My Team — Today',
        hint: 'Read-only view of punch times and activities for your direct reports',
        rows: Store.getTeamTimesheets() || [],
        showDepartment: true,
      });
    }

    return renderTimesheetPersonal(user);
  }

  function timesheetStatusMeta(status) {
    const key = status || 'Not Punched In';
    const map = {
      'Not Punched In': { label: 'Not Punched In', cls: 'badge-pending' },
      'Working': { label: 'Working', cls: 'badge-processing' },
      'Punch Out Missing': { label: 'Punch Out Missing', cls: 'badge-warning' },
      'Punched Out': { label: 'Punched Out', cls: 'badge-secondary' },
      'Submitted': { label: 'Submitted', cls: 'badge-approved' },
    };
    return map[key] || { label: key, cls: 'badge-secondary' };
  }

  function formatTimesheetClock(t) {
    return t ? new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';
  }

  function formatTimesheetHours(hours) {
    if (!hours) return '0h';
    const whole = Math.floor(hours);
    const minutes = Math.round((hours - whole) * 60);
    return minutes > 0 ? `${whole}h ${minutes}m` : `${whole}h`;
  }

  function renderEmployeeTimesheetsOverview({ title, hint, rows, showDepartment }) {
    const todayDate = new Date();
    const today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
    const list = Array.isArray(rows) ? rows : [];
    const counts = {
      working: list.filter((r) => r.status === 'Working').length,
      punchedOut: list.filter((r) => r.status === 'Punched Out' || r.status === 'Submitted').length,
      notIn: list.filter((r) => !r.status || r.status === 'Not Punched In').length,
    };

    return `
      <div class="panel timesheet-board">
        <div class="panel-header timesheet-board-header">
          <div>
            <h3>${title}</h3>
            <p class="form-hint">${hint}</p>
            <p class="form-hint">${today}</p>
          </div>
          <div class="timesheet-board-search">
            <input type="search" id="search-employee-ts" class="form-input" placeholder="Search employee..." />
          </div>
        </div>
        <div class="panel-body">
          <div class="timesheet-summary">
            <div class="timesheet-summary-chip"><span>Working</span><strong>${counts.working}</strong></div>
            <div class="timesheet-summary-chip"><span>Done</span><strong>${counts.punchedOut}</strong></div>
            <div class="timesheet-summary-chip"><span>Not in</span><strong>${counts.notIn}</strong></div>
          </div>
          ${list.length === 0 ? '<div class="empty-state"><p>No employees to show.</p></div>' : `
            <div class="table-responsive">
              <table class="data-table timesheet-overview-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    ${showDepartment ? '<th>Department</th>' : ''}
                    <th>Date</th>
                    <th>Punch In</th>
                    <th>Punch Out</th>
                    <th>Total Working Hours</th>
                    <th>Status</th>
                    <th>Activities</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="timesheet-management-table">
                  ${list.map((ts) => {
                    const status = timesheetStatusMeta(ts.status);
                    const activityCount = (ts.activities || []).length;
                    const hours = ts.punchedInDuration || ts.totalActivityHours || 0;
                    return `
                      <tr>
                        <td>
                          <div class="timesheet-emp-name">${ts.employeeName || '—'}</div>
                          <div class="timesheet-emp-id">${ts.employeeId || ''}</div>
                        </td>
                        ${showDepartment ? `<td>${ts.department || '—'}</td>` : ''}
                        <td>${ts.date || today}</td>
                        <td>${formatTimesheetClock(ts.punchInTime)}</td>
                        <td>${formatTimesheetClock(ts.punchOutTime)}</td>
                        <td>${formatTimesheetHours(hours)}</td>
                        <td><span class="badge ${status.cls}">${status.label}</span></td>
                        <td>${activityCount}</td>
                        <td class="table-actions">
                          <button class="btn btn-secondary btn-sm" data-view-team-timesheet="${ts.employeeId}" type="button">View</button>
                        </td>
                      </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;
  }

  function renderTimesheetPersonal(user) {
    const todayDate = new Date();
    const today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
    const timesheet = Store.getTimesheet();
    
    if (!timesheet) {
      const error = Store.getTimesheetError();
      return `<div class="panel"><div class="panel-body"><p class="form-hint">${error ? `Unable to load timesheet: ${error}` : 'Loading timesheet...'}</p></div></div>`;
    }

    const status = timesheetStatusMeta(timesheet.status);
    const punchedInDuration = timesheet.punchedInDuration || 0;
    const totalActivityHours = timesheet.totalActivityHours || 0;
    const canPunchIn = timesheet.status === 'Not Punched In';
    const canPunchOut = timesheet.status === 'Working';
    const canAddActivity = timesheet.status === 'Working' || timesheet.status === 'Punched Out';
    const canSubmit = timesheet.status === 'Punched Out' && !timesheet.submitted;
    const isSubmitted = timesheet.submitted;

    return `
      <div class="panel">
        <div class="panel-header">
          <div>
            <h3>Today's Timesheet</h3>
            <p class="form-hint">${today}</p>
          </div>
          <span class="badge ${status.cls}">${status.label}</span>
        </div>
        <div class="panel-body">
          <div class="timesheet-punch-grid">
            <div class="timesheet-punch-card">
              <p class="form-hint">Punch In</p>
              <p class="timesheet-punch-time">${formatTimesheetClock(timesheet.punchInTime)}</p>
              ${!isSubmitted ? `<button class="btn btn-primary btn-sm" id="btn-punch-in" type="button" ${!canPunchIn ? 'disabled' : ''}>Punch In</button>` : ''}
            </div>
            <div class="timesheet-punch-card">
              <p class="form-hint">Punch Out</p>
              <p class="timesheet-punch-time">${formatTimesheetClock(timesheet.punchOutTime)}</p>
              ${!isSubmitted ? `<button class="btn btn-secondary btn-sm" id="btn-punch-out" type="button" ${!canPunchOut ? 'disabled' : ''}>Punch Out</button>` : ''}
            </div>
          </div>

          <div class="timesheet-metric">
            <p class="form-hint">Total Punched-In Duration</p>
            <p class="timesheet-metric-value">${formatTimesheetHours(punchedInDuration)}</p>
          </div>

          <div class="timesheet-activities">
            <div class="timesheet-activities-head">
              <h4>Daily Activities</h4>
              ${!isSubmitted ? `<button class="btn btn-primary btn-sm timesheet-action-btn" id="btn-add-activity" type="button" ${!canAddActivity ? 'disabled' : ''}>Add Activity</button>` : ''}
            </div>

            ${timesheet.activities && timesheet.activities.length > 0 ? `
              <div class="table-responsive timesheet-activities-table-wrap">
                <table class="table timesheet-activities-table">
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th class="duration-col">Duration</th>
                      ${!isSubmitted ? '<th class="actions-col">Actions</th>' : ''}
                    </tr>
                  </thead>
                  <tbody>
                    ${timesheet.activities.map((act, idx) => `
                      <tr>
                        <td class="activity-cell">${act.activity}</td>
                        <td class="duration-cell">${act.duration}h</td>
                        ${!isSubmitted ? `
                          <td class="table-actions">
                            <button class="btn btn-secondary btn-xs" data-edit-activity="${idx}" type="button">Edit</button>
                            <button class="btn btn-secondary btn-xs" data-delete-activity="${idx}" type="button">Delete</button>
                          </td>
                        ` : ''}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : '<p class="form-hint">No activities recorded yet.</p>'}

            <div class="timesheet-metric">
              <p class="form-hint">Total Activity Hours</p>
              <p class="timesheet-metric-value">${formatTimesheetHours(totalActivityHours)}</p>
            </div>
          </div>

          ${canSubmit ? `
            <button class="btn btn-primary" id="btn-submit-timesheet" type="button" style="width: 100%; margin-top: 1rem;">Submit Timesheet</button>
          ` : ''}
          ${isSubmitted ? `
            <p class="form-hint" style="text-align: center; margin-top: 1rem;">✓ This timesheet has been submitted and is now read-only.</p>
          ` : ''}
        </div>
      </div>
    `;
  }

  const SUB_TABS = {
    leave: [
      { id: 'apply', label: 'My Leave', locked: false },
      { id: 'approval', label: 'Approvals', locked: false }
    ],
    payroll: [
      { id: 'list', label: 'Payroll', locked: false },
      { id: 'tax-form', label: 'Tax Form', locked: false },
      { id: 'payslip', label: 'Download Payslip', locked: false }
    ],
    recruitment: [
      { id: 'pipeline', label: 'Recruitment', locked: false },
      { id: 'jobs', label: 'Job Posting', locked: false },
      { id: 'referrals', label: 'Referrals', locked: false }
    ],
    timesheet: [
      { id: 'mine', label: 'My Timesheet', locked: false },
      { id: 'team', label: 'My Team', locked: false },
      { id: 'employees', label: 'All Employees', locked: false }
    ],
    separation: [
      { id: 'my', label: 'My Separation', locked: false },
      { id: 'approvals', label: 'Approvals', locked: false },
      { id: 'exit', label: 'Exit Workflow', locked: false },
      { id: 'analytics', label: 'Attrition Analytics', locked: false }
    ],
    performance: [
      { id: 'probation', label: 'Probation', locked: false },
      { id: 'appraisal', label: 'Appraisal', locked: false }
    ]
  };

  function subTabLocked(page, tabId, user) {
    const role = effectiveRole(user.role);
    if (page === 'leave' && tabId === 'approval') return !isLeaveApprover(user);
    if (page === 'payroll' && tabId === 'list') return !canAccess(user, 'payroll.list');
    if (page === 'payroll' && tabId === 'payslip' && role === 'ca') return true;
    if (page === 'recruitment' && tabId === 'pipeline') return !canAccess(user, 'recruitment.pipeline');
    if (page === 'timesheet' && tabId === 'team') return role !== 'reporting_manager';
    if (page === 'timesheet' && tabId === 'employees') return !['admin', 'hr_manager'].includes(role);
    if (page === 'separation' && tabId === 'approvals') return !canAccess(user, 'separation.approval');
    if (page === 'separation' && tabId === 'exit') return !canAccess(user, 'separation.exit_manage');
    if (page === 'separation' && tabId === 'analytics') return !canAccess(user, 'separation.analytics');
    return false;
  }

  function renderSubTabs(page, user, subPage) {
    const pageTabs = SUB_TABS[page];
    if (!pageTabs) return '';

    // Only render tabs the user is authorized to see
    const availableTabs = pageTabs.filter(t => !subTabLocked(page, t.id, user));
    if (availableTabs.length <= 1) return ''; // No need for a dropdown with 0-1 tabs

    return `
      <div class="sub-tabs">
        <label class="sub-tabs-label" for="sub-tab-select">Section</label>
        <select id="sub-tab-select" class="sub-tab-select">
          ${availableTabs.map(t => `
            <option value="${t.id}" ${subPage === t.id ? 'selected' : ''}>
              ${t.label}
            </option>
          `).join('')}
        </select>
      </div>`;
  }

  function renderDashboard(user) {
    const employees = Store.getEmployees();
    const dashboard = Store.getDashboard();
    const role = effectiveRole(user.role);
    const ownLeaves = Store.getLeaves().filter(l => Store.isOwnLeave(l, user) && Store.isLeaveActive(l));
    const pending = role === 'employee'
      ? ownLeaves.filter(l => l.status === 'Pending').length
      : (dashboard?.leaveRequests ?? Store.getLeaves().filter(l => Store.isLeaveActive(l) && l.status === 'Pending').length);
    // Use dashboard API data as primary source — it is fetched for ALL authenticated users
    // regardless of role. The local employee store is only populated for admin/hr_manager/ca,
    // so computing stats from it returns 0 for regular employees.
    const attendance = dashboard?.attendance || Store.getAttendance();
    const weekly = getWeeklyAttendanceData(employees, dashboard);
    const birthdays = dashboard?.upcomingBirthdays || getUpcomingBirthdays(employees);
    const holiday = dashboard?.nextHoliday || getNextHoliday();
    const activeEmployees = employees.filter(e => e.status !== 'Inactive');
    // Prefer totalEmployees from dashboard API; fall back to local store count for admins.
    const totalEmployees = dashboard?.totalEmployees ?? activeEmployees.length;
    const onLeaveEmployees = getTodayOnLeave(employees, dashboard);
    const onLeaveCount = onLeaveEmployees.length || attendance.onLeave || 0;

    return `
      <div class="stats-grid">
        <div class="stat-card accent-blue">
          <div class="label">Total Employees</div>
          <div class="value">${totalEmployees}</div>
          <div class="change">Active workforce</div>
        </div>
        <div class="stat-card accent-amber">
          <div class="label">${role === 'employee' ? 'My Pending Leave' : 'Pending Leave Requests'}</div>
          <div class="value">${pending}</div>
          <div class="change">${role === 'employee' ? 'Your requests awaiting approval' : 'Awaiting approval'}</div>
        </div>
        <div class="stat-card accent-green">
          <div class="label">Present Today</div>
          <div class="value">${attendance.present ?? 0}</div>
          <div class="change">Attendance tracked</div>
        </div>
        <div class="stat-card accent-red">
          <div class="label">On Leave</div>
          <div class="value">${onLeaveCount}</div>
          <div class="change">Currently away</div>
          ${renderOnLeaveDropdown(onLeaveEmployees)}
        </div>
      </div>
      <div class="dashboard-panels">
        <div class="panel weekly-chart-panel">
          <div class="panel-header weekly-chart-header">
            <h3>Weekly Attendance</h3>
          </div>
          <div class="panel-body">
            <div class="weekly-chart-date-range">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${weekly.dateRange}</span>
            </div>
            
            <div class="weekly-chart-container">
              <div class="weekly-chart-y-axis">
                <div class="weekly-chart-y-label">${weekly.chartMax}</div>
                <div class="weekly-chart-y-label">${Math.round(weekly.chartMax * 0.75)}</div>
                <div class="weekly-chart-y-label">${Math.round(weekly.chartMax * 0.5)}</div>
                <div class="weekly-chart-y-label">${Math.round(weekly.chartMax * 0.25)}</div>
                <div class="weekly-chart-y-label">0</div>
              </div>
              <div class="weekly-chart-content">
                <div class="weekly-chart-grid">
                  <div class="weekly-chart-grid-line"></div>
                  <div class="weekly-chart-grid-line"></div>
                  <div class="weekly-chart-grid-line"></div>
                  <div class="weekly-chart-grid-line"></div>
                  <div class="weekly-chart-grid-line bottom-line"></div>
                </div>
                <div class="weekly-chart-bars">
                  ${weekly.labels.map((label, i) => {
                    const todayStr = new Date();
                    const todayIso = `${todayStr.getFullYear()}-${String(todayStr.getMonth()+1).padStart(2,'0')}-${String(todayStr.getDate()).padStart(2,'0')}`;
                    const isToday = weekly.dates[i] === todayIso;
                    return `
                    <div class="weekly-chart-bar-wrap ${isToday ? 'is-today' : ''}">
                      ${isToday ? '<div class="today-badge">Today</div>' : ''}
                      <span class="weekly-chart-bar-value">${weekly.present[i]}</span>
                      <div class="weekly-chart-bar" style="height:${weekly.heights[i]}%"></div>
                      <span class="weekly-chart-x-label">${label}</span>
                    </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
            <p class="form-hint" style="margin-top:1.5rem">Present employees this week (of \${weekly.total} active)</p>
          </div>
        </div>
        <div class="dashboard-side-panels">
          <div class="panel highlight-panel">
            <div class="panel-header"><h3>Next Holiday</h3></div>
            <div class="panel-body">
              ${holiday ? `
                <div class="highlight-card">
                  <div class="highlight-title">${holiday.name}</div>
                  <div class="highlight-meta">${holiday.label} · ${holiday.day}</div>
                  <div class="highlight-sub">${holiday.daysUntil === 0 ? 'Today' : `In ${holiday.daysUntil} day${holiday.daysUntil > 1 ? 's' : ''}`}</div>
                </div>
              ` : '<div class="empty-state"><p>No upcoming holidays</p></div>'}
            </div>
          </div>
          <div class="panel">
            <div class="panel-header"><h3>Upcoming Birthdays</h3></div>
            <div class="panel-body" style="padding:0">
              ${birthdays.length === 0 ? '<div class="empty-state"><p>No upcoming birthdays this month</p></div>' : `
                <ul class="birthday-list">
                  ${birthdays.map(b => `
                    <li class="birthday-item">
                      <span class="birthday-icon">🎂</span>
                      <div>
                        <strong>${b.name}${b.daysUntil === 0 && b.age ? ` (${b.age})` : ''}</strong>
                        <span class="birthday-meta">${b.label} · ${b.daysUntil === 0 ? 'Today! 🎈' : `in ${b.daysUntil} day${b.daysUntil > 1 ? 's' : ''}`}</span>
                      </div>
                    </li>
                  `).join('')}
                </ul>`}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderLeave(user, subPage) {
    if (subPage === 'approval') {
      return renderLeaveApprovals(user);
    }
    return renderApplyLeave(user);
  }

  function renderApplyLeave(user) {
    const balances = Store.computeLeaveBalance(user.employeeId);
    const leaves = Store.getLeaves().filter(l => Store.isOwnLeave(l, user));

    return `
      <div class="balance-pills">
        <div class="balance-pill sick-balance">
          <span class="dot dot-sick"></span>
          <div>
            <strong>Sick Leave</strong>
            <span class="balance-fraction">${balances.sick.remaining}/${balances.sick.total}</span>
            <span class="balance-used">${balances.sick.used} day(s) used</span>
          </div>
        </div>
        <div class="balance-pill annual-balance">
          <span class="dot dot-annual"></span>
          <div>
            <strong>Annual Leave</strong>
            <span class="balance-fraction">${balances.annual.remaining}/${balances.annual.total}</span>
            <span class="balance-used">${balances.annual.used} day(s) used</span>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h3>My Leave Requests</h3>
          <button class="btn btn-primary btn-sm" id="btn-apply-leave" type="button">+ New Request</button>
        </div>
        <div class="panel-body">
          ${leaves.length === 0 ? `<div class="empty-state"><p>You have not applied for any leave yet.</p></div>` : `
            <div class="leave-grid">
              ${leaves.map(l => `
                <div class="leave-card">
                  <div class="leave-card-header">
                    ${leaveTypeBadge(l.leaveType)}
                    ${statusBadge(l.status)}
                  </div>
                  <div class="leave-card-dates">${formatDate(l.fromDate)} – ${formatDate(l.toDate)} (${l.numberOfDays} day${l.numberOfDays > 1 ? 's' : ''})</div>
                  <div class="leave-card-reason">${l.reason}</div>
                  ${l.documents?.length ? `<div class="doc-download-list" style="margin-top:0.5rem">
                    ${l.documents.map((doc, i) => {
      const name = typeof doc === 'string' ? doc.split('/').pop() : `Doc ${i + 1}`;
      return `<button class="btn btn-secondary btn-sm doc-download-btn" type="button" data-download-leave-doc="${l.id}" data-doc-index="${i}">📥 ${name}</button>`;
    }).join('')}
                  </div>` : ''}
                  <div class="approval-section">
                    <p class="approval-title">Approval Stages</p>
                    ${renderApprovalBoxes(l.approvals)}
                  </div>
                  <div class="leave-card-actions">
                    ${l.status === 'Pending' ? `<button class="btn btn-danger btn-sm" data-delete-leave="${l.id}" type="button">Delete</button>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>`}
        </div>
      </div>`;
  }

  function renderLeaveApprovals(user) {
    const roleKey = Store.roleToApprovalKey(user.role);
    const leaves = Store.getLeaves()
      .filter(l => Store.isLeaveActive(l) && l.status === 'Pending')
      .filter(l => !Store.isOwnLeave(l, user))
      .filter(l => {
        if (!roleKey) return false;
        return Store.normalizeApprovals(l.approvals)[roleKey] !== 'N/A';
      });

    return `
      <div class="panel">
        <div class="panel-header">
          <h3>Pending Approvals</h3>
          
        </div>
        <div class="panel-body">
          ${leaves.length === 0 ? '<div class="empty-state"><p>No leave requests awaiting approval.</p></div>' : `
            <div class="leave-grid">
              ${leaves.map(l => {
      const canAct = roleKey && Store.canApproveAtStep(l.approvals, roleKey, l);
      const waiting = roleKey && !canAct && Store.normalizeApprovals(l.approvals)[roleKey] === 'Pending';
      const initials = (l.employeeName || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      return `
                <div class="leave-card leave-card-approval">
                  <div class="leave-card-employee">
                    <span class="leave-employee-avatar">${initials}</span>
                    <div>
                      <div class="leave-employee-name">${l.employeeName || 'Unknown Employee'}</div>
                    </div>
                  </div>
                  <div class="leave-card-header">
                    ${leaveTypeBadge(l.leaveType)}
                    ${statusBadge(l.status)}
                  </div>
                  <div class="leave-card-dates">${formatDate(l.fromDate)} – ${formatDate(l.toDate)} (${l.numberOfDays} day${l.numberOfDays > 1 ? 's' : ''})</div>
                  <div class="leave-card-reason">${l.reason}</div>
                  ${l.documents?.length ? `<div class="doc-download-list" style="margin-top:0.5rem">
                    ${l.documents.map((doc, i) => {
        const name = typeof doc === 'string' ? doc.split('/').pop() : `Doc ${i + 1}`;
        return `<button class="btn btn-secondary btn-sm doc-download-btn" type="button" data-download-leave-doc="${l.id}" data-doc-index="${i}">📥 ${name}</button>`;
      }).join('')}
                  </div>` : ''}
                  <div class="approval-section">
                    <p class="approval-title">Approval Stages</p>
                    ${renderApprovalBoxes(l.approvals)}
                  </div>
                  <div class="leave-card-actions">
                    ${canAct ? `
                      <button class="btn btn-success btn-sm" data-approve-step="${l.id}" type="button">Approve</button>
                      <button class="btn btn-danger btn-sm" data-reject-step="${l.id}" type="button">Reject</button>
                    ` : waiting ? '<span class="text-muted">Awaiting prior approval</span>' : '<span class="text-muted">No action required</span>'}
                  </div>
                </div>`;
    }).join('')}
            </div>`}
        </div>
      </div>`;
  }

  function renderSeparation(user, subPage) {
    if (subPage === 'approvals') {
      return renderSeparationApprovals(user);
    }
    if (subPage === 'exit') {
      return renderSeparationExit(user);
    }
    if (subPage === 'analytics') {
      return renderSeparationAnalytics();
    }
    return renderMySeparation(user);
  }

  function separationCard(sep, actionsHtml = '') {
    const notice = sep.noticePeriodDays ?? '';
    const user = Store.getUser();
    const canEditLastDay = user
      && ['admin', 'hr_manager'].includes(effectiveRole(user.role))
      && !['Completed', 'Withdrawn', 'Rejected'].includes(sep.status);
    return `
      <div class="leave-card separation-card">
        <div class="leave-card-header">
          <div>
            <div class="leave-card-type">${sep.employeeName || sep.employeeId}</div>
            <div class="leave-employee-id">${sep.employeeId || ''}${sep.department ? ` · ${sep.department}` : ''}</div>
          </div>
          ${separationStatusBadge(sep.status)}
        </div>
        <div class="leave-card-dates">${formatDate(sep.resignationDate)} - ${formatDate(sep.lastWorkingDay)}${notice !== '' ? ` · ${notice} notice day(s)` : ''}</div>
        <div class="leave-card-reason">${sep.reason || sep.exitReasonCategory || 'No reason provided'}</div>
        <div class="approval-section">
          <p class="approval-title">Approval Stages</p>
          ${renderSeparationApprovalBoxes(sep.approvals)}
        </div>
        ${['Approved', 'In_Exit', 'Completed'].includes(sep.status) ? `
        <div class="approval-section">
          <p class="approval-title">Exit Workflow</p>
          ${renderExitSteps(sep)}
        </div>` : ''}
        ${sep.managerReview?.retentionOffered ? `<div class="doc-tag">Retention: ${sep.managerReview.retentionResponse || 'pending'}</div>` : ''}
        ${sep.documents?.length ? `<div class="doc-download-list">${sep.documents.map((doc, i) => {
      const name = typeof doc === 'string' ? doc.split('/').pop() : `Document ${i + 1}`;
      return `<button class="btn btn-secondary btn-sm doc-download-btn" type="button" data-download-sep-doc="${sep.id}" data-doc-index="${i}">${name}</button>`;
    }).join('')}</div>` : ''}
        <div class="leave-card-actions">
          ${canEditLastDay ? `<button class="btn btn-secondary btn-sm" data-edit-sep-last-day="${sep.id}" type="button">Edit Last Day</button>` : ''}
          ${actionsHtml}
        </div>
      </div>`;
  }

  function renderMySeparation(user) {
    const mine = Store.getSeparations().filter(s => Store.isOwnSeparation(s, user));
    return `
      <div class="panel">
        <div class="panel-header">
          <h3>My Separation</h3>
          ${canAccess(user, 'separation.submit') ? '<button class="btn btn-primary btn-sm" id="btn-new-separation" type="button">New Resignation</button>' : ''}
        </div>
        <div class="panel-body">
          ${mine.length === 0 ? '<div class="empty-state"><p>No separation request submitted.</p></div>' : `
            <div class="leave-grid">
              ${mine.map(s => {
      console.log(s.name, s.status);
      return separationCard(s, `
                ${s.status === 'Retention'
          ? `<button class="btn btn-success btn-sm" data-retention-accept="${s.id}" type="button">Accept Retention</button>
       <button class="btn btn-danger btn-sm" data-retention-decline="${s.id}" type="button">Decline</button>`
          : ''}

${!['Withdrawn', 'Rejected', 'Completed'].includes(s.status)
          ? `<button class="btn btn-danger btn-sm" data-withdraw-separation="${s.id}" type="button">Withdraw</button>`
          : ''}

${['Approved', 'In_Exit', 'Completed'].includes(s.status)
          ? `<button class="btn btn-secondary btn-sm" data-generate-sep-doc="${s.id}" data-doc-type="resignation-acceptance" type="button">Acceptance</button>
       <button class="btn btn-secondary btn-sm" data-generate-sep-doc="${s.id}" data-doc-type="relieving-letter" type="button">Relieving</button>
       <button class="btn btn-secondary btn-sm" data-generate-sep-doc="${s.id}" data-doc-type="experience-letter" type="button">Experience</button>`
          : ''} `);
    }).join('')}
            </div>`}
        </div>  
      </div>`;
  }

  function renderSeparationApprovals(user) {
    const rows = Store.getSeparations()
      .filter(s => !Store.isOwnSeparation(s, user))
      .filter(s => {
        const approvals = Store.normalizeSeparationApprovals(s.approvals);
        const canManagerReview = canAccess(user, 'separation.manager_review') &&
          approvals.reporting_manager === 'Pending' &&
          !['Withdrawn', 'Rejected', 'Completed'].includes(s.status) &&
          (s.managerReview?.status || 'Pending') === 'Pending';
        return canManagerReview || Store.canUserApproveSeparation(user, s);
      });
    return `
      <div class="panel">
        <div class="panel-header"><h3>Separation Approvals</h3></div>
        <div class="panel-body">
          ${rows.length === 0 ? '<div class="empty-state"><p>No separation requests awaiting action.</p></div>' : `
            <div class="leave-grid">
              ${rows.map(s => {
      const canManagerReview = canAccess(user, 'separation.manager_review') && Store.normalizeSeparationApprovals(s.approvals).reporting_manager === 'Pending';
      const canAct = Store.canUserApproveSeparation(user, s);
      return separationCard(s, `
                  ${canManagerReview ? `<button class="btn btn-secondary btn-sm" data-manager-review="${s.id}" type="button">Manager Review</button>` : ''}
                  ${canAct ? `<button class="btn btn-success btn-sm" data-approve-separation="${s.id}" type="button">Approve</button><button class="btn btn-danger btn-sm" data-reject-separation="${s.id}" type="button">Reject</button>` : ''}
                `);
    }).join('')}
            </div>`}
        </div>
      </div>`;
  }

  function renderSeparationExit(user) {
    const rows = Store.getSeparations().filter(s => ['Approved', 'In_Exit', 'Completed'].includes(s.status));
    return `
      <div class="panel">
        <div class="panel-header"><h3>Exit Workflow & Clearance</h3></div>
        <div class="panel-body">
          ${rows.length === 0 ? '<div class="empty-state"><p>No approved exits in workflow.</p></div>' : `
            <div class="leave-grid">
              ${rows.map(s => {
      return separationCard(s, `
                <button class="btn btn-secondary btn-sm" data-upload-sep-doc="${s.id}" type="button">Upload Docs</button>
                <button class="btn btn-secondary btn-sm" data-generate-sep-doc="${s.id}" data-doc-type="settlement-statement" type="button">Settlement</button>
              `);
    }).join('')}
            </div>`}
        </div>
      </div>`;
  }

  function renderSeparationAnalytics() {
    const a = Store.getSeparationAnalytics() || {};
    const trend = a.monthlyTrend || [];
    const departments = a.byDepartment || [];
    const reasons = a.byReason || [];
    return `
      <div class="stats-grid">
        <div class="stat-card accent-red"><div class="label">Attrition Rate</div><div class="value">${a.attritionRate ?? 0}%</div><div class="change">${a.inactiveEmployees ?? 0} inactive</div></div>
        <div class="stat-card accent-blue"><div class="label">In Progress</div><div class="value">${a.inProgressSeparations ?? 0}</div></div>
        <div class="stat-card accent-green"><div class="label">Completed Exits</div><div class="value">${a.completedSeparations ?? 0}</div></div>
        <div class="stat-card accent-amber"><div class="label">Retention Success</div><div class="value">${a.retentionOfferRate ?? 0}%</div></div>
      </div>
      <div class="dashboard-panels">
        <div class="panel"><div class="panel-header"><h3>Monthly Attrition</h3></div><div class="panel-body"><div class="chart-bars chart-bars-tall">
          ${trend.length ? trend.map(t => `<div class="chart-bar-wrap"><span class="chart-bar-value">${t.value}</span><div class="chart-bar-track"><div class="chart-bar" style="height:${Math.max(8, Number(t.value) * 22)}%"></div></div><span>${t.label}</span></div>`).join('') : '<div class="empty-state"><p>No completed exits yet.</p></div>'}
        </div></div></div>
        <div class="dashboard-side-panels">
          <div class="panel"><div class="panel-header"><h3>By Department</h3></div><div class="panel-body">${departments.length ? departments.map(d => `<div class="detail-list-item"><strong>${d.name}</strong> · ${d.count}</div>`).join('') : '<div class="empty-state"><p>No data</p></div>'}</div></div>
          <div class="panel"><div class="panel-header"><h3>By Reason</h3></div><div class="panel-body">${reasons.length ? reasons.map(r => `<div class="detail-list-item"><strong>${r.name}</strong> · ${r.count}</div>`).join('') : '<div class="empty-state"><p>No data</p></div>'}</div></div>
        </div>
      </div>`;
  }
  function renderPayroll(user, subPage) {
    const role = effectiveRole(user.role);
    const targetSub = subPage || getDefaultSub('payroll', user);

    if (targetSub === 'list') {
      if (!canAccess(user, 'payroll.list')) {
        return `<div class="locked-panel"><div class="locked-icon">🔒</div><h3>Payroll List Locked</h3><p>Only HR and Admin can view the full payroll list.</p></div>`;
      }
      return renderPayrollList(user);
    }
    if (targetSub === 'tax-form') {
      return renderTaxForms(user);
    }
    return renderDownloadPayslip(user);
  }

  function renderTaxForms(user) {
    const role = effectiveRole(user.role);
    const isPrivileged = role === 'ca' || role === 'admin';
    const taxForms = Store.getTaxForms().filter(f => isPrivileged || Store.sameEmployeeId(f.employeeId, user.employeeId));

    return `
      <div class="panel">
        <div class="panel-header">
          <h3>Tax Forms & Declarations</h3>
          <div class="header-actions">
            ${isPrivileged ? '<button class="btn btn-primary btn-sm" id="btn-upload-form16">+ Upload Form 16</button>' : ''}
            ${role === 'employee' ? '<button class="btn btn-primary btn-sm" id="btn-upload-tax-decl">+ Upload Tax Declaration</button>' : ''}
          </div>
        </div>
        <div class="panel-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Financial Year</th><th>Document Type</th>${isPrivileged ? '<th>Employee</th>' : ''}<th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${taxForms.length === 0 ? `<tr><td colspan="${isPrivileged ? 5 : 4}" style="text-align:center;padding:2rem;color:var(--text-muted)">No tax documents available</td></tr>` :
        taxForms.map(f => `
                <tr>
                  <td>${f.financialYear}</td>
                  <td>${f.documentType}</td>
                  ${isPrivileged ? `<td><strong>${f.employeeName}</strong></td>` : ''}
                  <td><span class="badge ${f.status === 'Available' || f.status === 'Approved' ? 'badge-approved' : 'badge-pending'}">${f.status}</span></td>
                  <td><button class="btn btn-primary btn-sm" data-download-tax-form="${f.id}" type="button">Download</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderDownloadPayslip(user) {
    let payrolls = Store.getPayrolls().filter(p =>
      (canAccess(user, 'payroll.list') || Store.sameEmployeeId(p.employeeId, user.employeeId)) &&
      p.type === 'payslip'
    );

    // For non-admin/HR/CA, limit to last 6 months based on payroll month
    if (!canAccess(user, 'payroll.list')) {
      const parseMonth = (mStr) => {
        const [m, y] = mStr.split(' ');
        const idx = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(m);
        return new Date(parseInt(y), idx, 1);
      };

      payrolls = payrolls
        .sort((a, b) => parseMonth(b.month) - parseMonth(a.month))
        .slice(0, 6);
    }

    return `
      <div class="panel">
        <div class="panel-header"><h3>Download Payslip</h3></div>
        <div class="panel-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Month</th><th>Gross (₹)</th><th>Net (₹)</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${payrolls.length === 0 ? '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted)">No payslips available</td></tr>' :
        payrolls.map(p => `
                <tr>
                  <td><strong>${p.month}</strong></td>
                  <td>${formatRupee(p.gross)}</td>
                  <td>${formatRupee(p.net)}</td>
                  <td><span class="badge ${p.status === 'Paid' ? 'badge-approved' : 'badge-pending'}">${p.status}</span></td>
                  <td><button class="btn btn-primary btn-sm" data-download-payslip="${p.id}" type="button">Download PDF</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderPayrollList(user) {
    const payrolls = Store.getPayrolls().filter(p => p.type === 'payslip');
    const isCA = effectiveRole(user?.role) === 'ca';
    return `
      <div class="panel">
        <div class="panel-header">
          <h3>Payroll List</h3>
          <button class="btn btn-primary btn-sm" type="button" id="btn-process-payroll">+ ${isCA ? 'Upload Payslip' : 'Process Payroll'}</button>
        </div>
        <div class="panel-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Employee</th><th>Month</th><th>Gross (₹)</th><th>Net (₹)</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${payrolls.map(p => `
                <tr>
                  <td><strong>${p.employeeName}</strong></td>
                  <td>${p.month}</td>
                  <td>${formatRupee(p.gross)}</td>
                  <td>${formatRupee(p.net)}</td>
                  <td><span class="badge ${p.status === 'Paid' ? 'badge-approved' : 'badge-pending'}">${p.status}</span></td>
                  <td><button class="btn btn-primary btn-sm" data-download-payslip="${p.id}" type="button">Download</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderGrievance(user) {
    const role = effectiveRole(user.role);
    const isHr = canAccess(user, 'grievance.manage');
    const grievances = isHr ? Store.getGrievances() : Store.getGrievances().filter(g => Store.sameEmployeeId(g.employeeId, user.employeeId));

    return `
      <div class="panel">
        <div class="panel-header">
          <h3>${isHr ? 'Grievance Management' : 'My Grievances'}</h3>
          ${!isHr ? '<button class="btn btn-primary btn-sm" id="btn-raise-grievance" type="button">+ Raise Grievance</button>' : ''}
        </div>
        <div class="panel-body" style="padding:0">
          <table class="data-table">
            <thead><tr>
              <th>Grievance ID</th>
              ${isHr ? '<th>Employee</th>' : ''}
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Action</th>
            </tr></thead>
            <tbody>
              ${grievances.length === 0 ? `<tr><td colspan="${isHr ? 7 : 6}" style="text-align:center;padding:2rem;color:var(--text-muted)">${isHr ? 'No grievances submitted.' : 'You have not raised any grievance yet.'}</td></tr>` : grievances.map(g => {
                const grievanceId = g.id || g._id;
                const displayNumber = g.grievanceNumber || grievanceId;
                return `
                <tr>
                  <td><strong>${displayNumber || '—'}</strong></td>
                  ${isHr ? `<td>${g.employeeName || g.employeeId || '—'}</td>` : ''}
                  <td>${g.category}</td>
                  <td><span class="badge ${g.priority === 'Critical' ? 'badge-rejected' : g.priority === 'High' ? 'badge-pending' : 'badge-approved'}">${g.priority}</span></td>
                  <td><span class="badge ${g.status === 'Resolved' || g.status === 'Closed' ? 'badge-approved' : g.status === 'Submitted' ? 'badge-pending' : 'badge-rejected'}">${g.status}</span></td>
                  <td>${formatDate(g.createdAt || g.submittedOn)}</td>
                  <td><button class="btn btn-secondary btn-sm" data-view-grievance="${grievanceId || ''}" type="button">View</button></td>
                </tr>
              `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderRecruitment(user, subPage) {
    if (subPage === 'pipeline') {
      if (!canAccess(user, 'recruitment.pipeline')) {
        return `<div class="locked-panel"><div class="locked-icon">🔒</div><h3>Recruitment Locked</h3><p>Only HR can access candidate recruitment and tracking.</p></div>`;
      }
      return renderRecruitmentPipeline();
    }
    if (subPage === 'referrals') {
      return renderMyReferrals(user);
    }
    return renderJobPostings(user);
  }

  function renderMyReferrals(user) {
    const myReferrals = Store.getCandidates().filter(c => 
      c.referredBy && c.referredBy.toUpperCase().includes(`(${user.employeeId.toUpperCase()})`)
    );

    return `
      <div class="panel">
        <div class="panel-header">
          <h3>My Referrals</h3>
          <button class="btn btn-primary btn-sm" id="btn-add-referral" type="button">+ Add Referral</button>
        </div>
        <div class="panel-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Candidate Name</th><th>Position</th><th>Status</th><th>Submitted On</th><th>Resume</th></tr></thead>
            <tbody>
              ${myReferrals.length === 0 ? '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted)">You haven\'t referred anyone yet.</td></tr>' :
        myReferrals.map(c => `
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td>${c.job}</td>
                  <td><span class="badge badge-pending">${c.stage}</span></td>
                  <td>${formatDate(c.appliedOn)}</td>
                  <td>${c.resumePath ? `<button class="btn btn-secondary btn-sm" data-download-resume="${c.id}">📥 View</button>` : '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderRecruitmentPipeline() {
    const candidates = Store.getCandidates();
    return `
      <div class="panel">
        <div class="panel-header">
          <h3>Recruitment — Candidate Tracking</h3>
          <button class="btn btn-primary btn-sm" id="btn-add-candidate" type="button">+ Add Candidate</button>
        </div>
        <div class="panel-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Name</th><th>Position</th><th>Stage</th><th>Applied</th><th>Resume</th></tr></thead>
            <tbody>
              ${candidates.map(c => `
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td>${c.job}</td>
                  <td><span class="badge badge-pending">${c.stage}</span></td>
                  <td>${formatDate(c.appliedOn)}</td>
                  <td>
                    ${c.resumePath ? `<button class="btn btn-secondary btn-sm" data-download-resume="${c.id}">📥 Download</button>` : '—'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderJobPostings(user) {
    const jobs = Store.getJobs();
    const role = effectiveRole(user.role);
    const canPost = canAccess(user, 'recruitment.post') || role === 'admin';
    const canManage = role === 'admin' || role === 'hr_manager';

    return `
      <div class="panel">
        <div class="panel-header">
          <h3>Job Postings</h3>
          ${canPost ? '<button class="btn btn-primary btn-sm" id="btn-post-job" type="button">+ Post Job</button>' : ''}
        </div>
        <div class="panel-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Title</th><th>Department</th><th>Status</th><th>Posted</th><th>Applicants</th><th>Action</th></tr></thead>
            <tbody>
              ${jobs.length === 0 ? '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted)">No job postings found</td></tr>' : 
              jobs.map(j => `
                <tr>
                  <td><strong>${j.title}</strong></td>
                  <td>${j.department}</td>
                  <td><span class="badge ${j.status === 'Open' ? 'badge-approved' : 'badge-rejected'}">${j.status}</span></td>
                  <td>${formatDate(j.postedOn)}</td>
                  <td>${j.applicants || 0}</td>
                  <td class="table-actions">
                    <button class="btn btn-secondary btn-sm" data-download-job="${j.id}" type="button">Download PDF</button>
                    ${canManage ? `
                      <button class="btn btn-secondary btn-sm" data-edit-job="${j.id}" type="button">Edit</button>
                      <button class="btn btn-danger btn-sm" data-delete-job="${j.id}" type="button">Delete</button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderEmployees(user) {
    const employees = Store.getEmployees();
    const total = employees.length;
    const inactiveCount = employees.filter(e => e.status === 'Inactive').length;
    const activeCount = total - inactiveCount;
    const attritionRate = total > 0 ? ((inactiveCount / total) * 100).toFixed(1) : '0.0';

    const canOnboard = canAccess(user, 'employees.onboard');
    const canView = canAccess(user, 'employees.view');
    const canEdit = canAccess(user, 'employees.edit');
    const colSpan = canView ? 8 : 7;

    return `
      <div style="margin-bottom: 1.5rem;">
        <div class="stat-card accent-red" style="width: fit-content; min-width: 280px;">
          <div class="label">Attrition Rate</div>
          <div class="value">${attritionRate}%</div>
          <div class="change">${inactiveCount} employee(s) have left</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <h3 style="margin: 0;">Employee Records</h3>
            <input type="search" id="search-employee" class="form-input" placeholder="Search employee..." style="width: 250px;" />
          </div>
          ${canOnboard ? '<button class="btn btn-primary btn-sm" id="btn-onboard" type="button">+ Onboard Employee</button>' : ''}
        </div>
        <div class="panel-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Join Date</th><th>BGV</th><th>Status</th>${canView ? '<th>Actions</th>' : ''}</tr></thead>
            <tbody id="employee-management-table">
              ${employees.length === 0 ? `<tr><td colspan="${colSpan}"><div class="empty-state"><p>No employees yet</p></div></td></tr>` : employees.map(e => `
                <tr>
                  <td><strong>${e.name}</strong></td>
                  <td>${e.officeMail || e.email}</td>
                  <td>${e.department}</td>
                  <td>${formatRoleName(e.role)}</td>
                  <td>${formatDate(e.joinDate)}</td>
                  <td>${e.bgv ? '<span class="badge badge-approved">Done</span>' : '<span class="badge badge-pending">Pending</span>'}</td>
                  <td><span class="badge badge-approved">${e.status}</span></td>
                  ${canView ? `<td class="table-actions">
                    <button class="btn btn-secondary btn-sm" type="button" data-view-employee="${e.id}">View</button>
                    ${canEdit ? `<button class="btn btn-secondary btn-sm" type="button" data-edit-employee="${e.id}">Edit</button>` : ''}
                  </td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function getPerfReviewType(record) {
    if (typeof PerformanceForms !== 'undefined' && PerformanceForms.getReviewType) {
      return PerformanceForms.getReviewType(record);
    }
    if (record?.reviewType === 'appraisal') return 'appraisal';
    if ((record?.goal || '').toLowerCase().includes('appraisal')) return 'appraisal';
    return 'probation';
  }

  function renderPerformance(user, subPage) {
    const perfType = subPage || 'probation';
    const goals = Store.getPerformance().filter(g => getPerfReviewType(g) === perfType);
    const role = effectiveRole(user.role);

    const formatOverallRating = (st) => {
      const key = (st || '').toString().trim().toUpperCase();
      if (key === 'EXCEEDS EXPECTATIONS') return { label: 'Exceeds Expectations', cls: 'badge-approved' };
      if (key === 'MEETS EXPECTATIONS') return { label: 'Meets Expectations', cls: 'badge-approved' };
      if (key === 'NEEDS IMPROVEMENT') return { label: 'Needs Improvement', cls: 'badge-pending' };
      if (key === 'UNACCEPTABLE') return { label: 'Unacceptable', cls: 'badge-deleted' };
      return { label: st || 'In Progress', cls: 'badge-pending' };
    };
    
    if (!['admin', 'hr_manager', 'reporting_manager'].includes(role)) {
      return `<div class="locked-panel"><div class="locked-icon">🔒</div><h3>Access Restricted</h3><p>Performance reviews are only accessible by HR and Reporting Managers.</p></div>`;
    }

    const isHR = role === 'admin' || role === 'hr_manager';
    const isManager = role === 'reporting_manager';

    return `
      <div class="panel performance-hero" style="margin-bottom: 1.5rem;">
        <div class="panel-header">
          <h3>Performance Review Portal</h3>
          <div class="header-actions">
            ${(isManager || isHR) ? `<button class="btn btn-primary btn-sm" id="btn-add-performance" type="button">Add ${perfType === 'appraisal' ? 'Appraisal' : 'Probation'} Review</button>` : ''}
          </div>
        </div>
        
      </div>

      <div class="panel performance-records-panel">
        <div class="panel-header"><h3>${perfType === 'appraisal' ? 'Appraisal Records' : 'Probation Performance Records'}</h3></div>
        <div class="panel-body">
          ${goals.length === 0 ? `<div class="empty-state"><p>No ${perfType === 'appraisal' ? 'appraisal' : 'probation'} records yet.</p></div>` : `
            <div class="card-grid performance-card-grid">
              ${goals.map(g => {
                const rating = formatOverallRating(g.reviewStatus);
                const initials = (g.employeeName || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const comments = g.reviewNotes || g.evaluationForm?.overallComments || '';
                const probationMonths = g.evaluationForm?.reviewPeriod?.months
                  || (/\((\d+)\s*months?\)/i.exec(g.probationPeriod || '') || [])[1];
                const probationPeriodLabel = g.evaluationForm?.reviewPeriod?.from && g.evaluationForm?.reviewPeriod?.to
                  ? `${formatDate(g.evaluationForm.reviewPeriod.from)} - ${formatDate(g.evaluationForm.reviewPeriod.to)}${probationMonths ? ` (${probationMonths} months)` : ''}`
                  : (g.probationPeriod || '—');
                const appraisalYear = g.evaluationForm?.appraisalYear || g.probationPeriod || '—';
                return `
                <div class="info-card performance-card">
                  <div class="performance-card-top">
                    <div class="performance-card-identity">
                      <span class="performance-card-avatar">${initials}</span>
                      <div>
                        <h4 class="performance-card-name">${g.employeeName}</h4>
                        <span class="performance-card-id">${g.employeeId || '—'}</span>
                      </div>
                    </div>
                    <span class="badge performance-type-badge ${perfType === 'appraisal' ? 'badge-approved' : 'badge-pending'}">${perfType === 'appraisal' ? 'Appraisal' : 'Probation'}</span>
                  </div>
                  <div class="detail-grid performance-card-body">
                    <div class="detail-item"><span class="detail-label">${perfType === 'appraisal' ? 'Designation' : 'Job Title'}</span><span class="detail-value">${perfType === 'appraisal' ? (g.evaluationForm?.designation || '—') : (g.evaluationForm?.jobTitle || '—')}</span></div>
                    <div class="detail-item"><span class="detail-label">${perfType === 'appraisal' ? 'Appraisal Year' : 'Review Period'}</span><span class="detail-value">${perfType === 'appraisal' ? appraisalYear : probationPeriodLabel}</span></div>
                    ${perfType === 'appraisal' ? `<div class="detail-item"><span class="detail-label">Department</span><span class="detail-value">${g.evaluationForm?.department || '—'}</span></div>` : ''}
                    <div class="detail-item"><span class="detail-label">${perfType === 'appraisal' ? 'Score' : 'Overall Rating'}</span><span class="detail-value"><span class="badge ${rating.cls}">${rating.label}</span></span></div>
                    <div class="detail-item"><span class="detail-label">Reviewer</span><span class="detail-value">${g.reviewer || '—'}</span></div>
                    <div class="detail-item performance-card-comments"><span class="detail-label">Overall Comments</span><span class="detail-value">${comments || '—'}</span></div>
                  </div>
                  <div class="performance-card-actions">
                    <button class="btn btn-primary btn-sm" data-view-performance="${g.id}" type="button">View Review</button>
                    ${((isManager || isHR) ? `<button class="btn btn-secondary btn-sm" data-review-performance="${g.id}" type="button">Update Review</button>` : '')}
                  </div>
                </div>`;
              }).join('')}
            </div>
          `}
        </div>
      </div>

      ${(isManager || isHR) && goals.length > 0 ? `
      <div class="panel">
        <div class="panel-header" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1.5rem 1rem;">
          <h3 style="margin: 0 auto; width: 100%; text-align: center;">Employee Goals & Reviews</h3>
          <p class="form-hint" style="margin-top: 0.25rem;">Performance Assessment & Probation Tracking</p>
        </div>
        <div class="panel-body">
          <div class="card-grid">
            ${goals.map(g => `
              <div class="info-card">
                <h4 style="margin: 0;">${g.employeeName}</h4>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">ID: ${g.employeeId || '—'}</div>
                <p>${g.goal}</p>
                ${g.probationPeriod ? `<p style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--text-muted);"><strong>Probation:</strong> ${g.probationPeriod}</p>` : ''}
                <p style="margin-top:0.5rem;font-size:0.75rem;color:var(--text-muted)">Reviewer: ${g.reviewer}</p>
                <div class="table-actions" style="margin-top: 1rem; padding-top: 0.5rem; border-top: 1px solid var(--border);">
                  ${(g.reviewFilePath || g.reviewPath) ? `<button class="btn btn-secondary btn-sm" data-view-perf-review="${g.id}" type="button" style="width: 100%;">📥 Download Review PDF</button>` : '<p class="form-hint" style="text-align:center; width:100%;">No review file uploaded</p>'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>` : ''}`;
  }

  function renderReports() {
    const employees = Store.getEmployees();
    const leaves = Store.getLeaves();
    const jobs = Store.getJobs();

    const total = employees.length;
    const inactiveCount = employees.filter(e => e.status === 'Inactive').length;
    const attritionRate = total > 0 ? ((inactiveCount / total) * 100).toFixed(1) : '0.0';

    const bars = [
      { label: 'Jan', h: 60 }, { label: 'Feb', h: 75 }, { label: 'Mar', h: 55 },
      { label: 'Apr', h: 90 }, { label: 'May', h: 80 }, { label: 'Jun', h: 95 }
    ];
    return `
      <div class="stats-grid">
        <div class="stat-card accent-blue"><div class="label">Headcount</div><div class="value">${employees.length}</div></div>
        <div class="stat-card accent-amber"><div class="label">Leave Requests (YTD)</div><div class="value">${leaves.length}</div></div>
        <div class="stat-card accent-green"><div class="label">Open Positions</div><div class="value">${jobs.filter(j => j.status === 'Open').length}</div></div>
        <div class="stat-card accent-red"><div class="label">Attrition Rate</div><div class="value">${attritionRate}%</div></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>KPI / HR Reports</h3></div>
        <div class="panel-body">
          <div class="chart-bars">
            ${bars.map(b => `
              <div class="chart-bar-wrap">
                <div class="chart-bar" style="height:${b.h}%"></div>
                <span>${b.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
  }

  const PAGE_TITLES = {
    dashboard: 'Main Dashboard',
    leave: 'Leave Request',
    employees: 'Employees',
    recruitment: 'Recruitment',
    grievance: 'Grievance Management',
    timesheet: 'Timesheet',
    payroll: 'Payroll',
    performance: 'Performance',
    reports: 'Reports & Analytics',
    separation: 'Separation Management'
  };

  const DEFAULT_SUB = {
    leave: 'apply',
    payroll: 'payslip',
    recruitment: 'jobs',
    performance: 'probation',
    timesheet: 'mine',
    separation: 'my'
  };

  function canAccessPage(page, user) {
    if (!user) return false;
    const role = effectiveRole(user.role);
    const baseNav = ROLE_NAV[role] || ROLE_NAV.employee;
    if (!baseNav.some(item => item.id === page)) {
      return false;
    }
    if (page === 'employees') {
      return canAccess(user, 'employees.view');
    }
    if (page === 'performance') {
      return canAccess(user, 'performance.manage');
    }
    if (page === 'reports') {
      return role === 'admin';
    }
    const tabs = SUB_TABS[page];
    if (tabs) {
      return tabs.some(t => !subTabLocked(page, t.id, user));
    }
    return true;
  }

  /**
   * Return a sub-page that the user is actually authorized to access.
   * Falls back to the first available (non-locked) sub-tab, or the page default.
   */
  function getSafeSubPage(page, user) {
    const sub = getDefaultSub(page, user);
    const tabs = SUB_TABS[page];
    if (!tabs) return sub;
    const safeTabs = tabs.filter(t => !subTabLocked(page, t.id, user));
    if (safeTabs.length === 0) return '';
    if (safeTabs.some(t => t.id === sub)) return sub;
    return safeTabs[0].id;
  }
  function render(page, user, subPage) {
    const actualPage = canAccessPage(page, user) ? page : 'dashboard';
    const safeSp = subPage ? subPage : getSafeSubPage(actualPage, user);
    const sp = subTabLocked(actualPage, safeSp, user) ? getSafeSubPage(actualPage, user) : safeSp;
    // Store the resolved sub-page so navigate() keeps it
    const subTabs = ['leave', 'payroll', 'recruitment', 'separation', 'timesheet', 'performance'].includes(actualPage)
      ? renderSubTabs(actualPage, user, sp)
      : '';

    let content = '';
    switch (actualPage) {
      case 'dashboard': content = renderDashboard(user); break;
      case 'leave': content = renderLeave(user, sp); break;
      case 'employees': content = renderEmployees(user); break;
      case 'recruitment': content = renderRecruitment(user, sp); break;
      case 'grievance': content = renderGrievance(user); break;
      case 'timesheet': content = renderTimesheet(user, sp); break;
      case 'payroll': content = renderPayroll(user, sp); break;
      case 'performance': content = renderPerformance(user, sp); break;
      case 'separation': content = renderSeparation(user, sp); break;
      case 'reports': content = renderReports(); break;
      default: content = renderDashboard(user);
    }

    return subTabs + content;
  }

  return {
    icons, ROLE_NAV, PAGE_TITLES, DEFAULT_SUB, PERMS,
    render, canAccess, canAccessPage, getDefaultSub, getSafeSubPage, subTabLocked,
    isLeaveApprover, formatDate, formatRupee, formatRoleName, statusBadge, leaveTypeBadge, renderApprovalBoxes
  };
})();

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import { join, isAbsolute, basename } from 'path';
import * as fs from 'fs';
import { Separation } from './schemas/separation.schema';
import { Employee } from '../employees/schemas/employee.schema';
import { User } from '../auth/schemas/user.schema';
import { mapDoc, mapDocs } from '../common/map-id';
import {
  buildSeparationApprovals,
  CLEARANCE_ROLES,
  EXIT_STEP_LABELS,
  getActiveSeparationSteps,
  normalizeSeparationApprovals,
  roleToSeparationApprovalKey,
  SEPARATION_APPROVAL_LABELS,
  SeparationApprovalKey,
} from './separation-approvals';

const DEFAULT_EXIT_STEPS = () => ({
  knowledge_transfer: { status: 'Pending', topics: [] },
  it_clearance: { status: 'Pending' },
  hr_clearance: { status: 'Pending' },
  finance_clearance: { status: 'Pending' },
  admin_clearance: { status: 'Pending' },
  manager_clearance: { status: 'Pending' },
  exit_interview: { status: 'Pending', rehireEligible: true },
  final_settlement: { status: 'Pending', leaveEncashment: 0, gratuity: 0, pendingDues: 0, deductions: 0, netAmount: 0 },
  deactivation: { status: 'Pending' },
});

@Injectable()
export class SeparationsService {
  constructor(
    @InjectModel(Separation.name) private model: Model<Separation>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  private addNotification(sep: Separation, type: string, message: string, targetRole?: string) {
    const notifications = sep.notifications || [];
    notifications.push({ type, message, createdAt: new Date().toISOString(), targetRole, read: false });
    sep.notifications = notifications;
    sep.markModified('notifications');
  }

  private assertCanApprove(approvals: unknown, key: string) {
    const a = normalizeSeparationApprovals(approvals);
    const active = getActiveSeparationSteps(approvals);
    const idx = active.indexOf(key as SeparationApprovalKey);
    if (idx < 0) throw new BadRequestException('Invalid approver role');
    if (a[key as SeparationApprovalKey] !== 'Pending') {
      throw new BadRequestException('This approval step is already completed');
    }
    for (let i = 0; i < idx; i++) {
      const prev = active[i];
      if (a[prev] !== 'Approved') {
        throw new BadRequestException(`${SEPARATION_APPROVAL_LABELS[prev]} must approve before you can act`);
      }
    }
  }

  private canManageStep(role: string, stepKey: string) {
    const allowed = CLEARANCE_ROLES[stepKey] || [];
    return allowed.includes(role);
  }

  private assertExitStepAvailable(sep: Separation, exitSteps: Record<string, any>, stepKey: string) {
    const approvals = normalizeSeparationApprovals(sep.approvals);
    if (approvals.reporting_manager !== 'Approved') {
      throw new BadRequestException('Manager approval must be completed before the exit workflow starts');
    }

    const isDone = (key: string) => exitSteps[key]?.status === 'Completed';
    if (stepKey === 'knowledge_transfer') return;

    if (!isDone('knowledge_transfer')) {
      throw new BadRequestException('Knowledge Transfer must be completed before any other exit step');
    }

    if (stepKey === 'manager_clearance') return;

    if (!isDone('manager_clearance')) {
      throw new BadRequestException('Manager Clearance must be completed after Knowledge Transfer');
    }

    const clearanceSteps = ['it_clearance', 'hr_clearance', 'admin_clearance', 'finance_clearance', 'exit_interview'];
    if (clearanceSteps.includes(stepKey)) return;

    if (stepKey === 'final_settlement') {
      const pending = clearanceSteps.filter((key) => !isDone(key));
      if (pending.length) {
        throw new BadRequestException('Final Settlement can only be completed after all clearances and Exit Interview are completed');
      }
      return;
    }

    if (stepKey === 'deactivation' && !isDone('final_settlement')) {
      throw new BadRequestException('Employee Deactivation can only be completed after Final Settlement');
    }
  }

  private getApprovalKeyForActor(role: string, approvals: unknown, decision: string, sep: Separation) {
    const mapped = roleToSeparationApprovalKey(role);
    if (role !== 'admin') return mapped;

    const normalized = normalizeSeparationApprovals(approvals);
    const active = getActiveSeparationSteps(normalized);
    const nextPending = active.find((key, idx) => {
      if (normalized[key] !== 'Pending') return false;
      for (let i = 0; i < idx; i++) {
        if (normalized[active[i]] !== 'Approved') return false;
      }
      if (decision === 'Approved' && key === 'reporting_manager' && sep.managerReview?.status !== 'Approved') {
        return false;
      }
      return true;
    });

    return nextPending || mapped;
  }

  private normalizeDate(dateStr: string) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
    return d.toISOString().split('T')[0];
  }

  private computeNoticeDays(resignationDate: string, lastWorkingDay: string) {
    const start = new Date(resignationDate);
    const end = new Date(lastWorkingDay);
    const diff = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    return Math.max(0, diff);
  }

  private async getEmployeeContext(employeeId: string) {
    const emp = await this.employeeModel.findOne({
      employeeId: { $regex: new RegExp(`^${employeeId}$`, 'i') },
    }).lean().exec();
    return emp;
  }

  private async filterForUser(separations: any[], user: { role?: string; employeeId?: string; email?: string; name?: string }) {
    const role = String(user.role || 'employee').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (['admin', 'hr_manager', 'ca'].includes(role)) return separations;

    if (['reporting_manager', 'manager', 'project_manager'].includes(role)) {
      const allEmps = await this.employeeModel.find({ status: { $ne: 'Inactive' } }).select('employeeId supervisor').lean().exec();
      
      const eId = (user.employeeId || '').toLowerCase().trim();
      const uName = (user.name || '').toLowerCase().trim();
      
      const directReportIds = new Set(
        allEmps
          .filter(e => {
            if (!e.supervisor) return false;
            const sup = String(e.supervisor).toLowerCase().trim();
            if (eId && sup === eId) return true;
            if (uName && (sup === uName || uName.includes(sup) || sup.includes(uName))) return true;
            return false;
          })
          .map(e => String(e.employeeId || '').toUpperCase())
      );

      return separations.filter((s) => {
        const isOwn = this.isOwnSeparation(s, user);
        const isDirectReport = directReportIds.has(String(s.employeeId || '').toUpperCase());
        const needsManager = normalizeSeparationApprovals(s.approvals).reporting_manager !== 'N/A';
        const inExit = ['Approved', 'In_Exit', 'Completed'].includes(s.status);
        return isOwn || (isDirectReport && (needsManager || inExit));
      });
    }

    return separations.filter((s) => this.isOwnSeparation(s, user));
  }

  private isOwnSeparation(sep: any, user: { employeeId?: string; email?: string }) {
    const email = (sep.applicantEmail || '').toLowerCase().trim();
    const userEmail = (user.email || '').toLowerCase().trim();
    if (email && userEmail && email === userEmail) return true;
    return String(sep.employeeId || '').toUpperCase() === String(user.employeeId || '').toUpperCase();
  }

  private allExitStepsComplete(exitSteps: any) {
    const steps = exitSteps || DEFAULT_EXIT_STEPS();
    const required = Object.keys(EXIT_STEP_LABELS);
    return required.every((key) => steps[key]?.status === 'Completed');
  }

  private getPlainExitSteps(exitSteps: unknown) {
    if (!exitSteps) return DEFAULT_EXIT_STEPS();
    const obj = exitSteps as {
      toObject?: () => Record<string, any>;
      _doc?: Record<string, any>;
    };
    const plain = typeof obj.toObject === 'function'
      ? obj.toObject()
      : obj._doc && typeof obj._doc === 'object'
        ? { ...obj._doc }
        : JSON.parse(JSON.stringify(exitSteps));

    return Object.entries(DEFAULT_EXIT_STEPS()).reduce((acc, [key, defaultStep]) => {
      acc[key] = { ...defaultStep, ...(plain?.[key] || {}) };
      return acc;
    }, {} as Record<string, any>);
  }

  async findAll(user: { role?: string; employeeId?: string; email?: string; name?: string }) {
    const all = mapDocs(await this.model.find().sort({ createdAt: -1 }).exec());
    return this.filterForUser(all, user);
  }

  async findOne(id: string, user: { role?: string; employeeId?: string; email?: string; name?: string }) {
    const sep = await this.model.findById(id).exec();
    if (!sep) throw new NotFoundException('Separation request not found');
    const mapped = mapDoc(sep);
    const filtered = await this.filterForUser([mapped], user);
    if (!filtered.length) throw new ForbiddenException('Access denied');
    return mapped;
  }

  async create(
    data: any,
    files?: Express.Multer.File[],
    user?: { employeeId?: string; name?: string; email?: string; role?: string },
  ) {
    if (!user?.employeeId) throw new BadRequestException('Employee ID is required');

    const existing = await this.model.findOne({
      employeeId: { $regex: new RegExp(`^${user.employeeId}$`, 'i') },
      status: { $nin: ['Completed', 'Rejected', 'Withdrawn'] },
    }).exec();
    if (existing) {
      throw new BadRequestException('You already have an active separation request');
    }

    const emp = await this.getEmployeeContext(user.employeeId);
    if (emp?.status === 'Inactive') {
      throw new BadRequestException('Inactive employees cannot submit separation requests');
    }

    const resignationDate = this.normalizeDate(data.resignationDate);
    const lastWorkingDay = this.normalizeDate(data.lastWorkingDay);
    if (lastWorkingDay < resignationDate) {
      throw new BadRequestException('Last working day must be on or after resignation date');
    }

    const noticePeriodDays = data.noticePeriodDays
      ? Number(data.noticePeriodDays)
      : this.computeNoticeDays(resignationDate, lastWorkingDay);

    const docs = files?.map((f) => `uploads/separation-documents/${f.filename}`) || [];

    const sep = await this.model.create({
      employeeId: user.employeeId,
      employeeName: user.name || emp?.name || user.employeeId,
      applicantEmail: user.email?.toLowerCase?.(),
      department: emp?.department || data.department || '',
      designation: emp?.designation || data.designation || '',
      separationType: data.separationType || 'resignation',
      exitReasonCategory: data.exitReasonCategory,
      reason: data.reason,
      detailedComments: data.detailedComments,
      resignationDate,
      lastWorkingDay,
      noticePeriodDays,
      noticePeriodStart: resignationDate,
      noticePeriodEnd: lastWorkingDay,
      status: 'Pending',
      approvals: buildSeparationApprovals(),
      managerReview: { status: 'Pending', retentionOffered: false },
      exitSteps: DEFAULT_EXIT_STEPS(),
      documents: docs,
      generatedDocuments: [],
      rehireEligible: true,
      appliedOn: new Date().toISOString(),
      notifications: [{
        type: 'submitted',
        message: `Resignation submitted by ${user.name || user.employeeId}. Awaiting manager review.`,
        createdAt: new Date().toISOString(),
        targetRole: 'reporting_manager',
        read: false,
      }],
    });

    return mapDoc(sep);
  }

  async withdraw(id: string, user: { employeeId?: string; email?: string; name?: string }) {
    const sep = await this.model.findById(id);
    if (!sep) throw new NotFoundException('Separation request not found');
    if (!this.isOwnSeparation(sep, user)) throw new ForbiddenException('Only the applicant can withdraw');
    if (['Completed', 'Withdrawn', 'Rejected'].includes(sep.status)) {
      throw new BadRequestException('This request cannot be withdrawn');
    }

    // Build a partial $set update — never replace the entire document
    const $set: Record<string, any> = {};
    const $push: Record<string, any> = {};

    $set.status = 'Withdrawn';

    // Cancel pending approvals (individual fields so we don't replace the subdocument)
    const approvals = normalizeSeparationApprovals(sep.approvals);
    for (const key of Object.keys(approvals) as SeparationApprovalKey[]) {
      if (approvals[key] === 'Pending') {
        $set[`approvals.${key}`] = 'Cancelled';
      }
    }

    // Cancel pending/in-progress exit steps (per-field paths to preserve extraneous step data)
    const exitSteps = this.getPlainExitSteps(sep.exitSteps);
    for (const key of Object.keys(exitSteps)) {
      const step = exitSteps[key];
      if (step && (step.status === 'Pending' || step.status === 'In Progress')) {
        $set[`exitSteps.${key}.status`] = 'Cancelled';
        $set[`exitSteps.${key}.notes`] = step.notes
          ? `${step.notes}; Cancelled due to withdrawal`
          : 'Cancelled due to withdrawal';
      }
    }

    // Reject pending manager review
    if (sep.managerReview?.status === 'Pending') {
      $set['managerReview.status'] = 'Rejected';
      $set['managerReview.comments'] = 'Cancelled due to withdrawal';
      $set['managerReview.reviewedOn'] = new Date().toISOString();
    }

    // Push withdrawal notification
    $push.notifications = {
      type: 'withdrawn',
      message: `Separation request withdrawn by ${user.name || user.employeeId}`,
      createdAt: new Date().toISOString(),
      targetRole: 'hr_manager',
      read: false,
    };

    const updated = await this.model.findByIdAndUpdate(
      id,
      { $set, $push },
      { new: true },
    ).exec();

    if (!updated) throw new NotFoundException('Separation request not found');
    return mapDoc(updated);
  }

  async managerReview(
    id: string,
    body: { status: string; comments?: string; retentionOffered?: boolean | string; retentionNotes?: string },
    reviewer: { name?: string; role?: string },
  ) {
    const sep = await this.model.findById(id);
    if (!sep) throw new NotFoundException('Separation request not found');
    if (!['Pending', 'Manager_Review', 'Retention'].includes(sep.status)) {
      throw new BadRequestException('Manager review is not applicable at this stage');
    }

    const retentionOffered = body.retentionOffered === true || body.retentionOffered === 'true';
    sep.managerReview = {
      status: body.status,
      retentionOffered,
      retentionNotes: body.retentionNotes,
      retentionResponse: retentionOffered ? 'pending' : undefined,
      comments: body.comments,
      reviewedOn: new Date().toISOString(),
      reviewedBy: reviewer.name,
    };
    sep.markModified('managerReview');

    if (body.status === 'Rejected') {
      sep.status = 'Rejected';
      const approvals = normalizeSeparationApprovals(sep.approvals);
      approvals.reporting_manager = 'Rejected';
      sep.approvals = approvals;
      sep.markModified('approvals');
      this.addNotification(sep, 'rejected', `Resignation rejected by manager: ${body.comments || 'No comments'}`, 'employee');
    } else if (retentionOffered) {
      sep.status = 'Retention';
      this.addNotification(sep, 'retention', `Retention offer made by manager. Please respond.`, 'employee');
    } else {
      sep.status = 'Manager_Review';
      this.assertCanApprove(sep.approvals, 'reporting_manager');
      const approvals = { ...normalizeSeparationApprovals(sep.approvals), reporting_manager: 'Approved' };
      sep.approvals = approvals;
      sep.markModified('approvals');
      sep.status = 'Pending';
      this.addNotification(sep, 'manager_approved', 'Manager approved resignation. Awaiting HR approval.', 'hr_manager');
    }

    await sep.save();
    return mapDoc(sep);
  }

  async retentionResponse(id: string, accepted: boolean, user: { employeeId?: string; email?: string; name?: string }) {
    const sep = await this.model.findById(id);
    if (!sep) throw new NotFoundException('Separation request not found');
    if (!this.isOwnSeparation(sep, user)) throw new ForbiddenException('Only the applicant can respond');
    if (sep.status !== 'Retention') throw new BadRequestException('No retention offer pending');

    sep.managerReview.retentionResponse = accepted ? 'accepted' : 'declined';
    sep.markModified('managerReview');

    if (accepted) {
      sep.status = 'Withdrawn';
      const approvals = normalizeSeparationApprovals(sep.approvals);
      (Object.keys(approvals) as SeparationApprovalKey[]).forEach((key) => {
        if (approvals[key] === 'Pending') approvals[key] = 'Cancelled';
      });
      sep.approvals = approvals;
      sep.markModified('approvals');
      this.addNotification(sep, 'retention_accepted', 'Employee accepted retention offer. Separation withdrawn.', 'hr_manager');
    } else {
      sep.status = 'Pending';
      const approvals = { ...normalizeSeparationApprovals(sep.approvals), reporting_manager: 'Approved' };
      sep.approvals = approvals;
      sep.markModified('approvals');
      this.addNotification(sep, 'retention_declined', 'Employee declined retention. Proceeding with exit.', 'hr_manager');
    }

    await sep.save();
    return mapDoc(sep);
  }

  async approveStep(id: string, role: string, decision: string) {
    const sep = await this.model.findById(id);
    if (!sep) throw new NotFoundException('Separation request not found');
    if (['Withdrawn', 'Rejected', 'Completed'].includes(sep.status)) {
      throw new BadRequestException('This request is no longer active');
    }

    const key = this.getApprovalKeyForActor(role, sep.approvals, decision, sep);
    if (!key) throw new BadRequestException('Invalid approver role');

    if (key === 'reporting_manager' && sep.managerReview?.status !== 'Approved' && decision === 'Approved') {
      const mr = sep.managerReview || { status: 'Pending' };
      if (mr.status === 'Pending') {
        throw new BadRequestException('Manager must complete review before approval');
      }
    }

    this.assertCanApprove(sep.approvals, key);

    const approvals = { ...normalizeSeparationApprovals(sep.approvals), [key]: decision };
    const active = getActiveSeparationSteps(approvals);
    const allApproved = active.every((k) => approvals[k] === 'Approved');
    const anyRejected = active.some((k) => approvals[k] === 'Rejected');

    sep.approvals = approvals;
    sep.markModified('approvals');

    if (anyRejected) {
      sep.status = 'Rejected';
      this.addNotification(sep, 'rejected', `Separation rejected at ${SEPARATION_APPROVAL_LABELS[key]} stage`, 'employee');
    } else if (allApproved) {
      sep.status = 'In_Exit';
      this.addNotification(sep, 'approved', 'Separation approved. Exit process initiated.', 'employee');
    } else {
      sep.status = 'Pending';
      this.addNotification(sep, 'approval', `${SEPARATION_APPROVAL_LABELS[key]} ${decision.toLowerCase()}`, 'hr_manager');
    }

    await sep.save();
    return mapDoc(sep);
  }

  async updateLastWorkingDay(
    id: string,
    body: { lastWorkingDay?: string },
    actor: { name?: string; role?: string },
  ) {
    if (!['admin', 'hr_manager'].includes(actor.role || '')) {
      throw new ForbiddenException('Only HR or Admin can update the last working day');
    }

    const sep = await this.model.findById(id);
    if (!sep) throw new NotFoundException('Separation request not found');
    if (['Completed', 'Withdrawn', 'Rejected'].includes(sep.status)) {
      throw new BadRequestException('Last working day cannot be changed for this request');
    }

    const lastWorkingDay = this.normalizeDate(body.lastWorkingDay || '');
    const resignationDate = this.normalizeDate(sep.resignationDate);
    if (lastWorkingDay < resignationDate) {
      throw new BadRequestException('Last working day must be on or after resignation date');
    }

    sep.lastWorkingDay = lastWorkingDay;
    sep.noticePeriodEnd = lastWorkingDay;
    sep.noticePeriodDays = this.computeNoticeDays(resignationDate, lastWorkingDay);
    this.addNotification(
      sep,
      'notice_period',
      `Last working day updated to ${lastWorkingDay} by ${actor.name || 'HR'}`,
      'employee',
    );

    await sep.save();
    return mapDoc(sep);
  }

  async updateExitStep(
    id: string,
    stepKey: string,
    body: Record<string, unknown>,
    actor: { name?: string; role?: string },
  ) {
    if (!EXIT_STEP_LABELS[stepKey]) throw new BadRequestException('Invalid exit step');
    if (!this.canManageStep(actor.role || '', stepKey)) {
      throw new ForbiddenException('You do not have permission to update this step');
    }

    const sep = await this.model.findById(id);
    if (!sep) throw new NotFoundException('Separation request not found');
    if (!['Approved', 'In_Exit'].includes(sep.status)) {
      throw new BadRequestException('Exit steps can only be updated after approval');
    }

    const exitSteps = this.getPlainExitSteps(sep.exitSteps);
    this.assertExitStepAvailable(sep, exitSteps, stepKey);
    const current = { ...(exitSteps[stepKey] || { status: 'Pending' }), ...body };
    if (body.status === 'Completed') {
      current.completedOn = new Date().toISOString();
      current.completedBy = actor.name;
    }
    exitSteps[stepKey] = current;
    sep.exitSteps = exitSteps as any;
    sep.markModified('exitSteps');
    sep.status = 'In_Exit';

    this.addNotification(
      sep,
      'exit_step',
      `${EXIT_STEP_LABELS[stepKey]} updated to ${current.status}`,
      'hr_manager',
    );

    if (this.allExitStepsComplete(exitSteps)) {
      sep.status = 'Completed';
      sep.completedOn = new Date().toISOString();
      await this.deactivateEmployee(sep, actor);
      this.addNotification(sep, 'completed', 'Separation process completed. Employee deactivated.', 'admin');
    }

    await sep.save();
    return mapDoc(sep);
  }

  private async deactivateEmployee(sep: Separation, actor: { name?: string }) {
    const emp = await this.employeeModel.findOne({
      employeeId: { $regex: new RegExp(`^${sep.employeeId}$`, 'i') },
    }).exec();
    if (!emp) return;

    if (emp.status !== 'Separated') {
      emp.status = 'Separated';
      await emp.save();
      await this.userModel.updateOne(
        { employeeId: emp.employeeId, isActive: true },
        { $set: { isActive: false } },
      ).exec();
    }

    const exitSteps = this.getPlainExitSteps(sep.exitSteps);
    exitSteps.deactivation = {
      status: 'Completed',
      completedOn: new Date().toISOString(),
      completedBy: actor.name,
      notes: 'Auto-marked as separated on separation completion',
    };
    sep.exitSteps = exitSteps as any;
    sep.markModified('exitSteps');
  }

  async getAnalytics() {
    const [all, employees] = await Promise.all([
      this.model.find().lean().exec(),
      this.employeeModel.find().lean().exec(),
    ]);

    const total = employees.length;
    const inactive = employees.filter((e) => e.status === 'Inactive').length;
    const active = total - inactive;
    const completed = all.filter((s) => s.status === 'Completed');
    const inProgress = all.filter((s) => ['Pending', 'Manager_Review', 'Retention', 'In_Exit', 'Approved'].includes(s.status));
    const withdrawn = all.filter((s) => s.status === 'Withdrawn');
    const retentionOffers = all.filter((s) => s.managerReview?.retentionOffered);
    const retentionAccepted = retentionOffers.filter((s) => s.managerReview?.retentionResponse === 'accepted');

    const byMonth: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    const byReason: Record<string, number> = {};
    let totalNoticeDays = 0;

    for (const s of completed) {
      const month = (s.completedOn || s.appliedOn || '').slice(0, 7);
      if (month) byMonth[month] = (byMonth[month] || 0) + 1;
      const dept = s.department || 'Unknown';
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
      const reason = s.exitReasonCategory || 'other';
      byReason[reason] = (byReason[reason] || 0) + 1;
      totalNoticeDays += s.noticePeriodDays || 0;
    }

    const months = Object.keys(byMonth).sort();
    const chartData = months.slice(-6).map((m) => ({
      label: new Date(`${m}-01`).toLocaleDateString('en-GB', { month: 'short' }),
      value: byMonth[m],
    }));

    return {
      attritionRate: total > 0 ? Number(((inactive / total) * 100).toFixed(1)) : 0,
      activeEmployees: active,
      inactiveEmployees: inactive,
      totalSeparations: all.length,
      completedSeparations: completed.length,
      inProgressSeparations: inProgress.length,
      withdrawnSeparations: withdrawn.length,
      retentionOfferRate: retentionOffers.length > 0
        ? Number(((retentionAccepted.length / retentionOffers.length) * 100).toFixed(1))
        : 0,
      avgNoticePeriod: completed.length > 0 ? Math.round(totalNoticeDays / completed.length) : 0,
      byDepartment: Object.entries(byDepartment).map(([name, count]) => ({ name, count })),
      byReason: Object.entries(byReason).map(([name, count]) => ({ name, count })),
      monthlyTrend: chartData,
    };
  }

  async downloadDocument(id: string, index: number, res: Response) {
    const sep: any = await this.model.findById(id).lean();
    if (!sep) throw new NotFoundException('Separation request not found');

    const docs = sep.documents || [];
    const docPath = docs[index];
    if (!docPath) throw new NotFoundException('Document not found');

    const filePath = isAbsolute(docPath) ? docPath : join(process.cwd(), docPath);
    if (!fs.existsSync(filePath)) throw new NotFoundException('File not found on server');
    return res.download(filePath, basename(docPath) || 'document.pdf');
  }

  async uploadDocument(id: string, files: Express.Multer.File[]) {
    const sep = await this.model.findById(id);
    if (!sep) throw new NotFoundException('Separation request not found');

    const newDocs = files.map((f) => `uploads/separation-documents/${f.filename}`);
    sep.documents = [...(sep.documents || []), ...newDocs];
    sep.markModified('documents');
    await sep.save();
    return mapDoc(sep);
  }

  async generateDocument(id: string, docType: string, res: Response) {
    const sep: any = await this.model.findById(id).lean();
    if (!sep) throw new NotFoundException('Separation request not found');

    const emp = await this.getEmployeeContext(sep.employeeId);
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const lwd = sep.lastWorkingDay
      ? new Date(sep.lastWorkingDay).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
      : '—';

    let content = '';
    let filename = '';

    if (docType === 'relieving-letter') {
      filename = `relieving-letter-${sep.employeeId}.txt`;
      content = `SIMBIOTIK SOLUTIONS PVT LTD
Relieving Letter

Date: ${today}

To Whom It May Concern,

This is to certify that ${sep.employeeName} (Employee ID: ${sep.employeeId}), employed as ${sep.designation || emp?.designation || 'Employee'} in the ${sep.department || emp?.department || 'Organization'} department, has been relieved of their duties effective ${lwd}.

We wish them success in their future endeavors.

For Simbiotik Solutions Pvt Ltd
HR Department`;
    } else if (docType === 'experience-letter') {
      filename = `experience-letter-${sep.employeeId}.txt`;
      const joinDate = emp?.joinDate
        ? new Date(emp.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : '—';
      content = `SIMBIOTIK SOLUTIONS PVT LTD
Experience Letter

Date: ${today}

To Whom It May Concern,

This is to certify that ${sep.employeeName} (Employee ID: ${sep.employeeId}) was employed with Simbiotik Solutions Pvt Ltd as ${sep.designation || emp?.designation || 'Employee'} in the ${sep.department || emp?.department || 'Organization'} department from ${joinDate} to ${lwd}.

During their tenure, they demonstrated professionalism and contributed positively to the organization.

For Simbiotik Solutions Pvt Ltd
HR Department`;
    } else if (docType === 'resignation-acceptance') {
      filename = `resignation-acceptance-${sep.employeeId}.txt`;
      content = `SIMBIOTIK SOLUTIONS PVT LTD
Resignation Acceptance Letter

Date: ${today}

Dear ${sep.employeeName},

We acknowledge receipt of your resignation dated ${new Date(sep.resignationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}.

Your last working day will be ${lwd}. Please complete all exit formalities including knowledge transfer and department clearances before your departure.

We thank you for your contributions to Simbiotik Solutions.

For Simbiotik Solutions Pvt Ltd
HR Department`;
    } else if (docType === 'settlement-statement') {
      filename = `settlement-statement-${sep.employeeId}.txt`;
      const settlement = sep.exitSteps?.final_settlement || {};
      content = `SIMBIOTIK SOLUTIONS PVT LTD
Final Settlement Statement

Date: ${today}
Employee: ${sep.employeeName} (${sep.employeeId})

Leave Encashment: ₹${settlement.leaveEncashment || 0}
Gratuity: ₹${settlement.gratuity || 0}
Pending Dues: ₹${settlement.pendingDues || 0}
Deductions: ₹${settlement.deductions || 0}
Net Payable: ₹${settlement.netAmount || 0}

Status: ${settlement.status || 'Pending'}

For Simbiotik Solutions Pvt Ltd
Finance Department`;
    } else {
      throw new BadRequestException('Invalid document type');
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(content);
  }
}

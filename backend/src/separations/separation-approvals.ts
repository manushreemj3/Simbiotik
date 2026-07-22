const APPROVAL_ORDER = ['reporting_manager', 'hr', 'admin'] as const;

export type SeparationApprovalKey = typeof APPROVAL_ORDER[number];
export type SeparationApprovalMap = Record<SeparationApprovalKey, string>;

export function normalizeApplicantRole(role?: string) {
  if (role === 'manager') return 'reporting_manager';
  return role || 'employee';
}

export function buildSeparationApprovals(): SeparationApprovalMap {
  return {
    reporting_manager: 'Pending',
    hr: 'Pending',
    admin: 'N/A',
  };
}

export function toPlainApprovals(approvals: unknown): Record<string, string> {
  if (!approvals) return {};
  const obj = approvals as Record<string, unknown> & {
    toObject?: () => Record<string, string>;
    _doc?: Record<string, string>;
  };
  if (typeof obj.toObject === 'function') return obj.toObject();
  if (obj._doc && typeof obj._doc === 'object') return { ...obj._doc };
  return { ...(approvals as Record<string, string>) };
}

export function normalizeSeparationApprovals(approvals: unknown): SeparationApprovalMap {
  const plain = toPlainApprovals(approvals);
  return {
    reporting_manager: plain.reporting_manager ?? plain.manager ?? 'Pending',
    hr: plain.hr ?? 'Pending',
    admin: plain.admin ?? 'N/A',
  };
}

export function getActiveSeparationSteps(approvals: unknown) {
  const normalized = normalizeSeparationApprovals(approvals);
  return APPROVAL_ORDER.filter((key) => normalized[key] !== 'N/A');
}

export function roleToSeparationApprovalKey(role: string): SeparationApprovalKey | null {
  if (role === 'admin') return 'admin';
  if (role === 'hr_manager') return 'hr';
  if (role === 'reporting_manager' || role === 'manager' || role === 'project_manager') return 'reporting_manager';
  return null;
}

export const SEPARATION_APPROVAL_LABELS: Record<SeparationApprovalKey, string> = {
  reporting_manager: 'Reporting Manager',
  hr: 'HR',
  admin: 'Admin',
};

export const EXIT_STEP_LABELS: Record<string, string> = {
  knowledge_transfer: 'Knowledge Transfer',
  manager_clearance: 'Manager Clearance',
  it_clearance: 'IT Clearance',
  admin_clearance: 'Admin Clearance',
  hr_clearance: 'HR Clearance',
  finance_clearance: 'Finance Clearance',
  exit_interview: 'Exit Interview',
  final_settlement: 'Final Settlement',
  deactivation: 'Employee Deactivation',
};

export const CLEARANCE_ROLES: Record<string, string[]> = {
  knowledge_transfer: ['reporting_manager'],
  manager_clearance: ['reporting_manager'],
  it_clearance: ['hr_manager', 'admin'],
  admin_clearance: ['hr_manager', 'admin'],
  hr_clearance: ['hr_manager', 'admin'],
  finance_clearance: ['hr_manager', 'admin'],
  exit_interview: ['hr_manager', 'admin'],
  final_settlement: ['hr_manager', 'admin'],
  deactivation: ['hr_manager', 'admin'],
};

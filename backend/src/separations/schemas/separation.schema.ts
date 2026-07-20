import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const StepStatus = { type: String, default: 'Pending', enum: ['Pending', 'In Progress', 'Completed', 'N/A', 'Skipped', 'Cancelled'] };
const WorkflowStepSchemaDefinition = {
  status: StepStatus,
  completedOn: String,
  completedBy: String,
  notes: String,
};
const KnowledgeTransferStepSchemaDefinition = {
  ...WorkflowStepSchemaDefinition,
  assignedTo: String,
  topics: { type: [String], default: [] },
};
const ExitInterviewStepSchemaDefinition = {
  ...WorkflowStepSchemaDefinition,
  scheduledDate: String,
  conductedDate: String,
  interviewer: String,
  feedback: String,
  rating: Number,
  rehireEligible: Boolean,
};
const SettlementStepSchemaDefinition = {
  ...WorkflowStepSchemaDefinition,
  leaveEncashment: { type: Number, default: 0 },
  gratuity: { type: Number, default: 0 },
  pendingDues: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netAmount: { type: Number, default: 0 },
  processedOn: String,
  processedBy: String,
};
const ManagerReviewSchemaDefinition = {
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  retentionOffered: { type: Boolean, default: false },
  retentionNotes: String,
  retentionResponse: { type: String, enum: ['pending', 'accepted', 'declined'] },
  comments: String,
  reviewedOn: String,
  reviewedBy: String,
};
const NotificationSchemaDefinition = {
  type: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: String, required: true },
  targetRole: String,
  read: Boolean,
};

@Schema({ _id: false })
class WorkflowStep {
  @Prop(StepStatus) status: string;
  @Prop() completedOn?: string;
  @Prop() completedBy?: string;
  @Prop() notes?: string;
}

@Schema({ _id: false })
class KnowledgeTransferStep extends WorkflowStep {
  @Prop() assignedTo?: string;
  @Prop({ type: [String], default: [] }) topics?: string[];
}

@Schema({ _id: false })
class ExitInterviewStep extends WorkflowStep {
  @Prop() scheduledDate?: string;
  @Prop() conductedDate?: string;
  @Prop() interviewer?: string;
  @Prop() feedback?: string;
  @Prop() rating?: number;
  @Prop() rehireEligible?: boolean;
}

@Schema({ _id: false })
class SettlementStep extends WorkflowStep {
  @Prop({ default: 0 }) leaveEncashment?: number;
  @Prop({ default: 0 }) gratuity?: number;
  @Prop({ default: 0 }) pendingDues?: number;
  @Prop({ default: 0 }) deductions?: number;
  @Prop({ default: 0 }) netAmount?: number;
  @Prop() processedOn?: string;
  @Prop() processedBy?: string;
}

@Schema({ _id: false })
class ManagerReview {
  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] }) status: string;
  @Prop({ default: false }) retentionOffered: boolean;
  @Prop() retentionNotes?: string;
  @Prop({ enum: ['pending', 'accepted', 'declined'] }) retentionResponse?: string;
  @Prop() comments?: string;
  @Prop() reviewedOn?: string;
  @Prop() reviewedBy?: string;
}

@Schema({ _id: false })
class Notification {
  @Prop({ required: true }) type: string;
  @Prop({ required: true }) message: string;
  @Prop({ required: true }) createdAt: string;
  @Prop() targetRole?: string;
  @Prop() read?: boolean;
}

@Schema({ timestamps: true, collection: 'separations' })
export class Separation extends Document {
  @Prop({ required: true }) employeeId: string;
  @Prop({ required: true }) employeeName: string;
  @Prop() applicantEmail?: string;
  @Prop() department?: string;
  @Prop() designation?: string;
  @Prop({ required: true, enum: ['resignation', 'termination', 'retirement', 'contract_end'] }) separationType: string;
  @Prop({
    required: true,
    enum: ['better_opportunity', 'relocation', 'personal', 'health', 'compensation', 'culture', 'performance', 'other'],
  })
  exitReasonCategory: string;
  @Prop({ required: true }) reason: string;
  @Prop() detailedComments?: string;
  @Prop({ required: true }) resignationDate: string;
  @Prop({ required: true }) lastWorkingDay: string;
  @Prop({ default: 30 }) noticePeriodDays: number;
  @Prop() noticePeriodStart?: string;
  @Prop() noticePeriodEnd?: string;
  @Prop({
    default: 'Pending',
    enum: ['Pending', 'Manager_Review', 'Retention', 'Approved', 'Rejected', 'Withdrawn', 'In_Exit', 'Completed'],
  })
  status: string;
  @Prop({
    type: { reporting_manager: String, hr: String, admin: String },
    default: { reporting_manager: 'Pending', hr: 'Pending', admin: 'N/A' },
  })
  approvals: { reporting_manager: string; hr: string; admin: string };
  @Prop({ type: ManagerReviewSchemaDefinition, default: () => ({ status: 'Pending', retentionOffered: false }) })
  managerReview: ManagerReview;
  @Prop({
    type: {
      knowledge_transfer: KnowledgeTransferStepSchemaDefinition,
      it_clearance: WorkflowStepSchemaDefinition,
      hr_clearance: WorkflowStepSchemaDefinition,
      finance_clearance: WorkflowStepSchemaDefinition,
      admin_clearance: WorkflowStepSchemaDefinition,
      manager_clearance: WorkflowStepSchemaDefinition,
      exit_interview: ExitInterviewStepSchemaDefinition,
      final_settlement: SettlementStepSchemaDefinition,
      deactivation: WorkflowStepSchemaDefinition,
    },
    default: () => ({}),
  })
  exitSteps: {
    knowledge_transfer: KnowledgeTransferStep;
    it_clearance: WorkflowStep;
    hr_clearance: WorkflowStep;
    finance_clearance: WorkflowStep;
    admin_clearance: WorkflowStep;
    manager_clearance: WorkflowStep;
    exit_interview: ExitInterviewStep;
    final_settlement: SettlementStep;
    deactivation: WorkflowStep;
  };
  @Prop({ type: [String], default: [] }) documents: string[];
  @Prop({ type: [String], default: [] }) generatedDocuments: string[];
  @Prop({ default: true }) rehireEligible: boolean;
  @Prop() appliedOn: string;
  @Prop() completedOn?: string;
  @Prop({ type: [NotificationSchemaDefinition], default: [] }) notifications: Notification[];
}

export const SeparationSchema = SchemaFactory.createForClass(Separation);

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Employee, EmployeeSchema } from '../employees/schemas/employee.schema';
import { Leave, LeaveSchema } from '../leaves/schemas/leave.schema';
import { Separation, SeparationSchema } from '../separations/schemas/separation.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Employee.name, schema: EmployeeSchema },
    { name: Leave.name, schema: LeaveSchema },
    { name: Separation.name, schema: SeparationSchema },
  ])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

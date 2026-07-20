import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeparationsController } from './separations.controller';
import { SeparationsService } from './separations.service';
import { Separation, SeparationSchema } from './schemas/separation.schema';
import { Employee, EmployeeSchema } from '../employees/schemas/employee.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Separation.name, schema: SeparationSchema },
    { name: Employee.name, schema: EmployeeSchema },
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [SeparationsController],
  providers: [SeparationsService],
  exports: [SeparationsService],
})
export class SeparationsModule {}

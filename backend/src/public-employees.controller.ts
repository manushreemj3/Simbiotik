import { Controller, Get, ForbiddenException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployeesService } from './employees/employees.service';

@ApiTags('Public')
@Controller('public/employees')
export class PublicEmployeesController {
  constructor(private employees: EmployeesService) {}

  @Get()
  async findAll() {
    // Only allow in non-production environments to avoid exposing data unintentionally
    if ((process.env.NODE_ENV || '').toLowerCase() === 'production') {
      throw new ForbiddenException('Public employee listing is disabled in production');
    }
    return this.employees.findAll();
  }
}

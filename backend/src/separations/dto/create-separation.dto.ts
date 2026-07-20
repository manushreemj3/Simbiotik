import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSeparationDto {
  @IsEnum(['resignation', 'termination', 'retirement', 'contract_end'])
  separationType: string;

  @IsEnum(['better_opportunity', 'relocation', 'personal', 'health', 'compensation', 'culture', 'performance', 'other'])
  exitReasonCategory: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsString()
  detailedComments?: string;

  @IsString()
  @IsNotEmpty()
  resignationDate: string;

  @IsString()
  @IsNotEmpty()
  lastWorkingDay: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  noticePeriodDays?: number;
}

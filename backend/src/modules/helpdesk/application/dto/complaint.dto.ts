import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ComplaintType, ComplaintStatus, PriorityLevel } from '@prisma/client';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  complainantName: string;

  @IsString()
  @IsOptional()
  complainantContact?: string;

  @IsString()
  @IsOptional()
  complainantAddress?: string;

  @IsEnum(ComplaintType)
  complaintType: ComplaintType;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;
}

export class UpdateComplaintDto {
  @IsString()
  @IsOptional()
  complainantName?: string;

  @IsString()
  @IsOptional()
  complainantContact?: string;

  @IsString()
  @IsOptional()
  complainantAddress?: string;

  @IsEnum(ComplaintType)
  @IsOptional()
  complaintType?: ComplaintType;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsDateString()
  @IsOptional()
  assignedDate?: string;

  @IsDateString()
  @IsOptional()
  resolvedDate?: string;

  @IsString()
  @IsOptional()
  resolution?: string;
}

export class ComplaintQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(ComplaintType)
  @IsOptional()
  complaintType?: ComplaintType;

  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}

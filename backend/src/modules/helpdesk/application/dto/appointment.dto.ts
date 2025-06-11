import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { AppointmentType, AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @IsString()
  @IsNotEmpty()
  applicantContact: string;

  @IsString()
  @IsOptional()
  applicantEmail?: string;

  @IsString()
  @IsOptional()
  applicantAddress?: string;

  @IsEnum(AppointmentType)
  appointmentType: AppointmentType;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsDateString()
  preferredDate: string;

  @IsString()
  @IsNotEmpty()
  preferredTime: string;

  @IsString()
  @IsOptional()
  assignedOfficialId?: string;
}

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  applicantName?: string;

  @IsString()
  @IsOptional()
  applicantContact?: string;

  @IsString()
  @IsOptional()
  applicantEmail?: string;

  @IsString()
  @IsOptional()
  applicantAddress?: string;

  @IsEnum(AppointmentType)
  @IsOptional()
  appointmentType?: AppointmentType;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsDateString()
  @IsOptional()
  preferredDate?: string;

  @IsString()
  @IsOptional()
  preferredTime?: string;

  @IsString()
  @IsOptional()
  assignedOfficialId?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsDateString()
  @IsOptional()
  confirmedDate?: string;

  @IsString()
  @IsOptional()
  confirmedTime?: string;

  @IsString()
  @IsOptional()
  meetingNotes?: string;

  @IsString()
  @IsOptional()
  outcome?: string;

  @IsDateString()
  @IsOptional()
  completedDate?: string;
}

export class AppointmentQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(AppointmentType)
  @IsOptional()
  appointmentType?: AppointmentType;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsString()
  @IsOptional()
  assignedOfficialId?: string;

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

import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { IncidentType, BlotterStatus } from '@prisma/client';

export class CreateBlotterCaseDto {
  @IsString()
  @IsNotEmpty()
  complainantName: string;

  @IsString()
  @IsNotEmpty()
  complainantAddress: string;

  @IsString()
  @IsOptional()
  complainantContact?: string;

  @IsString()
  @IsNotEmpty()
  respondentName: string;

  @IsString()
  @IsOptional()
  respondentAddress?: string;

  @IsString()
  @IsOptional()
  respondentContact?: string;

  @IsEnum(IncidentType)
  incidentType: IncidentType;

  @IsDateString()
  incidentDate: string;

  @IsString()
  @IsNotEmpty()
  incidentLocation: string;

  @IsString()
  @IsNotEmpty()
  narrative: string;

  @IsString()
  @IsNotEmpty()
  receivingOfficer: string;

  @IsString()
  @IsOptional()
  investigatingOfficer?: string;
}

export class UpdateBlotterCaseDto {
  @IsString()
  @IsOptional()
  complainantName?: string;

  @IsString()
  @IsOptional()
  complainantAddress?: string;

  @IsString()
  @IsOptional()
  complainantContact?: string;

  @IsString()
  @IsOptional()
  respondentName?: string;

  @IsString()
  @IsOptional()
  respondentAddress?: string;

  @IsString()
  @IsOptional()
  respondentContact?: string;

  @IsEnum(IncidentType)
  @IsOptional()
  incidentType?: IncidentType;

  @IsDateString()
  @IsOptional()
  incidentDate?: string;

  @IsString()
  @IsOptional()
  incidentLocation?: string;

  @IsString()
  @IsOptional()
  narrative?: string;

  @IsEnum(BlotterStatus)
  @IsOptional()
  status?: BlotterStatus;

  @IsDateString()
  @IsOptional()
  mediationDate?: string;

  @IsString()
  @IsOptional()
  mediationResult?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isResolved?: boolean;

  @IsDateString()
  @IsOptional()
  resolutionDate?: string;

  @IsString()
  @IsOptional()
  resolution?: string;

  @IsString()
  @IsOptional()
  receivingOfficer?: string;

  @IsString()
  @IsOptional()
  investigatingOfficer?: string;
}

export class BlotterCaseQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(IncidentType)
  @IsOptional()
  incidentType?: IncidentType;

  @IsEnum(BlotterStatus)
  @IsOptional()
  status?: BlotterStatus;

  @IsString()
  @IsOptional()
  receivingOfficer?: string;

  @IsString()
  @IsOptional()
  investigatingOfficer?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isResolved?: boolean;

  @IsDateString()
  @IsOptional()
  incidentDateFrom?: string;

  @IsDateString()
  @IsOptional()
  incidentDateTo?: string;

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

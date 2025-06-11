import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { OfficialPosition, Committee, OfficialStatus } from '@prisma/client';

export class CreateBarangayOfficialDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsEnum(OfficialPosition)
  position: OfficialPosition;

  @IsEnum(Committee)
  @IsOptional()
  committee?: Committee;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsDateString()
  termStart: string;

  @IsDateString()
  termEnd: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  photo?: string;
}

export class UpdateBarangayOfficialDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsEnum(OfficialPosition)
  @IsOptional()
  position?: OfficialPosition;

  @IsEnum(Committee)
  @IsOptional()
  committee?: Committee;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsDateString()
  @IsOptional()
  termStart?: string;

  @IsDateString()
  @IsOptional()
  termEnd?: string;

  @IsEnum(OfficialStatus)
  @IsOptional()
  status?: OfficialStatus;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  photo?: string;
}

export class BarangayOfficialQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(OfficialPosition)
  @IsOptional()
  position?: OfficialPosition;

  @IsEnum(Committee)
  @IsOptional()
  committee?: Committee;

  @IsEnum(OfficialStatus)
  @IsOptional()
  status?: OfficialStatus;

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

import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean, IsDateString, IsInt, IsEnum, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender, CivilStatus } from '@prisma/client';

export class CreateResidentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  suffix?: string;

  @IsDateString()
  birthDate: string;

  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(CivilStatus)
  civilStatus: CivilStatus;

  @IsString()
  @IsOptional()
  religion?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  placeOfBirth?: string;

  // Address Information
  @IsString()
  @IsOptional()
  houseNumber?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  purok?: string;

  @IsString()
  @IsNotEmpty()
  completeAddress: string;

  // Contact Information
  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @IsString()
  @IsOptional()
  landlineNumber?: string;

  @IsEmail()
  @IsOptional()
  emailAddress?: string;

  // Family Information
  @IsString()
  @IsOptional()
  motherName?: string;

  @IsString()
  @IsOptional()
  fatherName?: string;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  emergencyContactNumber?: string;

  // Government IDs
  @IsString()
  @IsOptional()
  primaryIdType?: string;

  @IsString()
  @IsOptional()
  idNumber?: string;

  @IsString()
  @IsOptional()
  philsysNumber?: string;

  @IsString()
  @IsOptional()
  tin?: string;

  // Special Classifications
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  seniorCitizen?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  personWithDisability?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  soloParent?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  fourPsBeneficiary?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  indigent?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  ofw?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isHouseholdHead?: boolean;

  @IsString()
  @IsOptional()
  householdId?: string;
}

export class UpdateResidentDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  suffix?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  age?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(CivilStatus)
  @IsOptional()
  civilStatus?: CivilStatus;

  @IsString()
  @IsOptional()
  religion?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  placeOfBirth?: string;

  @IsString()
  @IsOptional()
  houseNumber?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  purok?: string;

  @IsString()
  @IsOptional()
  completeAddress?: string;

  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @IsString()
  @IsOptional()
  landlineNumber?: string;

  @IsEmail()
  @IsOptional()
  emailAddress?: string;

  @IsString()
  @IsOptional()
  motherName?: string;

  @IsString()
  @IsOptional()
  fatherName?: string;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  emergencyContactNumber?: string;

  @IsString()
  @IsOptional()
  primaryIdType?: string;

  @IsString()
  @IsOptional()
  idNumber?: string;

  @IsString()
  @IsOptional()
  philsysNumber?: string;

  @IsString()
  @IsOptional()
  tin?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  seniorCitizen?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  personWithDisability?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  soloParent?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  fourPsBeneficiary?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  indigent?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  ofw?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isHouseholdHead?: boolean;

  @IsString()
  @IsOptional()
  householdId?: string;
}

export class ResidentQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  civilStatus?: CivilStatus;

  @IsString()
  @IsOptional()
  purok?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  seniorCitizen?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  personWithDisability?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  fourPsBeneficiary?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isHouseholdHead?: boolean;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}

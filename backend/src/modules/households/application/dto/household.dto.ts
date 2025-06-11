import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDecimal, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { HouseType, OwnershipStatus } from '@prisma/client';

export class CreateHouseholdDto {
  @IsString()
  @IsOptional()
  householdType?: string;

  @IsString()
  @IsNotEmpty()
  barangay: string;

  @IsString()
  @IsOptional()
  streetSitio?: string;

  @IsString()
  @IsOptional()
  houseNumber?: string;

  @IsString()
  @IsNotEmpty()
  completeAddress: string;

  @IsString()
  @IsNotEmpty()
  headId: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  monthlyIncome?: number;

  @IsString()
  @IsOptional()
  primaryIncomeSource?: string;

  @IsEnum(HouseType)
  @IsOptional()
  houseType?: HouseType;

  @IsEnum(OwnershipStatus)
  @IsOptional()
  ownershipStatus?: OwnershipStatus;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  fourPsBeneficiary?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  indigentFamily?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  hasSeniorCitizen?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  hasPwdMember?: boolean;
}

export class UpdateHouseholdDto {
  @IsString()
  @IsOptional()
  householdType?: string;

  @IsString()
  @IsOptional()
  barangay?: string;

  @IsString()
  @IsOptional()
  streetSitio?: string;

  @IsString()
  @IsOptional()
  houseNumber?: string;

  @IsString()
  @IsOptional()
  completeAddress?: string;

  @IsString()
  @IsOptional()
  headId?: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  monthlyIncome?: number;

  @IsString()
  @IsOptional()
  primaryIncomeSource?: string;

  @IsEnum(HouseType)
  @IsOptional()
  houseType?: HouseType;

  @IsEnum(OwnershipStatus)
  @IsOptional()
  ownershipStatus?: OwnershipStatus;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  fourPsBeneficiary?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  indigentFamily?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  hasSeniorCitizen?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  hasPwdMember?: boolean;
}

export class HouseholdQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  barangay?: string;

  @IsString()
  @IsOptional()
  houseType?: HouseType;

  @IsString()
  @IsOptional()
  ownershipStatus?: OwnershipStatus;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  fourPsBeneficiary?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  indigentFamily?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  hasSeniorCitizen?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  hasPwdMember?: boolean;

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

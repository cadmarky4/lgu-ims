import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { SuggestionCategory, SuggestionStatus, ImplementationStatus } from '@prisma/client';

export class CreateSuggestionDto {
  @IsString()
  @IsNotEmpty()
  suggestorName: string;

  @IsString()
  @IsOptional()
  suggestorContact?: string;

  @IsString()
  @IsOptional()
  suggestorAddress?: string;

  @IsEnum(SuggestionCategory)
  category: SuggestionCategory;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateSuggestionDto {
  @IsString()
  @IsOptional()
  suggestorName?: string;

  @IsString()
  @IsOptional()
  suggestorContact?: string;

  @IsString()
  @IsOptional()
  suggestorAddress?: string;

  @IsEnum(SuggestionCategory)
  @IsOptional()
  category?: SuggestionCategory;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(SuggestionStatus)
  @IsOptional()
  status?: SuggestionStatus;

  @IsString()
  @IsOptional()
  reviewedBy?: string;

  @IsDateString()
  @IsOptional()
  reviewedDate?: string;

  @IsString()
  @IsOptional()
  reviewNotes?: string;

  @IsEnum(ImplementationStatus)
  @IsOptional()
  implementationStatus?: ImplementationStatus;
}

export class SuggestionQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(SuggestionCategory)
  @IsOptional()
  category?: SuggestionCategory;

  @IsEnum(SuggestionStatus)
  @IsOptional()
  status?: SuggestionStatus;

  @IsEnum(ImplementationStatus)
  @IsOptional()
  implementationStatus?: ImplementationStatus;

  @IsString()
  @IsOptional()
  reviewedBy?: string;

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

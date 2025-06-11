import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { DocumentType, DocumentStatus } from '@prisma/client';

export class CreateDocumentDto {
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsString()
  @IsNotEmpty()
  residentId: string;

  @IsString()
  @IsNotEmpty()
  purposeOfRequest: string;

  @IsString()
  @IsOptional()
  validIdPresented?: string;

  @IsString()
  @IsOptional()
  yearsOfResidency?: string;

  @IsString()
  @IsNotEmpty()
  certifyingOfficial: string;

  // Additional fields for specific document types
  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  businessType?: string;

  @IsString()
  @IsOptional()
  businessAddress?: string;
}

export class UpdateDocumentDto {
  @IsEnum(DocumentType)
  @IsOptional()
  documentType?: DocumentType;

  @IsString()
  @IsOptional()
  purposeOfRequest?: string;

  @IsString()
  @IsOptional()
  validIdPresented?: string;

  @IsString()
  @IsOptional()
  yearsOfResidency?: string;

  @IsString()
  @IsOptional()
  certifyingOfficial?: string;

  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @IsDateString()
  @IsOptional()
  processedDate?: string;

  @IsDateString()
  @IsOptional()
  approvedDate?: string;

  @IsDateString()
  @IsOptional()
  rejectedDate?: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  businessType?: string;

  @IsString()
  @IsOptional()
  businessAddress?: string;
}

export class DocumentQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(DocumentType)
  @IsOptional()
  documentType?: DocumentType;

  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @IsString()
  @IsOptional()
  residentId?: string;

  @IsString()
  @IsOptional()
  certifyingOfficial?: string;

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


    // ============================================================================
// services/import/import.service.ts - Data Import Service
// ============================================================================

import { BaseApiService } from '@/services/__shared/api';
import { apiClient } from '@/services/__shared/client';
import * as XLSX from 'xlsx';
import { 
  ImportPreviewSchema,
  ImportResultSchema,
  ImportHistoryItemSchema,
  ImportParamsSchema,
  type ImportPreview,
  type ImportResult,
  type ImportHistoryItem,
  type ImportParams,
  type ImportType
} from '@/services/import/import.types';
import { 
  ApiResponseSchema, 
  PaginatedResponseSchema,
  type PaginatedResponse 
} from '@/services/__shared/types';

export class ImportService extends BaseApiService {
  /**
   * Preview Excel file data locally (no backend needed)
   */
  async previewFile(file: File, type: ImportType): Promise<ImportPreview> {
    try {
      // Read file as buffer
      const buffer = await file.arrayBuffer();
      
      // Parse Excel file
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with header row
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      if (rawData.length === 0) {
        throw new Error('File is empty');
      }
      
      // Extract headers (first row)
      const headers = rawData[0] as string[];
      
      // Extract data rows (skip header)
      const dataRows = rawData.slice(1);
      
      // Convert to objects
      const data = dataRows.map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      
      // Validate data based on type
      const validation = this.validatePreviewData(data, type);
      
      return {
        headers,
        data,
        totalRows: data.length,
        validRows: validation.validCount,
        invalidRows: validation.invalidCount,
        errors: validation.errors
      };
      
    } catch (error) {
      console.error('Preview failed:', error);
      throw new Error(`Failed to preview file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate preview data with custom validation (no Zod)
   */
  private validatePreviewData(data: Record<string, any>[], type: ImportType) {
    const errors: Array<{
      row: number;
      field: string;
      message: string;
      value: any;
    }> = [];
    
    let validCount = 0;
    let invalidCount = 0;
    
    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because we skip header and arrays are 0-indexed
      const rowErrors: Array<{
        row: number;
        field: string;
        message: string;
        value: any;
      }> = [];
      
      if (type === 'RESIDENTS') {
        // Validate residents data
        this.validateResidentRow(row, rowNumber, rowErrors);
      } else {
        // Validate households data
        this.validateHouseholdRow(row, rowNumber, rowErrors);
      }
      
      if (rowErrors.length > 0) {
        invalidCount++;
        errors.push(...rowErrors);
      } else {
        validCount++;
      }
    });
    
    return { validCount, invalidCount, errors };
  }

  /**
   * Validate a single resident row
   */
  private validateResidentRow(row: Record<string, any>, rowNumber: number, errors: Array<{
    row: number;
    field: string;
    message: string;
    value: any;
  }>) {
    // Required string fields
    const requiredFields = [
      { field: 'first_name', name: 'First Name' },
      { field: 'last_name', name: 'Last Name' },
      { field: 'birth_date', name: 'Birth Date' },
      { field: 'birth_place', name: 'Birth Place' },
      { field: 'complete_address', name: 'Complete Address' }
    ];
    
    requiredFields.forEach(({ field, name }) => {
      const value = row[field];
      if (!value || String(value).trim() === '') {
        errors.push({
          row: rowNumber,
          field,
          message: `${name} is required`,
          value
        });
      }
    });
    
    // Validate gender enum
    const validGenders = ['MALE', 'FEMALE'];
    if (row.gender && !validGenders.includes(String(row.gender).toUpperCase())) {
      errors.push({
        row: rowNumber,
        field: 'gender',
        message: 'Gender must be MALE or FEMALE',
        value: row.gender
      });
    }
    
    // Validate civil status enum
    const validCivilStatus = ['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED', 'SEPARATED'];
    if (row.civil_status && !validCivilStatus.includes(String(row.civil_status).toUpperCase())) {
      errors.push({
        row: rowNumber,
        field: 'civil_status',
        message: 'Civil status must be one of: SINGLE, MARRIED, WIDOWED, DIVORCED, SEPARATED',
        value: row.civil_status
      });
    }
    
    // Validate employment status enum
    const validEmploymentStatus = ['EMPLOYED', 'UNEMPLOYED', 'SELF_EMPLOYED', 'RETIRED', 'STUDENT', 'OFW'];
    if (row.employment_status && !validEmploymentStatus.includes(String(row.employment_status).toUpperCase())) {
      errors.push({
        row: rowNumber,
        field: 'employment_status',
        message: 'Employment status must be one of: EMPLOYED, UNEMPLOYED, SELF_EMPLOYED, RETIRED, STUDENT, OFW',
        value: row.employment_status
      });
    }
    
    // Validate voter status enum
    const validVoterStatus = ['NOT_REGISTERED', 'REGISTERED', 'DECEASED', 'TRANSFERRED'];
    if (row.voter_status && !validVoterStatus.includes(String(row.voter_status).toUpperCase())) {
      errors.push({
        row: rowNumber,
        field: 'voter_status',
        message: 'Voter status must be one of: NOT_REGISTERED, REGISTERED, DECEASED, TRANSFERRED',
        value: row.voter_status
      });
    }
    
    // Validate birth date format
    if (row.birth_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(String(row.birth_date))) {
        errors.push({
          row: rowNumber,
          field: 'birth_date',
          message: 'Birth date must be in YYYY-MM-DD format',
          value: row.birth_date
        });
      }
    }
    
    // Validate email format (if provided)
    if (row.email_address && String(row.email_address).trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(row.email_address))) {
        errors.push({
          row: rowNumber,
          field: 'email_address',
          message: 'Invalid email format',
          value: row.email_address
        });
      }
    }
    
    // Validate mobile number format (if provided)
    if (row.mobile_number && String(row.mobile_number).trim() !== '') {
      const phoneRegex = /^09\d{9}$/;
      if (!phoneRegex.test(String(row.mobile_number).replace(/\s/g, ''))) {
        errors.push({
          row: rowNumber,
          field: 'mobile_number',
          message: 'Mobile number must be in format 09XXXXXXXXX',
          value: row.mobile_number
        });
      }
    }
    
    // Validate age (if provided)
    if (row.age !== undefined && row.age !== null && String(row.age).trim() !== '') {
      const age = Number(row.age);
      if (isNaN(age) || age < 0 || age > 150) {
        errors.push({
          row: rowNumber,
          field: 'age',
          message: 'Age must be a valid number between 0 and 150',
          value: row.age
        });
      }
    }
  }

  /**
   * Validate a single household row
   */
  private validateHouseholdRow(row: Record<string, any>, rowNumber: number, errors: Array<{
    row: number;
    field: string;
    message: string;
    value: any;
  }>) {
    // Required string fields
    const requiredFields = [
      { field: 'household_number', name: 'Household Number' },
      { field: 'house_number', name: 'House Number' },
      { field: 'street_sitio', name: 'Street/Sitio' },
      { field: 'barangay', name: 'Barangay' },
      { field: 'complete_address', name: 'Complete Address' }
    ];
    
    requiredFields.forEach(({ field, name }) => {
      const value = row[field];
      if (!value || String(value).trim() === '') {
        errors.push({
          row: rowNumber,
          field,
          message: `${name} is required`,
          value
        });
      }
    });
    
    // Validate household type enum
    const validHouseholdTypes = ['NUCLEAR', 'EXTENDED', 'SINGLE', 'SINGLE_PARENT', 'OTHER'];
    if (row.household_type && !validHouseholdTypes.includes(String(row.household_type).toUpperCase())) {
      errors.push({
        row: rowNumber,
        field: 'household_type',
        message: 'Household type must be one of: NUCLEAR, EXTENDED, SINGLE, SINGLE_PARENT, OTHER',
        value: row.household_type
      });
    }
    
    // Validate monthly income enum (if provided)
    const validIncomeRanges = ['BELOW_10000', 'RANGE_10000_25000', 'RANGE_25000_50000', 'RANGE_50000_100000', 'ABOVE_100000'];
    if (row.monthly_income && String(row.monthly_income).trim() !== '' && !validIncomeRanges.includes(String(row.monthly_income).toUpperCase())) {
      errors.push({
        row: rowNumber,
        field: 'monthly_income',
        message: 'Monthly income must be one of: BELOW_10000, RANGE_10000_25000, RANGE_25000_50000, RANGE_50000_100000, ABOVE_100000',
        value: row.monthly_income
      });
    }
    
    // Validate house type enum (if provided)
    const validHouseTypes = ['CONCRETE', 'SEMI_CONCRETE', 'WOOD', 'BAMBOO', 'MIXED'];
    if (row.house_type && String(row.house_type).trim() !== '' && !validHouseTypes.includes(String(row.house_type).toUpperCase())) {
      errors.push({
        row: rowNumber,
        field: 'house_type',
        message: 'House type must be one of: CONCRETE, SEMI_CONCRETE, WOOD, BAMBOO, MIXED',
        value: row.house_type
      });
    }
    
    // Validate ownership status enum (if provided)
    const validOwnershipStatus = ['OWNED', 'RENTED', 'SHARED', 'INFORMAL_SETTLER'];
    if (row.ownership_status && String(row.ownership_status).trim() !== '' && !validOwnershipStatus.includes(String(row.ownership_status).toUpperCase())) {
      errors.push({
        row: rowNumber,
        field: 'ownership_status',
        message: 'Ownership status must be one of: OWNED, RENTED, SHARED, INFORMAL_SETTLER',
        value: row.ownership_status
      });
    }
  }



  /**
   * Import residents data (send to backend)
   */
  async importResidents(file: File, options?: {
    skipHeader?: boolean;
    validateOnly?: boolean;
  }): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'RESIDENTS');
    
    if (options?.skipHeader) {
      formData.append('skipHeader', 'true');
    }
    if (options?.validateOnly) {
      formData.append('validateOnly', 'true');
    }

    const responseSchema = ApiResponseSchema(ImportResultSchema);
    
    const response = await this.request(
      '/import/residents',
      responseSchema,
      {
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data) {
      throw new Error('Failed to import residents');
    }

    return response.data;
  }

  /**
   * Import households data (send to backend)
   */
  async importHouseholds(file: File, options?: {
    skipHeader?: boolean;
    validateOnly?: boolean;
  }): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'HOUSEHOLDS');
    
    if (options?.skipHeader) {
      formData.append('skipHeader', 'true');
    }
    if (options?.validateOnly) {
      formData.append('validateOnly', 'true');
    }

    const responseSchema = ApiResponseSchema(ImportResultSchema);
    
    const response = await this.request(
      '/import/households',
      responseSchema,
      {
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data) {
      throw new Error('Failed to import households');
    }

    return response.data;
  }

  /**
   * Get import history
   */
  async getImportHistory(params: ImportParams = {}): Promise<PaginatedResponse<ImportHistoryItem>> {
    // Validate input parameters
    const validatedParams = ImportParamsSchema.parse(params);
    
    // Build query string
    const searchParams = new URLSearchParams();
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const paginatedSchema = PaginatedResponseSchema(ImportHistoryItemSchema);
    
    return this.request(
      `/import/history?${searchParams.toString()}`,
      paginatedSchema,
      { method: 'GET' }
    );
  }

  /**
   * Generate and download import template locally
   */
  async downloadTemplate(type: ImportType): Promise<Blob> {
    try {
      // Create template data based on type
      const templateData = this.generateTemplateData(type);
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, type);
      
      // Generate Excel file buffer
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create blob
      return new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
    } catch (error) {
      console.error(`Template generation failed for ${type}:`, error);
      throw new Error(`Template generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate template data based on import type
   */
  private generateTemplateData(type: ImportType) {
    if (type === 'RESIDENTS') {
      return [
        {
          first_name: 'John',
          last_name: 'Doe',
          middle_name: 'Smith',
          suffix: 'Jr.',
          birth_date: '1990-01-01',
          birth_place: 'Quezon City',
          age: '34',
          gender: 'MALE',
          civil_status: 'SINGLE',
          nationality: 'FILIPINO',
          religion: 'CATHOLIC',
          employment_status: 'EMPLOYED',
          educational_attainment: 'COLLEGE',
          mobile_number: '09123456789',
          email_address: 'john.doe@email.com',
          complete_address: '123 Main Street, Barangay Sample',
          occupation: 'Engineer',
          employer: 'ABC Company',
          senior_citizen: false,
          person_with_disability: false,
          four_ps_beneficiary: false,
          voter_status: 'REGISTERED'
        }
      ];
    } else {
      return [
        {
          household_number: 'HH001',
          household_type: 'NUCLEAR',
          house_number: '123',
          street_sitio: 'Main Street',
          barangay: 'Sikatuna Village',
          complete_address: '123 Main Street, Sikatuna Village',
          monthly_income: 'RANGE_25000_50000',
          primary_income_source: 'Employment',
          four_ps_beneficiary: false,
          indigent_family: false,
          has_senior_citizen: false,
          has_pwd_member: false,
          house_type: 'CONCRETE',
          ownership_status: 'OWNED',
          has_electricity: true,
          has_water_supply: true,
          has_internet_access: true,
          remarks: 'Sample household data'
        }
      ];
    }
  }

  /**
   * Validate file format and size
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload a valid Excel file (.xlsx or .xls)' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    return { valid: true };
  }
}
export const importService = new ImportService();
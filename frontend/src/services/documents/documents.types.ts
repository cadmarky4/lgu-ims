// ============================================================================
// services/documents/documents.types.ts - Zod schemas and type definitions
// ============================================================================

import { z } from 'zod';

// Enum schemas following the guidelines
export const DocumentTypeSchema = z.enum([
  'BARANGAY_CLEARANCE',
  'BUSINESS_PERMIT', 
  'CERTIFICATE_OF_INDIGENCY',
  'CERTIFICATE_OF_RESIDENCY'
]);

export const DocumentStatusSchema = z.enum([
  'PENDING',
  'UNDER_REVIEW', 
  'APPROVED',
  'RELEASED',
  'REJECTED',
  'CANCELLED'
]);

export const DocumentPrioritySchema = z.enum([
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT'
]);

export const PaymentStatusSchema = z.enum([
  'UNPAID',
  'PAID',
  'WAIVED'
]);

// Document form data schema - all fields nullable except required ones
export const DocumentFormDataSchema = z.object({
  // Basic Document Information
  document_type: DocumentTypeSchema,
  resident_id: z.number().min(1, 'documents.form.error.residentRequired'),
  applicant_name: z.string().min(1, 'documents.form.error.applicantNameRequired'),
  purpose: z.string().min(1, 'documents.form.error.purposeRequired'),
  
  // Contact Information
  applicant_address: z.string().optional(),
  applicant_contact: z.string().optional(),
  applicant_email: z.string().email('documents.form.error.invalidEmail').optional().or(z.literal('')),
  
  // Request Details
  priority: DocumentPrioritySchema.default('NORMAL'),
  needed_date: z.string().optional(),
  processing_fee: z.number().min(0, 'documents.form.error.invalidFee').default(0),
  
  // Document Specific Fields (all nullable for unified table)
  // Barangay Clearance specific
  clearance_purpose: z.string().optional(),
  clearance_type: z.string().optional(),
  
  // Business Permit specific  
  business_name: z.string().optional(),
  business_type: z.string().optional(),
  business_address: z.string().optional(),
  business_owner: z.string().optional(),
  
  // Certificate of Indigency specific
  indigency_reason: z.string().optional(),
  monthly_income: z.number().optional(),
  family_size: z.number().optional(),
  
  // Certificate of Residency specific
  residency_period: z.string().optional(),
  previous_address: z.string().optional(),
  
  // Processing Information
  requirements_submitted: z.array(z.string()).optional(),
  notes: z.string().optional(),
  remarks: z.string().optional(),
});

// Main Document schema with system fields
export const DocumentSchema = DocumentFormDataSchema.extend({
  id: z.string(),
  status: DocumentStatusSchema,
  payment_status: PaymentStatusSchema,
  
  // System tracking fields
  document_number: z.string().optional(),
  request_date: z.string(),
  processed_date: z.string().optional(),
  approved_date: z.string().optional(), 
  released_date: z.string().optional(),
  
  // Officials
  certifying_official: z.string().optional(),
  processed_by: z.number().optional(),
  approved_by: z.number().optional(),
  released_by: z.number().optional(),
  
  // Additional tracking
  expiry_date: z.string().optional(),
  qr_code: z.string().optional(),
  
  // Timestamps
  date_added: z.string(),
  date_updated: z.string(),
  
  // Relations (loaded when needed)
  resident: z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    middle_name: z.string().optional(),
    suffix: z.string().optional(),
    complete_address: z.string(),
    mobile_number: z.string().optional(),
    email_address: z.string().optional(),
  }).optional(),
  
  processed_by_user: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  
  approved_by_user: z.object({
    id: z.number(), 
    name: z.string(),
  }).optional(),
  
  released_by_user: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
});

// Query parameters schema  
export const DocumentParamsSchema = z.object({
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  document_type: DocumentTypeSchema.optional(),
  status: DocumentStatusSchema.optional(),
  priority: DocumentPrioritySchema.optional(),
  payment_status: PaymentStatusSchema.optional(),
  resident_id: z.number().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

// Statistics schemas
export const DocumentStatisticsSchema = z.object({
  total_documents: z.number(),
  pending_documents: z.number(),
  under_review_documents: z.number(),
  approved_documents: z.number(),
  released_documents: z.number(),
  rejected_documents: z.number(),
  cancelled_documents: z.number(),
  
  by_status: z.record(z.number()),
  by_type: z.record(z.number()),
  by_priority: z.record(z.number()),
  
  revenue: z.object({
    total: z.number(),
    pending: z.number(),
    collected: z.number(),
  }),
  
  processing_times: z.object({
    average_days: z.number(),
    fastest_days: z.number(),
    slowest_days: z.number(),
  }),
});

// Timeline tracking schema
export const DocumentTimelineItemSchema = z.object({
  date: z.string(),
  status: z.string(),
  description: z.string(),
  user_name: z.string().optional(),
});

export const DocumentTrackingSchema = z.object({
  document: DocumentSchema,
  timeline: z.array(DocumentTimelineItemSchema),
});

// Document action schemas
export const ProcessDocumentDataSchema = z.object({
  status: DocumentStatusSchema,
  processing_fee: z.number().optional(),
  document_number: z.string().optional(),
  certifying_official: z.string().optional(),
  notes: z.string().optional(),
});

export const RejectDocumentDataSchema = z.object({
  reason: z.string().min(1, 'documents.form.error.reasonRequired'),
  notes: z.string().optional(),
});

export const ReleaseDocumentDataSchema = z.object({
  document_number: z.string().optional(),
  released_to: z.string().optional(),
  notes: z.string().optional(),
});

// Type exports
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;  
export type DocumentPriority = z.infer<typeof DocumentPrioritySchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type DocumentFormData = z.infer<typeof DocumentFormDataSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type DocumentParams = z.infer<typeof DocumentParamsSchema>;
export type DocumentStatistics = z.infer<typeof DocumentStatisticsSchema>;
export type DocumentTimelineItem = z.infer<typeof DocumentTimelineItemSchema>;
export type DocumentTracking = z.infer<typeof DocumentTrackingSchema>;
export type ProcessDocumentData = z.infer<typeof ProcessDocumentDataSchema>;
export type RejectDocumentData = z.infer<typeof RejectDocumentDataSchema>;
export type ReleaseDocumentData = z.infer<typeof ReleaseDocumentDataSchema>;

// Transform function to handle date/time formatting and form data mapping
export const transformDocumentToFormData = (document: Document | null): DocumentFormData => {
  if (!document) {
    return {
      document_type: 'BARANGAY_CLEARANCE',
      resident_id: 0,
      applicant_name: '',
      purpose: '',
      applicant_address: '',
      applicant_contact: '',
      applicant_email: '',
      priority: 'NORMAL',
      needed_date: '',
      processing_fee: 0,
      clearance_purpose: '',
      clearance_type: '',
      business_name: '',
      business_type: '',
      business_address: '',
      business_owner: '',
      indigency_reason: '',
      monthly_income: undefined,
      family_size: undefined,
      residency_period: '',
      previous_address: '',
      requirements_submitted: [],
      notes: '',
      remarks: '',
    };
  }

  return {
    document_type: document.document_type,
    resident_id: document.resident_id,
    applicant_name: document.applicant_name,
    purpose: document.purpose,
    applicant_address: document.applicant_address || '',
    applicant_contact: document.applicant_contact || '',
    applicant_email: document.applicant_email || '',
    priority: document.priority,
    // Convert UTC date to local date string for form input
    needed_date: document.needed_date 
      ? new Date(document.needed_date).toISOString().slice(0, 10) 
      : '',
    processing_fee: document.processing_fee,
    clearance_purpose: document.clearance_purpose || '',
    clearance_type: document.clearance_type || '',
    business_name: document.business_name || '',
    business_type: document.business_type || '',
    business_address: document.business_address || '',
    business_owner: document.business_owner || '',
    indigency_reason: document.indigency_reason || '',
    monthly_income: document.monthly_income,
    family_size: document.family_size,
    residency_period: document.residency_period || '',
    previous_address: document.previous_address || '',
    requirements_submitted: document.requirements_submitted || [],
    notes: document.notes || '',
    remarks: document.remarks || '',
  };
};


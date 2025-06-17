// Document-specific types and interfaces

// Document enums and union types
export type DocumentType = 
  | 'BARANGAY_CLEARANCE'
  | 'CERTIFICATE_OF_RESIDENCY'
  | 'CERTIFICATE_OF_INDIGENCY'
  | 'BUSINESS_PERMIT'
  | 'BUILDING_PERMIT'
  | 'ELECTRICAL_PERMIT'
  | 'SANITARY_PERMIT'
  | 'FENCING_PERMIT'
  | 'EXCAVATION_PERMIT'
  | 'CERTIFICATE_OF_GOOD_MORAL'
  | 'FIRST_TIME_JOB_SEEKER'
  | 'SOLO_PARENT_CERTIFICATE'
  | 'SENIOR_CITIZEN_ID'
  | 'PWD_ID'
  | 'CERTIFICATE_OF_COHABITATION'
  | 'DEATH_CERTIFICATE'
  | 'BIRTH_CERTIFICATE_COPY'
  | 'MARRIAGE_CONTRACT_COPY'
  | 'OTHER';

export type DocumentStatus = 
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'RELEASED'
  | 'REJECTED'
  | 'CANCELLED';

export type DocumentPriority = 
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT';

export type PaymentStatus = 
  | 'UNPAID'
  | 'PAID'
  | 'WAIVED';

// Main Document interface
export interface DocumentRequest {
  id: number;
  document_type: DocumentType;
  title: string;
  description?: string;
  resident_id: number;
  resident_name?: string;
  applicant_name: string;
  applicant_address?: string;
  applicant_contact?: string;
  purpose: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  request_date?: string;
  requested_date?: string;
  needed_date?: string;
  processed_date?: string;
  approved_date?: string;
  released_date?: string;
  processing_fee: number;
  payment_status: PaymentStatus;
  certifying_official?: string;
  notes?: string;
  remarks?: string;
  requirements_submitted?: string[];
  document_number?: string;
  expiry_date?: string;
  qr_code?: string;
  created_by?: number;
  updated_by?: number;
  processed_by?: number;
  approved_by?: number;
  released_by?: number;
  resident?: {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    complete_address: string;
    mobile_number?: string;
    email?: string;
  };
  processedBy?: {
    id: number;
    name: string;
  };
  approvedBy?: {
    id: number;
    name: string;
  };
  releasedBy?: {
    id: number;
    name: string;
  };
  createdBy?: {
    id: number;
    name: string;
  };
  updatedBy?: {
    id: number;
    name: string;
  };
}

// Document statistics interface
export interface DocumentStats {
  total_documents: number;
  pending: number;
  under_review: number;
  approved: number;
  released: number;
  rejected: number;
  cancelled: number;
  total: number;
  by_status: { status: string; count: number }[];
  by_type: { document_type: string; count: number }[];
  by_priority: { priority: string; count: number }[];
  pending_count: number;
  overdue_count: number;
  revenue: {
    pending: number;
    total: number;
  };
  processing_times: {
    average_days: number;
    fastest_days: number;
    slowest_days: number;
  };
}

// Query parameters interface
export interface DocumentFilters {
  document_type?: DocumentType;
  status?: DocumentStatus;
  priority?: DocumentPriority;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// Create document interface
export interface CreateDocumentData {
  document_type: DocumentType;
  title: string;
  description?: string;
  resident_id: number;
  applicant_name: string;
  applicant_address?: string;
  applicant_contact?: string;
  purpose: string;
  needed_date?: string;
  priority?: DocumentPriority;
  processing_fee?: number;
  requirements_submitted?: string[];
  remarks?: string;
}

// Update document interface
export interface UpdateDocumentData {
  title?: string;
  description?: string;
  applicant_name?: string;
  applicant_address?: string;
  applicant_contact?: string;
  purpose?: string;
  needed_date?: string;
  priority?: DocumentPriority;
  processing_fee?: number;
  requirements_submitted?: string[];
  remarks?: string;
}

// Document action interfaces
export interface ApproveDocumentData {
  expiry_date?: string;
  remarks?: string;
}

export interface RejectDocumentData {
  reason: string;
}

// Tracking interfaces
export interface TrackingTimelineItem {
  date: string;
  status: string;
  description: string;
  user?: string;
}

export interface DocumentTracking {
  document: DocumentRequest;
  timeline: TrackingTimelineItem[];
}

// Document parameters interface
export interface DocumentParams {
  page?: number;
  per_page?: number;
  search?: string;
  document_type?: DocumentType;
  status?: DocumentStatus;
  priority?: DocumentPriority;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  resident_id?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}


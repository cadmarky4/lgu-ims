// Complaint-specific types and interfaces

export type ComplaintUrgency = 'low' | 'medium' | 'high' | 'critical';

export type ComplaintStatus = 
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED';

export type ComplaintPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export interface Complaint {
  id: number;
  complaint_number: string;
  
  // Personal Information (from frontend form)
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  
  // Complaint Details
  complaint_category: string;
  department?: string;
  subject: string;
  description: string;
  location?: string;
  
  // Additional Information
  urgency: ComplaintUrgency;
  is_anonymous: boolean;
  attachments?: string;
  
  // System Processing Fields
  status: ComplaintStatus;
  priority: ComplaintPriority;
  date_received: string;
  date_acknowledged?: string;
  date_resolved?: string;
  
  // Assignment & Processing
  assigned_to?: number;
  assigned_official?: {
    id: number;
    name: string;
    position: string;
  };
  assigned_department?: string;
  
  // Resolution
  resolution_summary?: string;
  resolution_date?: string;
  resolution_time?: string;
  action_taken?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  follow_up_notes?: string;
  
  // Feedback
  satisfaction_rating?: number;
  feedback_comments?: string;
  feedback_date?: string;
  
  // Additional
  escalation_level?: number;
  escalation_reason?: string;
  escalated_to?: number;
  escalated_at?: string;
  
  // Related Information
  related_complaints?: number[];
  reference_documents?: any[];
  internal_notes?: string;
  
  // System Fields
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

export interface ComplaintParams {
  page?: number;
  per_page?: number;
  search?: string;
  complaint_category?: string;
  department?: string;
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  urgency?: ComplaintUrgency;
  date_from?: string;
  date_to?: string;
  assigned_to?: number;
  is_anonymous?: boolean;
  follow_up_required?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateComplaintData {
  // Required fields from frontend form
  subject: string;
  description: string;
  complaint_category: string;
  
  // Optional personal information (not required if anonymous)
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  
  // Additional details
  department?: string;
  location?: string;
  urgency?: ComplaintUrgency;
  is_anonymous?: boolean;
  attachments?: string;
  
  // Optional system fields
  resident_id?: number;
  priority?: ComplaintPriority;
}

export interface UpdateComplaintData {
  subject?: string;
  description?: string;
  complaint_category?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  location?: string;
  urgency?: ComplaintUrgency;
  is_anonymous?: boolean;
  attachments?: string;
  
  // System fields that can be updated
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  assigned_to?: number;
  assigned_department?: string;
  resolution_summary?: string;
  action_taken?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  follow_up_notes?: string;
  internal_notes?: string;
}

export interface AcknowledgeComplaintData {
  acknowledgment_message?: string;
  estimated_resolution_date?: string;
  assigned_to?: number;
  priority?: ComplaintPriority;
}

export interface AssignComplaintData {
  assigned_to: number;
  assigned_department?: string;
  assignment_notes?: string;
  priority?: ComplaintPriority;
  estimated_resolution_date?: string;
}

export interface ResolveComplaintData {
  resolution_summary: string;
  action_taken: string;
  resolution_date?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  follow_up_notes?: string;
}

export interface SubmitFeedbackData {
  satisfaction_rating: number; // 1-5 scale
  feedback_comments?: string;
  would_recommend?: boolean;
  service_quality_rating?: number;
  response_time_rating?: number;
}

export interface ComplaintStatistics {
  total_complaints: number;
  open_complaints: number;
  acknowledged_complaints: number;
  in_progress_complaints: number;
  resolved_complaints: number;
  closed_complaints: number;
  escalated_complaints: number;
  anonymous_complaints: number;
  by_category: Record<string, number>;
  by_department: Record<string, number>;
  by_urgency: Record<ComplaintUrgency, number>;
  by_priority: Record<ComplaintPriority, number>;
  by_status: Record<ComplaintStatus, number>;
  complaints_by_month: Array<{
    month: string;
    count: number;
  }>;
  average_resolution_time: number; // in days
  resolution_rate: number; // percentage
  satisfaction_average: number; // average rating
  follow_up_rate: number; // percentage
}

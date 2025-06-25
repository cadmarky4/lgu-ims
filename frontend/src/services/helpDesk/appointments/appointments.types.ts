// Appointment-specific types and interfaces

export type AppointmentStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type AppointmentPriority =
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT';

export interface Appointment {
  id: number;
  appointment_number: string;
  
  // Basic Information (from frontend form)
  full_name: string;
  email: string;
  phone: string;
  department: string;
  purpose: string;
  
  // Scheduling Information
  preferred_date: string;
  preferred_time: string;
  alternative_date?: string;
  alternative_time?: string;
  additional_notes?: string;
  
  // System Processing Fields
  appointment_date?: string; // Final confirmed date
  appointment_time?: string; // Final confirmed time
  end_time?: string;
  duration_minutes?: number;
  
  // Location & Assignment
  location?: string;
  room_venue?: string;
  assigned_official?: number;
  assigned_official_name?: string;
  assigned_official_details?: {
    id: number;
    name: string;
    position: string;
  };
  
  // Status & Dates
  status: AppointmentStatus;
  date_requested: string;
  confirmed_date?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  
  // Rescheduling
  original_date?: string;
  original_time?: string;
  reschedule_reason?: string;
  reschedule_count: number;
  
  // Meeting Details
  meeting_notes?: string;
  action_items?: string;
  outcome_summary?: string;
  resolution_status?: 'PENDING' | 'RESOLVED' | 'ONGOING' | 'ESCALATED';
  
  // Priority & Special Flags
  priority: AppointmentPriority;
  is_walk_in: boolean;
  is_emergency: boolean;
  
  // Notifications
  confirmation_sent: boolean;
  reminder_sent: boolean;
  confirmation_sent_at?: string;
  reminder_sent_at?: string;
  
  // Additional
  attachments?: any[];
  reference_number?: string;
  remarks?: string;
  
  // System Fields
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

export interface AppointmentParams {
  page?: number;
  per_page?: number;
  search?: string;
  department?: string;
  status?: AppointmentStatus;
  priority?: AppointmentPriority;
  date_from?: string;
  date_to?: string;
  assigned_official?: number;
  is_emergency?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateAppointmentData {
  // Required fields from frontend form
  full_name: string;
  email: string;
  phone: string;
  department: string;
  purpose: string;
  preferred_date: string;
  preferred_time: string;
  
  // Optional fields from frontend form
  alternative_date?: string;
  alternative_time?: string;
  additional_notes?: string;
  
  // Optional system fields
  resident_id?: number;
  priority?: AppointmentPriority;
  is_emergency?: boolean;
}

export interface UpdateAppointmentData {
  full_name?: string;
  email?: string;
  phone?: string;
  department?: string;
  purpose?: string;
  preferred_date?: string;
  preferred_time?: string;
  alternative_date?: string;
  alternative_time?: string;
  additional_notes?: string;
  
  // System fields that can be updated
  appointment_date?: string;
  appointment_time?: string;
  end_time?: string;
  duration_minutes?: number;
  location?: string;
  room_venue?: string;
  assigned_official?: number;
  assigned_official_name?: string;
  status?: AppointmentStatus;
  priority?: AppointmentPriority;
  meeting_notes?: string;
  action_items?: string;
  outcome_summary?: string;
  resolution_status?: 'PENDING' | 'RESOLVED' | 'ONGOING' | 'ESCALATED';
  remarks?: string;
}

export interface ConfirmAppointmentData {
  appointment_date: string;
  appointment_time: string;
  end_time?: string;
  duration_minutes?: number;
  location?: string;
  room_venue?: string;
  assigned_official?: number;
  confirmation_notes?: string;
}

export interface CancelAppointmentData {
  cancellation_reason: string;
  refund_required?: boolean;
  alternative_offered?: boolean;
}

export interface CompleteAppointmentData {
  actual_start_time?: string;
  actual_end_time?: string;
  meeting_notes?: string;
  action_items?: string;
  outcome_summary?: string;
  resolution_status?: 'PENDING' | 'RESOLVED' | 'ONGOING' | 'ESCALATED';
  follow_up_required?: boolean;
  follow_up_date?: string;
}

export interface RescheduleAppointmentData {
  new_date: string;
  new_time: string;
  reschedule_reason: string;
  end_time?: string;
  duration_minutes?: number;
  location?: string;
  room_venue?: string;
}

export interface FollowUpData {
  follow_up_date: string;
  follow_up_time?: string;
  follow_up_type: 'PHONE_CALL' | 'EMAIL' | 'IN_PERSON' | 'DOCUMENT_REVIEW';
  follow_up_notes: string;
  priority?: AppointmentPriority;
}

export interface AppointmentStatistics {
  total_appointments: number;
  pending_appointments: number;
  confirmed_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  no_show_appointments: number;
  today_appointments: number;
  upcoming_appointments: number;
  by_department: Record<string, number>;
  by_priority: Record<AppointmentPriority, number>;
  by_status: Record<AppointmentStatus, number>;
  appointments_by_month: Array<{
    month: string;
    count: number;
  }>;
  average_completion_time: number; // in minutes
  completion_rate: number; // percentage
  no_show_rate: number; // percentage
}

export interface AvailableSlot {
  time: string;
  available: boolean;
  capacity?: number;
  booked?: number;
}

export interface AvailableSlotsParams {
  date: string;
  department?: string;
  duration_minutes?: number;
}


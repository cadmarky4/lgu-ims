// Appointment-specific types and interfaces

export type AppointmentType = 
  | 'document_request'
  | 'consultation'
  | 'complaint'
  | 'certification'
  | 'clearance'
  | 'business_permit'
  | 'building_permit'
  | 'other';

export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export interface Appointment {
  id: number;
  appointment_number: string;
  resident_id: number;
  resident?: {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    contact_number?: string;
    email?: string;
  };
  appointment_type: AppointmentType;
  appointment_date: string;
  appointment_time: string;
  purpose: string;
  description?: string;
  status: AppointmentStatus;
  notes?: string;
  assigned_to?: number;
  assigned_official?: {
    id: number;
    name: string;
    position: string;
  };
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  rescheduled_from?: number;
  reschedule_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentParams {
  page?: number;
  per_page?: number;
  search?: string;
  appointment_type?: AppointmentType;
  status?: AppointmentStatus;
  date_from?: string;
  date_to?: string;
  resident_id?: number;
  assigned_to?: number;
}

export interface CreateAppointmentData {
  resident_id: number;
  appointment_type: AppointmentType;
  appointment_date: string;
  appointment_time: string;
  purpose: string;
  description?: string;
  assigned_to?: number;
}

export interface UpdateAppointmentData {
  appointment_type?: AppointmentType;
  appointment_date?: string;
  appointment_time?: string;
  purpose?: string;
  description?: string;
  status?: AppointmentStatus;
  notes?: string;
  assigned_to?: number;
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
  appointments_by_type: Record<AppointmentType, number>;
  appointments_by_month: Array<{
    month: string;
    count: number;
  }>;
  average_completion_time: number; // in minutes
  completion_rate: number; // percentage
}


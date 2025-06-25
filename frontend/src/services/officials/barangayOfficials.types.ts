// Base types
export type Gender = 'Male' | 'Female';
export type CivilStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';
export type OfficialPosition = 
  | 'BARANGAY_CAPTAIN' 
  | 'BARANGAY_SECRETARY' 
  | 'BARANGAY_TREASURER' 
  | 'KAGAWAD' 
  | 'SK_CHAIRPERSON' 
  | 'SK_KAGAWAD' 
  | 'BARANGAY_CLERK' 
  | 'BARANGAY_TANOD';

export type CommitteeAssignment = 
  | 'Health' 
  | 'Education' 
  | 'Public Safety' 
  | 'Environment' 
  | 'Peace and Order' 
  | 'Sports and Recreation' 
  | 'Women and Family' 
  | 'Senior Citizens';

export type OfficialStatus = 
  | 'ACTIVE' 
  | 'INACTIVE' 
  | 'SUSPENDED' 
  | 'RESIGNED' 
  | 'TERMINATED' 
  | 'DECEASED';

export type Prefix = 'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.' | 'Hon.';

// Main entity interface (backend format)
export interface BarangayOfficial {
  id: number;
  // Personal Information
  prefix?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: Gender;
  birth_date?: string;
  contact_number: string;
  email_address?: string;
  complete_address?: string;
  civil_status?: CivilStatus;
  educational_background?: string;
  
  // Position Information
  position: OfficialPosition;
  position_title?: string;
  committee_assignment?: CommitteeAssignment;
  
  // Term Information
  term_start: string;
  term_end: string;
  term_number?: number;
  is_current_term?: boolean;
  
  // Election Information
  election_date?: string;
  votes_received?: number;
  is_elected?: boolean;
  appointment_document?: string;
  
  // Status
  status?: OfficialStatus;
  status_date?: string;
  status_reason?: string;
  
  // Additional fields
  work_experience?: string;
  skills_expertise?: string;
  trainings_attended?: string[];
  certifications?: string[];
  major_accomplishments?: string;
  projects_initiated?: string[];
  performance_notes?: string;
  performance_rating?: number;
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;
  
  // Files
  profile_photo?: string;
  documents?: string[];
  
  // Oath Information
  oath_taking_date?: string;
  oath_taking_notes?: string;
  
  // System fields
  is_active?: boolean;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
  
  // Computed attributes
  full_name?: string;
  age?: number;
  term_duration?: number;
  days_in_office?: number;
  is_term_ending_soon?: boolean;
}

// Frontend form data interface (camelCase)
export interface BarangayOfficialFormData {
  // Personal Information
  prefix?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: Gender;
  birthDate?: string;
  contactNumber: string;
  emailAddress?: string;
  completeAddress?: string;
  civilStatus?: CivilStatus;
  educationalBackground?: string;
  
  // Position Information
  position: OfficialPosition;
  positionTitle?: string;
  committeeAssignment?: CommitteeAssignment;
  
  // Term Information
  termStart: string;
  termEnd: string;
  termNumber?: number;
  isCurrentTerm?: boolean;
  
  // Election Information
  electionDate?: string;
  votesReceived?: number;
  isElected?: boolean;
  appointmentDocument?: string;
  
  // Status
  status?: OfficialStatus;
  statusDate?: string;
  statusReason?: string;
  
  // Additional fields
  workExperience?: string;
  skillsExpertise?: string;
  trainingsAttended?: string[];
  certifications?: string[];
  majorAccomplishments?: string;
  projectsInitiated?: string[];
  performanceNotes?: string;
  performanceRating?: number;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactRelationship?: string;
  
  // Files
  documents?: string[];
  
  // Oath Information
  oathTakingDate?: string;
  oathTakingNotes?: string;
  
  // System fields
  isActive?: boolean;

  profile_photo?: string; // For frontend, we can use a base64 string or file object
}

// API data interfaces
export interface CreateBarangayOfficialData {
  // Personal Information
  prefix?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: Gender;
  birth_date?: string;
  contact_number: string;
  email_address?: string;
  complete_address?: string;
  civil_status?: CivilStatus;
  educational_background?: string;
  
  // Position Information
  position: OfficialPosition;
  position_title?: string;
  committee_assignment?: CommitteeAssignment;
  
  // Term Information
  term_start: string;
  term_end: string;
  term_number?: number;
  is_current_term?: boolean;
  
  // Election Information
  election_date?: string;
  votes_received?: number;
  is_elected?: boolean;
  appointment_document?: string;
  
  // Status
  status?: OfficialStatus;
  status_date?: string;
  status_reason?: string;
  
  // Additional fields
  work_experience?: string;
  skills_expertise?: string;
  trainings_attended?: string[];
  certifications?: string[];
  major_accomplishments?: string;
  projects_initiated?: string[];
  performance_notes?: string;
  performance_rating?: number;
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;
  
  // Files
  documents?: string[];
  
  // Oath Information
  oath_taking_date?: string;
  oath_taking_notes?: string;
  
  // System fields
  is_active?: boolean;

  profile_photo?: string; // For API, this can be a base64 string or file path
}

export interface UpdateBarangayOfficialData {
  // Personal Information
  prefix?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  gender?: Gender;
  birth_date?: string;
  contact_number?: string;
  email_address?: string;
  complete_address?: string;
  civil_status?: CivilStatus;
  educational_background?: string;
  
  // Position Information
  position?: OfficialPosition;
  position_title?: string;
  committee_assignment?: CommitteeAssignment;
  
  // Term Information
  term_start?: string;
  term_end?: string;
  term_number?: number;
  is_current_term?: boolean;
  
  // Election Information
  election_date?: string;
  votes_received?: number;
  is_elected?: boolean;
  appointment_document?: string;
  
  // Status
  status?: OfficialStatus;
  status_date?: string;
  status_reason?: string;
  
  // Additional fields
  work_experience?: string;
  skills_expertise?: string;
  trainings_attended?: string[];
  certifications?: string[];
  major_accomplishments?: string;
  projects_initiated?: string[];
  performance_notes?: string;
  performance_rating?: number;
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;
  
  // Files
  documents?: string[];
  
  // Oath Information
  oath_taking_date?: string;
  oath_taking_notes?: string;
  
  // System fields
  is_active?: boolean;

  profile_photo?: string; // For API, this can be a base64 string or file path
}

// Filter interface
export interface BarangayOfficialFilters {
  position?: OfficialPosition;
  committee?: CommitteeAssignment;
  status?: OfficialStatus;
  is_active?: boolean;
  current_term?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
}

// Statistics interface
export interface BarangayOfficialStatistics {
  total_officials: number;
  active_officials: number;
  current_term_officials: Record<string, number>;
  by_gender: Record<string, number>;
  average_performance: number;
  average_tenure: number;
  upcoming_term_endings: number;
}

// Additional utility types
export interface OfficialPerformanceUpdate {
  performance_rating: number;
  performance_notes?: string;
  evaluation_period: string;
  evaluated_by?: number;
}

export interface OfficialArchiveData {
  end_reason: 'TERM_ENDED' | 'RESIGNED' | 'TERMINATED' | 'DECEASED' | 'TRANSFERRED';
  end_notes?: string;
  effective_date: string;
}

export interface OfficialReactivationData {
  new_term_start: string;
  new_term_end: string;
  reactivation_notes?: string;
}

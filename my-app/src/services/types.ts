// Enums and Union Types
export type Gender = 'MALE' | 'FEMALE';

export type CivilStatus = 
  | 'SINGLE'
  | 'MARRIED'
  | 'WIDOWED'
  | 'DIVORCED'
  | 'SEPARATED';

export type EmploymentStatus = 
  | 'EMPLOYED'
  | 'UNEMPLOYED'
  | 'SELF_EMPLOYED'
  | 'RETIRED'
  | 'STUDENT'
  | 'OFW';

export type VoterStatus = 
  | 'NOT_REGISTERED'
  | 'REGISTERED'
  | 'DECEASED'
  | 'TRANSFERRED';

export type ResidentStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DECEASED'
  | 'TRANSFERRED';

export type IdType = 
  | 'National ID'
  | 'Passport'
  | "Driver's License"
  | "Voter's ID"
  | 'PhilHealth ID'
  | 'SSS ID'
  | 'UMID';


// API response types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  first_page_url: string;
  from: number | null;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  prev_page_url: string | null;
  to: number | null;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  middleName?: string;
  position: string;
  department: string;
  employeeId: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// User management types
export interface UserFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  username: string;
  role: string;
  department: string;
  position: string;
  employeeId: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
  sendCredentials: boolean;
  notes: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone: string;
  role: string;
  department: string;
  position?: string;
  employee_id?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  username: string;
  phone: string;
  role: string;
  department: string;
  position?: string;
  employee_id?: string;
  password: string;
  confirm_password: string;
  is_active: boolean;
  notes?: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  username?: string;
  phone?: string;
  role?: string;
  department?: string;
  position?: string;
  employee_id?: string;
  is_active?: boolean;
  notes?: string;
}

export interface UserParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  department?: string;
  is_active?: boolean;
  is_verified?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Appointment types
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

// Resident interface
export interface Resident {
  id: number;
  
  // Basic Information
  first_name: string;
  last_name: string;
  middle_name?: string;
  suffix?: string;
  birth_date: string;
  age?: number;
  birth_place: string;
  gender: Gender;
  civil_status: CivilStatus;
  nationality: string;
  religion?: string;
  employment_status?: EmploymentStatus;
  educational_attainment?: string;
  
  // Contact Information
  mobile_number?: string;
  telephone_number?: string;
  email_address?: string;
  complete_address: string;
  house_number?: string;
  street?: string;
  purok?: string;
  
  // Family Information
  household_id?: number;
  household?: {
    id: number;
    household_number: string;
    household_head_name: string;
  };
  is_household_head: boolean;
  relationship_to_head?: string;
  mother_name?: string;
  father_name?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;
  
  // Government IDs
  primary_id_type?: IdType;
  id_number?: string;
  philhealth_number?: string;
  sss_number?: string;
  tin_number?: string;
  voters_id_number?: string;
  voter_status: VoterStatus;
  precinct_number?: string;  // Employment Information
  occupation?: string;
  employer?: string;
  
  // Health & Medical
  medical_conditions?: string;
  allergies?: string;
  
  // Special Classifications
  senior_citizen: boolean;
  person_with_disability: boolean;
  disability_type?: string;
  indigenous_people: boolean;
  indigenous_group?: string;
  four_ps_beneficiary: boolean;
  four_ps_household_id?: string;
  
  // System Fields
  status: ResidentStatus;
  profile_photo_url?: string;
  created_at: string;
  updated_at: string;
}

// Query Parameters
export interface ResidentParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: ResidentStatus;
  gender?: Gender;
  purok?: string;
  civil_status?: CivilStatus;
  employment_status?: EmploymentStatus;
  voter_status?: VoterStatus;
  household_id?: number;
  senior_citizen?: boolean;
  person_with_disability?: boolean;
  indigenous_people?: boolean;
  four_ps_beneficiary?: boolean;
  age_from?: number;
  age_to?: number;
}

// Create/Update DTOs
export interface CreateResidentData {
  // Basic Information
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  suffix?: string | null;
  birth_date: string;
  birth_place: string;
  gender: Gender;
  civil_status: CivilStatus;
  nationality: string;
  religion?: string | null;
  employment_status?: EmploymentStatus | null;
  educational_attainment?: string | null;
  
  // Contact Information
  mobile_number?: string | null;
  telephone_number?: string | null;
  email_address?: string | null;
  complete_address: string;
  house_number?: string | null;
  street?: string | null;
  purok?: string | null;
  
  // Family Information
  household_id?: number | null;
  is_household_head?: boolean;
  relationship_to_head?: string | null;
  mother_name?: string | null;
  father_name?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_number?: string | null;
  emergency_contact_relationship?: string | null;
  
  // Government IDs
  primary_id_type?: IdType | null;
  id_number?: string | null;
  philhealth_number?: string | null;
  sss_number?: string | null;
  tin_number?: string | null;
  voters_id_number?: string | null;
  voter_status?: VoterStatus;
  precinct_number?: string | null;
  
  // Employment Information
  occupation?: string | null;
  employer?: string | null;
  monthly_income?: number | null;
  
  // Health & Medical
  medical_conditions?: string | null;
  allergies?: string | null;
  
  // Special Classifications
  senior_citizen: boolean;
  person_with_disability: boolean;
  disability_type?: string | null;
  indigenous_people: boolean;
  indigenous_group?: string | null;
  four_ps_beneficiary: boolean;
  four_ps_household_id?: string | null;
  
  // System Fields
  status: ResidentStatus;
}

export type UpdateResidentData = Partial<CreateResidentData>;

// Form Data interface (matching the React component)
export interface ResidentFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  birthDate: string;
  age: string;
  birthPlace: string;
  gender: string;
  civilStatus: string;
  nationality: string;
  religion: string;
  employmentStatus: string;
  educationalAttainment: string;
  
  // Contact Information
  mobileNumber: string;
  landlineNumber: string;
  emailAddress: string;
  houseNumber: string;
  street: string;
  purok: string;
  completeAddress: string;
  
  // Family Information (Non-household relationship fields only)
  motherName: string;
  fatherName: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  
  // Government IDs & Documents
  primaryIdType: string;
  idNumber: string;
  philhealthNumber: string;  sssNumber: string;
  tinNumber: string;
  votersIdNumber: string;
  occupation: string;
  employer: string;
  monthlyIncome: string; // Using string for form input, will be converted to number in API
  voterStatus: string;
  precinctNumber: string;
  
  // Health & Medical Information
  medicalConditions: string;
  allergies: string;
  
  // Special Classifications
  specialClassifications: {
    seniorCitizen: boolean;
    personWithDisability: boolean;
    disabilityType: string;
    indigenousPeople: boolean;
    indigenousGroup: string;
    fourPsBeneficiary: boolean;
    fourPsHouseholdId: string;
  };
}

// Statistics interface
export interface ResidentStatistics {
  total_residents: number;
  active_residents: number;
  male_residents: number;
  female_residents: number;
  senior_citizens: number;
  persons_with_disability: number;
  pwd_count: number; // Alias for persons_with_disability
  registered_voters: number;
  employed_residents: number;
  four_ps_beneficiaries: number;
  indigenous_people: number;
  household_heads: number;
  children_count: number; // Direct field for children count
  residents_by_purok: Record<string, number>;
  residents_by_age_group: {
    children: number; // 0-17
    youth: number; // 18-35
    adults: number; // 36-59
    seniors: number; // 60+
  };
  residents_by_civil_status: Record<CivilStatus, number>;
  by_gender: {
    male: number;
    female: number;
  };
  by_civil_status: Record<CivilStatus, number>;
  by_employment_status: Record<string, number>;
  average_household_size: number;
  total_households: number;
}

// Reference data interfaces
export interface Purok {
  id: number;
  name: string;
  description?: string;
}

// Household types
export type HouseholdType = 
  | 'nuclear'
  | 'extended'
  | 'single'
  | 'single-parent'
  | 'other';

export type MonthlyIncomeRange = 
  | 'below-10000'
  | '10000-25000'
  | '25000-50000'
  | '50000-100000'
  | 'above-100000';

export type HouseType = 
  | 'concrete'
  | 'semi-concrete'
  | 'wood'
  | 'bamboo'
  | 'mixed';

export type OwnershipStatus = 
  | 'owned'
  | 'rented'
  | 'shared'
  | 'informal-settler';

// Backend Household interface (snake_case for API)
export interface Household {
  id: number;
  household_number: string;
  household_type: HouseholdType;
  head_resident_id?: number;
  house_number: string;
  street_sitio: string;
  barangay: string;
  complete_address: string;
  monthly_income?: MonthlyIncomeRange;
  primary_income_source?: string;
  four_ps_beneficiary: boolean;
  indigent_family: boolean;
  has_senior_citizen: boolean;
  has_pwd_member: boolean;
  house_type?: HouseType;
  ownership_status?: OwnershipStatus;
  has_electricity: boolean;
  has_water_supply: boolean;
  has_internet_access: boolean;
  remarks?: string;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  head_resident?: {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    contact_number?: string;
  };
  members?: any[];
}

// Frontend form data interface (camelCase for forms)
export interface HouseholdFormData {
  householdId: string;
  householdType: HouseholdType | '';
  barangay: string;
  streetSitio: string;
  houseNumber: string;
  completeAddress: string;
  householdHeadSearch: string;
  memberSearch: string;
  monthlyIncome: MonthlyIncomeRange | '';
  primaryIncomeSource: string;
  householdClassification: {
    fourPsBeneficiary: boolean;
    indigentFamily: boolean;
    hasSeniorCitizen: boolean;
    hasPwdMember: boolean;
  };
  houseType: HouseType | '';
  ownershipStatus: OwnershipStatus | '';
  utilitiesAccess: {
    electricity: boolean;
    waterSupply: boolean;
    internetAccess: boolean;
  };
  remarks: string;
  headResidentId?: number;
  members?: Array<{
    residentId: number;
    relationship: string;
  }>;
}

// Household creation request (what we send to API)
export interface CreateHouseholdRequest {
  household_number?: string;
  household_type: HouseholdType;
  head_resident_id?: number;
  house_number: string;
  street_sitio: string;
  barangay: string;
  complete_address: string;
  monthly_income?: MonthlyIncomeRange;
  primary_income_source?: string;
  four_ps_beneficiary: boolean;
  indigent_family: boolean;
  has_senior_citizen: boolean;
  has_pwd_member: boolean;
  house_type?: HouseType;
  ownership_status?: OwnershipStatus;
  has_electricity: boolean;
  has_water_supply: boolean;
  has_internet_access: boolean;
  remarks?: string;
  member_ids?: Array<{
    resident_id: number;
    relationship: string;
  }>;
}

// Household statistics interface
export interface HouseholdStatistics {
  total_households: number;
  by_barangay: Array<{ barangay: string; count: number }>;
  by_household_type: Array<{ household_type: string; count: number }>;
  by_house_type: Array<{ house_type: string; count: number }>;
  by_ownership_status: Array<{ ownership_status: string; count: number }>;
  by_monthly_income: Array<{ monthly_income: string; count: number }>;
  classifications: {
    four_ps_beneficiaries: number;
    indigent_families: number;
    with_senior_citizens: number;
    with_pwd_members: number;
  };
  utilities: {
    with_electricity: number;
    with_water_supply: number;
    with_internet_access: number;
  };
}

// Barangay reference data
export interface Barangay {
  id: number;
  name: string;
  value: string;
}


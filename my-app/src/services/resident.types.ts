// Resident-specific types and interfaces

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
  precinct_number?: string;
  
  // Employment Information
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
  philhealthNumber: string;
  sssNumber: string;
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

// Age group statistics interface
export interface AgeGroupStatistics {
  children: number; // 0-17
  youth: number; // 18-35
  adults: number; // 36-59
  seniors: number; // 60+
}

// Reference data interfaces
export interface Purok {
  id: number;
  name: string;
  description?: string;
}

import { z } from 'zod';
import { 
  CivilStatusSchema,
  EducationalAttainmentSchema,
  EmploymentStatusSchema,
  GenderSchema,
  NationalitySchema,
  ReligionSchema,
  VoterStatusSchema,
  type CivilStatus,
  type EducationalAttainment,
  type EmploymentStatus,
  type Gender,
  type Nationality,
  type Religion,
  type Resident,
} from '@/services/residents/residents.types';

// Form data schema that matches the UI structure
export const ResidentFormDataSchema = z.object({
  // Basic Information
  first_name: z.string().min(1, 'residents.form.error.firstNameRequired'),
  last_name: z.string().min(1, 'residents.form.error.lastNameRequired'),
  middle_name: z.string().optional(),
  suffix: z.string().optional(),
  birth_date: z.string().min(1, 'residents.form.error.birthDateRequired'),
  age: z.string().optional(),
  birth_place: z.string().min(1, 'residents.form.error.birthPlaceRequired'),

  gender: GenderSchema,
  civil_status: CivilStatusSchema,
  nationality: NationalitySchema,
  religion: ReligionSchema,
  employment_status: EmploymentStatusSchema,
  educational_attainment: EducationalAttainmentSchema,
  
  // Contact Information
  mobile_number: z.string().optional(),
  landline_number: z.string().optional(),
  email_address: z.union([z.string().email('Invalid email address'), z.literal('')]).optional(),

  // Address Information
  region: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  barangay: z.string().optional(),

  house_number: z.string().optional(),
  street: z.string().optional(),
  complete_address: z.string().min(1, 'Complete address is required'),
  
  // Family Information
  mother_name: z.string().optional(),
  father_name: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_number: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  
  // Government IDs
  primary_id_type: z.string().optional(),
  id_number: z.string().optional(),
  philhealth_number: z.string().optional(),
  sss_number: z.string().optional(),
  tin_number: z.string().optional(),
  voters_id_number: z.string().optional(),
  voter_status: VoterStatusSchema,
  precinct_number: z.string().optional(),
  
  // Employment
  occupation: z.string().optional(),
  employer: z.string().optional(),
  monthly_income: z.string().optional(),
  
  // Health & Medical
  medical_conditions: z.string().optional(),
  allergies: z.string().optional(),
  
  // Special Classifications - Make all optional
  senior_citizen: z.boolean(),
  person_with_disability: z.boolean(),
  disability_type: z.string().nullable().optional(),
  indigenous_people: z.boolean(),
  indigenous_group: z.string().nullable().optional(),
  four_ps_beneficiary: z.boolean(),
  four_ps_household_id: z.string().nullable().optional(),
  
  // Profile photo
  profile_photo_url: z.string().optional(),
});

export type ResidentFormData = z.infer<typeof ResidentFormDataSchema>;

export const transformResidentToFormData = (resident: Resident | null): ResidentFormData => {
  if (!resident) {
    return {
      first_name: '',
      last_name: '',
      middle_name: '',
      suffix: '',
      birth_date: '',
      age: '',
      birth_place: '',
      gender: 'MALE',
      civil_status: 'SINGLE',
      nationality: 'FILIPINO',
      religion: 'CATHOLIC',
      employment_status: 'UNEMPLOYED',
      educational_attainment: 'HIGH_SCHOOL',
      mobile_number: '',
      landline_number: '',
      email_address: '',
      house_number: '',
      street: '',
      complete_address: '',
      mother_name: '',
      father_name: '',
      emergency_contact_name: '',
      emergency_contact_number: '',
      emergency_contact_relationship: '',
      primary_id_type: '',
      id_number: '',
      philhealth_number: '',
      sss_number: '',
      tin_number: '',
      voters_id_number: '',
      voter_status: 'NOT_REGISTERED',
      precinct_number: '',
      occupation: '',
      employer: '',
      monthly_income: '',
      medical_conditions: '',
      allergies: '',
      senior_citizen: false,
      person_with_disability: false,
      disability_type: '',
      indigenous_people: false,
      indigenous_group: '',
      four_ps_beneficiary: false,
      four_ps_household_id: '',
      profile_photo_url: '',
    };
  }

  return {
    first_name: resident.first_name,
    last_name: resident.last_name,
    middle_name: resident.middle_name || '',
    suffix: resident.suffix || '',
    birth_date: resident.birth_date ? new Date(resident.birth_date).toISOString().slice(0, 10) : '',
    age: resident.age?.toString() || '',
    birth_place: resident.birth_place,
    gender: resident.gender as Gender || 'MALE',
    civil_status: resident.civil_status as CivilStatus || 'SINGLE',
    nationality: resident.nationality as Nationality || 'FILIPINO',
    religion: resident.religion as Religion || 'CATHOLIC',
    employment_status: resident.employment_status as EmploymentStatus || 'UNEMPLOYED',
    educational_attainment: resident.educational_attainment as EducationalAttainment || 'HIGH_SCHOOL',
    mobile_number: resident.mobile_number || '',
    landline_number: resident.landline_number || '',
    email_address: resident.email_address || '',
    house_number: resident.house_number || '',
    street: resident.street || '',
    complete_address: resident.complete_address,
    mother_name: resident.mother_name || '',
    father_name: resident.father_name || '',
    emergency_contact_name: resident.emergency_contact_name || '',
    emergency_contact_number: resident.emergency_contact_number || '',
    emergency_contact_relationship: resident.emergency_contact_relationship || '',
    primary_id_type: resident.primary_id_type || '',
    id_number: resident.id_number || '',
    philhealth_number: resident.philhealth_number || '',
    sss_number: resident.sss_number || '',
    tin_number: resident.tin_number || '',
    voters_id_number: resident.voters_id_number || '',
    voter_status: resident.voter_status || 'NOT_REGISTERED',
    precinct_number: resident.precinct_number || '',
    occupation: resident.occupation || '',
    employer: resident.employer || '',
    monthly_income: '', // Not in current schema
    medical_conditions: resident.medical_conditions || '',
    allergies: resident.allergies || '',
    senior_citizen: resident.senior_citizen || false,
    person_with_disability: resident.person_with_disability || false,
    disability_type: resident.disability_type || '',
    indigenous_people: resident.indigenous_people || false,
    indigenous_group: resident.indigenous_group || '',
    four_ps_beneficiary: resident.four_ps_beneficiary || false,
    four_ps_household_id: resident.four_ps_household_id || '',
    profile_photo_url: resident.profile_photo_url || '',
  };
};


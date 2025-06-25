import { z } from 'zod';
import { 
  CivilStatusSchema,
  EducationalAttainmentSchema,
  EmploymentStatusSchema,
  GenderSchema,
  IdTypeSchema,
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
  birth_place: z.string().min(1, 'residents.form.error.birthPlaceRequired'),

  gender: GenderSchema,
  civil_status: CivilStatusSchema,
  nationality: NationalitySchema,
  religion: ReligionSchema,
  educational_attainment: EducationalAttainmentSchema,
  school_attended: z.string().optional(),

  // Employment Information
  employment_status: EmploymentStatusSchema,
  occupation: z.string().optional(),
  employer: z.string().optional(),
  
  // Contact Information
  mobile_number: z.string().optional(),
  landline_number: z.string().optional(),
  email_address: z.union([z.string().email('residents.form.error.emailAddressValid'), z.literal('')]).optional(),

  // Address Information
  region: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  barangay: z.string().optional(),

  street_address: z.string().optional(),
  complete_address: z.string().min(1, 'residents.form.error.completeAddressRequired'),
  
  // Family Information
  mother_name: z.string().optional(),
  father_name: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_number: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  
  // Government IDs
  primary_id_type: z.union([IdTypeSchema, z.literal('')]).optional(),
  id_number: z.string().optional(),
  philhealth_number: z.string().optional(),
  sss_number: z.string().optional(),
  tin_number: z.string().optional(),

  voter_status: VoterStatusSchema,
  voters_id_number: z.string().optional(),
  precinct_number: z.string().optional(),
  
  // Health & Medical
  medical_conditions: z.string().optional(),
  allergies: z.string().optional(),
  
  // Special Classifications - Make all optional
  student: z.boolean().optional(),
  out_of_school_youth: z.boolean().optional(),

  lgbtq: z.boolean().optional(),
  sexuality: z.string().nullable().optional(),
  gender_identity: z.string().nullable().optional(),

  senior_citizen: z.boolean(),

  person_with_disability: z.boolean(),
  disability_type: z.string().nullable().optional(),

  indigenous_people: z.boolean(),
  indigenous_group: z.string().nullable().optional(),
  
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
      birth_place: '',

      gender: 'MALE',
      civil_status: 'SINGLE',
      nationality: 'FILIPINO',
      religion: 'CATHOLIC',
      educational_attainment: 'HIGH_SCHOOL',

      employment_status: 'UNEMPLOYED',
      occupation: '',
      employer: '',

      mobile_number: '',
      landline_number: '',
      email_address: '',

      region: '',
      province: '',
      city: '',
      barangay: '',

      street_address: '',
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

      voter_status: 'NOT_REGISTERED',
      voters_id_number: '',
      precinct_number: '',

      medical_conditions: '',
      allergies: '',

      senior_citizen: false,
      person_with_disability: false,
      disability_type: '',
      indigenous_people: false,
      indigenous_group: '',
      
      profile_photo_url: '',
    };
  }

  return {
    first_name: resident.first_name,
    last_name: resident.last_name,
    middle_name: resident.middle_name || '',
    suffix: resident.suffix || '',
    birth_date: resident.birth_date ? new Date(resident.birth_date).toISOString().slice(0, 10) : '',
    birth_place: resident.birth_place,

    gender: resident.gender as Gender || 'MALE',
    civil_status: resident.civil_status as CivilStatus || 'SINGLE',
    nationality: resident.nationality as Nationality || 'FILIPINO',
    religion: resident.religion as Religion || 'CATHOLIC',
    educational_attainment: resident.educational_attainment as EducationalAttainment || 'HIGH_SCHOOL',

    employment_status: resident.employment_status as EmploymentStatus || 'UNEMPLOYED',
    occupation: resident.occupation || '',
    employer: resident.employer || '',
    
    mobile_number: resident.mobile_number || '',
    landline_number: resident.landline_number || '',
    email_address: resident.email_address || '',

    region: resident.region || '',
    province: resident.province || '',
    city: resident.city || '',
    barangay: resident.barangay || '',
    
    street_address: resident.street_address || '',
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

    voter_status: resident.voter_status || 'NOT_REGISTERED',
    voters_id_number: resident.voters_id_number || '',
    precinct_number: resident.precinct_number || '',

    medical_conditions: resident.medical_conditions || '',
    allergies: resident.allergies || '',

    senior_citizen: resident.senior_citizen || false,
    person_with_disability: resident.person_with_disability || false,
    disability_type: resident.disability_type || '',
    indigenous_people: resident.indigenous_people || false,
    indigenous_group: resident.indigenous_group || '',

    profile_photo_url: resident.profile_photo_url || '',
  };
};


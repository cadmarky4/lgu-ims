// ============================================================================
// types/residents.ts - Zod schemas and type definitions
// ============================================================================

import { z } from 'zod';
import { ResidentFormDataSchema } from './residents-form.types';

// Enum schemas
export const GenderSchema = z.enum(['MALE', 'FEMALE']);

export const CivilStatusSchema = z.enum([
  'SINGLE',
  'MARRIED',
  'WIDOWED',
  'DIVORCED',
  'SEPARATED'
]);

export const EmploymentStatusSchema = z.enum([
  'EMPLOYED',
  'UNEMPLOYED',
  'SELF_EMPLOYED',
  'RETIRED',
  'STUDENT',
  'OFW'
]);

export const VoterStatusSchema = z.enum([
  'NOT_REGISTERED',
  'REGISTERED',
  'DECEASED',
  'TRANSFERRED'
]);

export const ResidentStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'DECEASED',
  'TRANSFERRED'
]);

export const IdTypeSchema = z.enum([
  'NATIONAL_ID',
  'PASSPORT',
  "DRIVER'S_LICENSE",
  "VOTER'S_ID",
  'PHILHEALTH_ID',
  'SSS_ID',
  'UMID'
]);

export const NationalitySchema = z.enum([
  'FILIPINO',
  'AMERICAN',
  'BRITISH',
  'CANADIAN',
  'AUSTRALIAN',
  'OTHER'
]);

export const ReligionSchema = z.enum([
  'CATHOLIC',
  'IGLESIA_NI_CRISTO',
  'EVANGELICAL',
  'PROTESTANT',
  'ISLAM',
  'BUDDHIST',
  'HINDU',
  'SEVENTH_DAY_ADVENTIST',
  'JEHOVAHS_WITNESS',
  'BORN_AGAIN_CHRISTIAN',
  'ORTHODOX',
  'JUDAISM',
  'ATHEIST',
  'AGLIPAYAN',
  'OTHER',
  'PREFER_NOT_TO_SAY'
]);

export const EducationalAttainmentSchema = z.enum([
  'ELEMENTARY',
  'HIGH_SCHOOL',
  'COLLEGE',
  'VOCATIONAL',
  'POST_GRADUATE',
  'DOCTORATE',
  'NOT_APPLICABLE',
  'PREFER_NOT_TO_SAY'
]);

// Household schema
export const HouseholdSchema = z.object({
  id: z.number(),
  household_number: z.string(),
  household_head_name: z.string(),
});

// Main Resident schema
export const ResidentSchema = ResidentFormDataSchema.extend({
  id: z.number(),

  four_ps_beneficiary: z.boolean(),
  four_ps_household_id: z.string().nullable().optional(),

  status: ResidentStatusSchema,
  
  created_at: z.string(),
  updated_at: z.string(),
});

// Query parameters schema
export const ResidentParamsSchema = z.object({
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),

  search: z.string().optional(),

  status: ResidentStatusSchema.optional(),
  gender: GenderSchema.optional(),
  civil_status: CivilStatusSchema.optional(),
  employment_status: EmploymentStatusSchema.optional(),
  voter_status: VoterStatusSchema.optional(),

  household_id: z.number().optional(),
  senior_citizen: z.boolean().optional(),
  person_with_disability: z.boolean().optional(),
  indigenous_people: z.boolean().optional(),
  four_ps_beneficiary: z.boolean().optional(),

  age_from: z.number().min(0).optional(),
  age_to: z.number().min(0).optional(),
});

// Statistics schemas
export const ResidentStatisticsSchema = z.object({
  total_residents: z.number(),
  active_residents: z.number(),
  inactive_residents: z.number(),

  senior_citizens: z.number(),
  pwd_residents: z.number(),
  four_ps_beneficiaries: z.number(),
  registered_voters: z.number(),

  male_residents: z.number(),
  female_residents: z.number(),

  by_age_group: z.record(z.number()),
  by_civil_status: z.record(z.number()),
  by_employment_status: z.record(z.number()),
});

export const AgeGroupStatisticsSchema = z.object({
  children: z.number(), // 0-17
  adults: z.number(),   // 18-59
  seniors: z.number(),  // 60+
  by_age_range: z.record(z.number()),
});

// Special lists response schema
export const SpecialListResponseSchema = z.object({
  data: z.array(ResidentSchema),
  count: z.number(),
});

// Type exports
export type Gender = z.infer<typeof GenderSchema>;
export type CivilStatus = z.infer<typeof CivilStatusSchema>;
export type EmploymentStatus = z.infer<typeof EmploymentStatusSchema>;
export type VoterStatus = z.infer<typeof VoterStatusSchema>;
export type ResidentStatus = z.infer<typeof ResidentStatusSchema>;
export type Nationality = z.infer<typeof NationalitySchema>;
export type Religion = z.infer<typeof ReligionSchema>;
export type EducationalAttainment = z.infer<typeof EducationalAttainmentSchema>;
export type IdType = z.infer<typeof IdTypeSchema>;
export type Household = z.infer<typeof HouseholdSchema>;
export type Resident = z.infer<typeof ResidentSchema>;
export type ResidentParams = z.infer<typeof ResidentParamsSchema>;
export type ResidentStatistics = z.infer<typeof ResidentStatisticsSchema>;
export type AgeGroupStatistics = z.infer<typeof AgeGroupStatisticsSchema>;
export type SpecialListResponse = z.infer<typeof SpecialListResponseSchema>;
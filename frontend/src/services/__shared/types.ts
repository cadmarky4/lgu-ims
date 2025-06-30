import { z } from 'zod';

export const GenderSchema = z.enum(['MALE', 'FEMALE']);
export const genders = GenderSchema.options;

export const CivilStatusSchema = z.enum([
  'SINGLE',
  'MARRIED',
  'WIDOWED',
  'DIVORCED',
  'SEPARATED'
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

export const NationalitySchema = z.enum([
  'FILIPINO',
  'AMERICAN',
  'BRITISH',
  'CANADIAN',
  'AUSTRALIAN',
  'OTHER'
]);

// Base API response schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string(),
    data: dataSchema.optional(),
    errors: z.record(z.array(z.string())).optional(),
  });

export const PaginationLinksSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean(),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    current_page: z.number(),
    last_page: z.number(),
    per_page: z.number(),
    total: z.number(),
    first_page_url: z.string(),
    from: z.number().nullable(),
    last_page_url: z.string(),
    links: z.array(PaginationLinksSchema),
    next_page_url: z.string().nullable(),
    path: z.string(),
    prev_page_url: z.string().nullable(),
    to: z.number().nullable(),
  });

// Type exports
export type ApiResponse<T = unknown> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>>;
export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<z.ZodType<T>>>>;
export type CivilStatus = z.infer<typeof CivilStatusSchema>;
export type EducationalAttainment = z.infer<typeof EducationalAttainmentSchema>;
export type Nationality = z.infer<typeof NationalitySchema>;

export const civilStatuses = CivilStatusSchema.options;
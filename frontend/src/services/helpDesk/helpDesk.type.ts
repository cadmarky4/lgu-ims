import { z } from 'zod';

export const TicketCategorySchema = z.enum(['APPOINTMENT', 'BLOTTER', 'COMPLAINT', 'SUGGESTION'])
export const PrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
// appointment status and base ticket status are one and the same now
export const StatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED'])
export const FeedbackCategorySchema = z.enum([
    'PUBLIC_SERVICES',
    'INFRASTRUCTURE',
    'SOCIAL_WELFARE',
    'PUBLIC_SAFETY',
    'HEALTH_SERVICES',
    'ENVIRONMENTAL',
    'EDUCATION',
    'BUSINESS_PERMITS',
    'COMMUNITY_PROGRAMS',
    'OTHERS'
])
export const TimeSlotsSchema = z.enum([
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
])

export const BaseTicketSchema = z.object({
    // PK, will be generated on the server-side
    id: z.string().uuid().optional(),
    // human readable ticket
    ticket_number: z.string().max(50),
    subject: z.string().min(1,'helpDesk.validation.subjectRequired').max(255),
    description: z.string().min(1,'helpDesk.validation.descriptionRequired'),
    priority: PrioritySchema,
    requester_name: z.string().min(1, 'helpDesk.validation.fullNameRequired').max(255,'helpDesk.appointmentsForm.validation.fullNameExceeded'),
    resident_id: z.string().uuid().nullable(),
    contact_number: z.string().length(11, 'helpDesk.validation.contactLengthValidation'),
    // email_address: z.string().email('helpDesk.validation.invalidEmailFormat').max(255).optional(),
    email_address: z.string()
        .max(255)
        .refine(val => val === '' || z.string().email().safeParse(val).success, {
            message: 'helpDesk.validation.invalidEmailFormat',
        })
        .optional(),
    complete_address: z.string().min(1,'helpDesk.validation.completeAddressRequired').max(255, 'helpDesk.validation.maxCharExcceeded'),
    category: TicketCategorySchema,
    status: StatusSchema,
    created_at: z.date(),
    updated_at: z.date(),
})

export type TicketCategory = z.infer<typeof TicketCategorySchema>
export type Priority = z.infer<typeof PrioritySchema>
export type Status = z.infer<typeof StatusSchema>
export type BaseTicket = z.infer<typeof BaseTicketSchema>
export type FeedbackCategory = z.infer<typeof FeedbackCategorySchema>
export type TimeSlots = z.infer<typeof TimeSlotsSchema>

export const timeSlotOptions = TimeSlotsSchema.options;
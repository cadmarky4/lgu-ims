import { z } from "zod";
import { DepartmentSchema } from "@/services/users/users.types";
import { BaseTicketSchema, timeSlotOptions, TimeSlotsSchema } from "../helpDesk.type";

export const BookedScheduleSchema = z.object({
  appointment_id: z.string().uuid(),
  date: z.string().min(1, 'helpDesk.appointmentsForm.validation.dateRequired'),
  time: TimeSlotsSchema,
  department: DepartmentSchema,
})

export const CheckScheduleAvailabilitySchema = BookedScheduleSchema.omit({
  appointment_id: true, // not really needed for checking as booked schedules will be unavailable everywhere (for now)
})

export const AppointmentSchema = z.object({
  id: z.string().uuid().optional(), // PK, will be generated on the server-side
  base_ticket_id: z.string().uuid(), // FK, MUST BE UNIQUE
  department: z.enum(DepartmentSchema.options, {
    errorMap: (issue, ctx) => ({ message: 'helpDesk.appointmentsForm.validation.invalidDepartment' })
  }),
  date: z.string().min(1, 'helpDesk.appointmentsForm.validation.dateRequired'),
  time: z.enum(timeSlotOptions, {
    errorMap: (issue, ctx) => ({ message: 'helpDesk.validation.invalidTimeSlots' })
  }),
  additional_notes: z.string().optional(),
})

export const ViewAppointmentSchema = z.object({
  ticket: BaseTicketSchema,
  appointment: AppointmentSchema,
})

export const CreateAppointmentSchema = z.object({
  ticket: BaseTicketSchema.omit({
    id: true, // AUTO GENERATED
    ticket_number: true, // AUTO GENERATED
    created_at: true, // AUTO GENERATED
    updated_at: true, // AUTO GENERATED
    status: true, // DEFAULTS TO 'OPEN'
  }).extend({
    resident_search: z.string().optional().nullable(),
    category: z.literal('APPOINTMENT')
  }),

  appointment: AppointmentSchema.omit({
    id: true, // AUTO GENERATED
    base_ticket_id: true, // AUTO GENERATED
  })
})

export const EditAppointmentSchema = z.object({
  ticket: BaseTicketSchema.partial().omit({
    id: true,           // Cannot change ID
    ticket_number: true, // Cannot change ticket number
    created_at: true,   // Cannot change creation date
    category: true      // Cannot change category type
  }),

  appointment: AppointmentSchema.partial().omit({ 
    id: true,        // Cannot change ID
    base_ticket_id: true  // Cannot change parent ticket reference
  })
})

export type BookedSchedule = z.infer<typeof BookedScheduleSchema>
export type Appointment = z.infer<typeof AppointmentSchema>
export type ViewAppointment = z.infer<typeof ViewAppointmentSchema>
export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>
export type EditAppointment = z.infer<typeof EditAppointmentSchema>
export type CheckScheduleAvailability = z.infer<typeof CheckScheduleAvailabilitySchema>

export const departments = DepartmentSchema.options;
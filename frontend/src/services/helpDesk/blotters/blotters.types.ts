// import { z } from "zod";
// import { BaseTicketFormDataSchema } from "../helpDesk.type";

// export const IncidentTypeSchema = z.enum([
//   'THEFT',
//   'PHYSICAL_ASSAULT',
//   'VERBAL_ASSAULT',
//   'PROPERTY_DAMAGE',
//   'DISTURBANCE',
//   'TRESPASSING',
//   'FRAUD',
//   'HARASSMENT',
//   'DOMESTIC_DISPUTE',
//   'NOISE_COMPLAINT',
//   'OTHER'
// ]);

// export const BlotterInvolvementSchema = z.enum([
//   'RESPONDENT',
//   'WITNESS',
//   'VICTIM',
//   'SUSPECT',
// ])

// export const OtherPeopleInvolvedSchema = z.object({
//   full_name: z.string().min(1).max(255),
//   address: z.string().max(255).nullable(),
// })

// export const SupportingDocumentsSchema = z.object({
//   blotter_id: z.string().uuid(),
//   url: z.string(),
// })

// export const BlotterFormDataSchema = BaseTicketFormDataSchema.extend({
//   type_of_incident: IncidentTypeSchema,
//   date_of_incident: z.string().min(1, 'helpDesk.blotterForm.validation.dateOfIncidentRequired'),
//   time_of_incident: z.string().min(1, 'helpDesk.blotterForm.validation.timeOfIncidentRequired'),
//   location_of_incident: z.string().min(1, 'helpDesk.blotterForm.validation.locationOfIncidentRequired'),
//   other_people_involved: z.array(OtherPeopleInvolvedSchema).optional().nullable(),
//   supporting_documents: z.array(SupportingDocumentsSchema).optional().nullable(),
// });

// export const BlotterSchema = BlotterFormDataSchema.pick({
//   type_of_incident: true,
//   date_of_incident: true,
//   time_of_incident: true,
//   location_of_incident: true,
// }).extend({
//   id: z.string().uuid(),
//   general_ticket_id: z.string().uuid(),
// });

// export type IncidentType = z.infer<typeof IncidentTypeSchema>;
// export type BlotterInvolvement = z.infer<typeof BlotterInvolvementSchema>;
// export type OtherPeopleInvolved = z.infer<typeof OtherPeopleInvolvedSchema>;
// export type SupportingDocuments = z.infer<typeof SupportingDocumentsSchema>;
// export type BlotterFormData = z.infer<typeof BlotterFormDataSchema>;
// export type Blotter = z.infer<typeof BlotterSchema>;
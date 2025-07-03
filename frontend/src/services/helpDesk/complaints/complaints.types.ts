// import { z } from "zod";
// import { FeedbackCategorySchema, BaseTicketFormDataSchema } from "../helpDesk.type";
// import { DepartmentSchema } from "@/services/users/users.types";

// export const ComplaintSupportingDocumentsSchema = z.object({
//   complaint_id: z.string().uuid(),
//   url: z.string(),
// });

// export const ComplaintFormDataSchema = BaseTicketFormDataSchema.extend({
//   requester_name: z.string().max(255).optional().nullable(),
//   category: FeedbackCategorySchema,
//   department: DepartmentSchema,
//   location: z.string().optional().nullable(),
//   supporting_documents: z.array(ComplaintSupportingDocumentsSchema).optional().nullable(),
// });

// export const ComplaintSchema = ComplaintFormDataSchema.pick({
//   requester_name: true,
//   category: true,
//   department: true,
//   location: true,
// }).extend({
//   id: z.string().uuid(),
//   general_ticket_id: z.string().uuid(),
// });

// export type ComplaintFormData = z.infer<typeof ComplaintFormDataSchema>;
// export type ComplaintSupportingDocuments = z.infer<typeof ComplaintSupportingDocumentsSchema>;
// export type ComplaintType = z.infer<typeof ComplaintSchema>;
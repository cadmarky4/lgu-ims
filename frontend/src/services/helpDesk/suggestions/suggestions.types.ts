// // Suggestion-specific types and interfaces
// import { z } from "zod";
// import { FeedbackCategorySchema, BaseTicketFormDataSchema } from "../helpDesk.type";

// export const SuggestionFormDataSchema = BaseTicketFormDataSchema.extend({
//   category: FeedbackCategorySchema,
//   expected_benefits: z.string().optional().nullable(),
//   implementation_ideas: z.string().optional().nullable(),
//   resources_needed: z.string().optional().nullable(),
// })

// export const SuggestionSchema = SuggestionFormDataSchema.pick({
//   category: true,
//   expected_benefits: true,
//   implementation_ideas: true,
//   resources_needed: true,
// }).extend({
//   id: z.string().uuid(),
//   general_ticket_id: z.string().uuid(),
// })

// export type SuggestionFormData = z.infer<typeof SuggestionFormDataSchema>;
// export type Suggestion = z.infer<typeof SuggestionSchema>;

// export type SuggestionPriority = 'low' | 'medium' | 'high';
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(4),
  description: z.string().min(1),
});

export type formSchemaType = z.infer<typeof formSchema>;

export const updateFormSchema = z.object({
  sumSOL: z
    .number()
    .min(1)
    .positive('The total number of lamports must be greater than 0'),
  SOLPerUser: z
    .number()
    .min(1)
    .positive('The number of lamports per respondent must be greater than 0'),
});
export type updateFormSchemaType = z.infer<typeof updateFormSchema>;
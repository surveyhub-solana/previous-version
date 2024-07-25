import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(4),
  description: z.string().optional(),
});

export type formSchemaType = z.infer<typeof formSchema>;

export const updateFormSchema = z.object({
  sumSOL: z.number().min(0, "sumSOL must be greater than or equal to 0"),
  SOLPerUser: z
    .number()
    .min(0, "SOLPerUser must be greater than or equal to 0"),
});

export type updateFormSchemaType = z.infer<typeof updateFormSchema>;
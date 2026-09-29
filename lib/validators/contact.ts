import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nom requis").max(100),
  email: z.email("Email invalide"),
  subject: z.string().max(120).optional(),
  body: z
    .string()
    .min(10, "Message trop court (10 caractères min)")
    .max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

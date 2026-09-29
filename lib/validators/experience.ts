import { z } from "zod";

export const experienceSchema = z.object({
  role: z.string().min(2, "Rôle requis").max(100),
  company: z.string().min(2, "Entreprise requise").max(100),
  period: z.string().min(4, "Période requise").max(60),
  summary: z.string().max(500).optional().nullable(),
  order: z.number().int().min(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

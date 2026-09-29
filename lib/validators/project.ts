import { z } from "zod";

const optionalUrl = z
  .string()
  .optional()
  .refine((v) => !v || /^https?:\/\/.+/.test(v), "URL invalide");

export const projectSchema = z.object({
  title: z.string().min(2, "Titre requis").max(120),
  slug: z
    .string()
    .min(2, "Slug requis")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (a-z, 0-9, tirets)"),
  excerpt: z.string().min(10, "Résumé trop court").max(300),
  content: z.string().min(1, "Contenu requis"),
  coverImage: optionalUrl,
  techs: z.array(z.string().min(1).max(40)).max(20),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int().min(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

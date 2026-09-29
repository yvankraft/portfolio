import { z } from "zod";

export const siteContentSchema = z.object({
  key: z.enum(["about", "hero"]),
  content: z.string().min(1, "Contenu requis").max(50_000),
});

export type SiteContentInput = z.infer<typeof siteContentSchema>;

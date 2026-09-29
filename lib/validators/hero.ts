import { z } from "zod";

export const heroContentSchema = z.object({
  title: z.string().min(2).max(120),
  subtitle: z.string().min(2).max(300),
});

export type HeroContent = z.infer<typeof heroContentSchema>;

export const defaultHero: HeroContent = {
  title: "Développeur full-stack",
  subtitle:
    "Je conçois et développe des applications web modernes, performantes et élégantes.",
};

export function parseHero(content: string | null): HeroContent {
  if (!content) return defaultHero;
  try {
    const parsed = heroContentSchema.safeParse(JSON.parse(content));
    return parsed.success ? parsed.data : defaultHero;
  } catch {
    return defaultHero;
  }
}

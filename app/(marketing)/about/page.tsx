import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about-section";
import { getExperiences, getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "À propos",
  description: "Qui je suis, ce que je fais.",
};

export default async function AboutPage() {
  const [content, experiences] = await Promise.all([
    getSiteContent("about"),
    getExperiences(),
  ]);
  return <AboutSection content={content} experiences={experiences} />;
}

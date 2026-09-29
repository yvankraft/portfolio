import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { Hero } from "@/components/sections/hero";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { getFeaturedProjects, getSiteContent } from "@/lib/queries";
import { parseHero } from "@/lib/validators/hero";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
};

export default async function HomePage() {
  const [heroRaw, projects] = await Promise.all([
    getSiteContent("hero"),
    getFeaturedProjects(3),
  ]);
  const hero = parseHero(heroRaw);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Hero title={hero.title} subtitle={hero.subtitle} />
      <ProjectsGrid projects={projects} showAllLink />

      <section className="border-t py-16">
        <FadeIn className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-serif text-3xl italic">Un projet en tête ?</h2>
          <p className="max-w-md text-muted-foreground">
            Discutons de vos besoins et voyons comment je peux vous aider.
          </p>
          <Link href="/contact" className={buttonVariants()}>
            Démarrer la conversation
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}

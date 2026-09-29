import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { ProjectCard } from "@/components/sections/project-card";
import type { Project } from "@/lib/generated/prisma/client";

type Props = {
  projects: Project[];
  heading?: string;
  description?: string;
  showAllLink?: boolean;
};

export function ProjectsGrid({
  projects,
  heading = "Projets sélectionnés",
  description = "Une sélection de réalisations récentes.",
  showAllLink = false,
}: Props) {
  return (
    <section className="border-t py-16">
      <FadeIn className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl italic">{heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {showAllLink && (
          <Link
            href="/projects"
            className="hidden text-sm text-primary hover:underline sm:block"
          >
            Tout voir →
          </Link>
        )}
      </FadeIn>
      {projects.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.08}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          Aucun projet publié pour l&apos;instant.
        </p>
      )}
    </section>
  );
}

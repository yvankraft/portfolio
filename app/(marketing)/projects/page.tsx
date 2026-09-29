import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { ProjectCard } from "@/components/sections/project-card";
import { getPublishedProjects } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projets",
  description: "Tous mes projets et réalisations.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { tech } = await searchParams;
  const projects = await getPublishedProjects();
  const allTechs = [...new Set(projects.flatMap((p) => p.techs))].sort();
  const activeTech = typeof tech === "string" ? tech : null;
  const filtered = activeTech
    ? projects.filter((p) => p.techs.includes(activeTech))
    : projects;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-4xl italic md:text-5xl">Projets</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {projects.length} projet(s) — applications, sites et outils.
        </p>
      </FadeIn>

      {allTechs.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/projects">
            <Badge
              variant={activeTech ? "secondary" : "default"}
              className={cn("cursor-pointer")}
            >
              Tous
            </Badge>
          </Link>
          {allTechs.map((t) => (
            <Link key={t} href={`/projects?tech=${encodeURIComponent(t)}`}>
              <Badge
                variant={activeTech === t ? "default" : "secondary"}
                className="cursor-pointer"
              >
                {t}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {filtered.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <FadeIn key={project.id} delay={Math.min(i, 6) * 0.05}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          Aucun projet pour ce filtre.
        </p>
      )}
    </div>
  );
}

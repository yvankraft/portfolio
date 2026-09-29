import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { getProjectBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return { title: "Projet introuvable" };
  return {
    title: project.title,
    description: project.excerpt,
    openGraph: project.coverImage
      ? { images: [{ url: project.coverImage }] }
      : undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.status !== "PUBLISHED") notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Tous les projets
        </Link>

        <h1 className="mt-6 font-serif text-4xl italic md:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{project.excerpt}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.techs.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants()}
            >
              <ExternalLink className="size-4" /> Voir le site
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <Code2 className="size-4" /> Code source
            </a>
          )}
        </div>
      </FadeIn>

      {project.coverImage && (
        <FadeIn className="mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full rounded-xl border object-cover"
          />
        </FadeIn>
      )}

      <FadeIn className="mt-10">
        <article
          className="prose prose-stone max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      </FadeIn>
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/lib/generated/prisma/client";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-colors group-hover:border-primary/50">
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={project.title}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-muted font-serif text-4xl italic text-muted-foreground">
            {project.title.charAt(0)}
          </div>
        )}
        <CardHeader className="flex-1">
          <CardTitle className="flex items-center justify-between gap-2 text-base">
            {project.title}
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {project.excerpt}
          </CardDescription>
          {project.techs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.techs.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}

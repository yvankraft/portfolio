import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Modifier le projet" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{project.title}</h1>
        <p className="text-sm text-muted-foreground">
          Modifier les informations du projet.
        </p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}

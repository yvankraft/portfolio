import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProjectsTable } from "@/components/admin/projects-table";
import { getAllProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Projets" };

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projets</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} projet(s) au total.
          </p>
        </div>
        <Link href="/admin/projects/new" className={buttonVariants()}>
          <Plus className="size-4" /> Nouveau projet
        </Link>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}

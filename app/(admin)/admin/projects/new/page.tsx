import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "Nouveau projet" };

export default function NewProjectPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Nouveau projet</h1>
        <p className="text-sm text-muted-foreground">
          Remplissez les informations du projet.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}

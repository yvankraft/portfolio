import type { Metadata } from "next";
import { ExperienceDialog } from "@/components/admin/experience-dialog";
import { ExperiencesTable } from "@/components/admin/experiences-table";
import { getExperiences } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Expérience" };

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl italic">Parcours</h1>
          <p className="text-sm text-muted-foreground">
            Timeline affichée sur la page À propos.
          </p>
        </div>
        <ExperienceDialog />
      </div>
      <ExperiencesTable data={experiences} />
    </div>
  );
}

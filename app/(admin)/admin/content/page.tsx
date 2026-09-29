import type { Metadata } from "next";
import { ContentForm } from "@/components/admin/content-form";
import { getSiteContent } from "@/lib/queries";
import { parseHero } from "@/lib/validators/hero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Contenu du site" };

export default async function AdminContentPage() {
  const [about, hero] = await Promise.all([
    getSiteContent("about"),
    getSiteContent("hero"),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Contenu du site</h1>
        <p className="text-sm text-muted-foreground">
          Modifiez les textes des pages publiques.
        </p>
      </div>
      <ContentForm aboutContent={about ?? ""} heroContent={parseHero(hero)} />
    </div>
  );
}

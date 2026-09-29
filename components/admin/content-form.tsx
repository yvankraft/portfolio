"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { updateSiteContent } from "@/app/actions/content";
import {
  heroContentSchema,
  type HeroContent,
} from "@/lib/validators/hero";

type Props = {
  aboutContent: string;
  heroContent: HeroContent;
};

export function ContentForm({ aboutContent, heroContent }: Props) {
  const router = useRouter();
  const [about, setAbout] = useState(aboutContent);
  const [hero, setHero] = useState<HeroContent>(heroContent);
  const [saving, setSaving] = useState<"about" | "hero" | null>(null);

  async function save(key: "about" | "hero") {
    setSaving(key);
    const content = key === "about" ? about : JSON.stringify(hero);
    const res = await updateSiteContent({ key, content });
    setSaving(null);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Contenu enregistré");
    router.refresh();
  }

  const heroValid = heroContentSchema.safeParse(hero).success;

  return (
    <div className="max-w-3xl space-y-10">
      <section className="space-y-4">
        <h2 className="font-semibold">Section hero (accueil)</h2>
        <div className="space-y-2">
          <Label htmlFor="hero-title">Titre</Label>
          <Input
            id="hero-title"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero-subtitle">Sous-titre</Label>
          <Input
            id="hero-subtitle"
            value={hero.subtitle}
            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
          />
        </div>
        <Button
          onClick={() => save("hero")}
          disabled={saving !== null || !heroValid}
        >
          {saving === "hero" && <Loader2 className="size-4 animate-spin" />}
          Enregistrer le hero
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">Page « À propos »</h2>
        <RichTextEditor value={about} onChange={setAbout} />
        <Button onClick={() => save("about")} disabled={saving !== null}>
          {saving === "about" && <Loader2 className="size-4 animate-spin" />}
          Enregistrer la page
        </Button>
      </section>
    </div>
  );
}

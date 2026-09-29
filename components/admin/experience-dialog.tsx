"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createExperience, updateExperience } from "@/app/actions/experiences";

export type ExperienceRow = {
  id: string;
  role: string;
  company: string;
  period: string;
  summary: string | null;
  order: number;
};

export function ExperienceDialog({ experience }: { experience?: ExperienceRow }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const editing = !!experience;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const input = {
      role: String(d.get("role")),
      company: String(d.get("company")),
      period: String(d.get("period")),
      summary: String(d.get("summary") ?? "") || null,
      order: Number(d.get("order")) || 0,
    };
    startTransition(async () => {
      const res = editing
        ? await updateExperience(experience.id, input)
        : await createExperience(input);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(editing ? "Expérience mise à jour" : "Expérience créée");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          editing ? (
            <Button variant="ghost" size="sm">
              Modifier
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="size-4" /> Nouvelle expérience
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Modifier l'expérience" : "Nouvelle expérience"}
          </DialogTitle>
          <DialogDescription>
            Affichée dans la timeline de la page À propos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="e-role">Rôle</Label>
              <Input
                id="e-role"
                name="role"
                defaultValue={experience?.role}
                placeholder="Développeur Full-Stack"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-company">Entreprise</Label>
              <Input
                id="e-company"
                name="company"
                defaultValue={experience?.company}
                placeholder="Acme"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="e-period">Période</Label>
              <Input
                id="e-period"
                name="period"
                defaultValue={experience?.period}
                placeholder="2022 — aujourd'hui"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-order">Ordre</Label>
              <Input
                id="e-order"
                name="order"
                type="number"
                min={0}
                defaultValue={experience?.order ?? 0}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="e-summary">Résumé</Label>
            <Textarea
              id="e-summary"
              name="summary"
              defaultValue={experience?.summary ?? ""}
              rows={3}
              placeholder="Missions principales…"
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {editing ? "Enregistrer" : "Créer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

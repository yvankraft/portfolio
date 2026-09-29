"use client";

import type {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ProjectInput } from "@/lib/validators/project";

type Props = {
  register: UseFormRegister<ProjectInput>;
  control: Control<ProjectInput>;
  errors: FieldErrors<ProjectInput>;
};

export function ProjectMetaFields({ register, control, errors }: Props) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="repoUrl">URL dépôt (optionnel)</Label>
          <Input
            id="repoUrl"
            placeholder="https://github.com/…"
            {...register("repoUrl")}
          />
          {errors.repoUrl && (
            <p className="text-xs text-destructive">{errors.repoUrl.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="liveUrl">URL site (optionnel)</Label>
          <Input id="liveUrl" placeholder="https://…" {...register("liveUrl")} />
          {errors.liveUrl && (
            <p className="text-xs text-destructive">{errors.liveUrl.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Statut</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Brouillon</SelectItem>
                  <SelectItem value="PUBLISHED">Publié</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Ordre d&apos;affichage</Label>
          <Input
            id="order"
            type="number"
            min={0}
            {...register("order", { valueAsNumber: true })}
          />
        </div>
        <div className="flex items-end gap-2 pb-1">
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Switch
                id="featured"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="featured">Mis en avant</Label>
        </div>
      </div>
    </>
  );
}

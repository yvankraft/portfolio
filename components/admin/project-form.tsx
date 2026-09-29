"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ProjectMetaFields } from "@/components/admin/project-meta-fields";
import { createProject, updateProject } from "@/app/actions/projects";
import { projectSchema, type ProjectInput } from "@/lib/validators/project";
import type { Project } from "@/lib/generated/prisma/client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      excerpt: project?.excerpt ?? "",
      content: project?.content ?? "",
      coverImage: project?.coverImage ?? "",
      techs: project?.techs ?? [],
      repoUrl: project?.repoUrl ?? "",
      liveUrl: project?.liveUrl ?? "",
      featured: project?.featured ?? false,
      status: project?.status ?? "DRAFT",
      order: project?.order ?? 0,
    },
  });

  async function onSubmit(data: ProjectInput) {
    const res = project
      ? await updateProject(project.id, data)
      : await createProject(data);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(project ? "Projet mis à jour" : "Projet créé");
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            {...register("title", {
              onChange: (e) => {
                if (!getValues("slug")) {
                  setValue("slug", slugify(e.target.value), {
                    shouldValidate: true,
                  });
                }
              },
            })}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Résumé</Label>
        <Textarea id="excerpt" rows={2} {...register("excerpt")} />
        {errors.excerpt && (
          <p className="text-xs text-destructive">{errors.excerpt.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Contenu</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Image de couverture</Label>
        <Controller
          name="coverImage"
          control={control}
          render={({ field }) => (
            <ImageUpload value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="techs">Technologies (séparées par des virgules)</Label>
        <Controller
          name="techs"
          control={control}
          render={({ field }) => (
            <Input
              id="techs"
              placeholder="Next.js, Prisma, Tailwind"
              value={field.value.join(", ")}
              onChange={(e) =>
                field.onChange(
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                )
              }
            />
          )}
        />
      </div>

      <ProjectMetaFields register={register} control={control} errors={errors} />

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {project ? "Enregistrer" : "Créer le projet"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}

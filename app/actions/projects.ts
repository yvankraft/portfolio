"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { projectSchema, type ProjectInput } from "@/lib/validators/project";

export type ActionResult = { ok: true } | { ok: false; error: string };

function normalize(data: ProjectInput) {
  return {
    ...data,
    coverImage: data.coverImage || null,
    repoUrl: data.repoUrl || null,
    liveUrl: data.liveUrl || null,
  };
}

function revalidateProjects() {
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function createProject(input: ProjectInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Données invalides" };

  const exists = await db.project.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (exists) return { ok: false, error: "Ce slug est déjà utilisé" };

  const project = await db.project.create({ data: normalize(parsed.data) });
  await logActivity("create", "project", project.id, project.title);
  revalidateProjects();
  return { ok: true };
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Données invalides" };

  const conflict = await db.project.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) return { ok: false, error: "Ce slug est déjà utilisé" };

  await db.project.update({ where: { id }, data: normalize(parsed.data) });
  await logActivity("update", "project", id, parsed.data.title);
  revalidateProjects();
  revalidatePath(`/projects/${parsed.data.slug}`);
  return { ok: true };
}

export async function deleteProjects(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  if (!ids.length) return { ok: false, error: "Aucune sélection" };
  await db.project.deleteMany({ where: { id: { in: ids } } });
  await logActivity("delete", "project", ids.join(","), `${ids.length} projet(s)`);
  revalidateProjects();
  return { ok: true };
}

export async function setProjectsStatus(
  ids: string[],
  status: "DRAFT" | "PUBLISHED",
): Promise<ActionResult> {
  await requireAdmin();
  if (!ids.length) return { ok: false, error: "Aucune sélection" };
  await db.project.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });
  await logActivity(
    status === "PUBLISHED" ? "publish" : "unpublish",
    "project",
    ids.join(","),
    `${ids.length} projet(s)`,
  );
  revalidateProjects();
  return { ok: true };
}

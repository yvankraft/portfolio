"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import {
  experienceSchema,
  type ExperienceInput,
} from "@/lib/validators/experience";

export type ActionResult = { ok: true } | { ok: false; error: string };

function revalidate() {
  revalidatePath("/admin/experience");
  revalidatePath("/about");
}

export async function createExperience(
  input: ExperienceInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Données invalides" };

  const exp = await db.experience.create({
    data: { ...parsed.data, summary: parsed.data.summary || null },
  });
  await logActivity("create", "experience", exp.id, exp.role);
  revalidate();
  return { ok: true };
}

export async function updateExperience(
  id: string,
  input: ExperienceInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Données invalides" };

  const exists = await db.experience.findUnique({ where: { id } });
  if (!exists) return { ok: false, error: "Expérience introuvable" };

  await db.experience.update({
    where: { id },
    data: { ...parsed.data, summary: parsed.data.summary || null },
  });
  await logActivity("update", "experience", id, parsed.data.role);
  revalidate();
  return { ok: true };
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  await requireAdmin();
  const exists = await db.experience.findUnique({ where: { id } });
  if (!exists) return { ok: false, error: "Expérience introuvable" };
  await db.experience.delete({ where: { id } });
  await logActivity("delete", "experience", id, exists.role);
  revalidate();
  return { ok: true };
}

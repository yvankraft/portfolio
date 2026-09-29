"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import {
  passwordSchema,
  profileSchema,
  type PasswordInput,
  type ProfileInput,
} from "@/lib/validators/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(input: ProfileInput): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Données invalides" };

  const conflict = await db.adminUser.findFirst({
    where: { email: parsed.data.email, NOT: { id: admin.id } },
  });
  if (conflict) return { ok: false, error: "Cet email est déjà utilisé" };

  await db.adminUser.update({ where: { id: admin.id }, data: parsed.data });
  await logActivity("update", "admin", admin.id, "profil");
  return { ok: true };
}

export async function updatePassword(
  input: PasswordInput,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalide" };
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    admin.passwordHash,
  );
  if (!valid) return { ok: false, error: "Mot de passe actuel incorrect" };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });
  await logActivity("update", "admin", admin.id, "mot de passe");
  return { ok: true };
}

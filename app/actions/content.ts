"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import {
  siteContentSchema,
  type SiteContentInput,
} from "@/lib/validators/content";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateSiteContent(
  input: SiteContentInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = siteContentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Contenu invalide" };

  await db.siteContent.upsert({
    where: { key: parsed.data.key },
    create: { key: parsed.data.key, content: parsed.data.content },
    update: { content: parsed.data.content },
  });
  await logActivity("update", "content", parsed.data.key);
  revalidatePath("/admin/content");
  revalidatePath(parsed.data.key === "about" ? "/about" : "/");
  return { ok: true };
}

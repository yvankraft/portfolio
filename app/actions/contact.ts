"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/resend";
import { env } from "@/lib/env";
import { SITE } from "@/lib/constants";
import { contactSchema, type ContactInput } from "@/lib/validators/contact";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function submitContact(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Données invalides" };
  if (parsed.data.website) return { ok: true }; // honeypot

  const ip = (await headers()).get("x-forwarded-for") ?? "local";
  if (!rateLimit(`contact:${ip}`, 3, 60_000).ok) {
    return { ok: false, error: "Trop de messages, réessayez plus tard" };
  }

  const message = await db.message.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      body: parsed.data.body,
    },
  });
  await logActivity("receive", "message", message.id, message.email);

  if (env.CONTACT_EMAIL_TO) {
    await sendEmail({
      to: env.CONTACT_EMAIL_TO,
      subject: `[${SITE.name}] Nouveau message de ${message.name}`,
      html: `<h2>Nouveau message</h2><p><strong>${message.name}</strong> (${message.email})</p><p><em>${message.subject ?? "Sans objet"}</em></p><p>${message.body}</p>`,
    });
  }

  revalidatePath("/admin/messages");
  return { ok: true };
}

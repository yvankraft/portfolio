"use server";

import { revalidatePath } from "next/cache";
import { render } from "@react-email/render";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sendEmail } from "@/lib/resend";
import { MessageReplyEmail } from "@/emails/message-reply";
import {
  messageStatusSchema,
  replySchema,
  type MessageStatusInput,
  type ReplyInput,
} from "@/lib/validators/message";
import type { ActionResult } from "@/app/actions/contact";

export async function setMessageStatus(
  id: string,
  status: MessageStatusInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = messageStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: "Statut invalide" };
  await db.message.update({ where: { id }, data: { status: parsed.data } });
  await logActivity("update-status", "message", id, parsed.data);
  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function deleteMessages(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  if (!ids.length) return { ok: false, error: "Aucune sélection" };
  await db.message.deleteMany({ where: { id: { in: ids } } });
  await logActivity("delete", "message", ids.join(","), `${ids.length} message(s)`);
  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function replyToMessage(
  id: string,
  input: ReplyInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Réponse invalide" };

  const message = await db.message.findUnique({ where: { id } });
  if (!message) return { ok: false, error: "Message introuvable" };

  const html = await render(
    MessageReplyEmail({
      name: message.name,
      reply: parsed.data.reply,
      original: message.body,
    }),
  );

  const result = await sendEmail({
    to: message.email,
    subject: `Re : ${message.subject ?? "votre message"}`,
    html,
  });
  if (!result.ok) return result;

  await db.message.update({
    where: { id },
    data: { reply: parsed.data.reply, repliedAt: new Date(), status: "READ" },
  });
  await logActivity("reply", "message", id, message.email);
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
  return { ok: true };
}

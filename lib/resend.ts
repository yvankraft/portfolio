import { Resend } from "resend";
import { env } from "@/lib/env";

let client: Resend | null = null;

export function getResend(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  client ??= new Resend(env.RESEND_API_KEY);
  return client;
}

type SendParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(
  params: SendParams,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResend();
  if (!resend) return { ok: false, error: "RESEND_API_KEY non configurée" };

  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    ...params,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

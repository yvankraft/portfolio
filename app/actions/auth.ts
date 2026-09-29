"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators/auth";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Identifiants invalides" };

  const ip = (await headers()).get("x-forwarded-for") ?? "local";
  if (!rateLimit(`login:${ip}`, 5, 60_000).ok) {
    return { error: "Trop de tentatives, réessayez dans une minute" };
  }

  const next = formData.get("next");
  const redirectTo =
    typeof next === "string" && next.startsWith("/") ? next : "/admin";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect" };
    }
    throw error;
  }
  return {};
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

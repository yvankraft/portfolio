import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.url().default("http://localhost:3000"),
    ADMIN_EMAIL: z.email().default("admin@example.com"),
    ADMIN_PASSWORD: z.string().min(8).default("password123"),
    RESEND_API_KEY: z.string().optional(),
    CONTACT_EMAIL_TO: z
      .union([z.email(), z.literal("")])
      .optional(),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

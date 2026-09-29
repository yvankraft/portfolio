import type { NextAuthConfig } from "next-auth";

/**
 * Configuration partagée, compatible edge (middleware).
 * Ne pas importer Prisma/bcrypt ici — c'est fait dans lib/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      if (auth?.user) return true;
      const url = new URL("/login", request.nextUrl.origin);
      url.searchParams.set("next", request.nextUrl.pathname);
      return Response.redirect(url);
    },
  },
  providers: [],
} satisfies NextAuthConfig;

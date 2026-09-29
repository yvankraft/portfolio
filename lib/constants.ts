export const SITE = {
  name: "Yvan Martin",
  title: "Yvan Martin — Développeur full-stack",
  description:
    "Développeur full-stack basé à Paris. Je conçois des applications web modernes avec Next.js, TypeScript et PostgreSQL.",
  email: "hello@example.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/projects", label: "Projets" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

export const SOCIAL_LINKS = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://linkedin.com", label: "LinkedIn" },
] as const;

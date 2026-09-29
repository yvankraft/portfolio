import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});
const db = new PrismaClient({ adapter });

const projects = [
  {
    title: "Refonte e-commerce",
    slug: "refonte-ecommerce",
    excerpt: "Refonte complète d'une boutique en ligne avec Next.js et Stripe.",
    content:
      "<h2>Contexte</h2><p>Migration d'une boutique legacy vers une stack moderne.</p><h2>Stack</h2><p>Next.js, Stripe, Prisma, PostgreSQL.</p><h2>Résultats</h2><p>+40% de conversion, LCP sous 1,5 s.</p>",
    techs: ["Next.js", "Stripe", "Prisma", "Tailwind"],
    liveUrl: "https://example.com",
    featured: true,
    status: "PUBLISHED" as const,
    order: 1,
  },
  {
    title: "Dashboard SaaS analytics",
    slug: "dashboard-saas-analytics",
    excerpt: "Tableau de bord temps réel pour une plateforme SaaS B2B.",
    content:
      "<h2>Contexte</h2><p>Visualisation de métriques produit en temps réel.</p><h2>Stack</h2><p>Next.js, Recharts, TanStack Query.</p>",
    techs: ["Next.js", "Recharts", "TypeScript"],
    featured: true,
    status: "PUBLISHED" as const,
    order: 2,
  },
  {
    title: "Application mobile fitness",
    slug: "app-mobile-fitness",
    excerpt: "App de suivi sportif avec programmes personnalisés.",
    content:
      "<h2>Contexte</h2><p>Application React Native pour une salle de sport.</p>",
    techs: ["React Native", "Expo", "Supabase"],
    featured: true,
    status: "PUBLISHED" as const,
    order: 3,
  },
  {
    title: "Site vitrine architecte",
    slug: "site-vitrine-architecte",
    excerpt: "Portfolio immersif pour un cabinet d'architecture.",
    content:
      "<h2>Contexte</h2><p>Site vitrine avec galeries plein écran et animations.</p>",
    techs: ["Next.js", "Motion", "Sanity"],
    liveUrl: "https://example.com",
    featured: false,
    status: "PUBLISHED" as const,
    order: 4,
  },
  {
    title: "API réservation hôtelière",
    slug: "api-reservation-hotel",
    excerpt: "API de réservation multi-canal pour un groupe hôtelier.",
    content:
      "<h2>Contexte</h2><p>Synchronisation des réservations entre channels.</p>",
    techs: ["Node.js", "Prisma", "PostgreSQL", "Redis"],
    repoUrl: "https://github.com/example/api",
    featured: false,
    status: "PUBLISHED" as const,
    order: 5,
  },
  {
    title: "Outil interne de facturation",
    slug: "outil-facturation",
    excerpt: "Génération automatique de factures PDF récurrentes.",
    content: "<h2>Contexte</h2><p>Outil interne en cours de développement.</p>",
    techs: ["Next.js", "Prisma"],
    featured: false,
    status: "DRAFT" as const,
    order: 6,
  },
];

const messages = [
  ["Marie Dupont", "marie@example.com", "Refonte de notre site", "Bonjour, nous cherchons un développeur pour refaire notre site vitrine. Seriez-vous disponible ?"],
  ["Thomas Leroy", "thomas@example.com", "Mission freelance", "Nous avons un projet Next.js de 3 mois. Pouvez-vous m'envoyer votre CV ?"],
  ["Sophie Bernard", "sophie@example.com", null, "J'ai vu votre portfolio, très beau travail ! Je vous contacte pour une potentielle collaboration."],
  ["Lucas Moreau", "lucas@example.com", "Question tarifs", "Quels sont vos tarifs pour un site e-commerce simple ?"],
] as const;

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "password123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await db.adminUser.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
    },
    update: {},
  });

  await db.siteContent.upsert({
    where: { key: "hero" },
    create: {
      key: "hero",
      content: JSON.stringify({
        title: "Développeur full-stack",
        subtitle:
          "Je conçois et développe des applications web modernes, performantes et élégantes.",
      }),
    },
    update: {},
  });

  await db.siteContent.upsert({
    where: { key: "about" },
    create: {
      key: "about",
      content:
        "<h2>Qui je suis</h2><p>Développeur full-stack basé à Paris, j'accompagne startups et PME dans la création de produits web sur mesure.</p><h2>Compétences</h2><ul><li>Next.js, React, TypeScript</li><li>Node.js, Prisma, PostgreSQL</li><li>Tailwind CSS, design systems</li><li>Stripe, intégrations API</li></ul><h2>Approche</h2><p>Code propre, tests, performance et accessibilité dès le premier jour.</p>",
    },
    update: {},
  });

  for (const project of projects) {
    await db.project.upsert({
      where: { slug: project.slug },
      create: project,
      update: {},
    });
  }

  await db.message.deleteMany();
  for (const [name, email, subject, body] of messages) {
    await db.message.create({
      data: { name, email, subject, body },
    });
  }

  await db.activityLog.create({
    data: { action: "seed", entity: "database", detail: "Données initiales" },
  });

  
  const experiences = [
    ["Développeur Full-Stack", "Studio Meridian", "2023 — aujourd'hui", "Conception et développement d'applications Next.js pour des clients e-commerce et SaaS.", 0],
    ["Développeur Front-End", "Agence Pixel", "2021 — 2023", "Sites vitrines, design systems, intégrations headless.", 1],
    ["Développeur Junior", "Webcraft", "2019 — 2021", "Maintenance et nouvelles fonctionnalités sur des applications métier.", 2],
    ["Stage développement", "Freelance", "2018 — 2019", "Premiers projets : sites WordPress, scripts Node.js.", 3],
  ] as const;
  for (const [role, company, period, summary, order] of experiences) {
    const exists = await db.experience.findFirst({ where: { role, company } });
    if (!exists) {
      await db.experience.create({ data: { role, company, period, summary, order } });
    }
  }

console.log(`Seed terminé : ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

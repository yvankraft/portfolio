# Portfolio — squelette complet

Site personnel **complet et livrable** : front public (accueil, projets,
à propos, contact) + back-office admin protégé (CRUD projets, boîte de
réception des messages, édition de contenu, paramètres, logs d'activité).

## Stack

- Next.js (App Router) + Turbopack, TypeScript strict
- Tailwind CSS v4 + shadcn/ui (preset base-ui), next-themes
- Prisma 7 + PostgreSQL (driver adapter `@prisma/adapter-pg`)
- Auth : NextAuth v5 (credentials, JWT) — admin unique en DB (`AdminUser` + bcrypt)
- TanStack Table (tri, filtres, pagination, actions groupées), Recharts
- Tiptap (rich text), react-hook-form + zod, Server Actions
- Resend + React Email (réponses aux messages), Vercel Blob (upload images)
- pnpm

## Démarrage

```bash
cp .env.example .env    # renseigner DATABASE_URL et NEXTAUTH_SECRET
pnpm install
pnpm db:push            # crée les tables
pnpm db:seed            # données d'exemple + admin
pnpm dev
```

- Site public : http://localhost:3000
- Admin : http://localhost:3000/admin (redirige vers `/login`)

## Credentials (seed)

| Rôle  | Email               | Mot de passe |
|-------|---------------------|--------------|
| Admin | `admin@example.com` | `password123` |

## Variables d'environnement

| Variable               | Obligatoire | Usage                                   |
|------------------------|-------------|-----------------------------------------|
| `DATABASE_URL`         | Oui         | PostgreSQL                              |
| `NEXTAUTH_SECRET`      | Oui         | Secret de session NextAuth (min 32)     |
| `NEXTAUTH_URL`         | Non         | URL de l'app (défaut localhost:3000)    |
| `ADMIN_EMAIL`          | Non         | Email du compte admin au seed           |
| `ADMIN_PASSWORD`       | Non         | Mot de passe du compte admin au seed    |
| `RESEND_API_KEY`       | Non         | Réponses email + notifications          |
| `CONTACT_EMAIL_TO`     | Non         | Destinataire des notifications contact  |
| `BLOB_READ_WRITE_TOKEN`| Non         | Upload d'images projets                 |
| `NEXT_PUBLIC_SITE_URL` | Non         | SEO, sitemap (défaut localhost:3000)    |

## Schéma DB

```
AdminUser ─────────────────────────────
  id, email*, name, passwordHash, timestamps

Project ───────────────────────────────
  id, title, slug*, excerpt, content(HTML),
  coverImage, techs[], repoUrl, liveUrl,
  featured, status(DRAFT|PUBLISHED), order

Message ───────────────────────────────
  id, name, email, subject, body,
  status(NEW|READ|ARCHIVED), reply, repliedAt

SiteContent ───────────────────────────
  id, key* ("about"|"hero"), content, updatedAt

ActivityLog ───────────────────────────
  id, action, entity, entityId, detail, createdAt
```

## Structure

- `app/(marketing)` — pages publiques
- `app/(auth)/login` — connexion admin
- `app/(admin)/admin` — back-office (protégé par `middleware.ts` + `requireAdmin`)
- `app/api/auth/[...nextauth]` — handlers NextAuth
- `app/api/upload` — upload d'images (Vercel Blob)
- `app/actions` — Server Actions (zod-validées, rôle vérifié)
- `components/admin` — DataTable, StatCard, charts, forms, sidebar
- `components/sections` — hero, projects-grid, about-section, contact-form
- `lib/queries.ts` — lectures DB
- `prisma/seed.ts` — admin + 6 projets + 4 messages + contenus

## État d'avancement

Complet : front public, admin (dashboard, projets, messages, contenu,
activité, paramètres), middleware auth, seed, sitemap/robots, dark mode.
`pnpm typecheck` et `pnpm build` doivent passer — voir TODO.md.

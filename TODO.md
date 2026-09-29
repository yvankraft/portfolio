# TODO — Portfolio

## Avant livraison client

- [ ] Remplacer les textes par défaut (nom, bio, liens sociaux dans
      `public-header` / `public-footer` / page contact)
- [ ] Renseigner `NEXT_PUBLIC_SITE_URL` en production
- [ ] Générer un vrai `AUTH_SECRET` (`openssl rand -hex 32`)
- [ ] Configurer `RESEND_API_KEY` + domaine expéditeur vérifié
      (remplacer `onboarding@resend.dev` dans `lib/actions/messages.ts`)
- [ ] Configurer `BLOB_READ_WRITE_TOKEN` (Vercel Blob)
- [ ] Notifications email à l'admin à la réception d'un message
- [ ] OG image dynamique (`app/opengraph-image.tsx`)
- [ ] `next/image` partout si domaines d'images connus (remotePatterns)

## Améliorations possibles

- [ ] Réordonnancement drag & drop des projets
- [ ] Galerie d'images multiples par projet
- [ ] Export CSV des messages
- [ ] RSS / feed des projets
- [ ] Tests e2e (Playwright) sur parcours contact + login admin

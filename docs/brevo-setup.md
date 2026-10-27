# Mise en ligne de la liste d'attente — Brevo, Turnstile, Cloudflare

Ce qu'il faut configurer **une fois** pour que le formulaire enregistre de vraies inscriptions.
Tant que rien n'est configuré : en local, l'envoi est simulé ; en production, le formulaire répond « momentanément indisponible ».

## 1. Brevo

1. Créer un compte sur brevo.com (offre gratuite suffisante pour démarrer).
2. **Contacts → Listes** : créer trois listes et noter leur numéro (ID) :
   - `Liste d'attente` → `BREVO_LIST_WAITLIST`
   - `Pionniers` → `BREVO_LIST_PIONEERS` (formulaires dédiés, plus tard)
   - `Agents` → `BREVO_LIST_AGENTS` (plus tard)
3. **Contacts → Paramètres → Attributs** : créer ces attributs de type *Texte* (le site les remplit) :
   `CITY`, `PROFILE`, `MOTIVATION`, `LOCALE`, `SOURCE`, `WHATSAPP` (si absent).
   `FIRSTNAME` existe déjà.
4. **SMTP & API → Clés API** : créer une clé → `BREVO_API_KEY`.
5. *(Facultatif, recommandé)* **Double opt-in** : créer un modèle d'email de confirmation
   (Campagnes → Modèles, avec le lien `{{ doubleoptin }}`) et noter son ID → `BREVO_DOI_TEMPLATE_ID`.
   Sans ce modèle, les inscrits par email rejoignent la liste directement.
   Les inscrits par WhatsApp seul rejoignent toujours la liste directement.

## 2. Cloudflare Turnstile (anti-robot)

1. Tableau de bord Cloudflare → **Turnstile** → *Add widget*, domaine `mboa.cm` (et `localhost` pour les tests).
2. Mode : *Managed*.
3. Noter la **Site Key** (publique) → `PUBLIC_TURNSTILE_SITE_KEY`
   et la **Secret Key** → `TURNSTILE_SECRET_KEY`.

## 3. Où mettre les valeurs

| Valeur | Local | Production |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_SITE_URL`, `PUBLIC_CF_ANALYTICS_TOKEN` | `.env` (voir `.env.example`) | Variables de build du projet Workers |
| `TURNSTILE_SECRET_KEY`, `BREVO_API_KEY`, `BREVO_LIST_*`, `BREVO_DOI_TEMPLATE_ID` | `.dev.vars` (voir `.dev.vars.example`) | `npx wrangler secret put <NOM>` |

Ne jamais commiter `.env` ni `.dev.vars`.

## 4. Vérifier

1. `npm run dev`, ouvrir `/liste-d-attente`, s'inscrire avec une adresse de test.
2. Le contact apparaît dans la liste Brevo avec ses attributs.
3. Au-delà de 50 inscrits (`waitlist.counterFloor` dans `site.yaml`), le compteur s'affiche sur la page.

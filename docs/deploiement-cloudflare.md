# Mettre le site Mboa en ligne sur Cloudflare — guide pas à pas

Ce guide te fait passer de « le site tourne sur mon Mac » à « le site est en ligne sur `https://mboacm.com`, se redéploie tout seul à chaque mise en production, et la liste d'attente enregistre de vraies inscriptions ».

Compte **2 à 3 heures** la première fois, en plusieurs sessions possibles. La seule étape qui peut faire attendre est la propagation DNS : de quelques minutes à 24 heures.

> **Libellés du tableau de bord Cloudflare.** Cloudflare renomme parfois ses menus. Si un libellé diffère un peu, cherche le plus proche : la logique ne change pas.

---

## Vue d'ensemble

```
Phase 0  Préparer le code (moi)                       ← branche feature/domain-mboacm
Phase 1  Compte Cloudflare + domaine mboacm.com        ← toi, ~30 min (+ propagation DNS)
Phase 2  Email pro contact@mboacm.com                  ← toi, ~20 min
Phase 3  Clés des services : Turnstile, Brevo, stats   ← toi, ~40 min
Phase 4  Premier déploiement depuis ton Mac            ← toi (je peux t'accompagner), ~20 min
Phase 5  Brancher le domaine sur le site               ← ~15 min
Phase 6  Déploiement automatique depuis GitHub         ← ~20 min
Phase 7  Mise en production (release 1.0.0)           ← ~10 min
Phase 8  Vérifications après lancement                 ← ~30 min
Phase 9  Au quotidien : modifier, revenir en arrière, surveiller
```

### Ce qu'il faut avoir sous la main

| Élément | Où |
|---|---|
| Accès au compte chez qui `mboacm.com` a été acheté (le « registraire ») | Email de confirmation d'achat du domaine |
| Compte Cloudflare (le même que pour R2, si R2 est déjà utilisé) | dash.cloudflare.com |
| Compte GitHub qui possède `Sipoufo/mboa_site` | github.com |
| Compte Brevo | brevo.com |
| Un téléphone Android et un iPhone | Pour tester le QR code et le formulaire |
| Le terminal de ton Mac, dans le dossier du site | `cd "/Users/lvmmarket/develop/personal/mboa/site vitrine"` |

### Combien ça coûte

| Poste | Prix |
|---|---|
| Hébergement (Cloudflare Workers, offre gratuite) | 0 €. Les pages statiques ne sont pas comptées ; 100 000 appels d'API par jour inclus |
| Turnstile (anti-robot) | 0 € |
| Web Analytics | 0 € |
| Email Routing (adresse contact@) | 0 € |
| Brevo, offre gratuite | 0 € (300 emails par jour, contacts illimités) |
| Domaine `.com` | environ 10 € par an |

---

## Phase 0 — Préparer le code (c'est moi qui le fais)

La branche `feature/domain-mboacm` est commencée. Avant toute mise en ligne, elle doit contenir :

| # | Changement | État |
|---|---|---|
| 0.1 | Remplacer `mboacm.com` par `mboacm.com` partout : configuration, robots.txt, sitemap, tests | ✅ fait, pas encore commité |
| 0.2 | Désactiver les « sessions » Astro, sinon Cloudflare exige un espace de stockage KV inutile | ✅ fait, pas encore commité |
| 0.3 | Redirection du QR code : `mboacm.com/carte` vers `/liste-d-attente?source=carte` (fichier `public/_redirects`) | ⏳ à faire |
| 0.4 | Remplir `site.yaml` : `contact.email = contact@mboacm.com`, `contact.whatsapp = +237 695 91 49 26` (et `phone` si c'est le même numéro) | ⏳ à faire, j'attends ta confirmation du numéro WhatsApp |
| 0.5 | Déclarer le domaine dans `wrangler.jsonc` (`routes` → `mboacm.com` en domaine personnalisé) | ⏳ à faire |
| 0.6 | Fichier `.node-version` (Node 22) pour que la compilation sur Cloudflare utilise la bonne version | ⏳ à faire |
| 0.7 | Les adresses de prévisualisation (`*.workers.dev`) répondent « ne pas indexer » à Google | ⏳ à faire |
| 0.8 | Tests, puis fusion dans `develop` et envoi sur GitHub | ⏳ à faire |

👉 **Tu n'as rien à faire ici.** Dis-moi « termine la phase 0 » et je m'en occupe.

**Décision à prendre avant le lancement.** Les pages légales afficheront `[à compléter]` tant que le RCCM, l'adresse du siège et les emails légaux sont vides dans `site.yaml`. Tu peux :

- **(a)** lancer quand même, c'est honnête mais visible ;
- **(b)** remplir avec ce que tu as. Par exemple `privacyEmail` et `supportEmail` = `contact@mboacm.com`, et le RCCM plus tard.

Je recommande **(b)** pour les emails.

---

## Phase 1 — Compte Cloudflare et domaine

### 1.1 Sécuriser le compte Cloudflare

1. Va sur **https://dash.cloudflare.com** et connecte-toi. Si tu n'as pas de compte, clique sur **Sign up**.
2. Clique sur ton avatar en haut à droite, puis **My Profile**, puis **Authentication**.
3. Active la **Two-Factor Authentication** (application Google Authenticator, Authy ou 1Password).
4. Garde les **codes de secours** dans ton gestionnaire de mots de passe.

> Pourquoi c'est important : ce compte contrôlera le domaine, le site et les emails. Le perdre, c'est perdre tout ça.

### 1.2 Le domaine `mboacm.com` est-il déjà acheté ?

**Cas A — Il n'est pas encore acheté.** Achète-le directement chez Cloudflare, c'est le plus simple :

1. Dans le menu de gauche, ouvre **Domain Registration**, puis **Register Domains**.
2. Cherche `mboacm.com`, ajoute-le au panier et paie (prix coûtant, environ 10 € par an).
3. Active **Auto-renew**. Un domaine qui expire, c'est le site et les emails qui tombent.
4. Le domaine apparaît directement dans ton compte, avec les DNS déjà chez Cloudflare. **Passe directement à la Phase 2.**

**Cas B — Il est acheté ailleurs** (OVH, GoDaddy, Namecheap, Hostinger…). On garde ce registraire, mais on confie les DNS à Cloudflare. Suis les étapes 1.3 à 1.6.

### 1.3 Avant de toucher à quoi que ce soit : photographier les DNS actuels

C'est l'étape qui évite de **casser tes emails**.

1. Connecte-toi chez ton registraire et ouvre la zone DNS de `mboacm.com`.
2. **Fais une capture d'écran de tous les enregistrements**, surtout :
   - les **MX**, qui disent où arrivent les emails de `contact@mboacm.com` ;
   - les **TXT** commençant par `v=spf1`, `google-site-verification`, `brevo-code`, `v=DMARC1` ;
   - les **CNAME** contenant `domainkey`, qui servent à la signature des emails.
3. Note **où est hébergée la boîte `contact@mboacm.com`** : Gmail / Google Workspace, Zoho, la messagerie du registraire, ou nulle part encore.

### 1.4 Ajouter le domaine à Cloudflare

1. Dans Cloudflare, menu de gauche : **Account Home**, puis **+ Add** (ou **Add a domain**).
2. Saisis `mboacm.com`, laisse « Quick scan for DNS records » coché, puis **Continue**.
3. Choisis l'offre **Free**.
4. Cloudflare affiche les enregistrements qu'il a trouvés. **Compare-les avec ta capture de l'étape 1.3** :
   - tous les **MX** et **TXT** doivent être là ;
   - s'il en manque un, ajoute-le à la main avec **Add record** ;
   - les MX et TXT restent en **DNS only** (nuage gris) : c'est normal et obligatoire.
5. S'il existe des enregistrements **A** ou **CNAME** pour `mboacm.com` ou `www` qui pointent vers une ancienne page parking du registraire, **supprime-les**. Le site les remplacera en Phase 5.
6. Clique sur **Continue**. Cloudflare affiche **deux serveurs de noms**, du type `xxxx.ns.cloudflare.com` et `yyyy.ns.cloudflare.com`. Note-les.

### 1.5 Changer les serveurs de noms chez le registraire

1. Chez ton registraire, cherche « Serveurs DNS », « Nameservers » ou « Serveurs de noms ».
2. Choisis **DNS personnalisés** et remplace les serveurs existants par les deux de Cloudflare.
3. Si l'option **DNSSEC** est activée chez le registraire, **désactive-la d'abord**. Sinon, le domaine devient injoignable pendant la bascule. On la réactivera à l'étape 1.6.
4. Enregistre.

### 1.6 Attendre l'activation, puis régler la sécurité

1. Retourne dans Cloudflare et clique sur **Check nameservers now**. L'activation prend de 5 minutes à 24 heures, et tu reçois un email « mboacm.com is now active on Cloudflare ».
2. Une fois actif, ouvre la page du domaine, puis **SSL/TLS** :
   - **Overview** : mode **Full (strict)** ;
   - **Edge Certificates** : active **Always Use HTTPS** et **Automatic HTTPS Rewrites** ;
   - **Minimum TLS Version** : **TLS 1.2**.
3. **DNS**, puis **Settings** : active **DNSSEC**. Cloudflare donne un enregistrement **DS** à recopier chez le registraire, dans la rubrique DNSSEC. Cette étape est facultative mais recommandée.
4. **N'active pas encore HSTS.** On le fera après une semaine sans problème (Phase 9).

✅ **Fin de phase 1** : `mboacm.com` apparaît « Active » dans Cloudflare, et tes emails existants fonctionnent toujours. Envoie-toi un email de test pour le vérifier.

---

## Phase 2 — Email pro `contact@mboacm.com`

### 2.1 Si tu n'as pas encore de boîte mail pour `contact@`

Cloudflare **Email Routing** redirige gratuitement `contact@mboacm.com` vers ta boîte personnelle (Gmail, etc.).

1. Page du domaine, puis **Email**, puis **Email Routing**, puis **Get started**.
2. **Custom address** : `contact`. **Destination** : ton adresse personnelle.
3. Cloudflare envoie un email de vérification à ton adresse personnelle : clique sur le lien.
4. Cloudflare propose d'**ajouter les enregistrements MX et SPF** : accepte (**Add records and enable**).
5. Test : depuis un autre compte, écris à `contact@mboacm.com`. Le message doit arriver dans ta boîte personnelle.

> **Si tu as déjà une boîte** (Google Workspace, Zoho…), ne fais **pas** cette étape : les MX recopiés en 1.4 suffisent.

> **Pour répondre « en tant que » contact@mboacm.com** depuis Gmail, il faut un service d'envoi. Email Routing ne fait que recevoir. Le plus simple est de passer par le SMTP de Brevo (étape 2.2) et de l'ajouter dans Gmail, rubrique Paramètres, puis Comptes, puis « Envoyer des e-mails en tant que ». On peut le faire plus tard.

### 2.2 Authentifier le domaine dans Brevo

Sans cette étape, les emails de confirmation de la liste d'attente risquent de **finir en spam**.

1. Brevo, puis ton nom en haut à droite, puis **Senders, Domains & Dedicated IPs**, puis **Domains**, puis **Add a domain**.
2. Saisis `mboacm.com` et choisis **Authenticate yourself** (saisie manuelle).
3. Brevo affiche 3 ou 4 enregistrements : un TXT `brevo-code`, un DKIM (CNAME ou TXT), un DMARC et parfois un SPF.
4. Dans Cloudflare, page du domaine, puis **DNS**, puis **Records**, puis **Add record**. Recopie-les un par un.
   - **Type, Name, Content** à l'identique. Pour le **Name**, ne mets que la partie avant `.mboacm.com`.
   - **Proxy status : DNS only** (nuage gris) pour tous.
   - **SPF** : s'il existe déjà un TXT `v=spf1 …` (créé par Email Routing par exemple), **ne crée pas un deuxième TXT SPF**. Fusionne les deux. Exemple : `v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all`. Deux SPF, c'est une erreur.
5. Retourne dans Brevo et clique sur **Verify**. Ça peut prendre jusqu'à une heure.
6. Brevo, puis **Senders**, puis **Add a sender** : nom `Mboa`, email `contact@mboacm.com`. Valide le code reçu par email.

✅ **Fin de phase 2** : un email envoyé à `contact@mboacm.com` arrive bien, et le domaine apparaît « Authenticated » dans Brevo.

---

## Phase 3 — Les clés des services

Note chaque valeur dans ton gestionnaire de mots de passe au fur et à mesure. Elles servent aux phases 4 et 6.

### 3.1 Brevo : listes, attributs, clé API

Suis **[docs/brevo-setup.md](brevo-setup.md), section 1**. En résumé :

1. **Contacts**, puis **Lists** : crée `Liste d'attente`, `Pionniers` et `Agents`, et **note le numéro (ID)** de chacune.
2. **Contacts**, puis **Settings**, puis **Contact attributes** : crée en type **Text** les attributs `CITY`, `PROFILE`, `MOTIVATION`, `LOCALE`, `SOURCE`, et `WHATSAPP` s'il n'existe pas.
3. **SMTP & API**, puis **API Keys**, puis **Generate a new API key**, avec le nom `mboa-site-production`. **Copie-la tout de suite** : elle ne sera plus jamais affichée.
4. *(Recommandé)* **Double opt-in** : crée un modèle d'email de confirmation contenant le lien `{{ doubleoptin }}` et note son **ID**.
   - Exemple de texte : « Confirmez votre inscription à la liste d'attente Mboa ».
   - Sans ce modèle, les inscrits par email rejoignent directement la liste.

| Valeur | Variable |
|---|---|
| Clé API | `BREVO_API_KEY` |
| ID de la liste d'attente | `BREVO_LIST_WAITLIST` |
| ID de la liste Pionniers | `BREVO_LIST_PIONEERS` (formulaire à venir) |
| ID de la liste Agents | `BREVO_LIST_AGENTS` (formulaire à venir) |
| ID du modèle de double opt-in | `BREVO_DOI_TEMPLATE_ID` (facultatif) |

### 3.2 Cloudflare Turnstile (anti-robot du formulaire)

1. Cloudflare, menu de gauche : **Turnstile** (au niveau du compte, pas du domaine), puis **Add widget**.
2. **Widget name** : `Mboa — site`.
3. **Hostnames** : ajoute `mboacm.com` et `www.mboacm.com`. N'ajoute pas `localhost` : en local, le site utilise automatiquement les clés de test de Cloudflare.
4. **Widget mode** : **Managed**.
5. **Pre-clearance** : **No**.
6. Clique sur **Create**. Note les deux clés :

| Valeur | Variable | Nature |
|---|---|---|
| **Site Key** | `PUBLIC_TURNSTILE_SITE_KEY` | Publique : elle apparaît dans la page |
| **Secret Key** | `TURNSTILE_SECRET_KEY` | **Secrète** |

### 3.3 Cloudflare Web Analytics (statistiques sans cookie)

1. Cloudflare, menu de gauche : **Analytics & Logs**, puis **Web Analytics**, puis **Add a site**.
2. Hostname : `mboacm.com`.
3. Si Cloudflare propose l'**installation automatique**, refuse-la et choisis l'option **manuelle** (le « JS snippet »). Le site insère déjà le script lui-même, et il ne faut pas qu'il soit chargé deux fois.
4. Dans le bout de code affiché, repère `"token": "abc123…"`. Ce token devient `PUBLIC_CF_ANALYTICS_TOKEN`.

✅ **Fin de phase 3** : tu as en main `BREVO_API_KEY`, `BREVO_LIST_WAITLIST`, *(optionnel)* `BREVO_DOI_TEMPLATE_ID`, `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` et `PUBLIC_CF_ANALYTICS_TOKEN`.

---

## Phase 4 — Premier déploiement depuis ton Mac

Ce premier envoi « à la main » crée le site chez Cloudflare. Les suivants seront automatiques (Phase 6).

> Pré-requis : la Phase 0 est terminée et tu es sur la branche `develop` à jour.

### 4.1 Se placer dans le projet, à jour

```bash
cd "/Users/lvmmarket/develop/personal/mboa/site vitrine"
```

```bash
git checkout develop && git pull
```

```bash
npm ci
```

### 4.2 Connecter le terminal à Cloudflare

```bash
npx wrangler login
```

Le navigateur s'ouvre : connecte-toi et clique sur **Allow**. Vérifie ensuite :

```bash
npx wrangler whoami
```

Tu dois voir ton email et le nom du compte. **Si plusieurs comptes s'affichent**, copie l'**Account ID** du bon et dis-le-moi : je l'ajouterai dans `wrangler.jsonc` (`"account_id": "…"`), pour que le site ne parte jamais sur le mauvais compte.

### 4.3 Renseigner les valeurs publiques de compilation

Ces valeurs sont **inscrites dans les pages au moment de la compilation**. Elles ne sont pas secrètes.

```bash
cp .env.example .env
```

Ouvre `.env` et remplis-le :

```
PUBLIC_SITE_URL=https://mboacm.com
PUBLIC_TURNSTILE_SITE_KEY=<la Site Key de l'étape 3.2>
PUBLIC_CF_ANALYTICS_TOKEN=<le token de l'étape 3.3>
```

`.env` est ignoré par git : il ne partira jamais sur GitHub.

### 4.4 Vérifier, compiler, envoyer

```bash
npm run check && npm run test
```

```bash
npm run build
```

Dans le résultat de `npm run build`, **aucune ligne** ne doit dire `PUBLIC_TURNSTILE_SITE_KEY is not set`. La ligne `Legal fields still empty` est normale tant que `site.yaml` n'est pas complet.

```bash
npx wrangler deploy
```

Wrangler affiche à la fin une adresse du type `https://mboa-site.<ton-sous-domaine>.workers.dev`. Si c'est ton premier Worker, il te demande de choisir ce sous-domaine : prends par exemple `mboa`.

### 4.5 Ajouter les secrets

Chaque commande demande la valeur : colle-la puis appuie sur Entrée. Rien ne s'affiche pendant la saisie, c'est normal.

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

```bash
npx wrangler secret put BREVO_API_KEY
```

```bash
npx wrangler secret put BREVO_LIST_WAITLIST
```

Facultatif, seulement si tu as créé le modèle de double opt-in :

```bash
npx wrangler secret put BREVO_DOI_TEMPLATE_ID
```

Vérifie la liste, sans les valeurs :

```bash
npx wrangler secret list
```

> Les secrets sont stockés chiffrés chez Cloudflare, jamais dans le code ni sur GitHub. Pour en changer un, relance la même commande. Il n'y a pas besoin de redéployer : le changement est immédiat.

### 4.6 Premier contrôle sur l'adresse `workers.dev`

Ouvre l'adresse `https://mboa-site.<ton-sous-domaine>.workers.dev` :

- [ ] La page d'accueil s'affiche, en FR, puis en EN avec `/en`.
- [ ] `/liste-d-attente` s'affiche.
- [ ] Une adresse inventée (`/nimporte-quoi`) affiche la page 404 Mboa.

⚠️ **Ne teste pas encore le formulaire ici.** Turnstile est réservé à `mboacm.com` (étape 3.2), donc il refusera cette adresse. C'est voulu : on testera en Phase 5.

✅ **Fin de phase 4** : le site existe chez Cloudflare, sous le nom `mboa-site`, dans **Workers & Pages**.

---

## Phase 5 — Brancher `mboacm.com` sur le site

### 5.1 Le domaine principal

**Option A — par le code (recommandée, préparée en Phase 0).** `wrangler.jsonc` contient :

```jsonc
"routes": [{ "pattern": "mboacm.com", "custom_domain": true }]
```

Il suffit de redéployer :

```bash
npx wrangler deploy
```

**Option B — par le tableau de bord.** **Workers & Pages**, puis `mboa-site`, puis **Settings**, puis **Domains & Routes**, puis **+ Add**, puis **Custom domain**. Saisis `mboacm.com` et clique sur **Add domain**.

Dans les deux cas, Cloudflare crée lui-même l'enregistrement DNS et le certificat HTTPS, en 1 à 15 minutes. Si un ancien enregistrement A ou CNAME existe encore pour `mboacm.com`, Cloudflare refuse : supprime-le dans **DNS**, puis **Records**, et recommence.

### 5.2 Rediriger `www.mboacm.com` vers `mboacm.com`

Certains taperont « www ». On les redirige, pour n'avoir qu'une seule adresse officielle (meilleur pour Google).

1. Page du domaine, puis **DNS**, puis **Records**, puis **Add record** :
   - **Type** : `AAAA`
   - **Name** : `www`
   - **IPv6 address** : `100::` (adresse « factice » : c'est la règle de l'étape 2 qui répond)
   - **Proxy status** : **Proxied** (nuage orange) — *indispensable*
   - **Save**
2. Page du domaine, puis **Rules**, puis **Overview**, puis **Create rule**, puis **Redirect Rule**. Choisis le modèle **« Redirect from WWW to root »** s'il est proposé. Sinon :
   - **Rule name** : `www vers mboacm.com`
   - **If incoming requests match** : *Custom filter expression*, puis **Hostname** *equals* `www.mboacm.com`
   - **Then** : *Dynamic*, expression `concat("https://mboacm.com", http.request.uri.path)`
   - **Status code** : `301`
   - **Preserve query string** : ✅ coché
   - **Deploy**

### 5.3 Contrôles sur le vrai domaine

- [ ] `https://mboacm.com` affiche le site, avec le cadenas HTTPS.
- [ ] `http://mboacm.com` redirige vers `https://`.
- [ ] `https://www.mboacm.com/liste-d-attente` redirige vers `https://mboacm.com/liste-d-attente`.
- [ ] `https://mboacm.com/carte` redirige vers `/liste-d-attente?source=carte`. **C'est le lien du QR code.**
- [ ] **Test réel du formulaire** sur `https://mboacm.com/liste-d-attente` : inscris-toi avec ton vrai email.
  - Le message de succès s'affiche.
  - Le contact apparaît dans Brevo, dans la liste d'attente, avec les attributs `CITY`, `PROFILE` et `SOURCE`.
  - Si le double opt-in est activé : l'email de confirmation arrive, **pas en spam**, et le lien ramène sur le site avec « Votre inscription est confirmée ».
- [ ] **Deuxième test** avec un numéro WhatsApp seul, sans email.
- [ ] Supprime ces contacts de test dans Brevo.

✅ **Fin de phase 5** : le site est en ligne sur `https://mboacm.com`. Le QR code de la carte fonctionne : **tu peux lancer l'impression**.

---

## Phase 6 — Déploiement automatique depuis GitHub

Objectif : ne plus jamais taper `wrangler deploy`. Chaque fusion dans `main` met en ligne, et chaque autre branche obtient une adresse de prévisualisation.

### 6.1 Connecter le dépôt

1. **Workers & Pages**, puis `mboa-site`, puis **Settings**, puis **Build**, puis **Connect** (rubrique Git repository).
2. Choisis **GitHub**, puis autorise l'application **Cloudflare Workers and Pages** sur ton compte GitHub. Limite l'accès au seul dépôt `Sipoufo/mboa_site`.
3. Sélectionne le dépôt `mboa_site`.

### 6.2 Réglages de compilation

| Réglage | Valeur |
|---|---|
| **Production branch** (branche de production) | `main` |
| **Build command** (commande de compilation) | `npm run build` |
| **Deploy command** (commande de mise en ligne) | `npx wrangler deploy` |
| **Non-production branch builds** (compiler les autres branches) | ✅ activé |
| **Non-production branch deploy command** (commande pour les autres branches) | `npx wrangler versions upload` |
| **Root directory** (dossier racine) | *(laisser vide)* |

### 6.3 Variables de compilation

Ce sont les mêmes que dans ton `.env` (étape 4.3) : Cloudflare en a besoin pour compiler.

**Settings**, puis **Build**, puis **Variables and secrets**, puis **Add** :

| Nom | Valeur | Type |
|---|---|---|
| `PUBLIC_SITE_URL` | `https://mboacm.com` | Text |
| `PUBLIC_TURNSTILE_SITE_KEY` | la Site Key | Text |
| `PUBLIC_CF_ANALYTICS_TOKEN` | le token | Text |
| `NODE_VERSION` | `22` | Text (sans effet si le fichier `.node-version` de la Phase 0 est présent, mais sans danger) |

> **Variables de compilation et secrets d'exécution, la différence.** Les variables ci-dessus servent **pendant la compilation**. Les secrets de l'étape 4.5 (`BREVO_API_KEY`…) servent **pendant l'exécution**. Ils sont déjà en place : ne les recopie pas ici.

### 6.4 Premier essai

1. Clique sur **Save**, puis déclenche une compilation (**Retry build**, ou pousse un petit commit sur `develop`).
2. **Settings**, puis **Build**, puis l'onglet des compilations : suis le journal. Une compilation réussie se termine par `Success: Uploaded…` ou `Deployed…`.
3. Pour une branche autre que `main`, Cloudflare affiche une **adresse de prévisualisation**, du type `https://develop-mboa-site.<sous-domaine>.workers.dev`. Le lien apparaît aussi dans GitHub, sur le commit.

> ⚠️ **Prévisualisations et vraies données.** Les prévisualisations partagent les secrets de production, donc la **vraie** liste Brevo. Turnstile les bloque d'ailleurs, parce que leur adresse n'est pas `mboacm.com`. **Ne teste jamais le formulaire sur une prévisualisation.** Si un jour tu en as besoin, je mettrai en place un environnement « preview » séparé, avec une liste Brevo de test.

### 6.5 Désactiver l'adresse `workers.dev` de production (facultatif, recommandé)

Une fois `mboacm.com` en place, l'adresse `mboa-site.<sous-domaine>.workers.dev` fait doublon pour Google.

**Settings**, puis **Domains & Routes**, puis la ligne **workers.dev** : **Disable**.

Les **adresses de prévisualisation** des branches restent actives : c'est un réglage séparé, « Preview URLs », à laisser activé.

✅ **Fin de phase 6** : `git push` sur une branche donne une prévisualisation, et une fusion dans `main` met en production.

---

## Phase 7 — Mise en production avec git-flow (release 1.0.0)

Avec git-flow, une mise en production passe par une branche `release/`.

```bash
git checkout develop && git pull
```

```bash
git flow release start 1.0.0
```

Dans `package.json`, passe `"version"` à `"1.0.0"`, puis commite :

```bash
git commit -am "chore: release 1.0.0"
```

```bash
git flow release finish 1.0.0
```

Git ouvre un éditeur pour le message du tag : écris `Mboa site 1.0.0 — liste d'attente`, enregistre et ferme. Puis pousse les deux branches et le tag :

```bash
git push origin main develop --tags
```

Cloudflare détecte la mise à jour de `main` et met en production en 1 à 3 minutes. Tu peux le suivre dans **Workers & Pages**, puis `mboa-site`, puis **Deployments**.

> Je peux faire cette phase à ta place, sur ton feu vert explicite : c'est une mise en production.

---

## Phase 8 — Vérifications après lancement

### 8.1 Fonctionnel (sur ton téléphone, en 4G, pas en wifi)

- [ ] Accueil, liste d'attente, confidentialité, mentions légales, en FR et en EN.
- [ ] Menu mobile, changement de langue.
- [ ] Inscription réelle, puis contact visible dans Brevo, puis suppression du contact de test.
- [ ] **QR code de la carte**, scanné avec un iPhone **et** un Android : il ouvre bien la liste d'attente.
- [ ] `https://mboacm.com/robots.txt` et `https://mboacm.com/sitemap-index.xml` s'affichent.

### 8.2 Partage sur les réseaux

- [ ] Colle `https://mboacm.com` dans WhatsApp : l'aperçu montre le logo sur fond vert et le titre.
- [ ] Vérifie l'aperçu Facebook et LinkedIn avec **https://developers.facebook.com/tools/debug/** (« Scrape Again » si l'aperçu est ancien).

### 8.3 Performance

- [ ] **https://pagespeed.web.dev**, avec `https://mboacm.com`, onglet **Mobile**. Objectif : 95 en Performance, 100 en Accessibilité et en SEO.

### 8.4 Google

1. Va sur **https://search.google.com/search-console**, puis **Ajouter une propriété**, puis **Domaine** : `mboacm.com`.
2. Google donne un **TXT** de vérification. Ajoute-le dans Cloudflare (**DNS**, puis **Records**, puis **Add record**, type TXT, nom `@`, en DNS only), puis clique sur **Valider**.
3. Dans Search Console : **Sitemaps**, saisis `sitemap-index.xml` et clique sur **Envoyer**.
4. Profites-en pour créer ta fiche **Google Business Profile** si tu veux apparaître dans Google Maps (facultatif).

### 8.5 Statistiques

- [ ] Après une heure, **Web Analytics** doit montrer tes propres visites de test.

---

## Phase 9 — Au quotidien

### Modifier le contenu (date du MVP, contacts, réseaux…)

1. Modifie `src/content/settings/site.yaml` sur une branche `feature/…`, ou demande-le-moi.
2. Fusionne dans `develop` : tu obtiens une prévisualisation pour vérifier.
3. Fais une release (Phase 7) : c'est en ligne.

### Revenir en arrière en cas de problème

- **Workers & Pages**, puis `mboa-site`, puis **Deployments**. Sur une version précédente qui marchait, ouvre le menu **…** et choisis **Rollback**. C'est instantané.
- Ou en terminal :

```bash
npx wrangler rollback
```

Corrige ensuite le problème dans le code avec une branche `hotfix/`.

### Voir les erreurs du formulaire en direct

```bash
npx wrangler tail
```

Ça affiche les journaux du site en temps réel. Ils ne contiennent jamais de nom ni de numéro : le code ne les enregistre pas.

### Une semaine après le lancement, sans souci : activer HSTS

Page du domaine, puis **SSL/TLS**, puis **Edge Certificates**, puis **HTTP Strict Transport Security (HSTS)**, puis **Enable** :

- **Max Age** : 6 mois ;
- **Include subdomains** : non pour l'instant ;
- **Preload** : non.

> HSTS oblige les navigateurs à toujours utiliser HTTPS. On ne l'active qu'une fois sûr que tout fonctionne : c'est difficile à annuler.

### Renouvellements à surveiller

| Quoi | Quand |
|---|---|
| Domaine `mboacm.com` | Chaque année, vérifier que l'auto-renouvellement est actif |
| Clé API Brevo | Si elle fuit : en créer une nouvelle, `wrangler secret put BREVO_API_KEY`, puis supprimer l'ancienne |
| Quotas gratuits | Brevo : 300 emails par jour. Workers : 100 000 appels d'API par jour. Très largement suffisant au début |

---

## Annexe A — Toutes les valeurs : où les trouver, où les mettre

| Variable | Où la trouver | Local (ton Mac) | Production (Cloudflare) | Secrète ? |
|---|---|---|---|---|
| `PUBLIC_SITE_URL` | — : `https://mboacm.com` | `.env` | Variable de compilation (6.3) + `wrangler.jsonc` | Non |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile (3.2) | `.env` | Variable de compilation (6.3) | Non |
| `PUBLIC_CF_ANALYTICS_TOKEN` | Web Analytics (3.3) | `.env` | Variable de compilation (6.3) | Non |
| `TURNSTILE_SECRET_KEY` | Turnstile (3.2) | `.dev.vars` (clé de test) | `wrangler secret put` (4.5) | **Oui** |
| `BREVO_API_KEY` | Brevo, SMTP & API (3.1) | `.dev.vars` (vide = simulation) | `wrangler secret put` (4.5) | **Oui** |
| `BREVO_LIST_WAITLIST` | Brevo, Lists (3.1) | `.dev.vars` | `wrangler secret put` (4.5) | Non sensible, mais rangé avec les secrets |
| `BREVO_DOI_TEMPLATE_ID` | Brevo, Templates (3.1) | `.dev.vars` | `wrangler secret put` (4.5) | Non sensible |

## Annexe B — Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| Le formulaire dit « La vérification anti-robot a échoué » | Le domaine n'est pas dans le widget Turnstile, ou la Site Key et la Secret Key ne vont pas ensemble | Vérifie les hostnames du widget (3.2) et que les deux clés viennent du **même** widget |
| Le formulaire dit « L'inscription est momentanément indisponible » | Un secret manque en production | `npx wrangler secret list` : il faut au moins `TURNSTILE_SECRET_KEY`, `BREVO_API_KEY` et `BREVO_LIST_WAITLIST` |
| Le formulaire dit « n'a pas pu être enregistrée » | Brevo refuse la demande : mauvaise clé, liste inexistante ou attribut manquant | `npx wrangler tail`, puis une inscription test : le journal montre le code d'erreur Brevo. Vérifie les attributs (3.1) |
| `wrangler deploy` : « Authentication error » | Session expirée | `npx wrangler login` |
| `wrangler deploy` part sur le mauvais compte | Plusieurs comptes Cloudflare | Ajouter `account_id` dans `wrangler.jsonc` (4.2) |
| La compilation sur Cloudflare échoue avec « Node.js version » | Version de Node trop ancienne | Variable `NODE_VERSION = 22` (6.3) ou fichier `.node-version` |
| « Custom domain already has a DNS record » | Ancien enregistrement A ou CNAME | Le supprimer dans DNS, puis Records, et recommencer (5.1) |
| `www.mboacm.com` ne répond pas | L'enregistrement `www` manque ou n'est pas proxied | AAAA `www` → `100::`, **nuage orange** (5.2) |
| Les emails de confirmation arrivent en spam | Domaine non authentifié dans Brevo, ou SPF en double | Phase 2.2. Un seul TXT `v=spf1` |
| Les emails vers `contact@` n'arrivent plus après la bascule | MX non recopiés | Recopier les MX de la capture 1.3, ou activer Email Routing (2.1) |
| L'aperçu WhatsApp montre une vieille image | Cache de WhatsApp | Attendre quelques heures, ou partager `https://mboacm.com/?v=2` |

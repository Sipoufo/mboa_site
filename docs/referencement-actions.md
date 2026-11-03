# Référencement : ce que tu dois faire toi-même (partie C)

Le code du site est prêt pour Google : sitemap FR/EN, fiches WebSite et FAQ, titres orientés recherche. Ce guide couvre ce que **personne ne peut faire à ta place**, parce que ça demande tes comptes.

Fais les étapes dans l'ordre. Compte **environ 1 h 30** la première fois.

| # | Étape | Temps | Quand |
|---|---|---|---|
| 0 | Mettre en ligne la nouvelle version (release) | 10 min | Maintenant |
| 1 | Forcer le HTTPS dans Cloudflare | 2 min | Maintenant |
| 2 | Google Search Console | 25 min | Maintenant |
| 3 | Bing Webmaster Tools | 10 min | Maintenant |
| 4 | Liens dans les bios des réseaux | 20 min | Maintenant |
| 5 | Ajouter tes profils sociaux au site | 5 min | Dès qu'un nouveau profil existe |
| 6 | Vérifier les fiches Google | 5 min | Après l'étape 0 |
| 7 | Liens entrants (sites qui parlent de Mboa) | En continu | Chaque mois |
| 8 | Fiche Google Business Profile | 20 min | **Plus tard**, quand les visites sur le terrain commencent |
| 9 | Suivre les résultats | 15 min | Chaque semaine |

---

## Étape 0 — Mettre en ligne la nouvelle version

Les améliorations (source des inscrits, avantages, référencement) sont sur `develop` mais **pas encore en production**. Depuis le dossier du site :

```bash
git checkout develop && git pull
```

```bash
git flow release start 1.2.0
```

Dans `package.json`, passe `"version"` à `"1.2.0"`, puis :

```bash
git commit -am "chore: release 1.2.0"
```

```bash
git flow release finish 1.2.0
```

```bash
git push origin main develop --tags
```

Cloudflare met en ligne en 1 à 3 minutes. Pour vérifier, ouvre `https://mboacm.com/liste-d-attente` : le bloc « Pourquoi vous inscrire maintenant ? » doit apparaître.

---

## Étape 1 — Forcer le HTTPS

Aujourd'hui, `http://mboacm.com` s'affiche sans cadenas. Google n'aime pas avoir deux versions du même site.

1. Va sur **dash.cloudflare.com** et clique sur le domaine **mboacm.com**.
2. Menu de gauche : **SSL/TLS**, puis **Edge Certificates**.
3. Active **Always Use HTTPS**.
4. Sur la même page, active **Automatic HTTPS Rewrites**.
5. Vérification : tape `http://mboacm.com` dans le navigateur. L'adresse doit devenir `https://mboacm.com`.

---

## Étape 2 — Google Search Console

C'est l'outil gratuit de Google. Il dit si le site est indexé, sur quels mots-clés il apparaît et combien de personnes cliquent. **C'est la priorité.**

### 2.1 Ajouter le domaine

1. Va sur **https://search.google.com/search-console** et connecte-toi avec le compte Google de Mboa. Utilise de préférence un compte lié à `contact@mboacm.com`, pas un compte personnel.
2. Clique sur **Ajouter une propriété** (en haut à gauche, sur le menu déroulant).
3. Choisis la case de gauche, **Domaine**, et saisis `mboacm.com`, sans `https://` et sans `www`.
4. Clique sur **Continuer**.

### 2.2 Prouver que le domaine t'appartient

Google affiche un enregistrement **TXT** du type `google-site-verification=AbC123…`.

**Option la plus simple.** Si Google propose un bouton **« Démarrer la validation »** avec Cloudflare, clique dessus. Connecte-toi à Cloudflare et accepte : c'est automatique.

**Sinon, à la main :**

1. Clique sur **Copier** à côté du code TXT.
2. Dans Cloudflare, sur la page du domaine `mboacm.com` : **DNS**, puis **Records**, puis **Add record**.
   - **Type** : `TXT`
   - **Name** : `@`
   - **Content** : colle le code (`google-site-verification=…`)
   - **TTL** : Auto
   - Clique sur **Save**.
3. Retourne dans Search Console et clique sur **Valider**.
4. Si Google répond « non trouvé », attends 15 minutes et réessaie. Ça peut prendre jusqu'à une heure.

> ⚠️ Ne supprime jamais ce TXT ensuite : Google revérifie régulièrement.

### 2.3 Envoyer le sitemap

1. Dans Search Console, menu de gauche : **Sitemaps**.
2. Dans « Ajouter un sitemap », saisis `sitemap-index.xml`. Le début `https://mboacm.com/` est déjà rempli.
3. Clique sur **Envoyer**.
4. Le statut doit passer à **Opération effectuée**, parfois après quelques heures. Google y trouvera 8 pages.

### 2.4 Demander l'indexation des pages clés

Fais-le **après l'étape 0**, pour que Google voie les nouveaux titres.

1. Tout en haut de Search Console, dans la barre **« Inspecter n'importe quelle URL »**, colle `https://mboacm.com/` et appuie sur Entrée.
2. Clique sur **Demander une indexation**. Patiente environ une minute.
3. Recommence pour :
   - `https://mboacm.com/liste-d-attente`
   - `https://mboacm.com/en`
   - `https://mboacm.com/en/waitlist`

> Google limite le nombre de demandes par jour. N'insiste pas sur les pages légales : elles seront trouvées par le sitemap.

### 2.5 Ce qu'il faut regarder ensuite

Les premières données arrivent en **3 à 7 jours**.

| Rapport | Où | Ce qu'il te dit |
|---|---|---|
| **Performances** | Menu de gauche | Les recherches qui affichent Mboa, les clics, la position moyenne |
| **Pages** | Indexation, puis Pages | Combien de pages Google a retenues, et pourquoi il en refuse |
| **Améliorations** | FAQ (si le rapport apparaît) | Si la fiche FAQ de la liste d'attente est valide |
| **Signaux Web essentiels** | Expérience | La vitesse du site sur mobile (il est rapide, ça devrait être vert) |

---

## Étape 3 — Bing Webmaster Tools

Bing alimente aussi DuckDuckGo, Yahoo et ChatGPT Search. Grâce à l'import depuis Google, ça prend 5 minutes.

1. Va sur **https://www.bing.com/webmasters** et connecte-toi. Le bouton **Se connecter avec Google** utilise le même compte qu'à l'étape 2.
2. Choisis **Importer depuis Google Search Console**, puis **Continuer**, et autorise l'accès.
3. Coche **mboacm.com**, puis clique sur **Importer**.
4. Le sitemap est importé aussi. Vérifie-le dans le menu **Sitemaps** : `https://mboacm.com/sitemap-index.xml` doit apparaître.

---

## Étape 4 — Liens dans les bios des réseaux

Chaque lien a sa **source**. Tu sauras ainsi dans Brevo quel réseau t'amène des inscrits (attribut `SOURCE`).

| Réseau | Lien à mettre |
|---|---|
| Instagram | `https://mboacm.com/liste-d-attente?source=instagram` |
| Facebook | `https://mboacm.com/liste-d-attente?source=facebook` |
| LinkedIn | `https://mboacm.com/liste-d-attente?source=linkedin` |
| TikTok | `https://mboacm.com/liste-d-attente?source=tiktok` |
| WhatsApp (profil et messages) | `https://mboacm.com/liste-d-attente?source=whatsapp` |
| Carte de visite (QR code) | `https://mboacm.com/carte` (déjà en place, ne rien changer) |

> Pour une action ponctuelle, invente ta propre source : `?source=salon-douala`, `?source=flyer-novembre`… Lettres, chiffres et tirets uniquement, 32 caractères maximum.

### Instagram

1. Ouvre l'application, va sur ton profil et touche **Modifier le profil**.
2. Touche **Liens**, puis **Ajouter un lien externe**.
3. **URL** : `https://mboacm.com/liste-d-attente?source=instagram`.
4. **Titre** : `Liste d'attente`.
5. Touche **Terminé**.

### Page Facebook

1. Ouvre la page Mboa, en tant que page et pas en tant que profil personnel.
2. Clique sur **Modifier** (ou les trois points, puis **Modifier les infos de la Page**).
3. Dans **Coordonnées**, puis **Site web**, colle `https://mboacm.com/liste-d-attente?source=facebook`.
4. Ajoute aussi un bouton d'action : **Ajouter un bouton**, puis **S'inscrire**, avec le même lien.

### Page LinkedIn

1. Ouvre la page Mboa et clique sur **Modifier la page**.
2. Dans **Infos de la page**, champ **Site web** : `https://mboacm.com/liste-d-attente?source=linkedin`.
3. Dans **Bouton**, active un bouton personnalisé **Visiter le site web** avec le même lien.

### TikTok (quand le compte existe)

1. Profil, puis **Modifier le profil**, puis **Site web**.
2. Colle `https://mboacm.com/liste-d-attente?source=tiktok`.

> Si le champ **Site web** n'apparaît pas, passe en **compte professionnel** : Paramètres, puis Compte, puis Passer à un compte professionnel.

### WhatsApp Business

1. **Paramètres**, puis **Outils professionnels**, puis **Profil professionnel**.
2. Champ **Site web** : `https://mboacm.com/liste-d-attente?source=whatsapp`.
3. Utilise le même lien quand tu le partages dans tes statuts ou tes messages.

---

## Étape 5 — Ajouter tes profils sociaux au site

Le site déclare tes profils à Google, ce qui l'aide à relier Mboa à ses comptes officiels. Les liens viennent de `src/content/settings/site.yaml`.

1. Quand tu crées un compte LinkedIn ou TikTok, ouvre `src/content/settings/site.yaml`.
2. Remplis `linkedin:` ou `tiktok:` avec **l'adresse du profil, sans paramètre**. Par exemple `https://www.tiktok.com/@mboa_cm`, et non un lien copié depuis l'app avec `?_t=…`.
3. Conseil : nettoie aussi le lien Instagram actuel. Remplace `https://www.instagram.com/mboa_cm?srtk=…` par `https://www.instagram.com/mboa_cm/`. Le site le nettoie déjà pour Google, mais c'est plus propre.
4. Commite sur une branche `feature/`, puis fais une release comme à l'étape 0. Ou demande-le-moi.

---

## Étape 6 — Vérifier les fiches Google

Après l'étape 0 :

1. Va sur **https://search.google.com/test/rich-results**.
2. Colle `https://mboacm.com/liste-d-attente` et clique sur **Tester l'URL**.
3. Résultat attendu : **« Questions fréquentes »** détecté, sans erreur. Les avertissements jaunes ne sont pas bloquants.
4. Teste aussi `https://mboacm.com/` : Google doit y voir l'**organisation** et le **site web**.

Pour l'aperçu sur les réseaux :

1. Va sur **https://developers.facebook.com/tools/debug/**.
2. Colle `https://mboacm.com/liste-d-attente` et clique sur **Déboguer**, puis **Récupérer à nouveau**.
3. Tu dois voir l'image verte « La liste d'attente est ouverte. ».

---

## Étape 7 — Liens entrants : d'autres sites qui parlent de Mboa

Pour Google, chaque site sérieux qui pointe vers `mboacm.com` est un vote de confiance. C'est le travail le plus long, mais aussi le plus efficace.

| Action | Comment |
|---|---|
| **Annuaires d'entreprises camerounais** | Inscris Mboa sur 2 ou 3 annuaires sérieux, avec le lien `https://mboacm.com`. Évite les annuaires remplis de publicités ou payants « pour le référencement » : Google les ignore, voire les pénalise. |
| **Incubateurs, concours, programmes startups** | Le Fonds Proto APME et toute structure qui t'accompagne : demande une fiche ou une mention avec le lien du site. |
| **Presse et blogs tech africains** | Un communiqué court au lancement de la liste d'attente, puis au lancement du MVP, avec le lien. |
| **Prestataires pionniers** | Les agences partenaires peuvent mettre « Bientôt sur Mboa » avec le lien sur leur site ou leurs réseaux. |
| **Ton profil LinkedIn personnel** | Rubrique **Coordonnées**, puis **Site web** : `https://mboacm.com`. Ajoute aussi Mboa dans ton expérience. |

> Ne paie jamais pour « acheter des liens » : Google le détecte et peut faire disparaître le site des résultats.

---

## Étape 8 — Fiche Google Business Profile : plus tard

La fiche qui apparaît dans Google Maps et à droite des résultats est un vrai plus. **Mais Google la réserve aux entreprises qui rencontrent leurs clients en personne.** Une activité uniquement en ligne n'y a pas droit, et la fiche risque d'être suspendue.

**Quand le faire** : dès que les visites avec les agents commencent à Douala et Yaoundé, autour du lancement du MVP. Mboa sera alors une entreprise « avec zone desservie ». Ce jour-là :

1. Va sur **https://business.google.com** et clique sur **Gérer maintenant**.
2. **Nom** : `Mboa`.
3. **Catégorie** : choisis la plus proche de l'activité réelle à ce moment-là, par exemple « Service de location de logements » ou « Agence de location ». Prends celle que Google propose en tapant « location ».
4. « Voulez-vous ajouter un lieu que les clients peuvent visiter ? » : **Non**, si tu n'as pas de bureau ouvert au public.
5. **Zones desservies** : Douala, Yaoundé.
6. **Téléphone** : `+237 695 914 926`. **Site web** : `https://mboacm.com/?source=google-maps`.
7. Google demandera une **validation**, par code, vidéo ou appel. Suis ses instructions.

---

## Étape 9 — Suivre les résultats chaque semaine

Un créneau fixe de 15 minutes, par exemple le lundi matin :

| Où | Quoi regarder |
|---|---|
| **Brevo**, puis Contacts, puis filtre sur l'attribut `SOURCE` | Combien d'inscrits par canal : instagram, carte, direct… Mise davantage sur ce qui marche. |
| **Search Console**, puis Performances | Les recherches qui t'affichent. Note celles qui reviennent : elles donneront les sujets des futures pages et articles. |
| **Cloudflare**, puis Web Analytics | Visites par page et par pays, et appareils (mobile ou ordinateur) |

> Le compteur public d'inscrits apparaît tout seul sur le site au-delà de 50 inscrits.

---

## Et ensuite : la partie B, le contenu

Avec quatre pages, Google a peu à classer. Quand tu es prêt, demande-moi le plan de la **partie B** :

- les pages **Propriétaires**, **Devenir agent**, **Le projet** et **FAQ** ;
- puis les premiers **articles**, tirés de tes posts : « 5 choses à vérifier avant de louer », « La caution au Cameroun », etc.

Ce sont elles qui feront venir des visiteurs depuis les recherches.

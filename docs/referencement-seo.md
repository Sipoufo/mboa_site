# Guide complet du référencement (SEO) de mboacm.com

Ce guide rassemble **tout ce qu'il faut faire** pour que Mboa soit trouvé sur Google, Bing et les moteurs de recherche des assistants IA : ce qui est déjà fait dans le code, ce que tu dois faire avec tes comptes, le contenu à écrire, les liens à obtenir et le suivi à tenir.

Il remplace l'ancien `referencement-actions.md`, dont tout le contenu est repris ici.

> **Règle d'or.** Un bon référencement, c'est trois piliers. Aucun ne suffit seul :
> 1. **Technique** : Google peut lire le site, vite, sans erreur. *(fait)*
> 2. **Contenu** : des pages qui répondent exactement à ce que les gens tapent. *(à construire)*
> 3. **Popularité** : d'autres sites, réseaux et personnes parlent de Mboa. *(à construire)*

---

## Sommaire

1. [Comment Google fonctionne, en 2 minutes](#1-comment-google-fonctionne-en-2-minutes)
2. [Ce qui est déjà fait dans le site](#2-ce-qui-est-déjà-fait-dans-le-site)
3. [Phase 1 : la mise en route (cette semaine)](#3-phase-1--la-mise-en-route-cette-semaine)
4. [Phase 2 : faire reconnaître le nom « Mboa »](#4-phase-2--faire-reconnaître-le-nom-mboa)
5. [Phase 3 : le contenu, le levier n°1](#5-phase-3--le-contenu-le-levier-n1)
6. [Phase 4 : la popularité (liens entrants)](#6-phase-4--la-popularité-liens-entrants)
7. [Phase 5 : le référencement local](#7-phase-5--le-référencement-local)
8. [Phase 6 : le lancement des applications](#8-phase-6--le-lancement-des-applications)
9. [Le suivi : routines hebdo, mensuelle, trimestrielle](#9-le-suivi--routines-hebdo-mensuelle-trimestrielle)
10. [Ce qu'il ne faut jamais faire](#10-ce-quil-ne-faut-jamais-faire)
11. [Problèmes fréquents et solutions](#11-problèmes-fréquents-et-solutions)
12. [Calendrier et checklist](#12-calendrier-et-checklist)
13. [Glossaire](#13-glossaire)

---

## 1. Comment Google fonctionne, en 2 minutes

| Étape | Ce que fait Google | Ce qui l'aide chez nous |
|---|---|---|
| **Exploration** | Son robot (Googlebot) suit les liens et lit les pages | Sitemap, `robots.txt`, liens internes, liens depuis d'autres sites |
| **Indexation** | Il décide de garder la page dans sa base | Contenu utile et unique, une seule adresse par page, pas d'erreur |
| **Classement** | Il choisit l'ordre des résultats pour chaque recherche | Pertinence du contenu, popularité (liens), vitesse, mobile, confiance |
| **Affichage** | Il compose le résultat : nom du site, titre, description | Nom du site (fiche WebSite), `<title>`, meta description, `<h1>` |

**Ce qu'il faut attendre, de façon réaliste :**

| Recherche | Délai réaliste | Ce qui compte |
|---|---|---|
| `mboacm`, `mboacm.com` | Quelques jours | Déjà acquis une fois indexé |
| `Mboa app`, `Mboa logement`, `Mboa Douala` | 2 à 8 semaines | Nom cohérent partout, réseaux sociaux, premières mentions |
| `Mboa` seul | Plusieurs mois, surtout autour du lancement | Notoriété : des gens qui cherchent « Mboa » et cliquent sur le site |
| `location appartement Douala`, `studio à louer Yaoundé` | 3 à 12 mois | Contenu dédié + liens entrants, face à des sites installés depuis longtemps |

> Le référencement est un travail de fond : ce que tu fais ce mois-ci paie dans 3 à 6 mois. La régularité compte plus que l'intensité.

---

## 2. Ce qui est déjà fait dans le site

Tu n'as rien à faire sur ces points : ils sont dans le code et testés automatiquement.

| Élément | État | Détail |
|---|---|---|
| HTTPS forcé | ✅ | `http://mboacm.com` redirige en 301 vers `https://mboacm.com` |
| Une seule adresse | ✅ | `www.mboacm.com` redirige vers `mboacm.com` ; chaque page déclare son adresse officielle (canonical) |
| Sitemap | ✅ | `https://mboacm.com/sitemap-index.xml`, avec les paires FR/EN de chaque page |
| `robots.txt` | ✅ | Tout est autorisé, le sitemap y est déclaré |
| Versions FR / EN reliées | ✅ | Balises `hreflang` `fr-CM`, `en-CM` et `x-default` sur chaque page |
| Titres et descriptions | ✅ | Un `<title>` et une description par page et par langue, écrits pour la recherche |
| Titre principal (`<h1>`) | ✅ | Un seul par page ; celui de l'accueil contient « Mboa, le logement vérifié au Cameroun » *(version 1.2.2)* |
| Nom du site pour Google | ✅ | Fiche WebSite : nom « Mboa », nom de secours « Mboa Cameroun » *(version 1.2.2)* |
| Fiche organisation | ✅ | Nom, logo, e-mail, profils sociaux (Instagram, Facebook), zone : Cameroun |
| Fiche FAQ | ✅ | Sur la liste d'attente, avec exactement les questions affichées |
| Images de partage | ✅ | Image 1200×630 par page clé (accueil, liste d'attente FR/EN), avec texte alternatif |
| Vitesse et mobile | ✅ | Pages statiques, très légères, pensées pour la 3G/4G camerounaise |
| Accessibilité | ✅ | Testée automatiquement (axe), ce qui aide aussi Google à comprendre la page |
| Page 404 | ✅ | Bilingue et marquée « ne pas indexer » |
| Statistiques sans cookies | ✅ | Cloudflare Web Analytics, aucun bandeau de consentement nécessaire |

**Ce qui manque côté technique, et quand le faire :**

| Élément | Quand |
|---|---|
| Fiche `MobileApplication` (l'app dans les résultats) | Quand les liens App Store / Google Play existent (voir [phase 6](#8-phase-6--le-lancement-des-applications)) |
| Fiche `Article` sur chaque actualité | En même temps que la rubrique Actualités (phase 3) |
| Fil d'Ariane (`BreadcrumbList`) | Quand il y aura des pages à deux niveaux (`/applications/mboa`, `/actualites/…`) |
| Date de mise à jour dans le sitemap (`lastmod`) | En même temps que les articles |

---

## 3. Phase 1 : la mise en route (cette semaine)

Compte **environ 1 h 30** la première fois. Fais les étapes dans l'ordre.

### Étape 1.1 : mettre en ligne la version 1.2.2

Elle contient le nom « Mboa Cameroun » et le nouveau titre de l'accueil. Depuis le dossier du site :

```bash
git checkout develop && git pull
```

```bash
git flow release start 1.2.2
```

Dans `package.json`, passe `"version"` à `"1.2.2"`, puis :

```bash
git commit -am "chore: release 1.2.2"
```

```bash
git flow release finish 1.2.2
```

```bash
git push origin main develop --tags
```

Cloudflare met en ligne en 1 à 3 minutes. Vérification : sur `https://mboacm.com`, la petite ligne verte « Mboa, le logement vérifié au Cameroun » apparaît au-dessus du grand titre.

### Étape 1.2 : Google Search Console

C'est l'outil gratuit de Google : il dit si le site est indexé, sur quelles recherches il apparaît et combien de personnes cliquent. **C'est la priorité.**

**Ajouter le domaine**

1. Va sur **https://search.google.com/search-console** avec le compte Google de Mboa (de préférence lié à `contact@mboacm.com`, pas un compte personnel).
2. **Ajouter une propriété** (menu déroulant en haut à gauche).
3. Choisis la case **Domaine** et saisis `mboacm.com`, sans `https://` ni `www`. Clique sur **Continuer**.

**Prouver que le domaine t'appartient**

- **Le plus simple** : si Google propose **« Démarrer la validation »** avec Cloudflare, clique, connecte-toi à Cloudflare et accepte.
- **Sinon, à la main** :
  1. Copie le code TXT `google-site-verification=…`.
  2. Dans Cloudflare, domaine `mboacm.com` : **DNS**, **Records**, **Add record**.
     - **Type** : `TXT` · **Name** : `@` · **Content** : le code · **TTL** : Auto. Clique sur **Save**.
  3. Retourne dans Search Console, clique sur **Valider**. Si « non trouvé », réessaie après 15 minutes (jusqu'à 1 heure).

> ⚠️ Ne supprime jamais ce TXT : Google revérifie régulièrement.

**Envoyer le sitemap**

1. Menu **Sitemaps**. Dans « Ajouter un sitemap », saisis `sitemap-index.xml`, puis **Envoyer**.
2. Le statut passe à **Opération effectuée**, parfois après quelques heures ou jours. « Impossible de récupérer » juste après l'envoi est fréquent : voir [problèmes fréquents](#11-problèmes-fréquents-et-solutions).

**Demander l'indexation des pages clés** (après l'étape 1.1)

1. Barre du haut **« Inspecter n'importe quelle URL »** : colle `https://mboacm.com/`, Entrée.
2. **Demander une indexation**, patiente environ une minute.
3. Recommence pour `https://mboacm.com/liste-d-attente`, `https://mboacm.com/en` et `https://mboacm.com/en/waitlist`.

> Google limite le nombre de demandes par jour. Inutile de le faire pour les pages légales : le sitemap suffit. Refais une demande pour une page **seulement quand elle change beaucoup**.

### Étape 1.3 : Bing Webmaster Tools

Bing alimente aussi **DuckDuckGo, Yahoo, Ecosia et la recherche de ChatGPT et Copilot**. Grâce à l'import depuis Google, c'est 5 minutes.

1. **https://www.bing.com/webmasters**, connecte-toi avec le même compte Google.
2. **Importer depuis Google Search Console**, autorise, coche `mboacm.com`, **Importer**.
3. Vérifie dans **Sitemaps** que `https://mboacm.com/sitemap-index.xml` apparaît.

### Étape 1.4 : activer « Crawler Hints » dans Cloudflare

Cloudflare peut prévenir automatiquement Bing (et les autres moteurs compatibles IndexNow) à chaque mise à jour du site. Gratuit, un seul bouton.

1. **dash.cloudflare.com**, domaine `mboacm.com`.
2. **Caching**, puis **Configuration**.
3. Active **Crawler Hints**.

### Étape 1.5 : vérifier ce que Google lit

1. **https://search.google.com/test/rich-results** : teste `https://mboacm.com/`. Google doit détecter **Organisation**. Le nom du site (fiche WebSite) n'apparaît pas toujours dans ce test, c'est normal.
2. Teste `https://mboacm.com/liste-d-attente` : **Questions fréquentes** doit être détecté sans erreur. Les avertissements jaunes ne bloquent rien.

> Depuis 2023, Google n'affiche plus les questions/réponses déroulantes dans les résultats pour la plupart des sites. La fiche FAQ reste utile : elle aide Google (et les assistants IA) à comprendre la page.

### Étape 1.6 : vérifier l'aperçu sur les réseaux

1. **https://developers.facebook.com/tools/debug/** : colle `https://mboacm.com/liste-d-attente`, **Déboguer**, puis **Récupérer à nouveau**.
2. Tu dois voir l'image verte « La liste d'attente est ouverte. ». Refais-le pour `https://mboacm.com/` après chaque changement d'image ou de titre.
3. Pour LinkedIn : **https://www.linkedin.com/post-inspector/**, même principe.

---

## 4. Phase 2 : faire reconnaître le nom « Mboa »

« Mboa » est un mot courant (« rentrer au mboa »). Pour que Google associe ce mot à **ton** site, il faut que le nom soit **identique partout** et qu'il soit **relié** au site.

### 4.1 La règle de cohérence

Partout où Mboa apparaît (réseaux, annuaires, presse, signature e-mail, carte de visite), utilise **exactement** :

| Information | Valeur à utiliser partout |
|---|---|
| Nom | `Mboa` (jamais MBOA, mboa, « La Mboa ») |
| Phrase de présentation | `Mboa, le logement vérifié au Cameroun` |
| Site | `https://mboacm.com` |
| E-mail | `contact@mboacm.com` |
| Téléphone / WhatsApp | `+237 695 914 926` |
| Villes | Douala, Yaoundé |

> Le nom du compte Instagram est `mboa_cm`, mais le **nom affiché** du profil doit être `Mboa`.

### 4.2 Liens dans les bios des réseaux

Chaque lien porte sa **source** : tu sais ainsi, dans Brevo (attribut `SOURCE`), quel réseau t'amène des inscrits.

| Réseau | Lien à mettre |
|---|---|
| Instagram | `https://mboacm.com/liste-d-attente?source=instagram` |
| Facebook | `https://mboacm.com/liste-d-attente?source=facebook` |
| LinkedIn | `https://mboacm.com/liste-d-attente?source=linkedin` |
| TikTok | `https://mboacm.com/liste-d-attente?source=tiktok` |
| WhatsApp Business | `https://mboacm.com/liste-d-attente?source=whatsapp` |
| Carte de visite (QR code) | `https://mboacm.com/carte` (déjà en place) |

Pour une action ponctuelle, crée ta propre source : `?source=salon-douala`, `?source=flyer-novembre`… (lettres minuscules, chiffres et tirets, 32 caractères maximum).

**Instagram** : Profil, **Modifier le profil**, **Liens**, **Ajouter un lien externe**. URL ci-dessus, titre `Liste d'attente`.

**Page Facebook** (en tant que page) : **Modifier les infos de la Page**, **Coordonnées**, **Site web**. Ajoute aussi un bouton **S'inscrire** avec le même lien.

**Page LinkedIn** : **Modifier la page**, **Infos de la page**, champ **Site web**, puis un bouton personnalisé **Visiter le site web**.

**TikTok** : **Modifier le profil**, **Site web** (si le champ manque, passe en compte professionnel).

**WhatsApp Business** : **Paramètres**, **Outils professionnels**, **Profil professionnel**, **Site web**.

### 4.3 Déclarer les profils dans le site

Le site dit à Google « ces comptes sont les comptes officiels de Mboa ». Les liens viennent de `src/content/settings/site.yaml`, rubrique `socials:`.

1. Quand tu crées un compte (LinkedIn, TikTok…), mets **l'adresse du profil, sans paramètre** : `https://www.tiktok.com/@mboa_cm`, et non un lien copié depuis l'app avec `?_t=…`.
2. Nettoie aussi le lien Instagram : remplace `https://www.instagram.com/mboa_cm?srtk=…` par `https://www.instagram.com/mboa_cm/`.
3. Commit sur une branche `feature/`, puis release. Ou demande-le-moi.

### 4.4 Donner envie de chercher « Mboa »

Le signal le plus fort pour Google, ce sont des personnes qui **tapent « Mboa »** et **cliquent sur ton site**. Dans tes posts, vidéos et prises de parole :

- montre l'adresse **mboacm.com** à l'écran (fin de vidéo, visuels, carrousels) ;
- dis-la à l'oral (« rendez-vous sur mboacm point com ») ;
- mets-la dans ta **signature e-mail** et sur tous tes supports imprimés.

### 4.5 Ton profil personnel

Google relie une entreprise à son fondateur. Sur **ton LinkedIn personnel** : ajoute Mboa dans **Expérience** (en reliant la page Mboa si elle existe) et `https://mboacm.com` dans **Coordonnées**, **Site web**.

---

## 5. Phase 3 : le contenu, le levier n°1

Aujourd'hui, Google n'a que **4 pages utiles** à classer (accueil et liste d'attente, en FR et EN). Aucune ne répond à « louer un appartement à Douala » ou « devenir agent immobilier ». **Sans pages dédiées, pas de visiteurs depuis ces recherches.**

### 5.1 Comment trouver ce que les gens cherchent

Avant d'écrire une page, vérifie comment les gens formulent leur recherche. Outils gratuits :

| Outil | Comment l'utiliser |
|---|---|
| **Saisie semi-automatique de Google** | Tape le début (« louer appartement Douala… ») et note les suggestions |
| **« Autres questions posées »** | Les questions affichées dans les résultats : chacune peut devenir une section ou un article |
| **Google Trends** (`trends.google.com`, pays : Cameroun) | Compare deux formulations, voit les tendances par région |
| **Search Console, Performances** | Les recherches qui t'affichent déjà : la meilleure source, une fois le site indexé |
| **Les commentaires et messages reçus** | Les questions de tes abonnés sont exactement les recherches des futurs visiteurs |

> **Parle comme tes visiteurs.** Au Cameroun, on cherche souvent « chambre moderne », « studio moderne », « mini-cité », « appartement meublé », « maison à louer », plutôt que « logement ». Vérifie ces termes dans Search Console et utilise ceux qui ressortent.

### 5.2 Les pages à créer (prévues dans le plan du site)

Par ordre de priorité. Chaque page vise **une** intention de recherche principale. Les recherches indiquées sont des pistes à confirmer avec la méthode du 5.1.

| Priorité | Page | Recherches visées (pistes) | Sources |
|---|---|---|---|
| 1 | **Propriétaires** `/proprietaires` | « louer mon appartement Douala », « trouver un locataire fiable », « mettre ma maison en location Yaoundé » | Doc 18 §1.2, §5 |
| 1 | **Devenir agent** `/devenir-agent` | « devenir agent immobilier Cameroun », « emploi agent immobilier Douala » | Doc 18 §1.2, Doc 10 |
| 1 | **FAQ** `/faq` | « Mboa c'est quoi », « Mboa est-ce fiable », « comment marche Mboa » | FAQ, Doc 10 |
| 2 | **Confiance** `/confiance` | « éviter arnaque location Douala », « faux démarcheur logement », « annonce logement vérifiée » | Doc 10, Doc 18 §1.3 |
| 2 | **App Mboa** `/applications/mboa` | « application pour trouver un logement au Cameroun », « application location appartement Douala » | Doc 10, Doc 06 §2.1 |
| 2 | **Le projet** `/le-projet` | « Mboa logement », « Mboa application » | Doc 01, 04, 06 |
| 3 | **App Mboa Pro**, **Tarifs**, **Feuille de route**, **À propos**, **Investisseurs**, **Presse**, **Vision** | Recherches de marque (« Mboa prix », « fondateur Mboa »…) | Voir CLAUDE.md |

Chaque page existe en **FR et en EN** (« find an apartment in Douala », « rent a house in Yaoundé »…).

### 5.3 Les articles (rubrique Actualités / Conseils)

Les articles répondent aux **questions** des futurs locataires et propriétaires. Ce sont eux qui amènent le plus de visiteurs sur la durée. Plusieurs existent déjà en posts : il suffit de les développer.

| Article | Point de départ | Recherches visées (pistes) |
|---|---|---|
| 5 choses vécues en cherchant un logement | `Post_02_5_Choses_Logement.md` | « chercher logement Douala », « galère recherche logement » |
| 3 réflexes avant de verser une caution | `Post_05_3_Questions_Caution.md` (conseils pratiques, sans affirmation juridique) | « caution location Cameroun », « verser une caution appartement » |
| Chercher un logement avec Mboa : recherche et filtres | `Post_E01_Chercher_Un_Logement.md` (Doc 10, M04) | « application recherche logement Cameroun », « trouver appartement Douala » |
| Pourquoi je construis Mboa (le déclic) | `Post_03_Le_Declic.md` | Recherches de marque, crédibilité |
| Qui est derrière Mboa | `Post_08_Qui_Est_Derriere_Mboa.md` | « fondateur Mboa », crédibilité |
| Comment repérer une fausse annonce de logement | À écrire | « arnaque logement Douala », « faux démarcheur » |
| Démarcheur, agent, bailleur : qui fait quoi ? | À écrire | « démarcheur immobilier Cameroun », « frais de visite » |
| Propriétaires : comment choisir un locataire sérieux | À écrire | « trouver un bon locataire », « garanties locataire » |

> ⚠️ `Post_06_Probleme_En_Chiffres.md` contient des chiffres de marché : ils ne doivent **pas** être publiés sur le site (décision du 2026-10-27). Pareil pour toute comparaison avec des concurrents.

**Rythme conseillé** : **2 articles par mois**, publiés en FR puis adaptés en EN. Chaque article est aussi partagé sur les réseaux avec un lien `?source=…` : un même contenu sert deux fois.

### 5.4 Les règles d'une page bien référencée

À appliquer à chaque nouvelle page ou article :

| Élément | Règle |
|---|---|
| **Un sujet, une page** | Une page répond à une seule question principale. Deux pages ne visent jamais la même recherche. |
| **Titre (`<title>`)** | 50 à 60 caractères, la recherche visée au début, « Mboa » à la fin ou au début. Ex. : « Louer votre appartement à Douala en toute sécurité · Mboa » |
| **Description** | 140 à 160 caractères, donne envie de cliquer, finit par une action (« Rejoignez la liste d'attente. ») |
| **Titre principal (`<h1>`)** | Un seul, proche de la recherche visée, lisible par un humain |
| **Intertitres (`<h2>`)** | Un par sous-question ; reprends les « Autres questions posées » |
| **Premier paragraphe** | Répond directement à la question en 2-3 phrases. Le détail vient après. |
| **Adresse (URL)** | Courte, en minuscules, avec des tirets : `/actualites/caution-location-cameroun` |
| **Liens internes** | Chaque page renvoie vers 2 ou 3 autres pages du site et vers la liste d'attente |
| **Images** | Texte alternatif qui décrit l'image ; vraies photos (pas de banque d'images), légères |
| **Auteur et date** | Article signé (toi, avec ta fonction) et daté ; date mise à jour si le contenu change |
| **Longueur** | Ce qu'il faut pour répondre complètement : souvent 600 à 1 200 mots pour un article |
| **Vérité** | Aucun chiffre, témoignage ou promesse qui ne vient pas des docs ou de toi |

> **Écris pour les gens, pas pour Google.** Répéter un mot-clé partout ne sert à rien et peut nuire. Google récompense la page qui répond le mieux, pas celle qui répète le plus.

### 5.5 Les signes de confiance (E-E-A-T)

Google valorise l'**expérience**, l'**expertise**, l'**autorité** et la **fiabilité**. Pour Mboa :

- raconter ton **expérience vécue** de la recherche de logement (c'est déjà ton récit fondateur) ;
- une page **À propos** avec toi, ton parcours et, plus tard, l'équipe ;
- des **mentions légales** complètes : remplis le RCCM et l'adresse dans `site.yaml` dès que tu les as ;
- un **contact** visible (e-mail, WhatsApp) ;
- des articles **signés et datés**.

---

## 6. Phase 4 : la popularité (liens entrants)

Pour Google, chaque site **sérieux** qui pointe vers `mboacm.com` est un vote de confiance. C'est le travail le plus long, mais c'est ce qui fait la différence face aux sites déjà installés.

### 6.1 Où obtenir des liens

| Source | Comment faire | Valeur |
|---|---|---|
| **Incubateurs, programmes, concours** | Toute structure qui t'accompagne (par exemple le Fonds Proto APME, si le dossier est retenu) : demande une fiche ou une mention avec lien | Forte |
| **Presse et blogs tech africains** | Un communiqué court à chaque étape : ouverture de la liste d'attente, test fermé, lancement du MVP | Forte |
| **Podcasts et interviews** | Propose ton histoire de fondateur ; demande le lien dans la description | Moyenne à forte |
| **Prestataires pionniers** | Les agences partenaires mettent « Bientôt sur Mboa » avec le lien, sur leur site ou leurs réseaux | Moyenne |
| **Annuaires d'entreprises camerounais** | 2 ou 3 annuaires sérieux, avec les mêmes informations que le 4.1 | Faible à moyenne |
| **Communautés tech** | Profils de startup (LinkedIn, plateformes d'écosystème startup), événements, hackathons | Moyenne |
| **Ton réseau** | Écoles, anciens employeurs, associations : une mention « ancien élève fondateur de Mboa » | Moyenne |

### 6.2 Le kit pour faciliter les liens

Quand quelqu'un parle de Mboa, donne-lui tout de suite :

- la **phrase de présentation** (4.1) et un paragraphe plus long ;
- le **logo** officiel (kit de marque v2) ;
- le **lien exact** : `https://mboacm.com` (ou `?source=nom-du-media` pour mesurer) ;
- ta **photo** et ta fonction.

> Plus tard, la page **Presse** (`/presse`) regroupera ce kit : chaque journaliste pourra s'y servir.

### 6.3 Les mentions sans lien

Si un article cite Mboa sans lien, écris poliment à l'auteur pour demander d'ajouter `https://mboacm.com`. Ça marche souvent.

---

## 7. Phase 5 : le référencement local

### 7.1 Fiche Google Business Profile : plus tard

La fiche qui apparaît dans Google Maps et à droite des résultats est un vrai plus. **Mais Google la réserve aux entreprises qui rencontrent leurs clients en personne.** Une activité uniquement en ligne n'y a pas droit, et la fiche risque d'être suspendue.

**Quand** : dès que les visites avec les agents commencent à Douala et Yaoundé, autour du lancement du MVP. Mboa sera alors une entreprise « avec zone desservie ».

1. **https://business.google.com**, **Gérer maintenant**.
2. **Nom** : `Mboa` (exactement, sans mot-clé ajouté : Google suspend les fiches dont le nom est « gonflé »).
3. **Catégorie** : la plus proche de l'activité réelle (tape « location » et choisis parmi les propositions).
4. « Ajouter un lieu que les clients peuvent visiter ? » : **Non**, sauf si tu as un bureau ouvert au public.
5. **Zones desservies** : Douala, Yaoundé.
6. **Téléphone** : `+237 695 914 926`. **Site web** : `https://mboacm.com/?source=google-maps`.
7. Suis la **validation** demandée (code, vidéo ou appel).
8. Complète tout : description, horaires, logo, photos réelles, et publie des **posts** réguliers sur la fiche.

### 7.2 Les avis

Une fois l'app lancée, demande aux locataires et propriétaires satisfaits de laisser un **avis Google**. Ne jamais acheter d'avis, ni en écrire soi-même : c'est interdit et détecté.

### 7.3 Les autres cartes

Au même moment : **Bing Places** (`bingplaces.com`, import possible depuis Google) et **Apple Business Connect** (`businessconnect.apple.com`) pour Apple Plans.

---

## 8. Phase 6 : le lancement des applications

Le jour où les applications sont publiées :

1. **Dans `site.yaml`** : remplis `stores.appStore` et `stores.playStore`, puis passe `launch.appsLive` à `true`. Les boutons des stores remplacent la liste d'attente.
2. **Demande-moi d'ajouter la fiche `MobileApplication`** : Google pourra afficher l'app (note, prix « gratuit ») dans les résultats.
3. **Fiches des stores** : nom `Mboa` (et `Mboa Pro`), même phrase de présentation, lien vers `https://mboacm.com`. Les fiches App Store et Google Play renforcent beaucoup la marque aux yeux de Google.
4. **Liens profonds** : finaliser `apple-app-site-association` et `assetlinks.json` avec les identifiants du projet mobile (jamais devinés).
5. **Search Console** : redemande l'indexation de l'accueil.
6. **Communiqué de lancement** à la presse et aux partenaires (phase 4) : c'est le meilleur moment pour obtenir des liens.

---

## 9. Le suivi : routines hebdo, mensuelle, trimestrielle

### Chaque semaine (15 minutes, par exemple le lundi matin)

| Où | Quoi regarder |
|---|---|
| **Brevo**, Contacts, filtre sur `SOURCE` | Inscrits par canal : instagram, carte, direct… Mise davantage sur ce qui marche. |
| **Search Console**, Performances | Recherches qui t'affichent, clics, position. Note les nouvelles recherches. |
| **Cloudflare**, Web Analytics | Visites par page, pays, mobile ou ordinateur |

### Chaque mois (45 minutes)

| Où | Quoi faire |
|---|---|
| **Search Console**, Indexation, Pages | Pages non indexées : lire la raison (voir [problèmes fréquents](#11-problèmes-fréquents-et-solutions)) |
| **Search Console**, Performances, filtre Requêtes | Repérer les recherches avec beaucoup d'affichages mais peu de clics : améliorer le titre et la description de la page concernée |
| **Search Console**, Liens | Nouveaux sites qui pointent vers Mboa |
| **Plan de contenu** | Choisir les 2 articles du mois suivant à partir des recherches observées |
| **Google**, en navigation privée | Taper « Mboa », « mboacm », « Mboa logement » et noter la position |

### Chaque trimestre (2 heures)

- Relire les pages principales : informations à jour (date de lancement, villes, fonctionnalités) ?
- Mettre à jour les articles anciens (et leur date de mise à jour).
- Lancer un test **PageSpeed Insights** (`pagespeed.web.dev`) sur l'accueil : tout doit rester vert.
- Faire le point sur les liens obtenus et relancer les contacts presse et partenaires.

### Les indicateurs à suivre

| Indicateur | Où | Tendance attendue |
|---|---|---|
| Pages indexées | Search Console, Pages | Augmente avec chaque nouvelle page |
| Impressions (affichages dans Google) | Search Console, Performances | Augmente d'abord, avant les clics |
| Clics | Search Console, Performances | Suit les impressions avec retard |
| Taux de clic (CTR) | Search Console, Performances | S'améliore quand titres et descriptions sont bons |
| Position moyenne sur « Mboa » | Search Console, filtre Requête | Doit monter vers la 1re place |
| Inscrits venant de Google | Brevo, `SOURCE = direct` + Cloudflare | Augmente avec le contenu |

---

## 10. Ce qu'il ne faut jamais faire

| Interdit | Pourquoi |
|---|---|
| **Acheter des liens** ou des « packs SEO » | Google le détecte et peut faire disparaître le site des résultats |
| **Annuaires de mauvaise qualité** en masse | Ignorés au mieux, pénalisants au pire |
| **Répéter des mots-clés** ou cacher du texte | Considéré comme de la manipulation |
| **Copier le contenu** d'autres sites | Google ne classe pas les copies, et c'est illégal |
| **Publier des chiffres, témoignages ou avis inventés** | Interdit par les règles du projet, et dangereux pour la confiance |
| **Faux avis Google** | Interdit, détecté, peut faire suspendre la fiche |
| **Changer les adresses des pages** sans redirection | Les pages perdent leur position ; toujours prévoir une redirection 301 |
| **Supprimer le TXT de vérification** Google | Search Console perd l'accès |
| **Mettre « Mboa » + mots-clés dans le nom** de la fiche Google | Motif de suspension |
| **Publier des pages vides** « bientôt disponible » | Google les juge inutiles ; mieux vaut attendre d'avoir le contenu |

---

## 11. Problèmes fréquents et solutions

**« Impossible de récupérer » le sitemap**
Fréquent juste après l'envoi : Google n'a pas encore essayé. Attends 2 à 3 jours. Si ça persiste : ouvre `https://mboacm.com/sitemap-index.xml` dans le navigateur (le message « This XML file does not appear to have any style information » est **normal**), vérifie l'orthographe dans Search Console, essaie d'envoyer `sitemap-0.xml`, et regarde dans Cloudflare (**Security**, **Events**) si Googlebot est bloqué.

**« Cette URL n'a pas été indexée par Google »**
Normal pour un site neuf, et toujours vrai pour le sitemap lui-même (un sitemap n'est pas une page). Clique sur **Tester l'URL en direct** : si le test est vert, demande l'indexation et attends.

**« Explorée, actuellement non indexée »**
Google a vu la page mais ne la trouve pas assez utile pour l'instant. Solution : enrichir le contenu, ajouter des liens internes vers cette page, obtenir des liens externes.

**« Détectée, actuellement non indexée »**
Google connaît l'adresse mais n'est pas encore passé. Patience, et des liens internes vers la page.

**« Page en double sans URL canonique sélectionnée par l'utilisateur »**
Souvent une adresse avec `?source=…`. Le site déclare déjà l'adresse officielle : rien à faire, Google retient la bonne.

**Google affiche « Mboacm » au lieu de « Mboa »**
Le site envoie bien « Mboa » (et « Mboa Cameroun » en secours depuis la version 1.2.2). Google met plusieurs semaines à changer le nom affiché, après avoir relu l'accueil. Demande l'indexation de `https://mboacm.com/` et applique la [phase 2](#4-phase-2--faire-reconnaître-le-nom-mboa).

**Le titre ou la description affichés par Google ne sont pas les miens**
Google réécrit parfois. Ça arrive quand le titre est trop long ou ne correspond pas à la recherche. Raccourcis-le et rapproche-le de la recherche visée.

**Le site a disparu des résultats**
Vérifie dans l'ordre : Search Console, **Actions manuelles** et **Problèmes de sécurité** ; le site répond-il ? `robots.txt` autorise-t-il toujours tout ? Une page a-t-elle reçu `noindex` par erreur ?

**L'aperçu sur WhatsApp ou Facebook montre une ancienne image**
Les réseaux gardent l'aperçu en mémoire. Passe la page dans le débogueur Facebook (étape 1.6) et clique sur **Récupérer à nouveau**. Pour WhatsApp, ajoute un paramètre (`?source=whatsapp`) pour forcer un nouvel aperçu.

---

## 12. Calendrier et checklist

### Cette semaine

- [ ] Version 1.2.2 en ligne (étape 1.1)
- [ ] Search Console : domaine validé, sitemap envoyé, 4 pages clés demandées (étape 1.2)
- [ ] Bing Webmaster Tools importé (étape 1.3)
- [ ] Crawler Hints activé dans Cloudflare (étape 1.4)
- [ ] Tests Google et Facebook passés (étapes 1.5 et 1.6)
- [ ] Bios des réseaux avec liens `?source=` (4.2)
- [ ] Nom affiché « Mboa » sur tous les profils (4.1)
- [ ] Lien Instagram nettoyé dans `site.yaml` (4.3)

### Ce mois-ci

- [ ] Pages **Propriétaires**, **Devenir agent** et **FAQ** en ligne (FR + EN)
- [ ] 2 premiers articles publiés (à partir des posts 02 et 05)
- [ ] LinkedIn personnel mis à jour (4.5)
- [ ] 3 demandes de liens : incubateur / programme, 1 média, 1 annuaire sérieux

### Les 3 prochains mois

- [ ] Pages **Confiance**, **App Mboa**, **Le projet** en ligne
- [ ] 2 articles par mois
- [ ] Communiqué de presse pour le test fermé
- [ ] RCCM et adresse dans `site.yaml` (mentions légales complètes)
- [ ] Premier bilan trimestriel (section 9)

### Au lancement du MVP

- [ ] Fiche Google Business Profile (7.1), Bing Places, Apple Business Connect (7.3)
- [ ] `appsLive: true`, liens des stores, fiche `MobileApplication` (phase 6)
- [ ] Communiqué de lancement et relance des partenaires
- [ ] Demande d'avis aux premiers clients satisfaits

---

## 13. Glossaire

| Terme | Signification |
|---|---|
| **SEO** | *Search Engine Optimization* : tout ce qui aide un site à apparaître dans les moteurs de recherche |
| **Indexation** | Le fait que Google garde une page dans sa base, et puisse donc l'afficher |
| **Sitemap** | Fichier qui liste les pages du site pour les moteurs |
| **Canonical** | L'adresse officielle d'une page, quand plusieurs adresses mènent au même contenu |
| **hreflang** | Balise qui relie les versions d'une page dans différentes langues |
| **Données structurées (JSON-LD)** | Fiches lisibles par les machines : organisation, site, FAQ, application… |
| **`<title>`** | Le titre de la page dans l'onglet et dans les résultats Google |
| **Meta description** | Le petit texte sous le titre dans les résultats |
| **`<h1>`** | Le titre principal visible sur la page |
| **Lien entrant (backlink)** | Un lien d'un autre site vers le tien |
| **Impressions** | Le nombre de fois où le site est apparu dans les résultats |
| **CTR** | Taux de clic : clics ÷ impressions |
| **E-E-A-T** | Expérience, expertise, autorité, fiabilité : les signes de confiance que Google recherche |
| **IndexNow** | Protocole qui prévient Bing et d'autres moteurs dès qu'une page change |
| **Redirection 301** | Renvoi permanent d'une ancienne adresse vers la nouvelle, qui conserve le référencement |

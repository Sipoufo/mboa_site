import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // 1. Laisse Astro exécuter la page normalement et générer la réponse
  const response = await next();

  // 2. Récupère l'URL de la requête en cours
  const url = new URL(context.request.url);

  // 3. Si l'accès se fait via le sous-domaine de test Cloudflare
  if (url.hostname.endsWith(".workers.dev")) {
    // On ajoute l'en-tête pour bloquer Google sans casser le site
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
});

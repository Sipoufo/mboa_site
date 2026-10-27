import { settings, socialLinks } from "./settings";

/** schema.org Organization, emitted on every page. */
export function organizationJsonLd(site: URL, description: string) {
  const sameAs = socialLinks().map((link) => link.url);
  const email = settings.contact.email || settings.legal.supportEmail;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mboa",
    url: site.toString(),
    logo: new URL("/apple-touch-icon.png", site).toString(),
    description,
    areaServed: { "@type": "Country", name: "Cameroon" },
    ...(settings.legal.companyName && { legalName: settings.legal.companyName }),
    ...(email && { email }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/** Serialized for a <script type="application/ld+json">, safe against "</script>" injection. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

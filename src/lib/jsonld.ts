import { localeTags, type Locale } from "@/i18n/locales";
import { settings, socialLinks } from "./settings";

type JsonLdNode = Record<string, unknown>;

/** Profile URLs without tracking parameters (e.g. Instagram's `?srtk=`), as search engines expect. */
function cleanProfileUrl(url: string): string {
  const parsed = new URL(url);
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}

/** schema.org Organization — the brand behind the site. */
export function organizationJsonLd(site: URL, description: string): JsonLdNode {
  const sameAs = socialLinks().map((link) => cleanProfileUrl(link.url));
  const email = settings.contact.email || settings.legal.supportEmail;

  return {
    "@type": "Organization",
    "@id": new URL("/#organization", site).toString(),
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

/** schema.org WebSite — lets Google show "Mboa" as the site name in results. */
export function websiteJsonLd(site: URL, locale: Locale): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": new URL("/#website", site).toString(),
    name: "Mboa",
    alternateName: "mboacm",
    url: site.toString(),
    inLanguage: localeTags[locale],
    publisher: { "@id": new URL("/#organization", site).toString() },
  };
}

/** schema.org FAQPage, for a page that shows these exact questions and answers. */
export function faqPageJsonLd(items: { question: string; answer: string }[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/** One JSON-LD document per page: Organization + WebSite, plus the page's own nodes. */
export function pageGraph(site: URL, locale: Locale, description: string, extra: JsonLdNode[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(site, description), websiteJsonLd(site, locale), ...extra],
  };
}

/** Serialized for a <script type="application/ld+json">, safe against "</script>" injection. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

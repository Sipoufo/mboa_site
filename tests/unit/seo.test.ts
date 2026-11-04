import { describe, expect, it } from "vitest";
import { faqPageJsonLd, pageGraph } from "@/lib/jsonld";
import { withAlternates } from "@/lib/sitemap";

const site = new URL("https://mboacm.com");

describe("sitemap alternates", () => {
  it("pairs pages whose FR and EN slugs differ", () => {
    const item = withAlternates({ url: "https://mboacm.com/en/waitlist" });
    expect(item.links).toEqual([
      { lang: "fr-CM", url: "https://mboacm.com/liste-d-attente" },
      { lang: "en-CM", url: "https://mboacm.com/en/waitlist" },
      { lang: "x-default", url: "https://mboacm.com/liste-d-attente" },
    ]);
  });

  it("handles the home page", () => {
    expect(withAlternates({ url: "https://mboacm.com/" }).links?.[1]).toEqual({
      lang: "en-CM",
      url: "https://mboacm.com/en",
    });
  });

  it("leaves unknown pages untouched", () => {
    expect(withAlternates({ url: "https://mboacm.com/carte" })).toEqual({ url: "https://mboacm.com/carte" });
  });
});

describe("JSON-LD graph", () => {
  const graph = pageGraph(site, "fr", "Description", [faqPageJsonLd([{ question: "Q ?", answer: "R." }])]);
  const types = graph["@graph"].map((node) => node["@type"]);

  it("holds the organization, the website and the page's own nodes", () => {
    expect(types).toEqual(["Organization", "WebSite", "FAQPage"]);
  });

  it("links the website to its publisher", () => {
    const website = graph["@graph"][1] as { publisher: { "@id": string } };
    expect(website.publisher["@id"]).toBe("https://mboacm.com/#organization");
  });

  it("names the site after the brand, never after the domain", () => {
    const website = graph["@graph"][1] as { name: string; alternateName: string };
    expect(website.name).toBe("Mboa");
    // Google's fallback when it rejects "Mboa" alone: must still read as the brand.
    expect(website.alternateName).toBe("Mboa Cameroun");
  });

  it("strips tracking parameters from social profiles", () => {
    const organization = graph["@graph"][0] as { sameAs?: string[] };
    for (const url of organization.sameAs ?? []) expect(url).not.toMatch(/[?#]/);
  });
});

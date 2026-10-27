import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { settingsSchema } from "@/lib/settings-schema";
import { whatsappUrl } from "@/lib/settings";

const file = parse(readFileSync("src/content/settings/site.yaml", "utf8"));

describe("site.yaml", () => {
  it("is valid against the schema", () => {
    expect(() => settingsSchema.parse(file)).not.toThrow();
  });

  it("rejects a malformed MVP date", () => {
    const broken = { ...file, launch: { ...file.launch, mvpDate: "décembre 2026" } };
    expect(settingsSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects a social link that is not a URL", () => {
    const broken = { ...file, socials: { ...file.socials, instagram: "@mboa_cm" } };
    expect(settingsSchema.safeParse(broken).success).toBe(false);
  });
});

describe("whatsappUrl", () => {
  it("keeps only digits", () => {
    expect(whatsappUrl("+237 6 99 00 00 00")).toBe("https://wa.me/237699000000");
  });
});

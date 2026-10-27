import { parse } from "yaml";
import raw from "../content/settings/site.yaml?raw";
import { requiredLegalFields, settingsSchema, type Settings } from "./settings-schema";

export type { Settings } from "./settings-schema";

/** Founder-editable settings, validated once. An invalid file fails the build. */
export const settings: Settings = settingsSchema.parse(parse(raw));

const missingLegal = requiredLegalFields.filter((field) => settings.legal[field] === "");
if (missingLegal.length > 0 && import.meta.env.PROD) {
  console.warn(`[settings] Legal fields still empty in site.yaml: ${missingLegal.join(", ")}`);
}

/** Social profiles that have a URL, in display order. */
export function socialLinks() {
  const labels = { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", linkedin: "LinkedIn" } as const;
  return (Object.keys(labels) as (keyof typeof labels)[])
    .filter((network) => settings.socials[network] !== "")
    .map((network) => ({ network, label: labels[network], url: settings.socials[network] }));
}

/** wa.me link for a WhatsApp number written in any international format. */
export function whatsappUrl(number: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

import type { Locale } from "@/i18n/locales";
import { localizedPath, t } from "@/i18n/utils";
import { cities, profiles, type City, type Profile } from "@/lib/forms/waitlist-fields";

/** Every string the WaitlistForm island displays, translated on the server (islands never import dictionaries). */
export function waitlistCopy(locale: Locale) {
  const tr = (key: Parameters<typeof t>[1]) => t(locale, key);
  return {
    locale,
    privacyHref: localizedPath("privacy", locale),
    labels: {
      firstName: tr("waitlist.form.firstName"),
      email: tr("waitlist.form.email"),
      whatsapp: tr("waitlist.form.whatsapp"),
      contactHint: tr("waitlist.form.contactHint"),
      whatsappHint: tr("waitlist.form.whatsappHint"),
      city: tr("waitlist.form.city"),
      profile: tr("waitlist.form.profile"),
      motivation: tr("waitlist.form.motivation"),
      optional: tr("waitlist.form.optional"),
      choose: tr("waitlist.form.choose"),
      consentBefore: tr("waitlist.form.consentBefore"),
      consentLink: tr("waitlist.form.consentLink"),
      consentAfter: tr("waitlist.form.consentAfter"),
      submit: tr("waitlist.form.submit"),
      submitting: tr("waitlist.form.submitting"),
      honeypot: tr("waitlist.form.honeypot"),
    },
    cities: Object.fromEntries(cities.map((city) => [city, tr(`waitlist.cities.${city}`)])) as Record<City, string>,
    profiles: Object.fromEntries(profiles.map((profile) => [profile, tr(`waitlist.profiles.${profile}`)])) as Record<
      Profile,
      string
    >,
    errors: {
      required: tr("waitlist.errors.required"),
      firstName: tr("waitlist.errors.firstName"),
      email: tr("waitlist.errors.email"),
      invalid_phone: tr("waitlist.errors.invalidPhone"),
      contact_required: tr("waitlist.errors.contactRequired"),
      consent: tr("waitlist.errors.consent"),
      captcha: tr("waitlist.errors.captcha"),
      unavailable: tr("waitlist.errors.unavailable"),
      provider: tr("waitlist.errors.provider"),
      network: tr("waitlist.errors.network"),
      summary: tr("waitlist.errors.summary"),
    },
    success: {
      title: tr("waitlist.success.title"),
      titleNamed: tr("waitlist.success.titleNamed"),
      subscribed: tr("waitlist.success.subscribed"),
      confirmation: tr("waitlist.success.confirmation"),
      confirmed: tr("waitlist.success.confirmed"),
      simulated: tr("waitlist.success.simulated"),
      again: tr("waitlist.success.again"),
    },
  };
}

export type WaitlistCopy = ReturnType<typeof waitlistCopy>;

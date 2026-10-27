import { useEffect, useId, useRef, useState, type SubmitEvent } from "react";
import type { WaitlistResponse } from "@/lib/forms/handlers";
import {
  cities,
  limits,
  normalizePhone,
  profiles,
  type Profile,
  type WaitlistField,
} from "@/lib/forms/waitlist-fields";
import type { WaitlistCopy } from "./waitlist-copy";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onMboaTurnstileLoad?: () => void;
  }
}

interface Props {
  copy: WaitlistCopy;
  turnstileSiteKey: string;
}

type Status = "idle" | "submitting" | "success" | "error";
type SuccessKind = "subscribed" | "confirmation_sent" | "simulated" | "confirmed";

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onMboaTurnstileLoad";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Loads the Turnstile script once, only when the form is on screen. */
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    window.onMboaTurnstileLoad = () => resolve();
    if (document.querySelector(`script[src^="https://challenges.cloudflare.com/turnstile"]`)) return;
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(script);
  });
}

function initialProfile(): Profile | "" {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("profil") ?? params.get("profile") ?? "";
  return (profiles as readonly string[]).includes(value) ? (value as Profile) : "";
}

export default function WaitlistForm({ copy, turnstileSiteKey }: Props) {
  const id = useId();
  const { labels, errors: messages } = copy;

  const [status, setStatus] = useState<Status>("idle");
  const [successKind, setSuccessKind] = useState<SuccessKind>("subscribed");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<WaitlistField, string>>>({});
  const [profile, setProfile] = useState<Profile | "">("");
  const [submittedName, setSubmittedName] = useState("");

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const token = useRef("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfile(initialProfile());
    if (new URLSearchParams(window.location.search).get("confirmed") === "1") {
      setSuccessKind("confirmed");
      setStatus("success");
    }
  }, []);

  useEffect(() => {
    if (status === "success" || !turnstileSiteKey) return;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !turnstileRef.current || !window.turnstile || widgetId.current) return;
        widgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: turnstileSiteKey,
          language: copy.locale,
          appearance: "interaction-only",
          callback: (value: string) => (token.current = value),
          "expired-callback": () => (token.current = ""),
          "error-callback": () => (token.current = ""),
        });
      })
      .catch(() => setFormError(messages.captcha));
    return () => {
      cancelled = true;
    };
  }, [status, turnstileSiteKey, copy.locale, messages.captcha]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function validate(form: FormData): Partial<Record<WaitlistField, string>> {
    const found: Partial<Record<WaitlistField, string>> = {};
    const firstName = String(form.get("firstName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const whatsapp = String(form.get("whatsapp") ?? "").trim();

    if (firstName.length < limits.firstName.min) found.firstName = messages.firstName;
    if (email && !EMAIL_PATTERN.test(email)) found.email = messages.email;
    if (whatsapp && !normalizePhone(whatsapp)) found.whatsapp = messages.invalid_phone;
    if (!email && !whatsapp) found.email = messages.contact_required;
    if (!form.get("city")) found.city = messages.required;
    if (!form.get("profile")) found.profile = messages.required;
    if (form.get("consent") !== "on") found.consent = messages.consent;
    return found;
  }

  function serverFieldMessage(code: string, field: WaitlistField): string {
    if (code in messages) return messages[code as keyof typeof messages];
    if (field === "firstName") return messages.firstName;
    if (field === "email") return messages.email;
    if (field === "consent") return messages.consent;
    return messages.required;
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFormError("");

    const found = validate(form);
    setFieldErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError(messages.summary);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          email: form.get("email"),
          whatsapp: form.get("whatsapp"),
          city: form.get("city"),
          profile: form.get("profile"),
          motivation: form.get("motivation"),
          consent: form.get("consent") === "on",
          company: form.get("company") || undefined,
          locale: copy.locale,
          turnstileToken: token.current,
        }),
      });
      const result = (await response.json()) as WaitlistResponse;

      if (result.ok) {
        setSubmittedName(String(form.get("firstName") ?? "").trim());
        setSuccessKind(result.status);
        setStatus("success");
        return;
      }

      if (result.error === "validation") {
        const mapped: Partial<Record<WaitlistField, string>> = {};
        for (const [field, code] of Object.entries(result.fields)) {
          mapped[field as WaitlistField] = serverFieldMessage(code, field as WaitlistField);
        }
        setFieldErrors(mapped);
        setFormError(messages.summary);
      } else {
        setFormError(messages[result.error === "bad_request" ? "network" : result.error]);
      }
      window.turnstile?.reset(widgetId.current);
      token.current = "";
      setStatus("error");
      requestAnimationFrame(() => summaryRef.current?.focus());
    } catch {
      setFormError(messages.network);
      setStatus("error");
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  if (status === "success") {
    const text = {
      subscribed: copy.success.subscribed,
      confirmation_sent: copy.success.confirmation,
      simulated: copy.success.simulated,
      confirmed: copy.success.confirmed,
    }[successKind];

    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-4 outline-none">
        <span className="flex size-14 items-center justify-center rounded-full bg-forest-pale text-forest">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2 className="text-h2">
          {submittedName ? copy.success.titleNamed.replace("{name}", submittedName) : copy.success.title}
        </h2>
        <p className="text-lead text-gray-dark">{text}</p>
      </div>
    );
  }

  const describedBy = (field: WaitlistField, hint?: string) =>
    [hint, fieldErrors[field] ? `${id}-${field}-error` : undefined].filter(Boolean).join(" ") || undefined;

  const inputClass =
    "h-13 w-full rounded-button border-[1.5px] border-gray-light bg-warm-white px-4 text-base text-ink placeholder:text-gray-mid transition-colors focus:border-forest focus:outline-none aria-[invalid=true]:border-error";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink";

  const fieldError = (field: WaitlistField) =>
    fieldErrors[field] ? (
      <p id={`${id}-${field}-error`} className="mt-1.5 text-sm text-error-text">
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5" aria-busy={status === "submitting"}>
      <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {formError && (
          <p className="rounded-button bg-coral-pale px-4 py-3 text-sm font-medium text-coral-dark" role="alert">
            {formError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-firstName`} className={labelClass}>
          {labels.firstName}
        </label>
        <input
          id={`${id}-firstName`}
          name="firstName"
          autoComplete="given-name"
          maxLength={limits.firstName.max}
          required
          aria-invalid={Boolean(fieldErrors.firstName)}
          aria-describedby={describedBy("firstName")}
          className={inputClass}
        />
        {fieldError("firstName")}
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 text-sm text-gray-dark">{labels.contactHint}</legend>
        <div>
          <label htmlFor={`${id}-email`} className={labelClass}>
            {labels.email}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={describedBy("email")}
            className={inputClass}
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor={`${id}-whatsapp`} className={labelClass}>
            {labels.whatsapp}
          </label>
          <input
            id={`${id}-whatsapp`}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+237 6XX XX XX XX"
            aria-invalid={Boolean(fieldErrors.whatsapp)}
            aria-describedby={describedBy("whatsapp", `${id}-whatsapp-hint`)}
            className={inputClass}
          />
          <p id={`${id}-whatsapp-hint`} className="mt-1.5 text-xs text-gray-dark">
            {labels.whatsappHint}
          </p>
          {fieldError("whatsapp")}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-city`} className={labelClass}>
            {labels.city}
          </label>
          <select
            id={`${id}-city`}
            name="city"
            required
            defaultValue=""
            aria-invalid={Boolean(fieldErrors.city)}
            aria-describedby={describedBy("city")}
            className={inputClass}
          >
            <option value="" disabled>
              {labels.choose}
            </option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {copy.cities[city]}
              </option>
            ))}
          </select>
          {fieldError("city")}
        </div>
        <div>
          <label htmlFor={`${id}-profile`} className={labelClass}>
            {labels.profile}
          </label>
          <select
            id={`${id}-profile`}
            name="profile"
            required
            value={profile}
            onChange={(event) => setProfile(event.target.value as Profile)}
            aria-invalid={Boolean(fieldErrors.profile)}
            aria-describedby={describedBy("profile")}
            className={inputClass}
          >
            <option value="" disabled>
              {labels.choose}
            </option>
            {profiles.map((value) => (
              <option key={value} value={value}>
                {copy.profiles[value]}
              </option>
            ))}
          </select>
          {fieldError("profile")}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-motivation`} className={labelClass}>
          {labels.motivation} <span className="font-normal text-gray-dark">({labels.optional})</span>
        </label>
        <textarea
          id={`${id}-motivation`}
          name="motivation"
          rows={3}
          maxLength={limits.motivation.max}
          className={`${inputClass} h-auto py-3`}
        />
      </div>

      {/* Honeypot: hidden from people and assistive tech, bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>{labels.honeypot}</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={`${id}-consent`}
            name="consent"
            type="checkbox"
            required
            aria-invalid={Boolean(fieldErrors.consent)}
            aria-describedby={describedBy("consent")}
            className="mt-0.5 size-5 shrink-0 accent-forest"
          />
          <label htmlFor={`${id}-consent`} className="text-sm text-gray-dark">
            {labels.consentBefore}{" "}
            <a href={copy.privacyHref} className="font-medium text-forest underline underline-offset-2">
              {labels.consentLink}
            </a>
            {labels.consentAfter}
          </label>
        </div>
        {fieldError("consent")}
      </div>

      <div ref={turnstileRef} />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-button bg-coral-dark px-5 text-base font-semibold text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.98] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-85 disabled:shadow-none"
      >
        {status === "submitting" ? labels.submitting : labels.submit}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}

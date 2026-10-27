import { useEffect, useState } from "react";

interface Props {
  /** Translated sentence with a `{count}` placeholder. */
  template: string;
  numberLocale: string;
}

/**
 * Public waitlist size (Doc 20 §6). Renders nothing until the server reports a count —
 * the endpoint returns null below the configured floor.
 */
export default function WaitlistCounter({ template, numberLocale }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/waitlist-count")
      .then((response) => (response.ok ? response.json() : { count: null }))
      .then((data: { count: number | null }) => active && setCount(data.count))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (count === null) return null;

  const formatted = new Intl.NumberFormat(numberLocale).format(count);
  const [before, after] = template.split("{count}");

  return (
    <p
      className="inline-flex items-center gap-2 rounded-pill bg-forest-pale px-4 py-2 text-sm text-forest"
      role="status"
    >
      <span className="size-2 animate-pulse rounded-full bg-forest" aria-hidden="true" />
      <span>
        {before}
        <strong className="font-semibold">{formatted}</strong>
        {after}
      </span>
    </p>
  );
}

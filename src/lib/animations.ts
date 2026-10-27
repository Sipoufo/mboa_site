/**
 * Shared scroll-reveal fallback (CLAUDE.md › Animations).
 * Browsers with CSS scroll-driven animations reveal [data-reveal] in pure CSS;
 * for the others the head script adds `html.js-reveal` and this observer
 * marks elements visible as they enter the viewport.
 */
export function initReveal(): void {
  const root = document.documentElement;
  if (!root.classList.contains("js-reveal")) return;

  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
  );

  elements.forEach((element) => observer.observe(element));
}

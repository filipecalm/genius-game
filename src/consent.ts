const CONSENT_KEY = "genius-cookie-consent";

type ConsentValue = "accepted" | "rejected";

function getMeasurementId(): string | undefined {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  return typeof id === "string" && id.trim().length > 0 ? id.trim() : undefined;
}

function loadAnalytics(measurementId: string): void {
  if (document.getElementById("ga-gtag")) return;

  const script = document.createElement("script");
  script.id = "ga-gtag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });
}

function persistConsent(value: ConsentValue): void {
  localStorage.setItem(CONSENT_KEY, value);
}

function readConsent(): ConsentValue | null {
  const value = localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

function hideBanner(banner: HTMLElement): void {
  banner.classList.add("consent--hidden");
  banner.setAttribute("aria-hidden", "true");
}

export function initConsent(): void {
  const measurementId = getMeasurementId();
  const banner = document.querySelector<HTMLElement>("[data-consent]");
  if (!banner) return;

  const existing = readConsent();

  if (existing === "accepted" && measurementId) {
    loadAnalytics(measurementId);
    hideBanner(banner);
    return;
  }

  if (existing) {
    hideBanner(banner);
    return;
  }

  banner.classList.remove("consent--hidden");
  banner.setAttribute("aria-hidden", "false");

  banner.querySelector("[data-consent-accept]")?.addEventListener("click", () => {
    persistConsent("accepted");
    if (measurementId) loadAnalytics(measurementId);
    hideBanner(banner);
  });

  banner.querySelector("[data-consent-reject]")?.addEventListener("click", () => {
    persistConsent("rejected");
    hideBanner(banner);
  });
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

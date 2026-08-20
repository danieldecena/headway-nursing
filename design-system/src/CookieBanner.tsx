export interface CookieBannerProps {
  /** The Astro original hides itself until consent is unknown; previews render it open. */
  open?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

// The Astro component also gates on PUBLIC_GA_ID and carries the consent/GA
// loader script; that behavior stays in the site. This is the visual surface.
export function CookieBanner({ open = true, onAccept, onReject }: CookieBannerProps) {
  return (
    <div
      id="cookie-banner"
      className={`fixed bottom-0 left-0 right-0 z-50 ${open ? '' : 'hidden '}border-t border-slate-200 bg-white p-4 shadow-lg`}
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          We use cookies for analytics to improve our site.{' '}
          <a href="/privacy" className="text-brand-700 underline">Privacy Policy</a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            id="cookie-reject"
            type="button"
            onClick={onReject}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Decline
          </button>
          <button
            id="cookie-accept"
            type="button"
            onClick={onAccept}
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

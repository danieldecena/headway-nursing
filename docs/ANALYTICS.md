# Analytics

Google Analytics 4 and PostHog, either or both, loaded only after the visitor
accepts the cookie banner. Everything lives in
`src/components/CookieBanner.astro` — there is no analytics package, no tag
manager, and no build-time dependency. Both SDKs are fetched from their vendor
CDN after consent, so an unconfigured or declined visit ships no analytics
JavaScript at all.

## Turning it on

Two independent switches, both optional:

| Var | Value | Effect |
|---|---|---|
| `PUBLIC_GA_ID` | `G-XXXXXXXXXX` | loads gtag, sends every event below to GA4 |
| `PUBLIC_POSTHOG_KEY` | project API key, PostHog Project Settings | loads PostHog, sends the same events there |
| `PUBLIC_POSTHOG_HOST` | optional | defaults to `https://us.i.posthog.com`; set for EU or self-hosted |

Set them as repo secrets and in `.env` for local work. With **both** unset the
banner, both SDK loaders and the event listeners are absent from the built
HTML — the site simply has no analytics rather than a broken banner. With one
set, only that one loads.

PostHog's free tier covers this site's expected traffic. The `self-driving`
wizard is a separate paid product ($15 per pull request its agents ship) and is
deliberately not used here; the SDK is wired by hand so it stays behind the
consent gate.

## Consent

`localStorage` key `cookie-consent`: `1` accepted, `0` declined, absent means
not asked yet. Neither SDK loads except on `1`. A declined visitor gets no
`gtag` at all and only PostHog's inert stub, so the event listeners below run
and send nothing to either destination.

PostHog uses its stub queue, rendered by `src/components/posthog.astro` when
`PUBLIC_POSTHOG_KEY` is set. The stub creates `window.posthog` but loads no
remote script and sends nothing. Captures made before a consent decision are
held in memory; accepting calls `init()`, which loads the real SDK and replays
them, and declining never calls `init()`, so the queue is discarded on
navigation and nothing reaches the network. GA has no equivalent: pre-consent
activity is simply lost there.

## Events

One delegated click listener and one delegated submit listener on `document`.
Elements opt in with `data-analytics="<event name>"`; `tel:` and `mailto:`
links are matched by their `href` instead, so every phone and email link on the
site counts without being tagged.

| Event | Fires on | Where |
|---|---|---|
| `phone_click` | any `tel:` link | header, footer, contact, course pages |
| `email_click` | any `mailto:` link | footer, contact, course pages |
| `course_register_click` | course card CTA for a priced, available course | `/courses`, home |
| `course_inquiry_click` | course card CTA that routes to `/contact` instead | `/courses`, home |
| `register_click` | "Register Now" in the register section | contact + every course page |
| `pay_online_click` | the Stripe Pay Online button | contact + every course page |
| `register_submit` | the Formspree form submitting | contact + every course page |
| `student_login_click` | the Relias portal link | `/student-login` |
| `course_viewed` | a course detail page loading | every `/courses/<slug>` page |

Each click event carries `link_text` (the element's visible text, truncated to
100 characters) so GA4 can tell the header phone number from the footer one.

`course_viewed` is the exception: it carries `course_slug`, `course_category`
and `course_available` instead, and fires on `DOMContentLoaded` rather than a
click. It is sent from `src/pages/courses/[slug].astro` through `window.__track`,
the same `send()` helper the delegated listeners use, so it reaches both
destinations.

Three of these only exist once their integration is configured:
`register_click` and `register_submit` need `PUBLIC_FORMSPREE_ID`,
`pay_online_click` needs a Stripe Payment Link. Until then the
markup that carries them is not rendered at all.

## Marking conversions in GA4

Admin -> Events -> mark as key event: `register_submit` first, then
`phone_click` and `pay_online_click`. Those three are the ones that mean a
student actually got in touch; the rest are funnel steps.

## Adding an event

Put `data-analytics="some_name"` on the `<a>`, `<button>` or `<form>`. Nothing
else to wire. Avoid naming an event after a Tailwind utility — the class
scanner reads bare words anywhere in a source file (see `AGENTS.md`).

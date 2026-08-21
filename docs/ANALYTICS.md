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
not asked yet. Neither SDK loads except on `1`. A declined visitor gets neither
`gtag` nor `posthog`, so the event listeners below run and send nothing to
either destination.

PostHog is loaded without its usual stub queue. It is only ever asked to
capture from a click or submit handler, which cannot fire before the script has
finished loading, so there is nothing to queue.

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
| `pay_online_click` | Stripe or ClassManager pay button | contact + every course page |
| `register_submit` | the Formspree form submitting | contact + every course page |
| `student_login_click` | the Relias portal link | `/student-login` |

Each click event carries `link_text` (the element's visible text, truncated to
100 characters) so GA4 can tell the header phone number from the footer one.

Three of these only exist once their integration is configured:
`register_click` and `register_submit` need `PUBLIC_FORMSPREE_ID`,
`pay_online_click` needs a Stripe link or ClassManager URL. Until then the
markup that carries them is not rendered at all.

## Marking conversions in GA4

Admin -> Events -> mark as key event: `register_submit` first, then
`phone_click` and `pay_online_click`. Those three are the ones that mean a
student actually got in touch; the rest are funnel steps.

## Adding an event

Put `data-analytics="some_name"` on the `<a>`, `<button>` or `<form>`. Nothing
else to wire. Avoid naming an event after a Tailwind utility — the class
scanner reads bare words anywhere in a source file (see `AGENTS.md`).

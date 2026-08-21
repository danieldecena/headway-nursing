# Analytics

Google Analytics 4, loaded only after the visitor accepts the cookie banner.
Everything lives in `src/components/CookieBanner.astro` — there is no analytics
package, no tag manager, and no second vendor.

## Turning it on

Set `PUBLIC_GA_ID` (looks like `G-XXXXXXXXXX`) as a repo secret and in `.env`
for local work. With it unset the banner, the GA script, and the event
listeners are all absent from the built HTML — the site simply has no
analytics rather than a broken banner.

## Consent

`localStorage` key `cookie-consent`: `1` accepted, `0` declined, absent means
not asked yet. GA loads only on `1`. A declined visitor never gets `gtag`, so
the event listeners below run and send nothing.

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

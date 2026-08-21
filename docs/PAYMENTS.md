# Stripe Payment Links

Stripe Payment Links are the only payment integration. ClassManager.pro was
evaluated and dropped on 2026-08-21: about $49/month plus 1.5% bought a booking
calendar and automatic certificates that nobody had committed to using, against
a Stripe-only setup that costs nothing monthly. No ClassManager account was ever
created, so nothing was lost.

## Setup

1. Create a Stripe account at dashboard.stripe.com (business verification required)
2. Products -> Payment Links -> create one link per bookable course, with the
   amount matching `src/data/courses.ts`:

   | Course | `src/data/courses.ts` price |
   |---|---|
   | 75-Hour LTC Blended | $700 |
   | Core Basic Training | $500 |
   | CPR / First Aid | $85 |
   | Continuing Education | $120 |
   | Nurse Delegation | $80 |
   | Nurse Delegation, Diabetes | $80 |

3. Copy each link into `.env` locally and into the GitHub repo secrets:

```bash
PUBLIC_STRIPE_PAYMENT_URL=https://buy.stripe.com/...   # general fallback
PUBLIC_STRIPE_LINK_HCA_BLENDED=https://buy.stripe.com/...
PUBLIC_STRIPE_LINK_CORE_BASIC=https://buy.stripe.com/...
PUBLIC_STRIPE_LINK_CPR=https://buy.stripe.com/...
PUBLIC_STRIPE_LINK_CE=https://buy.stripe.com/...
PUBLIC_STRIPE_LINK_ND_CORE=https://buy.stripe.com/...
PUBLIC_STRIPE_LINK_ND_DIABETES=https://buy.stripe.com/...
```

4. Test in Stripe test mode first, then switch to live

## A price change is two edits, and nothing reconciles them

The price the site displays lives in `src/data/courses.ts`. The amount Stripe
actually charges lives in the Stripe dashboard. There is no API call at build
time that could compare them, so **changing one without the other silently
overcharges or undercharges a student.**

Two things reduce the blast radius, neither of which is a real check:

- `tests/payments.test.ts` fails CI if a bookable, priced course has no Payment
  Link of its own. Without it such a course falls back to the general link and
  charges that amount instead. This caught `nurse-delegation` and
  `nurse-delegation-diabetes` on 2026-08-21, both $80 with no link.
- The Pay Online button names the amount (`Pay $700 Online`), so a student sees
  the number the site claims immediately before Stripe shows its own.

## Formspree

1. Create account at formspree.io
2. New form -> copy form ID (e.g. `xyzabcde`)
3. Set `PUBLIC_FORMSPREE_ID=xyzabcde`
4. Set the notification email to the canonical office address (still undecided;
   see `STATUS.md`)
5. Test submission from `/contact`

## Code reference

Payment logic: `src/data/payments.ts`
Registration UI: `src/components/RegisterSection.astro`

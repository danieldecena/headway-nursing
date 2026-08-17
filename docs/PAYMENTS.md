# Stripe + ClassManager.pro setup

## Option A — ClassManager.pro (recommended for classes + certs)

1. Sign up at classmanager.pro (~$49/mo + 1.5% per transaction)
2. Connect aunt's Stripe account (Stripe Connect)
3. Add all courses with prices matching `src/data/courses.ts`
4. Copy calendar embed URL → set `PUBLIC_CLASSMANAGER_EMBED_URL` in Cloudflare Pages
5. Configure certificate templates in ClassManager dashboard
6. Test: register → pay → confirmation email → certificate

## Option B — Stripe Payment Links only (lighter)

1. Create Stripe account at dashboard.stripe.com (business verification required)
2. Products → Payment Links → create one link per course:
   - 75-Hour LTC Blended — $700
   - Core Basic — $500
   - CPR/First Aid — $85
   - Continuing Education — $120
   - Registration fee — $50
3. Copy each link URL into `.env`:

```bash
PUBLIC_STRIPE_PAYMENT_URL=https://buy.stripe.com/...   # general fallback
PUBLIC_STRIPE_LINK_HCA_BLENDED=https://buy.stripe.com/...
PUBLIC_STRIPE_LINK_CORE_BASIC=https://buy.stripe.com/...
PUBLIC_STRIPE_LINK_CPR=https://buy.stripe.com/...
PUBLIC_STRIPE_LINK_CE=https://buy.stripe.com/...
```

4. Set same vars in Cloudflare Pages → Environment variables
5. Test with Stripe test mode first, then switch to live keys

## Formspree

1. Create account at formspree.io
2. New form → copy form ID (e.g. `xyzabcde`)
3. Set `PUBLIC_FORMSPREE_ID=xyzabcde`
4. Set notification email to headwaynursing@comcast.net
5. Test submission from `/contact`

## Code reference

Payment logic: `src/data/payments.ts`  
Registration UI: `src/components/RegisterSection.astro`

# Headway Nursing — Operator Handoff

For Janice Angle / Headway Nursing Services. Maintained by Daniel.

## What changed

- Old site: Weebly at headwaynursing.org
- New site: Modern Astro site (faster, mobile-friendly, cleaner navigation)
- Same services: HCA training, specialty classes, Relias online login

## How to check registrations

| System | URL | Purpose |
|--------|-----|---------|
| Formspree | forms.formspree.io | Contact/registration form submissions |
| Stripe Dashboard | dashboard.stripe.com | Online payments |
| ClassManager.pro | (if configured) | Class bookings + certificates |
| Relias | headwaynursing.training.reliaslearning.com | Student online modules |

## Who owns what

| Asset | Owner account | Login |
|-------|---------------|-------|
| Domain (headwaynursing.org) | _fill in_ | Cloudflare |
| Website hosting | Cloudflare Pages | Cloudflare |
| Email | headwaynursing@comcast.net | Comcast |
| Stripe | Headway Nursing business | dashboard.stripe.com |
| Google Business Profile | Headway Nursing | business.google.com |
| Relias LMS | Existing account | reliaslearning.com |

## Business contact info (on site)

- **Address:** 8412 South 124th St, Seattle, WA 98178
- **Phone:** 425-306-5010 (office), 1-800-380-4929 (toll-free)
- **Email:** headwaynursing@comcast.net
- **Hours:** Mon–Fri 9 AM – 3 PM

## Requesting website changes

Contact Daniel. Common updates:
- Course prices → edit `src/data/courses.ts`
- Schedule changes → edit `src/data/schedules.ts`
- Announcements → edit `src/pages/whats-new.astro` or home banner

## Emergency

If site is down:
1. Check Cloudflare Pages dashboard for failed deploys
2. Check domain DNS at Cloudflare
3. Contact Daniel

## Annual checklist

- [ ] Renew domain (auto-renew on at Cloudflare)
- [ ] Review course prices and schedules
- [ ] Update legal pages if payment tools change
- [ ] Review Google Business Profile hours/photos

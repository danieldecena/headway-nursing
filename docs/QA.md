# Pre-launch QA checklist

Run before DNS cutover to production.

## Content

- [ ] All course prices match aunt's current pricing
- [ ] Schedule page reflects current weekly classes
- [ ] Contact phone, email, address correct
- [ ] Testimonial images display
- [ ] Relias student login link works
- [ ] HCA exam page links to DSHS/DOH resources

## Forms and payments

- [ ] Formspree `PUBLIC_FORMSPREE_ID` set in Cloudflare Pages env
- [ ] Submit test registration in incognito → email received
- [ ] Stripe payment link opens and processes test payment (if configured)
- [ ] Thank-you / confirmation flow clear to student

## Technical

- [ ] `npm run build` passes locally
- [ ] Preview deploy on Cloudflare Pages loads all 25+ pages
- [ ] Mobile nav works (iPhone Safari)
- [ ] Old Weebly URLs redirect (test `/contact-us.html` → `/contact`)
- [ ] Sitemap at `/sitemap-index.xml`
- [ ] robots.txt accessible

## SEO and legal

- [ ] Google Search Console property added
- [ ] Sitemap submitted in Search Console
- [ ] Google Business Profile updated with new site URL
- [ ] Privacy, Terms, Refund pages reviewed
- [ ] Cookie banner appears only when GA4 enabled

## Accessibility

- [ ] Lighthouse accessibility score ≥ 90 on Home and Courses
- [ ] All form fields have labels
- [ ] Skip link works
- [ ] Color contrast passes on buttons and text

## Launch day

- [ ] DNS pointed to Cloudflare Pages
- [ ] HTTPS certificate active
- [ ] Test live domain on mobile
- [ ] Keep Weebly live 1–2 weeks as fallback
- [ ] Cancel Weebly subscription after confirming redirects

## Post-launch

- [ ] Monitor Formspree for first week
- [ ] Check Search Console for crawl errors
- [ ] Share HANDOFF.md with aunt

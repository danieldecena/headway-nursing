# Headway Nursing — Operating Guide

For Janice Angle, RN. Written so you can run the website day to day without
needing to understand how it is built. Daniel maintains the code; you own the
business decisions and the accounts.

If you only read one section, read **When something looks wrong**.

---

## Where things stand today

The new site is **built but not published yet**. headwaynursing.org still serves
the old Weebly site, and it will keep doing so until the DNS cutover happens.
Nothing you do in this guide affects the live site before then.

Three things are still switched off, and each one changes what students can do:

| Not yet set up | Until it is | Who sets it up |
|---|---|---|
| Formspree (the contact form) | Register buttons tell people to call or email the office | Daniel |
| Stripe (online payment) | The site says payment is by cash or check at the office | Daniel |
| Google Analytics | No visitor numbers are recorded | Daniel |

That is deliberate, not broken. The site is designed to read correctly with
these off, so it can go live before every account exists.

---

## Your day to day: where registrations arrive

Once the site is live, a student who wants to register reaches you one of four
ways. Check all four that apply to you:

| Route | Where you look | Notes |
|---|---|---|
| The website form | Formspree inbox, and a copy by email | Only once Formspree is set up |
| Phone | 425-306-5010 office, 206-380-0042 after hours | Every Call button on the site dials the office number |
| Email | The address on the site | See "Open decisions" below — this is unsettled |
| Online payment | Stripe dashboard | Only once Stripe is set up |

Students who are already enrolled do their coursework in **Relias**
(headwaynursing.training.reliaslearning.com). That is a separate system the site
only links to. Nothing about the website change touches Relias accounts,
progress, or certificates.

---

## Your accounts

These are the logins that matter. Fill in the blanks with Daniel so this table
is complete before launch, and keep it somewhere you can reach if your computer
is not available.

| Asset | Account holder | Where to sign in |
|---|---|---|
| Domain headwaynursing.org | _to confirm_ | Cloudflare |
| Website hosting | Headway Nursing | Cloudflare Pages |
| Business email | _to decide, see below_ | |
| Stripe | Headway Nursing business | dashboard.stripe.com |
| Google Business Profile | Headway Nursing | business.google.com |
| Relias LMS | Existing account | reliaslearning.com |
| Formspree | _not created yet_ | formspree.io |

The Weebly account stays open until the cutover is confirmed working. Do not
cancel it on the strength of the new site looking right.

---

## Changing what the site says

Everything a visitor reads comes from a small set of files, so a price change is
a five-minute edit rather than a redesign. Today those edits go through Daniel.
Send him the change in plain words ("the blended class is $750 now, starting
September") and he will make it.

What lives where, so you know what is quick to change:

| You want to change | It comes from |
|---|---|
| Course prices, descriptions, what is offered | `src/data/courses.ts` |
| Class dates and cohorts | `src/data/schedules.ts` |
| Phone, address, hours, email, your bio | `src/data/site.ts` |
| Frequently asked questions | `src/data/faqs.ts` |
| Graduate quotes | `src/data/testimonials.ts` |
| Refund and cancellation terms, registration fee | `src/data/compliance.ts` |
| Announcements and regulatory updates | `src/pages/whats-new.astro` |

Two rules worth knowing:

1. **A price appears in one place and shows up everywhere.** Change it once and
   the course page, the course list and the registration copy all update
   together. You will never have to hunt down a stale number on a second page.
2. **Anything a student could rely on is worth a note to Daniel in writing.**
   Prices, refund terms and class dates are the ones that cause disputes.

Longer term the plan is for you to edit prices and dates yourself. That is not
built yet, and this guide will be updated when it is.

---

## When something looks wrong

Work down this list. Most problems are one of the first two.

**The site shows an old price or an old date.**
Not an outage. The site only changes when someone edits it. Email Daniel with
what it should say.

**The contact form does not send, or nobody is receiving submissions.**
Check the Formspree inbox first, then your email spam folder. If Formspree shows
nothing at all, the form is not connected. Tell Daniel; meanwhile the phone and
email routes still work and are on every page.

**The whole site is down, or shows an error page.**
1. Try it on your phone, on cell data rather than wifi. If it works there, the
   problem is your own network, not the site.
2. Check status at the Cloudflare Pages dashboard.
3. Call Daniel.

**A student says they paid but you have no record.**
Check the Stripe dashboard. Do not reissue or refund from memory; Stripe is the
record.

**Someone reports wrong information about licensing or refunds.**
Stop and forward it to Daniel before correcting it yourself. Those pages carry
wording that is required by state rule, and rewording them casually can create a
compliance problem where there was not one.

---

## Recurring checks

**Every month, five minutes.** Open the site and check the class schedule is not
showing dates that have passed. Stale dates are the single most common way a
training website goes quietly wrong.

**Every year.**

- [ ] Confirm the domain renewed (auto-renew should be on at Cloudflare)
- [ ] Review every course price and remove courses no longer offered
- [ ] Review the refund and cancellation policy against what you actually do
- [ ] Check Google Business Profile hours, photos and phone number
- [ ] Re-read the legal pages if payment tools changed during the year

---

## Open decisions that are yours

The site cannot be finished until these are answered. None of them are technical.

1. **Which email address is the real one.** The old Weebly site shows
   `headwaynursingservicesofficial@gmail.com`, its after-hours note shows
   `headwaynursing@gmail.com`, and the new site currently carries
   `headwaynursing@comcast.net`. Pick one. It will appear on every page, in the
   contact form, and in the search-engine listing, so changing it later means
   changing it in several places outside the website too.

2. **How Headway is regulated.** Is Headway licensed as a private career school
   under RCW 28C.10, and if so what is the licence number? Or is it DSHS-approved
   only, under WAC 388-112A? The answer decides whether the site must carry a
   specific licensing statement and complaints route. Until you answer, the
   policies page leaves that section out rather than guessing.

3. **Authoritative course prices.** The old site's prices disagree with each
   other in places. Daniel needs one list he can treat as correct.

4. **The year Headway was founded.** Used in the About page and the logo mark.

5. **Confirm the course prices against Stripe.** Online payment is Stripe only
   now. The price on the site and the amount Stripe charges are set in two
   different places, so every price change is two edits. Tell Daniel whenever a
   price moves.

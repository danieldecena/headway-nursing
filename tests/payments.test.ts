import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { courses } from '../src/data/courses';
import { coursePaymentLinks } from '../src/data/payments';

const PAYMENT_ENV_VARS = [
  'PUBLIC_STRIPE_PAYMENT_URL',
  'PUBLIC_STRIPE_LINK_HCA_BLENDED',
  'PUBLIC_STRIPE_LINK_CORE_BASIC',
  'PUBLIC_STRIPE_LINK_CPR',
  'PUBLIC_STRIPE_LINK_CE',
  'PUBLIC_STRIPE_LINK_ND_CORE',
  'PUBLIC_STRIPE_LINK_ND_DIABETES',
];

describe('payment link configuration', () => {
  it('only maps payment links to real course slugs', () => {
    const slugs = new Set(courses.map((c) => c.slug));
    for (const key of Object.keys(coursePaymentLinks)) {
      expect(slugs.has(key), `coursePaymentLinks key "${key}" matches no course slug`).toBe(true);
    }
  });

  // The price shown on the site lives in courses.json; the amount actually
  // charged lives in the Stripe dashboard. Nothing reconciles them, so a course
  // that is bookable and priced but has no link of its own can no longer be
  // paid for online at all (getPaymentUrl returns null). Cover it here instead.
  //
  // Every key is declared as `?? ''`, so the key exists whether or not its
  // secret is set. Asserting only `slug in coursePaymentLinks` can therefore
  // never fail — assert the VALUE. Skipped entirely when no link var is set,
  // which is the normal local and CI case.
  it('gives every bookable priced course a non-empty payment link of its own', () => {
    const anyLinkConfigured = Object.values(coursePaymentLinks).some((url) => url !== '');
    if (!anyLinkConfigured) return;

    const needsLink = courses
      .filter((c) => c.available && c.price !== null)
      .map((c) => c.slug);
    const missing = needsLink.filter((slug) => !coursePaymentLinks[slug]);
    expect(
      missing,
      `these priced courses have no Stripe link of their own and cannot be paid for online: ${missing.join(', ')}`,
    ).toEqual([]);
  });
});

describe('getPaymentUrl fallback order', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Stubs every payment var (empty unless overridden) so a developer's local
  // .env can't change the outcome, then reloads the module to re-read them.
  async function loadWithEnv(env: Record<string, string> = {}) {
    for (const key of PAYMENT_ENV_VARS) {
      vi.stubEnv(key, env[key] ?? '');
    }
    return import('../src/data/payments');
  }

  it('returns null when no payment env vars are configured', async () => {
    const mod = await loadWithEnv();
    expect(mod.getPaymentUrl('75-hour-ltc-blended')).toBeNull();
    expect(mod.getPaymentUrl()).toBeNull();
  });

  it('prefers the per-course Stripe link over the general one', async () => {
    const mod = await loadWithEnv({
      PUBLIC_STRIPE_LINK_HCA_BLENDED: 'https://buy.stripe.com/hca',
      PUBLIC_STRIPE_PAYMENT_URL: 'https://buy.stripe.com/general',
    });
    expect(mod.getPaymentUrl('75-hour-ltc-blended')).toBe('https://buy.stripe.com/hca');
  });

  // dementia-specialty carries price: null in courses.json, so there is no
  // amount for the general link to contradict and the fallback still applies.
  it('falls back to the general link for an unpriced course without its own link', async () => {
    const mod = await loadWithEnv({
      PUBLIC_STRIPE_LINK_HCA_BLENDED: 'https://buy.stripe.com/hca',
      PUBLIC_STRIPE_PAYMENT_URL: 'https://buy.stripe.com/general',
    });
    expect(mod.getPaymentUrl('dementia-specialty')).toBe('https://buy.stripe.com/general');
    expect(mod.getPaymentUrl()).toBe('https://buy.stripe.com/general');
  });

  it('returns null when only a per-course link exists and another course asks', async () => {
    const mod = await loadWithEnv({
      PUBLIC_STRIPE_LINK_HCA_BLENDED: 'https://buy.stripe.com/hca',
    });
    expect(mod.getPaymentUrl('dementia-specialty')).toBeNull();
  });

  // The failure this guards: an unset PUBLIC_STRIPE_LINK_ND_CORE used to make
  // an $80 course charge whatever the general link is set to.
  it('returns null for a priced course whose own link is unset, even with a general link', async () => {
    const mod = await loadWithEnv({
      PUBLIC_STRIPE_PAYMENT_URL: 'https://buy.stripe.com/general',
    });
    const priced = courses.find((c) => c.slug === 'nurse-delegation');
    expect(priced?.price).not.toBeNull();
    expect(mod.getPaymentUrl('nurse-delegation')).toBeNull();
    // The general link is genuinely set — the null above is the new rule
    // firing, not an unconfigured module.
    expect(mod.getPaymentUrl()).toBe('https://buy.stripe.com/general');
  });
});

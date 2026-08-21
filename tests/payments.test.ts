import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { courses } from '../src/data/courses';
import { coursePaymentLinks } from '../src/data/payments';

const PAYMENT_ENV_VARS = [
  'PUBLIC_STRIPE_PAYMENT_URL',
  'PUBLIC_STRIPE_LINK_HCA_BLENDED',
  'PUBLIC_STRIPE_LINK_CORE_BASIC',
  'PUBLIC_STRIPE_LINK_CPR',
  'PUBLIC_STRIPE_LINK_CE',
  'PUBLIC_CLASSMANAGER_EMBED_URL',
];

describe('payment link configuration', () => {
  it('only maps payment links to real course slugs', () => {
    const slugs = new Set(courses.map((c) => c.slug));
    for (const key of Object.keys(coursePaymentLinks)) {
      expect(slugs.has(key), `coursePaymentLinks key "${key}" matches no course slug`).toBe(true);
    }
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

  it('falls back to the general link for a course without its own link', async () => {
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
});

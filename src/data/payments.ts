/**
 * Payment integration config.
 * Set env vars after Stripe / ClassManager.pro accounts are created.
 */
export const payments = {
  /** ClassManager.pro calendar embed snippet — paste iframe/script from dashboard */
  classManagerEmbedUrl: import.meta.env.PUBLIC_CLASSMANAGER_EMBED_URL ?? '',
  /** General Stripe Payment Link fallback */
  stripePaymentUrl: import.meta.env.PUBLIC_STRIPE_PAYMENT_URL ?? '',
  provider: (import.meta.env.PUBLIC_PAYMENT_PROVIDER ?? 'stripe') as 'stripe' | 'classmanager',
} as const;

/** Per-course Stripe Payment Link overrides (fill after creating links in Stripe Dashboard) */
export const coursePaymentLinks: Record<string, string> = {
  '75-hour-ltc-blended': import.meta.env.PUBLIC_STRIPE_LINK_HCA_BLENDED ?? '',
  'core-basic-training': import.meta.env.PUBLIC_STRIPE_LINK_CORE_BASIC ?? '',
  'cpr-first-aid': import.meta.env.PUBLIC_STRIPE_LINK_CPR ?? '',
  'continuing-education': import.meta.env.PUBLIC_STRIPE_LINK_CE ?? '',
};

export function getPaymentUrl(courseSlug?: string): string | null {
  if (courseSlug && coursePaymentLinks[courseSlug]) {
    return coursePaymentLinks[courseSlug];
  }
  if (payments.stripePaymentUrl) return payments.stripePaymentUrl;
  return null;
}

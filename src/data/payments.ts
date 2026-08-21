import { courses } from './courses';

/**
 * Payment integration config. Stripe Payment Links only — ClassManager.pro was
 * evaluated and dropped (2026-08-21) rather than deferred.
 *
 * A course's price lives in courses.json; the amount actually charged lives in
 * the Stripe dashboard. Nothing reconciles them, so a price change is two
 * edits. tests/payments.test.ts asserts link coverage, not amounts.
 */
export const payments = {
  /** General Stripe Payment Link, used when a course has no link of its own */
  stripePaymentUrl: import.meta.env.PUBLIC_STRIPE_PAYMENT_URL ?? '',
} as const;

/** Per-course Stripe Payment Link overrides (fill after creating links in Stripe Dashboard) */
export const coursePaymentLinks: Record<string, string> = {
  '75-hour-ltc-blended': import.meta.env.PUBLIC_STRIPE_LINK_HCA_BLENDED ?? '',
  'core-basic-training': import.meta.env.PUBLIC_STRIPE_LINK_CORE_BASIC ?? '',
  'cpr-first-aid': import.meta.env.PUBLIC_STRIPE_LINK_CPR ?? '',
  'continuing-education': import.meta.env.PUBLIC_STRIPE_LINK_CE ?? '',
  'nurse-delegation': import.meta.env.PUBLIC_STRIPE_LINK_ND_CORE ?? '',
  'nurse-delegation-diabetes': import.meta.env.PUBLIC_STRIPE_LINK_ND_DIABETES ?? '',
};

/** Slugs whose course carries a specific price, so the general link is wrong for them */
const pricedSlugs = new Set(courses.filter((c) => c.price !== null).map((c) => c.slug));

export function getPaymentUrl(courseSlug?: string): string | null {
  if (courseSlug && coursePaymentLinks[courseSlug]) {
    return coursePaymentLinks[courseSlug];
  }
  // A priced course with no configured link of its own gets no button rather
  // than the general link: that link charges the general amount, and charging
  // a student the wrong amount is worse than showing no online-payment option
  // and letting them call the office. Courses with price: null carry no amount
  // to contradict, so they keep falling back.
  if (courseSlug && pricedSlugs.has(courseSlug)) return null;
  if (payments.stripePaymentUrl) return payments.stripePaymentUrl;
  return null;
}

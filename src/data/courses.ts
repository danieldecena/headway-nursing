import { z } from 'astro/zod';
import raw from './courses.json';

// The literal moved to courses.json so a non-developer can edit it through
// GitHub's web editor. This schema is the guard rail: an invalid edit fails
// the build with the offending field named, instead of rendering a broken page.
const courseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative().nullable(),
  priceNote: z.string().optional(),
  duration: z.string().optional(),
  format: z.string().min(1),
  available: z.boolean(),
  category: z.enum(['hca', 'specialty', 'certification', 'continuing-ed']),
  highlights: z.array(z.string()).optional(),
});

export type Course = z.infer<typeof courseSchema>;

export const courses: Course[] = z
  .array(courseSchema)
  .parse(raw);

export const registrationFee = 50;
export const registrationFeeNote =
  'Registration fee covers books and administrative work. Required for most courses.';

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function formatPrice(price: number | null, note?: string): string {
  if (price === null) return note ?? 'Contact for pricing';
  return `$${price}`;
}

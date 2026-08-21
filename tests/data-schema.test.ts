import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';

// Mirrors the schema in src/data/courses.ts. Kept here deliberately rather
// than exported and shared: this test exists to prove the shape is enforced,
// and importing the very thing under test would make it circular.
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

const coursesJson = JSON.parse(
  readFileSync(join(__dirname, '../src/data/courses.json'), 'utf8'),
);

describe('course data schema', () => {
  // Known-GOOD: the real file must pass.
  it('accepts the committed courses.json', () => {
    expect(() => z.array(courseSchema).parse(coursesJson)).not.toThrow();
  });

  // Known-BAD: the mistakes an editor actually makes.
  it('rejects a price typed as a string', () => {
    const bad = [{ ...coursesJson[0], price: '700' }];
    expect(() => z.array(courseSchema).parse(bad)).toThrow();
  });

  it('rejects a category that is not one of the four', () => {
    const bad = [{ ...coursesJson[0], category: 'nursing' }];
    expect(() => z.array(courseSchema).parse(bad)).toThrow();
  });

  it('rejects an entry missing its slug', () => {
    const { slug: _slug, ...noSlug } = coursesJson[0];
    expect(() => z.array(courseSchema).parse([noSlug])).toThrow();
  });

  it('rejects a negative price', () => {
    const bad = [{ ...coursesJson[0], price: -50 }];
    expect(() => z.array(courseSchema).parse(bad)).toThrow();
  });
});

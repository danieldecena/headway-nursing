import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
// The shipped schema, not a copy: a test against a re-declared schema stays
// green if src/data/courses.ts stops parsing at all.
import { courseSchema } from '../src/data/courses';

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

  it('rejects a mistyped optional key', () => {
    const { priceNote: _priceNote, ...rest } = coursesJson[0];
    const bad = [{ ...rest, pricenote: 'per student' }];
    expect(() => z.array(courseSchema).parse(bad)).toThrow();
  });

  it('rejects an empty courses file', () => {
    expect(() => z.array(courseSchema).min(1).parse([])).toThrow();
  });
});

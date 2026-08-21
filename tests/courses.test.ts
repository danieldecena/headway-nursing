import { describe, expect, it } from 'vitest';
import { courses, formatPrice, getCourse, registrationFee } from '../src/data/courses';

describe('course data integrity', () => {
  it('has at least one course', () => {
    expect(courses.length).toBeGreaterThan(0);
  });

  it('has unique slugs', () => {
    const slugs = courses.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has URL-safe slugs (they become routes via getStaticPaths)', () => {
    for (const course of courses) {
      expect(course.slug, `slug for "${course.title}"`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('has non-empty display fields on every course', () => {
    for (const course of courses) {
      expect(course.title.trim(), course.slug).not.toBe('');
      expect(course.shortDescription.trim(), course.slug).not.toBe('');
      expect(course.description.trim(), course.slug).not.toBe('');
      expect(course.format.trim(), course.slug).not.toBe('');
    }
  });

  it('gives every course without a price a priceNote, so pages never show the generic fallback', () => {
    for (const course of courses) {
      if (course.price === null) {
        expect(course.priceNote, `${course.slug} has price: null`).toBeTruthy();
      }
    }
  });

  it('uses whole positive dollar amounts for priced courses', () => {
    for (const course of courses) {
      if (course.price !== null) {
        expect(Number.isInteger(course.price), course.slug).toBe(true);
        expect(course.price, course.slug).toBeGreaterThan(0);
      }
    }
  });

  it('has a positive registration fee', () => {
    expect(registrationFee).toBeGreaterThan(0);
  });
});

describe('getCourse', () => {
  it('finds a course by slug', () => {
    expect(getCourse('75-hour-ltc-blended')?.title).toBe('75-Hour LTC Blended Training');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getCourse('not-a-course')).toBeUndefined();
  });
});

describe('formatPrice', () => {
  it('formats a numeric price as dollars', () => {
    expect(formatPrice(700)).toBe('$700');
  });

  it('uses the note when the price is null', () => {
    expect(formatPrice(null, 'Contact for current pricing')).toBe('Contact for current pricing');
  });

  it('falls back to a generic message when price and note are both missing', () => {
    expect(formatPrice(null)).toBe('Contact for pricing');
  });
});

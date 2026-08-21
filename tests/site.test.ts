import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { navLinks, site } from '../src/data/site';

const pagesDir = join(__dirname, '../src/pages');

function pageExists(href: string): boolean {
  const path = href.replace(/^\//, '').replace(/\/$/, '') || 'index';
  return (
    existsSync(join(pagesDir, `${path}.astro`)) || existsSync(join(pagesDir, path, 'index.astro'))
  );
}

describe('navigation', () => {
  it('points every nav link at an existing page', () => {
    for (const link of navLinks) {
      expect(pageExists(link.href), `${link.href} (${link.label}) has no page in src/pages`).toBe(
        true,
      );
    }
  });

  it('has unique hrefs and labels', () => {
    const hrefs = navLinks.map((l) => l.href);
    const labels = navLinks.map((l) => l.label);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe('site contact data', () => {
  it('uses an https URL without a trailing slash (joined with paths via new URL)', () => {
    expect(site.url).toMatch(/^https:\/\//);
    expect(site.url.endsWith('/')).toBe(false);
  });

  it('has a plausible email address', () => {
    expect(site.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('formats phone numbers as digits and dashes (used in tel: links)', () => {
    for (const [label, number] of Object.entries(site.phone)) {
      expect(number, `phone.${label}`).toMatch(/^\d[\d-]+\d$/);
    }
  });
});

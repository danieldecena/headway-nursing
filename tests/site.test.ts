import { existsSync, readdirSync, readFileSync } from 'node:fs';
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

// Matches both ways a page states a link: the literal attribute href="/faq"
// and the data-driven form href: '/faq' that Astro renders through href={...}.
function hrefsIn(source: string): Set<string> {
  const found = new Set<string>();
  for (const m of source.matchAll(/href[=:]\s*["'](\/[a-z0-9-]*)["']/g)) found.add(m[1]);
  return found;
}

describe('resources hub', () => {
  const resources = hrefsIn(readFileSync(join(pagesDir, 'resources.astro'), 'utf8'));

  it('links every page that loses its nav entry', () => {
    for (const href of ['/virtual-learning', '/whats-new', '/testimonials', '/faq', '/hca-exam']) {
      expect(resources.has(href), `resources.astro does not link ${href}`).toBe(true);
    }
  });
});

describe('page reachability', () => {
  // Pages that are deliberately not linked from anywhere in the site.
  const unlinked = new Set([
    '/thank-you', // post-form confirmation; noindex, excluded from the sitemap
  ]);

  function allHrefs(): Set<string> {
    const sources = [
      readFileSync(join(__dirname, '../src/components/Footer.astro'), 'utf8'),
      ...readdirSync(pagesDir, { recursive: true, encoding: 'utf8' })
        .filter((f) => f.endsWith('.astro'))
        .map((f) => readFileSync(join(pagesDir, f), 'utf8')),
    ];
    const found = new Set(navLinks.map((l) => l.href as string));
    for (const src of sources) {
      for (const href of hrefsIn(src)) found.add(href);
    }
    return found;
  }

  it('links every top-level page from the nav, the footer, or another page', () => {
    const linked = allHrefs();
    const pages = readdirSync(pagesDir, { encoding: 'utf8' })
      .filter((f) => f.endsWith('.astro') && f !== 'index.astro')
      .map((f) => `/${f.replace(/\.astro$/, '')}`);

    const orphans = pages.filter((p) => !linked.has(p) && !unlinked.has(p));
    expect(orphans, `unreachable page(s): ${orphans.join(', ')}`).toEqual([]);
  });
});

describe('the decided six-item nav', () => {
  it('matches the decided set, in order', () => {
    expect(navLinks.map((l) => l.label)).toEqual([
      'Courses',
      'Schedule',
      'About',
      'Resources',
      'Consulting',
      'Contact',
    ]);
  });

  it('keeps Consulting pointed at /services', () => {
    expect(navLinks.find((l) => l.label === 'Consulting')?.href).toBe('/services');
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

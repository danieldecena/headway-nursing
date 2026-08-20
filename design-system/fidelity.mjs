// Fidelity check: render each ported component with renderToStaticMarkup and
// compare its class strings against the Astro-built HTML in ../dist. Branches
// the site build never renders (env-gated, unused variant) fall back to the
// component's .astro source as the reference.
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement as h } from 'react';
import {
  Button, Card, CookieBanner, CourseCard, Footer, Header,
  PageHeader, PageShell, RegisterSection, SectionHeading, sampleCourse,
} from './dist/index.js';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const classesOf = (html) => [...html.matchAll(/class="([^"]*)"/g)].map((m) => m[1]);

let failures = 0;
function check(name, reactHtml, ref, note = '') {
  const source = read(ref);
  const missing = classesOf(reactHtml).filter((c) => !source.includes(c));
  const ok = missing.length === 0;
  if (!ok) failures++;
  console.log(`${ok ? 'ok ' : 'FAIL'} ${name} vs ${ref}${note ? ` (${note})` : ''}`);
  for (const c of missing) console.log(`     not in reference: "${c}"`);
}

// Built-page references (rendered by this site build)
check('Button primary', renderToStaticMarkup(h(Button, { href: '/x' }, 'Go')), '../dist/thank-you/index.html');
check('Button secondary', renderToStaticMarkup(h(Button, { href: '/x', variant: 'secondary' }, 'Go')), '../dist/thank-you/index.html');
check('Card', renderToStaticMarkup(h(Card, null, 'x')), '../dist/about/index.html');
check('Card muted', renderToStaticMarkup(h(Card, { tone: 'muted' }, 'x')), '../dist/courses/75-hour-ltc-classroom/index.html');
check('PageHeader', renderToStaticMarkup(h(PageHeader, null, 'T')), '../dist/courses/index.html');
check('SectionHeading', renderToStaticMarkup(h(SectionHeading, null, 'T')), '../dist/courses/index.html');
check('PageShell xl', renderToStaticMarkup(h(PageShell, { width: 'xl' }, 'x')), '../dist/courses/index.html');
check('PageShell prose', renderToStaticMarkup(h(PageShell, { prose: true }, 'x')), '../dist/privacy/index.html');
check('CourseCard', renderToStaticMarkup(h(CourseCard, { course: sampleCourse })), '../dist/courses/index.html');
check('CourseCard unavailable', renderToStaticMarkup(h(CourseCard, { course: { ...sampleCourse, available: false } })), '../dist/courses/index.html');
check('Footer', renderToStaticMarkup(h(Footer, { year: 2026 })), '../dist/index.html');
check('Header', renderToStaticMarkup(h(Header)), '../dist/index.html', 'nav content differs by decision; classes must match');
check('RegisterSection unconfigured', renderToStaticMarkup(h(RegisterSection, { formConfigured: false })), '../dist/courses/75-hour-ltc-blended/index.html');

// Source references (branches this build never renders)
check('Button ghost', renderToStaticMarkup(h(Button, { href: '/x', variant: 'ghost' }, 'Go')), '../src/components/Button.astro', 'variant unused on any page');
check('CookieBanner', renderToStaticMarkup(h(CookieBanner, { open: false })), '../src/components/CookieBanner.astro', 'env-gated out of build; closed state matches the astro literal, open drops "hidden" by design');
check('RegisterSection configured', renderToStaticMarkup(h(RegisterSection, { courseTitle: 'X' })), '../src/components/RegisterSection.astro', 'Formspree branch env-gated out of build');

console.log(failures ? `\n${failures} failing` : '\nall clean');
process.exit(failures ? 1 : 0);

import { PageShell, PageHeader, SectionHeading } from 'headway-nursing-ds';

export const Narrow = () => (
  <PageShell>
    <PageHeader>Refund Policy</PageHeader>
    <p className="mt-4 text-slate-600">
      The md width caps prose pages at max-w-3xl for a readable line length.
    </p>
  </PageShell>
);

export const WideCatalog = () => (
  <PageShell width="xl">
    <PageHeader>Our Courses</PageHeader>
    <p className="mt-4 text-slate-600">The xl width (max-w-6xl) hosts card grids.</p>
  </PageShell>
);

export const Prose = () => (
  <PageShell prose>
    <h1>Privacy Policy</h1>
    <p>
      Prose mode applies the typography plugin for long-form legal and policy pages,
      keeping headings, lists, and paragraphs styled without utility classes.
    </p>
    <ul>
      <li>What information we collect</li>
      <li>How we use it</li>
    </ul>
  </PageShell>
);

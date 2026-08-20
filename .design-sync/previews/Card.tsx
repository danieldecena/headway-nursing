import { Card, SectionHeading } from 'headway-nursing-ds';

export const White = () => (
  <Card>
    <h3 className="text-lg font-semibold text-brand-900">Blended learning</h3>
    <p className="mt-2 text-sm text-slate-600">
      Complete the online coursework at your own pace, then attend four days of
      in-person classroom skills training at our Seattle office.
    </p>
  </Card>
);

export const Muted = () => (
  <Card tone="muted">
    <h3 className="text-lg font-semibold text-brand-900">Registration fee</h3>
    <p className="mt-2 text-sm text-slate-600">
      A $50 registration fee covers books and administrative work. Required for most courses.
    </p>
  </Card>
);

export const AsListItem = () => (
  <Card as="li" class="list-none">
    <p className="text-sm text-slate-600">Cards can render as any element via the as prop.</p>
  </Card>
);

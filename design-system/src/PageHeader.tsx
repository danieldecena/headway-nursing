import type { ReactNode } from 'react';

export interface PageHeaderProps {
  class?: string;
  children?: ReactNode;
}

// Extra utilities lead the string so the emitted class order matches the
// hand-written markup these headings replaced.
export function PageHeader({ class: extra, children }: PageHeaderProps) {
  const headingClass = [extra, 'text-4xl font-bold text-brand-900 md:text-5xl']
    .filter(Boolean)
    .join(' ');

  return <h1 className={headingClass}>{children}</h1>;
}

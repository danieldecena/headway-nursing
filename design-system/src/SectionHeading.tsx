import type { ReactNode } from 'react';

export interface SectionHeadingProps {
  class?: string;
  children?: ReactNode;
}

export function SectionHeading({ class: extra, children }: SectionHeadingProps) {
  const headingClass = [extra, 'text-2xl font-semibold text-brand-800'].filter(Boolean).join(' ');

  return <h2 className={headingClass}>{children}</h2>;
}

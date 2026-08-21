import type { ElementType, ReactNode } from 'react';

export interface PageShellProps {
  as?: ElementType;
  width?: 'md' | 'lg' | 'xl';
  prose?: boolean;
  children?: ReactNode;
}

const widths = { md: 'max-w-3xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };

export function PageShell({ as: Tag = 'div', width = 'md', prose = false, children }: PageShellProps) {
  const maxWidth = widths[width];
  const shellClass = `${prose ? 'prose prose-slate ' : ''}mx-auto ${maxWidth} px-4 py-12`;

  return <Tag className={shellClass}>{children}</Tag>;
}

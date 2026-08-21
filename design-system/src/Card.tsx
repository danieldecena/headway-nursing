import type { ElementType, ReactNode } from 'react';

export interface CardProps {
  as?: ElementType;
  class?: string;
  tone?: 'white' | 'muted';
  children?: ReactNode;
}

export function Card({ as: Tag = 'div', class: extra, tone = 'white', children }: CardProps) {
  const surface = tone === 'muted' ? 'bg-slate-50' : 'bg-white';
  const cardClass = [extra, `rounded-xl border border-slate-200 ${surface} p-6`]
    .filter(Boolean)
    .join(' ');

  return <Tag className={cardClass}>{children}</Tag>;
}

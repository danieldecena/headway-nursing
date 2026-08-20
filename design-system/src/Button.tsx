import type { ReactNode } from 'react';

export interface ButtonProps {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  children?: ReactNode;
}

// Full literal strings per variant, not composed fragments, so the emitted
// class order matches the anchors these replaced.
const variants = {
  primary: 'rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800',
  secondary:
    'rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50',
  // Variant keys must not collide with real Tailwind utility names — the scanner
  // reads bare words anywhere in this file and would emit a phantom rule.
  ghost: 'rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10',
};

export function Button({ href, variant = 'primary', children }: ButtonProps) {
  return (
    <a href={href} className={variants[variant]}>
      {children}
    </a>
  );
}

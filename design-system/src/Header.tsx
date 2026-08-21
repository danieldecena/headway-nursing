import { navLinks as defaultNavLinks, site } from './data';

export interface HeaderProps {
  navLinks?: { href: string; label: string }[];
}

export function Header({ navLinks = defaultNavLinks }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <a href="/" className="group flex items-center gap-3">
          <img src="/images/logo.svg" alt="" width="40" height="43" className="h-10 w-auto" />
          <span>
            <span className="block text-lg font-bold text-brand-800 group-hover:text-brand-700">{site.name}</span>
            <span className="block text-xs text-slate-500">Seattle, WA · DSHS Approved</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-brand-700">
              {link.label}
            </a>
          ))}
          <a
            href="/student-login"
            className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700"
          >
            Student Login
          </a>
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium">
            Menu
          </summary>
          <nav aria-label="Mobile navigation" className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                {link.label}
              </a>
            ))}
            <a href="/student-login" className="block px-4 py-2 text-sm font-semibold text-accent-700">
              Student Login
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}

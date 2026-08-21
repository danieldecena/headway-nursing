import { site } from './data';

export interface FooterProps {
  /** Copyright year. Passed in so a preview render is deterministic. */
  year?: number;
}

export function Footer({ year = new Date().getFullYear() }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-brand-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-semibold text-white">{site.name}</p>
          <p className="mt-2 text-sm">{site.address.full}</p>
          <p className="mt-2 text-sm">
            <a href={`tel:${site.phone.office}`} className="hover:text-white">{site.phone.office}</a>
            {' · '}<a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
          </p>
          <p className="mt-1 text-xs text-slate-400">{site.hours}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Quick links</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href="/courses" className="hover:text-white">Courses</a></li>
            <li><a href="/schedule" className="hover:text-white">Schedule</a></li>
            <li><a href="/virtual-learning" className="hover:text-white">Virtual Learning</a></li>
            <li><a href="/student-login" className="hover:text-white">Student Login</a></li>
            <li><a href="/hca-exam" className="hover:text-white">HCA Exam Info</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Legal</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            <li><a href="/refund-policy" className="hover:text-white">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-800 px-4 py-4 text-center text-xs text-slate-400">
        &copy; {year} {site.name}. DSHS-Approved Training Provider.
      </div>
    </footer>
  );
}

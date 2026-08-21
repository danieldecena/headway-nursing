// Minimal copies of the shapes src/data/*.ts hands the Astro components, so the
// package renders standalone. Values track the site; the DS is not their owner.

export interface Course {
  slug: string;
  title: string;
  shortDescription: string;
  price: number | null;
  priceNote?: string;
  available: boolean;
}

export function formatPrice(price: number | null, note?: string): string {
  if (price === null) return note ?? 'Contact for pricing';
  return `$${price}`;
}

export const site = {
  name: 'Headway Nursing Services',
  address: { full: '8412 South 124th St, Seattle, WA 98178' },
  phone: { office: '425-306-5010' },
  email: 'headwaynursing@comcast.net',
  hours: 'Monday – Friday, 9 AM – 3 PM. Closed weekends and major holidays.',
};

// The consolidated six, decided at the 2026-08-19 wireframe review. The shipped
// site still carries nine in src/data/site.ts; applying the cut there is
// redesign-slice work, so only this default leads.
export const navLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/about', label: 'About' },
  { href: '/resources', label: 'Resources' },
  { href: '/services', label: 'Consulting' },
  { href: '/contact', label: 'Contact' },
];

export const sampleCourse: Course = {
  slug: '75-hour-ltc-blended',
  title: '75-Hour LTC Blended Training',
  shortDescription: 'Home Care Aide training with online work and 4-day classroom skills.',
  price: 700,
  available: true,
};

export const inquiryOptions = [
  '75-Hour LTC Blended Training',
  '54-Hour Core Basic Training',
  'CPR & First Aid',
  'General inquiry',
];

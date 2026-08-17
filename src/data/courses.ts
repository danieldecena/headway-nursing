export interface Course {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number | null;
  priceNote?: string;
  duration?: string;
  format: string;
  available: boolean;
  category: 'hca' | 'specialty' | 'certification' | 'continuing-ed';
  highlights?: string[];
}

export const registrationFee = 50;
export const registrationFeeNote =
  'Registration fee covers books and administrative work. Required for most courses.';

export const courses: Course[] = [
  {
    slug: '75-hour-ltc-blended',
    title: '75-Hour LTC Blended Training',
    shortDescription: 'Home Care Aide training with online work and 4-day classroom skills.',
    description:
      'Blended Home Care Aide (HCA) training meeting Washington State DSHS requirements. Complete online coursework, then attend four days of in-person classroom skills training. Certificate bearer is eligible to take the Washington state HCA license exam.',
    price: 700,
    duration: '75 hours (online + 4-day classroom)',
    format: 'Blended (online + in-person)',
    available: true,
    category: 'hca',
    highlights: [
      'DSHS-approved curriculum',
      'Eligible for WA state HCA exam',
      'Virtual learning via RingCentral + Google Classroom',
    ],
  },
  {
    slug: '75-hour-ltc-classroom',
    title: '75-Hour LTC Classroom Training',
    shortDescription: '11-day all-classroom HCA training program.',
    description:
      'Traditional 11-day all-classroom Home Care Aide training. Currently not available — contact us for waitlist or blended options.',
    price: 650,
    duration: '75 hours (11-day classroom)',
    format: 'In-person classroom',
    available: false,
    category: 'hca',
  },
  {
    slug: 'core-basic-training',
    title: '54-Hour Core Basic Training',
    shortDescription: 'DSHS core curriculum for long-term care workers.',
    description:
      'Core Basic Training is the DSHS curriculum that meets basic training requirements for workers providing care services for long-term care residents. Students finish online learning, then come to the office for skills practice and final evaluation of knowledge and skills.',
    price: 500,
    duration: '54 hours',
    format: 'Blended (online + 2 days skills)',
    available: true,
    category: 'hca',
    highlights: [
      'Client rights and communication',
      'Personal care tasks',
      'Health and safety advocacy',
    ],
  },
  {
    slug: 'dementia-specialty',
    title: 'Dementia Specialty Training',
    shortDescription: 'Level 1 Dementia Capable Caregiving certification.',
    description:
      'Specialty training provides managers and caregivers the knowledge and skills necessary to meet the special care needs of people living with dementia. Suitable for both managers and caregivers.',
    price: null,
    priceNote: 'Contact for current pricing and schedule',
    format: 'Virtual (RingCentral + Google Classroom)',
    available: true,
    category: 'specialty',
  },
  {
    slug: 'mental-health-specialty',
    title: 'Mental Health Specialty Training',
    shortDescription: 'Specialty training for mental illness care needs.',
    description:
      'Specialty training for caregivers and managers serving individuals with mental illness. Covers communication, problem-solving, and advocacy skills aligned with DSHS curriculum.',
    price: null,
    priceNote: 'Contact for current pricing and schedule',
    format: 'Virtual (RingCentral + Google Classroom)',
    available: true,
    category: 'specialty',
  },
  {
    slug: 'nurse-delegation',
    title: 'Nurse Delegation for Nursing Assistants',
    shortDescription: 'Self-study nurse delegation core training.',
    description:
      'The Nurse Delegation Program, under Washington State law, allows nursing assistants in certain settings to perform tasks such as administration of prescription medications — normally performed only by licensed nurses. A registered nurse must teach and supervise the nursing assistant.',
    price: 80,
    format: 'Self-study',
    available: true,
    category: 'certification',
  },
  {
    slug: 'nurse-delegation-diabetes',
    title: 'Nurse Delegation — Focus on Diabetes',
    shortDescription: 'Insulin injection delegation for qualified caregivers.',
    description:
      'Allows qualified caregivers to perform insulin injections as a nurse delegated task. Students must first complete Nurse Delegation Core before taking this class.',
    price: 80,
    format: 'Self-study',
    available: true,
    category: 'certification',
  },
  {
    slug: 'cpr-first-aid',
    title: 'CPR / First Aid Training (Renewal)',
    shortDescription: 'CPR and First Aid renewal certification.',
    description:
      'CPR and First Aid training for renewal. Cash, check, or online payment accepted.',
    price: 85,
    format: 'In-person or virtual',
    available: true,
    category: 'certification',
  },
  {
    slug: 'orientation-safety',
    title: 'Orientation and Safety Training',
    shortDescription: 'Required orientation and safety training for caregivers.',
    description:
      'Orientation and safety training as required for long-term care workers in Washington State.',
    price: null,
    priceNote: 'Contact for schedule',
    format: 'Virtual or in-person',
    available: true,
    category: 'certification',
  },
  {
    slug: 'hiv-aids',
    title: 'HIV/AIDS Certification',
    shortDescription: 'Required HIV/AIDS training certification.',
    description: 'HIV/AIDS certification training for caregivers and long-term care workers.',
    price: null,
    priceNote: 'Contact for schedule',
    format: 'Varies',
    available: true,
    category: 'certification',
  },
  {
    slug: 'continuing-education',
    title: 'Continuing Education (12 Hours)',
    shortDescription: '12 hours of continuing education credits.',
    description: 'Continuing education package — 12 hours of CE credits for qualified caregivers.',
    price: 120,
    duration: '12 hours',
    format: 'Varies',
    available: true,
    category: 'continuing-ed',
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function formatPrice(price: number | null, note?: string): string {
  if (price === null) return note ?? 'Contact for pricing';
  return `$${price}`;
}

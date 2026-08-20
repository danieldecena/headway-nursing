import { CourseCard } from 'headway-nursing-ds';

export const Registerable = () => (
  <CourseCard
    course={{
      slug: '75-hour-ltc-blended',
      title: '75-Hour LTC Blended Training',
      shortDescription: 'Home Care Aide training with online work and 4-day classroom skills.',
      price: 700,
      available: true,
    }}
  />
);

// Available but unpriced -> inquiry CTA, not a checkout.
export const ContactForPricing = () => (
  <CourseCard
    course={{
      slug: 'specialty-dementia',
      title: 'Dementia Specialty Training',
      shortDescription: 'DSHS specialty curriculum for caregivers supporting clients with dementia.',
      price: null,
      priceNote: 'Contact for pricing',
      available: true,
    }}
  />
);

export const Unavailable = () => (
  <CourseCard
    course={{
      slug: '75-hour-ltc-classroom',
      title: '75-Hour LTC Classroom Training',
      shortDescription: '11-day all-classroom HCA training program.',
      price: 650,
      available: false,
    }}
  />
);

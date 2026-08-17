export const site = {
  name: 'Headway Nursing Services',
  tagline: 'DSHS-Approved Home Care Aide & Caregiver Training',
  url: 'https://www.headwaynursing.org',
  description:
    'Washington State DSHS-approved HCA training, specialty certifications, and continuing education in Seattle, WA.',
  address: {
    street: '8412 South 124th St',
    city: 'Seattle',
    state: 'WA',
    zip: '98178',
    full: '8412 South 124th St, Seattle, WA 98178',
    mapUrl: 'https://maps.google.com/?q=8412+South+124th+St+Seattle+WA+98178',
  },
  phone: {
    tollFree: '1-800-380-4929',
    office: '425-306-5010',
    afterHours: '206-380-0042',
    fax: '1-800-380-4929',
  },
  email: 'headwaynursing@comcast.net',
  hours: 'Monday – Friday, 9 AM – 3 PM. Closed weekends and major holidays.',
  hoursNote:
    'Modified hours: 9 AM – 3 PM. Please schedule an appointment for any class. Leave a voicemail or email after hours.',
  reliasUrl: 'https://headwaynursing.training.reliaslearning.com/',
  director: {
    name: 'Janice Angle, RN',
    title: 'Program Director / Lead Instructor',
    bio: 'Headway Nursing Services was established by Janice Angle, a Registered Nurse in the State of Washington. She has more than 20 years of long-term nursing care experience as an Adult Family Home provider, instructor, and nursing consultant to many Adult Family Homes in the South King County area. A Washington State DSHS approved instructor.',
  },
  mission:
    'Headway Nursing Services is committed to train, certify and educate caregivers on the demands, expectations and responsibilities of being a caregiver; to promote and improve the well-being of our senior citizens through education, training and social discourse, and to encourage giving to seniors in need.',
  vision:
    'Headway Nursing Services unifying vision is to bring awareness to as many people as possible about the issues and challenges that our aging seniors face. It is also our vision to be a leader in expanding the knowledge base of the caregiver profession in our collective effort to ultimately secure a better quality of life for every senior as they live out the twilight of their lives.',
  social: {
    facebook: 'https://www.facebook.com/headwaynursingsvcs',
    instagram: 'https://www.instagram.com/headwaynursing',
    twitter: 'https://twitter.com/headway_nursing',
    googleBusiness: '',
  },
} as const;

export const navLinks = [
  { href: '/services', label: 'Consulting' },
  { href: '/courses', label: 'Courses' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/virtual-learning', label: 'Virtual Learning' },
  { href: '/about', label: 'About' },
  { href: '/whats-new', label: "What's New" },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const;

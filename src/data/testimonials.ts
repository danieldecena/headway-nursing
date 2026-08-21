export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  // Portrait in public/, or null to fall back to an initials avatar.
  photo: string | null;
}

// Quotes and portraits are the two the live Weebly site published. The
// portraits were cropped out of the composite cards it served, which baked the
// quote text into the image.
export const testimonials: Testimonial[] = [
  {
    name: 'Gordana B.',
    role: '40 Hour Core Basic Training student',
    quote:
      'If you want to go to school and finish a class for caregiving, do not be scared. Headway Nursing have instructors that are very intelligent and will understand all your needs during the class and will explain the topic that will be easier for you to understand and remember, especially the skills in the Core Basic Training. My class had a lot of ESL students like myself. There were Italians, Bosnians, Filipinos, Etiopians and Kenyans and all students felt very comfortable about themselves and what they learn.',
    photo: '/images/testimonials/gordana-b.png',
  },
  {
    name: 'Ruth N.',
    role: 'CarePro student',
    quote:
      'I researched many local schools and found that Headway Nursing Services was the right choice for me. It is close to home for the classes I do need to attend and the cost was much more reasonable than other choices I looked into. I was attracted to the fact that the majority of my classes would be online. I am working full-time and having classes online saved me time to still do the things that I enjoy. I have recommended Headway Nursing Services to my friends and co-workers. I feel that the school is cost effective, flexible to its students needs and the work can be completed even though many of us have busy lifestyles.',
    photo: '/images/testimonials/ruth-n.png',
  },
];

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

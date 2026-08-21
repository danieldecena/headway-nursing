import { Header } from 'headway-nursing-ds';

// Default carries the decided 6-item nav + Student Login.
export const Default = () => <Header />;

export const CustomNav = () => (
  <Header
    navLinks={[
      { href: '/courses', label: 'Courses' },
      { href: '/contact', label: 'Contact' },
    ]}
  />
);

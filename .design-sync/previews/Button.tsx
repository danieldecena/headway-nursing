import { Button } from 'headway-nursing-ds';

export const Primary = () => <Button href="/courses/75-hour-ltc-blended#register">Register Now</Button>;

export const Secondary = () => <Button href="/courses" variant="secondary">Browse Courses</Button>;

// Ghost is for dark brand panels (the home hero) — preview it on one.
export const GhostOnBrandPanel = () => (
  <div className="rounded-xl bg-brand-900 p-8">
    <Button href="/schedule" variant="ghost">View Schedule</Button>
  </div>
);

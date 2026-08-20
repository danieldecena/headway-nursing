import { RegisterSection } from 'headway-nursing-ds';

export const WithFormAndStripe = () => (
  <RegisterSection
    courseTitle="75-Hour LTC Blended Training"
    paymentUrl="https://buy.stripe.com/example"
  />
);

export const FormOnly = () => <RegisterSection courseTitle="54-Hour Core Basic Training" />;

export const Unconfigured = () => <RegisterSection formConfigured={false} />;

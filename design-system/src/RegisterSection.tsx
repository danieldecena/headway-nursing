import { inquiryOptions as defaultInquiryOptions, site } from './data';

export interface RegisterSectionProps {
  courseTitle?: string;
  /** The Astro original reads PUBLIC_FORMSPREE_ID; the DS takes the resolved flag. */
  formConfigured?: boolean;
  formspreeId?: string;
  /** Resolved from payments config in the site; a Stripe payment link here. */
  paymentUrl?: string | null;
  classManagerEmbedUrl?: string;
  inquiryOptions?: string[];
}

export function RegisterSection({
  courseTitle,
  formConfigured = true,
  formspreeId = 'YOUR_FORM_ID',
  paymentUrl = null,
  classManagerEmbedUrl = '',
  inquiryOptions = defaultInquiryOptions,
}: RegisterSectionProps) {
  const hasPayment = Boolean(paymentUrl || classManagerEmbedUrl);
  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

  return (
    <>
      <section id="register" className="scroll-mt-24 rounded-xl border border-brand-200 bg-brand-50 p-6 md:p-8">
        <h2 className="text-xl font-bold text-brand-900">Register {courseTitle ? `— ${courseTitle}` : ''}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Submit the form below to register. Pay online via Stripe, or pay by cash/check at our office.
          A $50 registration fee applies to most courses (books and admin).
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {formConfigured && (
            <a
              href="#contact-form"
              className="rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Register Now
            </a>
          )}
          {hasPayment && paymentUrl && (
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-brand-600 px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-100"
            >
              Pay Online (Stripe)
            </a>
          )}
          {hasPayment && !paymentUrl && classManagerEmbedUrl && (
            <a
              href="#pay-online"
              className="rounded-lg border border-brand-600 px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-100"
            >
              Pay Online
            </a>
          )}
        </div>

        {hasPayment && (
          <div id="pay-online" className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm">
            {classManagerEmbedUrl ? (
              <iframe
                src={classManagerEmbedUrl}
                title="Class registration calendar"
                className="min-h-96 w-full rounded-lg border-0"
                loading="lazy"
              />
            ) : paymentUrl ? (
              <p className="text-slate-600">
                Online payment available via Stripe.
                <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold text-brand-700 hover:underline">
                  Open payment page →
                </a>
              </p>
            ) : null}
          </div>
        )}
      </section>

      {formConfigured ? (
        <section id="contact-form" className="mt-8">
          <form
            action={`https://formspree.io/f/${formspreeId}`}
            method="POST"
            className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
          >
            <input type="hidden" name="course" value={courseTitle ?? 'General inquiry'} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">First name</label>
                <input type="text" id="firstName" name="firstName" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Last name</label>
                <input type="text" id="lastName" name="lastName" required className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" id="email" name="email" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
              <input type="tel" id="phone" name="phone" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="inquiry" className="block text-sm font-medium text-slate-700">Inquiry is regarding</label>
              <select id="inquiry" name="inquiry" required className={inputClass} defaultValue={inquiryOptions[0]}>
                {inquiryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">Comment / inquiry</label>
              <textarea id="message" name="message" rows={4} className={inputClass}></textarea>
            </div>
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
            <button type="submit" className="rounded-lg bg-accent-600 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-700">
              Submit Registration
            </button>
          </form>
        </section>
      ) : (
        <section id="contact-form" className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-slate-600">
            Online registration is temporarily unavailable. Please call us at{' '}
            <a href={`tel:${site.phone.office}`} className="font-semibold text-brand-700 hover:underline">{site.phone.office}</a>
            {' '}or email{' '}
            <a href={`mailto:${site.email}`} className="font-semibold text-brand-700 hover:underline">{site.email}</a>
            {' '}to register.
          </p>
        </section>
      )}
    </>
  );
}

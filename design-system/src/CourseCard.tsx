import { formatPrice, type Course } from './data';

export interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  // A course without a set price is an inquiry, not a checkout — even when it can run.
  const registerable = course.available && course.price != null;
  const ctaHref = registerable ? `/courses/${course.slug}#register` : '/contact';
  const ctaLabel = registerable ? 'Register' : 'Contact us';
  const ctaClass = registerable
    ? 'rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800'
    : 'rounded-lg border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50';

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-brand-900">
          <a href={`/courses/${course.slug}`} className="hover:text-brand-700">{course.title}</a>
        </h3>
        {!course.available && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            Unavailable
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm text-slate-600">{course.shortDescription}</p>
      <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <p className="text-lg font-bold text-brand-700">
          {formatPrice(course.price, course.priceNote)}
        </p>
        <a href={ctaHref} className={ctaClass}>
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

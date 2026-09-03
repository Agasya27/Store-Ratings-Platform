import { cn } from '../../utils/cn';

export default function PageHeader({ section, title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {section && (
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{section}</p>
        )}
        <h1 className="mt-1 font-display text-balance text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-pretty text-sm text-muted sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

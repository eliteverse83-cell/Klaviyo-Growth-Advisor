export default function SectionHeading({ index, icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {Icon && <Icon className="h-5.5 w-5.5" strokeWidth={2} />}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {String(index).padStart(2, '0')}
        </p>
        <h2 className="mt-0.5 text-xl font-bold text-ink-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
    </div>
  )
}

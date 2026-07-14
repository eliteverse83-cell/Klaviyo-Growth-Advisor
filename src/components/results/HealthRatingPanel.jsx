const TIER_STYLES = {
  Excellent: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  Strong: { badge: 'bg-brand-50 text-brand-700 border-brand-200', dot: 'bg-brand-500' },
  'Needs Improvement': { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'Critical Opportunities': { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
}

export default function HealthRatingPanel({ classification, healthRating }) {
  const style = TIER_STYLES[classification] ?? TIER_STYLES['Needs Improvement']

  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border border-ink-200 bg-white p-8 shadow-sm">
      <span
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ${style.badge}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        {classification}
      </span>
      <h3 className="mt-4 text-xl font-bold text-ink-900">{healthRating.tagline}</h3>
      <p className="mt-3 text-sm leading-6 text-ink-500">{healthRating.summary}</p>
    </div>
  )
}

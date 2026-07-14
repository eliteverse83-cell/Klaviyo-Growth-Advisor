import { TrendingUp } from 'lucide-react'

const PRIORITY_STYLES = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-ink-100 text-ink-600 border-ink-200',
}

export default function RecommendationCard({ recommendation }) {
  const { priority, category, title, description, impact } = recommendation

  return (
    <div className="card-surface card-surface-interactive rounded-2xl border border-ink-200 bg-white p-6 hover:border-brand-200">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-bold ${PRIORITY_STYLES[priority]}`}
        >
          {priority} Priority
        </span>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
          {category}
        </span>
      </div>

      <h3 className="mt-4 text-base font-bold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-500">{description}</p>

      <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
        <TrendingUp className="h-4 w-4" />
        {impact}
      </div>
    </div>
  )
}

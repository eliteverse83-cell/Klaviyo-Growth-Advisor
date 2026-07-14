import { TrendingUp, ListChecks } from 'lucide-react'

const PRIORITY_STYLES = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-ink-100 text-ink-600 border-ink-200',
}

export default function AIRecommendationCard({ recommendation }) {
  const { title, rationale, priority, expectedImpact, implementationSteps } = recommendation

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-colors hover:border-brand-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-ink-900">{title}</h3>
        {priority && (
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${PRIORITY_STYLES[priority]}`}
          >
            {priority} Priority
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          Why it matters
        </p>
        <p className="mt-1.5 text-sm leading-6 text-ink-600">{rationale}</p>
      </div>

      {expectedImpact && (
        <div className="mt-4 flex items-start gap-1.5 text-sm font-semibold text-emerald-600">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{expectedImpact}</span>
        </div>
      )}

      {implementationSteps?.length > 0 && (
        <div className="mt-5 rounded-xl bg-ink-50 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
            <ListChecks className="h-3.5 w-3.5" />
            How to implement
          </p>
          <ol className="mt-2 space-y-1.5">
            {implementationSteps.map((step, index) => (
              <li key={index} className="flex gap-2 text-sm leading-6 text-ink-600">
                <span className="font-semibold text-brand-600">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

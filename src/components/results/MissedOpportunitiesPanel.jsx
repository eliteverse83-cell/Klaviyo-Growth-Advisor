import { Target } from 'lucide-react'

export default function MissedOpportunitiesPanel({ pointsLeftOnTable, items }) {
  return (
    <div className="card-surface rounded-2xl border border-ink-200 bg-white p-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-ink-500">Points left on the table</p>
          <p className="mt-1 text-4xl font-bold text-ink-900">
            {pointsLeftOnTable}
            <span className="text-lg font-medium text-ink-400"> / 100</span>
          </p>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Target className="h-7 w-7" />
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="mt-8 divide-y divide-ink-100 border-t border-ink-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3.5">
              <span className="text-sm font-medium text-ink-800">{item.title}</span>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                +{item.pointsAtStake} pts
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-ink-400">
          No missed opportunities — every category is fully optimized.
        </p>
      )}
    </div>
  )
}

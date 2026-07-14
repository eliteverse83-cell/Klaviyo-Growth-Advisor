import { useEffect, useState } from 'react'

function barColor(ratio) {
  if (ratio >= 0.8) return 'bg-emerald-500'
  if (ratio >= 0.5) return 'bg-brand-500'
  return 'bg-amber-500'
}

function DimensionRow({ dimension, index }) {
  const ratio = dimension.maxPoints > 0 ? dimension.points / dimension.maxPoints : 0
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(ratio * 100), 80 + index * 70)
    return () => clearTimeout(timer)
  }, [ratio, index])

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-semibold text-ink-800">{dimension.label}</span>
        <span className="shrink-0 text-xs font-medium tabular-nums text-ink-400">
          {dimension.points}/{dimension.maxPoints}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${barColor(ratio)}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Animated per-dimension progress bars for the 8 scored maturity
 * dimensions — the UI counterpart to the PDF's score breakdown table.
 */
export default function DimensionBreakdown({ dimensions }) {
  return (
    <div className="card-surface card-surface-interactive rounded-2xl border border-ink-200 bg-white p-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {dimensions.map((dimension, index) => (
          <DimensionRow key={dimension.id} dimension={dimension} index={index} />
        ))}
      </div>
    </div>
  )
}

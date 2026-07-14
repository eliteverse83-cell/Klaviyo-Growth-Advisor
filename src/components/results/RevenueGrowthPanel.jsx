import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency.js'

export default function RevenueGrowthPanel({ revenueGrowth }) {
  if (!revenueGrowth) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-ink-500">
          Add your monthly revenue in the audit to see a growth projection.
        </p>
      </div>
    )
  }

  const { current, potential, difference, annualLow, annualHigh } = revenueGrowth

  return (
    <div className="overflow-hidden rounded-2xl bg-panel-gradient p-8 text-white sm:p-10">
      <div className="flex items-center gap-2 text-brand-100">
        <TrendingUp className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">
          Expected Revenue Growth
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div>
          <p className="text-sm text-brand-100">Current</p>
          <p className="mt-1 text-3xl font-bold">{formatCurrency(current)}</p>
          <p className="text-xs text-brand-100/80">per month</p>
        </div>
        <div>
          <p className="text-sm text-brand-100">Potential</p>
          <p className="mt-1 text-3xl font-bold">{formatCurrency(potential)}</p>
          <p className="text-xs text-brand-100/80">per month</p>
        </div>
        <div className="rounded-xl bg-white/10 p-4 sm:-m-4">
          <p className="text-sm text-brand-100">Difference</p>
          <p className="mt-1 text-3xl font-bold text-emerald-300">
            +{formatCurrency(difference)}
          </p>
          <p className="text-xs text-brand-100/80">per month · up to {formatCurrency(annualHigh)}/yr</p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-5 text-brand-100/80">
        Directional estimate based on typical email/SMS revenue benchmarks for stores of your
        size and the gaps identified above. Actual results vary. Annualized range:{' '}
        {formatCurrency(annualLow)} – {formatCurrency(annualHigh)}.
      </p>
    </div>
  )
}

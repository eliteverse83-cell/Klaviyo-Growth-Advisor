import { AlertOctagon, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency.js'

export default function BiggestRevenueLeakPanel({ leak }) {
  if (!leak) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-sm text-emerald-800">
          No major revenue leaks detected — every dimension we measured is fully optimized.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-red-200 bg-red-50 p-8 sm:p-10">
      <div className="flex items-center gap-2 text-red-600">
        <AlertOctagon className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">Biggest Revenue Leak</span>
      </div>

      <h3 className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">{leak.title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">{leak.description}</p>

      {leak.estimatedMonthlyImpact != null && (
        <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">
          <TrendingUp className="h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="text-xs font-medium text-ink-500">Estimated impact</p>
            <p className="text-xl font-bold text-red-600">
              +{formatCurrency(leak.estimatedMonthlyImpact)}/month
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

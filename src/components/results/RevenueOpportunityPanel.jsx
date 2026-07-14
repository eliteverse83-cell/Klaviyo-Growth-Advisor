import { TrendingUp } from 'lucide-react'

const currency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export default function RevenueOpportunityPanel({ revenueOpportunity }) {
  if (!revenueOpportunity) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-ink-500">
          Add your monthly revenue in the audit to see an estimated recovery range.
        </p>
      </div>
    )
  }

  const { monthlyLow, monthlyHigh, annualLow, annualHigh } = revenueOpportunity

  return (
    <div className="overflow-hidden rounded-2xl bg-panel-gradient p-8 text-white sm:p-10">
      <div className="flex items-center gap-2 text-brand-100">
        <TrendingUp className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">
          Estimated Revenue Opportunity
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <p className="text-sm text-brand-100">Per month</p>
          <p className="mt-1 text-3xl font-bold sm:text-4xl">
            {currency(monthlyLow)} – {currency(monthlyHigh)}
          </p>
        </div>
        <div>
          <p className="text-sm text-brand-100">Per year</p>
          <p className="mt-1 text-3xl font-bold sm:text-4xl">
            {currency(annualLow)} – {currency(annualHigh)}
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-5 text-brand-100/80">
        Directional estimate based on typical email/SMS revenue benchmarks for stores of your
        size and the gaps identified above. Actual results vary.
      </p>
    </div>
  )
}

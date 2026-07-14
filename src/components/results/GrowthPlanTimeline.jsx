import { CheckCircle2 } from 'lucide-react'

export default function GrowthPlanTimeline({ steps }) {
  if (steps.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
        <p className="mt-3 text-sm text-ink-500">
          You’re in great shape. Maintain your current program and revisit this audit quarterly.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <div
          key={step.phase}
          className="card-surface card-surface-interactive rounded-2xl border border-ink-200 bg-white p-6"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {index + 1}
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-600">
            {step.phase}
          </p>
          <h3 className="mt-1 text-base font-bold text-ink-900">{step.title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-500">{step.description}</p>
        </div>
      ))}
    </div>
  )
}

import { CheckCircle2, AlertTriangle } from 'lucide-react'

const EMPTY_COPY = {
  positive: 'No fully-optimized categories yet — plenty of quick wins ahead.',
  negative: 'No significant gaps found. Every category is fully optimized.',
}

export default function StrengthWeaknessList({ tone, items }) {
  const isPositive = tone === 'positive'
  const Icon = isPositive ? CheckCircle2 : AlertTriangle
  const iconClass = isPositive ? 'text-emerald-600' : 'text-amber-600'

  if (items.length === 0) {
    return <p className="text-sm text-ink-400">{EMPTY_COPY[tone]}</p>
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} />
          <div>
            <p className="text-sm font-semibold text-ink-900">{item.title}</p>
            <p className="mt-0.5 text-sm leading-6 text-ink-500">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

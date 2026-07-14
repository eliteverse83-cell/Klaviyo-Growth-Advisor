import { CheckCircle2 } from 'lucide-react'

const PRIORITY_STYLES = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-ink-100 text-ink-600 border-ink-200',
}

export default function ImmediateWinsList({ wins }) {
  if (wins.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
        <p className="mt-3 text-sm text-ink-500">
          No immediate wins outstanding — the program is fully optimized.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {wins.map((win, index) => (
        <div
          key={index}
          className="flex items-start gap-4 rounded-xl border border-ink-200 bg-white p-5 shadow-sm"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
            {index + 1}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-ink-900">{win.title}</h3>
              {win.priority && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${PRIORITY_STYLES[win.priority]}`}
                >
                  {win.priority}
                </span>
              )}
            </div>
            {win.description && (
              <p className="mt-1 text-sm leading-6 text-ink-500">{win.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

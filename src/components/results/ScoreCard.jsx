const CIRCUMFERENCE = 2 * Math.PI * 54

function scoreColor(score) {
  if (score >= 75) return '#16a34a'
  if (score >= 50) return '#2563eb'
  return '#ea580c'
}

/**
 * Circular score gauge. Used both for the overall audit score (large) and
 * per-category scores (compact) via the `size` prop.
 */
export default function ScoreCard({ label, score, summary, size = 'lg' }) {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
  const color = scoreColor(score)
  const isCompact = size === 'sm'

  return (
    <div
      className={`rounded-2xl border border-ink-200 bg-white shadow-sm ${
        isCompact ? 'p-5' : 'p-8'
      }`}
    >
      <div
        className={`flex items-center ${
          isCompact ? 'flex-row gap-4' : 'flex-col text-center'
        }`}
      >
        <div
          className={`relative shrink-0 ${isCompact ? 'h-20 w-20' : 'h-40 w-40'}`}
        >
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-bold text-ink-900 ${isCompact ? 'text-xl' : 'text-4xl'}`}
            >
              {score}
            </span>
            {!isCompact && (
              <span className="text-xs font-medium text-ink-400">/ 100</span>
            )}
          </div>
        </div>

        <div className={isCompact ? 'text-left' : 'mt-5'}>
          <h3
            className={`font-bold text-ink-900 ${isCompact ? 'text-sm' : 'text-lg'}`}
          >
            {label}
          </h3>
          {summary && (
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-500">
              {summary}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

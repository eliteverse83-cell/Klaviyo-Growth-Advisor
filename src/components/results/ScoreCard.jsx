import { useEffect, useState } from 'react'

const CIRCUMFERENCE = 2 * Math.PI * 54
const ANIMATION_MS = 900

function scoreColor(score) {
  if (score >= 75) return '#16a34a'
  if (score >= 50) return '#2563eb'
  return '#ea580c'
}

// Eases the ring fill and the counted-up number toward `score` on mount,
// instead of both snapping straight to their final values on first paint.
function useAnimatedScore(score) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()

    function tick(now) {
      const progress = Math.min(1, (now - start) / ANIMATION_MS)
      const eased = 1 - (1 - progress) ** 3 // ease-out-cubic
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  return displayScore
}

/**
 * Circular score gauge. Used both for the overall audit score (large) and
 * per-category scores (compact) via the `size` prop. Animates in from zero
 * on mount rather than snapping straight to its final value.
 */
export default function ScoreCard({ label, score, summary, size = 'lg' }) {
  const displayScore = useAnimatedScore(score)
  const offset = CIRCUMFERENCE - (displayScore / 100) * CIRCUMFERENCE
  const color = scoreColor(score)
  const isCompact = size === 'sm'

  return (
    <div
      className={`card-surface card-surface-interactive rounded-2xl border border-ink-200 bg-white ${
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
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-display font-bold text-ink-900 tabular-nums ${isCompact ? 'text-xl' : 'text-4xl'}`}
            >
              {displayScore}
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

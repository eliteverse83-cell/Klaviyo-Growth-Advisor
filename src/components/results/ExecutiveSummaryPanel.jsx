import { Sparkles, Loader2 } from 'lucide-react'

export default function ExecutiveSummaryPanel({ summary, aiStatus, aiSummary }) {
  const isPersonalized = aiStatus === 'success' && Boolean(aiSummary)
  const isLoading = aiStatus === 'loading'
  const text = isPersonalized ? aiSummary : summary

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-sm">
      {(isPersonalized || isLoading) && (
        <div className="mb-3">
          {isPersonalized ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              <Sparkles className="h-3 w-3" />
              Personalized by AI
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Personalizing…
            </span>
          )}
        </div>
      )}
      <p className="text-base leading-7 text-ink-700">{text}</p>
    </div>
  )
}

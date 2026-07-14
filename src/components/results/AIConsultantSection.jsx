import { Sparkles, Loader2, AlertTriangle } from 'lucide-react'
import RecommendationCard from './RecommendationCard.jsx'

export default function AIConsultantSection({ status, data, error }) {
  return (
    <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-panel-gradient text-white">
          <Sparkles className="h-4.5 w-4.5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            AI Consultant Take
          </p>
          <h2 className="text-lg font-bold text-ink-900">Personalized for your business</h2>
        </div>
      </div>

      {status === 'loading' && (
        <div className="mt-6 flex items-center gap-3 text-sm text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Your AI consultant is reviewing your answers…
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-800">
              AI recommendations are unavailable right now.
            </p>
            <p className="mt-1 text-amber-700">
              {error} The rule-based results below are still fully accurate.
            </p>
          </div>
        </div>
      )}

      {status === 'success' && data && (
        <div className="mt-6">
          <p className="text-sm leading-6 text-ink-700">{data.executiveSummary}</p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {data.recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={index}
                recommendation={{
                  priority: recommendation.priority,
                  category: 'AI Consultant',
                  title: recommendation.title,
                  description: recommendation.rationale,
                  impact: recommendation.expectedImpact,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

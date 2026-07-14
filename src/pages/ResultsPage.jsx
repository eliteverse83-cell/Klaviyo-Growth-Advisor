import { Download, RefreshCw } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import ScoreCard from '../components/results/ScoreCard.jsx'
import RecommendationCard from '../components/results/RecommendationCard.jsx'
import {
  MOCK_OVERALL_SCORE,
  MOCK_CATEGORY_SCORES,
  MOCK_RECOMMENDATIONS,
} from '../data/mockAuditResults.js'

export default function ResultsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-brand-600">
              Your Audit Results
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Here’s what we found
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button to="/audit" variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
              Run New Audit
            </Button>
          </div>
        </div>

        <p className="mt-4 max-w-2xl rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          This is a placeholder report generated from sample data — audit
          scoring logic hasn’t been built yet.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_2fr]">
          <ScoreCard
            label={MOCK_OVERALL_SCORE.label}
            score={MOCK_OVERALL_SCORE.score}
            summary={MOCK_OVERALL_SCORE.summary}
            size="lg"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MOCK_CATEGORY_SCORES.map((category) => (
              <ScoreCard
                key={category.id}
                label={category.label}
                score={category.score}
                size="sm"
              />
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-xl font-bold text-ink-900">
            Prioritized Recommendations
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Ordered by estimated revenue impact.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {MOCK_RECOMMENDATIONS.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Download,
  RefreshCw,
  Scale,
  Target,
  Workflow,
  ListChecks,
  TrendingUp,
  Milestone,
} from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import ScoreCard from '../components/results/ScoreCard.jsx'
import HealthRatingPanel from '../components/results/HealthRatingPanel.jsx'
import SectionHeading from '../components/results/SectionHeading.jsx'
import StrengthWeaknessList from '../components/results/StrengthWeaknessList.jsx'
import MissedOpportunitiesPanel from '../components/results/MissedOpportunitiesPanel.jsx'
import RecommendationCard from '../components/results/RecommendationCard.jsx'
import RevenueOpportunityPanel from '../components/results/RevenueOpportunityPanel.jsx'
import NextStepsTimeline from '../components/results/NextStepsTimeline.jsx'
import AIConsultantSection from '../components/results/AIConsultantSection.jsx'
import { generateAuditReport } from '../utils/auditReport.js'
import { SAMPLE_AUDIT_RESPONSE } from '../data/sampleAuditResponse.js'
import { fetchPersonalizedRecommendations } from '../services/aiRecommendations.js'

export default function ResultsPage() {
  const location = useLocation()
  const formData = location.state?.formData
  const isSample = !formData
  const effectiveFormData = formData ?? SAMPLE_AUDIT_RESPONSE

  const report = useMemo(
    () => generateAuditReport(effectiveFormData),
    [effectiveFormData],
  )

  const [aiStatus, setAiStatus] = useState('loading')
  const [aiData, setAiData] = useState(null)
  const [aiError, setAiError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setAiStatus('loading')

    fetchPersonalizedRecommendations(effectiveFormData)
      .then((data) => {
        if (cancelled) return
        setAiData(data)
        setAiStatus('success')
      })
      .catch((error) => {
        if (cancelled) return
        setAiError(error.message)
        setAiStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [effectiveFormData])

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 border-b border-ink-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-brand-600">Growth Audit Report</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              {report.businessName}
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Prepared by GrowthPilot AI ·{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
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

        {isSample && (
          <p className="mt-6 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
            This is a sample report generated from example data. Run your own manual audit to
            see your store’s real results.
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_2fr]">
          <ScoreCard label="Overall Score" score={report.overallScore} size="lg" />
          <HealthRatingPanel
            classification={report.classification}
            healthRating={report.healthRating}
          />
        </div>

        <div className="mt-10">
          <AIConsultantSection status={aiStatus} data={aiData} error={aiError} />
        </div>

        <div className="mt-16">
          <SectionHeading
            index={1}
            icon={Scale}
            title="Strengths & Weaknesses"
            subtitle="What’s working, and what’s holding your program back."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                Strengths
              </h3>
              <div className="mt-5">
                <StrengthWeaknessList tone="positive" items={report.strengths} />
              </div>
            </div>
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wide text-amber-700">
                Weaknesses
              </h3>
              <div className="mt-5">
                <StrengthWeaknessList tone="negative" items={report.weaknesses} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeading
            index={2}
            icon={Target}
            title="Missed Opportunities"
            subtitle="Specific gaps and the points each one is costing you."
          />
          <MissedOpportunitiesPanel
            pointsLeftOnTable={report.missedOpportunities.pointsLeftOnTable}
            items={report.missedOpportunities.items}
          />
        </div>

        <div className="mt-16">
          <SectionHeading
            index={3}
            icon={Workflow}
            title="Recommended Flows"
            subtitle="Automations we’d prioritize building next."
          />
          {report.recommendedFlows.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {report.recommendedFlows.map((flow) => (
                <RecommendationCard
                  key={flow.id}
                  recommendation={{
                    priority: flow.priority,
                    category: 'Recommended Flow',
                    title: flow.title,
                    description: flow.description,
                    impact: `+${flow.pointsAtStake} pts opportunity`,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400">All core flows are already live. Nice work.</p>
          )}
        </div>

        <div className="mt-16">
          <SectionHeading
            index={4}
            icon={ListChecks}
            title="Priority Tasks"
            subtitle="Ranked by revenue impact — start from the top."
          />
          {report.priorityTasks.length > 0 ? (
            <div className="space-y-4">
              {report.priorityTasks.map((task, index) => (
                <div key={task.id} className="flex items-start gap-4">
                  <span className="mt-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <RecommendationCard
                      recommendation={{
                        priority: task.priority,
                        category: task.category,
                        title: task.title,
                        description: task.description,
                        impact: `+${task.pointsAtStake} pts opportunity`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400">
              No outstanding priority tasks — your program is fully optimized.
            </p>
          )}
        </div>

        <div className="mt-16">
          <SectionHeading
            index={5}
            icon={TrendingUp}
            title="Estimated Revenue Opportunity"
            subtitle="A directional range based on the gaps identified above."
          />
          <RevenueOpportunityPanel revenueOpportunity={report.revenueOpportunity} />
        </div>

        <div className="mt-16">
          <SectionHeading
            index={6}
            icon={Milestone}
            title="Next Steps"
            subtitle="A simple sequence to work through the priorities above."
          />
          <NextStepsTimeline steps={report.nextSteps} />
        </div>
      </Container>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Download,
  RefreshCw,
  FileText,
  AlertOctagon,
  Zap,
  Scale,
  Target,
  Workflow,
  Milestone,
  TrendingUp,
  Sparkles,
  Loader2,
} from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import ScoreCard from '../components/results/ScoreCard.jsx'
import HealthRatingPanel from '../components/results/HealthRatingPanel.jsx'
import SectionHeading from '../components/results/SectionHeading.jsx'
import ExecutiveSummaryPanel from '../components/results/ExecutiveSummaryPanel.jsx'
import BiggestRevenueLeakPanel from '../components/results/BiggestRevenueLeakPanel.jsx'
import ImmediateWinsList from '../components/results/ImmediateWinsList.jsx'
import AIRecommendationCard from '../components/results/AIRecommendationCard.jsx'
import StrengthWeaknessList from '../components/results/StrengthWeaknessList.jsx'
import MissedOpportunitiesPanel from '../components/results/MissedOpportunitiesPanel.jsx'
import RecommendationCard from '../components/results/RecommendationCard.jsx'
import GrowthPlanTimeline from '../components/results/GrowthPlanTimeline.jsx'
import RevenueGrowthPanel from '../components/results/RevenueGrowthPanel.jsx'
import { generateAuditReport } from '../utils/auditReport.js'
import { SAMPLE_AUDIT_RESPONSE } from '../data/sampleAuditResponse.js'
import { fetchPersonalizedRecommendations } from '../services/aiRecommendations.js'
import { downloadAuditPdf } from '../utils/pdfReport.js'

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

  useEffect(() => {
    let cancelled = false
    setAiStatus('loading')

    fetchPersonalizedRecommendations(effectiveFormData)
      .then((data) => {
        if (cancelled) return
        setAiData(data)
        setAiStatus('success')
      })
      .catch(() => {
        if (cancelled) return
        setAiStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [effectiveFormData])

  const hasAiRecommendations = aiStatus === 'success' && Boolean(aiData?.recommendations?.length)

  const [isExportingPdf, setIsExportingPdf] = useState(false)

  async function handleExportPdf() {
    setIsExportingPdf(true)
    try {
      await downloadAuditPdf(report, aiStatus === 'success' ? aiData : null)
    } finally {
      setIsExportingPdf(false)
    }
  }

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
            <Button variant="secondary" size="sm" onClick={handleExportPdf} disabled={isExportingPdf}>
              {isExportingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExportingPdf ? 'Generating…' : 'Export PDF'}
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
          <HealthRatingPanel maturityLevel={report.maturityLevel} />
        </div>

        <div className="mt-16">
          <SectionHeading
            index={1}
            icon={FileText}
            title="Executive Summary"
            subtitle="The headline read on this store’s program, in plain language."
          />
          <ExecutiveSummaryPanel
            summary={report.executiveSummary}
            aiStatus={aiStatus}
            aiSummary={aiData?.executiveSummary}
          />
        </div>

        <div className="mt-16">
          <SectionHeading
            index={2}
            icon={AlertOctagon}
            title="Biggest Revenue Leak"
            subtitle="The single gap costing this store the most money right now."
          />
          <BiggestRevenueLeakPanel leak={report.biggestRevenueLeak} />
        </div>

        <div className="mt-16">
          <SectionHeading
            index={3}
            icon={Zap}
            title="Immediate Wins"
            subtitle="The highest-leverage moves to make first — why each matters, the expected payoff, and how to build it."
          />

          {hasAiRecommendations ? (
            <>
              <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                <Sparkles className="h-3 w-3" />
                Personalized by AI
              </span>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {aiData.recommendations.map((recommendation, index) => (
                  <AIRecommendationCard key={index} recommendation={recommendation} />
                ))}
              </div>
            </>
          ) : (
            <>
              {aiStatus === 'loading' && (
                <span className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Personalizing…
                </span>
              )}
              <ImmediateWinsList wins={report.immediateWins} />
            </>
          )}
        </div>

        <div className="mt-16">
          <SectionHeading
            index={4}
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
            index={5}
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
            index={6}
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
            index={7}
            icon={Milestone}
            title="90-Day Growth Plan"
            subtitle="A simple sequence to work through the priorities above."
          />
          <GrowthPlanTimeline steps={report.growthPlan} />
        </div>

        <div className="mt-16">
          <SectionHeading
            index={8}
            icon={TrendingUp}
            title="Expected Revenue Growth"
            subtitle="A directional range based on the gaps identified above."
          />
          <RevenueGrowthPanel revenueGrowth={report.revenueGrowth} />
        </div>
      </Container>
    </section>
  )
}

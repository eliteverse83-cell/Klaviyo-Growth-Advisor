/**
 * Builds the qualitative consulting-report content — executive summary,
 * biggest revenue leak, immediate wins, strengths/weaknesses, a 90-day
 * growth plan, and a revenue growth projection — on top of the weighted
 * maturity score from scoringEngine.js. Pure functions only.
 *
 * Two layers of detail feed the report: the 8 scored dimensions (used for
 * Strengths & Weaknesses, matching the maturity model itself), and
 * individual flows (used for specific, actionable recommendations — a
 * "Segmentation" dimension gap doesn't tell you what to build, but a
 * missing "Abandoned Cart" flow does). Both layers are merged into one
 * ranked gap list (getRankedGaps) that every recommendation-style section
 * pulls from, so "biggest," "immediate," and "90-day" all agree on what
 * matters most. Flow-level "points at stake" is computed by re-running
 * the real scorer with that flow hypothetically added, so it always
 * reflects the model's actual interactions (e.g. a flow that also unlocks
 * a Lifecycle Coverage stage is worth more) rather than a hand-maintained
 * shadow calculation.
 */
import { calculateAuditScore, ALL_FLOWS } from './scoringEngine.js'

const DIMENSION_COPY = {
  activeFlows: {
    strength: 'Your core automated flows are live and doing the heavy lifting on recovery and retention revenue.',
    weakness: 'Several standard automated flows are missing, which typically means recoverable revenue is going unclaimed every month.',
  },
  lifecycleCoverage: {
    strength: 'Your flows span the full customer lifecycle, from first purchase through win-back.',
    weakness: 'Coverage across the customer lifecycle has real gaps — some stages of the journey have no automated touchpoint at all.',
  },
  segmentation: {
    strength: 'Your list is meaningfully segmented, which supports more relevant, higher-converting sends.',
    weakness: 'Segmentation is minimal — most sends are likely going to your full list regardless of behavior.',
    leakLabel: 'Minimal Customer Segmentation',
    actionTitle: 'Build Out Customer Segments',
    rationale: 'Segmented campaigns consistently outperform batch-and-blast sends by matching message to customer intent.',
  },
  campaignConsistency: {
    strength: 'Your campaign cadence is healthy and consistent.',
    weakness: 'Campaign frequency is low, which limits how often you stay in front of your list.',
    leakLabel: 'Inconsistent Campaign Cadence',
    actionTitle: 'Increase Campaign Consistency',
    rationale: 'Stores sending fewer than 4 campaigns a month typically leave revenue on the table with no deliverability upside.',
  },
  smsUsage: {
    strength: 'SMS is enabled, giving you a high-open-rate channel alongside email.',
    weakness: 'SMS marketing isn’t enabled yet — you’re relying on email alone for time-sensitive messages.',
    leakLabel: 'SMS Marketing Not Enabled',
    actionTitle: 'Enable SMS Marketing',
    rationale: 'SMS routinely sees open rates above 95% and is well suited to cart recovery and flash-sale alerts.',
  },
  deliverability: {
    strength: 'Your sending practices — list hygiene, targeted sends, and cadence — support strong inbox placement.',
    weakness: 'Deliverability best practices have gaps — likely some mix of no list hygiene flow, unsegmented sends, or inconsistent cadence.',
  },
  listSize: {
    strength: 'Your email list is well-sized relative to your order volume, reflecting effective list capture.',
    weakness: 'Your email list is small relative to your order volume, suggesting on-site capture isn’t keeping pace with sales.',
    leakLabel: 'Email List Undersized for Order Volume',
    actionTitle: 'Grow Your Email List',
    rationale: 'A list that lags behind order volume caps how much revenue any flow or campaign can ever reach, regardless of how well it converts.',
  },
  revenueStage: {
    strength: 'Your revenue scale supports continued investment in program sophistication.',
    weakness: 'At your current revenue stage, there’s more room to invest in program sophistication as you grow.',
  },
}

// Dimensions with a concrete, standalone action (shown as recommendations).
// activeFlows/lifecycleCoverage are represented by specific flow
// recommendations instead; deliverability/revenueStage are descriptive
// signals derived from other actions rather than tasks in their own right.
const ACTIONABLE_DIMENSION_IDS = ['segmentation', 'campaignConsistency', 'smsUsage', 'listSize']

const FLOW_COPY = {
  Welcome: {
    actionTitle: 'Launch a Welcome Flow',
    rationale: 'New subscribers convert far better in their first 48 hours than in any later campaign. This is usually the fastest flow to stand up.',
  },
  'Abandoned Cart': {
    actionTitle: 'Launch an Abandoned Cart Flow',
    rationale: 'Typically the single highest-ROI automated flow. Shoppers who reach checkout are one reminder away from converting.',
  },
  'Browse Abandonment': {
    actionTitle: 'Launch a Browse Abandonment Flow',
    rationale: 'Catch interested shoppers before they forget your brand and buy from a competitor instead.',
  },
  'Post Purchase': {
    actionTitle: 'Launch a Post-Purchase Flow',
    rationale: 'Turns a single sale into a relationship — this is where repeat purchase rate and reviews are won or lost.',
  },
  'Win Back': {
    actionTitle: 'Launch a Win-Back Flow',
    rationale: 'Re-engaging a lapsed customer is consistently cheaper than acquiring a new one.',
  },
  Sunset: {
    actionTitle: 'Launch a Sunset Flow',
    rationale: 'Removing chronically disengaged subscribers protects inbox placement for the customers who do open your emails.',
  },
  Birthday: {
    actionTitle: 'Launch a Birthday Flow',
    rationale: 'Low effort to set up and consistently well received — a reliable source of incremental revenue.',
  },
  VIP: {
    actionTitle: 'Launch a VIP Flow',
    rationale: 'Retaining a top customer is far cheaper than acquiring a new one — this flow protects your most valuable relationships.',
  },
}

const REVENUE_BRACKET_MONTHLY_ESTIMATE = {
  'Under $10k': 7000,
  '$10k – $50k': 28000,
  '$50k – $200k': 115000,
  '$200k – $1M': 550000,
  '$1M+': 1500000,
}

function gap(dimension) {
  return dimension.maxPoints - dimension.points
}

function priorityFromGap(pointsAtStake) {
  if (pointsAtStake >= 8) return 'High'
  if (pointsAtStake >= 4) return 'Medium'
  return 'Low'
}

/**
 * Which flows are missing, and the real marginal score value of adding
 * each one on its own (accounting for Active Flows + Lifecycle Coverage +
 * Deliverability interactions, since e.g. Sunset scores 0 directly under
 * Active Flows but still moves the needle elsewhere).
 */
function getMissingFlowOpportunities(formData) {
  const activeFlows = Array.isArray(formData?.activeFlows) ? formData.activeFlows : []
  const baseScore = calculateAuditScore(formData).overallScore

  return ALL_FLOWS.filter((flow) => !activeFlows.includes(flow)).map((flow) => {
    const withFlow = { ...formData, activeFlows: [...activeFlows, flow] }
    const pointsAtStake = calculateAuditScore(withFlow).overallScore - baseScore
    return { flowName: flow, pointsAtStake }
  })
}

/**
 * The single ranked list every recommendation section draws from: missing
 * flows plus actionable dimension gaps, sorted by real revenue impact
 * (highest first). `leakLabel` is a problem-framed phrase ("No Sunset
 * Flow") for the Biggest Revenue Leak headline; `title` is the
 * action-framed phrase ("Launch a Sunset Flow") used everywhere else.
 */
function getRankedGaps(formData, dimensions) {
  const flowItems = getMissingFlowOpportunities(formData)
    .filter((flow) => flow.pointsAtStake > 0)
    .map((flow) => ({
      id: `flow-${flow.flowName}`,
      leakLabel: `No ${flow.flowName} Flow`,
      title: FLOW_COPY[flow.flowName]?.actionTitle ?? `Launch a ${flow.flowName} Flow`,
      description: FLOW_COPY[flow.flowName]?.rationale ?? '',
      category: 'Active Flows',
      pointsAtStake: flow.pointsAtStake,
    }))

  const dimensionItems = dimensions
    .filter((dimension) => ACTIONABLE_DIMENSION_IDS.includes(dimension.id) && gap(dimension) > 0)
    .map((dimension) => ({
      id: dimension.id,
      leakLabel: DIMENSION_COPY[dimension.id]?.leakLabel ?? dimension.label,
      title: DIMENSION_COPY[dimension.id]?.actionTitle ?? dimension.label,
      description: DIMENSION_COPY[dimension.id]?.rationale ?? '',
      category: dimension.label,
      pointsAtStake: gap(dimension),
    }))

  return [...flowItems, ...dimensionItems].sort((a, b) => b.pointsAtStake - a.pointsAtStake)
}

export function getStrengths(dimensions) {
  return dimensions
    .filter((dimension) => dimension.maxPoints > 0 && dimension.points === dimension.maxPoints)
    .map((dimension) => ({
      id: dimension.id,
      title: dimension.label,
      description: DIMENSION_COPY[dimension.id]?.strength ?? '',
    }))
}

export function getWeaknesses(dimensions) {
  return dimensions
    .filter((dimension) => gap(dimension) > 0)
    .sort((a, b) => gap(b) - gap(a))
    .map((dimension) => ({
      id: dimension.id,
      title: dimension.label,
      description: DIMENSION_COPY[dimension.id]?.weakness ?? '',
      pointsAtStake: gap(dimension),
    }))
}

export function getMissedOpportunities(formData, dimensions, overallScore) {
  const items = getRankedGaps(formData, dimensions).map(({ id, title, pointsAtStake }) => ({
    id,
    title,
    pointsAtStake,
  }))

  return { pointsLeftOnTable: 100 - overallScore, items }
}

export function getRecommendedFlows(formData) {
  return getMissingFlowOpportunities(formData)
    .filter((flow) => flow.pointsAtStake > 0)
    .sort((a, b) => b.pointsAtStake - a.pointsAtStake)
    .map((flow) => ({
      id: flow.flowName,
      flowName: flow.flowName,
      title: FLOW_COPY[flow.flowName]?.actionTitle ?? `Launch a ${flow.flowName} Flow`,
      description: FLOW_COPY[flow.flowName]?.rationale ?? '',
      pointsAtStake: flow.pointsAtStake,
      priority: priorityFromGap(flow.pointsAtStake),
    }))
}

/** Top-ranked, immediately actionable items — the report's "quick wins" list. */
export function getImmediateWins(formData, dimensions, limit = 3) {
  return getRankedGaps(formData, dimensions)
    .slice(0, limit)
    .map(({ id, title, description, category, pointsAtStake }) => ({
      id,
      title,
      description,
      category,
      pointsAtStake,
      priority: priorityFromGap(pointsAtStake),
    }))
}

function estimateItemMonthlyImpact(pointsAtStake, totalGapPoints, revenueGrowth) {
  if (!revenueGrowth || totalGapPoints <= 0) return null
  const midpointMonthly = (revenueGrowth.monthlyLow + revenueGrowth.monthlyHigh) / 2
  return Math.round(midpointMonthly * (pointsAtStake / totalGapPoints))
}

/**
 * The single highest-impact gap, framed as a "leak" with a dollar estimate
 * scaled from its share of the total point gap. Not necessarily additive
 * with other items' estimates (see estimateRevenueGrowth) — this is a
 * directional "if you fixed just this one thing" figure.
 */
export function getBiggestRevenueLeak(formData, dimensions, overallScore, revenueGrowth) {
  const ranked = getRankedGaps(formData, dimensions)
  if (ranked.length === 0) return null

  const top = ranked[0]
  const totalGapPoints = 100 - overallScore

  return {
    title: top.leakLabel,
    description: top.description,
    pointsAtStake: top.pointsAtStake,
    estimatedMonthlyImpact: estimateItemMonthlyImpact(top.pointsAtStake, totalGapPoints, revenueGrowth),
  }
}

/**
 * Current estimated monthly revenue (from the selected bracket), the
 * potential monthly revenue if every identified gap were closed, and the
 * difference between them — the report's headline growth projection.
 */
export function estimateRevenueGrowth(formData, overallScore) {
  const current = REVENUE_BRACKET_MONTHLY_ESTIMATE[formData?.monthlyRevenue]
  if (!current) return null

  const gapRatio = (100 - overallScore) / 100
  const lowPercent = 0.03 + gapRatio * 0.07 // 3%–10% of monthly revenue
  const highPercent = 0.06 + gapRatio * 0.14 // 6%–20% of monthly revenue

  const monthlyLow = Math.round(current * lowPercent)
  const monthlyHigh = Math.round(current * highPercent)

  return {
    current,
    potential: current + monthlyHigh,
    difference: monthlyHigh,
    monthlyLow,
    monthlyHigh,
    annualLow: monthlyLow * 12,
    annualHigh: monthlyHigh * 12,
  }
}

const GROWTH_PLAN_PHASES = ['Week 1', 'Week 2', 'Month 2', 'Month 3']

/** Sequences the top-ranked gaps into a 90-day plan. */
export function get90DayGrowthPlan(formData, dimensions) {
  return getRankedGaps(formData, dimensions)
    .slice(0, GROWTH_PLAN_PHASES.length)
    .map((item, index) => ({
      phase: GROWTH_PLAN_PHASES[index],
      title: item.title,
      description: item.description,
    }))
}

function getExecutiveSummary(formData, { strengths, weaknesses, maturityLevel, overallScore }) {
  const name = formData?.businessName?.trim() || 'This store'
  const topStrength = strengths[0]
  const topWeakness = weaknesses[0]
  const gapCount = weaknesses.length

  let opening
  if (topStrength && topWeakness) {
    opening = `${name} has a strong foundation in ${topStrength.title}, but is missing key opportunities in ${topWeakness.title}.`
  } else if (topWeakness) {
    opening = `${name} is missing key opportunities in ${topWeakness.title}, with room to grow across most of the program.`
  } else {
    opening = `${name}’s program is executing at a best-in-class level across every dimension measured.`
  }

  const closingClause =
    gapCount > 0
      ? `there ${gapCount === 1 ? 'is' : 'are'} ${gapCount} area${gapCount === 1 ? '' : 's'} worth prioritizing to unlock meaningful revenue`
      : 'the focus now is on testing and incremental optimization'

  return `${opening} At a maturity score of ${overallScore}/100 (${maturityLevel.label}), ${closingClause}.`
}

/**
 * Full report for a completed (or sample) manual audit submission.
 * @param {object} formData
 */
export function generateAuditReport(formData) {
  const { overallScore, maturityLevel, dimensions } = calculateAuditScore(formData)
  const strengths = getStrengths(dimensions)
  const weaknesses = getWeaknesses(dimensions)
  const revenueGrowth = estimateRevenueGrowth(formData, overallScore)

  return {
    businessName: formData?.businessName?.trim() || 'Your Store',
    overallScore,
    maturityLevel,
    dimensions,
    executiveSummary: getExecutiveSummary(formData, { strengths, weaknesses, maturityLevel, overallScore }),
    biggestRevenueLeak: getBiggestRevenueLeak(formData, dimensions, overallScore, revenueGrowth),
    immediateWins: getImmediateWins(formData, dimensions),
    strengths,
    weaknesses,
    missedOpportunities: getMissedOpportunities(formData, dimensions, overallScore),
    recommendedFlows: getRecommendedFlows(formData),
    growthPlan: get90DayGrowthPlan(formData, dimensions),
    revenueGrowth,
  }
}

/**
 * Builds the qualitative consulting-report content (strengths, weaknesses,
 * recommendations, revenue estimate, next steps) on top of the weighted
 * maturity score from scoringEngine.js. Pure functions only.
 *
 * Two layers of detail feed the report: the 8 scored dimensions (used for
 * Strengths & Weaknesses, matching the maturity model itself), and
 * individual flows (used for specific, actionable recommendations — a
 * "Segmentation" dimension gap doesn't tell you what to build, but a
 * missing "Abandoned Cart" flow does). Flow-level "points at stake" is
 * computed by re-running the real scorer with that flow hypothetically
 * added, so it always reflects the model's actual interactions (e.g. a
 * flow that also unlocks a Lifecycle Coverage stage is worth more) rather
 * than a hand-maintained shadow calculation.
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
    actionTitle: 'Build Out Customer Segments',
    rationale: 'Segmented campaigns consistently outperform batch-and-blast sends by matching message to customer intent.',
  },
  campaignConsistency: {
    strength: 'Your campaign cadence is healthy and consistent.',
    weakness: 'Campaign frequency is low, which limits how often you stay in front of your list.',
    actionTitle: 'Increase Campaign Consistency',
    rationale: 'Stores sending fewer than 4 campaigns a month typically leave revenue on the table with no deliverability upside.',
  },
  smsUsage: {
    strength: 'SMS is enabled, giving you a high-open-rate channel alongside email.',
    weakness: 'SMS marketing isn’t enabled yet — you’re relying on email alone for time-sensitive messages.',
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
  const flowItems = getMissingFlowOpportunities(formData)
    .filter((flow) => flow.pointsAtStake > 0)
    .map((flow) => ({
      id: `flow-${flow.flowName}`,
      title: FLOW_COPY[flow.flowName]?.actionTitle ?? `Launch a ${flow.flowName} Flow`,
      pointsAtStake: flow.pointsAtStake,
    }))

  const dimensionItems = dimensions
    .filter((dimension) => ACTIONABLE_DIMENSION_IDS.includes(dimension.id) && gap(dimension) > 0)
    .map((dimension) => ({
      id: dimension.id,
      title: DIMENSION_COPY[dimension.id]?.actionTitle ?? dimension.label,
      pointsAtStake: gap(dimension),
    }))

  const items = [...flowItems, ...dimensionItems].sort((a, b) => b.pointsAtStake - a.pointsAtStake)

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

export function getPriorityTasks(formData, dimensions, limit = 5) {
  const flowItems = getMissingFlowOpportunities(formData)
    .filter((flow) => flow.pointsAtStake > 0)
    .map((flow) => ({
      id: `flow-${flow.flowName}`,
      title: FLOW_COPY[flow.flowName]?.actionTitle ?? `Launch a ${flow.flowName} Flow`,
      description: FLOW_COPY[flow.flowName]?.rationale ?? '',
      category: 'Active Flows',
      pointsAtStake: flow.pointsAtStake,
    }))

  const dimensionItems = dimensions
    .filter((dimension) => ACTIONABLE_DIMENSION_IDS.includes(dimension.id) && gap(dimension) > 0)
    .map((dimension) => ({
      id: dimension.id,
      title: DIMENSION_COPY[dimension.id]?.actionTitle ?? dimension.label,
      description: DIMENSION_COPY[dimension.id]?.rationale ?? '',
      category: dimension.label,
      pointsAtStake: gap(dimension),
    }))

  return [...flowItems, ...dimensionItems]
    .sort((a, b) => b.pointsAtStake - a.pointsAtStake)
    .slice(0, limit)
    .map((item) => ({ ...item, priority: priorityFromGap(item.pointsAtStake) }))
}

export function estimateRevenueOpportunity(formData, overallScore) {
  const baseMonthlyRevenue = REVENUE_BRACKET_MONTHLY_ESTIMATE[formData?.monthlyRevenue]
  if (!baseMonthlyRevenue) return null

  const gapRatio = (100 - overallScore) / 100
  const lowPercent = 0.03 + gapRatio * 0.07 // 3%–10% of monthly revenue
  const highPercent = 0.06 + gapRatio * 0.14 // 6%–20% of monthly revenue

  const monthlyLow = Math.round(baseMonthlyRevenue * lowPercent)
  const monthlyHigh = Math.round(baseMonthlyRevenue * highPercent)

  return {
    monthlyLow,
    monthlyHigh,
    annualLow: monthlyLow * 12,
    annualHigh: monthlyHigh * 12,
  }
}

const NEXT_STEP_PHASES = ['This Week', 'This Month', 'This Quarter']

export function getNextSteps(priorityTasks) {
  return priorityTasks.slice(0, 3).map((task, index) => ({
    phase: NEXT_STEP_PHASES[index] ?? 'This Quarter',
    title: task.title,
    description: task.description,
  }))
}

/**
 * Full report for a completed (or sample) manual audit submission.
 * @param {object} formData
 */
export function generateAuditReport(formData) {
  const { overallScore, maturityLevel, dimensions } = calculateAuditScore(formData)
  const priorityTasks = getPriorityTasks(formData, dimensions)

  return {
    businessName: formData?.businessName?.trim() || 'Your Store',
    overallScore,
    maturityLevel,
    dimensions,
    strengths: getStrengths(dimensions),
    weaknesses: getWeaknesses(dimensions),
    missedOpportunities: getMissedOpportunities(formData, dimensions, overallScore),
    recommendedFlows: getRecommendedFlows(formData),
    priorityTasks,
    revenueOpportunity: estimateRevenueOpportunity(formData, overallScore),
    nextSteps: getNextSteps(priorityTasks),
  }
}

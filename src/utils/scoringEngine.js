/**
 * Weighted business maturity model for the manual audit. Takes the
 * submitted form data (see src/data/auditQuestions.js) and derives a
 * 0-100 maturity score across 8 weighted dimensions, plus a 5-level
 * maturity classification. Pure functions only — no side effects, no
 * API calls.
 */

export const MAX_SCORE = 100

/**
 * Point value each dimension contributes toward the 100-point total.
 * Weights reflect how directly each dimension drives revenue: automated
 * flows and the lifecycle they cover are worth the most; contextual
 * signals (revenue stage) the least.
 */
export const DIMENSION_WEIGHTS = {
  activeFlows: 20,
  lifecycleCoverage: 15,
  segmentation: 15,
  campaignConsistency: 10,
  smsUsage: 10,
  deliverability: 10,
  listSize: 10,
  revenueStage: 10,
}

/**
 * Five maturity levels, each with a score band and a plain-language
 * explanation of what that level means for the business.
 */
export const MATURITY_LEVELS = [
  {
    level: 1,
    label: 'Foundational',
    min: 0,
    max: 24,
    tagline: 'The program is essentially starting from zero.',
    summary:
      'Core flows, segmentation, and SMS are largely absent. Almost every dimension of the program has room to grow, which means almost all of the revenue a mature program would capture is currently being left on the table.',
  },
  {
    level: 2,
    label: 'Emerging',
    min: 25,
    max: 44,
    tagline: 'A few foundational pieces exist, but coverage is thin.',
    summary:
      'Some basics are in place — usually a single flow or occasional campaign sending — but most dimensions of the program are still underdeveloped or inconsistent.',
  },
  {
    level: 3,
    label: 'Developing',
    min: 45,
    max: 64,
    tagline: 'The core building blocks are in place, with real gaps remaining.',
    summary:
      'Foundational flows and some segmentation exist, but meaningful gaps remain across lifecycle coverage, SMS, or deliverability practices. Closing them should produce a noticeable lift.',
  },
  {
    level: 4,
    label: 'Established',
    min: 65,
    max: 84,
    tagline: 'Most lifecycle stages and channels are covered well.',
    summary:
      'The program is solid — flows, segmentation, and cadence are mostly in place and working together. Remaining work is refinement rather than foundational gaps.',
  },
  {
    level: 5,
    label: 'Optimized',
    min: 85,
    max: 100,
    tagline: 'The program reflects best-in-class maturity.',
    summary:
      'Flows, segmentation, SMS, and deliverability practices are all in strong shape. Focus now shifts to testing and incremental optimization rather than new foundations.',
  },
]

export function getMaturityLevel(score) {
  return (
    MATURITY_LEVELS.find((tier) => score >= tier.min && score <= tier.max) ??
    MATURITY_LEVELS[0]
  )
}

/**
 * Point value each individual flow contributes to the Active Flows
 * dimension. Sunset is intentionally excluded here — its impact is
 * captured through the Deliverability and Lifecycle Coverage dimensions
 * instead, since "list hygiene" is really what that flow is for.
 */
export const FLOW_WEIGHTS = {
  Welcome: 5,
  'Abandoned Cart': 5,
  'Browse Abandonment': 3,
  VIP: 3,
  'Post Purchase': 2,
  'Win Back': 1,
  Birthday: 1,
}

export const ALL_FLOWS = [
  'Welcome',
  'Abandoned Cart',
  'Browse Abandonment',
  'Post Purchase',
  'Win Back',
  'Sunset',
  'Birthday',
  'VIP',
]

/**
 * The customer lifecycle, broken into stages. Each stage is "covered" if
 * at least one of its flows is live — this measures breadth across the
 * journey, distinct from the Active Flows dimension's raw flow count.
 */
export const LIFECYCLE_STAGES = [
  { id: 'acquisition', label: 'Acquisition', points: 3, flows: ['Welcome'] },
  { id: 'conversion', label: 'Conversion', points: 4, flows: ['Abandoned Cart', 'Browse Abandonment'] },
  { id: 'retention', label: 'Retention', points: 4, flows: ['Post Purchase', 'VIP'] },
  { id: 'winback', label: 'Win-Back', points: 4, flows: ['Win Back', 'Sunset'] },
]

const REVENUE_STAGE_BY_BRACKET = {
  'Under $10k': 2,
  '$10k – $50k': 4,
  '$50k – $200k': 6,
  '$200k – $1M': 8,
  '$1M+': 10,
}

function toNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function toFlowList(activeFlows) {
  return Array.isArray(activeFlows) ? activeFlows : []
}

function scoreActiveFlows(activeFlows) {
  const flows = toFlowList(activeFlows)
  return Object.entries(FLOW_WEIGHTS).reduce(
    (total, [flow, weight]) => total + (flows.includes(flow) ? weight : 0),
    0,
  )
}

function scoreLifecycleCoverage(activeFlows) {
  const flows = toFlowList(activeFlows)
  return LIFECYCLE_STAGES.reduce(
    (total, stage) => total + (stage.flows.some((flow) => flows.includes(flow)) ? stage.points : 0),
    0,
  )
}

// Full credit requires 6+ segments; below that, credit scales down in
// steps rather than dropping straight to zero for a single segment.
function scoreSegmentation(customerSegments) {
  const count = toNumber(customerSegments)
  if (count <= 0) return 0
  if (count <= 2) return 5
  if (count <= 5) return 10
  return DIMENSION_WEIGHTS.segmentation
}

// Full credit requires 8+ campaigns/month; same step-down shape as
// segmentation, rewarding partial cadence rather than an all-or-nothing cliff.
function scoreCampaignConsistency(campaignsPerMonth) {
  const count = toNumber(campaignsPerMonth)
  if (count <= 0) return 0
  if (count <= 3) return 5
  if (count <= 7) return 8
  return DIMENSION_WEIGHTS.campaignConsistency
}

function scoreSmsUsage(smsEnabled) {
  return smsEnabled === 'Yes' ? DIMENSION_WEIGHTS.smsUsage : 0
}

// Deliverability isn't asked about directly, so it's derived from the
// best-practice signals the form already collects: active list hygiene
// (Sunset flow), targeted rather than batch-and-blast sending
// (segmentation), and a sustainable, non-zero sending cadence.
function scoreDeliverability(formData) {
  const flows = toFlowList(formData.activeFlows)
  let points = 0
  if (flows.includes('Sunset')) points += 5
  if (toNumber(formData.customerSegments) > 0) points += 3
  if (toNumber(formData.campaignsPerMonth) > 0) points += 2
  return points
}

// List size alone doesn't indicate maturity — a large list for a small,
// low-order business can be as much a red flag as an asset. Scored as
// list size relative to monthly order volume (a proxy for how well
// top-of-funnel signups convert into transacting customers), falling
// back to absolute list-size tiers when order volume isn't available.
function scoreListSize(emailListSize, avgMonthlyOrders) {
  const list = toNumber(emailListSize)
  if (list <= 0) return 0

  const orders = toNumber(avgMonthlyOrders)
  if (orders > 0) {
    const ratio = list / orders
    if (ratio < 5) return 3
    if (ratio < 15) return 6
    if (ratio < 40) return 9
    return DIMENSION_WEIGHTS.listSize
  }

  if (list < 2000) return 3
  if (list < 10000) return 6
  if (list < 50000) return 9
  return DIMENSION_WEIGHTS.listSize
}

function scoreRevenueStage(monthlyRevenue) {
  return REVENUE_STAGE_BY_BRACKET[monthlyRevenue] ?? 0
}

/**
 * Scores a completed (or partial) manual audit form against the 8
 * weighted maturity dimensions.
 * @param {object} formData - shape matches AUDIT_FORM_INITIAL_STATE
 * @returns {{ overallScore: number, maturityLevel: object, dimensions: Array }}
 */
export function calculateAuditScore(formData = {}) {
  const dimensions = [
    {
      id: 'activeFlows',
      label: 'Active Flows',
      points: scoreActiveFlows(formData.activeFlows),
      maxPoints: DIMENSION_WEIGHTS.activeFlows,
    },
    {
      id: 'lifecycleCoverage',
      label: 'Customer Lifecycle Coverage',
      points: scoreLifecycleCoverage(formData.activeFlows),
      maxPoints: DIMENSION_WEIGHTS.lifecycleCoverage,
    },
    {
      id: 'segmentation',
      label: 'Segmentation',
      points: scoreSegmentation(formData.customerSegments),
      maxPoints: DIMENSION_WEIGHTS.segmentation,
    },
    {
      id: 'campaignConsistency',
      label: 'Campaign Consistency',
      points: scoreCampaignConsistency(formData.campaignsPerMonth),
      maxPoints: DIMENSION_WEIGHTS.campaignConsistency,
    },
    {
      id: 'smsUsage',
      label: 'SMS Usage',
      points: scoreSmsUsage(formData.smsEnabled),
      maxPoints: DIMENSION_WEIGHTS.smsUsage,
    },
    {
      id: 'deliverability',
      label: 'Deliverability Best Practices',
      points: scoreDeliverability(formData),
      maxPoints: DIMENSION_WEIGHTS.deliverability,
    },
    {
      id: 'listSize',
      label: 'List Size & Growth',
      points: scoreListSize(formData.emailListSize, formData.avgMonthlyOrders),
      maxPoints: DIMENSION_WEIGHTS.listSize,
    },
    {
      id: 'revenueStage',
      label: 'Revenue Stage',
      points: scoreRevenueStage(formData.monthlyRevenue),
      maxPoints: DIMENSION_WEIGHTS.revenueStage,
    },
  ]

  const overallScore = dimensions.reduce((total, dimension) => total + dimension.points, 0)

  return {
    overallScore,
    maturityLevel: getMaturityLevel(overallScore),
    dimensions,
  }
}

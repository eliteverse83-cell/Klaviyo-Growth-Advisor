/**
 * Audit scoring engine. Pure functions only — takes the manual audit form
 * data (see src/data/auditQuestions.js) and derives a 0-100 growth score.
 * No side effects, no API calls.
 */

export const MAX_SCORE = 100

/** Point value each category contributes toward the 100-point total. */
export const SCORE_WEIGHTS = {
  welcomeFlow: 15,
  abandonedCart: 15,
  browseAbandonment: 10,
  sms: 10,
  segmentation: 15,
  campaignFrequency: 10,
  vipFlow: 10,
  sunsetFlow: 5,
  birthdayFlow: 5,
  revenueMaturity: 5,
}

export const SCORE_CLASSIFICATIONS = [
  { label: 'Excellent', min: 90, max: 100 },
  { label: 'Strong', min: 75, max: 89 },
  { label: 'Needs Improvement', min: 60, max: 74 },
  { label: 'Critical Opportunities', min: 0, max: 59 },
]

export function getScoreClassification(score) {
  return (
    SCORE_CLASSIFICATIONS.find((tier) => score >= tier.min && score <= tier.max)
      ?.label ?? 'Critical Opportunities'
  )
}

// Monthly revenue is collected as a select range rather than a raw number,
// so maturity is mapped from the bracket rather than computed.
const REVENUE_MATURITY_BY_BRACKET = {
  'Under $10k': 1,
  '$10k – $50k': 2,
  '$50k – $200k': 3,
  '$200k – $1M': 4,
  '$1M+': 5,
}

function toNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function hasFlow(activeFlows, flowName) {
  return Array.isArray(activeFlows) && activeFlows.includes(flowName)
}

function scoreFlow(activeFlows, flowName, weight) {
  return hasFlow(activeFlows, flowName) ? weight : 0
}

// Full credit requires 4+ campaigns/month; below that, credit scales down
// in steps rather than dropping straight to zero for a single campaign.
function scoreCampaignFrequency(campaignsPerMonth) {
  const count = toNumber(campaignsPerMonth)
  if (count <= 0) return 0
  if (count <= 3) return 5
  if (count <= 7) return 8
  return SCORE_WEIGHTS.campaignFrequency
}

// Same step-down logic as campaign frequency: partial credit for having
// *some* segmentation, full credit at 6+ segments.
function scoreSegmentation(customerSegments) {
  const count = toNumber(customerSegments)
  if (count <= 0) return 0
  if (count <= 2) return 5
  if (count <= 5) return 10
  return SCORE_WEIGHTS.segmentation
}

function scoreRevenueMaturity(monthlyRevenue) {
  return REVENUE_MATURITY_BY_BRACKET[monthlyRevenue] ?? 0
}

/**
 * Scores a completed (or partial) manual audit form.
 * @param {object} formData - shape matches AUDIT_FORM_INITIAL_STATE
 * @returns {{ overallScore: number, classification: string, categories: Array }}
 */
export function calculateAuditScore(formData = {}) {
  const {
    activeFlows = [],
    smsEnabled,
    campaignsPerMonth,
    customerSegments,
    monthlyRevenue,
  } = formData

  const categories = [
    {
      id: 'welcomeFlow',
      label: 'Welcome Flow',
      points: scoreFlow(activeFlows, 'Welcome', SCORE_WEIGHTS.welcomeFlow),
      maxPoints: SCORE_WEIGHTS.welcomeFlow,
    },
    {
      id: 'abandonedCart',
      label: 'Abandoned Cart',
      points: scoreFlow(activeFlows, 'Abandoned Cart', SCORE_WEIGHTS.abandonedCart),
      maxPoints: SCORE_WEIGHTS.abandonedCart,
    },
    {
      id: 'browseAbandonment',
      label: 'Browse Abandonment',
      points: scoreFlow(activeFlows, 'Browse Abandonment', SCORE_WEIGHTS.browseAbandonment),
      maxPoints: SCORE_WEIGHTS.browseAbandonment,
    },
    {
      id: 'sms',
      label: 'SMS Marketing',
      points: smsEnabled === 'Yes' ? SCORE_WEIGHTS.sms : 0,
      maxPoints: SCORE_WEIGHTS.sms,
    },
    {
      id: 'segmentation',
      label: 'Segmentation',
      points: scoreSegmentation(customerSegments),
      maxPoints: SCORE_WEIGHTS.segmentation,
    },
    {
      id: 'campaignFrequency',
      label: 'Campaign Frequency',
      points: scoreCampaignFrequency(campaignsPerMonth),
      maxPoints: SCORE_WEIGHTS.campaignFrequency,
    },
    {
      id: 'vipFlow',
      label: 'VIP Flow',
      points: scoreFlow(activeFlows, 'VIP', SCORE_WEIGHTS.vipFlow),
      maxPoints: SCORE_WEIGHTS.vipFlow,
    },
    {
      id: 'sunsetFlow',
      label: 'Sunset Flow',
      points: scoreFlow(activeFlows, 'Sunset', SCORE_WEIGHTS.sunsetFlow),
      maxPoints: SCORE_WEIGHTS.sunsetFlow,
    },
    {
      id: 'birthdayFlow',
      label: 'Birthday Flow',
      points: scoreFlow(activeFlows, 'Birthday', SCORE_WEIGHTS.birthdayFlow),
      maxPoints: SCORE_WEIGHTS.birthdayFlow,
    },
    {
      id: 'revenueMaturity',
      label: 'Revenue-Based Maturity',
      points: scoreRevenueMaturity(monthlyRevenue),
      maxPoints: SCORE_WEIGHTS.revenueMaturity,
    },
  ]

  const overallScore = categories.reduce((total, category) => total + category.points, 0)

  return {
    overallScore,
    classification: getScoreClassification(overallScore),
    categories,
  }
}

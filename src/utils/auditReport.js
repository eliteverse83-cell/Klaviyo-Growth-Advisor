/**
 * Builds the qualitative consulting-report content (strengths, weaknesses,
 * recommendations, revenue estimate, next steps) on top of the raw
 * category scores from scoringEngine.js. Pure functions only.
 */
import { calculateAuditScore } from './scoringEngine.js'

// The 6 flow categories double as "flows" for the Recommended Flows
// section; the other 4 categories are program-level, not a flow to launch.
const FLOW_CATEGORY_IDS = [
  'welcomeFlow',
  'abandonedCart',
  'browseAbandonment',
  'vipFlow',
  'sunsetFlow',
  'birthdayFlow',
]

const CATEGORY_COPY = {
  welcomeFlow: {
    flowName: 'Welcome',
    strength: 'Your Welcome Flow is live, capturing new subscribers while their intent is highest.',
    weakness: 'No Welcome Flow is active — new subscribers currently get nothing after they sign up.',
    actionTitle: 'Launch a Welcome Flow',
    rationale:
      'New subscribers convert far better in their first 48 hours than in any later campaign. This is usually the fastest flow to stand up.',
  },
  abandonedCart: {
    flowName: 'Abandoned Cart',
    strength: 'Your Abandoned Cart Flow is recovering revenue from shoppers who didn’t check out.',
    weakness: 'No Abandoned Cart Flow is active — shoppers who add to cart and leave aren’t being followed up with.',
    actionTitle: 'Launch an Abandoned Cart Flow',
    rationale:
      'Typically the single highest-ROI automated flow. Shoppers who reach checkout are one reminder away from converting.',
  },
  browseAbandonment: {
    flowName: 'Browse Abandonment',
    strength: 'Your Browse Abandonment Flow is re-engaging visitors who viewed products without buying.',
    weakness: 'No Browse Abandonment Flow is active — product-page visitors who don’t add to cart are never re-engaged.',
    actionTitle: 'Launch a Browse Abandonment Flow',
    rationale: 'Catch interested shoppers before they forget your brand and buy from a competitor instead.',
  },
  sms: {
    strength: 'SMS is enabled, giving you a high-open-rate channel alongside email.',
    weakness: 'SMS marketing isn’t enabled yet — you’re relying on email alone for time-sensitive messages.',
    actionTitle: 'Enable SMS Marketing',
    rationale: 'SMS routinely sees open rates above 95% and is well suited to cart recovery and flash-sale alerts.',
  },
  segmentation: {
    strength: 'Your list is meaningfully segmented, which supports more relevant, higher-converting sends.',
    weakness: 'Segmentation is minimal — most sends are likely going to your full list regardless of behavior.',
    actionTitle: 'Build Out Customer Segments',
    rationale: 'Segmented campaigns consistently outperform batch-and-blast sends by matching message to customer intent.',
  },
  campaignFrequency: {
    strength: 'Your campaign cadence is healthy and consistent.',
    weakness: 'Campaign frequency is low, which limits how often you stay in front of your list.',
    actionTitle: 'Increase Campaign Cadence',
    rationale:
      'Stores sending fewer than 4 campaigns a month typically leave revenue on the table with no deliverability upside.',
  },
  vipFlow: {
    flowName: 'VIP',
    strength: 'A VIP Flow is rewarding your best customers and encouraging repeat purchases.',
    weakness: 'No VIP Flow is active — your highest-value customers aren’t being recognized or rewarded.',
    actionTitle: 'Launch a VIP Flow',
    rationale: 'Retaining a top customer is far cheaper than acquiring a new one — this flow protects your most valuable relationships.',
  },
  sunsetFlow: {
    flowName: 'Sunset',
    strength: 'A Sunset Flow is keeping your list clean and protecting deliverability.',
    weakness: 'No Sunset Flow is active — disengaged subscribers are likely still receiving full sends.',
    actionTitle: 'Launch a Sunset Flow',
    rationale: 'Removing chronically disengaged subscribers protects inbox placement for customers who do open your emails.',
  },
  birthdayFlow: {
    flowName: 'Birthday',
    strength: 'A Birthday Flow is adding a personal touchpoint that drives incremental purchases.',
    weakness: 'No Birthday Flow is active — an easy, high-affinity touchpoint is currently unused.',
    actionTitle: 'Launch a Birthday Flow',
    rationale: 'Low effort to set up and consistently well received — a reliable source of incremental revenue.',
  },
  revenueMaturity: {
    strength: 'Your program’s sophistication is keeping pace with your revenue scale.',
    weakness: 'Your program’s sophistication has room to grow to match your revenue scale.',
    actionTitle: 'Mature Your Program to Match Your Scale',
    rationale: 'As revenue grows, flows and segmentation typically need to grow with it to keep converting at the same rate.',
  },
}

const HEALTH_RATING_COPY = {
  Excellent: {
    tagline: 'Your Klaviyo program is firing on all cylinders.',
    summary:
      'Core flows, segmentation, and cadence are all in strong shape. Focus now shifts to refinement and testing rather than foundational gaps.',
  },
  Strong: {
    tagline: 'A solid foundation with a few clear gaps left to close.',
    summary:
      'Most of the fundamentals are in place. Closing the remaining gaps below should unlock incremental revenue without a major overhaul.',
  },
  'Needs Improvement': {
    tagline: 'The basics are partially in place, but meaningful revenue is being left on the table.',
    summary:
      'Several high-impact flows or program elements are missing. Prioritizing the gaps below should produce a noticeable lift.',
  },
  'Critical Opportunities': {
    tagline: 'Your email and SMS program has significant untapped potential.',
    summary:
      'Foundational flows and program elements are largely missing. The good news: even a few quick wins here should move the needle fast.',
  },
}

// Representative monthly revenue used to translate a bracket into a
// dollar estimate. Deliberately conservative (low end of each bracket).
const REVENUE_BRACKET_MONTHLY_ESTIMATE = {
  'Under $10k': 7000,
  '$10k – $50k': 28000,
  '$50k – $200k': 115000,
  '$200k – $1M': 550000,
  '$1M+': 1500000,
}

function gap(category) {
  return category.maxPoints - category.points
}

function priorityFromGap(pointsAtStake) {
  if (pointsAtStake >= 15) return 'High'
  if (pointsAtStake >= 10) return 'Medium'
  return 'Low'
}

export function getStrengths(categories) {
  return categories
    .filter((category) => category.maxPoints > 0 && category.points === category.maxPoints)
    .map((category) => ({
      id: category.id,
      title: category.label,
      description: CATEGORY_COPY[category.id]?.strength ?? '',
    }))
}

export function getWeaknesses(categories) {
  return categories
    .filter((category) => gap(category) > 0)
    .sort((a, b) => gap(b) - gap(a))
    .map((category) => ({
      id: category.id,
      title: category.label,
      description: CATEGORY_COPY[category.id]?.weakness ?? '',
      pointsAtStake: gap(category),
    }))
}

export function getMissedOpportunities(categories) {
  const gaps = categories.filter((category) => gap(category) > 0)
  const pointsLeftOnTable = gaps.reduce((total, category) => total + gap(category), 0)

  const items = gaps
    .sort((a, b) => gap(b) - gap(a))
    .map((category) => ({
      id: category.id,
      title: CATEGORY_COPY[category.id]?.actionTitle ?? category.label,
      pointsAtStake: gap(category),
    }))

  return { pointsLeftOnTable, items }
}

export function getRecommendedFlows(categories) {
  return categories
    .filter((category) => FLOW_CATEGORY_IDS.includes(category.id) && gap(category) > 0)
    .sort((a, b) => gap(b) - gap(a))
    .map((category) => {
      const copy = CATEGORY_COPY[category.id]
      const pointsAtStake = gap(category)
      return {
        id: category.id,
        flowName: copy.flowName,
        title: copy.actionTitle,
        description: copy.rationale,
        pointsAtStake,
        priority: priorityFromGap(pointsAtStake),
      }
    })
}

export function getPriorityTasks(categories, limit = 5) {
  return categories
    .filter((category) => gap(category) > 0)
    .sort((a, b) => gap(b) - gap(a))
    .slice(0, limit)
    .map((category) => {
      const copy = CATEGORY_COPY[category.id]
      const pointsAtStake = gap(category)
      return {
        id: category.id,
        title: copy?.actionTitle ?? category.label,
        description: copy?.rationale ?? '',
        category: category.label,
        pointsAtStake,
        priority: priorityFromGap(pointsAtStake),
      }
    })
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
  const { overallScore, classification, categories } = calculateAuditScore(formData)
  const priorityTasks = getPriorityTasks(categories)

  return {
    businessName: formData?.businessName?.trim() || 'Your Store',
    overallScore,
    classification,
    healthRating: HEALTH_RATING_COPY[classification],
    categories,
    strengths: getStrengths(categories),
    weaknesses: getWeaknesses(categories),
    missedOpportunities: getMissedOpportunities(categories),
    recommendedFlows: getRecommendedFlows(categories),
    priorityTasks,
    revenueOpportunity: estimateRevenueOpportunity(formData, overallScore),
    nextSteps: getNextSteps(priorityTasks),
  }
}

import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'
import { generateAuditReport } from '../../src/utils/auditReport.js'

const MODEL = 'claude-opus-4-8'

const ConsultantReportSchema = z.object({
  executiveSummary: z
    .string()
    .describe(
      'A 3-5 sentence personalized summary written in the voice of an experienced Klaviyo consultant. Must reference specific facts about this client (business name, platform, revenue bracket, list size, specific flows that are live or missing) — never generic marketing language.',
    ),
  recommendations: z
    .array(
      z.object({
        title: z
          .string()
          .describe('A short, specific action title, e.g. "Launch a 3-email Abandoned Cart sequence"'),
        rationale: z
          .string()
          .describe(
            '2-4 sentences of specific, consultant-grade reasoning grounded in this client\'s actual answers and numbers. No generic filler like "this can help improve revenue."',
          ),
        priority: z.enum(['High', 'Medium', 'Low']),
        expectedImpact: z
          .string()
          .describe(
            'A short, concrete phrase describing the expected outcome, framed the way an experienced consultant would state it — e.g. "Typically recovers 3-5% of gross revenue within 60 days."',
          ),
      }),
    )
    .min(4)
    .max(6),
})

const SYSTEM_PROMPT = `You are a senior Klaviyo consultant with over a decade of hands-on experience auditing email and SMS programs for Shopify, WooCommerce, and BigCommerce DTC brands. You have personally built hundreds of flows and reviewed hundreds of accounts like this one.

Write like a consultant delivering findings to a client, not like a generic marketing blog. Rules:
- Reference the client's actual numbers, platform, flows, and stated challenge — by name — in your summary and in every recommendation. Never write advice that could apply to any store.
- Do not use generic SaaS phrases like "unlock your growth potential," "take your marketing to the next level," or "leverage the power of email."
- Be direct and specific about what's missing and why it matters for THIS business's stage and revenue.
- If the client described a specific challenge in their own words, address it directly in at least one recommendation.
- Ground claims in realistic, well-known Klaviyo/email-marketing benchmarks rather than fabricated precise statistics.
- Prioritize recommendations by real revenue impact for a business of this size, not generic importance.`

function buildUserPrompt(formData, scoreReport) {
  const { overallScore, classification, categories } = scoreReport
  const activeFlows = Array.isArray(formData.activeFlows) ? formData.activeFlows : []

  const categoryLines = categories
    .map((category) => `- ${category.label}: ${category.points}/${category.maxPoints} points`)
    .join('\n')

  return `Client intake:
- Business name: ${formData.businessName || 'Unknown'}
- Website: ${formData.website || 'Not provided'}
- Industry: ${formData.industry || 'Not provided'}
- Platform: ${formData.platform || 'Not provided'}
- Monthly revenue: ${formData.monthlyRevenue || 'Not provided'}
- Average monthly orders: ${formData.avgMonthlyOrders || 'Not provided'}
- Email list size: ${formData.emailListSize || 'Not provided'}
- Current email platform: ${formData.currentEmailPlatform || 'Not provided'}
- Active flows: ${activeFlows.length > 0 ? activeFlows.join(', ') : 'None'}
- Campaigns sent per month: ${formData.campaignsPerMonth || 'Not provided'}
- SMS enabled: ${formData.smsEnabled || 'Not provided'}
- Number of customer segments: ${formData.customerSegments || 'Not provided'}
- Primary business goal: ${formData.primaryGoal || 'Not provided'}
- Biggest challenge, in their own words: ${formData.biggestChallenge || 'Not provided'}

Computed audit score: ${overallScore}/100 (${classification})
Category breakdown:
${categoryLines}

Write your consultant report now.`
}

let client

function getClient() {
  if (!client) {
    client = new Anthropic()
  }
  return client
}

/**
 * Calls Claude to generate a personalized, consultant-voiced report on top of
 * the deterministic score from scoringEngine.js / auditReport.js. Recomputes
 * the score server-side rather than trusting client-submitted numbers.
 */
export async function generateConsultantReport(formData) {
  const scoreReport = generateAuditReport(formData)

  const response = await getClient().messages.parse({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(formData, scoreReport) }],
    output_config: {
      format: zodOutputFormat(ConsultantReportSchema),
    },
  })

  if (response.stop_reason === 'refusal') {
    throw new Error('The model declined to generate a response for this request.')
  }

  if (!response.parsed_output) {
    throw new Error('The model response did not match the expected schema.')
  }

  return response.parsed_output
}

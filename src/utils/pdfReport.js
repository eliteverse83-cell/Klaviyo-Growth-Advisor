/**
 * Builds a branded, multi-page PDF version of the audit report using
 * jsPDF's vector text/shape primitives (no server round-trip, no
 * html2canvas rasterization — the PDF has real, selectable text).
 *
 * Branding is a placeholder engagement: "Deborah Akinola" as the
 * consultant name/tagline on the cover and footer, with a dashed-border
 * logo placeholder box standing in for a real brand mark.
 */
import { formatCurrency } from './formatCurrency.js'

const CONSULTANT_NAME = 'Deborah Akinola'
const CONSULTANT_TITLE = 'Klaviyo Growth Consultant'
const REPORT_TITLE = 'Growth Audit Report'

const COLOR = {
  brand600: [37, 99, 235],
  brand700: [29, 78, 216],
  brand800: [30, 64, 175],
  brand900: [30, 58, 138],
  brandTint: [239, 246, 255],
  ink900: [15, 23, 42],
  ink700: [51, 65, 85],
  ink600: [71, 85, 105],
  ink500: [100, 116, 139],
  ink400: [148, 163, 184],
  ink200: [226, 232, 240],
  ink100: [241, 245, 249],
  white: [255, 255, 255],
  emerald600: [5, 150, 105],
  emeraldTint: [236, 253, 245],
  red600: [220, 38, 38],
  redTint: [254, 242, 242],
  amber600: [217, 119, 6],
}

const PRIORITY_COLOR = { High: COLOR.red600, Medium: COLOR.amber600, Low: COLOR.ink500 }

const PAGE_WIDTH = 612 // US Letter, pt
const PAGE_HEIGHT = 792
const MARGIN = 54
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const FOOTER_Y = PAGE_HEIGHT - 34

function sanitizeFilename(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'store'
}

class ReportDoc {
  constructor(JsPdfCtor) {
    this.doc = new JsPdfCtor({ unit: 'pt', format: 'letter' })
    this.y = MARGIN
    this.sectionTitle = ''
  }

  color(rgb) {
    this.doc.setTextColor(...rgb)
    return this
  }

  fill(rgb) {
    this.doc.setFillColor(...rgb)
    return this
  }

  draw(rgb) {
    this.doc.setDrawColor(...rgb)
    return this
  }

  font(size, weight = 'normal') {
    this.doc.setFont('helvetica', weight)
    this.doc.setFontSize(size)
    return this
  }

  rect(...args) {
    this.doc.rect(...args)
    return this
  }

  circle(...args) {
    this.doc.circle(...args)
    return this
  }

  line(...args) {
    this.doc.line(...args)
    return this
  }

  addContentPage() {
    this.doc.addPage()
    this.y = MARGIN
    this.drawPageChrome()
  }

  /** Adds a page if `height` of content won't fit before the footer. */
  ensureSpace(height) {
    if (this.y + height > FOOTER_Y - 16) {
      this.addContentPage()
    }
  }

  drawPageChrome() {
    this.fill(COLOR.brand600).rect(0, 0, PAGE_WIDTH, 6, 'F')

    this.font(8, 'bold').color(COLOR.ink400)
    this.doc.text(this.sectionTitle.toUpperCase(), MARGIN, 28)
    this.font(8, 'normal').color(COLOR.ink400)
    this.doc.text(REPORT_TITLE, PAGE_WIDTH - MARGIN, 28, { align: 'right' })
    this.draw(COLOR.ink200).line(MARGIN, 36, PAGE_WIDTH - MARGIN, 36)
    this.y = 56
  }

  startSection(title) {
    this.sectionTitle = title
    this.drawPageChrome()
  }

  heading(text) {
    this.ensureSpace(28)
    this.font(18, 'bold').color(COLOR.ink900)
    this.doc.text(text, MARGIN, this.y)
    this.y += 12
    this.draw(COLOR.brand600)
    this.doc.setLineWidth(2)
    this.doc.line(MARGIN, this.y, MARGIN + 40, this.y)
    this.doc.setLineWidth(1)
    this.y += 22
  }

  subheading(text) {
    this.ensureSpace(20)
    this.font(11, 'bold').color(COLOR.ink900)
    this.doc.text(text, MARGIN, this.y)
    this.y += 16
  }

  paragraph(text, { size = 10.5, color = COLOR.ink700, gap = 16 } = {}) {
    this.font(size, 'normal').color(color)
    const lines = this.doc.splitTextToSize(text, CONTENT_WIDTH)
    this.ensureSpace(lines.length * (size + 3.5))
    this.doc.text(lines, MARGIN, this.y)
    this.y += lines.length * (size + 3.5) + gap
  }

  label(text, { color = COLOR.ink500 } = {}) {
    this.font(8, 'bold').color(color)
    this.doc.text(text.toUpperCase(), MARGIN, this.y)
    this.y += 13
  }

  spacer(height) {
    this.y += height
  }

  /** A tinted callout box with an optional title and body text. */
  callout(title, body, { fillColor = COLOR.brandTint, accent = COLOR.brand600 } = {}) {
    this.font(10, 'normal')
    const bodyLines = this.doc.splitTextToSize(body, CONTENT_WIDTH - 32)
    const titleHeight = title ? 16 : 0
    const boxHeight = titleHeight + bodyLines.length * 14 + 24
    this.ensureSpace(boxHeight + 12)

    this.fill(fillColor).rect(MARGIN, this.y, CONTENT_WIDTH, boxHeight, 'F')
    this.fill(accent).rect(MARGIN, this.y, 4, boxHeight, 'F')

    let cursorY = this.y + 20
    if (title) {
      this.font(10, 'bold').color(COLOR.ink900)
      this.doc.text(title, MARGIN + 16, cursorY)
      cursorY += 16
    }
    this.font(10, 'normal').color(COLOR.ink700)
    this.doc.text(bodyLines, MARGIN + 16, cursorY)

    this.y += boxHeight + 16
  }

  /** A row of equal-width stat tiles: [{ label, value, valueColor }]. */
  statRow(stats) {
    const gap = 14
    const tileWidth = (CONTENT_WIDTH - gap * (stats.length - 1)) / stats.length
    const tileHeight = 56
    this.ensureSpace(tileHeight + 16)

    stats.forEach((stat, index) => {
      const x = MARGIN + index * (tileWidth + gap)
      this.fill(COLOR.ink100).rect(x, this.y, tileWidth, tileHeight, 'F')
      this.font(7.5, 'bold').color(COLOR.ink500)
      this.doc.text(stat.label.toUpperCase(), x + 12, this.y + 18, { maxWidth: tileWidth - 24 })
      this.font(14, 'bold').color(stat.valueColor ?? COLOR.ink900)
      this.doc.text(String(stat.value), x + 12, this.y + 40, { maxWidth: tileWidth - 24 })
    })

    this.y += tileHeight + 20
  }

  /** A labeled horizontal progress bar, e.g. for dimension scores. */
  progressRow(label, points, maxPoints) {
    const rowHeight = 30
    this.ensureSpace(rowHeight)

    this.font(9.5, 'bold').color(COLOR.ink900)
    this.doc.text(label, MARGIN, this.y + 6)
    this.font(9, 'normal').color(COLOR.ink500)
    this.doc.text(`${points}/${maxPoints}`, PAGE_WIDTH - MARGIN, this.y + 6, { align: 'right' })

    const barY = this.y + 12
    const barWidth = CONTENT_WIDTH
    const ratio = maxPoints > 0 ? Math.min(1, points / maxPoints) : 0
    this.fill(COLOR.ink200).rect(MARGIN, barY, barWidth, 6, 'F')
    if (ratio > 0) {
      this.fill(ratio >= 0.8 ? COLOR.emerald600 : COLOR.brand600).rect(MARGIN, barY, barWidth * ratio, 6, 'F')
    }

    this.y += rowHeight
  }

  bulletList(items, { color = COLOR.ink700 } = {}) {
    this.font(9.5, 'normal').color(color)
    items.forEach((item) => {
      const lines = this.doc.splitTextToSize(item, CONTENT_WIDTH - 16)
      this.ensureSpace(lines.length * 13 + 4)
      this.fill(COLOR.brand600).circle(MARGIN + 3, this.y - 3, 1.6, 'F')
      this.doc.text(lines, MARGIN + 14, this.y)
      this.y += lines.length * 13 + 4
    })
    this.y += 8
  }

  priorityBadge(priority) {
    if (!priority) return
    const pColor = PRIORITY_COLOR[priority] ?? COLOR.ink500
    const text = `${priority.toUpperCase()} PRIORITY`
    this.font(7.5, 'bold')
    const textWidth = this.doc.getTextWidth(text)
    const badgeWidth = textWidth + 14
    const badgeX = PAGE_WIDTH - MARGIN - badgeWidth
    this.fill([...pColor]).rect(badgeX, this.y - 10, badgeWidth, 14, 'F')
    this.color(COLOR.white)
    this.doc.text(text, badgeX + 7, this.y)
  }

  /** A bordered card for a single recommendation, with optional impact/steps. */
  recommendationCard({ title, priority, description, impact, steps }) {
    this.font(11, 'bold')
    const titleLines = this.doc.splitTextToSize(title, CONTENT_WIDTH - 110)
    this.font(9.5, 'normal')
    const descLines = description ? this.doc.splitTextToSize(description, CONTENT_WIDTH - 32) : []
    const stepLines = (steps ?? []).flatMap((step, index) =>
      this.doc.splitTextToSize(`${index + 1}. ${step}`, CONTENT_WIDTH - 32),
    )

    let cardHeight = 20 + titleLines.length * 14 + 6
    if (descLines.length) cardHeight += descLines.length * 13 + 8
    if (impact) cardHeight += 16
    if (stepLines.length) cardHeight += 14 + stepLines.length * 13

    this.ensureSpace(cardHeight + 14)
    const cardTop = this.y
    this.draw(COLOR.ink200).rect(MARGIN, cardTop, CONTENT_WIDTH, cardHeight)

    this.y += 20
    this.font(11, 'bold').color(COLOR.ink900)
    this.doc.text(titleLines, MARGIN + 16, this.y)
    if (priority) this.priorityBadge(priority)
    this.y += titleLines.length * 14 + 6

    if (descLines.length) {
      this.font(9.5, 'normal').color(COLOR.ink600)
      this.doc.text(descLines, MARGIN + 16, this.y)
      this.y += descLines.length * 13 + 8
    }

    if (impact) {
      this.font(9.5, 'bold').color(COLOR.emerald600)
      this.doc.text(impact, MARGIN + 16, this.y)
      this.y += 16
    }

    if (stepLines.length) {
      this.font(8, 'bold').color(COLOR.ink500)
      this.doc.text('HOW TO IMPLEMENT', MARGIN + 16, this.y)
      this.y += 13
      this.font(9, 'normal').color(COLOR.ink700)
      this.doc.text(stepLines, MARGIN + 16, this.y)
      this.y += stepLines.length * 13
    }

    this.y = cardTop + cardHeight + 14
  }

  finalizeFooters() {
    const pageCount = this.doc.getNumberOfPages()
    for (let i = 2; i <= pageCount; i += 1) {
      this.doc.setPage(i)
      this.draw(COLOR.ink200).line(MARGIN, FOOTER_Y - 10, PAGE_WIDTH - MARGIN, FOOTER_Y - 10)
      this.font(8, 'normal').color(COLOR.ink400)
      this.doc.text(`Prepared by ${CONSULTANT_NAME} · GrowthPilot AI`, MARGIN, FOOTER_Y)
      this.doc.text(`Page ${i - 1} of ${pageCount - 1}`, PAGE_WIDTH - MARGIN, FOOTER_Y, { align: 'right' })
    }
  }
}

function drawCoverPage(rd, report) {
  const { doc } = rd
  const bandHeight = 260

  rd.fill(COLOR.brand900).rect(0, 0, PAGE_WIDTH, bandHeight, 'F')
  rd.fill(COLOR.brand700).rect(0, 0, PAGE_WIDTH, 6, 'F')

  // Logo placeholder: dashed box standing in for a real brand mark.
  doc.setDrawColor(255, 255, 255)
  doc.setLineDashPattern([3, 2], 0)
  doc.setLineWidth(1.2)
  doc.rect(MARGIN, 44, 56, 56)
  doc.setLineDashPattern([], 0)
  rd.font(9, 'bold').color(COLOR.white)
  doc.text('LOGO', MARGIN + 28, 76, { align: 'center' })

  rd.font(15, 'bold').color(COLOR.white)
  doc.text(CONSULTANT_NAME, MARGIN + 72, 66)
  rd.font(10, 'normal').color([191, 219, 254])
  doc.text(CONSULTANT_TITLE, MARGIN + 72, 82)

  rd.font(26, 'bold').color(COLOR.white)
  doc.text(REPORT_TITLE, MARGIN, 168)
  rd.font(11, 'normal').color([191, 219, 254])
  doc.text('A full-funnel email & SMS revenue audit', MARGIN, 190)

  rd.font(9, 'bold').color([191, 219, 254])
  doc.text('PREPARED FOR', MARGIN, 226)
  rd.font(15, 'bold').color(COLOR.white)
  doc.text(report.businessName, MARGIN, 246)

  // Body of the cover page.
  let y = bandHeight + 56
  rd.font(9, 'bold').color(COLOR.ink500)
  doc.text('REPORT DATE', MARGIN, y)
  rd.font(11, 'normal').color(COLOR.ink900)
  doc.text(
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    MARGIN,
    y + 18,
  )

  y += 56
  const scoreBoxWidth = 160
  rd.fill(COLOR.ink100).rect(MARGIN, y, scoreBoxWidth, 100, 'F')
  rd.font(9, 'bold').color(COLOR.ink500)
  doc.text('OVERALL SCORE', MARGIN + 16, y + 24)
  rd.font(30, 'bold').color(COLOR.brand700)
  const scoreText = String(report.overallScore)
  doc.text(scoreText, MARGIN + 16, y + 58)
  const scoreTextWidth = doc.getTextWidth(scoreText)
  rd.font(10, 'normal').color(COLOR.ink500)
  doc.text('/ 100', MARGIN + 16 + scoreTextWidth + 6, y + 58)
  rd.font(9.5, 'bold').color(COLOR.ink700)
  doc.text(`Level ${report.maturityLevel.level} · ${report.maturityLevel.label}`, MARGIN + 16, y + 80)

  const noteX = MARGIN + scoreBoxWidth + 24
  rd.font(10, 'normal').color(COLOR.ink600)
  const taglineLines = doc.splitTextToSize(report.maturityLevel.tagline, CONTENT_WIDTH - scoreBoxWidth - 24)
  doc.text(taglineLines, noteX, y + 24)

  y = PAGE_HEIGHT - 80
  rd.draw(COLOR.ink200).line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
  rd.font(8.5, 'normal').color(COLOR.ink400)
  doc.text(
    `This report is confidential and prepared exclusively for ${report.businessName}.`,
    MARGIN,
    y + 18,
  )
}

function addExecutiveSummarySection(rd, report, summaryText) {
  rd.startSection('Executive Summary')
  rd.heading('Executive Summary')
  rd.paragraph(summaryText)

  rd.subheading('Strengths')
  if (report.strengths.length > 0) {
    rd.bulletList(report.strengths.map((s) => `${s.title} — ${s.description}`))
  } else {
    rd.paragraph('No dimensions are yet fully maxed out — see Weaknesses below.', { gap: 8 })
  }

  rd.subheading('Weaknesses')
  if (report.weaknesses.length > 0) {
    rd.bulletList(report.weaknesses.map((w) => `${w.title} — ${w.description}`))
  } else {
    rd.paragraph('None — every scored dimension is fully optimized.', { gap: 8 })
  }
}

function addAuditScoreSection(rd, report) {
  rd.startSection('Audit Score')
  rd.heading('Audit Score')

  rd.statRow([
    { label: 'Overall Score', value: `${report.overallScore}/100`, valueColor: COLOR.brand700 },
    { label: 'Maturity Level', value: `${report.maturityLevel.level} of 5` },
    { label: 'Classification', value: report.maturityLevel.label },
  ])

  rd.paragraph(report.maturityLevel.summary)

  rd.subheading('Score Breakdown by Dimension')
  report.dimensions.forEach((dimension) => {
    rd.progressRow(dimension.label, dimension.points, dimension.maxPoints)
  })
}

function addRevenueOpportunitiesSection(rd, report) {
  rd.startSection('Revenue Opportunities')
  rd.heading('Revenue Opportunities')

  const leak = report.biggestRevenueLeak
  if (leak) {
    rd.label('Biggest Revenue Leak', { color: COLOR.red600 })
    const impactText =
      leak.estimatedMonthlyImpact != null
        ? `Estimated impact: +${formatCurrency(leak.estimatedMonthlyImpact)}/month`
        : ''
    rd.callout(leak.title, [leak.description, impactText].filter(Boolean).join('  '), {
      fillColor: COLOR.redTint,
      accent: COLOR.red600,
    })
  } else {
    rd.paragraph('No major revenue leaks detected — every dimension measured is fully optimized.')
  }

  const growth = report.revenueGrowth
  if (growth) {
    rd.subheading('Expected Revenue Growth')
    rd.statRow([
      { label: 'Current', value: formatCurrency(growth.current) },
      { label: 'Potential', value: formatCurrency(growth.potential) },
      { label: 'Difference', value: `+${formatCurrency(growth.difference)}`, valueColor: COLOR.emerald600 },
    ])
    rd.paragraph(
      `Directional estimate based on typical email/SMS revenue benchmarks for stores of this size and the gaps identified in this report. Annualized range: ${formatCurrency(growth.annualLow)} – ${formatCurrency(growth.annualHigh)}.`,
      { size: 9, color: COLOR.ink500, gap: 4 },
    )
  }
}

function addRecommendationsSection(rd, report, aiRecommendations) {
  rd.startSection('Recommendations')
  rd.heading('Recommendations')

  if (aiRecommendations?.length) {
    rd.paragraph('Personalized by AI, grounded in this store’s actual audit answers.', {
      size: 9,
      color: COLOR.ink500,
      gap: 12,
    })
    aiRecommendations.forEach((rec) => {
      rd.recommendationCard({
        title: rec.title,
        priority: rec.priority,
        description: rec.rationale,
        impact: rec.expectedImpact,
        steps: rec.implementationSteps,
      })
    })
  } else {
    report.immediateWins.forEach((win) => {
      rd.recommendationCard({
        title: win.title,
        priority: win.priority,
        description: win.description,
        impact: `+${win.pointsAtStake} pts opportunity`,
      })
    })
  }

  if (report.recommendedFlows.length > 0) {
    rd.subheading('Recommended Flows')
    report.recommendedFlows.forEach((flow) => {
      rd.recommendationCard({
        title: flow.title,
        priority: flow.priority,
        description: flow.description,
        impact: `+${flow.pointsAtStake} pts opportunity`,
      })
    })
  }
}

function addGrowthPlanSection(rd, report) {
  rd.startSection('90-Day Action Plan')
  rd.heading('90-Day Action Plan')

  if (report.growthPlan.length === 0) {
    rd.paragraph('No outstanding priorities — maintain the current program and revisit quarterly.')
    return
  }

  report.growthPlan.forEach((step, index) => {
    rd.font(9, 'bold')
    const phaseWidth = 70
    const titleLines = rd.doc.splitTextToSize(step.title, CONTENT_WIDTH - phaseWidth - 16)
    rd.font(9, 'normal')
    const descLines = rd.doc.splitTextToSize(step.description, CONTENT_WIDTH - phaseWidth - 16)
    const blockHeight = Math.max(titleLines.length * 13, 13) + descLines.length * 12 + 22
    rd.ensureSpace(blockHeight)

    rd.fill(COLOR.brand600).circle(MARGIN + 5, rd.y - 4, 5, 'F')
    rd.font(9, 'bold').color(COLOR.brand700)
    rd.doc.text(String(index + 1), MARGIN + 5, rd.y - 1, { align: 'center' })

    rd.font(8, 'bold').color(COLOR.brand600)
    rd.doc.text(step.phase.toUpperCase(), MARGIN + phaseWidth - 60, rd.y - 4)

    rd.font(10.5, 'bold').color(COLOR.ink900)
    rd.doc.text(titleLines, MARGIN + phaseWidth, rd.y)
    rd.y += titleLines.length * 13 + 4

    rd.font(9, 'normal').color(COLOR.ink600)
    rd.doc.text(descLines, MARGIN + phaseWidth, rd.y)
    rd.y += descLines.length * 12 + 18

    if (index < report.growthPlan.length - 1) {
      rd.draw(COLOR.ink100).line(MARGIN, rd.y - 8, PAGE_WIDTH - MARGIN, rd.y - 8)
    }
  })
}

/**
 * Builds the full jsPDF document for a completed audit. jsPDF is loaded
 * lazily so its ~700KB doesn't sit in the app's initial JS bundle for
 * users who never export a PDF.
 * @param {object} report - output of generateAuditReport()
 * @param {{ executiveSummary?: string, recommendations?: Array }} [aiData]
 */
export async function buildAuditPdf(report, aiData) {
  const { default: JsPdfCtor } = await import('jspdf')
  const rd = new ReportDoc(JsPdfCtor)

  drawCoverPage(rd, report)
  rd.addContentPage()

  addExecutiveSummarySection(rd, report, aiData?.executiveSummary || report.executiveSummary)
  rd.addContentPage()

  addAuditScoreSection(rd, report)
  rd.addContentPage()

  addRevenueOpportunitiesSection(rd, report)
  rd.addContentPage()

  addRecommendationsSection(rd, report, aiData?.recommendations)
  rd.addContentPage()

  addGrowthPlanSection(rd, report)

  rd.finalizeFooters()

  return rd.doc
}

export async function downloadAuditPdf(report, aiData) {
  const doc = await buildAuditPdf(report, aiData)
  doc.save(`${sanitizeFilename(report.businessName)}-growth-audit-report.pdf`)
}

import { formatCurrency } from './formatCurrency.js'

const NOT_FOUND = 'Column not found'

function findHeader(headers, candidates) {
  const normalized = headers.map((h) => h.toLowerCase().trim())
  for (const candidate of candidates) {
    const idx = normalized.indexOf(candidate.toLowerCase())
    if (idx !== -1) return headers[idx]
  }
  return null
}

function parseNumber(value) {
  if (value == null) return NaN
  const cleaned = String(value).replace(/[$,%]/g, '').trim()
  if (cleaned === '') return NaN
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : NaN
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function emptySummary() {
  return { rowCount: 0, stats: [] }
}

export function summarizeShopifyOrders(rows) {
  if (rows.length === 0) return emptySummary()
  const headers = Object.keys(rows[0])
  const nameCol = findHeader(headers, ['Name', 'Order', 'Order Number', 'Order Name'])
  const totalCol = findHeader(headers, ['Total', 'Order Total', 'Total Price'])
  const emailCol = findHeader(headers, ['Email'])
  const createdCol = findHeader(headers, ['Created at', 'Date'])

  const orderTotals = new Map()
  const emails = new Set()
  const dates = []

  for (const row of rows) {
    const orderKey = nameCol ? row[nameCol] : null
    if (orderKey && !orderTotals.has(orderKey)) {
      const total = totalCol ? parseNumber(row[totalCol]) : NaN
      orderTotals.set(orderKey, Number.isFinite(total) ? total : 0)
    }
    if (emailCol && row[emailCol]) emails.add(row[emailCol].toLowerCase())
    if (createdCol && row[createdCol]) {
      const d = new Date(row[createdCol])
      if (!Number.isNaN(d.getTime())) dates.push(d)
    }
  }

  const orderCount = nameCol ? orderTotals.size : rows.length
  const totalRevenue = totalCol
    ? [...orderTotals.values()].reduce((sum, v) => sum + v, 0)
    : null

  const stats = [
    { label: 'Orders', value: orderCount.toLocaleString() },
    { label: 'Total Revenue', value: totalRevenue != null ? formatCurrency(totalRevenue) : NOT_FOUND },
    {
      label: 'Avg. Order Value',
      value: totalRevenue != null && orderCount > 0 ? formatCurrency(totalRevenue / orderCount) : NOT_FOUND,
    },
    { label: 'Unique Customers', value: emailCol ? emails.size.toLocaleString() : NOT_FOUND },
  ]

  if (dates.length > 0) {
    dates.sort((a, b) => a - b)
    stats.push({
      label: 'Date Range',
      value: `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`,
    })
  }

  return { rowCount: rows.length, stats }
}

export function summarizeShopifyCustomers(rows) {
  if (rows.length === 0) return emptySummary()
  const headers = Object.keys(rows[0])
  const spentCol = findHeader(headers, ['Total Spent', 'Total Spend'])
  const marketingCol = findHeader(headers, ['Accepts Marketing'])
  const ordersCol = findHeader(headers, ['Total Orders'])

  const customerCount = rows.length
  let totalSpend = 0
  let marketingYes = 0
  let repeatCustomers = 0

  for (const row of rows) {
    if (spentCol) {
      const v = parseNumber(row[spentCol])
      if (Number.isFinite(v)) totalSpend += v
    }
    if (marketingCol && String(row[marketingCol]).trim().toLowerCase() === 'yes') {
      marketingYes += 1
    }
    if (ordersCol) {
      const v = parseNumber(row[ordersCol])
      if (Number.isFinite(v) && v > 1) repeatCustomers += 1
    }
  }

  const stats = [
    { label: 'Customers', value: customerCount.toLocaleString() },
    { label: 'Total Spend', value: spentCol ? formatCurrency(totalSpend) : NOT_FOUND },
    {
      label: 'Avg. Lifetime Value',
      value: spentCol ? formatCurrency(totalSpend / customerCount) : NOT_FOUND,
    },
    {
      label: 'Accepts Marketing',
      value: marketingCol ? `${Math.round((marketingYes / customerCount) * 100)}%` : NOT_FOUND,
    },
    {
      label: 'Repeat Customers',
      value: ordersCol ? `${Math.round((repeatCustomers / customerCount) * 100)}%` : NOT_FOUND,
    },
  ]

  return { rowCount: rows.length, stats }
}

export function summarizeKlaviyoCampaigns(rows) {
  if (rows.length === 0) return emptySummary()
  const headers = Object.keys(rows[0])
  const recipientsCol = findHeader(headers, ['Total Recipients', 'Recipients'])
  const openRateCol = findHeader(headers, ['Open Rate', 'Unique Open Rate'])
  const clickRateCol = findHeader(headers, ['Click Rate', 'Unique Click Rate'])
  const revenueCol = findHeader(headers, ['Revenue', 'Campaign Revenue', 'Attributed Revenue'])

  const sumColumn = (col) => {
    if (!col) return null
    const values = rows.map((r) => parseNumber(r[col])).filter(Number.isFinite)
    return values.reduce((sum, v) => sum + v, 0)
  }

  const avgRate = (col) => {
    if (!col) return null
    const values = rows.map((r) => parseNumber(r[col])).filter(Number.isFinite)
    if (values.length === 0) return null
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length
    // Klaviyo exports rates either as 0-1 fractions or 0-100 percentages.
    return mean <= 1 ? mean * 100 : mean
  }

  const totalRecipients = sumColumn(recipientsCol)
  const totalRevenue = sumColumn(revenueCol)
  const avgOpenRate = avgRate(openRateCol)
  const avgClickRate = avgRate(clickRateCol)

  const stats = [
    { label: 'Campaigns', value: rows.length.toLocaleString() },
    {
      label: 'Total Recipients',
      value: totalRecipients != null ? Math.round(totalRecipients).toLocaleString() : NOT_FOUND,
    },
    { label: 'Avg. Open Rate', value: avgOpenRate != null ? `${avgOpenRate.toFixed(1)}%` : NOT_FOUND },
    { label: 'Avg. Click Rate', value: avgClickRate != null ? `${avgClickRate.toFixed(1)}%` : NOT_FOUND },
    { label: 'Total Revenue', value: totalRevenue != null ? formatCurrency(totalRevenue) : NOT_FOUND },
  ]

  return { rowCount: rows.length, stats }
}

export function summarizeKlaviyoProfiles(rows) {
  if (rows.length === 0) return emptySummary()
  const headers = Object.keys(rows[0])
  const emailCol = findHeader(headers, ['Email'])
  const emailSubCol = findHeader(headers, [
    'Email Marketing Consent',
    'Email Subscription Status',
    'Klaviyo: Email Subscription Status',
  ])
  const smsSubCol = findHeader(headers, [
    'SMS Marketing Consent',
    'SMS Subscription Status',
    'Klaviyo: SMS Subscription Status',
  ])

  const profileCount = rows.length
  const uniqueEmails = new Set()
  let emailSubscribed = 0
  let smsSubscribed = 0

  const isSubscribed = (value) => {
    const v = String(value).trim().toUpperCase()
    return v === 'SUBSCRIBED' || v === 'YES' || v === 'TRUE'
  }

  for (const row of rows) {
    if (emailCol && row[emailCol]) uniqueEmails.add(row[emailCol].toLowerCase())
    if (emailSubCol && isSubscribed(row[emailSubCol])) emailSubscribed += 1
    if (smsSubCol && isSubscribed(row[smsSubCol])) smsSubscribed += 1
  }

  const stats = [
    { label: 'Profiles', value: profileCount.toLocaleString() },
    { label: 'Unique Emails', value: emailCol ? uniqueEmails.size.toLocaleString() : NOT_FOUND },
    {
      label: 'Email Subscribed',
      value: emailSubCol ? `${Math.round((emailSubscribed / profileCount) * 100)}%` : NOT_FOUND,
    },
    {
      label: 'SMS Subscribed',
      value: smsSubCol ? `${Math.round((smsSubscribed / profileCount) * 100)}%` : NOT_FOUND,
    },
  ]

  return { rowCount: rows.length, stats }
}

const SUMMARY_BUILDERS = {
  shopifyOrders: summarizeShopifyOrders,
  shopifyCustomers: summarizeShopifyCustomers,
  klaviyoCampaigns: summarizeKlaviyoCampaigns,
  klaviyoProfiles: summarizeKlaviyoProfiles,
}

export function buildCsvSummary(fileTypeId, rows) {
  const builder = SUMMARY_BUILDERS[fileTypeId]
  return builder ? builder(rows) : emptySummary()
}

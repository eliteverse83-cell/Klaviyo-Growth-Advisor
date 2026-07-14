/**
 * Static placeholder data for the Results page. There is no audit engine
 * yet — this file exists purely so the UI has something realistic to
 * render until scoring logic is built.
 */
export const MOCK_OVERALL_SCORE = {
  score: 68,
  label: 'Good, with room to grow',
  summary:
    'Your store has a solid foundation, but there are clear gaps in retention and flow coverage that are likely costing you revenue every month.',
}

export const MOCK_CATEGORY_SCORES = [
  { id: 'email-flows', label: 'Email Flows', score: 54 },
  { id: 'list-growth', label: 'List Growth', score: 71 },
  { id: 'retention', label: 'Retention', score: 48 },
  { id: 'campaign-performance', label: 'Campaign Performance', score: 82 },
]

export const MOCK_RECOMMENDATIONS = [
  {
    id: 1,
    priority: 'High',
    category: 'Email Flows',
    title: 'Launch a Post-Purchase Flow',
    description:
      'You don’t currently have a post-purchase flow live. Adding one typically recovers 3–5% in repeat purchase revenue within the first 60 days.',
    impact: 'High revenue impact',
  },
  {
    id: 2,
    priority: 'High',
    category: 'Retention',
    title: 'Add a Win-Back Series for Lapsed Customers',
    description:
      'Roughly a third of your list hasn’t purchased in 90+ days. A targeted win-back series can re-engage a meaningful share of this segment.',
    impact: 'High revenue impact',
  },
  {
    id: 3,
    priority: 'Medium',
    category: 'Email Flows',
    title: 'Extend Your Abandoned Cart Flow',
    description:
      'Your abandoned cart flow stops after a single email. Extending it to 3 emails over 5 days is a common driver of incremental recovery.',
    impact: 'Medium revenue impact',
  },
  {
    id: 4,
    priority: 'Medium',
    category: 'List Growth',
    title: 'Test an Exit-Intent Signup Offer',
    description:
      'Your on-site signup rate is below the industry benchmark for your category. An exit-intent popup with a first-order incentive can help.',
    impact: 'Medium revenue impact',
  },
  {
    id: 5,
    priority: 'Low',
    category: 'Campaign Performance',
    title: 'Tighten Up Subject Line Testing',
    description:
      'Campaign open rates are healthy, but few campaigns show evidence of A/B testing. Systematic subject line tests can compound over time.',
    impact: 'Low revenue impact',
  },
]

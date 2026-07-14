/**
 * Declarative definition of the manual audit's steps and fields.
 * AuditForm renders this data — no audit/scoring logic lives here yet.
 * `span: 'full'` makes a field take the full grid width; anything else
 * takes half width on the two-column layout.
 */
export const AUDIT_STEPS = [
  {
    id: 'business',
    icon: 'Building2',
    label: 'Business Info',
    description: 'Tell us about your business and where it sells.',
    fields: [
      {
        name: 'businessName',
        label: 'Business name',
        type: 'text',
        placeholder: 'e.g. Aurora Skincare Co.',
        required: true,
      },
      {
        name: 'website',
        label: 'Website',
        type: 'url',
        placeholder: 'https://yourstore.com',
        required: true,
      },
      {
        name: 'industry',
        label: 'Industry',
        type: 'select',
        required: true,
        options: [
          'Beauty & Skincare',
          'Apparel & Fashion',
          'Home & Furniture',
          'Food & Beverage',
          'Health & Wellness',
          'Electronics',
          'Jewelry & Accessories',
          'Pet Products',
          'Sports & Outdoors',
          'Subscription Box',
          'Other',
        ],
      },
      {
        name: 'platform',
        label: 'Platform',
        type: 'radio',
        required: true,
        span: 'full',
        options: ['Shopify', 'WooCommerce', 'BigCommerce', 'Other'],
      },
      {
        name: 'monthlyRevenue',
        label: 'Monthly revenue',
        type: 'select',
        options: [
          'Under $10k',
          '$10k – $50k',
          '$50k – $200k',
          '$200k – $1M',
          '$1M+',
        ],
      },
      {
        name: 'avgMonthlyOrders',
        label: 'Average monthly orders',
        type: 'number',
        placeholder: 'e.g. 850',
      },
    ],
  },
  {
    id: 'engagement',
    icon: 'MailCheck',
    label: 'Email & SMS',
    description: 'Help us understand your current email and SMS program.',
    fields: [
      {
        name: 'emailListSize',
        label: 'Email list size',
        type: 'number',
        placeholder: 'e.g. 12000',
      },
      {
        name: 'currentEmailPlatform',
        label: 'Current email platform',
        type: 'select',
        options: [
          'Klaviyo',
          'Mailchimp',
          'Omnisend',
          'ActiveCampaign',
          'Sendlane',
          'Attentive',
          'Other',
        ],
      },
      {
        name: 'activeFlows',
        label: 'Flows currently active',
        type: 'checkbox-group',
        span: 'full',
        options: [
          'Welcome',
          'Abandoned Cart',
          'Browse Abandonment',
          'Post Purchase',
          'Win Back',
          'Sunset',
          'Birthday',
          'VIP',
        ],
      },
      {
        name: 'campaignsPerMonth',
        label: 'Campaigns sent per month',
        type: 'number',
        placeholder: 'e.g. 8',
      },
      {
        name: 'smsEnabled',
        label: 'SMS enabled?',
        type: 'radio',
        options: ['Yes', 'No'],
      },
      {
        name: 'customerSegments',
        label: 'Number of customer segments',
        type: 'number',
        placeholder: 'e.g. 6',
      },
    ],
  },
  {
    id: 'goals',
    icon: 'Target',
    label: 'Goals',
    description: 'What are you hoping to get out of this audit?',
    fields: [
      {
        name: 'primaryGoal',
        label: 'Primary business goal',
        type: 'select',
        span: 'full',
        options: [
          'Increase email revenue',
          'Grow subscriber list',
          'Improve customer retention',
          'Boost average order value',
          'Reduce cart abandonment',
          'Launch or improve SMS',
        ],
      },
      {
        name: 'biggestChallenge',
        label: 'Biggest challenge',
        type: 'textarea',
        span: 'full',
        placeholder: 'Tell us what’s holding back growth...',
      },
    ],
  },
]

export const AUDIT_FORM_INITIAL_STATE = AUDIT_STEPS.reduce((state, step) => {
  step.fields.forEach((field) => {
    state[field.name] = field.type === 'checkbox-group' ? [] : ''
  })
  return state
}, {})

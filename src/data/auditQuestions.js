/**
 * Declarative definition of the manual audit's steps and fields.
 * AuditForm renders this data — no audit/scoring logic lives here yet.
 */
export const AUDIT_STEPS = [
  {
    id: 'store',
    label: 'Store Basics',
    description: 'Tell us a bit about your store.',
    fields: [
      {
        name: 'storeName',
        label: 'Store name',
        type: 'text',
        placeholder: 'e.g. Aurora Skincare Co.',
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
          'Other',
        ],
      },
      {
        name: 'monthlyRevenue',
        label: 'Average monthly revenue',
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
        name: 'monthlyVisitors',
        label: 'Average monthly website visitors',
        type: 'number',
        placeholder: 'e.g. 25000',
      },
    ],
  },
  {
    id: 'email',
    label: 'Email Program',
    description: 'Help us understand your current email marketing setup.',
    fields: [
      {
        name: 'usesKlaviyo',
        label: 'Do you currently use Klaviyo?',
        type: 'radio',
        options: ['Yes', 'No'],
      },
      {
        name: 'listSize',
        label: 'Email list size',
        type: 'number',
        placeholder: 'e.g. 12000',
      },
      {
        name: 'avgOpenRate',
        label: 'Average open rate (%)',
        type: 'number',
        placeholder: 'e.g. 32',
      },
      {
        name: 'avgClickRate',
        label: 'Average click rate (%)',
        type: 'number',
        placeholder: 'e.g. 4',
      },
      {
        name: 'activeFlows',
        label: 'Which automated flows are currently live?',
        type: 'checkbox-group',
        options: [
          'Welcome Series',
          'Abandoned Cart',
          'Post-Purchase',
          'Win-Back',
          'Browse Abandonment',
        ],
      },
    ],
  },
  {
    id: 'goals',
    label: 'Goals',
    description: 'What are you hoping to get out of this audit?',
    fields: [
      {
        name: 'primaryGoal',
        label: 'Primary growth goal',
        type: 'select',
        options: [
          'Increase email revenue',
          'Grow subscriber list',
          'Improve customer retention',
          'Boost average order value',
          'Reduce cart abandonment',
        ],
      },
      {
        name: 'biggestChallenge',
        label: 'What’s your biggest challenge right now?',
        type: 'textarea',
        placeholder: 'Tell us what’s holding back growth...',
      },
      {
        name: 'email',
        label: 'Email address',
        type: 'email',
        placeholder: 'you@store.com',
        required: true,
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

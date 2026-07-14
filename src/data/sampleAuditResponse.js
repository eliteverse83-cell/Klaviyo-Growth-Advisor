/**
 * Example manual audit response, in the same shape as AuditForm's state.
 * Used as a fallback so /results has something realistic to render when
 * it's opened without an audit submission (e.g. a direct link or refresh).
 */
export const SAMPLE_AUDIT_RESPONSE = {
  businessName: 'Aurora Skincare Co.',
  website: 'https://aurora-skincare.com',
  industry: 'Beauty & Skincare',
  platform: 'Shopify',
  monthlyRevenue: '$50k – $200k',
  avgMonthlyOrders: '850',
  emailListSize: '18400',
  currentEmailPlatform: 'Klaviyo',
  activeFlows: ['Welcome', 'Abandoned Cart', 'VIP'],
  campaignsPerMonth: '5',
  smsEnabled: 'Yes',
  customerSegments: '4',
  primaryGoal: 'Increase email revenue',
  biggestChallenge: 'Low repeat purchase rate and no win-back or sunset flow in place.',
}

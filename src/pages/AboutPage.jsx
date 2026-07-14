import { Target, Users, Sparkles } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'

const VALUES = [
  {
    icon: Target,
    title: 'Focused on revenue',
    description:
      'Every recommendation we surface is tied to a concrete revenue or retention outcome — no vanity metrics.',
  },
  {
    icon: Sparkles,
    title: 'AI-assisted, human-readable',
    description:
      'We use AI to analyze patterns across your store and email data, then translate them into plain-language guidance.',
  },
  {
    icon: Users,
    title: 'Built for operators',
    description:
      'GrowthPilot AI is built with the day-to-day realities of running a Shopify + Klaviyo business in mind.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-hero-gradient py-20 sm:py-28">
        <Container className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
            About <span className="text-gradient">GrowthPilot AI</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-ink-500">
            We built GrowthPilot AI because too many great Shopify and
            Klaviyo store owners are leaving revenue on the table simply
            because they don’t know where to look. Our audits turn scattered
            store and email data into a clear, prioritized action plan.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5.5 w-5.5" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-ink-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-2xl rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <h2 className="text-2xl font-bold text-ink-900">
              Currently in early access
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-500">
              GrowthPilot AI is in active development. Today, you can run a
              manual audit. CSV upload and direct Shopify + Klaviyo
              connections are coming in future releases.
            </p>
            <div className="mt-6">
              <Button to="/audit" variant="primary" size="md">
                Try the Manual Audit
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

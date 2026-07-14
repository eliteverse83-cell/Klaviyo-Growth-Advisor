import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'

const TRUST_POINTS = [
  { icon: Zap, label: 'Results in minutes' },
  { icon: ShieldCheck, label: 'No store access required' },
  { icon: Sparkles, label: 'AI-generated recommendations' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Growth Audits
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            Find the revenue hiding in your{' '}
            <span className="text-gradient">Shopify &amp; Klaviyo</span> data
          </h1>

          <p className="mt-6 text-lg leading-8 text-ink-500 sm:text-xl">
            GrowthPilot AI audits your store and email program, then hands
            you a prioritized list of revenue opportunities — no
            integrations required to get started.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button to="/audit" variant="primary" size="lg">
              Start Free Audit
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button to="/about" variant="secondary" size="lg">
              Learn How It Works
            </Button>
          </div>

          <div className="mt-14 flex flex-col items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-500 sm:flex-row">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-brand-600" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

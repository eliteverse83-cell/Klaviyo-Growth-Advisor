import {
  ClipboardList,
  UploadCloud,
  Plug,
  BarChart3,
} from 'lucide-react'
import Container from '../ui/Container.jsx'
import Reveal from '../ui/Reveal.jsx'

const FEATURES = [
  {
    icon: ClipboardList,
    title: 'Manual Audit',
    description:
      'Answer a short set of guided questions about your store and email program to get an instant, structured audit.',
  },
  {
    icon: UploadCloud,
    title: 'CSV Upload',
    description:
      'Upload your Shopify and Klaviyo exports and get an instant summary — parsed entirely in your browser, no integrations required.',
  },
  {
    icon: Plug,
    title: 'Connect Your Store',
    description:
      'Securely connect Shopify and Klaviyo for always-on monitoring and automatic audits. Coming soon.',
  },
  {
    icon: BarChart3,
    title: 'Actionable Scorecards',
    description:
      'Every audit produces a clear growth score and prioritized recommendations your team can act on immediately.',
  },
]

export default function FeatureCards() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            One platform, three ways to start
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Choose the input method that fits where you are today. All roads
            lead to the same clear, prioritized growth report.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 70}>
              <div className="group relative h-full rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-panel-gradient group-hover:text-white">
                  <Icon className="h-5.5 w-5.5" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-ink-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

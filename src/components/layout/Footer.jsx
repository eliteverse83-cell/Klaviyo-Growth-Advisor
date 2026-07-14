import { NavLink } from 'react-router-dom'
import { Rocket, AtSign, Link2, Code2 } from 'lucide-react'
import Container from '../ui/Container.jsx'

const PRODUCT_LINKS = [
  { label: 'Manual Audit', to: '/audit' },
  { label: 'CSV Upload', to: '/audit' },
  { label: 'Connect Shopify + Klaviyo', to: '/audit' },
]

const COMPANY_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Home', to: '/' },
]

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-panel-gradient text-white">
                <Rocket className="h-4.5 w-4.5" strokeWidth={2.25} />
              </span>
              <span className="text-lg font-bold tracking-tight text-ink-900">
                GrowthPilot <span className="text-brand-600">AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-500">
              AI-powered revenue audits that help Shopify and Klaviyo store
              owners find the growth opportunities hiding in their data.
            </p>
            <div className="mt-5 flex gap-3">
              {[AtSign, Link2, Code2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-500 transition-colors hover:border-brand-300 hover:text-brand-600"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Product</h3>
            <ul className="mt-4 space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-ink-500 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Company</h3>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-ink-500 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-200 pt-8 sm:flex-row">
          <p className="text-sm text-ink-400">
            © {new Date().getFullYear()} GrowthPilot AI. All rights reserved.
          </p>
          <p className="text-xs text-ink-400">
            Built for Shopify &amp; Klaviyo store owners.
          </p>
        </div>
      </Container>
    </footer>
  )
}

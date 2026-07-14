import { Plug, Lock, ShoppingBag, Mail } from 'lucide-react'
import Button from '../ui/Button.jsx'

const INTEGRATIONS = [
  { name: 'Shopify', icon: ShoppingBag },
  { name: 'Klaviyo', icon: Mail },
]

export default function ConnectPanel() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Plug className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-ink-900">
        Connect Shopify &amp; Klaviyo
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
        One-click, always-on audits directly from your live store and email
        data. This integration is on its way.
      </p>

      <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-4">
        {INTEGRATIONS.map(({ name, icon: Icon }) => (
          <div
            key={name}
            className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-4 py-5"
          >
            <Icon className="h-6 w-6 text-ink-400" />
            <span className="text-sm font-medium text-ink-500">{name}</span>
          </div>
        ))}
      </div>

      <span className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-500">
        <Lock className="h-3 w-3" />
        Coming Soon
      </span>

      <div className="mt-6">
        <Button variant="secondary" size="md" disabled>
          Connect Store
        </Button>
      </div>
    </div>
  )
}

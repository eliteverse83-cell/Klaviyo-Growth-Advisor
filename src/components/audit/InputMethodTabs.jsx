import { ClipboardList, UploadCloud, Plug, Lock } from 'lucide-react'

const INPUT_METHODS = [
  { id: 'manual', label: 'Manual Audit', icon: ClipboardList },
  { id: 'csv', label: 'CSV Upload', icon: UploadCloud, tag: 'Placeholder' },
  { id: 'connect', label: 'Connect Shopify & Klaviyo', icon: Plug, tag: 'Coming Soon' },
]

export default function InputMethodTabs({ activeMethod, onChange }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-ink-200 bg-white p-2 sm:flex-row">
      {INPUT_METHODS.map(({ id, label, icon: Icon, tag }) => {
        const isActive = activeMethod === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-ink-600 hover:bg-ink-100'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {tag && (
              <span
                className={`ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-ink-100 text-ink-500'
                }`}
              >
                {tag === 'Coming Soon' && <Lock className="h-2.5 w-2.5" />}
                {tag}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

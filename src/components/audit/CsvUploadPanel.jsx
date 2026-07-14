import { UploadCloud, FileSpreadsheet } from 'lucide-react'

const EXPECTED_FILES = [
  'Shopify orders export (.csv)',
  'Klaviyo campaign performance export (.csv)',
  'Klaviyo flow performance export (.csv)',
]

/**
 * Placeholder for V2 — the dropzone renders but does not parse or upload
 * files yet, since CSV ingestion logic isn't built in this version.
 */
export default function CsvUploadPanel() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-sm sm:p-10">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <UploadCloud className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-ink-900">
          CSV Upload
        </h2>
        <p className="mt-2 text-sm text-ink-500">
          Drag and drop your store exports below. File parsing isn&apos;t
          enabled yet in this version — this is a preview of the upload
          experience coming soon.
        </p>

        <div className="mt-8 flex cursor-not-allowed flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 px-6 py-12">
          <FileSpreadsheet className="h-9 w-9 text-ink-300" />
          <p className="text-sm font-medium text-ink-500">
            Drop CSV files here or{' '}
            <span className="text-brand-600">browse</span>
          </p>
          <p className="text-xs text-ink-400">Supports .csv up to 10MB</p>
        </div>

        <ul className="mt-8 space-y-2 text-left text-sm text-ink-500">
          {EXPECTED_FILES.map((file) => (
            <li key={file} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              {file}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

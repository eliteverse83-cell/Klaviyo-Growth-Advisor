import { useRef, useState } from 'react'
import {
  ShoppingCart,
  Users,
  Mail,
  Contact,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import { parseCsv } from '../../utils/csvParser.js'
import { buildCsvSummary } from '../../utils/csvSummaries.js'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const FILE_TYPES = [
  {
    id: 'shopifyOrders',
    label: 'Shopify Orders CSV',
    description: 'Shopify Admin → Orders → Export',
    icon: ShoppingCart,
  },
  {
    id: 'shopifyCustomers',
    label: 'Shopify Customers CSV',
    description: 'Shopify Admin → Customers → Export',
    icon: Users,
  },
  {
    id: 'klaviyoCampaigns',
    label: 'Klaviyo Campaign CSV',
    description: 'Klaviyo → Analytics → Campaigns → Export',
    icon: Mail,
  },
  {
    id: 'klaviyoProfiles',
    label: 'Klaviyo Profile CSV',
    description: 'Klaviyo → Audience → Export',
    icon: Contact,
  },
]

function UploadSlot({ fileType, state, onFile, onReset }) {
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const Icon = fileType.icon
  const status = state?.status ?? 'idle'

  function handleFiles(fileList) {
    const file = fileList?.[0]
    if (!file) return
    onFile(fileType.id, file)
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-ink-900">{fileType.label}</h3>
          <p className="text-xs text-ink-400">{fileType.description}</p>
        </div>
      </div>

      <div className="mt-5">
        {status === 'idle' && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragOver(false)
              handleFiles(event.dataTransfer.files)
            }}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
              isDragOver
                ? 'border-brand-400 bg-brand-50'
                : 'border-ink-200 bg-ink-50 hover:border-brand-300'
            }`}
          >
            <FileSpreadsheet className="h-7 w-7 text-ink-300" />
            <p className="text-sm font-medium text-ink-500">
              Drop CSV here or <span className="text-brand-600">browse</span>
            </p>
            <p className="text-xs text-ink-400">Up to 10MB</p>
          </button>
        )}

        {status === 'parsing' && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 px-4 py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            <p className="text-sm font-medium text-ink-500">Parsing {state.fileName}…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-center">
            <AlertTriangle className="mx-auto h-6 w-6 text-red-500" />
            <p className="mt-2 text-sm font-medium text-red-700">{state.error}</p>
            <button
              type="button"
              onClick={() => onReset(fileType.id)}
              className="mt-3 text-xs font-semibold text-brand-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="truncate text-sm font-semibold text-emerald-800">
                  {state.fileName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onReset(fileType.id)}
                className="shrink-0 text-ink-400 hover:text-ink-700"
                aria-label={`Remove ${state.fileName}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-emerald-700">
              {state.rowCount.toLocaleString()} row{state.rowCount === 1 ? '' : 's'} parsed
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {status === 'success' && state.summary.stats.length > 0 && (
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-ink-100 pt-5">
          {state.summary.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs font-medium text-ink-400">{stat.label}</dt>
              <dd className="mt-0.5 text-sm font-bold text-ink-900">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

/**
 * Parses Shopify/Klaviyo CSV exports entirely in the browser (no upload,
 * no API calls) and renders a per-file summary. Not yet wired into the
 * scoring engine — this is import + preview only.
 */
export default function CsvUploadPanel() {
  const [fileStates, setFileStates] = useState({})

  function handleFile(fileTypeId, file) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setFileStates((prev) => ({
        ...prev,
        [fileTypeId]: { status: 'error', error: 'That file doesn’t look like a .csv file.' },
      }))
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileStates((prev) => ({
        ...prev,
        [fileTypeId]: { status: 'error', error: 'File is larger than the 10MB limit.' },
      }))
      return
    }

    setFileStates((prev) => ({
      ...prev,
      [fileTypeId]: { status: 'parsing', fileName: file.name },
    }))

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const { rows } = parseCsv(String(reader.result))
        if (rows.length === 0) {
          setFileStates((prev) => ({
            ...prev,
            [fileTypeId]: { status: 'error', error: 'No data rows found in this file.' },
          }))
          return
        }
        const summary = buildCsvSummary(fileTypeId, rows)
        setFileStates((prev) => ({
          ...prev,
          [fileTypeId]: {
            status: 'success',
            fileName: file.name,
            rowCount: rows.length,
            summary,
          },
        }))
      } catch {
        setFileStates((prev) => ({
          ...prev,
          [fileTypeId]: { status: 'error', error: 'Could not parse this file as CSV.' },
        }))
      }
    }
    reader.onerror = () => {
      setFileStates((prev) => ({
        ...prev,
        [fileTypeId]: { status: 'error', error: 'Could not read this file.' },
      }))
    }
    reader.readAsText(file)
  }

  function handleReset(fileTypeId) {
    setFileStates((prev) => {
      const next = { ...prev }
      delete next[fileTypeId]
      return next
    })
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-sm sm:p-10">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <UploadCloud className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-ink-900">CSV Upload</h2>
        <p className="mt-2 text-sm text-ink-500">
          Upload your Shopify and Klaviyo exports below. Files are parsed entirely in your
          browser and summarized instantly.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Nothing is uploaded to a server — parsing happens locally on this device.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {FILE_TYPES.map((fileType) => (
          <UploadSlot
            key={fileType.id}
            fileType={fileType}
            state={fileStates[fileType.id]}
            onFile={handleFile}
            onReset={handleReset}
          />
        ))}
      </div>
    </div>
  )
}

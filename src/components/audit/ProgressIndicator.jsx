import { Check } from 'lucide-react'

/**
 * Horizontal step tracker for multi-step flows.
 * `steps` is an array of { label } and `currentStep` is a 0-based index.
 */
export default function ProgressIndicator({ steps, currentStep }) {
  return (
    <ol className="flex w-full items-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <li
            key={step.label}
            className={`flex items-center ${isLast ? '' : 'flex-1'}`}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : isActive
                      ? 'scale-110 border-brand-600 bg-white text-brand-600 ring-4 ring-brand-100'
                      : 'border-ink-200 bg-white text-ink-400'
                }`}
              >
                {isCompleted ? <Check className="h-4.5 w-4.5" /> : index + 1}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  isActive || isCompleted ? 'text-ink-900' : 'text-ink-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded transition-colors duration-500 sm:mx-3 ${
                  isCompleted ? 'bg-brand-600' : 'bg-ink-200'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

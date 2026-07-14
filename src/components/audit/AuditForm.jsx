import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import ProgressIndicator from './ProgressIndicator.jsx'
import Button from '../ui/Button.jsx'
import { AUDIT_STEPS, AUDIT_FORM_INITIAL_STATE } from '../../data/auditQuestions.js'

function Field({ field, value, onChange }) {
  const baseInputClasses =
    'w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'

  switch (field.type) {
    case 'select':
      return (
        <select
          id={field.name}
          required={field.required}
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={baseInputClasses}
        >
          <option value="" disabled>
            Select an option
          </option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )

    case 'radio':
      return (
        <div className="flex gap-3">
          {field.options.map((option) => (
            <label
              key={option}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                value === option
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-ink-200 text-ink-600 hover:border-brand-200'
              }`}
            >
              <input
                type="radio"
                name={field.name}
                value={option}
                checked={value === option}
                onChange={(event) => onChange(field.name, event.target.value)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      )

    case 'checkbox-group':
      return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {field.options.map((option) => {
            const checked = value.includes(option)
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  checked
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-ink-200 text-ink-600 hover:border-brand-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? value.filter((item) => item !== option)
                      : [...value, option]
                    onChange(field.name, next)
                  }}
                  className="h-4 w-4 shrink-0 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                {option}
              </label>
            )
          })}
        </div>
      )

    case 'textarea':
      return (
        <textarea
          id={field.name}
          rows={4}
          required={field.required}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={baseInputClasses}
        />
      )

    default:
      return (
        <input
          id={field.name}
          type={field.type}
          required={field.required}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={baseInputClasses}
        />
      )
  }
}

/**
 * Multi-step manual audit intake form. Collects and holds state locally —
 * it does not score or analyze anything. Submitting routes to the Results
 * page, which renders mock data until real audit logic is built.
 */
export default function AuditForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(AUDIT_FORM_INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const step = AUDIT_STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === AUDIT_STEPS.length - 1

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1)
      return
    }

    setIsSubmitting(true)
    // No audit logic yet — simulate a brief processing state, then hand
    // off to the Results page (which renders mock data for now).
    setTimeout(() => {
      navigate('/results')
    }, 900)
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm sm:p-10">
      <ProgressIndicator
        steps={AUDIT_STEPS.map((s) => ({ label: s.label }))}
        currentStep={currentStep}
      />

      <form onSubmit={handleSubmit} className="mt-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-ink-900">{step.label}</h2>
          <p className="mt-1 text-sm text-ink-500">{step.description}</p>
        </div>

        <div className="space-y-6">
          {step.fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-1.5 block text-sm font-semibold text-ink-800"
              >
                {field.label}
                {field.required && (
                  <span className="ml-0.5 text-brand-600">*</span>
                )}
              </label>
              <Field
                field={field}
                value={formData[field.name]}
                onChange={handleFieldChange}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-ink-100 pt-6">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleBack}
            disabled={isFirstStep || isSubmitting}
            className={isFirstStep ? 'invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing your audit…
              </>
            ) : isLastStep ? (
              <>
                Get My Results
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

import { useState } from 'react'
import Container from '../components/ui/Container.jsx'
import InputMethodTabs from '../components/audit/InputMethodTabs.jsx'
import AuditForm from '../components/audit/AuditForm.jsx'
import CsvUploadPanel from '../components/audit/CsvUploadPanel.jsx'
import ConnectPanel from '../components/audit/ConnectPanel.jsx'

export default function AuditPage() {
  const [activeMethod, setActiveMethod] = useState('manual')

  return (
    <section className="bg-hero-gradient py-16 sm:py-20">
      <Container className="max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Start Your Growth Audit
          </h1>
          <p className="mt-3 text-base text-ink-500">
            Choose how you’d like to get started. You can always switch
            methods later.
          </p>
        </div>

        <InputMethodTabs activeMethod={activeMethod} onChange={setActiveMethod} />

        <div className="mt-8">
          {activeMethod === 'manual' && <AuditForm />}
          {activeMethod === 'csv' && <CsvUploadPanel />}
          {activeMethod === 'connect' && <ConnectPanel />}
        </div>
      </Container>
    </section>
  )
}

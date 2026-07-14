import { Compass, ArrowRight } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'

export default function NotFoundPage() {
  return (
    <section className="bg-hero-gradient py-24 sm:py-32">
      <Container className="max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Compass className="h-7 w-7" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-600">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          We couldn’t find that page
        </h1>
        <p className="mt-4 text-base text-ink-500">
          The page you’re looking for doesn’t exist or may have moved. Let’s get you back on
          track.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button to="/" variant="primary" size="lg">
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button to="/audit" variant="secondary" size="lg">
            Start an Audit
          </Button>
        </div>
      </Container>
    </section>
  )
}

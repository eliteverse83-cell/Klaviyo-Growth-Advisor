import { ArrowRight, ShieldCheck } from 'lucide-react'
import Hero from '../components/landing/Hero.jsx'
import FeatureCards from '../components/landing/FeatureCards.jsx'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeatureCards />

      <section className="pb-20 sm:pb-28">
        <Container>
          <Reveal className="relative overflow-hidden rounded-3xl bg-panel-gradient px-8 py-14 text-center shadow-xl shadow-brand-900/20 sm:px-16">
            <div className="relative mx-auto max-w-2xl">
              <ShieldCheck className="mx-auto h-10 w-10 text-brand-200" />
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Ready to see what your data is telling you?
              </h2>
              <p className="mt-4 text-base text-brand-100">
                Run your first audit in minutes. No credit card, no store
                access, no commitment.
              </p>
              <div className="mt-8">
                <Button
                  to="/audit"
                  variant="secondary"
                  size="lg"
                  className="border-0 bg-white text-brand-700 hover:bg-brand-50"
                >
                  Start Free Audit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}

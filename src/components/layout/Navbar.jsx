import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Rocket } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Audit', to: '/audit' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-ink-900"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-panel-gradient text-white">
            <Rocket className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            GrowthPilot <span className="text-brand-600">AI</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-700'
                    : 'text-ink-600 hover:text-ink-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button to="/audit" variant="secondary" size="sm">
            Log In
          </Button>
          <Button to="/audit" variant="primary" size="sm">
            Start Free Audit
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-ink-600 hover:bg-ink-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {isOpen && (
        <div className="border-t border-ink-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-600 hover:bg-ink-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button to="/audit" variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
                Log In
              </Button>
              <Button to="/audit" variant="primary" size="sm" onClick={() => setIsOpen(false)}>
                Start Free Audit
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}

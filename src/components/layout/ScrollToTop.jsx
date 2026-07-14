import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * BrowserRouter doesn't reset scroll position on navigation (unlike the
 * data router's <ScrollRestoration>), so a deep-scrolled page followed by a
 * nav click otherwise lands mid-page on the new route.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Explicit "instant" overrides the global smooth-scroll CSS behavior —
    // a route change should reset position immediately, not animate.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

/**
 * Fades + slides its children in on mount via a pure CSS keyframe
 * animation (no IntersectionObserver / visibility gating) — content is
 * always guaranteed to end up visible, it just animates in rather than
 * snapping to its final state.
 */
export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  return (
    <Tag
      className={`animate-fade-up ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

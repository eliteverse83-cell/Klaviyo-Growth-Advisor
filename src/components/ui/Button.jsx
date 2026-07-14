import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary:
    'bg-white text-ink-700 border border-ink-200 hover:border-brand-300 hover:text-brand-700 focus-visible:outline-brand-600',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-brand-600',
}

const SIZES = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

/**
 * Shared button used across the app. Renders a <Link> when `to` is
 * provided, otherwise a native <button>, so callers don't juggle two APIs.
 */
export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  const Component = as || 'button'
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}

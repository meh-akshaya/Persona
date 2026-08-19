import { Link } from 'react-router-dom'

export default function PersonaLogo({ size = 'md', to = '/', className = '', onClick }) {
  const sizeClasses = {
    sm: 'text-sm sm:text-base tracking-[0.06em]',
    md: 'text-lg sm:text-xl tracking-[0.07em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.08em]',
  }[size] || 'text-lg sm:text-xl tracking-[0.07em]'

  const logoText = (
    <span className={`font-persona font-extrabold uppercase text-[#F2F2F2] group-hover:text-[#F5B800] transition-colors select-none ${sizeClasses} ${className}`}>
      PERSONA
    </span>
  )

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="inline-flex items-center group cursor-pointer">
        {logoText}
      </Link>
    )
  }

  return logoText
}

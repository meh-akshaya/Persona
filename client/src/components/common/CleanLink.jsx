import { useNavigate } from 'react-router-dom'

export default function CleanLink({ to, children, className = '', style = {}, onClick, ...props }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (onClick) onClick(e)
    if (!e.defaultPrevented && to) {
      if (e.metaKey || e.ctrlKey) {
        window.open(to, '_blank')
      } else {
        navigate(to)
      }
    }
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick(e)
        }
      }}
      style={{ cursor: 'pointer', ...style }}
      className={className}
      {...props}
    >
      {children}
    </span>
  )
}

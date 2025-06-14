import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  animate = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const badgeClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim()

  const BadgeComponent = animate ? motion.span : 'span'
  const motionProps = animate ? {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  } : {}

  return (
    <BadgeComponent
      className={badgeClasses}
      {...motionProps}
      {...props}
    >
      {children}
    </BadgeComponent>
  )
}

export default Badge
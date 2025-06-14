import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon = null, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-primary',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  }

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim()

  const iconSize = iconSizes[size]

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSize} 
          className="animate-spin mr-2" 
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          size={iconSize} 
          className="mr-2" 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          size={iconSize} 
          className="ml-2" 
        />
      )}
    </motion.button>
  )
}

export default Button
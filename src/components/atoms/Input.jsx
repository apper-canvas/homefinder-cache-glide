import { useState, forwardRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label,
  type = 'text',
  error = null,
  icon = null,
  iconPosition = 'left',
  className = '',
  placeholder = '',
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const hasValue = props.value !== undefined ? props.value !== '' : props.defaultValue !== ''
  const isFloating = isFocused || hasValue
  
  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={`relative ${className}`}>
      {/* Icon */}
      {icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          <ApperIcon name={icon} size={18} />
        </div>
      )}
      
      {/* Input */}
      <input
        ref={ref}
        type={inputType}
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-md
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          placeholder-transparent peer
          ${icon && iconPosition === 'left' ? 'pl-11' : ''}
          ${type === 'password' ? 'pr-11' : ''}
          ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
        `}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            top: isFloating ? '0.5rem' : '50%',
            fontSize: isFloating ? '0.75rem' : '1rem',
            color: error ? '#FC8181' : isFocused ? '#2C5282' : '#9CA3AF'
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`
            absolute left-4 -translate-y-1/2 pointer-events-none
            bg-white px-1 font-medium
            ${icon && iconPosition === 'left' ? 'left-11' : ''}
          `}
          style={{ transformOrigin: 'left center' }}
        >
          {label}
        </motion.label>
      )}
      
      {/* Password Toggle */}
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      )}
      
      {/* Right Icon */}
      {icon && iconPosition === 'right' && type !== 'password' && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <ApperIcon name={icon} size={18} />
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center space-x-1"
        >
          <ApperIcon name="AlertCircle" size={14} />
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
import { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error = null,
  className = '',
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = options.find(opt => opt.value === value)
  
  const handleSelect = (option) => {
    onChange?.(option.value)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {/* Select Button */}
      <button
        ref={ref}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 text-left border border-gray-300 rounded-md
          bg-white transition-all duration-200
          hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : ''}
        `}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="ChevronDown" size={18} className="text-gray-400" />
          </motion.div>
        </div>
      </button>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors
                  ${option.value === value ? 'bg-primary/5 text-primary' : 'text-gray-900'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {option.value === value && (
                    <ApperIcon name="Check" size={16} className="text-primary" />
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Click Outside Handler */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
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

Select.displayName = 'Select'

export default Select
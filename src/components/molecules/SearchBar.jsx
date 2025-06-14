import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search properties by location, price, or features...',
  className = '',
  initialValue = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(searchTerm)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch?.('')
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex items-center">
        <motion.div
          className="flex-1"
          animate={{ 
            scale: isExpanded ? 1.02 : 1 
          }}
          transition={{ duration: 0.2 }}
        >
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            icon="Search"
            iconPosition="left"
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            className="pr-20"
          />
        </motion.div>
        
        {/* Action Buttons */}
        <div className="absolute right-2 flex items-center space-x-1">
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon="X"
                onClick={handleClear}
                className="p-1 h-8 w-8 text-gray-400 hover:text-gray-600"
              />
            </motion.div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon="Search"
            className="h-8 px-3"
            disabled={!searchTerm.trim()}
          >
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>

      {/* Search Suggestions - Optional Enhancement */}
      {isExpanded && searchTerm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50"
        >
          <div className="p-2 text-sm text-gray-500 border-b">
            Press Enter to search for "{searchTerm}"
          </div>
        </motion.div>
      )}
    </motion.form>
  )
}

export default SearchBar
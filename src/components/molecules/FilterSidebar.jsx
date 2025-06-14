import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { searchFiltersService } from '@/services'

const FilterSidebar = ({ onFiltersChange, className = '' }) => {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedroomsMin: '',
    bathroomsMin: '',
    propertyTypes: [],
    location: '',
    squareFeetMin: ''
  })
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    bedsBaths: true,
    propertyType: true,
    location: true,
    size: false
  })

  useEffect(() => {
    const loadSavedFilters = async () => {
      try {
        const savedFilters = await searchFiltersService.getAll()
        setFilters(savedFilters)
        onFiltersChange?.(savedFilters)
      } catch (error) {
        console.error('Failed to load saved filters:', error)
      }
    }
    loadSavedFilters()
  }, [])

  const handleFilterChange = async (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    try {
      await searchFiltersService.save(newFilters)
      onFiltersChange?.(newFilters)
    } catch (error) {
      console.error('Failed to save filters:', error)
    }
  }

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = filters.propertyTypes || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    
    handleFilterChange('propertyTypes', newTypes)
  }

  const handleReset = async () => {
    try {
      const resetFilters = await searchFiltersService.reset()
      setFilters(resetFilters)
      onFiltersChange?.(resetFilters)
    } catch (error) {
      console.error('Failed to reset filters:', error)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.priceMin || filters.priceMax) count++
    if (filters.bedroomsMin) count++
    if (filters.bathroomsMin) count++
    if (filters.propertyTypes?.length > 0) count++
    if (filters.location) count++
    if (filters.squareFeetMin) count++
    return count
  }

  const propertyTypes = searchFiltersService.getPropertyTypes()
  const priceRanges = searchFiltersService.getPriceRanges()
  const activeCount = getActiveFiltersCount()

  const SectionHeader = ({ title, section, icon }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-3 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-2">
        <ApperIcon name={icon} size={18} />
        <span>{title}</span>
      </div>
      <motion.div
        animate={{ rotate: expandedSections[section] ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
      </motion.div>
    </button>
  )

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`bg-white border-r border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {activeCount > 0 && (
              <Badge variant="primary" size="sm" animate>
                {activeCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs"
              >
                Reset
              </Button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden p-1 rounded text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-y-auto flex-1"
          >
            {/* Price Range */}
            <div className="border-b border-gray-100">
              <SectionHeader title="Price Range" section="price" icon="DollarSign" />
              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        placeholder="Min Price"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                        icon="DollarSign"
                      />
                      <Input
                        type="number"
                        placeholder="Max Price"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                        icon="DollarSign"
                      />
                    </div>
                    
                    {/* Quick Price Ranges */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Quick ranges:</p>
                      <div className="flex flex-wrap gap-2">
                        {priceRanges.map((range) => (
                          <button
                            key={range.label}
                            onClick={() => {
                              handleFilterChange('priceMin', range.min)
                              handleFilterChange('priceMax', range.max || '')
                            }}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Beds & Baths */}
            <div className="border-b border-gray-100">
              <SectionHeader title="Beds & Baths" section="bedsBaths" icon="Bed" />
              <AnimatePresence>
                {expandedSections.bedsBaths && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 space-y-3"
                  >
                    <Select
                      label="Min Bedrooms"
                      value={filters.bedroomsMin}
                      onChange={(value) => handleFilterChange('bedroomsMin', value)}
                      options={[
                        { value: '', label: 'Any' },
                        { value: '1', label: '1+' },
                        { value: '2', label: '2+' },
                        { value: '3', label: '3+' },
                        { value: '4', label: '4+' },
                        { value: '5', label: '5+' }
                      ]}
                    />
                    <Select
                      label="Min Bathrooms"
                      value={filters.bathroomsMin}
                      onChange={(value) => handleFilterChange('bathroomsMin', value)}
                      options={[
                        { value: '', label: 'Any' },
                        { value: '1', label: '1+' },
                        { value: '1.5', label: '1.5+' },
                        { value: '2', label: '2+' },
                        { value: '2.5', label: '2.5+' },
                        { value: '3', label: '3+' }
                      ]}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Property Type */}
            <div className="border-b border-gray-100">
              <SectionHeader title="Property Type" section="propertyType" icon="Building" />
              <AnimatePresence>
                {expandedSections.propertyType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.map((type) => (
                        <motion.button
                          key={type}
                          onClick={() => handlePropertyTypeToggle(type)}
                          className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                            filters.propertyTypes?.includes(type)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {type}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location */}
            <div className="border-b border-gray-100">
              <SectionHeader title="Location" section="location" icon="MapPin" />
              <AnimatePresence>
                {expandedSections.location && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4"
                  >
                    <Input
                      type="text"
                      placeholder="City, State, or ZIP"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      icon="MapPin"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Size */}
            <div className="border-b border-gray-100">
              <SectionHeader title="Size" section="size" icon="Square" />
              <AnimatePresence>
                {expandedSections.size && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4"
                  >
                    <Input
                      type="number"
                      placeholder="Min Square Feet"
                      value={filters.squareFeetMin}
                      onChange={(e) => handleFilterChange('squareFeetMin', e.target.value)}
                      icon="Square"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FilterSidebar
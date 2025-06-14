import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropertyCard from '@/components/molecules/PropertyCard'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const PropertyGrid = ({ 
  properties = [], 
  loading = false, 
  viewMode = 'grid',
  onFavoriteChange,
  onLoadMore,
  hasMore = false
}) => {
  const [sortBy, setSortBy] = useState('price-low')
  const [sortedProperties, setSortedProperties] = useState([])

  useEffect(() => {
    let sorted = [...properties]
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'beds-high':
        sorted.sort((a, b) => b.bedrooms - a.bedrooms)
        break
      case 'sqft-high':
        sorted.sort((a, b) => b.squareFeet - a.squareFeet)
        break
      case 'newest':
        sorted.sort((a, b) => b.yearBuilt - a.yearBuilt)
        break
      default:
        break
    }
    
    setSortedProperties(sorted)
  }, [properties, sortBy])

  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'beds-high', label: 'Most Bedrooms' },
    { value: 'sqft-high', label: 'Largest Size' },
    { value: 'newest', label: 'Year Built: Newest' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4" />
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (sortedProperties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Home" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
        <p className="text-gray-500 mb-6">
          Try adjusting your filters or search criteria to find more properties.
        </p>
        <Button
          variant="primary"
          icon="RotateCcw"
          onClick={() => window.location.reload()}
        >
          Reset Search
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {sortedProperties.length} Properties Found
          </h2>
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Grid */}
      <motion.div
        layout
        className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1 max-w-4xl'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {sortedProperties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={index}
              onFavoriteChange={onFavoriteChange}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            icon="Plus"
          >
            Load More Properties
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default PropertyGrid
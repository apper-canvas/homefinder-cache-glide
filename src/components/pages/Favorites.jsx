import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import PropertyCard from '@/components/molecules/PropertyCard'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { favoritesService, propertyService } from '@/services'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('saved-newest')

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const favoritesList = await favoritesService.getAll()
      setFavorites(favoritesList)
      
      // Load property details for each favorite
      const propertyPromises = favoritesList.map(favorite => 
        propertyService.getById(favorite.propertyId)
      )
      
      const propertiesData = await Promise.all(propertyPromises)
      
      // Add savedAt date to each property for sorting
      const propertiesWithSaveDate = propertiesData.map((property, index) => ({
        ...property,
        savedAt: favoritesList[index].savedAt
      }))
      
      setProperties(propertiesWithSaveDate)
    } catch (err) {
      setError(err.message || 'Failed to load favorites')
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteChange = () => {
    loadFavorites() // Reload favorites when one is removed
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all properties from favorites?')) {
      try {
        // Remove all favorites
        await Promise.all(
          favorites.map(favorite => 
            favoritesService.delete(favorite.propertyId)
          )
        )
        
        setFavorites([])
        setProperties([])
        toast.success('All favorites cleared')
      } catch (error) {
        toast.error('Failed to clear favorites')
      }
    }
  }

  const getSortedProperties = () => {
    let sorted = [...properties]
    
    switch (sortBy) {
      case 'saved-newest':
        sorted.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
        break
      case 'saved-oldest':
        sorted.sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt))
        break
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'beds-high':
        sorted.sort((a, b) => b.bedrooms - a.bedrooms)
        break
      default:
        break
    }
    
    return sorted
  }

  const sortOptions = [
    { value: 'saved-newest', label: 'Recently Saved' },
    { value: 'saved-oldest', label: 'Oldest Saved' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'beds-high', label: 'Most Bedrooms' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
            
            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-card">
                  <div className="h-48 bg-gray-200 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load favorites
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            variant="primary"
            icon="RotateCcw"
            onClick={loadFavorites}
          >
            Retry
          </Button>
        </motion.div>
      </div>
    )
  }

  const sortedProperties = getSortedProperties()

  if (sortedProperties.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <ApperIcon name="Heart" size={64} className="text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring properties and save your favorites by clicking the heart icon on any property card.
            </p>
            <Button
              variant="primary"
              size="lg"
              icon="Home"
              onClick={() => window.location.href = '/browse'}
            >
              Browse Properties
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center">
                <ApperIcon name="Heart" size={32} className="text-secondary mr-3 fill-current" />
                My Favorites
              </h1>
              <p className="text-gray-600 mt-1">
                {sortedProperties.length} saved {sortedProperties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {sortedProperties.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  icon="Trash2"
                  onClick={handleClearAll}
                  className="text-error border-error hover:bg-error hover:text-white"
                >
                  Clear All
                </Button>
              )}
              
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
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
          </div>

          {/* Properties Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {sortedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05
                  }}
                >
                  <PropertyCard
                    property={property}
                    index={index}
                    onFavoriteChange={handleFavoriteChange}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Favorites
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { favoritesService, propertyService } from '@/services'

const Compare = () => {
  const [favorites, setFavorites] = useState([])
  const [selectedProperties, setSelectedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const favoritesList = await favoritesService.getAll()
      
      // Load property details for each favorite
      const propertyPromises = favoritesList.map(favorite => 
        propertyService.getById(favorite.propertyId)
      )
      
      const propertiesData = await Promise.all(propertyPromises)
      setFavorites(propertiesData)
    } catch (err) {
      setError(err.message || 'Failed to load properties')
      toast.error('Failed to load properties for comparison')
    } finally {
      setLoading(false)
    }
  }

  const handlePropertyToggle = (property) => {
    setSelectedProperties(prev => {
      const isSelected = prev.find(p => p.id === property.id)
      
      if (isSelected) {
        return prev.filter(p => p.id !== property.id)
      } else if (prev.length >= 3) {
        toast.warning('You can compare up to 3 properties at once')
        return prev
      } else {
        return [...prev, property]
      }
    })
  }

  const handleClearComparison = () => {
    setSelectedProperties([])
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft)
  }

  const getComparisonRows = () => {
    if (selectedProperties.length === 0) return []
    
    return [
      {
        label: 'Price',
        getValue: (property) => formatPrice(property.price),
        type: 'price'
      },
      {
        label: 'Property Type',
        getValue: (property) => property.propertyType,
        type: 'text'
      },
      {
        label: 'Bedrooms',
        getValue: (property) => property.bedrooms,
        type: 'number'
      },
      {
        label: 'Bathrooms',
        getValue: (property) => property.bathrooms,
        type: 'number'
      },
      {
        label: 'Square Feet',
        getValue: (property) => formatSquareFeet(property.squareFeet),
        type: 'area'
      },
      {
        label: 'Year Built',
        getValue: (property) => property.yearBuilt,
        type: 'year'
      },
      {
        label: 'Location',
        getValue: (property) => `${property.address.city}, ${property.address.state}`,
        type: 'text'
      },
      {
        label: 'Status',
        getValue: (property) => property.status,
        type: 'status'
      }
    ]
  }

  const getBestValue = (row, properties) => {
    if (row.type === 'price') {
      return Math.min(...properties.map(p => p.price))
    } else if (row.type === 'number' || row.type === 'area') {
      return Math.max(...properties.map(p => 
        row.type === 'area' ? p.squareFeet : 
        row.label === 'Bedrooms' ? p.bedrooms : p.bathrooms
      ))
    } else if (row.type === 'year') {
      return Math.max(...properties.map(p => p.yearBuilt))
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded" />
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
            Failed to load properties
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

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ApperIcon name="GitCompare" size={64} className="text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              No properties to compare
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add some properties to your favorites first, then come back here to compare them side by side.
            </p>
            <Button
              variant="primary"
              size="lg"
              icon="Heart"
              onClick={() => window.location.href = '/favorites'}
            >
              View Favorites
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  const comparisonRows = getComparisonRows()

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
                <ApperIcon name="GitCompare" size={32} className="text-accent mr-3" />
                Compare Properties
              </h1>
              <p className="text-gray-600 mt-1">
                Select up to 3 properties from your favorites to compare
              </p>
            </div>
            
            {selectedProperties.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon="X"
                onClick={handleClearComparison}
              >
                Clear Comparison
              </Button>
            )}
          </div>

          {/* Property Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Properties to Compare ({selectedProperties.length}/3)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((property) => {
                const isSelected = selectedProperties.find(p => p.id === property.id)
                
                return (
                  <motion.div
                    key={property.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handlePropertyToggle(property)}
                  >
                    {/* Selection Indicator */}
                    <div className="absolute top-3 right-3">
                      {isSelected ? (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <ApperIcon name="Check" size={16} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {property.title}
                        </h3>
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(property.price)}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {property.address.city}, {property.address.state}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          <span>{property.bedrooms} beds</span>
                          <span>{property.bathrooms} baths</span>
                          <span>{formatSquareFeet(property.squareFeet)} sqft</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Comparison Table */}
          <AnimatePresence>
            {selectedProperties.length > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-lg shadow-card overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Property Comparison
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                          Feature
                        </th>
                        {selectedProperties.map((property) => (
                          <th key={property.id} className="px-6 py-4 text-center">
                            <div className="space-y-2">
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-16 h-16 object-cover rounded-md mx-auto"
                              />
                              <div className="text-sm font-medium text-gray-900 max-w-32 mx-auto">
                                {property.title}
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-200">
                      {comparisonRows.map((row, index) => {
                        const bestValue = getBestValue(row, selectedProperties)
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {row.label}
                            </td>
                            {selectedProperties.map((property) => {
                              const value = row.getValue(property)
                              const rawValue = row.type === 'price' ? property.price :
                                             row.type === 'area' ? property.squareFeet :
                                             row.type === 'year' ? property.yearBuilt :
                                             row.label === 'Bedrooms' ? property.bedrooms :
                                             row.label === 'Bathrooms' ? property.bathrooms :
                                             null
                              
                              const isBest = bestValue !== null && rawValue === bestValue
                              
                              return (
                                <td key={property.id} className="px-6 py-4 text-center">
                                  <div className={`inline-flex items-center ${
                                    isBest ? 'text-primary font-semibold' : 'text-gray-900'
                                  }`}>
                                    {row.type === 'status' ? (
                                      <Badge 
                                        variant={value === 'For Sale' ? 'success' : 'warning'} 
                                        size="sm"
                                      >
                                        {value}
                                      </Badge>
                                    ) : (
                                      <>
                                        {value}
                                        {isBest && (
                                          <ApperIcon 
                                            name="Crown" 
                                            size={16} 
                                            className="ml-2 text-secondary" 
                                          />
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {selectedProperties.map((property) => (
                      <Button
                        key={property.id}
                        variant="outline"
                        size="sm"
                        icon="Eye"
                        onClick={() => window.open(`/property/${property.id}`, '_blank')}
                      >
                        View {property.title.split(' ')[0]}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {selectedProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <ApperIcon name="MousePointerClick" size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select properties to compare
              </h3>
              <p className="text-gray-600">
                Click on any property above to add it to your comparison
              </p>
            </motion.div>
          )}
          
          {selectedProperties.length === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <ApperIcon name="Plus" size={48} className="text-accent mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select one more property
              </h3>
              <p className="text-gray-600">
                Choose at least 2 properties to see the comparison table
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Compare
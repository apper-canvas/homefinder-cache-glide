import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import PropertyDetailModal from '@/components/organisms/PropertyDetailModal'
import { propertyService } from '@/services'

const MapView = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 34.0522, lng: -118.2437 }) // LA coordinates
  const [zoom, setZoom] = useState(10)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await propertyService.getAll()
      setProperties(data)
    } catch (err) {
      setError(err.message || 'Failed to load properties')
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleMarkerClick = (property) => {
    setSelectedProperty(property)
    setMapCenter({ lat: property.coordinates.lat, lng: property.coordinates.lng })
    setZoom(15)
  }

  const handlePropertySelect = (property) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const MapMarker = ({ property }) => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer"
      onClick={() => handleMarkerClick(property)}
    >
      <div className="bg-primary text-white px-3 py-2 rounded-lg shadow-lg relative">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Home" size={16} />
          <span className="font-semibold text-sm">
            {formatPrice(property.price).replace('.00', '')}
          </span>
        </div>
        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary" />
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin mb-4">
            <ApperIcon name="MapPin" size={48} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Map View
          </h3>
          <p className="text-gray-600">
            Preparing property locations...
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load map
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            variant="primary"
            icon="RotateCcw"
            onClick={loadProperties}
          >
            Retry
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50">
        {/* Simulated Map Interface */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(44, 82, 130, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(44, 82, 130, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            />
            
            {/* Property Markers */}
            <div className="absolute inset-0">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `${20 + (index % 3) * 25}%`,
                    top: `${20 + Math.floor(index / 3) * 25}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <MapMarker property={property} />
                </motion.div>
              ))}
            </div>
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                icon="Plus"
                onClick={() => setZoom(zoom + 1)}
                className="bg-white/90 backdrop-blur-sm"
              />
              <Button
                variant="outline"
                size="sm"
                icon="Minus"
                onClick={() => setZoom(Math.max(1, zoom - 1))}
                className="bg-white/90 backdrop-blur-sm"
              />
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>
              <div className="flex items-center space-x-2">
                <div className="bg-primary text-white px-2 py-1 rounded text-xs">
                  <ApperIcon name="Home" size={12} />
                </div>
                <span className="text-sm text-gray-600">Property Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Properties on Map
            </h2>
            <Badge variant="primary">{properties.length}</Badge>
          </div>

          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg"
            >
              <h3 className="font-semibold text-primary mb-2">Selected Property</h3>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">{selectedProperty.title}</p>
                <p className="text-2xl font-display font-bold text-primary">
                  {formatPrice(selectedProperty.price)}
                </p>
                <p className="text-gray-600 text-sm">
                  {selectedProperty.address.street}, {selectedProperty.address.city}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{selectedProperty.bedrooms} beds</span>
                  <span>{selectedProperty.bathrooms} baths</span>
                  <span>{new Intl.NumberFormat().format(selectedProperty.squareFeet)} sqft</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon="Eye"
                  className="w-full mt-3"
                  onClick={() => handlePropertySelect(selectedProperty)}
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">All Properties</h3>
            
            {properties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedProperty?.id === property.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleMarkerClick(property)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {property.title}
                    </h4>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {property.address.city}, {property.address.state}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default MapView
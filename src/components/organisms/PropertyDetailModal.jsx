import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { favoritesService } from '@/services'

const PropertyDetailModal = ({ property, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (property) {
      const checkFavoriteStatus = async () => {
        try {
          const favorite = await favoritesService.isFavorite(property.id)
          setIsFavorite(favorite)
        } catch (error) {
          // Ignore error for initial check
        }
      }
      checkFavoriteStatus()
    }
  }, [property])

  const handleFavoriteToggle = async () => {
    setIsLoading(true)
    
    try {
      await favoritesService.toggle(property.id)
      setIsFavorite(!isFavorite)
      
      toast.success(
        isFavorite ? 'Removed from favorites' : 'Added to favorites',
        { position: 'bottom-right' }
      )
    } catch (error) {
      toast.error('Failed to update favorites')
    } finally {
      setIsLoading(false)
    }
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  if (!property) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  Property Details
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Image Gallery */}
                <div className="relative h-64 sm:h-80">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Image Navigation */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ApperIcon name="ChevronLeft" size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ApperIcon name="ChevronRight" size={20} />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>
                    </>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <Badge variant="primary" size="sm">
                      {property.propertyType}
                    </Badge>
                    {property.status && (
                      <Badge 
                        variant={property.status === 'For Sale' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {property.status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Price & Title */}
                      <div>
                        <h3 className="text-3xl font-display font-bold text-primary mb-2">
                          {formatPrice(property.price)}
                        </h3>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">
                          {property.title}
                        </h4>
                        <p className="text-gray-600 flex items-center">
                          <ApperIcon name="MapPin" size={18} className="mr-2" />
                          {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                        </p>
                      </div>

                      {/* Key Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <ApperIcon name="Bed" size={24} className="mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                          <p className="text-sm text-gray-600">Bedrooms</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <ApperIcon name="Bath" size={24} className="mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                          <p className="text-sm text-gray-600">Bathrooms</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <ApperIcon name="Square" size={24} className="mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{formatSquareFeet(property.squareFeet)}</p>
                          <p className="text-sm text-gray-600">Square Feet</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <ApperIcon name="Calendar" size={24} className="mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{property.yearBuilt}</p>
                          <p className="text-sm text-gray-600">Year Built</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-3">Description</h5>
                        <p className="text-gray-600 leading-relaxed">
                          {property.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Amenities */}
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {property.amenities?.map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-gray-600"
                            >
                              <ApperIcon name="Check" size={16} className="text-success" />
                              <span className="text-sm">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <Button
                          variant="primary"
                          size="lg"
                          icon="Phone"
                          className="w-full"
                          onClick={() => toast.info('Contact feature coming soon!')}
                        >
                          Contact Agent
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant={isFavorite ? 'secondary' : 'outline'}
                            icon="Heart"
                            loading={isLoading}
                            onClick={handleFavoriteToggle}
                            className={isFavorite ? 'text-white' : ''}
                          >
                            {isFavorite ? 'Favorited' : 'Save'}
                          </Button>
                          <Button
                            variant="outline"
                            icon="Share"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href)
                              toast.success('Link copied to clipboard!')
                            }}
                          >
                            Share
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          icon="Calendar"
                          className="w-full"
                          onClick={() => toast.info('Schedule tour feature coming soon!')}
                        >
                          Schedule Tour
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PropertyDetailModal
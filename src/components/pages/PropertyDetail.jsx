import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { propertyService, favoritesService } from '@/services'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    loadProperty()
  }, [id])

  useEffect(() => {
    if (property) {
      checkFavoriteStatus()
    }
  }, [property])

  const loadProperty = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await propertyService.getById(id)
      setProperty(data)
    } catch (err) {
      setError(err.message || 'Property not found')
      toast.error('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const favorite = await favoritesService.isFavorite(property.id)
      setIsFavorite(favorite)
    } catch (error) {
      // Ignore error for initial check
    }
  }

  const handleFavoriteToggle = async () => {
    setFavoriteLoading(true)
    
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
      setFavoriteLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            {/* Back button skeleton */}
            <div className="h-10 bg-gray-200 rounded w-24" />
            
            {/* Image gallery skeleton */}
            <div className="h-64 sm:h-96 bg-gray-200 rounded-lg" />
            
            {/* Content skeleton */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Property not found
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <Button
              variant="outline"
              icon="ArrowLeft"
              onClick={() => navigate('/browse')}
            >
              Back to Browse
            </Button>
            <Button
              variant="primary"
              icon="RotateCcw"
              onClick={loadProperty}
            >
              Retry
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate('/browse')}
          >
            Back to Browse
          </Button>

          {/* Image Gallery */}
          <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden shadow-lg">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ApperIcon name="ChevronLeft" size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ApperIcon name="ChevronRight" size={24} />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex space-x-2">
              <Badge variant="primary">
                {property.propertyType}
              </Badge>
              {property.status && (
                <Badge 
                  variant={property.status === 'For Sale' ? 'success' : 'warning'}
                >
                  {property.status}
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {property.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Property Information */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="md:col-span-2 space-y-6">
              {/* Price & Title */}
              <div>
                <h1 className="text-4xl font-display font-bold text-primary mb-3">
                  {formatPrice(property.price)}
                </h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {property.title}
                </h2>
                <p className="text-gray-600 flex items-center text-lg">
                  <ApperIcon name="MapPin" size={20} className="mr-2" />
                  {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                </p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-card text-center">
                  <ApperIcon name="Bed" size={32} className="mx-auto text-primary mb-3" />
                  <p className="text-3xl font-bold text-gray-900">{property.bedrooms}</p>
                  <p className="text-gray-600">Bedrooms</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-card text-center">
                  <ApperIcon name="Bath" size={32} className="mx-auto text-primary mb-3" />
                  <p className="text-3xl font-bold text-gray-900">{property.bathrooms}</p>
                  <p className="text-gray-600">Bathrooms</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-card text-center">
                  <ApperIcon name="Square" size={32} className="mx-auto text-primary mb-3" />
                  <p className="text-3xl font-bold text-gray-900">{formatSquareFeet(property.squareFeet)}</p>
                  <p className="text-gray-600">Sq Ft</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-card text-center">
                  <ApperIcon name="Calendar" size={32} className="mx-auto text-primary mb-3" />
                  <p className="text-3xl font-bold text-gray-900">{property.yearBuilt}</p>
                  <p className="text-gray-600">Year Built</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 rounded-lg shadow-card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="bg-white p-6 rounded-lg shadow-card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {property.amenities?.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 text-gray-700"
                    >
                      <ApperIcon name="Check" size={18} className="text-success" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="bg-white p-6 rounded-lg shadow-card space-y-4">
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
                    loading={favoriteLoading}
                    onClick={handleFavoriteToggle}
                    className={isFavorite ? 'text-white' : ''}
                  >
                    {isFavorite ? 'Saved' : 'Save'}
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

              {/* Property Details */}
              <div className="bg-white p-6 rounded-lg shadow-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Square Feet</span>
                    <span className="font-medium">{formatSquareFeet(property.squareFeet)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge 
                      variant={property.status === 'For Sale' ? 'success' : 'warning'} 
                      size="sm"
                    >
                      {property.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PropertyDetail
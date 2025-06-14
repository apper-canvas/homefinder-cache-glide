import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { favoritesService } from '@/services'

const PropertyCard = ({ property, index = 0, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorite = await favoritesService.isFavorite(property.id)
        setIsFavorite(favorite)
      } catch (error) {
        // Ignore error for initial check
      }
    }
    checkFavoriteStatus()
  }, [property.id])

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation()
    setIsLoading(true)
    
    try {
      await favoritesService.toggle(property.id)
      setIsFavorite(!isFavorite)
      onFavoriteChange?.()
      
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

  const handleCardClick = () => {
    navigate(`/property/${property.id}`)
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

  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ 
        y: -4,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)'
      }}
      className="bg-white rounded-lg shadow-card overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <motion.img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </button>
            
            {/* Image Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {property.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Favorite Button */}
        <motion.button
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ 
              scale: isFavorite ? [1, 1.3, 1] : 1,
              color: isFavorite ? '#ED8936' : '#9CA3AF'
            }}
            transition={{ duration: 0.3 }}
          >
            <ApperIcon
              name={isFavorite ? 'Heart' : 'Heart'}
              size={18}
              className={isFavorite ? 'fill-current' : ''}
            />
          </motion.div>
        </motion.button>
        
        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
<Badge variant="primary" size="sm">
            {property.propertyType || property.property_type}
          </Badge>
        </div>
        
        {/* Status Badge */}
        {property.status && (
          <div className="absolute bottom-3 left-3">
            <Badge 
              variant={property.status === 'For Sale' ? 'success' : 'warning'} 
              size="sm"
            >
              {property.status}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-2">
          <h3 className="text-2xl font-display font-semibold text-primary">
            {formatPrice(property.price)}
          </h3>
        </div>
        
        {/* Title */}
        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {property.title}
        </h4>
        
        {/* Address */}
        <p className="text-gray-600 mb-3 flex items-center">
<ApperIcon name="MapPin" size={16} className="mr-1 flex-shrink-0" />
          <span className="truncate">
            {property.address?.street}, {property.address?.city}
          </span>
        </p>
        
        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Bed" size={16} className="mr-1" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" size={16} className="mr-1" />
              <span>{property.bathrooms} baths</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <ApperIcon name="Square" size={16} className="mr-1" />
            <span>{formatSquareFeet(property.squareFeet)} sqft</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon="Eye"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
          >
            View Details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="Phone"
            onClick={(e) => {
              e.stopPropagation()
              toast.info('Contact feature coming soon!')
            }}
          >
            Contact
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import SearchBar from '@/components/molecules/SearchBar'
import FilterSidebar from '@/components/molecules/FilterSidebar'
import PropertyGrid from '@/components/organisms/PropertyGrid'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { propertyService } from '@/services'

const Browse = () => {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    applyFiltersAndSearch()
  }, [properties, filters, searchTerm])

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

  const applyFiltersAndSearch = () => {
    let filtered = [...properties]

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(term) ||
        property.address.city.toLowerCase().includes(term) ||
        property.address.state.toLowerCase().includes(term) ||
        property.address.street.toLowerCase().includes(term) ||
        property.propertyType.toLowerCase().includes(term) ||
        property.amenities?.some(amenity => 
          amenity.toLowerCase().includes(term)
        )
      )
    }

    // Apply filters
    if (filters.priceMin) {
      filtered = filtered.filter(property => property.price >= filters.priceMin)
    }
    if (filters.priceMax) {
      filtered = filtered.filter(property => property.price <= filters.priceMax)
    }
    if (filters.bedroomsMin) {
      filtered = filtered.filter(property => property.bedrooms >= filters.bedroomsMin)
    }
    if (filters.bathroomsMin) {
      filtered = filtered.filter(property => property.bathrooms >= filters.bathroomsMin)
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      )
    }
    if (filters.location) {
      const location = filters.location.toLowerCase()
      filtered = filtered.filter(property => 
        property.address.city.toLowerCase().includes(location) ||
        property.address.state.toLowerCase().includes(location) ||
        property.address.street.toLowerCase().includes(location)
      )
    }
    if (filters.squareFeetMin) {
      filtered = filtered.filter(property => property.squareFeet >= filters.squareFeetMin)
    }

    setFilteredProperties(filtered)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFavoriteChange = () => {
    // Trigger any necessary updates
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
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
            onClick={loadProperties}
          >
            Retry
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900">
                  Find Your Dream Home
                </h1>
                <p className="text-gray-600 mt-1">
                  Discover the perfect property from our curated collection
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  icon="Grid3X3"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon="List"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar
              onSearch={handleSearch}
              initialValue={searchTerm}
              className="max-w-2xl"
            />

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                icon="Filter"
                onClick={() => setIsSidebarOpen(true)}
                className="w-full sm:w-auto"
              >
                Filters
                {Object.keys(filters).filter(key => filters[key] && 
                  (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
                ).length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {Object.keys(filters).filter(key => filters[key] && 
                      (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
                    ).length}
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            onFiltersChange={handleFiltersChange}
            className="sticky top-0 h-screen overflow-y-auto"
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-white"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              <FilterSidebar
                onFiltersChange={handleFiltersChange}
                className="h-full overflow-y-auto"
              />
            </motion.div>
          </div>
        )}

        {/* Property Grid */}
        <div className="flex-1 p-4 sm:p-6">
          <PropertyGrid
            properties={filteredProperties}
            loading={loading}
            viewMode={viewMode}
            onFavoriteChange={handleFavoriteChange}
          />
        </div>
      </div>
    </div>
  )
}

export default Browse
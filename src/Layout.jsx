import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routes } from '@/config/routes'
import { favoritesService } from '@/services'

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const loadFavoritesCount = async () => {
      try {
        const favorites = await favoritesService.getAll()
        setFavoritesCount(favorites.length)
      } catch (error) {
        console.error('Failed to load favorites count:', error)
      }
    }
    loadFavoritesCount()
  }, [location])

  const visibleRoutes = Object.values(routes).filter(route => !route.hidden)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-display font-bold text-primary">
                  HomeFinder Pro
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  <span>{route.label}</span>
                  {route.id === 'favorites' && favoritesCount > 0 && (
                    <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                      {favoritesCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon
                  name={isMobileMenuOpen ? 'X' : 'Menu'}
                  size={24}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 md:hidden"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                <nav className="p-4 space-y-2">
                  {visibleRoutes.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          isActive
                            ? 'text-primary bg-primary/10'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} size={20} />
                      <span>{route.label}</span>
                      {route.id === 'favorites' && favoritesCount > 0 && (
                        <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center ml-auto">
                          {favoritesCount}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
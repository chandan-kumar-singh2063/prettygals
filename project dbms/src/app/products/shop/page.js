'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedImage, setExpandedImage] = useState(null)
  
  const { addToCart, isAuthenticated } = useApp()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get query parameters
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    
    setSelectedCategory(category)
    setSearchQuery(search)
    loadProducts({ category, search })
  }, [searchParams])

  const loadProducts = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      
      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      } else {
        setError('Failed to load products')
      }
    } catch (error) {
      setError('Failed to load products')
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product) => {
    const result = await addToCart(product)
    if (result.success) {
      alert('Product added to cart!')
    } else {
      alert(result.message)
    }
  }

  const categories = [
    { name: 'All Products', value: '', color: 'bg-pink-500' },
    { name: 'Face', value: 'face', color: 'bg-purple-500' },
    { name: 'Eyes', value: 'eyes', color: 'bg-blue-500' },
    { name: 'Lips', value: 'lips', color: 'bg-red-500' },
    { name: 'Blush', value: 'blush', color: 'bg-pink-400' },
    { name: 'Perfume', value: 'perfume', color: 'bg-indigo-500' }
  ]

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
    const url = category ? `/products?category=${category}` : '/products'
    window.history.pushState({}, '', url)
    loadProducts({ category, search: searchQuery })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button 
            onClick={() => loadProducts()} 
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            BEAUTY PRODUCTS
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover our premium collection of cosmetics
          </p>
          {searchQuery && (
            <p className="text-lg opacity-80">
              Search results for: "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryFilter(category.value)}
                className={`px-6 py-3 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.value 
                    ? `${category.color} shadow-lg` 
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-100">
                  <div
                    className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => setExpandedImage(expandedImage === product.id ? null : product.id)}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                        <span className="text-2xl">💄</span>
                      </div>
                      <p className="text-gray-600 text-sm">Click to view</p>
                    </div>
                  </div>
                  
                  {/* Expanded Image View */}
                  {expandedImage === product.id && (
                    <div className="absolute inset-0 bg-white flex items-center justify-center p-4 z-10 shadow-xl rounded-lg">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <span className="text-4xl">💄</span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {product.category}
                    </span>
                  </div>

                  {/* Rating */}
                  {product.rating && (
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-xs ml-1">{product.rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 hover:text-pink-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature, index) => (
                          <span 
                            key={`${product._id}-feature-${index}`}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-pink-600">₹{product.price}</span>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!isAuthenticated || product.stock === 0}
                        className="bg-pink-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {!isAuthenticated ? 'Login' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

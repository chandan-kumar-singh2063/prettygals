'use client'

import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'

export default function ProductCard({ product }) {
  const { addToCart, isAuthenticated } = useApp()
  const { showSuccess, showError, showWarning } = useToast()
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      showWarning('Please login to add items to cart');
      return;
    }

    const result = await addToCart(product, 1);
    if (result.success) {
      showSuccess(`${product.name} added to cart!`);
    } else {
      showError(`Failed to add ${product.name} to cart`);
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <div className="product-card group">
      <div>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-primary-500 text-primary-500' : 'text-secondary-600'
                }`}
            />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-secondary-500 mb-1">{product.brand}</p>
          <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary-600">
              Rs. {product.price.toLocaleString()}
            </p>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isAuthenticated}
              title={!isAuthenticated ? 'Please login to add to cart' : 'Add to cart'}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

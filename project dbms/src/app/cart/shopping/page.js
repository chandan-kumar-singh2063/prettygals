'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'

export default function CartPage() {
  const { 
    cart, 
    cartTotal, 
    cartItemCount, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    isAuthenticated 
  } = useApp()
  const router = useRouter()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId)
    } else {
      await updateCartQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId)
  }

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
    }
  }

  const handleCheckout = () => {
    if (cart.length > 0) {
      router.push('/payment/checkout')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l1.5 8H19" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful products to get started!</p>
          <button
            onClick={() => router.push('/products/shop')}
            className="bg-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            <div className="text-sm text-gray-600">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💄</span>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price} each</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-lg font-semibold text-gray-800 w-24 text-right">
                  ₹{item.price * item.quantity}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
              >
                Clear Cart
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Total ({cartItemCount} items)</div>
                <div className="text-3xl font-bold text-gray-800">₹{cartTotal}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/products/shop')}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You might also like</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500 py-8">
              <p>Recommended products coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

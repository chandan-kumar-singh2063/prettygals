'use client';

import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Link from 'next/link';

export default function ProductsPage() {
  const { addToCart, user, isAuthenticated } = useApp();
  const [notification, setNotification] = useState('');

  // Sample products for testing
  const sampleProducts = [
    {
      id: 'simple-1',
      name: 'Rose Gold Lipstick',
      price: 25.99,
      image: '/images/lipstick-rose-gold.jpg',
      category: 'lips',
      description: 'Beautiful rose gold lipstick with long-lasting formula'
    },
    {
      id: 'simple-2', 
      name: 'Smokey Eye Palette',
      price: 45.99,
      image: '/images/eyeshadow-palette.jpg',
      category: 'eyes',
      description: 'Professional eyeshadow palette with 12 stunning shades'
    },
    {
      id: 'simple-3',
      name: 'Foundation Cream',
      price: 35.99,
      image: '/images/foundation.jpg',
      category: 'face',
      description: 'Full coverage foundation for all skin types'
    },
    {
      id: 'simple-4',
      name: 'Vanilla Perfume',
      price: 55.99,
      image: '/images/vanilla-perfume.jpg',
      category: 'perfume',
      description: 'Sweet vanilla fragrance with floral notes'
    },
    {
      id: 'simple-5',
      name: 'Classic Red Lipstick',
      price: 22.99,
      image: '/images/red-lipstick.jpg',
      category: 'lips',
      description: 'Timeless classic red lipstick for all occasions'
    },
    {
      id: 'simple-6',
      name: 'Mascara Volume',
      price: 19.99,
      image: '/images/mascara.jpg',
      category: 'eyes',
      description: 'Volume-boosting mascara for dramatic lashes'
    }
  ];

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setNotification('Please login to add items to cart');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    const result = await addToCart(product, 1);
    if (result.success) {
      setNotification(`${product.name} added to cart!`);
    } else {
      setNotification(`Failed to add ${product.name} to cart`);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Beauty Products</h1>
          <p className="text-lg text-gray-600">Discover our amazing collection of beauty products</p>
        </div>

        {/* User Status */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              {isAuthenticated ? (
                <p className="text-green-600">✅ Logged in as: {user?.name}</p>
              ) : (
                <p className="text-red-600">❌ Not logged in</p>
              )}
            </div>
            <div className="space-x-4">
              {isAuthenticated ? (
                <Link 
                  href="/cart" 
                  className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                >
                  View Cart
                </Link>
              ) : (
                <Link 
                  href="/auth/login" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
              <Link 
                href="/cart-test" 
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Test Page
              </Link>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {notification}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">📷 {product.name}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-2">
                  <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide font-semibold">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Add to Cart</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13h10" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {isAuthenticated && (
          <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex space-x-4">
              <Link 
                href="/cart" 
                className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700"
              >
                View Cart
              </Link>
              <Link 
                href="/api/debug" 
                target="_blank"
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Debug Database
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

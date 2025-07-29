'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// This would come from your API/database based on the product ID
const getProductDetails = (category, id) => {
  const products = {
    lips: {
      'beige-nudes': {
        id: 'beige-nudes',
        name: 'beige nudes',
        brand: 'Huda Beauty',
        price: 799,
        image: 'https://i.pinimg.com/736x/c8/5d/d6/c85dd6c1192d7205749249b2b7dd6a79.jpg',
        description: 'A natural beige nude lipstick with a soft matte finish that complements every skin tone.',
        delivery: 'Standard Delivery within 2–4 days — Rs. 75',
        returns: '14 Days Free Return',
        warranty: 'Not Available'
      }
    }
  }
  return products[category]?.[id] || null
}

export default function ProductDetailPage({ params }) {
  const product = getProductDetails(params?.category, params?.id)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-pink-500 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Navbar matching original design */}
      <nav className="bg-pink-500 px-8 py-4 text-white flex justify-between items-center">
        <div className="text-xl font-bold">PrettyGals</div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search for products..."
            className="px-3 py-2 rounded-full border-none w-40 text-black"
          />
        </div>
      </nav>

      {/* Main Content */}
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto p-10">
          <div className="flex gap-8 bg-white rounded-lg shadow-lg p-10">
            {/* Product Image */}
            <div className="flex-1">
              <Image
                src={product.image}
                alt={product.name}
                width={350}
                height={300}
                className="rounded-lg object-cover w-full"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 capitalize mt-0 mb-4">
                {product.name}
              </h1>
              
              <p className="font-semibold text-gray-600 mb-3">
                <strong>Brand:</strong> {product.brand}
              </p>
              
              <p className="text-gray-700 mb-4">
                {product.description}
              </p>
              
              <div className="text-2xl text-red-600 font-semibold mb-6">
                Rs. {product.price.toLocaleString()}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mb-6">
                <Link href="/payment">
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                    Buy Now
                  </button>
                </Link>
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                  Add to Cart
                </button>
              </div>

              {/* Product Info */}
              <div className="text-gray-600 text-sm space-y-2">
                <p><strong>Delivery:</strong> {product.delivery}</p>
                <p><strong>Returns:</strong> {product.returns}</p>
                <p><strong>Warranty:</strong> {product.warranty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-pink-500 text-white text-center py-5 font-semibold mt-10">
          © 2025 PrettyGals. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

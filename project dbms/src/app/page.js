'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, user } = useApp();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products);
      setFeaturedProducts(data.featuredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(result.error);
    }
  };

  const categories = [
    { name: 'Face', href: '/products/face', image: '/api/placeholder/300/200', description: 'Foundation, concealer, powder, and more' },
    { name: 'Eyes', href: '/products/eyes', image: '/api/placeholder/300/200', description: 'Eyeshadow, eyeliner, mascara, and more' },
    { name: 'Lips', href: '/products/lips', image: '/api/placeholder/300/200', description: 'Lipstick, lip gloss, lip liner, and more' },
    { name: 'Perfume', href: '/products/perfume', image: '/api/placeholder/300/200', description: 'Fragrances for every occasion' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Your
              <span className="text-pink-500"> Beauty</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our premium collection of beauty products. From makeup to fragrances, 
              we have everything you need to enhance your natural beauty.
            </p>
            <Link
              href="/products"
              className="inline-block bg-pink-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group block bg-gray-50 rounded-lg p-6 hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="aspect-w-3 aspect-h-2 mb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center group-hover:from-pink-300 group-hover:to-purple-300 transition-all duration-300">
                    <span className="text-2xl font-bold text-pink-600 group-hover:text-pink-700 transition-colors">{category.name[0]}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product._id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative aspect-w-1 aspect-h-1 overflow-hidden">
                  <img
                    src={product.images[0]?.url || '/api/placeholder/300/300'}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors transform hover:scale-110"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={20} />
                      </button>
                      <Link
                        href={`/products/${product._id}`}
                        className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </Link>
                      <button
                        className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
                        title="Add to Wishlist"
                      >
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`${product._id}-star-${i}`}
                          size={16}
                          className={`${
                            i < Math.floor(product.rating.average)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.rating.count})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
            <button 
                      onClick={() => handleAddToCart(product._id)}
                      className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors transform hover:scale-110"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              View All Products
          </Link>
        </div>
      </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Our Beauty Store?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                  <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">
                  We only stock the highest quality beauty products from trusted brands.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🚚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
                <p className="text-gray-600">
                  Get your beauty products delivered quickly and securely to your door.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                  <span className="text-2xl group-hover:scale-110 transition-transform">💝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellent Service</h3>
                <p className="text-gray-600">
                  Our customer service team is here to help you find the perfect products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

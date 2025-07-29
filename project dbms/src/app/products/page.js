'use client';

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import Link from 'next/link';

export default function ProductsPage() {
  const { addToCart, user, isAuthenticated, cartItemCount } = useApp();
  const { showSuccess, showError, showWarning } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.products) {
          // Transform database products to match UI expectations
          const transformedProducts = data.products.map(product => ({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images && product.images.length > 0 
              ? product.images[0].url 
              : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMTIwSDE4MFYxODBIMTIwVjEyMFoiIGZpbGw9IiM5Q0E5QjQiLz4KPHR5cGUgeD0iNTAlIiB5PSI1NSUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=',
            category: product.category,
            description: product.description,
            brand: product.brand,
            stock: product.stock
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to sample products if database fetch fails
        setProducts([
          {
            id: 'fallback-1',
            name: 'Rose Gold Lipstick',
            price: 25.99,
            image: 'https://i.pinimg.com/564x/42/5e/e9/425ee9f6bd05ba7edc208705ee7bc79f.jpg',
            category: 'lips',
            description: 'Beautiful rose gold lipstick with long-lasting formula'
          },
          {
            id: 'fallback-2', 
            name: 'Smokey Eye Palette',
            price: 45.99,
            image: 'https://i.pinimg.com/564x/c6/92/45/c69245e7b0cc6229e85fc49822c33af6.jpg',
            category: 'eyes',
            description: 'Professional eyeshadow palette with 12 stunning shades'
          },
          {
            id: 'fallback-3',
            name: 'Foundation Cream',
            price: 35.99,
            image: 'https://i.pinimg.com/564x/02/b2/e0/02b2e040fba4fe08da108671d4c52304.jpg',
            category: 'face',
            description: 'Full coverage foundation for all skin types'
          },
          {
            id: 'fallback-4',
            name: 'Vanilla Perfume',
            price: 55.99,
            image: 'https://i.pinimg.com/564x/14/53/54/145354416e2e0e888d35ab735f923268.jpg',
            category: 'perfume',
            description: 'Sweet vanilla fragrance with floral notes'
          },
          {
            id: 'fallback-5',
            name: 'Classic Red Lipstick',
            price: 22.99,
            image: 'https://i.pinimg.com/564x/e6/ad/82/e6ad8244c962e9c611bccc095419d8014.jpg',
            category: 'lips',
            description: 'Timeless classic red lipstick for all occasions'
          },
          {
            id: 'fallback-6',
            name: 'Mascara Volume',
            price: 19.99,
            image: 'https://i.pinimg.com/564x/8b/de/64/8bde6471c645bcc069c20e53405ba2cb.jpg',
            category: 'eyes',
            description: 'Volume-boosting mascara for dramatic lashes'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Beauty Products</h1>
            <p className="text-lg text-gray-600">Discover our amazing collection of beauty products</p>
          </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover bg-gray-100"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const placeholder = e.target.parentNode.querySelector('.image-placeholder')
                      if (placeholder) placeholder.style.display = 'flex'
                    }}
                  />
                  <div className="image-placeholder w-full h-64 bg-gray-100 flex items-center justify-center border border-gray-200 hidden">
                    <span className="text-gray-500">No Image Available</span>
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
                  {product.brand && (
                    <p className="text-gray-500 text-xs mb-2">Brand: {product.brand}</p>
                  )}
                  {product.stock !== undefined && (
                    <p className="text-gray-500 text-xs mb-4">Stock: {product.stock} available</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center space-x-2"
                      disabled={product.stock === 0}
                    >
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13h10" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
    </div>
  );
}

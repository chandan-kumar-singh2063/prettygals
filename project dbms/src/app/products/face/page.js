import ProductCard from '@/components/products/ProductCard'

const faceProducts = [
  {
    id: 1,
    name: 'Foundation - Fit Lighting',
    brand: 'Maybelline',
    price: 1299,
    image: 'https://i.pinimg.com/736x/f1/2e/3a/f12e3a8b9c4d5e6f7a8b9c0d1e2f3a4b.jpg',
    category: 'face'
  },
  {
    id: 2,
    name: 'NARS Foundation',
    brand: 'NARS',
    price: 3500,
    image: 'https://i.pinimg.com/736x/a1/b2/c3/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.jpg',
    category: 'face'
  },
  {
    id: 3,
    name: 'Master Primer',
    brand: 'Smashbox',
    price: 2200,
    image: 'https://i.pinimg.com/736x/b2/c3/d4/b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7.jpg',
    category: 'face'
  },
  {
    id: 4,
    name: 'MARIO Concealer',
    brand: 'Makeup by Mario',
    price: 1800,
    image: 'https://i.pinimg.com/736x/c3/d4/e5/c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8.jpg',
    category: 'face'
  },
  {
    id: 5,
    name: 'Bronzer',
    brand: 'Benefit',
    price: 2500,
    image: 'https://i.pinimg.com/736x/d4/e5/f6/d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9.jpg',
    category: 'face'
  },
  {
    id: 6,
    name: 'Contour Palette',
    brand: 'Anastasia Beverly Hills',
    price: 3200,
    image: 'https://i.pinimg.com/736x/e5/f6/a7/e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0.jpg',
    category: 'face'
  },
  {
    id: 7,
    name: 'Face Powder',
    brand: 'Laura Mercier',
    price: 2800,
    image: 'https://i.pinimg.com/736x/f6/a7/b8/f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg',
    category: 'face'
  },
  {
    id: 8,
    name: 'Loose Powder',
    brand: 'Huda Beauty',
    price: 2200,
    image: 'https://i.pinimg.com/736x/a7/b8/c9/a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2.jpg',
    category: 'face'
  },
  {
    id: 9,
    name: 'Setting Spray',
    brand: 'Urban Decay',
    price: 1500,
    image: 'https://i.pinimg.com/736x/b8/c9/d0/b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3.jpg',
    category: 'face'
  }
]

export default function FacePage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Flawless Complexion Essentials
          </h1>
          <p className="text-xl opacity-90">
            Create the perfect base with our premium face makeup collection
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">
              Face Products ({faceProducts.length})
            </h2>
            <select className="px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {faceProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

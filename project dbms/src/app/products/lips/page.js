import ProductCard from '@/components/products/ProductCard'

const lipProducts = [
  {
    id: 1,
    name: 'Beige Nudes Lipstick',
    brand: 'Huda Beauty',
    price: 799,
    image: 'https://i.pinimg.com/736x/c8/5d/d6/c85dd6c1192d7205749249b2b7dd6a79.jpg',
    category: 'lips'
  },
  {
    id: 2,
    name: 'Classic Red Lipstick',
    brand: 'MAC',
    price: 1200,
    image: 'https://i.pinimg.com/736x/e1/f2/a3/e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6.jpg',
    category: 'lips'
  },
  {
    id: 3,
    name: 'Brown Matte Lipstick',
    brand: 'Charlotte Tilbury',
    price: 1599,
    image: 'https://i.pinimg.com/736x/a2/b3/c4/a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7.jpg',
    category: 'lips'
  },
  {
    id: 4,
    name: 'Glossy Lip Gloss',
    brand: 'Fenty Beauty',
    price: 899,
    image: 'https://i.pinimg.com/736x/b3/c4/d5/b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8.jpg',
    category: 'lips'
  },
  {
    id: 5,
    name: 'Lip Tint',
    brand: 'Glossier',
    price: 699,
    image: 'https://i.pinimg.com/736x/c4/d5/e6/c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9.jpg',
    category: 'lips'
  },
  {
    id: 6,
    name: 'Nude Elegance',
    brand: 'Tom Ford',
    price: 2500,
    image: 'https://i.pinimg.com/736x/d5/e6/f7/d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0.jpg',
    category: 'lips'
  }
]

export default function LipsPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Perfect Lips for Every Occasion
          </h1>
          <p className="text-xl opacity-90">
            From bold statements to subtle elegance - find your perfect shade
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">
              Lip Products ({lipProducts.length})
            </h2>
            <select className="px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lipProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

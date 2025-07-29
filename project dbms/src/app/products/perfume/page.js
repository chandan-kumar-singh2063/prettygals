import ProductCard from '@/components/products/ProductCard'

const perfumeProducts = [
  {
    id: 1,
    name: 'Amber Perfume',
    brand: 'Tom Ford',
    price: 8500,
    image: 'https://i.pinimg.com/736x/a1/b2/c3/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.jpg',
    category: 'perfume'
  },
  {
    id: 2,
    name: 'Cacao Perfume',
    brand: 'Maison Margiela',
    price: 9200,
    image: 'https://i.pinimg.com/736x/b2/c3/d4/b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7.jpg',
    category: 'perfume'
  },
  {
    id: 3,
    name: 'Cherry Blossom',
    brand: 'Jo Malone',
    price: 7800,
    image: 'https://i.pinimg.com/736x/c3/d4/e5/c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8.jpg',
    category: 'perfume'
  },
  {
    id: 4,
    name: 'Citrus Fresh',
    brand: 'Hermès',
    price: 6500,
    image: 'https://i.pinimg.com/736x/d4/e5/f6/d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9.jpg',
    category: 'perfume'
  },
  {
    id: 5,
    name: 'Floral Garden',
    brand: 'Chanel',
    price: 12000,
    image: 'https://i.pinimg.com/736x/e5/f6/a7/e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0.jpg',
    category: 'perfume'
  },
  {
    id: 6,
    name: 'Rose Romance',
    brand: 'Dior',
    price: 9800,
    image: 'https://i.pinimg.com/736x/f6/a7/b8/f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg',
    category: 'perfume'
  },
  {
    id: 7,
    name: 'Fruity Delight',
    brand: 'Marc Jacobs',
    price: 5500,
    image: 'https://i.pinimg.com/736x/a7/b8/c9/a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2.jpg',
    category: 'perfume'
  },
  {
    id: 8,
    name: 'Vanilla Rich',
    brand: 'Yves Saint Laurent',
    price: 8800,
    image: 'https://i.pinimg.com/736x/b8/c9/d0/b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3.jpg',
    category: 'perfume'
  },
  {
    id: 9,
    name: 'Vanilla Luxury',
    brand: 'Creed',
    price: 15000,
    image: 'https://i.pinimg.com/736x/c9/d0/e1/c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4.jpg',
    category: 'perfume'
  },
  {
    id: 10,
    name: 'Woody Essence',
    brand: 'Byredo',
    price: 11500,
    image: 'https://i.pinimg.com/736x/d0/e1/f2/d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5.jpg',
    category: 'perfume'
  }
]

export default function PerfumePage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Captivating Fragrances
          </h1>
          <p className="text-xl opacity-90">
            Discover your signature scent from our luxury perfume collection
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">
              Perfume Collection ({perfumeProducts.length})
            </h2>
            <select className="px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {perfumeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

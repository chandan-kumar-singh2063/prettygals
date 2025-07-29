import ProductCard from '@/components/products/ProductCard'

const eyeProducts = [
  {
    id: 1,
    name: 'Woody Eyeshadow Palette',
    brand: 'Urban Decay',
    price: 1299,
    image: 'https://i.pinimg.com/736x/12/0f/89/120f897f1c8eacde4d58570859c0d1a8.jpg',
    category: 'eyes'
  },
  {
    id: 2,
    name: 'Glittery Eyeshadow',
    brand: 'Huda Beauty',
    price: 1099,
    image: 'https://i.pinimg.com/736x/d0/49/99/d04999cf8afd5e85c671ad443974a4d9.jpg',
    category: 'eyes'
  },
  {
    id: 3,
    name: 'Matte Eyeshadow',
    brand: 'Morphe',
    price: 1599,
    image: 'https://i.pinimg.com/736x/12/85/96/128596adf25af731a1d7fdb4f8a87ee5.jpg',
    category: 'eyes'
  },
  {
    id: 4,
    name: 'Black Eyeliner',
    brand: 'MAC',
    price: 999,
    image: 'https://i.pinimg.com/736x/69/7b/d0/697bd004cf4fcc183edf0e1dda9ce2d2.jpg',
    category: 'eyes'
  },
  {
    id: 5,
    name: 'White Eyeliner',
    brand: 'NYX',
    price: 2799,
    image: 'https://i.pinimg.com/736x/31/dc/0b/31dc0b85bb32ec8bc8837d7a3fc8a1ac.jpg',
    category: 'eyes'
  },
  {
    id: 6,
    name: 'Long Lash Mascara',
    brand: 'Benefit',
    price: 1799,
    image: 'https://i.pinimg.com/736x/df/05/c1/df05c1e82dd645fe02acebe685686cde.jpg',
    category: 'eyes'
  },
  {
    id: 7,
    name: 'Volume Mascara',
    brand: 'Maybelline',
    price: 2000,
    image: 'https://i.pinimg.com/736x/74/67/6b/74676bb9e3cff2dc4a4bb0deeca50295.jpg',
    category: 'eyes'
  },
  {
    id: 8,
    name: 'Lash Curler',
    brand: 'Shu Uemura',
    price: 300,
    image: 'https://i.pinimg.com/736x/c0/f3/16/c0f316cabcf945f735f93bd3d7ca515c.jpg',
    category: 'eyes'
  },
  {
    id: 9,
    name: 'False Lashes',
    brand: 'Ardell',
    price: 300,
    image: 'https://i.pinimg.com/736x/62/42/a9/6242a9c729773a4e5876ecc379ad2465.jpg',
    category: 'eyes'
  },
  {
    id: 10,
    name: 'Premium Lash Curler',
    brand: 'Tweezerman',
    price: 350,
    image: 'https://i.pinimg.com/736x/42/8a/63/428a638677151aafab0d093b952f6582.jpg',
    category: 'eyes'
  }
]

export default function EyesPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            "Let your eyes do the talking"
          </h1>
          <p className="text-xl opacity-90">
            Embrace your true colors with our stunning eye makeup collection
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">
              Eye Products ({eyeProducts.length})
            </h2>
            <select className="px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {eyeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

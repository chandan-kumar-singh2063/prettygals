import ProductCard from '@/components/products/ProductCard'

const featuredProducts = [
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
    name: 'Glittery Eyeshadow',
    brand: 'Urban Decay',
    price: 1099,
    image: 'https://i.pinimg.com/736x/d0/49/99/d04999cf8afd5e85c671ad443974a4d9.jpg',
    category: 'eyes'
  },
  {
    id: 3,
    name: 'Volume Mascara',
    brand: 'Maybelline',
    price: 2000,
    image: 'https://i.pinimg.com/736x/74/67/6b/74676bb9e3cff2dc4a4bb0deeca50295.jpg',
    category: 'eyes'
  },
  {
    id: 4,
    name: 'Woody Perfume',
    brand: 'Tom Ford',
    price: 3500,
    image: 'https://i.pinimg.com/736x/12/0f/89/120f897f1c8eacde4d58570859c0d1a8.jpg',
    category: 'perfume'
  }
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Handpicked favorites loved by beauty enthusiasts worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

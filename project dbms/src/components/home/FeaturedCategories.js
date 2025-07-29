import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    name: 'Eyes',
    description: 'Let your eyes do the talking',
    image: 'https://i.pinimg.com/736x/12/0f/89/120f897f1c8eacde4d58570859c0d1a8.jpg',
    href: '/products/eyes',
    color: 'from-purple-400 to-purple-600'
  },
  {
    name: 'Lips',
    description: 'Perfect pouts for every occasion',
    image: 'https://i.pinimg.com/736x/c8/5d/d6/c85dd6c1192d7205749249b2b7dd6a79.jpg',
    href: '/products/lips',
    color: 'from-pink-400 to-pink-600'
  },
  {
    name: 'Face',
    description: 'Flawless complexion essentials',
    image: 'https://i.pinimg.com/736x/f1/2e/3a/f12e3a8b9c4d5e6f7a8b9c0d1e2f3a4b.jpg',
    href: '/products/face',
    color: 'from-orange-400 to-orange-600'
  },
  {
    name: 'Perfume',
    description: 'Captivating fragrances',
    image: 'https://i.pinimg.com/736x/a1/b2/c3/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.jpg',
    href: '/products/perfume',
    color: 'from-blue-400 to-blue-600'
  }
]

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Explore our carefully curated collection of premium beauty products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="aspect-square relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-60 transition-opacity duration-300`} />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

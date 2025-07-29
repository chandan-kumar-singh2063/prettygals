import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-50 to-primary-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
            Unleash Your{' '}
            <span className="text-primary-500">Beauty</span>
          </h1>
          <p className="text-xl text-secondary-700 mb-8 max-w-2xl mx-auto">
            Discover premium beauty products that enhance your natural radiance. 
            From stunning eye makeup to luxurious perfumes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary">
              Shop Now
            </Link>
            <Link href="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

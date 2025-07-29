'use client'

import Image from 'next/image'

export default function AboutUsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'beige' }}>
      {/* Header */}
      <header className="text-center py-12" style={{ backgroundColor: 'rgb(196, 115, 115)', color: 'white' }}>
        <h1 className="text-4xl font-bold mb-4">About PrettyGals</h1>
        <p className="text-xl">Your beauty, our passion</p>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-10 text-center py-4" style={{ backgroundColor: 'burlywood' }}>
        <div className="space-x-6">
          <a href="#overview" className="text-white font-bold hover:underline">Overview</a>
          <a href="#founded" className="text-white font-bold hover:underline">Founded</a>
          <a href="#gallery" className="text-white font-bold hover:underline">Gallery</a>
          <a href="#services" className="text-white font-bold hover:underline">Services</a>
          <a href="#products" className="text-white font-bold hover:underline">Products</a>
        </div>
      </nav>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-8 py-12 space-y-16">
        {/* Overview */}
        <section id="overview">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#d63384' }}>Overview</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p>
              At PrettyGals, we believe beauty begins with confidence. From our very first lipstick launch to our full-range makeup collections, we've stayed true to our mission: to create high-quality, affordable, and cruelty-free cosmetics that let you express your true self.
            </p>
            <p>
              We're more than makeup — we're a community. A movement that celebrates individuality, diversity, and self-love. Whether you're creating a soft everyday look or bold glam vibes, PrettyGals is here to help you glow from within.
            </p>
            <p>
              Join the PrettyGals journey — where every face is beautiful, and every look tells a story.
            </p>
          </div>
        </section>

        {/* Founded */}
        <section id="founded">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#d63384' }}>Founded</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p>
              PrettyGals was officially founded in 2020 by a team of beauty lovers who believed makeup should be for everyone, not just a few. Since then, the brand has grown with the support of a strong community that values quality, affordability, and self-expression.
            </p>
            <p>
              PrettyGals began with a simple yet powerful vision — to make beauty inclusive, expressive, and accessible to all. What started as a small passion project by a group of makeup enthusiasts has now grown into a beloved beauty brand known for its trend-forward products and commitment to quality.
            </p>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#d63384' }}>Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { src: "https://i.pinimg.com/736x/a3/af/e1/a3afe1c2cb803c4911cb71d64d268b0d.jpg", alt: "Lipstick" },
              { src: "https://i.pinimg.com/736x/b3/9c/2f/b39c2fcef7374db0add758aec82fcbae.jpg", alt: "Foundation" },
              { src: "https://i.pinimg.com/736x/12/0f/89/120f897f1c8eacde4d58570859c0d1a8.jpg", alt: "Eyeshadow" },
              { src: "https://i.pinimg.com/736x/64/7e/41/647e416c34ca09961e2ea55f9180c81c.jpg", alt: "Perfume" },
              { src: "https://i.pinimg.com/736x/ba/62/f6/ba62f692af837cfd10eb5374aece2d21.jpg", alt: "Blush" },
              { src: "https://i.pinimg.com/736x/df/05/c1/df05c1e82dd645fe02acebe685686cde.jpg", alt: "Mascara" },
              { src: "https://i.pinimg.com/736x/31/dc/0b/31dc0b85bb32ec8bc8837d7a3fc8a1ac.jpg", alt: "Eyeliner" },
              { src: "https://i.pinimg.com/736x/61/a0/e5/61a0e5bc933992a5ae4e6a359fe518ab.jpg", alt: "Perfume" },
              { src: "https://i.pinimg.com/736x/6e/24/c2/6e24c26046a6b0d3a53afa5a2a566a87.jpg", alt: "Blush" },
              { src: "https://i.pinimg.com/736x/dc/99/2f/dc992f9aff8901276552e01cb64be7c9.jpg", alt: "Bronzer" }
            ].map((image, index) => (
              <div key={`about-image-${index}`} className="w-full h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={250}
                  height={250}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#d63384' }}>Our Services</h2>
          <ul className="space-y-3 text-lg list-disc pl-6">
            <li>Makeup consultations</li>
            <li>Beauty workshops & tutorials</li>
            <li>Online store with global delivery</li>
            <li>Monthly beauty drops and launches</li>
          </ul>
        </section>

        {/* Products */}
        <section id="products">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#d63384' }}>Our Best Products</h2>
          <ul className="space-y-3 text-lg list-disc pl-6">
            <li>Foundations</li>
            <li>Lipsticks</li>
            <li>Mascara</li>
            <li>Blush</li>
            <li>Perfume</li>
          </ul>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-white" style={{ backgroundColor: 'burlywood' }}>
        <p>&copy; 2025 PrettyGals. All rights reserved.</p>
      </footer>
    </div>
  )
}

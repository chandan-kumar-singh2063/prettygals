import { NextResponse } from 'next/server'
import connectToDatabase from '../../../lib/mongodb'
import Product from '../../../models/Product'

const sampleProducts = [
  {
    name: 'Rose Gold Lipstick',
    price: 25.99,
    category: 'lips',
    description: 'Beautiful rose gold lipstick with long-lasting formula',
    images: [{ 
      url: 'https://i.pinimg.com/564x/42/5e/e9/425ee9f6bd05ba7edc208705ee7bc79f.jpg',
      alt: 'Rose Gold Lipstick'
    }],
    brand: 'Beauty Pro',
    isActive: true,
    stock: 50
  },
  {
    name: 'Smokey Eye Palette',
    price: 45.99,
    category: 'eyes',
    description: 'Professional eyeshadow palette with 12 stunning shades',
    images: [{ 
      url: 'https://i.pinimg.com/564x/c6/92/45/c69245e7b0cc6229e85fc49822c33af6.jpg',
      alt: 'Smokey Eye Palette'
    }],
    brand: 'Glamour',
    isActive: true,
    stock: 30
  },
  {
    name: 'Foundation Cream',
    price: 35.99,
    category: 'face',
    description: 'Full coverage foundation for all skin types',
    images: [{ 
      url: 'https://i.pinimg.com/564x/02/b2/e0/02b2e040fba4fe08da108671d4c52304.jpg',
      alt: 'Foundation Cream'
    }],
    brand: 'Perfect Skin',
    isActive: true,
    stock: 25
  },
  {
    name: 'Vanilla Perfume',
    price: 55.99,
    category: 'perfume',
    description: 'Sweet vanilla fragrance with floral notes',
    images: [{ 
      url: 'https://i.pinimg.com/564x/14/53/54/145354416e2e0e888d35ab735f923268.jpg',
      alt: 'Vanilla Perfume'
    }],
    brand: 'Scent Divine',
    isActive: true,
    stock: 15
  },
  {
    name: 'Classic Red Lipstick',
    price: 22.99,
    category: 'lips',
    description: 'Timeless classic red lipstick for all occasions',
    images: [{ 
      url: 'https://i.pinimg.com/564x/e6/ad/82/e6ad8244c962e9c611bccc095419d8014.jpg',
      alt: 'Classic Red Lipstick'
    }],
    brand: 'Rouge Collection',
    isActive: true,
    stock: 40
  },
  {
    name: 'Mascara Volume',
    price: 19.99,
    category: 'eyes',
    description: 'Volume-boosting mascara for dramatic lashes',
    images: [{ 
      url: 'https://i.pinimg.com/564x/8b/de/64/8bde6471c645bcc069c20e53405ba2cb.jpg',
      alt: 'Mascara Volume'
    }],
    brand: 'Lash Pro',
    isActive: true,
    stock: 60
  }
]

export async function POST(request) {
  try {
    await connectToDatabase()
    
    // Clear existing products
    await Product.deleteMany({})
    
    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts)
    
    return NextResponse.json({
      success: true,
      message: 'Sample products created successfully',
      products: createdProducts
    })
    
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    await connectToDatabase()
    
    const products = await Product.find({})
    
    return NextResponse.json({
      success: true,
      products: products,
      count: products.length
    })
    
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}

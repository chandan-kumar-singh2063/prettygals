import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import Product from '../../../models/Product'

export async function GET(request) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit')) || 20
    const page = parseInt(searchParams.get('page')) || 1
    const id = searchParams.get('id')

    // Get single product by ID
    if (id) {
      const product = await Product.findById(id)
      if (!product) {
        return NextResponse.json(
          { success: false, message: 'Product not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        product
      })
    }

    // Get categories
    if (searchParams.get('categories') === 'true') {
      const categories = await Product.distinct('category')
      const formattedCategories = categories.map((cat, index) => ({
        id: index + 1,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        slug: cat
      }))
      
      return NextResponse.json({
        success: true,
        categories: formattedCategories
      })
    }

    // Build query
    let query = {}
    
    if (category) {
      query.category = category
    }
    
    if (subcategory) {
      query.subcategory = subcategory
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { features: { $elemMatch: { $regex: search, $options: 'i' } } }
      ]
    }

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query)
    
    // Get products with pagination
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        hasNext: page * limit < totalProducts,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'add':
        return handleAddProduct(body)
      
      case 'update':
        return handleUpdateProduct(body)
      
      case 'delete':
        return handleDeleteProduct(body)
      
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Products POST API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}

async function handleAddProduct(data) {
  const { name, category, subcategory, price, description, stock, features, brand } = data
  
  try {
    const newProduct = new Product({
      name,
      category,
      subcategory,
      price: parseFloat(price),
      description,
      stock: parseInt(stock) || 100,
      features: features || [],
      brand: brand || 'PrettyGals',
      images: [`/images/${category}/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`]
    })

    await newProduct.save()

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      product: newProduct
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error adding product: ' + error.message },
      { status: 500 }
    )
  }
}

async function handleUpdateProduct(data) {
  const { id, ...updateData } = data
  
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error updating product: ' + error.message },
      { status: 500 }
    )
  }
}

async function handleDeleteProduct(data) {
  const { id } = data
  
  try {
    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error deleting product: ' + error.message },
      { status: 500 }
    )
  }
}

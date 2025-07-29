import { NextResponse } from 'next/server'
import connectToDatabase from '../../../lib/mongodb'
import Cart from '../../../models/Cart'

export async function GET(request) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 400 }
      )
    }

    // Find user's cart
    let cart = await Cart.findOne({ userId })
    
    if (!cart) {
      cart = new Cart({ userId, items: [] })
      await cart.save()
    }

    const cartTotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0)

    return NextResponse.json({
      success: true,
      cart: cart.items,
      total: cartTotal,
      itemCount: itemCount
    })

  } catch (error) {
    console.error('Cart GET error:', error)
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
    console.log('Simple Cart POST - Body:', body)
    
    const { action, userId, productId, quantity, name, price, image } = body
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 400 }
      )
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({ userId, items: [] })
    }

    if (action === 'add') {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId)
      
      if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item
        cart.items.push({
          productId,
          name,
          price,
          image,
          quantity
        })
      }
      
    } else if (action === 'update') {
      const itemIndex = cart.items.findIndex(item => item.productId === productId)
      if (itemIndex > -1) {
        if (quantity > 0) {
          cart.items[itemIndex].quantity = quantity
        } else {
          cart.items.splice(itemIndex, 1)
        }
      }
      
    } else if (action === 'remove') {
      cart.items = cart.items.filter(item => item.productId !== productId)
      
    } else if (action === 'clear') {
      cart.items = []
    }

    await cart.save()
    console.log('Cart saved:', cart)

    const cartTotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0)

    return NextResponse.json({
      success: true,
      message: `Cart ${action} successful`,
      cart: cart.items,
      total: cartTotal,
      itemCount: itemCount
    })

  } catch (error) {
    console.error('Simple Cart POST error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { verifyToken } from '../../../lib/auth'
import connectToDatabase from '../../../lib/mongodb'
import User from '../../../models/User'
import Cart from '../../../models/Cart'

export async function GET(request) {
  try {
    console.log('Cart Simple Auth - Starting...')
    
    // Get token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Connect to database
    await connectToDatabase()
    
    // Get user
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    
    console.log('Cart Simple Auth - User authenticated:', user.email)
    
    // Find user's cart
    let cart = await Cart.findOne({ userId: user._id.toString() })
    
    if (!cart) {
      cart = new Cart({ userId: user._id.toString(), items: [] })
      await cart.save()
    }

    const cartTotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0)

    return NextResponse.json({
      success: true,
      cart: cart.items,
      total: cartTotal,
      itemCount: itemCount,
      userId: user._id.toString()
    })

  } catch (error) {
    console.error('Cart Simple Auth error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    console.log('Cart Simple Auth POST - Starting...')
    
    // Get token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Connect to database
    await connectToDatabase()
    
    // Get user
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    
    console.log('Cart Simple Auth POST - User authenticated:', user.email)
    
    const body = await request.json()
    console.log('Cart Simple Auth POST - Body:', body)
    
    const { action, productId, quantity, name, price, image } = body
    const userId = user._id.toString()

    // Find or create user's cart
    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({ userId, items: [] })
    }

    if (action === 'add') {
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId)
      
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity
      } else {
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
    console.error('Cart Simple Auth POST error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}

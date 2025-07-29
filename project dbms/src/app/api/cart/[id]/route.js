import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import connectDB from '../../../../lib/mongodb'
import User from '../../../../models/User'
import Cart from '../../../../models/Cart'

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    await connectDB()
    
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const productId = params.id

    const cart = await Cart.findOne({ userId: user._id.toString() })
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    // Remove item from cart
    cart.items = cart.items.filter(item => item.productId !== productId)
    await cart.save()

    const cartTotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0)

    return NextResponse.json({
      message: 'Item removed from cart',
      items: cart.items,
      total: cartTotal,
      itemCount: itemCount
    })

  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

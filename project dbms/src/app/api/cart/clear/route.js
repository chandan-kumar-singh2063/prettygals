import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import connectDB from '../../../../lib/mongodb'
import User from '../../../../models/User'
import Cart from '../../../../models/Cart'

export async function DELETE(request) {
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

    // Clear all items from cart
    await Cart.findOneAndUpdate(
      { userId: user._id.toString() },
      { items: [] },
      { upsert: true }
    )

    return NextResponse.json({
      message: 'Cart cleared successfully',
      items: [],
      total: 0,
      itemCount: 0
    })

  } catch (error) {
    console.error('Cart CLEAR error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import connectDB from '../../../../lib/mongodb'
import User from '../../../../models/User'

export async function GET(request, { params }) {
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

    const orderId = params.id
    
    // Find the order and verify it belongs to the user
    const mongoose = await import('mongoose');
    const db = mongoose.connection.db;
    
    const order = await db.collection('orders').findOne({ 
      _id: new mongoose.Types.ObjectId(orderId),
      user: user._id 
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)

  } catch (error) {
    console.error('Order GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

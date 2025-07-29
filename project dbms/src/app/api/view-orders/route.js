import { NextResponse } from 'next/server'
import connectToDatabase from '../../../lib/mongodb'

export async function GET() {
  try {
    await connectToDatabase()
    
    // Get MongoDB connection
    const mongoose = require('mongoose')
    const db = mongoose.connection.db
    
    // Get all orders from orders collection
    const orders = await db.collection('orders').find({}).toArray()
    
    return NextResponse.json({
      success: true,
      message: 'Orders retrieved successfully',
      totalOrders: orders.length,
      orders: orders
    })
    
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

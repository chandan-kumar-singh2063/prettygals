import { NextResponse } from 'next/server'
import connectToDatabase from '../../../lib/mongodb'

// Simple order creation for demonstration
export async function POST() {
  try {
    await connectToDatabase()
    
    // Get MongoDB connection
    const mongoose = require('mongoose')
    const db = mongoose.connection.db
    
    // Create a simple order document
    const orderData = {
      orderNumber: `PG${Date.now()}`,
      userName: 'chandan',
      userEmail: 'cks@gmail.com',
      products: [
        {
          productName: 'Rose Gold Lipstick',
          price: 25.99,
          quantity: 1,
          total: 25.99
        },
        {
          productName: 'Smokey Eye Palette', 
          price: 45.99,
          quantity: 1,
          total: 45.99
        }
      ],
      subtotal: 71.98,
      tax: 7.20,
      shipping: 5.99,
      totalAmount: 85.17,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      shippingAddress: {
        street: '123 Test Street',
        city: 'Kathmandu',
        state: 'Bagmati',
        zipCode: '44600',
        country: 'Nepal',
        phone: '9800000000'
      },
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
    
    // Insert directly into orders collection
    const result = await db.collection('orders').insertOne(orderData)
    
    return NextResponse.json({
      success: true,
      message: 'Order created successfully!',
      orderId: result.insertedId,
      orderNumber: orderData.orderNumber,
      order: orderData
    })
    
  } catch (error) {
    console.error('Simple order creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

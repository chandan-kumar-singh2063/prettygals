import { NextResponse } from 'next/server'
import connectToDatabase from '../../../lib/mongodb'

export async function POST() {
  try {
    await connectToDatabase()
    
    // Get MongoDB connection
    const mongoose = require('mongoose')
    const db = mongoose.connection.db
    
    // Create multiple orders with different users and products
    const orders = [
      {
        orderNumber: `PG${Date.now()}001`,
        userName: 'dipak',
        userEmail: 'dipak@gmail.com',
        products: [
          {
            productName: 'Foundation Cream',
            price: 35.99,
            quantity: 1,
            total: 35.99
          },
          {
            productName: 'Vanilla Perfume',
            price: 55.99,
            quantity: 1,
            total: 55.99
          }
        ],
        subtotal: 91.98,
        tax: 9.20,
        shipping: 0.00, // Free shipping over $50
        totalAmount: 101.18,
        paymentMethod: 'Khalti Payment',
        paymentStatus: 'Completed',
        orderStatus: 'Processing',
        shippingAddress: {
          street: '456 Beauty Street',
          city: 'Pokhara',
          state: 'Gandaki',
          zipCode: '33700',
          country: 'Nepal',
          phone: '9811111111'
        },
        orderDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
      },
      {
        orderNumber: `PG${Date.now()}002`,
        userName: 'Test User',
        userEmail: 'test@test.com',
        products: [
          {
            productName: 'Classic Red Lipstick',
            price: 22.99,
            quantity: 2,
            total: 45.98
          },
          {
            productName: 'Mascara Volume',
            price: 19.99,
            quantity: 1,
            total: 19.99
          }
        ],
        subtotal: 65.97,
        tax: 6.60,
        shipping: 0.00, // Free shipping over $50
        totalAmount: 72.57,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Confirmed',
        shippingAddress: {
          street: '789 Cosmetics Lane',
          city: 'Lalitpur',
          state: 'Bagmati',
          zipCode: '44700',
          country: 'Nepal',
          phone: '9822222222'
        },
        orderDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days
      }
    ]
    
    // Insert multiple orders
    const result = await db.collection('orders').insertMany(orders)
    
    return NextResponse.json({
      success: true,
      message: `${orders.length} orders created successfully!`,
      insertedCount: result.insertedCount,
      orderNumbers: orders.map(o => o.orderNumber),
      orders: orders
    })
    
  } catch (error) {
    console.error('Multiple orders creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

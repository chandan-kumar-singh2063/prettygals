import { NextResponse } from 'next/server'
import connectToDatabase from '../../../lib/mongodb'
import Order from '../../../models/Order'
import User from '../../../models/User'
import Product from '../../../models/Product'

export async function POST() {
  try {
    await connectToDatabase()
    
    // Get first user and some products for testing
    const user = await User.findOne({})
    const products = await Product.find({}).limit(2)
    
    if (!user) {
      return NextResponse.json({ error: 'No users found' }, { status: 400 })
    }
    
    if (products.length === 0) {
      return NextResponse.json({ error: 'No products found' }, { status: 400 })
    }
    
    // Create test order
    const orderItems = products.map(product => ({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      total: product.price
    }))
    
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1
    const shipping = 5.99
    const total = subtotal + tax + shipping
    
    const order = new Order({
      user: user._id,
      items: orderItems,
      shippingAddress: {
        name: user.name,
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Nepal',
        phone: '9800000000'
      },
      paymentMethod: 'cod',
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
      totalAmount: total,
      paymentStatus: 'completed',
      orderStatus: 'confirmed'
    })
    
    await order.save()
    
    // Populate the order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name brand category')
    
    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      order: populatedOrder
    })
    
  } catch (error) {
    console.error('Create test order error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

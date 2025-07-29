import { NextResponse } from 'next/server'
import connectToDatabase from '../../../lib/mongodb'
import Cart from '../../../models/Cart'
import User from '../../../models/User'
import Product from '../../../models/Product'
import Order from '../../../models/Order'

export async function GET(request) {
  try {
    await connectToDatabase()
    
    // Get all data for debugging
    const carts = await Cart.find({})
    const users = await User.find({}, { password: 0 }) // Exclude passwords
    const products = await Product.find({})
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name')
    
    return NextResponse.json({
      success: true,
      message: 'Debug data retrieved',
      data: {
        carts: carts,
        users: users,
        products: products,
        orders: orders,
        totalCarts: carts.length,
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length
      }
    })
    
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}

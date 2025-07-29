import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get recent orders (last 10)
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber orderStatus paymentStatus paymentMethod total createdAt updatedAt paymentDetails.khaltiTransactionId')
      .lean();

    console.log('=== DATABASE ORDER CHECK ===');
    console.log('Recent orders found:', orders.length);
    
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`);
      console.log('  - Order Number:', order.orderNumber);
      console.log('  - Order Status:', order.orderStatus);
      console.log('  - Payment Status:', order.paymentStatus);
      console.log('  - Payment Method:', order.paymentMethod);
      console.log('  - Total:', order.total);
      console.log('  - Created:', order.createdAt);
      console.log('  - Updated:', order.updatedAt);
      console.log('  - Transaction ID:', order.paymentDetails?.khaltiTransactionId || 'None');
      console.log('  ---');
    });

    return NextResponse.json({
      success: true,
      message: `Found ${orders.length} recent orders`,
      orders: orders
    });

  } catch (error) {
    console.error('Error checking orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check orders: ' + error.message
    }, { status: 500 });
  }
}

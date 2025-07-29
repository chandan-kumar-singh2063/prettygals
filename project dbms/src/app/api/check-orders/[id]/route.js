import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Order ID required'
      }, { status: 400 });
    }

    await connectDB();
    
    const order = await Order.findById(id).lean();

    if (!order) {
      console.log('Order not found with ID:', id);
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    console.log('=== SPECIFIC ORDER CHECK ===');
    console.log('Order ID:', order._id);
    console.log('Order Number:', order.orderNumber);
    console.log('Order Status:', order.orderStatus);
    console.log('Payment Status:', order.paymentStatus);
    console.log('Payment Method:', order.paymentMethod);
    console.log('Total:', order.total);
    console.log('Created:', order.createdAt);
    console.log('Updated:', order.updatedAt);
    console.log('Payment Details:', order.paymentDetails);
    console.log('User:', order.user);
    console.log('Items Count:', order.items?.length || 0);

    return NextResponse.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Error checking specific order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check order: ' + error.message
    }, { status: 500 });
  }
}

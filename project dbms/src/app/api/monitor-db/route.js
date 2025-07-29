import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Cart from '../../../models/Cart';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get the most recent orders with full details
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get all cart data
    const carts = await Cart.find().lean();

    console.log('=== REAL-TIME DATABASE STATUS ===');
    console.log('📊 Orders in database:', orders.length);
    console.log('🛒 Carts in database:', carts.length);
    console.log('');

    if (orders.length > 0) {
      console.log('📋 RECENT ORDERS:');
      orders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`);
        console.log(`  🆔 ID: ${order._id}`);
        console.log(`  📝 Order Number: ${order.orderNumber}`);
        console.log(`  📈 Order Status: ${order.orderStatus}`);
        console.log(`  💳 Payment Status: ${order.paymentStatus}`);
        console.log(`  💰 Total: Rs. ${order.total}`);
        console.log(`  🏪 Payment Method: ${order.paymentMethod}`);
        console.log(`  ⏰ Created: ${order.createdAt}`);
        if (order.paymentDetails?.khaltiTransactionId) {
          console.log(`  🔗 Transaction ID: ${order.paymentDetails.khaltiTransactionId}`);
        }
        console.log('  ---');
      });
    }

    if (carts.length > 0) {
      console.log('🛒 CARTS STATUS:');
      carts.forEach((cart, index) => {
        console.log(`Cart ${index + 1}:`);
        console.log(`  👤 User ID: ${cart.userId}`);
        console.log(`  📦 Items: ${cart.items?.length || 0}`);
        if (cart.items?.length > 0) {
          cart.items.forEach((item, i) => {
            console.log(`    ${i+1}. ${item.name} (Qty: ${item.quantity})`);
          });
        }
        console.log('  ---');
      });
    } else {
      console.log('🛒 No carts in database (all cleared) ✅');
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      orders: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
        paymentMethod: order.paymentMethod,
        transactionId: order.paymentDetails?.khaltiTransactionId || null,
        createdAt: order.createdAt
      })),
      carts: carts.map(cart => ({
        userId: cart.userId,
        itemCount: cart.items?.length || 0
      }))
    });

  } catch (error) {
    console.error('❌ Database monitor error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

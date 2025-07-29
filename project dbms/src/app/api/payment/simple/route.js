import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import Cart from '../../../../models/Cart';
import { verifyToken } from '../../../../lib/auth';
import User from '../../../../models/User';

export async function POST(request) {
  try {
    console.log('Payment Simple - Starting...')
    
    // Get token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Connect to database
    await connectDB()
    
    // Get user
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    
    console.log('Payment Simple - User authenticated:', user.email)

    const { phone, paymentMethod, cartItems, subtotal } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Calculate totals based on cart or use provided values
    const orderSubtotal = subtotal || 135; // Default for testing
    const tax = Math.round(orderSubtotal * 0.1 * 100) / 100;
    const shipping = orderSubtotal > 50 ? 0 : 5.99;
    const total = orderSubtotal + tax + shipping;

    // Create order with simple item structure
    const orderItems = cartItems && cartItems.length > 0 ? 
      cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })) : 
      [{
        productId: 'test-product',
        name: 'Beauty Product',
        quantity: 1,
        price: orderSubtotal,
        total: orderSubtotal
      }];
    
    const orderData = {
      user: user._id,
      items: orderItems,
      userEmail: user.email,
      userName: user.name,
      shippingAddress: { 
        phone,
        street: "Customer Address",
        city: "Customer City", 
        state: "Customer State",
        zipCode: "00000",
        country: "Nepal"
      },
      paymentMethod: paymentMethod || 'khalti',
      subtotal: orderSubtotal,
      tax,
      shipping,
      total,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      orderNumber: 'PG' + Date.now() + Math.floor(Math.random() * 1000),
      totalAmount: total,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert order into database using direct MongoDB connection
    const mongoose = await import('mongoose');
    const db = mongoose.connection.db;
    const result = await db.collection('orders').insertOne(orderData);
    const orderId = result.insertedId.toString();
    
    console.log('Payment Simple - Order created:', orderId);

    // Handle different payment methods
    if (paymentMethod === 'cod') {
      // Cash on Delivery - order is placed successfully
      return NextResponse.json({
        success: true,
        message: 'Order placed successfully',
        order_id: orderId,
        order_number: orderData.orderNumber,
        total: total,
        paymentMethod: 'cod'
      });
    }

    // Khalti payment integration
    const khaltiPayload = {
      return_url: `http://localhost:3001/payment/success?order_id=${orderId}`,
      website_url: 'http://localhost:3001',
      amount: Math.round(total * 100), // Convert to paisa (Khalti uses paisa)
      purchase_order_id: orderId,
      purchase_order_name: `PrettyGals Order ${orderData.orderNumber}`,
      customer_info: {
        name: user.name || 'Customer',
        email: user.email,
        phone: phone
      },
      product_details: orderItems.map(item => ({
        identity: item.productId,
        name: item.name,
        total_price: Math.round(item.total * 100),
        quantity: item.quantity,
        unit_price: Math.round(item.price * 100)
      }))
    };

    // Call Khalti payment initiation API
    const khaltiResponse = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.KHALTI_SECRET_KEY || 'test_secret_key_f59e8b7d18b4499ca40f68195a846e9b'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(khaltiPayload)
    });

    if (!khaltiResponse.ok) {
      const errorData = await khaltiResponse.text();
      console.error('Khalti API error:', errorData);
      return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
    }

    const khaltiData = await khaltiResponse.json();
    console.log('Khalti Payment Initiated:', khaltiData);

    // Return the Khalti payment URL for redirection
    return NextResponse.json({
      success: true,
      message: 'Khalti payment initiated successfully',
      order_id: orderId,
      order_number: orderData.orderNumber,
      total: total,
      payment_url: khaltiData.payment_url,
      pidx: khaltiData.pidx
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}

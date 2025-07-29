import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Cart from '../../../models/Cart';
import { verifyToken } from '../../../lib/auth';

export async function POST(request) {
  try {
    console.log('Payment API - Starting...');
    
    const { cart, user, total, paymentMethod, phone } = await request.json();

    if (!cart || !user || !total || !paymentMethod || !phone) {
      return NextResponse.json({ 
        error: 'Missing required fields: cart, user, total, paymentMethod, phone' 
      }, { status: 400 });
    }

    await connectDB();

    // Calculate order totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const calculatedTotal = subtotal + tax + shipping;

    // Create order data
    const orderData = {
      user: user.id,
      orderNumber: 'PG' + Date.now() + Math.floor(Math.random() * 1000),
      items: cart.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      subtotal,
      tax,
      shipping,
      total: calculatedTotal,
      totalAmount: calculatedTotal,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingAddress: {
        name: user.name,
        phone: phone,
        email: user.email,
        street: "Customer Address",
        city: "Customer City",
        state: "Customer State",
        zipCode: "00000",
        country: "Nepal"
      }
    };

    console.log('Creating order with data:', orderData);

    // Create order in database
    let order;
    try {
      order = new Order(orderData);
      await order.save();
      console.log('Order created successfully:', order._id);
    } catch (validationError) {
      console.error('Order validation failed:', validationError.message);
      console.error('Validation details:', validationError.errors);
      return NextResponse.json({ 
        error: 'Order validation failed: ' + validationError.message,
        details: validationError.errors
      }, { status: 400 });
    }

    // Handle Khalti payment only
    if (paymentMethod === 'khalti') {
      const khaltiPayload = {
        return_url: `http://localhost:3001/payment/success?order_id=${order._id}`,
        website_url: 'http://localhost:3001',
        amount: Math.round(calculatedTotal * 100), // Convert to paisa
        purchase_order_id: order._id.toString(),
        purchase_order_name: `PrettyGals Order ${order.orderNumber}`,
        customer_info: {
          name: user.name || 'Customer',
          email: user.email,
          phone: phone
        },
        product_details: order.items.map(item => ({
          identity: item.productId,
          name: item.name,
          total_price: Math.round(item.total * 100),
          quantity: item.quantity,
          unit_price: Math.round(item.price * 100)
        }))
      };

      console.log('Initiating Khalti payment:', khaltiPayload);

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
        
        // Mark order as failed
        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
        await order.save();
        
        return NextResponse.json({ 
          error: 'Payment initiation failed. Please try again.' 
        }, { status: 500 });
      }

      const khaltiData = await khaltiResponse.json();
      console.log('Khalti payment initiated:', khaltiData);

      // Store Khalti payment details in order
      order.paymentDetails = {
        pidx: khaltiData.pidx,
        paymentUrl: khaltiData.payment_url
      };
      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Khalti payment initiated successfully',
        order_id: order._id.toString(),
        order_number: order.orderNumber,
        total: calculatedTotal,
        payment_url: khaltiData.payment_url,
        pidx: khaltiData.pidx
      });
    }

    return NextResponse.json({ 
      error: 'Unsupported payment method' 
    }, { status: 400 });

  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}
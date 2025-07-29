import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/auth';
import User from '../../../../models/User';
import Order from '../../../../models/Order';
import Cart from '../../../../models/Cart';
import Product from '../../../../models/Product';

export async function POST(request) {
  try {
    console.log('Payment Initiate - Starting...')
    
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
    
    console.log('Payment Initiate - User authenticated:', user.email)

    const { phone, paymentMethod, price } = await request.json();

    if (!phone || !paymentMethod || !price) {
      return NextResponse.json(
        { error: 'Phone number, payment method, and price are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user's cart using the simple cart model
    const simpleCart = await Cart.findOne({ userId: user._id.toString() });
    if (!simpleCart || simpleCart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of simpleCart.items) {
      // Get product details to validate stock
      const product = await Product.findById(item.productId);
      
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${item.name || 'Unknown'} is no longer available` },
          { status: 400 }
        );
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        );
      }
      
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null
      });
      
      // Update product stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Calculate tax and shipping
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Create order
    const order = new Order({
      user: user._id,
      items: orderItems,
      shippingAddress: { 
        phone,
        street: "Default Street",
        city: "Default City", 
        state: "Default State",
        zipCode: "12345",
        country: "India"
      },
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending'
    });

    await order.save();

    // For Khalti payment
    if (paymentMethod === 'khalti') {
      const khaltiPayload = {
        return_url: `http://localhost:3001/payment/verify?order_id=${order._id}`,
        website_url: 'http://localhost:3001',
        amount: Math.round(total * 100), // Convert to paisa
        purchase_order_id: order._id.toString(),
        purchase_order_name: `Beauty Store Order ${order._id}`,
        customer_info: {
          name: user.name,
          email: user.email,
          phone: phone || '9800000000'
        },
        product_details: orderItems.map(item => ({
          identity: item.product.toString(),
          name: item.name,
          total_price: Math.round(item.price * item.quantity * 100),
          quantity: item.quantity,
          unit_price: Math.round(item.price * 100)
        }))
      };

      const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(khaltiPayload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Khalti API error:', errorData);
        return NextResponse.json(
          { error: 'Payment initiation failed' },
          { status: 500 }
        );
      }

      const paymentData = await response.json();

      // Update order with payment details
      order.paymentDetails = {
        khaltiToken: paymentData.pidx,
        khaltiAmount: total
      };
      await order.save();

      return NextResponse.json({
        success: true,
        payment_url: paymentData.payment_url,
        order_id: order._id,
        pidx: paymentData.pidx
      });
    }

    // For COD, clear cart and confirm order
    if (paymentMethod === 'cod') {
      simpleCart.items = [];
      await simpleCart.save();
      
      order.orderStatus = 'confirmed';
      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Order placed successfully',
        order_id: order._id
      });
    }

    return NextResponse.json(
      { error: 'Invalid payment method' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

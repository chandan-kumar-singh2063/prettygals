import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import { verifyToken, requireAuth } from '../../../lib/auth';
import User from '../../../models/User';

// Get user's orders
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    await connectDB()
    
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Fetch user's orders from database
    const mongoose = await import('mongoose');
    const db = mongoose.connection.db;
    
    const orders = await db.collection('orders').find({ 
      user: user._id 
    }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email
      },
      orders: orders
    })
    
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new order
export const POST = requireAuth(async (req) => {
  try {
    await connectDB();
    
    const { 
      shippingAddress, 
      paymentMethod, 
      paymentIntentId = null 
    } = await req.json();
    
    // Validation
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Shipping address and payment method are required' },
        { status: 400 }
      );
    }
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of cart.items) {
      const product = item.product;
      
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${product?.name || 'Unknown'} is no longer available` },
          { status: 400 }
        );
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
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
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentIntentId,
      subtotal,
      tax,
      shipping,
      total,
      paymentStatus: paymentIntentId ? 'completed' : 'pending',
      orderStatus: 'pending'
    });
    
    await order.save();
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    return NextResponse.json({
      message: 'Order created successfully',
      order
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}); 
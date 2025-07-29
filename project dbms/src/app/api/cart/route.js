import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Cart from '../../../models/Cart';
import Product from '../../../models/Product';
import { requireAuth } from '../../../lib/auth';

// Get user's cart
export const GET = requireAuth(async (req) => {
  try {
    await connectDB();
    
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images brand stock');
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }
    
    // Calculate total
    let total = 0;
    cart.items.forEach(item => {
      if (item.product) {
        total += item.product.price * item.quantity;
      }
    });
    
    cart.total = total;
    await cart.save();
    
    return NextResponse.json({ 
      success: true,
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
});

// Add item to cart
export const POST = requireAuth(async (req) => {
  try {
    await connectDB();
    
    const { productId, quantity = 1, selectedColor, selectedSize } = await req.json();
    
    if (!productId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Product ID is required' 
        },
        { status: 400 }
      );
    }
    
    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Product not found or unavailable' 
        },
        { status: 404 }
      );
    }
    
    if (product.stock < quantity) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Insufficient stock' 
        },
        { status: 400 }
      );
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        selectedColor,
        selectedSize
      });
    }
    
    await cart.save();
    
    // Populate product details
    await cart.populate('items.product', 'name price images brand stock');
    
    // Calculate total
    let total = 0;
    cart.items.forEach(item => {
      if (item.product) {
        total += item.product.price * item.quantity;
      }
    });
    
    cart.total = total;
    await cart.save();
    
    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
});

// Update cart item
export const PUT = requireAuth(async (req) => {
  try {
    await connectDB();
    
    const { itemId, quantity } = await req.json();
    
    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Item ID and quantity are required' 
        },
        { status: 400 }
      );
    }
    
    if (quantity < 1) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Quantity must be at least 1' 
        },
        { status: 400 }
      );
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cart not found' 
        },
        { status: 404 }
      );
    }
    
    const item = cart.items.id(itemId);
    if (!item) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Item not found in cart' 
        },
        { status: 404 }
      );
    }
    
    // Check stock
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Insufficient stock' 
        },
        { status: 400 }
      );
    }
    
    item.quantity = quantity;
    await cart.save();
    
    await cart.populate('items.product', 'name price images brand stock');
    
    // Calculate total
    let total = 0;
    cart.items.forEach(item => {
      if (item.product) {
        total += item.product.price * item.quantity;
      }
    });
    
    cart.total = total;
    await cart.save();
    
    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
});

// Remove item from cart
export const DELETE = requireAuth(async (req) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    
    if (!itemId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Item ID is required' 
        },
        { status: 400 }
      );
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cart not found' 
        },
        { status: 404 }
      );
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    await cart.populate('items.product', 'name price images brand stock');
    
    // Calculate total
    let total = 0;
    cart.items.forEach(item => {
      if (item.product) {
        total += item.product.price * item.quantity;
      }
    });
    
    cart.total = total;
    await cart.save();
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
});

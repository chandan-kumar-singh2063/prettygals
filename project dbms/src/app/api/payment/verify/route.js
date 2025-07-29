import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import Cart from '../../../../models/Cart';

export async function POST(request) {
  try {
    console.log('=== PAYMENT VERIFICATION POST START ===');
    const { pidx, order_id } = await request.json();
    console.log('POST Verification - PIDX:', pidx, 'Order ID:', order_id);

    if (!pidx || !order_id) {
      console.log('POST Verification - Missing parameters');
      return NextResponse.json({ 
        success: false, 
        message: 'Payment index and order ID required' 
      }, { status: 400 });
    }

    // Verify payment with Khalti
    console.log('POST Verification - Calling Khalti API...');
    
    // Handle test data - if pidx starts with 'test', simulate successful verification
    if (pidx.startsWith('test')) {
      console.log('POST Verification - Test data detected, simulating success...');
      await connectDB();

      // Find and update the order
      const order = await Order.findById(order_id);
      if (!order) {
        console.log('POST Verification - Order not found:', order_id);
        return NextResponse.json({ 
          success: false, 
          message: 'Order not found' 
        }, { status: 404 });
      }

      // Update order status to completed
      order.orderStatus = 'completed';
      order.paymentStatus = 'completed';
      await order.save();
      console.log('POST Verification - Order updated to completed (test mode)');

      // Clear user's cart
      await Cart.deleteMany({ userId: order.userId });
      console.log('POST Verification - Cart cleared for test user');

      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully (test mode)',
        order: order 
      });
    }

    const response = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pidx })
    });

    if (!response.ok) {
      console.log('POST Verification - Khalti API failed:', response.status);
      
      // For non-test data, if Khalti returns 404, it means invalid pidx
      if (response.status === 404) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid payment reference. This payment may not exist or has expired.' 
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        success: false, 
        message: 'Payment verification service temporarily unavailable. Please try again later.' 
      }, { status: 503 });
    }

    const verificationData = await response.json();
    console.log('POST Verification - Khalti response:', verificationData);

    if (verificationData.status === 'Completed') {
      console.log('POST Verification - Payment completed, updating order...');
      await connectDB();

      // Find and update the order
      const order = await Order.findById(order_id);
      if (!order) {
        console.log('POST Verification - Order not found:', order_id);
        return NextResponse.json({ 
          success: false, 
          message: 'Order not found' 
        }, { status: 404 });
      }

      console.log('POST Verification - Order found, updating status...');
      console.log('POST Verification - Current order status:', order.orderStatus, 'payment status:', order.paymentStatus);
      
      // Update order - payment successful
      order.paymentStatus = 'completed';
      order.orderStatus = 'completed';  // Changed from 'confirmed' to 'completed'
      
      if (!order.paymentDetails) {
        order.paymentDetails = {};
      }
      
      order.paymentDetails.khaltiTransactionId = verificationData.transaction_id;
      order.paymentDetails.paymentDate = new Date();
      order.paymentDetails.verificationData = verificationData;
      
      await order.save();
      console.log('POST Verification - Order updated successfully:');
      console.log('POST Verification - Order Number:', order.orderNumber);
      console.log('POST Verification - Order Status:', order.orderStatus);
      console.log('POST Verification - Payment Status:', order.paymentStatus);
      console.log('POST Verification - Transaction ID:', order.paymentDetails.khaltiTransactionId);
      console.log('POST Verification - Payment Date:', order.paymentDetails.paymentDate);

      // Clear user's cart
      try {
        await Cart.findOneAndUpdate(
          { userId: order.user.toString() }, // Convert ObjectId to string
          { items: [] }
        );
        console.log('POST Verification - Cart cleared for user:', order.user.toString());
      } catch (cartError) {
        console.error('POST Verification - Error clearing cart:', cartError);
      }

      console.log('POST Verification - Sending success response');
      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully',
        order: {
          orderNumber: order.orderNumber,
          status: order.orderStatus,
          total: order.total
        }
      });
    } else {
      console.log('POST Verification - Payment not completed, status:', verificationData.status);
      return NextResponse.json({ 
        success: false, 
        message: 'Payment not completed' 
      });
    }

  } catch (error) {
    console.error('POST Verification - Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    console.log('=== PAYMENT VERIFICATION GET START ===');
    const { searchParams } = new URL(request.url);
    const pidx = searchParams.get('pidx');
    const order_id = searchParams.get('order_id');
    const status = searchParams.get('status');
    const transaction_id = searchParams.get('transaction_id');
    
    console.log('GET Verification - Parameters:', { pidx, order_id, status, transaction_id });

    if (!pidx || !order_id) {
      console.log('GET Verification - Missing parameters, redirecting to cart');
      return NextResponse.redirect(new URL('/cart?error=invalid_payment', request.url));
    }

    // Redirect to payment success page with parameters for client-side verification
    const successUrl = new URL(`/payment/success?pidx=${pidx}&order_id=${order_id}`, request.url);
    console.log('GET Verification - Redirecting to:', successUrl.toString());
    
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('GET Verification - Error:', error);
    return NextResponse.redirect(new URL('/cart?error=verification_failed', request.url));
  }
}
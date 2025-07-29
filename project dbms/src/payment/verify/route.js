import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import Subscription from '@/models/Subscription';

export async function POST(request) {
  try {
    const { pidx } = await request.json();

    if (!pidx) {
      return NextResponse.json({ error: 'Payment index required' }, { status: 400 });
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
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
    }

    const paymentData = await response.json();

    if (paymentData.status === 'Completed') {
      await connectDb();

      const subscription = await Subscription.findOne({
        'paymentHistory.pidx': pidx
      });

      if (subscription) {
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

        await Subscription.findOneAndUpdate(
          { _id: subscription._id, 'paymentHistory.pidx': pidx },
          {
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: currentPeriodEnd,
            $set: {
              'paymentHistory.$.status': 'completed',
              'paymentHistory.$.transactionId': paymentData.transaction_id,
              'paymentHistory.$.paidAt': new Date()
            }
          }
        );

        return NextResponse.json({ 
          success: true, 
          message: 'Payment verified and subscription activated' 
        });
      }
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Payment not completed or subscription not found' 
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
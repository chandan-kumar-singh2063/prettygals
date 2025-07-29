'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Home, ShoppingBag, Loader, XCircle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useApp } from '../../../context/AppContext';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { clearCart } = useApp();
  
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  
  // Extract parameters with fallbacks and clean them
  const rawOrderId = searchParams.get('order_id') || searchParams.get('order') || searchParams.get('purchase_order_id');
  const orderId = rawOrderId ? rawOrderId.replace(/\/\?.*$/, '') : null; // Remove /?... from order_id
  const pidx = searchParams.get('pidx') || searchParams.get('idx');
  const status = searchParams.get('status');
  
  // Enhanced logging
  console.log('=== PAYMENT SUCCESS PAGE LOADED ===');
  console.log('Success Page - Current URL:', typeof window !== 'undefined' ? window.location.href : 'URL not available');
  console.log('Success Page - All URL params:', Object.fromEntries(searchParams.entries()));
  console.log('Success Page - Raw Order ID:', rawOrderId);
  console.log('Success Page - Cleaned Order ID:', orderId);
  console.log('Success Page - PIDX:', pidx);
  console.log('Success Page - Status:', status);
  console.log('Success Page - Verified:', verified);
  console.log('Success Page - Verifying:', verifying);
  
  // Update debug info for display
  useEffect(() => {
    setDebugInfo({
      url: typeof window !== 'undefined' ? window.location.href : 'URL not available',
      params: Object.fromEntries(searchParams.entries()),
      rawOrderId,
      orderId,
      pidx,
      status,
      verified,
      verifying,
      verificationAttempted
    });
  }, [searchParams, rawOrderId, orderId, pidx, status, verified, verifying, verificationAttempted]);

  useEffect(() => {
    console.log('Success Page - useEffect triggered');
    console.log('Success Page - Parameters check:', { pidx, orderId, verified, verifying, verificationAttempted });
    
    // Only attempt verification once, if we have both pidx and order_id, and haven't attempted yet
    if (pidx && orderId && !verified && !verifying && !verificationAttempted) {
      console.log('Success Page - Starting payment verification...');
      setVerificationAttempted(true); // Mark as attempted immediately to prevent re-runs
      verifyKhaltiPayment();
    } else {
      console.log('Success Page - Verification not triggered:', {
        hasPidx: !!pidx,
        hasOrderId: !!orderId,
        verified,
        verifying,
        verificationAttempted
      });
    }
  }, [pidx, orderId]); // Remove verified and verifying from dependencies to prevent loops

  const verifyKhaltiPayment = async () => {
    console.log('Success Page - verifyKhaltiPayment called');
    setVerifying(true);
    try {
      console.log('Success Page - Making verification request to /api/payment/verify');
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pidx: pidx,
          order_id: orderId
        })
      });

      console.log('Success Page - Verification response status:', response.status);
      const data = await response.json();
      console.log('Success Page - Verification response data:', data);
      
      if (data.success) {
        console.log('Success Page - Payment verification successful');
        setVerified(true);
        setVerifying(false); // Stop the verifying state
        setOrderData(data.order);
        showSuccess('Payment verified successfully!');
        // Clear cart after successful payment verification
        try {
          const clearResult = await clearCart();
          if (clearResult.success) {
            console.log('Success Page - Cart cleared successfully');
          } else {
            console.log('Success Page - Cart clear failed:', clearResult.message);
          }
        } catch (clearError) {
          console.log('Success Page - Cart clear error:', clearError);
        }
      } else {
        console.log('Success Page - Payment verification failed:', data.message);
        showError(data.message || 'Payment verification failed');
        // Don't redirect immediately, let user see the error
        setVerifying(false);
        setVerificationAttempted(true); // Ensure we don't retry
      }
    } catch (error) {
      console.error('Success Page - Payment verification error:', error);
      showError('Failed to verify payment');
      setVerifying(false);
      setVerificationAttempted(true); // Ensure we don't retry
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Payment...
            </h1>
            
            <p className="text-gray-600">
              Please wait while we verify your payment with Khalti.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If verification has been attempted but failed (and we're not verifying), show error state
  if (verificationAttempted && !verified && !verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Verification Failed
            </h1>
            
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment with Khalti. This might be due to test data or network issues.
            </p>

            {/* Debug Information - Remove in production */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Debug Info:</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <div>URL: {debugInfo.url}</div>
                <div>Raw Order ID: {debugInfo.rawOrderId || 'Not found'}</div>
                <div>Cleaned Order ID: {debugInfo.orderId || 'Not found'}</div>
                <div>PIDX: {debugInfo.pidx || 'Not found'}</div>
                <div>Status: {debugInfo.status || 'Not found'}</div>
                <div>Verified: {debugInfo.verified ? 'Yes' : 'No'}</div>
                <div>Verifying: {debugInfo.verifying ? 'Yes' : 'No'}</div>
                <div>Verification Attempted: {debugInfo.verificationAttempted ? 'Yes' : 'No'}</div>
                <div>All Params: {JSON.stringify(debugInfo.params)}</div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/cart"
                className="flex items-center justify-center w-full bg-pink-500 text-white py-3 px-4 rounded-md hover:bg-pink-600 transition-colors font-medium"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Back to Cart
              </Link>
              
              <Link
                href="/"
                className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your payment has been processed successfully and your order has been confirmed.
          </p>

          {/* Debug Information - Remove in production */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Debug Info:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div>URL: {debugInfo.url}</div>
              <div>Raw Order ID: {debugInfo.rawOrderId || 'Not found'}</div>
              <div>Cleaned Order ID: {debugInfo.orderId || 'Not found'}</div>
              <div>PIDX: {debugInfo.pidx || 'Not found'}</div>
              <div>Status: {debugInfo.status || 'Not found'}</div>
              <div>Verified: {debugInfo.verified ? 'Yes' : 'No'}</div>
              <div>Verifying: {debugInfo.verifying ? 'Yes' : 'No'}</div>
              <div>Verification Attempted: {debugInfo.verificationAttempted ? 'Yes' : 'No'}</div>
              <div>All Params: {JSON.stringify(debugInfo.params)}</div>
            </div>
          </div>

          {(orderId || orderData) && (
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <p className="text-sm text-gray-600">
                Order ID: <span className="font-medium text-gray-900">{orderData?.orderNumber || orderId}</span>
              </p>
              {orderData && (
                <>
                  <p className="text-sm text-gray-600 mt-1">
                    Status: <span className="font-medium text-green-600">{orderData.status}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: <span className="font-medium text-gray-900">Rs. {orderData.total}</span>
                  </p>
                </>
              )}
              <p className="text-sm text-gray-600 mt-1">
                You'll receive an email confirmation shortly.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Link
              href="/orders"
              className="flex items-center justify-center w-full bg-pink-500 text-white py-3 px-4 rounded-md hover:bg-pink-600 transition-colors font-medium"
            >
              <Package className="w-5 h-5 mr-2" />
              View My Orders
            </Link>
            
            <Link
              href="/products"
              className="flex items-center justify-center w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="text-left space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>You'll receive an email confirmation with your order details</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>We'll notify you when your order ships</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Track your order in your account dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

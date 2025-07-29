'use client';

import Link from 'next/link';
import { XCircle, RefreshCw, Home, ShoppingBag } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 mb-6">
            We're sorry, but your payment could not be processed. This could be due to insufficient funds, network issues, or other payment-related problems.
          </p>

          <div className="bg-red-50 rounded-md p-4 mb-6">
            <p className="text-sm text-red-700">
              Don't worry, your order has been saved and you can try the payment again.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/cart"
              className="flex items-center justify-center w-full bg-pink-500 text-white py-3 px-4 rounded-md hover:bg-pink-600 transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Payment Again
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="text-left space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Check your payment method and try again</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Ensure you have sufficient funds in your account</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Contact our support team if the issue persists</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

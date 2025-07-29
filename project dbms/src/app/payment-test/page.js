'use client'

import { useState } from 'react'

export default function PaymentTestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const testPayment = async (amount = 135) => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please login first')
        return
      }

      console.log('Testing payment with amount:', amount)

      const response = await fetch('/api/payment/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: '9841234567',
          paymentMethod: 'khalti',
          cartItems: [{
            productId: '507f1f77bcf86cd799439011',
            name: 'Test Beauty Product',
            quantity: 1,
            price: amount
          }],
          subtotal: amount
        }),
      })

      const data = await response.json()
      console.log('Payment response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      setResult(data)

      // Redirect to Khalti payment page
      if (data.payment_url) {
        console.log('Redirecting to Khalti:', data.payment_url)
        window.location.href = data.payment_url
      }

    } catch (error) {
      console.error('Payment test error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Khalti Payment Test
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            <h3 className="font-bold">Payment Initiated Successfully!</h3>
            <p>Order ID: {result.order_id}</p>
            <p>Order Number: {result.order_number}</p>
            <p>Total: NPR {result.total}</p>
            <p>Payment URL: <a href={result.payment_url} className="underline" target="_blank">{result.payment_url}</a></p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Khalti Payment Integration</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => testPayment(135)}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Test Payment NPR 135'}
            </button>

            <button
              onClick={() => testPayment(250)}
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Test Payment NPR 250'}
            </button>

            <button
              onClick={() => testPayment(500)}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Test Payment NPR 500'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold text-gray-900 mb-2">Test Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Make sure you're logged in</li>
              <li>Click any test payment button</li>
              <li>You'll be redirected to Khalti payment page</li>
              <li>Use Khalti test credentials to complete payment</li>
              <li>You'll be redirected back to success page</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

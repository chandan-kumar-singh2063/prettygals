'use client';

import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function CompleteTestPage() {
  const { 
    login, 
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    user, 
    cart, 
    cartItemCount, 
    cartTotal,
    isAuthenticated 
  } = useApp();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Test credentials
  const testCredentials = {
    email: 'test@prettygals.com',
    password: 'test123'
  };

  const testProduct = {
    id: 'complete-test-product',
    name: 'Complete Test Product',
    price: 29.99,
    image: 'https://via.placeholder.com/150'
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('Logging in...');
    
    try {
      const result = await login(testCredentials.email, testCredentials.password);
      if (result.success) {
        setMessage('✅ Login successful!');
      } else {
        setMessage(`❌ Login failed: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setMessage('❌ Please login first');
      return;
    }

    setLoading(true);
    setMessage('Adding to cart...');
    
    try {
      const result = await addToCart(testProduct, 1);
      if (result.success) {
        setMessage('✅ Product added to cart!');
      } else {
        setMessage(`❌ Add to cart failed: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Add to cart error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async () => {
    if (!cart || cart.length === 0) {
      setMessage('❌ No items in cart to update');
      return;
    }

    setLoading(true);
    setMessage('Updating quantity...');
    
    try {
      const result = await updateCartQuantity(cart[0].productId, cart[0].quantity + 1);
      if (result.success) {
        setMessage('✅ Quantity updated!');
      } else {
        setMessage(`❌ Update failed: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Update error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async () => {
    if (!cart || cart.length === 0) {
      setMessage('❌ No items in cart to remove');
      return;
    }

    setLoading(true);
    setMessage('Removing item...');
    
    try {
      const result = await removeFromCart(cart[0].productId);
      if (result.success) {
        setMessage('✅ Item removed!');
      } else {
        setMessage(`❌ Remove failed: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Remove error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (!cart || cart.length === 0) {
      setMessage('❌ Cart is already empty');
      return;
    }

    setLoading(true);
    setMessage('Clearing cart...');
    
    try {
      const result = await clearCart();
      if (result.success) {
        setMessage('✅ Cart cleared!');
      } else {
        setMessage(`❌ Clear failed: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Clear error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Cart Test</h1>
        
        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
            </div>
            <div>
              <p><strong>Cart Items:</strong> {cartItemCount}</p>
              <p><strong>Cart Total:</strong> NPR {cartTotal?.toFixed(2) || '0.00'}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={handleLogin}
              disabled={loading || isAuthenticated}
              className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isAuthenticated ? 'Already Logged In' : 'Login Test User'}
            </button>
            
            <button
              onClick={handleAddToCart}
              disabled={loading || !isAuthenticated}
              className="bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
              Add Test Product
            </button>
            
            <button
              onClick={handleUpdateQuantity}
              disabled={loading || !cart || cart.length === 0}
              className="bg-yellow-500 text-white py-3 px-4 rounded-md hover:bg-yellow-600 disabled:bg-gray-400"
            >
              Update Quantity (+1)
            </button>
            
            <button
              onClick={handleRemoveItem}
              disabled={loading || !cart || cart.length === 0}
              className="bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400"
            >
              Remove First Item
            </button>
            
            <button
              onClick={handleClearCart}
              disabled={loading || !cart || cart.length === 0}
              className="bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-2">Last Action Result:</h3>
            <p className={`p-3 rounded-md ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </p>
          </div>
        )}

        {/* Cart Contents */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cart Contents</h2>
          {cart && cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={item.productId || `complete-test-item-${index}`} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">ID: {item.productId}</p>
                    <p className="text-sm text-gray-600">Price: NPR {item.price}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-lg">NPR {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-4 border-t">
                <p className="text-xl font-bold text-right">Total: NPR {cartTotal?.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Cart is empty</p>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>First, click "Login Test User" to authenticate</li>
            <li>Then click "Add Test Product" to add an item to cart</li>
            <li>Use "Update Quantity (+1)" to test the + button functionality</li>
            <li>Use "Remove First Item" to test the delete functionality</li>
            <li>Use "Clear Cart" to test clearing all items</li>
            <li>Check the navbar for cart badge updates</li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/cart"
            className="bg-pink-500 text-white px-6 py-3 rounded-md hover:bg-pink-600 mr-4"
          >
            Go to Cart Page
          </a>
          <a 
            href="/auth/register"
            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600"
          >
            Register New User
          </a>
        </div>
      </div>
    </div>
  );
}

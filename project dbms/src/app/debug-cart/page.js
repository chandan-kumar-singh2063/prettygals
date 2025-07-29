'use client';

import { useApp } from '../../context/AppContext';
import { useEffect } from 'react';

export default function DebugCartPage() {
  const { 
    cart, 
    cartItemCount, 
    cartTotal, 
    user, 
    isAuthenticated, 
    loading,
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    addToCart
  } = useApp();

  useEffect(() => {
    console.log('Cart Debug - Current State:', {
      cart,
      cartItemCount,
      cartTotal,
      user,
      isAuthenticated,
      loading
    });
  }, [cart, cartItemCount, cartTotal, user, isAuthenticated, loading]);

  const testProduct = {
    id: 'debug-test-product',
    name: 'Debug Test Product',
    price: 19.99,
    image: 'https://via.placeholder.com/100'
  };

  const handleAddTest = async () => {
    console.log('Adding test product...');
    const result = await addToCart(testProduct, 1);
    console.log('Add to cart result:', result);
  };

  const handleUpdateTest = async () => {
    if (cart && cart.length > 0) {
      console.log('Updating quantity...');
      await updateCartQuantity(cart[0].productId, cart[0].quantity + 1);
    }
  };

  const handleRemoveTest = async () => {
    if (cart && cart.length > 0) {
      console.log('Removing item...');
      await removeFromCart(cart[0].productId);
    }
  };

  const handleClearTest = async () => {
    console.log('Clearing cart...');
    await clearCart();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Cart Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Debug Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Cart Items Count:</strong> {cartItemCount}</p>
              <p><strong>Cart Total:</strong> NPR {cartTotal?.toFixed(2) || '0.00'}</p>
              <p><strong>Cart Array Length:</strong> {cart?.length || 0}</p>
              <p><strong>Token in Storage:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-y-3">
              <button
                onClick={handleAddTest}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                disabled={!user}
              >
                Add Test Product
              </button>
              <button
                onClick={handleUpdateTest}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                disabled={!cart || cart.length === 0}
              >
                Update First Item Quantity
              </button>
              <button
                onClick={handleRemoveTest}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                disabled={!cart || cart.length === 0}
              >
                Remove First Item
              </button>
              <button
                onClick={handleClearTest}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                disabled={!cart || cart.length === 0}
              >
                Clear Cart
              </button>
            </div>
            {!user && (
              <p className="text-red-500 text-sm mt-4">Please login first to test cart functions</p>
            )}
          </div>
        </div>

        {/* Cart Contents */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Cart Contents</h2>
          {cart && cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={item.productId || `debug-cart-item-${index}`} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Product ID: {item.productId}</p>
                      <p className="text-sm text-gray-600">Price: NPR {item.price}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold">NPR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Cart is empty</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/auth/login"
            className="bg-pink-500 text-white px-6 py-3 rounded-md hover:bg-pink-600 mr-4"
          >
            Login
          </a>
          <a 
            href="/cart"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
          >
            Go to Cart Page
          </a>
        </div>
      </div>
    </div>
  );
}

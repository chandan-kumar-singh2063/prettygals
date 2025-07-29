'use client';

import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function CartTestPage() {
  const { user, isAuthenticated, addToCart, cart, cartItemCount, cartTotal, login, register } = useApp();
  const [testProduct] = useState({
    id: 'test-1',
    name: 'Test Lipstick',
    price: 25.99,
    image: 'https://i.pinimg.com/564x/42/5e/e9/425ee9f6bd05ba7edc208705ee7bc79f.jpg'
  });
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '' 
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginForm.email, loginForm.password);
    if (result.success) {
      alert('Login successful!');
    } else {
      alert('Login failed: ' + result.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(registerForm);
    if (result.success) {
      alert('Registration successful! Please login.');
    } else {
      alert('Registration failed: ' + result.message);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(testProduct, 1);
    if (result.success) {
      alert('Added to cart successfully!');
    } else {
      alert('Failed to add to cart: ' + result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Cart Test Page</h1>
      
      {/* User Status */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">User Status</h2>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        {user && (
          <div>
            <p><strong>User:</strong> {user.name} ({user.email})</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
        )}
      </div>

      {/* Cart Status */}
      <div className="bg-green-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Cart Status</h2>
        <p><strong>Items in Cart:</strong> {cartItemCount}</p>
        <p><strong>Cart Total:</strong> ${cartTotal?.toFixed(2) || '0.00'}</p>
        <div className="mt-2">
          <strong>Cart Items:</strong>
          {cart && cart.length > 0 ? (
            <ul className="list-disc list-inside mt-1">
              {cart.map((item, index) => (
                <li key={item.productId || `cart-item-${index}`}>
                  {item.name} - Qty: {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No items in cart</p>
          )}
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Login Form */}
          <div className="bg-white p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Login</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div className="bg-white p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Register</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Test Cart Functionality */
        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Test Cart Functionality</h3>
          <div className="border p-4 rounded-lg mb-4">
            <h4 className="font-medium">Test Product:</h4>
            <p><strong>Name:</strong> {testProduct.name}</p>
            <p><strong>Price:</strong> ${testProduct.price}</p>
            <p><strong>ID:</strong> {testProduct.id}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-pink-600 text-white py-2 px-6 rounded-md hover:bg-pink-700"
          >
            Add Test Product to Cart
          </button>
        </div>
      )}

      {/* Debug Links */}
      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Debug Links</h3>
        <div className="space-x-4">
          <a 
            href="/api/debug" 
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            View Database Debug Info
          </a>
          <a 
            href="/api/seed" 
            target="_blank"
            className="text-green-600 hover:underline"
          >
            View Sample Products
          </a>
        </div>
      </div>
    </div>
  );
}

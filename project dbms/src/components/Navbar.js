'use client';

import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, User, Package, LogOut, Home } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, cartItemCount, logout } = useApp();
  const { showInfo } = useToast();

  const handleLogout = async () => {
    const userName = user?.name;
    await logout();
    showInfo(`Goodbye, ${userName}! Come back soon.`);
  };

  return (
        <nav className="bg-pink-600 bg-opacity-90 shadow-lg border-b border-pink-700 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-pink-600 text-white p-2 rounded-full">
                <span className="font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-white font-serif italic">PrettyGals</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/products" 
              className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
            >
              <span>Shop</span>
            </Link>

            {isAuthenticated && (
              <>
                {/* <Link 
                  href="/orders" 
                  className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </Link> */}

                <Link 
                  href="/cart" 
                  className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 relative transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white">Welcome, {user?.name}</span>
                </div>

                {/* Mobile Cart */}
                <Link 
                  href="/cart" 
                  className="md:hidden text-white hover:text-pink-200 p-2 rounded-md relative transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/auth/login" 
                  className="text-white hover:text-pink-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-white text-pink-600 hover:bg-pink-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Products
              </Link>
              <Link 
                href="/orders" 
                className="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                My Orders
              </Link>
              <div className="px-3 py-2 text-sm text-gray-500">
                Welcome, {user?.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, cartItemCount, isAuthenticated, cart } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Beauty Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-pink-500 transition-colors">
              Products
            </Link>
            <Link href="/products/face" className="text-gray-600 hover:text-pink-500 transition-colors">
              Face
            </Link>
            <Link href="/products/eyes" className="text-gray-600 hover:text-pink-500 transition-colors">
              Eyes
            </Link>
            <Link href="/products/lips" className="text-gray-600 hover:text-pink-500 transition-colors">
              Lips
            </Link>
            <Link href="/products/perfume" className="text-gray-600 hover:text-pink-500 transition-colors">
              Perfume
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative text-gray-600 hover:text-pink-500 transition-colors">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors">
                  <User size={20} />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  {/* <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link> */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-pink-500 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/" className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                Home
              </Link>
              <Link href="/products" className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                Products
              </Link>
              <Link href="/products/face" className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                Face
              </Link>
              <Link href="/products/eyes" className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                Eyes
              </Link>
              <Link href="/products/lips" className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                Lips
              </Link>
              <Link href="/products/perfume" className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                Perfume
              </Link>
              
              {/* Mobile User Actions */}
              <div className="pt-4 border-t">
                <Link href="/cart" className="flex items-center px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                  <ShoppingCart size={20} className="mr-2" />
                  Cart ({cartItemCount})
                </Link>
                
                {user ? (
                  <div className="space-y-1">
                    <Link href="/profile" className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors"
                    >
                      <LogOut size={20} className="mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link href="/auth/login" className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors">
                      Login
                    </Link>
                    <Link href="/auth/register" className="block px-3 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

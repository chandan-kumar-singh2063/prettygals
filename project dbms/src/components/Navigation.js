import Link from 'next/link';
import { useApp } from '../context/AppContext';

export default function Navigation() {
  const { user, isAuthenticated, logout, cartItemCount } = useApp();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-pink-600">
              Beauty Store
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/products" className="text-gray-700 hover:text-pink-600">
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/cart" className="text-gray-700 hover:text-pink-600 relative">
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <span className="text-gray-700">Hello, {user?.name}</span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-pink-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-pink-600">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
                  Register
                </Link>
              </>
            )}
            
            <Link href="/cart-test" className="text-gray-500 text-sm">
              Test
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

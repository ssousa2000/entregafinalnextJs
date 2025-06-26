'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            E-Store
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`font-medium ${isActive('/') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className={`font-medium ${isActive('/products') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Products
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600">
              <FiShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="text-gray-600 hover:text-indigo-600">
                  <FiUser size={24} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  <span className="block px-4 py-2 text-sm text-gray-700">{user.displayName || user.email}</span>
                  {user.isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="text-gray-600 hover:text-indigo-600">
                <FiUser size={24} />
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-4 py-4">
              <Link 
                href="/" 
                className={`font-medium ${isActive('/') ? 'text-indigo-600' : 'text-gray-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className={`font-medium ${isActive('/products') ? 'text-indigo-600' : 'text-gray-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <div className="flex space-x-6 pt-4 border-t">
                <Link 
                  href="/cart" 
                  className="relative text-gray-600 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiShoppingCart size={20} />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute top-0 left-4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                {user ? (
                  <>
                    {user.isAdmin && (
                      <Link href="/admin" className="text-gray-600 flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                        <span>Admin</span>
                      </Link>
                    )}
                    <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-gray-600 flex items-center space-x-2">
                      <FiUser size={20} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/auth/login" 
                    className="text-gray-600 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser size={20} />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header; 
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartContent() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push('/auth/login?redirect=/cart');
      return;
    }
    setIsCheckingOut(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          items: cart,
          totalAmount: totalPrice,
          shippingAddress: {
            ...shippingInfo,
            country: 'Argentina', // Assuming a default country
            phone: '123456789' // Placeholder phone
          }
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Order placed successfully! Order ID: ${data.orderId}`);
        clearCart();
        setTimeout(() => {
          setIsCheckingOut(false);
          setSuccessMessage('');
        }, 3000);
      } else {
        setError(data.error || 'There was an error processing your order.');
      }
    } catch (err: any) {
      setError('A network or server error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage && cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Purchase Successful!</h2>
        <p className="text-gray-600 mb-8">{successMessage}</p>
        <Link 
          href="/products"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <FiShoppingBag size={64} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven&apos;t added any products to your cart yet.
        </p>
        <Link 
          href="/products"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="lg:w-2/3">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Product</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Quantity</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Total</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cart.map((item) => (
                <tr key={item.product.id}>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-16 w-16 relative mr-4">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded-md" />
                        )}
                      </div>
                      <div>
                        <Link href={`/products/${item.product.id}`} className="font-medium hover:text-indigo-600">
                          {item.product.name}
                        </Link>
                        {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                          <div className="mt-1 text-sm text-gray-500">
                            {Object.entries(item.selectedVariants).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">${item.product.price.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="w-8 h-8 bg-gray-100 rounded-l-md flex items-center justify-center border border-gray-300"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                        className="w-12 h-8 border-t border-b border-gray-300 text-center"
                      />
                      <button
                        type="button"
                        className="w-8 h-8 bg-gray-100 rounded-r-md flex items-center justify-center border border-gray-300"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Link
            href="/products"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          
          <button
            type="button"
            className="w-full bg-indigo-600 text-white py-3 mt-6 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </button>
          
          <button
            type="button"
            className="w-full border border-gray-300 text-gray-700 py-3 mt-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
            <form onSubmit={handleCheckout}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="fullName" id="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input type="text" name="street" id="street" value={shippingInfo.street} onChange={handleShippingChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" id="city" value={shippingInfo.city} onChange={handleShippingChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input type="text" name="postalCode" id="postalCode" value={shippingInfo.postalCode} onChange={handleShippingChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Placing Order...' : `Pay $${totalPrice.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
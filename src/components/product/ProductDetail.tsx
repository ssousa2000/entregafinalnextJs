'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: string}>({});
  const { addToCart } = useCart();

  const handleQuantityChange = (newValue: number) => {
    if (newValue < 1) return;
    if (newValue > product.stock) return;
    setQuantity(newValue);
  };

  const handleVariantChange = (variantId: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantId]: option
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="w-full md:w-1/2 p-6">
          <Link 
            href="/products" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <FiArrowLeft className="mr-2" /> Back to Products
          </Link>
          
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-indigo-600 mb-4">${product.price.toFixed(2)}</p>
          
          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {/* Product variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              {product.variants.map(variant => (
                <div key={variant.id} className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    {variant.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(option => (
                      <button
                        key={option}
                        type="button"
                        className={`px-4 py-2 border rounded-md ${
                          selectedVariants[variant.id] === option
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-300 text-gray-700 hover:border-indigo-300'
                        }`}
                        onClick={() => handleVariantChange(variant.id, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Quantity selector */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                type="button"
                className="w-10 h-10 bg-gray-100 rounded-l-md flex items-center justify-center border border-gray-300"
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={product.stock}
                className="w-16 h-10 border-t border-b border-gray-300 text-center"
              />
              <button
                type="button"
                className="w-10 h-10 bg-gray-100 rounded-r-md flex items-center justify-center border border-gray-300"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
              
              <span className="ml-4 text-gray-500">
                {product.stock} items available
              </span>
            </div>
          </div>
          
          {/* Add to cart button */}
          <button
            type="button"
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <FiShoppingCart className="mr-2" />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
} 
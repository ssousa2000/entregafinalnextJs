'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div 
          key={product.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
        >
          <Link href={`/products/${product.id}`} className="block relative h-56">
            <div className="w-full h-full bg-gray-200">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              )}
            </div>
          </Link>
          
          <div className="p-4">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-indigo-600">{product.name}</h3>
            </Link>
            
            <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">${(product.price || 0).toFixed(2)}</span>
              
              <button 
                onClick={() => handleAddToCart(product)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiShoppingCart size={16} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
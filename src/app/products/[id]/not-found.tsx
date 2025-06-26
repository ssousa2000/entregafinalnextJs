import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
      <p className="text-gray-600 mb-8 text-lg">
        Sorry, we couldn&apos;t find the product you&apos;re looking for.
      </p>
      
      <Link 
        href="/products" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-lg"
      >
        <FiArrowLeft className="mr-2" /> Back to Products
      </Link>
    </div>
  );
} 
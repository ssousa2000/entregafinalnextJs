'use client';

import Link from 'next/link';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      
      <ul className="space-y-2">
        <li key="all">
          <Link 
            href="/products"
            className={`block px-3 py-2 rounded-md transition-colors ${
              !selectedCategory 
                ? 'bg-indigo-100 text-indigo-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Products
          </Link>
        </li>
        
        {categories.map(category => (
          <li key={category.id}>
            <Link 
              href={`/products?category=${category.slug}`}
              className={`block px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category.slug 
                  ? 'bg-indigo-100 text-indigo-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 
import { getAllProducts, getAllCategories } from '@/lib/firebase/products';
import ProductGrid from '@/components/product/ProductGrid';
import CategoryFilter from '@/components/product/CategoryFilter';
import { Suspense } from 'react';
import Loading from '@/components/ui/Loading';
import { Metadata } from 'next';
import { Product, Category } from '@/types';

export const metadata: Metadata = {
  title: 'All Products | E-Store',
  description: 'Browse our complete collection of products',
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = searchParams;

  try {
    const products: Product[] = await getAllProducts();
    const categories: Category[] = await getAllCategories();

    const filteredProducts = category
      ? products.filter(product => product.category === category)
      : products;

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <CategoryFilter categories={categories} selectedCategory={category} />
          </aside>
          <main className="md:col-span-3">
            <Suspense fallback={<Loading />}>
              {filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center h-full flex flex-col justify-center">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No products found</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {category
                      ? `No products available in the "${category}" category.`
                      : 'No products available at the moment.'}
                  </p>
                </div>
              )}
            </Suspense>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500">Could not load products. Please check the server console for more details.</p>
      </div>
    );
  }
} 
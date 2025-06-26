import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/firebase/products';
import ProductGrid from '@/components/product/ProductGrid';

export default async function Home() {
  const categories = [
    { name: 'Electronics', image: '/images/electronics.jpg', slug: 'electronics' },
    { name: 'Clothing', image: '/images/clothing.jpg', slug: 'clothing' },
    { name: 'Home & Kitchen', image: '/images/home-kitchen.jpg', slug: 'home-kitchen' },
    { name: 'Books', image: '/images/books.jpg', slug: 'books' },
  ];

  const featuredProducts = await getFeaturedProducts(4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to E-Store</h1>
          <p className="text-xl mb-8">Your one-stop shop for all your daily needs</p>
          <Link 
            href="/products"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              href={`/products?category=${category.slug}`}
              key={category.slug}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="h-48 relative">
                  <div className="w-full h-full bg-gray-200"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link 
            href="/products"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View All
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <p className="text-center text-gray-500">No featured products available. Mark some in your admin panel!</p>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
        <p className="text-gray-600 mb-6">Stay updated with our latest products and offers</p>
        <div className="max-w-md mx-auto flex">
          <input 
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg font-medium hover:bg-indigo-700 transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}

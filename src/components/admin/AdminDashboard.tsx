'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminTabs from './AdminTabs';
import ProductsTab from './ProductsTab';
import Loading from '../ui/Loading';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');

  // Redirect if user is not logged in or not an admin
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  // User is not logged in or not an admin
  if (!user || !user.isAdmin) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="p-6">
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <div>Orders management coming soon</div>}
        {activeTab === 'categories' && <div>Categories management coming soon</div>}
      </div>
    </div>
  );
} 
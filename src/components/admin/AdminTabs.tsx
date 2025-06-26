'use client';

import { FiBox, FiShoppingCart, FiList } from 'react-icons/fi';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
  const tabs = [
    { id: 'products', label: 'Products', icon: FiBox },
    { id: 'orders', label: 'Orders', icon: FiShoppingCart },
    { id: 'categories', label: 'Categories', icon: FiList }
  ];

  return (
    <div className="border-b flex overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <tab.icon className="mr-2" size={18} />
          {tab.label}
        </button>
      ))}
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProduct from './admin/AddProduct';
import ManageProducts from './admin/ManageProducts';
import Orders from './admin/Orders';
import PromoCodes from './admin/PromoCodes';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add-product');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'add-product', label: 'ADD PRODUCT' },
    { id: 'manage-products', label: 'MANAGE PRODUCTS' },
    { id: 'orders', label: 'ORDERS' },
    { id: 'promo-codes', label: 'PROMO CODES' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#02173A]">SHOES BRAND Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition">
            LOGOUT
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-[#02173A] text-white'
                    : 'bg-gray-200 text-[#02173A] hover:bg-gray-300'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'add-product' && <AddProduct />}
        {activeTab === 'manage-products' && <ManageProducts />}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'promo-codes' && <PromoCodes />}
      </div>
    </div>
  );
};

export default AdminDashboard;

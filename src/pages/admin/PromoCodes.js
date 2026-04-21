import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../../config/api';

const PromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    discount: '',
    validDays: '',
    maxUses: '',
    code: ''
  });

  const discounts = ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
  const validDaysOptions = [
    { label: '1 Day', value: '1' },
    { label: '2 Days', value: '2' },
    { label: '3 Days', value: '3' },
    { label: '4 Days', value: '4' },
    { label: '5 Days', value: '5' },
    { label: '6 Days', value: '6' },
    { label: '1 Week', value: '7' },
    { label: '10 Days', value: '10' },
    { label: '2 Weeks', value: '14' },
    { label: '1 Month', value: '30' },
    { label: '2 Months', value: '60' }
  ];

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/promo-codes`);
      setPromoCodes(response.data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load promo codes',
        confirmButtonColor: '#000'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code.match(/^[A-Z0-9]+$/)) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Code must be in English (uppercase letters and numbers only)',
        confirmButtonColor: '#000'
      });
      return;
    }

    try {
      Swal.fire({
        title: 'Creating...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await axios.post(`${API_URL}/api/promo-codes/create`, formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: 'Promo code created successfully',
        confirmButtonColor: '#000',
        timer: 2000
      });
      
      setFormData({ discount: '', validDays: '', maxUses: '', code: '' });
      fetchPromoCodes();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create promo code',
        confirmButtonColor: '#000'
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const deletePromoCode = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This promo code will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/api/promo-codes/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Promo code deleted successfully',
        confirmButtonColor: '#000',
        timer: 2000
      });
      fetchPromoCodes();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete promo code',
        confirmButtonColor: '#000'
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Promo Codes</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4">Create New Promo Code</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Discount Percentage</label>
            <select
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black"
              required>
              <option value="">Select Discount</option>
              {discounts.map(d => (
                <option key={d} value={d}>{d}%</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Valid Duration</label>
            <select
              value={formData.validDays}
              onChange={(e) => setFormData({ ...formData, validDays: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black"
              required>
              <option value="">Select Duration</option>
              {validDaysOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Maximum Uses</label>
            <input
              type="number"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black"
              min="1"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Promo Code Name (English only)</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black"
              placeholder="e.g., SUMMER2024"
              pattern="[A-Z0-9]+"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
            GENERATE CODE
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading codes...</p>
        </div>
      ) : promoCodes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🎟️</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Promo Codes Yet</h3>
          <p className="text-gray-500">Create a new promo code using the form above</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Active Promo Codes</h3>
          {promoCodes.map(promo => (
          <div key={promo._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-2xl font-bold text-green-600">{promo.code}</h4>
                <p className="text-gray-600">{promo.discount}% Discount</p>
              </div>
              <span className={`px-4 py-2 rounded-full font-bold ${
                promo.isActive && new Date() < new Date(promo.expiresAt)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {promo.isActive && new Date() < new Date(promo.expiresAt) ? 'Active' : 'Expired'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-600">Created:</p>
                <p className="font-semibold">{formatDate(promo.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600">Expires:</p>
                <p className="font-semibold">{formatDate(promo.expiresAt)}</p>
              </div>
              <div>
                <p className="text-gray-600">Uses:</p>
                <p className="font-semibold">{promo.currentUses} / {promo.maxUses}</p>
              </div>
              <div>
                <p className="text-gray-600">Valid Days:</p>
                <p className="font-semibold">{promo.validDays} days</p>
              </div>
            </div>
            
            <button
              onClick={() => deletePromoCode(promo._id)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-700 transition">
              DELETE CODE
            </button>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default PromoCodes;

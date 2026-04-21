import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

const CreateAdmin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/create`, formData);
      setMessage('Admin created successfully! You can now login.');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Failed to create admin'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#02173A]">Create Admin Account</h1>
        <p className="text-center text-gray-600 mb-6">City Fragrance Admin Panel</p>
        {message && (
          <p className={`mb-4 text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-[#02173A]">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#02173A]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-[#02173A]">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#02173A]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#02173A] text-white py-3 rounded-lg font-bold hover:bg-[#031e47] transition">
            CREATE ADMIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;

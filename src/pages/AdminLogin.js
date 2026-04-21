import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, formData);
      if (response.data.success) {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md border-2 border-black">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black">SHOES BRAND</h1>
          <p className="text-gray-600">Admin Panel</p>
        </div>
        
        {error && (
          <div className="bg-black text-white p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-black">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-black">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AddProduct from './AddProduct';
import API_URL from '../../config/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load products',
        confirmButtonColor: '#000'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, images) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: 'Deleting...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // الصور دلوقتي Base64 في MongoDB، مش محتاجين نحذفها من Cloudinary
      // Delete product
      await axios.delete(`${API_URL}/api/products/${id}`);
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Product deleted successfully',
        confirmButtonColor: '#000',
        timer: 2000
      });
      
      fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete product',
        confirmButtonColor: '#000'
      });
    }
  };

  const toggleBestSeller = async (id) => {
    try {
      const product = products.find(p => p._id === id);
      
      // Only allow best seller for Shoes
      if (product.category !== 'Shoes') {
        Swal.fire({
          icon: 'warning',
          title: 'Not Allowed',
          text: 'Only Shoes can be marked as Best Sellers',
          confirmButtonColor: '#000'
        });
        return;
      }
      
      await axios.put(`${API_URL}/api/products/bestseller/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      fetchProducts();
    } catch (error) {
      if (error.response?.status === 400) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: error.response.data.message,
          confirmButtonColor: '#000'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update product status',
          confirmButtonColor: '#000'
        });
      }
    }
  };

  const toggleSoldOut = async (id) => {
    try {
      await axios.put(`${API_URL}/api/sold-out/product/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update product status',
        confirmButtonColor: '#000'
      });
    }
  };

  if (editingProduct) {
    return (
      <div>
        <button
          onClick={() => setEditingProduct(null)}
          className="mb-4 bg-gray-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700">
          ← BACK TO PRODUCTS
        </button>
        <AddProduct
          editProduct={editingProduct}
          onSave={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mb-4"></div>
        <p className="text-xl font-bold text-gray-700">Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <span className="text-gray-600">
          {products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !filterCategory || product.category === filterCategory;
            let matchesStatus = true;
            if (filterStatus === 'available') matchesStatus = !product.isSoldOut;
            else if (filterStatus === 'soldout') matchesStatus = product.isSoldOut;
            else if (filterStatus === 'bestseller') matchesStatus = product.isBestSeller;
            return matchesSearch && matchesCategory && matchesStatus;
          }).length} Products Found
        </span>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
          
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black">
            <option value="">All Categories</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black">
            <option value="all">All Products</option>
            <option value="available">Available</option>
            <option value="soldout">Sold Out</option>
            <option value="bestseller">Best Sellers</option>
          </select>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Yet</h3>
          <p className="text-gray-500">Add new products from the "ADD PRODUCT" tab</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(() => {
            const filteredProducts = products.filter(product => {
              const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   product.description.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesCategory = !filterCategory || product.category === filterCategory;
              let matchesStatus = true;
              if (filterStatus === 'available') matchesStatus = !product.isSoldOut;
              else if (filterStatus === 'soldout') matchesStatus = product.isSoldOut;
              else if (filterStatus === 'bestseller') matchesStatus = product.isBestSeller;
              return matchesSearch && matchesCategory && matchesStatus;
            });

            if (filteredProducts.length === 0) {
              return (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCategory('');
                      setFilterStatus('all');
                    }}
                    className="mt-4 bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
                    Clear Filters
                  </button>
                </div>
              );
            }

            return filteredProducts.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full md:w-48 h-48 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl md:text-2xl mb-2 break-words">{product.name}</h3>
                <p className="text-gray-700 font-bold text-lg md:text-xl mb-3">{product.price} EGP</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 break-words">{product.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition text-sm">
                    EDIT
                  </button>
                  
                  <button
                    onClick={() => handleDelete(product._id, product.images)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-700 transition text-sm">
                    DELETE
                  </button>
                  
                  <button
                    onClick={() => toggleBestSeller(product._id)}
                    className={`py-2 px-4 rounded-lg font-bold transition text-sm ${
                      product.isBestSeller
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}>
                    {product.isBestSeller ? '⭐ BEST' : 'ADD BEST'}
                  </button>
                  
                  <button
                    onClick={() => toggleSoldOut(product._id)}
                    className={`py-2 px-4 rounded-lg font-bold transition text-sm ${
                      product.isSoldOut
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    disabled={product.category === 'Shoes'}>
                    {product.category === 'Accessories' 
                      ? (product.isSoldOut ? '✓ AVAILABLE' : '✗ SOLD OUT')
                      : 'N/A (Shoes)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

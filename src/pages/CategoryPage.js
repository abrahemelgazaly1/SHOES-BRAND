import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProductCard from '../components/ProductCard';
import API_URL from '../config/api';

const CategoryPage = ({ addToCart, addToWishlist }) => {
  const { name } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategoryProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products?category=${name}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching category products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load category products',
        confirmButtonColor: '#02173A'
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#02173A] mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#02173A]">{name}</h1>
      <input
        type="text"
        placeholder="Search in this category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md mx-auto block px-4 py-3 mb-8 border border-gray-300 rounded-lg focus:outline-none focus:border-[#02173A]"
      />
      
      {categoryProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌸</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h2>
          <p className="text-gray-500">There are no products in this category at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {categoryProducts.map(product => (
            <ProductCard 
              key={product._id} 
              product={product} 
              addToCart={addToCart} 
              addToWishlist={addToWishlist} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

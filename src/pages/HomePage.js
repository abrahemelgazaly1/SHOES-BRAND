import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const HomePage = ({ addToCart, addToWishlist }) => {
  const navigate = useNavigate();
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [accessoriesProducts, setAccessoriesProducts] = useState([]);
  const [faqOpen, setFaqOpen] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      const allProducts = response.data;
      
      // Get best seller shoes only
      const bestSellers = allProducts.filter(p => p.isBestSeller && p.category === 'Shoes');
      setBestSellerProducts(bestSellers);
      
      // Get all accessories
      const accessories = allProducts.filter(p => p.category === 'Accessories');
      setAccessoriesProducts(accessories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "What is the return policy?",
      answer: "We accept returns within 1 day of delivery. If you're not satisfied with your purchase, contact us within 24 hours and we'll help you with the return process."
    },
    {
      question: "When will I get my order?",
      answer: "Orders are typically processed within 1-2 business days. Delivery time depends on your location, but most orders arrive within 3-7 business days after shipping."
    },
    {
      question: "How much does shipping cost?",
      answer: "Shipping costs 120 EGP for all orders within Egypt. This flat rate applies regardless of order size or location within the country."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-end justify-center pb-10 md:pb-12">
        {/* Hero Image */}
        <img 
          src="/hero.webp" 
          alt="City Fragrance Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Shop All Button */}
        <button 
          onClick={() => navigate('/products')}
          className="relative z-10 bg-white text-black text-lg md:text-xl font-bold px-8 py-3 rounded-lg border-2 border-white shadow-xl tracking-wide">
          Shop All
        </button>
      </section>

      {/* About Us Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">About Us</h1>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            We are dedicated to bringing you the finest quality shoes with exceptional craftsmanship. 
            Our passion is sourcing the best materials and designs from around the world to ensure 
            every pair meets the highest standards. We believe in style, comfort, and durability, 
            delivering premium footwear that exceeds expectations. Your satisfaction is our priority, 
            and we're committed to providing an outstanding shopping experience with every step you take.
          </p>
        </div>
      </section>

      {/* Best Seller Shoes Section - Horizontal Slider */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-black">BEST SELLERS</h2>
            <p className="text-gray-600 text-lg">Check our best seller shoes</p>
          </div>
          
          {bestSellerProducts.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {bestSellerProducts.map(product => (
                <div key={product._id} className="min-w-[300px] flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition" onClick={() => navigate(`/product/${product._id}`)}>
                  {/* Product Image */}
                  <div className="relative h-[300px] overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    {/* Name */}
                    <h3 className="font-bold text-lg text-black line-clamp-1 mb-3">{product.name}</h3>
                    
                    {/* Available Colors - Show immediately */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-3">
                        <div className="flex gap-2 flex-wrap">
                          {product.colors.slice(0, 6).map((color, idx) => {
                            const colorMap = {
                              'Red': '#FF0000', 'Blue': '#0000FF', 'Green': '#008000', 
                              'Yellow': '#FFFF00', 'Black': '#000000', 'White': '#FFFFFF',
                              'Purple': '#800080', 'Pink': '#FFC0CB', 'Orange': '#FFA500',
                              'Brown': '#A52A2A', 'Gray': '#808080', 'Navy': '#000080',
                              'Beige': '#F5F5DC', 'Maroon': '#800000', 'Turquoise': '#40E0D0'
                            };
                            return (
                              <div 
                                key={idx} 
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: colorMap[color] || color }}
                                title={color}
                              />
                            );
                          })}
                          {product.colors.length > 6 && (
                            <span className="text-xs text-gray-500 self-center">+{product.colors.length - 6}</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Available Sizes */}
                    <div className="mb-3">
                      <div className="flex gap-1 flex-wrap">
                        {product.sizes?.slice(0, 5).map(size => (
                          <span key={size} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-700">
                            {size}
                          </span>
                        ))}
                        {product.sizes?.length > 5 && (
                          <span className="px-2 py-1 text-xs text-gray-500">+{product.sizes.length - 5}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Price */}
                    <p className="text-xl font-bold text-black mt-3">{product.price} EGP</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No best sellers available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Accessories Section - Horizontal Slider */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-black">ACCESSORIES</h2>
            <p className="text-gray-600 text-lg">Check our Accessories</p>
          </div>
          
          {accessoriesProducts.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {accessoriesProducts.map(product => (
                <div key={product._id} className="min-w-[300px] flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition" onClick={() => navigate(`/product/${product._id}`)}>
                  {/* Product Image */}
                  <div className="relative h-[300px] overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    {/* Name */}
                    <h3 className="font-bold text-lg text-black line-clamp-2 mb-3">{product.name}</h3>
                    
                    {/* Price */}
                    <p className="text-xl font-bold text-black">{product.price} EGP</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No accessories available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-black">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-black">{faq.question}</span>
                  <span className={`text-2xl text-black transition-transform ${faqOpen[index] ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {faqOpen[index] && (
                  <div className="px-6 pb-4 bg-gray-50">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

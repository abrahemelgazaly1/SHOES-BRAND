import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WishlistPage = ({ wishlist, removeFromWishlist }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-black">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 mb-6">Your wishlist is empty</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {wishlist.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
              <div className="h-36 overflow-hidden bg-gray-50">
                <img 
                  src={item.images?.[0] || item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-base mb-1 text-black">{item.name}</h3>
                <p className="text-gray-700 font-bold text-lg mb-2">{item.price} EGP</p>
                <button 
                  onClick={() => navigate(`/product/${item._id || item.id}`)}
                  className="w-full bg-black text-white py-2 rounded-lg font-bold mb-2 hover:bg-gray-800 transition text-sm">
                  VIEW PRODUCT
                </button>
                <button 
                  onClick={() => removeFromWishlist(index)}
                  className="w-full bg-white text-black border-2 border-black py-2 rounded-lg font-bold hover:bg-gray-100 transition text-sm">
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

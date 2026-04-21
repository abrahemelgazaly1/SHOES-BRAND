import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProductCard from '../components/ProductCard';
import API_URL from '../config/api';

const ProductDetailsPage = ({ addToCart, addToWishlist }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [accessoriesProducts, setAccessoriesProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(response.data);
      setMainImage(response.data.images[0]);
      
      // Fetch all products
      const allProductsResponse = await axios.get(`${API_URL}/api/products`);
      const otherProducts = allProductsResponse.data.filter(p => p._id !== id);
      
      // If current product is SHOES, get ACCESSORIES for separate section
      if (response.data.category === 'Shoes') {
        const accessories = otherProducts.filter(p => p.category === 'Accessories');
        const shuffledAccessories = accessories.sort(() => 0.5 - Math.random());
        setAccessoriesProducts(shuffledAccessories.slice(0, 4));
      }
      
      // Get 4 random SHOES only for "You May Also Like"
      const shoesOnly = otherProducts.filter(p => p.category === 'Shoes');
      const shuffled = shoesOnly.sort(() => 0.5 - Math.random());
      const randomProducts = shuffled.slice(0, 4);
      
      setRelatedProducts(randomProducts);
    } catch (error) {
      console.error('Error fetching product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load product',
        confirmButtonColor: '#02173A'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#02173A] mb-4"></div>
        <p className="text-xl font-bold text-gray-700">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 bg-[#02173A] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#031e47] transition">
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.isSoldOut) {
      Swal.fire({
        icon: 'error',
        title: 'Sold Out',
        text: 'This product is currently sold out',
        confirmButtonColor: '#02173A'
      });
      return;
    }
    
    // For Shoes, require size and color
    if (product.category === 'Shoes') {
      if (!selectedSize) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Please select size first',
          confirmButtonColor: '#02173A'
        });
        return;
      }
      
      if (!selectedColor) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Please select color first',
          confirmButtonColor: '#02173A'
        });
        return;
      }
      
      // Check if size is sold out
      if (product.soldOutSizes?.includes(selectedSize)) {
        Swal.fire({
          icon: 'error',
          title: 'Size Sold Out',
          text: 'This size is currently sold out',
          confirmButtonColor: '#02173A'
        });
        return;
      }
      
      // Check if color is sold out
      if (product.soldOutColors?.includes(selectedColor)) {
        Swal.fire({
          icon: 'error',
          title: 'Color Sold Out',
          text: 'This color is currently sold out',
          confirmButtonColor: '#02173A'
        });
        return;
      }
      
      // Add item with quantity
      addToCart({ ...product, size: selectedSize, color: selectedColor, quantity });
    } else {
      // For Accessories, no size/color needed
      addToCart({ ...product, quantity });
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${quantity} product(s) added to cart`,
      confirmButtonColor: '#02173A',
      timer: 2000
    });
  };

  const handleCheckout = () => {
    if (product.isSoldOut) {
      Swal.fire({
        icon: 'error',
        title: 'Sold Out',
        text: 'This product is currently sold out',
        confirmButtonColor: '#02173A'
      });
      return;
    }
    
    // For Shoes, require size and color
    if (product.category === 'Shoes') {
      if (!selectedSize) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Please select size first',
          confirmButtonColor: '#02173A'
        });
        return;
      }
      
      if (!selectedColor) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Please select color first',
          confirmButtonColor: '#02173A'
        });
        return;
      }
      
      // Check if size is sold out
      if (product.soldOutSizes?.includes(selectedSize)) {
        Swal.fire({
          icon: 'error',
          title: 'Size Sold Out',
          text: 'This size is currently sold out',
          confirmButtonColor: '#02173A'
        });
        return;
      }
      
      // Check if color is sold out
      if (product.soldOutColors?.includes(selectedColor)) {
        Swal.fire({
          icon: 'error',
          title: 'Color Sold Out',
          text: 'This color is currently sold out',
          confirmButtonColor: '#02173A'
        });
        return;
      }
      
      // Add item with quantity
      addToCart({ ...product, size: selectedSize, color: selectedColor, quantity });
    } else {
      // For Accessories, no size/color needed
      addToCart({ ...product, quantity });
    }
    
    navigate('/checkout');
  };

  const handleWishlist = () => {
    addToWishlist(product);
    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: 'Product added to wishlist',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`${product.name} ${index + 1}`} 
                onClick={() => setMainImage(img)} 
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition ${mainImage === img ? 'border-[#02173A]' : 'border-gray-200 hover:border-gray-400'}`} />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#02173A]">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            {product.fakePrice && (
              <p className="text-xl text-gray-500 line-through">{product.fakePrice} EGP</p>
            )}
            <p className="text-2xl font-bold text-gray-700">{product.price} EGP</p>
          </div>
          
          {/* Color Selection - Only for Shoes */}
          {product.category === 'Shoes' && product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold mb-2 text-[#02173A]">Colors:</p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(color => {
                  const isSoldOut = product.soldOutColors?.includes(color);
                  const colorMap = {
                    'Red': '#FF0000', 'Blue': '#0000FF', 'Green': '#008000', 
                    'Yellow': '#FFFF00', 'Black': '#000000', 'White': '#FFFFFF',
                    'Purple': '#800080', 'Pink': '#FFC0CB', 'Orange': '#FFA500',
                    'Brown': '#A52A2A', 'Gray': '#808080', 'Navy': '#000080',
                    'Beige': '#F5F5DC', 'Maroon': '#800000', 'Turquoise': '#40E0D0'
                  };
                  return (
                    <button 
                      key={color}
                      disabled={isSoldOut}
                      className={`px-4 py-2 border-2 rounded transition relative flex items-center gap-2 ${
                        isSoldOut 
                          ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed line-through' 
                          : selectedColor === color 
                            ? 'bg-[#02173A] text-white border-[#02173A]' 
                            : 'border-gray-300 hover:border-[#02173A]'
                      }`}
                      onClick={() => !isSoldOut && setSelectedColor(color)}>
                      <div 
                        className="w-5 h-5 rounded-full border border-gray-400"
                        style={{ backgroundColor: colorMap[color] || color }}
                      />
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Size Selection - Only for Shoes */}
          {product.category === 'Shoes' && product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold mb-2 text-[#02173A]">Sizes:</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => {
                  const isSoldOut = product.soldOutSizes?.includes(size);
                  return (
                    <button 
                      key={size}
                      disabled={isSoldOut}
                      className={`px-4 py-2 border rounded transition relative ${
                        isSoldOut 
                          ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed line-through' 
                          : selectedSize === size 
                            ? 'bg-[#02173A] text-white border-[#02173A]' 
                            : 'border-gray-300 hover:border-[#02173A]'
                      }`}
                      onClick={() => !isSoldOut && setSelectedSize(size)}>
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Counter */}
          <div className="mb-6">
            <p className="font-semibold mb-2 text-[#02173A]">Quantity:</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition">
                <FiMinus size={20} />
              </button>
              <span className="text-xl font-bold w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition">
                <FiPlus size={20} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          {product.isSoldOut ? (
            <button 
              disabled
              className="w-full bg-gray-400 text-white py-3 rounded-lg font-bold mb-3 cursor-not-allowed">
              SOLD OUT
            </button>
          ) : (
            <>
              <button 
                className="w-full bg-[#02173A] text-white py-3 rounded-lg font-bold mb-3 hover:bg-[#031e47] transition"
                onClick={handleAddToCart}>
                ADD TO CART
              </button>
              <button 
                className="w-full bg-white text-[#02173A] border-2 border-[#02173A] py-3 rounded-lg font-bold mb-3 hover:bg-gray-100 transition"
                onClick={handleCheckout}>
                PROCEED TO CHECKOUT
              </button>
            </>
          )}
          <button 
            className="w-full bg-white text-[#02173A] border-2 border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2"
            onClick={handleWishlist}>
            <FiHeart size={20} />
            ADD TO WISHLIST
          </button>

          {/* Description */}
          <div className="mt-6 border-t pt-4">
            <div 
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={() => setShowDescription(!showDescription)}>
              <h3 className="font-bold text-lg text-[#02173A]">Description</h3>
              <span className="text-2xl text-[#02173A]">{showDescription ? '−' : '+'}</span>
            </div>
            {showDescription && (
              <p className="text-gray-600 mt-2">{product.description}</p>
            )}
          </div>

          {/* Care Instructions */}
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p className="font-semibold text-[#02173A]">Product Care:</p>
            <p>• Made with premium quality materials</p>
            <p>• Return policy available for manufacturing defects</p>
            <p>• Clean with soft cloth</p>
            <p>• Store in cool, dry place</p>
            <p>• Avoid direct sunlight</p>
          </div>
        </div>
      </div>

      {/* Accessories Section - Only for SHOES products */}
      {product.category === 'Shoes' && accessoriesProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#02173A]">ACCESSORIES</h2>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {accessoriesProducts.map(p => (
              <div key={p._id} className="min-w-[300px] flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition" onClick={() => navigate(`/product/${p._id}`)}>
                {/* Product Image */}
                <div className="relative h-[300px] overflow-hidden">
                  <img 
                    src={p.images[0]} 
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  {/* Name */}
                  <h3 className="font-bold text-lg text-black line-clamp-2 mb-3">{p.name}</h3>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    {p.fakePrice && (
                      <p className="text-gray-500 line-through text-base">{p.fakePrice} EGP</p>
                    )}
                    <p className="text-xl font-bold text-black">{p.price} EGP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#02173A]">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map(p => <ProductCard key={p._id} product={p} addToCart={addToCart} addToWishlist={addToWishlist} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

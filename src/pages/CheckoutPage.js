import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../config/api';

const CheckoutPage = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone1: '',
    phone2: ''
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const deliveryFee = 120;
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + deliveryFee - discountAmount;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePromoCheck = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/promo-codes/validate`, {
        code: promoCode
      });
      
      if (response.data.valid) {
        setDiscount(response.data.discount);
        setPromoApplied(true);
        setPromoError('');
        Swal.fire({
          icon: 'success',
          title: 'Promo Code Applied!',
          text: `${response.data.discount}% discount has been applied`,
          confirmButtonColor: '#02173A',
          timer: 2000
        });
      }
    } catch (error) {
      setPromoError(error.response?.data?.message || 'Invalid promo code');
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Debug: Check cart items
      console.log('=== CHECKOUT DEBUG ===');
      console.log('Cart items before grouping:', cart);
      console.log('Cart items with color:', cart.filter(item => item.color));
      console.log('Cart items without color:', cart.filter(item => !item.color));
      
      // Group cart items by product, size, and color
      const groupedCart = cart.reduce((acc, item) => {
        const key = `${item._id}-${item.size || 'no-size'}-${item.color || 'no-color'}`;
        if (!acc[key]) {
          acc[key] = {
            productId: item._id || item.id,
            name: item.name,
            price: parseFloat(item.price),
            size: item.size,
            color: item.color,
            image: item.images?.[0] || item.image,
            quantity: 1
          };
        } else {
          acc[key].quantity += 1;
        }
        return acc;
      }, {});
      
      // Prepare order data
      const orderData = {
        customerInfo: {
          name: formData.name,
          address: formData.address,
          phone1: formData.phone1,
          phone2: formData.phone2
        },
        items: Object.values(groupedCart),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        promoCode: promoApplied ? promoCode : null,
        discount: promoApplied ? discount : 0
      };

      // Debug: Check order data
      console.log('=== ORDER DATA DEBUG ===');
      console.log('Order data being sent:', orderData);
      console.log('Items in order:', orderData.items);
      console.log('Items with color:', orderData.items.filter(item => item.color));
      console.log('Items without color:', orderData.items.filter(item => !item.color));

      // Create order in database
      await axios.post(`${API_URL}/api/orders`, orderData);

      // Use promo code if applied
      if (promoApplied) {
        await axios.post(`${API_URL}/api/promo-codes/use`, { code: promoCode });
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your order has been placed successfully',
        confirmButtonColor: '#02173A',
        timer: 3000
      });
      
      setCart([]);
      navigate('/');
    } catch (error) {
      console.error('Order error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to place order',
        confirmButtonColor: '#02173A'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">CHECKOUT</h1>
      
      <div className="flex flex-col gap-4 md:gap-8">
        {/* Order Summary - First */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Order Summary</h2>
          
          {/* Promo Code */}
          <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b">
            <label className="block font-semibold mb-2 text-sm md:text-base">Promo Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="flex-1 px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:border-[#02173A] text-sm md:text-base"
              />
              <button
                type="button"
                onClick={handlePromoCheck}
                className="bg-[#02173A] text-white px-4 md:px-6 py-2 rounded-lg font-bold hover:bg-[#031e47] transition text-sm md:text-base whitespace-nowrap">
                CHECK
              </button>
            </div>
            {promoError && <p className="text-red-600 mt-2 text-xs md:text-sm">{promoError}</p>}
            {promoApplied && <p className="text-green-600 mt-2 text-xs md:text-sm">✓ Promo code applied!</p>}
          </div>

          <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-60 md:max-h-96 overflow-y-auto">
            {cart.map((item, index) => (
              <div key={index} className="flex gap-3 md:gap-4 pb-3 md:pb-4 border-b">
                <img src={item.images?.[0] || item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm md:text-base truncate">{item.name}</h3>
                  {item.size && <p className="text-xs md:text-sm text-gray-600">Size: {item.size}</p>}
                  {item.color && (
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <span>Color:</span>
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-400"
                          style={{ 
                            backgroundColor: {
                              'Red': '#FF0000', 'Blue': '#0000FF', 'Green': '#008000', 
                              'Yellow': '#FFFF00', 'Black': '#000000', 'White': '#FFFFFF',
                              'Purple': '#800080', 'Pink': '#FFC0CB', 'Orange': '#FFA500',
                              'Brown': '#A52A2A', 'Gray': '#808080', 'Navy': '#000080',
                              'Beige': '#F5F5DC', 'Maroon': '#800000', 'Turquoise': '#40E0D0'
                            }[item.color] || item.color
                          }}
                        />
                        <span className="font-medium">{item.color}</span>
                      </div>
                    </div>
                  )}
                  <p className="font-bold mt-1 text-sm md:text-base">{item.price} EGP</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 text-sm md:text-base">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>{deliveryFee} EGP</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount}%):</span>
                <span>-{discountAmount.toFixed(2)} EGP</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base md:text-lg pt-2 border-t">
              <span>Total:</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
          </div>
        </div>

        {/* Checkout Form - Second */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Shipping Information</h2>
          
          <div>
            <label className="block font-semibold mb-2 text-sm md:text-base">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#02173A] text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm md:text-base">Delivery Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#02173A] text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm md:text-base">Phone Number</label>
            <input
              type="tel"
              name="phone1"
              value={formData.phone1}
              onChange={handleChange}
              required
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#02173A] text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm md:text-base">Alternative Phone Number</label>
            <input
              type="tel"
              name="phone2"
              value={formData.phone2}
              onChange={handleChange}
              required
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#02173A] text-sm md:text-base"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#02173A] text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-[#031e47] transition">
            BUY NOW
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

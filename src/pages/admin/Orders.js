import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../../config/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load orders',
        confirmButtonColor: '#02173A'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/orders/${id}`, { status });
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      fetchOrders();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update order status',
        confirmButtonColor: '#02173A'
      });
    }
  };

  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This order will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/api/orders/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Order deleted successfully',
        confirmButtonColor: '#000',
        timer: 2000
      });
      fetchOrders();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete order',
        confirmButtonColor: '#000'
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mb-4"></div>
        <p className="text-xl font-bold text-gray-700">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
            </div>

            <div className="space-y-4 mb-4">
              {order.items?.map((item, index) => {
                const colorMap = {
                  'Red': '#FF0000', 'Blue': '#0000FF', 'Green': '#008000', 
                  'Yellow': '#FFFF00', 'Black': '#000000', 'White': '#FFFFFF',
                  'Purple': '#800080', 'Pink': '#FFC0CB', 'Orange': '#FFA500',
                  'Brown': '#A52A2A', 'Gray': '#808080', 'Navy': '#000080',
                  'Beige': '#F5F5DC', 'Maroon': '#800000', 'Turquoise': '#40E0D0'
                };
                
                console.log('Order item:', item); // Debug log
                
                return (
                  <div key={index} className="flex gap-4 pb-4 border-b">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      {item.size && <p className="text-sm text-gray-600 mt-1">Size: <span className="font-semibold">{item.size}</span></p>}
                      {item.color ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <span>Color:</span>
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-5 h-5 rounded-full border-2 border-gray-400 shadow-sm"
                              style={{ 
                                backgroundColor: colorMap[item.color] || item.color
                              }}
                            />
                            <span className="font-semibold text-gray-800">{item.color}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-red-500 mt-1">⚠️ Color not specified</p>
                      )}
                      <p className="font-bold mt-2 text-lg">{item.price} EGP × {item.quantity || 1}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 mb-4">
              <p className="font-semibold mb-1">Customer: {order.customerInfo?.name || order.name}</p>
              <p className="text-sm text-gray-600 mb-1">Address: {order.customerInfo?.address || order.address}</p>
              <p className="text-sm text-gray-600 mb-1">Phone 1: {order.customerInfo?.phone1 || order.phone1}</p>
              <p className="text-sm text-gray-600">Phone 2: {order.customerInfo?.phone2 || order.phone2}</p>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{order.subtotal} EGP</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery:</span>
                <span>{order.deliveryFee || 120} EGP</span>
              </div>
              {order.promoCode && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Promo Code ({order.promoCode}):</span>
                  <span>-{order.discount}%</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{order.total} EGP</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Order Status</label>
              <select
                value={order.status || 'pending'}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black mb-3">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button
                onClick={() => deleteOrder(order._id)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-700 transition">
                DELETE ORDER
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

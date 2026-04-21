import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateAdmin from './pages/CreateAdmin';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const addToWishlist = (product) => {
    const productId = product._id || product.id;
    if (!wishlist.find(item => (item._id || item.id) === productId)) {
      setWishlist([...wishlist, product]);
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'Product added to wishlist',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Already Added',
        text: 'Product already in wishlist',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  const removeFromWishlist = (index) => {
    const newWishlist = wishlist.filter((_, i) => i !== index);
    setWishlist(newWishlist);
  };

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/create" element={<CreateAdmin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Public Routes */}
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col">
            <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage addToCart={addToCart} addToWishlist={addToWishlist} />} />
                <Route path="/products" element={<ProductsPage addToCart={addToCart} addToWishlist={addToWishlist} />} />
                <Route path="/product/:id" element={<ProductDetailsPage addToCart={addToCart} addToWishlist={addToWishlist} />} />
                <Route path="/category/:name" element={<CategoryPage addToCart={addToCart} addToWishlist={addToWishlist} />} />
                <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
                <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} />} />
                <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} removeFromWishlist={removeFromWishlist} />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ cartCount, wishlistCount = 0 }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const announcements = [
    "Free Shipping on Orders Over 3000 EGP",
    "SHOES BRAND - Premium Quality Footwear",
    "Specialized Shoes & Accessories Store"
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-slider">
          {[...announcements, ...announcements].map((text, index) => (
            <span key={index} className="announcement-text">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left - Menu Icon */}
            <button 
              onClick={toggleSideMenu}
              className="nav-icon-btn menu-btn"
              aria-label="Menu"
            >
              <FiMenu size={26} className="text-black" />
            </button>
            
            {/* Center - Spinning Logo */}
            <Link to="/" className="logo-container">
              <div className="logo-wrapper">
                <img 
                  src="/logo.jpeg" 
                  alt="SHOES BRAND Logo" 
                  className="rotating-logo"
                />
              </div>
            </Link>
            
            {/* Right - Wishlist & Cart */}
            <div className="flex items-center gap-3">
              <Link to="/wishlist" className="nav-icon-btn">
                <FiHeart size={26} className="text-black" />
                {wishlistCount > 0 && (
                  <span className="nav-badge">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="nav-icon-btn">
                <FiShoppingBag size={26} className="text-black" />
                {cartCount > 0 && (
                  <span className="nav-badge">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Menu Overlay */}
      {isSideMenuOpen && (
        <div 
          className="side-menu-overlay"
          onClick={toggleSideMenu}
        />
      )}

      {/* Side Menu */}
      <div className={`side-menu ${isSideMenuOpen ? 'side-menu-open' : ''}`}>
        <div className="side-menu-header">
          <h2 className="side-menu-title">Menu</h2>
          <button 
            onClick={toggleSideMenu}
            className="side-menu-close"
            aria-label="Close Menu"
          >
            <FiX size={28} />
          </button>
        </div>
        
        <div className="side-menu-content">
          <Link to="/" className="side-menu-item" onClick={toggleSideMenu}>
            Home
          </Link>
          <Link to="/category/Shoes" className="side-menu-item" onClick={toggleSideMenu}>
            Shoes
          </Link>
          <Link to="/category/Accessories" className="side-menu-item" onClick={toggleSideMenu}>
            Accessories
          </Link>
          <Link to="/cart" className="side-menu-item" onClick={toggleSideMenu}>
            Shopping Cart
          </Link>
          <Link to="/wishlist" className="side-menu-item" onClick={toggleSideMenu}>
            Wishlist
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;

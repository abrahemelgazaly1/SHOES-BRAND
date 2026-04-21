import React from 'react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-12 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold mb-4">SHOES BRAND</h3>
        <p className="text-gray-600 mb-6">Follow us on social media</p>
        <div className="flex justify-center gap-6 mb-6">
          <a 
            href="https://www.tiktok.com/@shoes.brand74?_r=1&_t=ZS-95isiB7c9zz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition transform hover:scale-110">
            <FaTiktok size={28} />
          </a>
          <a 
            href="https://wa.me/201000416274" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition transform hover:scale-110">
            <FaWhatsapp size={28} />
          </a>
        </div>
        <p className="text-gray-600 text-sm">
          Contact us: <a href="https://wa.me/201000416274" className="text-black hover:underline font-semibold">+20 10 00416274</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

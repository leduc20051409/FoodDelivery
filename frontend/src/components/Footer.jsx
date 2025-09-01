import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-5 lg:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#e91e63'}}>
                <span className="text-white font-bold text-lg">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold pacifico-regular" style={{color: '#e91e63'}}>Duc Food</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Taste the Convenience: Food, Fast and Delivered. Experience the best flavors from our handpicked restaurants.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-300" 
                 style={{'&:hover': {backgroundColor: '#e91e63'}}}
                 onMouseEnter={(e) => e.target.style.backgroundColor = '#e91e63'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = '#1f2937'}>
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-300"
                 onMouseEnter={(e) => e.target.style.backgroundColor = '#e91e63'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = '#1f2937'}>
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-300"
                 onMouseEnter={(e) => e.target.style.backgroundColor = '#e91e63'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = '#1f2937'}>
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold" style={{color: '#e91e63'}}>Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Restaurants', 'About Us', 'Contact', 'FAQ', 'Privacy Policy'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 transition-colors duration-300"
                     onMouseEnter={(e) => e.target.style.color = '#e91e63'}
                     onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold" style={{color: '#e91e63'}}>Categories</h4>
            <ul className="space-y-2">
              {['Italian', 'Asian', 'Mexican', 'Fast Food', 'Healthy', 'Desserts'].map((category, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 transition-colors duration-300"
                     onMouseEnter={(e) => e.target.style.color = '#e91e63'}
                     onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold" style={{color: '#e91e63'}}>Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin style={{color: '#e91e63'}} className="mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">123 Food Street</p>
                  <p className="text-gray-400 text-sm">Hanoi, Vietnam</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone style={{color: '#e91e63'}} size={18} />
                <p className="text-gray-400 text-sm">+84 123 456 789</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail style={{color: '#e91e63'}} size={18} />
                <p className="text-gray-400 text-sm">info@ducfood.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock style={{color: '#e91e63'}} className="mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Mon - Sun</p>
                  <p className="text-gray-400 text-sm">24/7 Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-semibold mb-2" style={{color: '#e91e63'}}>Stay Updated</h4>
              <p className="text-gray-400">Subscribe to get special offers and updates</p>
            </div>
            <div className="flex w-full lg:w-auto max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none text-white placeholder-gray-500"
                style={{
                  borderColor: '#374151',
                  '&:focus': {
                    borderColor: '#e91e63'
                  }
                }}
                onFocus={(e) => e.target.style.borderColor = '#e91e63'}
                onBlur={(e) => e.target.style.borderColor = '#374151'}
              />
              <button 
                className="px-6 py-3 transition-colors duration-300 rounded-r-lg font-medium text-white"
                style={{backgroundColor: '#e91e63'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c2185b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e91e63'}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-5 lg:px-20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 Duc Food. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 text-sm transition-colors duration-300"
                 onMouseEnter={(e) => e.target.style.color = '#e91e63'}
                 onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 text-sm transition-colors duration-300"
                 onMouseEnter={(e) => e.target.style.color = '#e91e63'}
                 onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 text-sm transition-colors duration-300"
                 onMouseEnter={(e) => e.target.style.color = '#e91e63'}
                 onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
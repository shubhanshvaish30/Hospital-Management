import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Menu, X, User, Map, Calendar, FileText } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // For programmatically navigating after logout
  const [user, setUser] = useState(null);  // To store user data
  
  useEffect(() => {
    // Retrieve user data and token from localStorage
    const token = localStorage.getItem('authToken');
    const storedUser = JSON.parse(localStorage.getItem('userData'));  // Assuming user data is stored as a JSON string
    if (token && storedUser) {
      setUser(storedUser);  // Set user data if token exists
    }
  }, [localStorage.getItem('authToken')]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Remove the token
    localStorage.removeItem('userData');  // Remove the user data
    setUser(null);  // Reset the user state
    navigate('/login');  // Navigate to login page after logout
  };

  const links = [
    { name: 'Home', path: '/', icon: Heart },
    { name: 'Find Hospitals', path: '/hospitals', icon: Map },
    { name: 'Health Records', path: '/records', icon: FileText },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
  ];

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HealthCare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                  {location.pathname === link.path && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
              );
            })}
            {/* Conditional Rendering for User or Logout */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.userName || 'User'}</span> {/* Display user's name */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            {/* Conditional Rendering for User or Logout in mobile */}
            {user ? (
              <div className="flex items-center space-x-2 px-3 py-2 rounded-md">
                <span className="text-gray-700">{user.userName || 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

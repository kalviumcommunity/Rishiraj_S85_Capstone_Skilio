import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, Settings, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Separate navigation links for authenticated and non-authenticated users
const publicNavLinks = [
  { name: "Home", href: "/" },
  { name: "Skills", href: "/explore" },
];

const authenticatedNavLinks = [
  { name: "Home", href: "/" },
  { name: "Skills", href: "/explore" },
  { name: "Chat", href: "/chat" },
  { name: "Profile", href: "/profile" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Use appropriate nav links based on authentication status
  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks;

  return (
    <nav className="w-full bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight hover:text-blue-700 transition-colors">
            Skilio
          </Link>
        </div>
        
        {/* Links and Login (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`text-gray-700 hover:text-blue-600 font-semibold px-3 py-2 rounded transition-colors duration-200 ${
                isActive(link.href) ? 'text-blue-600' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={`text-gray-700 hover:text-blue-600 font-semibold px-3 py-2 rounded transition-colors duration-200 ${
                  isActive('/dashboard') ? 'text-blue-600' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/post-skill"
                className={`text-gray-700 hover:text-blue-600 font-semibold px-3 py-2 rounded transition-colors duration-200 ${
                  isActive('/post-skill') ? 'text-blue-600' : ''
                }`}
              >
                Post Skill
              </Link>
            </>
          )}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="ml-6 bg-blue-500 text-white px-5 py-2 rounded font-semibold shadow hover:bg-blue-600 transition flex items-center space-x-2"
              >
                <span>{user.name}</span>
                <User className="w-4 h-4" />
              </button>
              
              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-6 bg-blue-500 text-white px-5 py-2 rounded font-semibold shadow hover:bg-blue-600 transition"
            >
              Login
            </Link>
          )}
        </div>
        
        {/* Hamburger (Mobile) */}
        <button 
          className="md:hidden text-2xl p-2 rounded hover:bg-blue-100 transition flex items-center justify-center" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 flex flex-col gap-4 rounded-b shadow items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search skills..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="space-y-2 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-gray-700 hover:text-blue-600 font-semibold px-3 py-2 rounded transition-colors duration-200 w-full text-center block ${
                  isActive(link.href) ? 'text-blue-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-gray-700 hover:text-blue-600 font-semibold px-3 py-2 rounded transition-colors duration-200 w-full text-center block ${
                    isActive('/dashboard') ? 'text-blue-600' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/post-skill"
                  className={`text-gray-700 hover:text-blue-600 font-semibold px-3 py-2 rounded transition-colors duration-200 w-full text-center block ${
                    isActive('/post-skill') ? 'text-blue-600' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Skill
                </Link>
              </>
            )}
          </div>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-5 py-2 rounded font-semibold shadow hover:bg-blue-600 transition w-full"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-5 py-2 rounded font-semibold shadow hover:bg-blue-600 transition w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import account from '../images/account-icon.svg';
import logo from '../images/ShariaStocks-logo/logo1.jpeg';
import { getUserData } from '../api/auth';
import { Bell, Heart, Menu, X } from 'lucide-react';

const HeaderDash = () => {
    const [user, setUser] = useState({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem('userEmail');

    useEffect(() => {
      if (email) {
        fetchUserData();
      }
    }, [email]);

    const fetchUserData = async () => {
      try {
        const userData = await getUserData(email);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
      <div data-testid="header-component">
        <header className="sticky top-0 z-30 bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex justify-between items-center">
            {/* Logo with hover animation */}
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                onClick={() => navigate('/dashboard')} 
                alt="ShariaStock Logo" 
                className="w-52 h-12 object-fill cursor-pointer transition-all duration-300 hover:brightness-110 transform hover:scale-105" 
              />
            </div>

            {/* Desktop Navigation - Hidden on small screens */}
            <div className="hidden sm:flex gap-3">
              <button
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-110"
                onClick={() => navigate('/watchlist', { state: { user } })}
                aria-label="Watchlist"
              >
                <Heart className="w-5 h-5 text-gray-700 transition-colors duration-300 hover:text-red-500" />
              </button>
              <button
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-110"
                onClick={() => navigate('/notificationpage')}
                aria-label="Notifications"
                data-testid="notification-bell"
              >
                <Bell className="w-5 h-5 text-gray-700 transition-colors duration-300 hover:text-blue-500" />
              </button>
              <div
                className="flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate('/profile', { state: { user } })}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 transition-all duration-300 hover:from-purple-600 hover:to-indigo-500">
                  <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                    <img src={user.profilePicture || account} alt="profile" className="w-8 h-8 object-cover rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button - Only visible on small screens */}
            <button 
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-110"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 transition-transform duration-300 rotate-90 scale-110" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 transition-transform duration-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu - Only visible when toggled on small screens, with slide-down animation */}
          <div 
            className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen 
                ? "max-h-64 opacity-100 mt-4 border-t pt-4 border-gray-100" 
                : "max-h-0 opacity-0 mt-0 border-t-0 pt-0"
            }`}
          >
            <div className="flex flex-col gap-4">
              {/* Profile Section with slide-in animation */}
              <div 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300 transform ${
                  mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                }`}
                style={{ transitionDelay: "100ms" }}
                onClick={() => {
                  navigate('/profile', { state: { user } });
                  setMobileMenuOpen(false);
                }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 transition-all duration-300 hover:from-purple-600 hover:to-indigo-500">
                  <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                    <img src={user.profilePicture || account} alt="profile" className="w-8 h-8 object-cover rounded-full" />
                  </div>
                </div>
                <span className="text-sm font-medium">My Profile</span>
              </div>

              {/* Watchlist Section with slide-in animation */}
              <div 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300 transform ${
                  mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                }`}
                style={{ transitionDelay: "150ms" }}
                onClick={() => {
                  navigate('/watchlist', { state: { user } });
                  setMobileMenuOpen(false);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors duration-300 hover:bg-gray-200">
                  <Heart className="w-5 h-5 text-gray-700 transition-colors duration-300 hover:text-red-500" />
                </div>
                <span className="text-sm font-medium">Watchlist</span>
              </div>

              {/* Notifications Section with slide-in animation */}
              <div 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300 transform ${
                  mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
                onClick={() => {
                  navigate('/notificationpage');
                  setMobileMenuOpen(false);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors duration-300 hover:bg-gray-200">
                  <Bell className="w-5 h-5 text-gray-700 transition-colors duration-300 hover:text-blue-500" />
                </div>
                <span className="text-sm font-medium">Notifications</span>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
};

export default HeaderDash;
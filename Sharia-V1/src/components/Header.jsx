import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import account from '../images/account-icon.svg';
import logo from '../images/ShariaStocks-logo/logo1.jpeg'
import { getUserData } from '../api/auth';
import { Search, Bell, Heart, X, ArrowLeft } from 'lucide-react';
import niftyCompanies from '../nifty_symbols.json';

const Header = () => {
    const [searchSymbol, setSearchSymbol] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [user, setUser] = useState({});
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem('userEmail');
    const searchInputRef = useRef(null);
    const [companies, setCompanies] = useState([]);
    const [isSearchAnimating, setIsSearchAnimating] = useState(false);

    useEffect(() => {
      setCompanies(niftyCompanies);
      if (email) {
        fetchUserData();
      }
    }, [email]);

    useEffect(() => {
      // Focus the search input when search bar is shown
      if (showSearchBar && searchInputRef.current) {
        // Allow animation to complete before focusing
        setTimeout(() => {
          searchInputRef.current.focus();
        }, 300);
      }
    }, [showSearchBar]);

    const fetchUserData = async () => {
      try {
        const userData = await getUserData(email);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const handleInputChange = (e) => {
      const value = e.target.value.toUpperCase();
      setSearchSymbol(value);
      setIsSearchActive(!!value);
  
      if (value) {
        const filteredCompanies = companies
          .filter(company => 
            company["NAME OF COMPANY"].toUpperCase().includes(value) || 
            company.SYMBOL.includes(value)
          )
          .slice(0, 6); // Limit to 6 suggestions for better UX
        setSuggestions(filteredCompanies);
      } else {
        setSuggestions([]);
        setIsSearchActive(false);
      }
    };

    const toggleSearchBar = () => {
      setIsSearchAnimating(true);
      
      if (!showSearchBar) {
        // Opening search
        setShowSearchBar(true);
        // Reset search state when opening
        setSearchSymbol('');
        setSuggestions([]);
        setIsSearchActive(false);
      } else {
        // Closing search - delay the actual hiding to allow animation
        setTimeout(() => {
          setShowSearchBar(false);
          setIsSearchAnimating(false);
        }, 300);
      }
    };

    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    
  return (
    <div data-testid="header-component" className="relative">
      {/* Main Header - Hidden when search is active on mobile */}
      <header className={`sticky top-0 z-30 bg-white rounded-2xl p-4 shadow-sm mb-6 transition-all duration-300 ${showSearchBar ? 'sm:opacity-100 sm:translate-y-0 opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div
                    className="sm:hidden items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => navigate('/profile', { state: { user } })}
                    data-testid="mobile-profile-icon"
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
                        <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                            <img src={user.profilePicture || account} alt="profile" className="w-8 h-8 object-cover" />
                        </div>
                    </div>
                </div>
                {/* Logo only visible on desktop */}
                <img 
                    src={logo} 
                    onClick={() => navigate('/dashboard')} 
                    alt="ShariaStock Logo" 
                    className="hidden sm:block w-52 h-12 object-fill cursor-pointer"
                    data-testid="header-logo" 
                />
            </div>
            
            {/* Desktop Search Area - Hidden on mobile */}
            <div className="flex-1 max-w-lg mx-4 hidden sm:block" data-testid="desktop-search-container">
                {showSearchBar && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                            ref={searchInputRef}
                            onChange={handleInputChange}
                            value={searchSymbol}
                            data-testid="desktop-search-input"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && suggestions.length > 0) {
                                  const firstSuggestion = suggestions[0];
                                  setSearchSymbol(firstSuggestion.SYMBOL);
                                  navigate(`/stockresults/${firstSuggestion.SYMBOL}`, { state: { user } });
                                  setIsSearchActive(false);
                                  setShowSearchBar(false);
                                } else if (e.key === "Escape") {
                                  toggleSearchBar();
                                }
                            }}
                        />
                        <button 
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={toggleSearchBar}
                            data-testid="desktop-search-close-btn"
                        >
                            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        </button>
                        {isSearchActive && suggestions.length > 0 && (
                            <ul className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20" data-testid="search-suggestions-list">
                                {suggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.SYMBOL}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            console.log("Suggestion clicked:", suggestion.SYMBOL);
                                            setSearchSymbol(prevSymbol => {
                                                console.log("Previous symbol:", prevSymbol);
                                                return suggestion.SYMBOL;
                                            });
                                            setIsSearchActive(false);
                                            setShowSearchBar(false);
                                            navigate(`/stockresults/${suggestion.SYMBOL}`, { state: { user } });
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                        data-testid={`search-suggestion-${suggestion.SYMBOL}`}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={suggestion.Company_Logo}
                                                alt="logo"
                                                className="w-6 h-6 object-cover"
                                                onError={(e) => { e.target.src = "https://via.placeholder.com/32" }}
                                                data-testid={`company-logo-${suggestion.SYMBOL}`}
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1" data-testid="header-symbol-section">
                                            <span className="text-sm font-medium" data-testid={`company-name-${suggestion.SYMBOL}`}>{truncateText(suggestion["NAME OF COMPANY"], 25)}</span>
                                            <span className="text-xs text-gray-500" data-testid={`company-symbol-${suggestion.SYMBOL}`}>{suggestion.SYMBOL}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            
            <div className="flex gap-3" data-testid="header-actions">
                {/* Search Button */}
                <button
                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={toggleSearchBar}
                    aria-label="Search"
                    data-testid="search-button"
                >
                    <Search className="w-5 h-5 text-gray-700" />
                </button>
                
                <button
                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => navigate('/watchlist', { state: { user} })}
                    aria-label="Watchlist"
                    data-testid="watchlist-button"
                >
                    <Heart className="w-5 h-5 text-gray-700" />
                </button>
                <button
                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => navigate('/notificationpage')}
                    aria-label="Notifications"
                    data-testid="notification-bell"
                >
                    <Bell className="w-5 h-5 text-gray-700" />
                </button>
                {/* Desktop Profile Icon - Hidden on small screens (sm and below) */}
                <div
                    className="hidden sm:flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => navigate('/profile', { state: { user } })}
                    data-testid="desktop-profile-icon"
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
                        <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                            <img src={user.profilePicture || account} alt="profile" className="w-8 h-8 object-cover" data-testid="profile-image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* Full screen mobile search with smooth transition */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-all duration-300 ease-in-out transform sm:hidden ${showSearchBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
        data-testid="fullscreen-mobile-search"
      >
        <div className="p-4 flex flex-col h-full">
          {/* Search header with back button */}
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={toggleSearchBar}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Back"
              data-testid="mobile-search-back-btn"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="text-lg font-medium">Search Stocks</div>
          </div>
          
          {/* Search input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks..."
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base"
              ref={searchInputRef}
              onChange={handleInputChange}
              value={searchSymbol}
              data-testid="fullscreen-search-input"
              onKeyDown={(e) => {
                if (e.key === "Enter" && suggestions.length > 0) {
                  const firstSuggestion = suggestions[0];
                  setSearchSymbol(firstSuggestion.SYMBOL);
                  navigate(`/stockresults/${firstSuggestion.SYMBOL}`, { state: { user } });
                  setIsSearchActive(false);
                  toggleSearchBar();
                } else if (e.key === "Escape") {
                  toggleSearchBar();
                }
              }}
            />
            {searchSymbol && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setSearchSymbol('')}
                data-testid="mobile-search-clear-btn"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Recent searches - Could be implemented with localStorage */}
          {!isSearchActive && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Recent Searches</div>
              <div className="flex flex-wrap gap-2">
                {["INFY", "TATASTEEL", "RELIANCE"].map((symbol) => (
                  <button
                    key={symbol}
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSearchSymbol(symbol);
                      navigate(`/stockresults/${symbol}`, { state: { user } });
                      toggleSearchBar();
                    }}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search suggestions */}
          {isSearchActive && suggestions.length > 0 && (
            <ul className="flex-1 overflow-y-auto" data-testid="fullscreen-search-suggestions">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.SYMBOL}
                  onClick={() => {
                    setSearchSymbol(suggestion.SYMBOL);
                    setIsSearchActive(false);
                    navigate(`/stockresults/${suggestion.SYMBOL}`, { state: { user } });
                    toggleSearchBar();
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  data-testid={`fullscreen-suggestion-${suggestion.SYMBOL}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={suggestion.Company_Logo}
                      alt="logo"
                      className="w-8 h-8 object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/32" }}
                      data-testid={`fullscreen-company-logo-${suggestion.SYMBOL}`}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-base font-medium" data-testid={`fullscreen-company-name-${suggestion.SYMBOL}`}>
                      {truncateText(suggestion["NAME OF COMPANY"], 30)}
                    </span>
                    <span className="text-sm text-gray-500" data-testid={`fullscreen-company-symbol-${suggestion.SYMBOL}`}>
                      {suggestion.SYMBOL}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {/* No results found */}
          {isSearchActive && searchSymbol && suggestions.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-6">
              <Search className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-700">No results found</p>
              <p className="text-sm text-gray-500 mt-1">Try searching with a different keyword</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
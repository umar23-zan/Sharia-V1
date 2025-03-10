import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import account from '../images/account-icon.svg';
import logo from '../images/ShariaStocks-logo/ShariaStocks.svg'
import { getUserData } from '../api/auth';
import { Search, Bell, Heart } from 'lucide-react';
import niftyCompanies from '../nifty_symbols.json';

const Header = () => {
    const [searchSymbol, setSearchSymbol] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [user, setUser] = useState({});
    const [isSearchActive, setIsSearchActive] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem('userEmail');
    const searchInputRef = useRef(null);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
      setCompanies(niftyCompanies);
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

    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
  return (
    <div >
      <header className="sticky top-0 z-30 bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div
                    className="sm:hidden items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => navigate('/profile', { state: { user } })}
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
                        <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                            <img src={user.profilePicture || account} alt="profile" className="w-8 h-8 object-cover" />
                        </div>
                    </div>
                </div>
                <img src={logo} onClick={() => navigate('/dashboard')} alt="ShariaStock Logo" className="w-48 h-14 object-cover cursor-pointer" />
            </div>
            <div className="flex-1 max-w-lg mx-4 hidden sm:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                        ref={searchInputRef}
                        onChange={handleInputChange}
                        value={searchSymbol}
                        // onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                    />
                    {isSearchActive && suggestions.length > 0 && (
                        <ul className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
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
                                        navigate(`/stockresults/${suggestion.SYMBOL}`, { state: { user } });
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={suggestion.Company_Logo}
                                            alt="logo"
                                            className="w-6 h-6 object-cover"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/32" }}
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-sm font-medium">{truncateText(suggestion["NAME OF COMPANY"], 25)}</span>
                                        <span className="text-xs text-gray-500">{suggestion.SYMBOL}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => navigate('/watchlist', { state: { user} })}
                    aria-label="Watchlist"
                >
                    <Heart className="w-5 h-5 text-gray-700" />
                </button>
                <button
                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => navigate('/notificationpage')}
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5 text-gray-700" />
                </button>
                {/* Desktop Profile Icon - Hidden on small screens (sm and below) */}
                <div
                    className="hidden sm:flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => navigate('/profile', { state: { user } })}
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
                        <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                            <img src={user.profilePicture || account} alt="profile" className="w-8 h-8 object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        {/* Mobile Search - Visible only on small screens */}
        <div className="mt-3 sm:hidden">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search stocks..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                    ref={searchInputRef}
                    onChange={handleInputChange}
                    value={searchSymbol}
                    // onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                {isSearchActive && suggestions.length > 0 && (
                    <ul className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
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
                                    navigate(`/stockresults/${suggestion.SYMBOL}`, { state: { user } });
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                            >
    
                                <img
                                    src={suggestion.Company_Logo}
                                    alt="logo"
                                    className="w-6 h-6 object-cover"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/32" }}
                                />
    
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-medium">{truncateText(suggestion["NAME OF COMPANY"], 20)}</span>
                                    <span className="text-xs text-gray-500">{suggestion.SYMBOL}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </header>
    </div>
  )
}

export default Header
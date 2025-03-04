import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Heart, LoaderCircle, ChevronRight, TrendingUp, Newspaper, ArrowUp, ArrowDown, Menu, X } from 'lucide-react';
import axios from 'axios';
import { getUserData } from '../api/auth';
import niftyCompanies from '../nifty_symbols.json';
import account from '../images/account-icon.svg';
import logo from '../images/ShariaStocks-logo/logo1.jpeg'

const Dashboard = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState({});
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');

  const trendingStocks = [
    { symbol: 'RELIANCE', name: 'Reliance', change: '+12.5%', isUp: true, color: 'from-purple-500 to-indigo-600', logo: 'https://logo.clearbit.com/www.ril.com' },
    { symbol: 'BHARTIARTL', name: 'Airtel', change: '+8.2%', isUp: true, color: 'from-blue-500 to-cyan-400', logo: 'https://logo.clearbit.com/www.airtel.in' },
    { symbol: 'HDFCBANK', name: 'HDFC', change: '+5.7%', isUp: true, color: 'from-green-500 to-emerald-400', logo: 'https://logo.clearbit.com/www.hdfcbank.com' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', change: '-2.1%', isUp: false, color: 'from-rose-400 to-orange-500', logo: 'https://logo.clearbit.com/www.bajajfinserv.in' }
  ];

  const categories = [
    { name: '✨ Top Halal Stocks', path: 'halal', bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600', textColor: 'text-white', icon: '✨' },
    { name: '💻 Technology', path: 'Technology', bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600', textColor: 'text-white', icon: '💻' },
    { name: '📊 Retail', path: 'Retail', bgColor: 'bg-gradient-to-r from-pink-500 to-pink-600', textColor: 'text-white', icon: '📊' },
    { name: '🍽️ Food & Beverage', path: 'Foods', bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600', textColor: 'text-white', icon: '🍽️' }
  ];

  useEffect(() => {
    setCompanies(niftyCompanies);
    fetchStockNews();
    if (email) {
      fetchUserData();
    }

    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [email]);

  const fetchUserData = async () => {
    try {
      const userData = await getUserData(email);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchStockNews = async () => {
    setNewsLoading(true);
    try {
      const response = await axios.get(`https://newsdata.io/api/1/news`, {
        params: {
          apikey: 'pub_5726909ae8ab74afd8fcf47ed1aa5e8cec510',
          q: "NSE",
          country: 'in',
          language: 'en',
          category: 'Business',
          size: 3,
        },
      });
      setNewsArticles(response.data.results || []);
    } catch (error) {
      console.log("Error fetching news", error);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      navigate(`/stockresults/${searchSymbol.trim().toUpperCase()}`);
      setIsSearchActive(false);
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <img src={logo} onClick={()=>navigate('/dashboard')} alt="ShariaStock Logo" className="w-48 h-14 object-fill cursor-pointer" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
              <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                <img src={user.profilePicture || account} alt="profile" className="w-8 h-8 object-cover" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{user.name || 'Welcome!'}</span>
              <span className="text-xs text-gray-500">{email || 'Sign in'}</span>
            </div>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                  className="flex items-center w-full py-2 px-3 rounded-lg hover:bg-indigo-50 text-gray-700"
                >
                  <TrendingUp className="w-5 h-5 mr-3 text-indigo-600" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { navigate('/watchlist'); setIsMobileMenuOpen(false); }}
                  className="flex items-center w-full py-2 px-3 rounded-lg hover:bg-indigo-50 text-gray-700"
                >
                  <Heart className="w-5 h-5 mr-3 text-indigo-600" />
                  <span>Watchlist</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { navigate('/news'); setIsMobileMenuOpen(false); }}
                  className="flex items-center w-full py-2 px-3 rounded-lg hover:bg-indigo-50 text-gray-700"
                >
                  <Newspaper className="w-5 h-5 mr-3 text-indigo-600" />
                  <span>News</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                  className="flex items-center w-full py-2 px-3 rounded-lg hover:bg-indigo-50 text-gray-700"
                >
                  <img src={account} alt="account" className="w-5 h-5 mr-3" />
                  <span>Profile</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <img src={logo} onClick={()=>navigate('/dashboard')} alt="ShariaStock Logo" className="w-48 h-14 object-fill cursor-pointer" />
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                {isSearchActive && suggestions.length > 0 && (
                  <ul 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-80 overflow-y-auto z-20"
                  >
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.SYMBOL}
                        onClick={() => {
                          setSearchSymbol(suggestion.SYMBOL);
                          setIsSearchActive(false);
                          navigate(`/stockresults/${suggestion.SYMBOL}`);
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
                onClick={() => navigate('/watchlist')}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
              {isSearchActive && suggestions.length > 0 && (
                <ul 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto z-20"
                >
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.SYMBOL}
                      onClick={() => {
                        setSearchSymbol(suggestion.SYMBOL);
                        setIsSearchActive(false);
                        navigate(`/stockresults/${suggestion.SYMBOL}`);
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

        {/* Welcome Card (Only shown for mobile) */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-md sm:hidden">
          <h2 className="text-xl font-bold mb-1">Welcome{user.name ? `, ${user.name}!` : '!'}</h2>
          <p className="text-indigo-100 mb-3">Let's check today's market updates</p>
          <div className="flex justify-between">
            <button 
              onClick={() => navigate('/trendingstocks')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-indigo-600 py-2 px-4 rounded-lg text-sm backdrop-blur-sm transition-colors"
            >
              Market Trends
            </button>
            <button 
              onClick={() => navigate('/watchlist')}
              className="bg-white text-indigo-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors hover:bg-opacity-90"
            >
              My Watchlist
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
              <span>View All</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => navigate(`/categoryresultspage/${category.path}`)}
                className={`${category.bgColor} ${category.textColor} rounded-xl py-4 px-4 text-left shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium">{category.name.split(' ').slice(1).join(' ')}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trending Stocks */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-2xl p-5 shadow-sm h-full">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold flex items-center text-gray-800">
                  <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                  <span>Trending Stocks</span>
                </h2>
                <button 
                  onClick={() => navigate('/trendingstocks')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingStocks.map((stock, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/stockresults/${stock.symbol}`)}
                    className="relative p-4 rounded-xl cursor-pointer transition-all hover:shadow-md hover:scale-102 overflow-hidden border border-gray-100 hover:border-transparent group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stock.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm p-1.5 flex items-center justify-center">
                          <img 
                            src={stock.logo} 
                            alt="logo"
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/40" }}
                          />
                        </div>
                        <button 
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            // Add watchlist logic here
                          }}
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="text-base font-semibold mb-1">{stock.name}</h3>
                          <div className="text-xs text-gray-500">{stock.symbol}</div>
                        </div>
                        <div className={`flex items-center ${stock.isUp ? 'text-green-600' : 'text-red-600'} font-medium text-sm`}>
                          {stock.isUp ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                          <span>{stock.change}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market News */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-2xl p-5 shadow-sm h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center text-gray-800">
                  <Newspaper className="w-5 h-5 mr-2 text-indigo-600" />
                  <span>Market News</span>
                </h2>
                {newsArticles.length > 0 && (
                  <button
                    onClick={() => navigate('/news')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                  >
                    <span>More</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {newsLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <LoaderCircle className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                ) : newsArticles.length > 0 ? (
                  newsArticles.map((news, index) => (
                    <div 
                      key={index} 
                      className="p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100 group"
                      onClick={() => window.open(news.link, '_blank')}
                    >
                      <h3 className="font-medium mb-1.5 line-clamp-2 text-sm group-hover:text-indigo-700 transition-colors">{news.title}</h3>
                      <p className="text-gray-600 text-xs line-clamp-2 mb-2">{news.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">{formatDate(news.pubDate)}</span>
                        <span className="text-indigo-600 text-xs hover:text-indigo-700 font-medium flex items-center">
                          <span>Read more</span>
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-10">
                    <Newspaper className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">No news available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
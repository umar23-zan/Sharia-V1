import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Heart, LoaderCircle, ChevronRight, TrendingUp, Newspaper, ArrowUp, ArrowDown } from 'lucide-react';
import axios from 'axios';
import { getUserData } from '../api/auth';
import niftyCompanies from '../nifty_symbols.json';
import account from '../images/account-icon.svg';

const Dashboard = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState({});
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const searchInputRef = useRef(null);
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
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchSymbol(value);
    setIsSearchActive(!!value);

    if (value) {
      const filteredCompanies = companies.filter(
        (company) =>
          company["NAME OF COMPANY"].toUpperCase().includes(value) || company.SYMBOL.includes(value)
      );
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
          <div 
            className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-105" 
            onClick={() => navigate('/profile', { state: { user } })}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
              <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                <img src={user.profilePicture || account} alt="profile" className="w-10 h-10 object-cover" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{user.name || 'Welcome!'}</span>
              <span className="text-sm text-gray-500">{email || 'Sign in for personalized experience'}</span>
            </div>
          </div>
          <div className="flex gap-5">
            <button
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/watchlist')}
            >
              <Heart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">3</span>
            </button>
            <button
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/notificationpage')}
            >
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">5</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks, crypto & more..."
                className="w-full pl-14 pr-5 py-4 border-none focus:outline-none focus:ring-0 text-base"
                ref={searchInputRef}
                onChange={handleInputChange}
                value={searchSymbol}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
            </div>
            {isSearchActive && suggestions.length > 0 && (
              <ul className="max-h-80 overflow-y-auto border-t border-gray-100">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.SYMBOL}
                    onClick={() => {
                      setSearchSymbol(suggestion.SYMBOL);
                      setIsSearchActive(false);
                      navigate(`/stockresults/${suggestion.SYMBOL}`);
                    }}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={suggestion.Company_Logo} 
                        alt="logo"
                        className="w-8 h-8 object-cover"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/32" }}
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-base font-medium">{suggestion["NAME OF COMPANY"]}</span>
                      <span className="text-sm text-gray-500">{suggestion.SYMBOL}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span>Categories</span>
            <span className="ml-2 text-sm font-normal text-gray-500">Discover stocks by sector</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => navigate(`/categoryresultspage/${category.path}`)}
                className={`${category.bgColor} ${category.textColor} rounded-xl py-4 px-4 text-left shadow-sm hover:shadow-md transition-all`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium">{category.name.split(' ').slice(1).join(' ')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Stocks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold flex items-center">
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
              <div className="grid grid-cols-2 gap-4">
                {trendingStocks.map((stock, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/stockresults/${stock.symbol}`)}
                    className="relative p-5 rounded-xl cursor-pointer transition-all hover:shadow-md hover:scale-102 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stock.color} opacity-10`}></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-12 h-12 rounded-lg bg-white shadow-sm p-1.5 flex items-center justify-center">
                          <img 
                            src={stock.logo} 
                            alt="logo"
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/40" }}
                          />
                        </div>
                        <button className="text-gray-400 hover:text-indigo-600">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{stock.name}</h3>
                          <div className="text-xs text-gray-500">{stock.symbol}</div>
                        </div>
                        <div className={`flex items-center ${stock.isUp ? 'text-green-600' : 'text-red-600'} font-medium`}>
                          {stock.isUp ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold flex items-center">
                  <Newspaper className="w-5 h-5 mr-2 text-indigo-600" />
                  <span>Market News</span>
                </h2>
                {newsArticles.length > 0 && (
                  <button
                    onClick={() => navigate('/news')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                  >
                    <span>More News</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {newsLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <LoaderCircle className="w-10 h-10 text-indigo-600 animate-spin" />
                  </div>
                ) : newsArticles.length > 0 ? (
                  newsArticles.map((news, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                      onClick={() => window.open(news.link, '_blank')}
                    >
                      <h3 className="font-medium mb-2 line-clamp-2">{news.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{news.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">{formatDate(news.pubDate)}</span>
                        <span className="text-indigo-600 text-sm hover:text-indigo-700 font-medium flex items-center">
                          <span>Read</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-10">
                    <Newspaper className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p>No news available</p>
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
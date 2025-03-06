import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Heart, LoaderCircle, ChevronRight, TrendingUp, Newspaper, ArrowUp, ArrowDown, Menu, X } from 'lucide-react';
import axios from 'axios';
import { getUserData } from '../api/auth';
import Header from './Header';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [newsArticles, setNewsArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
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


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };



  return (
    <div className=" min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Header />
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-md sm:hidden">
          <h2 className="text-xl font-bold mb-1">Welcome{user.name ? `, ${user.name}!` : '!'}</h2>
          <p className="text-indigo-100 mb-3">Let's check today's market updates</p>
          <div className="flex justify-between">
            <button 
              onClick={() => navigate('/trendingstocks', { state: { user } })}
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
            
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => navigate(`/categoryresultspage/${category.path}`, { state: { user } })}
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
                  onClick={() => navigate('/trendingstocks', { state: { user } })}
                  className="text-indigo-600 hover:text-indigo-700 cursor-pointer text-sm font-medium flex items-center"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingStocks.map((stock, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/stockresults/${stock.symbol}`, { state: { user } })}
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
                    onClick={() => navigate('/news',{ state: { user } })}
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
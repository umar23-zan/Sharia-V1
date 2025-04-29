import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Search, TrendingUp, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import niftyCompanies from '../nifty_symbols.json';
import { Helmet } from 'react-helmet';
const HeaderDash = lazy(() => import('./HeaderDash'));
import logo from '../images/ShariaStocks-logo/logo1.jpeg';
import { getUserData } from '../api/auth';
import PaymentAlertModal from './PaymentAlertModal';
import usePaymentAlert from './usePaymentAlert';

const Dashboard = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState({});
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const sliderRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const email = localStorage.getItem('userEmail');
  const { isOpen, type, daysRemaining, amount, closeAlert } = usePaymentAlert(user);

  useEffect(() => {
    setCompanies(niftyCompanies);
    if (email) {
      fetchUserData();
    }
  }, [email]);

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const scrollPosition = sliderRef.current.scrollLeft;
        const slideWidth = sliderRef.current.offsetWidth;
        const newActiveSlide = Math.round(scrollPosition / slideWidth);
        setActiveSlide(newActiveSlide);
      }
    };

    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('scroll', handleScroll);
      return () => sliderElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

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
        .slice(0, 6);
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

  const trendingStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', change: '+2.3%', price: '₹2,842.35', trend: 'up', logo: 'https://logo.clearbit.com/ril.com' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', change: '+1.5%', price: '₹1,678.90', trend: 'up', logo: 'https://logo.clearbit.com/hdfcbank.com' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', change: '-0.8%', price: '₹3,452.15', trend: 'down', logo: 'https://logo.clearbit.com/tcs.com' },
    { symbol: 'INFY', name: 'Infosys Ltd', change: '+1.2%', price: '₹1,345.70', trend: 'up', logo: 'https://logo.clearbit.com/infosys.com' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', change: '+0.7%', price: '₹958.40', trend: 'up', logo: 'https://logo.clearbit.com/icicibank.com' },
    { symbol: 'SBIN', name: 'State Bank of India', change: '-0.3%', price: '₹640.15', trend: 'down', logo: 'https://logo.clearbit.com/sbi.co.in' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', change: '+3.1%', price: '₹745.20', trend: 'up', logo: 'https://logo.clearbit.com/tatamotors.com' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', change: '-1.4%', price: '₹6,890.55', trend: 'down', logo: 'https://logo.clearbit.com/bajajfinserv.in' }
  ];
  

  const halalStocks = [
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: '₹745.20', change: '+3.1%', trend: 'up', marketCap: '₹245,621 Cr', complianceScore: 98, logo: 'https://logo.clearbit.com/tatamotors.com' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹3,452.15', change: '-0.8%', trend: 'down', marketCap: '₹1,265,430 Cr', complianceScore: 97, logo: 'https://logo.clearbit.com/tcs.com' },
    { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', price: '₹1,245.30', change: '+0.5%', trend: 'up', marketCap: '₹337,845 Cr', complianceScore: 96, logo: 'https://logo.clearbit.com/hcltech.com' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', price: '₹2,875.60', change: '+0.9%', trend: 'up', marketCap: '₹276,124 Cr', complianceScore: 93, logo: 'https://logo.clearbit.com/asianpaints.com' },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', price: '₹9,845.25', change: '-1.2%', trend: 'down', marketCap: '₹284,332 Cr', complianceScore: 92, logo: 'https://logo.clearbit.com/ultratechcement.com' },
    { symbol: 'NESTLEIND', name: 'Nestle India Ltd', price: '₹23,456.50', change: '+0.6%', trend: 'up', marketCap: '₹226,189 Cr', complianceScore: 91, logo: 'https://logo.clearbit.com/nestle.in' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', price: '₹2,456.20', change: '-0.4%', trend: 'down', marketCap: '₹576,890 Cr', complianceScore: 90, logo: 'https://logo.clearbit.com/hul.co.in' },
    { symbol: 'INFY', name: 'Infosys Ltd', price: '₹1,345.70', change: '+1.2%', trend: 'up', marketCap: '₹556,432 Cr', complianceScore: 89, logo: 'https://logo.clearbit.com/infosys.com' },
    { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories Ltd", price: '₹6,024.80', change: '+0.7%', trend: 'up', marketCap: '₹100,234 Cr', complianceScore: 95, logo: 'https://logo.clearbit.com/drreddys.com' },
    { symbol: 'DIVISLAB', name: "Divi's Laboratories Ltd", price: '₹3,824.60', change: '+0.4%', trend: 'up', marketCap: '₹101,546 Cr', complianceScore: 94, logo: 'https://logo.clearbit.com/divislabs.com' }
  ];
  
  

  const categories = [
    { name: 'Technology', icon: 'laptop', count: '42' },
    { name: 'Healthcare', icon: 'activity', count: '28' },
    { name: 'Consumer Goods', icon: 'shopping-bag', count: '36' },
    { name: 'Energy', icon: 'zap', count: '19' }
  ];

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const navigateToSlide = (slideIndex) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: slideIndex * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
      setActiveSlide(slideIndex);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>ShariaStocks | Ethical Stock Investing in India</title>
        <meta
          name="description"
          content="Discover Halal investment opportunities in Indian stock markets. Analyze companies based on Shariah compliance with ShariaStocks."
        />
        <meta name="keywords" content="Halal Stocks, Shariah Compliance, Stock Market India, Ethical Investing, Muslim Investments" />
        <link rel="canonical" href="https://shariastocks.in/dashboard" />
      </Helmet>

      <Suspense fallback={<div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>}>
        <HeaderDash />
        <main className="max-w-7xl mx-auto pb-16">
          <PaymentAlertModal
            isOpen={isOpen}
            onClose={closeAlert}
            type={type}
            daysRemaining={daysRemaining}
            amount={amount}
          />

          {/* Hero Section with Search */}
          <section className="relative px-4 py-8 md:py-16 ">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-70"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-56 h-56 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            
            <div className="relative max-w-3xl mx-auto text-center space-y-8">
              

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" >
                  Invest with Purpose
                </h1>

                <p className="text-gray-600 text-lg max-w-lg mx-auto leading-relaxed">
                  Discover investment opportunities that align with your values and financial goals through Shariah-compliant stock analysis.
                </p>
              </div>

              {/* Search Bar */}
              <form
                className="relative mx-auto max-w-xl mt-12"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (suggestions.length > 0) {
                    setSearchSymbol(suggestions[0].SYMBOL);
                    navigate(`/stockresults/${suggestions[0].SYMBOL}`, { state: { user } });
                  }
                }}
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500 "></div>
                  <div className="relative bg-white rounded-xl shadow-xl">
                    <input
                      type="text"
                      onChange={handleInputChange}
                      value={searchSymbol}
                      ref={searchInputRef}
                      placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"
                      className="w-full py-5 pl-6 pr-16 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>

                  {isSearchActive && suggestions.length > 0 && (
                    <ul className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.SYMBOL}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSearchSymbol(suggestion.SYMBOL);
                            setIsSearchActive(false);
                            navigate(`/stockresults/${suggestion.SYMBOL}`, { state: { user } });
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden text-indigo-600 font-medium">
                          <img
                              src={suggestion.Company_Logo}
                              alt={`${suggestion["NAME OF COMPANY"]} logo`}
                              className="w-6 h-6 object-cover"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/32" }}
                            />
                          </div>
                          <div className="flex flex-col flex-1" data-testid="stock-symbol-section">
                            <span className="text-sm font-medium">{truncateText(suggestion["NAME OF COMPANY"], 25)}</span>
                            <span className="text-xs text-gray-500">{suggestion.SYMBOL}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-4 text-center">
                  Enter a stock symbol to explore detailed information and analysis
                </p>
              </form>
            </div>
          </section>

          {/* Trending Stocks Section - Enhanced with modern slider */}
          <section className="w-full max-w-6xl mx-auto px-4 mt-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Trending Stocks
                    </h2>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                      onClick={() => scrollSlider('left')}
                      aria-label="Previous stocks"
                      data-testid="prev-button"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                      onClick={() => scrollSlider('right')}
                      aria-label="Next stocks"
                      data-testid="next-button"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Stocks Slider */}
                <div className="relative">          
                  <div 
                    ref={sliderRef}
                    className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-4 py-2 px-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    data-testid="trending-slider"
                  >
                    {trendingStocks.map((stock, index) => (
                      <div 
                        key={stock.symbol}
                        onClick={() => navigate(`/stockresults/${stock.symbol}`, { state: { user } })}
                        className="min-w-[220px] flex-shrink-0 snap-start p-5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-indigo-700 group-hover:scale-110 transition-transform">
                            <img 
                              src={stock.logo} 
                              alt={stock.symbol} 
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'block';
                              }}
                            />
                            <span 
                              className="hidden"
                              style={{ display: 'none' }}
                            >
                              {stock.symbol.substring(0, 2)}
                            </span>
                          </div>
                          
                          <div className="ml-3 flex-1">
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-xs text-gray-500 truncate">{stock.name}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                          <div className="text-lg font-semibold">{stock.price}</div>
                          <div className={`text-sm ${stock.trend === 'up' ? 'text-green-600' : 'text-red-600'} font-medium flex items-center px-2 py-1 rounded-full ${stock.trend === 'up' ? 'bg-green-50' : 'bg-red-50'}`}>
                            {stock.trend === 'up' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <polyline points="18 15 12 9 6 15"></polyline>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            )}
                            {stock.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Dots indicator */}
                  <div className="flex justify-center mt-4 gap-2">
                    {[...Array(2)].map((_, i) => (
                      <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${i === activeSlide ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`}
                        onClick={() => navigateToSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-100">
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Pro Tip:</span> Click on any stock card to view detailed analysis
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          {/* <section className="w-full max-w-6xl mx-auto px-4 mt-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                  Browse by Categories
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((category, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => navigate(`/category/${category.name.toLowerCase().replace(' ', '-')}`)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                            {category.icon === 'laptop' && <>
                              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                              <line x1="8" y1="21" x2="16" y2="21"></line>
                              <line x1="12" y1="17" x2="12" y2="21"></line>
                            </>}
                            {category.icon === 'activity' && <>
                              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </>}
                            {category.icon === 'shopping-bag' && <>
                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                              <line x1="3" y1="6" x2="21" y2="6"></line>
                              <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </>}
                            {category.icon === 'zap' && <>
                              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </>}
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-indigo-600">{category.count} stocks</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section> */}

          {/* Top 10 Halal Stocks Section - With Conditional Blur Based on User Plan */}
          <section className="w-full max-w-6xl mx-auto px-4 mt-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Star className="w-5 h-5 text-green-600 fill-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                      Top 10 Halal Stocks
                    </h2>
                    <p className="text-sm text-gray-500">Shariah-compliant investment options</p>
                  </div>
                  <div className="ml-auto px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Shariah Verified
                  </div>
                </div>
                
                <div className="overflow-hidden relative">
                  {/* Table Header */}
                  <div className="hidden md:flex text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-3 px-3">
                    <div className="w-1/2 md:w-2/5">Company</div>
                    <div className="w-1/4 md:w-1/5 text-right">Current Price</div>
                    <div className="w-1/4 md:w-1/5 text-right">24h Change</div>
                    <div className="hidden md:block w-1/5 text-right">Market Cap</div>
                  </div>
                  
                  {/* Table Content */}
                  <div className="space-y-1 mt-3" data-testid="halal-stocks-section">
                    {halalStocks.map((stock, index) => {
                      // Check if the user is on a free plan and this row should be blurred
                      const shouldBlur = user?.subscription?.plan === 'free' && index > 2;
                      
                      return (
                        <div 
                          key={stock.symbol}
                          className={`flex items-center py-3 ${index !== 9 ? 'border-b border-gray-100' : ''} ${shouldBlur ? 'filter blur-sm' : ''} hover:bg-gray-50 cursor-pointer transition-colors rounded-lg px-3`}
                          onClick={() => {
                            // Only navigate if not blurred or user has premium access
                            if (!shouldBlur) {
                              navigate(`/stockresults/${stock.symbol}`, { state: { user } });
                            } else {
                              navigate('/pricing');
                            }
                          }}
                        >
                          <div className="w-1/2 md:w-2/5 flex items-center">
                            <div className="hidden sm:flex w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-teal-50 items-center justify-center font-bold text-green-700 mr-3">
                              <img 
                                src={stock.logo} 
                                alt={stock.symbol} 
                                className="w-7 h-7 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'block';
                                }}
                              />
                              <span 
                                className="hidden"
                                style={{ display: 'none' }}
                              >
                                {stock.symbol.substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-xs text-gray-500 truncate">{stock.name}</div>
                              <div className="md:hidden flex items-center mt-1">
                                <div className={`h-1.5 w-1.5 rounded-full ${stock.trend === 'up' ? 'bg-green-500' : 'bg-red-500'} mr-1`}></div>
                                <span className={`text-xs ${stock.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{stock.change}</span>
                              </div>
                            </div>
                            
                            {!shouldBlur && index <= 2 && (
                              <div className="ml-auto md:hidden flex items-center">
                                <div className={`px-2 py-1 rounded-full text-xs ${stock.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                  {stock.change}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="hidden md:block w-1/4 md:w-1/5 text-right font-medium">
                            {stock.price}
                          </div>
                          
                          <div className="hidden md:block w-1/4 md:w-1/5 text-right">
                            <div className={`inline-flex items-center ${stock.trend === 'up' ? 'text-green-600' : 'text-red-600'} font-medium px-2 py-1 rounded-full ${stock.trend === 'up' ? 'bg-green-50' : 'bg-red-50'}`}>
                              {stock.trend === 'up' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                  <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              )}
                              {stock.change}
                            </div>
                          </div>
                          
                          <div className="hidden md:block w-1/5 text-right text-gray-600">
                            {stock.marketCap}
                          </div>
                          
                          {/* Compliance Score Indicator (Only for Premium) */}
                          {/* {!shouldBlur && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden lg:flex items-center">
                              <div className="w-8 h-8">
                                <svg viewBox="0 0 36 36" className="w-full h-full">
                                  <path 
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#eee"
                                    strokeWidth="3"
                                  />
                                  <path 
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="3"
                                    strokeDasharray={`${stock.complianceScore}, 100`}
                                  />
                                </svg>
                              </div>
                            </div>
                          )} */}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Upgrade Overlay - Only shown for free users */}
                  {user?.subscription?.plan === 'free' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '120px' }}>
                      <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg text-center max-w-md pointer-events-auto border border-gray-100">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center mx-auto mb-4 text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                            <line x1="16" y1="8" x2="2" y2="22"></line>
                            <line x1="17.5" y1="15" x2="9" y2="15"></line>
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Unlock All Halal Stocks</h3>
                        <p className="text-gray-600 mb-4">Upgrade to Premium to access our complete list of Shariah-compliant stocks and detailed compliance analysis.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button 
                            onClick={() => navigate('/subscriptiondetails')}
                            className="px-5 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                          >
                            Upgrade Now
                          </button>
                          <button 
                            onClick={() => navigate('/halal-stocks-preview')}
                            className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-teal-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  {user?.subscription?.plan === 'free' ? (
                    <>
                      <p className="text-sm text-gray-600 mb-2 sm:mb-0">
                        <span className="font-medium">Premium Feature:</span> Access all Shariah-compliant stocks with detailed analysis
                      </p>
                      <button 
                        onClick={() => navigate('/subscriptiondetails')}
                        className="text-sm px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-md transition-all"
                      >
                        Upgrade to Premium
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Shariah Compliance:</span> These stocks meet essential halal investment criteria
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>


          {/* Newsletter Section */}
          {/* <section className="w-full max-w-5xl mx-auto px-4 mt-12">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <div className="p-8 md:p-10 text-white relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Stay Updated</h2>
                  <p className="opacity-90 max-w-md">Get weekly insights on Shariah-compliant stocks and market trends delivered to your inbox.</p>
                </div>
                
                <div className="w-full md:w-auto">
                  <form className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="px-4 py-3 rounded-lg text-white w-full sm:w-64 outline-none ring-2 ring-white bg-transparent"
                    />
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                  <p className="text-xs opacity-80 mt-2">We respect your privacy. Unsubscribe at any time.</p>
                </div>
              </div>
            </div>
          </section> */}

          {/* Footer */}
          <footer className="mt-16 text-center text-gray-500 text-sm border-t border-gray-100 pt-6 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="mb-4 md:mb-0">
                  <img 
                    src={logo} 
                    alt="ShariaStocks Logo" 
                    className="h-10 mx-auto md:mx-0" 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/40x40?text=Logo" }}
                  />
                </div>
                
                <div className="flex space-x-4">
                  {['About', 'Privacy', 'Terms', 'Blogs', 'FAQ'].map((item, index) => (
                    <a key={index} href={`/${item.toLowerCase()}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
                      {item}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 pb-8">
                <p>© 2025 Zansphere Private Limited. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </Suspense>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Filter, Star, Bookmark, Lock } from 'lucide-react';
import axios from 'axios';
import logo from '../images/ShariaStocks-logo/logo1.jpeg'

const TrendingStocks = () => {
  const navigate = useNavigate();
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState(null);
  const trendingStockSymbols = [
    'RELIANCE',
    'BHARTIARTL',
    'HDFCBANK',
    'SBIN',
    'SBILIFE',
    'BAJAJFINSV',
    'ULTRACEMCO',
    'TATASTEEL',
    'ADANIENT',
    'LTF',
    'HEROMOTOCO',
    'APOLLOHOSP',
    'TATAMOTORS',
  ];
  
  const fetchUserPlan = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail')

      const response = await fetch(`/api/auth/user-plan/${userEmail}`); 
      if (!response.ok) {
        throw new Error(`Failed to fetch user plan: ${response.status}`);
      }
      const planData = await response.json();
      setUserPlan(planData.plan);
    } catch (error) {
      console.error("Could not fetch user plan:", error);
      setUserPlan('free'); // Default to 'free' plan in case of error
    }
  };
  
  useEffect(() => {
    fetchUserPlan();
    const fetchAllStocksAndFilterTrending = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/stocks/all'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const filteredTrendingStocks = data.filter(stock =>
          trendingStockSymbols.includes(stock.SYMBOL)
        );

        console.log(filteredTrendingStocks)
        const transformedTrendingStocksPromises = filteredTrendingStocks.map(async (stock) => {
          try {
            const companyDetailsResponse = await axios.get(`http://13.201.131.141:5000/api/company-details/${stock.SYMBOL}.NS`);
            return {
              symbol: stock.SYMBOL,
              name: companyDetailsResponse.data?.company_name,
              compliance: stock.Initial_Classification,
              sector: stock.Sector,
              complianceScore: stock.Shariah_Confidence_Percentage || 0,
              price: companyDetailsResponse.data?.current_price || 0,
              priceChange: companyDetailsResponse.data?.price_change || 0,
              peRatio: companyDetailsResponse.data?.pe_ratio || 0,
              volume: companyDetailsResponse.data?.volume || 0,
            };
          } catch (companyDetailsError) {
            console.error(`Error fetching company details for ${stock.SYMBOL}:`, companyDetailsError);
            
            return {
              symbol: stock.SYMBOL,
              name: stock.Company_Name,
              compliance: stock.Initial_Classification,
              sector: stock.Sector,
              complianceScore: stock.Sharia_Confidence_Percentage || 0,
              price: 0,
              priceChange: 0,
              marketCap: 0,
              volume: 0,
            };
          }
                  
        });
        const transformedTrendingStocks = await Promise.all(transformedTrendingStocksPromises);
        console.log(transformedTrendingStocks)
        setTrendingStocks(transformedTrendingStocks);
        setLoading(false);
      } catch (error) {
        console.error("Could not fetch and filter trending stocks:", error);
        setLoading(false);
        // Error handling
      }
    };

    fetchAllStocksAndFilterTrending();
  }, []); // Empty dependency array

  const getComplianceColor = (compliance) => {
    if (compliance === 'Halal') return 'bg-green-100 text-green-700';
    if (compliance === 'Doubtful') return 'bg-yellow-100 text-yellow-700';
    if (compliance === 'Haram') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getComplianceBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const isFreePlan = userPlan === 'free';
  
  const handleUpgradeClick = () => {
    navigate('/subscription'); // Navigate to subscription page
  };

  // Show only first 2 stocks for free plan users
  const visibleStocks = isFreePlan ? trendingStocks.slice(0, 2) : trendingStocks;
  const hiddenStocks = isFreePlan ? trendingStocks.slice(2) : [];

  return (
    <div className="max-w-7xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <div className="w-48 h-14 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={logo} onClick={()=>navigate('/dashboard')} alt="ShariaStock Logo" className="w-full h-full object-fill cursor-pointer" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search stocks..." 
              className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <div className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
            AI
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Trending Stocks</h2>
            <p className="text-gray-600">Discover the most popular stocks among Shariah-conscious investors</p>
          </div>
          {isFreePlan && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg flex items-center">
              <div className="mr-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span>Free Plan: Access limited to 2 trending stocks</span>
            </div>
          )}
        </div>
        
        {/* Visible Stock List (first 2 for free users) */}
        <div className="space-y-4">
          {visibleStocks.map((stock, index) => (
            <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-bold">{stock.symbol}</h3>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getComplianceColor(stock.compliance)}`}>
                        {stock.compliance}
                      </span>
                    </div>
                    <p className="text-gray-600">{stock.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Star className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-bold">₹{stock.price.toFixed(2)}</span>
                  <span className={`ml-2 flex items-center ${stock.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.priceChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(stock.priceChange).toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-3">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">PE Ratio</p>
                    <p className="font-medium">{typeof stock.peRatio === 'string' ? stock.peRatio : `${(stock.peRatio).toFixed(2)}`}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Volume</p>
                    <p className="font-medium">{typeof stock.volume === 'string' ? stock.volume : `${(stock.volume / 1e6).toFixed(1)}M`}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Sector</p>
                    <p className="font-medium">{stock.sector}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Compliance Score</p>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-200 rounded-full mr-2 overflow-hidden">
                        <div 
                          className={`h-full ${getComplianceBarColor(stock.complianceScore)}`} 
                          style={{ width: `${stock.complianceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{stock.complianceScore.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <button 
                    className="text-purple-600 hover:underline" 
                    onClick={() => navigate(`/stockresults/${stock.symbol}`)}
                  >
                    View Details
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Add to wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Hidden Stocks Container with Single Blur Overlay */}
          {isFreePlan && hiddenStocks.length > 0 && (
            <div className="relative mt-8 border-t pt-8">
              {/* Deliberately showing a glimpse of additional stocks */}
              <h3 className="text-lg font-semibold mb-4">More Trending Stocks</h3>
              
              <div className="space-y-4">
                {hiddenStocks.map((stock, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="p-4 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-bold">{stock.symbol}</h3>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getComplianceColor(stock.compliance)}`}>
                              {stock.compliance}
                            </span>
                          </div>
                          <p className="text-gray-600">{stock.name}</p>
                        </div>
                      </div>

                      {/* Minimal content to show behind blur */}
                      <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold">₹{stock.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Single blur overlay with upgrade message */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col justify-center items-center p-8 z-10">
                <div className="text-center max-w-lg">
                  <div className="flex justify-center mb-6">
                    <div className="bg-purple-100 p-4 rounded-full">
                      <Lock className="w-12 h-12 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Unlock {hiddenStocks.length} More Shariah-Compliant Stocks</h3>
                  <p className="text-gray-600 mb-6">
                    Upgrade your account to view all trending stocks, detailed analytics, and get personalized Shariah investment recommendations.
                  </p>
                  <button 
                    onClick={handleUpgradeClick}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors font-medium text-lg shadow-lg"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade banner at the bottom */}
        {isFreePlan && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Maximize Your Halal Investment Potential</h3>
                <p className="text-white/90">
                  Get unlimited access to all Shariah-compliant stocks and advanced investment tools
                </p>
              </div>
              <button 
                onClick={handleUpgradeClick}
                className="bg-white text-purple-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingStocks;
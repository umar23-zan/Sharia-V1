import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Filter, Star, Bookmark, Lock,Search, Bell } from 'lucide-react';
import axios from 'axios'; 
import logo from '../images/ShariaStocks-logo/logo1.jpeg'
import account from '../images/account-icon.svg';
import Header from './Header';

const TrendingStocks = () => {
  const location = useLocation();
    const user = location.state?.user;
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

  // Dummy data for /api/stocks/all endpoint
  const dummyAllStocks = [
    { SYMBOL: 'RELIANCE', Company_Name: 'Reliance Industries Ltd', Initial_Classification: 'Halal', Sector: 'Energy', Sharia_Confidence_Percentage: 95 },
    { SYMBOL: 'BHARTIARTL', Company_Name: 'Bharti Airtel Ltd', Initial_Classification: 'Doubtful', Sector: 'Telecommunications', Sharia_Confidence_Percentage: 70 },
    { SYMBOL: 'HDFCBANK', Company_Name: 'HDFC Bank Ltd', Initial_Classification: 'Haram', Sector: 'Financial Services', Sharia_Confidence_Percentage: 40 },
    { SYMBOL: 'SBIN', Company_Name: 'State Bank of India', Initial_Classification: 'Doubtful', Sector: 'Financial Services', Sharia_Confidence_Percentage: 65 },
    { SYMBOL: 'SBILIFE', Company_Name: 'SBI Life Insurance Company Ltd', Initial_Classification: 'Haram', Sector: 'Financial Services', Sharia_Confidence_Percentage: 30 },
    { SYMBOL: 'BAJAJFINSV', Company_Name: 'Bajaj Finserv Ltd', Initial_Classification: 'Haram', Sector: 'Financial Services', Sharia_Confidence_Percentage: 25 },
    { SYMBOL: 'ULTRACEMCO', Company_Name: 'UltraTech Cement Ltd', Initial_Classification: 'Halal', Sector: 'Materials', Sharia_Confidence_Percentage: 88 },
    { SYMBOL: 'TATASTEEL', Company_Name: 'Tata Steel Ltd', Initial_Classification: 'Doubtful', Sector: 'Materials', Sharia_Confidence_Percentage: 75 },
    { SYMBOL: 'ADANIENT', Company_Name: 'Adani Enterprises Ltd', Initial_Classification: 'Doubtful', Sector: 'Conglomerates', Sharia_Confidence_Percentage: 60 },
    { SYMBOL: 'LTF', Company_Name: 'Larsen & Toubro Finance Ltd', Initial_Classification: 'Haram', Sector: 'Financial Services', Sharia_Confidence_Percentage: 15 },
    { SYMBOL: 'HEROMOTOCO', Company_Name: 'Hero MotoCorp Ltd', Initial_Classification: 'Halal', Sector: 'Automotive', Sharia_Confidence_Percentage: 92 },
    { SYMBOL: 'APOLLOHOSP', Company_Name: 'Apollo Hospitals Enterprise Ltd', Initial_Classification: 'Halal', Sector: 'Healthcare', Sharia_Confidence_Percentage: 85 },
    { SYMBOL: 'TATAMOTORS', Company_Name: 'Tata Motors Ltd', Initial_Classification: 'Doubtful', Sector: 'Automotive', Sharia_Confidence_Percentage: 78 },
  ];

  // Dummy data for /api/company-details/:symbol endpoint (adjust prices and changes as needed)
  const dummyCompanyDetails = {
    'RELIANCE.NS': { company_name: 'RELIANCE INDUSTRIES LTD', current_price: 2500.50, price_change: 15.20, pe_ratio: 25.6, volume: 5000000 },
    'BHARTIARTL.NS': { company_name: 'BHARTI AIRTEL LTD', current_price: 800.20, price_change: -5.50, pe_ratio: 30.1, volume: 3500000 },
    'HDFCBANK.NS': { company_name: 'HDFC BANK LIMITED', current_price: 1650.00, price_change: -10.00, pe_ratio: 20.5, volume: 6000000 },
    'SBIN.NS': { company_name: 'STATE BANK OF INDIA', current_price: 600.80, price_change: 3.70, pe_ratio: 12.8, volume: 8000000 },
    'SBILIFE.NS': { company_name: 'SBI LIFE INSURANCE COMPANY LIMITED', current_price: 1300.00, price_change: -2.00, pe_ratio: 40.2, volume: 2500000 },
    'BAJAJFINSV.NS': { company_name: 'BAJAJ FINSERV LIMITED', current_price: 1700.00, price_change: 20.00, pe_ratio: 35.9, volume: 3000000 },
    'ULTRACEMCO.NS': { company_name: 'ULTRATECH CEMENT LIMITED', current_price: 8000.00, price_change: 50.00, pe_ratio: 28.4, volume: 1500000 },
    'TATASTEEL.NS': { company_name: 'TATA STEEL LIMITED', current_price: 1200.00, price_change: -15.00, pe_ratio: 15.7, volume: 4000000 },
    'ADANIENT.NS': { company_name: 'ADANI ENTERPRISES LIMITED', current_price: 2800.00, price_change: 30.00, pe_ratio: 50.0, volume: 2000000 },
    'LTF.NS': { company_name: 'L&T FINANCE HOLDINGS LIMITED', current_price: 120.00, price_change: -1.50, pe_ratio: 18.3, volume: 5500000 },
    'HEROMOTOCO.NS': { company_name: 'HERO MOTOCORP LIMITED', current_price: 3000.00, price_change: 25.00, pe_ratio: 22.1, volume: 1800000 },
    'APOLLOHOSP.NS': { company_name: 'APOLLO HOSPITALS ENTERPRISE LIMITED', current_price: 6500.00, price_change: -40.00, pe_ratio: 32.5, volume: 1200000 },
    'TATAMOTORS.NS': { company_name: 'TATA MOTORS LIMITED', current_price: 700.00, price_change: 8.00, pe_ratio: 10.9, volume: 7000000 },
  };


  const fetchUserPlan = async () => {
   
    setUserPlan(user.subscription.plan); 
  };

  useEffect(() => {
    fetchUserPlan();
    const fetchAllStocksAndFilterTrending = async () => {
      setLoading(true);
      try {
        const data = dummyAllStocks;

        const filteredTrendingStocks = data.filter(stock =>
          trendingStockSymbols.includes(stock.SYMBOL)
        );

        console.log("Filtered Trending Stocks (from dummy data):", filteredTrendingStocks)
        const transformedTrendingStocksPromises = filteredTrendingStocks.map(async (stock) => {
          try {
          
            const companyDetailsData = dummyCompanyDetails[`${stock.SYMBOL}.NS`];
            if (!companyDetailsData) {
              console.error(`No dummy company details found for ${stock.SYMBOL}.NS`);
            }

            return {
              symbol: stock.SYMBOL,
              name: companyDetailsData?.company_name || stock.Company_Name, 
              compliance: stock.Initial_Classification,
              sector: stock.Sector,
              complianceScore: stock.Sharia_Confidence_Percentage || 0,
              price: companyDetailsData?.current_price || 0,
              priceChange: companyDetailsData?.price_change || 0,
              peRatio: companyDetailsData?.pe_ratio || 0,
              volume: companyDetailsData?.volume || 0,
            };
          } catch (companyDetailsError) {
            console.error(`Error processing dummy company details for ${stock.SYMBOL}:`, companyDetailsError);
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
        console.log("Transformed Trending Stocks (dummy data):", transformedTrendingStocks)
        setTrendingStocks(transformedTrendingStocks);
        setLoading(false);
      } catch (error) {
        console.error("Could not fetch and filter trending stocks (dummy data):", error);
        setLoading(false);
        
      }
    };

    fetchAllStocksAndFilterTrending();
  }, []); 

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
    navigate('/subscriptiondetails');
  };

 
  const visibleStocks = isFreePlan ? trendingStocks.slice(0, 2) : trendingStocks;
  const hiddenStocks = isFreePlan ? trendingStocks.slice(2) : [];

  return (
    <div className="max-w-7xl mx-auto bg-white min-h-screen">
     <Header />
     
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Trending Stocks</h2>
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
                      <Heart className="w-5 h-5" />
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

          
          {isFreePlan && hiddenStocks.length > 0 && (
            <div className="relative mt-8 border-t pt-8">
             
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

                     
                      <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold">₹{stock.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            
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
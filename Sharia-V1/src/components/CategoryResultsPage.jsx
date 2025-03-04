import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoaderCircle, Star, Bookmark, BarChart, ArrowUpRight, ChevronDown, Filter, Info, Lock } from 'lucide-react';
import logo from '../images/ShariaStocks-logo/logo1.jpeg'

const StatusBadge = ({ status }) => {
  let badgeClasses = "text-xs font-medium px-2 py-1 rounded-full";
  
  if (status === 'Halal') {
    badgeClasses += ' bg-green-100 text-green-600';
  } else if (status === 'Doubtful') {
    badgeClasses += ' bg-yellow-100 text-yellow-600';
  } else if (status === 'Haram' || status === 'Non-Halal') {
    badgeClasses += ' bg-red-100 text-red-600';
  }
  
  return (
    <div className={badgeClasses}>
      {status}
    </div>
  );
};

const StockCard = ({ stock, index, isPremium, userPlan }) => {
  const navigate = useNavigate();
  const isBlurred = isPremium && userPlan === 'free';
  
  // Format percentage change with arrow and color
  const renderPercentChange = (change) => {
    const isPositive = change >= 0;
    const color = isPositive ? 'text-green-500' : 'text-red-500';
    const arrow = isPositive ? '↑' : '↓';
    return (
      <span className={`${color} font-medium ml-2`}>
        {arrow} {Math.abs(change).toFixed(2)}%
      </span>
    );
  };
  
  return (
    <div className={`bg-white rounded-xl p-6 mb-4 shadow-sm relative`}>
      
      {isBlurred && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <Lock className="w-12 h-12 text-purple-500 mb-2" />
          <p className="text-lg font-medium text-gray-800 mb-1">Premium Content</p>
          <p className="text-sm text-gray-600 mb-3">Upgrade to view all stocks</p>
          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700">
            Upgrade Now
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center">
            <h3 className="text-2xl font-bold mr-3 cursor-pointer" onClick={() => navigate(`/stockresults/${stock.symbol}`)}>
              {stock.symbol}
            </h3>
            <StatusBadge status={stock.compliance} />
            {index <= 2 && (
              <span className="ml-auto text-sm font-medium bg-purple-100 text-purple-600 px-2 py-1 rounded-lg">
                #{index + 1}
              </span>
            )}
          </div>
          <p className="text-gray-600">{stock.name}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">${Number(stock.price).toFixed(2)}</span>
          {renderPercentChange(stock.priceChange)}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-600">Compliance Score</span>
          <span className="text-sm font-medium">{stock.complianceScore || 0}</span>
        </div>
        <div className="bg-gray-200 h-2 rounded-full w-full">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${stock.complianceScore || 0}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <div>
          <div>Sector</div>
          <div className="font-medium text-gray-800">{stock.sector}</div>
        </div>
      </div>
      
      <div className="flex mt-4 pt-4 border-t border-gray-100 justify-between">
        <div className="flex space-x-3">
          <button className="text-gray-400 hover:text-gray-600">
            <Star className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
        <div className="flex space-x-3">
          <button className="text-gray-400 hover:text-gray-600">
            <BarChart className="w-5 h-5" />
          </button>
          <button className="text-purple-600 hover:text-purple-700 flex items-center">
            <span className="mr-1 text-sm font-medium">Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryResultsPage = () => {
  const { categoryName } = useParams();
  const [stockResults, setStockResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [userPlan, setUserPlan] = useState('free'); // Default to free
  const [selectedFilter, setSelectedFilter] = useState('All');
  const initialStockCount = 10;
  const halalcompanies = [
    'RELIANCE',
    'TCS',
    'INFY',
    'HINDUNILVR',
    'HCLTECH',
    'SUNPHARMA',
    'MARUTI',
    'ULTRACEMCO',
    'WIPRO',
    'ADANIENT',
  ];
  
  const fetchUserPlan = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      
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
    const fetchCategoryStocks = async () => {
      setLoading(true);
      setError(null);
      let apiUrl = '';

      if (categoryName.toLowerCase() === 'halal') {
        apiUrl = '/api/stocks/filter/halal-high-confidence';
      } else if (categoryName.toLowerCase() === 'technology') {
        apiUrl = `/api/stocks/filter/sector?sector=Technology`;
      } else if (categoryName.toLowerCase() === 'retail') {
        apiUrl = `/api/stocks/filter/industries?industries=Specialty Retail, Internet Retail, Apparel Retail`;
      } else if (categoryName.toLowerCase() === 'healthcare') {
        apiUrl = `/api/stocks/filter/sector?sector=Healthcare`;
      } else if (categoryName.toLowerCase() === 'foods') {
        apiUrl = `/api/stocks/filter/industries?industries=Packaged Foods, Food Distribution, Beverages - Wineries & Distilleries, Beverages - Non-Alcoholic,Beverages - Brewers`;
      } else {
        setError("Category not recognized.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(apiUrl);
        let transformedData;
        
        if (apiUrl === '/api/stocks/filter/halal-high-confidence') {
          const topHalalStocks = response.data.filter(stock =>
            halalcompanies.includes(stock.SYMBOL)
          );
          
          const transformedHalalStocksPromises = topHalalStocks.map(async (stock) => {
            try {
              const companyDetailsResponse = await axios.get(`http://13.201.131.141:5000/api/company-details/${stock.SYMBOL}.NS`);
              return {
                symbol: stock.SYMBOL,
                name: companyDetailsResponse.data?.company_name || stock.Company_Name,
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
                complianceScore: stock.Shariah_Confidence_Percentage || 0,
                price: 0,
                priceChange: 0,
                marketCap: 0,
                volume: 0,
              };
            }
          });
          
          transformedData = await Promise.all(transformedHalalStocksPromises);
        } else {
          const transformedCategoryStocksPromises = response.data.map(async (stock) => {
            try {
              const companyDetailsResponse = await axios.get(`http://13.201.131.141:5000/api/company-details/${stock.SYMBOL}.NS`);
              return {
                symbol: stock.SYMBOL,
                name: companyDetailsResponse.data?.company_name || stock.Company_Name,
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
                complianceScore: stock.Shariah_Confidence_Percentage || 0,
                price: 0,
                priceChange: 0,
                marketCap: 0,
                volume: 0,
              };
            }
          });
          
          transformedData = await Promise.all(transformedCategoryStocksPromises);
        }
        
        // Apply compliance filter if needed
        if (selectedFilter !== 'All') {
          transformedData = transformedData.filter(stock => stock.compliance === selectedFilter);
        }
        
        setStockResults(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching category stocks:", err);
        setError("Could not load stocks for this category.");
        setLoading(false);
      }
    };

    fetchCategoryStocks();
  }, [categoryName, selectedFilter]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };
  
  const stocksToDisplay = showMore ? stockResults : stockResults.slice(0, initialStockCount);

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };

  const categoryDisplayName = categoryName === 'halal' ? 'Top 10 Halal Stocks' : 
    (categoryName.charAt(0).toUpperCase() + categoryName.slice(1) + ' Stocks');
    
  const categoryDescription = categoryName === 'halal' ? 
    'The highest-ranked Shariah-compliant stocks based on compliance score and performance' :
    `Shariah compliance analysis of the top ${categoryName.toLowerCase()} companies`;

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white/80 z-50">
        <LoaderCircle className="w-16 h-16 animate-spin text-purple-600" />
        <p className="mt-4 text-gray-800">Loading {categoryDisplayName}...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen pb-12">
      <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <div className="w-48 h-14 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="ShariaStock Logo" className="w-full h-full object-fill" />
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
      <div className="container mx-auto px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-1">
            {categoryName === 'halal' ? (
              <div className="w-6 h-6 mr-2 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            ) : (
              <div className="w-6 h-6 mr-2 bg-blue-100 rounded-full"></div>
            )}
            <h1 className="text-2xl font-bold">{categoryDisplayName}</h1>
          </div>
          <p className="text-gray-600">{categoryDescription}</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: Feb 27, 2025</p>
        </div>
        
        {/* Filters */}
        {categoryName !== 'halal' && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Compliance:</span>
                {['All', 'Halal', 'Doubtful', 'Haram'].map(filter => (
                  <button 
                    key={filter}
                    className={`px-3 py-1 text-sm rounded-lg ${selectedFilter === filter ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => handleFilterChange(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              
              <div className="ml-auto bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                {stockResults.length} stocks
              </div>
            </div>
          </div>
        )}
        
        {/* Education box for Technology category */}
        {categoryName === 'technology' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Understanding Technology Stocks in Islamic Finance</h3>
                <p className="text-sm text-gray-700">
                  Technology companies often have favorable Shariah compliance characteristics due to their asset-light 
                  business models and typically low debt ratios. However, they may have compliance issues related to 
                  interest income from cash reserves or ancillary business activities. Each stock is evaluated individually 
                  against Shariah screening criteria.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Stock grid */}
        <div className="grid grid-cols-1  gap-4">
          {stocksToDisplay.map((stock, index) => (
            <StockCard 
              key={stock.symbol} 
              stock={stock} 
              index={index}
              isPremium={index >= 2} 
              userPlan={userPlan}
            />
          ))}
        </div>
        {userPlan === 'free' && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mt-8 text-center">
            <h3 className="text-xl font-bold text-purple-800 mb-2">Unlock Full Access to ShariaStock</h3>
            <p className="text-purple-700 mb-4">Get unlimited stock listings, advanced filtering, and real-time compliance alerts</p>
            <button className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700">
              Upgrade to Premium
            </button>
          </div>
        )}
        
        {/* Show More/Less Button */}
        {stockResults.length > initialStockCount && userPlan !== 'free' && (
          <div className="flex justify-center mt-8">
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg"
              onClick={handleShowMoreClick}
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryResultsPage;
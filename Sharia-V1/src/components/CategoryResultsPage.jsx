import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Keep axios import for potential conditional real API calls
import { LoaderCircle, Star, Bookmark, BarChart, ArrowUpRight, ChevronDown, Filter, Info, Lock, Search, Bell, Heart } from 'lucide-react';
import logo from '../images/ShariaStocks-logo/logo1.jpeg'
import account from '../images/account-icon.svg';
import Header from './Header';

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
          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer" onClick={() => {navigate('/subscriptiondetails')}}>
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
          <span className="text-2xl font-bold">₹{Number(stock.price).toFixed(2)}</span>
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
          <button className="text-purple-600 hover:text-purple-700 cursor-pointer flex items-center" onClick={() =>{navigate(`/stockresults/${stock.symbol}`)}}>
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
const location = useLocation();
    const user = location.state?.user;
const navigate = useNavigate()

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

  // Dummy data for category stock lists
  const dummyCategoryStocks = {
    'halal-high-confidence': [
      { SYMBOL: 'RELIANCE', Company_Name: 'Reliance Industries Ltd', Initial_Classification: 'Halal', Sector: 'Energy', Sharia_Confidence_Percentage: 95 },
      { SYMBOL: 'ULTRACEMCO', Company_Name: 'UltraTech Cement Ltd', Initial_Classification: 'Halal', Sector: 'Materials', Sharia_Confidence_Percentage: 88 },
      { SYMBOL: 'HEROMOTOCO', Company_Name: 'Hero MotoCorp Ltd', Initial_Classification: 'Halal', Sector: 'Automotive', Sharia_Confidence_Percentage: 92 },
      { SYMBOL: 'APOLLOHOSP', Company_Name: 'Apollo Hospitals Enterprise Ltd', Initial_Classification: 'Halal', Sector: 'Healthcare', Sharia_Confidence_Percentage: 85 },
      { SYMBOL: 'TCS', Company_Name: 'Tata Consultancy Services Ltd', Initial_Classification: 'Halal', Sector: 'Technology', Sharia_Confidence_Percentage: 90 },
      { SYMBOL: 'INFY', Company_Name: 'Infosys Ltd', Initial_Classification: 'Halal', Sector: 'Technology', Sharia_Confidence_Percentage: 89 },
      { SYMBOL: 'HINDUNILVR', Company_Name: 'Hindustan Unilever Ltd', Initial_Classification: 'Halal', Sector: 'Consumer Staples', Sharia_Confidence_Percentage: 87 },
      { SYMBOL: 'HCLTECH', Company_Name: 'HCL Technologies Ltd', Initial_Classification: 'Halal', Sector: 'Technology', Sharia_Confidence_Percentage: 86 },
      { SYMBOL: 'SUNPHARMA', Company_Name: 'Sun Pharmaceutical Industries Ltd', Initial_Classification: 'Halal', Sector: 'Healthcare', Sharia_Confidence_Percentage: 91 },
      { SYMBOL: 'MARUTI', Company_Name: 'Maruti Suzuki India Ltd', Initial_Classification: 'Halal', Sector: 'Automotive', Sharia_Confidence_Percentage: 84 },
      { SYMBOL: 'WIPRO', Company_Name: 'Wipro Ltd', Initial_Classification: 'Halal', Sector: 'Technology', Sharia_Confidence_Percentage: 83 },
      { SYMBOL: 'ADANIENT', Company_Name: 'Adani Enterprises Ltd', Initial_Classification: 'Doubtful', Sector: 'Conglomerates', Sharia_Confidence_Percentage: 60 }, // Included to test "Show More"
    ],
    'technology': [
      { SYMBOL: 'TCS', Company_Name: 'Tata Consultancy Services Ltd', Initial_Classification: 'Halal', Sector: 'Technology', Sharia_Confidence_Percentage: 90 },
      { SYMBOL: 'INFY', Company_Name: 'Infosys Ltd', Initial_Classification: 'Halal', Sector: 'Technology', Sharia_Confidence_Percentage: 89 },
      { SYMBOL: 'HCLTECH', Company_Name: 'HCL Technologies Ltd', Initial_Classification: 'Halal', Sector: 'Technology', Sharia_Confidence_Percentage: 86 },
      { SYMBOL: 'WIPRO', Company_Name: 'Wipro Ltd', Initial_Classification: 'Halal', Sector: 'Technology', Sharia_Confidence_Percentage: 83 },
      { SYMBOL: 'TECHM', Company_Name: 'Tech Mahindra Ltd', Initial_Classification: 'Doubtful', Sector: 'Technology', Sharia_Confidence_Percentage: 70 },
      { SYMBOL: 'ORCL', Company_Name: 'Oracle Corporation', Initial_Classification: 'Doubtful', Sector: 'Technology', Sharia_Confidence_Percentage: 65 },
      { SYMBOL: 'IBM', Company_Name: 'IBM Corp', Initial_Classification: 'Doubtful', Sector: 'Technology', Sharia_Confidence_Percentage: 62 },
      { SYMBOL: 'ACN', Company_Name: 'Accenture plc', Initial_Classification: 'Doubtful', Sector: 'Technology', Sharia_Confidence_Percentage: 60 },
      { SYMBOL: 'SAP', Company_Name: 'SAP SE', Initial_Classification: 'Doubtful', Sector: 'Technology', Sharia_Confidence_Percentage: 55 },
      { SYMBOL: 'CTSH', Company_Name: 'Cognizant Technology Solutions', Initial_Classification: 'Doubtful', Sector: 'Technology', Sharia_Confidence_Percentage: 50 },
      { SYMBOL: 'MSFT', Company_Name: 'Microsoft Corp', Initial_Classification: 'Haram', Sector: 'Technology', Sharia_Confidence_Percentage: 40 }, // Included for Haram filter testing
    ],
    'retail': [
      { SYMBOL: 'RETAIL1', Company_Name: 'Retail Company A', Initial_Classification: 'Halal', Sector: 'Retail', Sharia_Confidence_Percentage: 91 },
      { SYMBOL: 'RETAIL2', Company_Name: 'Retail Company B', Initial_Classification: 'Halal', Sector: 'Retail', Sharia_Confidence_Percentage: 87 },
      { SYMBOL: 'RETAIL3', Company_Name: 'Retail Company C', Initial_Classification: 'Doubtful', Sector: 'Retail', Sharia_Confidence_Percentage: 72 },
      { SYMBOL: 'RETAIL4', Company_Name: 'Retail Company D', Initial_Classification: 'Doubtful', Sector: 'Retail', Sharia_Confidence_Percentage: 68 },
      { SYMBOL: 'RETAIL5', Company_Name: 'Retail Company E', Initial_Classification: 'Haram', Sector: 'Retail', Sharia_Confidence_Percentage: 45 },
    ],
    'healthcare': [
      { SYMBOL: 'APOLLOHOSP', Company_Name: 'Apollo Hospitals Enterprise Ltd', Initial_Classification: 'Halal', Sector: 'Healthcare', Sharia_Confidence_Percentage: 85 },
      { SYMBOL: 'SUNPHARMA', Company_Name: 'Sun Pharmaceutical Industries Ltd', Initial_Classification: 'Halal', Sector: 'Healthcare', Sharia_Confidence_Percentage: 91 },
      { SYMBOL: 'HEALTHCARE1', Company_Name: 'Healthcare Co A', Initial_Classification: 'Doubtful', Sector: 'Healthcare', Sharia_Confidence_Percentage: 75 },
      { SYMBOL: 'HEALTHCARE2', Company_Name: 'Healthcare Co B', Initial_Classification: 'Doubtful', Sector: 'Healthcare', Sharia_Confidence_Percentage: 65 },
      { SYMBOL: 'HEALTHCARE3', Company_Name: 'Healthcare Co C', Initial_Classification: 'Haram', Sector: 'Healthcare', Sharia_Confidence_Percentage: 35 },
    ],
    'foods': [
      { SYMBOL: 'HINDUNILVR', Company_Name: 'Hindustan Unilever Ltd', Initial_Classification: 'Halal', Sector: 'Consumer Staples', Sharia_Confidence_Percentage: 87 },
      { SYMBOL: 'FOODS1', Company_Name: 'Foods Company A', Initial_Classification: 'Halal', Sector: 'Consumer Staples', Sharia_Confidence_Percentage: 89 },
      { SYMBOL: 'FOODS2', Company_Name: 'Foods Company B', Initial_Classification: 'Doubtful', Sector: 'Consumer Staples', Sharia_Confidence_Percentage: 78 },
      { SYMBOL: 'FOODS3', Company_Name: 'Foods Company C', Initial_Classification: 'Doubtful', Sector: 'Consumer Staples', Sharia_Confidence_Percentage: 62 },
      { SYMBOL: 'FOODS4', Company_Name: 'Foods Company D', Initial_Classification: 'Haram', Sector: 'Consumer Staples', Sharia_Confidence_Percentage: 28 },
    ],
  };

   // Reuse dummyCompanyDetails from TrendingStocks component or redefine if needed
  const dummyCompanyDetails = {
    'RELIANCE.NS': { company_name: 'RELIANCE INDUSTRIES LTD', current_price: 2500.50, price_change: 15.20, pe_ratio: 25.6, volume: 5000000 },
    'ULTRACEMCO.NS': { company_name: 'ULTRATECH CEMENT LIMITED', current_price: 8000.00, price_change: 50.00, pe_ratio: 28.4, volume: 1500000 },
    'HEROMOTOCO.NS': { company_name: 'HERO MOTOCORP LIMITED', current_price: 3000.00, price_change: 25.00, pe_ratio: 22.1, volume: 1800000 },
    'APOLLOHOSP.NS': { company_name: 'APOLLO HOSPITALS ENTERPRISE LIMITED', current_price: 6500.00, price_change: -40.00, pe_ratio: 32.5, volume: 1200000 },
    'TCS.NS': { company_name: 'TATA CONSULTANCY SERVICES LTD', current_price: 3500.00, price_change: 10.00, pe_ratio: 30.0, volume: 2000000 },
    'INFY.NS': { company_name: 'INFOSYS LIMITED', current_price: 1500.00, price_change: -5.00, pe_ratio: 28.0, volume: 2500000 },
    'HINDUNILVR.NS': { company_name: 'HINDUSTAN UNILEVER LIMITED', current_price: 2600.00, price_change: 8.00, pe_ratio: 45.0, volume: 1500000 },
    'HCLTECH.NS': { company_name: 'HCL TECHNOLOGIES LIMITED', current_price: 1200.00, price_change: 3.00, pe_ratio: 20.0, volume: 1800000 },
    'SUNPHARMA.NS': { company_name: 'SUN PHARMACEUTICAL INDUSTRIES LTD', current_price: 900.00, price_change: 7.00, pe_ratio: 22.0, volume: 1900000 },
    'MARUTI.NS': { company_name: 'MARUTI SUZUKI INDIA LIMITED', current_price: 9500.00, price_change: 12.00, pe_ratio: 35.0, volume: 1000000 },
    'WIPRO.NS': { company_name: 'WIPRO LIMITED', current_price: 450.00, price_change: -2.00, pe_ratio: 25.0, volume: 3000000 },
    'ADANIENT.NS': { company_name: 'ADANI ENTERPRISES LIMITED', current_price: 2800.00, price_change: 30.00, pe_ratio: 50.0, volume: 2000000 },
    'TECHM.NS': { company_name: 'TECH MAHINDRA LTD', current_price: 1100.00, price_change: -4.00, pe_ratio: 18.0, volume: 2200000 },
    'ORCL.NS': { company_name: 'ORACLE CORPORATION', current_price: 85.00, price_change: 0.50, pe_ratio: 15.0, volume: 4000000 },
    'IBM.NS': { company_name: 'IBM CORP', current_price: 140.00, price_change: -1.00, pe_ratio: 16.0, volume: 3500000 },
    'ACN.NS': { company_name: 'ACCENTURE PLC', current_price: 320.00, price_change: 2.00, pe_ratio: 23.0, volume: 2800000 },
    'SAP.NS': { company_name: 'SAP SE', current_price: 125.00, price_change: -0.80, pe_ratio: 21.0, volume: 3100000 },
    'CTSH.NS': { company_name: 'COGNIZANT TECHNOLOGY SOLUTIONS', current_price: 75.00, price_change: 0.30, pe_ratio: 19.0, volume: 3300000 },
    'MSFT.NS': { company_name: 'MICROSOFT CORP', current_price: 280.00, price_change: -1.50, pe_ratio: 33.0, volume: 3800000 },
    'RETAIL1.NS': { company_name: 'RETAIL COMPANY A', current_price: 50.00, price_change: 0.20, pe_ratio: 12.0, volume: 500000 },
    'RETAIL2.NS': { company_name: 'RETAIL COMPANY B', current_price: 60.00, price_change: 0.40, pe_ratio: 14.0, volume: 600000 },
    'RETAIL3.NS': { company_name: 'RETAIL COMPANY C', current_price: 40.00, price_change: -0.10, pe_ratio: 11.0, volume: 400000 },
    'RETAIL4.NS': { company_name: 'RETAIL COMPANY D', current_price: 35.00, price_change: -0.05, pe_ratio: 10.0, volume: 350000 },
    'RETAIL5.NS': { company_name: 'RETAIL COMPANY E', current_price: 25.00, price_change: -0.20, pe_ratio: 9.0, volume: 250000 },
    'HEALTHCARE1.NS': { company_name: 'HEALTHCARE CO A', current_price: 150.00, price_change: 1.00, pe_ratio: 24.0, volume: 700000 },
    'HEALTHCARE2.NS': { company_name: 'HEALTHCARE CO B', current_price: 120.00, price_change: -0.50, pe_ratio: 21.0, volume: 650000 },
    'HEALTHCARE3.NS': { company_name: 'HEALTHCARE CO C', current_price: 90.00, price_change: -0.80, pe_ratio: 18.0, volume: 550000 },
    'FOODS1.NS': { company_name: 'FOODS COMPANY A', current_price: 70.00, price_change: 0.60, pe_ratio: 16.0, volume: 800000 },
    'FOODS2.NS': { company_name: 'FOODS COMPANY B', current_price: 55.00, price_change: -0.30, pe_ratio: 13.0, volume: 750000 },
    'FOODS3.NS': { company_name: 'FOODS COMPANY C', current_price: 45.00, price_change: -0.20, pe_ratio: 11.0, volume: 650000 },
    'FOODS4.NS': { company_name: 'FOODS COMPANY D', current_price: 30.00, price_change: -0.40, pe_ratio: 9.0, volume: 550000 },
  };


  const fetchUserPlan = async () => {
    // Dummy user plan
    setUserPlan('free'); // or 'premium'
  };

  useEffect(() => {
    fetchUserPlan();
    const fetchCategoryStocks = async () => {
      setLoading(true);
      setError(null);
      let apiUrl = '';
      let categoryKey = '';

      if (categoryName.toLowerCase() === 'halal') {
        categoryKey = 'halal-high-confidence';
      } else if (categoryName.toLowerCase() === 'technology') {
        categoryKey = 'technology';
      } else if (categoryName.toLowerCase() === 'retail') {
        categoryKey = 'retail';
      } else if (categoryName.toLowerCase() === 'healthcare') {
        categoryKey = 'healthcare';
      } else if (categoryName.toLowerCase() === 'foods') {
        categoryKey = 'foods';
      } else {
        setError("Category not recognized.");
        setLoading(false);
        return;
      }

      try {
        // Use dummyCategoryStocks instead of API call
        // const response = await axios.get(apiUrl);
        const categoryData = dummyCategoryStocks[categoryKey];
        if (!categoryData) {
          setError("No  data for this category.");
          setLoading(false);
          return;
        }
        let transformedData = categoryData;


        console.log(`Category Stocks for ${categoryName} :`, transformedData);

        const transformedCategoryStocksPromises = transformedData.map(async (stock) => {
          try {
            // Use dummyCompanyDetails instead of actual axios call
            // const companyDetailsResponse = await axios.get(`http://13.201.131.141:5000/api/company-details/${stock.SYMBOL}.NS`);
            const companyDetailsData = dummyCompanyDetails[`${stock.SYMBOL}.NS`];
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

        transformedData = await Promise.all(transformedCategoryStocksPromises);


        // Apply compliance filter if needed
        if (selectedFilter !== 'All') {
          transformedData = transformedData.filter(stock => stock.compliance === selectedFilter);
        }

        setStockResults(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching category stocks ( data):", err);
        setError("Could not load stocks for this category using  data.");
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
    'The highest-ranked Shariah-compliant stocks based on compliance score and performance ' :
    `Shariah compliance analysis of the top ${categoryName.toLowerCase()} companies `;

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white/80 z-50">
        <LoaderCircle className="w-16 h-16 animate-spin text-purple-600" />
        <p className="mt-4 text-gray-800">Loading {categoryDisplayName} </p>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error} </div>;
  }

  return (
    <div className="max-w-7xl mx-auto  min-h-screen pb-12">
      <Header />
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
          <p className="text-sm text-gray-500 mt-2">Last updated: Feb 27, 2025 </p>
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
                  This is a placeholder education box using . Technology companies often have favorable Shariah compliance characteristics due to their asset-light 
                  business models and typically low debt ratios. However, they may have compliance issues related to 
                  interest income from cash reserves or ancillary business activities. Each stock is evaluated individually 
                  against Shariah screening criteria.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Stock grid */}
        <div className="grid grid-cols-1  gap-4">
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
            <h3 className="text-xl font-bold text-purple-800 mb-2">Unlock Full Access to ShariaStock </h3>
            <p className="text-purple-700 mb-4">This is a placeholder upgrade message when using . Get unlimited stock listings, advanced filtering, and real-time compliance alerts</p>
            <button className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 cursor-pointer" onClick={() =>{navigate('/subscriptiondetails')}}>
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
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Shield, Sparkles, Heart, ArrowLeft, LoaderCircle } from 'lucide-react';
import Card from './Card';
const PriceChart = lazy(() => import('./PriceChart'));
const Header = lazy(() => import('./Header'));

const PriceChartSkeleton = () => (
    <div className="animate-pulse bg-gray-100 h-64 w-full rounded-lg">
      <div className="h-full w-full bg-gray-200"></div>
    </div>
  );


const StockResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { symbol } = useParams();

    const prevSymbolRef = useRef(null);

    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isFreePlan, setIsFreePlan] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(null);
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newsArticles, setNewsArticles] = useState([]);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [viewLimitReached, setViewLimitReached] = useState(false);
    const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [flippedCardId, setFlippedCardId] = useState(null);
    

    const toggleCardFlip = useCallback((id) => {
        setFlippedCardId(current => current === id ? null : id);
    }, []);

    const metrics = useMemo(() => {
        if (!stockData) return [];
        return [
            { 
                id: 'debt-ratio',
                label: "Debt Ratio", 
                value: `${stockData.Debt_to_Assets ? stockData.Debt_to_Assets.toFixed(3) : 'N/A'}`, 
                threshold: "Must be below 0.33",
                details: "Debt Ratio measures the company's total debt relative to its total assets. A lower ratio indicates less financial leverage and potentially lower risk." 
            }, 
            { 
                id: 'cash-ratio',
                label: "Cash Ratio", 
                value: `${stockData.Cash_and_Interest_Securities_to_Assets ? stockData.Cash_and_Interest_Securities_to_Assets.toFixed(3) : 'N/A'}`, 
                threshold: "Must be above 0.33",
                details: "Cash Ratio indicates the proportion of assets held in cash or interest-bearing securities. A higher ratio suggests better liquidity and financial stability."
            },
            { 
                id: 'interest-ratio',
                label: "Interest Ratio", 
                value: `${stockData.Interest_Income_to_Revenue ? stockData.Interest_Income_to_Revenue.toFixed(3) : 'N/A'}`, 
                threshold: "Must be below 0.05",
                details: "Interest Ratio measures how much of the company's revenue comes from interest. For Halal investments, this should be kept low to minimize income from interest-based activities."
            },
            { 
                id: 'receivables-ratio',
                label: "Receivables Ratio", 
                value: `${stockData.Receivables_to_Assets ? stockData.Receivables_to_Assets.toFixed(3) : 'N/A'}`, 
                threshold: "Must be below 0.49",
                details: "Receivables Ratio compares accounts receivable to total assets. A lower ratio may indicate less credit exposure and better asset utilization."
            }
        ];
    }, [stockData]);

    useEffect(() => {
        const storedUser = location.state?.user;
        const storedUserId = localStorage.getItem('userId');

        if (storedUser) {
            setUser(storedUser);
            setIsFreePlan(storedUser.subscription?.plan === 'free');
        }

        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, [location.state]);

    useEffect(() => {
        const checkDesktopSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkDesktopSize();
        window.addEventListener('resize', checkDesktopSize);
        return () => {
            window.removeEventListener('resize', checkDesktopSize);
        };
    }, []);

   

    const fetchStockResults = useCallback(async () => {
        if (!symbol || !userId) return;
        const controller = new AbortController();
        
        try {
          setLoading(true);
          const companyDetailsResponse = await axios.get(
            `http://15.206.209.211:5000/api/company-details/${symbol}.NS`,
            { 
              signal: controller.signal,
              timeout: 10000 
            }
          );
    
          const stockDataResponse = await axios.get(
            `/api/stocks/${symbol.toUpperCase()}?userId=${userId}`,
            { 
              signal: controller.signal,
              timeout: 10000 
            }
          );
    
          localStorage.setItem(`companyDetails_${symbol}`, JSON.stringify(companyDetailsResponse.data));
          localStorage.setItem(`stockData_${symbol}`, JSON.stringify(stockDataResponse.data));
    
          setCompanyDetails(companyDetailsResponse.data);
          setStockData(stockDataResponse.data);
    
          const newsResponse = await axios.get("https://newsdata.io/api/1/news", {
            params: {
              apikey: 'pub_5726909ae8ab74afd8fcf47ed1aa5e8cec510',
              q: companyDetailsResponse.data.company_name,
              country: "in",
              language: "en",
              category: "Business",
              size: 2,
            },
            signal: controller.signal,
            timeout: 5000
          });
    
          setNewsArticles(newsResponse.data.results || []);
    
        } catch (err) {
          // Detailed error handling
          if (axios.isCancel(err)) {
            console.log('Request canceled');
          } else if (err.code === 'ECONNABORTED') {
            setError('Request timed out. Please check your connection.');
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
    
        return () => controller.abort();
      }, [symbol, userId]);

      useEffect(() => {
        if (symbol && userId) {
          fetchStockResults();
        }
      }, [symbol, userId, fetchStockResults]);
      


    if (loading) { 
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoaderCircle className="w-16 h-16 text-blue-500 animate-spin" /> {/* Centered loader */}
            </div>
        );
    }

    const MetricCard = React.memo(({ metric, stockData }) => {
        const { id, label, value, threshold, details } = metric;
        const isFlipped = flippedCardId === id;

        const numericValue = value !== 'N/A' ? parseFloat(value) : NaN;
        const numericThreshold = threshold && threshold !== 'N/A' ? parseFloat(threshold.split(' ')[3]) : NaN;
    
        let bgColorClassName;
        let lineChartColorName;
        const isHalal = stockData.Initial_Classification === 'Halal';
    
        if (isHalal) {
            if (!isNaN(numericValue) && !isNaN(numericThreshold) && numericValue > numericThreshold) {
                bgColorClassName = 'bg-gradient-to-r from-red-50 to-pink-50/30';
                lineChartColorName = 'text-red-600';
            } else {
                bgColorClassName = 'bg-gradient-to-r from-green-50 to-emerald-50/30';
                lineChartColorName = 'text-green-600';
            }
        } else {
            if (!isNaN(numericValue) && !isNaN(numericThreshold) && numericValue > numericThreshold) {
                bgColorClassName = 'bg-gradient-to-r from-red-50 to-pink-50/30';
                lineChartColorName = 'text-red-600';
            } else {
                bgColorClassName = 'bg-gradient-to-r from-green-50 to-emerald-50/30';
                lineChartColorName = 'text-green-600';
            }
        }
    
        return (
            <div
                className="h-40 w-full relative cursor-pointer"
                onClick={() => toggleCardFlip(id)}
                style={{ perspective: '1000px'
                 }}
            >
                <div
                    className={`relative w-full h-full duration-500 transition-transform`}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >
                    {/* Front of card */}
                    <div
                        className={`${bgColorClassName} p-3 sm:p-4 rounded-xl absolute w-full h-full`}
                        style={{ backfaceVisibility: 'hidden',
                         }}
                    >
                        <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                            <div className="bg-green-50 p-1.5 sm:p-2 rounded-lg">
                                <LineChart className={`w-3 h-3 sm:w-4 sm:h-4 ${lineChartColorName}`} />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">{label}</p>
                                <p className="text-lg sm:text-xl font-semibold text-gray-900">{value}</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">{threshold}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div
                        className={`${bgColorClassName} p-3 sm:p-4 rounded-xl absolute w-full h-full overflow-auto`}
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        <div className="flex flex-col h-full">
                            <h3 className="font-semibold mb-2 text-center">{label} Details</h3>
                            <p className="text-sm text-gray-700">{details || "This metric measures the financial health aspect related to " + label.toLowerCase() + " of the company."}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    });
    



    const addToWatchlist = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const symbolToAdd = symbol; 

        
        const isDuplicate = watchlist.some(item => item.symbol === symbolToAdd);
        if (isDuplicate) {
            setAlertMessage("Stock is already in your watchlist.");
            setTimeout(() => setAlertMessage(""), 6000);
            return; 
        }
            const response = await axios.post('/api/watchlist', {
                userId,
                symbol,
                companyName: companyDetails.company_name,
                stockData
            });
            setWatchlist([...watchlist, { symbol, companyName: companyDetails.company_name }]);
            setAlertMessage(response.data.message);

            if (response.status === 201) {
                setIsInWatchlist(true);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setAlertMessage(error.response.data.message);
            } else if (error.response?.status === 403) {
                setAlertMessage(error.response.data.error);
            } else {
                setAlertMessage("Error adding stock to watchlist.");
            }
        }
        setTimeout(() => setAlertMessage(""), 6000);
    };

    const StatusBadge = () => (
        <div className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl ${
            stockData.Initial_Classification === 'Halal'
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        } shadow-lg`}>
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-sm sm:text-base font-semibold">{stockData.Initial_Classification}</span>
        </div>
    );

    const Headers = () => {
        const [isTooltipVisible, setIsTooltipVisible] = useState(false);
        return (
            
    <div className="  sticky top-0 bg-white p-3 sm:p-4  z-10">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                        <ArrowLeft className="w-5 h-5 text-gray-700 mr-3 sm:mr-4 cursor-pointer flex-shrink-0" onClick={() => navigate(-1)} />
                        <div className="flex items-center min-w-0">
                            <span className="text-base sm:text-lg font-semibold text-gray-900 truncate">{companyDetails.company_name}</span>
                        </div>
                    </div>
                    {!isFreePlan && 
                    <div className="relative ml-4" onMouseEnter={() => setIsTooltipVisible(true)} onMouseLeave={() => setIsTooltipVisible(false)}>
                    <Heart className={`w-5 h-5 cursor-pointer ${isInWatchlist ? 'text-red-500 fill-current' : 'text-gray-700'}`} onClick={addToWatchlist} />
                    {alertMessage && (
                        <div className="alert bg-red-500 text-white p-2 absolute right-0 mt-2 w-48 sm:w-52 rounded-md z-20 shadow-md text-sm">
                            {alertMessage}
                        </div>
                    )}
                    {isTooltipVisible && (
                        <div className="absolute right-0 mt-2 w-28 sm:w-32 bg-gray-800 text-white text-xs sm:text-sm rounded-md p-2 z-20 shadow-md">
                            Add to watchlist
                        </div>
                    )}
                </div>
                    }
                    
                </div>
            </div>
        );
    };

    

    if (viewLimitReached) {
        return (
            <div className="min-h-screen">
                <Header />

                <div className="max-w-7xl mx-auto  p-4">
                <Headers />
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-xl font-semibold mb-4">View Limit Reached</h2>
                        <p className="text-gray-600 mb-6">You've reached the limit for viewing stock details. Subscribe to continue viewing more stocks.</p>
                        <button
                            onClick={() =>navigate('/subscriptiondetails')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>
                
            </div>
        );
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    if (!stockData) {
        return <div className="min-h-screen flex items-center justify-center">Could not retrieve stock data.</div>;
    }


    

    return (
        <div className="min-h-screen">
            <Suspense fallback={<div>Loading...</div>}>
            <Header />
            
            
            <div className="max-w-7xl mx-auto  p-3 sm:p-4 lg:p-6">
            <Headers />
                {/* Desktop Layout */}
                <div className="lg:grid lg:grid-cols-3 lg:gap-6">
                    {/* Left Column - Chart and Metrics */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <Suspense fallback={<PriceChartSkeleton />}>
                                <PriceChart symbol={symbol + ".NS"} />
                        </Suspense>
                        </div>
                        
                        <Card className="overflow-hidden bg-white shadow-xl">
                            <div className="relative overflow-hidden">
                                <div className={`absolute inset-0 ${stockData.Initial_Classification === 'Halal' ? 'bg-gradient-to-r from-green-50 to-emerald-50/30' : 'bg-gradient-to-r from-red-50 to-pink-50/30'}`}></div>
                                <div className="relative p-4 sm:p-6 border-b">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${stockData.Initial_Classification === 'Halal' ? 'text-green-500' : 'text-red-500'}`} />
                                                <h1 className="text-lg sm:text-xl font-bold text-gray-900">{companyDetails.symbol.replace(".NS", "")}</h1>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-1">{companyDetails.company_name || "Company Name N/A"}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <StatusBadge />
                                            <span className="text-xs sm:text-sm font-medium text-gray-600">
                                                {stockData.Shariah_Confidence_Percentage ? stockData.Shariah_Confidence_Percentage.toFixed(0) + '%' : 'N/A'} Confidence
                                            </span>
                                            <span>{stockData.Haram_Reason? stockData.Haram_Reason : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                 {metrics.map(metric => (
                                    <MetricCard 
                                        key={metric.id} 
                                        metric={metric} 
                                        stockData={stockData} 
                                    />
                                ))}
                                </div>
                            </div>
                        </Card>
                        
                    </div>

                    {/* Right Column - Company Info and News */}
                    <div className="lg:col-span-1 mt-6 lg:mt-0">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-4 sm:p-6">
                            <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">About company</h2>
                                        {/* <a href="#" className="text-blue-600 text-xs sm:text-sm hover:underline">See all</a> */}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-4">
                                    {companyDetails.company_description || 'Company description not available.'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <div className="text-xs sm:text-sm text-gray-500 mb-1">PREVIOUS CLOSE</div>
                                        <div className="text-base sm:text-xl font-semibold">{companyDetails.previous_close || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs sm:text-sm text-gray-500 mb-1">AVG VOLUME</div>
                                        <div className="text-base sm:text-xl font-semibold">{(companyDetails.volume / 1000000).toFixed(2) || 'N/A'}M</div>
                                    </div>
                                    <div>
                                        <div className="text-xs sm:text-sm text-gray-500 mb-1">P/E RATIO</div>
                                        <div className="text-base sm:text-xl font-semibold">{companyDetails.pe_ratio ? companyDetails.pe_ratio.toFixed(2) : 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs sm:text-sm text-gray-500 mb-1">PRIMARY EXCHANGE</div>
                                        <div className="text-base sm:text-xl font-semibold text-gray-600">NSE</div>
                                    </div>
                                    </div>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Related news</h2>
                                        {/* <a href="#" className="text-blue-600 text-xs sm:text-sm hover:underline">See all</a> */}
                                    </div>
                                    <div className="space-y-4">
                                        {newsArticles.length > 0 ? (
                                            newsArticles.slice(0, 3).map((article, index) => (
                                                <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                                    <h3 className="font-medium text-gray-800 text-sm sm:text-base mb-2 line-clamp-2">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                                                        {article.description || article.content}
                                                    </p>
                                                    <a
                                                        href={article.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 inline-block text-gray-400 hover:text-gray-600"
                                                    >
                                                        →
                                                    </a>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-4 text-sm">
                                                No news articles available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Suspense>
        </div>
    );
};

export default StockResults;
import React, { useState, useEffect } from "react";
import { Shield, Sparkles, Heart, TrendingUp, ArrowLeft, X, Search, Star, StarOff, Filter, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const WatchList = () => {
    const [activeTab, setActiveTab] = useState("all");
    const location = useLocation();
    const user = location.state?.user;
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [companyDetails, setCompanyDetails] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [view, setView] = useState("grid"); // grid or list view
    const [favorites, setFavorites] = useState([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const isFreePlan = user?.subscription?.plan === 'free';
    
    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // "confirm" or "success"
    const [modalMessage, setModalMessage] = useState("");
    const [stockToRemove, setStockToRemove] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
            if (window.innerWidth < 1024) {
                setShowFilters(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!userId) {
            console.error("User ID is missing");
            setLoading(false);
            setError("User ID is missing. Please log in again.");
            return;
        }

        const fetchWatchlist = async () => {
            try {
                const response = await axios.get(`/api/watchlist/${userId}`);
                console.log("Watchlist data:", response.data);
                setStocks(response.data.watchlist || []);
                
                // Populate initial favorites from localStorage if available
                const savedFavorites = localStorage.getItem('favorites');
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }

                // Fetch company details separately
                if (response.data.watchlist && response.data.watchlist.length > 0) {
                    response.data.watchlist.forEach(async (stock) => {
                        if (!stock.symbol) {
                            console.error("Stock symbol is missing:", stock);
                            return;
                        }
                        
                        try {
                            const companyDetailsResponse = await axios.get(
                                `http://13.201.131.141:5000/api/company-details/${stock.symbol + ".NS"}`
                            );

                            // Store details in state using stock symbol as key
                            setCompanyDetails(prevDetails => ({
                                ...prevDetails,
                                [stock.symbol]: companyDetailsResponse.data
                            }));

                        } catch (error) {
                            console.error(`Error fetching details for ${stock.symbol}:`, error);
                        }
                    });
                }

            } catch (error) {
                console.error("Error fetching watchlist:", error);
                setError(error.response?.data?.message || "Failed to fetch watchlist");
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [userId]);
    
    const toggleFavorite = (symbol, e) => {
        e.stopPropagation();
        
        setFavorites(prev => {
            const newFavorites = prev.includes(symbol)
                ? prev.filter(s => s !== symbol)
                : [...prev, symbol];
                
            // Save to localStorage
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    // Show confirmation modal for removing a stock
    const showRemoveConfirmation = (stockSymbol, e) => {
        e.stopPropagation(); // Prevent navigating to stock detail page
        
        setStockToRemove(stockSymbol);
        setModalType("confirm");
        setModalMessage(`Are you sure you want to remove ${stockSymbol} from your watchlist?`);
        setModalOpen(true);
    };

    // Handle confirmation from modal
    const handleConfirmRemove = async () => {
        if (!userId || !stockToRemove) {
            setModalType("error");
            setModalMessage("Missing user ID or stock symbol");
            return;
        }
        
        try {
            setLoading(true);
            setModalOpen(false);
            
            console.log(`Removing stock ${stockToRemove} for user ${userId}`);
            
            const response = await axios.delete(`/api/watchlist/${userId}/${stockToRemove}`, {
                data: { userId, symbol: stockToRemove }
            });
            
            console.log("Remove response:", response.data);
            
            // Update local state to remove the deleted stock
            setStocks(prevStocks => prevStocks.filter(stock => stock.symbol !== stockToRemove));
            
            // Show success notification
            setModalType("success");
            setModalMessage(`${stockToRemove} removed from watchlist`);
            setModalOpen(true);
            
            // Auto close success modal after 2 seconds
            setTimeout(() => {
                setModalOpen(false);
            }, 2000);
            
        } catch (error) {
            console.error("Error removing stock from watchlist:", error);
            setError(error.response?.data?.message || "Failed to remove stock from watchlist");
            
            // Show error modal
            setModalType("error");
            setModalMessage("Failed to remove stock from watchlist: " + (error.response?.data?.message || error.message));
            setModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "halal":
                return "bg-green-100 text-green-800 border-green-200";
            case "haram":
                return "bg-red-100 text-red-800 border-red-200";
            case "doubtful":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "halal":
                return <Shield className="w-3 h-3" />;
            case "haram":
                return <X className="w-3 h-3" />;
            case "doubtful":
                return <Sparkles className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const getStatusPill = (status) => {
        return (
            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(status)} border`}>
                {getStatusIcon(status)}
                {status}
            </span>
        );
    };

    const filteredStocks = stocks.filter((stock) => {
        const matchesTab = activeTab === "all" || 
                          (stock.stockData?.Initial_Classification && 
                           stock.stockData.Initial_Classification.toLowerCase() === activeTab.toLowerCase());
        const matchesSearch = stock.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             stock.symbol?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Sort stocks - favorites first, then alphabetically
    const sortedStocks = [...filteredStocks].sort((a, b) => {
        if (favorites.includes(a.symbol) && !favorites.includes(b.symbol)) return -1;
        if (!favorites.includes(a.symbol) && favorites.includes(b.symbol)) return 1;
        return a.companyName?.localeCompare(b.companyName || '');
    });

    const renderStockCard = (stock) => {
        const details = companyDetails?.[stock.symbol];
        const isFavorite = favorites.includes(stock.symbol);
        
        return (
            <div 
                key={stock.symbol} 
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100"
                onClick={() => {navigate(`/stockresults/${stock.symbol}`)}}
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{stock.companyName}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-500 text-sm">{stock.symbol}</p>
                            {getStatusPill(stock.stockData?.Initial_Classification)}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => toggleFavorite(stock.symbol, e)}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorite ? 
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> : 
                                <Star className="w-5 h-5 text-gray-400" />
                            }
                        </button>
                        <button 
                            onClick={(e) => showRemoveConfirmation(stock.symbol, e)}
                            className="p-1.5 rounded-full hover:bg-gray-100 hover:text-red-500"
                            aria-label="Remove from watchlist"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">₹{details?.current_price || "—"}</span>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-sm font-medium ${details?.price_change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                            {details?.price_change >= 0 ? "+" : ""}
                            {details?.price_change || "—"}%
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${details?.price_change >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                            <svg className={`w-5 h-5 ${details?.price_change >= 0 ? "text-green-500 rotate-0" : "text-red-500 rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>

                {stock.stockData?.Haram_Reason && (
                    <div className="mb-4 p-3 rounded-lg text-sm">
                        <p className="line-clamp-2">{stock.stockData.Haram_Reason}</p>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-xs mb-1">24h High</p>
                        <p className="font-medium text-gray-900">₹{details?.high24 || "—"}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-xs mb-1">24h Low</p>
                        <p className="font-medium text-gray-900">₹{details?.low24 || "—"}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-xs mb-1">Volume</p>
                        <p className="font-medium text-gray-900">{details?.volume 
                            ? (details.volume > 1000000 
                                ? (details.volume/1000000).toFixed(1) + 'M'
                                : (details.volume/1000).toFixed(1) + 'K')
                            : "—"}</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderStockRow = (stock) => {
        const details = companyDetails?.[stock.symbol];
        const isFavorite = favorites.includes(stock.symbol);
        
        return (
            <div 
                key={stock.symbol} 
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 flex items-center"
                onClick={() => {navigate(`/stockresults/${stock.symbol}`)}}
            >
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                        <h3 className="font-semibold text-gray-800">{stock.companyName}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-500 text-sm">{stock.symbol}</p>
                            {getStatusPill(stock.stockData?.Initial_Classification)}
                        </div>
                    </div>
                    
                    {stock.stockData?.Haram_Reason && (
                        <p className="text-xs mt-1 line-clamp-1">{stock.stockData.Haram_Reason}</p>
                    )}
                </div>
                
                <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                        <p className="font-bold text-gray-900">₹{details?.current_price || "—"}</p>
                        <span className={`text-sm ${details?.price_change >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {details?.price_change >= 0 ? "+" : ""}
                            {details?.price_change || "—"}%
                        </span>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${details?.price_change >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                        <svg className={`w-5 h-5 ${details?.price_change >= 0 ? "text-green-500 rotate-0" : "text-red-500 rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    
                    <div className="flex items-center">
                        <button 
                            onClick={(e) => toggleFavorite(stock.symbol, e)}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorite ? 
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> : 
                                <Star className="w-5 h-5 text-gray-400" />
                            }
                        </button>
                        <button 
                            onClick={(e) => showRemoveConfirmation(stock.symbol, e)}
                            className="p-1.5 rounded-full hover:bg-gray-100 hover:text-red-500"
                            aria-label="Remove from watchlist"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Modal component
    const Modal = () => {
        if (!modalOpen) return null;
        
        let icon, bgColor, textColor, buttonColor;
        
        switch(modalType) {
            case "confirm":
                icon = <AlertCircle className="w-8 h-8 text-blue-500" />;
                bgColor = "bg-blue-50";
                textColor = "text-blue-800";
                buttonColor = "bg-blue-600 hover:bg-blue-700";
                break;
            case "success":
                icon = <CheckCircle className="w-8 h-8 text-green-500" />;
                bgColor = "bg-green-50";
                textColor = "text-green-800";
                buttonColor = "bg-green-600 hover:bg-green-700";
                break;
            case "error":
                icon = <X className="w-8 h-8 text-red-500" />;
                bgColor = "bg-red-50";
                textColor = "text-red-800";
                buttonColor = "bg-red-600 hover:bg-red-700";
                break;
            default:
                icon = <AlertCircle className="w-8 h-8 text-gray-500" />;
                bgColor = "bg-gray-50";
                textColor = "text-gray-800";
                buttonColor = "bg-gray-600 hover:bg-gray-700";
        }
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-opacity-50">
                <div className={`w-full max-w-md rounded-2xl shadow-xl ${bgColor} p-6 transition transform scale-100`}>
                    <div className="flex flex-col items-center text-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4">
                            {icon}
                        </div>
                        <h3 className={`text-xl font-semibold ${textColor} mb-2`}>
                            {modalType === "confirm" ? "Confirm Action" : 
                             modalType === "success" ? "Success" : "Error"}
                        </h3>
                        <p className={`${textColor.replace('800', '600')} mb-6`}>{modalMessage}</p>
                    </div>
                    
                    <div className="flex justify-center gap-3">
                        {modalType === "confirm" ? (
                            <>
                                <button 
                                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={`px-5 py-2 ${buttonColor} text-white rounded-lg transition`}
                                    onClick={handleConfirmRemove}
                                >
                                    Confirm
                                </button>
                            </>
                        ) : (
                            <button 
                                className={`px-5 py-2 ${buttonColor} text-white rounded-lg transition`}
                                onClick={() => setModalOpen(false)}
                            >
                                {modalType === "success" ? "Great!" : "OK"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Header Background */}
            <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />

            <div className="relative max-w-6xl mx-auto pt-6 px-4 sm:px-6">
                {/* Header with Navigation */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-white text-2xl font-bold">Watchlist</h1>
                            <p className="text-white/80 text-sm">Track your favorite stocks</p>
                        </div>
                    </div>
                    
                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setView('grid')} 
                            className={`p-2 rounded-lg ${view === 'grid' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'}`}
                            aria-label="Grid view"
                        >
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                            </div>
                        </button>
                        <button 
                            onClick={() => setView('list')} 
                            className={`p-2 rounded-lg ${view === 'list' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'}`}
                            aria-label="List view"
                        >
                            <BarChart3 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search stocks by name or symbol..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'} hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                            {activeTab !== 'all' && (
                                <span className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 text-xs rounded-full">1</span>
                            )}
                        </button>
                    </div>
                    
                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <button 
                                    className={`flex items-center gap-2 p-3 rounded-xl transition ${activeTab === 'all' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'}`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    <TrendingUp className="w-5 h-5" />
                                    <div className="flex-1 text-left">
                                        <span>All</span>
                                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded-full">{stocks.length}</span>
                                    </div>
                                </button>
                                <button 
                                    className={`flex items-center gap-2 p-3 rounded-xl transition ${activeTab === 'halal' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'}`}
                                    onClick={() => setActiveTab('halal')}
                                >
                                    <Shield className="w-5 h-5" />
                                    <div className="flex-1 text-left">
                                        <span>Halal</span>
                                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                                            {stocks.filter(s => s.stockData?.Initial_Classification?.toLowerCase() === 'halal').length}
                                        </span>
                                    </div>
                                </button>
                                <button 
                                    className={`flex items-center gap-2 p-3 rounded-xl transition ${activeTab === 'doubtful' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'}`}
                                    onClick={() => setActiveTab('doubtful')}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <div className="flex-1 text-left">
                                        <span>Doubtful</span>
                                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                                            {stocks.filter(s => s.stockData?.Initial_Classification?.toLowerCase() === 'doubtful').length}
                                        </span>
                                    </div>
                                </button>
                                <button 
                                    className={`flex items-center gap-2 p-3 rounded-xl transition ${activeTab === 'haram' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'}`}
                                    onClick={() => setActiveTab('haram')}
                                >
                                    <Heart className="w-5 h-5" />
                                    <div className="flex-1 text-left">
                                        <span>Haram</span>
                                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                                            {stocks.filter(s => s.stockData?.Initial_Classification?.toLowerCase() === 'haram').length}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading your watchlist...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 rounded-2xl shadow p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                            <X className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Watchlist</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                ) : (isFreePlan && sortedStocks.length === 0) ? ( // Conditionally render for free plan users
                        <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center justify-center h-64">
                            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mb-4">
                                <StarOff className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Unlock Watchlist Feature</h3>
                            <p className="text-gray-600 mb-6 text-center max-w-md">Watchlist feature is available for Basic and Premium plans. Upgrade to track your favorite stocks.</p>
                            <button
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
                                onClick={() => navigate('/subscriptiondetails')}
                            >
                                Upgrade Now
                            </button>
                        </div>
                    ) : sortedStocks.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center justify-center h-64">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your watchlist is empty</h3>
                            <p className="text-gray-600 mb-6 text-center max-w-md">Add stocks to your watchlist to track their performance and compliance status.</p>
                            <button 
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
                                onClick={() => navigate('/dashboard')}
                            >
                                Discover Stocks
                            </button>
                        </div>
                ) : (
                    <div className={view === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                        : "space-y-3"
                    }>
                        {sortedStocks.map(stock => (
                            view === 'grid' ? renderStockCard(stock) : renderStockRow(stock)
                        ))}
                    </div>
                )}
                
                {/* Stats Summary */}
                {sortedStocks.length > 0 && !loading && !error && (
                    <div className="mt-8 bg-white rounded-2xl shadow p-4">
                        <h3 className="font-semibold text-gray-800 mb-4">Watchlist Summary</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <p className="text-sm text-blue-600 mb-1">Total Stocks</p>
                                <p className="text-2xl font-bold text-blue-800">{sortedStocks.length}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <p className="text-sm text-green-600 mb-1">Halal</p>
                                <p className="text-2xl font-bold text-green-800">
                                    {sortedStocks.filter(s => s.stockData?.Initial_Classification?.toLowerCase() === 'halal').length}
                                </p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-xl">
                                <p className="text-sm text-yellow-600 mb-1">Doubtful</p>
                                <p className="text-2xl font-bold text-yellow-800">
                                    {sortedStocks.filter(s => s.stockData?.Initial_Classification?.toLowerCase() === 'doubtful').length}
                                </p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-xl">
                                <p className="text-sm text-red-600 mb-1">Haram</p>
                                <p className="text-2xl font-bold text-red-800">
                                    {sortedStocks.filter(s => s.stockData?.Initial_Classification?.toLowerCase() === 'haram').length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <Modal />
                {/* Padding at bottom */}
                <div className="h-24"></div>
            </div>
        </div>
    );
};

export default WatchList;
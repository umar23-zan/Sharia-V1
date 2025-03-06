import React, { useState, useEffect } from "react";
import { Shield, Sparkles, Heart, TrendingUp, ArrowLeft } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const WatchList = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [companyDetails, setCompanyDetails] = useState(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!userId) {
            console.error("User ID is missing");
            return;
        }

        const fetchWatchlist = async () => {
            try {
                const response = await axios.get(`/api/watchlist/${userId}`);
                console.log(response.data);
                setStocks(response.data.watchlist);

                // Fetch company details separately
                response.data.watchlist.forEach(async (stock) => {
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

            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch watchlist");
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [userId]);
    

    const getStatusColor = (status) => {
        switch (status) {
            case "Halal":
                return "bg-green-100 text-green-800";
            case "Haram":
                return "bg-red-100 text-red-800";
            case "Doubtful":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "";
        }
    };

    const getStatusPill = (status) => {
        return (
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                {status}
            </span>
        );
    };

    console.log(companyDetails);
    const filteredStocks = stocks.filter((stock) => {
        const matchesTab = activeTab === "all" || stock.stockData?.Initial_Classification?.toLowerCase() === activeTab.toLowerCase();
        const matchesSearch = stock.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto relative min-h-screen ">
            <Header />
            <div className={`${isDesktop ? 'h-[25vh]' : 'h-[27vh]'} absolute top-0 left-0 w-full bg-gradient-to-br from-blue-600 to-purple-600`} />

            <div className={`relative  mx-auto pt-6 px-6`}>
                
                <div className="flex justify-start items-center mb-10">
                    <div>
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer transition mr-3"> {/* Back Button */}
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        </div>
                        <div>
                        <h1 className="text-white text-2xl font-semibold">Watchlist</h1>
                        <p className="text-white/80 text-sm">Track your favorite stocks</p>
                        </div>
                </div>
                {/* Search Bar */}
                <div className={`${isDesktop ? 'bg-white shadow' : 'bg-white/10'} rounded-full p-3 mb-10`}>
                            <input
                                type="text"
                                placeholder="Search your stocks..."
                                className={`w-full ${isDesktop ? 'bg-transparent text-gray-700 placeholder-gray-400' : 'bg-transparent text-white placeholder-white/70'} outline-none`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                <div className={`flex ${isDesktop ? 'flex-row gap-8' : 'flex-col'}`}>
                    {/* Sidebar for desktop */}
                    {isDesktop && (
                        <div className="w-64 bg-white rounded-xl shadow-md p-4 h-fit">
                            <h2 className="font-semibold mb-4">Filters</h2>
                            <ul className="space-y-3">
                                <li>
                                    <button 
                                        className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                        onClick={() => setActiveTab('all')}
                                    >
                                        <TrendingUp className="w-5 h-5 mr-3" />
                                        <span>All Stocks</span>
                                        <span className="ml-auto bg-gray-100 px-2 py-1 rounded-full text-xs">
                                            {stocks.length}
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'halal' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                        onClick={() => setActiveTab('halal')}
                                    >
                                        <Shield className="w-5 h-5 mr-3" />
                                        <span>Halal</span>
                                        <span className="ml-auto bg-gray-100 px-2 py-1 rounded-full text-xs">
                                            {stocks.filter(s => s.stockData?.Initial_Classification?.toLowerCase() === 'halal').length}
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'doubtful' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                        onClick={() => setActiveTab('doubtful')}
                                    >
                                        <Sparkles className="w-5 h-5 mr-3" />
                                        <span>Doubtful</span>
                                        <span className="ml-auto bg-gray-100 px-2 py-1 rounded-full text-xs">
                                            {stocks.filter(s => s.stockData?.Initial_Classification?.toLowerCase() === 'doubtful').length}
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'haram' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                        onClick={() => setActiveTab('haram')}
                                    >
                                        <Heart className="w-5 h-5 mr-3" />
                                        <span>Haram</span>
                                        <span className="ml-auto bg-gray-100 px-2 py-1 rounded-full text-xs">
                                            {stocks.filter(s => s.stockData?.Initial_Classification?.toLowerCase() === 'haram').length}
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className={`flex-1 ${isDesktop ? 'mt-0' : 'mt-4'}`}>
                        {/* Mobile Tabs */}
                        {!isDesktop && (
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                {['all', 'halal', 'doubtful', 'haram'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === tab ? 'bg-white text-blue-600 shadow' : 'bg-white/10 text-white'}`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        <span className="ml-1 text-xs">
                                            {stocks.filter(s => tab === 'all' ? true : s.stockData?.Initial_Classification?.toLowerCase() === tab).length}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        

                        {/* Stock Grid/List */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-center text-gray-500">Loading watchlist...</p>
                            </div>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : filteredStocks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl p-8 shadow">
                                <p className="text-center text-gray-500 mb-4">No stocks found in your watchlist.</p>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                    Add Your First Stock
                                </button>
                            </div>
                        ) : (
                            <div className={`${isDesktop ? 'grid grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'} mb-8`}>
                                {filteredStocks.map((stock) => {
                                    const details = companyDetails?.[stock.symbol];
                                    return (
                                        <div 
                                            key={stock.symbol} 
                                            className="bg-white rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer"
                                            onClick={() => {navigate(`/stockresults/${stock.symbol}`)}}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold">{stock.companyName}</h3>
                                                        {getStatusPill(stock.stockData.Initial_Classification)}
                                                    </div>
                                                    <p className="text-gray-600 text-sm">{stock.symbol}</p>
                                                </div>
                                                <button 
                                                    className="text-gray-400 hover:text-gray-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Add to favorites logic
                                                    }}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="flex items-end gap-2 mb-3">
                                                <span className="text-2xl font-semibold">₹{details?.current_price || "N/A"}</span>
                                                <span className={`text-sm ${details?.price_change >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                    {details?.price_change >= 0 ? "+" : ""}
                                                    {details?.price_change || "N/A"}%
                                                </span>
                                                <span className="ml-auto">
                                                    <svg className={`w-6 h-6 ${details?.price_change >= 0 ? "text-green-500 rotate-0" : "text-red-500 rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                </span>
                                            </div>

                                            {stock.stockData.Haram_Reason && (
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{stock.stockData.Haram_Reason}</p>
                                            )}

                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">24h High</p>
                                                    <p className="font-medium">₹{details?.high24 || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">24h Low</p>
                                                    <p className="font-medium">₹{details?.low24 || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Volume</p>
                                                    <p className="font-medium">{details?.volume 
                                                        ? (details.volume > 1000000 
                                                            ? (details.volume/1000000).toFixed(1) + 'M'
                                                            : (details.volume/1000).toFixed(1) + 'K')
                                                        : "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchList;
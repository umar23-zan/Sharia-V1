import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Bell, Search, LoaderCircle } from 'lucide-react';
import logo from '../images/ShariaStocks-logo/logo1.jpeg'
const Header = lazy(() => import('./Header'));

const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [page, setPage] = useState(1); // State for pagination

  useEffect(() => {
    fetchStockNews();
  }, [page]);

  const fetchStockNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://newsdata.io/api/1/latest`, {
        params: {
          apikey: 'pub_5726909ae8ab74afd8fcf47ed1aa5e8cec510', 
          q: "NSE", 
          country: 'in', 
          language: 'en',
          category: 'Business', 
          size: 10, 
          
        },
      });
      setNewsArticles((prevArticles) => [...prevArticles, ...(response.data.results || [])]);
    } catch (error) {
      console.log("Error fetching news", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to format the time difference
  const formatTimeAgo = (pubDate) => {
    if (!pubDate) return '';
    
    const now = new Date();
    const publishedDate = new Date(pubDate);
    const diffInHours = Math.floor((now - publishedDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} days ago`;
    }
  };

  // Function to determine category based on keywords
  const determineCategory = (article) => {
    const title = (article.title || '').toLowerCase();
    const description = (article.description || '').toLowerCase();
    const content = title + ' ' + description;
    
    if (content.includes('finance') || content.includes('banking') || content.includes('islamic')) {
      return 'Islamic Finance';
    } else if (content.includes('stocks') || content.includes('shares') || content.includes('equity')) {
      return 'Stocks';
    } else if (content.includes('economy') || content.includes('fed') || content.includes('reserve') || content.includes('interest rate')) {
      return 'Economy';
    } else if (content.includes('gold') || content.includes('commodities') || content.includes('metals')) {
      return 'Commodities';
    } else {
      return 'Market Watch';
    }
  };
  const filteredArticles = newsArticles.filter(news => {
    const searchableContent = (news.title + ' ' + news.description + ' ' + news.content).toLowerCase();
    return searchableContent.includes(searchQuery.toLowerCase());
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1); 
  };

  return (
    <div className=" min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className=" max-w-7xl mx-autop-6">
        <h2 className="text-2xl font-bold mb-2">Market News</h2>
        <p className="text-gray-600 mb-6">Stay updated with the latest financial news and Islamic finance insights</p>

        {error && ( // Display error message if there is an error
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error fetching news!</strong>
            <span className="block sm:inline"> Please try again later.</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderCircle className="w-10 h-10 text-purple-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.length > 0 ? ( // Use filteredArticles for rendering
              filteredArticles.map((news, index) => {
                const category = determineCategory(news);
                return (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="font-medium">{category}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(news.pubDate)}</span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-2">{news.title}</h3>
                    
                    {news.description && (
                      <p className="text-gray-600 mb-2">{news.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500">{news.source_id || 'Market News'}</span>
                      <a href={news.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 flex items-center gap-1 hover:text-gray-700">
                        Read More 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17l9.2-9.2M17 17V7H7" />
                        </svg>
                      </a>
                    </div>
                    
                    {/* {news.keywords && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {news.keywords.split(',').slice(0, 3).map((tag, i) => (
                          <span key={i} className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md text-xs">
                            {tag.trim().toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )} */}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No news articles available</p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          <button 
            className="text-purple-600 border border-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More News'}
          </button>
        </div>
      </div>
      </Suspense>
    </div>
  );
};

export default News;
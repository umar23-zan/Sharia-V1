import { useState } from 'react';
import { Search, BookOpen, TrendingUp, Filter, Users, FileText, ArrowRight, ChevronLeft } from 'lucide-react';
import ratios from '../images/Blog-pics/ratios.png'
import haram from '../images/Blog-pics/understand_haram.jpg'
import ai from '../images/Blog-pics/ai_role.png'
import halalHaram from '../images/Blog-pics/halal_haram.png'
import halal from '../images/Blog-pics/halal.png'
import sharia from '../images/Blog-pics/sharia.png'
import top10 from '../images/Blog-pics/ai_role.png'
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function BlogCatalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Articles', icon: BookOpen },
    { id: 'investing', name: 'Halal Investing', icon: TrendingUp },
    { id: 'screening', name: 'Stock Screening', icon: Filter },  
    { id: 'community', name: 'Community Insights', icon: Users },
    { id: 'guides', name: 'Beginner Guides', icon: FileText },
  ];
  
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding the Haram Stocks',
      excerpt: 'Navigate the stock market with confidence while adhering to Islamic principles. Learn what makes a stock halal or haram.',
      category: 'community',
      date: 'April 10, 2025',
      author: 'Ahmed Hassan',
      imageUrl: `${haram}`,
      readTime: '8 min read',
      featured: true,
      path: '/understand-haram'
    },
    {
      id: 2,
      title: 'Difference between Halal and Haram Stocks',
      excerpt: 'A comprehensive guide to ethical investing according to Islamic principles.',
      category: 'guides',
      date: 'April 11, 2025',
      author: 'Fatima Ali',
      imageUrl: `${halalHaram}`,
      readTime: '6 min read',
      featured: false,
      path: '/halal-haram-diff'
    },
    {
      id: 3,
      title: 'The Role of AI in Halal Stock Screening',
      excerpt: 'Can artificial intelligence help Muslims invest more ethically? Absolutely.',
      category: 'guides',
      date: 'April 12, 2025',
      author: 'Ibrahim Khan',
      imageUrl: `${ai}`,
      readTime: '10 min read',
      featured: true,
      path: '/role-ai'
    },
    {
      id: 4,
      title: 'What Is a Halal Stock?',
      excerpt: 'Is it really possible to invest in the stock market without compromising your faith?',
      category: 'community',
      date: 'April 13, 2025',
      author: 'Aisha Rahman',
      imageUrl: `${halal}`,
      readTime: '7 min read',
      featured: false,
      path: '/halal-stock'
    },
    {
      id: 5,
      title: 'Top 5 Financial Ratios Used in Islamic Stock Screening',
      excerpt: 'Top 5 financial ratios used by Shariah scholars to determine if a stock meets Islamic guidelines',
      category: 'community',
      date: 'April 14, 2025',
      author: 'Yusuf Mahmood',
      imageUrl: `${ratios}`,
      readTime: '9 min read',
      featured: false,
      path: '/financial-ratios'
    },
    {
      id: 6,
      title: 'Getting Started with ShariaStocks App',
      excerpt: 'A step-by-step tutorial on using our app to screen, monitor, and build your halal investment portfolio.',
      category: 'guides',
      date: 'February 28, 2025',
      author: 'Nadia Jameel',
      imageUrl: `${sharia}`,
      readTime: '5 min read',
      featured: true,
      path: '/how-it-works'
    },
    {
      id: 7,
      title: 'Top 10 Halal Stocks',
      excerpt: 'Here are the Top 10 Halal Stocks to Watch in 2025 based on their Shariah compliance, financial strength, and growth potential.',
      category: 'guides',
      date: 'April 21, 2025',
      author: 'Abdul Rahman',
      imageUrl: `${top10}`,
      readTime: '5 min read',
      featured: true,
      path: '/top10'
    },
    {
      id: 8,
      title: 'What makes a Stock Haram',
      excerpt: 'Understanding Islamic Guidelines for Ethical Investing.',
      category: 'guides',
      date: 'April 21, 2025',
      author: 'Bilal',
      imageUrl: `${halalHaram}`,
      readTime: '5 min read',
      featured: true,
      path: '/haram'
    },
    {
      id: 9,
      title: 'How AI Helps Analyze Islamic Compliance in Stocks',
      excerpt: 'Imagine having the power to scan through thousands of companies in seconds—checking if they align with Islamic principles.',
      category: 'guides',
      date: 'April 21, 2025',
      author: 'Shakir',
      imageUrl: `${sharia}`,
      readTime: '5 min read',
      featured: true,
      path: '/aicompliance'
    }
  ];

  // Filter posts based on search term and active category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);
  
  // Handle category click
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" data-testid="blog-catalogue-container">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 to-green-700 text-white py-12 px-4 md:px-8" data-testid="blog-header">
        <div className="max-w-6xl mx-auto">
          <button 
              className="group flex items-center text-white hover:text-purple-700 mb-6 transition duration-200" 
              onClick={() => navigate(-1)}
              aria-label="Go Back"
              data-testid="go-back-button"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Go Back</span>
            </button>
          <h1 className="text-4xl font-bold mb-4" data-testid="blog-title">Islamic Finance Blog</h1>
          <p className="text-xl max-w-3xl" data-testid="blog-subtitle">
            Insights, guides, and resources for Muslim investors seeking to build wealth while adhering to Shariah principles
          </p>
        </div>
      </header>

      {/* Search and Categories Section */}
      <div className="bg-white shadow-md" data-testid="search-categories-section">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          {/* Search Box */}
          <div className="relative mb-8" data-testid="search-container">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-testid="search-icon-container">
              <Search className="h-5 w-5 text-gray-400" data-testid="search-icon" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Search articles by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-input"
              aria-label="Search articles"
            />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 md:gap-4" data-testid="categories-container">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  data-testid={`category-${category.id}`}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                  aria-pressed={activeCategory === category.id}
                  aria-label={`Filter by ${category.name}`}
                >
                  <Icon className="h-4 w-4 mr-2" data-testid={`category-icon-${category.id}`} />
                  <span data-testid={`category-name-${category.id}`}>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12" data-testid="blog-main-content">
        {/* Featured Posts Section - Only show if no search term and category is 'all' */}
        {!searchTerm && activeCategory === 'all' && (
          <section className="mb-16" data-testid="featured-articles-section">
            <h2 className="text-3xl font-bold mb-8" data-testid="featured-section-title">Featured Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="featured-posts-grid">
              {featuredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
                  data-testid={`featured-post-${post.id}`}
                >
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                    data-testid={`featured-post-image-${post.id}`}
                  />
                  <div className="p-6" data-testid={`featured-post-content-${post.id}`}>
                    <div className="flex justify-between items-center mb-2" data-testid={`featured-post-meta-${post.id}`}>
                      <span className="text-xs text-gray-500" data-testid={`featured-post-date-${post.id}`}>{post.date}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full" data-testid={`featured-post-readtime-${post.id}`}>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2" data-testid={`featured-post-title-${post.id}`}>{post.title}</h3>
                    <p className="text-gray-600 mb-4" data-testid={`featured-post-excerpt-${post.id}`}>{post.excerpt}</p>
                    <div className="flex justify-between items-center" data-testid={`featured-post-footer-${post.id}`}>
                      <span className="text-sm text-gray-500" data-testid={`featured-post-author-${post.id}`}>By {post.author}</span>
                      <a 
                        href={post.path}
                        className="text-green-600 font-medium flex items-center hover:text-green-700"
                        data-testid={`featured-read-more-${post.id}`}
                        aria-label={`Read more about ${post.title}`}
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" data-testid={`featured-read-more-icon-${post.id}`} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Blog Posts */}
        <section data-testid="blog-posts-section">
          <h2 className="text-3xl font-bold mb-8" data-testid="section-title">
            {searchTerm ? 'Search Results' : activeCategory !== 'all' ? `${categories.find(c => c.id === activeCategory).name}` : 'All Articles'}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12" data-testid="no-results">
              <p className="text-xl text-gray-600" data-testid="no-results-message">No articles found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                data-testid="clear-filters-btn"
                aria-label="Clear search filters"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="all-articles-grid">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
                  data-testid={`post-card-${post.id}`}
                >
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                    data-testid={`post-image-${post.id}`}
                  />
                  <div className="p-6" data-testid={`post-content-${post.id}`}>
                    <div className="flex justify-between items-center mb-2" data-testid={`post-meta-${post.id}`}>
                      <span className="text-xs text-gray-500" data-testid={`post-date-${post.id}`}>{post.date}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full" data-testid={`post-readtime-${post.id}`}>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2" data-testid={`post-title-${post.id}`}>{post.title}</h3>
                    <p className="text-gray-600 mb-4" data-testid={`post-excerpt-${post.id}`}>{post.excerpt}</p>
                    <div className="flex justify-between items-center" data-testid={`post-footer-${post.id}`}>
                      <span className="text-sm text-gray-500" data-testid={`post-author-${post.id}`}>By {post.author}</span>
                      <a 
                        href={post.path}
                        className="text-green-600 font-medium flex items-center hover:text-green-700"
                        data-testid={`read-more-${post.id}`}
                        aria-label={`Read more about ${post.title}`}
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" data-testid={`read-more-icon-${post.id}`} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer data-testid="blog-footer" />
    </div>
  );
}

export default BlogCatalogue;
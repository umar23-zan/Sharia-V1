import { useState } from 'react';
import { Search, BookOpen, TrendingUp, Filter, Users, FileText, ArrowRight } from 'lucide-react';
import ratios from '../images/Blog-pics/ratios.png'
import haram from '../images/Blog-pics/understand_haram.jpg'
import ai from '../images/Blog-pics/ai_role.png'
import halalHaram from '../images/Blog-pics/halal_haram.png'
import halal from '../images/Blog-pics/halal.png'
import sharia from '../images/Blog-pics/sharia.png'

function BlogCatalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 to-green-700 text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Islamic Finance Blog</h1>
          <p className="text-xl max-w-3xl">
            Insights, guides, and resources for Muslim investors seeking to build wealth while adhering to Shariah principles
          </p>
        </div>
      </header>

      {/* Search and Categories Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          {/* Search Box */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Search articles by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Featured Posts Section - Only show if no search term and category is 'all' */}
        {!searchTerm && activeCategory === 'all' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">{post.date}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      <a 
                        href={post.path}
                        className="text-green-600 font-medium flex items-center hover:text-green-700"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Blog Posts */}
        <section>
          <h2 className="text-3xl font-bold mb-8">
            {searchTerm ? 'Search Results' : activeCategory !== 'all' ? `${categories.find(c => c.id === activeCategory).name}` : 'All Articles'}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No articles found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">{post.date}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      <a 
                        href={post.path}
                        className="text-green-600 font-medium flex items-center hover:text-green-700"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Newsletter Section */}
      <section className="bg-green-50 py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8">Subscribe to our newsletter for the latest articles, guides, and insights on halal investing.</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShariaStocks</h3>
              <p className="text-gray-300 mb-4">
                Empowering Muslim investors with the tools and knowledge to make halal investment decisions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-white">LinkedIn</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Download App</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <p className="text-gray-300 mb-2">contact@shariastocks.in</p>
              <p className="text-gray-300">+1 (555) 123-4567</p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-gray-400 text-sm">
            <p>&copy; 2025 ShariaStocks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BlogCatalogue;
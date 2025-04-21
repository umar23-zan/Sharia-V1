import { useState } from 'react';
import { Search, BookOpen, TrendingUp, Filter, Users, FileText, ArrowRight } from 'lucide-react';
import ratios from '../images/Blog-pics/ratios.png'
import haram from '../images/Blog-pics/understand_haram.jpg'
import ai from '../images/Blog-pics/ai_role.png'
import halalHaram from '../images/Blog-pics/halal_haram.png'
import halal from '../images/Blog-pics/halal.png'
import sharia from '../images/Blog-pics/sharia.png'
import logo1 from '../images/ShariaStocks-logo/logo.png';

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
      <header className="bg-gradient-to-r from-green-900 to-green-700 text-white py-12 px-4 md:px-8" data-testid="blog-header">
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
          <div className="relative mb-8" data-testid="search-container">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Search articles by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-input"
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
          <section className="mb-16" data-testid="featured-articles-section">
            <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        data-testid={`featured-read-more-${post.id}`}
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
        <section data-testid="blog-posts-section">
          <h2 className="text-3xl font-bold mb-8" data-testid="section-title">
            {searchTerm ? 'Search Results' : activeCategory !== 'all' ? `${categories.find(c => c.id === activeCategory).name}` : 'All Articles'}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12" data-testid="no-results">
              <p className="text-xl text-gray-600">No articles found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                data-testid="clear-filters-btn"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="all-articles-section">
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
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">{post.date}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2" data-testid={`post-title-${post.id}`}>{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      <a 
                        href={post.path}
                        className="text-green-600 font-medium flex items-center hover:text-green-700"
                        data-testid={`read-more-${post.id}`}
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

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white mt-auto" data-testid="blog-footer">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {/* Company Info */}
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <img src={logo1} alt="logo" className="w-36 sm:w-48 h-auto object-contain" />
              </div>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Your trusted platform for halal stock screening and investment guidance according to Islamic principles.
              </p>
              <div className="flex space-x-5">
                {[
                  { name: 'facebook', url: 'https://www.facebook.com/profile.php?id=61574440572509' },
                  { name: 'instagram', url: 'https://www.instagram.com/shariastocks.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' }
                ].map(social => (
                  <a 
                    key={social.name}
                    href={social.url}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                    data-testid={`social-${social.name}`}
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                      {social.name === 'facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                      {social.name === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              data-testid="resources-section"
            >
              <h3 className="text-lg font-bold mb-6">Resources</h3>
              <ul className="space-y-3">
              {[
                  { title: 'Blog', path: '/blog-catalogue' },
                  { title: 'About', path: '/about' },
                  { title: 'Terms & Conditions', path: '/terms' },
                  { title: 'Privacy Policy', path: '/privacy' }
                ].map((link, i) => (
                  <li key={i} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                    <a 
                      href={`${link.path}`} 
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                      data-testid={`footer-link-${link.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact - Adjusted for mobile */}
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="sm:col-span-2 lg:col-span-1"
              data-testid="contact-section"
            >
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Contact Us</h3>
              <ul className="space-y-3 sm:space-y-5">
                {[
                  { icon: 'email', text: 'contact@shariastocks.in' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start" whileHover={{ x: 5 }} data-testid={`contact-item-${i}`}>
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon === 'email' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                    </svg>
                    <span className="text-gray-300 text-sm sm:text-base">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div 
            className="border-t border-blue-700 mt-10 sm:mt-16 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            data-testid="copyright-section"
          >
            © 2025 ShariaStocks. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BlogCatalogue;
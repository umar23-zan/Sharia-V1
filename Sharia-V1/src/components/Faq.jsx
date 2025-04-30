// src/components/FAQPage.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Book, DollarSign, Users, Award, HelpCircle, ChevronLeft } from 'lucide-react';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
    loadSampleData();
  }, []);

  // Sample data for demonstration
  const loadSampleData = () => {
    const sampleFaqs = [
      {
        _id: '1',
        question: 'What is Sharia-compliant investing?',
        answer: 'Sharia-compliant investing refers to investment practices that adhere to Islamic principles. It prohibits investments in businesses involved in interest (riba), gambling (maysir), excessive uncertainty (gharar), and industries considered unethical such as alcohol, tobacco, pork-related products, conventional finance, weapons, and adult entertainment.',
        category: 'basics',
      },
      {
        _id: '2',
        question: 'How does ShariaStocks ensure compliance with Islamic principles?',
        answer: 'ShariaStocks employs a rigorous screening process that includes both business activity screening and financial ratio screening. We also have a dedicated Sharia board comprising scholars who review our investment offerings regularly to ensure compliance with Islamic finance principles.',
        category: 'compliance',
      },
      {
        _id: '3',
        question: 'What financial ratios are used to determine Sharia compliance?',
        answer: 'ShariaStocks uses several financial ratios for screening, including: Debt to Total Assets ratio (must be less than 33%), Cash and Interest-bearing securities to Total Assets (must be less than 33%), and Accounts Receivable to Total Assets (must be less than 45%). These ratios help ensure companies are not excessively involved in interest-based activities.',
        category: 'compliance',
      },
      {
        _id: '4',
        question: 'How do I open an account with ShariaStocks?',
        answer: 'Opening an account is simple. Click on the "Sign Up" button on our homepage, fill in your personal information, complete the KYC verification process, and fund your account. Our customer support team is available to assist you with any questions during this process.',
        category: 'account',
      },
      {
        _id: '5',
        question: 'What is the minimum investment amount?',
        answer: 'The minimum investment amount at ShariaStocks is ₹5,000. However, we also offer SIPs (Systematic Investment Plans) that allow you to start with as little as ₹1,000 per month.',
        category: 'investment',
      },
      {
        _id: '6',
        question: 'How is purification of dividends handled?',
        answer: 'In accordance with Sharia principles, we calculate the portion of dividends that may come from non-compliant activities and recommend the amount that should be donated to charity for purification. This calculation is provided in your quarterly statements, and we offer a facility to automatically donate these amounts to selected charities.',
        category: 'compliance',
      },
      {
        _id: '7',
        question: 'Can I transfer my existing investments to ShariaStocks?',
        answer: 'Yes, you can transfer your existing investments to ShariaStocks. Our team will evaluate your portfolio for Sharia compliance and guide you through the transition process, helping you replace non-compliant investments with suitable alternatives.',
        category: 'account',
      },
      {
        _id: '8',
        question: 'What fees does ShariaStocks charge?',
        answer: 'ShariaStocks charges a management fee of 1% annually on assets under management. There are no hidden fees or commissions. For detailed information on our fee structure, please visit our Pricing page.',
        category: 'investment',
      },
      {
        _id: '9',
        question: 'How do I know if a stock is Shariah-compliant?',
        answer: 'ShariaStocks analyzes each stock based on business activity screening and financial ratios that align with Islamic principles. You can use our platform to search for any stock and view its compliance report, including the reasons for classification.',
        category: 'compliance',
      },
      {
        _id: '10',
        question: 'Can Muslims invest in mutual funds?',
        answer: 'Yes, but only in mutual funds that are Shariah-compliant. These funds avoid investing in non-permissible sectors and follow Islamic finance guidelines. It’s important to check the fund’s Shariah certification before investing.',
        category: 'investment',
      },
    ];

    const uniqueCategories = [...new Set(sampleFaqs.map(faq => faq.category))];

    setFaqs(sampleFaqs);
    setCategories(uniqueCategories);
    setLoading(false);
  };

  const toggleFaq = (id) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filterFaqs = () => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'basics':
        return <Book size={20} />;
      case 'compliance':
        return <Award size={20} />;
      case 'account':
        return <Users size={20} />;
      case 'investment':
        return <DollarSign size={20} />;
      default:
        return <HelpCircle size={20} />;
    }
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const filteredFaqs = filterFaqs();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-emerald-800 text-white py-12">
        <div className="container mx-auto px-4">
        <button 
              className="group flex items-center text-white hover:text-purple-700 mb-6 transition duration-200" 
              onClick={() => navigate(-1)}
              aria-label="Go Back"
              data-testid="go-back-button"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Go Back</span>
            </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
          <p className="text-lg text-center max-w-2xl mx-auto">
            Find answers to common questions about Islamic investing and ShariaStocks services
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative max-w-xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full ${
              activeCategory === 'all' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                activeCategory === category 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(category)}
              {formatCategoryName(category)}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent align-[-0.125em]"></div>
              <p className="mt-2 text-gray-600">Loading FAQs...</p>
            </div>
          ) : filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div 
                  key={faq._id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  <button
                    className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50"
                    onClick={() => toggleFaq(faq._id)}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFaqs[faq._id] ? 
                      <ChevronUp className="flex-shrink-0 text-emerald-600" size={20} /> : 
                      <ChevronDown className="flex-shrink-0 text-emerald-600" size={20} />
                    }
                  </button>
                  {expandedFaqs[faq._id] && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-lg font-medium text-gray-900">No FAQs found</p>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>

       
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
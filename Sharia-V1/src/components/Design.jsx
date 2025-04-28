import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../images/ShariaStocks-logo/ShariaStocks.svg';
import logo1 from '../images/ShariaStocks-logo/logo.png';
import land from '../images/land.png';
import { Helmet } from 'react-helmet';

export default function LandingPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    // Redirect if user is already logged in
    if (localStorage.getItem('userEmail')) {
      navigate('/Dashboard');
    }

    // Add scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  const handleLoginClick = () => navigate('/login');
  const handleSignupClick = () => navigate('/signup');
  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleBlogClick = () => navigate('/blogs');

  const faqs = [
    {
      question: "What makes a stock halal or Sharia-compliant?",
      answer: "Sharia-compliant stocks must meet specific criteria related to the company's business activities and financial ratios. Companies involved in prohibited activities like alcohol, gambling, conventional banking, or interest-based financial services are excluded. Additionally, financial ratios related to debt, interest income, and cash/receivables must meet certain thresholds established in Islamic finance."
    },
    {
      question: "How often is your Sharia compliance data updated?",
      answer: "Our Sharia compliance data is updated quarterly, following companies' financial reporting. We also conduct real-time monitoring for significant business changes that might affect compliance status, ensuring you always have the most current information for your halal investment decisions."
    },
    {
      question: "Can I use this platform for my retirement investments?",
      answer: "Yes, many of our users utilize HalalStocks for retirement planning. We offer guidance on creating Sharia-compliant retirement portfolios and can help you evaluate existing retirement accounts for compliance."
    },
    {
      question: "What Islamic financial ratios do you use for screening?",
      answer: "We analyze several key financial ratios according to Islamic finance principles including: Debt to Total Assets (must be less than 33%), Interest Income to Total Revenue (must be less than 5%), Non-compliant Income to Total Revenue (must be less than 5%), and Cash and Receivables to Market Cap (must be less than 33%)."
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const plans = [
    {
      name: "Free",
      price: "Free",
      description: "Basic halal screening for casual investors",
      popular: false,
      features: [
        { name: "Stock search limit (3 stocks)", included: true },
        { name: "Sharia compliance Details (3 stocks)", included: true },
        { name: "Basic compliance filters", included: false },
        { name: "watchlist access", included: false },
        { name: "News Notification", included: false },
        { name: "Advanced filtering", included: false },
      ],
      buttonText: "Sign Up Free",
      onClick: handleSignupClick,
      color: "blue-500"
    },
    {
      name: "Basic",
      price: "₹ 299",
      period: "/mo",
      description: "Enhanced features for serious investors",
      popular: true,
      features: [
        { name: "Unlimited Stock search limit", included: true },
        { name: "Unlimited Sharia compliance Details", included: true },
        { name: "Basic compliance filters", included: true },
        { name: "watchlist access (upto 10 stocks)", included: true },
        { name: "News Notification (basic)", included: true },
        { name: "Advanced filtering", included: true },
      ],
      buttonText: "Get Started",
      onClick: handleSignupClick,
      color: "gradient-to-r from-teal-500 to-blue-500"
    },
    {
      name: "Premium",
      price: "₹ 499",
      period: "/mo",
      description: "Complete Solution for Professional investors",
      popular: false,
      features: [
        { name: "Unlimited Stock search limit", included: true },
        { name: "Unlimited Sharia compliance Details", included: true },
        { name: "Basic compliance filters", included: true },
        { name: "watchlist access (25 stocks)", included: true },
        { name: "News Notification (Priority)", included: true },
        { name: "Advanced filtering", included: true },
      ],
      buttonText: "Get Premium",
      onClick: handleSignupClick,
      color: "blue-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans overflow-x-hidden">
      <Helmet>
        <title>ShariaStocks | Halal Stock Screening for Islamic Investors</title>
        <meta name="description" content="Find Sharia-compliant stocks for ethical Islamic investing. Screen stocks according to Islamic principles with ShariaStocks' comprehensive halal investment platform." />
        <meta name="keywords" content="halal stocks, Sharia-compliant investing, Islamic finance, halal investment, ethical investing, Islamic principles, halal screening" />
      </Helmet>
      {/* Header - Fixed position with better mobile handling */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2 bg-white shadow-md' : 'py-3 bg-white/90'}`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          <motion.div 
            className="flex items-center" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center transform transition hover:scale-105">
              <img src={logo} alt="logo" className="w-36 h-10 sm:w-48 sm:h-14 object-cover" />
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 lg:space-x-8">
            <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-green-600 transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-green-600 transition-colors">FAQ</a>
            <a onClick={handleBlogClick} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer">Blogs</a>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.button 
              className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent transition-colors hidden md:block"
              whileHover={{ scale: 1.05 }}
              onClick={handleLoginClick}
            >
              Log in
            </motion.button>
            <motion.button 
              className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-3 py-2 sm:px-5 sm:py-2 rounded-lg transition-colors hidden md:block text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignupClick}
            >
              Sign Up
            </motion.button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-600" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation - Improved animation and positioning */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-4">
                <a href="#features" className="block text-gray-600 hover:text-green-600 transition-colors py-2">Features</a>
                <a href="#how-it-works" className="block text-gray-600 hover:text-green-600 transition-colors py-2">How It Works</a>
                <a href="#pricing" className="block text-gray-600 hover:text-green-600 transition-colors py-2">Pricing</a>
                <a href="#faq" className="block text-gray-600 hover:text-green-600 transition-colors py-2">FAQ</a>
                <a onClick={handleBlogClick} className="block text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2">Blogs</a>
                <div className="pt-4 flex flex-col space-y-3">
                  <button className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent transition-colors text-left py-2" onClick={handleLoginClick}>Log in</button>
                  <button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-center" onClick={handleSignupClick}>Sign Up</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section - Improved responsiveness */}
      <section className="bg-[#f0f7ff] w-full overflow-hidden pt-24 sm:pt-28 md:pt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 flex flex-col md:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-6 lg:pr-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Halal Stock Screening for Islamic Investors</span>
            </h1>
            <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg max-w-lg">
            Discover Sharia-compliant stocks and build your ethical investment portfolio according to Islamic principles with India's trusted halal stock screening platform.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button 
                onClick={() => {navigate('/signup')}}
                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:from-teal-700 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm sm:text-base"
              >
                Start Investing
              </button>
            </div>
          </div>
          
          {/* Right Content - Image with better mobile rendering */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
              <img 
                src={land} 
                alt="Ethical Investing" 
                className="relative rounded-xl w-full h-auto object-cover shadow-2xl hover:shadow-3xl transition duration-300" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Combined Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-[#f0f7ff] to-white">
  <div className="max-w-6xl mx-auto">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="text-center mb-16"
    >
      <motion.h2 
        variants={itemVariants} 
        className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
      >
        Powerful Features for Halal Investing
      </motion.h2>
      <motion.p 
        variants={itemVariants} 
        className="text-lg text-gray-600 max-w-2xl mx-auto"
      >
        Everything you need to build and manage a Sharia-compliant investment portfolio
      </motion.p>
    </motion.div>

    <motion.div 
      className="grid md:grid-cols-3 gap-6 lg:gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Feature 1 */}
      <motion.div 
        className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="font-bold text-lg mb-2 text-gray-800">Stock Search</h3>
        <p className="text-gray-600">
          Search thousands of global stocks with comprehensive financial data and metrics.
        </p>
      </motion.div>

      {/* Feature 2 */}
      <motion.div 
        className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="font-bold text-lg mb-2 text-gray-800">Sharia Compliance Screening</h3>
        <p className="text-gray-600">
        Comprehensive halal stock screening according to Islamic finance principles, including financial ratios and business activities verification.
        </p>
      </motion.div>

      {/* Feature 3 */}
      <motion.div 
        className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="font-bold text-lg mb-2 text-gray-800">Watchlist</h3>
        <p className="text-gray-600">
          Save and monitor your favorite halal-compliant stocks in a personalized watchlist.
        </p>
      </motion.div>

      {/* Feature 4 */}
      <motion.div 
        className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="font-bold text-lg mb-2 text-gray-800">Islamic Financial Analytics</h3>
        <p className="text-gray-600">
        Access detailed Sharia-compliant financial analysis and performance metrics for informed halal investment decisions.
        </p>
      </motion.div>

      {/* Feature 5 */}
      <motion.div 
        className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="font-bold text-lg mb-2 text-gray-800">Compliance Alerts</h3>
        <p className="text-gray-600">
          Receive notifications when a stock's compliance status changes.
        </p>
      </motion.div>

      {/* Feature 6 */}
      <motion.div 
        className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="font-bold text-lg mb-2 text-gray-800">Market Trends</h3>
        <p className="text-gray-600">
          Stay updated with market trends and analysis of halal investment opportunities.
        </p>
      </motion.div>
    </motion.div>
    
    
  </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-[#f0f7ff]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants} 
              className="text-3xl font-bold mb-12"
            >
              How It Works
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1: Search */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">1. Search</h3>
                <p className="text-gray-600 text-center">
                  Enter company names or ticker symbols to begin your halal investment journey.
                </p>
              </motion.div>
              
              {/* Step 2: Screen */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">2. Screen</h3>
                <p className="text-gray-600 text-center">
                  View detailed compliance reports and financial metrics for each stock.
                </p>
              </motion.div>
              
              {/* Step 3: Monitor */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">3. Monitor</h3>
                <p className="text-gray-600 text-center">
                  Add compliant stocks to watchlists and receive real-time alerts.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Why Choose ShariaStocks Section */}
      <section id="why-choose" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants} 
              className="text-3xl font-bold mb-12"
            >
              Why Choose ShariaStocks
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Reason 1: Thorough Screening */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl flex flex-col items-center"
              >
                <div className="h-16 w-16 text-teal-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">Thorough Screening</h3>
                <p className="text-gray-600 text-center">
                  Comprehensive methodology based on Islamic principles ensuring complete compliance.
                </p>
              </motion.div>
              
              {/* Reason 2: Global Coverage */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl flex flex-col items-center"
              >
                <div className="h-16 w-16 text-teal-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">Stocks Coverage</h3>
                <p className="text-gray-600 text-center">
                  Access to stocks from NSE - National Stock Exchange for diverse investment opportunities.
                </p>
              </motion.div>
              
              {/* Reason 3: Easy to Use */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl flex flex-col items-center"
              >
                <div className="h-16 w-16 text-teal-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">Easy to Use</h3>
                <p className="text-gray-600 text-center">
                  Intuitive interface designed for investors of all experience levels.
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <button
              onClick={handleSignupClick}
              className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              Get Started Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Islamic Investing Section */}
<section className="py-16 px-6 bg-white">
  <div className="max-w-6xl mx-auto">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="text-center mb-12"
    >
      <motion.h2 
        variants={itemVariants} 
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
      >
        Islamic Investing Principles
      </motion.h2>
      <motion.p 
        variants={itemVariants} 
        className="text-lg text-gray-600 max-w-3xl mx-auto"
      >
        Understanding the Sharia guidelines that govern halal investments
      </motion.p>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-8">
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl"
      >
        <h3 className="font-bold text-xl mb-4 text-gray-800">What Makes Investments Halal?</h3>
        <p className="text-gray-600">
          Sharia-compliant investments adhere to Islamic principles that prohibit riba (interest), gharar (excessive uncertainty), and investments in haram business activities. Our platform applies rigorous financial screening to ensure stocks meet these requirements.
        </p>
        <ul className="mt-4 space-y-2">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-teal-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Business Activity Screening - Avoiding prohibited industries</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-teal-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Financial Ratio Analysis - Monitoring debt and interest levels</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-teal-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Revenue Purification - Calculating zakat-eligible investments</span>
          </li>
        </ul>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl"
      >
        <h3 className="font-bold text-xl mb-4 text-gray-800">Our Sharia Screening Methodology</h3>
        <p className="text-gray-600">
          ShariaStocks employs a comprehensive screening methodology based on established Islamic finance standards to identify truly halal investment opportunities.
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">Debt to Total Assets</span>
            <p className="text-sm text-gray-600">Must be less than 33% to qualify as Sharia-compliant</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: "33%" }}></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">Interest Income Ratio</span>
            <p className="text-sm text-gray-600">Must be less than 5% of total revenue</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: "5%" }}></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">Cash and Receivables</span>
            <p className="text-sm text-gray-600">Must be less than 33% of market capitalization</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: "33%" }}></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    
    <motion.div 
      className="text-center mt-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <button
        onClick={handleSignupClick}
        className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all transform hover:-translate-y-1"
      >
        Start Halal Investing Today
      </button>
    </motion.div>
  </div>
</section>

      <section id='pricing' className="py-12 md:py-20 bg-white">
        <motion.div 
          className="max-w-6xl mx-auto px-4 md:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-2 md:mb-3 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
            variants={fadeIn}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-10 md:mb-20 text-sm md:text-base"
            variants={fadeIn}
          >
            Choose the plan that works best for your investment journey
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {plans.map((plan, index) => (
              <motion.div 
                key={plan.name}
                className={`bg-white rounded-lg ${plan.popular ? 'border-2 border-teal-500 shadow-xl' : 'border border-gray-200 shadow-md'} p-4 md:p-8 relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                variants={fadeIn}
                onMouseEnter={() => setSelectedPlan(index)}
                onMouseLeave={() => setSelectedPlan(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 md:-top-4 right-4 md:right-6 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-md">
                    Most Popular
                  </div>
                )}
                <div className="mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-1">{plan.name}</h3>
                  <div className="text-2xl md:text-3xl font-bold mb-1">
                    {plan.price} {plan.period && <span className="text-base md:text-lg font-normal text-gray-500">{plan.period}</span>}
                  </div>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-2 md:space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <svg 
                        className={`h-4 w-4 md:h-5 md:w-5 ${feature.included ? 'text-green-500' : 'text-gray-300'} mr-2`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-sm md:text-base ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <motion.button 
                  className={`mt-6 md:mt-8 w-full bg-${plan.color} hover:opacity-90 text-white py-2 md:py-3 px-4 rounded-md transition-all duration-300 transform ${selectedPlan === index ? 'scale-105' : ''} text-sm md:text-base`}
                  onClick={plan.onClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {plan.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <motion.section 
        className="bg-white py-20 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold mb-6 text-black"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join Thousands of Muslim Investors
          </motion.h2>
          <motion.p 
            className="text-xl mb-10 text-gray-600"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Build your Halal investment portfolio today and invest with confidence
            knowing your investments and Sharia compliant
          </motion.p>
          <motion.button 
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition duration-300 shadow-lg"
            onClick={handleSignupClick}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
          </motion.button>
        </div>
      </motion.section>

      {/* Testimonials Section */}
<section className="py-20 px-6 bg-[#f0f7ff]">
  <div className="max-w-6xl mx-auto">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="text-center mb-16"
    >
      <motion.h2 
        variants={itemVariants} 
        className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
      >
        What Muslim Investors Say
      </motion.h2>
      <motion.p 
        variants={itemVariants} 
        className="text-lg text-gray-600 max-w-2xl mx-auto"
      >
        Join thousands of investors building their halal investment portfolios with ShariaStocks
      </motion.p>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Testimonial 1 */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            A
          </div>
          <div className="ml-4">
            <h4 className="font-bold">Ahmed S.</h4>
            <p className="text-sm text-gray-500">Long-term Investor</p>
          </div>
        </div>
        <p className="text-gray-600 italic">
          "ShariaStocks has transformed my approach to halal investing. The detailed Sharia compliance reports give me confidence that my portfolio truly adheres to Islamic principles."
        </p>
        <div className="mt-4 flex text-yellow-400">
          {[1,2,3,4,5].map(star => (
            <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </motion.div>

      {/* Testimonial 2 */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
            F
          </div>
          <div className="ml-4">
            <h4 className="font-bold">Fatima R.</h4>
            <p className="text-sm text-gray-500">New Investor</p>
          </div>
        </div>
        <p className="text-gray-600 italic">
          "As someone new to investing, finding truly halal stocks was overwhelming until I discovered ShariaStocks. Now I can build my investment portfolio with complete peace of mind about Sharia compliance."
        </p>
        <div className="mt-4 flex text-yellow-400">
          {[1,2,3,4,5].map(star => (
            <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </motion.div>

      {/* Testimonial 3 */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
            M
          </div>
          <div className="ml-4">
            <h4 className="font-bold">Mohammed K.</h4>
            <p className="text-sm text-gray-500">Financial Advisor</p>
          </div>
        </div>
        <p className="text-gray-600 italic">
          "I recommend ShariaStocks to all my Muslim clients. The comprehensive halal screening methodology aligns perfectly with Islamic finance principles and makes my job easier when creating Sharia-compliant portfolios."
        </p>
        <div className="mt-4 flex text-yellow-400">
          {[1,2,3,4,5].map(star => (
            <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
</section>

      <section id='faq' className="py-20 bg-[#f0f7ff]">
        <motion.div 
          className="max-w-4xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-3"
            variants={fadeIn}
          >
            Frequently Asked <span className="text-blue-500">Questions</span>
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-16"
            variants={fadeIn}
          >
            Find answers to common questions about halal investing and our platform
          </motion.p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
                variants={fadeIn}
              >
                <button
                  className="flex justify-between items-center w-full text-left py-5 px-6 focus:outline-none bg-white hover:bg-gray-50"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <motion.svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-5 bg-gray-50"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer - Improved responsiveness */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {/* Company Info */}
            <motion.div
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
                  <motion.a 
                    key={social.name}
                    href={social.url}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                      {social.name === 'facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                      {social.name === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />}
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-3">
                {['Features', 'How It Works', 'Pricing', 'FAQ'].map((link, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                    <a 
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-lg font-bold mb-6">Resources</h3>
                <ul className="space-y-3">
                {[
                    { title: 'Halal Investment Blog', path: '/blogs' },
                    { title: 'About', path: '/about' },
                    { title: 'Terms & Conditions', path: '/terms' },
                    { title: 'Privacy Policy', path: '/privacy' }
                  ].map((link, i) => (
                    <motion.li key={i} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                      <a href={`${link.path}`} className="text-gray-300 hover:text-white transition-colors duration-300">{link.title}</a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

            {/* Contact - Adjusted for mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Contact Us</h3>
              <ul className="space-y-3 sm:space-y-5">
                {[
                  { icon: 'email', text: 'contact@shariastocks.in' },
                ].map((item, i) => (
                  <motion.li key={i} className="flex items-start" whileHover={{ x: 5 }}>
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon === 'email' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                    </svg>
                    <span className="text-gray-300 text-sm sm:text-base">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div 
            className="border-t border-blue-700 mt-10 sm:mt-16 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            © 2025 Zansphere Private Limited. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
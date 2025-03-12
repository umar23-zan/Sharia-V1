import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence  } from 'framer-motion';
import logo from '../images/ShariaStocks-logo/ShariaStocks.png'

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

  const faqs = [
    {
      question: "What makes a stock halal or Sharia-compliant?",
      answer: "Sharia-compliant stocks must meet specific criteria related to the company's business activities and financial ratios. Companies involved in prohibited activities like alcohol, gambling, or interest-based financial services are excluded. Additionally, financial ratios related to debt, interest income, and cash/receivables must meet certain thresholds."
    },
    {
      question: "How often is the compliance data updated?",
      answer: "Our compliance data is updated quarterly, following companies' financial reporting. We also conduct real-time monitoring for significant business changes that might affect compliance status."
    },
    {
      question: "Can I use this platform for my retirement investments?",
      answer: "Yes, many of our users utilize HalalStocks for retirement planning. We offer guidance on creating Sharia-compliant retirement portfolios and can help you evaluate existing retirement accounts for compliance."
    },
    {
      question: "What financial ratios do you use for screening?",
      answer: "We analyze several key financial ratios including: Debt to Total Assets (must be less than 33%), Interest Income to Total Revenue (must be less than 5%), and Non-compliant Income to Total Revenue (must be less than 5%)."
    },
    {
      question: "Do you offer purification calculations?",
      answer: "Yes, our Premium plan includes purification calculations that help you determine the amount of your investment returns that should be donated to charity to purify any non-compliant income."
    }
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
        { name: "Basic stock screening", included: true },
        { name: "Limited search (10/day)", included: true },
        { name: "Basic compliance filters", included: true },
        { name: "Single watchlist (up to 5 stocks)", included: true },
        { name: "Community forum access", included: true },
        { name: "Advanced filtering", included: false },
        { name: "Detailed financial analysis", included: false },
        { name: "Email alerts", included: false }
      ],
      buttonText: "Sign Up Free",
      onClick: handleSignupClick,
      color: "blue-500"
    },
    {
      name: "Basic",
      price: "$9.99",
      period: "/mo",
      description: "Enhanced features for serious investors",
      popular: true,
      features: [
        { name: "Everything in Free plan", included: true },
        { name: "Unlimited stock screening", included: true },
        { name: "Advanced compliance filters", included: true },
        { name: "Multiple watchlists", included: true },
        { name: "Email Alerts for compliance changes", included: true },
        { name: "Portfolio Analysis", included: true },
        { name: "Priority customer support", included: false },
        { name: "API Access", included: false }
      ],
      buttonText: "Get Started",
      onClick: handleSignupClick,
      color: "gradient-to-r from-blue-900 to-green-900"
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "/mo",
      description: "Complete Solution for Professional investors",
      popular: false,
      features: [
        { name: "Everything in Basic plan", included: true },
        { name: "Advanced Portfolio Analysis", included: true },
        { name: "Custom Screening Criteria", included: true },
        { name: "Realtime Compliance Alerts", included: true },
        { name: "Export Data to Excel/PDF", included: true },
        { name: "Priority Customer Support", included: true },
        { name: "API Access for integration", included: true },
        { name: "Personalized Investment Advice", included: true }
      ],
      buttonText: "Get Premium",
      onClick: handleSignupClick,
      color: "blue-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans overflow-x-hidden">
      {/* Header - Now with scroll effect */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2 bg-white shadow-md' : 'py-4 bg-white/90'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div 
            className="flex items-center" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center transform transition hover:scale-105">
              <img src={logo} alt="logo" className=' w-48 h-14 object-cover '/>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-green-600 transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-green-600 transition-colors">FAQ</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button 
              className="text-gray-600 hover:text-green-600 transition-colors hidden md:block"
              whileHover={{ scale: 1.05 }}
              onClick={handleLoginClick}
            >
              Log in
            </motion.button>
            <motion.button 
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition-colors hidden md:block"
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
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <motion.div 
          className={`md:hidden bg-white ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-6 py-4 space-y-4 shadow-lg">
            <a href="#features" className="block text-gray-600 hover:text-green-600 transition-colors">Features</a>
            <a href="#how-it-works" className="block text-gray-600 hover:text-green-600 transition-colors">How It Works</a>
            <a href="#pricing" className="block text-gray-600 hover:text-green-600 transition-colors">Pricing</a>
            <a href="#faq" className="block text-gray-600 hover:text-green-600 transition-colors">FAQ</a>
            <div className="pt-4 flex flex-col space-y-3">
              <button className="text-gray-600 hover:text-green-600 transition-colors text-left" onClick={handleLoginClick}>Log in</button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-center" onClick={handleSignupClick}>Sign Up</button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Hero Section - With animation */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-32 pb-16 px-6 bg-gradient-to-r from-blue-900 to-green-800 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Ethical Investing Made <span className="text-yellow-400 inline-block transform hover:scale-105 transition-transform">Simple</span>
          </motion.h1>
          <motion.p 
            className="text-lg mb-8 text-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Screen stocks according to Islamic principles and build a halal
            investment portfolio with confidence.
          </motion.p>
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <motion.button 
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg shadow-lg transition-all"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignupClick}
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section 1 */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4">
              Powerful Features for <span className="text-blue-600">Halal Investing</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to build and manage a Sharia-compliant investment portfolio
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Stock Search</h3>
              <p className="text-gray-600">
                Search thousands of global stocks with comprehensive financial data and metrics.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Halal Screening</h3>
              <p className="text-gray-600">
                Screen stocks according to Islamic principles including financial ratios and business activities.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Watchlist</h3>
              <p className="text-gray-600">
                Save and monitor your favorite halal-compliant stocks in a personalized watchlist.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section 2 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Financial Analytics</h3>
              <p className="text-gray-600">
                Access detailed financial analysis and performance metrics for informed decisions.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Compliance Alerts</h3>
              <p className="text-gray-600">
                Receive notifications when a stock's compliance status changes.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Market Trends</h3>
              <p className="text-gray-600">
                Stay updated with market trends and analysis of halal investment opportunities.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4">How It Works</motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to find and monitor halal-compliant stocks
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.div 
              className="text-center relative"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md relative z-10">
                1
              </div>
              {/* Line connecting to next step - visible on desktop */}
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-blue-200"></div>
              <h3 className="font-bold text-xl mb-3">Search</h3>
              <p className="text-gray-600">
                Enter a company name or ticker symbol to find stocks that interest you
              </p>
            </motion.div>

            <motion.div 
              className="text-center relative"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md relative z-10">
                2
              </div>
              {/* Line connecting to next step - visible on desktop */}
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-blue-200"></div>
              <h3 className="font-bold text-xl mb-3">Screen</h3>
              <p className="text-gray-600">
                View detailed compliance reports and financial metrics to assess halal status
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md relative z-10">
                3
              </div>
              <h3 className="font-bold text-xl mb-3">Monitor</h3>
              <p className="text-gray-600">
                Add compliant stocks to your watchlist and receive alerts on status changes
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md transition-all"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignupClick}
            >
              Try it now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-blue-900 py-20 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-3">
              Why Choose <span className="text-yellow-500">ShariaStocks</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-200 max-w-2xl mx-auto">
              Our platform is designed specifically for Muslim investors
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {/* Thorough Screening */}
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="mb-6"
                initial={{ rotateY: 0 }}
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-20 w-20 text-yellow-500"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">Thorough Screening</h3>
              <p className="text-gray-300">
                Comprehensive screening methodology based on established Islamic finance principles
              </p>
            </motion.div>

            {/* Global Coverage */}
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="mb-6"
                animate={{ 
                  rotate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 360],
                }}
                transition={{ 
                  repeat: Infinity,
                  repeatDelay: 5,
                  duration: 2
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-20 w-20 text-yellow-500" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">Global Coverage</h3>
              <p className="text-gray-300">
                Access stocks from markets worldwide, not just limited to Islamic indexes
              </p>
            </motion.div>

            {/* Easy to Use */}
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="mb-6"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-20 w-20 text-yellow-500" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12" y2="18"/>
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">Easy to Use</h3>
              <p className="text-gray-300">
                Intuitive interface designed for investors of all experience levels
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id='pricing' className="py-20 bg-white">
        <motion.div 
          className="max-w-6xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-3"
            variants={fadeIn}
          >
            Simple, Transparent <span className="text-green-500">Pricing</span>
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-20"
            variants={fadeIn}
          >
            Choose the plan that works best for your investment journey
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div 
                key={plan.name}
                className={`bg-white rounded-lg ${plan.popular ? 'border-2 border-green-500 shadow-xl' : 'border border-gray-200 shadow-md'} p-8 relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                variants={fadeIn}
                onMouseEnter={() => setSelectedPlan(index)}
                onMouseLeave={() => setSelectedPlan(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-6 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-1">
                    {plan.price} {plan.period && <span className="text-lg font-normal text-gray-500">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <svg 
                        className={`h-5 w-5 ${feature.included ? 'text-green-500' : 'text-gray-300'} mr-2`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <motion.button 
                  className={`mt-8 w-full bg-${plan.color} hover:opacity-90 text-white py-3 px-4 rounded-md transition-all duration-300 transform ${selectedPlan === index ? 'scale-105' : ''}`}
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
        className="bg-gradient-to-r from-green-600 to-blue-700 py-20 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ready to Build Your Halal Portfolio?
          </motion.h2>
          <motion.p 
            className="text-xl mb-10"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Join thousands of Muslim investors using ShariaStocks to align their investments 
            with their values.
          </motion.p>
          <motion.button 
            className="bg-white text-green-700 px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition duration-300 shadow-lg"
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

      <section className="py-20 bg-white">
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

      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <img src={logo} alt="logo" className=' w-58 h-18 object-cover '/>
              </div>
              <p className="text-gray-300 mb-6">
                Your trusted platform for halal stock screening and investment guidance according to Islamic principles.
              </p>
              <div className="flex space-x-5">
                {['facebook', 'twitter', 'instagram'].map(social => (
                  <motion.a 
                    key={social}
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      {social === 'facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                      {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                      {social === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />}
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
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['Features', 'How It Works', 'Pricing', 'FAQ'].map((link, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{link}</a>
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
                {['Blog', 'Knowledge Center', 'Islamic Finance', 'Terms of Service', 'Privacy Policy'].map((link, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">{link}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <ul className="space-y-5">
                {[
                  { icon: 'email', text: 'support@shariastocks.com' },
                  { icon: 'phone', text: '+1 (555) 123-4567' },
                  { icon: 'location', text: '123 Finance St, New York, NY 10001' }
                ].map((item, i) => (
                  <motion.li key={i} className="flex items-start" whileHover={{ x: 5 }}>
                    <svg className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon === 'email' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                      {item.icon === 'phone' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                      {item.icon === 'location' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                    </svg>
                    <span className="text-gray-300">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div 
            className="border-t border-blue-700 mt-16 pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            © 2025 Shariastocks. All rights reserved.
          </motion.div>
        </div>
      </footer>
        </div>
    )
}
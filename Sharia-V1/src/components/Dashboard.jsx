import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import niftyCompanies from '../nifty_symbols.json';
import { Helmet } from 'react-helmet';
const Header = lazy(() => import('./Header'));
import logo from '../images/ShariaStocks-logo/logo1.jpeg';
import { getUserData } from '../api/auth';
import PaymentAlertModal from './PaymentAlertModal';
import usePaymentAlert from './usePaymentAlert';

const Dashboard = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState({});
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const email = localStorage.getItem('userEmail');
  const { isOpen, type, daysRemaining, amount, closeAlert } = usePaymentAlert(user);

  useEffect(() => {
    setCompanies(niftyCompanies);
    if (email) {
      fetchUserData();
    }
  }, [email]);

  const fetchUserData = async () => {
    try {
      const userData = await getUserData(email);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchSymbol(value);
    setIsSearchActive(!!value);

    if (value) {
      const filteredCompanies = companies
        .filter(company =>
          company["NAME OF COMPANY"].toUpperCase().includes(value) ||
          company.SYMBOL.includes(value)
        )
        .slice(0, 6);
      setSuggestions(filteredCompanies);
    } else {
      setSuggestions([]);
      setIsSearchActive(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div>
      <Helmet>
        <title>ShariaStocks | Ethical Stock Investing in India</title>
        <meta
          name="description"
          content="Discover Halal investment opportunities in Indian stock markets. Analyze companies based on Shariah compliance with ShariaStocks."
        />
        <meta name="keywords" content="Halal Stocks, Shariah Compliance, Stock Market India, Ethical Investing, Muslim Investments" />
        <link rel="canonical" href="https://shariastocks.in/dashboard" />
      </Helmet>

      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <main className="max-w-7xl mx-auto">
          <PaymentAlertModal
            isOpen={isOpen}
            onClose={closeAlert}
            type={type}
            daysRemaining={daysRemaining}
            amount={amount}
          />

          <section className="flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl px-6 py-12 rounded-3xl bg-white shadow-xl mx-4 border border-gray-100">
              {/* Logo */}
              <div className="text-center mb-12">
                <div className="mb-6 relative">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-xl"></div>
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-purple-100 rounded-full opacity-50 blur-lg"></div>
                  <img
                    src={logo}
                    alt="ShariaStocks Company Logo"
                    className="h-20 mx-auto relative z-10"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/200x80?text=Company+Logo" }}
                  />
                </div>

                {/* ✅ <h1> for SEO */}
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Invest with Purpose
                </h1>

                <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto">
                  Discover investment opportunities that align with your values and financial goals.
                </p>
              </div>

              {/* Search Bar */}
              <form
                className="relative mx-auto max-w-xl"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (suggestions.length > 0) {
                    setSearchSymbol(suggestions[0].SYMBOL);
                    navigate(`/stockresults/${suggestions[0].SYMBOL}`, { state: { user } });
                  }
                }}
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-white rounded-xl">
                    <input
                      type="text"
                      onChange={handleInputChange}
                      value={searchSymbol}
                      ref={searchInputRef}
                      placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"
                      className="w-full py-5 pl-6 pr-16 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>

                  {isSearchActive && suggestions.length > 0 && (
                    <ul className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.SYMBOL}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSearchSymbol(suggestion.SYMBOL);
                            setIsSearchActive(false);
                            navigate(`/stockresults/${suggestion.SYMBOL}`, { state: { user } });
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img
                              src={suggestion.Company_Logo}
                              alt={`${suggestion["NAME OF COMPANY"]} logo`}
                              className="w-6 h-6 object-cover"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/32" }}
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="text-sm font-medium">{truncateText(suggestion["NAME OF COMPANY"], 25)}</span>
                            <span className="text-xs text-gray-500">{suggestion.SYMBOL}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-4 text-center">
                  Enter a stock symbol to explore detailed information and analysis
                </p>
              </form>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-500 text-sm">
            © 2025 Zansphere. All rights reserved.
          </footer>
        </main>
      </Suspense>
    </div>
  );
};

export default Dashboard;

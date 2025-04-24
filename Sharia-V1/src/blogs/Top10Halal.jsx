// src/components/HalalStocksBlog.jsx
import React, { useState } from 'react';
import { Leaf, TrendingUp, BookOpen, Info, CheckCircle, Star } from 'lucide-react';
import Footer from '../components/Footer';

const Top10HalalStocksBlog = () => {
  const [activeTab, setActiveTab] = useState('stocks');

  const stocks = [
    {
      name: "Tata Consultancy Services (TCS)",
      sector: "IT Services",
      whyHalal: "TCS has negligible debt, earns through halal core activities, and doesn't deal in interest-based income.",
      highlights: "Strong global presence, high profit margins, and consistent dividend payouts.",
      logoColor: "bg-blue-600"
    },
    {
      name: "Infosys Limited",
      sector: "IT Services",
      whyHalal: "Low debt-to-equity ratio and clean revenue streams.",
      highlights: "Solid fundamentals, strong client base in North America and Europe.",
      logoColor: "bg-indigo-600"
    },
    {
      name: "Nestlé India",
      sector: "FMCG (Consumer Goods)",
      whyHalal: "No haram products, low debt, and ethical practices.",
      highlights: "Trusted food brand with consistent performance.",
      logoColor: "bg-red-600"
    },
    {
      name: "HCL Technologies",
      sector: "Technology",
      whyHalal: "Compliant with financial and sectoral Shariah guidelines.",
      highlights: "High innovation focus and growing global footprint.",
      logoColor: "bg-green-600"
    },
    {
      name: "Dr. Reddy's Laboratories",
      sector: "Pharmaceuticals",
      whyHalal: "Focuses on healthcare without involvement in non-compliant financial activities.",
      highlights: "Strong R&D, international approvals, and high export growth.",
      logoColor: "bg-pink-600"
    },
    {
      name: "Divi's Laboratories",
      sector: "Healthcare & Pharma",
      whyHalal: "Clean balance sheet, ethical sector, no interest-based income.",
      highlights: "Global API leader with robust margins.",
      logoColor: "bg-teal-600"
    },
    {
      name: "Asian Paints",
      sector: "Consumer Goods",
      whyHalal: "No haram revenue, debt levels are within halal range.",
      highlights: "Market leader in paints and coatings, wide brand recognition.",
      logoColor: "bg-amber-600"
    },
    {
      name: "Hindustan Unilever Ltd",
      sector: "FMCG",
      whyHalal: "Shariah-compliant financial ratios and operates in a halal sector.",
      highlights: "Leading brand portfolio and strong market penetration in India.",
      logoColor: "bg-orange-600"
    },
    {
      name: "UltraTech Cement Ltd",
      sector: "Construction Materials",
      whyHalal: "No haram involvement and debt is within Shariah thresholds.",
      highlights: "Largest cement producer in India with global presence.",
      logoColor: "bg-gray-600"
    },
    {
      name: "Tata Motors Ltd",
      sector: "Automotive",
      whyHalal: "Operations and earnings come from halal core sectors; passes debt filters.",
      highlights: "Diversified product line with growing EV footprint.",
      logoColor: "bg-lime-600"
    }
  ];
  

  const criteria = [
    "Business activity must not involve haram sectors (like alcohol, gambling, interest-based finance, etc.)",
    "Debt must be below 33% of total assets",
    "Interest income must be negligible",
    "Liquidity and leverage ratios must fall within Islamic limits"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 to-green-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <Leaf className="w-8 h-8 mr-2" />
            <h4 className="text-lg font-medium">ShariaStocks</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Top 10 Halal Stocks in 2025</h1>
          <p className="text-lg opacity-90">
            Ethical investment opportunities that align with Islamic principles while offering promising returns.
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto flex overflow-x-auto">
          <button 
            className={`px-6 py-4 font-medium flex items-center ${activeTab === 'stocks' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600'}`}
            onClick={() => setActiveTab('stocks')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Top Stocks
          </button>
          <button 
            className={`px-6 py-4 font-medium flex items-center ${activeTab === 'criteria' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600'}`}
            onClick={() => setActiveTab('criteria')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Halal Criteria
          </button>
          <button 
            className={`px-6 py-4 font-medium flex items-center ${activeTab === 'about' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600'}`}
            onClick={() => setActiveTab('about')}
          >
            <Info className="w-4 h-4 mr-2" />
            About Us
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Introduction */}
        <div className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            As Muslim investors seek ethical investment opportunities that align with Islamic principles, <strong>Halal stock screening</strong> has become more accessible and refined in recent years. In 2025, a growing number of Indian and global companies are meeting the criteria of <strong>Shariah-compliant investing</strong>, offering promising returns while respecting Islamic values.
          </p>
        </div>

        {activeTab === 'stocks' && (
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-700" />
              Top 10 Halal Stocks to Watch in 2025
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {stocks.map((stock, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center p-4 border-b border-gray-100">
                    <div className={`w-12 h-12 rounded-lg ${stock.logoColor} text-white flex items-center justify-center font-bold text-xl`}>
                      {stock.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="font-bold text-lg">{index + 1}. {stock.name}</h3>
                        {index < 3 && <Star className="w-4 h-4 ml-2 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-600">{stock.sector}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-green-700 mb-1">Why it's Halal:</h4>
                      <p className="text-gray-700">{stock.whyHalal}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-1">Highlights:</h4>
                      <p className="text-gray-700">{stock.highlights}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'criteria' && (
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-green-700" />
              What Makes a Stock Halal?
            </h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-6">
                To be considered <strong>Shariah-compliant</strong>, a stock must pass the following checks:
              </p>
              
              <ul className="space-y-4">
                {criteria.map((criterion, index) => (
                  <li key={index} className="flex">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-gray-700">
                  At <strong>ShariaStocks</strong>, we automate this screening process using financial data and AI-driven models, giving Muslim investors peace of mind while investing ethically.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <Info className="w-6 h-6 mr-2 text-green-700" />
              About ShariaStocks
            </h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg mb-4">
                ShariaStocks is a dedicated platform helping Muslim investors make ethical investment choices that align with Islamic principles.
              </p>
              
              <h3 className="font-bold text-lg mb-3 text-green-700">Our Mission</h3>
              <p className="mb-6">
                We aim to simplify Shariah-compliant investing by providing thoroughly researched stock recommendations, automated screening tools, and educational resources for the Muslim investing community.
              </p>
              
              <h3 className="font-bold text-lg mb-3 text-green-700">Our Approach</h3>
              <p className="mb-4">
                Our team of financial analysts and Shariah experts continuously monitor global markets to identify investment opportunities that meet both financial performance criteria and Islamic compliance requirements.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-6">
                <p className="font-medium text-gray-800">
                  Want to explore more Halal investment opportunities? Check out our full list of screened stocks and market insights on <strong>ShariaStocks</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Final Thoughts Section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
          <h3 className="text-xl font-bold mb-3">Final Thoughts</h3>
          <p className="text-gray-700">
            The above stocks are a mix of ethical, growth-oriented, and financially sound companies that align with Islamic values. As always, <strong>do your due diligence</strong> and consider consulting a Shariah advisor or using a halal stock screening platform before making any investment.
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
        <a href="https://shariastocks.in" target="_blank" rel="noopener noreferrer">
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg shadow transition-colors flex items-center mx-auto">
            <BookOpen className="w-5 h-5 mr-2" />
            Explore Our Full Halal Stock List
          </button>
        </a>
          <p className="mt-3 text-gray-600">
            Join thousands of Muslim investors making informed, ethical investment decisions.
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Top10HalalStocksBlog;
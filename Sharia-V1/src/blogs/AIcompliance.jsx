import { useState } from 'react';
import { Search, ChevronDown, Filter, AlertCircle, CheckCircle, TrendingUp, BookOpen, RefreshCw, FileText, Target, PieChart, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer'

export default function AIcompliance() {
  const sections = [
    {
      icon: <Search size={22} />,
      title: "What Is Islamic Compliance in Stocks?",
      content: "Islamic investing follows Shariah principles, prohibiting industries like alcohol, gambling, and interest-based finance. Investors must also assess company debt levels, interest income, and financial ratios. This process is traditionally complex and time-consuming, requiring domain expertise."
    },
    {
      icon: <TrendingUp size={22} />,
      title: "Natural Language Processing for News & Reports",
      content: "AI models use NLP to analyze financial news, press releases, and reports. They scan for keywords related to haram activities (gambling, alcohol, unethical investments), helping investors detect red flags instantly. For example, an AI model might read a company's quarterly report and flag a recent investment in a liquor brand as non-compliant."
    },
    {
      icon: <Filter size={22} />,
      title: "Financial Ratio Screening",
      content: "Islamic finance has strict rules for debt, liquidity, and interest income. AI can pull financial data, calculate compliance ratios in real time, and determine if a stock passes the Shariah screen. AI ensures the company's debt-to-equity ratio, interest income, and cash assets remain within Shariah-compliant limits."
    },
    {
      icon: <BookOpen size={22} />,
      title: "Sector & Industry Classification",
      content: "AI models classify sectors accurately using machine learning. Instead of relying on outdated labels, AI dynamically analyzes a company's activities to determine whether they fall into halal or haram categories."
    },
    {
      icon: <RefreshCw size={22} />,
      title: "Continuous Monitoring",
      content: "Compliance isn't a one-time check. AI systems continuously monitor company activities, news, and financial updates to flag any shift that may affect a stock's halal status."
    },
    {
      icon: <Target size={22} />,
      title: "Personalized Screening",
      content: "With AI, platforms offer personalized Shariah compliance checks based on your preferred risk level, desired industries, and ethical values."
    }
  ];

  const stats = [
    { label: "Faster Analysis", value: "80%", description: "Reduction in screening time" },
    { label: "More Accurate", value: "95%", description: "Detection of non-compliant activities" },
    { label: "Broader Coverage", value: "10,000+", description: "Companies automatically analyzed" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header with gradient accent */}
      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
            How AI Helps Analyze Islamic Compliance in Stocks
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 mb-8">
            Unlocking Halal Investment Opportunities with Technology
          </h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center gap-3 mb-4"></div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Imagine having the power to scan through thousands of companies in seconds—checking if they align with Islamic principles, their financial activities are free of interest-based dealings, and they steer clear of haram industries. Sounds like science fiction? With Artificial Intelligence, it's now a reality.
            </p>
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-gray-800">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>

        <main>
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-300 shadow-sm p-5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    <div className="text-blue-600">
                      {section.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800">{section.title}</h3>
                </div>
                
                <div className="bg-white">
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Content Box */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-blue-200">
                  <CheckCircle className="text-blue-700" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Why This Matters</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                For Muslim investors who want to grow wealth without compromising faith, AI makes Shariah-compliant investing more accessible, faster, and more accurate than ever before. It reduces human error, speeds up screening, and keeps portfolios in line with ethical principles—24/7.
              </p>
              
              
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-purple-200">
                  <PieChart className="text-purple-700" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">The Future of Halal Investing</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Islamic finance meets the future with AI. What was once a manual, complex process is now intelligent, scalable, and personalized. Whether you're a retail investor or managing an Islamic fund, AI is your assistant in navigating the halal investment landscape.
              </p>
              
              
            </div>
          </div>

          <div className="mt-16 flex justify-center">
          <a href="http://shariastocks.in" target="_blank" rel="noopener noreferrer">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 px-8 rounded-full font-medium text-white shadow-md transition-all hover:shadow-lg flex items-center">
              Get Started with AI-Powered Halal Investing
              <ArrowRight size={18} className="ml-2" />
            </button>
            </a>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
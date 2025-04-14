import React, { useState } from 'react';
import { 
  Search, 
  BarChart2, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MousePointer, 
  Globe, 
  TrendingUp, 
  Ban, 
  FileText,
  ChevronDown,
  ChevronUp,
  MessageSquare ,
  Home,
  Book,
  Briefcase, Users,
  Shield,
  List
} from 'lucide-react';

export default function RoleAIBlog() {
  const [activeSection, setActiveSection] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };
  
  const toggleFaq = (faq) => {
    if (activeFaq === faq) {
      setActiveFaq(null);
    } else {
      setActiveFaq(faq);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">The Role of AI in Halal Stock Screening</h1>
              <p className="text-xl mb-6 opacity-90">Can artificial intelligence help Muslims invest more ethically? Absolutely.</p>
              <p className="text-lg mb-6">
                In a world where thousands of stocks exist and markets move faster than ever, manually screening for Halal stocks is time-consuming—and easy to get wrong.
              </p>
              <p className="text-lg">
                Enter AI: a powerful tool that's transforming how we identify Shariah-compliant investments.
              </p>
            </div>
            <div className="md:w-2/5 bg-white rounded-lg p-6 shadow-lg">
              <div className="bg-green-800 rounded-md p-8 text-center">
                <BarChart2 size={64} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold">AI-Powered Halal Investing</h3>
                <p className="mt-2">Discover how technology is revolutionizing Islamic finance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-green-800">Introduction</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-4 text-lg">
              The world of Islamic finance is going through an incredible change. With Halal investing becoming more popular globally, Muslim investors now have the challenge of finding Shariah-compliant investment opportunities efficiently among thousands of stocks.
            </p>
            <p className="mb-4 text-lg">
              This is where artificial intelligence comes in - a groundbreaking technology that is transforming the old way of screening stocks. AI-powered systems can now quickly analyze large amounts of financial data, making sure that investments follow Islamic principles while also taking advantage of market opportunities.
            </p>
            <p className="mb-4 text-lg">
              This technological advancement meets a crucial need in the $2.7 trillion Islamic finance industry. AI algorithms can look at complex financial ratios, business activities, and company behaviors to create a smooth screening process for Muslim investors who are looking for ethical, Shariah-compliant investments.
            </p>
            <p className="text-lg">
              The combination of AI and Halal stock screening represents a new chapter in Islamic finance, giving investors the power to make well-informed decisions faster and more accurately than ever before.
            </p>
          </div>
        </section>

        {/* Understanding Halal Investing */}
        <section className="mb-16">
          <div 
            className="flex justify-between items-center cursor-pointer bg-white rounded-lg shadow-md p-6"
            onClick={() => toggleSection('halal')}
          >
            <h2 className="text-3xl font-bold text-green-800">Understanding Halal Investing</h2>
            {activeSection === 'halal' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
          
          {activeSection === 'halal' && (
            <div className="mt-4 bg-white rounded-lg shadow-md p-6">
              <p className="mb-4 text-lg">
                Halal investing is a way for Muslims to grow their wealth while staying true to their religious beliefs. It follows specific guidelines set by Islamic law (Shariah) to ensure that investments are ethical and do not involve any prohibited activities.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-green-700">Core Principles of Shariah-Compliant Investing:</h3>
              <ul className="list-disc pl-6 mb-6 text-lg">
                <li>Prohibition of riba (interest)</li>
                <li>Ban on excessive uncertainty (gharar)</li>
                <li>Avoidance of gambling (maysir)</li>
                <li>Investment in ethical, socially responsible businesses</li>
              </ul>
              
              <p className="mb-4 text-lg font-semibold">
                The financial screening process examines both qualitative and quantitative aspects of potential investments. Companies must maintain specific financial ratios:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="font-semibold">Debt ratio &lt; 33%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="font-semibold">Cash and interest-bearing securities &lt; 33%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="font-semibold">Interest Income &lt; 5%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="font-semibold">Accounts receivable and cash &lt; 49%</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-green-700">Prohibited Industries (Haram):</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Ban size={20} className="text-red-500 mr-2" />
                  <span>Conventional banking and insurance</span>
                </div>
                <div className="flex items-center">
                  <Ban size={20} className="text-red-500 mr-2" />
                  <span>Alcohol and tobacco</span>
                </div>
                <div className="flex items-center">
                  <Ban size={20} className="text-red-500 mr-2" />
                  <span>Gambling and gaming</span>
                </div>
                <div className="flex items-center">
                  <Ban size={20} className="text-red-500 mr-2" />
                  <span>Adult entertainment</span>
                </div>
                <div className="flex items-center">
                  <Ban size={20} className="text-red-500 mr-2" />
                  <span>Pork-related products</span>
                </div>
                <div className="flex items-center">
                  <Ban size={20} className="text-red-500 mr-2" />
                  <span>Weapons manufacturing</span>
                </div>
                <div className="flex items-center">
                  <Ban size={20} className="text-red-500 mr-2" />
                  <span>Entertainment venues (nightclubs, casinos)</span>
                </div>
              </div>
              
              <p className="text-lg">
                These restrictions create a framework for ethical wealth building that benefits both investors and society. The screening process ensures investments contribute to meaningful economic activities while avoiding harmful or exploitative practices.
              </p>
              <p className="text-lg mt-4">
                Shariah-compliant investments often overlap with socially responsible investing (SRI) and environmental, social, and governance (ESG) criteria, making them attractive to both Muslim and non-Muslim investors seeking ethical investment opportunities.
              </p>
            </div>
          )}
        </section>

        {/* The Growing Importance of AI in Islamic Finance */}
        <section className="mb-16">
          <div 
            className="flex justify-between items-center cursor-pointer bg-white rounded-lg shadow-md p-6"
            onClick={() => toggleSection('importance')}
          >
            <h2 className="text-3xl font-bold text-green-800">The Growing Importance of AI in Islamic Finance</h2>
            {activeSection === 'importance' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
          
          {activeSection === 'importance' && (
            <div className="mt-4 bg-white rounded-lg shadow-md p-6">
              <p className="mb-6 text-lg">
                The Islamic finance industry has experienced significant growth, reaching $2.7 trillion in assets by 2021. Market projections indicate that this value could surpass $3.8 trillion by 2025, driven by increasing demand for Shariah-compliant financial products.
              </p>
              
              <h3 className="text-xl font-semibold mb-4 text-green-700">AI technologies are transforming this expanding market by:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <Search size={32} className="text-green-600 mb-3" />
                  <h4 className="text-lg font-semibold mb-2">Real-time Data Processing</h4>
                  <p>AI systems analyze large amounts of financial data instantly, enabling quick identification of Shariah-compliant investments.</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <AlertTriangle size={32} className="text-green-600 mb-3" />
                  <h4 className="text-lg font-semibold mb-2">Automated Risk Assessment</h4>
                  <p>Machine learning algorithms evaluate investment risks while ensuring compliance with Islamic principles.</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <BarChart2 size={32} className="text-green-600 mb-3" />
                  <h4 className="text-lg font-semibold mb-2">Smart Portfolio Management</h4>
                  <p>AI-powered tools optimize asset allocation within Shariah boundaries.</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-green-700">The Impact of Digital Transformation on Traditional Islamic Finance</h3>
              
              <p className="mb-4 text-lg">Digital transformation has revolutionized traditional Islamic finance practices:</p>
              
              <div className="bg-green-700 text-white p-6 rounded-lg mb-8">
                <p className="text-xl italic">
                  "The integration of AI in Islamic finance has reduced screening time by 75% while improving accuracy rates to 99.9%" - Islamic Finance News Report 2023
                </p>
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-green-700">Benefits of AI Integration in Islamic Finance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                  <span>Reduced human error in compliance checks</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                  <span>Lower operational costs for Islamic financial institutions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                  <span>Enhanced accessibility to Shariah-compliant investments</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                  <span>Improved transparency in financial transactions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                  <span>Faster decision-making processes</span>
                </div>
              </div>
              
              <p className="text-lg">
                This technological evolution has attracted younger Muslim investors, with 68% of millennials preferring digital Islamic banking solutions. Financial institutions investing in AI infrastructure report a 40% increase in their Muslim customer base, highlighting the growing intersection of faith and financial technology.
              </p>
            </div>
          )}
        </section>

        {/* How AI Enhances Halal Stock Screening */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-green-800">How AI Enhances Halal Stock Screening</h2>
          
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer bg-white rounded-lg shadow-md p-6"
              onClick={() => toggleSection('speed')}
            >
              <div className="flex items-center">
                <Clock size={24} className="text-green-600 mr-3" />
                <h3 className="text-2xl font-semibold">1. Speed and Scalability</h3>
              </div>
              {activeSection === 'speed' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
            
            {activeSection === 'speed' && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                <p className="mb-4 text-lg">
                  The difference between manual screening and AI-powered screening is significant. Traditional methods require:
                </p>
                
                <ul className="list-disc pl-6 mb-6 text-lg">
                  <li>Extensive human hours reviewing financial statements</li>
                  <li>Individual analysis of company reports</li>
                  <li>Time-consuming verification of multiple compliance criteria</li>
                  <li>Limited capacity to screen multiple stocks simultaneously</li>
                </ul>
                
                <p className="mb-4 text-lg font-semibold">
                  On the other hand, AI-powered screening systems can:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-md flex items-start">
                    <Clock size={20} className="text-green-600 mr-2 mt-1" />
                    <p>Process thousands of stocks in seconds</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md flex items-start">
                    <BarChart2 size={20} className="text-green-600 mr-2 mt-1" />
                    <p>Analyze complex financial data instantly</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md flex items-start">
                    <Globe size={20} className="text-green-600 mr-2 mt-1" />
                    <p>Monitor multiple markets simultaneously</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md flex items-start">
                    <TrendingUp size={20} className="text-green-600 mr-2 mt-1" />
                    <p>Update screening results in real-time</p>
                  </div>
                </div>
                
                <p className="mb-4 text-lg">
                  This dramatic increase in speed and scalability creates significant advantages for Muslim investors. Time-sensitive investment opportunities no longer slip away during lengthy manual screening processes. Investors can now:
                </p>
                
                <ul className="list-disc pl-6 mb-6 text-lg">
                  <li>React quickly to market changes</li>
                  <li>Capture emerging opportunities</li>
                  <li>Diversify portfolios efficiently</li>
                  <li>Access global markets seamlessly</li>
                </ul>
                
                <p className="text-lg">
                  The speed advantage becomes particularly crucial during market volatility or when new investment opportunities emerge. AI systems continuously monitor and adjust screening results based on real-time financial data, company announcements, market changes, and business activity updates.
                </p>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer bg-white rounded-lg shadow-md p-6"
              onClick={() => toggleSection('accuracy')}
            >
              <div className="flex items-center">
                <CheckCircle size={24} className="text-green-600 mr-3" />
                <h3 className="text-2xl font-semibold">2. Accuracy and Efficiency</h3>
              </div>
              {activeSection === 'accuracy' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
            
            {activeSection === 'accuracy' && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                <p className="mb-6 text-lg">
                  AI algorithms bring unprecedented precision to Shariah-compliant stock screening through sophisticated financial ratio analysis. These intelligent systems evaluate key metrics including:
                </p>
                
                <div className="bg-green-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold mb-3">Key Financial Ratios Analyzed:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">1</div>
                      <div>
                        <p className="font-semibold">Debt-to-Asset Ratio:</p>
                        <p>AI tools instantly calculate and monitor if a company's interest-bearing debt remains below 33% of total assets</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">2</div>
                      <div>
                        <p className="font-semibold">Cash and Interest-Bearing Securities:</p>
                        <p>Automated screening ensures these don't exceed 33% of market capitalization</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">3</div>
                      <div>
                        <p className="font-semibold">Interest Income Ratio:</p>
                        <p>Automated screening ensures these don't exceed 5% of total revenue</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">4</div>
                      <div>
                        <p className="font-semibold">Revenue Analysis:</p>
                        <p>Advanced algorithms detect and flag any income derived from non-compliant sources</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <p className="mb-4 text-lg font-semibold">
                  The AI-driven screening process eliminates human error and bias through:
                </p>
                
                <ul className="list-disc pl-6 mb-6 text-lg">
                  <li>Real-time monitoring of financial statements</li>
                  <li>Automated ratio calculations</li>
                  <li>Pattern recognition to identify hidden non-compliant activities</li>
                  <li>Cross-referencing multiple data sources for verification</li>
                </ul>
                
                <p className="text-lg">
                  This enhanced accuracy helps investors avoid inadvertently investing in non-compliant stocks. AI systems can detect subtle changes in company operations that might affect Shariah compliance, such as new business ventures or shifts in revenue streams. The technology maintains consistent screening criteria across thousands of stocks while adapting to evolving Shariah interpretations and financial regulations.
                </p>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer bg-white rounded-lg shadow-md p-6"
              onClick={() => toggleSection('filtering')}
            >
              <div className="flex items-center">
                <Filter size={24} className="text-green-600 mr-3" />
                <h3 className="text-2xl font-semibold">3. Filtering Haram Industries</h3>
              </div>
              {activeSection === 'filtering' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
            
            {activeSection === 'filtering' && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                <p className="mb-6 text-lg">
                  AI systems are great at finding and filtering out industries that don't follow the rules using advanced classification methods. These systems have large databases that contain information about company activities, subsidiaries, and revenue sources to identify involvement in forbidden sectors.
                </p>
                
                <h4 className="text-xl font-semibold mb-4 text-green-700">Key Industries Automatically Filtered:</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center bg-red-50 p-3 rounded-md">
                    <Ban size={20} className="text-red-500 mr-2" />
                    <span>Alcohol production and distribution</span>
                  </div>
                  <div className="flex items-center bg-red-50 p-3 rounded-md">
                    <Ban size={20} className="text-red-500 mr-2" />
                    <span>Gambling and gaming establishments</span>
                  </div>
                  <div className="flex items-center bg-red-50 p-3 rounded-md">
                    <Ban size={20} className="text-red-500 mr-2" />
                    <span>Interest-based financial services</span>
                  </div>
                  <div className="flex items-center bg-red-50 p-3 rounded-md">
                    <Ban size={20} className="text-red-500 mr-2" />
                    <span>Pork-related products</span>
                  </div>
                  <div className="flex items-center bg-red-50 p-3 rounded-md">
                    <Ban size={20} className="text-red-500 mr-2" />
                    <span>Adult entertainment</span>
                  </div>
                  <div className="flex items-center bg-red-50 p-3 rounded-md">
                    <Ban size={20} className="text-red-500 mr-2" />
                    <span>Tobacco manufacturing</span>
                  </div>
                  <div className="flex items-center bg-red-50 p-3 rounded-md">
                    <Ban size={20} className="text-red-500 mr-2" />
                    <span>Weapons manufacturing</span>
                  </div>
                  <div className="flex items-center bg-red-50 p-3 rounded-md">
                    <Ban size={20} className="text-red-500 mr-2" />
                    <span>Conventional insurance services</span>
                  </div>
                </div>
                
                <p className="text-lg mb-4">
                  The AI screening process goes beyond just looking at industry categories. It uses advanced natural language processing to analyze company reports, financial statements, and business descriptions in order to uncover hidden links to harām activities. This thorough analysis helps identify companies that may seem halal at first glance but actually make a significant portion of their revenue from non-compliant subsidiaries or partnerships.
                </p>
                
                <p className="text-lg">
                  The system also keeps track of changes in business models and sources of income, automatically flagging companies that transition into non-compliant activities. This real-time monitoring ensures that Muslim investors can maintain compliance with Shariah principles in their portfolios without needing constant manual supervision.
                </p>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer bg-white rounded-lg shadow-md p-6"
              onClick={() => toggleSection('news')}
            >
              <div className="flex items-center">
                <FileText size={24} className="text-green-600 mr-3" />
                <h3 className="text-2xl font-semibold">4. Evaluating News</h3>
              </div>
              {activeSection === 'news' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
            
            {activeSection === 'news' && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                <p className="mb-6 text-lg">
                  AI-powered analysis brings a new dimension to Halal stock screening by monitoring real-time news, social media, and corporate announcements. This technology scans thousands of articles per second to detect potential Shariah compliance issues that might not appear in financial statements.
                </p>
                
                <h4 className="text-xl font-semibold mb-4 text-green-700">Key Applications of News Analysis:</h4>
                
                <ul className="list-disc pl-6 mb-6 text-lg">
                  <li>Identifying undisclosed business activities that conflict with Islamic principles</li>
                  <li>Detecting shifts in company practices that could affect Shariah compliance</li>
                  <li>Monitoring corporate governance issues and ethical concerns</li>
                  <li>Tracking company responses to controversies and regulatory changes</li>
                </ul>
                
                <p className="mb-4 text-lg font-semibold">
                  The AI systems assign flag (Haram, Neutral, Uncertain) based on:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-md">
                    <p>Language patterns and context</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <p>Source credibility</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <p>Historical compliance patterns</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <p>Frequency of negative mentions</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border-l-4 border-green-600">
                  <h5 className="font-semibold mb-2">A practical example:</h5>
                  <p>An AI system might flag a previously compliant food company when news reports reveal a new partnership with an alcohol distributor. This real-time detection allows investors to make informed decisions before these changes impact their portfolio's Shariah compliance status.</p>
                </div>
                
                <p className="text-lg">
                  These AI tools also help maintain ongoing compliance by creating alerts when companies drift from Islamic investment principles, enabling proactive portfolio management and risk mitigation.
                </p>
              </div>
            )}
          </div>
          
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer bg-white rounded-lg shadow-md p-6"
              onClick={() => toggleSection('democratization')}
            >
              <div className="flex items-center">
                <Globe size={24} className="text-green-600 mr-3" />
                <h3 className="text-2xl font-semibold">5. The Democratization of Halal Investing</h3>
              </div>
              {activeSection === 'democratization' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
            
            {activeSection === 'democratization' && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                <p className="mb-6 text-lg">
                  The Democratization of halal investing through AI presents several key advantages:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-50 p-5 rounded-lg">
                    <Clock size={28} className="text-green-600 mb-3" />
                    <h4 className="text-lg font-semibold mb-2">24/7 Market Access</h4>
                    <p>Investors can screen and monitor investments across different time zones and markets</p>
                  </div>
                  
                  <div className="bg-green-50 p-5 rounded-lg">
                    <MessageSquare size={28} className="text-green-600 mb-3" />
                    <h4 className="text-lg font-semibold mb-2">Multi-Language Support</h4>
                    <p>AI-powered platforms offer interfaces in Arabic, English, Bahasa, and other languages</p>
                  </div>
                  
                  <div className="bg-green-50 p-5 rounded-lg">
                    <Globe size={28} className="text-green-600 mb-3" />
                    <h4 className="text-lg font-semibold mb-2">Cross-Border Compliance</h4>
                    <p>Automated screening considers varying Shariah interpretations across regions</p>
                  </div>

                  <div className="bg-green-50 p-5 rounded-lg">
                    <FileText size={28} className="text-green-600 mb-3" />
                    <h4 className="text-lg font-semibold mb-2">Mobile-First Solutions</h4>
                    <p>User-friendly apps make halal investing accessible to younger demographics</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-green-700">Recent data shows a significant shift in user demographics:</h3>
                  <ul className="list-disc pl-6 mb-6 text-lg">
                    <li>65% of Muslim millennials prefer digital investment platforms</li>
                    <li>Mobile app usage for halal investing grew 300% in the past two years</li>
                    <li>Women investors increased participation by 45% through digital platforms</li>
                    <li>Investment in ethical, socially responsible businesses</li>
                  </ul>
                  
                  <p className="mb-4 text-lg font-semibold">
                  AI algorithms adapt to local market nuances while maintaining global Shariah standards. This technological advancement has particularly benefited Muslim minority communities in Western countries, where traditional Islamic financial services may be limited.
                  </p>
                  <p className="mb-4 text-lg font-semibold">
                  The integration of AI in halal screening has created a truly global marketplace, connecting investors with opportunities across emerging and developed markets while maintaining strict Shariah compliance standards.

                  </p>
              </div>
            )
          }
          </div>
        </section>
        {/* Conclusion Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-green-800">Conclusion</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-4 text-lg">
              AI technology is leading the way in transforming halal stock screening, ushering in a new era of ethical investing. The combination of artificial intelligence and Islamic finance principles opens up new opportunities for Muslim investors to grow their wealth while staying true to their values.
            </p>
            
            <h3 className="text-xl font-semibold mb-4 text-green-700">The future of halal investing looks promising as AI continues to develop, bringing:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-5 rounded-lg">
                <CheckCircle size={28} className="text-green-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Improved Accuracy</h4>
                <p>Enhanced Shariah compliance verification through advanced algorithms</p>
              </div>
              
              <div className="bg-green-50 p-5 rounded-lg">
                <Clock size={28} className="text-green-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Instant Monitoring</h4>
                <p>Real-time assessment of investment portfolios for continuous compliance</p>
              </div>
              
              <div className="bg-green-50 p-5 rounded-lg">
                <BarChart2 size={28} className="text-green-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Deeper Market Insights</h4>
                <p>Advanced data analysis revealing optimal halal investment opportunities</p>
              </div>
            </div>
            
            <p className="text-lg">
              This technological revolution empowers Muslim investors worldwide to make informed, faith-aligned investment decisions with confidence. As AI systems become more advanced, the gap between ethical principles and modern finance narrows, creating a more inclusive and accessible Islamic financial ecosystem.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-green-800">FAQs (Frequently Asked Questions)</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md">
              <div 
                className="flex justify-between items-center cursor-pointer p-6"
                onClick={() => toggleFaq('faq1')}
              >
                <h3 className="text-xl font-semibold">What is Halal investing and why is it important?</h3>
                {activeFaq === 'faq1' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
              
              {activeFaq === 'faq1' && (
                <div className="p-6 pt-0 border-t border-gray-200">
                  <p className="text-lg">
                    Halal investing refers to investment practices that comply with Shariah law, which emphasizes ethical and moral standards in financial transactions. It is important for Muslim investors who seek to align their financial activities with their religious beliefs by avoiding haram (forbidden) industries such as alcohol, gambling, and pork-related businesses.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <div 
                className="flex justify-between items-center cursor-pointer p-6"
                onClick={() => toggleFaq('faq2')}
              >
                <h3 className="text-xl font-semibold">How does AI enhance the screening process for Halal stocks?</h3>
                {activeFaq === 'faq2' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
              
              {activeFaq === 'faq2' && (
                <div className="p-6 pt-0 border-t border-gray-200">
                  <p className="text-lg">
                    AI enhances the screening process for Halal stocks by providing speed and scalability that manual methods cannot match. It utilizes advanced analytics and algorithmic assessments to analyze financial ratios for Shariah compliance, ensuring a more efficient and accurate identification of halal investment opportunities.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <div 
                className="flex justify-between items-center cursor-pointer p-6"
                onClick={() => toggleFaq('faq3')}
              >
                <h3 className="text-xl font-semibold">What are some haram industries that AI helps filter out in stock screening?</h3>
                {activeFaq === 'faq3' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
              
              {activeFaq === 'faq3' && (
                <div className="p-6 pt-0 border-t border-gray-200">
                  <p className="text-lg">
                    AI helps filter out various haram industries, including those involved in alcohol production, gambling, pork products, and interest-based financial services. By employing ethical filters and industry classification mechanisms, AI ensures that only Shariah-compliant stocks are considered for investment.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <div 
                className="flex justify-between items-center cursor-pointer p-6"
                onClick={() => toggleFaq('faq4')}
              >
                <h3 className="text-xl font-semibold">How does sentiment analysis contribute to Halal stock screening?</h3>
                {activeFaq === 'faq4' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
              
              {activeFaq === 'faq4' && (
                <div className="p-6 pt-0 border-t border-gray-200">
                  <p className="text-lg">
                    Sentiment analysis contributes to Halal stock screening by analyzing news articles and real-time data for ethical implications on investments. This process helps maintain compliance with Shariah principles by assessing public perception and potential ethical concerns surrounding specific companies or sectors.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <div 
                className="flex justify-between items-center cursor-pointer p-6"
                onClick={() => toggleFaq('faq5')}
              >
                <h3 className="text-xl font-semibold">What future innovations in Islamic finance are being driven by AI technology?</h3>
                {activeFaq === 'faq5' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
              
              {activeFaq === 'faq5' && (
                <div className="p-6 pt-0 border-t border-gray-200">
                  <p className="text-lg">
                    Future innovations in Islamic finance driven by AI technology include digital sukuks, which offer benefits over traditional bonds through enhanced liquidity and accessibility, as well as smart contracts that utilize blockchain technology to ensure transparency and compliance with Shariah principles in financial transactions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

            
                

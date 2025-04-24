import React from 'react';
import { 
  AlertTriangle, 
  Ban, 
  Check, 
  DollarSign, 
  FileText, 
  MessageCircle, 
  Percent, 
  PiggyBank, 
  Search, 
  Wine, 
   
  Building, 
  Cigarette, 
  Film, 
  ArrowRight
} from 'lucide-react';
import Footer from '../components/Footer'

export default function HaramStock() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Islamic Finance</span>
          <span className="text-gray-500 text-sm">April 21, 2025</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">What Makes a Stock Haram?</h1>
        <p className="text-xl text-gray-600 mb-6">Understanding Islamic Guidelines for Ethical Investing</p>
        <div className="w-24 h-1 bg-green-600 mb-6"></div>
        <p className="text-lg text-gray-700">
          For Muslim investors, <strong>investing isn't just about profits</strong>—it's about <strong>principles</strong>. 
          Islamic finance is deeply rooted in ethical and moral foundations, which means not every stock on the market 
          is considered <em className="text-green-600">halal</em> (permissible). Some are labeled as <em className="text-red-600">haram</em> (forbidden) 
          due to the nature of their business activities or financial structure.
        </p>
      </header>

      <section className="mb-12">
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
            <Ban className="mr-2 text-red-500" />
            1. Business Activities Involving Haram Sectors
          </h2>
          <p className="text-gray-700 mb-4">
            The <strong>core business</strong> of a company must be in a halal industry. If the company earns a significant 
            portion of its income from haram activities, its stock becomes impermissible to invest in.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Prohibited Sectors Include:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
              <Wine className="text-red-500 mr-3" size={20} />
              <span>Alcohol production, distribution, or sale</span>
            </div>
            <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
              <Search className="text-red-500 mr-3" size={20} />
              <span>Gambling & casinos</span>
            </div>
            <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
              <Building className="text-red-500 mr-3" size={20} />
              <span>Conventional banks or interest-based finance</span>
            </div>
            <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
              <PiggyBank className="text-red-500 mr-3" size={20} />
              <span>Pork and pork-based products</span>
            </div>
            <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
              <Film className="text-red-500 mr-3" size={20} />
              <span>Adult entertainment or media</span>
            </div>
            <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
              <Cigarette className="text-red-500 mr-3" size={20} />
              <span>Tobacco or recreational drugs</span>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-blue-50 rounded-md">
            <Search className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
            <p className="text-blue-800 text-sm">
              <strong>Example:</strong> A company that operates casinos or sells liquor—even if profitable—is not shariah-compliant.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-amber-50 p-6 rounded-lg mb-8">
          <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
            <Percent className="mr-2 text-amber-600" />
            2. High Interest-Based Debt (Riba)
          </h2>
          <p className="text-gray-700 mb-4">
            Islam prohibits <strong>riba (interest)</strong> in all forms. If a company has excessive interest-bearing debt, 
            it fails the Shariah screening.
          </p>
          
          <div className="bg-white p-4 rounded-md shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-amber-700 mb-2">Rule of Thumb:</h3>
            <p className="mb-2">
              If total interest-based debt <strong className="text-lg">33%</strong> of the company's total assets → the stock is <strong className="text-red-600">haram</strong>.
            </p>
          </div>
          
          <p className="text-gray-700 flex items-center">
            <DollarSign className="text-green-600 mr-2" size={18} />
            Many investors use financial data to screen for this using tools or services like ShariaStocks or AAOIFI guidelines.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-red-50 p-6 rounded-lg mb-8">
          <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
            <AlertTriangle className="mr-2 text-red-500" />
            3. Interest or Non-Halal Income
          </h2>
          <p className="text-gray-700 mb-4">
            Even if a company's business is halal, it can still be <strong>non-compliant</strong> if it 
            <strong> earns significant income from interest</strong> or haram investments (like bonds or derivatives).
          </p>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Red Flag:</h3>
            <p>
              If interest or haram income  <strong className="text-lg">5%</strong> of total revenue, the stock is considered <strong className="text-red-600">haram</strong>.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-4">
            <FileText className="mr-2 text-purple-600" />
            How to Check If a Stock Is Halal or Haram?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Check className="text-green-500 mr-2" size={20} />
              Use platforms like <strong>ShariaStocks</strong>, <strong>Zoya</strong>, or <strong>Islamicly</strong>
            </li>
            <li className="flex items-center">
              <Check className="text-green-500 mr-2" size={20} />
              Check official Shariah compliance reports
            </li>
            <li className="flex items-center">
              <Check className="text-green-500 mr-2" size={20} />
              Look at financial ratios and industry classification
            </li>
            <li className="flex items-center">
              <Check className="text-green-500 mr-2" size={20} />
              Consult a qualified Shariah advisor
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Conclusion</h2>
          <p className="text-gray-700 mb-6">
            A stock is considered <strong className="text-red-600">haram</strong> when it involves impermissible business sectors, 
            excessive interest-based income or debt, or speculative and unethical activities. As a Muslim investor, aligning your 
            portfolio with Islamic principles is not just a financial decision—it's a spiritual one.
          </p>
          
          <div className="bg-green-100 p-4 rounded-lg flex items-start">
            <MessageCircle className="text-green-600 mr-3 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="font-semibold text-green-800 mb-2">Need help screening stocks the halal way?</p>
              <a href="https://shariastocks.in" target="_blank" rel="noopener noreferrer" className="text-green-700 font-medium flex items-center hover:text-green-800">
                Visit ShariaStocks for halal investment opportunities
                <ArrowRight className="ml-1" size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

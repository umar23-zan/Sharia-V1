import { useState } from 'react';
import { BookOpen, AlertTriangle, Check, X, Filter, ChevronDown, ChevronUp, ExternalLink, HelpCircle, CheckSquare, AlertCircle, Shield, List, Book, Briefcase, Home, Users } from 'lucide-react';
import halalHaram from '../images/Blog-pics/halal_haram.png';

function HalalHaramStocksBlog() {
  const [expandedSection, setExpandedSection] = useState('introduction');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection('');
    } else {
      setExpandedSection(section);
    }
  };

  const SectionHeader = ({ id, title, icon: Icon }) => (
    <button 
      className="w-full flex justify-between items-center py-5 text-left focus:outline-none group transition-all duration-300" 
      onClick={() => toggleSection(id)}
      aria-expanded={expandedSection === id}
      aria-controls={`content-${id}`}
    >
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300 mr-4">
          <Icon className="h-6 w-6 text-teal-700" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="bg-teal-100 rounded-full p-1 group-hover:bg-teal-200 transition-colors duration-300">
        {expandedSection === id ? 
          <ChevronUp className="h-5 w-5 text-teal-700" /> : 
          <ChevronDown className="h-5 w-5 text-teal-700" />
        }
      </div>
    </button>
  );

  const IslamicImage = ({ src, alt }) => (
    <div className="my-8 max-w-4xl mx-auto">
      <div className="border-8 border-emerald-100 p-1 rounded-lg shadow-lg overflow-hidden">
        <img 
          src={src} 
          alt={alt} 
          className="w-full object-cover rounded-sm transform hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-500 text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Difference Between Halal and Haram Stocks
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            A comprehensive guide to ethical investing according to Islamic principles
          </p>
          <div className="w-24 h-1 bg-white opacity-60 mx-auto"></div>
        </div>
      </header>

      <IslamicImage 
        src={halalHaram} 
        alt="Islamic finance concept" 
      />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Introduction */}
        <section className="mb-8 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <SectionHeader 
            id="introduction" 
            title="Introduction" 
            icon={BookOpen} 
          />
          
          <div 
            id="content-introduction"
            className={`px-6 pb-6 text-gray-700 space-y-4 transition-all duration-500 ${
              expandedSection === 'introduction' ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <p className="leading-relaxed">
              Are you wondering how to make investment choices that align with Islamic principles? 
              You're not alone! Many Muslim investors face the challenge of navigating the stock 
              market while staying true to their faith.
            </p>
            
            <p className="leading-relaxed">
              The difference between <strong className="text-teal-700">Halal</strong> (permissible) and 
              <strong className="text-red-600"> Haram</strong> (forbidden) stocks isn't just about following 
              religious rules - it's also about making ethical investment decisions that benefit both your 
              portfolio and society.
            </p>
            
            <div className="bg-teal-50 border-l-4 border-teal-500 p-5 my-6 rounded-r-lg">
              <h3 className="font-semibold text-teal-800 mb-3">In today's world, ethical investing has become increasingly popular:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 text-lg">🌱</span>
                  <span>Sustainable investments reached $35.3 trillion in 2020</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 text-lg">📈</span>
                  <span>Islamic finance assets are projected to hit $3.69 trillion by 2024</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3 text-lg">💡</span>
                  <span>More investors are looking for investment options that align with their values</span>
                </li>
              </ul>
            </div>
            
            <p className="leading-relaxed font-medium text-gray-800">This guide will help you:</p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span>Understand what makes a stock Halal or Haram</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span>Learn how Islamic-compliant investments are screened</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span>Discover practical tools to identify suitable stocks</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span>Navigate common challenges in ethical investing</span>
              </li>
            </ul>
            
            <p className="leading-relaxed mt-4 text-lg font-medium text-teal-800">
              Are you ready to explore how you can grow your wealth while honoring your religious values? 
              Let's dive into the world of Islamic-compliant investing together! 🚀
            </p>
          </div>
        </section>
        
        {/* Understanding Halal Stocks */}
        <section className="mb-8 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <SectionHeader 
            id="halal-stocks" 
            title="Understanding Halal Stocks" 
            icon={Check} 
          />
          
          <div 
            id="content-halal-stocks"
            className={`px-6 pb-6 text-gray-700 space-y-4 transition-all duration-500 ${
              expandedSection === 'halal-stocks' ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <p className="leading-relaxed">
              Halal stocks are shares in companies that operate according to Islamic principles, making them 
              <a href="https://www.investopedia.com/articles/07/islamic_investing.asp" className="text-teal-600 hover:text-teal-800 font-medium mx-1 hover:underline inline-flex items-center">
                permissible investments
                <ExternalLink className="h-3 w-3 ml-1" />
              </a> 
              for Muslim investors. These stocks come from businesses that create value through ethical means and avoid 
              activities prohibited under 
              <a href="https://en.wikipedia.org/wiki/Islamic_banking_and_finance" className="text-teal-600 hover:text-teal-800 font-medium mx-1 hover:underline inline-flex items-center">
                Shariah law
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>.
            </p>
            
            <div className="bg-green-50 p-5 rounded-lg border border-green-200 my-6">
              <h3 className="font-semibold text-green-800 mb-3 text-lg">Key Characteristics of Halal Stocks:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="p-1 bg-green-200 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-700" />
                  </div>
                  <span>Products and services that benefit society</span>
                </li>
                <li className="flex items-center">
                  <div className="p-1 bg-green-200 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-700" />
                  </div>
                  <span>Transparent business operations</span>
                </li>
                <li className="flex items-center">
                  <div className="p-1 bg-green-200 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-700" />
                  </div>
                  <span>Asset-backed transactions</span>
                </li>
                <li className="flex items-center">
                  <div className="p-1 bg-green-200 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-700" />
                  </div>
                  <span>Limited debt levels</span>
                </li>
                <li className="flex items-center">
                  <div className="p-1 bg-green-200 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-700" />
                  </div>
                  <span>Ethical revenue sources</span>
                </li>
              </ul>
            </div>
            
            <p className="leading-relaxed">
              A company qualifies as Halal when its primary business activities fall within permissible 
              categories under Islamic law. Think of it like a restaurant earning its Halal certification - 
              the business must meet specific standards to be considered compliant.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-4 text-gray-800">Examples of Halal Stock Sectors:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500 hover:shadow-md transition-shadow duration-300">
                <span className="font-medium text-teal-800">Healthcare companies</span> developing life-saving medications
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500 hover:shadow-md transition-shadow duration-300">
                <span className="font-medium text-teal-800">Technology firms</span> creating innovative solutions
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500 hover:shadow-md transition-shadow duration-300">
                <span className="font-medium text-teal-800">Renewable energy providers</span>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500 hover:shadow-md transition-shadow duration-300">
                <span className="font-medium text-teal-800">Halal food producers</span>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500 hover:shadow-md transition-shadow duration-300">
                <span className="font-medium text-teal-800">Ethical retail businesses</span>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500 hover:shadow-md transition-shadow duration-300">
                <span className="font-medium text-teal-800">Infrastructure development companies</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-lg my-6 border-l-4 border-blue-500 shadow-sm">
              <p className="italic">
                <span className="font-semibold text-blue-800">Real-world example:</span> A medical device manufacturer creating equipment for hospitals would typically qualify as a Halal investment. Their business directly contributes to human wellbeing, operates with tangible assets, and provides clear societal benefits.
              </p>
            </div>
            
            <p className="leading-relaxed">
              The growing demand for Shariah-compliant investments has led many companies to adapt their 
              business models to meet Islamic ethical standards. This shift benefits both Muslim investors 
              seeking permissible options and companies looking to tap into the expanding
              <a href="https://www.aljazeera.com/news/2024/3/28/what-is-islamic-and-halal-investment-is-it-on-the-rise" className="text-teal-600 hover:text-teal-800 font-medium mx-1 hover:underline inline-flex items-center">
                Islamic finance market
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>.
            </p>
            
            <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200 mt-6">
              <h3 className="font-semibold text-yellow-800 mb-3 text-lg">Red Flags to Watch:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="p-1 bg-yellow-200 rounded-full mr-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-700" />
                  </div>
                  <span>High interest-bearing debt</span>
                </li>
                <li className="flex items-center">
                  <div className="p-1 bg-yellow-200 rounded-full mr-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-700" />
                  </div>
                  <span>Income from prohibited activities</span>
                </li>
                <li className="flex items-center">
                  <div className="p-1 bg-yellow-200 rounded-full mr-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-700" />
                  </div>
                  <span>Unclear revenue sources</span>
                </li>
                <li className="flex items-center">
                  <div className="p-1 bg-yellow-200 rounded-full mr-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-700" />
                  </div>
                  <span>Excessive speculation</span>
                </li>
                <li className="flex items-center">
                  <div className="p-1 bg-yellow-200 rounded-full mr-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-700" />
                  </div>
                  <span>Non-transparent operations</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Principles and Screening */}
        <section className="mb-12 bg-white rounded-lg shadow-sm p-6 md:p-8">
          <SectionHeader 
            id="principles" 
            title="Principles and Screening Process of Halal Investing" 
            icon={Filter} 
          />
          
          {expandedSection === 'principles' && (
            <div className="mt-4 text-gray-700 space-y-4">
              <p className="leading-relaxed">
                Islamic investing follows strict principles designed to align financial decisions with 
                Shariah law. Let's break down the key screening processes that determine if a stock meets 
                these requirements.
              </p>
              
              <h3 className="font-bold text-lg mt-6 mb-3">Core Principles of Halal Investing</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="bg-teal-100 text-teal-700 p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3 mt-1">1</div>
                  <div>
                    <strong className="text-teal-700">Asset-Backed Nature: </strong>
                    <a href="https://www.imf.org/external/pubs/ft/wp/2015/wp15120.pdf" className="text-teal-600 hover:underline flex items-center">
                      <span>Investments must be tied to real, tangible assets rather than pure speculation</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-teal-100 text-teal-700 p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3 mt-1">2</div>
                  <div>
                    <strong className="text-teal-700">Risk Management: </strong>
                    <a href="https://www.occ.treas.gov/publications-and-resources/publications/comptrollers-handbook/files/asset-securitization/pub-ch-asset-securitization.pdf" className="text-teal-600 hover:underline flex items-center">
                      <span>Avoiding excessive uncertainty (gharar) in financial transactions</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-teal-100 text-teal-700 p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3 mt-1">3</div>
                  <div>
                    <strong className="text-teal-700">Profit-Loss Sharing: </strong>
                    <a href="https://digitalcommons.du.edu/cgi/viewcontent.cgi?article=2365&context=etd" className="text-teal-600 hover:underline flex items-center">
                      <span>Both parties should share the risks and rewards of investments</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-teal-100 text-teal-700 p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3 mt-1">4</div>
                  <div>
                    <strong className="text-teal-700">Ethical Standards: </strong>
                    <span>Activities must benefit society and avoid harm</span>
                  </div>
                </li>
              </ul>
              
              <h3 className="font-bold text-xl mt-8 mb-4 text-teal-800">The Two-Step Screening Process</h3>
              
              <div className="bg-teal-50 p-5 rounded-lg mb-6">
                <h4 className="font-semibold text-lg mb-3 text-teal-700">1. Operational Screening</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-teal-600 mr-2" />
                    <span>Business activities must be permissible under Islamic law</span>
                  </li>
                  <li className="text-red-600 font-medium mt-3 mb-1">Companies should not engage in:</li>
                  <li className="flex items-center ml-5">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span>Interest-based financial services</span>
                  </li>
                  <li className="flex items-center ml-5">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span>Conventional insurance</span>
                  </li>
                  <li className="flex items-center ml-5">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span>Weapons manufacturing</span>
                  </li>
                  <li className="flex items-center ml-5">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span>Entertainment services involving gambling/adult content</span>
                  </li>
                  <li className="flex items-center ml-5">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span>Pork-related products</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-5 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-blue-700">2. Financial Screening</h4>
                
                <h5 className="font-medium mb-2">Debt Ratio Requirements:</h5>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">📊</span>
                    <span>Total interest-bearing debt ≤ 33% of market capitalization</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">📊</span>
                    <span>Cash and interest-bearing securities ≤ 33% of market capitalization</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">📊</span>
                    <span>Accounts receivable ≤ 49% of total assets</span>
                  </li>
                </ul>
                
                <h5 className="font-medium mb-2">Income Screening:</h5>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">📊</span>
                    <span>Non-permissible income must not exceed 5% of total revenue</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-2">📊</span>
                    <span>Interest income should be minimal and purified through charitable giving</span>
                  </li>
                </ul>
              </div>
              
              <p className="mt-6 leading-relaxed">
                These screening criteria help Muslim investors identify stocks that align with Islamic principles while maintaining a balanced investment approach. Professional Shariah boards regularly review and update these standards to address modern financial complexities.
              </p>
            </div>
          )}
        </section>
        
        {/* Understanding Haram Stocks */}
        <section className="mb-12 bg-white rounded-lg shadow-sm p-6 md:p-8">
          <SectionHeader 
            id="haram-stocks" 
            title="Understanding Haram Stocks" 
            icon={AlertTriangle} 
          />
          
          {expandedSection === 'haram-stocks' && (
            <div className="mt-4 text-gray-700 space-y-4">
              <p className="leading-relaxed">
                Haram stocks represent investments in companies engaged in activities prohibited under Islamic law. 
                These stocks fail to meet Shariah compliance standards, making them unsuitable for Muslim investors 
                seeking ethical investment opportunities.
              </p>
              
              <div className="bg-red-50 p-5 rounded-lg mt-6 mb-8">
                <h3 className="font-semibold text-lg text-red-700 mb-3">Common Examples of Haram Stocks:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span>Alcohol manufacturers and distributors</span>
                  </div>
                  <div className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span>Gambling and casino operators</span>
                  </div>
                  <div className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span>Conventional banking institutions</span>
                  </div>
                  <div className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span>Companies involved in adult entertainment</span>
                  </div>
                  <div className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span>Pork-related products and processing</span>
                  </div>
                  <div className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span>Weapons manufacturers</span>
                  </div>
                  <div className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span>Interest-based financial services</span>
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-3">Religious Implications</h3>
              <p className="leading-relaxed mb-4">
                Investing in Haram stocks goes against Islamic principles of ethical wealth creation. 
                The Quran explicitly prohibits Muslims from participating in:
              </p>
              
              <ol className="space-y-3 mb-6">
                <li className="flex">
                  <div className="bg-red-100 text-red-700 p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3">1</div>
                  <div>
                    <a href="https://mpra.ub.uni-muenchen.de/67711/1/MPRA_paper_67711.pdf" className="text-red-600 hover:underline flex items-center font-medium">
                      <span>Riba (interest-based transactions)</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-red-100 text-red-700 p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3">2</div>
                  <div>
                    <a href="http://en.mugtama.com/index.php/islam-and-life/islamic-dealings-transactions/item/42013-why-are-interest-uncertainty-and-gambling-forbidden-in-islam" className="text-red-600 hover:underline flex items-center font-medium">
                      <span>Gharar (excessive uncertainty)</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-red-100 text-red-700 p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3">3</div>
                  <div>
                    <a href="https://www.researchgate.net/publication/299466506_Principles_of_Islamic_Finance_Prohibition_of_Riba_Gharar_and_Maysir" className="text-red-600 hover:underline flex items-center font-medium">
                      <span>Maysir (gambling)</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-red-100 text-red-700 p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3">4</div>
                  <div>
                    <span className="font-medium">Activities harmful to society</span>
                  </div>
                </li>
              </ol>
              
              <h3 className="font-bold text-lg text-gray-800 mb-3">Financial Impact of Unethical Investments</h3>
              <p className="leading-relaxed mb-4">
                Research shows companies involved in controversial activities often face:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <ol className="space-y-2">
                  <li className="flex items-center">
                    <div className="bg-gray-200 text-gray-700 p-1 rounded-full h-6 w-6 flex items-center justify-center mr-3">1</div>
                    <span>Higher regulatory risks</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gray-200 text-gray-700 p-1 rounded-full h-6 w-6 flex items-center justify-center mr-3">2</div>
                    <span>Reputation damage</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gray-200 text-gray-700 p-1 rounded-full h-6 w-6 flex items-center justify-center mr-3">3</div>
                    <span>Consumer boycotts</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gray-200 text-gray-700 p-1 rounded-full h-6 w-6 flex items-center justify-center mr-3">4</div>
                    <span>Legal challenges</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gray-200 text-gray-700 p-1 rounded-full h-6 w-6 flex items-center justify-center mr-3">5</div>
                    <span>Market volatility</span>
                  </li>
                </ol>
              </div>
              
              <p className="mt-4 leading-relaxed">
                Many Haram stocks operate in heavily regulated industries, making them susceptible to sudden policy changes. 
                For example, tobacco companies face increasing restrictions worldwide, impacting their long-term profitability.
              </p>
              
              <h3 className="font-bold text-lg text-gray-800 mt-6 mb-3">Red Flags in Company Analysis</h3>
              <p className="leading-relaxed mb-3">Watch for these warning signs when screening stocks:</p>
              
              <ul className="space-y-2 pl-5 list-disc text-red-600">
                <li><span className="text-gray-700">Revenue from prohibited sources exceeding 5%</span></li>
                <li><span className="text-gray-700">High interest-based debt ratios</span></li>
                <li><span className="text-gray-700">Involvement in multiple non-compliant activities</span></li>
                <li><span className="text-gray-700">Lack of transparency in revenue sources</span></li>
              </ul>
              
              <p className="mt-4 leading-relaxed">
                Understanding these characteristics helps Muslim investors make informed decisions aligned with 
                their religious values while building sustainable investment portfolios.
              </p>
            </div>
          )}
        </section>
        
        {/* Comparison Table */}
        <section className="mb-12 bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="bg-teal-100 p-2 rounded-full mr-3">
              <Filter className="h-5 w-5 text-teal-600" />
            </div>
            Key Differences Between Halal and Haram Stocks
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-teal-50">
                <tr>
                  <th className="py-3 px-4 text-left text-teal-800 font-semibold border-b border-gray-200">Criteria</th>
                  <th className="py-3 px-4 text-left text-teal-800 font-semibold border-b border-gray-200">Halal Stocks</th>
                  <th className="py-3 px-4 text-left text-red-800 font-semibold border-b border-gray-200">Haram Stocks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 border-b border-gray-200 font-medium">Core Business Activities</td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-green-50">
                    Operate in Sharia-compliant industries (e.g., healthcare, technology, etc.)
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-red-50">
                    Involved in non-compliant sectors (e.g., alcohol, gambling, interest-based finance)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-200 font-medium">Debt Level</td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-green-50">
                    Low or manageable interest-based debt (within acceptable thresholds (&lt;33%))
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-red-50">
                  High interest-based debt (within acceptable thresholds (&lt;33%))
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-200 font-medium">Interest Income (Riba)</td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-green-50">
                  Minimal or no income from interest or interest-based instruments (Less than 5% of total revenue)
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-red-50">
                  Significant income from interest or conventional financial activities
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-200 font-medium">Liquidity Ratio</td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-green-50">
                  Follows Islamic guidelines for liquid assets to total assets
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-red-50">
                  May exceed permissible liquidity ratios
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-200 font-medium">Ethical Compliance</td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-green-50">
                  Adheres to Islamic ethical and social principles
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-red-50">
                  Violates Islamic ethics (e.g., harming society, exploiting people)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-200 font-medium">Speculation (Gharar)</td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-green-50">
                  Low levels of speculation and uncertainty
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-red-50">
                  High levels of speculation, gambling, or ambiguous contracts
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-200 font-medium">Shariah Board Approval</td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-green-50">
                  Certified and monitored by Islamic scholars or Shariah boards
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 bg-red-50">
                  Not reviewed or disapproved by Shariah experts
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-relaxed">
        This comparison highlights the fundamental aspects investors should consider when evaluating stocks through an Islamic lens. Each criterion plays a crucial role in determining a stock's compliance with Shariah principles.
        </p>
      </section>
      {/* Visual Checklist Section */}
<section className="mb-12 bg-white rounded-lg shadow-sm p-6 md:p-8">
  <SectionHeader 
    id="visual-checklist" 
    title="Visual Checklist for Shariah Screening Criteria" 
    icon={CheckSquare} 
  />
  
  {expandedSection === 'visual-checklist' && (
    <div className="mt-4 text-gray-700 space-y-4">
      <p className="leading-relaxed">
        Let's break down the essential Shariah screening criteria into a simple visual checklist to help you
        quickly evaluate potential investments.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-teal-50 p-5 rounded-lg border border-teal-100">
          <h3 className="font-bold text-teal-800 mb-3 flex items-center">
            <Filter className="h-5 w-5 text-teal-600 mr-2" />
            Business Activity Screening
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-teal-600 mr-2 mt-1" />
              <span>Primary business must be Halal</span>
            </li>
            <li className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-1" />
              <span>No involvement in alcohol, tobacco, gambling</span>
            </li>
            <li className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-1" />
              <span>No conventional banking or insurance</span>
            </li>
            <li className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-1" />
              <span>No adult entertainment or weapons manufacturing</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center">
            <Filter className="h-5 w-5 text-blue-600 mr-2" />
            Financial Ratios
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-700 mr-2">📊</span>
              <span>Total debt ÷ Market cap &lt; 33%</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-700 mr-2">📊</span>
              <span>Cash and interest-bearing securities ÷ Market cap &lt; 33%</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-700 mr-2">📊</span>
              <span>Accounts receivable ÷ Market cap &lt; 33%</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-700 mr-2">📊</span>
              <span>Non-permissible income &lt; 5% of total revenue</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 mt-6">
        <h3 className="font-bold text-purple-800 mb-3 flex items-center">
          <CheckSquare className="h-5 w-5 text-purple-600 mr-2" />
          Additional Considerations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start">
            <span className="text-purple-700 mr-2">🔍</span>
            <span>Regular monitoring of company activities</span>
          </div>
          <div className="flex items-start">
            <span className="text-purple-700 mr-2">🔄</span>
            <span>Annual review of financial statements</span>
          </div>
          <div className="flex items-start">
            <span className="text-purple-700 mr-2">📈</span>
            <span>Track changes in business operations</span>
          </div>
          <div className="flex items-start">
            <span className="text-purple-700 mr-2">⚖️</span>
            <span>Evaluate new ventures and partnerships</span>
          </div>
        </div>
      </div>
      
      <p className="mt-4 leading-relaxed">
        This checklist serves as a quick reference guide for Muslim investors to screen potential investments. 
        Each criterion plays a vital role in determining the Shariah compliance of a stock, helping you make 
        informed decisions aligned with Islamic principles.
      </p>
    </div>
  )}
</section>

{/* Conclusion Section */}
<section className="mb-12 bg-white rounded-lg shadow-sm p-6 md:p-8">
  <SectionHeader 
    id="conclusion" 
    title="Conclusion: Navigating Your Ethical Investing Journey with Confidence" 
    icon={BookOpen} 
  />
  
  {expandedSection === 'conclusion' && (
    <div className="mt-4 text-gray-700 space-y-4">
      <p className="leading-relaxed">
        Making informed investment decisions aligned with Islamic principles is now easier than ever. 
        Understanding the difference between Halal and Haram stocks empowers you to build a portfolio 
        that reflects your values while pursuing financial growth.
      </p>
      
      <div className="bg-teal-50 p-5 rounded-lg border-l-4 border-teal-500 my-6">
        <h3 className="font-semibold text-teal-800 mb-2">Key Takeaways:</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-teal-600 mr-2 mt-1" />
            <span>Halal investing combines financial wisdom with ethical principles</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-teal-600 mr-2 mt-1" />
            <span>Screening criteria help identify suitable investment opportunities</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-teal-600 mr-2 mt-1" />
            <span>Modern tools make ethical investing accessible to everyone</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-teal-600 mr-2 mt-1" />
            <span>Regular portfolio reviews ensure continued compliance</span>
          </li>
        </ul>
      </div>
      
      <p className="leading-relaxed">
        Tools like <a href="https://shariastocks.in/" className="text-teal-600 hover:underline font-medium">shariastocks.in</a> help 
        screen stocks against Shariah criteria with just a few clicks, making it easier than ever to maintain 
        an ethically compliant investment portfolio.
      </p>
      
      <p className="leading-relaxed">
        Remember that ethical investing is a journey, not a destination. Start with what you understand, 
        continue learning, and make gradual improvements to your investment strategy. Your commitment to 
        halal investing benefits both your financial future and spiritual wellbeing.
      </p>
      
      <div className="bg-blue-50 p-5 rounded-md my-6 border-l-4 border-blue-500">
        <p className="italic">
          <span className="font-semibold">Final thought:</span> The growing popularity of ethical 
          investing is creating more opportunities for Muslims to participate in financial markets 
          without compromising their values. By understanding the distinctions between Halal and 
          Haram stocks, you're well-equipped to make investment decisions that align with both your 
          financial goals and religious principles.
        </p>
      </div>
    </div>
  )}
</section>

{/* FAQs Section */}
<section className="mb-12 bg-white rounded-lg shadow-sm p-6 md:p-8">
  <SectionHeader 
    id="faqs" 
    title="FAQs About Identifying Halal vs Haram Stocks" 
    icon={HelpCircle} 
  />
  
  {expandedSection === 'faqs' && (
    <div className="mt-4 text-gray-700 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Q: How can I check if a stock is Halal?</h3>
        <ul className="space-y-1 pl-5 list-disc">
          <li>Use Islamic stock screening apps</li>
          <li>Consult with Islamic financial advisors</li>
          <li>Review company financial statements against Shariah criteria</li>
          <li>Check Shariah-compliant stock lists from major index providers</li>
        </ul>
      </div>
      
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Q: What if a company has mixed revenue sources?</h3>
        <p className="leading-relaxed">
          Most scholars allow investing in companies with small haram revenue (under 5%) if their 
          main business is halal. The impure income portion should be purified through charitable giving.
        </p>
      </div>
      
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Q: Do I need to sell my non-compliant stocks immediately?</h3>
        <p className="leading-relaxed">
          Islamic scholars recommend transitioning gradually to maintain financial stability. 
          Create a plan to shift your portfolio to halal alternatives over time.
        </p>
      </div>
      
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Q: Can I invest in ESG funds?</h3>
        <p className="leading-relaxed">
          Environmental, Social, and Governance (ESG) funds align with many Islamic principles 
          but still need Shariah screening for full compliance. Not all ESG funds meet Islamic 
          financial requirements, particularly regarding interest-based income.
        </p>
      </div>
      
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Q: How often should I review my portfolio for Shariah compliance?</h3>
        <p className="leading-relaxed">
          Experts recommend quarterly reviews at minimum, with a comprehensive annual review. 
          Companies can change their business activities or debt structure, potentially affecting 
          their Shariah compliance status.
        </p>
      </div>
      
      <div className="bg-yellow-50 p-5 rounded-lg mt-6">
        <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          Remember:
        </h3>
        <p className="italic">
          Ethical investing is a journey. Start with what you understand, keep learning, and make 
          gradual improvements to your investment strategy. Your commitment to halal investing 
          benefits both your financial future and spiritual wellbeing.
        </p>
      </div>
    </div>
  )}
</section>
    </main>
    </div>
    );
  }
  
  export default HalalHaramStocksBlog;

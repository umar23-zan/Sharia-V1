import { useState } from 'react';
import { ChevronDown, ChevronUp, Book, DollarSign, Filter, Shield, Users, HelpCircle, Share2, ArrowRight, Check, Home } from 'lucide-react';
import understandHaram from '../images/Blog-pics/understand_haram.jpg';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'

function UnderstandingHaram() {
  const [activeSection, setActiveSection] = useState('section1'); // Start with first section open
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection('');
    } else {
      setActiveSection(section);
    }
  };

  const IslamicImage = ({ src, alt, caption }) => {
    return (
      <div className="my-8 max-w-4xl mx-auto">
        <div className="border-8 border-emerald-100 p-1 shadow-lg rounded-md overflow-hidden">
          <div className="max-h-64 md:max-h-80 lg:max-h-96">
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          {caption && (
            <p className="text-center text-gray-600 italic mt-2">{caption}</p>
          )}
        </div>
      </div>
    );
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header Banner with visual enhancement */}
      <header className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-islamic"></div>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Understanding <span className="text-emerald-300">Haram</span> Stocks</h1>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            Navigate the stock market with confidence while adhering to Islamic principles
          </p>
          
        </div>
      </header>

     

      <IslamicImage 
        src={understandHaram}
        alt="Islamic finance concept" 
        caption="Islamic Finance: Balancing Faith and Investments"
      />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg leading-relaxed mb-6">
              For Muslim investors, navigating the stock market requires more than
              just financial analysis - it demands a deep understanding of Islamic
              principles and ethical considerations. The concept of <em>halal</em> investing
              goes beyond profits, focusing on the moral and spiritual aspects of
              wealth creation.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Stock market participation has become essential for building long-term
              wealth, but as Muslim investors, we must ensure our investments align
              with Shariah principles. This means carefully screening stocks to avoid
              <em> haram</em> (prohibited) investments that conflict with Islamic values.
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded-r-md">
              <h3 className="font-bold text-xl mb-4 text-green-800">Why is this understanding crucial?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>It helps protect your wealth from non-compliant investments</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>It ensures your financial growth aligns with your faith</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>It promotes ethical business practices globally</span>
                </li>
              </ul>
            </div>

            <p className="text-lg leading-relaxed mb-4">
              Islamic stock screening involves two main components:
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 my-6">
              <div className="bg-green-50 rounded-md p-6 flex-1">
                <div className="flex items-center mb-3">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</div>
                  <h4 className="font-bold text-lg">Sector-based filtering</h4>
                </div>
                <p>Avoiding companies involved in prohibited business activities</p>
              </div>
              
              <div className="bg-green-50 rounded-md p-6 flex-1">
                <div className="flex items-center mb-3">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                  <h4 className="font-bold text-lg">Financial ratio analysis</h4>
                </div>
                <p>Evaluating debt levels and interest-related income</p>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed">
              This guide will help you understand what makes a stock haram and how to
              make informed investment decisions that honor both your financial goals
              and religious values.
            </p>
          </div>
        </section>

        {/* Collapsible Sections with improved styling */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <button 
              className={`w-full flex justify-between items-center p-6 text-left ${activeSection === 'section1' ? 'bg-green-50' : ''}`}
              onClick={() => toggleSection('section1')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Filter className="h-6 w-6 text-green-700" />
                </div>
                <h2 className="text-2xl font-bold">What Makes a Stock Haram?</h2>
              </div>
              {activeSection === 'section1' ? <ChevronUp className="h-6 w-6 text-green-600" /> : <ChevronDown className="h-6 w-6" />}
            </button>
            
            {activeSection === 'section1' && (
              <div className="p-6 pt-0 animate-fadeIn">
                <p className="mb-6 text-lg">
                  A stock becomes haram when a company's business activities or financial structure conflicts with Islamic principles. 
                  Let's break down these criteria into two main categories: sector-based filters and financial filters.
                </p>
                
                <h3 className="text-xl font-bold mb-4 text-green-800">Prohibited Business Activities</h3>
                <p className="mb-4">The following core business activities automatically classify a stock as haram:</p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold mb-2 text-red-800">Alcohol</h4>
                    <p className="text-gray-700">Companies involved in production, distribution, or sale</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold mb-2 text-red-800">Gambling</h4>
                    <p className="text-gray-700">Casino operations, betting platforms, lottery services</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold mb-2 text-red-800">Pork-related products</h4>
                    <p className="text-gray-700">Processing, packaging, distribution</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold mb-2 text-red-800">Adult entertainment</h4>
                    <p className="text-gray-700">Production or distribution</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold mb-2 text-red-800">Conventional banking</h4>
                    <p className="text-gray-700">Traditional banking, insurance companies</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold mb-2 text-red-800">Weapons</h4>
                    <p className="text-gray-700">Manufacturing for non-defensive purposes</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold mb-2 text-red-800">Tobacco</h4>
                    <p className="text-gray-700">Production and distribution</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-green-800">Financial Screening Criteria</h3>
                <p className="mb-3">A company must pass these financial thresholds to be considered Shariah-compliant:</p>
                
                <div className="overflow-x-auto mb-6 rounded-lg shadow">
                  <table className="min-w-full bg-white">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="py-4 px-6 text-left font-bold text-green-800">Criteria</th>
                        <th className="py-4 px-6 text-left font-bold text-green-800">Threshold</th>
                        <th className="py-4 px-6 text-left font-bold text-green-800">Significance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">Debt to Assets</td>
                        <td className="py-4 px-6">&lt; 33%</td>
                        <td className="py-4 px-6">Limits interest-bearing debt</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">Cash and Interest Securities to Assets</td>
                        <td className="py-4 px-6">&lt; 33%</td>
                        <td className="py-4 px-6">Limits interest-earning assets</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">Interest Income to Revenue</td>
                        <td className="py-4 px-6">&lt; 5%</td>
                        <td className="py-4 px-6">Restricts income from interest</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">Receivables to Assets</td>
                        <td className="py-4 px-6">&lt; 49%</td>
                        <td className="py-4 px-6">Ensures asset backing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400 my-6">
                  <h4 className="font-bold text-blue-800 mb-2">Practical Example</h4>
                  <p>
                    If a technology company generates 3% of its revenue from interest income while meeting other criteria, 
                    it might still qualify as Shariah-compliant. However, if interest income reaches 6%, 
                    the stock becomes haram regardless of other factors.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Section 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <button 
              className={`w-full flex justify-between items-center p-6 text-left ${activeSection === 'section2' ? 'bg-green-50' : ''}`}
              onClick={() => toggleSection('section2')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-green-700" />
                </div>
                <h2 className="text-2xl font-bold">Interest (Riba) Consideration</h2>
              </div>
              {activeSection === 'section2' ? <ChevronUp className="h-6 w-6 text-green-600" /> : <ChevronDown className="h-6 w-6" />}
            </button>
            
            {activeSection === 'section2' && (
              <div className="p-6 pt-0 animate-fadeIn">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-6 rounded-r-md">
                  <p className="italic text-amber-800 text-lg">The prohibition of interest stems from the Quranic verse</p>
                </div>
                
                <p className="mb-6 text-lg">This fundamental principle affects stock screening in two critical ways:</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-all">
                    <h4 className="font-bold text-xl mb-3 text-green-800">Direct Impact</h4>
                    <p>Companies primarily dealing with interest-based transactions (banks, credit providers) are excluded from halal portfolios</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-all">
                    <h4 className="font-bold text-xl mb-3 text-green-800">Indirect Impact</h4>
                    <p>Companies must maintain low debt levels and minimal interest income to remain compliant with Islamic principles</p>
                  </div>
                </div>
                
                <p className="text-lg mb-6">
                  Companies like Microsoft or Apple undergo regular screening to ensure
                  their interest-bearing debt and non-permissible income stay within
                  acceptable limits.
                </p>
                
                <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-lg">
                    These filters create a framework for identifying truly Shariah-compliant
                    investments. The screening process requires continuous monitoring as
                    companies' business activities and financial structures change over time.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Section 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <button 
              className={`w-full flex justify-between items-center p-6 text-left ${activeSection === 'section3' ? 'bg-green-50' : ''}`}
              onClick={() => toggleSection('section3')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-green-700" />
                </div>
                <h2 className="text-2xl font-bold">Other Factors to Consider in Halal Investing</h2>
              </div>
              {activeSection === 'section3' ? <ChevronUp className="h-6 w-6 text-green-600" /> : <ChevronDown className="h-6 w-6" />}
            </button>
            
            {activeSection === 'section3' && (
              <div className="p-6 pt-0 animate-fadeIn">
                <p className="mb-6 text-lg">
                  Islamic investing extends beyond avoiding haram sectors and financial ratios. 
                  Asset-backed investments form a crucial foundation of Shariah-compliant finance, 
                  ensuring investments are tied to tangible assets rather than speculative activities.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-green-800 flex items-center">
                      <div className="bg-green-100 p-1 rounded-full mr-2">
                        <Book className="h-5 w-5 text-green-700" />
                      </div>
                      Asset-Backed Investment Options
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Real estate investments through REITs",
                        "Commodity trading through physical ownership",
                        "Infrastructure project investments",
                        "Sukuk (Islamic bonds) backed by real assets",
                        "Manufacturing companies with substantial physical assets"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-green-800 flex items-center">
                      <div className="bg-green-100 p-1 rounded-full mr-2">
                        <Users className="h-5 w-5 text-green-700" />
                      </div>
                      Ethical Governance Standards
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Transparent financial reporting",
                        "Fair treatment of employees",
                        "Ethical business practices",
                        "Clear ownership structures",
                        "Regular shariah compliance audits"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <hr className="my-8 border-gray-200" />
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-green-800">Corporate Social Responsibility</h3>
                    <p className="mb-4">A company's social impact plays a vital role in determining its halal status:</p>
                    <ul className="space-y-2">
                      {[
                        "Environmental stewardship",
                        "Community development initiatives",
                        "Fair labor practices",
                        "Sustainable resource management",
                        "Ethical supply chain practices"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                            {index + 1}
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-green-800">Sustainable Growth Focus</h3>
                    <p className="mb-4">Islamic finance emphasizes long-term sustainable growth:</p>
                    <ul className="space-y-2">
                      {[
                        "Stable business models",
                        "Reinvestment in core operations",
                        "Research and development",
                        "Employee development programs",
                        "Market expansion through ethical means"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                            {index + 1}
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg shadow-inner border border-green-100">
                  <h3 className="text-xl font-bold mb-4 text-green-800">ShariaStock Comprehensive Analysis</h3>
                  <p className="mb-4">
                    The ShariaStock app considers these additional factors when screening stocks, 
                    providing a comprehensive analysis beyond basic sector and financial filters. 
                    This multi-layered approach ensures investments align with both the letter and 
                    spirit of Islamic finance principles.
                  </p>
                  
                  <p className="mb-6">
                    Start your halal investing journey today with confidence. The ShariaStock app 
                    provides the tools and guidance you need to navigate the world of ethical 
                    investing while maintaining Shariah compliance.
                  </p>
                  
                  <div className="flex justify-center">
                    <a href="https://shariastocks.in/" 
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    >
                      Explore ShariaStocks App
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Section 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <button 
              className={`w-full flex justify-between items-center p-6 text-left ${activeSection === 'section4' ? 'bg-green-50' : ''}`}
              onClick={() => toggleSection('section4')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <HelpCircle className="h-6 w-6 text-green-700" />
                </div>
                <h2 className="text-2xl font-bold">FAQs (Frequently Asked Questions)</h2>
              </div>
              {activeSection === 'section4' ? <ChevronUp className="h-6 w-6 text-green-600" /> : <ChevronDown className="h-6 w-6" />}
            </button>
            
            {activeSection === 'section4' && (
              <div className="p-6 pt-0 animate-fadeIn">
                <div className="space-y-8">
                  {[
                    {
                      question: "What defines a stock as haram in Islamic finance?",
                      answer: "In Islamic finance, a stock is considered haram if it is associated with prohibited sectors such as alcohol production, gambling, conventional financial services, and any income derived from interest. Understanding these criteria is essential for Muslim investors aiming to align their investments with Shariah principles."
                    },
                    {
                      question: "Which sectors are strictly prohibited in halal investing?",
                      answer: "The key sectors that are strictly prohibited in halal investing include alcohol production, gambling, conventional banking and financial services, and any businesses that generate income through interest or non-permissible activities."
                    },
                    {
                      question: "What financial criteria should be considered when screening stocks for halal compliance?",
                      answer: "When screening stocks for halal compliance, investors should consider financial criteria such as the debt-to-equity ratio and the nature of the company's income. Stocks with excessive debt or income derived from non-permissible sources are classified as haram."
                    },
                    {
                      question: "Why is ethical governance important in halal investing?",
                      answer: "Ethical governance plays a crucial role in halal investing as it ensures that companies adhere to moral and ethical standards. This includes corporate social responsibility and sustainable growth practices, which are vital for qualifying stocks as halal."
                    },
                    {
                      question: "How does zakat influence investment decisions for Muslim investors?",
                      answer: "Zakat obligations influence investment decisions by requiring Muslim investors to understand which of their assets are zakatable. This consideration impacts their overall investment strategy and encourages them to pursue ethical opportunities aligned with Shariah principles."
                    },
                    {
                      question: "What types of investments are considered compliant with halal standards?",
                      answer: "Compliant investment types in halal finance include asset-based investments such as real estate and sukuk (Islamic bonds). These investments emphasize tangible assets and align with the ethical considerations of Islamic finance."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                      <h3 className="text-xl font-bold mb-3 text-green-800">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        

      </main>

      {/* CTA Section with improved design */}
      <section className="bg-gradient-to-r from-green-900 to-green-700 text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-islamic"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Halal Investment Journey Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of Muslim investors who are growing their wealth while staying true to their values
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://shariastocks.in/" 
              className="bg-white text-green-800 font-bold py-3 px-8 rounded-full hover:bg-green-100 transition-all flex items-center"
            >
              Start with ShariaStocks Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a 
              href="https://shariastocks.in/blog-catalogue" 
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all border-2 border-white flex items-center"
            >
              Explore More Resources
              <Book className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>


      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
        aria-label="Back to top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      <Footer />
    </div>
  );
}

export default UnderstandingHaram;
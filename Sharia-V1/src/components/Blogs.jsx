import { useState } from 'react';
import { ChevronDown, ChevronUp, Book, DollarSign, Filter, Shield, Users, HelpCircle } from 'lucide-react';

function Blogs() {
  const [activeSection, setActiveSection] = useState('');
  
  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection('');
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-green-900 to-green-700 text-white py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Understanding the Haram Stocks</h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            Navigate the stock market with confidence while adhering to Islamic principles
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
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

            <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
              <h3 className="font-bold text-xl mb-3">Why is this understanding crucial?</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>It helps protect your wealth from non-compliant investments</li>
                <li>It ensures your financial growth aligns with your faith</li>
                <li>It promotes ethical business practices globally</li>
              </ul>
            </div>

            <p className="text-lg leading-relaxed">
              Islamic stock screening involves two main components:
            </p>
            <ol className="list-decimal pl-8 my-4 space-y-2">
              <li className="text-lg">Sector-based filtering (business activities)</li>
              <li className="text-lg">Financial ratio analysis (debt and interest levels)</li>
            </ol>
            
            <p className="text-lg leading-relaxed">
              This guide will help you understand what makes a stock haram and how to
              make informed investment decisions that honor both your financial goals
              and religious values.
            </p>
          </div>
        </section>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Section 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="w-full flex justify-between items-center p-6 text-left" 
              onClick={() => toggleSection('section1')}
            >
              <div className="flex items-center">
                <Filter className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold">What Makes a Stock Haram?</h2>
              </div>
              {activeSection === 'section1' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </button>
            
            {activeSection === 'section1' && (
              <div className="p-6 pt-0">
                <p className="mb-6">
                  A stock becomes haram when a company's business activities or financial structure conflicts with Islamic principles. 
                  Let's break down these criteria into two main categories: sector-based filters and financial filters.
                </p>
                
                <h3 className="text-xl font-bold mb-4">Prohibited Business Activities</h3>
                <p className="mb-3">The following core business activities automatically classify a stock as haram:</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="font-bold">Alcohol</h4>
                    <p>Companies involved in production, distribution, or sale</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="font-bold">Gambling</h4>
                    <p>Casino operations, betting platforms, lottery services</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="font-bold">Pork-related products</h4>
                    <p>Processing, packaging, distribution</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="font-bold">Adult entertainment</h4>
                    <p>Production or distribution</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="font-bold">Conventional financial services</h4>
                    <p>Traditional banking, insurance companies</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="font-bold">Weapons</h4>
                    <p>Manufacturing for non-defensive purposes</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="font-bold">Tobacco</h4>
                    <p>Production and distribution</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4">Financial Screening Criteria</h3>
                <p className="mb-3">A company must pass these financial thresholds to be considered Shariah-compliant:</p>
                
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full bg-white">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="py-3 px-4 text-left">Criteria</th>
                        <th className="py-3 px-4 text-left">Threshold</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 px-4">Debt to Assets</td>
                        <td className="py-3 px-4">&lt; 33%</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Cash and Interest Securities to Assets</td>
                        <td className="py-3 px-4">&lt; 33%</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Interest Income to Revenue</td>
                        <td className="py-3 px-4">&lt; 5%</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Receivables to Assets</td>
                        <td className="py-3 px-4">&lt; 49%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p>
                  A practical example: If a technology company generates 3% of its revenue
                  from interest income while meeting other criteria, it might still
                  qualify as Shariah-compliant. However, if interest income reaches 6%,
                  the stock becomes haram.
                </p>
              </div>
            )}
          </div>
          
          {/* Section 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="w-full flex justify-between items-center p-6 text-left" 
              onClick={() => toggleSection('section2')}
            >
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold">Interest (Riba) Consideration</h2>
              </div>
              {activeSection === 'section2' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </button>
            
            {activeSection === 'section2' && (
              <div className="p-6 pt-0">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                  <p className="italic">The prohibition of interest stems from the Quranic verse</p>
                </div>
                
                <p className="mb-4">This principle affects stock screening in two ways:</p>
                
                <ul className="list-disc pl-8 mb-6 space-y-3">
                  <li className="font-semibold">Direct Impact: <span className="font-normal">Companies primarily dealing with interest-based transactions (banks, credit providers) are excluded</span></li>
                  <li className="font-semibold">Indirect Impact: <span className="font-normal">Companies must maintain low debt levels and minimal interest income</span></li>
                </ul>
                
                <p>
                  Companies like Microsoft or Apple undergo regular screening to ensure
                  their interest-bearing debt and non-permissible income stay within
                  acceptable limits.
                </p>
                
                <div className="mt-6 p-4 bg-green-50 rounded-md">
                  <p>
                    These filters create a framework for identifying truly Shariah-compliant
                    investments. The screening process requires continuous monitoring as
                    companies' business activities and financial structures change over time.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Section 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="w-full flex justify-between items-center p-6 text-left" 
              onClick={() => toggleSection('section3')}
            >
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold">Other Factors to Consider in Halal Investing</h2>
              </div>
              {activeSection === 'section3' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </button>
            
            {activeSection === 'section3' && (
              <div className="p-6 pt-0">
                <p className="mb-6">
                  Islamic investing extends beyond avoiding haram sectors and financial ratios. 
                  Asset-backed investments form a crucial foundation of Shariah-compliant finance, 
                  ensuring investments are tied to tangible assets rather than speculative activities.
                </p>
                
                <h3 className="text-xl font-bold mb-4">Asset-Backed Investment Options:</h3>
                <ul className="list-disc pl-8 mb-6 space-y-2">
                  <li>Real estate investments through REITs</li>
                  <li>Commodity trading through physical ownership</li>
                  <li>Infrastructure project investments</li>
                  <li>Sukuk (Islamic bonds) backed by real assets</li>
                  <li>Manufacturing companies with substantial physical assets</li>
                </ul>
                
                <p className="mb-6">
                  The concept of asset backing provides stability and reduces gharar (uncertainty) 
                  in investments. When a company's value is primarily derived from physical assets, 
                  it aligns with Islamic principles of real economic activity and value creation.
                </p>
                
                <h3 className="text-xl font-bold mb-4">Ethical Governance Standards:</h3>
                <p className="mb-2">Islamic investing demands strong corporate governance practices:</p>
                <ol className="list-decimal pl-8 mb-6 space-y-2">
                  <li>Transparent financial reporting</li>
                  <li>Fair treatment of employees</li>
                  <li>Ethical business practices</li>
                  <li>Clear ownership structures</li>
                  <li>Regular shariah compliance audits</li>
                </ol>
                
                <h3 className="text-xl font-bold mb-4">Corporate Social Responsibility (CSR):</h3>
                <p className="mb-2">A company's social impact plays a vital role in determining its halal status:</p>
                <ol className="list-decimal pl-8 mb-6 space-y-2">
                  <li>Environmental stewardship</li>
                  <li>Community development initiatives</li>
                  <li>Fair labor practices</li>
                  <li>Sustainable resource management</li>
                  <li>Ethical supply chain practices</li>
                </ol>
                
                <p className="mb-6">
                  Companies demonstrating strong CSR practices often align with Islamic principles 
                  of social justice and community welfare. This alignment makes them potentially 
                  suitable for halal portfolios.
                </p>
                
                <h3 className="text-xl font-bold mb-4">Sustainable Growth Focus</h3>
                <p className="mb-2">Islamic finance emphasizes long-term sustainable growth:</p>
                <ol className="list-decimal pl-8 mb-6 space-y-2">
                  <li>Stable business models</li>
                  <li>Reinvestment in core operations</li>
                  <li>Research and development</li>
                  <li>Employee development programs</li>
                  <li>Market expansion through ethical means</li>
                </ol>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <p className="mb-4">
                    The ShariaStock app considers these additional factors when screening stocks, 
                    providing a comprehensive analysis beyond basic sector and financial filters. 
                    This multi-layered approach ensures investments align with both the letter and 
                    spirit of Islamic finance principles.
                  </p>
                  
                  <p className="mb-4">
                    Start your halal investing journey today with confidence. The ShariaStock app 
                    provides the tools and guidance you need to navigate the world of ethical 
                    investing while maintaining Shariah compliance.
                  </p>
                  
                  <div className="mt-4">
                    <p className="font-bold text-lg">
                      Ready to begin? <a href="https://shariastocks.in/" className="text-green-600 underline">
                        Checkout the ShariaStocks
                      </a> application and join thousands of Muslim investors building wealth the halal way 🌟
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Section 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="w-full flex justify-between items-center p-6 text-left" 
              onClick={() => toggleSection('section4')}
            >
              <div className="flex items-center">
                <HelpCircle className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold">FAQs (Frequently Asked Questions)</h2>
              </div>
              {activeSection === 'section4' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </button>
            
            {activeSection === 'section4' && (
              <div className="p-6 pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">What defines a stock as haram in Islamic finance?</h3>
                    <p>
                      In Islamic finance, a stock is considered haram if it is associated with prohibited sectors 
                      such as alcohol production, gambling, conventional financial services, and any income derived 
                      from interest. Understanding these criteria is essential for Muslim investors aiming to align 
                      their investments with Shariah principles.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">Which sectors are strictly prohibited in halal investing?</h3>
                    <p>
                      The key sectors that are strictly prohibited in halal investing include alcohol production, 
                      gambling, conventional banking and financial services, and any businesses that generate income 
                      through interest or non-permissible activities.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">What financial criteria should be considered when screening stocks for halal compliance?</h3>
                    <p>
                      When screening stocks for halal compliance, investors should consider financial criteria such as 
                      the debt-to-equity ratio and the nature of the company's income. Stocks with excessive debt or 
                      income derived from non-permissible sources are classified as haram.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">Why is ethical governance important in halal investing?</h3>
                    <p>
                      Ethical governance plays a crucial role in halal investing as it ensures that companies adhere to 
                      moral and ethical standards. This includes corporate social responsibility and sustainable growth 
                      practices, which are vital for qualifying stocks as halal.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">How does zakat influence investment decisions for Muslim investors?</h3>
                    <p>
                      Zakat obligations influence investment decisions by requiring Muslim investors to understand which 
                      of their assets are zakatable. This consideration impacts their overall investment strategy and 
                      encourages them to pursue ethical opportunities aligned with Shariah principles.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">What types of investments are considered compliant with halal standards?</h3>
                    <p>
                      Compliant investment types in halal finance include asset-based investments such as real estate and 
                      sukuk (Islamic bonds). These investments emphasize tangible assets and align with the ethical 
                      considerations of Islamic finance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-green-800 text-white py-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Begin Your Halal Investment Journey Today</h2>
          <p className="text-xl mb-8">
            Join thousands of Muslim investors who are growing their wealth while staying true to their values
          </p>
          <a 
            href="https://shariastocks.in/" 
            className="inline-block bg-white text-green-800 font-bold py-3 px-8 rounded-full hover:bg-green-100 transition duration-300"
          >
            Start with ShariaStocks Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">ShariaStocks</h3>
              <p className="text-gray-300">
                Empowering Muslim investors with the tools to make halal investment decisions
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  Twitter
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-gray-400 text-sm">
            <p>&copy; 2025 Zansphere Private Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Blogs;
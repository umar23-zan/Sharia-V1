import React, { useState } from "react";
import { Book, Briefcase, CheckCircle, ChevronDown, ChevronUp, Clock, Coffee, DollarSign, FileText, Filter, Globe, HelpCircle, Home, Info, List, Pen, Search, Shield, Star, Users, XCircle } from "lucide-react";

function HalalStockblog() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is a halal stock?",
      answer: "A halal stock is a share in a company that operates in accordance with Shariah law, meaning it avoids industries considered haram (forbidden) such as alcohol, gambling, and interest-based financial services. Halal stocks are an essential part of faith-conscious investing and ethical wealth generation."
    },
    {
      question: "Why is halal investing important?",
      answer: "Halal investing aligns with Islamic values and promotes ethical investing practices. It allows individuals to generate wealth while adhering to their faith, supporting social justice, and enhancing personal and community welfare through responsible investment choices."
    },
    {
      question: "How can I identify Shariah-compliant stocks?",
      answer: "To identify Shariah-compliant stocks, investors should apply key criteria including business activity filters that exclude haram industries, and financial ratio screening to ensure acceptable levels of debt and income sources. This helps ensure investments align with Islamic principles."
    },
    {
      question: "What are some examples of halal vs. haram companies?",
      answer: "Examples of halal companies include those in technology or healthcare sectors, while haram companies typically operate in industries like casinos or alcohol production. Understanding the business activities and financial profiles of these companies is crucial for ethical investing."
    },
    {
      question: "What methods can I use to find halal stocks?",
      answer: "Investors can find halal stocks through various methods including manual research methodologies for due diligence or by leveraging technology through specialized halal investment platforms and screening tools that assist in identifying compliant investments."
    },
    {
      question: "Can I invest in ETFs with halal stocks?",
      answer: "Yes, you can invest in ETFs (Exchange-Traded Funds) that focus on halal stocks. However, it's essential to ensure that the ETF itself adheres to Shariah compliance by reviewing its holdings and investment strategy to avoid any haram sources."
    }
  ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-16 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What Is a Halal Stock?</h1>
          <p className="text-xl md:text-2xl mb-6 italic">Is it really possible to invest in the stock market without compromising your faith?</p>
          <p className="text-lg mb-6">
            For Muslim investors—or anyone curious about ethical investing—the concept of Halal stocks offers a clear path forward. But what <em>exactly</em> makes a stock Halal? And how can you tell the difference?
          </p>
          <p className="text-lg">
            This beginner-friendly guide will walk you through everything you need to know about Shariah-compliant investing—from what it means, to how to find Halal stocks, and why it matters.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Info className="text-emerald-600 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">Introduction</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p>
              You've worked hard to save money and you're ready to invest, but you want your financial decisions to align with your Islamic faith. You're not alone in this journey.
            </p>
            <p>
              The world of halal investing has seen remarkable growth, with the global Islamic finance industry now worth over $2 trillion. This surge reflects a powerful shift as more Muslims seek investment opportunities that respect their religious values while building wealth.
            </p>
            <p>
              Faith-conscious investing goes beyond personal financial gains. When you choose halal stocks, you're supporting businesses that align with Islamic principles, promoting ethical practices, and contributing to a more sustainable economy. It's about creating positive change while securing your financial future.
            </p>
            <p>
              Think of halal investing as a compass that guides your money toward businesses that benefit society. These companies avoid harmful products and practices, maintain ethical financial standards, and operate with transparency - principles that resonate with both Muslim and non-Muslim investors seeking ethical investment options.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Shield className="text-emerald-600 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">Understanding Halal Stocks</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p>
              A halal stock represents shares in a company that conducts its business in accordance with Islamic principles. Think of it as buying a piece of a business that operates within the guidelines of Shariah law -- much like choosing food with a halal certification.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-4">Core Elements of a Halal Stock:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mt-1 mr-2 flex-shrink-0" size={20} />
                <span>The company's primary business activities align with Islamic values</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mt-1 mr-2 flex-shrink-0" size={20} />
                <span>Its financial practices follow Shariah guidelines</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mt-1 mr-2 flex-shrink-0" size={20} />
                <span>The business maintains ethical standards in its operations</span>
              </li>
            </ul>

            <p className="mt-6">
              Shariah law serves as a comprehensive guide for Muslims, covering all aspects of life -- including financial dealings. When applied to investments, these principles ensure that wealth is generated through ethical means while avoiding harmful or exploitative practices.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-4">A Stock Must Pass Two Main Tests to Be Considered Halal:</h3>
            
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r mb-6">
              <h4 className="font-semibold flex items-center">
                <Filter className="text-emerald-600 mr-2" size={20} />
                Business Activity Test
              </h4>
              <ul className="ml-8 mt-2 list-disc">
                <li>Main revenue comes from permissible sources</li>
                <li>No involvement in prohibited industries</li>
              </ul>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r">
              <h4 className="font-semibold flex items-center">
                <DollarSign className="text-emerald-600 mr-2" size={20} />
                Financial Health Test
              </h4>
              <ul className="ml-8 mt-2 list-disc">
                <li>Limited debt levels</li>
                <li>Minimal interest-based income</li>
                <li>Acceptable cash and receivables ratios</li>
              </ul>
            </div>

            <p className="mt-6">
              Just as Muslims carefully select their food and lifestyle choices to align with their faith, halal stocks offer a way to grow wealth while staying true to Islamic principles. These investments create a bridge between modern financial markets and time-honored religious values.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Star className="text-emerald-600 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">Why Halal Investing Matters</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p>
              Halal investing is more than just a way to manage money - it's a way for Muslims to live out their beliefs and values in every aspect of life. By choosing investments that comply with Shariah law, they can align their financial choices with their spiritual principles.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-4">The Importance of Ethical Wealth Creation</h3>
            <p>
              Islam teaches us that creating wealth is not just about making money for ourselves, but also about doing so in an ethical manner. This means conducting business in a way that is fair, transparent, and beneficial to all parties involved.
            </p>

            <p>Here are some key aspects of ethical wealth creation emphasized in Islamic teachings:</p>
            
            <ul className="space-y-4 mt-4">
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mt-1 mr-2 flex-shrink-0" size={20} />
                <div>
                  <span className="font-semibold">Fair and transparent transactions:</span> Islam encourages honesty and integrity in all business dealings. This means being upfront about costs, terms, and conditions so that both parties have a clear understanding of the agreement.
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mt-1 mr-2 flex-shrink-0" size={20} />
                <div>
                  <span className="font-semibold">Social responsibility:</span> Muslims are taught to be mindful of their impact on society. This includes considering how our business practices affect employees, customers, and the community at large.
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mt-1 mr-2 flex-shrink-0" size={20} />
                <div>
                  <span className="font-semibold">Environmental stewardship:</span> Islam places great importance on taking care of the planet. As investors, we have a responsibility to support companies that prioritize sustainable practices and minimize harm to the environment.
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mt-1 mr-2 flex-shrink-0" size={20} />
                <div>
                  <span className="font-semibold">Community welfare:</span> Our faith encourages us to look out for those less fortunate than ourselves. This can be done through ethical business operations that provide fair wages, job opportunities, and support local communities.
                </div>
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-4">The Broader Impact of Halal Investing</h3>
            <p>
              Halal investing goes beyond personal financial gain - it has the potential to create positive change in the world around us. Here are some ways in which this form of investment can make an impact:
            </p>

            <ol className="space-y-4 mt-4">
              <li className="flex items-start">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</div>
                <div>
                  <span className="font-semibold">Creating market demand for ethical business practices:</span> When investors actively seek out Shariah-compliant companies, it sends a message to the market that there is a demand for businesses that operate ethically. This can encourage more entrepreneurs to adopt socially responsible practices.
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</div>
                <div>
                  <span className="font-semibold">Supporting companies that prioritize social responsibility:</span> By investing in organizations known for their commitment to social causes, we provide them with the resources they need to continue making a difference. This could include funding initiatives aimed at reducing poverty or promoting education.
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</div>
                <div>
                  <span className="font-semibold">Promoting sustainable economic development:</span> Halal investments often focus on sectors such as renewable energy or agriculture - areas critical for long-term sustainability. By directing funds towards these industries, we contribute towards building resilient economies.
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">4</div>
                <div>
                  <span className="font-semibold">Reducing exploitation and harmful business practices:</span> Many traditional investment avenues may inadvertently support industries associated with exploitation (e.g., gambling, alcohol). Choosing halal alternatives helps divert capital away from such activities.
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Filter className="text-emerald-600 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">Key Criteria for Identifying Shariah-Compliant Stocks</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p>
              Identifying halal stocks requires a systematic approach based on clear Islamic principles. These guidelines help investors make informed decisions aligned with Shariah law.
            </p>

            <div className="bg-emerald-700 text-white p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Filter className="mr-2" size={20} />
                Business Activity Filters
              </h3>
              <p>
                A company's primary business activities must align with Islamic principles to qualify as halal. Here's a comprehensive breakdown of prohibited industries:
              </p>
              
              <h4 className="font-semibold mt-6 mb-2">Strictly Prohibited Industries:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Alcoholic beverages and related products</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Gambling and casino operations</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Pork-related products and processing</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Adult entertainment and pornography</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Conventional banking and interest-based financial services</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Weapons and defense manufacturing for offensive purposes</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Tobacco products and related items</span>
                </li>
              </ul>
              
              <h4 className="font-semibold mt-6 mb-2">Mixed Business Activities:</h4>
              <p>Companies must generate less than 5% of their revenue from:</p>
              <ul className="space-y-2 mt-2">
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Entertainment venues with prohibited activities</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Hotels serving alcohol</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Non-halal food and beverage sales</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Interest income from conventional banking</span>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-4">Financial Ratio Screening</h3>
            <p>
              Financial ratios are crucial in determining whether a stock meets halal investment criteria. These ratios help ensure companies maintain healthy financial practices aligned with Islamic principles.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
              <h4 className="font-semibold mb-4">Key Financial Ratios to Consider:</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <DollarSign className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <span className="font-semibold">Debt Ratio:</span> Total interest-bearing debt should not exceed 33% of the company's market capitalization
                  </div>
                </li>
                <li className="flex items-start">
                  <DollarSign className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <span className="font-semibold">Accounts Receivable Ratio:</span> Cash plus receivables must be less than 50% of total assets
                  </div>
                </li>
                <li className="flex items-start">
                  <DollarSign className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <span className="font-semibold">Interest Income:</span> Non-permissible income should not exceed 5% of total revenue
                  </div>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-4">Practical Examples: Halal vs. Haram Companies</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-emerald-50 p-5 rounded-lg">
                <h4 className="font-semibold flex items-center text-emerald-700 mb-3">
                  <CheckCircle className="mr-2" size={20} />
                  Technology Sector (Typically Halal)
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Apple Inc. - Primary revenue from technology products and services</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Microsoft - Software development and cloud services</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Google - Digital advertising and tech solutions</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-5 rounded-lg">
                <h4 className="font-semibold flex items-center text-red-700 mb-3">
                  <XCircle className="mr-2" size={20} />
                  Clear Haram Examples
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <XCircle className="text-red-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Las Vegas Sands - Casino operations</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="text-red-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Anheuser-Busch - Alcohol production</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="text-red-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>British American Tobacco - Tobacco products</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Search className="text-emerald-600 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">Finding Halal Stocks: Methods and Tools</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p>
              Discovering Shariah-compliant stocks requires a systematic approach to research and analysis. Let's explore the essential methods and tools you can use to build your halal investment portfolio.
            </p>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden my-8">
              <div className="bg-emerald-700 text-white p-4">
                <h3 className="text-xl font-bold flex items-center">
                  <FileText className="mr-2" size={24} />
                  Manual Research Methodology
                </h3>
              </div>
              <div className="p-6">
                <p className="mb-4">
                  Conducting thorough research for halal stocks involves a structured process of evaluation and verification. Here's a practical step-by-step guide to help you assess potential investments:
                </p>
                
                <ol className="space-y-4 mt-6">
                  <li className="flex items-start">
                    <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</div>
                    <div>
                      <span className="font-semibold">Company Background Check</span>
                      <ul className="mt-2 ml-6 list-disc">
                        <li>Review the company's main business activities</li>
                        <li>Study their annual reports and financial statements</li>
                        <li>Examine subsidiary companies and partnerships</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</div>
                    <div>
                      <span className="font-semibold">Business Activity Screening</span>
                      <ul className="mt-2 ml-6 list-disc">
                        <li>Calculate revenue from non-halal sources</li>
                        <li>Check for involvement in prohibited industries</li>
                        <li>Verify primary products and services align with Islamic principles</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</div>
                    <div>
                      <span className="font-semibold">Financial Ratio Analysis</span>
                      <ul className="mt-2 ml-6 list-disc">
                        <li>Debt to total assets ratio (must be below 33%)</li>
                        <li>Interest-bearing securities to total assets (must be below 33%)</li>
                        <li>Account receivables to total assets (must be below 45%)</li>
                      </ul>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden my-8">
              <div className="bg-emerald-700 text-white p-4">
                <h3 className="text-xl font-bold flex items-center">
                  <Globe className="mr-2" size={24} />
                  Leveraging Technology: Halal Investment Platforms
                </h3>
              </div>
              <div className="p-6">
                <p className="mb-4">
                  Technology has transformed halal investing with the introduction of specialized platforms and screening tools. These digital solutions make it easier to find Shariah-compliant investments, which can often be a complicated task.
                </p>
                
                <h4 className="font-semibold mt-6 mb-3">Popular Halal Investment Platforms:</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold mb-2 text-emerald-700">ShariaStocks</h5>
                    <p className="text-sm">A platform that helps investors identify and track Shariah-compliant stocks with ease. It combines financial data, AI screening, and Islamic guidelines to simplify ethical investing for Muslims.</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold mb-2 text-emerald-700">Zoya</h5>
                    <p className="text-sm">A mobile app that screens stocks against Islamic principles and provides detailed analysis of company financials.</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold mb-2 text-emerald-700">IslamicInvestor</h5>
                    <p className="text-sm">Offers real-time screening of global stocks and ETFs.</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold mb-2 text-emerald-700">Wahed Invest</h5>
                    <p className="text-sm">A robo-advisor platform providing pre-screened halal investment portfolios.</p>
                  </div>
                </div>
                
                <h4 className="font-semibold mt-8 mb-3">Key Features to Look for in Screening Tools:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Automated financial ratio calculations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Regular updates on company compliance status</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Industry classification screening</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Portfolio monitoring and alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Purification calculators for non-compliant income</span>
                  </li>
                </ul>

                <h4 className="font-semibold mt-6 mb-3">Benefits of Using Digital Tools:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span><span className="font-semibold">Time-Efficient:</span> Instant access to pre-screened investment options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span><span className="font-semibold">Accuracy:</span> Reduced risk of human error in calculations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span><span className="font-semibold">Comprehensive Coverage:</span> Access to global markets and diverse asset classes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span><span className="font-semibold">Educational Resources:</span> Built-in learning materials and investment guidance</span>
                  </li>
                </ul>

                <p className="mt-4">
                  Many platforms offer free basic services with premium features available through paid subscriptions. These tools serve both individual investors and financial advisors, making halal investing accessible to everyone regardless of their investment experience.
                </p>
                
                <p className="mt-2">
                  Remember to verify the credibility of any platform by checking their Shariah board credentials and screening methodology before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Pen className="text-emerald-600 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">Start Your Journey Towards Ethical Investing</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p>
              Your path to halal investing starts with a single step. The tools and knowledge to build a Shariah-compliant portfolio are at your fingertips:
            </p>

            <ul className="space-y-4 mt-6">
              <li className="flex items-start">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</div>
                <div>
                  <span className="font-semibold">Begin with education:</span> Dive deeper into Islamic finance principles through trusted resources and scholars
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</div>
                <div>
                  <span className="font-semibold">Use screening tools:</span> Try platforms like Zoya, IslamicInvestor, or Refinitiv to identify halal stocks
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</div>
                <div>
                  <span className="font-semibold">Start small:</span> Consider investing in well-known halal stocks or Islamic ETFs while building your knowledge
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">4</div>
                <div>
                  <span className="font-semibold">Stay informed:</span> Join Muslim investor communities to share experiences and learn from others
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">5</div>
                <div>
                  <span className="font-semibold">Regular reviews:</span> Schedule periodic portfolio checks to ensure continued Shariah compliance
                </div>
              </li>
            </ul>

            <p className="mt-6">
              Remember - ethical investing isn't just about avoiding haram investments. It's about creating positive impact while growing wealth in alignment with your values. Your investment choices can help build a more ethical financial system while securing your financial future.
            </p>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r my-8">
              <p className="font-bold text-lg">Ready to take the next step?</p>
              <p>Choose one of the recommended screening tools and start exploring halal investment opportunities today. Your journey toward ethical wealth creation awaits.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <HelpCircle className="text-emerald-600 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">FAQs (Frequently Asked Questions)</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="font-semibold text-lg text-gray-800">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="text-emerald-600" size={20} />
                  ) : (
                    <ChevronDown className="text-emerald-600" size={20} />
                  )}
                </button>
                
                {openFaq === index && (
                  <div className="px-6 py-4 border-t border-gray-100">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield size={24} className="text-emerald-400" />
                <span className="font-bold text-xl">HalalInvest</span>
              </div>
              <p className="text-gray-300">Your trusted resource for faith-based and ethical investing.</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-emerald-400">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-emerald-400">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-emerald-400">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-400">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-400">Halal Stocks Guide</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-400">Screening Tools</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-400">Investment Resources</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-400">Contact Us</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates on halal investing.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-l text-gray-800 w-full focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-r font-medium transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HalalInvest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HalalStockblog;
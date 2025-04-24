import React from 'react';
import { Calculator, DollarSign, PieChart, BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'

function FinancialRatios() {
  const navigate = useNavigate()
  const IslamicImage = ({ src, alt, caption }) => {
    return (
      <div className="my-8">
        <div className="border-8 border-emerald-100 p-1">
          <div className="max-h-64 md:max-h-80 lg:max-h-96 ">
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-112 object-fill rounded-sm"
            />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      
      <header className="bg-emerald-800 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Islamic Finance Insights</h1>
          <p className="text-emerald-200 mt-2">Ethical investing through Islamic principles</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
          <div className="md:flex">
            <div className="md:w-2/3 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-4">Top 5 Financial Ratios Used in Islamic Stock Screening</h2>
              <p className="text-gray-700 italic mb-6">
                "Ever wondered how to tell if a company is truly Halal to invest in?
                It's not just about avoiding alcohol or gambling—there's a whole
                financial side to the screening process that most people miss.
                In Islamic investing, numbers matter just as much as ethics. That's
                where financial ratios come in.
                In this post, we'll break down the Top 5 financial ratios used by
                Shariah scholars to determine if a stock meets Islamic guidelines—in
                plain English, with examples and visuals to make it crystal clear."
              </p>
              <div className="flex items-center text-emerald-700 font-medium">
                <span>Read more</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
            <div className="md:w-1/3 bg-emerald-100 flex items-center justify-center p-6">
              <div className="text-center">
                <Calculator className="h-20 w-20 text-emerald-700 mx-auto" />
                <p className="mt-2 text-emerald-800 font-medium">Financial Analysis</p>
              </div>
            </div>
          </div>
        </section>
       

        {/* Introduction */}
        <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Introduction</h2>
          <p className="text-gray-700 mb-4">
            Making informed investment decisions requires a deep understanding of
            financial metrics, particularly when aligning investments with Islamic
            principles. Financial ratios serve as powerful tools that reveal crucial
            insights about a company's financial health and Shariah compliance.
          </p>
          <p className="text-gray-700 mb-4">
            Islamic stock screening is a systematic process that evaluates companies
            based on both qualitative and quantitative criteria. While qualitative
            screening ensures businesses operate in permissible sectors,
            quantitative screening through financial ratios determines if a
            company's financial practices align with Islamic principles.
          </p>
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
            <p className="font-medium text-emerald-800">These key financial ratios help investors identify:</p>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
              <li>The level of interest-based debt in a company</li>
              <li>Sources of income and their permissibility</li>
              <li>Management of liquid assets</li>
              <li>Exposure to interest-bearing securities</li>
              <li>Overall financial structure and stability</li>
            </ul>
          </div>
        </section>

        {/* The 5 Key Ratios */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-emerald-800 mb-6">The 5 Essential Financial Ratios</h2>
          
          {/* Ratio 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800">1. Debt Ratio</h3>
            </div>
            <p className="text-gray-700 mb-4">
              The debt ratio is an important metric used in Islamic stock screening. It measures a
              company's total debt compared to its total assets. This indicator helps
              investors determine if a company's debt levels are in line with Shariah
              principles.
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="font-medium text-center">Debt Ratio = Total Interest-Bearing Debt / Total Assets</p>
            </div>
            <p className="text-gray-700 mb-4">
              According to Islamic finance guidelines, companies must keep their debt ratio below <span className="font-semibold">33%</span> to be considered
              Shariah-compliant. This requirement reflects the Islamic principle of minimizing reliance
              on debt-based financing.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 mb-4">
              <p className="font-medium text-emerald-800 mb-2">Real-World Example:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>A company has total assets of $1 million and interest-bearing debt of $400,000</li>
                <li>In this case, the debt ratio would be 40%</li>
                <li>Despite potential profitability, this company would not meet the Islamic screening criteria</li>
                <li>Investors should seek out companies with debt ratios below 33%</li>
              </ul>
            </div>
          </div>

          {/* Ratio 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <PieChart className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800">2. Interest Income Ratio</h3>
            </div>
            <p className="text-gray-700 mb-4">
              The interest income ratio measures the proportion of a company's
              revenue derived from interest-based activities. In Islamic finance, this
              metric helps identify businesses that generate excessive income from
              prohibited earnings (riba).
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="font-medium text-center">Interest Income Ratio = Interest Income / Total Revenue × 100</p>
            </div>
            <p className="text-gray-700 mb-4">
              The Shariah screening threshold allows companies to have up to <span className="font-semibold">5%</span> of their total revenue from
              interest-based sources. This small allowance recognizes the practical
              challenges modern businesses face in completely avoiding interest
              income, particularly in conventional banking systems.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 mb-4">
              <p className="font-medium text-emerald-800 mb-2">Example Income Breakdown:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Operating Income: 92%</li>
                <li>Interest Income: 3%</li>
                <li>Other Income: 5%</li>
              </ul>
            </div>
          </div>

          {/* Ratio 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <BarChart3 className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800">3. Liquidity Ratio</h3>
            </div>
            <p className="text-gray-700 mb-4">
              The liquidity ratio measures a company's ability to meet its short-term obligations using liquid
              assets. In Islamic finance, this ratio holds special significance as it
              ensures companies maintain sufficient halal resources to operate without
              relying on interest-bearing loans.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 mb-4">
              <p className="font-medium text-emerald-800 mb-2">Key Components of Liquidity Ratio:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Liquid Assets: Cash, marketable securities, accounts receivable</li>
                <li>Short-term Liabilities: Accounts payable, short-term debt</li>
              </ul>
            </div>
            <p className="text-gray-700 mb-4">
              The Shariah-compliant threshold requires liquid assets to not exceed <span className="font-semibold">49%</span> of total assets. This limit
              helps prevent excessive cash hoarding and encourages productive
              investment of resources.
            </p>
          </div>

          {/* Ratio 4 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <Calculator className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800">4. Cash and Interest-Bearing Securities Ratio</h3>
            </div>
            <p className="text-gray-700 mb-4">
              The cash and interest-bearing securities ratio examines a company's holdings in conventional interest-generating
              instruments - a critical metric for Shariah compliance screening.
              This ratio calculates the percentage of a company's cash and
              interest-bearing securities relative to its total assets.
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="font-medium text-center">Shariah Compliance Threshold: <span className="font-bold">33%</span> (varies by jurisdiction)</p>
            </div>
            <p className="text-gray-700 mb-4">
              Islamic scholars have established this threshold to accommodate modern
              business realities while maintaining Shariah principles. A company's
              cash ratio exceeding these limits indicates significant involvement in
              interest-based activities, making it non-compliant.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 mb-4">
              <p className="font-medium text-emerald-800 mb-2">Key components analyzed:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Short-term deposits</li>
                <li>Treasury bills</li>
                <li>Government bonds</li>
                <li>Money market instruments</li>
                <li>Fixed-income securities</li>
              </ul>
            </div>
          </div>

          {/* Ratio 5 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800">5. Market Capitalization vs Total Assets Ratio</h3>
            </div>
            <p className="text-gray-700 mb-4">
              The debate between using market capitalization versus total assets as a
              screening metric reflects two distinct approaches to Islamic stock
              evaluation. Each method offers unique insights into a company's Shariah
              compliance status.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 p-4 rounded-md">
                <p className="font-medium text-emerald-800 mb-2">Market Capitalization Approach</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Provides real-time valuation updates</li>
                  <li>Reflects current market sentiment</li>
                  <li>More volatile due to market fluctuations</li>
                  <li>Preferred by scholars who emphasize dynamic assessment</li>
                </ul>
              </div>
              <div className="bg-emerald-50 p-4 rounded-md">
                <p className="font-medium text-emerald-800 mb-2">Total Assets Approach</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Offers stable, book-based evaluation</li>
                  <li>Less susceptible to market speculation</li>
                  <li>Based on tangible company resources</li>
                  <li>Supported by scholars focusing on fundamental value</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Table */}
        <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Summary Table of Financial Ratios</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-emerald-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Ratio</th>
                  <th className="py-3 px-4 text-left">Threshold Limit</th>
                  <th className="py-3 px-4 text-left">Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 font-medium">Debt Ratio</td>
                  <td className="py-3 px-4">≤ 33%</td>
                  <td className="py-3 px-4">Ensures companies maintain minimal debt levels aligned with Islamic principles</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 font-medium">Interest Income Ratio</td>
                  <td className="py-3 px-4">≤ 5%</td>
                  <td className="py-3 px-4">Identifies companies with negligible interest-based income</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Liquidity Ratio</td>
                  <td className="py-3 px-4">≤ 49%</td>
                  <td className="py-3 px-4">Measures company's ability to meet short-term obligations while maintaining Shariah compliance</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 font-medium">Cash and Interest-Bearing Securities</td>
                  <td className="py-3 px-4">≤ 33%</td>
                  <td className="py-3 px-4">Evaluates exposure to interest-bearing instruments</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Market Cap vs Total Assets</td>
                  <td className="py-3 px-4">Variable*</td>
                  <td className="py-3 px-4">Provides flexibility in valuation methodology based on market conditions</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">*Note: The threshold varies depending on the chosen screening methodology and scholars' interpretation.</p>
        </section>

        {/* Call to Action */}
        <section className="bg-emerald-700 text-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold mb-4">Take Action on Your Islamic Investment Journey</h2>
          <p className="mb-4">
            Understanding these Top 5 Financial Ratios Used in Islamic Stock Screening
            is your first step toward building a Shariah-compliant investment portfolio.
            Modern technology makes this process easier than ever.
          </p>
          <p className="mb-6">Ready to put these ratios into practice? Here are your next steps:</p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-emerald-300" />
              <span>Download Islamic stock screening apps like Zoya or IslamicInvestor</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-emerald-300" />
              <span>Sign up for specialized ethical investing platforms such as Wahed Invest</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-emerald-300" />
              <span>Use automated screening tools available through Islamic financial institutions</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-emerald-300" />
              <span>Consider consulting with a Shariah-compliant financial advisor</span>
            </li>
          </ul>
          <button onClick={() => navigate('/')} className="bg-white text-emerald-700 font-medium py-2 px-6 rounded-full hover:bg-emerald-100 transition duration-300">
            Start Investing Today
          </button>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-emerald-800 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-emerald-700 mb-2">What are the top financial ratios used in Islamic stock screening?</h3>
              <p className="text-gray-700">
                The top 5 financial ratios used in Islamic stock screening include the
                Debt Ratio, Interest Income Ratio, Liquidity Ratio, Cash and
                Interest-Bearing Securities Ratio, and Market Capitalization vs Total
                Assets Ratio. These ratios help assess a company's Shariah compliance
                and overall financial health.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-emerald-700 mb-2">Why are financial ratios important for investment decision-making in Islamic finance?</h3>
              <p className="text-gray-700">
                Financial ratios are crucial for investment decision-making in Islamic
                finance as they provide insights into a company's compliance with
                Shariah law. They help investors evaluate the ethical implications of
                their investments and ensure that their portfolios align with Islamic
                principles.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-emerald-700 mb-2">What is the significance of the Debt Ratio in Islamic stock screening?</h3>
              <p className="text-gray-700">
                The Debt Ratio measures a company's total debt relative to its total
                assets. In Islamic stock screening, a common threshold for Shariah
                compliance is set at 33%. A lower debt ratio indicates better financial
                health and aligns with Islamic principles of avoiding excessive debt.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-emerald-700 mb-2">How does the Interest Income Ratio affect investment decisions in Islamic finance?</h3>
              <p className="text-gray-700">
                The Interest Income Ratio assesses the proportion of a company's income
                derived from interest-bearing sources. For Shariah compliance, this
                ratio should not exceed 5%. Investors use this ratio to evaluate
                potential investments and avoid companies that generate prohibited
                earnings.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-emerald-700 mb-2">How can investors utilize stock screening tools based on these financial ratios?</h3>
              <p className="text-gray-700">
                Investors can explore various stock screening tools or ethical investing
                platforms that automate the assessment of stocks based on these top 5
                financial ratios. These tools simplify the process of identifying
                Shariah-compliant investments, making it easier to align portfolios with
                Islamic ethics.
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </main>

    </div>
  );
}

export default FinancialRatios;
import { useState } from 'react';
import { Heart, Bell, User, ArrowRight, Info, CheckCircle, AlertTriangle, XCircle, List, Shield, Briefcase, Book, Home, Users } from 'lucide-react';
import signup from '../images/Blog-pics/signup.png'
import email from '../images/Blog-pics/verifyEmail.png'
import login from '../images/Blog-pics/login.png'
import dashboard from '../images/Blog-pics/dashboard.png'
import stockresults from '../images/Blog-pics/stockresults.png'
import watchlist from '../images/Blog-pics/watchlist.png'
import notification from '../images/Blog-pics/notification.png'
import profile from '../images/Blog-pics/profile.png'
import accountSettings from '../images/Blog-pics/accountSettings.png'
import paymentMethods from '../images/Blog-pics/paymentMethods.png'
import subscription from '../images/Blog-pics/subscriptionDetails.png'
import Footer from '../components/Footer'



function HowItWorks() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50"> 
    
        <main className=" lg:px-8">
          <section id="home" className="mb-16">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl shadow-sm border border-green-100 mt-2.5">
              <h1 className="text-4xl font-bold text-green-800 flex items-center">
                <span className="mr-2">🕌</span> Invest with Confidence: How to Use the ShariaStocks Application
              </h1>
              <p className="mt-4 text-lg text-gray-700 italic">
                "As a Muslim investor, you want your money to grow — but not at the cost of your values. So, how do you tell which stocks are truly halal?"
              </p>
            </div>
            
            <div className="mt-8">
              <p className="text-lg text-gray-700">
                That's the question ShariaStocks is built to answer. Whether you're a beginner in the stock market or a seasoned investor looking for Shariah-compliant options, our platform empowers you to <strong>invest ethically and confidently</strong>.
              </p>
              <p className="mt-4 text-lg text-gray-700">
                In this guide, we'll walk you through how to use the ShariaStocks application — from exploring halal stocks to managing your watchlist and subscriptions.
              </p>
            </div>
          </section>

          <section id="what-is" className="mb-16">
            <h2 className="text-3xl font-bold text-green-800 flex items-center mb-6">
              <span className="mr-2">🌟</span> What Is ShariaStocks?
            </h2>
            <p className="text-lg text-gray-700">
              ShariaStocks is a user-friendly platform designed to help you <strong>screen and analyze stocks based on Islamic finance principles</strong>. Using real-time data and AI-driven analysis, the app helps you avoid companies involved in haram industries or unethical financial practices.
            </p>
          </section>

          <section id="getting-started" className="mb-16">
            <h2 className="text-3xl font-bold text-green-800 flex items-center mb-6">
              <span className="mr-2">🛠️</span> How to Use ShariaStocks — Step by Step
            </h2>
            
            {/* Step 1 */}
            <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">1</span> 
                Landing on the ShariaStocks Homepage
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                When you visit <a href="https://shariastocks.in/" className="text-blue-600 hover:underline">https://shariastocks.in/</a>, you'll see a dynamic home page with two key options on top:
              </p>
              <ul className="list-none space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="bg-green-500 text-white rounded-full px-2 py-1 mr-2 text-sm">Get Started</span>
                  <span>for new users</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-blue-500 text-white rounded-full px-2 py-1 mr-2 text-sm">Login</span>
                  <span>for returning users</span>
                </li>
                <li className="flex items-center">
                  <span>And other features of the application</span>
                </li>
              </ul>
              <p className="text-lg text-gray-700">
                From here, you can start your journey toward ethical investing.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">2</span> 
                Sign Up & Email Verification
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                Click on <strong>Get Started</strong>, and you'll be taken to the <strong>Sign-Up page</strong>, where you enter:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 pl-4 text-gray-700">
                <li>Your <strong>name</strong></li>
                <li>Your <strong>email address</strong></li>
                <li>A <strong>secure password</strong></li>
              </ul>
              <p className="text-lg text-gray-700 mb-6">
                Once submitted, we'll send a <strong>verification email</strong> to confirm your identity. Just open your inbox and click on the verification link — that's it!
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Or, you have an option to signup with Google.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
                  <img src={signup} alt="Signup form screenshot" className="rounded" />
                  <p className="text-center text-sm text-gray-500 mt-2">Signup Form</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
                  <img src={email} alt="Email verification screenshot" className="rounded" />
                  <p className="text-center text-sm text-gray-500 mt-2">Email Verification</p>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Pro Tip</strong>: This step helps us keep your account secure and personalized.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">3</span> 
                Log In
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                After verifying your email, go back to the homepage and click <strong>Login</strong>. Enter your credentials, and you're in!
              </p>
              <p className="text-lg text-gray-700 mb-6">
                You'll now land on your personalized <strong>Dashboard</strong>, where the real magic begins.
              </p>
              <div className="flex justify-center mb-6">
                <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
                  <img src={login} alt="Login form screenshot" className="rounded" />
                  <p className="text-center text-sm text-gray-500 mt-2">Login Form</p>
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">4</span> 
                Dashboard Overview
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                Welcome to your <strong>ShariaStocks Dashboard</strong> — your command center for halal investing.
              </p>
              <div className="mb-6">
                <h4 className="text-xl font-medium text-green-600 mb-2">🧭 Layout Overview:</h4>
                <ul className="list-disc list-inside space-y-3 pl-4 text-gray-700">
                  <li>
                    <strong>Center Screen</strong>: Large, user-friendly <strong>Search Bar</strong>
                    <ul className="list-disc list-inside pl-6 pt-2 space-y-2">
                      <li>As soon as the user types 2+ characters:
                        <ul className="list-disc list-inside pl-6 pt-1 space-y-1">
                          <li>The dropdown becomes visible.</li>
                          <li>Suggestions are filtered based on the input (prefix matching or fuzzy matching).</li>
                          <li>Clicking on a suggestion closes the dropdown and triggers the stockresults page navigation.</li>
                          <li>Clicking outside the input or pressing Esc hides the suggestions.</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li className="mt-3">
                    <strong>Header</strong> includes:
                    <ul className="list-disc list-inside pl-6 pt-2 space-y-2">
                      <li className="flex items-center">
                        <span className="mr-1">🟢</span> <strong>Logo</strong> (click to return to dashboard anytime)
                      </li>
                      <li className="flex items-center">
                        <span className="mr-1">🔍</span> <strong>Search Bar</strong> (for stock search)
                      </li>
                      <li className="flex items-center">
                        <Heart className="h-4 w-4 text-red-500 mr-1" /> <strong>Watchlist Icon</strong> — view your saved stocks
                      </li>
                      <li className="flex items-center">
                        <Bell className="h-4 w-4 text-blue-500 mr-1" /> <strong>Notification Icon</strong> — see updates on stock statuses
                      </li>
                      <li className="flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-1" /> <strong>Profile Icon</strong> — access settings, subscription, and logout
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center mb-6">
                <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
                  <img src={dashboard} alt="Dashboard screenshot" className="rounded" />
                  <p className="text-center text-sm text-gray-500 mt-2">Dashboard Overview</p>
                </div>
              </div>
              <p className="text-lg text-gray-700">
                Everything you need is just a click away.
              </p>
            </div>
            
            {/* Step 5 */}
            <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">5</span> 
                Search for a Stock
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                Type the name or symbol of any Indian stock in the <strong>search bar</strong> (center or header). When you click on a result, you're taken to the <strong>Stock Details Page</strong>, where you'll find:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <strong className="text-green-700">Halal/Haram Status</strong>
                    <p className="text-sm text-gray-600">Clear indication of compliance status</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <strong className="text-blue-700">Business Sector & Industry</strong>
                    <p className="text-sm text-gray-600">Understand the company's business model</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <strong className="text-orange-700">Debt and Interest Ratios</strong>
                    <p className="text-sm text-gray-600">Financial metrics with Islamic guidelines</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                  <Info className="h-5 w-5 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <strong className="text-purple-700">AI-Powered News Analysis</strong>
                    <p className="text-sm text-gray-600">Latest relevant news with Shariah context</p>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                To see more details about the financial ratios, click the ratio cards. It shows <strong>expanded financial details</strong> including <strong>short definitions</strong> or tooltips explaining each ratio.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                This is where ShariaStocks does the heavy lifting — so you can focus on informed, value-driven investing.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                See something promising? Just click the <strong>Heart Icon (<Heart className="h-4 w-4 text-red-500 inline" />)</strong> on the top right corner below the header.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                This adds it to your <strong>Watchlist</strong>, where you can:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 pl-4 text-gray-700">
                <li>Track performance</li>
                <li>Monitor halal status updates</li>
                <li>Revisit later for deeper research</li>
              </ul>
              <p className="text-lg text-gray-700 mb-4">
                Your Watchlist is accessible anytime from the top-right icon in the header.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Note</strong>: The Free tier users won't be able to see the Heart icon to add the stock to Watchlist.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
                  <img src={stockresults} alt="Stock details page" className="rounded" />
                  <p className="text-center text-sm text-gray-500 mt-2">Stock Details Page</p>
                </div>
              </div>
            </div>
            
            {/* Step 6 */}
            <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">6</span> 
                Watchlist — Your Personalized Stock Tracker
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                The <strong>Watchlist Page</strong> is where you can <strong>organize and monitor all your favorite stocks</strong> in one place. It's more than just a list — it's your <strong>halal investing dashboard</strong> within the dashboard.
              </p>
              <div className="mb-6">
                <h4 className="text-xl font-medium text-green-600 mb-2">✅ Features of the Watchlist Page:</h4>
                
                <div className="mb-4">
                  <h5 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">📋</span> List of Saved Stocks
                  </h5>
                  <p className="text-gray-700 mb-2">
                    Each stock you add using the "<Heart className="h-4 w-4 text-red-500 inline" />" icon appears here. For each stock, you'll see:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-4 text-gray-700">
                    <li>Company Name</li>
                    <li>Stock Symbol</li>
                    <li>Current Price</li>
                    <li>Halal Status (Halal, Haram, Doubtful)</li>
                    <li>Last Updated Timestamp</li>
                    <li>"X" Button to remove the stock from your watchlist instantly</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h5 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">🧮</span> Real-Time Compliance Updates
                  </h5>
                  <p className="text-gray-700">
                    If a stock's Shariah status changes (e.g., from Halal to Doubtful), your watchlist reflects that <strong>automatically and in real-time</strong>.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h5 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">🔍</span> Filter Options
                  </h5>
                  <p className="text-gray-700 mb-2">
                    At the top of the Watchlist, you'll find <strong>filter buttons</strong> to help you focus on what matters most:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      <CheckCircle className="h-4 w-4 mr-1" /> Halal
                    </span>
                    <span className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
                      <XCircle className="h-4 w-4 mr-1" /> Haram
                    </span>
                    <span className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      <AlertTriangle className="h-4 w-4 mr-1" /> Doubtful
                    </span>
                  </div>
                  <p className="text-gray-700">
                    These filters help you <strong>prioritize decisions</strong>, especially when your list grows.
                  </p>
                </div>
              </div>
              <div className="flex justify-center mb-6">
                <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
                  <img src={watchlist} alt="Watchlist page" className="rounded" />
                  <p className="text-center text-sm text-gray-500 mt-2">Watchlist Page</p>
                </div>
              </div>
            </div>
            
            {/* Additional steps would continue here... */}
            {/* Step 7 */}
            <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">7</span> 
                Notification Page — Stay Updated on What Matters
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                The <strong>Notification Page</strong> is your <strong>real-time update center</strong>. Every major change that impacts your investments will show up here — so you never miss a beat.
              </p>
              <div className="flex justify-center mb-6">
                <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
                  <img src={notification} alt="Notifications page" className="rounded" />
                  <p className="text-center text-sm text-gray-500 mt-2">Notifications Page</p>
                </div>
              </div>
            </div>
            
            {/* Step 8 */}
            <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">8</span> 
                Profile Page
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                The profile page allows users to <strong>view and manage their profile</strong>, <strong>check their subscription status</strong>, and <strong>access related settings</strong>.
              </p>
              <div className="mb-6">
                <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
                  <li>Displays profile picture and user info (name & email)</li>
                  <li>Allows uploading and saving a new profile picture</li>
                  <li>"Edit Profile" button</li>
                  <li>
                    Quick access to:
                    <ul className="list-disc list-inside pl-6 pt-2 space-y-1">
                      <li>Account Settings</li>
                      <li>Notifications</li>
                      <li>Payment Methods</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xl font-medium text-green-600 mb-2">💎 Right Panel (Subscription Info)</h4>
                <p className="text-gray-700 mb-2">
                  Conditional rendering based on whether the user is on a free or premium plan.
                </p>
                
                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2">If Free:</h5>
                  <ul className="list-disc list-inside space-y-1 pl-4 text-gray-700">
                    <li>Encourages upgrade to Premium</li>
                    <li>
                      Shows features like:
                      <ul className="list-disc list-inside pl-6 pt-1 space-y-1">
                        <li>Real-time Alerts</li>
                        <li>Portfolio Analytics</li>
                        <li>Expert Reports</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2">If Premium:</h5>
                  <ul className="list-disc list-inside space-y-1 pl-4 text-gray-700">
                    <li>
                      Displays current plan details:
                      <ul className="list-disc list-inside pl-6 pt-1 space-y-1">
                        <li>Plan Name</li>
                        <li>Status (active/canceled)</li>
                        <li>Billing Cycle</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
                  <img src={profile} alt="Profile page" className="rounded" />
                  <p className="text-center text-sm text-gray-500 mt-2">Profile Page</p>
                </div>
              </div>
            </div>
            {/* Step 9 - Account Management section continuation */}
    <div className="mb-6">
      <h4 className="text-xl font-medium text-green-600 mb-2">
        <span className="mr-1">⚙️</span> Account Management
      </h4>
      <p className="text-gray-700 mb-2">
        This section is for users who want more control over their subscription or account:
      </p>
      <ul className="list-disc list-inside space-y-1 pl-4 text-gray-700">
        <li>
          <strong>Cancel Subscription</strong>:
          <ul className="list-disc list-inside pl-6 pt-1 space-y-1">
            <li>Ends the subscription at the end of the billing period.</li>
            <li>Clearly marked in red for caution.</li>
          </ul>
        </li>
        <li>
          <strong>Delete Account</strong>:
          <ul className="list-disc list-inside pl-6 pt-1 space-y-1">
            <li>Permanently removes the user's profile and all related data.</li>
            <li>Used for complete account removal.</li>
          </ul>
        </li>
      </ul>
    </div>

    <div className="flex justify-center">
      <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
        <img src={accountSettings} alt="Account settings page" className="rounded" />
        <p className="text-center text-sm text-gray-500 mt-2">Account Settings Page</p>
      </div>
    </div>

    {/* Step 10 */}
    <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-2xl font-semibold text-green-700 mb-4">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">10</span> 
        Payment Methods Page
      </h3>
      <p className="text-lg text-gray-700 mb-4">
        The Payment Methods page in ShariaStocks is designed to give users full control over how they pay for their subscriptions and services. With an intuitive layout and a secure payment system, this page ensures a smooth and trustworthy experience.
      </p>
      
      <div className="mb-6">
        <h4 className="text-xl font-medium text-green-600 mb-2">
          <span className="mr-1">💼</span> Your Payment Methods
        </h4>
        <p className="text-gray-700 mb-2">
          This section allows users to view and manage their saved payment options. If no payment methods are saved, it displays:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-4 text-gray-700">
          <li>A card icon and message: "No payment methods added yet"</li>
          <li>
            Two primary action buttons:
            <ul className="list-disc list-inside pl-6 pt-1 space-y-1">
              <li><strong>Add Card</strong> – to link a debit or credit card</li>
              <li><strong>Add UPI</strong> – to add UPI ID for direct bank payments</li>
            </ul>
          </li>
        </ul>
      </div>
      
      <div className="flex justify-center">
        <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
          <img src={paymentMethods} alt="Payment methods page" className="rounded" />
          <p className="text-center text-sm text-gray-500 mt-2">Payment Methods Page</p>
        </div>
      </div>
    </div>

    {/* Step 11 */}
    <div className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-2xl font-semibold text-green-700 mb-4">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full mr-2">11</span> 
        Subscription Plans – Empowering Islamic Investment
      </h3>
      <p className="text-lg text-gray-700 mb-4">
        The Subscription Plans page is where users unlock the full power of the ShariaStocks platform by choosing a plan that aligns with their investment goals. From beginners to seasoned investors, this page offers a seamless and secure way to upgrade.
      </p>
      
      <div className="mb-6">
        <h4 className="text-xl font-medium text-green-600 mb-2">
          <span className="mr-1">📊</span> Page Overview
        </h4>
        <p className="text-gray-700 mb-2">
          This page is designed to be clear, user-friendly, and conversion-focused.
        </p>
        <p className="text-gray-700 mb-2">
          At the top, users are presented with three plan options:
        </p>
        <p className="text-gray-700 mb-2">
          A toggle allows switching between Monthly and Annual billing options (with an annual discount of 30%).
        </p>
      </div>
      
      <div className="mb-6">
        <h4 className="text-xl font-medium text-green-600 mb-2">
          <span className="mr-1">🔍</span> Plan Comparison Table
        </h4>
        <p className="text-gray-700 mb-2">
          Below the cards, there's a side-by-side comparison of features across the plans:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-4 text-gray-700">
          <li>Search limits</li>
          <li>Stock storage</li>
          <li>News notifications</li>
          <li>Shariah compliance insights</li>
        </ul>
        <p className="text-gray-700 mt-2">
          This helps users make informed decisions with clarity.
        </p>
      </div>
      
      <div className="mb-6">
        <h4 className="text-xl font-medium text-green-600 mb-2">
          <span className="mr-1">💡</span> Upgrade CTA
        </h4>
        <p className="text-gray-700 mb-2">
          At the bottom, a brightly styled section encourages users to upgrade:
        </p>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center mb-4">
          <p className="text-xl font-medium text-green-800">Ready to enhance your Islamic investment journey?</p>
          <button className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center mx-auto">
            Upgrade Now <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        <p className="text-gray-700">
          On clicking this, it will select the Premium Plan and proceed to payment.
        </p>
      </div>
      
      <div className="mb-6">
        <h4 className="text-xl font-medium text-green-600 mb-2">
          <span className="mr-1">🧭</span> User Flow – Selecting and Activating a Plan
        </h4>
        <p className="text-gray-700 mb-2">
          When a user chooses either the Basic or Premium plan, the following flow is triggered:
        </p>
        <ol className="list-decimal list-inside space-y-4 pl-4 text-gray-700">
          <li>
            <strong>Plan Selection Popup</strong>
            <p className="ml-6 mt-1">
              A sleek popup modal appears where the user:
            </p>
            <ul className="list-disc list-inside pl-12 space-y-1">
              <li>Reviews the selected plan</li>
              <li>Chooses a payment mode (automatic, manual)</li>
              <li>Proceeds by clicking the "Confirm Payment" button</li>
            </ul>
          </li>
          <li>
            <strong>Razorpay Gateway Integration</strong>
            <p className="ml-6 mt-1">
              On confirmation:
            </p>
            <ul className="list-disc list-inside pl-12 space-y-1">
              <li>The Razorpay payment gateway opens</li>
              <li>Users complete the transaction securely</li>
            </ul>
          </li>
          <li>
            <strong>Database Update & Subscription Activation</strong>
            <p className="ml-6 mt-1">
              After successful payment:
            </p>
            <ul className="list-disc list-inside pl-12 space-y-1">
              <li>Payment details are captured</li>
              <li>The user's subscription status is updated in the database</li>
              <li>Access to new features is unlocked immediately</li>
            </ul>
          </li>
        </ol>
      </div>
      
      <div className="mb-6">
        <h4 className="text-xl font-medium text-green-600 mb-2">
          <span className="mr-1">🔐</span> Security & Seamless Experience
        </h4>
        <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
          <li>All transactions are processed through Razorpay, ensuring PCI-DSS-compliant security</li>
          <li>No sensitive payment data is stored on ShariaStocks servers</li>
          <li>Users enjoy a hassle-free subscription journey with real-time updates</li>
        </ul>
      </div>
      
      <div className="flex justify-center">
        <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
          <img src={subscription} alt="Subscription plans page" className="rounded" />
          <p className="text-center text-sm text-gray-500 mt-2">Subscription Plans Page</p>
        </div>
      </div>
    </div>

    {/* Why ShariaStocks Matters */}
    <section id="why-it-matters" className="mb-16">
      <h2 className="text-3xl font-bold text-green-800 flex items-center mb-6">
        <span className="mr-2">🤲</span> Why ShariaStocks Matters
      </h2>
      <p className="text-lg text-gray-700">
        Your investments are more than numbers — they reflect your faith, values, and intentions. ShariaStocks ensures that you're not just building wealth, but doing so with integrity and peace of mind.
      </p>
    </section>

    {/* Conclusion */}
    <section id="conclusion" className="mb-16">
      <h2 className="text-3xl font-bold text-green-800 flex items-center mb-6">
        <span className="mr-2">✨</span> Start Your Halal Investing Journey Today
      </h2>
      <p className="text-lg text-gray-700">
        Visit <a href="https://shariastocks.in/" className="text-blue-600 hover:underline">https://shariastocks.in/</a> and start screening stocks the ethical way.
      </p>
      <p className="text-lg text-gray-700 mt-4">
        Need help or have feedback? Reach out to us anytime — we're building this with the community, for the community.
      </p>
    </section>
    </section>
    <Footer />
    </main>
    </div>
    )
    }
export default HowItWorks;
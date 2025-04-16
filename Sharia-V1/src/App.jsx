import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import EmailVerification from './components/EmailVerification';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Design from './components/Design'
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import StockResults from './components/StockResults';
import CategoryResultsPage from './components/CategoryResultsPage';
import WatchList from './components/Watchlist';
import Profile from './components/Profile';
import NotificationsPage from './components/NotificationPage';
import News from './components/News';
import TrendingStocks from './components/TrendingStocks';
import EditProfile from './components/EditProfile';
import PersonalDetails from './components/PersonalDetails';
import PaymentMethods from './components/PaymentMethods';
import SubscriptionDetails from './components/SubscriptionDetails';
import PaymentCheckout from './components/PaymentCheckout';
import OAuthCallback from './components/OAuthCallback';
import Razorpay from './components/razorpay';
import SubscriptionSuccess from './components/SubscriptionSuccess';
import AccountInformationPage from './components/AccountSettings';
import UnderstandingHaram from './blogs/UnderstandingHaram';
import BlogAdmin from './components/BlogAdmin';
import BlogCatalogue from './components/BlogCatalogue';
import HalalHaramStocksBlog from './blogs/HalalHaramStocksBlog';
import RoleAIBlog from './blogs/RoleAIBlog';
import HalalStockblog from './blogs/HalalStockblog';
import FinancialRatios from './blogs/FinancialRatios';
import HowItWorks from './blogs/HowItWorks';
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';

const App = () => {
  const userId = localStorage.getItem('userId');

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Design />} />
                    <Route path="/oauth-callback" element={<OAuthCallback />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    {/* <Route path="/verify" element={<EmailVerification />} /> */}
                    <Route path="/verify/:token" element={<EmailVerification />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path='/blog-catalogue' element={<BlogCatalogue/>} />
                    <Route path="/understand-haram" element={<UnderstandingHaram />} />
                    <Route path="/halal-haram-diff" element={<HalalHaramStocksBlog />} />
                    <Route path="/role-ai" element={<RoleAIBlog />} />
                    <Route path="/halal-stock" element={<HalalStockblog />} />
                    <Route path="/financial-ratios" element={<FinancialRatios />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    {/* Protected Routes */}
                <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                    }
                />
                <Route
                path="/account"
                element={
                    <PrivateRoute>
                        <AccountInformationPage />
                    </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/news"
                    element={
                        <PrivateRoute>
                            <News />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/trendingstocks"
                    element={
                        <PrivateRoute>
                            <TrendingStocks />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/stockresults/:symbol"
                    element={
                        <PrivateRoute>
                            <StockResults />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/categoryresultspage/:categoryName"
                    element={
                        <PrivateRoute>
                            <CategoryResultsPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/watchlist"
                    element={
                        <PrivateRoute>
                            <WatchList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notificationpage"
                    element={
                        <PrivateRoute>
                            <NotificationsPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/editprofile"
                    element={
                        <PrivateRoute>
                            <EditProfile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/personaldetails"
                    element={
                        <PrivateRoute>
                            <PersonalDetails />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/paymentmethods"
                    element={
                        <PrivateRoute>
                            <PaymentMethods />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/subscriptiondetails"
                    element={
                        <PrivateRoute>
                            <SubscriptionDetails />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/paymentcheckout"
                    element={
                        <PrivateRoute>
                            <PaymentCheckout />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/razorpay"
                    element={
                        <PrivateRoute>
                            <Razorpay />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/subscription-success"
                    element={
                        <PrivateRoute>
                            <SubscriptionSuccess />
                        </PrivateRoute>
                    }
                />
                 <Route
                path="/admin/blogs"
                element={
                    <PrivateRoute>
                        <BlogAdmin />
                    </PrivateRoute>
                    }
                />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

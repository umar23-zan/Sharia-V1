import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
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
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
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
                </Routes>
            </div>
        </Router>
    );
};

export default App;

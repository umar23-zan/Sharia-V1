import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DeactivateAccount from './DeactivateAccount';
import { getUserData } from '../api/auth';
import axios from 'axios';
import { 
  User, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  X, 
  ChevronRight, 
  ChevronLeft,
  Trash2,
  Save
} from 'lucide-react';
const Header = lazy(() => import('./Header'));

const AccountInformationPage = () => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = useState(false);
  const [reason, setReason] = useState('Too expensive');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
  const email = localStorage.getItem('userEmail');
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [paymentMode, setPaymentMode] = useState(user?.subscription?.paymentMode || 'automatic');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [hasPendingChange, setHasPendingChange] = useState(false)
  const [pendingChangeDate, setPendingChangeDate] =useState(user?.subscription?.paymentModeChangeDate 
    ? new Date(user.subscription.paymentModeChangeDate).toLocaleDateString() 
    : null) 
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); 
  const [subscriptionStatus, setSubscriptionStatus] = useState(user.subscription?.status);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    setSubscriptionStatus(user.subscription?.status);
  }, [user.subscription?.status]);

  const showAlert = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Plan and pricing data
  const planMap = {
    free: {
      prices: { monthly: 0, annual: 0 }
    },
    basic: {
      prices: { monthly: 299, annual: 3048 }
    },
    premium: {
      prices: { monthly: 599, annual: 6110 }
    }
  };

  const defaultFeatures = {
    free: [
      'Search up to 3 stocks',
      'Basic Shariah compliance details',
      'Limited market insights',
      'No stock storage',
      'No notifications',
    ],
    basic: [
      'Search and analyze all stocks',
      'Store up to 10 stocks',
      'News notifications for stored stocks',
      'Detailed Shariah compliance metrics',
    ],
    premium: [
      'Search and analyze all stocks',
      'Store up to 25 stocks',
      'Priority news notifications',
      'Expert Shariah compliance insights',
    ],
  };
  const currentPlan = user?.subscription?.plan || 'free';
  const currentBillingCycle = user?.subscription?.billingCycle || 'monthly';
  const planPrice = planMap[currentPlan]?.prices?.[currentBillingCycle] || 0;
  const planFeatures = defaultFeatures[currentPlan] || [];
  const memberSince = user.createdAt ? new Date(user.createdAt) : new Date();
  const formattedDate = memberSince.toLocaleDateString();
  const nextBillingDate = user.nextBillingDate || '23/10/2025';
  const endDate = user?.subscription?.endDate 
  ? new Date(user.subscription.endDate).toLocaleDateString() 
  : 'N/A'

  useEffect(() => {
    if (email) {
      fetchUserData();
    }
  }, [email]);
  

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await getUserData(email);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };
console.log(user)
  useEffect(() => {
    if (user?.subscription?.pendingPaymentMode === "manual") {
      setHasPendingChange(true);
    } else {
      setHasPendingChange(false);
    }
  }, [user]); 

  const handleDeactivationSuccess = () => {
    setDeactivated(true);
    console.log("Account deactivated correctly");
    localStorage.clear();
    navigate('/signup');
  };

  if (deactivated) {
    return <div>Account deactivated successfully.</div>;
  }

  const handlePaymentModeChange = (mode) => {
    console.log(mode)
    if (hasPendingChange) {
            return;
    }
    if (user?.subscription?.paymentMode === 'automatic' && mode === 'manual') {
      // setPaymentMode(mode);
      setShowAlertModal(true);
    } else {
      setPaymentMode(mode);
    }
  };

  const confirmManualMode = (e) => {
    setPaymentMode('manual');
    setShowAlertModal(false);
  };

  const cancelManualMode = () => {
    setShowAlertModal(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      if (hasPendingChange) {
          return;
        }
      
      const response = await axios.post('/api/transaction/update-payment-mode', {
        userId: user._id,
        paymentMode,
        effectiveDate: paymentMode === 'manual' && user?.subscription?.paymentMode === 'automatic' 
          ? user?.subscription?.endDate
          : null
      });
      
      setSuccess(true);
      if (response.data.user) {
        setUser(response.data.user);
      }
      if (paymentMode === 'manual' && user?.subscription?.paymentMode === 'automatic') {
        setHasPendingChange(true);
      } else {
        setHasPendingChange(false);
      }
      
    } catch (err) {
      console.error("Error details:", err);
      setError(err.response?.data?.error || 'Failed to update payment mode');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelManualChange = async () => {
        setIsCancelling(true);
        setCancelError(null);
        setCancelSuccess(false);
        try {
          const response = await axios.post('/api/transaction/cancel-manual-payment-change', {
            userId: user._id,
          });
          if (response.data.status === 'success') {
            setHasPendingChange(false);
            setPendingChangeDate(null);
            setPaymentMode('automatic'); 
            setCancelSuccess(true);
          
          } else {
            setCancelError(response.data.error || 'Failed to cancel payment mode change.');
          }
        } catch (error) {
          console.error("Error cancelling manual payment change:", error);
          setCancelError(error.response?.data?.error || 'Failed to cancel payment mode change.');
        } finally {
          setIsCancelling(false);
        }
      };


  const handleCancelSubscription = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await axios.post('/api/transaction/cancel-subscription', {
        userId: user._id,
        subscriptionId: user?.subscription?.subscriptionId,
        reason,
        feedback
      });
      
      setIsSubmitting(false);
      setShowCancelSubscriptionModal(false);      
      setSubscriptionStatus('cancelling');
      showAlert(response.data.message, 'success');

    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           'Failed to cancel subscription. Please try again.';
      showAlert(errorMessage, 'error');
      console.error('Error cancelling subscription:', error);
    }
  };
  
  const handleManualPayment = (e) => {
    e.preventDefault();
    // Process manual payment logic here
    setShowManualPaymentModal(false);
    // Show success message or update UI
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading account information...</div>;
  }

  return (
    <div className=" min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <div className='lg:ml-20'>
            <button 
              className="group flex items-center text-gray-600 hover:text-purple-700 mb-6 transition duration-200" 
              onClick={() => navigate(-1)}
              aria-label="Go Back"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Go Back</span>
            </button>
          </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 sm:py-0 lg:px-8 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content Area */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <User size={24} className="text-purple-700" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{user.name || 'User'}</h2>
                  <p className="text-gray-600 text-sm">{user.email || email}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    active
                  </span>
                </div>
              </div>
            </div>
            
            {/* Subscription Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Plan</h2>
                <button className="text-purple-700 hover:text-purple-800 text-sm font-medium" onClick={() => {navigate('/subscriptiondetails')}}>
                  View All Plans
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-2">
                      Current Plan
                    </span>
                    <h3 className="text-lg font-bold text-purple-900">{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</h3>
                    <p className="text-purple-700 text-sm mt-1">
                      {user.autoRenew ? 'Auto-renews on ' : 'Expires on '} {endDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-900">₹{planPrice}</p>
                    <p className="text-purple-700 text-sm">per {currentBillingCycle === 'monthly' ? 'month' : 'year'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-medium mb-4">Plan Features</h3>
                <ul className="space-y-3">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Payment Information</h2>

              <div className="mb-6">
                <h3 className="font-medium mb-4">Billing Cycle</h3>
                <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-purple-50 rounded-lg p-2 mr-4">
                      <Calendar size={20} className="text-purple-700" />
                    </div>
                    <div>
                      <p className="font-medium">{currentBillingCycle === 'monthly' ? 'Monthly' : 'Annual'}</p>
                      <p className="text-gray-500 text-sm">Next billing on {endDate}</p>
                    </div>
                  </div>
                  
                </div>
              </div>

              {user?.subscription?.status === 'active' && (
            <>
            {/* Pending Payment Mode Change Banner */}
            {hasPendingChange && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start text-blue-700">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Scheduled Payment Mode Change</span>
                      <p className="text-blue-600 mt-1">
                        Your payment mode is currently set to <strong>automatic</strong>, but will change to <strong>manual</strong> when 
                        your subscription expires on <strong>{pendingChangeDate}</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelManualChange}
                    disabled={isCancelling}
                    className={`inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                      isCancelling ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Change'}
                  </button>
                </div>
              )}
              {cancelSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Payment mode change cancelled and reverted to automatic.</span>
                </div>
              )}
              {/* Cancellation Error Message */}
                {cancelError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200  rounded-lg flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{cancelError}</span>
                </div>
              )}
              {/* Payment Mode Selection */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Payment Mode</h2>
                
                <div className="space-y-4">
                  {/* Automatic Payment Option */}
                  <div 
                    className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                      (paymentMode === 'automatic' && !hasPendingChange) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={hasPendingChange ? undefined : () => handlePaymentModeChange('automatic')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        (paymentMode === 'automatic' && !hasPendingChange) ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {(paymentMode === 'automatic' && !hasPendingChange) && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium">Automatic Renewal</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Your subscription will automatically renew at the end of each billing cycle.
                        </p>
                      </div>
                      
                      <CreditCard className={`w-6 h-6 ${
                        (paymentMode === 'automatic' && !hasPendingChange) ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="mt-3 text-sm flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Convenient with no lapse in service</span>
                    </div>
                  </div>
                  
                  {/* Manual Payment Option */}
                  <div 
                    className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                      (paymentMode === 'manual' ) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={hasPendingChange ? undefined : () => handlePaymentModeChange('manual')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        (paymentMode === 'manual' ) ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {(paymentMode === 'manual' ) && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium">Manual Renewal</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          You'll receive reminders before your subscription expires. You'll need to manually process payments.
                        </p>
                      </div>
                      
                      <AlertCircle className={`w-6 h-6 ${
                        (paymentMode === 'manual' ) ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="mt-3 text-sm flex items-center text-amber-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span>Full control but requires timely action to avoid service interruption</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Success message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>
                    {paymentMode === 'manual' && user?.subscription?.paymentMode === 'automatic'
                      ? 'Payment mode will change to manual when your current subscription expires on ' + 
                        new Date(user.subscription.endDate).toLocaleDateString()
                      : 'Payment mode updated successfully!'}
                  </span>
                </div>
              )}
              
              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              
              {/* Save button */}
              {!hasPendingChange && (
                <div className='flex justify-end'>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={` flex items-center justify-center py-3 px-4 rounded-xl text-white font-medium ${
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </>
          )}

          {user?.subscription?.status !== 'active' && (
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-gray-600 mb-4">
                You need an active subscription to manage payment settings.
              </p>
              <button
                onClick={() => navigate('/subscriptiondetails')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Subscription Plans
              </button>
            </div>
          )}

{showAlertModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Payment Mode</h3>
              <button 
                onClick={cancelManualMode}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4 text-amber-600">
                <AlertCircle className="w-6 h-6 mr-2" />
                <span className="font-medium">Important Notice</span>
              </div>
              
              <p className="text-gray-700 mb-4">
                Changing to manual payment mode will cancel your automatic renewal. Your subscription will continue until it expires on <strong>{user?.subscription?.endDate ? new Date(user.subscription.endDate).toLocaleDateString() : 'N/A'}</strong>.
              </p>
              
              <p className="text-gray-700">
                After that date, you'll need to manually renew your subscription to continue using our services.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelManualMode}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Keep Automatic
              </button>
              <button
                onClick={confirmManualMode}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Switch to Manual
              </button>
            </div>
          </div>
        </div>
      )}
            </div>

            

            {/* Account Management */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Account Management</h2>
              {showNotification && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 
                                  ${notificationType === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 
                                  'bg-red-50 border-l-4 border-red-500'}`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {notificationType === 'success' ? (
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${notificationType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                        {notificationMessage}
                      </p>
                    </div>
                    <div className="ml-auto pl-3">
                      <button
                        onClick={() => setShowNotification(false)}
                        className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    ${notificationType === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' : 
                                    'text-red-500 hover:bg-red-100 focus:ring-red-600'}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
                    {/* Active subscription component */}
                  {subscriptionStatus === 'active' && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Cancel Subscription</h3>
                          <p className="text-gray-500 text-sm mt-1">
                            Your subscription will remain active until the end of your current billing period.
                          </p>
                        </div>
                        <button 
                          onClick={() => setShowCancelSubscriptionModal(true)}
                          className="text-amber-700 hover:text-amber-800 text-sm font-medium"
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  )}

                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Delete Account</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Permanently remove your account and all associated data.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowDeactivateModal(true)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
       

        {showDeactivateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <DeactivateAccount
              user={user}
              userEmail={email}
              onDeactivationSuccess={handleDeactivationSuccess}
              onCancel={() => setShowDeactivateModal(false)}
            />
            
          </div>
        </div>
      )}
      {/* Cancel Subscription Modal */}
      {showCancelSubscriptionModal && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Cancel Subscription</h3>
              <button 
                onClick={() => setShowCancelSubscriptionModal(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 flex items-start rounded-r-md mb-4">
                <AlertCircle size={20} className="text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Your subscription will remain active until {endDate}.
                </p>
              </div>
              <p className="text-gray-600 mb-4">
                Before cancelling, please note:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-start">
                  <ChevronRight size={16} className="mr-2 mt-1 text-amber-500 flex-shrink-0" />
                  You'll lose access to all premium features after {endDate}
                </li>
                <li className="flex items-start">
                  <ChevronRight size={16} className="mr-2 mt-1 text-amber-500 flex-shrink-0" />
                  No refunds are provided for partial periods
                </li>
                <li className="flex items-start">
                  <ChevronRight size={16} className="mr-2 mt-1 text-amber-500 flex-shrink-0" />
                  You can resubscribe at any time
                </li>
              </ul>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Please tell us why you're cancelling:
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                >
                  <option>Too expensive</option>
                  <option>Not using the service enough</option>
                  <option>Missing features I need</option>
                  <option>Found a better alternative</option>
                  <option>Technical issues</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback (optional):
                </label>
                <textarea
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  rows={3}
                  placeholder="Tell us how we can improve..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center"
              onClick={handleCancelSubscription}
              disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Cancel Subscription
                  </>
                )}
              </button>
              <button 
                onClick={() => setShowCancelSubscriptionModal(false)} 
                className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Keep Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      </Suspense>
    </div>
  );
};

export default AccountInformationPage;
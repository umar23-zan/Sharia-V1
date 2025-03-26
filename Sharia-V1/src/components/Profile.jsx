import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Settings, LogOut, ChevronLeft, AlertTriangle, Loader2 } from 'lucide-react';
import account from '../images/account-icon.svg'
import logo from '../images/ShariaStocks-logo/logo1.jpeg'
const Header = lazy(() => import('./Header'));
import PaymentAlertModal from './PaymentAlertModal'
import usePaymentAlert from './usePaymentAlert';
import { getUserData, uploadProfilePicture } from '../api/auth';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Uncaught error:', error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Something Went Wrong</h2>
          <p className="text-gray-600 mb-4">We're having trouble loading your profile. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
    <div className="flex flex-col items-center">
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      <p className="mt-4 text-gray-600">Loading your profile...</p>
    </div>
  </div>
);

const Profile = () => {
  const email = localStorage.getItem('userEmail')
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    if (!email) {
      setError('No email found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userData = await getUserData(email);
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // Show error toast or message
        alert('Please upload a valid image (max 5MB)');
      }
    }
  };

  const uploadPicture = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('profilePicture', selectedFile);
        formData.append('email', email)
        
        const updatedUser = await uploadProfilePicture(formData);
        
        setUser(prevUser => ({
          ...prevUser,
          profilePicture: updatedUser.profilePicture
        }));

        const existingUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        localStorage.setItem('userData', JSON.stringify({
          ...existingUserData,
          profilePicture: updatedUser.profilePicture
        }));
        
        setSelectedFile(null);
        alert('Profile picture updated successfully')
      } catch (error) {
        console.error('Profile picture upload failed', error);
        alert('Failed to upload profile picture');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const { isOpen, type, daysRemaining, amount, closeAlert } = usePaymentAlert(user);

  const isFree = user?.subscription?.plan === 'free';

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <PaymentAlertModal
          isOpen={isOpen}
          onClose={closeAlert}
          type={type}
          daysRemaining={daysRemaining}
          amount={amount}
        />
        <div className="max-w-7xl mx-auto">
          <div className="p-4">
            <button 
              className="group flex items-center text-gray-600 hover:text-purple-700 mb-6 transition duration-200" 
              onClick={() => navigate('/dashboard')}
              aria-label="Back to Dashboard"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 group">
                  <img 
                    src={previewUrl || user.profilePicture || account} 
                    alt="profile" 
                    className="w-full h-full rounded-full object-cover group-hover:opacity-70 transition"
                  />
                  <input 
                    type="file" 
                    id="profilePicture" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <label 
                    htmlFor="profilePicture"
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 cursor-pointer"
                    aria-label="Upload Profile Picture"
                  >
                    <Camera className="w-5 h-5" />
                  </label>
                </div>
                {selectedFile && (
                  <div className="flex justify-center gap-2 mt-2">
                    <button 
                      onClick={uploadPicture}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <h2 className="text-2xl font-semibold mb-1">{user?.name || 'User Name'}</h2>
                <p className="text-gray-500 mb-4">{user?.email || 'user@example.com'}</p>
                <button 
                  className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer" 
                  onClick={() => navigate('/editprofile')}
                  aria-label="Edit Profile"
                >
                  Edit Profile
                </button>
              </div>

              <div className="mt-4 bg-white rounded-2xl shadow-sm p-4">
                <h3 className="font-semibold mb-4">Quick Settings</h3>
                {[
                  { icon: '👤', title: 'Account Settings', subtitle: '', path: '/account' },
                  { icon: '🔔', title: 'Notifications', subtitle: 'Customize your alerts', badge: '', path: '/notificationpage' },
                  { icon: '💳', title: 'Payment Methods', subtitle: 'Manage your payments', path: '/paymentmethods' }
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigate(item.path, { state: { user } })}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    aria-label={item.title}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Premium Plan */}
            <div className="lg:col-span-2">
              {isFree ? (
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-xl">
                          <Settings className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold sm:text-md">Premium Plan</h2>
                          <p className="text-white/80 sm:text-md">Unlock exclusive features</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-medium hover:bg-white/90 cursor-pointer transition-colors" 
                      onClick={() => navigate('/subscriptiondetails')}
                      aria-label="Upgrade to Premium"
                    >
                      Upgrade Now
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {[
                      {
                        number: 1,
                        title: 'Real-time Alerts',
                        description: 'Get instant notifications for price changes and market movements',
                        icon: '⚡'
                      },
                      {
                        number: 2,
                        title: 'Portfolio Analytics',
                        description: 'Advanced insights and performance tracking with detailed metrics',
                        icon: '📊'
                      },
                      {
                        number: 3,
                        title: 'Expert Reports',
                        description: 'Comprehensive shariah compliance analysis and recommendations',
                        icon: '📑'
                      }
                    ].map((feature) => (
                      <div key={feature.number} className="flex gap-4 p-4 bg-white/10 rounded-xl">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-1">{feature.title}</h3>
                          <p className="text-white/80">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-xl">
                          <Settings className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold sm:text-md">Plan Details</h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {[
                      {
                        number: 1,
                        title: 'Plan',
                        description: `${user.subscription.plan}`,
                        icon: '⚡'
                      },
                      {
                        number: 2,
                        title: 'Status',
                        description: `${user.subscription.status}`,
                        icon: '📊'
                      },
                      {
                        number: 3,
                        title: 'Billing Cycle',
                        description: `${user.subscription.billingCycle}`,
                        icon: '📑'
                      },
                    ].map((feature) => (
                      <div key={feature.number} className="flex gap-4 p-4 bg-white/10 rounded-xl">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-1">{feature.title}</h3>
                          <p className="text-white/80">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={handleLogout}
                className="w-full mt-4 p-4 border-2 border-red-50 border-solid bg-white rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                aria-label="Log Out"
              >
                <LogOut className="w-5 h-5" />
                Log Out of Account
              </button>
            </div>
          </div>
        </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default Profile;
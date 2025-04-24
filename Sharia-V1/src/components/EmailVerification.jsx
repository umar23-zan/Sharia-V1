import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tokenverify, verify, resendVerification } from '../api/auth';
import logo from '../images/ShariaStocks-logo/ShariaStocks1.png';
import { Check, X, Mail, Loader, RefreshCw } from 'lucide-react';
import Footer from './Footer'

const EmailVerification = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, loading, success, error
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('idle'); // idle, loading, success, error
  const [resendMessage, setResendMessage] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        setVerificationStatus('loading');
        const res = await tokenverify(token)
        setMessage("Click below to verify your email.");
        setVerificationStatus('pending');
      } catch (error) {
        setMessage("Invalid or expired token.");
        setVerificationStatus('error');
      }
    };

    checkToken();
  }, [token]);

  const handleVerification = async () => {
    if (!token) {
      setMessage('No verification token found. Please check your email link.'); 
      setVerificationStatus('error');
      return;
    }

    try {
      setVerificationStatus('loading');
      const response = await verify(token);
      setMessage(response.data || 'Email verified successfully!');
      setVerificationStatus('success');
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error('Verification error:', error);
      setMessage(error.response?.data?.msg || 'Verification failed. The link may be invalid or expired.');
      setVerificationStatus('error');
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    if (!resendEmail) {
      setResendMessage('Please enter your email address');
      setResendStatus('error');
      return;
    }

    try {
      setResendStatus('loading');
      await resendVerification(resendEmail);
      setResendMessage('Verification email has been sent to your inbox!');
      setResendStatus('success');
      
      // Hide the form after successful resend
      setTimeout(() => {
        setShowResendForm(false);
        setResendStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Resend verification error:', error);
      setResendMessage(error.message || 'Failed to resend verification email');
      setResendStatus('error');
    }
  };

  const renderIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <Check size={64} className="text-green-500" data-testid="success-icon" />;
      case 'error':
        return <X size={64} className="text-red-500" data-testid="error-icon" />;
      case 'loading':
        return <Loader size={64} className="text-indigo-500 animate-spin" data-testid="loading-icon" />;
      default:
        return <Mail size={64} className="text-indigo-500" data-testid="mail-icon" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50" data-testid="email-verification-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-80 mx-auto h-auto rounded-lg mb-6" data-testid="company-logo" />
          
          <div className="flex justify-center mb-6">
            {renderIcon()}
          </div>
          
          {verificationStatus === 'pending' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4" data-testid="verification-title">Verify Your Email</h2>
              {token ? (
                <>
                  <p className="text-gray-600 mb-6" data-testid="verification-message">
                    Please click the button below to verify your email address and activate your account.
                  </p>
                  <button
                    onClick={handleVerification}
                    className="w-full py-3.5 px-4 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    data-testid="verify-button"
                  >
                    Verify Email
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6" data-testid="check-inbox-message">
                    We've sent a verification link to your email address. Please check your inbox and click on the link to verify your account.
                  </p>
                  <p className="text-gray-600 mb-6" data-testid="check-spam-message">
                    If you don't see the email, please check your spam folder.
                  </p>
                </>
              )}
            </>
          )}

          {verificationStatus === 'loading' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4" data-testid="verifying-title">Verifying Your Email</h2>
              <p className="text-gray-600" data-testid="verifying-message">Please wait while we verify your email address...</p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4" data-testid="verify-email">Email Verified!</h2>
              <p className="text-gray-600 mb-6" data-testid="success-message">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 px-4 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                data-testid="proceed-to-login-button"
              >
                Proceed to Login
              </button>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4" data-testid="verify-fail">Verification Failed</h2>
              <p className="text-gray-600 mb-6" data-testid="error-message">{message}</p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full py-3.5 px-4 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  data-testid="try-signup-again-button"
                >
                  Try Signing Up Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3.5 px-4 bg-white text-indigo-500 font-medium rounded-lg border border-indigo-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  data-testid="return-home-button"
                >
                  Return to Home
                </button>
              </div>
            </>
          )}
        </div>

        {(verificationStatus === 'pending' || verificationStatus === 'error') && (
          <div className="mt-8" data-testid="resend-section">
            {!showResendForm ? (
              <div className="text-center">
                <p className="text-gray-600">
                  Didn't receive the email?
                  <button
                    className="ml-1 font-medium text-indigo-500 hover:text-indigo-700 focus:outline-none"
                    onClick={() => setShowResendForm(true)}
                    data-testid="resend-link"
                  >
                    Resend verification email
                  </button>
                </p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" data-testid="resend-form-container">
                <h3 className="text-lg font-semibold mb-4" data-testid="resend-form-title">Resend Verification Email</h3>
                
                {resendStatus === 'success' && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center" data-testid="resend-success-message">
                    <Check size={18} className="mr-2" /> {resendMessage}
                  </div>
                )}
                
                {resendStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center" data-testid="resend-error-message">
                    <X size={18} className="mr-2" /> {resendMessage}
                  </div>
                )}
                
                <form onSubmit={handleResendVerification} data-testid="resend-form">
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" data-testid="email-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={resendStatus === 'loading'}
                      data-testid="email-input"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex justify-center items-center"
                      disabled={resendStatus === 'loading'}
                      data-testid="resend-submit-button"
                    >
                      {resendStatus === 'loading' ? (
                        <>
                          <RefreshCw size={18} className="mr-2 animate-spin" data-testid="loading-icon-resend" /> Sending...
                        </>
                      ) : (
                        'Resend Email'
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowResendForm(false)}
                      className="py-2 px-4 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      data-testid="cancel-resend-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EmailVerification;
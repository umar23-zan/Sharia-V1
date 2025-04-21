import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tokenverify, verify, resendVerification } from '../api/auth';
import logo from '../images/ShariaStocks-logo/ShariaStocks1.png';
import { Check, X, Mail, Loader, RefreshCw } from 'lucide-react';

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
        return <Check size={64} className="text-green-500" />;
      case 'error':
        return <X size={64} className="text-red-500" />;
      case 'loading':
        return <Loader size={64} className="text-indigo-500 animate-spin" />;
      default:
        return <Mail size={64} className="text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-80 mx-auto h-auto rounded-lg mb-6" />
          
          <div className="flex justify-center mb-6">
            {renderIcon()}
          </div>
          
          {verificationStatus === 'pending' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h2>
              {token ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Please click the button below to verify your email address and activate your account.
                  </p>
                  <button
                    onClick={handleVerification}
                    className="w-full py-3.5 px-4 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Verify Email
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    We've sent a verification link to your email address. Please check your inbox and click on the link to verify your account.
                  </p>
                  <p className="text-gray-600 mb-6">
                    If you don't see the email, please check your spam folder.
                  </p>
                </>
              )}
            </>
          )}

          {verificationStatus === 'loading' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Your Email</h2>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4" data-testid="verify-email">Email Verified!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 px-4 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Proceed to Login
              </button>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4" data-testid="verify-fail">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full py-3.5 px-4 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Try Signing Up Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3.5 px-4 bg-white text-indigo-500 font-medium rounded-lg border border-indigo-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </>
          )}
        </div>

        {(verificationStatus === 'pending' || verificationStatus === 'error') && (
          <div className="mt-8">
            {!showResendForm ? (
              <div className="text-center">
                <p className="text-gray-600">
                  Didn't receive the email?
                  <button
                    className="ml-1 font-medium text-indigo-500 hover:text-indigo-700 focus:outline-none"
                    onClick={() => setShowResendForm(true)}
                  >
                    Resend verification email
                  </button>
                </p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Resend Verification Email</h3>
                
                {resendStatus === 'success' && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center">
                    <Check size={18} className="mr-2" /> {resendMessage}
                  </div>
                )}
                
                {resendStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center">
                    <X size={18} className="mr-2" /> {resendMessage}
                  </div>
                )}
                
                <form onSubmit={handleResendVerification}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex justify-center items-center"
                      disabled={resendStatus === 'loading'}
                    >
                      {resendStatus === 'loading' ? (
                        <>
                          <RefreshCw size={18} className="mr-2 animate-spin" /> Sending...
                        </>
                      ) : (
                        'Resend Email'
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowResendForm(false)}
                      className="py-2 px-4 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
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
    </div>
  );
};

export default EmailVerification;
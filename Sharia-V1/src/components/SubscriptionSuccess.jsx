import React from 'react';
import Header from './Header';
import { useLocation, Link } from 'react-router-dom';

const SubscriptionSuccess = () => {
  const location = useLocation();
  const { transactionId } = location.state || {};

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="bg-gray-100 flex-grow flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Subscription Successful!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for subscribing to our plan. Your payment has been processed successfully.
          </p>
          {transactionId && (
            <p className="text-sm text-gray-500 mb-4">
              Transaction ID: <span className="font-medium">{transactionId}</span>
            </p>
          )}
          <Link to="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go to Dashboard
          </Link>
          <p className="mt-4 text-xs text-gray-500">
            If you have any questions, please contact our <a href="#" className="text-blue-500">support team</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
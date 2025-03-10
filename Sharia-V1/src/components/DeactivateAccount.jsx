import React, { useState } from 'react';
import { AlertCircle, Lock, AlertTriangle } from 'lucide-react';

const DeactivateAccount = ({ userEmail, onDeactivationSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleInitialSubmit = () => {
    if (!password) {
      setError('Please enter your password to continue');
      return;
    }
    setConfirmDialog(true);
  };

  const handleDeactivate = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/deactivate/${userEmail}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onDeactivationSuccess(); // Call the success callback
      } else {
        const data = await response.json();
        setError(data.msg || 'An error occurred.');
        setConfirmDialog(false); // Return to password entry on error
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setConfirmDialog(false); // Return to password entry on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-center mb-6">
        <AlertTriangle className="text-red-500 mr-2" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Deactivate Account</h2>
      </div>

      {!confirmDialog ? (
        <>
          <div className="mb-6 p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-gray-700 leading-relaxed">
              Deactivating your account will remove all your data and cannot be undone. 
              Any subscriptions or memberships will be canceled immediately.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
              <AlertCircle className="mr-2" size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="password">
              Confirm your password to continue
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleInitialSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-700 font-medium mb-2">Are you absolutely sure?</p>
            <p className="text-gray-700">
              This will permanently delete your account for <strong>{userEmail}</strong> and all associated data.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setConfirmDialog(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Go Back
            </button>
            <button
              onClick={handleDeactivate}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deactivating...
                </>
              ) : (
                "Yes, Deactivate My Account"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeactivateAccount;
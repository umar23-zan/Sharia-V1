import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Shield, X } from 'lucide-react';

const SubscriptionModal = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-testid="subscription-confirmation-modal">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Subscribe to Premium</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Premium Benefits</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-2">
                <li>• Unlimited stock views</li>
                <li>• Detailed financial analysis</li>
                <li>• Real-time alerts</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={onSubscribe}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <CreditCard className="w-5 h-5" />
          <span>Subscribe Now</span>
        </button>
      </div>
    </div>
  );
};

export default SubscriptionModal
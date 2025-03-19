import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, XCircle, X } from 'lucide-react';


const PaymentAlertModal = ({ 
  isOpen, 
  onClose, 
  type = 'pastDue',
  daysRemaining,
  amount
}) => {
  if (!isOpen) return null;
  
  
  const alertConfig = {
    pastDue: {
      title: "Payment Past Due",
      message: `Your subscription payment of ₹${amount} is past due. Please clear your dues to continue enjoying premium features.`,
      icon: <AlertCircle className="w-8 h-8 text-red-500" />,
      color: "border-red-500 bg-red-50"
    },
    expiringSoon: {
      title: "Subscription Expiring Soon",
      message: `Your premium subscription expires in ${daysRemaining} days. Please renew to avoid interruption.`,
      icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
      color: "border-amber-500 bg-amber-50"
    },
    paymentFailed: {
      title: "Payment Failed",
      message: `We couldn't process your recent payment of ₹${amount}. Please update your payment method.`,
      icon: <XCircle className="w-8 h-8 text-red-500" />,
      color: "border-red-500 bg-red-50"
    }
  };

  const config = alertConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-70 backdrop-blur-sm">
      <div className={`relative w-full max-w-md p-6 rounded-xl shadow-lg bg-white border-l-4 ${config.color}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {config.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{config.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{config.message}</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  // Navigate to payment page based on type
                  window.location.href = type === 'expiringSoon' 
                    ? '/subscriptiondetails' 
                    : '/paymentmethods';
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {type === 'expiringSoon' ? 'Renew Now' : 'Update Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAlertModal;
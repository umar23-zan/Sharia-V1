import React from 'react';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const PaymentModeSelector = ({ selected, onChange }) => {
  return (
    <div className="mt-6" data-testid="payment-mode-selector">
      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
      
      <div className="space-y-4">
        {/* Automatic Payment Option */}
        <div 
          className={`p-4 border rounded-xl cursor-pointer transition-colors ${
            selected === 'automatic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => onChange('automatic')}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selected === 'automatic' ? 'border-blue-500' : 'border-gray-300'
            }`}>
              {selected === 'automatic' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
            </div>
            
            <div className="ml-3 flex-1">
              <h4 className="font-medium">Automatic Renewal</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your subscription will automatically renew at the end of each billing cycle.
              </p>
            </div>
            
            <CreditCard className={`w-6 h-6 ${
              selected === 'automatic' ? 'text-blue-500' : 'text-gray-400'
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
            selected === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => onChange('manual')}
          data-testid="manual-payment-option"
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selected === 'manual' ? 'border-blue-500' : 'border-gray-300'
            }`}>
              {selected === 'manual' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
            </div>
            
            <div className="ml-3 flex-1">
              <h4 className="font-medium">Manual Renewal</h4>
              <p className="text-sm text-gray-600 mt-1">
                You'll receive reminders before your subscription expires. You'll need to manually process payments.
              </p>
            </div>
            
            <AlertCircle className={`w-6 h-6 ${
              selected === 'manual' ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
          
          <div className="mt-3 text-sm flex items-center text-amber-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>Full control but requires timely action to avoid service interruption</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p>
          <strong>Note:</strong> You can change your payment method anytime from your profile settings.
        </p>
      </div>
    </div>
  );
};

export default PaymentModeSelector;
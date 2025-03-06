import React, { useState } from 'react';
import Header from './Header';
import { useNavigate, useLocation } from 'react-router-dom';

const Razorpay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedPlan,
    billingCycle,
    totalPrice,
    planPrice,
    tax,
    planFeatures
  } = location.state || {};
  const [selectedPayment, setSelectedPayment] = useState('debit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    setIsPaying(true);
    setPaymentError('');

    const cardDetails = {
      cardNumber,
      expiry: expiryDate,
      cvv,
      cardholderName,
    };

   
    const userId =localStorage.getItem('userId'); 

    const payload = {
      userId,
      plan: selectedPlan,
      amount: totalPrice,
      cardDetails,
      billingCycle,
    };

    try {
      const response = await fetch('/api/transaction/subscribe', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setPaymentError(data.error || 'Payment failed');
      } else {
        console.log('Payment successful:', data);
        
        navigate('/subscription-success', { state: { transactionId: data.transactionId } }); 
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setPaymentError('An error occurred during payment. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };


  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="bg-gray-100 flex-grow flex justify-center items-start p-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-6">
          <div className="flex flex-col md:flex-row gap-6">

            
            <div className="w-full md:w-1/2 border-r pr-6">
              <div className="mb-6">
                <p className="font-medium mb-4">Select a payment method</p>

                <div className={`flex items-center p-3 border rounded-lg mb-3 cursor-pointer ${selectedPayment === 'debit' ? 'border-blue-500' : ''}`} onClick={() => setSelectedPayment('debit')}>
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Debit Card</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard, Rupay</p>
                  </div>
                </div>

                <div className={`flex items-center p-3 border rounded-lg mb-3 cursor-pointer ${selectedPayment === 'credit' ? 'border-blue-500' : ''}`} onClick={() => setSelectedPayment('credit')}>
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Credit Card</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard</p>
                  </div>
                </div>

                <div className={`flex items-center p-3 border rounded-lg mb-3 cursor-pointer ${selectedPayment === 'netbanking' ? 'border-blue-500' : ''}`} onClick={() => setSelectedPayment('netbanking')}>
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <path d="M9 16h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Netbanking</p>
                    <p className="text-sm text-gray-500">Pay with Internet Banking Account</p>
                  </div>
                </div>

                <div className={`flex items-center p-3 border rounded-lg mb-3 cursor-pointer ${selectedPayment === 'wallet' ? 'border-blue-500' : ''}`} onClick={() => setSelectedPayment('wallet')}>
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M16 12h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Wallet</p>
                    <p className="text-sm text-gray-500">Pay using a Wallet</p>
                  </div>
                </div>

                <div className={`flex items-center p-3 border rounded-lg cursor-pointer ${selectedPayment === 'upi' ? 'border-blue-500' : ''}`} onClick={() => setSelectedPayment('upi')}>
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-gray-500">Pay using BHIM, Tez and other UPI apps</p>
                  </div>
                </div>
              </div>
            </div>

         
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <p className="text-gray-600 text-sm">Amount payable is</p>
                <p className="text-lg font-medium">₹{totalPrice}</p>
                <div className="h-1 w-10 bg-blue-500 mt-1"></div>
              </div>

              {selectedPayment === 'debit' || selectedPayment === 'credit' ? ( 
                <div>
                  <div className="mb-6">
                    <p className="font-medium mb-4">Pay with {selectedPayment === 'debit' ? 'Debit' : 'Credit'} Card</p>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>

                    <div className="flex space-x-4 mb-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <input
                          type="text"
                          className="w-full border rounded-md p-2"
                          placeholder="MM / YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input
                          type="text"
                          className="w-full border rounded-md p-2"
                          placeholder="***"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Cardholder's Name</label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="Name on card"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                      />
                    </div>

                    {paymentError && <p className="text-red-500 text-sm mb-3">{paymentError}</p>}

                    <button
                      onClick={handlePayment}
                      className="w-full bg-blue-500 text-white py-3 rounded-md font-medium"
                      disabled={isPaying}
                    >
                      {isPaying ? 'Processing Payment...' : 'Pay Now'}
                    </button>
                  </div>
                </div>
              ) : selectedPayment === 'netbanking' ? (
                <div>
                    <p className="font-medium mb-4">Pay with Netbanking</p>
                    <p className="text-sm text-gray-500 mb-4">Redirecting to Netbanking...</p>
                    <button className="w-full bg-blue-500 text-white py-3 rounded-md font-medium" disabled>Pay Now (Netbanking - Mocked)</button>
                </div>
              ) : selectedPayment === 'wallet' ? (
                <div> 
                    <p className="font-medium mb-4">Pay with Wallet</p>
                    <p className="text-sm text-gray-500 mb-4">Select your wallet provider...</p>
                    <button className="w-full bg-blue-500 text-white py-3 rounded-md font-medium" disabled>Pay Now (Wallet - Mocked)</button>
                </div>
              ) : selectedPayment === 'upi' ? (
                <div>
                    <p className="font-medium mb-4">Pay with UPI</p>
                    <p className="text-sm text-gray-500 mb-4">Enter your UPI ID...</p>
                    <button className="w-full bg-blue-500 text-white py-3 rounded-md font-medium" disabled>Pay Now (UPI - Mocked)</button>
                </div>
              ) : null}

            </div>
          </div>

        
          <div className="border-t mt-6 pt-6">
            <div className="flex items-center mb-3">
              <img src="https://logo.clearbit.com/visa.com" alt="Visa" className="w-12 h-6 mr-2" />
              <img src="https://logo.clearbit.com/mastercard.com" alt="Mastercard" className="w-10 h-10 mr-2" />
              <img src="https://logo.clearbit.com/rupay.co.in" alt="RuPay" className="w-12 h-10 mr-2" />
            </div>
            <p className="text-sm text-gray-500">
              Accept, process and disburse digital payments for your business.
              <a href="#" className="text-blue-500 ml-1">Know more.</a>
            </p>
            <div className="flex items-center mt-3">
              <img src="https://logo.clearbit.com/razorpay.com" alt="Razorpay" className='w-10 h-10' />
              <span>Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Razorpay;
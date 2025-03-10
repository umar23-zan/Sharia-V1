import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useNavigate, useLocation } from 'react-router-dom';

const Razorpay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [planDetails, setPlanDetails] = useState({});
  const [selectedPayment, setSelectedPayment] = useState('debit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Get information from location state if available
    if (location.state) {
      const {
        selectedPlan,
        billingCycle,
        totalPrice,
        planPrice,
        tax,
        planFeatures
      } = location.state;
      
      setPlanDetails({
        selectedPlan,
        billingCycle,
        totalPrice,
        planPrice,
        tax,
        planFeatures
      });
    }

    const checkUserStatus = async () => {
      try {
        // First check if user has an active subscription
        const subResponse = await fetch(`/api/transaction/subscription-status/${userId}`);
        if (subResponse.ok) {
          const subData = await subResponse.json();
          if (subData.hasActiveSubscription) {
            setCurrentSubscription(subData);
          }
        }

        // Then check for pending transactions
        const pendingResponse = await fetch(`/api/transaction/pending/${userId}`);
        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json();
          setPendingTransaction(pendingData);
          
          // If we don't have plan details from location.state, use the pending transaction
          if (!location.state) {
            setPlanDetails({
              selectedPlan: pendingData.plan,
              billingCycle: pendingData.billingCycle,
              totalPrice: pendingData.amount
            });
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [userId, location.state]);

  
  const initiateTransaction = async () => {
    // If we already have a pending transaction, return its ID
    if (pendingTransaction) return pendingTransaction.transactionId;
    
    try {
      const response = await fetch('/api/transaction/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          plan: planDetails.selectedPlan,
          amount: planDetails.totalPrice,
          billingCycle: planDetails.billingCycle,
        }),
      });

      const data = await response.json();
      console.log("Initiate response:", data);
      
      // Handle subscription already active response
      if (response.status === 400 && data.error === "Subscription already active") {
        setCurrentSubscription({
          hasActiveSubscription: true,
          plan: data.currentPlan,
          formattedEndDate: data.endDate
        });
        setShowUpgradeConfirm(false);
        return null;
      }
      
      // Handle upgrade available response
      if (response.status === 200 && data.status === 'upgrade_available') {
        setCurrentSubscription({
          hasActiveSubscription: true,
          plan: data.currentPlan,
          billingCycle: data.currentCycle,
          formattedEndDate: data.endDate
        });
        setShowUpgradeConfirm(true);
        return null;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate transaction');
      }
      
      // Successfully initiated a new transaction
      setPendingTransaction({
        transactionId: data.transactionId,
        plan: planDetails.selectedPlan,
        amount: planDetails.totalPrice,
        billingCycle: planDetails.billingCycle,
      });
      
      return data.transactionId;
    } catch (error) {
      console.error('Error initiating transaction:', error);
      setPaymentError('Failed to initiate transaction. Please try again.');
      return null;
    }
  };

  const handlePayment = async () => {
    setIsPaying(true);
    setPaymentError('');

    try {
      // First initiate or get transaction ID
      let transactionId = await initiateTransaction();
      
      // If we get no transaction ID and an upgrade is required
      if (!transactionId && showUpgradeConfirm) {
        // Try to confirm the upgrade
        transactionId = await confirmUpgradeAndGetTransactionId();
        if (!transactionId) {
          setIsPaying(false);
          return;
        }
      }
      
      // If no transaction ID for other reasons
      if (!transactionId) {
        throw new Error('Could not get transaction ID');
      }

      const cardDetails = {
        cardNumber,
        expiry: expiryDate,
        cvv,
        cardholderName,
      };

      // Process the payment
      const response = await fetch('/api/transaction/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          transactionId,
          cardDetails,
          isUpgrade
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPaymentError(data.error || 'Payment failed');
      } else {
        console.log('Payment successful:', data);
        navigate('/subscription-success', { 
          state: { 
            transactionId: data.transactionId,
            isUpgrade: data.isUpgrade,
            plan: data.plan,
            billingCycle: data.billingCycle
          }
        });
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setPaymentError('An error occurred during payment. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  // New function that confirms upgrade and returns the transaction ID
  const confirmUpgradeAndGetTransactionId = async () => {
    setIsUpgrade(true);
    
    try {
      const response = await fetch('/api/transaction/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          plan: planDetails.selectedPlan,
          amount: planDetails.totalPrice,
          billingCycle: planDetails.billingCycle,
          confirmUpgrade: true // Add flag to indicate this is a confirmed upgrade
        }),
      });

      const data = await response.json();
      console.log("Upgrade response:", data);

      if (response.ok && data.transactionId) {
        setPendingTransaction({
          transactionId: data.transactionId,
          plan: planDetails.selectedPlan,
          amount: planDetails.totalPrice,
          billingCycle: planDetails.billingCycle,
        });
        return data.transactionId;
      } else {
        throw new Error(data.error || 'Failed to initiate upgrade transaction');
      }
    } catch (error) {
      console.error('Error initiating upgrade:', error);
      setPaymentError('Failed to start subscription change. Please try again.');
      return null;
    }
  };

  const confirmUpgrade = async () => {
    setIsUpgrade(true);
    setShowUpgradeConfirm(false);
    
    try {
      const transactionId = await confirmUpgradeAndGetTransactionId();
      if (transactionId) {
        // Continue with the payment flow or show the payment form
        // This function no longer needs to handle the transaction creation directly
      }
    } catch (error) {
      console.error('Error during confirmation:', error);
      setPaymentError('Failed to confirm the subscription change. Please try again.');
    }
  };

  const cancelPendingTransaction = async () => {
    if (!pendingTransaction) return;
    
    try {
      await fetch(`/api/transaction/cancel/${pendingTransaction.transactionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setPendingTransaction(null);
      navigate('/pricing'); // Redirect to pricing page
    } catch (error) {
      console.error('Error cancelling transaction:', error);
    }
  };

  const goBack = () => {
    navigate('/pricing');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="bg-gray-100 flex-grow flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg">Loading payment information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show message if user has the same subscription already
  if (currentSubscription?.hasActiveSubscription && !showUpgradeConfirm && !isUpgrade && 
      currentSubscription.plan === planDetails.selectedPlan && 
      currentSubscription.billingCycle === planDetails.billingCycle) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="bg-gray-100 flex-grow flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-md w-full max-w-xl p-8 m-4">
            <h2 className="text-xl font-semibold mb-4">Subscription Already Active</h2>
            <p className="mb-6">
              You already have an active {currentSubscription.plan} subscription on a {currentSubscription.billingCycle} billing cycle, 
              valid until {currentSubscription.formattedEndDate}.
            </p>
            <p className="text-gray-600 mb-6">
              There's no need to subscribe to the same plan again.
            </p>
            <div className="flex justify-end">
              <button
                onClick={goBack}
                className="bg-blue-500 text-white py-2 px-6 rounded-md font-medium"
              >
                Return to Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show confirmation for changing subscription
  if (showUpgradeConfirm) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="bg-gray-100 flex-grow flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-md w-full max-w-xl p-8 m-4">
            <h2 className="text-xl font-semibold mb-4">Change Subscription Plan?</h2>
            <p className="mb-4">
              You currently have an active <span className="font-medium">{currentSubscription.plan} plan</span> on a <span className="font-medium">{currentSubscription.billingCycle} billing cycle</span>, 
              valid until {currentSubscription.formattedEndDate}.
            </p>
            <p className="mb-6">
              You're about to change to a <span className="font-medium">{planDetails.selectedPlan} plan</span> on a <span className="font-medium">{planDetails.billingCycle} billing cycle</span>.
            </p>
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md mb-6">
              <p className="text-yellow-800">
                Note: This will replace your current subscription immediately. Any remaining time on your current subscription will be forfeited.
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={goBack}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpgrade}
                className="bg-blue-500 text-white py-2 px-6 rounded-md font-medium"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we have no plan details and no pending transaction, navigate back to pricing
  if (!planDetails.selectedPlan && !pendingTransaction) {
    navigate('/pricing');
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="bg-gray-100 flex-grow flex justify-center items-start p-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-6">
          {/* Upgrade notification */}
          {isUpgrade && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <div className="mr-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Subscription Change</h3>
                  <p className="text-sm text-blue-600">
                    You're changing from {currentSubscription.plan} ({currentSubscription.billingCycle}) to {planDetails.selectedPlan} ({planDetails.billingCycle}).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pending transaction notification */}
          {pendingTransaction && !isUpgrade && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-blue-800">Pending Transaction Found</h3>
                  <p className="text-sm text-blue-600">
                    You have an incomplete payment for {pendingTransaction.plan} {pendingTransaction.billingCycle} plan.
                  </p>
                  <p className="text-sm text-blue-600">
                    Amount: ₹{pendingTransaction.amount}
                  </p>
                </div>
                <button 
                  onClick={cancelPendingTransaction}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel and select new plan
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Payment method selection column */}
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

            {/* Payment details section */}
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <p className="text-gray-600 text-sm">Amount payable is</p>
                <p className="text-lg font-medium">₹{planDetails.totalPrice || pendingTransaction?.amount}</p>
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

          {/* Footer section */}
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
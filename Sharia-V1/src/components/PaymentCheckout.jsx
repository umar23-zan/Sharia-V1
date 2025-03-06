import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

const PaymentCheckout = () => {
    const [selectedCard, setSelectedCard] = useState('visa');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const location = useLocation();
    const navigate = useNavigate();

    const { selectedPlan, billingCycle, totalPrice, planPrice, tax, planFeatures } = location.state || {};

    const planName = selectedPlan === 'basic' ? 'Basic Plan' : selectedPlan === 'premium' ? 'Premium Plan' : 'Unknown Plan';
    const cycleDisplay = billingCycle === 'annual' ? 'annual' : 'monthly';
    const displayPlanPrice = planPrice !== undefined ? planPrice : 599;
    const displayTax = tax !== undefined ? tax.toFixed(0) : 108;
    const displayTotalPrice = totalPrice !== undefined ? totalPrice.toFixed(0) : 707;
    const displayPlanFeatures = planFeatures || [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4"
    ];
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Format card number with spaces
    const formatCardNumber = (value) => {
        return value
            .replace(/\s/g, '')
            .match(/.{1,4}/g)
            ?.join(' ')
            .substr(0, 19) || '';
    };

    // **SIMULATED** updateSubscription function - REPLACE with actual API call
    const updateSubscription = async (plan, cycle, transactionId) => {
        console.log('**SIMULATED** Subscription updated:', { plan, cycle, transactionId });
        // **REAL APP TODO:** Make an API call to your backend to update the subscription in the database.
        // Example: await fetch('/api/update-subscription', { ... });
        return new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay
    };

    // Handle payment submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentError('');
        setLoading(true);

        if (paymentMethod === 'card') {
            // Basic form validation
            if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
                setPaymentError('Please fill in all card details.');
                setLoading(false);
                return;
            }
        } else if (paymentMethod === 'upi') {
            // UPI payment logic would go here if implemented
            // For now, just simulate success for UPI if selected (or implement UPI form)
            console.log('**SIMULATED** UPI payment processing');
        }


        try {
            // **SIMULATED** payment processing - REPLACE with actual payment gateway integration
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate a mock transaction ID
            const transactionId = 'txn_' + Math.random().toString(36).substr(2, 9);

            // **SIMULATED** backend subscription update - REPLACE with actual API call
            await updateSubscription(selectedPlan, billingCycle, transactionId);

            setPaymentSuccess(true);
            setLoading(false);
            setPaymentError('');

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            setPaymentError('Payment processing failed. Please try again.');
            console.error('Payment error:', error);
        } finally {
            if (!paymentSuccess) {
                setLoading(false);
            }
        }
    };

    if (!selectedPlan || !billingCycle) {
        return (
            <div className="p-12 text-center">
                <p className="text-red-500">Invalid payment data. Please select a plan first.</p>
                <button
                    onClick={() => navigate('/subscriptiondetails')}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                    Back to Plans
                </button>
            </div>
        );
    }


    return (
        <div className="font-sans max-w-7xl mx-auto">
            {/* Header */}
            <Header />
            <div className="bg-purple-600 text-white p-6 ">
                <h1 className="text-xl font-bold mb-6">Complete Your Purchase</h1>

                {/* Progress Steps */}
                <div className="flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-purple-600 font-medium">1</div>
                    <div className="h-1 bg-white/50 flex-grow mx-2"></div>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-purple-600 font-medium">2</div>
                    <div className="h-1 bg-white/50 flex-grow mx-2"></div>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/50 text-white font-medium">3</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white p-6 rounded-b-lg border border-gray-200">
                {/* Payment Method Selection */}
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <div className="flex gap-4 mb-6">
                    <button
                        className={`flex-1 py-3 px-4 border rounded-lg flex items-center justify-center hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${paymentMethod === 'card' ? 'border-purple-600 text-purple-600 font-semibold' : 'border-gray-300 text-gray-600'}`}
                        onClick={() => setPaymentMethod('card')}
                    >
                        <span className="mr-2">💳</span> Card
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 border rounded-lg flex items-center justify-center hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${paymentMethod === 'upi' ? 'border-purple-600 text-purple-600 font-semibold' : 'border-gray-300 text-gray-600'}`}
                        onClick={() => setPaymentMethod('upi')}
                    >
                        <span className="mr-2">📱</span> UPI (Simulated) {/* Make UPI simulated clear */}
                    </button>
                </div>

                {/* Payment Form - Card */}
                {paymentMethod === 'card' && (
                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        <div className="space-y-4 mb-6">
                            <div
                                className={`p-4 border rounded-lg flex items-center hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer ${selectedCard === 'visa' ? 'border-purple-600' : 'border-gray-200'}`}
                                onClick={() => setSelectedCard('visa')}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <span className="text-blue-600 font-bold mr-3">VISA</span>
                                        <span className="text-gray-800">•••• •••• •••• 4242</span>
                                    </div>
                                    <div className="text-sm text-gray-600">Expires 12/25</div>
                                </div>
                                {selectedCard === 'visa' && (
                                    <div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div
                                className={`p-4 border rounded-lg flex items-center hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer ${selectedCard === 'mastercard' ? 'border-purple-600' : 'border-gray-200'}`}
                                onClick={() => setSelectedCard('mastercard')}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <div className="mr-3">
                                            <div className="flex">
                                                <div className="h-6 w-6 rounded-full bg-red-500 opacity-80"></div>
                                                <div className="h-6 w-6 rounded-full bg-yellow-500 opacity-80 -ml-3"></div>
                                            </div>
                                        </div>
                                        <span className="text-gray-800">•••• •••• •••• 5678</span>
                                    </div>
                                    <div className="text-sm text-gray-600">Expires 08/24</div>
                                </div>
                                {selectedCard === 'mastercard' && (
                                    <div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <button type="button" className="text-purple-600 flex items-center text-sm hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add new card (Simulated) {/* Make "add new card" simulated clear */}
                            </button>
                        </div>

                        {/* Card Input Form */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={(e) => handleInputChange(e)}
                                    onInput={(e) => e.target.value = formatCardNumber(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-50 sm:text-sm px-3 py-2" // Added px-3 py-2 for padding
                                    placeholder="Enter card number" // Added placeholder
                                />
                            </div>
                            <div>
                                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Name on Card</label>
                                <input
                                    type="text"
                                    id="cardName"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-50 sm:text-sm px-3 py-2" // Added px-3 py-2 for padding
                                    placeholder="Name as on card" // Added placeholder
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input
                                    type="text"
                                    id="expiryDate"
                                    name="expiryDate"
                                    placeholder="MM/YY"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-50 sm:text-sm px-3 py-2" // Added px-3 py-2 for padding
                                />
                            </div>
                            <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                                <input
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-50 sm:text-sm px-3 py-2" // Added px-3 py-2 for padding
                                />
                            </div>
                        </div>
                    </form>
                )}

                {/* Pricing Details */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{displayPlanPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <div className="flex items-center text-gray-600">
                            <span>GST (18%)</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-medium">₹{displayTax}</span>
                    </div>
                    <div className="flex justify-between mt-4 font-bold">
                        <span>Total</span>
                        <span>₹{displayTotalPrice}</span>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="bg-purple-600 text-white rounded-lg p-5 mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xl font-bold">{planName}</span>
                            <span className="bg-purple-700 text-xs px-2 py-1 rounded">{cycleDisplay}</span>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold">₹{displayPlanPrice}</span>
                            <span className="text-sm opacity-80">/mo</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {displayPlanFeatures.map((feature, index) => (
                            <div className="flex items-center" key={index}>
                                <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {paymentError && <p className="text-red-500 text-center mb-4">{paymentError}</p>}
                {paymentSuccess && <p className="text-green-600 text-center mb-4">Payment Successful! Redirecting to dashboard...</p>}


                {/* Pay Button */}
                <button
                    onClick={() =>{navigate('/razorpay')}}
                    disabled={loading || paymentSuccess}
                    className={`w-full bg-purple-600 text-white py-4 rounded-lg font-bold mb-4 flex items-center justify-center hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${loading || paymentSuccess ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    )}
                    Pay ₹{displayTotalPrice}
                </button>

                {/* Security Notice */}
                <div className="text-center text-sm text-gray-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secured by industry standard encryption
                </div>
            </div>
        </div>
    );
};

export default PaymentCheckout;
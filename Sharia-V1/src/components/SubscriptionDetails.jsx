import React, { useState, useEffect } from 'react';
import { CheckCircle, X, CreditCard, ChevronLeft, Bell, Search, Clock, FileText, Database, Zap, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
    getSubscriptionPlans, 
    getCurrentSubscription, 
    changeSubscriptionPlan 
  } from '../api/subscriptionService';
  import logo from '../images/ShariaStocks-logo/logo1.jpeg'
  import account from '../images/account-icon.svg';
  import { getUserData } from '../api/auth';
import Header from './Header';


// const planPrices = {
//     free: {
//         monthly: 0,
//         annual: 0, 
//     },
//     basic: {
//         monthly: 299,
//         annual: Math.round(299 * 12 * 0.85), 
//     },
//     premium: {
//         monthly: 599,
//         annual: Math.round(599 * 12 * 0.85), 
//     },
// };


// const planFeatures = {
//     free: [
//         'Search up to 3 stocks',
//         'Basic Shariah compliance details',
//         'Limited market insights',
//         'No stock storage',
//         'No notifications',
//     ],
//     basic: [
//         'Search and analyze all stocks',
//         'Store up to 10 stocks',
//         'News notifications for stored stocks',
//         'Detailed Shariah compliance metrics',
//         'Basic portfolio analytics',
//     ],
//     premium: [
//         'Search and analyze all stocks',
//         'Store up to 50 stocks',
//         'Priority news notifications',
//         'Advanced portfolio analytics',
//         'Expert Shariah compliance insights',
//         'Zakat calculation tool',
//     ],
// };


const SubscriptionDetails = () => {
    const email = localStorage.getItem('userEmail');
    const [selectedPlan, setSelectedPlan] = useState('free'); // 
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [planPrices, setPlanPrices] = useState({
        free: { monthly: 0, annual: 0 },
        basic: { monthly: 299, annual: 3048 },
        premium: { monthly: 599, annual: 6110 }
    });
    const [planFeatures, setPlanFeatures] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useState({});

  
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const userData = await getUserData(email);
                setUser(userData);
                // Get subscription plans
                const plansData = await getSubscriptionPlans();
                setPlanPrices(plansData.planPrices);
                setPlanFeatures(plansData.planFeatures);
                
                // Get current user subscription
                const userSubscription = await getCurrentSubscription();
                if (userSubscription && userSubscription.plan) {
                    setSelectedPlan(userSubscription.plan);
                    setBillingCycle(userSubscription.billingCycle || 'monthly');
                }
            } catch (err) {
                setError('Failed to load subscription data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

   
    const getPlanPrice = (plan) => {
        return planPrices[plan]?.[billingCycle] || 0;
    };

    
    const getTax = (price) => {
        return price * 0.18;
    };

    
    const getTotalPrice = (plan) => {
        const price = getPlanPrice(plan);
        const tax = getTax(price);
        return price + tax;
    };

   
    const getPlanFeatures = (plan) => {
        return planFeatures[plan] || []; 
    };


    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

   
    const handleUpgrade = () => {
        setSelectedPlan('premium'); 
        setShowConfirmation(true);
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
    };

    const handleSubscribe = async () => {
        try {
            // Call the backend to check if we need to process payment
            const changeResponse = await changeSubscriptionPlan(selectedPlan, billingCycle);
            
            // If payment is required, navigate to payment page
            if (changeResponse.nextStep === 'payment') {
                navigate('/razorpay', {
                    state: {
                        selectedPlan: selectedPlan,
                        billingCycle: billingCycle,
                        totalPrice: getTotalPrice(selectedPlan),
                        planPrice: getPlanPrice(selectedPlan),
                        tax: getTax(getPlanPrice(selectedPlan)),
                        planFeatures: getPlanFeatures(selectedPlan),
                    },
                });
            } else if (changeResponse.nextStep === 'update') {
                // This is for downgrading to free plan, no payment needed
                alert('Your plan has been updated to Free.');
                // Refresh subscription data
                const userSubscription = await getCurrentSubscription();
                if (userSubscription && userSubscription.plan) {
                    setSelectedPlan(userSubscription.plan);
                }
            }
        } catch (err) {
            // Handle specific error cases
            if (err.response && err.response.status === 400) {
                alert(err.response.data.message);
            } else {
                alert('An error occurred while processing your request.');
            }
            console.error(err);
        }
    };

    if (loading) {
        return <div className="p-12 text-center">Loading subscription plans...</div>;
    }

    if (error) {
        return <div className="p-12 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto   min-h-screen font-sans text-slate-900">
           <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-10">
                    {/* <button className="flex items-center text-slate-600 hover:text-slate-900 mb-3 font-medium">
                        <ChevronLeft size={20} className="mr-1" />
                        <span>Back to Dashboard</span>
                    </button> */}
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose your plan</h2>
                    <p className="text-slate-600 max-w-2xl">Select the perfect plan to enhance your Islamic investment journey. All plans come with Shariah compliance verification.</p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-200">
                        <button
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            Monthly
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'annual' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            onClick={() => setBillingCycle('annual')}
                        >
                            Annual <span className="text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full text-xs ml-1 font-bold">Save 15%</span>
                        </button>
                    </div>
                </div>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Free Plan */}
                    <div
                        className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${selectedPlan === 'free'
                            ? 'ring-2 ring-purple-500 shadow-lg transform scale-[1.02]'
                            : 'border border-slate-200 shadow-sm hover:shadow-md'
                            }`}
                    >
                        <div className={`h-2 ${selectedPlan === 'free' ? 'bg-purple-500' : 'bg-slate-200'}`}></div>
                        <div className="p-8">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
                                <p className="text-slate-600 text-sm">Basic features for starting investors</p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-end">
                                    <p className="text-4xl font-bold">₹{getPlanPrice('free').toFixed(0)}</p>
                                    <p className="text-slate-500 ml-2 mb-1">/forever</p>
                                </div>
                            </div>
                            <div className="space-y-4 mb-8">
                                {planFeatures.free && planFeatures.free.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        {feature.includes('No ') ? (
                                            <X size={18} className="text-slate-300 mt-0.5 mr-3 flex-shrink-0" />
                                        ) : (
                                            <CheckCircle size={18} className="text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                                        )}
                                        <span className={feature.includes('No ') ? "text-slate-400" : "text-slate-700"}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => handlePlanSelect('free')}
                                className={`w-full py-3 rounded-xl font-medium transition-all ${selectedPlan === 'free'
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-white border border-slate-300 text-slate-600 hover:border-purple-500 hover:text-purple-500'
                                    }`}
                            >
                                {selectedPlan === 'free' ? 'Current Plan' : 'Select Plan'}
                            </button>
                        </div>
                    </div>

                    {/* Basic Plan */}
                    <div
                        className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${selectedPlan === 'basic'
                            ? 'ring-2 ring-purple-500 shadow-lg transform scale-[1.02]'
                            : 'border border-slate-200 shadow-sm hover:shadow-md'
                            }`}
                    >
                        <div className={`h-2 ${selectedPlan === 'basic' ? 'bg-purple-500' : 'bg-slate-200'}`}></div>
                        <div className="p-8">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
                                <p className="text-slate-600 text-sm">Essential features for active investors</p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-end">
                                    <p className="text-4xl font-bold">₹{getPlanPrice('basic').toFixed(0)}</p>
                                    <p className="text-slate-500 ml-2 mb-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</p>
                                </div>
                            </div>
                            <div className="space-y-4 mb-8">
                                {planFeatures.basic && planFeatures.basic.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <CheckCircle size={18} className="text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    handlePlanSelect('basic');
                                    if (selectedPlan === 'basic') {
                                        setShowConfirmation(true);
                                    }
                                }}
                                className={`w-full py-3 rounded-xl font-medium transition-all ${selectedPlan === 'basic'
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-white border border-slate-300 text-slate-600 hover:border-purple-500 hover:text-purple-500'
                                    }`}
                            >
                                {selectedPlan === 'basic' ? 'Selected Plan' : 'Select Plan'}
                            </button>
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div
                        className={`bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl overflow-hidden transition-all duration-300 relative ${selectedPlan === 'premium'
                            ? 'ring-2 ring-purple-500 shadow-lg transform scale-[1.02]'
                            : 'border border-slate-200 shadow-sm hover:shadow-md'
                            }`}
                    >
                        <div className="absolute top-0 right-0">
                            <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-xs px-6 py-1 font-medium transform rotate-45 translate-x-6 translate-y-3 shadow-sm">
                                Popular
                            </div>
                        </div>
                        <div className={`h-2 ${selectedPlan === 'premium' ? 'bg-purple-500' : 'bg-indigo-300'}`}></div>
                        <div className="p-8">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Premium</h3>
                                <p className="text-slate-600 text-sm">Advanced features for serious investors</p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-end">
                                    <p className="text-4xl font-bold">₹{getPlanPrice('premium').toFixed(0)}</p>
                                    <p className="text-slate-500 ml-2 mb-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</p>
                                </div>
                            </div>
                            <div className="space-y-4 mb-8">
                                {planFeatures.premium && planFeatures.premium.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <CheckCircle size={18} className="text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    handlePlanSelect('premium');
                                    if (selectedPlan === 'premium') {
                                        setShowConfirmation(true);
                                    }
                                }}
                                className={`w-full py-3 rounded-xl font-medium transition-all ${selectedPlan === 'premium'
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-purple-600 bg-opacity-90 text-white hover:bg-opacity-100'
                                    }`}
                            >
                                {selectedPlan === 'premium' ? 'Selected Plan' : 'Select Plan'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Comparison */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-16">
                    <div className="p-8 pb-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Plan Comparison</h3>
                        <p className="text-slate-600 mb-6">Compare features across all plans to find the best fit for your needs</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="p-8 text-left font-medium text-slate-600 w-1/3">Feature</th>
                                    <th className="p-8 text-center font-medium text-slate-600">Free</th>
                                    <th className="p-8 text-center font-medium text-slate-600">Basic</th>
                                    <th className="p-8 text-center font-medium text-slate-600">Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-100">
                                    <td className="px-8 py-6 text-slate-800 flex items-center">
                                        <Search size={16} className="mr-3 text-purple-300" />
                                        Stock search limit
                                    </td>
                                    <td className="px-8 py-6 text-center text-slate-800">3 stocks</td>
                                    <td className="px-8 py-6 text-center text-slate-800">Unlimited</td>
                                    <td className="px-8 py-6 text-center text-slate-800">Unlimited</td>
                                </tr>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <td className="px-8 py-6 text-slate-800 flex items-center">
                                        <Database size={16} className="mr-3 text-purple-300" />
                                        Stock storage
                                    </td>
                                    <td className="px-8 py-6 text-center text-slate-800">—</td>
                                    <td className="px-8 py-6 text-center text-slate-800">10 stocks</td>
                                    <td className="px-8 py-6 text-center text-slate-800">50 stocks</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="px-8 py-6 text-slate-800 flex items-center">
                                        <Bell size={16} className="mr-3 text-purple-300" />
                                        News notifications
                                    </td>
                                    <td className="px-8 py-6 text-center text-slate-800">—</td>
                                    <td className="px-8 py-6 text-center text-slate-800">Basic</td>
                                    <td className="px-8 py-6 text-center text-slate-800">Priority</td>
                                </tr>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <td className="px-8 py-6 text-slate-800 flex items-center">
                                        <Shield size={16} className="mr-3 text-purple-300" />
                                        Shariah compliance details
                                    </td>
                                    <td className="px-8 py-6 text-center text-slate-800">Basic</td>
                                    <td className="px-8 py-6 text-center text-slate-800">Detailed</td>
                                    <td className="px-8 py-6 text-center text-slate-800">Expert</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="px-8 py-6 text-slate-800 flex items-center">
                                        <FileText size={16} className="mr-3 text-purple-300" />
                                        Portfolio analytics
                                    </td>
                                    <td className="px-8 py-6 text-center text-slate-800">—</td>
                                    <td className="px-8 py-6 text-center text-slate-800">Basic</td>
                                    <td className="px-8 py-6 text-center text-slate-800">Advanced</td>
                                </tr>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <td className="px-8 py-6 text-slate-800 flex items-center">
                                        <Zap size={16} className="mr-3 text-purple-300" />
                                        Zakat calculation
                                    </td>
                                    <td className="px-8 py-6 text-center text-slate-800">—</td>
                                    <td className="px-8 py-6 text-center text-slate-800">—</td>
                                    <td className="px-8 py-6 text-center text-slate-800">
                                        <div className="inline-flex items-center justify-center h-6 w-6 bg-purple-100 text-purple-500 rounded-full">
                                            <CheckCircle size={14} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-6 text-slate-800 flex items-center">
                                        <Clock size={16} className="mr-3 text-purple-300" />
                                        Historical data
                                    </td>
                                    <td className="px-8 py-6 text-center text-slate-800">1 month</td>
                                    <td className="px-8 py-6 text-center text-slate-800">1 year</td>
                                    <td className="px-8 py-6 text-center text-slate-800">5 years</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl overflow-hidden">
                    <div className="p-12 flex flex-col md:flex-row md:items-center justify-between text-white">
                        <div className="mb-8 md:mb-0 md:mr-8 max-w-xl">
                            <h3 className="text-2xl font-bold mb-4">Ready to enhance your Islamic investment journey?</h3>
                            <p className="text-purple-100 text-lg">Get started with our Basic or Premium plan today and make more informed, Shariah-compliant investment decisions.</p>
                        </div>
                        <button
                            onClick={handleUpgrade}
                            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-medium hover:bg-purple-50 flex items-center justify-center flex-shrink-0 shadow-lg transition-all transform hover:scale-105"
                        >
                            Upgrade Now
                            <ArrowRight size={18} className="ml-2" />
                        </button>
                    </div>
                </div>
            </main>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 transform transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Confirm Subscription</h3>
                            <button onClick={handleConfirmationClose} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-8">
                            <p className="text-slate-700 mb-4">
                                You're about to subscribe to the {selectedPlan === 'basic' ? 'Basic' : 'Premium'} plan at
                                ₹{getPlanPrice(selectedPlan).toFixed(0)} per {billingCycle}.
                            </p>
                            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 flex items-start rounded-r-md">
                                <div className="text-purple-500 mr-3 flex-shrink-0 mt-0.5">⚠️</div>
                                <p className="text-sm text-purple-700">
                                    Your card will be charged immediately, and your subscription will renew automatically each {billingCycle}.
                                    You can cancel anytime from your account settings.
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-medium">₹{getPlanPrice(selectedPlan).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-600">Tax (18% GST)</span>
                                <span className="font-medium">₹{getTax(getPlanPrice(selectedPlan)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold border-t border-slate-100 pt-4 mt-4">
                                <span>Total</span>
                                <span className="text-xl">₹{getTotalPrice(selectedPlan).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col space-y-3">
                            <button
                                onClick={handleSubscribe}
                                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 flex items-center justify-center"
                            >
                                <CreditCard size={18} className="mr-2" />
                                Confirm Payment
                            </button>
                            <button
                                onClick={handleConfirmationClose}
                                className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionDetails;
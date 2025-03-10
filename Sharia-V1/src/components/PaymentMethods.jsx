import React, { useState, useEffect } from 'react';
import { ChevronLeft, PlusCircle, Shield, CheckCircle, X, CreditCard, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';

const PaymentMethodsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('card'); // Track active tab: 'card' or 'upi'
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    nickname: ''
  });
  const [newUPI, setNewUPI] = useState({
    upiId: '',
    nickname: ''
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/payments/${userId}`);
        setPaymentMethods(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load payment methods. Please try again later.');
        console.error('Error fetching payment methods:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPaymentMethods();
    } else {
      setError('User ID not found. Please log in again.');
      setLoading(false);
    }
  }, [userId]);

  const setDefaultMethod = async (methodId) => {
    try {
      await axios.put(`/api/payments/default/${methodId}`, { userId });
      
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        isDefault: method._id === methodId
      })));
    } catch (err) {
      setError('Failed to set default payment method.');
      console.error('Error setting default method:', err);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({ ...newCard, [name]: value });
  };

  const handleUPIInputChange = (e) => {
    const { name, value } = e.target;
    setNewUPI({ ...newUPI, [name]: value });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setNewCard({ ...newCard, cardNumber: formattedValue });
  };

  const addNewCard = async (e) => {
    e.preventDefault();
    
    try {
      const cardNumberClean = newCard.cardNumber.replace(/\s/g, '');
      const last4 = cardNumberClean.slice(-4);
      const formattedNumber = `•••• •••• •••• ${last4}`;
      
      // Determine card type based on first digit
      const firstDigit = cardNumberClean[0];
      let cardType = 'Mastercard';
      let cardColor = 'bg-gradient-to-r from-gray-600 to-gray-800';
      
      if (firstDigit === '4') {
        cardType = 'Visa';
        cardColor = 'bg-gradient-to-r from-blue-700 to-blue-900';
      } else if (firstDigit === '5') {
        cardType = 'Mastercard';
        cardColor = 'bg-gradient-to-r from-red-500 to-orange-500';
      } else if (firstDigit === '3') {
        cardType = 'Amex';
        cardColor = 'bg-gradient-to-r from-blue-400 to-blue-600';
      }

      const newPaymentMethod = {
        userId,
        type: cardType,
        category: 'card',
        label: newCard.nickname ? newCard.nickname.toUpperCase() : 'CREDIT CARD',
        number: formattedNumber,
        expires: `${newCard.expiryMonth}/${newCard.expiryYear}`,
        isDefault: paymentMethods.length === 0, 
        color: cardColor
      };

      const response = await axios.post('/api/payments', newPaymentMethod);
      setPaymentMethods([...paymentMethods, response.data]);
      
      setNewCard({
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        nickname: ''
      });
      setShowCardForm(false);
    } catch (err) {
           if (err.response && err.response.data && err.response.data.error) {
             setError(err.response.data.error);
            setTimeout(() => {
              setError(''); 
              setNewCard({
                cardNumber: '',
                cardholderName: '',
                expiryMonth: '',
                expiryYear: '',
                cvv: '',
                nickname: ''
              });
            }, 3000);
           } else {
             setError('Failed to add new card. Please try again.');
            setTimeout(() => {
              setError(''); 
              setNewCard({
                cardNumber: '',
                cardholderName: '',
                expiryMonth: '',
                expiryYear: '',
                cvv: '',
                nickname: ''
              });
            }, 3000);
           }
           console.error('Error adding new card:', err);
      }
  };

  const addNewUPI = async (e) => {
    e.preventDefault();
    
    try {
      const newPaymentMethod = {
        userId,
        type: 'UPI',
        category: 'upi',
        label: newUPI.nickname ? newUPI.nickname.toUpperCase() : 'UPI PAYMENT',
        upiId: newUPI.upiId,
        isDefault: paymentMethods.length === 0, 
        color: 'bg-gradient-to-r from-purple-600 to-indigo-700'
      };

      const response = await axios.post('/api/payments', newPaymentMethod);
      setPaymentMethods([...paymentMethods, response.data]);
      
      setNewUPI({
        upiId: '',
        nickname: ''
      });
      setShowUPIForm(false);
    } catch (err) {
           if (err.response && err.response.data && err.response.data.error) {
             setError(err.response.data.error); 
            setTimeout(() => {
              setError('');
              setNewUPI({
                upiId: '',
                nickname: ''
              });
            }, 3000);
           } else {
             setError('Failed to add new UPI. Please try again.'); 
            setTimeout(() => {
              setError(''); 
              setNewUPI({
                upiId: '',
                nickname: ''
              });
            }, 3000);
           }
           console.error('Error adding new UPI:', err);
      }
  };

  const deletePaymentMethod = async (methodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await axios.delete(`/api/payments/${methodId}`);
        setPaymentMethods(paymentMethods.filter(method => method._id !== methodId));
      } catch (err) {
        setError('Failed to delete payment method.');
        console.error('Error deleting payment method:', err);
      }
    }
  };

  const showAddMethodOptions = () => {
    return !showCardForm && !showUPIForm && paymentMethods.length > 0;
  };

  // Function to handle displaying the UPI form
  const handleShowUPIForm = () => {
    setShowCardForm(false);
    setShowUPIForm(true);
    setActiveTab('upi');
  };

  // Function to handle displaying the card form
  const handleShowCardForm = () => {
    setShowCardForm(true);
    setShowUPIForm(false);
    setActiveTab('card');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <button 
          className="group flex items-center text-gray-600 hover:text-purple-700 mb-6 transition duration-200" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Account</span>
        </button>

        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-8 mb-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-3">Payment Methods</h1>
          <p className="text-purple-100 max-w-md">Securely manage your payment options for subscriptions and purchases</p>
        </div>

        

        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">Your Payment Methods</h2>
            <div className="flex space-x-3">
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition duration-200"
                onClick={handleShowCardForm}
              >
                <PlusCircle className="w-5 h-5 mr-1" />
                <span>Add Card</span>
              </button>
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition duration-200"
                onClick={handleShowUPIForm}
              >
                <PlusCircle className="w-5 h-5 mr-1" />
                <span>Add UPI</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your payment methods...</p>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl bg-white">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-500 mb-4">No payment methods added yet</p>
              <div className="flex justify-center space-x-3">
                <button 
                  className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition duration-200 shadow-sm"
                  onClick={handleShowCardForm}
                >
                  <span>Add Card</span>
                </button>
                <button 
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 shadow-sm"
                  onClick={handleShowUPIForm}
                >
                  <span>Add UPI</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <div key={method._id} className="rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
                  <div className={`${method.color} p-6 text-white relative overflow-hidden`}>
                    {/* Background pattern for cards */}
                    {method.category === 'card' && (
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-white translate-x-1/3 translate-y-1/3"></div>
                        <div className="absolute left-0 top-0 w-32 h-32 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-6 relative">
                      <div>
                        <div className="text-sm font-medium text-white/80 mb-1">{method.label}</div>
                        <div className="text-xl font-bold">{method.type}</div>
                      </div>
                      {method.type === 'Visa' ? (
                        <div className="font-bold text-2xl tracking-wider">VISA</div>
                      ) : method.type === 'Mastercard' ? (
                        <div className="flex space-x-1">
                          <div className="w-8 h-8 rounded-full bg-orange-500 opacity-90"></div>
                          <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-90"></div>
                        </div>
                      ) : method.type === 'Amex' ? (
                        <div className="font-bold text-2xl">AMEX</div>
                      ) : (
                        <div className="font-bold text-xl bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">UPI</div>
                      )}
                    </div>
                    <div className="flex justify-between items-center relative">
                      {method.category === 'card' ? (
                        <>
                          <div className="font-mono tracking-wider">{method.number}</div>
                          <div className="text-sm bg-white/20 px-2 py-0.5 rounded">Exp {method.expires}</div>
                        </>
                      ) : (
                        <div className="font-mono">{method.upiId}</div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-white flex justify-between items-center">
                    {method.isDefault ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span className="font-medium">Default</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDefaultMethod(method._id)}
                        className="text-purple-600 font-medium hover:text-purple-800 transition"
                      >
                        Set as Default
                      </button>
                    )}
                    <button 
                      onClick={() => deletePaymentMethod(method._id)}
                      className="text-gray-500 hover:text-red-600 transition duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Payment Method Section */}
        {showAddMethodOptions() && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add Payment Method</h2>
              <p className="text-gray-500 mb-6">Choose a payment method to add to your account</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <button 
                className="border border-gray-200 rounded-xl p-5 flex items-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
                onClick={handleShowCardForm}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-800 block">Credit/Debit Card</span>
                  <span className="text-sm text-gray-500">Add Visa, Mastercard, or Amex</span>
                </div>
              </button>
              <button 
                className="border border-gray-200 rounded-xl p-5 flex items-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
                onClick={handleShowUPIForm}
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-800 block">UPI</span>
                  <span className="text-sm text-gray-500">Add your UPI ID</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Form Container with Tabs */}
        {(showCardForm || showUPIForm) && (
          <div className="bg-white rounded-xl shadow-sm mb-8">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={handleShowCardForm}
                className={`flex-1 py-4 text-center font-medium ${
                  showCardForm 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Credit/Debit Card
              </button>
              <button
                onClick={handleShowUPIForm}
                className={`flex-1 py-4 text-center font-medium ${
                  showUPIForm 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                UPI
              </button>
            </div>
            {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

            {/* Credit Card Form */}
            {showCardForm && (
              <div className="p-6">
                <form onSubmit={addNewCard}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newCard.cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full p-3 border border-gray-300 rounded-lg pl-11 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                          maxLength="19"
                          required
                        />
                        <CreditCard className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        placeholder="John Doe"
                        value={newCard.cardholderName}
                        onChange={handleCardInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="expiryMonth"
                            placeholder="MM"
                            value={newCard.expiryMonth}
                            onChange={handleCardInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            maxLength="2"
                            required
                          />
                          <input
                            type="text"
                            name="expiryYear"
                            placeholder="YY"
                            value={newCard.expiryYear}
                            onChange={handleCardInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            maxLength="2"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          placeholder="•••"
                          value={newCard.cvv}
                          onChange={handleCardInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nickname (Optional)
                      </label>
                      <input
                        type="text"
                        name="nickname"
                        placeholder="Personal Card"
                        value={newCard.nickname}
                        onChange={handleCardInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition duration-200 shadow-sm flex items-center justify-center"
                      >
                        <span>Add Card</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* UPI Form */}
            {showUPIForm && (
              <div className="p-6">
                <form onSubmit={addNewUPI}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        placeholder="yourname@upi"
                        value={newUPI.upiId}
                        onChange={handleUPIInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nickname (Optional)
                      </label>
                      <input
                        type="text"
                        name="nickname"
                        placeholder="Personal UPI"
                        value={newUPI.nickname}
                        onChange={handleUPIInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 shadow-sm flex items-center justify-center"
                      >
                        <span>Add UPI</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start">
            <div className="bg-purple-100 p-3 rounded-full mr-5 flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">Payment Security Information</h3>
              <p className="text-gray-600 leading-relaxed">
                Your payment information is protected using state-of-the-art encryption. We adhere to the highest
                security standards and never store complete card details on our servers. All transactions are
                processed through our secure payment gateway partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
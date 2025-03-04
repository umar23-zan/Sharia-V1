import React, { useState, useEffect } from 'react';
import { ChevronLeft, PlusCircle, Shield, CheckCircle, X, CreditCard } from 'lucide-react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import logo from '../images/ShariaStocks-logo/logo1.jpeg'

const PaymentMethodsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate()
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

  // Fetch payment methods when component mounts
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
      
      // Update local state to reflect the change
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

  const addNewCard = async (e) => {
    e.preventDefault();
    
    try {
      // Format card number with asterisks
      const last4 = newCard.cardNumber.slice(-4);
      const formattedNumber = `•••• •••• •••• ${last4}`;
      
      // Determine card type based on first digit
      const firstDigit = newCard.cardNumber[0];
      let cardType = 'Mastercard';
      let cardColor = 'bg-gray-500';
      
      if (firstDigit === '4') {
        cardType = 'Visa';
        cardColor = 'bg-blue-500';
      } else if (firstDigit === '5') {
        cardType = 'Mastercard';
        cardColor = 'bg-gradient-to-r from-red-400 to-orange-400';
      }

      const newPaymentMethod = {
        userId,
        type: cardType,
        category: 'card',
        label: newCard.nickname ? newCard.nickname.toUpperCase() : 'CREDIT CARD',
        number: formattedNumber,
        expires: `${newCard.expiryMonth}/${newCard.expiryYear}`,
        isDefault: paymentMethods.length === 0, // Make default if first payment method
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
      setError('Failed to add new card. Please try again.');
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
        isDefault: paymentMethods.length === 0, // Make default if first payment method
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600'
      };

      const response = await axios.post('/api/payments', newPaymentMethod);
      setPaymentMethods([...paymentMethods, response.data]);
      
      setNewUPI({
        upiId: '',
        nickname: ''
      });
      setShowUPIForm(false);
    } catch (err) {
      setError('Failed to add new UPI. Please try again.');
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

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-50">
      <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <div className="w-48 h-14 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={logo} onClick={()=>navigate('/dashboard')} alt="ShariaStock Logo" className="w-full h-full object-fill cursor-pointer" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
                  AI
                </div>
              </div>
            </div>
      <div className="p-4">
        <button className="flex items-center text-gray-700 mb-5" onClick={() =>navigate(-1)}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Account</span>
        </button>

        <div className="bg-purple-600 rounded-lg p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Payment Methods</h1>
          <p>Manage your payment options for subscription and billing</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Payment Methods</h2>
            <button 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={() => {
                setShowCardForm(true);
                setShowUPIForm(false);
              }}
            >
              <PlusCircle className="w-5 h-5 mr-1" />
              <span>Add New Card</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading payment methods...</p>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-white">
              <p className="text-gray-500">No payment methods added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method._id} className="border rounded-lg overflow-hidden">
                  <div className={`${method.color} p-6 text-white`}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-sm font-medium text-white/80 mb-1">{method.label}</div>
                        <div className="text-xl font-bold">{method.type}</div>
                      </div>
                      {method.type === 'Visa' ? (
                        <div className="font-bold text-2xl">VISA</div>
                      ) : method.type === 'Mastercard' ? (
                        <div className="flex space-x-1">
                          <div className="w-8 h-8 rounded-full bg-orange-500 opacity-80"></div>
                          <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-80"></div>
                        </div>
                      ) : (
                        <div className="font-bold text-xl bg-white/10 px-2 py-1 rounded">UPI</div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      {method.category === 'card' ? (
                        <>
                          <div className="font-mono">{method.number}</div>
                          <div className="text-sm">Expires {method.expires}</div>
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
                        <span>Default</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDefaultMethod(method._id)}
                        className="text-purple-600 font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                    <button 
                      onClick={() => deletePaymentMethod(method._id)}
                      className="text-red-500 hover:text-red-700"
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
        {!showCardForm && !showUPIForm && (
          <div className="border rounded-lg p-6 bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Payment Method</h2>
            </div>
            <div className="flex space-x-4">
              <button 
                className="border rounded-lg p-4 flex-1 flex flex-col items-center justify-center hover:bg-gray-50"
                onClick={() => {
                  setShowCardForm(true);
                  setShowUPIForm(false);
                }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold">+</span>
                </div>
                <span className="font-medium">Credit/Debit Card</span>
              </button>
              <button 
                className="border rounded-lg p-4 flex-1 flex flex-col items-center justify-center hover:bg-gray-50"
                onClick={() => {
                  setShowUPIForm(true);
                  setShowCardForm(false);
                }}
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <span className="text-purple-600 font-bold">+</span>
                </div>
                <span className="font-medium">UPI</span>
              </button>
            </div>
          </div>
        )}

        {/* Credit Card Form */}
        {showCardForm && (
          <div className="border rounded-lg p-6 bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Credit/Debit Card</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowCardForm(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={addNewCard}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={newCard.cardNumber}
                      onChange={handleCardInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg pl-10"
                      maxLength="16"
                      required
                    />
                    <CreditCard className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    placeholder="John Doe"
                    value={newCard.cardholderName}
                    onChange={handleCardInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="expiryMonth"
                        placeholder="MM"
                        value={newCard.expiryMonth}
                        onChange={handleCardInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        maxLength="2"
                        required
                      />
                      <input
                        type="text"
                        name="expiryYear"
                        placeholder="YY"
                        value={newCard.expiryYear}
                        onChange={handleCardInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        maxLength="2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="***"
                      value={newCard.cvv}
                      onChange={handleCardInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    placeholder="Personal Card"
                    value={newCard.nickname}
                    onChange={handleCardInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
                  >
                    Add Card
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* UPI Form */}
        {showUPIForm && (
          <div className="border rounded-lg p-6 bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add UPI ID</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowUPIForm(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={addNewUPI}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    placeholder="yourname@upi"
                    value={newUPI.upiId}
                    onChange={handleUPIInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    placeholder="Personal UPI"
                    value={newUPI.nickname}
                    onChange={handleUPIInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
                  >
                    Add UPI
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="border rounded-lg p-6 bg-white">
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-full mr-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Payment Security Information</h3>
              <p className="text-gray-700">
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
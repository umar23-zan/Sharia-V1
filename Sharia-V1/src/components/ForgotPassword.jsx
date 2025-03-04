import React, { useState } from 'react';
import { forgotPassword } from '../api/auth';
import logo from '../images/ShariaStocks-logo/ShariaStocks1.png';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setAlert(null);
        try {
            const res = await forgotPassword({ email });
            setAlert({ type: 'success', message: res.data.msg });
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error sending reset password link.');
            console.error(err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-10 "> {/* Center content vertically */}
            <div className=" max-w-md mx-auto flex flex-col gap-20 lg:gap-10">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        className="flex items-center text-gray-600 hover:text-indigo-500 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2" size={18} />
                        <span className="text-sm sm:text-base">Go back</span> {/* Responsive text size */}
                    </button>
                </div>

                {/* Centered Logo */}
                <div className="flex items-center justify-center mb-12"> {/* Increased spacing below logo */}
                    <img
                        src={logo}
                        alt="ShariaStocks logo"
                        className="w-100 sm:w-96 md:w-100 h-auto rounded-lg" // Increased max-height for larger screens
                    />
                </div>

                {/* Alert Message */}
                {alert && (
                    <div className={`mb-8 p-4 rounded-lg text-center ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}> {/* Increased spacing below alert */}
                        {alert.message}
                    </div>
                )}
                {error && (
                    <div className="mb-8 p-4 rounded-lg text-center bg-red-100 text-red-700"> {/* Increased spacing below error */}
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-7 font-medium text-sm sm:text-base"> {/* Responsive label text */}
                            Enter your email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none transition-all text-sm sm:text-base" // Responsive input text
                            placeholder="your-email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Button */}
                    <button
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 mt-4 font-medium text-base sm:text-lg" // Responsive button text and added mt-4 for spacing
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? '✉️ Sending link...' : '✉️ Send Reset Link'}
                    </button>
                    {/* Link to Login */}
                <div className="mt-10 text-center"> {/* Increased spacing above login link */}
                    <p className="text-gray-600 text-sm sm:text-base"> {/* Responsive text size */}
                        Remembered your password? {' '}
                        <a
                            href="/login"
                            className="text-indigo-500 hover:text-indigo-700 font-medium underline"
                        >
                            Log in here
                        </a>
                    </p>
                </div>
                </form>

                
            </div>
        </div>
    );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import logo from '../images/ShariaStocks-logo/ShariaStocks1.png';
import '../styles/auth.css';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const response = await resetPassword(token, { password });
            if (response && response.data) {
                setSuccess(response.data.message || 'Password reset successfully.');
                setError('');
                setPassword('');
                setConfirmPassword('');

                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            console.error('Error resetting password:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'An error occurred. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen  p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center"> {/* Vertically center content, responsive padding */}
            <div className="max-w-md mx-auto">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        className="flex items-center text-gray-600 hover:text-indigo-500 transition-colors text-sm sm:text-base" // Responsive text size
                        onClick={() => navigate('/login')}
                    >
                        <ArrowLeft className="mr-2" size={18} />
                        <span>Back to login</span>
                    </button>
                </div>

                {/* Logo */}
                <div className="flex items-center justify-center mb-12"> {/* Increased spacing */}
                    <img
                        src={logo}
                        alt="ShariaStocks logo"
                        className="max-h-28 sm:max-h-32 w-auto" // Responsive logo size
                    />
                </div>


                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-700 text-center"> {/* Centered text, padding, margin */}
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 text-center"> {/* Centered text, padding, margin */}
                        {error}
                    </div>
                )}

                {/* Reset Password Form */}
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* New Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-2 font-medium text-sm sm:text-base"> {/* Responsive label text */}
                            Choose a new password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none transition-all pr-10 text-sm sm:text-base" // Responsive text size
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading || success}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-medium text-sm sm:text-base"> {/* Responsive label text */}
                            Confirm your new password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none transition-all pr-10 text-sm sm:text-base" // Responsive text size
                                placeholder="Type your password again"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading || success}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 mt-6 font-medium text-base sm:text-lg" // Increased mt for spacing, responsive text size
                        type="submit"
                        disabled={loading || success}
                    >
                        {loading ? '⏳ Processing...' : success ? '✅ Password Reset!' : '🔒 Reset My Password'}
                    </button>
                </form>

                {/* Help text */}
                <p className="text-center text-gray-500 text-sm mt-12"> {/* Increased mt for spacing, adjusted text color */}
                    Make sure to remember your new password! 😊
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
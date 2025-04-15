import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
// import { signup, initiateGoogleSignIn } from '../api/auth';
import logo from '../images/ShariaStocks-logo/ShariaStocks1.png';
// import googleLogo from '../images/ShariaStocks-logo/google.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        const { name, email, password, confirmPassword } = formData;

        // Enhanced validation
        if (!name.trim()) {
            setMessage({ type: 'error', text: 'Please enter your name' });
            return;
        }

        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Please enter your email address' });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            await signup(formData);
            setMessage({ 
                type: 'success', 
                text: 'Signup successful! Please check your email to verify your account.' 
            });
            
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
            
            // Optional: Navigate to login after successful signup
            // setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error('Signup error:', err.response?.data || err.message);
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.msg || 
                      err.response?.data?.errors?.[0]?.msg || 
                      'Failed to create account. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                {/* Back button */}
                <button 
                    className="text-gray-600 hover:text-gray-900 transition-colors mb-6 flex items-center gap-1 text-sm"
                    onClick={() => navigate('/')}
                    aria-label="Back to home"
                >
                    <ArrowLeft size={16} />
                    <span>Back to home</span>
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img 
                        src={logo} 
                        alt="ShariaStocks Logo" 
                        className="w-64 h-auto" 
                    />
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Account</h1>

                {/* Status message */}
                {message && (
                    <div 
                        className={`mb-6 p-3 rounded-lg text-center text-sm font-medium ${
                            message.type === 'success' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                        role="alert"
                    >
                        {message.text}
                    </div>
                )}

                {/* Signup Form */}
                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                placeholder="Create a strong password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={onChange}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                placeholder="Confirm your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </div>

                     {/*<div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={initiateGoogleSignIn}
                        className="w-full py-3 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <img src={googleLogo} alt="" className="w-5 h-5" />
                        Sign up with Google
                    </button>*/}
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            disabled={loading}
                            className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Log in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
import React, { useState, useEffect } from 'react';
import shariastocks from '../images/ShariaStocks-logo/ShariaStocks1.png';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { ArrowLeft } from 'lucide-react';
import googleLogo from '../images/ShariaStocks-logo/google.png'; 
import { initiateGoogleSignIn } from '../api/auth';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (localStorage.getItem('userEmail')) {
            // Redirect to dashboard if already logged in
            navigate('/Dashboard');
        }
    }, [navigate]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null); // Clear previous messages

        // Client-side validation
        if (!email.trim() || !password.trim()) {
            setMessage({ type: 'error', text: 'Email and Password are required.' });
            setLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage({ type: 'error', text: 'Enter a valid email address.' });
            setLoading(false);
            return;
        }

        try {
            const res = await login(formData);
            localStorage.setItem('userEmail', res.email);
            localStorage.setItem('userId', res.id);

            setFormData({ email: '', password: '' });
            setMessage({ type: 'success', text: 'Login successful!' });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            let errorMessage = 'Something went wrong. Please try again later.';
            if (err.response) {
                if (err.response.status === 400) {
                    errorMessage = 'Invalid Credentials.';
                } else if (err.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            }
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        initiateGoogleSignIn();
      };

    return (
        <div className="min-h-screen  p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-md mx-auto pt-8">
                {/* Back Arrow */}
                <div className="mb-10">
                    <button className="text-black text-xl" onClick={() => navigate('/')}>
                        <ArrowLeft />
                    </button>
                </div>

                {/* Logo */}
                <div className="flex items-center justify-center mb-12">
                    <div >
                        <img src={shariastocks} alt="logo" className="w-100 sm:w-96 md:w-100 h-auto rounded-lg" />
                    </div>
                </div>
                {/* Display message */}
                {message && (
                    <div className={`mt-4 p-2 rounded text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}
                {/* Login Form */}
                <div className="space-y-6 mt-8">
                    <div>
                        <label className="block text-lg mb-2">Email</label>
                        <input
                            type="email"
                            name='email'
                            id="email"
                            autoComplete='off'
                            label="Email Address"
                            value={email}
                            onChange={onChange}
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                id="password"
                                required
                                className="w-full px-3 py-2 border rounded-lg bg-gray-50 pr-10"
                                placeholder="Enter your password"
                                label="Password"
                                name="password"
                                onChange={onChange}
                                disabled={loading}
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                {showPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-violet-600 cursor-pointer" onClick={() => navigate('/forgot-password')} disabled={loading}>Forgot password?</p>
                        </div>
                    </div>

                   


                    {/* Login Button */}
                    <button className="w-full bg-indigo-500 text-white py-3 rounded-lg mt-6" type="submit"
                        onClick={onSubmit}
                        disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                     {/* Continue with Google Button */}
                     <button
                        className="w-full py-3 rounded-xl text-base sm:text-lg font-medium border cursor-pointer transform transition-transform active:scale-98 bg-white border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
                        onClick={handleGoogleSignIn} // Replace with your actual Google Sign-in function
                        type="button" // Important: Use type="button" to prevent form submission
                    >
                        <img src={googleLogo} alt="Google Logo" className="w-5 h-5" /> {/* Google Logo */}
                        Continue with Google
                    </button>
                </div>
                {/* Sign up option */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            disabled={loading}
                            className="ml-1 font-medium text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
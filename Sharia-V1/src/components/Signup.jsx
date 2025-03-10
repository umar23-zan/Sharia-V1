import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signup } from '../api/auth';
import logo from '../images/ShariaStocks-logo/ShariaStocks1.png';
import { ArrowLeft } from 'lucide-react';
import googleLogo from '../images/ShariaStocks-logo/google.png'; // Import Google Logo
import { initiateGoogleSignIn } from '../api/auth';


const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const { name, email, password, confirmPassword } = formData;
    const [alert, setAlert] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
 


    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const res = await signup(formData);
            setAlert({ type: 'success', message: 'Signup successful! Please check your email to verify your account.' });
            console.log(res);
            setError('');
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            });

            // setTimeout(() => {
            //     setAlert(null);
            //     navigate('/login');
            // }, 1500);
        } catch (err) {
            console.error('Signup error:', err.response?.data || err.message);
            setError(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        initiateGoogleSignIn();
      };

    return (
        <div className=" min-h-screen sm:p-6 ">
            <div className="mx-auto max-w-md pt-8">
                <div className="mb-10"> {/* Spacing for back arrow */}
                    <button className="text-black text-xl" onClick={() => navigate('/')}> <ArrowLeft /> </button>
                </div>
                <div className="text-center mb-12 "> {/* Spacing for logo */}
                    <img src={logo} alt="Logo" className="w-100 sm:w-96 md:w-100 h-auto rounded-lg" /> {/* Adjusted logo size */}
                </div>

                <form onSubmit={onSubmit} className="max-w-md px-4 mx-auto"> {/* Center form and keep max-width */}
                    <h2 className="text-3xl font-bold text-center mb-8">Create an account</h2> {/* Spacing for title */}
                    {error && <div className="mb-6 p-3 rounded text-red-700 bg-red-100 text-center">{error}</div>} {/* Spacing for error */}
                    {alert && <div className="mb-6 p-3 rounded text-green-700 bg-green-100 text-center">{alert.message}</div>} {/* Spacing for alert */}

                    <div className="space-y-5 mb-7"> {/* Spacing for input fields and submit button */}
                        <div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={onChange}
                                disabled={loading}
                                required
                                placeholder="Enter your Name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={onChange}
                                disabled={loading}
                                required
                                placeholder="Enter your Email Address"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Enter Password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={onChange}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 transition-colors pr-10" // Added pr-10 for eye icon space
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    required
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={onChange}
                                    disabled={loading}
                                    placeholder="Re-type Password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 transition-colors pr-10" // Added pr-10 for eye icon space
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing Up' : 'Sign Up'}
                    </button>
                    {/* Continue with Google Button */}
                <button
                    className="w-full py-3 rounded-xl text-base sm:text-lg font-medium border cursor-pointer transform transition-transform active:scale-98 bg-white border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2 mt-8" // Added mt-8 for spacing
                    onClick={handleGoogleSignUp} // Replace with your actual Google Sign-in function
                    type="button" // Important: Use type="button" to prevent form submission
                >
                    <img src={googleLogo} alt="Google Logo" className="w-5 h-5" /> {/* Google Logo */}
                    Continue with Google
                </button>
                </form>

                


                {/* Already have an account, Login here */}
                <div className="mt-8 text-center"> {/* Spacing for login option */}
                    <p className="text-gray-600">
                        Already have an account?
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            disabled={loading}
                            className="ml-1 font-medium text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
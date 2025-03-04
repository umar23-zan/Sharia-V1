import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import logo from '../images/ShariaStocks-logo/ShariaStocks1.png'

export default function Design() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userEmail')) {
            navigate('/Dashboard');
        }
    }, [navigate]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-around bg-gray-50 p-6 sm:p-8 lg:p-10">
            <div className="mb-10 flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-100 sm:w-96 md:w-100 h-auto rounded-lg" 
                />
                <p className="text-base sm:text-lg md:text-xl max-w-md text-gray-500 text-center mb-0 sm:mb-4 md:mb-6">
                    Make informed investment decisions aligned with islamic values
                </p>
            </div>

            <div className="w-full max-w-md flex flex-col gap-3 sm:gap-4">
                <button
                    className="w-full py-3 rounded-xl text-base sm:text-lg font-medium border-none cursor-pointer transform transition-transform active:scale-98 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                    onClick={handleLoginClick}
                >
                    Log In
                </button>
                <button
                    className="w-full py-3 rounded-xl text-base sm:text-lg font-medium border cursor-pointer transform transition-transform active:scale-98 bg-white border-indigo-600 text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500"
                    onClick={handleSignupClick}
                >
                    Sign up
                </button>
            </div>
        </div>
    )
}
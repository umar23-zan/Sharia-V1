// components/AuthCallback.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code'); // Get the authorization code

    if (code) {
      // Send the code to your backend for verification and token exchange
      fetch('/api/auth/google/callback', { // Your backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the user's login or signup based on the backend response
          if (data.success) {
            // Store user data (e.g., tokens) in local storage or cookies
            localStorage.setItem('token', data.token);
            navigate('/dashboard'); // Redirect to dashboard
          } else {
            // Handle login/signup error
            console.error('Authentication failed:', data.message);
            navigate('/login'); // Redirect to login page
          }
        })
        .catch((error) => {
          console.error('Error during authentication:', error);
          navigate('/login'); // Redirect to login page
        });
    } else {
      // Handle missing code (authentication error)
      console.error('Authentication code missing');
      navigate('/login'); // Redirect to login page
    }
  }, [location, navigate]);

  return <div>Authenticating...</div>; // Display a loading message
}

export default AuthCallback;
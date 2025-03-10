import axios from 'axios';

export const handleOAuthCallback = (token, email, id) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userId', id);
  return { token, email, id };
};


export const initiateGoogleSignIn = () => {
  window.location.href = `http://localhost:5001/api/auth/google`;
};

export const signup = async (formData) => {
    const res = await axios.post('/api/auth/signup', formData);
    return res.data;
};

export const tokenverify = async (token) => {
  try {
    const response = await fetch(`/api/auth/verify/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Verification failed');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const verify = async (token) => {
  try {
    const response = await fetch(`/api/auth/verify/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Verification failed');
    }
    
    return await response.text();
  } catch (error) {
    throw error;
  }
};

export const resendVerification = async (email) => {
  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Failed to resend verification email');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const login = async (formData) => {
    const res = await axios.post('/api/auth/login', formData);
    return res.data;
};

export const forgotPassword = async (data) => {
  return await axios.post('/api/auth/forgot-password', data);
};

export const resetPassword = async (token, data) => {
  return await axios.post(`/api/auth/reset-password/${token}`, data);
};

export const getUserData = async (email) => {
  const res = await axios.get(`/api/auth/user/${email}`);
  return res.data;
};

// Update user data by email
export const updateUserData = async (email, data) => {
  const res = await axios.put(`/api/auth/user/${email}`, data);
  return res.data;
};

export const uploadProfilePicture = async (formData) => {
  return await axios.post('/api/auth/upload-profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
  });
};
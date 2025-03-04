import axios from 'axios';

// api/auth.js - Add these functions to your existing auth API file

// Function to handle OAuth callback
export const handleOAuthCallback = (token, email, id) => {
  // Store token and user data in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userId', id);
  return { token, email, id };
};

// Function to initiate Google Sign-in
export const initiateGoogleSignIn = () => {
  window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
};

export const signup = async (formData) => {
    const res = await axios.post('/api/auth/signup', formData);
    return res.data;
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
// src/services/subscriptionService.js
import axios from 'axios';

const API_URL = '/api/subscribe';

// Get all subscription plans
export const getSubscriptionPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/plans`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
};
const userId = localStorage.getItem('userId')
// Get current user subscription
export const getCurrentSubscription = async () => {
  try {
    const response = await axios.get(`${API_URL}/current?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    throw error;
  }
};

// Change subscription plan
export const changeSubscriptionPlan = async (plan, billingCycle) => {
  try {
    const response = await axios.post(`${API_URL}/change?userId=${userId}`, { plan, billingCycle });
    return response.data;
  } catch (error) {
    console.error('Error changing subscription plan:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async () => {
  try {
    const response = await axios.post(`${API_URL}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

// Update subscription after payment
export const updateSubscription = async (plan, billingCycle, transactionId) => {
  try {
    const response = await axios.post(`${API_URL}/update`, { 
      plan, 
      billingCycle, 
      transactionId 
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};
import { useState, useEffect } from 'react';

// Custom hook to manage payment alerts
const usePaymentAlert = (user) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: null,
    daysRemaining: null,
    amount: null
  });

  // Function to check subscription status
  const checkSubscriptionStatus = () => {
    if (!user || !user.subscription) return;
    
    const { subscription } = user;
    
    // Check if there's a past due payment
    if (subscription.status === 'past_due') {
      setAlertState({
        isOpen: true,
        type: 'pastDue',
        amount: subscription.amount || 999
      });
      return;
    }
    
    // Check if payment has failed
    if (subscription.status === 'payment_failed') {
      setAlertState({
        isOpen: true,
        type: 'paymentFailed',
        amount: subscription.amount || 999
      });
      return;
    }
    
    // Check if subscription is expiring soon
    if (subscription.status === 'active' && subscription.endDate) {
      const endDate = new Date(subscription.endDate);
      const today = new Date();
      const differenceInTime = endDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      
      if (differenceInDays <= 7 && differenceInDays > 0) {
        setAlertState({
          isOpen: true,
          type: 'expiringSoon',
          daysRemaining: differenceInDays
        });
        return;
      }
    }
  };

  // Function to close the alert
  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
    
    // Store that we've shown this alert today in local storage
    const alertHistory = JSON.parse(localStorage.getItem('alertHistory') || '{}');
    alertHistory[alertState.type] = new Date().toISOString();
    localStorage.setItem('alertHistory', JSON.stringify(alertHistory));
  };

  // Check if we should show the alert based on last shown date
  const shouldShowAlert = (type) => {
    const alertHistory = JSON.parse(localStorage.getItem('alertHistory') || '{}');
    const lastShown = alertHistory[type];
    
    // If never shown before, show it
    if (!lastShown) return true;
    
    // If shown in the last 24 hours, don't show again
    const lastShownDate = new Date(lastShown);
    const today = new Date();
    const differenceInHours = (today.getTime() - lastShownDate.getTime()) / (1000 * 3600);
    
    return differenceInHours >= 24;
  };

  // Effect to check status on initial load and when user changes
  useEffect(() => {
    if (user && user.subscription) {
      // Check all alert types if they should be shown
      const types = ['pastDue', 'paymentFailed', 'expiringSoon'];
      for (const type of types) {
        if (shouldShowAlert(type)) {
          checkSubscriptionStatus();
          break;
        }
      }
    }
  }, [user]);

  // Effect to check status on visibility change (when user returns to the tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && user.subscription) {
        checkSubscriptionStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  return {
    ...alertState,
    closeAlert
  };
};

export default usePaymentAlert;
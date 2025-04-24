import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SubscriptionDetails from '../components/SubscriptionDetails';
import * as authApi from '../api/auth';
import * as subscriptionService from '../api/subscriptionService';
import axios from 'axios';

// Mock the router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Mock lazy loaded components
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: () => {
      const MockComponent = () => <div data-testid="mock-header">Header Component</div>;
      MockComponent.displayName = 'MockLazyComponent';
      return MockComponent;
    },
    Suspense: ({ children }) => <div data-testid="suspense-wrapper">{children}</div>
  };
});

// Mock API calls
vi.mock('../api/auth', () => ({
  getUserData: vi.fn()
}));

vi.mock('../api/subscriptionService', () => ({
  getSubscriptionPlans: vi.fn(),
  getCurrentSubscription: vi.fn(),
  changeSubscriptionPlan: vi.fn()
}));

vi.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

// Mock window.Razorpay
global.window.Razorpay = vi.fn().mockImplementation(() => ({
  on: vi.fn(),
  open: vi.fn()
}));

describe('SubscriptionDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup localStorage mock values
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userEmail') return 'test@example.com';
      if (key === 'userId') return '123456';
      return null;
    });

    // Setup API mock responses
    authApi.getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      subscription: {
        plan: 'free',
        billingCycle: 'monthly'
      }
    });

    subscriptionService.getSubscriptionPlans.mockResolvedValue({
      planPrices: {
        free: { monthly: 0, annual: 0 },
        basic: { monthly: 299, annual: 2512 },
        premium: { monthly: 499, annual: 4192 }
      },
      planFeatures: {
        free: [
          'Basic stock information',
          'Limited search functionality',
          'No portfolio tracking',
          'No alerts'
        ],
        basic: [
          'Unlimited stock search',
          'Stock portfolio tracking (10 stocks)',
          'Basic Shariah compliance details',
          'Email alerts for major events'
        ],
        premium: [
          'Unlimited stock search',
          'Stock portfolio tracking (25 stocks)',
          'Advanced Shariah compliance analysis',
          'Priority alerts for all events',
          'Personalized investment insights'
        ]
      }
    });

    axios.post.mockResolvedValue({
      data: {
        status: 'success',
        subscription: { id: 'sub_123456' },
        order: { id: 'order_123456', amount: 499, currency: 'INR' },
        transactionId: 'txn_123456'
      }
    });
  });

  it('renders the SubscriptionDetails component correctly', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Initial loading state should be shown
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('subscription-details-container')).toBeInTheDocument();
    });
  });

  it('displays plan information correctly after loading', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('subscription-main-content')).toBeInTheDocument();
    });

    // Verify page title
    expect(screen.getByTestId('page-title')).toHaveTextContent('Choose your plan');
    
    // Verify plan cards
    expect(screen.getByTestId('free-plan-card')).toBeInTheDocument();
    expect(screen.getByTestId('basic-plan-card')).toBeInTheDocument();
    expect(screen.getByTestId('premium-plan-card')).toBeInTheDocument();
    
    // Verify plan prices (assuming monthly billing is default)
    expect(screen.getByTestId('free-plan-price')).toHaveTextContent('₹0');
    expect(screen.getByTestId('basic-plan-price')).toHaveTextContent('₹299');
    expect(screen.getByTestId('premium-plan-price')).toHaveTextContent('₹499');
  });

  it('toggles between monthly and annual billing cycles', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('billing-toggle-container')).toBeInTheDocument();
    });

    // Initially on monthly billing
    expect(screen.getByTestId('monthly-billing-button')).toHaveClass('bg-purple-600');
    
    // Switch to annual billing
    fireEvent.click(screen.getByTestId('annual-billing-button'));
    
    // Verify annual billing is active
    expect(screen.getByTestId('annual-billing-button')).toHaveClass('bg-purple-600');
    expect(screen.getByTestId('monthly-billing-button')).not.toHaveClass('bg-purple-600');
    
    // Verify annual prices are displayed
    expect(screen.getByTestId('basic-plan-price')).toHaveTextContent('₹2512');
    expect(screen.getByTestId('premium-plan-price')).toHaveTextContent('₹4192');
  });

  it('selects a plan and opens confirmation modal', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('basic-plan-card')).toBeInTheDocument();
    });

    // Click on the Basic plan button
    fireEvent.click(screen.getByTestId('select-basic-plan-button'));
    
    // Confirmation modal should appear
    await waitFor(() => {
      expect(screen.getByTestId('subscription-confirmation-modal')).toBeInTheDocument();
    });
    
    // Verify modal content
    expect(screen.getByTestId('subscription-confirmation-title')).toHaveTextContent('Confirm Subscription');
    expect(screen.getByTestId('subscription-details')).toHaveTextContent(/You're about to subscribe to the Basic plan/);
  });

  it('handles payment mode selection in the confirmation modal', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('basic-plan-card')).toBeInTheDocument();
    });

    // Click on Basic plan to open confirmation modal
    fireEvent.click(screen.getByTestId('select-basic-plan-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('payment-mode-selector')).toBeInTheDocument();
    });
    
    // Test payment mode selection (assuming PaymentModeSelector renders radio inputs with data-testid attributes)
    // Note: You may need to adjust this based on the actual implementation of PaymentModeSelector
    const manualPaymentOption = screen.getByTestId('manual-payment-option');
    fireEvent.click(manualPaymentOption);
    
    // Verify payment info is updated
    expect(screen.getByTestId('total-price')).toHaveTextContent('₹352.82'); // Base price + 18% GST
  });

  it('handles payment process when clicking confirm payment', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('premium-plan-card')).toBeInTheDocument();
    });

    // Select Premium plan
    fireEvent.click(screen.getByTestId('select-premium-plan-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('confirm-payment-button')).toBeInTheDocument();
    });
    
    // Click on confirm payment button
    fireEvent.click(screen.getByTestId('confirm-payment-button'));
    
    // Verify the payment process starts
    expect(axios.post).toHaveBeenCalledWith("/api/transaction/create-subscription", expect.objectContaining({
      plan: 'premium',
      billingCycle: 'monthly',
      userId: '123456'
    }));
    
    // Verify Razorpay is initialized
    await waitFor(() => {
      expect(window.Razorpay).toHaveBeenCalled();
    });
  });

  it('handles failed payment and displays error message', async () => {
    // Mock axios to simulate a payment error
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          error: 'Payment processing failed',
          pendingId: 'pending_123'
        }
      }
    });

    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('basic-plan-card')).toBeInTheDocument();
    });

    // Select Basic plan
    fireEvent.click(screen.getByTestId('select-basic-plan-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('confirm-payment-button')).toBeInTheDocument();
    });
    
    // Click confirm payment
    fireEvent.click(screen.getByTestId('confirm-payment-button'));
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId('payment-error-container')).toBeInTheDocument();
      expect(screen.getByTestId('payment-error-message')).toHaveTextContent(/pending subscription/);
      expect(screen.getByTestId('cancel-pending-payment-button')).toBeInTheDocument();
    });
  });

  it('shows upgrade confirmation modal when upgrading from Basic to Premium', async () => {
    // Mock user already on Basic plan
    authApi.getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      subscription: {
        plan: 'basic',
        billingCycle: 'monthly'
      }
    });

    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('premium-plan-card')).toBeInTheDocument();
    });

    // Click on Premium plan
    fireEvent.click(screen.getByTestId('select-premium-plan-button'));
    
    // Verify upgrade confirmation modal is shown
    await waitFor(() => {
      expect(screen.getByTestId('upgrade-confirmation-modal')).toBeInTheDocument();
    });
    
    // Verify modal content
    expect(screen.getByTestId('upgrade-confirmation-title')).toHaveTextContent('Upgrade Confirmation');
    expect(screen.getByTestId('upgrade-confirmation-message')).toHaveTextContent(/currently subscribed to the basic plan/i);
  });

  it('handles successful payment and shows success modal', async () => {
    // Mock successful payment verification
    axios.post.mockImplementation((url) => {
      if (url === "/api/transaction/verify-subscription" || url === "/api/transaction/verify-order") {
        return Promise.resolve({
          data: {
            status: 'success',
            user: {
              subscription: {
                plan: 'premium',
                billingCycle: 'monthly'
              }
            }
          }
        });
      }
      return Promise.resolve({
        data: {
          status: 'success',
          subscription: { id: 'sub_123456' },
          order: { id: 'order_123456', amount: 499, currency: 'INR' },
          transactionId: 'txn_123456'
        }
      });
    });
  
    // Setup global method to simulate Razorpay payment success callback
    // This would typically be called by the component after payment
    global.simulatePaymentSuccess = null;
  
    // Override the Razorpay mock to capture the success handler
    window.Razorpay = vi.fn().mockImplementation((options) => {
      // Store the success handler globally so we can call it later
      global.simulatePaymentSuccess = options.handler;
      
      return {
        on: vi.fn(),
        open: vi.fn()
      };
    });
  
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByTestId('premium-plan-card')).toBeInTheDocument();
    });
  
    // Select Premium plan
    fireEvent.click(screen.getByTestId('select-premium-plan-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('confirm-payment-button')).toBeInTheDocument();
    });
    
    // Click confirm payment
    fireEvent.click(screen.getByTestId('confirm-payment-button'));
    
    // Wait for the create subscription API to be called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/transaction/create-subscription", 
        expect.anything()
      );
    });
  
    // Now manually trigger the payment success handler if it was captured
    if (global.simulatePaymentSuccess) {
      global.simulatePaymentSuccess({
        razorpay_payment_id: 'pay_123456',
        razorpay_subscription_id: 'sub_123456',
        razorpay_signature: 'sig_123456'
      });
    }
    
    // Now look for the success modal
    await waitFor(() => {
      expect(screen.getByTestId('success-modal')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('success-title')).toHaveTextContent('Payment Successful');
    
    // Clean up
    delete global.simulatePaymentSuccess;
  });

  it('renders comparison table with correct plan features', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('plan-comparison-container')).toBeInTheDocument();
    });

    // Verify comparison table headers
    expect(screen.getByTestId('table-header-feature')).toHaveTextContent('Feature');
    expect(screen.getByTestId('table-header-free')).toHaveTextContent('Free');
    expect(screen.getByTestId('table-header-basic')).toHaveTextContent('Basic');
    expect(screen.getByTestId('table-header-premium')).toHaveTextContent('Premium');
    
    // Verify some feature rows
    expect(screen.getByTestId('free-search-limit')).toHaveTextContent('3 stocks');
    expect(screen.getByTestId('basic-search-limit')).toHaveTextContent('Unlimited');
    expect(screen.getByTestId('premium-storage')).toHaveTextContent('25 stocks');
  });

  it('prevents downgrading from premium to basic or free plan', async () => {
    // Mock user on Premium plan
    authApi.getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      subscription: {
        plan: 'premium',
        billingCycle: 'monthly'
      }
    });

    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('basic-plan-card')).toBeInTheDocument();
    });

    // Spy on window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Try to select Basic plan
    expect(screen.getByTestId('select-basic-plan-button')).toBeDisabled();
    fireEvent.click(screen.getByTestId('select-basic-plan-button'));
    
    // Clean up
    alertSpy.mockRestore();
  });

  it('disables upgrade button when already on premium plan', async () => {
    // Mock user on Premium plan
    authApi.getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      subscription: {
        plan: 'premium',
        billingCycle: 'monthly'
      }
    });

    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('upgrade-button')).toBeInTheDocument();
    });

    // Verify upgrade button is disabled
    const upgradeButton = screen.getByTestId('upgrade-button');
    expect(upgradeButton).toHaveClass('opacity-50');
    expect(upgradeButton).toHaveTextContent('You Have Premium');
  });

  it('handles closing confirmation modal', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('basic-plan-card')).toBeInTheDocument();
    });

    // Click on Basic plan
    fireEvent.click(screen.getByTestId('select-basic-plan-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('subscription-confirmation-modal')).toBeInTheDocument();
    });
    
    // Click close button
    fireEvent.click(screen.getByTestId('subscription-confirmation-close'));
    
    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('subscription-confirmation-modal')).not.toBeInTheDocument();
    });
  });
});
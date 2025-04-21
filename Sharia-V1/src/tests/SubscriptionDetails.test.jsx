// SubscriptionDetails.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SubscriptionDetails from '../components/SubscriptionDetails';
import { getUserData } from '../api/auth';
import { getSubscriptionPlans } from '../api/subscriptionService';
import axios from 'axios';

// Mock the necessary modules and functions
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

vi.mock('../api/auth', () => ({
  getUserData: vi.fn()
}));

vi.mock('../api/subscriptionService', () => ({
  getSubscriptionPlans: vi.fn(),
  getCurrentSubscription: vi.fn(),
  changeSubscriptionPlan: vi.fn()
}));

vi.mock('axios');

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: () => () => import('../components/Header'),
  };
});

vi.mock('./Header', () => ({
  default: () => <div data-testid="header-component">Header</div>,
}));


vi.mock('../PaymentModeSelector', () => ({
  default: ({ selected, onChange }) => (
    <div data-testid="payment-mode-selector">
      <button 
        data-testid="auto-payment" 
        onClick={() => onChange('automatic')}
        className={selected === 'automatic' ? 'selected' : ''}
      >
        Automatic
      </button>
      <button 
        data-testid="manual-payment" 
        onClick={() => onChange('manual')}
        className={selected === 'manual' ? 'selected' : ''}
      >
        Manual
      </button>
    </div>
  )
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {
    userEmail: 'test@example.com',
    userId: '123456'
  };
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.Razorpay
window.Razorpay = class Razorpay {
  constructor(options) {
    this.options = options;
  }
  on = vi.fn();
  open = vi.fn();
};

// Sample data for mocks
const mockUserData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  subscription: {
    plan: 'free',
    billingCycle: 'monthly',
    status: 'active'
  }
};

const mockPlansData = {
  planPrices: {
    free: { monthly: 0, annual: 0 },
    basic: { monthly: 299, annual: 2512 },
    premium: { monthly: 499, annual: 4192 }
  },
  planFeatures: {
    free: ['Basic Shariah compliance verification', 'Stock search (up to 3 stocks)', 'No portfolio tracking', 'No advanced analytics'],
    basic: ['Detailed Shariah compliance reports', 'Unlimited stock search', 'Store up to 10 stocks', 'Basic market alerts'],
    premium: ['Expert Shariah compliance analysis', 'Unlimited stock search', 'Store up to 25 stocks', 'Priority market alerts', 'Personalized investment advice']
  }
};

describe('SubscriptionDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup the mock implementations
    getUserData.mockResolvedValue(mockUserData);
    getSubscriptionPlans.mockResolvedValue(mockPlansData);
    axios.post.mockResolvedValue({ 
      data: { 
        status: 'success', 
        subscription: { id: 'sub_123' },
        order: { id: 'order_123', amount: 35282, currency: 'INR' },
        transactionId: 'txn_123'
      } 
    });
  });

  it('renders the component with initial free plan', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Check loading state
    expect(screen.getByText('Loading subscription plans...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Choose your plan')).toBeInTheDocument();
    });

    // Check that plan cards are rendered
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();

    // Verify that the billing cycle toggle is present
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Annual')).toBeInTheDocument();

    // Current plan should be "free" as per mock data
    const freePlanButton = screen.getAllByText('Current Plan')[0];
    expect(freePlanButton).toBeInTheDocument();
  });

  it('changes billing cycle when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Choose your plan')).toBeInTheDocument();
    });

    // Initially monthly prices should be displayed
    expect(screen.getByText('₹299')).toBeInTheDocument();
    expect(screen.getByText('₹499')).toBeInTheDocument();

    // Click annual billing toggle
    await user.click(screen.getByText('Annual'));

    // Now annual prices should be displayed
    expect(screen.getByText('₹2512')).toBeInTheDocument();
    expect(screen.getByText('₹4192')).toBeInTheDocument();
  });

  it('opens confirmation modal when selecting a paid plan', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Choose your plan')).toBeInTheDocument();
    });

    // Click on Basic plan
    const basicPlanButtons = screen.getAllByText('Select Plan');
    await user.click(basicPlanButtons[0]); // Basic plan button

    // Confirmation modal should appear
    await waitFor(() => {
      expect(screen.getByText('Confirm Subscription')).toBeInTheDocument();
      expect(screen.getByText(/You're about to subscribe to the Basic plan/)).toBeInTheDocument();
    });

    // Check if payment mode selector is rendered
    expect(screen.getByTestId('payment-mode-selector')).toBeInTheDocument();

    // Check price breakdown
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Tax (18% GST)')).toBeInTheDocument();
    expect(screen.getByText('₹299.00')).toBeInTheDocument(); // Subtotal amount
  });

  it('changes payment mode when selecting different options', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Choose your plan')).toBeInTheDocument();
    });

    // Click on Premium plan
    const premiumPlanButtons = screen.getAllByText('Select Plan');
    await user.click(premiumPlanButtons[1]); // Premium plan button

    // Confirmation modal should appear
    await waitFor(() => {
      expect(screen.getByText('Confirm Subscription')).toBeInTheDocument();
    });

    // Default payment mode should be automatic
    expect(screen.getByTestId('auto-payment').className).toContain('selected');

    // Change to manual payment
    await user.click(screen.getByTestId('manual-payment'));
    expect(screen.getByTestId('manual-payment').className).toContain('selected');
  });

  it('initiates payment when confirm button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Choose your plan')).toBeInTheDocument();
    });

    // Click on Basic plan
    const basicPlanButtons = screen.getAllByText('Select Plan');
    await user.click(basicPlanButtons[0]); // Basic plan button

    // Wait for confirmation modal
    await waitFor(() => {
      expect(screen.getByText('Confirm Subscription')).toBeInTheDocument();
    });

    // Click confirm payment
    await user.click(screen.getByText('Confirm Payment'));

    // Check if payment processing is initiated
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/transaction/create-subscription",
        expect.objectContaining({
          plan: 'basic',
          billingCycle: 'monthly',
          userId: '123456'
        })
      );
    });

    // Verify Razorpay was initialized
    expect(window.Razorpay.prototype.open).toHaveBeenCalled();
  });

  it('shows upgrade confirmation modal when basic user tries to upgrade to premium', async () => {
    // Mock user with basic plan
    getUserData.mockResolvedValue({
      ...mockUserData,
      subscription: {
        plan: 'basic',
        billingCycle: 'monthly',
        status: 'active'
      }
    });

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Choose your plan')).toBeInTheDocument();
    });

    // Click on Premium plan
    const premiumPlanButtons = screen.getAllByText('Select Plan');
    await user.click(premiumPlanButtons[0]); // Premium plan button

    // Upgrade confirmation modal should appear
    await waitFor(() => {
      expect(screen.getByText('Upgrade Confirmation')).toBeInTheDocument();
      expect(screen.getByText(/You are currently subscribed to the basic plan/i)).toBeInTheDocument();
    });

    // Click confirm upgrade
    await user.click(screen.getByText('Confirm Upgrade'));

    // Now the payment confirmation modal should appear
    await waitFor(() => {
      expect(screen.getByText('Confirm Subscription')).toBeInTheDocument();
    });
  });

  it('shows success modal after payment completion', async () => {
    const user = userEvent.setup();
    
    // Mock successful payment verification
    axios.post.mockImplementation((url) => {
      if (url === "/api/transaction/verify-subscription" || url === "/api/transaction/verify-order") {
        return Promise.resolve({
          data: {
            status: 'success',
            user: {
              ...mockUserData,
              subscription: {
                plan: 'basic',
                billingCycle: 'monthly',
                status: 'active'
              }
            }
          }
        });
      }
      return Promise.resolve({ 
        data: { 
          status: 'success', 
          subscription: { id: 'sub_123' },
          order: { id: 'order_123', amount: 35282, currency: 'INR' },
          transactionId: 'txn_123'
        } 
      });
    });

    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Choose your plan')).toBeInTheDocument();
    });

    // Click on Basic plan
    const basicPlanButtons = screen.getAllByText('Select Plan');
    await user.click(basicPlanButtons[0]); // Basic plan button

    // Wait for confirmation modal
    await waitFor(() => {
      expect(screen.getByText('Confirm Subscription')).toBeInTheDocument();
    });

    // Click confirm payment
    await user.click(screen.getByText('Confirm Payment'));

    // Simulate payment completion by directly calling the handler
    const razorpayInstance = window.Razorpay.prototype;
    const handlerFunction = razorpayInstance.open.mock.calls[0][0].handler;
    
    // Call the handler with mock response
    await handlerFunction({
      razorpay_payment_id: 'pay_123',
      razorpay_subscription_id: 'sub_123',
      razorpay_signature: 'sig_123'
    });

    // Success modal should appear
    await waitFor(() => {
      expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
      expect(screen.getByText(/Your subscription has been updated to the Basic plan/)).toBeInTheDocument();
    });
  });

  it('handles payment errors correctly', async () => {
    // Mock payment error
    axios.post.mockImplementationOnce(() => {
      return Promise.reject({
        response: {
          data: {
            error: 'Payment failed',
            pendingId: 'pending_123' // This will trigger the pending payment scenario
          }
        }
      });
    });

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Choose your plan')).toBeInTheDocument();
    });

    // Click on Basic plan
    const basicPlanButtons = screen.getAllByText('Select Plan');
    await user.click(basicPlanButtons[0]); // Basic plan button

    // Wait for confirmation modal
    await waitFor(() => {
      expect(screen.getByText('Confirm Subscription')).toBeInTheDocument();
    });

    // Click confirm payment
    await user.click(screen.getByText('Confirm Payment'));

    // Error message should appear
    await waitFor(() => {
      expect(screen.getByText(/You already have a pending subscription for this plan/)).toBeInTheDocument();
      expect(screen.getByText('Cancel Pending Payment')).toBeInTheDocument();
    });

    // Click cancel pending payment
    await user.click(screen.getByText('Cancel Pending Payment'));

    // Success message for cancellation should appear
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/transaction/cancel-pending-subscription",
        expect.any(Object)
      );
    });
  });

  it('prevents downgrading directly from premium to free', async () => {
    // Mock user with premium plan
    getUserData.mockResolvedValue({
      ...mockUserData,
      subscription: {
        plan: 'premium',
        billingCycle: 'monthly',
        status: 'active'
      }
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Choose your plan')).toBeInTheDocument();
    });

    // Current plan should show as Premium
    expect(screen.getByText('Current Plan')).toBeInTheDocument();

    // Try to click on Free plan
    await user.click(screen.getByText('Contact Support to Downgrade'));

    // Alert should be shown
    expect(alertMock).toHaveBeenCalledWith(
      "You're currently on our Premium plan. Please contact customer support if you wish to downgrade."
    );

    alertMock.mockRestore();
  });
});
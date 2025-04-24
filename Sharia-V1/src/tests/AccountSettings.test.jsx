import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AccountInformationPage from '../components/AccountSettings';
import axios from 'axios';
import { getUserData } from '../api/auth';

const navigateMock = vi.fn();
// Mock modules and dependencies
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ pathname: '/account' })
  };
});

vi.mock('../api/auth', () => ({
  getUserData: vi.fn()
}));

vi.mock('axios');

vi.mock('../components/Header', () => ({
  default: () => <div data-testid="mocked-header">Header</div>
}));

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="mocked-footer">Footer</div>
}));

vi.mock('../components/DeactivateAccount', () => ({
  default: ({ onDeactivationSuccess, onCancel }) => (
    <div data-testid="mocked-deactivate-account">
      <button data-testid="confirm-deactivate" onClick={onDeactivationSuccess}>Confirm</button>
      <button data-testid="cancel-deactivate" onClick={onCancel}>Cancel</button>
    </div>
  )
}));

describe('AccountInformationPage', () => {
  const mockUserData = {
    _id: '123456789',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: '2023-01-01T00:00:00.000Z',
    subscription: {
      status: 'active',
      plan: 'premium',
      billingCycle: 'monthly',
      endDate: '2025-12-31T00:00:00.000Z',
      paymentMode: 'automatic',
      subscriptionId: 'sub_123456'
    }
  };

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'test@example.com'),
        setItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    });

    // Reset mocks
    vi.clearAllMocks();
    
    // Setup default mock responses
    getUserData.mockResolvedValue(mockUserData);
    axios.post.mockResolvedValue({ data: { status: 'success', user: mockUserData } });
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('renders the page with user data after loading', async () => {
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByTestId('account-information-page')).toBeInTheDocument();
    });
    
    // Check main sections are rendered
    expect(screen.getByTestId('user-info-section')).toBeInTheDocument();
    expect(screen.getByTestId('subscription-section')).toBeInTheDocument();
    expect(screen.getByTestId('payment-info-section')).toBeInTheDocument();
    expect(screen.getByTestId('account-management-section')).toBeInTheDocument();
    
    // Check user information is displayed correctly
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    
    // Check plan information is displayed correctly
    expect(screen.getByTestId('current-plan')).toHaveTextContent('Premium');
  });

  it('opens and closes the delete account modal', async () => {
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByTestId('account-information-page')).toBeInTheDocument();
    });
    
    // Click delete account button
    fireEvent.click(screen.getByTestId('delete-account-button'));
    
    // Check modal is displayed
    expect(screen.getByTestId('deactivate-modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('deactivate-account-modal')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByTestId('cancel-deactivate'));
    
    // Check modal is no longer displayed
    await waitFor(() => {
      expect(screen.queryByTestId('deactivate-modal-overlay')).not.toBeInTheDocument();
    });
  });

  it('opens and closes the cancel subscription modal', async () => {
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByTestId('account-information-page')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('cancel-subscription-button')).toBeInTheDocument();
    });
    // Click cancel subscription button
    fireEvent.click(screen.getByTestId('cancel-subscription-button'));
    
    // Check modal is displayed
    expect(screen.getByTestId('cancel-subscription-modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-subscription-modal')).toBeInTheDocument();
    
    // Close the modal using the close button
    fireEvent.click(screen.getByTestId('close-cancel-modal-button'));
    
    // Check modal is no longer displayed
    await waitFor(() => {
      expect(screen.queryByTestId('cancel-subscription-modal-overlay')).not.toBeInTheDocument();
    });
  });

  it('handles subscription cancellation process', async () => {
    // Mock successful cancellation response
    axios.post.mockResolvedValueOnce({
      data: { 
        message: 'Subscription cancelled successfully',
        status: 'success'
      }
    });

    render(
      <BrowserRouter>
        <AccountInformationPage user={mockUserData}/>
      </BrowserRouter>
    );
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByTestId('account-information-page')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('cancel-subscription-button')).toBeInTheDocument();
    });
    // Click cancel subscription button
    fireEvent.click(screen.getByTestId('cancel-subscription-button'));
    
    // Fill in reason and feedback
    const selectElement = screen.getByTestId('cancellation-reason-select');
    fireEvent.change(selectElement, { target: { value: 'Too expensive' } });
    
    const feedbackTextarea = screen.getByTestId('cancellation-feedback-textarea');
    fireEvent.change(feedbackTextarea, { target: { value: 'The price is too high for me' } });
    
    // Click confirm cancellation button
    fireEvent.click(screen.getByTestId('confirm-cancel-subscription-button'));
    
    // Check axios was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/transaction/cancel-subscription', {
        userId: mockUserData._id,
        subscriptionId: mockUserData.subscription.subscriptionId,
        reason: 'Too expensive',
        feedback: 'The price is too high for me'
      });
    });
    
    // Check notification is displayed
    await waitFor(() => {
      expect(screen.getByTestId('notification-alert')).toBeInTheDocument();
    });
  });

  it('handles payment mode changes (automatic to manual)', async () => {
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByTestId('payment-mode-section')).toBeInTheDocument();
    });
    
    // Click manual payment option
    fireEvent.click(screen.getByTestId('manual-payment-option'));
    
    // Check alert modal appears
    expect(screen.getByTestId('payment-mode-alert-modal')).toBeInTheDocument();
    
    // Confirm switch to manual
    fireEvent.click(screen.getByTestId('switch-to-manual-button'));
    
    // Check alert modal closed
    await waitFor(() => {
      expect(screen.queryByTestId('payment-mode-alert-modal')).not.toBeInTheDocument();
    });
    
    // Save changes
    fireEvent.click(screen.getByTestId('save-payment-mode-button'));
    
    // Check axios was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/transaction/update-payment-mode', {
        userId: mockUserData._id,
        paymentMode: 'manual',
        effectiveDate: mockUserData.subscription.endDate
      });
    });
    
    // Check success message appears
    await waitFor(() => {
      expect(screen.getByTestId('payment-mode-success')).toBeInTheDocument();
    });
  });

  it('displays pending payment mode change banner when applicable', async () => {
    // Modified user data with pending payment mode change
    const userWithPendingChange = {
      ...mockUserData,
      subscription: {
        ...mockUserData.subscription,
        pendingPaymentMode: 'manual',
        paymentModeChangeDate: '2025-12-31T00:00:00.000Z'
      }
    };
    
    getUserData.mockResolvedValueOnce(userWithPendingChange);
    
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByTestId('account-information-page')).toBeInTheDocument();
    });
    
    // Check if pending change banner is displayed
    expect(screen.getByTestId('pending-change-banner')).toBeInTheDocument();
    
    // Test canceling the pending change
    fireEvent.click(screen.getByTestId('cancel-change-button'));
    
    // Check axios was called correctly
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/transaction/cancel-manual-payment-change', {
        userId: userWithPendingChange._id
      });
    });
  });

  it('handles account deactivation', async () => {
    // const navigateMock = vi.fn();
    // useNavigate.mockReturnValue(navigateMock);
    
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByTestId('account-information-page')).toBeInTheDocument();
    });
    
    // Click delete account button
    fireEvent.click(screen.getByTestId('delete-account-button'));
    
    // Confirm deactivation
    fireEvent.click(screen.getByTestId('confirm-deactivate'));
    
    // Check localStorage was cleared and navigate was called
    expect(window.localStorage.clear).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/signup');
  });

  it('renders inactive subscription message when subscription is not active', async () => {
    // User data with inactive subscription
    const inactiveUser = {
      ...mockUserData,
      subscription: {
        ...mockUserData.subscription,
        status: 'cancelled'
      }
    };
    
    getUserData.mockResolvedValueOnce(inactiveUser);
    
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByTestId('account-information-page')).toBeInTheDocument();
    });
    
    // Check inactive subscription message is displayed
    expect(screen.getByTestId('inactive-subscription-message')).toBeInTheDocument();
    expect(screen.getByTestId('view-subscription-plans-button')).toBeInTheDocument();
  });

  it('handles API errors when fetching user data', async () => {
    // Mock API error
    getUserData.mockRejectedValueOnce(new Error('Failed to fetch user data'));
    
    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
    
    // Check error was logged
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching user data:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('handles API errors when updating payment mode', async () => {
    // Mock API error
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          error: 'Failed to update payment mode'
        }
      }
    });
    
    render(
      <BrowserRouter>
        <AccountInformationPage />
      </BrowserRouter>
    );
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByTestId('payment-mode-section')).toBeInTheDocument();
    });
    
    // Change payment mode to manual and confirm
    fireEvent.click(screen.getByTestId('manual-payment-option'));
    fireEvent.click(screen.getByTestId('switch-to-manual-button'));
    
    // Save changes
    fireEvent.click(screen.getByTestId('save-payment-mode-button'));
    
    // Check error message appears
    await waitFor(() => {
      expect(screen.getByTestId('payment-mode-error')).toBeInTheDocument();
      expect(screen.getByTestId('payment-mode-error')).toHaveTextContent('Failed to update payment mode');
    });
  });
});
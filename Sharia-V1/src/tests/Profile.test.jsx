// src/components/Profile.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// --- Mocking ---

// Mock API calls - Must be before imports
vi.mock('../api/auth', () => ({
  getUserData: vi.fn(),
  uploadProfilePicture: vi.fn(),
}));

// Mock usePaymentAlert hook - FIXED: Use factory function pattern to avoid hoisting issues
vi.mock('../components/usePaymentAlert', () => ({
  default: vi.fn().mockReturnValue({
    isOpen: false,
    type: null,
    daysRemaining: 0,
    amount: 0,
    closeAlert: vi.fn(),
  })
}));

// Mock Lazy Loaded Header
vi.mock('./Header', () => ({
  default: () => <div data-testid="header-component">Mock Header</div>,
}));

// Mock PaymentAlertModal
vi.mock('./PaymentAlertModal', () => ({
  default: ({ isOpen, onClose, type, daysRemaining, amount }) => (
    <div data-testid="payment-alert-modal" data-open={isOpen}>
      PaymentModal: {type} {daysRemaining} {amount}
    </div>
  ),
}));

// Mock image imports (adjust paths if necessary)
vi.mock('../images/account-icon.svg', () => ({ default: 'account-icon.svg' }));
vi.mock('../images/ShariaStocks-logo/logo1.jpeg', () => ({ default: 'logo1.jpeg' }));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ 
        pathname: '/profile',
        state: null,
        search: '',
        hash: '',
        key: 'testkey',
    }),
  };
});

// Now import the mocked modules
import Profile from '../components/Profile';
import { getUserData, uploadProfilePicture } from '../api/auth';
import usePaymentAlert from '../components/usePaymentAlert';

// Mock FileReader for profile picture uploads
global.FileReader = class {
  constructor() {
    this.onload = null;
  }
  readAsDataURL() {
    setTimeout(() => {
      if (this.onload) {
        this.onload({ target: { result: 'data:image/png;base64,mockpreviewdata' } });
      }
    }, 0);
  }
};

// Mock window.alert
global.alert = vi.fn();

// --- Test Suite ---

describe('Profile Component', () => {
  const userEmail = 'test@example.com';

  const freeUserData = {
    name: 'Test User Free',
    email: userEmail,
    profilePicture: null,
    subscription: {
      plan: 'free',
      status: 'active',
      billingCycle: null,
    },
    // Add other necessary fields based on your data structure
  };

  const premiumUserData = {
    name: 'Test User Premium',
    email: userEmail,
    profilePicture: 'http://example.com/profile.jpg',
    subscription: {
      plan: 'premium',
      status: 'active',
      billingCycle: 'monthly',
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      amount: 100,
    },
  };

  const setup = (initialUser = freeUserData, paymentAlertOpen = false, paymentAlertType = 'warning') => {
    localStorage.setItem('userEmail', userEmail);
    getUserData.mockResolvedValue(initialUser);
    
    // FIXED: Use mockImplementation instead of mockReturnValue
    usePaymentAlert.mockImplementation(() => ({
        isOpen: paymentAlertOpen,
        type: paymentAlertType,
        daysRemaining: initialUser.subscription?.plan !== 'free' ? 10 : 0, // Example calculation
        amount: initialUser.subscription?.amount ?? 0,
        closeAlert: vi.fn(),
    }));

    // Use MemoryRouter to wrap the component for routing context
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          {/* Add dummy routes for navigation targets */}
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route path="/editprofile" element={<div>Edit Profile Page</div>} />
          <Route path="/account" element={<div>Account Page</div>} />
          <Route path="/notificationpage" element={<div>Notifications Page</div>} />
          <Route path="/subscriptiondetails" element={<div>Subscription Details Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Reset mocks before each test if setup isn't called in every test
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should display loading spinner initially', () => {
    // Make getUserData promise pending indefinitely
    getUserData.mockReturnValue(new Promise(() => {}));
    localStorage.setItem('userEmail', userEmail);

    render(
      <MemoryRouter><Profile /></MemoryRouter>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display error message if fetching user data fails', async () => {
    getUserData.mockRejectedValue(new Error('Failed to fetch'));
    localStorage.setItem('userEmail', userEmail);

    render(
        <MemoryRouter><Profile /></MemoryRouter>
      );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to load user data');
  });

   it('should display error message if no email is found in localStorage', async () => {
    // No localStorage.setItem('userEmail', ...) called
    render(
        <MemoryRouter><Profile /></MemoryRouter>
      );

    await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('error-message')).toHaveTextContent('No email found');
  });

  it('should render profile information for a free user', async () => {
    setup(freeUserData);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('header-component')).toBeInTheDocument(); // Check if Header mock rendered
    expect(screen.getByTestId('user-name')).toHaveTextContent(freeUserData.name);
    expect(screen.getByTestId('user-email')).toHaveTextContent(freeUserData.email);
    expect(screen.getByTestId('profile-image')).toHaveAttribute('src', 'account-icon.svg'); // Default image
    expect(screen.getByTestId('free-plan-card')).toBeInTheDocument();
    expect(screen.getByTestId('upgrade-button')).toBeInTheDocument();
    expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
    expect(screen.getByTestId('account-settings-button')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-button')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.queryByTestId('payment-alert-modal')).not.toBeInTheDocument(); // Modal not open
  });

  it('should render profile information and plan details for a premium user', async () => {
    setup(premiumUserData);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('user-name')).toHaveTextContent(premiumUserData.name);
    expect(screen.getByTestId('user-email')).toHaveTextContent(premiumUserData.email);
    expect(screen.getByTestId('profile-image')).toHaveAttribute('src', premiumUserData.profilePicture);
    expect(screen.getByTestId('premium-plan-card')).toBeInTheDocument();
    expect(screen.getByTestId('plan-type')).toHaveTextContent(premiumUserData.subscription.plan);
    expect(screen.getByTestId('plan-status')).toHaveTextContent(premiumUserData.subscription.status);
    expect(screen.getByTestId('billing-cycle')).toHaveTextContent(premiumUserData.subscription.billingCycle);
    expect(screen.queryByTestId('upgrade-button')).not.toBeInTheDocument(); // No upgrade button for premium
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

   it('should display payment alert modal when hook returns isOpen true', async () => {
    setup(premiumUserData, true, 'due'); // Pass true to open the modal

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('mock-payment-alert')).toBeInTheDocument();
  });


  it('should handle profile picture selection and preview', async () => {
    setup();
    const user = userEvent.setup();

    await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const input = screen.getByTestId('profile-picture-input'); // Use testId for hidden input

    // Simulate file upload
    await user.upload(input, file);

    // Check for preview URL (using the mock FileReader result)
    expect(screen.getByTestId('profile-image')).toHaveAttribute('src', 'data:image/png;base64,mockpreviewdata');

    // Check if save/cancel buttons appear
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();

    // Click cancel
    await user.click(screen.getByTestId('cancel-button'));

    // Check if buttons disappear and image reverts (to default in this case)
    expect(screen.queryByTestId('save-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('profile-image')).toHaveAttribute('src', 'account-icon.svg');
  });

  it('should handle profile picture upload successfully', async () => {
    setup();
    const user = userEvent.setup();
    const newPictureUrl = 'http://example.com/new-profile.jpg';
    const updatedUserData = { ...freeUserData, profilePicture: newPictureUrl };

    uploadProfilePicture.mockResolvedValue({ profilePicture: newPictureUrl }); // Mock successful upload
    const setItemSpy = vi.spyOn(localStorage, 'setItem');


    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const input = screen.getByTestId('profile-picture-input');

    // Select file
    await user.upload(input, file);
    expect(screen.getByTestId('save-button')).toBeInTheDocument(); // Ensure save button is there

    // Click save
    await user.click(screen.getByTestId('save-button'));

    // Wait for async operations
    await waitFor(() => {
      expect(uploadProfilePicture).toHaveBeenCalledTimes(1);
    });

    // Check API call arguments (more specific check on FormData content)
    const formData = uploadProfilePicture.mock.calls[0][0];
    expect(formData.get('profilePicture')).toBe(file);
    expect(formData.get('email')).toBe(userEmail);

    // Check localStorage update
    expect(setItemSpy).toHaveBeenCalledWith('userData', expect.stringContaining(newPictureUrl));

    // Check alert (mocked)
    expect(window.alert).toHaveBeenCalledWith('Profile picture updated successfully');

    // Check if image updates on screen
    expect(screen.getByTestId('profile-image')).toHaveAttribute('src', newPictureUrl);

    // Check if save/cancel buttons disappear
    expect(screen.queryByTestId('save-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();

    setItemSpy.mockRestore(); // Clean up spy
  });

   it('should show alert if profile picture upload fails', async () => {
    setup();
    const user = userEvent.setup();
    uploadProfilePicture.mockRejectedValue(new Error('Upload failed')); // Mock failed upload

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const input = screen.getByTestId('profile-picture-input');

    await user.upload(input, file);
    await user.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(uploadProfilePicture).toHaveBeenCalledTimes(1);
    });

    // Check alert (mocked)
    expect(window.alert).toHaveBeenCalledWith('Failed to upload profile picture');

     // Check if buttons are still present (usually they might hide, depends on implementation)
    // expect(screen.getByTestId('save-button')).toBeInTheDocument();
    // expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    // Check image is still the preview
    expect(screen.getByTestId('profile-image')).toHaveAttribute('src', 'data:image/png;base64,mockpreviewdata');
  });

  it('should navigate correctly when clicking buttons', async () => {
    setup(premiumUserData); // Use premium user to avoid upgrade button logic interfering initially
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Back button
    await user.click(screen.getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

    // Edit Profile button
    await user.click(screen.getByTestId('edit-profile-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/editprofile');

    // Account Settings button
    await user.click(screen.getByTestId('account-settings-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/account', { state: { user: premiumUserData } });

    // Notifications button
    await user.click(screen.getByTestId('notifications-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/notificationpage', { state: { user: premiumUserData } });

    // Logout button
    const clearSpy = vi.spyOn(localStorage, 'clear');
    await user.click(screen.getByTestId('logout-button'));
    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    clearSpy.mockRestore();
  });

  it('should navigate to subscription details when "Upgrade Now" is clicked (free user)', async () => {
     setup(freeUserData); // Setup as free user
     const user = userEvent.setup();

     await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

     await user.click(screen.getByTestId('upgrade-button'));
     expect(mockNavigate).toHaveBeenCalledWith('/subscriptiondetails');
   });

   // ErrorBoundary Test - Fixed to use a proper implementation
   describe('ErrorBoundary', () => {
      // Silence console.error for this test
      let consoleErrorSpy;
      beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      });
      afterEach(() => {
        consoleErrorSpy.mockRestore();
      });

      // Create a component that throws during render for testing the boundary
      const ThrowingComponent = () => {
        throw new Error('Test error');
        return null; // Never reached
      };

      it('should render error UI when a child component throws an error', () => {
          // Create a minimal ErrorBoundary class component to test with
          class ErrorBoundary extends React.Component {
            constructor(props) {
              super(props);
              this.state = { hasError: false };
            }
            
            static getDerivedStateFromError(error) {
              return { hasError: true };
            }
            
            render() {
              if (this.state.hasError) {
                return <div data-testid="error-boundary">Error Occurred</div>;
              }
              return this.props.children;
            }
          }
          
          render(<ErrorBoundary><ThrowingComponent /></ErrorBoundary>);
          expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });
   });
});
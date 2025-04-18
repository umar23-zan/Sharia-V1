// Profile.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';
import { getUserData, uploadProfilePicture } from '../api/auth';
import usePaymentAlert from './usePaymentAlert';
import '@testing-library/jest-dom';

// Mock the modules
const mockNavigate = vi.fn();

// Mocking react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: null
    })
  };
});

vi.mock('../api/auth', () => ({
  getUserData: vi.fn(),
  uploadProfilePicture: vi.fn()
}));

vi.mock('./usePaymentAlert', () => ({
  default: vi.fn()
}));

vi.mock('./PaymentAlertModal', () => ({
  default: ({ isOpen, onClose, type, daysRemaining, amount }) => (
    <div data-testid="payment-alert-modal" style={{ display: isOpen ? 'block' : 'none' }}>
      <div data-testid="payment-alert-type">{type}</div>
      <div data-testid="payment-alert-days">{daysRemaining}</div>
      <div data-testid="payment-alert-amount">{amount}</div>
      <button data-testid="close-payment-alert" onClick={onClose}>Close</button>
    </div>
  )
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft Icon</div>,
  Camera: () => <div data-testid="camera-icon">Camera Icon</div>,
  Settings: () => <div data-testid="settings-icon">Settings Icon</div>,
  LogOut: () => <div data-testid="logout-icon">Logout Icon</div>,
  ChevronLeft: () => <div data-testid="chevron-left-icon">ChevronLeft Icon</div>,
  AlertTriangle: () => <div data-testid="alert-triangle-icon">AlertTriangle Icon</div>,
  Loader2: () => <div data-testid="loader-icon">Loader Icon</div>,
  ClockIcon: () => <div data-testid="clock-icon">Clock Icon</div>,
  EditIcon: () => <div data-testid="edit-icon">Edit Icon</div>,
  UserIcon: () => <div data-testid="user-icon">User Icon</div>
}));

vi.mock('./Header', () => ({
  default: () => <div data-testid="header-component">Header</div>
}));

vi.mock('../images/account-icon.svg', () => ({
  default: 'mocked-account-icon'
}))

vi.mock('../images/ShariaStocks-logo/logo1.jpeg', () => ({
  default: 'mocked-logo'
}))

// Mock localStorage
const localStorageMock = (() => {
  let store = { userEmail: 'test@example.com', userData: JSON.stringify({}) };
  return {
    getItem: vi.fn((key) => store[key]),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock FileReader
global.FileReader = class {
  constructor() {
    this.onloadend = null;
  }
  readAsDataURL() {
    setTimeout(() => {
      this.result = 'data:image/jpeg;base64,mockbase64data';
      this.onloadend && this.onloadend();
    }, 0);
  }
};

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-object-url');

// Mock alert
global.alert = vi.fn();

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      contactNumber: '1234567890',
      profilePicture: 'https://example.com/profile.jpg',
      subscription: {
        plan: 'free',
        status: 'active',
        billingCycle: 'monthly'
      }
    });
    
    uploadProfilePicture.mockResolvedValue({ 
      profilePicture: 'https://example.com/updated-profile.jpg' 
    });
    
    usePaymentAlert.mockReturnValue({
      isOpen: false,
      type: '',
      daysRemaining: 0,
      amount: 0,
      closeAlert: vi.fn()
    });
  });

  test('should render loading state initially', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByText('Loading your profile...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(getUserData).toHaveBeenCalledWith('test@example.com');
    });
  });

  test('should display user data after loading', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });
  });

  test('should display free user premium plan promotion', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Premium Plan')).toBeInTheDocument();
      expect(screen.getByText('Unlock exclusive features')).toBeInTheDocument();
      expect(screen.getByText('Upgrade Now')).toBeInTheDocument();
      
      // Check for premium features
      expect(screen.getByText('Real-time Alerts')).toBeInTheDocument();
      expect(screen.getByText('Portfolio Analytics')).toBeInTheDocument();
      expect(screen.getByText('Expert Reports')).toBeInTheDocument();
    });
  });

  test('should display premium subscription details for premium users', async () => {
    getUserData.mockResolvedValue({
      name: 'Premium User',
      email: 'premium@example.com',
      profilePicture: 'https://example.com/profile.jpg',
      subscription: {
        plan: 'premium',
        status: 'active',
        billingCycle: 'annual'
      }
    });
    
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Plan Details')).toBeInTheDocument();
      expect(screen.getByText('Your current subscription')).toBeInTheDocument();
      expect(screen.getByText('premium')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByText('annual')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  test('should handle profile picture upload', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    // Create a test file
    const file = new File(['dummy content'], 'profile.png', { type: 'image/png' });
    
    // Get file input and simulate upload
    const fileInput = document.getElementById('profilePicture');
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    
    // Check if the save and cancel buttons appear
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
    
    // Click save and check if uploadProfilePicture is called
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });
    
    await waitFor(() => {
      expect(uploadProfilePicture).toHaveBeenCalled();
      const formData = uploadProfilePicture.mock.calls[0][0];
      expect(formData.get('email')).toBe('test@example.com');
      expect(formData.get('profilePicture')).toEqual(file);
      
      expect(global.alert).toHaveBeenCalledWith('Profile picture updated successfully');
    });
  });

  test('should handle cancel button for profile picture upload', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    // Create a test file
    const file = new File(['dummy content'], 'profile.png', { type: 'image/png' });
    
    // Get file input and simulate upload
    const fileInput = document.getElementById('profilePicture');
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    
    // Click cancel button
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });
    
    // Check that the save and cancel buttons are no longer visible
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });
  });

  test('should handle invalid image file', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    // Mock file validation failure
    global.alert.mockClear();
    
    // Create a test file that's invalid (too large)
    const file = new File(['dummy content'.repeat(1000000)], 'large.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB file
    
    // Get file input and simulate upload
    const fileInput = document.getElementById('profilePicture');
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Please upload a valid image (max 5MB)');
    });
  });

  test('should handle logout', async () => {
    mockNavigate.mockClear();
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    // Click the logout button
    fireEvent.click(screen.getByText('Log Out'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(localStorage.clear).toHaveBeenCalled();
  });

  test('should handle navigation to different pages', async () => {
    
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    // Test navigation to edit profile
    fireEvent.click(screen.getByText('Edit Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/editprofile');
    
    // Test navigation to account
    fireEvent.click(screen.getByText('Account Settings'));
    expect(mockNavigate).toHaveBeenCalledWith('/account', { state: { user: expect.any(Object) } });
    
    // Test navigation to notifications
    fireEvent.click(screen.getByText('Notifications'));
    expect(mockNavigate).toHaveBeenCalledWith('/notificationpage', { state: { user: expect.any(Object) } });
    
    // Test navigation back to dashboard
    fireEvent.click(screen.getByText('Back to Dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    
    // Test upgrade button for free users
    fireEvent.click(screen.getByText('Upgrade Now'));
    expect(mockNavigate).toHaveBeenCalledWith('/subscriptiondetails');
  });

  test('should display payment alert modal when usePaymentAlert returns isOpen=true', async () => {
    // Mock payment alert hook to return open state
    usePaymentAlert.mockReturnValue({
      isOpen: true,
      type: 'expiring',
      daysRemaining: 5,
      amount: 99.99,
      closeAlert: vi.fn()
    });
    
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      // Check that the payment alert modal is displayed
      expect(screen.getByTestId('payment-alert-modal')).toHaveStyle({ display: 'block' });
      expect(screen.getByTestId('payment-alert-type')).toHaveTextContent('expiring');
      expect(screen.getByTestId('payment-alert-days')).toHaveTextContent('5');
      expect(screen.getByTestId('payment-alert-amount')).toHaveTextContent('99.99');
    });
    
    // Test closing the modal
    const closeAlert = usePaymentAlert().closeAlert;
    fireEvent.click(screen.getByTestId('close-payment-alert'));
    expect(closeAlert).toHaveBeenCalled();
  });

  test('should handle error state when fetching user data fails', async () => {
    // Mock API failure
    getUserData.mockRejectedValueOnce(new Error('Failed to fetch'));
    
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load user data')).toBeInTheDocument();
    });
  });

  test('should handle error state when no email is found', async () => {
    // Remove email from localStorage
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userEmail') return null;
      return '{}'; // Return default value for other keys
    });
    
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    // Wait for the component to try fetching user data
    await waitFor(() => {
      // Check if the component redirects to login or shows some error message
      // This depends on how your Profile component handles missing email
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      // OR expect some error message that actually appears in your component
      // For example:
      // expect(screen.getByText('Please log in to view your profile')).toBeInTheDocument();
    });
  });

  test('should handle profile picture upload error', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    // Create a test file
    const file = new File(['dummy content'], 'profile.png', { type: 'image/png' });
    
    // Mock upload failure
    uploadProfilePicture.mockRejectedValueOnce(new Error('Upload failed'));
    global.alert.mockClear();
    
    // Get file input and simulate upload
    const fileInput = document.getElementById('profilePicture');
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    
    // Click save button
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to upload profile picture');
    });
  });
});
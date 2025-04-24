import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from '../components/ResetPassword';
import { resetPassword } from '../api/auth';

// Mock the modules
vi.mock('../api/auth', () => ({
  resetPassword: vi.fn(),
}));

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ token: 'test-token' }),
  };
});

// Mock the logo import
vi.mock('../images/ShariaStocks-logo/ShariaStocks1.png', () => ({
  default: 'mocked-logo-path'
}))

describe('ResetPassword Component', () => {
  // Setup user event for better interactions
  const user = userEvent.setup();
  
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  // Clean up after all tests
  afterEach(() => {
    cleanup();
    vi.useRealTimers(); 
    vi.restoreAllMocks();
  });

  it('renders the reset password form correctly', () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    // Check if all elements are rendered
    expect(screen.getByTestId('reset-password-container')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-login-button')).toBeInTheDocument();
    expect(screen.getByTestId('logo-image')).toBeInTheDocument();
    expect(screen.getByTestId('reset-password-form')).toBeInTheDocument();
    expect(screen.getByTestId('password-label')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-password-visibility')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-label')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-confirm-password-visibility')).toBeInTheDocument();
    expect(screen.getByTestId('reset-password-button')).toBeInTheDocument();
    expect(screen.getByTestId('help-text')).toBeInTheDocument();

    // Check button text
    expect(screen.getByTestId('reset-password-button')).toHaveTextContent('🔒 Reset My Password');
  });

  it('navigates back to login when back button is clicked', async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    const backButton = screen.getByTestId('back-to-login-button');
    await act(async () => {
      await user.click(backButton);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('toggles password visibility when eye icons are clicked', async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    // Check initial state - password fields should be of type "password"
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Toggle password visibility
    const togglePasswordButton = screen.getByTestId('toggle-password-visibility');
    await act(async () => {
      await user.click(togglePasswordButton);
    });
    
    // Check if type changed to "text"
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Toggle confirm password visibility
    const toggleConfirmPasswordButton = screen.getByTestId('toggle-confirm-password-visibility');
    await act(async () => {
      await user.click(toggleConfirmPasswordButton);
    });
    
    // Check if type changed to "text"
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    
    // Toggle back to password type
    await act(async () => {
      await user.click(togglePasswordButton);
      await user.click(toggleConfirmPasswordButton);
    });
    
    // Check if reverted to "password"
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('shows an error when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    // Enter different passwords
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('reset-password-button');
    
    await act(async () => {
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'different123');
      await user.click(submitButton);
    });
    
    // Check if error message is shown
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Passwords do not match.');
  });

  it('shows an error when password is too short', async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    // Enter short password
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('reset-password-button');
    
    await act(async () => {
      await user.type(passwordInput, 'short');
      await user.type(confirmPasswordInput, 'short');
      await user.click(submitButton);
    });
    
    // Check if error message is shown
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Password must be at least 6 characters');
  });

  it('submits the form successfully and redirects after timeout', async () => {
    // Mock successful API response
    resetPassword.mockResolvedValue({
      data: { message: 'Password reset successfully.' }
    });
    
    // Use fake timers before rendering
    // vi.useFakeTimers();
    
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    // Fill the form with valid data
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('reset-password-button');
    
    // Type in fields - use fireEvent instead of userEvent for better compatibility with fake timers
    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'validpassword' } });
    
    // Submit form
    fireEvent.click(submitButton);
    expect(screen.getByText('⏳ Processing...')).toBeInTheDocument()
    
    // Verify API was called
    expect(resetPassword).toHaveBeenCalledWith('test-token', { password: 'validpassword' });
    
    // Check success message - wrap in waitFor for reliability
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByTestId('reset-password-button')).toHaveTextContent('✅ Password Reset!');
    });
    
    await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/login')
        }, { timeout: 3000 })
    
    
  });

  it('handles API error responses', async () => {
    // Mock API error
    resetPassword.mockRejectedValue({
      response: { data: { message: 'Token expired' } }
    });
    
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    // Fill the form
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('reset-password-button');
    
    await act(async () => {
      await user.type(passwordInput, 'validpassword');
      await user.type(confirmPasswordInput, 'validpassword');
      await user.click(submitButton);
    });
    
    // Handle the async updates
    await act(async () => {
      await Promise.resolve();
    });
    
    // Check for error message
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Token expired');
  });

  it('handles generic API errors', async () => {
    // Mock network failure (no response object)
    resetPassword.mockRejectedValue(new Error('Network error'));
    
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    // Fill the form
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('reset-password-button');
    
    await act(async () => {
      await user.type(passwordInput, 'validpassword');
      await user.type(confirmPasswordInput, 'validpassword');
      await user.click(submitButton);
    });
    
    // Handle async updates
    await act(async () => {
      await Promise.resolve();
    });
    
    // Check for generic error message
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('An error occurred. Please try again.');
  });

  it('shows loading state during form submission', async () => {
    // Set up a promise we can manually resolve
    let resolvePromise;
    const pendingPromise = new Promise(resolve => {
      resolvePromise = () => resolve({ data: { message: 'Success' } });
    });
    
    resetPassword.mockReturnValue(pendingPromise);
    
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    // Fill the form
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('reset-password-button');
    
    await act(async () => {
      await user.type(passwordInput, 'validpassword');
      await user.type(confirmPasswordInput, 'validpassword');
      await user.click(submitButton);
    });
    
    // Check for loading state
    expect(screen.getByTestId('reset-password-button')).toHaveTextContent('⏳ Processing...');
    
    // Resolve the promise
    await act(async () => {
      resolvePromise();
      await Promise.resolve(); // Let React process the state update
    });
    
    // Check for success state
    expect(screen.getByTestId('reset-password-button')).toHaveTextContent('✅ Password Reset!');
  });

  it('disables form inputs after successful submission', async () => {
    resetPassword.mockResolvedValue({
      data: { message: 'Password reset successfully.' }
    });
    
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    
    // Fill and submit the form
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const submitButton = screen.getByTestId('reset-password-button');
    
    await act(async () => {
      await user.type(passwordInput, 'validpassword');
      await user.type(confirmPasswordInput, 'validpassword');
      await user.click(submitButton);
    });
    
    // Handle async updates
    await act(async () => {
      await Promise.resolve();
    });
    
    // Check if inputs are disabled
    expect(passwordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../components/ForgotPassword';
import { forgotPassword } from '../api/auth';

// Prepare mock functions
const mockNavigate = vi.fn();

// Mock the modules and dependencies
vi.mock('../api/auth', () => ({
  forgotPassword: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../images/ShariaStocks-logo/ShariaStocks1.png', () => ({
  default: 'mocked-logo-path'
}));

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the forgot password form correctly', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Check if essential elements are rendered
    expect(screen.getByAltText('ShariaStocks logo')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByText('Go back')).toBeInTheDocument();
    expect(screen.getByText('Remembered your password?')).toBeInTheDocument();
    expect(screen.getByText('Log in here')).toBeInTheDocument();
  });

  test('submits email successfully', async () => {
    // Mock successful API response
    const successMessage = 'Password reset email sent successfully';
    forgotPassword.mockResolvedValueOnce({
      data: {
        msg: successMessage
      }
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Get email input and submit button
    const emailInput = screen.getByLabelText('Enter your email address');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    // Enter email and submit
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Check if API was called with correct email
    expect(forgotPassword).toHaveBeenCalledWith({ email: 'test@example.com' });

    // Check for loading state
    expect(screen.getByText('✉️ Sending link...')).toBeInTheDocument();

    // Wait for success message
    expect(await screen.findByText(successMessage)).toBeInTheDocument();

    // Check that email input is cleared after successful submission
    await waitFor(() => {
      expect(emailInput.value).toBe('');
    });
  });

  test('handles API error response', async () => {
    // Mock API error response
    const errorMessage = 'Email not found in our system';
    forgotPassword.mockRejectedValueOnce({
      response: {
        data: {
          msg: errorMessage
        }
      }
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Get email input and submit button
    const emailInput = screen.getByLabelText('Enter your email address');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    // Enter email and submit
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.click(submitButton);

    // Wait for error message
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();

    // Check that email input is not cleared after error
    expect(emailInput.value).toBe('nonexistent@example.com');
  });

  test('handles API error without response data', async () => {
    // Mock API error without specific message
    forgotPassword.mockRejectedValueOnce({
      response: null
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Get email input and submit button
    const emailInput = screen.getByLabelText('Enter your email address');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    // Enter email and submit
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Wait for generic error message
    expect(await screen.findByText('Error sending reset password link.')).toBeInTheDocument();
  });

  test('prevents submission with invalid email', async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Get email input and submit button
    const emailInput = screen.getByLabelText('Enter your email address');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    // Try to submit without entering an email (browser validation should prevent this)
    fireEvent.click(submitButton);

    // API should not be called
    expect(forgotPassword).not.toHaveBeenCalled();
  });

  test('navigates back when back button is clicked', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Find and click back button
    const backButton = screen.getByText('Go back');
    fireEvent.click(backButton);

    // Check if navigate(-1) was called
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('navigates to login page when "Log in here" link is clicked', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Find login link
    const loginLink = screen.getByText('Log in here');
    
    // Check if href attribute is set correctly
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('shows loading state while submitting', async () => {
    // Create a promise that we can resolve manually to control timing
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    forgotPassword.mockReturnValue(promise);

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Get email input and submit button
    const emailInput = screen.getByLabelText('Enter your email address');
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    // Enter email and submit
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Check that loading state is displayed
    expect(screen.getByText('✉️ Sending link...')).toBeInTheDocument();
    
    // Verify button is disabled during loading
    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();

    // Resolve the promise to complete the API call
    resolvePromise({ data: { msg: 'Email sent' } });

    // Wait for loading state to clear
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send reset link/i })).not.toBeDisabled();
    });
  });
});
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom';
import EmailVerification from '../components/EmailVerification';
import { tokenverify, verify, resendVerification } from '../api/auth';

// Mock the react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn()
  };
});

// Mock the auth API functions
vi.mock('../api/auth', () => ({
  tokenverify: vi.fn(),
  verify: vi.fn(),
  resendVerification: vi.fn()
}));

// Mock the Footer component to avoid testing it
vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer-mock">Footer</div>
}));

// Mock logo import
vi.mock('../images/ShariaStocks-logo/ShariaStocks1.png', () => ({
  default: 'mocked-logo-path'
}));

describe('EmailVerification Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Setup default mocks
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ token: 'valid-token' });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <EmailVerification />
      </BrowserRouter>
    );
  };

  it('should render the initial pending state with token', async () => {
    tokenverify.mockResolvedValueOnce({ data: 'Token is valid' });
    
    renderComponent();
    
    // Check for loading state first
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument();
    
    // Wait for the component to move to pending state
    await waitFor(() => {
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    });
    
    // Check that the component renders the correct elements
    expect(screen.getByTestId('verification-title')).toHaveTextContent('Verify Your Email');
    expect(screen.getByTestId('verification-message')).toBeInTheDocument();
    expect(screen.getByTestId('verify-button')).toBeInTheDocument();
    expect(screen.getByTestId('resend-section')).toBeInTheDocument();
  });

  it('should handle token verification success', async () => {
    tokenverify.mockResolvedValueOnce({ data: 'Token is valid' });
    verify.mockResolvedValueOnce({ data: 'Email verified successfully!' });
    
    renderComponent();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('verify-button')).toBeInTheDocument();
    });
    
    // Click verify button
    fireEvent.click(screen.getByTestId('verify-button'));
    
    // Check for loading state
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument();
    
    // Wait for success state
    await waitFor(() => {
      expect(screen.getByTestId('success-icon')).toBeInTheDocument();
      expect(screen.getByTestId('verify-email')).toHaveTextContent('Email Verified!');
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByTestId('proceed-to-login-button')).toBeInTheDocument();
    });
    
    // Check that the verify API was called with the token
    expect(verify).toHaveBeenCalledWith('valid-token');
  });

  it('should handle token verification failure', async () => {
    tokenverify.mockResolvedValueOnce({ data: 'Token is valid' });
    verify.mockRejectedValueOnce({ 
      response: { data: { msg: 'Verification failed. Invalid token.' } }
    });
    
    renderComponent();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('verify-button')).toBeInTheDocument();
    });
    
    // Click verify button
    fireEvent.click(screen.getByTestId('verify-button'));
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByTestId('error-icon')).toBeInTheDocument();
      expect(screen.getByTestId('verify-fail')).toHaveTextContent('Verification Failed');
      expect(screen.getByTestId('error-message')).toHaveTextContent('Verification failed. Invalid token.');
    });
    
    // Check that the navigation buttons are present
    expect(screen.getByTestId('try-signup-again-button')).toBeInTheDocument();
    expect(screen.getByTestId('return-home-button')).toBeInTheDocument();
  });

  it('should handle invalid token on initial load', async () => {
    // Mock token verification to fail
    tokenverify.mockRejectedValueOnce(new Error('Invalid token'));
    
    renderComponent();
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByTestId('error-icon')).toBeInTheDocument();
      expect(screen.getByTestId('verify-fail')).toHaveTextContent('Verification Failed');
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid or expired token.');
    });
  });

  it('should navigate to login page when clicking proceed button', async () => {
    tokenverify.mockResolvedValueOnce({ data: 'Token is valid' });
    verify.mockResolvedValueOnce({ data: 'Email verified successfully!' });
    
    renderComponent();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('verify-button')).toBeInTheDocument();
    });
    
    // Click verify button
    fireEvent.click(screen.getByTestId('verify-button'));
    
    // Wait for success state
    await waitFor(() => {
      expect(screen.getByTestId('proceed-to-login-button')).toBeInTheDocument();
    });
    
    // Click proceed to login button
    fireEvent.click(screen.getByTestId('proceed-to-login-button'));
    
    // Check that navigation was called with correct path
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should navigate to signup page when clicking try signup again button', async () => {
    tokenverify.mockRejectedValueOnce(new Error('Invalid token'));
    
    renderComponent();
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByTestId('try-signup-again-button')).toBeInTheDocument();
    });
    
    // Click try signup again button
    fireEvent.click(screen.getByTestId('try-signup-again-button'));
    
    // Check that navigation was called with correct path
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('should navigate to home page when clicking return home button', async () => {
    tokenverify.mockRejectedValueOnce(new Error('Invalid token'));
    
    renderComponent();
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByTestId('return-home-button')).toBeInTheDocument();
    });
    
    // Click return home button
    fireEvent.click(screen.getByTestId('return-home-button'));
    
    // Check that navigation was called with correct path
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should show resend form when clicking resend link', async () => {
    tokenverify.mockResolvedValueOnce({ data: 'Token is valid' });
    
    renderComponent();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('resend-link')).toBeInTheDocument();
    });
    
    // Click resend link
    fireEvent.click(screen.getByTestId('resend-link'));
    
    // Check that resend form is displayed
    expect(screen.getByTestId('resend-form-container')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('resend-submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-resend-button')).toBeInTheDocument();
  });

  it('should handle resend verification email success', async () => {
    tokenverify.mockResolvedValueOnce({ data: 'Token is valid' });
    resendVerification.mockResolvedValueOnce({ data: 'Email sent successfully' });
    
    renderComponent();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('resend-link')).toBeInTheDocument();
    });
    
    // Click resend link
    fireEvent.click(screen.getByTestId('resend-link'));
    
    // Type email address
    fireEvent.change(screen.getByTestId('email-input'), { 
      target: { value: 'test@example.com' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByTestId('resend-submit-button'));
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByTestId('resend-success-message')).toBeInTheDocument();
      expect(screen.getByTestId('resend-success-message')).toHaveTextContent('Verification email has been sent to your inbox!');
    });
    
    // Check that the API was called with the email
    expect(resendVerification).toHaveBeenCalledWith('test@example.com');
  });

  it('should handle resend verification email failure', async () => {
    tokenverify.mockResolvedValueOnce({ data: 'Token is valid' });
    resendVerification.mockRejectedValueOnce({ message: 'Failed to send email' });
    
    renderComponent();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('resend-link')).toBeInTheDocument();
    });
    
    // Click resend link
    fireEvent.click(screen.getByTestId('resend-link'));
    
    // Type email address
    fireEvent.change(screen.getByTestId('email-input'), { 
      target: { value: 'test@example.com' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByTestId('resend-submit-button'));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId('resend-error-message')).toBeInTheDocument();
      expect(screen.getByTestId('resend-error-message')).toHaveTextContent('Failed to send email');
    });
  });

  it('should validate email input on resend form', async () => {
    tokenverify.mockResolvedValueOnce({ data: 'Token is valid' });
    
    renderComponent();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('resend-link')).toBeInTheDocument();
    });
    
    // Click resend link
    fireEvent.click(screen.getByTestId('resend-link'));
    
    // Submit form without entering email
    fireEvent.click(screen.getByTestId('resend-submit-button'));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId('resend-error-message')).toBeInTheDocument();
      expect(screen.getByTestId('resend-error-message')).toHaveTextContent('Please enter your email address');
    });
    
    // Check that the API was not called
    expect(resendVerification).not.toHaveBeenCalled();
  });

  it('should hide resend form when clicking cancel button', async () => {
    tokenverify.mockResolvedValueOnce({ data: 'Token is valid' });
    
    renderComponent();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('resend-link')).toBeInTheDocument();
    });
    
    // Click resend link
    fireEvent.click(screen.getByTestId('resend-link'));
    
    // Check that resend form is displayed
    expect(screen.getByTestId('resend-form-container')).toBeInTheDocument();
    
    // Click cancel button
    fireEvent.click(screen.getByTestId('cancel-resend-button'));
    
    // Check that resend form is hidden
    expect(screen.queryByTestId('resend-form-container')).not.toBeInTheDocument();
    expect(screen.getByTestId('resend-link')).toBeInTheDocument();
  });

  it('should render pending state without token', async () => {
    // Mock params with no token
    useParams.mockReturnValue({ token: null });
    
    renderComponent();
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    });
    
    // Check for check inbox message instead of verification button
    expect(screen.getByTestId('check-inbox-message')).toBeInTheDocument();
    expect(screen.getByTestId('check-spam-message')).toBeInTheDocument();
    expect(screen.queryByTestId('verify-button')).not.toBeInTheDocument();
  });
});
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ResetPassword from '../components/ResetPassword';
import { resetPassword } from '../api/auth';

// Prepare mock functions
const mockNavigate = vi.fn();

// Mock the modules and dependencies
vi.mock('../api/auth', () => ({
  resetPassword: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ token: 'test-token' })
  };
});

vi.mock('../images/ShariaStocks-logo/ShariaStocks1.png', () => ({
  default: 'mocked-logo-path'
}));

describe('ResetPassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the reset password form correctly', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/test-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if essential elements are rendered
    expect(screen.getByAltText('ShariaStocks logo')).toBeInTheDocument();
    expect(screen.getByText('Choose a new password')).toBeInTheDocument();
    expect(screen.getByText('Confirm your new password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset my password/i })).toBeInTheDocument();
    expect(screen.getByText('Back to login')).toBeInTheDocument();
  });

  test('validates passwords match', async () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/test-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    // Get form inputs and button
    const passwordInput = screen.getByLabelText('Choose a new password');
    const confirmPasswordInput = screen.getByLabelText('Confirm your new password');
    const submitButton = screen.getByRole('button', { name: /reset my password/i });

    // Enter different passwords
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    
    // Submit the form
    fireEvent.click(submitButton);

    // Check for error message
    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
  });

  test('validates password length', async () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/test-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    // Get form inputs and button
    const passwordInput = screen.getByLabelText('Choose a new password');
    const confirmPasswordInput = screen.getByLabelText('Confirm your new password');
    const submitButton = screen.getByRole('button', { name: /reset my password/i });

    // Enter short passwords
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'pass' } });
    
    // Submit the form
    fireEvent.click(submitButton);

    // Check for error message
    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/test-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    // Get password input and visibility toggle buttons
    const passwordInput = screen.getByLabelText('Choose a new password');
    const confirmPasswordInput = screen.getByLabelText('Confirm your new password');
    
    // Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Find toggle buttons (near each password field)
    const toggleButtons = screen.getAllByRole('button', { name: '' });
    
    // Toggle password visibility
    fireEvent.click(toggleButtons[0]); // For password field
    fireEvent.click(toggleButtons[1]); // For confirm password field

    // Now passwords should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  test('handles successful password reset', async () => {
    resetPassword.mockResolvedValueOnce({
      data: {
        message: 'Password reset successfully.'
      }
    });
  
    vi.useFakeTimers();
  
    render(
      <MemoryRouter initialEntries={['/reset-password/test-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
  
    const passwordInput = screen.getByLabelText('Choose a new password');
    const confirmPasswordInput = screen.getByLabelText('Confirm your new password');
    const submitButton = screen.getByRole('button', { name: /reset my password/i });
  
    fireEvent.change(passwordInput, { target: { value: 'newPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPassword123' } });
  
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith('test-token', { password: 'newPassword123' });
      expect(screen.getByText('Password reset successfully.')).toBeInTheDocument();
    });
  
    act(() => {
      vi.runAllTimers();
    });
  
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    vi.useRealTimers();
  }, 15000);
  
  

  test('handles API error', async () => {
    const errorMessage = 'Invalid or expired token';
    resetPassword.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });
  
    render(
      <MemoryRouter initialEntries={['/reset-password/test-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
  
    const passwordInput = screen.getByLabelText('Choose a new password');
    const confirmPasswordInput = screen.getByLabelText('Confirm your new password');
    const submitButton = screen.getByRole('button', { name: /reset my password/i });
  
    fireEvent.change(passwordInput, { target: { value: 'newPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPassword123' } });
    fireEvent.click(submitButton);
  
    // Wait for error message to appear
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  }, 15000);
  

  test('navigates back to login when back button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/test-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    // Find and click back button
    const backButton = screen.getByText('Back to login');
    fireEvent.click(backButton);

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
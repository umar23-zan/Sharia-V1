import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EmailVerification from '../components/EmailVerification';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as authApi from '../api/auth';

// Mock the navigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock the image so tests don't fail due to image imports

vi.mock('../images/ShariaStocks-logo/ShariaStocks1.png', () => ({
  default: 'mocked-logo-path'
}))
describe('EmailVerification Component', () => {
  const mockToken = 'testtoken';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading and then shows pending verification state on valid token', async () => {
    vi.spyOn(authApi, 'tokenverify').mockResolvedValueOnce({ data: 'Valid token' });

    render(
      <MemoryRouter initialEntries={[`/verify/${mockToken}`]}>
        <Routes>
          <Route path="/verify/:token" element={<EmailVerification />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/please wait while we verify/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
    });
  });

  it('renders error if token is invalid or expired', async () => {
    vi.spyOn(authApi, 'tokenverify').mockRejectedValueOnce(new Error('Invalid token'));

    render(
      <MemoryRouter initialEntries={[`/verify/${mockToken}`]}>
        <Routes>
          <Route path="/verify/:token" element={<EmailVerification />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/invalid or expired token/i)).toBeInTheDocument();
    });
  });

  it('calls verify API on "Verify Email" button click and shows success', async () => {
    vi.spyOn(authApi, 'tokenverify').mockResolvedValueOnce({});
    vi.spyOn(authApi, 'verify').mockResolvedValueOnce({ data: 'Email verified!' });

    render(
      <MemoryRouter initialEntries={[`/verify/${mockToken}`]}>
        <Routes>
          <Route path="/verify/:token" element={<EmailVerification />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/verify email/i);

    const verifyButton = screen.getByRole('button', { name: /verify email/i });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByTestId('verify-email')).toBeInTheDocument();
    });
  });

  it('shows error on verify failure', async () => {
    vi.spyOn(authApi, 'tokenverify').mockResolvedValueOnce({});
    vi.spyOn(authApi, 'verify').mockRejectedValueOnce({ response: { data: { msg: 'Verification failed' } } });

    render(
      <MemoryRouter initialEntries={[`/verify/${mockToken}`]}>
        <Routes>
          <Route path="/verify/:token" element={<EmailVerification />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/verify email/i);

    const verifyButton = screen.getByRole('button', { name: /verify email/i });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByTestId('verify-fail')).toBeInTheDocument();
    });
  });

  it('shows resend form and handles resend success', async () => {
    vi.spyOn(authApi, 'tokenverify').mockRejectedValueOnce({});
    vi.spyOn(authApi, 'resendVerification').mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={[`/verify/${mockToken}`]}>
        <Routes>
          <Route path="/verify/:token" element={<EmailVerification />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/verification failed/i);

    fireEvent.click(screen.getByText(/resend verification email/i));

    const input = screen.getByPlaceholderText(/enter your email address/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const submitBtn = screen.getByRole('button', { name: /resend email/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/verification email has been sent/i)).toBeInTheDocument();
    });
  });

  it('shows resend error if email is missing', async () => {
    vi.spyOn(authApi, 'tokenverify').mockRejectedValueOnce({});

    render(
      <MemoryRouter initialEntries={[`/verify/${mockToken}`]}>
        <Routes>
          <Route path="/verify/:token" element={<EmailVerification />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/verification failed/i);
    fireEvent.click(screen.getByText(/resend verification email/i));

    const submitBtn = screen.getByRole('button', { name: /resend email/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
  });
});

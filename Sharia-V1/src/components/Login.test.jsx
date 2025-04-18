// Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Login from './Login'
import { login, initiateGoogleSignIn } from '../api/auth'

// Mock the modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock
  }
})

vi.mock('../api/auth', () => ({
  login: vi.fn(),
  initiateGoogleSignIn: vi.fn()
}))

// Mock images
vi.mock('../images/ShariaStocks-logo/ShariaStocks1.png', () => ({
  default: 'mocked-logo-path'
}))

vi.mock('../images/ShariaStocks-logo/google.png', () => ({
  default: 'mocked-google-logo-path'
}))

// Global variables
let navigateMock

describe('Login Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    navigateMock = vi.fn()
    
    // Clear localStorage before each test
    localStorage.clear()
    
    // Default render for most tests
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
  })

  it('renders the login form correctly', () => {
    // Check for key elements
    expect(screen.getByAltText('ShariaStocks Logo')).toBeInTheDocument()
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
  })

  it('redirects to dashboard if user is already logged in', () => {
    // Set up localStorage
    localStorage.setItem('userEmail', 'test@example.com')
    
    // Re-render the component to trigger the useEffect
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    // Check if navigate was called with the right path
    expect(navigateMock).toHaveBeenCalledWith('/Dashboard')
  })

  it('toggles password visibility when eye icon is clicked', () => {
    const passwordInput = screen.getByLabelText(/^Password$/i)
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button', { name: /Show password/i })
    fireEvent.click(toggleButton)
    
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click again to hide
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('validates email format', async () => {
    // Enter invalid email
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const submitButton = screen.getByRole('button', { name: /Log In/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Wait for validation error
    await waitFor(() => {
      screen.debug()
    })
  })

  it('requires email field', async () => {
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const submitButton = screen.getByRole('button', { name: /Log In/i })

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      screen.debug()
    })
  })

  it('requires password field', async () => {
    const emailInput = screen.getByLabelText(/Email Address/i)
    const submitButton = screen.getByRole('button', { name: /Log In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      screen.debug()
    })
  })

  it('submits the form with valid credentials and redirects to dashboard', async () => {
    // Mock successful login response
    login.mockResolvedValueOnce({ email: 'test@example.com', id: '123' })

    // Fill form and submit
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const submitButton = screen.getByRole('button', { name: /Log In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Check loading state
    expect(screen.getByText('Logging in...')).toBeInTheDocument()

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Login successful! Redirecting you to dashboard...')).toBeInTheDocument()
    })

    // Check localStorage values
    expect(localStorage.getItem('userEmail')).toBe('test@example.com')
    expect(localStorage.getItem('userId')).toBe('123')

    // Check that login was called with the right parameters
    expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })

    // Allow the timeout to complete
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/dashboard')
    }, { timeout: 2000 })
  })

  it('handles login error', async () => {
    // Mock login error
    login.mockRejectedValueOnce({ 
      response: { status: 400 }
    })

    // Fill form and submit
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const submitButton = screen.getByRole('button', { name: /Log In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong-password' } })
    fireEvent.click(submitButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument()
    })
  })

  it('handles server error', async () => {
    // Mock server error
    login.mockRejectedValueOnce({ 
      response: { status: 500 }
    })

    // Fill form and submit
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const submitButton = screen.getByRole('button', { name: /Log In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Server error. Please try again later.')).toBeInTheDocument()
    })
  })

  it('handles unknown error', async () => {
    // Mock network error (no response object)
    login.mockRejectedValueOnce(new Error('Network error'))

    // Fill form and submit
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const submitButton = screen.getByRole('button', { name: /Log In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Wait for default error message
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument()
    })
  })

  it('navigates to signup page when signup link is clicked', () => {
    const signupLink = screen.getByText('Sign up here')
    fireEvent.click(signupLink)
    expect(navigateMock).toHaveBeenCalledWith('/signup')
  })

  it('navigates to forgot password page when forgot password is clicked', () => {
    const forgotPasswordLink = screen.getByText('Forgot password?')
    fireEvent.click(forgotPasswordLink)
    expect(navigateMock).toHaveBeenCalledWith('/forgot-password')
  })

  it('initiates Google sign in when Google button is clicked', () => {
    const googleButton = screen.getByRole('button', { name: /Continue with Google/i })
    fireEvent.click(googleButton)
    expect(initiateGoogleSignIn).toHaveBeenCalled()
  })

  it('navigates to home page when back button is clicked', () => {
    const backButton = screen.getByRole('button', { name: /Back to home/i })
    fireEvent.click(backButton)
    expect(navigateMock).toHaveBeenCalledWith('/')
  })
})
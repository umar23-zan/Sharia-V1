// Signup.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Signup from '../components/Signup'
import { signup, initiateGoogleSignIn } from '../api/auth'

// Mock the modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock
  }
})

vi.mock('../api/auth', () => ({
  signup: vi.fn(),
  initiateGoogleSignIn: vi.fn()
}))

// Mock images with default exports
vi.mock('../images/ShariaStocks-logo/ShariaStocks1.png', () => ({
  default: 'mocked-logo-path'
}))

vi.mock('../images/ShariaStocks-logo/google.png', () => ({
  default: 'mocked-google-logo-path'
}))

// Mock the modal components
vi.mock('./TermsModal', () => ({
  default: ({ isOpen, onClose }) => isOpen ? 
    <div data-testid="terms-modal">
      Terms Modal
      <button onClick={onClose}>Close</button>
    </div> : null
}))

vi.mock('./PrivacyModal', () => ({
  default: ({ isOpen, onClose }) => isOpen ? 
    <div data-testid="privacy-modal">
      Privacy Modal
      <button onClick={onClose}>Close</button>
    </div> : null
}))

// Global variables
let navigateMock

describe('Signup Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    navigateMock = vi.fn()
    
    // Default render for most tests
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    )
  })

  it('renders the signup form correctly', () => {
    // Check for key elements
    expect(screen.getByAltText('ShariaStocks Logo')).toBeInTheDocument()
    expect(screen.getByText('Create Your Account')).toBeInTheDocument()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
    expect(screen.getByTestId('signup-button', { name: /Sign Up/i })).toBeInTheDocument()
    expect(screen.getByTestId('google-signup-button', { name: /Sign up with Google/i })).toBeInTheDocument()
    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument()
  })

  it('toggles password visibility when eye icons are clicked', () => {
    // Password field
    const passwordInput = screen.getByLabelText(/^Password$/i)
    expect(passwordInput).toHaveAttribute('type', 'password')

    const togglePasswordButton = screen.getByTestId('toggle-password-visibility');[0]
    fireEvent.click(togglePasswordButton)
    
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Confirm password field
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')

    const toggleConfirmPasswordButton = screen.getByTestId('toggle-confirm-password-visibility');[1]
    fireEvent.click(toggleConfirmPasswordButton)
    
    expect(confirmPasswordInput).toHaveAttribute('type', 'text')
  })

  it('validates required name field', async () => {
    // Fill form but leave name empty
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText('Please enter your name')).toBeInTheDocument()
    })
  })

  it('validates required email field', async () => {
    // Fill form but leave email empty
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText('Please enter your email address')).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    // Fill form with invalid email
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'invalid-email' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  it('validates password length', async () => {
    // Fill form with short password
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '12345' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '12345' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument()
    })
  })

  it('validates password match', async () => {
    // Fill form with non-matching passwords
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password456' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('validates terms agreement', async () => {
    // Fill form without agreeing to terms
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText('You must agree to the Terms and Conditions')).toBeInTheDocument()
    })
  })

  it('submits the form with valid data', async () => {
    // Mock successful signup response
    signup.mockResolvedValueOnce({})

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for loading state
    expect(screen.getByText('Creating Account...')).toBeInTheDocument()

    // Check that signup was called with the right parameters
    expect(signup).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Signup successful! Please check your email to verify your account.')).toBeInTheDocument()
    })
  })

  it('handles signup error with response data message', async () => {
    // Mock signup error with response data
    signup.mockRejectedValueOnce({
      response: { 
        data: { msg: 'Email already in use' }
      }
    })

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument()
    })
  })

  it('handles signup error with validation errors array', async () => {
    // Mock signup error with validation errors array
    signup.mockRejectedValueOnce({
      response: { 
        data: { 
          errors: [{ msg: 'Invalid email format' }]
        }
      }
    })

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument()
    })
  })

  it('handles signup error with generic message', async () => {
    // Mock signup error with no specific error details
    signup.mockRejectedValueOnce(new Error('Network error'))

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('checkbox'))
    
    // Submit the form
    fireEvent.click(screen.getByTestId('signup-button', { name: /Sign Up/i }))

    // Check for generic error message
    await waitFor(() => {
      expect(screen.getByText('Failed to create account. Please try again.')).toBeInTheDocument()
    })
  })

  it('opens and closes the Terms modal', async () => {
    // Open Terms modal
    fireEvent.click(screen.getByText('Terms and Conditions'))
    
    // Check if modal is displayed
    expect(screen.getByTestId('terms-modal')).toBeInTheDocument()
    
    // Close modal
    fireEvent.click(screen.getByText('Close'))
    
    // Check if modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('terms-modal')).not.toBeInTheDocument()
    })
  })

  it('opens and closes the Privacy modal', async () => {
    // Open Privacy modal
    fireEvent.click(screen.getByText('Privacy Policy'))
    
    // Check if modal is displayed
    expect(screen.getByTestId('privacy-modal')).toBeInTheDocument()
    
    // Close modal
    fireEvent.click(screen.getByText('Close'))
    
    // Check if modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('privacy-modal')).not.toBeInTheDocument()
    })
  })

  it('initiates Google sign in when Google button is clicked', () => {
    const googleButton = screen.getByTestId('google-signup-button', { name: /Sign up with Google/i })
    fireEvent.click(googleButton)
    expect(initiateGoogleSignIn).toHaveBeenCalled()
  })

  it('navigates to login page when login link is clicked', () => {
    const loginLink = screen.getByText('Log in here')
    fireEvent.click(loginLink)
    expect(navigateMock).toHaveBeenCalledWith('/login')
  })

  it('navigates to home page when back button is clicked', () => {
    const backButton = screen.getByTestId('back-button', { name: /Back to home/i })
    fireEvent.click(backButton)
    expect(navigateMock).toHaveBeenCalledWith('/')
  })
})
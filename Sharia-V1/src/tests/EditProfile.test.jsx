// EditProfile.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EditProfile from '../components/EditProfile';
import { getUserData, updateUserData, uploadProfilePicture } from '../api/auth';
import '@testing-library/jest-dom';

// Mock the modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

vi.mock('../api/auth', () => ({
  getUserData: vi.fn(),
  updateUserData: vi.fn(),
  uploadProfilePicture: vi.fn()
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft Icon</div>,
  Camera: () => <div data-testid="camera-icon">Camera Icon</div>,
  UserRound: () => <div data-testid="user-icon">User Icon</div>,
  Loader2: () => <div data-testid="loader-icon">Loader Icon</div>
}));

vi.mock('../components/Header', () => ({
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
  let store = { userEmail: 'test@example.com' };
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

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-object-url');

describe('EditProfile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock responses
    getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      contactNumber: '1234567890',
      profilePicture: 'https://example.com/profile.jpg'
    });
    updateUserData.mockResolvedValue({ success: true });
    uploadProfilePicture.mockResolvedValue({ 
      profilePicture: 'https://example.com/updated-profile.jpg' 
    });
  });

  test('should render loading state initially', async () => {
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(getUserData).toHaveBeenCalledWith('test@example.com');
    });
  });

  test('should display user data after loading', async () => {
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeDisabled();
    });
  });

  test('should show validation errors for invalid inputs', async () => {
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });
    
    // Test invalid name (with numbers)
    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'Test123' } });
    expect(screen.getByText('Name must only contain letters and spaces.')).toBeInTheDocument();
    
    // Test invalid contact number (less than 10 digits)
    const contactInput = screen.getByDisplayValue('1234567890');
    fireEvent.change(contactInput, { target: { value: '123456' } });
    expect(screen.getByText('Contact number must be exactly 10 digits.')).toBeInTheDocument();
  });

  test('should update user profile successfully', async () => {
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });
    
    // Update name with valid value
    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    
    // Submit form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(updateUserData).toHaveBeenCalledWith('test@example.com', {
        name: 'Updated Name',
        contactNumber: '1234567890'
      });
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
  });

  test('should handle profile picture upload', async () => {
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });
    
    // Create a test file
    const file = new File(['dummy content'], 'profile.png', { type: 'image/png' });
    
    // Get file input and simulate upload
    const fileInput = screen.getByLabelText(/profile-input/i);
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    
    await waitFor(() => {
      expect(uploadProfilePicture).toHaveBeenCalled();
      const formData = uploadProfilePicture.mock.calls[0][0];
      expect(formData.get('email')).toBe('test@example.com');
      expect(formData.get('profilePicture')).toEqual(file);
      
      expect(screen.getByText('Profile picture updated successfully')).toBeInTheDocument();
    });
  });

  test('should show error for invalid file type', async () => {
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });
    
    // Create a test file with invalid type
    const file = new File(['dummy content'], 'profile.txt', { type: 'text/plain' });
    
    // Get file input and simulate upload
    const fileInput = screen.getByLabelText(/profile-input/i);
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    
    expect(screen.getByText('Only JPEG and PNG files are allowed.')).toBeInTheDocument();
    expect(uploadProfilePicture).not.toHaveBeenCalled();
  });

  test('should show error when API calls fail', async () => {
    // Mock API failure
    getUserData.mockRejectedValueOnce(new Error('Failed to fetch'));
    
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load user data')).toBeInTheDocument();
    });
    
    // Reset mock and retry with update failure
    getUserData.mockResolvedValueOnce({
      name: 'Test User',
      email: 'test@example.com',
      contactNumber: '1234567890',
      profilePicture: 'https://example.com/profile.jpg'
    });
    updateUserData.mockRejectedValueOnce(new Error('Failed to update'));
    
    // Re-render component
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });
    
    // Change a field to trigger form change state
    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    
    // Submit form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
    });
  });

  test('should not allow submitting form with invalid data', async () => {
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });
    
    // Set invalid values
    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'Test123' } });
    
    const contactInput = screen.getByDisplayValue('1234567890');
    fireEvent.change(contactInput, { target: { value: '123' } });
    
    // Submit form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    // Check that the API was not called
    expect(updateUserData).not.toHaveBeenCalled();
    
    // Verify error messages
    expect(screen.getByText('Name must only contain letters and spaces.')).toBeInTheDocument();
    expect(screen.getByText('Contact number must be exactly 10 digits.')).toBeInTheDocument();
  });
});
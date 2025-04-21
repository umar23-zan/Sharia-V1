import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { getUserData } from '../api/auth';

let navigateMock = vi.fn(); 

// Mock the modules and functions
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock
  }
})


vi.mock('../api/auth', () => ({
  getUserData: vi.fn(),
}));

// Mock image imports
vi.mock('../images/account-icon.svg', () => ({ default: 'account-icon.svg' }));
vi.mock('../images/ShariaStocks-logo/logo1.jpeg', () => ({ default: 'logo1.jpeg' }));

// Mock JSON data
vi.mock('../nifty_symbols.json', () => ({
  default: [
    {
      "SYMBOL": "RELIANCE",
      "NAME OF COMPANY": "Reliance Industries Limited",
      "Company_Logo": "reliance-logo.png"
    },
    {
      "SYMBOL": "INFY",
      "NAME OF COMPANY": "Infosys Limited",
      "Company_Logo": "infosys-logo.png"
    },
    {
      "SYMBOL": "TCS",
      "NAME OF COMPANY": "Tata Consultancy Services Limited",
      "Company_Logo": "tcs-logo.png"
    }
  ]
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });



describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test@example.com');
    getUserData.mockResolvedValue({
      email: 'test@example.com',
      name: 'Test User',
      profilePicture: 'profile-pic.jpg'
    });
  });

  it('renders the header component', async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Logo should be visible
    expect(screen.getByAltText('ShariaStock Logo')).toBeInTheDocument();
    
    // Search input should be visible
    expect(screen.getAllByPlaceholderText('Search stocks...')[0]).toBeInTheDocument();

    // Wait for user data to be fetched
    await waitFor(() => {
      expect(getUserData).toHaveBeenCalledWith('test@example.com');
    });
  });
  
  it('navigates to dashboard when logo is clicked', async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const logo = screen.getByAltText('ShariaStock Logo');
    fireEvent.click(logo);
    
    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });
  
  it('navigates to profile when profile icon is clicked', async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Wait for user data to be fetched
    await waitFor(() => {
      expect(getUserData).toHaveBeenCalled();
    });
    
    // Find all profile images (there are two: mobile and desktop)
    const profileImages = screen.getAllByAltText('profile');
    fireEvent.click(profileImages[0]); // Click the first profile image
    
    expect(navigateMock).toHaveBeenCalledWith('/profile', { state: { user: expect.any(Object) } });
  });
  
  it('handles search input and shows suggestions', async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Get the search input (desktop version)
    const searchInput = screen.getAllByPlaceholderText('Search stocks...')[0];
    
    // Type in the search box
    fireEvent.change(searchInput, { target: { value: 'REL' } });
    
    // Wait for suggestions section to be visible
    // const stockSymbolSection = await screen.findAllByTestId('header-symbol-section');
    await waitFor(() => {
      // First check if the section is visible
      const sections = screen.getAllByTestId('header-symbol-section');
      expect(sections.length).toBeGreaterThan(0);
    });
    
    // Look for any element containing part of the name
    // await waitFor(() => {
    //   const suggestionItems = within(stockSymbolSection[0]).queryAllByText(/Reliance/i);
    //   expect(suggestionItems.length).toBeGreaterThan(0);
    // });
    
    // Find and click on any suggestion for Reliance
    // const reliance = within(stockSymbolSection).queryAllByText(/Reliance/i);
    // fireEvent.click(reliance);
    const sections = screen.getAllByTestId('header-symbol-section');
    const suggestion = await within(sections).queryAllByText(/Reliance/i);
  expect(suggestion).toBeInTheDocument();
  
  // Click on the suggestion
  fireEvent.click(suggestion);
    
    // Check if navigation was called with correct parameters
    expect(navigateMock).toHaveBeenCalledWith('/stockresults/RELIANCE', { state: { user: expect.any(Object) } });
  });
  
  it('handles search with Enter key', async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Get the search input (desktop version)
    const searchInput = screen.getAllByPlaceholderText('Search stocks...')[0];
    
    // Type in the search box
    fireEvent.change(searchInput, { target: { value: 'REL' } });
    
    // Wait for suggestions section to be visible
    const stockSymbolSection = await screen.findAllByTestId('header-symbol-section');
    
    // Using a more flexible query - look for any element containing part of the name
    await waitFor(() => {
      const suggestionItems = within(stockSymbolSection[0]).queryAllByText(/Reliance/i);
      expect(suggestionItems.length).toBeGreaterThan(0);
    });
    
    // Press Enter key
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    // Check if navigation was called with correct parameters
    expect(navigateMock).toHaveBeenCalledWith('/stockresults/RELIANCE', { state: { user: expect.any(Object) } });
  });
  
  it('navigates to watchlist when heart icon is clicked', async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Find the heart button
    const heartButton = screen.getByLabelText('Watchlist');
    fireEvent.click(heartButton);
    
    expect(navigateMock).toHaveBeenCalledWith('/watchlist', { state: { user: expect.any(Object) } });
  });
  
  it('navigates to notifications when bell icon is clicked', async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Find the bell button
    const bellButton = screen.getByLabelText('Notifications');
    fireEvent.click(bellButton);
    
    expect(navigateMock).toHaveBeenCalledWith('/notificationpage');
  });
  
  it('handles case with no user email in localStorage', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Logo should be visible
    expect(screen.getByAltText('ShariaStock Logo')).toBeInTheDocument();
    
    // getUserData should not be called
    expect(getUserData).not.toHaveBeenCalled();
  });
  
  it('shows default profile icon when user has no profile picture', async () => {
    // Mock user data without profile picture
    getUserData.mockResolvedValue({
      email: 'test@example.com',
      name: 'Test User'
    });
    
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Wait for user data to be fetched
    await waitFor(() => {
      expect(getUserData).toHaveBeenCalled();
    });
    
    // Profile images should use the default account icon
    const profileImages = screen.getAllByAltText('profile');
    expect(profileImages[0].src).toContain('account-icon.svg');
  });
  
  it('handles error when fetching user data', async () => {
    // Mock error response
    getUserData.mockRejectedValue(new Error('Failed to fetch user data'));
    
    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user data:', expect.any(Error));
    });
    
    // Restore console.error
    consoleSpy.mockRestore();
  });
});
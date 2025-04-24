import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from '../components/Header';
import { getUserData } from '../api/auth';

// Mock the modules and functions
vi.mock('../api/auth', () => ({
  getUserData: vi.fn()
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock SVG imports
vi.mock('../images/account-icon.svg', () => ({default: 'account-icon.svg'}));
vi.mock('../images/ShariaStocks-logo/logo1.jpeg', () => ({
  default: 'mocked-logo.jpg'
}))

// Mock nifty_symbols.json
vi.mock('../nifty_symbols.json', () => {
  return{
    default: [
      {
        SYMBOL: 'RELIANCE',
        'NAME OF COMPANY': 'Reliance Industries Ltd.',
        Company_Logo: 'reliance-logo.png'
      },
      {
        SYMBOL: 'TCS',
        'NAME OF COMPANY': 'Tata Consultancy Services Ltd.',
        Company_Logo: 'tcs-logo.png'
      },
      {
        SYMBOL: 'HDFC',
        'NAME OF COMPANY': 'HDFC Bank Ltd.',
        Company_Logo: 'hdfc-logo.png'
      }
    ]
  }
 } );

// Render helper function with providers
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.setItem('userEmail', 'test@example.com');
    getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      profilePicture: 'profile.jpg'
    });
  });

  it('renders the header component correctly', async () => {
    renderWithRouter(<Header />);
    
    // Basic elements should be present
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(screen.getByTestId('watchlist-button')).toBeInTheDocument();
    expect(screen.getByTestId('notification-bell')).toBeInTheDocument();
    
    // Verify getUserData was called with correct email
    expect(getUserData).toHaveBeenCalledWith('test@example.com');
  });

  it('displays the logo which navigates to dashboard when clicked', async () => {
    renderWithRouter(<Header />);
    
    // Logo might be hidden in mobile view, so we need to find it even if not visible
    const logo = screen.getByTestId('header-logo');
    expect(logo).toBeInTheDocument();
    
    // Click logo and verify navigation
    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('opens search bar when search button is clicked', async () => {
    renderWithRouter(<Header />);
    
    // Initially, search input should not be visible
    expect(screen.queryByTestId('desktop-search-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-search-input')).not.toBeInTheDocument();
    
    // Click search button
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);
    
    // Now search inputs should be visible (at least one of them depending on viewport)
    const desktopInput = screen.queryByTestId('desktop-search-input');
    const mobileInput = screen.queryByTestId('mobile-search-input');
    
    // At least one search input should be present
    expect(desktopInput || mobileInput).toBeTruthy();
  });

  it('shows suggestions when typing in search input', async () => {
    renderWithRouter(<Header />);
    const user = userEvent.setup();
    
    // Open search bar
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);
    
    // Find the input (either desktop or mobile)
    const searchInput = screen.queryByTestId('desktop-search-input') || 
                        screen.queryByTestId('mobile-search-input');
    
    expect(searchInput).toBeInTheDocument();
    
    // Type in search box
    await user.type(searchInput, 'REL');
    
    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestions = screen.queryByTestId('search-suggestions-list') || 
                          screen.queryByTestId('mobile-search-suggestions-list');
      expect(suggestions).toBeInTheDocument();
      
      // Should show Reliance in results
      expect(screen.getByText('Reliance Industries Ltd.')).toBeInTheDocument();
    });
  });

  it('navigates to stock result page when suggestion is clicked', async () => {
    renderWithRouter(<Header />);
    const user = userEvent.setup();
    
    // Open search bar
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);
    
    const searchInput = screen.queryByTestId('desktop-search-input') || 
                        screen.queryByTestId('mobile-search-input');
    
    // Type in search box
    await user.type(searchInput, 'REL');
    
    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestion = screen.queryByTestId('search-suggestion-RELIANCE') || 
                         screen.queryByTestId('mobile-suggestion-RELIANCE');
      expect(suggestion).toBeInTheDocument();
    });
    
    // Click on suggestion
    const suggestion = screen.queryByTestId('search-suggestion-RELIANCE') || 
                       screen.queryByTestId('mobile-suggestion-RELIANCE');
    fireEvent.click(suggestion);
    
    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith(
      '/stockresults/RELIANCE', 
      expect.objectContaining({ state: expect.anything() })
    );
  });

  it('closes search bar when close button is clicked', async () => {
    renderWithRouter(<Header />);
    
    // Open search bar
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);
    
    // Find the input (either desktop or mobile)
    const searchInput = screen.queryByTestId('desktop-search-input') || 
                        screen.queryByTestId('mobile-search-input');
    
    expect(searchInput).toBeInTheDocument();
    
    // Find close button
    const closeButton = screen.queryByTestId('desktop-search-close-btn') || 
                        screen.queryByTestId('mobile-search-close-btn');
    
    expect(closeButton).toBeInTheDocument();
    
    // Click close button
    fireEvent.click(closeButton);
    
    // Input should no longer be visible
    expect(screen.queryByTestId('desktop-search-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-search-input')).not.toBeInTheDocument();
  });

  it('navigates to watchlist when watchlist button is clicked', async () => {
    renderWithRouter(<Header />);
    
    const watchlistButton = screen.getByTestId('watchlist-button');
    fireEvent.click(watchlistButton);
    
    expect(mockNavigate).toHaveBeenCalledWith(
      '/watchlist', 
      expect.objectContaining({ state: expect.anything() })
    );
  });

  it('navigates to notification page when notification bell is clicked', async () => {
    renderWithRouter(<Header />);
    
    const notificationBell = screen.getByTestId('notification-bell');
    fireEvent.click(notificationBell);
    
    expect(mockNavigate).toHaveBeenCalledWith('/notificationpage');
  });

  it('navigates to profile page when profile icon is clicked', async () => {
    renderWithRouter(<Header />);
    
    // Check for either mobile or desktop profile icon
    const profileIcon = screen.queryByTestId('desktop-profile-icon') || 
                        screen.queryByTestId('mobile-profile-icon');
    
    expect(profileIcon).toBeInTheDocument();
    
    fireEvent.click(profileIcon);
    
    expect(mockNavigate).toHaveBeenCalledWith(
      '/profile', 
      expect.objectContaining({ state: expect.anything() })
    );
  });

  it('handles search submission on Enter key', async () => {
    renderWithRouter(<Header />);
    const user = userEvent.setup();
    
    // Open search bar
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);
    
    const searchInput = screen.queryByTestId('desktop-search-input') || 
                        screen.queryByTestId('mobile-search-input');
    
    // Type in search box
    await user.type(searchInput, 'REL');
    
    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestions = screen.queryByTestId('search-suggestions-list') || 
                          screen.queryByTestId('mobile-search-suggestions-list');
      expect(suggestions).toBeInTheDocument();
    });
    
    // Press Enter
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    // Should navigate to the first suggestion
    expect(mockNavigate).toHaveBeenCalledWith(
      '/stockresults/RELIANCE', 
      expect.objectContaining({ state: expect.anything() })
    );
  });

  it('closes search bar on Escape key', async () => {
    renderWithRouter(<Header />);
    
    // Open search bar
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);
    
    const searchInput = screen.queryByTestId('desktop-search-input') || 
                        screen.queryByTestId('mobile-search-input');
    
    expect(searchInput).toBeInTheDocument();
    
    // Press Escape
    fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' });
    
    // Input should no longer be visible
    expect(screen.queryByTestId('desktop-search-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-search-input')).not.toBeInTheDocument();
  });
  
  it('handles the case when no user is logged in', async () => {
    // Clear localStorage
    mockLocalStorage.clear();
    
    renderWithRouter(<Header />);
    
    // The header should still render without errors
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    
    // getUserData should not be called
    expect(getUserData).not.toHaveBeenCalled();
  });
});
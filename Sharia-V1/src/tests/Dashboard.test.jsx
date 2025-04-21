import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Dashboard from '../components/Dashboard';
import { getUserData } from '../api/auth';
import * as router from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Mock modules and hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../api/auth', () => ({
  getUserData: vi.fn(),
}));

vi.mock('../nifty_symbols.json', () => {
  return {
    default: [
      { "SYMBOL": "RELIANCE", "NAME OF COMPANY": "Reliance Industries Ltd", "Company_Logo": "test-logo.jpg" },
      { "SYMBOL": "HDFCBANK", "NAME OF COMPANY": "HDFC Bank Ltd", "Company_Logo": "test-logo.jpg" },
      { "SYMBOL": "TCS", "NAME OF COMPANY": "Tata Consultancy Services", "Company_Logo": "test-logo.jpg" },
    ]
  };
});

vi.mock('react-helmet', () => ({
  Helmet: ({ children }) => <div data-testid="helmet">{children}</div>,
}));

vi.mock('./Header', () => ({
  default: () => <div data-testid="header-component">Header</div>,
}));

vi.mock('./PaymentAlertModal', () => ({
  default: ({ isOpen, onClose, type, daysRemaining, amount }) => (
    <div data-testid="payment-alert-modal" data-open={isOpen}>
      PaymentModal: {type} {daysRemaining} {amount}
    </div>
  ),
}));

vi.mock('./usePaymentAlert', () => ({
  default: vi.fn(() => ({
    isOpen: false,
    type: 'trial',
    daysRemaining: 7,
    amount: 999,
    closeAlert: vi.fn(),
  })),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock image imports

vi.mock('../images/ShariaStocks-logo/logo1.jpeg', () => ({
  default: 'mocked-logo.jpg'
}))

describe('Dashboard Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock useNavigate
    vi.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);
    
    // Setup localStorage
    window.localStorage.setItem('userEmail', 'test@example.com');
    
    // Mock getUserData response
    getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      subscription: { plan: 'free' }
    });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders dashboard without crashing', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Check that basic elements are rendered
    await waitFor(() => {
      expect(screen.getByText('Invest with Purpose')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('header-component')).toBeInTheDocument();
    });
  });

  it('fetches user data on component mount', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(getUserData).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('handles search input and displays suggestions', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText('Search for stocks (e.g., RELIANCE, HDFCBANK)');
    fireEvent.change(searchInput, { target: { value: 'REL' } });

    const stockSymbolSection = screen.getByTestId('stock-symbol-section')
    
    await waitFor(() => {
      expect(within(stockSymbolSection).getByText('Reliance Industries Ltd')).toBeInTheDocument();
    });
  });

  it('navigates to stock result page when a suggestion is clicked', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText('Search for stocks (e.g., RELIANCE, HDFCBANK)');
    fireEvent.change(searchInput, { target: { value: 'REL' } });

    const stockSymbolSection = screen.getByTestId('stock-symbol-section')
    
    await waitFor(() => {
      expect(within(stockSymbolSection).getByText('Reliance Industries Ltd')).toBeInTheDocument();
    });
    
    fireEvent.click(within(stockSymbolSection).getByText('Reliance Industries Ltd'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/stockresults/RELIANCE', expect.any(Object));
  });

  it('navigates to stock details when trending stock is clicked', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Find the trending stock section
    const trendingStockElement = screen.getByText('RELIANCE', { exact: true });
    fireEvent.click(trendingStockElement);
    
    expect(mockNavigate).toHaveBeenCalledWith('/stockresults/RELIANCE', expect.any(Object));
  });

  it('renders Halal stocks list correctly', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    const halalStocksSection = screen.getByTestId('halal-stocks-section');
    expect(screen.getByText('Top 10 Halal Stocks')).toBeInTheDocument();
    expect(within(halalStocksSection).getByText('TATAMOTORS')).toBeInTheDocument();
    expect(within(halalStocksSection).getByText('TCS')).toBeInTheDocument();
    
  });

  it('shows pricing upgrade overlay for free users on halal stocks section', async () => {
    // Set up user with free subscription
    getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      subscription: { plan: 'free' }
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Unlock All Halal Stocks')).toBeInTheDocument();
      expect(screen.getByText('Upgrade Now')).toBeInTheDocument();
    });
    
    // Test upgrade button navigation
    fireEvent.click(screen.getByText('Upgrade Now'));
    expect(mockNavigate).toHaveBeenCalledWith('/subscriptiondetails');
  });

  it('does not show upgrade overlay for premium users', async () => {
    // Set up user with premium subscription
    getUserData.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      subscription: { plan: 'premium' }
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Unlock All Halal Stocks')).not.toBeInTheDocument();
    });
  });

  it('handles quick action navigation correctly', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Click on watchlist button
    fireEvent.click(screen.getByText('Watchlist'));
    expect(mockNavigate).toHaveBeenCalledWith('/watchlist');
    
    // Click on get premium button
    fireEvent.click(screen.getByText('Get Premium'));
    expect(mockNavigate).toHaveBeenCalledWith('/subscriptiondetails');
  });

  it('handles slider navigation in trending stocks section', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Get slider navigation buttons (they have aria-labels)
    const nextButton = screen.getByTestId('next-button'); // Ensure data-testid="next-button" is set in the component
  const prevButton = screen.getByTestId('prev-button');
    
  const slider = screen.getByTestId('trending-slider'); // Make sure your slider container has data-testid="trending-slider"

  const scrollBySpy = vi.spyOn(slider, 'scrollBy').mockImplementation(() => {});

  // Simulate next click
  fireEvent.click(nextButton);
  expect(scrollBySpy).toHaveBeenCalledWith({ left: 240, behavior: 'smooth' });

  // Simulate prev click
  fireEvent.click(prevButton);
  expect(scrollBySpy).toHaveBeenCalledWith({ left: -240, behavior: 'smooth' });

  // Cleanup
  scrollBySpy.mockRestore();
  });

  it('displays correct market summary data', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Market Summary')).toBeInTheDocument();
    expect(screen.getByText('NIFTY 50')).toBeInTheDocument();
    expect(screen.getByText('23,851.65')).toBeInTheDocument();
    expect(screen.getByText('SENSEX')).toBeInTheDocument();
    expect(screen.getByText('78,553.20')).toBeInTheDocument();
  });

  it('renders SEO meta tags correctly using Helmet', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(document.title).toBe('ShariaStocks | Ethical Stock Investing in India');

});

  it('handles image loading errors with fallback', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Find images that might fail to load
    const logoImage = screen.getAllByAltText('ShariaStocks Company Logo')[0];
    
    // Simulate error
    fireEvent.error(logoImage);
    
    // Check if the src was changed to the fallback
    expect(logoImage.src).toContain('placeholder');
  });
});
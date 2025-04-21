import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import WatchList from '../components/Watchlist';
import axios from 'axios';

// Mock modules
vi.mock('axios');

// Mock data for useLocation
let mockUserData = {
  subscription: {
    plan: 'basic' // Default to basic plan for most tests
  }
};

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      state: {
        user: mockUserData
      }
    })
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.innerWidth for responsive testing
const resizeWindow = (width) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

describe('WatchList Component', () => {
  const mockWatchlistData = {
    watchlist: [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        stockData: {
          Initial_Classification: 'Halal',
          Haram_Reason: null
        }
      },
      {
        symbol: 'GOOG',
        companyName: 'Alphabet Inc.',
        stockData: {
          Initial_Classification: 'Doubtful',
          Haram_Reason: 'Some concerns about revenue sources'
        }
      },
      {
        symbol: 'TSLA',
        companyName: 'Tesla Inc.',
        stockData: {
          Initial_Classification: 'Haram',
          Haram_Reason: 'Excessive debt levels'
        }
      }
    ]
  };

  const mockCompanyDetails = {
    'AAPL': {
      current_price: '182.50',
      price_change: 1.25,
      high24: '185.75',
      low24: '180.20',
      volume: 3500000
    },
    'GOOG': {
      current_price: '142.30',
      price_change: -0.75,
      high24: '145.00',
      low24: '141.50',
      volume: 1200000
    },
    'TSLA': {
      current_price: '215.60',
      price_change: 2.10,
      high24: '220.30',
      low24: '210.40',
      volume: 8500000
    }
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Reset mockUserData to default
    mockUserData = {
      subscription: {
        plan: 'basic'
      }
    };
    
    // Set up localStorage with userId
    localStorageMock.getItem.mockReturnValue('user123');

    // Set up axios mocks for main API calls
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/watchlist/')) {
        return Promise.resolve({ data: mockWatchlistData });
      } else if (url.includes('/api/company-details/')) {
        const symbol = url.split('/').pop().replace('.NS', '');
        return Promise.resolve({ data: mockCompanyDetails[symbol] });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    // Set initial window size to desktop
    resizeWindow(1280);
  });

  afterEach(() => {
    // Clean up
    vi.restoreAllMocks();
  });

  const renderComponent = (customProps = {}) => {
    return render(
      <BrowserRouter>
        <WatchList {...customProps} />
      </BrowserRouter>
    );
  };

  it('should render the loading state initially', async () => {
    renderComponent();
    
    expect(screen.getByTestId('loading-container')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('loading-text')).toHaveTextContent('Loading your watchlist...');
  });

  it('should render the watchlist after loading', async () => {
    renderComponent();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    });
    
    // Check if stocks are rendered
    expect(screen.getByTestId('watchlist-grid-view')).toBeInTheDocument();
    expect(screen.getByTestId('stock-card-AAPL')).toBeInTheDocument();
    expect(screen.getByTestId('stock-card-GOOG')).toBeInTheDocument();
    expect(screen.getByTestId('stock-card-TSLA')).toBeInTheDocument();
  });

  it('should show error state when API request fails', async () => {
    // Mock API to throw error
    axios.get.mockRejectedValueOnce({ 
      response: { data: { message: 'Failed to fetch watchlist data' } }
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByTestId('error-container')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to fetch watchlist data');
    });
  });

  it('should render empty state when no stocks exist', async () => {
    // Mock empty watchlist response
    axios.get.mockResolvedValueOnce({ data: { watchlist: [] } });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByTestId('empty-watchlist-container')).toBeInTheDocument();
      expect(screen.getByTestId('empty-watchlist-title')).toHaveTextContent('Your watchlist is empty');
    });
  });

  it('should show free plan message when user is on free plan and has no stocks', async () => {
    // Set mockUserData to free plan before rendering
    mockUserData = {
      subscription: {
        plan: 'free'
      }
    };
    
    // Mock empty watchlist response
    axios.get.mockResolvedValueOnce({ data: { watchlist: [] } });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByTestId('free-plan-empty-container')).toBeInTheDocument();
      expect(screen.getByTestId('upgrade-button')).toBeInTheDocument();
    });
  });

  it('should toggle between grid and list views', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    });
    
    // Initially in grid view
    expect(screen.getByTestId('watchlist-grid-view')).toBeInTheDocument();
    
    // Switch to list view
    fireEvent.click(screen.getByTestId('list-view-button'));
    
    expect(screen.getByTestId('watchlist-list-view')).toBeInTheDocument();
    expect(screen.getByTestId('stock-row-AAPL')).toBeInTheDocument();
    
    // Switch back to grid view
    fireEvent.click(screen.getByTestId('grid-view-button'));
    
    expect(screen.getByTestId('watchlist-grid-view')).toBeInTheDocument();
    expect(screen.getByTestId('stock-card-AAPL')).toBeInTheDocument();
  });

  it('should filter stocks by category', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    });
    
    // Toggle filter panel
    fireEvent.click(screen.getByTestId('filter-toggle-button'));
    expect(screen.getByTestId('filter-options')).toBeInTheDocument();
    
    // Filter to show only halal stocks
    fireEvent.click(screen.getByTestId('filter-halal'));
    
    // Should only show Apple
    expect(screen.getByTestId('stock-card-AAPL')).toBeInTheDocument();
    expect(screen.queryByTestId('stock-card-GOOG')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stock-card-TSLA')).not.toBeInTheDocument();
    
    // Switch to showing only haram stocks
    fireEvent.click(screen.getByTestId('filter-haram'));
    
    // Should only show Tesla
    expect(screen.queryByTestId('stock-card-AAPL')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stock-card-GOOG')).not.toBeInTheDocument();
    expect(screen.getByTestId('stock-card-TSLA')).toBeInTheDocument();
    
    // Back to all
    fireEvent.click(screen.getByTestId('filter-all'));
    
    // Should show all 3 stocks
    expect(screen.getByTestId('stock-card-AAPL')).toBeInTheDocument();
    expect(screen.getByTestId('stock-card-GOOG')).toBeInTheDocument();
    expect(screen.getByTestId('stock-card-TSLA')).toBeInTheDocument();
  });

  it('should search stocks by name or symbol', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    });
    
    // Search by company name
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Apple' } });
    
    // Should only show Apple
    expect(screen.getByTestId('stock-card-AAPL')).toBeInTheDocument();
    expect(screen.queryByTestId('stock-card-GOOG')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stock-card-TSLA')).not.toBeInTheDocument();
    
    // Search by symbol
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'TSLA' } });
    
    // Should only show Tesla
    expect(screen.queryByTestId('stock-card-AAPL')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stock-card-GOOG')).not.toBeInTheDocument();
    expect(screen.getByTestId('stock-card-TSLA')).toBeInTheDocument();
    
    // Clear search
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: '' } });
    
    // Should show all stocks
    expect(screen.getByTestId('stock-card-AAPL')).toBeInTheDocument();
    expect(screen.getByTestId('stock-card-GOOG')).toBeInTheDocument();
    expect(screen.getByTestId('stock-card-TSLA')).toBeInTheDocument();
  });

  it('should open and interact with the removal confirmation modal', async () => {
    // Mock API for deletion
    axios.delete = vi.fn().mockResolvedValue({
      data: { message: 'Stock removed successfully' }
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    });
    
    // Try to remove a stock
    fireEvent.click(screen.getByTestId('remove-stock-AAPL'));
    
    // Confirm modal appears
    expect(screen.getByTestId('modal-container')).toBeInTheDocument();
    expect(screen.getByTestId('modal-confirm')).toBeInTheDocument();
    expect(screen.getByTestId('modal-message')).toHaveTextContent('Are you sure you want to remove AAPL from your watchlist?');
    
    // Confirm the deletion
    fireEvent.click(screen.getByTestId('modal-confirm-button'));
    
    // Check that API was called with correct params
    expect(axios.delete).toHaveBeenCalledWith(
      '/api/watchlist/user123/AAPL',
      { data: { userId: 'user123', symbol: 'AAPL' } }
    );
    
    // Wait for success modal
    await waitFor(() => {
      expect(screen.getByTestId('modal-success')).toBeInTheDocument();
      expect(screen.getByTestId('modal-message')).toHaveTextContent('AAPL removed from watchlist');
    });
    
    // Modal should auto-close after timeout
    await waitFor(() => {
      expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Stock should be removed from UI
    expect(screen.queryByTestId('stock-card-AAPL')).not.toBeInTheDocument();
  });

  it('should test mobile responsive behavior', async () => {
    // Set screen size to mobile
    resizeWindow(480);
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    });
    
    // Toggle filter panel
    fireEvent.click(screen.getByTestId('filter-toggle-button'));
    expect(screen.getByTestId('filter-options')).toBeInTheDocument();
    
    // Change to mobile view should automatically close filters on resize
    resizeWindow(320);
    
    await waitFor(() => {
      expect(screen.queryByTestId('filter-options')).not.toBeInTheDocument();
    });
  });

  it('should render correct status pills for each stock classification', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    });
    
    // Check for halal status
    const halalPill = screen.getByTestId('status-pill-halal');
    expect(halalPill).toBeInTheDocument();
    expect(halalPill).toHaveClass('bg-green-100');
    
    // Check for doubtful status
    const doubtfulPill = screen.getByTestId('status-pill-doubtful');
    expect(doubtfulPill).toBeInTheDocument();
    expect(doubtfulPill).toHaveClass('bg-yellow-100');
    
    // Check for haram status
    const haramPill = screen.getByTestId('status-pill-haram');
    expect(haramPill).toBeInTheDocument();
    expect(haramPill).toHaveClass('bg-red-100');
  });

  it('should render the watchlist summary with correct counts', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('watchlist-summary')).toBeInTheDocument();
    expect(screen.getByTestId('total-stocks-value')).toHaveTextContent('3');
    expect(screen.getByTestId('halal-stocks-value')).toHaveTextContent('1');
    expect(screen.getByTestId('doubtful-stocks-value')).toHaveTextContent('1');
    expect(screen.getByTestId('haram-stocks-value')).toHaveTextContent('1');
  });

  it('should handle error during stock removal', async () => {
    // Mock API to throw error
    axios.delete = vi.fn().mockRejectedValue({
      response: { data: { message: 'Failed to remove stock' } }
    });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    });
    
    // Try to remove a stock
    fireEvent.click(screen.getByTestId('remove-stock-AAPL'));
    
    // Confirm modal appears
    expect(screen.getByTestId('modal-confirm')).toBeInTheDocument();
    
    // Confirm the deletion
    fireEvent.click(screen.getByTestId('modal-confirm-button'));
    
    // Check that error modal appears
    await waitFor(() => {
      expect(screen.getByTestId('modal-error')).toBeInTheDocument();
      expect(screen.getByTestId('modal-message')).toHaveTextContent('Failed to remove stock from watchlist: Failed to remove stock');
    });
  });

  it('should handle missing userId', async () => {
    // Mock missing userId
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByTestId('error-container')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('User ID is missing. Please log in again.');
    });
  });
});
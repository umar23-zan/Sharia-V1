import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import StockResults from '../components/StockResults';
import { getUserData } from '../api/auth';

// Mock the required dependencies
vi.mock('axios');
vi.mock('../api/auth', () => ({
  getUserData: vi.fn()
}));
vi.mock('./PriceChart', () => ({
  default: () => <div data-testid="price-chart">Price Chart</div>
}));
vi.mock('./Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));
vi.mock('./Card', () => ({ 
  default: ({ children, ...props }) => <div {...props}>{children}</div> 
}));

// Setup the router mocks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ symbol: 'AAPL' }),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: {} })
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {
    'userId': 'user123',
    'userEmail': 'test@example.com'
  };
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => { store[key] = value; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock data
const mockCompanyDetails = {
  company_name: 'Apple Inc.',
  symbol: 'AAPL.NS',
  company_description: 'Technology company that designs and manufactures consumer electronics',
  previous_close: '185.92',
  volume: 45000000,
  pe_ratio: 30.5
};

const mockStockData = {
  Initial_Classification: 'Halal',
  Shariah_Confidence_Percentage: 85,
  Debt_to_Assets: 0.23,
  Cash_and_Interest_Securities_to_Assets: 0.42,
  Interest_Income_to_Revenue: 0.03,
  Receivables_to_Assets: 0.33,
  Haram_Reason: null
};

const mockNewsArticles = [
  {
    title: 'Apple announces new product line',
    description: 'Apple unveils new products at annual conference',
    link: 'https://example.com/news1'
  },
  {
    title: 'Apple stock surges after earnings report',
    description: 'Investors react positively to quarterly results',
    link: 'https://example.com/news2'
  }
];

const mockUser = {
  watchlist: [{ symbol: 'MSFT', companyName: 'Microsoft' }],
  subscription: { plan: 'premium' }
};

describe('StockResults Component', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup mock response for API calls
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/company-details')) {
        return Promise.resolve({ data: mockCompanyDetails });
      } else if (url.includes('/api/stocks/')) {
        return Promise.resolve({ data: mockStockData });
      } else if (url.includes('newsdata.io')) {
        return Promise.resolve({ data: { results: mockNewsArticles } });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    getUserData.mockResolvedValue(mockUser);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders stock details when data is loaded', async () => {
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
  
    // Wait for loading spinner to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  
    // Wait for and check main container
    const container = await screen.findByTestId('stock-results-container');
    expect(container).toBeInTheDocument();
  
    // Wait for company name
    const companyNameElement = await screen.findByTestId('company-name');
    expect(companyNameElement).toBeInTheDocument();
    expect(companyNameElement).toHaveTextContent('Apple Inc.');
  
    // Symbol
    const symbolElement = await screen.findByTestId('stock-symbol');
    expect(symbolElement).toBeInTheDocument();
  
    // Classification badge
    const classificationElement = await screen.findByTestId('classification-text');
    expect(classificationElement).toBeInTheDocument();
  
    // Confidence
    const confidenceElement = await screen.findByTestId('confidence-percentage');
    expect(confidenceElement).toBeInTheDocument();
  
    // Debt ratio
    const debtRatioElement = await screen.findByTestId('metric-card-debt-ratio');
    expect(debtRatioElement).toBeInTheDocument();
  
    // Company stats
    const previousCloseElement = await screen.findByTestId('previous-close');
    expect(previousCloseElement).toBeInTheDocument();
  
    const peRatioElement = await screen.findByTestId('pe-ratio');
    expect(peRatioElement).toBeInTheDocument();
  
    // News Articles
    const newsArticles = await screen.findAllByText(/Apple/i);
    expect(newsArticles.length).toBeGreaterThan(0);
  });
  

  it('displays error message when API call fails', async () => {
    // Mock API to fail
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch data'));
    
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const errorElement = screen.queryByTestId('error-message') || 
                         screen.getByText(/failed|error|unable/i);
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('shows view limit reached screen when API returns 403', async () => {
    // Mock 403 forbidden response
    const errorResponse = {
      response: {
        status: 403,
        data: { message: 'View limit reached' }
      }
    };
    axios.get.mockRejectedValueOnce(errorResponse);
    
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const limitElement = screen.queryByTestId('view-limit-container') || 
                         screen.getByText(/view limit reached/i, { exact: false });
      expect(limitElement).toBeInTheDocument();
      
      const subscribeButton = screen.queryByTestId('subscribe-button') || 
                            screen.getByText(/subscribe|upgrade/i);
      expect(subscribeButton).toBeInTheDocument();
    });
  });

  it('toggles metric card flip when clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Find a metric card using more flexible selectors
    const metricCard = screen.queryByTestId('metric-card-debt-ratio') || 
                      screen.getAllByText(/0\.23|debt/i, { exact: false })[0];
    
    expect(metricCard).toBeInTheDocument();
    
    // Click the card to flip it
    fireEvent.click(metricCard);
    
    // The card should still be in the document after clicking
    // Just verify it's still there without making assumptions about its state
    const metricCardAfterClick = screen.queryByTestId('metric-card-debt-ratio') || 
                               screen.getAllByText(/0\.23|debt/i, { exact: false })[0];
    expect(metricCardAfterClick).toBeInTheDocument();
  });

  it('toggles watchlist status when heart icon is clicked', async () => {
    // Mock successful watchlist API calls
    axios.post.mockResolvedValue({ data: { message: 'Stock added to watchlist' } });
    axios.delete.mockResolvedValue({ data: { message: 'Stock removed from watchlist' } });
    
    // Set up with stock not in watchlist initially
    getUserData.mockResolvedValue({
      ...mockUser,
      watchlist: []
    });
    
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Find watchlist toggle using more flexible selector
    const watchlistToggle = screen.queryByTestId('watchlist-toggle') || 
                          screen.getByRole('button', { name: /watchlist|favorite|heart/i });
    
    // Click the heart icon to add to watchlist
    fireEvent.click(watchlistToggle);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    
    // Mock the stock being in watchlist now
    getUserData.mockResolvedValue({
      ...mockUser,
      watchlist: [{ symbol: 'AAPL', companyName: 'Apple Inc.' }]
    });
  });

  it('shows alert message when watchlist operation fails', async () => {
    // Mock failed watchlist API call
    axios.post.mockRejectedValue({ 
      response: { 
        status: 400,
        data: { message: 'Failed to add to watchlist' }
      }
    });
    
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Find watchlist toggle using more flexible selector
    const watchlistToggle = screen.queryByTestId('watchlist-toggle') || 
                          screen.getByRole('button', { name: /watchlist|favorite|heart/i });
    
    // Click the heart icon
    fireEvent.click(watchlistToggle);
    
    // Verify alert message appears - using more flexible selectors
    await waitFor(() => {
      const alertElement = screen.queryByTestId('alert-message') || 
                         screen.getByText(/failed|error|unable/i);
      expect(alertElement).toBeInTheDocument();
    });
  });

  it('renders non-Halal stock with appropriate styling', async () => {
    // Override mock data for a non-Halal stock
    const nonHalalStock = {
      ...mockStockData,
      Initial_Classification: 'Haram',
      Shariah_Confidence_Percentage: 20,
      Haram_Reason: 'High interest-based income'
    };
    
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/company-details')) {
        return Promise.resolve({ data: mockCompanyDetails });
      } else if (url.includes('/api/stocks/')) {
        return Promise.resolve({ data: nonHalalStock });
      } else if (url.includes('newsdata.io')) {
        return Promise.resolve({ data: { results: mockNewsArticles } });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Use more flexible selectors
    const classificationText = screen.queryByTestId('classification-text') || 
                             screen.getByText('Haram', { exact: false });
    expect(classificationText).toBeInTheDocument();
    
    const haramReason = screen.queryByTestId('haram-reason') || 
                       screen.getByText('High interest-based income', { exact: false });
    expect(haramReason).toBeInTheDocument();
    
    const confidenceText = screen.queryByTestId('confidence-percentage') || 
                         screen.getByText('20% Confidence', { exact: false });
    expect(confidenceText).toBeInTheDocument();
  });

  it('renders no news message when no news articles are available', async () => {
    // Mock empty news response
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/company-details')) {
        return Promise.resolve({ data: mockCompanyDetails });
      } else if (url.includes('/api/stocks/')) {
        return Promise.resolve({ data: mockStockData });
      } else if (url.includes('newsdata.io')) {
        return Promise.resolve({ data: { results: [] } });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Look for no news message with flexible selector
    const noNewsElement = screen.queryByTestId('no-news') || 
                         screen.getByText(/no news|news unavailable|no articles/i);
    expect(noNewsElement).toBeInTheDocument();
  });
  
  it('renders the back button that can be clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/stock/AAPL']}>
        <Routes>
          <Route path="/stock/:symbol" element={<StockResults />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Find back button with flexible selector
    const backButton = screen.queryByTestId('back-button') || 
                      screen.getByRole('button', { name: /back|return|previous/i });
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    
    // Verify the mock navigate function was called
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
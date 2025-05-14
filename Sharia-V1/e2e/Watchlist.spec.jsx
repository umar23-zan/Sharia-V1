// watchlist.spec.js
import { test, expect } from '@playwright/test';

test.describe('Watchlist Component Tests', () => {
  // Mock data for testing
  const mockWatchlistData = {
    watchlist: [
      {
        symbol: 'RELIANCE',
        companyName: 'Reliance Industries Ltd',
        stockData: {
          Initial_Classification: 'halal',
          Haram_Reason: null
        }
      },
      {
        symbol: 'INFY',
        companyName: 'Infosys Ltd',
        stockData: {
          Initial_Classification: 'doubtful',
          Haram_Reason: 'Doubtful due to high interest income'
        }
      },
      {
        symbol: 'HDFCBANK',
        companyName: 'HDFC Bank Ltd',
        stockData: {
          Initial_Classification: 'haram',
          Haram_Reason: 'Main business involves interest-based transactions'
        }
      }
    ]
  };

  const mockCompanyDetails = {
    'RELIANCE': {
      current_price: '2750.45',
      price_change: 1.25,
      high24: '2780.30',
      low24: '2720.10',
      volume: 1500000
    },
    'INFY': {
      current_price: '1450.80',
      price_change: -0.75,
      high24: '1470.20',
      low24: '1440.50',
      volume: 900000
    },
    'HDFCBANK': {
      current_price: '1680.25',
      price_change: 0.50,
      high24: '1695.10',
      low24: '1665.30',
      volume: 1200000
    }
  };

  test.beforeEach(async ({ page }) => {
    // Clear any existing localStorage
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  
    // Clear all previously registered routes (not strictly necessary if routes are test-local)
    await page.unroute('**');
  
    // Re-mock localStorage for userId
    await page.addInitScript(() => {
      window.localStorage.setItem('userId', '67da74600f7f8464026c7c1f');
      window.localStorage.setItem('userEmail', 'test@gmail.com');
      window.localStorage.setItem('user', JSON.stringify({ subscription: { plan: 'free' } }));
    });
  
    // Mock API response for watchlist
    await page.route('/api/watchlist/*', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockWatchlistData),
      });
    });
  
    // Mock company details API
    await page.route('http://15.206.209.211:5000/api/company-details/*', async (route) => {
      const url = route.request().url();
      const symbol = url.split('/').pop().replace('.NS', '');
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockCompanyDetails[symbol] || {}),
      });
    });
  
    // Go to the watchlist page
    await page.goto('http://localhost:5173/watchlist');
  
    // Wait for the page to fully load
    await page.waitForSelector('[data-testid="watchlist-container"]');
  });
  

  test('should display watchlist page with correct title', async ({ page }) => {
    // Check page title
    await expect(page.getByTestId('page-title')).toBeVisible();
    await expect(page.getByTestId('page-title')).toHaveText('Watchlist');
  });

  test('should display all stocks in the watchlist', async ({ page }) => {
    
    
    // Verify all stocks are displayed
    await expect(page.getByTestId('stock-card-RELIANCE')).toBeVisible();
    await expect(page.getByTestId('stock-card-INFY')).toBeVisible();
    await expect(page.getByTestId('stock-card-HDFCBANK')).toBeVisible();
    
    // Check company names and symbols
    await expect(page.getByTestId('stock-name-RELIANCE')).toHaveText('Reliance Industries Ltd');
    await expect(page.getByTestId('stock-symbol-RELIANCE')).toHaveText('RELIANCE');
    
    // Check stock prices and changes
    await expect(page.getByTestId('stock-price-RELIANCE')).toContainText('₹2750.45');
    await expect(page.getByTestId('stock-change-RELIANCE')).toContainText('+1.25%');
  });

  test('should filter stocks by classification', async ({ page }) => {
    // Wait for loading to complete
    await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
    // Open filters
    await page.getByTestId('filter-toggle-button').click();
    await expect(page.getByTestId('filter-options')).toBeVisible();
    
    // Filter by Halal
    await page.getByTestId('filter-halal').click();
    await expect(page.getByTestId('stock-card-RELIANCE')).toBeVisible();
    await expect(page.getByTestId('stock-card-INFY')).not.toBeVisible();
    await expect(page.getByTestId('stock-card-HDFCBANK')).not.toBeVisible();
    
    // Filter by Doubtful
    await page.getByTestId('filter-doubtful').click();
    await expect(page.getByTestId('stock-card-RELIANCE')).not.toBeVisible();
    await expect(page.getByTestId('stock-card-INFY')).toBeVisible();
    await expect(page.getByTestId('stock-card-HDFCBANK')).not.toBeVisible();
    
    // Filter by Haram
    await page.getByTestId('filter-haram').click();
    await expect(page.getByTestId('stock-card-RELIANCE')).not.toBeVisible();
    await expect(page.getByTestId('stock-card-INFY')).not.toBeVisible();
    await expect(page.getByTestId('stock-card-HDFCBANK')).toBeVisible();
    
    // Reset to All
    await page.getByTestId('filter-all').click();
    await expect(page.getByTestId('stock-card-RELIANCE')).toBeVisible();
    await expect(page.getByTestId('stock-card-INFY')).toBeVisible();
    await expect(page.getByTestId('stock-card-HDFCBANK')).toBeVisible();
  });

  test('should toggle between grid and list views', async ({ page }) => {
    // Wait for loading to complete
    await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
    // Check initial grid view
    await expect(page.getByTestId('watchlist-grid-view')).toBeVisible();
    
    // Switch to list view
    await page.getByTestId('list-view-button').click();
    await expect(page.getByTestId('watchlist-grid-view')).not.toBeVisible();
    await expect(page.getByTestId('watchlist-list-view')).toBeVisible();
    await expect(page.getByTestId('stock-row-RELIANCE')).toBeVisible();
    
    // Switch back to grid view
    await page.getByTestId('grid-view-button').click();
    await expect(page.getByTestId('watchlist-list-view')).not.toBeVisible();
    await expect(page.getByTestId('watchlist-grid-view')).toBeVisible();
    await expect(page.getByTestId('stock-card-RELIANCE')).toBeVisible();
  });

  test('should search stocks by name or symbol', async ({ page }) => {
    // Wait for loading to complete
    await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
    // Search by company name (partial)
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill('Reliance');
    
    await expect(page.getByTestId('stock-card-RELIANCE')).toBeVisible();
    await expect(page.getByTestId('stock-card-INFY')).not.toBeVisible();
    await expect(page.getByTestId('stock-card-HDFCBANK')).not.toBeVisible();
    
    // Clear search and search by symbol
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').clear();
    await page.getByTestId('search-input').fill('INFY');
    
    await expect(page.getByTestId('stock-card-RELIANCE')).not.toBeVisible();
    await expect(page.getByTestId('stock-card-INFY')).toBeVisible();
    await expect(page.getByTestId('stock-card-HDFCBANK')).not.toBeVisible();
    
    // Clear search
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').clear();
    
    await expect(page.getByTestId('stock-card-RELIANCE')).toBeVisible();
    await expect(page.getByTestId('stock-card-INFY')).toBeVisible();
    await expect(page.getByTestId('stock-card-HDFCBANK')).toBeVisible();
  });

  test('should show and interact with confirmation modal when removing a stock', async ({ page }) => {
    // Wait for loading to complete
    await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
    // Mock delete API call
    await page.route('**/api/watchlist/*/RELIANCE', async (route) => {
      await route.fulfill({ 
        status: 200, 
        body: JSON.stringify({ success: true, message: 'Stock removed successfully' })
      });
    });
    
    // Click remove button for RELIANCE
    await page.getByTestId('remove-stock-RELIANCE').click();
    
    // Check if modal appears
    await expect(page.getByTestId('modal-container')).toBeVisible();
    await expect(page.getByTestId('modal-confirm')).toBeVisible();
    await expect(page.getByTestId('modal-message')).toContainText('Are you sure you want to remove RELIANCE from your watchlist?');
    
    // Mock the HTTP request for stock removal
    const deleteRequestPromise = page.waitForRequest(request => 
      request.url().includes('/api/watchlist/') && 
      request.url().includes('/RELIANCE') && 
      request.method() === 'DELETE'
    );
    
    // Confirm removal
    await page.getByTestId('modal-confirm-button').click();
    
    // Wait for the request to be made
    await deleteRequestPromise;
    
    // Verify success modal
    await expect(page.getByTestId('modal-success')).toBeVisible();
    
    // After modal closes, check that stock is removed
    await expect(page.getByTestId('modal-container')).not.toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('stock-card-RELIANCE')).not.toBeVisible();
    await expect(page.getByTestId('stock-card-INFY')).toBeVisible();
    await expect(page.getByTestId('stock-card-HDFCBANK')).toBeVisible();
  });

  test('should show empty state when no stocks in watchlist', async ({ page }) => {
    // Mock empty watchlist
    await page.route('/api/watchlist/*', async (route) => {
      await route.fulfill({ 
        status: 200, 
        body: JSON.stringify({ watchlist: [] })
      });
    });
    
    // Reload page to get empty state
    await page.reload();
    
    // Wait for loading to complete
    await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
    // Check empty watchlist state
    await expect(page.getByTestId('empty-watchlist-container')).toBeVisible();
    await expect(page.getByTestId('empty-watchlist-title')).toHaveText('Your watchlist is empty');
    await expect(page.getByTestId('discover-stocks-button')).toBeVisible();
  });

  // test('should show free plan state for free users with empty watchlist', async ({ page }) => {
  //   await page.addInitScript(() => {
  //     // Simulate navigation state with subscription info
  //     history.replaceState(
  //       { user: { subscription: { plan: 'free' } } },
  //       '',
  //       'https://localhost:5173/watchlist'
  //     );
  //   });
    
  //   // Mock empty watchlist
  //   await page.route('/api/watchlist/*', async (route) => {
  //     await route.fulfill({ 
  //       status: 200, 
  //       body: JSON.stringify({ watchlist: [] })
  //     });
  //   });
    
  //   // Reload page
  //   await page.reload();
    
  //   // Wait for loading to complete
  //   await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
  //   // Check free plan empty state
  //   await expect(page.getByTestId('free-plan-empty-container')).toBeVisible();
  //   await expect(page.getByTestId('free-plan-title')).toHaveText('Unlock Watchlist Feature');
  //   await expect(page.getByTestId('upgrade-button')).toBeVisible();
  // });

  test('should show error state when API fails', async ({ page }) => {
    // Mock API error
    await page.route('/api/watchlist/*', async (route) => {
      await route.fulfill({ 
        status: 500, 
        body: JSON.stringify({ message: 'Internal server error' })
      });
    });
    
    // Reload page
    await page.reload();
    
    // Wait for loading to complete
    await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
    // Check error state
    await expect(page.getByTestId('error-container')).toBeVisible();
    await expect(page.getByTestId('error-title')).toHaveText('Error Loading Watchlist');
    await expect(page.getByTestId('error-retry-button')).toBeVisible();
  });

  test('should navigate to stock details when clicking on a stock card', async ({ page }) => {
    // Wait for loading to complete
    await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
    // Set up navigation listener
    const navigationPromise = page.waitForNavigation();
    
    // Click on stock card
    await page.getByTestId('stock-card-RELIANCE').click();
    
    // Wait for navigation
    await navigationPromise;
    
    // Check URL includes stock symbol
    expect(page.url()).toContain('/stockresults/RELIANCE');
  });

  test('should display correct watchlist summary stats', async ({ page }) => {
    // Wait for loading to complete
    await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
    // Check summary section
    await expect(page.getByTestId('watchlist-summary')).toBeVisible();
    await expect(page.getByTestId('total-stocks-value')).toHaveText('3');
    await expect(page.getByTestId('halal-stocks-value')).toHaveText('1');
    await expect(page.getByTestId('doubtful-stocks-value')).toHaveText('1');
    await expect(page.getByTestId('haram-stocks-value')).toHaveText('1');
  });

  test('should navigate back when clicking back button', async ({ page }) => {
    // Mock navigation history
    await page.evaluate(() => {
      window.history.pushState({}, '', '/previous-page');
      window.history.pushState({}, '', '/watchlist');
    });
    
    // Wait for loading to complete
    await expect(page.getByTestId('loading-container')).not.toBeVisible({ timeout: 5000 });
    
    // Set up navigation listener
    const navigationPromise = page.waitForNavigation();
    
    // Click back button
    await page.getByTestId('back-button').click();
    
    // Wait for navigation
    await navigationPromise;
    
    // Check URL
    expect(page.url()).toContain('/previous-page');
  });
});


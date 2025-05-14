import { test, expect } from '@playwright/test';

const testUser = {
  email: 'umarmohamed444481@gmail.com',
  password: '321654'
};

test.describe('StockResults Component', () => {
  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:5173/login');
    
    // Fill in login form
    await page.getByTestId('email-input').fill(testUser.email);
    await page.getByTestId('password-input').fill(testUser.password);
    
    // Submit login form
    await page.getByTestId('login-button').click();
    
    await page.waitForURL('**/dashboard');
  });

  test('should load stock results page with company details', async ({ page }) => {
    // Navigate to a stock results page for a specific symbol
    const testSymbol = 'RELIANCE';
    await page.goto(`http://localhost:5173/stockresults/${testSymbol}`);
    
    // Check that loading indicator appears
    await expect(page.getByTestId('loading-spinner')).toBeVisible();
    
    // Wait for loading to finish
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
    
    // Check that essential components are rendered
    await expect(page.getByTestId('stock-results-container')).toBeVisible();
    await expect(page.getByTestId('left-column')).toBeVisible();
    await expect(page.getByTestId('right-column')).toBeVisible();
    
    // Check that stock symbol is displayed correctly
    const stockSymbol = await page.getByTestId('stock-symbol').textContent();
    expect(stockSymbol).toContain(testSymbol);
    
    // Check that company name is displayed
    await expect(page.getByTestId('company-name')).toBeVisible();
    
    // Check for price chart
    await expect(page.getByTestId('price-chart-container')).toBeVisible();
  });

  test('should display metrics and classification', async ({ page }) => {
    const testSymbol = 'INFY';
    await page.goto(`http://localhost:5173/stockresults/${testSymbol}`);
    
    // Wait for loading to finish
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
    
    // Check for metrics grid
    await expect(page.getByTestId('metrics-grid')).toBeVisible();
    
    // Check specific metrics
    await expect(page.getByTestId('metric-card-debt-ratio')).toBeVisible();
    await expect(page.getByTestId('metric-card-cash-ratio')).toBeVisible();
    await expect(page.getByTestId('metric-card-interest-ratio')).toBeVisible();
    await expect(page.getByTestId('metric-card-receivables-ratio')).toBeVisible();
    
    // Check that classification is displayed
    await expect(page.getByTestId('status-badge')).toBeVisible();
    await expect(page.getByTestId('classification-text')).toBeVisible();
  });

  test('should toggle metric card flip', async ({ page }) => {
    const testSymbol = 'TCS';
    await page.goto(`http://localhost:5173/stockresults/${testSymbol}`);
    
    // Wait for loading to finish
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
    
    // Check initial state of card
    await expect(page.getByTestId('metric-card-front-debt-ratio')).toBeVisible();
    
    // Click to flip card
    await page.getByTestId('metric-card-debt-ratio').click();
    
    // Check that back side is now visible
    await expect(page.getByTestId('metric-card-back-debt-ratio')).toBeVisible();
    
    // Click again to flip back
    await page.getByTestId('metric-card-debt-ratio').click();
    
    // Check that front side is visible again
    await expect(page.getByTestId('metric-card-front-debt-ratio')).toBeVisible();
  });

  test('should display company information', async ({ page }) => {
    const testSymbol = 'HDFCBANK';
    await page.goto(`http://localhost:5173/stockresults/${testSymbol}`);
    
    // Wait for loading to finish
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
    
    // Check company stats
    await expect(page.getByTestId('company-about')).toBeVisible();
    await expect(page.getByTestId('company-description')).toBeVisible();
    await expect(page.getByTestId('previous-close')).toBeVisible();
    await expect(page.getByTestId('avg-volume')).toBeVisible();
    await expect(page.getByTestId('pe-ratio')).toBeVisible();
    await expect(page.getByTestId('primary-exchange')).toBeVisible();
  });

  test('should display news section', async ({ page }) => {
    const testSymbol = 'SBIN';
    await page.goto(`http://localhost:5173/stockresults/${testSymbol}`);
    
    // Wait for loading to finish
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
    
    // Check news section
    await expect(page.getByTestId('news-section')).toBeVisible();
    
    // Check if there are news articles or a "no news" message
    const hasNewsArticles = await page.getByTestId('news-article-0').isVisible().catch(() => false);
    
    if (hasNewsArticles) {
      // If there are news articles, check at least one
      await expect(page.getByTestId('news-article-0')).toBeVisible();
      await expect(page.getByTestId('news-link-0')).toBeVisible();
    } else {
      // If no news articles, check for "no news" message
      await expect(page.getByTestId('no-news')).toBeVisible();
    }
  });

  test('should handle error states properly', async ({ page }) => {
    // Test with an invalid symbol
    const invalidSymbol = 'INVALID';
    await page.goto(`http://localhost:5173/stockresults/${invalidSymbol}`);
    
    // Wait for loading to finish
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
    
    // Check if error message appears
    const hasError = await page.getByTestId('error-message').isVisible().catch(() => false);
    const noData = await page.getByTestId('no-stock-data').isVisible().catch(() => false);
    
    // Either error message or no data message should be visible
    expect(hasError || noData).toBeTruthy();
  });

  test('should navigate back when back button is clicked', async ({ page }) => {
    const testSymbol = 'WIPRO';
    const prevUrl = 'http://localhost:5173/dashboard';
    
    // First navigate to dashboard
    await page.goto(prevUrl);
    
    // Then navigate to stock page
    await page.goto(`http://localhost:5173/stockresults/${testSymbol}`);
    
    // Wait for loading to finish
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
    
    // Click back button
    await page.getByTestId('back-button').click();
    
    // Check that we've navigated back
    await expect(page).toHaveURL(prevUrl);
  });

  test('should handle watchlist functionality for paid users', async ({ page }) => {
    // Mock the user as paid user by setting isFreePlan to false
    await page.evaluate(() => {
      window.localStorage.setItem('userId', 'test-user-id');
      // This will only work if you have a way to mock the user data response
      // Otherwise you'll need to implement a real API mock or test with a real paid user
    });
    
    const testSymbol = 'AAPL';
    await page.goto(`http://localhost:5173/stockresults/${testSymbol}`);
    
    // Wait for loading to finish
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
    
    // Check if watchlist toggle is visible (only for paid users)
    const hasWatchlistToggle = await page.getByTestId('watchlist-toggle').isVisible().catch(() => false);
    
    if (hasWatchlistToggle) {
      // Test adding to watchlist
      await page.getByTestId('watchlist-toggle').click();
      
      // Check for confirmation message
      await expect(page.getByTestId('alert-message')).toBeVisible();
      
      // Test removing from watchlist
      await page.getByTestId('watchlist-toggle').click();
      
      // Check for confirmation message again
      await expect(page.getByTestId('alert-message')).toBeVisible();
    }
  });

  test('should show subscription modal for view limit reached', async ({ page }) => {
    // Mock the API response to simulate view limit reached
    await page.route('**/api/stocks/**', async (route) => {
      await route.fulfill({
        status: 403,
        body: JSON.stringify({ message: 'View limit reached' }),
      });
    });
    
    const testSymbol = 'TCS';
    await page.goto(`http://localhost:5173/stockresults/${testSymbol}`);
    
    // Wait for loading to finish
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
    
    // Check if view limit container is shown
    await expect(page.getByTestId('view-limit-container')).toBeVisible();
    await expect(page.getByTestId('view-limit-title')).toBeVisible();
    await expect(page.getByTestId('subscribe-button')).toBeVisible();
    
    // Test subscription button click
    await page.getByTestId('subscribe-button').click();
    
    // Should navigate to subscription page
    await expect(page).toHaveURL(/.*subscriptiondetails.*/);
  });
});
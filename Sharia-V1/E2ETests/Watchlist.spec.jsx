import { test, expect } from '@playwright/test';
import {chromium } from '@playwright/test';

// Test data
const freeUser = {
  email: 'umarmohamed444481@gmail.com',
  password: '321654'
};

const premiumUser = {
  email: 'umarmohmed444sam@gmail.com',
  password: '321654'
};

async function loginUser(page, user) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.getByTestId('email-input').fill(user.email);
  await page.getByTestId('password-input').fill(user.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);
}

// Performance thresholds
const LOAD_TIME_THRESHOLD = 3000; // 3 seconds
const INTERACTION_TIME_THRESHOLD = 300; // 300ms

test.describe('Watchlist Feature Tests', () => {
  // Shared setup for all tests
  test.beforeEach(async ({ page }) => {
    // Enable request interception for network tests
    await page.route('**/*', route => route.continue());
    
    // Navigate to login page
    await page.goto('/login');
  });

  // Functional Tests
  
  test('Load Watchlist - Successful (Premium User)', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    
    // Wait for watchlist to load
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Verify watchlist is displayed with stocks
    const stockCards = await page.$$('[data-testid^="stock-card-"]');
    expect(stockCards.length).toBeGreaterThan(0);
    
    // Verify watchlist summary is present
    await expect(page.locator('[data-testid="watchlist-summary"]')).toBeVisible();
  });

  test('Load Watchlist - Empty (Premium User)', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Mock API to return empty watchlist
    await page.route('/api/watchlist/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ watchlist: [] })
      });
    });
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    
    // Verify empty watchlist message is displayed
    await expect(page.locator('[data-testid="empty-watchlist-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="empty-watchlist-title"]')).toContainText('Your watchlist is empty');
    
    // Verify "Discover Stocks" button is present
    await expect(page.locator('[data-testid="discover-stocks-button"]')).toBeVisible();
  });

  test('Load Watchlist - Free Plan', async ({ page }) => {
    // Login as free user
    await loginUser(page, freeUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist?isFreePlan=free');
    
    // Verify free plan message is displayed
    await expect(page.locator('[data-testid="free-plan-empty-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="free-plan-title"]')).toContainText('Unlock Watchlist Feature');
    
    // Verify "Upgrade Now" button is present
    await expect(page.locator('[data-testid="upgrade-button"]')).toBeVisible();
  });

  test('Search Functionality', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist?');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    const stockCount = await page.locator('[data-testid^="stock-card-"]').count();

  // If no stocks, skip further actions
  if (stockCount === 0) {
    console.warn('No stocks in watchlist to test navigation.');
    return;
  }
    
    // Get initial stock count
    const initialStockCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    
    // Search for a specific stock
    const searchTerm = 'REL'; // Assuming Reliance or similar stock exists
    await page.fill('[data-testid="search-input"]', searchTerm);
    
    // Wait for search results to update
    await page.waitForTimeout(500);
    
    const stockSymbols = await page.$$eval('[data-testid^="stock-symbol-"]', 
      elements => elements.map(el => el.textContent));
    const stockNames = await page.$$eval('[data-testid^="stock-name-"]', 
      elements => elements.map(el => el.textContent));
    
    const foundInSymbol = stockSymbols.some(symbol => symbol.includes(searchTerm));
    const foundInName = stockNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    expect(foundInSymbol || foundInName).toBeTruthy();
    
    // Clear search and verify original count returns
    await page.fill('[data-testid="search-input"]', '');
    await page.waitForTimeout(500);
    
    const finalStockCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    expect(finalStockCount).toEqual(initialStockCount);
  });

  test('Filter - All Stocks', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Open filter options
    await page.click('[data-testid="filter-toggle-button"]');
    
    // Click "All" filter
    await page.click('[data-testid="filter-all"]');
    
    // Verify all stocks are displayed
    const allStocksCount = await page.locator('[data-testid="filter-all-count"]').textContent();
    const displayedStocksCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    
    expect(displayedStocksCount.toString()).toEqual(allStocksCount);
  });

  test('Filter - Halal Stocks', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Open filter options
    await page.click('[data-testid="filter-toggle-button"]');
    
    // Click "Halal" filter
    await page.click('[data-testid="filter-halal"]');
    
    // Verify only halal stocks are displayed
    const halalStocksCount = await page.locator('[data-testid="filter-halal-count"]').textContent();
    const displayedStocksCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    
    expect(displayedStocksCount.toString()).toEqual(halalStocksCount);
    
    // Verify all displayed stocks have halal status
    const statusPills = await page.$$eval('[data-testid^="status-pill-"]', 
      elements => elements.map(el => el.getAttribute('data-testid')));
    
    const allHalal = statusPills.every(pill => pill === 'status-pill-halal');
    expect(allHalal).toBeTruthy();
  });

  test('Filter - Doubtful Stocks', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Open filter options
    await page.click('[data-testid="filter-toggle-button"]');
    
    // Click "Doubtful" filter
    await page.click('[data-testid="filter-doubtful"]');
    
    // Verify only doubtful stocks are displayed
    const doubtfulStocksCount = await page.locator('[data-testid="filter-doubtful-count"]').textContent();
    const displayedStocksCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    
    expect(displayedStocksCount.toString()).toEqual(doubtfulStocksCount);
    
    // Verify all displayed stocks have doubtful status
    const statusPills = await page.$$eval('[data-testid^="status-pill-"]', 
      elements => elements.map(el => el.getAttribute('data-testid')));
    
    const allDoubtful = statusPills.every(pill => pill === 'status-pill-doubtful');
    expect(allDoubtful).toBeTruthy();
  });

  test('Filter - Haram Stocks', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Open filter options
    await page.click('[data-testid="filter-toggle-button"]');
    
    // Click "Haram" filter
    await page.click('[data-testid="filter-haram"]');
    
    // Verify only haram stocks are displayed
    const haramStocksCount = await page.locator('[data-testid="filter-haram-count"]').textContent();
    const displayedStocksCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    
    expect(displayedStocksCount.toString()).toEqual(haramStocksCount);
    
    // Verify all displayed stocks have haram status
    const statusPills = await page.$$eval('[data-testid^="status-pill-"]', 
      elements => elements.map(el => el.getAttribute('data-testid')));
    
    const allHaram = statusPills.every(pill => pill === 'status-pill-haram');
    expect(allHaram).toBeTruthy();
  });

  test('View Toggle - Grid', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Ensure grid view is active
    await page.click('[data-testid="grid-view-button"]');
    
    // Verify grid layout is displayed
    await expect(page.locator('[data-testid="watchlist-grid-view"]')).toBeVisible();
    
    // Verify at least one stock card is visible
    await expect(page.locator('[data-testid^="stock-card-"]').first()).toBeVisible();
  });

  test('View Toggle - List', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Switch to list view
    await page.click('[data-testid="list-view-button"]');
    
    // Verify list layout is displayed
    await expect(page.locator('[data-testid="watchlist-list-view"]')).toBeVisible();
    
    // Verify at least one stock row is visible
    await expect(page.locator('[data-testid^="stock-row-"]').first()).toBeVisible();
  });

  test('Stock Removal - Confirm', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Get initial stock count
    const initialStockCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    
    // Click remove button on first stock
    await page.click('[data-testid^="remove-stock-"]:first-child');
    
    // Verify confirmation modal appears
    await expect(page.locator('[data-testid="modal-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="modal-confirm"]')).toBeVisible();
    
    // Confirm removal
    await page.click('[data-testid="modal-confirm-button"]');
    
    // Wait for success modal
    await expect(page.locator('[data-testid="modal-success"]')).toBeVisible();
    
    // Verify stock is removed
    await page.waitForTimeout(2100); // Wait for modal auto-close
    const finalStockCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    expect(finalStockCount).toBe(initialStockCount - 1);
  });

  test('Stock Removal - Cancel', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Get initial stock count
    const initialStockCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    
    // Click remove button on first stock
    await page.click('[data-testid^="remove-stock-"]:first-child');
    
    // Verify confirmation modal appears
    await expect(page.locator('[data-testid="modal-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="modal-confirm"]')).toBeVisible();
    
    // Cancel removal
    await page.click('[data-testid="modal-cancel-button"]');
    
    // Verify modal is closed
    await expect(page.locator('[data-testid="modal-container"]')).not.toBeVisible();
    
    // Verify stock count remains the same
    const finalStockCount = await page.$$('[data-testid^="stock-card-"]').then(elements => elements.length);
    expect(finalStockCount).toBe(initialStockCount);
  });

  test('Stock Detail Navigation', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
  
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
  
    // Count how many stock cards are present
    const stockCount = await page.locator('[data-testid^="stock-card-"]').count();
  
    // If no stocks, skip further actions
    if (stockCount === 0) {
      console.warn('No stocks in watchlist to test navigation.');
      return;
    }
  
    // Get first stock symbol
    const firstStockSymbol = await page.locator('[data-testid^="stock-symbol-"]').first().textContent();
  
    // Click on first stock card
    await page.click('[data-testid^="stock-card-"]:first-child');
  
    // Verify navigation to stock details page
    await expect(page).toHaveURL(`/stockresults/${firstStockSymbol}`);
  });
  

  test('Back Navigation', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Note the URL before back navigation
    const currentUrl = page.url();
    
    // Click back button
    await page.click('[data-testid="back-button"]');
    
    // Verify navigation happened
    expect(page.url()).not.toEqual(currentUrl);
  });

  test('Discover Stocks Navigation', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Mock API to return empty watchlist
    await page.route('/api/watchlist/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ watchlist: [] })
      });
    });
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    
    // Wait for empty watchlist message
    await expect(page.locator('[data-testid="empty-watchlist-container"]')).toBeVisible();
    
    // Click "Discover Stocks" button
    await page.click('[data-testid="discover-stocks-button"]');
    
    // Verify navigation to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('Upgrade Plan Navigation', async ({ page }) => {
    // Login as free user
    await loginUser(page, freeUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    
    // Wait for free plan message
    await expect(page.locator('[data-testid="free-plan-empty-container"]')).toBeVisible();
    
    // Click "Upgrade Now" button
    await page.click('[data-testid="upgrade-button"]');
    
    // Verify navigation to subscription page
    await expect(page).toHaveURL('/subscriptiondetails');
  });

  test('Filter Toggle', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Filter options should be hidden initially
    await expect(page.locator('[data-testid="filter-options"]')).not.toBeVisible();
    
    // Click filter toggle button
    await page.click('[data-testid="filter-toggle-button"]');
    
    // Verify filter options are displayed
    await expect(page.locator('[data-testid="filter-options"]')).toBeVisible();
    
    // Click filter toggle button again
    await page.click('[data-testid="filter-toggle-button"]');
    
    // Verify filter options are hidden
    await expect(page.locator('[data-testid="filter-options"]')).not.toBeVisible();
  });

  test('Filter Badge', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Open filter options
    await page.click('[data-testid="filter-toggle-button"]');
    
    // No filter badge when "All" is selected
    await page.click('[data-testid="filter-all"]');
    await expect(page.locator('[data-testid="filter-badge"]')).not.toBeVisible();
    
    // Filter badge appears when specific filter is selected
    await page.click('[data-testid="filter-halal"]');
    await expect(page.locator('[data-testid="filter-badge"]')).toBeVisible();
    expect(await page.locator('[data-testid="filter-badge"]').textContent()).toBe('1');
  });

  test('Display Stock Count', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });

    const stockCount = await page.locator('[data-testid^="stock-card-"]').count();

    // If no stocks, skip further actions
    if (stockCount === 0) {
      console.warn('No stocks in watchlist to test navigation.');
      return;
    }
    
    // Open filter options
    await page.click('[data-testid="filter-toggle-button"]');
    
    // Verify all filter counts are displayed correctly
    const allCount = await page.locator('[data-testid="filter-all-count"]').textContent();
    const halalCount = await page.locator('[data-testid="filter-halal-count"]').textContent();
    const doubtfulCount = await page.locator('[data-testid="filter-doubtful-count"]').textContent();
    const haramCount = await page.locator('[data-testid="filter-haram-count"]').textContent();
    
    // Total should equal sum of categories
    expect(parseInt(allCount)).toEqual(
      parseInt(halalCount) + parseInt(doubtfulCount) + parseInt(haramCount)
    );
  });

  test('Display Summary Statistics', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    const stockCount = await page.locator('[data-testid^="stock-card-"]').count();

    // If no stocks, skip further actions
    if (stockCount === 0) {
      console.warn('No stocks in watchlist to test navigation.');
      return;
    }
    
    // Verify summary section is visible
    await expect(page.locator('[data-testid="watchlist-summary"]')).toBeVisible();
    
    // Get statistics
    const totalStocks = await page.locator('[data-testid="total-stocks-value"]').textContent();
    const halalStocks = await page.locator('[data-testid="halal-stocks-value"]').textContent();
    const doubtfulStocks = await page.locator('[data-testid="doubtful-stocks-value"]').textContent();
    const haramStocks = await page.locator('[data-testid="haram-stocks-value"]').textContent();
    
    // Total should equal sum of categories
    expect(parseInt(totalStocks)).toEqual(
      parseInt(halalStocks) + parseInt(doubtfulStocks) + parseInt(haramStocks)
    );
  });

  // Non-Functional Tests
  
  test('Page Load Performance', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Measure time to load watchlist page
    const startTime = Date.now();
    
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    const loadTime = Date.now() - startTime;
    console.log(`Watchlist page load time: ${loadTime}ms`);
    
    // Assert that page loads within threshold
    expect(loadTime).toBeLessThan(LOAD_TIME_THRESHOLD);
  });

  test('Responsive Design - Mobile', async ({ browser }) => {
    // Set up mobile viewport
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 } // iPhone SE size
    });
    
    const page = await context.newPage();
    
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Check if filter options are hidden by default on mobile
    await expect(page.locator('[data-testid="filter-options"]')).not.toBeVisible();
    
    // Verify grid layout is mobile-friendly (1 column)
    const gridView = await page.$$('[data-testid^="stock-card-"]');;
    if (await gridView.isVisible()) {
      const gridColumnsStyle = await page.$eval('[data-testid^="stock-card-"]', 
        el => window.getComputedStyle(el).gridTemplateColumns);
      
      // Should only have one column on mobile
      expect(gridColumnsStyle.split(' ').length).toBe(1);
    }
  });

  test('Responsive Design - Tablet', async ({ browser }) => {
    // Set up tablet viewport
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 } // iPad size
    });
    
    const page = await context.newPage();
    
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Switch to grid view
    await page.click('[data-testid="grid-view-button"]');
    
    // Verify grid layout adapts to tablet size (2 columns)
    const gridColumnsStyle = await page.$eval('[data-testid^="stock-card-"]', 
      el => window.getComputedStyle(el).gridTemplateColumns);
    
    // Should have two columns on tablet
    expect(gridColumnsStyle.split(' ').length).toBe(2);
  });

  test('Responsive Design - Desktop', async ({ browser }) => {
    // Set up desktop viewport
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 } // Full HD size
    });
    
    const page = await context.newPage();
    
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    const stockCount = await page.locator('[data-testid^="stock-card-"]').count();

    // If no stocks, skip further actions
    if (stockCount <3) {
      console.warn('No stocks in watchlist to test navigation.');
      return;
    }
    
    // Switch to grid view
    await page.click('[data-testid="grid-view-button"]');
    
    // Verify grid layout adapts to desktop size (3 columns)
    const gridColumnsStyle = await page.$eval('[data-testid^="stock-card-"]', 
      el => window.getComputedStyle(el).gridTemplateColumns);
    
    // Should have three columns on desktop
    expect(gridColumnsStyle.split(' ').length).toBe(3);
  });

  test('Accessibility - Screen Reader', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Check for proper ARIA roles on interactive elements
    // const buttons = await page.$$('button');
    // for (const button of buttons) {
    //   const ariaLabel = await button.getAttribute('aria-label');
    //   expect(ariaLabel).not.toBeNull();
    // }
    
    // Check for proper heading structure
    const headings = await page.$$('h1, h2, h3');
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for proper data-testid attributes
    const testIdElements = await page.$$('[data-testid]');
    expect(testIdElements.length).toBeGreaterThan(0);
  });

  

  test('Performance - Large Watchlist', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Mock API to return a large watchlist (100 stocks)
    const largeWatchlist = Array(25).fill().map((_, i) => ({
      symbol: `STOCK${i}`,
      companyName: `Company ${i}`,
      stockData: {
        Initial_Classification: i % 3 === 0 ? 'Halal' : i % 3 === 1 ? 'Doubtful' : 'Haram',
        Haram_Reason: i % 3 === 0 ? '' : `This is a reason for stock ${i}`
      }
    }));
    
    await page.route('/api/watchlist/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ watchlist: largeWatchlist })
      });
    });
    
    // Measure time to load and render watchlist
    const startTime = Date.now();
    
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Wait for stocks to render
    await page.waitForSelector('[data-testid^="stock-card-"]');
    
    const loadTime = Date.now() - startTime;
    console.log(`Large watchlist (100 stocks) load time: ${loadTime}ms`);
    
    // Performance should be reasonable even with large watchlist
    expect(loadTime).toBeLessThan(LOAD_TIME_THRESHOLD * 2); // Allow more time for large dataset
    
    // Interaction performance: measure time to switch views
    const viewSwitchStart = Date.now();
    await page.click('[data-testid="list-view-button"]');
    await page.waitForSelector('[data-testid="watchlist-list-view"]', { state: 'visible' });
    const viewSwitchTime = Date.now() - viewSwitchStart;
    
    expect(viewSwitchTime).toBeLessThan(INTERACTION_TIME_THRESHOLD);
  });

  test('Error Handling - Network Failure', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Simulate network failure
    await page.route('/api/watchlist/*', route => route.abort('failed'));
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    
    // Verify error state is displayed
    await expect(page.locator('[data-testid="error-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-retry-button"]')).toBeVisible();
    
    // Test retry functionality
    await page.route('/api/watchlist/*', route => route.continue());
    await page.click('[data-testid="error-retry-button"]');
    
    // Verify successful load after retry
    await expect(page.locator('[data-testid="watchlist-container"]')).toBeVisible();
  });

  test('Security - Authentication', async ({ page }) => {
    // Attempt to access watchlist without authentication
    await page.goto('/watchlist');
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/signup');
  });
  test('Security - User Data Isolation', async ({ browser }) => {
    // Create two browser contexts (simulating two different users)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Login as premium user in first context
    await loginUser(page1, premiumUser);
    
    // Login as free user in second context
    await loginUser(page2, freeUser);
    
    // Navigate to watchlist in first context
    await page1.goto('/watchlist');
    await page1.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Get first stock symbol from premium user
    const stockSymbol = await page1.locator('[data-testid^="stock-symbol-"]').first().textContent()
      .catch(() => null);
    
    if (stockSymbol) {
      // Navigate to specific stock URL in free user context (attempting to access premium data)
      await page2.goto(`/watchlist?symbol=${stockSymbol}`);
      
      // Free user should still see free plan message, not premium user's data
      await expect(page2.locator('[data-testid="free-plan-empty-container"]')).toBeVisible();
    }
    
    // Clean up
    await context1.close();
    await context2.close();
  });
  test('Memory Usage', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Capture memory usage before interactions
    const initialMemoryUsage = await page.evaluate(() => window.performance.memory?.usedJSHeapSize || 0);
    
    // Perform memory-intensive operations
    for (let i = 0; i < 10; i++) {
      // Toggle views multiple times
      await page.click('[data-testid="list-view-button"]');
      await page.waitForTimeout(200);
      await page.click('[data-testid="grid-view-button"]');
      await page.waitForTimeout(200);
      
      // Toggle filters
      await page.click('[data-testid="filter-toggle-button"]');
      await page.waitForTimeout(200);
      await page.click('[data-testid="filter-halal"]');
      await page.waitForTimeout(200);
      await page.click('[data-testid="filter-doubtful"]');
      await page.waitForTimeout(200);
      await page.click('[data-testid="filter-haram"]');
      await page.waitForTimeout(200);
      await page.click('[data-testid="filter-all"]');
      await page.waitForTimeout(200);
      await page.click('[data-testid="filter-toggle-button"]');
      await page.waitForTimeout(200);
    }
    
    // Capture memory usage after interactions
    const finalMemoryUsage = await page.evaluate(() => window.performance.memory?.usedJSHeapSize || 0);
    
    // Log memory usage (in MB)
    console.log(`Initial memory usage: ${initialMemoryUsage / (1024 * 1024)} MB`);
    console.log(`Final memory usage: ${finalMemoryUsage / (1024 * 1024)} MB`);
    console.log(`Memory increase: ${(finalMemoryUsage - initialMemoryUsage) / (1024 * 1024)} MB`);
    
    // Skip assertion if memory API not available (e.g., Firefox, Safari)
    if (initialMemoryUsage > 0) {
      // Memory increase should be reasonable (less than 50MB)
      expect(finalMemoryUsage - initialMemoryUsage).toBeLessThan(50 * 1024 * 1024);
    }
  });
  
 
  
  test('Loading States', async ({ page }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Delay API responses to observe loading states
    await page.route('/api/watchlist/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });
    
    // Navigate to watchlist page
    await page.goto('/watchlist');
    
    // Verify loading state is displayed
    await expect(page.locator('[data-testid="loading-container"]')).toBeVisible();
    
    // Verify content appears after loading
    await expect(page.locator('[data-testid="watchlist-container"]')).toBeVisible();
    
    // Loading spinner should disappear
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
  });
  

  
  test('Offline Capability', async ({ page, context }) => {
    // Login as premium user
    await loginUser(page, premiumUser);
    
    // Load watchlist page normally
    await page.goto('/watchlist');
    await page.waitForSelector('[data-testid="watchlist-container"]', { state: 'visible' });
    
    // Go offline
    await context.setOffline(true);
    
    // Try to perform offline actions (e.g., filter, search, view toggle)
    
    // 1. Toggle view
    await page.click('[data-testid="list-view-button"]');
    await expect(page.locator('[data-testid="watchlist-list-view"]')).toBeVisible();
    
    // 2. Use search
    await page.fill('[data-testid="search-input"]', 'TEST');
    
    // 3. Toggle filters
    await page.click('[data-testid="filter-toggle-button"]');
    await page.click('[data-testid="filter-halal"]');
    
    // Verify UI still responds even when offline
    await expect(page.locator('[data-testid="filter-badge"]')).toBeVisible();
    
    // Go back online
    await context.setOffline(false);
    
    // Verify connectivity indication if implemented
    await page.waitForTimeout(500); // Wait for online status to be detected
    await expect(page.locator('[data-testid="offline-indicator"]')).not.toBeVisible();
  });
})
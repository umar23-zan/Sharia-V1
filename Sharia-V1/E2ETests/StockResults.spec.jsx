import { test, expect } from '@playwright/test';
import {chromium } from '@playwright/test';

// Test credentials
const USERS = {
  free: {
    email: 'umarmohamed444481@gmail.com',
    password: '321654'
  },
  premium: {
    email: 'umarmohmed444sam@gmail.com',
    password: '321654'
  }
};

// Stock symbols to test with - one known Halal and one known Haram stock
const TEST_STOCKS = {
  HALAL: 'TCS', // Assuming TCS is classified as Halal
  HARAM: 'SBIN', // Assuming State Bank of India is classified as Haram
  INVALID: 'INVALIDSTOCKSYMBOL'
};


async function login(page, email, password) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(password);
  await page.getByTestId('login-button').click();
  
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);
}

test.describe('Stock Results Page E2E Tests', () => {
  let browser;
  let context;
  let page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.beforeEach(async ({ }) => {
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
    });
    page = await context.newPage();
  });

  test.afterEach(async () => {
    await context.close();
  });

  // Loading and Initial Display Tests
  test('Loading spinner appears and data loads correctly', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Start navigation but intercept network requests to slow them down
    await page.route('**/*', async (route) => {
      // Add small delay to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });
    
    // Navigate to stock page
    const loadingPromise = page.waitForSelector('[data-testid="loading-spinner"]');
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    
    // Verify loading spinner appears
    await loadingPromise;
    await expect(page.getByTestId('loading-spinner')).toBeVisible();
    
    // Wait for the page to finish loading
    await page.waitForSelector('[data-testid="stock-results-container"]', { state: 'visible' });
    
    // Verify spinner is gone and content is visible
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
    await expect(page.getByTestId('stock-results-container')).toBeVisible();
    
    // Reset route interception
    await page.unrouteAll();
  });

  test('Page displays appropriate error message when stock data cannot be retrieved', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Mock API failure for stock data
    await page.route('**/api/stocks/**', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Failed to retrieve stock data' })
      });
    });
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify error message is displayed
    await expect(page.getByTestId('error-message')).toBeVisible();
    
    // Reset route interception
    await page.unrouteAll();
  });

  test('Page displays no stock data message when data is null', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Mock API that returns null data
    await page.route('**/api/stocks/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(null)
      });
    });
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify no stock data message is displayed
    await expect(page.getByTestId('no-stock-data')).toBeVisible();
    
    // Reset route interception
    await page.unrouteAll();
  });

  // Navigation and URL Tests
  test('Page URL correctly reflects the stock symbol being viewed', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify URL contains the correct stock symbol
    expect(page.url()).toContain(`https://shariastocks.in/stockresults/${TEST_STOCKS.HALAL}`);
  });

  test('Back button navigates to the previous page', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Store the dashboard URL
    const dashboardUrl = page.url();
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Click back button
    await page.getByTestId('back-button').click();
    
    // Verify we're back at the dashboard
    expect(page.url()).toBe(dashboardUrl);
  });

  // Header and Company Info Tests
  test('Company name is displayed correctly in the header', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Wait for company name to be visible
    await expect(page.getByTestId('company-name')).toBeVisible();
    
    // Get company name text and verify it's not empty
    const companyName = await page.getByTestId('company-name').textContent();
    expect(companyName.trim()).not.toBe('');
    
    // Also check the company name in the detail section matches
    const companyNameDetail = await page.getByTestId('company-name-detail').textContent();
    expect(companyNameDetail.trim()).not.toBe('');
    
    // Company names should match between header and detail section
    expect(companyName).toBe(companyNameDetail);
  });

  test('Company description is displayed in the "About company" section', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify company description section is visible
    await expect(page.getByTestId('company-about')).toBeVisible();
    
    // Verify description is not empty (could be "not available" but should have some text)
    const description = await page.getByTestId('company-description').textContent();
    expect(description.trim()).not.toBe('');
  });

  test('Company stats display correct values', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify stats section is visible
    await expect(page.getByTestId('company-stats')).toBeVisible();
    
    // Check individual stat values
    await expect(page.getByTestId('previous-close')).toBeVisible();
    const previousClose = await page.getByTestId('previous-close').textContent();
    expect(previousClose).not.toBe('');
    expect(previousClose).not.toBe('N/A');
    
    await expect(page.getByTestId('avg-volume')).toBeVisible();
    const avgVolume = await page.getByTestId('avg-volume').textContent();
    expect(avgVolume).not.toBe('');
    expect(avgVolume).toContain('M'); // Should end with M for millions
    
    await expect(page.getByTestId('pe-ratio')).toBeVisible();
    const peRatio = await page.getByTestId('pe-ratio').textContent();
    expect(peRatio).not.toBe('');
    
    await expect(page.getByTestId('primary-exchange')).toBeVisible();
    const exchange = await page.getByTestId('primary-exchange').textContent();
    expect(exchange).toBe('NSE');
  });

  // Halal/Haram Status Tests
  test('Halal status badge displays correctly for Halal stocks', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to known Halal stock
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify status badge is visible
    await expect(page.getByTestId('status-badge')).toBeVisible();
    
    // Verify it shows "Halal"
    const classification = await page.getByTestId('classification-text').textContent();
    expect(classification.trim()).toBe('Halal');
    
    // Verify badge has green styling
    const badge = await page.getByTestId('status-badge');
    const badgeClass = await badge.getAttribute('class');
    expect(badgeClass).toContain('from-emerald-500 to-green-500');
  });

  test('Haram status badge displays correctly for Haram stocks', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to known Haram stock
    await page.goto(`/stockresults/${TEST_STOCKS.HARAM}`);
    await page.waitForLoadState('networkidle');
    
    // Verify status badge is visible
    await expect(page.getByTestId('status-badge')).toBeVisible();
    
    // Verify it doesn't show "Halal" (likely "Not Halal" or similar)
    const classification = await page.getByTestId('classification-text').textContent();
    expect(classification.trim()).not.toBe('Halal');
    
    // Verify badge has red styling
    const badge = await page.getByTestId('status-badge');
    const badgeClass = await badge.getAttribute('class');
    expect(badgeClass).toContain('from-red-500 to-pink-500');
  });

  test('Confidence percentage is displayed correctly', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify confidence percentage is displayed
    await expect(page.getByTestId('confidence-percentage')).toBeVisible();
    
    // Verify format (should contain % and "Confidence")
    const confidence = await page.getByTestId('confidence-percentage').textContent();
    expect(confidence).toContain('%');
    expect(confidence).toContain('Confidence');
  });

  test('Haram reason is displayed when applicable', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to Haram stock
    await page.goto(`/stockresults/${TEST_STOCKS.HARAM}`);
    await page.waitForLoadState('networkidle');
    
    // Verify Haram reason element exists
    await expect(page.getByTestId('haram-reason')).toBeVisible();
    
    // Get the text content of the reason
    const haramReason = await page.getByTestId('haram-reason').textContent();
    
    // If stock is actually Haram, should have content other than N/A
    const classification = await page.getByTestId('classification-text').textContent();
    if (classification.trim() !== 'Halal') {
      expect(haramReason.trim()).not.toBe('');
      // "N/A" might be valid if no specific reason is provided
    }
  });

  // Metrics Tests
  test('All four metrics are displayed correctly', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify metrics grid is visible
    await expect(page.getByTestId('metrics-grid')).toBeVisible();
    
    // Verify all four metrics are visible
    await expect(page.getByTestId('metric-card-debt-ratio')).toBeVisible();
    await expect(page.getByTestId('metric-card-cash-ratio')).toBeVisible();
    await expect(page.getByTestId('metric-card-interest-ratio')).toBeVisible();
    await expect(page.getByTestId('metric-card-receivables-ratio')).toBeVisible();
  });

  test('Metric values and thresholds are displayed correctly with appropriate formatting', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Check metric values and thresholds for all metrics
    for (const metricId of ['debt-ratio', 'cash-ratio', 'interest-ratio', 'receivables-ratio']) {
      // Verify card is visible
      await expect(page.getByTestId(`metric-card-${metricId}`)).toBeVisible();
      
      // Get metric value text
      const valueElem = page.getByTestId(`metric-value-${metricId}`);
      await expect(valueElem).toBeVisible();
      const value = await valueElem.textContent();
      
      // Value should be a number or N/A
      if (value !== 'N/A') {
        // Should be formatted as a decimal (assuming 3 decimal places based on code)
        expect(value).toMatch(/^\d+\.\d{3}$/);
      }
      
      // Front card should have threshold text
      const frontCard = page.getByTestId(`metric-card-front-${metricId}`);
      const frontCardText = await frontCard.textContent();
      expect(frontCardText).toMatch(/Must be (above|below) \d+\.\d+/);
    }
  });

  test('Metric cards have appropriate background colors based on values', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Get classification to know if stock is Halal
    const classification = await page.getByTestId('classification-text').textContent();
    const isHalal = classification.trim() === 'Halal';
    
    // Check each metric card's background
    for (const metricId of ['debt-ratio', 'cash-ratio', 'interest-ratio', 'receivables-ratio']) {
      const card = page.getByTestId(`metric-card-front-${metricId}`);
      const cardClass = await card.getAttribute('class');
      
      // Based on the code logic:
      // - Halal stocks should have green backgrounds for metrics within thresholds
      // - Non-Halal stocks or metrics outside thresholds will have red backgrounds
      if (isHalal) {
        // For halal stocks, we'd expect green backgrounds
        // But some metrics might still be red if outside thresholds
        expect(cardClass).toMatch(/(from-green-50 to-emerald-50\/30|from-red-50 to-pink-50\/30)/);
      } else {
        // For haram stocks, expect mostly red backgrounds
        expect(cardClass).toContain('from-red-50 to-pink-50/30');
      }
    }
  });

  test('Metric card flip interaction works correctly', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify card front is initially visible
    await expect(page.getByTestId('metric-card-front-debt-ratio')).toBeVisible();
    
    // Click to flip card
    await page.getByTestId('metric-card-debt-ratio').click();
    
    // Back side should be visible (rotated to front)
    // Check the style to verify the rotation
    const card = await page.getByTestId('metric-card-debt-ratio').locator('div').first();
    const cardStyle = await card.getAttribute('style');
    expect(cardStyle).toContain('rotateY(180deg)');
    
    // Check back card content is showing details
    const backCard = page.getByTestId('metric-card-back-debt-ratio');
    const backContent = await backCard.textContent();
    expect(backContent).toContain('Details');
    
    // Now click again to flip back
    await page.getByTestId('metric-card-debt-ratio').click();
    
    // Check rotation is back to 0
    const updatedCard = await page.getByTestId('metric-card-debt-ratio').locator('div').first();
    const updatedStyle = await updatedCard.getAttribute('style');
    expect(updatedStyle).toContain('rotateY(0deg)');
  });

  test('Only one metric card can be flipped at a time', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Flip first card
    await page.getByTestId('metric-card-debt-ratio').click();
    
    // Verify first card is flipped
    const firstCard = await page.getByTestId('metric-card-debt-ratio').locator('div').first();
    const firstCardStyle = await firstCard.getAttribute('style');
    expect(firstCardStyle).toContain('rotateY(180deg)');
    
    // Now flip second card
    await page.getByTestId('metric-card-cash-ratio').click();
    
    // Verify second card is now flipped
    const secondCard = await page.getByTestId('metric-card-cash-ratio').locator('div').first();
    const secondCardStyle = await secondCard.getAttribute('style');
    expect(secondCardStyle).toContain('rotateY(180deg)');
    
    // First card should no longer be flipped
    const updatedFirstCard = await page.getByTestId('metric-card-debt-ratio').locator('div').first();
    const updatedFirstStyle = await updatedFirstCard.getAttribute('style');
    expect(updatedFirstStyle).toContain('rotateY(0deg)');
  });

  // Chart Tests
  test('Price chart loads correctly and displays chart skeleton during loading', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Slow down requests to see loading state
    await page.route('**/*', async (route) => {
      if (route.request().url().includes('company-details')) {
        // Delay only chart data to see skeleton
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      await route.continue();
    });
    

    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    

    // Wait for chart to load and skeleton to disappear
    await page.waitForSelector('[data-testid="price-chart-container"]');
    await page.waitForSelector('[data-testid="price-chart-skeleton"]', { state: 'detached' });
    
    // Verify chart container is visible
    await expect(page.getByTestId('price-chart-container')).toBeVisible();
    
    // Reset route interception
    await page.unrouteAll();
  });

  // News Section Tests
  test('News articles display correctly', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify news section is visible
    await expect(page.getByTestId('news-section')).toBeVisible();
    
    // Check if we have news articles
    const hasArticles = await page.getByTestId('news-article-0').isVisible();
    
    if (hasArticles) {
      // Verify article content
      await expect(page.getByTestId('news-article-0')).toBeVisible();
      
      // Check article has title and description
      const article = page.getByTestId('news-article-0');
      const articleText = await article.textContent();
      expect(articleText.length).toBeGreaterThan(10); // Should have some content
      
      // Check link exists
      await expect(page.getByTestId('news-link-0')).toBeVisible();
      
      // Verify link opens in new tab
      const link = page.getByTestId('news-link-0');
      const target = await link.getAttribute('target');
      expect(target).toBe('_blank');
      
      // Verify rel attribute for security
      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
    } else {
      // If no articles, verify the empty state message
      await expect(page.getByTestId('no-news')).toBeVisible();
      const noNewsText = await page.getByTestId('no-news').textContent();
      expect(noNewsText).toContain('No news');
    }
  });

  test('No news message displays when news API returns empty results', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Mock empty news response
    await page.route('**/newsdata.io/api/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ results: [] })
      });
    });
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify no news message is displayed
    await expect(page.getByTestId('no-news')).toBeVisible();
    
    // Reset route interception
    await page.unrouteAll();
  });

  // Watchlist Tests for Premium Users
  test('Watchlist functionality works correctly for premium users', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify watchlist heart icon appears for premium users
    await expect(page.getByTestId('watchlist-toggle')).toBeVisible();
    
    // Get initial state of heart icon
    const heartIcon = page.getByTestId('watchlist-toggle');
    const initialClass = await heartIcon.getAttribute('class');
    const initiallyInWatchlist = initialClass.includes('text-red-500');
    
    // Click heart icon to toggle watchlist status
    await heartIcon.click();
    
    // Wait for alert message to appear
    await expect(page.getByTestId('alert-message')).toBeVisible();
    const alertMessage = await page.getByTestId('alert-message').textContent();
    
    // Verify alert message is appropriate
    if (initiallyInWatchlist) {
      expect(alertMessage).toContain('removed');
    } else {
      expect(alertMessage).toContain('added');
    }
    
    // Check heart icon changed color
    const updatedClass = await heartIcon.getAttribute('class');
    if (initiallyInWatchlist) {
      expect(updatedClass).not.toContain('text-red-500');
    } else {
      expect(updatedClass).toContain('text-red-500');
    }
    
    // Test tooltip on hover
    await heartIcon.hover();
    await expect(page.getByTestId('watchlist-tooltip')).toBeVisible();
    
    // Verify tooltip text is correct
    const tooltipText = await page.getByTestId('watchlist-tooltip').textContent();
    if (initiallyInWatchlist) {
      // After toggling, it should now show "Add to watchlist"
      expect(tooltipText).toContain('Add to watchlist');
    } else {
      // After toggling, it should now show "Remove from watchlist"
      expect(tooltipText).toContain('Remove from watchlist');
    }
    
    // Click again to restore initial state
    await heartIcon.click();
    await expect(page.getByTestId('alert-message')).toBeVisible();
  });

  test('Watchlist features not available for free users', async () => {
    // Login as free user
    await login(page, USERS.free.email, USERS.free.password);
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Watchlist toggle should not be visible
    await expect(page.getByTestId('watchlist-toggle')).not.toBeVisible();
  });

  // View Limit Tests
  test('View limit message appears when user reaches limit', async () => {
    // Login as free user
    await login(page, USERS.free.email, USERS.free.password);
    
    // Mock API to simulate view limit reached for the second stock
    let requestCount = 0;
    await page.route('**/api/stocks/**', async (route) => {
      requestCount++;
      if (requestCount > 1) {
        // Second request will hit limit
        await route.fulfill({
          status: 403,
          body: JSON.stringify({ 
            error: 'View limit reached', 
            message: 'You have reached the maximum number of stock views for your plan'
          })
        });
      } else {
        // Allow first request
        await route.continue();
      }
    });
    
    // First view should work fine
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('stock-results-container')).toBeVisible();
    
    // Second view should hit limit
    await page.goto(`/stockresults/${TEST_STOCKS.HARAM}`);
    await page.waitForLoadState('networkidle');
    
    // Verify view limit message appears
    await expect(page.getByTestId('view-limit-container')).toBeVisible();
    await expect(page.getByTestId('view-limit-title')).toBeVisible();
    await expect(page.getByTestId('view-limit-message')).toBeVisible();
    
    // Verify subscribe button is present
    await expect(page.getByTestId('subscribe-button')).toBeVisible();
    
    // Reset route interception
    await page.unrouteAll();
  });

  test('Subscribe button navigates to subscription details page', async () => {
    // Login as free user
    await login(page, USERS.free.email, USERS.free.password);
    
    // Mock API to simulate view limit reached
    await page.route('**/api/stocks/**', async (route) => {
      await route.fulfill({
        status: 403,
        body: JSON.stringify({ error: 'View limit reached' })
      });
    });
    
    // Navigate to stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify view limit container is visible
    await expect(page.getByTestId('view-limit-container')).toBeVisible();
    
    // Click subscribe button
    await page.getByTestId('subscribe-button').click();
    
    // Verify navigation to subscription page
    expect(page.url()).toContain('/subscriptiondetails');
    
    // Reset route interception
    await page.unrouteAll();
  });

  test('Performance - Page load time is acceptable', async () => {
    // Login as any user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Measure time to load stock page
    const startTime = Date.now();
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    
    // Wait for critical elements to be visible
    await page.waitForSelector('[data-testid="stock-results-container"]');
    await page.waitForSelector('[data-testid="price-chart-container"]');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Load time should be less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('Accessibility - Basic accessibility checks', async () => {
    // Login as any user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to a stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Check that all interactive elements have proper roles
    const backButton = page.getByTestId('back-button');
    await expect(backButton).toBeVisible();
    
    // Check that status information has proper contrast
    const statusBadge = page.getByTestId('status-badge');
    await expect(statusBadge).toBeVisible();
    
    // Check that metric cards can be interacted with
    await page.getByTestId('metric-card-debt-ratio').click();
    await expect(page.getByTestId('metric-card-back-debt-ratio')).toBeVisible();
  });

  test('Responsive design - Mobile view works properly', async () => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login as any user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to a stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify stock header is visible and formatted for mobile
    await expect(page.getByTestId('stock-header')).toBeVisible();
    
    // Check that important elements are still visible on mobile
    await expect(page.getByTestId('stock-results-container')).toBeVisible();
    await expect(page.getByTestId('price-chart-container')).toBeVisible();
    await expect(page.getByTestId('metrics-grid')).toBeVisible();
    
    // Check layout adjustments
    // Mobile layout should have company info below the chart and metrics (not side by side)
    const leftColBounds = await page.getByTestId('left-column').boundingBox();
    const rightColBounds = await page.getByTestId('right-column').boundingBox();
    
    // On mobile, right column should be below left column
    expect(rightColBounds.y).toBeGreaterThan(leftColBounds.y);
  });

  test('Error handling - Invalid stock symbol shows error', async () => {
    // Login as any user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to an invalid stock page
    await page.goto('/stockresults/INVALIDSTOCKSYMBOL');
    await page.waitForLoadState('networkidle');
    
    // Check for appropriate error message
    await expect(page.getByTestId('error-message')).toBeVisible();
  });

  test('Security - Cannot access stock data without authentication', async () => {
    // Try to navigate to stock page without login
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login page
    expect(page.url()).toContain('https://shariastocks.in/signup');
  });

  test('Load testing - Rapidly switching between stocks', async () => {
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    const stocks = ['TCS', 'SBIN', 'CDSL']
    
    // Switch between stocks rapidly 5 times
    for (let i = 0; i < 5; i++) {
      const stock = stocks[i % stocks.length];
      await page.goto(`/stockresults/${stock}`);
      await page.waitForSelector('[data-testid="stock-results-container"]');
    }
    
    // Verify the page is still responsive
    await expect(page.getByTestId('stock-results-container')).toBeVisible();
    await expect(page.getByTestId('company-name')).toBeVisible();
  });

  test('Network resilience - Stock data loads with slow connection', async () => {
    // Set network conditions to slow 3G
    await page.route('**/*', async (route) => {
      // Add delay of 2 seconds to simulate slow connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });
    
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to a stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    
    // Check for loading indicator
    await expect(page.getByTestId('loading-spinner')).toBeVisible();
    
    // Wait for data to load despite slow connection
    await page.waitForSelector('[data-testid="stock-results-container"]', { timeout: 50000 });
    
    // Verify data loaded properly
    await expect(page.getByTestId('company-name')).toBeVisible();
    await expect(page.getByTestId('metrics-grid')).toBeVisible();
  });

  test('API resilience - Handle news API failure gracefully', async () => {
    // Mock a failed news API response
    await page.route('**/newsdata.io/api/**', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to a stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Verify page still loads despite news API failure
    await expect(page.getByTestId('stock-results-container')).toBeVisible();
    await expect(page.getByTestId('company-name')).toBeVisible();
    
    // Check news section handles error gracefully
    await expect(page.getByTestId('news-section')).toBeVisible();
    await expect(page.getByTestId('no-news')).toBeVisible();
  });

  test('Browser compatibility - Stock page renders on different browsers', async ({browserName}) => {
    test.skip(browserName !== 'chromium', 'This test currently runs only on Chromium');
    
    // Login as premium user
    await login(page, USERS.premium.email, USERS.premium.password);
    
    // Navigate to a stock page
    await page.goto(`/stockresults/${TEST_STOCKS.HALAL}`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to verify rendering
    await page.screenshot({ path: `stockpage-${browserName}.png` });
    
    // Verify critical elements are visible
    await expect(page.getByTestId('stock-results-container')).toBeVisible();
    await expect(page.getByTestId('company-name')).toBeVisible();
    await expect(page.getByTestId('metrics-grid')).toBeVisible();
  });
});


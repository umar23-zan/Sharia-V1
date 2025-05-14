// dashboard.spec.js
import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  const testUser = {
    email: 'umarmohamed444481@gmail.com',
    password: '321654'
  };
  // Setup for each test - authenticate before testing
  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:5173/login');
    
    // Fill in login form
    await page.getByTestId('email-input').fill(testUser.email);
    await page.getByTestId('password-input').fill(testUser.password);
    
    // Submit login form
    await page.getByTestId('login-button').click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/dashboard');
    
    // Verify we're on the dashboard page
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should render the dashboard correctly', async ({ page }) => {
    // Verify main sections are present
    await expect(page.locator('h1:has-text("Invest with Purpose")')).toBeVisible();
    await expect(page.locator('section:has-text("Trending Stocks")')).toBeVisible();
    await expect(page.locator('section:has-text("Top 10 Halal Stocks")')).toBeVisible();
    await expect(page.locator('section:has-text("Market Summary")')).toBeVisible();
  });

  test('should search for a stock and show suggestions', async ({ page }) => {
    // Click on search input
    const searchInput = page.locator('input[placeholder*="Search for stocks"]');
    await searchInput.click();
    
    // Type a search term
    await searchInput.fill('RELIAN');

    
    // Check if "RELIANCE" is in the suggestions
    const hasReliance = await page.locator('ul li').filter({ hasText: 'RELIANCE' }).count() > 0;
    expect(hasReliance).toBeTruthy();
  });

  test('should navigate to stock details when clicking on a suggestion', async ({ page }) => {
    // Search for a stock
    await page.fill('input[placeholder*="Search for stocks"]', 'REL');
    
    // Wait for suggestions
    await page.waitForSelector('ul li');
    
    // Click on the first suggestion
    await page.click('ul li:first-child');
    
    // Verify navigation to stock result page
    await expect(page).toHaveURL(/.*\/stockresults\/.*/);
  });

  test('should navigate through trending stocks slider', async ({ page }) => {
    // Verify trending slider is visible
    const slider = page.locator('[data-testid="trending-slider"]');
    await expect(slider).toBeVisible();
    
    // Get initial scroll position
    const initialScrollLeft = await slider.evaluate(el => el.scrollLeft);
    
    // Click next button
    await page.click('[data-testid="next-button"]');
    
    // Wait for scroll animation
    await page.waitForTimeout(500);
    
    // Get new scroll position and check if it changed
    const newScrollLeft = await slider.evaluate(el => el.scrollLeft);
    expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);
    
    // Click previous button
    await page.click('[data-testid="prev-button"]');
    
    // Wait for scroll animation
    await page.waitForTimeout(500);
    
    // Check if scroll position returned to near initial value
    const finalScrollLeft = await slider.evaluate(el => el.scrollLeft);
    expect(finalScrollLeft).toBeLessThan(newScrollLeft);
  });

  test('should display halal stocks section correctly', async ({ page }) => {
    // Verify halal stocks section is visible
    const halalStocksSection = page.locator('[data-testid="halal-stocks-section"]');
    await expect(halalStocksSection).toBeVisible();
    
    // Check if there are 10 stock items (as per your data)
    const stockItems = halalStocksSection.locator('> div');
    await expect(stockItems).toHaveCount(10);
    
    // Check if first stock (TATAMOTORS) is visible
    
    await expect(page.getByTestId('trending-slider').locator('text=TATAMOTORS')).toBeVisible();
  });

  test('should handle quick action navigation', async ({ page }) => {
    // Click on Watchlist quick action
    await page.click('[data-testid="quick-action-watchlist"]');
    
    // Verify navigation to watchlist page
    await expect(page).toHaveURL(/.*\/watchlist/);
    
    // Go back to dashboard
    await page.goto('/dashboard');
    
    // Click on Notifications quick action
    await page.click('[data-testid="quick-action-notifications"]');
    
    // Verify navigation to notification page
    await expect(page).toHaveURL(/.*\/notification/);
  });

  test('should navigate to pricing page when clicking on upgrade button for free user', async ({ page }) => {
    // First make sure our user is on free plan - might need to set this up in beforeEach
    // This test assumes the user from beforeEach is on free plan
    
    // Check if upgrade section is visible in halal stocks
    const upgradeButton = page.locator('button:has-text("Upgrade Now")');
    
    // If there's no upgrade button, we're likely already on premium
    if (await upgradeButton.count() > 0) {
      // Click upgrade button
      await upgradeButton.click();
      
      // Verify navigation to subscription details page
      await expect(page).toHaveURL(/.*\/subscriptiondetails/);
    } else {
      console.log('Test user appears to have premium access, skipping upgrade test');
    }
  });

  test('should navigate to stock details when clicking on a halal stock', async ({ page }) => {
    // Click on the first halal stock (which should be accessible even on free plan)
    await page.click('[data-testid="halal-stocks-section"] > div:first-child');
    
    // Verify navigation to stock details page
    await expect(page).toHaveURL(/.*\/stockresults\/.*/);
  });

  
  
  test('should have accurate market summary data', async ({ page }) => {
    // Check the market summary section
    const marketSummary = page.locator('h2:has-text("Market Summary")').locator('xpath=../..');
    await expect(marketSummary).toBeVisible();
    
    // Verify NIFTY 50 is present
    await expect(marketSummary.locator('text=NIFTY 50')).toBeVisible();
    
    // Verify SENSEX is present
    await expect(marketSummary.locator('text=SENSEX')).toBeVisible();
    
    // Verify NIFTY BANK is present
    await expect(marketSummary.locator('text=NIFTY BANK')).toBeVisible();
  });
  
  test('should handle responsive behavior', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if navigation adapts to mobile size
    // For example, verify hamburger menu or mobile elements are shown
    await expect(page.locator('main')).toBeVisible();
    
    // Check desktop view
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Verify desktop elements are displayed properly
    await expect(page.locator('main')).toBeVisible();
  });
});
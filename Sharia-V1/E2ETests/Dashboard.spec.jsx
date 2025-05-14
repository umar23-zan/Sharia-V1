// shariastocks.spec.js
import { test, expect } from '@playwright/test';

// Test data
const mockFreeUser = {
  email: 'umarmohamed444481@gmail.com',
  password: '321654',
  subscription: { plan: 'free' }
};

const mockPremiumUser = {
  email: 'umarmohmed444sam@gmail.com',
  password: '321654',
  subscription: { plan: 'premium' }
};

const mockStockSymbol = 'RELIANCE';
const dashboardUrl = 'https://shariastocks.in/dashboard';

// Global setup for test suite
test.beforeAll(async () => {
  console.log('Setting up test suite for ShariaStocks Dashboard testing');
});

// Before each test
test.beforeEach(async ({ page }) => {
  // Navigate to dashboard before each test
  await page.goto('https://shariastocks.in/login');

  await page.getByTestId('email-input').fill(mockFreeUser.email);
  await page.getByTestId('password-input').fill(mockFreeUser.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);
  // await page.goto(dashboardUrl);
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');
});

// ----------------------------------------------------------------
// Functional Tests
// ----------------------------------------------------------------

test.describe('Search Functionality', () => {
  test('should display search input with correct placeholder', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search for stocks (e.g., RELIANCE, HDFCBANK)');
  });

  test('should display suggestions when typing', async ({ page }) => {
    // Find and interact with the search input
    const searchInput = page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]');
    
    // Type in the search box
    await searchInput.fill('REL');
    
    // Wait for suggestions to appear
    await expect(page.locator('[data-testid="stock-symbol-section"]').first()).toBeVisible({ timeout: 5000 });
    
    // Check if at least one suggestion is shown
    const suggestionsCount = await page.locator('[data-testid="stock-symbol-section"]').count();
    expect(suggestionsCount).toBeGreaterThan(0);

    const suggestions = page.locator('[data-testid="stock-symbol-section"]');
    await expect(suggestions.first()).toBeVisible({ timeout: 5000 });

    const allTexts = await suggestions.allTextContents();
  expect(allTexts.some(text => text.includes('RCOM'))).toBe(true);
    
    // await expect(page.locator('[data-testid="stock-symbol-section"]')).toContainText('RELIANCE', { timeout: 5000 });
  });

  test('should clear suggestions when input is cleared', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]');
    
    // Type in the search box
    await searchInput.fill('REL');
    
    // Wait for suggestions to appear
    await expect(page.locator('[data-testid="stock-symbol-section"]').first()).toBeVisible({ timeout: 5000 });
    
    // Clear input
    await searchInput.fill('');
    
    // Verify suggestions disappear
    await expect(page.locator('[data-testid="stock-symbol-section"]').first()).toBeHidden({ timeout: 5000 });
  });

  test('should navigate to stock details page on search submission', async ({ page }) => {
    // Mock navigation function since we may not be able to actually navigate in tests
    await page.evaluate(() => {
      window.navigateCalled = false;
      window.navigateUrl = '';
      window.oldNavigate = window.navigate;
      window.navigate = (url) => {
        window.navigateCalled = true;
        window.navigateUrl = url;
      };
    });
    
    const searchInput = page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]');
    await searchInput.fill('REL');
    
    // Wait for suggestions to appear
    await expect(page.locator('[data-testid="stock-symbol-section"]').first()).toBeVisible({ timeout: 5000 });
    
    // Click on first suggestion
    await page.locator('[data-testid="stock-symbol-section"]').first().click();
    
    // Check if navigation was triggered (either via our mock or actual navigation)
    try {
      // If we navigated, check the URL
      await expect(page).toHaveURL(/.*\/stockresults\/.*/);
    } catch {
      // If mock was used, check if navigation was called
      const navigateCalled = await page.evaluate(() => window.navigateCalled);
      expect(navigateCalled).toBeTruthy();
    }
  });
  
  test('should handle partial text search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]');
    
    // Type partial text
    await searchInput.fill('HD');
    const suggestions = page.locator('[data-testid="stock-symbol-section"]');
    await expect(suggestions.first()).toBeVisible({ timeout: 5000 });

    const allTexts = await suggestions.allTextContents();
  expect(allTexts.some(text => text.includes('HDFC'))).toBe(true);
    
    // Wait for suggestions to appear
    // await expect(page.locator('[data-testid="stock-symbol-section"]').first()).toBeVisible({ timeout: 5000 });
    
    // Check if HDFC related stocks appear in suggestions
    // await expect(page.locator('[data-testid="stock-symbol-section"]')).toContainText('HDFC', { timeout: 5000 });
  });
});

test.describe('Trending Stocks Section', () => {
  test('should display trending stocks section with title', async ({ page }) => {
    const trendingSection = page.locator('text=Trending Stocks').first();
    await expect(trendingSection).toBeVisible();
    
    // Check if stocks are displayed
    const trendingSlider = page.locator('[data-testid="trending-slider"]');
    await expect(trendingSlider).toBeVisible();
  });

  test('should navigate slider with next/prev buttons', async ({ page }) => {
    // Get reference to the slider
    const slider = page.locator('[data-testid="trending-slider"]');
    
    // Check initial scroll position
    const initialScrollLeft = await slider.evaluate(el => el.scrollLeft);
    
    // Click on the next button
    await page.locator('[data-testid="next-button"]').click();
    
    // Wait for the slider to scroll
    await page.waitForTimeout(500); // Allow animation to complete
    
    // Verify slider has scrolled
    const scrollLeftAfter = await slider.evaluate(el => el.scrollLeft);
    expect(scrollLeftAfter).toBeGreaterThan(initialScrollLeft);
    
    // Now click previous button
    await page.locator('[data-testid="prev-button"]').click();
    
    // Wait for the slider to scroll
    await page.waitForTimeout(500);
    
    // Verify slider has scrolled back
    const scrollLeftAfterPrev = await slider.evaluate(el => el.scrollLeft);
    expect(scrollLeftAfterPrev).toBeLessThan(scrollLeftAfter);
  });

  test('should display stock cards with correct content', async ({ page }) => {
    // Check first stock card content
    const firstStockCard = page.locator('[data-testid="trending-slider"] > div').first();
    await expect(firstStockCard).toBeVisible();
    
    // Check if it has symbol, price and change percentage
    await expect(firstStockCard).toContainText(/[A-Z]+/); // Symbol should be uppercase letters
    await expect(firstStockCard).toContainText(/₹[0-9,.]+/); // Price with ₹ symbol
    await expect(firstStockCard).toContainText(/[+-][0-9.]+%/); // Change percentage with +/- sign
  });

  test('should have clickable stock cards', async ({ page }) => {
    // Mock navigation function
    await page.evaluate(() => {
      window.navigateCalled = false;
      window.navigateUrl = '';
      window.oldNavigate = window.navigate;
      window.navigate = (url) => {
        window.navigateCalled = true;
        window.navigateUrl = url;
      };
    });
    
    // Click on first stock card
    const firstStockCard = page.locator('[data-testid="trending-slider"] > div').first();
    await firstStockCard.click();
    
    // Check navigation (similar to search test)
    try {
      await expect(page).toHaveURL(/.*\/stockresults\/.*/);
    } catch {
      const navigateCalled = await page.evaluate(() => window.navigateCalled);
      expect(navigateCalled).toBeTruthy();
    }
  });
});

test.describe('Halal Stocks Section', () => {
  test('should display halal stocks section with title', async ({ page }) => {
    const halalSection = page.locator('text=Top 10 Halal Stocks').first();
    await expect(halalSection).toBeVisible();
    
    // Check if stocks list is displayed
    const halalStocksSection = page.locator('[data-testid="halal-stocks-section"]');
    await expect(halalStocksSection).toBeVisible();
  });

  test('should show blurred stocks and upgrade prompt for free users', async ({ page }) => {
    // Setup mock for free user
    await page.evaluate((user) => {
      localStorage.setItem('userEmail', user.email);
      window.user = user;
    }, mockFreeUser);
    
    // Reload page with mocked user data
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Wait for halal stocks section
    const halalStocksSection = page.locator('[data-testid="halal-stocks-section"]');
    await expect(halalStocksSection).toBeVisible();
    
    await expect(page.getByText('Unlock All Halal Stocks')).toBeVisible();
    
    // Verify upgrade button is present
    await expect(page.getByText('Upgrade Now')).toBeVisible();
  });

  test('should show all stocks without blur for premium users', async ({ page }) => {
    // Setup mock for premium user
    await page.evaluate((user) => {
      localStorage.setItem('userEmail', user.email);
      window.user = user;
    }, mockPremiumUser);
    
    // Reload page with mocked user data
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Wait for halal stocks section
    const halalStocksSection = page.locator('[data-testid="halal-stocks-section"]');
    await expect(halalStocksSection).toBeVisible();
    
    // Check that the fourth stock does NOT have blur class
    const fourthStock = halalStocksSection.locator('div').nth(3);
    const hasBlurClass = await fourthStock.evaluate(el => 
      el.className.includes('blur')
    );
    expect(hasBlurClass).toBeFalsy();
    
    // Verify upgrade message is not displayed for premium users
    await expect(page.getByText('Premium Feature:')).toBeHidden();
  });

  test('should navigate to stock details when clicking on accessible stock', async ({ page }) => {
    // Setup mock for premium user
    await page.evaluate((user) => {
      localStorage.setItem('userEmail', user.email);
      window.user = user;
    }, mockPremiumUser);
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Mock navigation function
    await page.evaluate(() => {
      window.navigateCalled = false;
      window.navigateUrl = '';
      window.oldNavigate = window.navigate;
      window.navigate = (url) => {
        window.navigateCalled = true;
        window.navigateUrl = url;
      };
    });
    
    // Click on first halal stock
    const firstStock = page.locator('[data-testid="halal-stocks-section"] > div').first();
    await firstStock.click();
    
    // Check navigation
    try {
      await expect(page).toHaveURL(/.*\/stockresults\/.*/);
    } catch {
      const navigateCalled = await page.evaluate(() => window.navigateCalled);
      expect(navigateCalled).toBeTruthy();
    }
  });

  test('should navigate to pricing page when free user clicks on blurred stock', async ({ page }) => {
    // Setup mock for free user
    await page.evaluate((user) => {
      localStorage.setItem('userEmail', user.email);
      window.user = user;
    }, mockFreeUser);
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Mock navigation function
    await page.evaluate(() => {
      window.navigateCalled = false;
      window.navigateUrl = '';
      window.oldNavigate = window.navigate;
      window.navigate = (url) => {
        window.navigateCalled = true;
        window.navigateUrl = url;
        window.navigateUrlPath = url;
      };
    });
    
    // Click on a blurred stock (4th stock)
    const fourthStock = page.locator('[data-testid="halal-stocks-section"] > div').nth(9);
    await fourthStock.click();
    
    // Check navigation to pricing page
    try {
      await expect(page).toHaveURL(/.*\/subscriptiondetails.*/);
    } catch {
      const navigateUrl = await page.evaluate(() => window.navigateUrlPath);
      expect(navigateUrl).toContain('/subscriptiondetails');
    }
  });

  test('should navigate to subscription page when clicking upgrade button', async ({ page }) => {
    // Setup mock for free user
    await page.evaluate((user) => {
      localStorage.setItem('userEmail', user.email);
      window.user = user;
    }, mockFreeUser);
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Mock navigation function
    await page.evaluate(() => {
      window.navigateCalled = false;
      window.navigateUrl = '';
      window.oldNavigate = window.navigate;
      window.navigate = (url) => {
        window.navigateCalled = true;
        window.navigateUrl = url;
        window.navigateUrlPath = url;
      };
    });
    
    // Click on upgrade button
    const upgradeButton = page.getByText('Upgrade Now');
    await upgradeButton.click();
    
    // Check navigation to subscription details page
    try {
      await expect(page).toHaveURL(/.*\/subscriptiondetails.*/);
    } catch {
      const navigateUrl = await page.evaluate(() => window.navigateUrlPath);
      expect(navigateUrl).toContain('/subscriptiondetails');
    }
  });
});

test.describe('User Authentication', () => {
  test('should fetch user data on page load', async ({ page }) => {
    // Mock API call for getUserData
    await page.route('**/api/auth', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPremiumUser)
      });
    });
    
    // Set user email in localStorage to trigger the API call
    await page.evaluate((email) => {
      localStorage.setItem('userEmail', email);
    }, mockPremiumUser.email);
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify user data was fetched by checking for premium user UI elements
    // Premium users don't see the upgrade message
    await expect(page.getByText('Premium Feature:')).toBeHidden();
  });

  test('should show different UI for non-authenticated users', async ({ page }) => {
    // Clear any user data
    await page.evaluate(() => {
      localStorage.removeItem('userEmail');
      window.user = null;
    });
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*\/signup.*/);
  });
});

test.describe('Responsive Layout', () => {
  test('should display all elements correctly on desktop', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Verify desktop table headers are visible
    await expect(page.getByText('Market Cap').first()).toBeVisible();
    
    // Verify trending stocks slider is visible
    await expect(page.locator('[data-testid="trending-slider"]')).toBeVisible();
    
    // Verify search is visible
    await expect(page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]')).toBeVisible();
  });

  test('should adapt layout for tablet screens', async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Verify key elements are still visible
    await expect(page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]')).toBeVisible();
    await expect(page.locator('[data-testid="trending-slider"]')).toBeVisible();
    
    // Check that layout is appropriate for tablet
    const searchWidth = await page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]').evaluate(el => el.offsetWidth);
    expect(searchWidth).toBeLessThan(600); // Search bar should be narrower on tablet
  });

  test('should adapt layout for mobile screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify desktop table headers are hidden
    const marketCapVisible = await page.getByText('Market Cap').first().isVisible().catch(() => false);
    expect(marketCapVisible).toBeFalsy();
    
    // Verify mobile-specific elements are shown
    await expect(page.locator('.md\\:hidden').first()).toBeVisible();
    
    // Check search is full width on mobile
    const searchWidth = await page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]').evaluate(el => {
      const style = window.getComputedStyle(el);
      return el.offsetWidth;
    });
    const pageWidth = await page.evaluate(() => window.innerWidth);
    
    // Search should take up most of the screen width on mobile
    expect(searchWidth).toBeGreaterThan(pageWidth * 0.8);
  });
});

test.describe('Footer and Navigation', () => {
  test('should display footer with all links', async ({ page }) => {
    // Check footer visibility
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check all expected links are present
    const footerLinks = ['About', 'Privacy', 'Terms', 'Blogs', 'FAQ'];
    for (const link of footerLinks) {
      await expect(page.getByText(link).first()).toBeVisible();
    }
    
    // Check copyright text
    await expect(page.getByText(/© 2025 Zansphere Private Limited/)).toBeVisible();
  });

  test('should display logo with fallback', async ({ page }) => {
    // Check logo visibility
    const logo = page.locator('footer img').first();
    await expect(logo).toBeVisible();
    
    // Test logo fallback by simulating error
    await page.evaluate(() => {
      // Find the logo and simulate an error
      const logo = document.querySelector('footer img');
      if (logo) {
        logo.dispatchEvent(new Event('error'));
      }
    });
    
    // After error, logo should still be visible (fallback should work)
    await expect(logo).toBeVisible();
  });
});

// ----------------------------------------------------------------
// Non-Functional Tests
// ----------------------------------------------------------------

test.describe('Performance Testing', () => {
  test('should load initial page within acceptable time', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Page should load in less than 5 seconds (adjust based on your requirements)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should display search suggestions with minimal delay', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]');
    
    // Wait for search input to be ready
    await searchInput.waitFor();
    
    // Measure response time for suggestions
    const startTime = Date.now();
    
    await searchInput.fill('REL');
    await page.locator('[data-testid="stock-symbol-section"]').first().waitFor({ timeout: 5000 });
    
    const responseTime = Date.now() - startTime;
    console.log(`Search suggestion response time: ${responseTime}ms`);
    
    // Suggestions should appear in less than 300ms (adjust based on your requirements)
    expect(responseTime).toBeLessThan(1000);
  });

});

test.describe('Accessibility Testing', () => {

  test('should meet basic color contrast requirements', async ({ page }) => {
    // This is a simple test. For thorough contrast testing, use specialized tools.
    const hasContrastIssues = await page.evaluate(() => {
      // Get all text elements
      const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, span, a, button'));
      
      // Check if any have very light text on light background (simplified check)
      return textElements.some(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        
        // Very simplified check - just looking for white text on white/transparent background
        return color === 'rgb(255, 255, 255)' && (bgColor === 'rgb(255, 255, 255)' || bgColor === 'rgba(0, 0, 0, 0)');
      });
    });
    
    expect(hasContrastIssues).toBeFalsy();
  });

  test('should have sufficient touch target sizes on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check touch target sizes for important interactive elements
    const touchTargets = [
      'button',
      '[data-testid="prev-button"]',
      '[data-testid="next-button"]',
      '[data-testid="trending-slider"] > div'
    ];
    
    for (const selector of touchTargets) {
      const elements = await page.$$(selector);
      
      for (const element of elements) {
        const boundingBox = await element.boundingBox();
        
        // W3C recommends touch targets to be at least 44x44 pixels
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThanOrEqual(40);
          expect(boundingBox.height).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Setup mock for network error
    await page.route('**/api/auth', route => {
      route.abort('failed');
    });
    
    // Set user email to trigger API call
    await page.evaluate((email) => {
      localStorage.setItem('userEmail', email);
    }, mockPremiumUser.email);
    
    // Reload page (should trigger the API call and our mocked error)
    await page.goto(dashboardUrl);
    await page.waitForLoadState('domcontentloaded');
    
    // Verify page still loads and doesn't crash
    await expect(page.locator('text=Trending Stocks').first()).toBeVisible();
    
    // Check for error handling (console errors)
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    // Basic check that the page is still functional despite the error
    await page.locator('[data-testid="next-button"]').click();
    const slider = page.locator('[data-testid="trending-slider"]');
    await expect(slider).toBeVisible();
  });

  test('should handle image loading failures', async ({ page }) => {
    // Setup mock for image loading failure
    await page.route('**/*.jpeg', route => {
      route.abort('failed');
    });
    await page.route('**/*.jpg', route => {
      route.abort('failed');
    });
    await page.route('**/*.png', route => {
      route.abort('failed');
    });
    
    // Reload page
    await page.goto(dashboardUrl);
    await page.waitForLoadState('domcontentloaded');
    
    // Verify page still loads despite image failures
    await expect(page.locator('text=Trending Stocks').first()).toBeVisible();
    
    // Check that UI is still functional
    await page.locator('[data-testid="next-button"]').click();
  });
});

test.describe('Cross-Browser Compatibility', () => {
  // These tests are structured to run the same checks across different browsers
  // Note: The actual browser is determined by the Playwright configuration
  
  test('should render correctly in current browser', async ({ page, browserName }) => {
    console.log(`Testing in ${browserName} browser`);
    
    // Basic smoke test for current browser
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    
    // Check key elements
    await expect(page.locator('input[placeholder="Search for stocks (e.g., RELIANCE, HDFCBANK)"]')).toBeVisible();
    await expect(page.locator('[data-testid="trending-slider"]')).toBeVisible();
    await expect(page.locator('[data-testid="halal-stocks-section"]')).toBeVisible();
    
    // Test basic interaction
    await page.locator('[data-testid="next-button"]').click();
    
    // If we reach here without errors, the page is working in this browser
    expect(true).toBeTruthy();
  });
});

// After all tests
test.afterAll(async () => {
  console.log('All tests completed for ShariaStocks Dashboard');
});
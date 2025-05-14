import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

// Mock API response for forgotPassword
const mockForgotPasswordSuccess = {
  status: 200,
  body: { msg: 'Password reset link sent to your email' }
};

const mockForgotPasswordError = {
  status: 400,
  body: { msg: 'Email not found in our database' }
};

test.describe('Forgot Password Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks before navigating
    await page.route('**/api/auth/forgot-password', async (route) => {
      const requestBody = JSON.parse(await route.request().postData());
      
      if (requestBody.email === 'valid@example.com') {
        await route.fulfill(mockForgotPasswordSuccess);
      } else if (requestBody.email === 'invalid@example.com') {
        await route.fulfill(mockForgotPasswordError);
      } else {
        await route.continue();
      }
    });

    // Navigate to the forgot password page
    await page.goto('/forgot-password');
  });

  // Functional Tests
  test('should render forgot password page correctly', async ({ page }) => {
    // Check if the page is loaded
    await expect(page.getByTestId('forgot-password-page')).toBeVisible();
    
    // Verify logo is displayed
    await expect(page.getByTestId('logo')).toBeVisible();
    
    // Verify form elements are present
    await expect(page.getByTestId('forgot-password-form')).toBeVisible();
    await expect(page.getByTestId('email-label')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();
    
    // Verify navigation elements
    await expect(page.getByTestId('back-button')).toBeVisible();
    await expect(page.getByTestId('login-link')).toBeVisible();
  });

  test('should validate email field', async ({ page }) => {
    const submitButton = page.getByTestId('submit-button');
    const emailInput = page.getByTestId('email-input');
    
    // Try submitting without email
    await emailInput.fill('');
    await submitButton.click();
    
    // Check if HTML5 validation prevents submission (email field is required)
    await expect(page.getByTestId('email-input')).toHaveAttribute('required', '');
    
    // Try invalid email format
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // HTML5 should validate email format
    await expect(page.url()).toContain('/forgot-password');
  });

  test('should display success message on valid email submission', async ({ page }) => {
    const emailInput = page.getByTestId('email-input');
    const submitButton = page.getByTestId('submit-button');
    
    // Fill valid email and submit
    await emailInput.fill('umarmohamed444481@gmail.com');
    await submitButton.click();
    
    // Wait for API response and success message
    await expect(page.getByTestId('alert-message')).toBeVisible();
    await expect(page.getByTestId('alert-message')).toContainText('Password reset email sent');
    
    // Check if form is reset
    await expect(emailInput).toHaveValue('');
  });

  test('should display error message on invalid email submission', async ({ page }) => {
    const emailInput = page.getByTestId('email-input');
    const submitButton = page.getByTestId('submit-button');
    
    // Fill invalid email and submit
    await emailInput.fill('invalidexample.com');
    await submitButton.click();
    
    // Wait for API response and error message
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Email not found');
  });

  test('should navigate back when back button is clicked', async ({ page }) => {
    // Mock the navigation history
    await page.evaluate(() => {
      window.history.pushState({}, '', '/some-previous-page');
    });
    
    // Click the back button
    await page.getByTestId('back-button').click();
    
    // Check if navigation occurred
    await expect(page.url()).toContain('https://shariastocks.in/');
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // Click the login link
    await page.getByTestId('login-link').click();
    
    // Check if navigated to login page
    await expect(page.url()).toContain('/login');
  });

  test('should disable form during submission', async ({ page }) => {
    const emailInput = page.getByTestId('email-input');
    const submitButton = page.getByTestId('submit-button');
    
    // Fill valid email
    await emailInput.fill('umarmohamed444481@gmail.com');
    
    // Create a promise that resolves after a delay to simulate slow network
    const slowResponse = new Promise(resolve => setTimeout(resolve, 1000));
    
    // Override the route with a slow response
    await page.route('**/api/auth/forgot-password', async (route) => {
      await slowResponse;
      await route.fulfill(mockForgotPasswordSuccess);
    });
    
    // Submit the form
    await submitButton.click();
    
    // Check if input and button are disabled during submission
    await expect(emailInput).toBeDisabled();
    await expect(submitButton).toBeDisabled();
    
    // Check if button text changes to indicate loading
    await expect(submitButton).toContainText('Sending link');
    
  });

  // Non-functional Tests
  
  // Accessibility Tests
  test('should pass accessibility tests', async ({ page }) => {
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Ensure there are no critical accessibility violations
    expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
  });

  // Responsive Design Tests
  test('should be responsive on different screen sizes', async ({ browser }) => {
    // Test on mobile viewport
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 } // iPhone SE size
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('/forgot-password');
    
    // Take a screenshot for visual comparison
    await mobilePage.screenshot({ path: 'forgot-password-mobile.png' });
    
    // Test on tablet viewport
    const tabletContext = await browser.newContext({
      viewport: { width: 768, height: 1024 } // iPad size
    });
    const tabletPage = await tabletContext.newPage();
    await tabletPage.goto('/forgot-password');
    
    // Take a screenshot for visual comparison
    await tabletPage.screenshot({ path: 'forgot-password-tablet.png' });
    
    // Test on desktop viewport
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 } // Desktop size
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto('/forgot-password');
    
    // Take a screenshot for visual comparison
    await desktopPage.screenshot({ path: 'forgot-password-desktop.png' });
    
    // Check if key elements are visible on all screen sizes
    for (const currentPage of [mobilePage, tabletPage, desktopPage]) {
      await expect(currentPage.getByTestId('forgot-password-form')).toBeVisible();
      await expect(currentPage.getByTestId('logo')).toBeVisible();
      await expect(currentPage.getByTestId('submit-button')).toBeVisible();
    }
    
    // Clean up contexts
    await mobileContext.close();
    await tabletContext.close();
    await desktopContext.close();
  });

  // Performance Tests
  test('should load page within acceptable time', async ({ browser }) => {
    // Create a fresh context for accurate timing
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/forgot-password');
    const loadTime = Date.now() - startTime;
    
    // Page should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Clean up
    await context.close();
  });

  // Visual Regression Test
  test('should match visual snapshot', async ({ page }) => {
    // Take screenshot of the page
    const screenshot = await page.screenshot();
    
    // Compare with baseline (first run will create the baseline)
    expect(screenshot).toMatchSnapshot('forgot-password.png');
  });

  // Network Resilience Test
  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/auth/forgot-password', route => route.abort('failed'));
    
    const emailInput = page.getByTestId('email-input');
    const submitButton = page.getByTestId('submit-button');
    
    // Fill email and submit
    await emailInput.fill('test@example.com');
    await submitButton.click();
    
    // Should show error message
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Error sending reset password link');
  });



  // SEO Test
  test('should have proper SEO elements', async ({ page }) => {
    // Check page title
    const title = await page.title();
    expect(title).toContain('ShariaStocks');
    
    // Check meta description
    const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => '');
    expect(metaDescription).not.toBe('');
  });

  // Internationalization Test
  test('should support RTL languages', async ({ browser }) => {
    // Create a context with RTL language
    const rtlContext = await browser.newContext({
      locale: 'ar-SA', // Arabic
    });
    
    const rtlPage = await rtlContext.newPage();
    
    // Set HTML dir attribute to RTL in page evaluation
    await rtlPage.goto('/forgot-password');
    await rtlPage.evaluate(() => {
      document.documentElement.dir = 'rtl';
    });
    
    // Take screenshot for visual verification of RTL layout
    await rtlPage.screenshot({ path: 'forgot-password-rtl.png' });
    
    // Clean up
    await rtlContext.close();
  });

  // Browser Compatibility Test
  test('should work across different browsers', async () => {
    // This test is informational and assumes you're running tests across multiple browsers
    // via your Playwright configuration
    
    // Log the browser being used for documentation purposes
    console.log(`Running on ${test.info().project.name}`);
    
    // If you have a common test suite that runs across browsers, this information
    // will help identify browser-specific issues
  });
});

// Specific tests for error handling
test.describe('Error Handling Tests', () => {
  test('should handle server errors gracefully', async ({ page }) => {
    // Mock a server error response
    await page.route('**/api/auth/forgot-password', route => 
      route.fulfill({ 
        status: 500, 
        body: JSON.stringify({ msg: 'Internal server error' }) 
      })
    );
    
    await page.goto('/forgot-password');
    
    // Fill and submit the form
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('submit-button').click();
    
    // Check for error message
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Internal server error');
  });
});

// Load Testing (simulated)
test.describe('Load Testing', () => {
  test('should handle rapid form submissions', async ({ page }) => {
    await page.goto('/forgot-password');
    
    // Submit form multiple times in quick succession
    for (let i = 0; i < 5; i++) {
      await page.getByTestId('email-input').fill(`test${i}@example.com`);
      await page.getByTestId('submit-button').click();
      
      // Wait for response before next submission
      await page.waitForResponse(response => 
        response.url().includes('/api/auth/forgot-password')
      );
    }
    
    // Check that the page is still functional
    await expect(page.getByTestId('email-input')).toBeEditable();
    await expect(page.getByTestId('submit-button')).toBeEnabled();
  });
});

// Cross-Browser Font Rendering Test
test('should render fonts consistently', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/forgot-password');
  
  // Get computed font style
  const fontStyle = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="email-label"]');
    const styles = window.getComputedStyle(element);
    return {
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight
    };
  });
  
  // Log font information for manual verification
  console.log('Font rendering information:', fontStyle);
  
  // Basic check that font is applied
  expect(fontStyle.fontFamily).not.toBe('');
  
  await context.close();
});

// Custom test helper for keyboard navigation testing
test('should be navigable using keyboard only', async ({ page }) => {
  await page.goto('/forgot-password');
  
  // Tab to email input
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('email-input')).toBeFocused();
  
  // Fill email input
  await page.keyboard.type('test@example.com');
  
  // Tab to submit button
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('submit-button')).toBeFocused();
  
  // Activate submit button with Enter
  await page.keyboard.press('Enter');
  
  // Check submission was successful (either error or success message)
  await expect(page.getByTestId('error-message').or(page.getByTestId('alert-message'))).toBeVisible();
});
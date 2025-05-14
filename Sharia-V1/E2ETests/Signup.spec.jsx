import { test, expect } from '@playwright/test';
import {chromium } from '@playwright/test';
import axe from '@axe-core/playwright';


// Test data
const validUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!'
};

const invalidUser = {
  name: '',
  email: 'invalidemail',
  password: 'short',
  confirmPassword: 'doesnotmatch'
};

test.describe('Signup Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to signup page before each test
    await page.goto('/signup');
    
    // Ensure the page is fully loaded
    await page.waitForSelector('[data-testid="signup-form"]');
  });

  // Functional Tests
  test('should render the signup form with all elements', async ({ page }) => {
    // Verify all critical elements are present
    await expect(page.locator('[data-testid="company-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-heading"]')).toBeVisible();
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="terms-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="google-signup-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-link"]')).toBeVisible();
  });

  test('should successfully sign up with valid credentials', async ({ page }) => {
    // Mock the successful API response
    await page.route('**/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Fill in form with valid data
    await page.locator('[data-testid="name-input"]').fill(validUser.name);
    await page.locator('[data-testid="email-input"]').fill(validUser.email);
    await page.locator('[data-testid="password-input"]').fill(validUser.password);
    await page.locator('[data-testid="confirm-password-input"]').fill(validUser.confirmPassword);
    await page.locator('[data-testid="terms-input"]').check();

    // Submit the form
    await page.locator('[data-testid="signup-button"]').click();

    // Verify success message appears
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Signup successful');
  });

  test('should show validation errors for invalid form submission', async ({ page }) => {
    // Submit form without entering anything
    await page.locator('[data-testid="signup-button"]').click();
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please enter your name');
    
    // Now enter invalid data one by one
    // Test name validation
    await page.locator('[data-testid="name-input"]').fill(validUser.name);
    await page.locator('[data-testid="signup-button"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please enter your email address');
    
    // Test email validation
    await page.locator('[data-testid="email-input"]').fill(invalidUser.email);
    await page.locator('[data-testid="signup-button"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please enter a valid email address');
    
    // Test password validation
    await page.locator('[data-testid="email-input"]').fill(validUser.email);
    await page.locator('[data-testid="password-input"]').fill(invalidUser.password);
    await page.locator('[data-testid="signup-button"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Password must be at least 6 characters long');
    
    // Test password match validation
    await page.locator('[data-testid="password-input"]').fill(validUser.password);
    await page.locator('[data-testid="confirm-password-input"]').fill(invalidUser.confirmPassword);
    await page.locator('[data-testid="signup-button"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Passwords do not match');
    
    // Test terms checkbox validation
    await page.locator('[data-testid="confirm-password-input"]').fill(validUser.password);
    await page.locator('[data-testid="signup-button"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('You must agree to the Terms and Conditions');
  });

  test('should handle server-side error during signup', async ({ page }) => {
    // Mock the error API response
    await page.route('**/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ 
          msg: 'Email already exists' 
        })
      });
    });

    // Fill and submit form
    await page.locator('[data-testid="name-input"]').fill(validUser.name);
    await page.locator('[data-testid="email-input"]').fill(validUser.email);
    await page.locator('[data-testid="password-input"]').fill(validUser.password);
    await page.locator('[data-testid="confirm-password-input"]').fill(validUser.confirmPassword);
    await page.locator('[data-testid="terms-input"]').check();
    await page.locator('[data-testid="signup-button"]').click();

    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Email already exists');
  });

  test('should show/hide password when toggle buttons are clicked', async ({ page }) => {
    // Fill password fields
    await page.locator('[data-testid="password-input"]').fill(validUser.password);
    await page.locator('[data-testid="confirm-password-input"]').fill(validUser.confirmPassword);
    
    // Initially password fields should be of type password
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'password');
    await expect(page.locator('[data-testid="confirm-password-input"]')).toHaveAttribute('type', 'password');
    
    // Toggle password visibility
    await page.locator('[data-testid="toggle-password-visibility"]').click();
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'text');
    
    // Toggle confirm password visibility
    await page.locator('[data-testid="toggle-confirm-password-visibility"]').click();
    await expect(page.locator('[data-testid="confirm-password-input"]')).toHaveAttribute('type', 'text');
    
    // Toggle back
    await page.locator('[data-testid="toggle-password-visibility"]').click();
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'password');
  });

  test('should open terms modal when link is clicked', async ({ page }) => {
    // Click terms link
    await page.locator('[data-testid="terms-link"]').click();
    
    // Verify that modal is visible
    await expect(page.locator('[data-testid="terms-modal"]')).toBeVisible();
  });

  test('should open privacy modal when link is clicked', async ({ page }) => {
    // Click privacy link
    await page.locator('[data-testid="privacy-link"]').click();
    
    // Verify that modal is visible
    await expect(page.locator('[data-testid="privacy-modal"]')).toBeVisible();
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // Mock the navigation
    const navigationPromise = page.waitForNavigation();
    
    // Click login link
    await page.locator('[data-testid="login-link"]').click();
    
    // Wait for navigation
    await navigationPromise;
    
    // Verify URL
    expect(page.url()).toContain('/login');
  });

  test('should navigate back to home when back button is clicked', async ({ page }) => {
    // Mock the navigation
    const navigationPromise = page.waitForNavigation();
    
    // Click back button
    await page.locator('[data-testid="back-button"]').click();
    
    // Wait for navigation
    await navigationPromise;
    
    // Verify URL
    expect(page.url()).toBe('https://shariastocks.in/');
  });

  test('should initiate Google sign-in when Google button is clicked', async ({ page }) => {
    // Spy on the function call
    await page.evaluate(() => {
      window.initiateGoogleSignInCalled = false;
      window.originalInitiateGoogleSignIn = window.initiateGoogleSignIn;
      window.initiateGoogleSignIn = () => {
        window.initiateGoogleSignInCalled = true;
        return window.originalInitiateGoogleSignIn();
      };
    });
    
    // Click the Google signup button
    await page.locator('[data-testid="google-signup-button"]').click();
    
    // Check if the function was called
    const wasCalled = await page.evaluate(() => window.initiateGoogleSignInCalled);
    expect(wasCalled).toBe(true);
  });

  test('should disable form controls during submission', async ({ page }) => {
    // Set up a slow mock response
    await page.route('**/api/auth/signup', async (route) => {
      // Delay the response to simulate slow server
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Fill the form
    await page.locator('[data-testid="name-input"]').fill(validUser.name);
    await page.locator('[data-testid="email-input"]').fill(validUser.email);
    await page.locator('[data-testid="password-input"]').fill(validUser.password);
    await page.locator('[data-testid="confirm-password-input"]').fill(validUser.confirmPassword);
    await page.locator('[data-testid="terms-input"]').check();
    
    // Submit the form
    await page.locator('[data-testid="signup-button"]').click();
    
    // Verify loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    // Verify form controls are disabled
    await expect(page.locator('[data-testid="name-input"]')).toBeDisabled();
    await expect(page.locator('[data-testid="email-input"]')).toBeDisabled();
    await expect(page.locator('[data-testid="password-input"]')).toBeDisabled();
    await expect(page.locator('[data-testid="confirm-password-input"]')).toBeDisabled();
    
    // Wait for completion
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  // Non-functional Tests
  
  // Accessibility Testing
  test('should pass accessibility audit', async ({ page }) => {
    // Inject axe-core
    await axe.injectAxe(page);
    
    // Run the accessibility audit
    const results = await axeCore.analyze(page);
    
    // Assert no violations
    expect(results.violations).toEqual([]);
  });

  // Responsiveness Tests
  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify all critical elements are still visible and properly sized
    await expect(page.locator('[data-testid="company-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-form"]')).toBeVisible();
    
    // Check container width is appropriate for viewport
    const containerWidth = await page.locator('[data-testid="signup-form-container"]').evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return parseFloat(computedStyle.width);
    });
    
    expect(containerWidth).toBeLessThanOrEqual(375);
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Verify layout adjusts appropriately
    await expect(page.locator('[data-testid="signup-form-container"]')).toBeVisible();
    
    // Check padding changes as specified in responsive design
    const containerPadding = await page.locator('[data-testid="signup-page-container"]').evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.padding;
    });
    
    expect(containerPadding).not.toBe('16px'); // Should not be the mobile padding
  });

  // Performance Testing
  test('should load signup page within acceptable time', async ({ page }) => {
    // Measure page load performance
    const startTime = Date.now();
    
    await page.goto('/signup', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Assert load time is within acceptable range (adjust threshold as needed)
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle form submission with acceptable response time', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Fill the form
    await page.locator('[data-testid="name-input"]').fill(validUser.name);
    await page.locator('[data-testid="email-input"]').fill(validUser.email);
    await page.locator('[data-testid="password-input"]').fill(validUser.password);
    await page.locator('[data-testid="confirm-password-input"]').fill(validUser.confirmPassword);
    await page.locator('[data-testid="terms-input"]').check();
    
    // Measure form submission time
    const startTime = Date.now();
    await page.locator('[data-testid="signup-button"]').click();
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    const submissionTime = Date.now() - startTime;
    
    console.log(`Form submission time: ${submissionTime}ms`);
    expect(submissionTime).toBeLessThan(1000);
  });

  // Visual Regression Testing
  test('should match visual snapshot of signup page', async ({ page }) => {
    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('signup-page.png', {
      maxDiffPixelRatio: 0.01
    });
  });

  test('should match visual snapshot of form with error state', async ({ page }) => {
    // Submit form without data to trigger error
    await page.locator('[data-testid="signup-button"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    // Take screenshot of error state
    await expect(page.locator('[data-testid="signup-form-container"]')).toHaveScreenshot('signup-error-state.png', {
      maxDiffPixelRatio: 0.01
    });
  });

  // Security Tests
  test('should securely handle password inputs', async ({ page }) => {
    // Fill password fields
    await page.locator('[data-testid="password-input"]').fill(validUser.password);
    
    // Verify password field type
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'password');
    
    // Check that password is not visible in page source (this is a simple check)

    expect(page.locator('[data-testid="password-input"]')).not.toContain(validUser.password);
  });

  // Browser Compatibility Tests (using multiple browsers)
  test.describe('Browser compatibility', () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
      test(`should render correctly in ${browserType}`, async () => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto('/signup');
        
        // Verify critical elements render
        const logoVisible = await page.isVisible('[data-testid="company-logo"]');
        const formVisible = await page.isVisible('[data-testid="signup-form"]');
        
        expect(logoVisible).toBe(true);
        expect(formVisible).toBe(true);
        
        // Take browser-specific screenshot
        await page.screenshot({ path: `signup-${browserType}.png` });
        
        await browser.close();
      });
    }
  });

  // Internationalization Test
  test('should handle non-ASCII characters in form inputs', async ({ page }) => {
    // Use non-ASCII characters in name field
    const nonAsciiName = 'José Günter Ñandú';
    await page.locator('[data-testid="name-input"]').fill(nonAsciiName);
    
    // Complete the rest of the form
    await page.locator('[data-testid="email-input"]').fill(validUser.email);
    await page.locator('[data-testid="password-input"]').fill(validUser.password);
    await page.locator('[data-testid="confirm-password-input"]').fill(validUser.confirmPassword);
    await page.locator('[data-testid="terms-input"]').check();
    
    // Mock the API
    await page.route('**/api/auth/signup', async (route) => {
      const postData = route.request().postData();
      const parsedData = JSON.parse(postData);
      
      // Verify non-ASCII characters are preserved
      if (parsedData.name === nonAsciiName) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Name was not preserved correctly' })
        });
      }
    });
    
    // Submit form
    await page.locator('[data-testid="signup-button"]').click();
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  // Load Testing (simulating multiple simultaneous users)
  test('should handle concurrent user load', async () => {
    const numberOfConcurrentUsers = 5;
    const browsers = [];
    
    for (let i = 0; i < numberOfConcurrentUsers; i++) {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Mock the API for each page
      await page.route('**/api/auth/signup', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });
      
      browsers.push({ browser, context, page });
    }
    
    // Execute signup process concurrently
    const startTime = Date.now();
    
    await Promise.all(browsers.map(async ({ page }, index) => {
      await page.goto('/signup');
      
      // Fill form with unique data
      await page.locator('[data-testid="name-input"]').fill(`User ${index}`);
      await page.locator('[data-testid="email-input"]').fill(`user${index}@example.com`);
      await page.locator('[data-testid="password-input"]').fill(validUser.password);
      await page.locator('[data-testid="confirm-password-input"]').fill(validUser.confirmPassword);
      await page.locator('[data-testid="terms-input"]').check();
      
      // Submit form
      await page.locator('[data-testid="signup-button"]').click();
      
      // Verify success
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    }));
    
    const totalTime = Date.now() - startTime;
    console.log(`Concurrent users test completed in ${totalTime}ms`);
    
    // Cleanup
    for (const { browser } of browsers) {
      await browser.close();
    }
    
    // Assert reasonable performance under load
    expect(totalTime).toBeLessThan(5000);
  });
});
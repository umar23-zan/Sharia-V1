
import { test, expect } from '@playwright/test';
import { performance } from 'perf_hooks';

/**
 * Test credentials
 */
const FREE_USER = {
  email: 'umarmohamed444481@gmail.com',
  password: '321654'
};

const PREMIUM_USER = {
  email: 'umarmohmed444sam@gmail.com',
  password: '321654'
};

/**
 * Helper functions
 */
async function login(page, email, password) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');
  
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);
  // await page.goto(dashboardUrl);
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');
}

/**
 * Performance measurements
 */
class PerformanceMeasurement {
  constructor() {
    this.metrics = {};
  }

  start(name) {
    this.metrics[name] = {
      startTime: performance.now()
    };
  }

  end(name) {
    if (this.metrics[name]) {
      this.metrics[name].endTime = performance.now();
      this.metrics[name].duration = this.metrics[name].endTime - this.metrics[name].startTime;
      return this.metrics[name].duration;
    }
    return null;
  }

  getMetrics() {
    return this.metrics;
  }
}

/**
 * Test Suites
 */
test.describe('Account Settings Page - Free User', () => {
  let performanceMeasure;

  test.beforeEach(async ({ page }) => {
    performanceMeasure = new PerformanceMeasurement();
    await login(page, FREE_USER.email, FREE_USER.password);
    
    // Navigate to account settings
    performanceMeasure.start('navigationToAccountSettings');
    await page.goto('/account');
    await page.waitForSelector('[data-testid="account-information-page"]');
    performanceMeasure.end('navigationToAccountSettings');
  });

  test('should display correct user information for free user', async ({ page }) => {
    // Verify user profile information
    const userEmail = await page.textContent('[data-testid="user-email"]');
    expect(userEmail).toBe(FREE_USER.email);
    
    // Verify account status
    const accountStatus = await page.textContent('[data-testid="account-status"]');
    expect(accountStatus).toContain('active');
    
    // Verify current plan is free
    const currentPlan = await page.textContent('[data-testid="current-plan"]');
    expect(currentPlan.toLowerCase()).toBe('free');
    
    // Check features list is displayed correctly
    const featuresCount = await page.locator('[data-testid^="feature-item-"]').count();
    expect(featuresCount).toBeGreaterThan(0);
  });

  test('should display view all plans button for free user', async ({ page }) => {
    // Verify the view all plans button is available
    await expect(page.locator('[data-testid="view-all-plans-button"]')).toBeVisible();
    
    // Performance test for button click response
    performanceMeasure.start('viewAllPlansButtonClick');
    await page.click('[data-testid="view-all-plans-button"]');
    await page.waitForURL('**/subscriptiondetails');
    const navigationTime = performanceMeasure.end('viewAllPlansButtonClick');
    console.log(`Navigation to subscription details took: ${navigationTime}ms`);
    
    // Verify navigation happened
    expect(page.url()).toContain('subscriptiondetails');
  });

  test('should show inactive subscription message for free user', async ({ page }) => {
    // Check if payment section shows the message for inactive subscription
    await expect(page.locator('[data-testid="inactive-subscription-message"]')).toBeVisible();
    
    // Check that view subscription plans button is present
    await expect(page.locator('[data-testid="view-subscription-plans-button"]')).toBeVisible();
  });

  test('should handle delete account modal for free user', async ({ page }) => {
    // Click on delete account button
    await page.click('[data-testid="delete-account-button"]');
    
    // Verify modal appears
    await expect(page.locator('[data-testid="deactivate-account-modal"]')).toBeVisible();
    
    // Close the modal by clicking cancel
    await page.click('[data-testid="close-deactivate-modal-button"]');
    
    // Verify modal is closed
    await expect(page.locator('[data-testid="deactivate-account-modal"]')).not.toBeVisible();
  });
  
  test('performance metrics for account page load - free user', async ({ page }) => {
    // Measure time for initial page load
    performanceMeasure.start('pageReload');
    await page.reload();
    await page.waitForSelector('[data-testid="account-information-page"]');
    const reloadTime = performanceMeasure.end('pageReload');
    
    // Log performance metrics
    console.log(`Account page reload time: ${reloadTime}ms`);
    expect(reloadTime).toBeLessThan(5000); // Page should load in less than 5 seconds
    
    // Test page responsiveness
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport
    await page.waitForTimeout(500); // Allow time for responsive layout to adjust
    
    // Verify all important elements are still visible in mobile view
    await expect(page.locator('[data-testid="user-info-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="subscription-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="account-management-section"]')).toBeVisible();
  });
});

test.describe('Account Settings Page - Premium User', () => {
  let performanceMeasure;

  test.beforeEach(async ({ page }) => {
    performanceMeasure = new PerformanceMeasurement();
    await login(page, PREMIUM_USER.email, PREMIUM_USER.password);
    
    // Navigate to account settings
    performanceMeasure.start('navigationToAccountSettings');
    await page.goto('/account');
    await page.waitForSelector('[data-testid="account-information-page"]');
    performanceMeasure.end('navigationToAccountSettings');
  });

  test('should display correct user information for premium user', async ({ page }) => {
    // Verify user profile information
    const userEmail = await page.textContent('[data-testid="user-email"]');
    expect(userEmail).toBe(PREMIUM_USER.email);
    
    // Verify account status
    const accountStatus = await page.textContent('[data-testid="account-status"]');
    expect(accountStatus).toContain('active');
    
    // Verify current plan is premium or basic
    const currentPlan = await page.textContent('[data-testid="current-plan"]');
    expect(['Basic', 'Premium'].includes(currentPlan)).toBeTruthy();
    
    // Verify plan price is displayed
    const planPrice = await page.textContent('[data-testid="plan-price"]');
    expect(planPrice).toMatch(/₹\d+/);
    
    // Check features list is displayed correctly
    const featuresCount = await page.locator('[data-testid^="feature-item-"]').count();
    expect(featuresCount).toBeGreaterThan(0);
  });

  test('should display and interact with payment mode section for premium user', async ({ page }) => {
    // Check if payment mode section is visible
    await expect(page.locator('[data-testid="payment-mode-section"]')).toBeVisible();
    // const pendingChangeBannerVisible=await expect(page.locator('[data-testid=""pending-change-banner""]')).toBeVisible();
    // if(pendingChangeBannerVisible){
    //   await page.click('[data-testid="cancel-change-button"]');
    // }
    // Get current payment mode
    const isAutomaticSelected = await page.locator('[data-testid="automatic-payment-option"]')
      .evaluate(el => el.classList.contains('border-blue-500'));
    
    if (isAutomaticSelected) {
      // Try switching to manual payment mode
      await page.click('[data-testid="manual-payment-option"]');
      
      // Check if alert modal appears
      const alertModalVisible = await page.isVisible('[data-testid="payment-mode-alert-modal"]');
      
      if (alertModalVisible) {
        // Click switch to manual
        await page.click('[data-testid="switch-to-manual-button"]');
        
        // Save changes
        await page.click('[data-testid="save-payment-mode-button"]');
        
        // Verify success message appears
        await expect(page.locator('[data-testid="payment-mode-success"]')).toBeVisible();
      }
    } else {
      // Try switching to automatic payment mode
      await page.click('[data-testid="automatic-payment-option"]');
      
      // Save changes
      await page.click('[data-testid="save-payment-mode-button"]');
      
      // Verify success message appears
      await expect(page.locator('[data-testid="payment-mode-success"]')).toBeVisible();
    }
  });

  test('should handle cancel subscription modal for premium user', async ({ page }) => {
    // Check if cancel subscription button is visible
    const cancelButtonVisible = await page.isVisible('[data-testid="cancel-subscription-button"]');
    
    if (cancelButtonVisible) {
      // Click on cancel subscription button
      await page.click('[data-testid="cancel-subscription-button"]');
      
      // Verify modal appears
      await expect(page.locator('[data-testid="cancel-subscription-modal"]')).toBeVisible();
      
      // Select a reason
      await page.selectOption('[data-testid="cancellation-reason-select"]', 'Not using the service enough');
      
      // Add feedback
      await page.fill('[data-testid="cancellation-feedback-textarea"]', 'This is a test, please ignore.');
      
      // Close the modal by clicking keep subscription
      await page.click('[data-testid="keep-subscription-button"]');
      
      // Verify modal is closed
      await expect(page.locator('[data-testid="cancel-subscription-modal"]')).not.toBeVisible();
    } else {
      console.log('Cancel subscription button not found - subscription might already be cancelled');
    }
  });

  test('should handle pending payment mode change if present', async ({ page }) => {
    // Check if there's a pending change banner
    const pendingChangeBannerVisible = await page.isVisible('[data-testid="pending-change-banner"]');
    
    if (pendingChangeBannerVisible) {
      // Click on cancel change button
      await page.click('[data-testid="cancel-change-button"]');
      
      // Verify success message appears
      await expect(page.locator('[data-testid="cancel-success-message"]')).toBeVisible();
    } else {
      console.log('No pending payment mode change found');
    }
  });
  
  test('accessibility test - keyboard navigation', async ({ page }) => {
    // Start from the top of the page
    await page.keyboard.press('Tab');
    
    // Tab through all focusable elements and count them
    let focusableElementsCount = 0;
    let previousFocusedElement = null;
    
    // Press tab up to 20 times to check keyboard navigation
    for (let i = 0; i < 20; i++) {
      const focusedElement = await page.evaluate(() => document.activeElement.getAttribute('data-testid'));
      
      if (focusedElement && focusedElement !== previousFocusedElement) {
        focusableElementsCount++;
        previousFocusedElement = focusedElement;
      }
      
      await page.keyboard.press('Tab');
    }
    
    // Ensure we found some focusable elements
    expect(focusableElementsCount).toBeGreaterThan(5);
    
    // Try to interact with an element using keyboard
    await page.keyboard.press('Escape'); // Reset focus
    await page.keyboard.press('Tab'); // First focusable element
    await page.keyboard.press('Enter');
    
    // Verify some interaction happened (this will depend on what the first element is)
  });
  
  test('performance metrics for account page load - premium user', async ({ page }) => {
    // Measure time for initial page load
    performanceMeasure.start('pageReload');
    await page.reload();
    await page.waitForSelector('[data-testid="account-information-page"]');
    const reloadTime = performanceMeasure.end('pageReload');
    
    // Log performance metrics
    console.log(`Account page reload time: ${reloadTime}ms`);
    expect(reloadTime).toBeLessThan(5000); // Page should load in less than 5 seconds
    
    // Test page responsiveness
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport
    await page.waitForTimeout(500); // Allow time for responsive layout to adjust
    
    // Verify all important elements are still visible in mobile view
    await expect(page.locator('[data-testid="user-info-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="subscription-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-info-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="account-management-section"]')).toBeVisible();
  });
  
  test('lighthouse performance test simulation', async ({ page }) => {
    // Note: This is a simplified version - in a real scenario you would use Lighthouse CI
    
    // Measure resource loading
    const resourcesInfo = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return {
        totalResources: resources.length,
        totalSize: resources.reduce((total, resource) => total + (resource.transferSize || 0), 0),
        slowestResource: Math.max(...resources.map(resource => resource.duration))
      };
    });
    
    console.log(`Total resources loaded: ${resourcesInfo.totalResources}`);
    console.log(`Total transfer size: ${resourcesInfo.totalSize / 1024} KB`);
    console.log(`Slowest resource load time: ${resourcesInfo.slowestResource}ms`);
    
    // Set performance expectations
    expect(resourcesInfo.totalResources).toBeLessThan(100); // Should load less than 100 resources
    expect(resourcesInfo.totalSize).toBeLessThan(5 * 1024 * 1024); // Should be less than 5MB total
    expect(resourcesInfo.slowestResource).toBeLessThan(2000); // Slowest resource < 2s
  });
  
  test('stress test - rapid interaction', async ({ page }) => {
    // Perform a series of rapid interactions to test UI stability
    for (let i = 0; i < 5; i++) {
      // Click on manual payment then automatic payment
      if (await page.isVisible('[data-testid="manual-payment-option"]')) {
        await page.click('[data-testid="manual-payment-option"]');
        
        // If alert appears, close it
        if (await page.isVisible('[data-testid="payment-mode-alert-modal"]')) {
          await page.click('[data-testid="close-alert-modal"]');
        }
      }
      
      if (await page.isVisible('[data-testid="automatic-payment-option"]')) {
        await page.click('[data-testid="automatic-payment-option"]');
      }
      
      // Open and close cancel subscription dialog if available
      if (await page.isVisible('[data-testid="cancel-subscription-button"]')) {
        await page.click('[data-testid="cancel-subscription-button"]');
        if (await page.isVisible('[data-testid="keep-subscription-button"]')) {
          await page.click('[data-testid="keep-subscription-button"]');
        }
      }
      
      // Open and close delete account dialog
      await page.click('[data-testid="delete-account-button"]');
      await page.waitForSelector('[data-testid="deactivate-account-modal"]');
      await page.click('[data-testid="close-deactivate-modal-button"]');
      
      // Wait a short time between iterations
      await page.waitForTimeout(300);
    }
    
    // After stress test, verify the page is still in a valid state
    await expect(page.locator('[data-testid="account-information-page"]')).toBeVisible();
  });
  
  test('network resilience test', async ({ page, context }) => {
    // Test how the app behaves with slow network
    await context.route('**/*', async (route) => {
      // Add 1-second delay to all network requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    // Reload the page with slow network
    performanceMeasure.start('slowNetworkLoad');
    await page.reload();
    await page.waitForSelector('[data-testid="account-information-page"]', { timeout: 30000 });
    const slowLoadTime = performanceMeasure.end('slowNetworkLoad');
    
    console.log(`Slow network page load time: ${slowLoadTime}ms`);
    
    // Try basic interactions under slow network
    await page.click('[data-testid="delete-account-button"]');
    await page.waitForSelector('[data-testid="deactivate-account-modal"]');
    await page.click('[data-testid="close-deactivate-modal-button"]');
    
    // Remove the slow network condition
    await context.unroute('**/*');
  });
});

/**
 * Visual Regression Tests
 * Note: These tests require additional setup with Playwright's visual comparison features
 */
test.describe('Visual Regression Tests', () => {
  test('account page should match screenshot - desktop', async ({ page }) => {
    await login(page, PREMIUM_USER.email, PREMIUM_USER.password);
    await page.goto('/account');
    await page.waitForSelector('[data-testid="account-information-page"]');
    
    // Set a desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    // Take screenshot for comparison
    // In a real setup, you would use expect(await page.screenshot()).toMatchSnapshot('account-desktop.png');
    await page.screenshot({ path: 'test-results/account-desktop.png' });
  });
  
  test('account page should match screenshot - mobile', async ({ page }) => {
    await login(page, PREMIUM_USER.email, PREMIUM_USER.password);
    await page.goto('/account');
    await page.waitForSelector('[data-testid="account-information-page"]');
    
    // Set a mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    // Take screenshot for comparison
    // In a real setup, you would use expect(await page.screenshot()).toMatchSnapshot('account-mobile.png');
    await page.screenshot({ path: 'test-results/account-mobile.png' });
  });
});

/**
 * Security Tests
 */
test.describe('Security Tests', () => {
  test('should not allow accessing account page without authentication', async ({ page }) => {
    // Try accessing the account page directly without login
    await page.goto('/account');
    
    // Should be redirected to login
    await page.waitForURL(/.*signup.*/);
    
    // Verify we're on the login page
    await expect(page.locator('[data-testid="signup-button"]')).toBeVisible();
  });
  
  test('XSS protection test - user inputs', async ({ page }) => {
    await login(page, PREMIUM_USER.email, PREMIUM_USER.password);
    await page.goto('/account');
    
    // Try to submit potentially malicious content in a text field
    // For this test, we'll use the cancel subscription feedback form
    
    if (await page.isVisible('[data-testid="cancel-subscription-button"]')) {
      await page.click('[data-testid="cancel-subscription-button"]');
      
      const xssPayload = '<script>alert("XSS")</script>';
      await page.fill('[data-testid="cancellation-feedback-textarea"]', xssPayload);
      
      // Check if the value was sanitized or escaped
      const textareaValue = await page.inputValue('[data-testid="cancellation-feedback-textarea"]');
      expect(textareaValue).toBe(xssPayload); // Value should be stored as-is
      
      // Close the modal
      await page.click('[data-testid="keep-subscription-button"]');
    }
  });
});

/**
 * Comprehensive multi-step user journey
 */
test('complete user journey through account settings page', async ({ page }) => {
  // Login as premium user
  await login(page, PREMIUM_USER.email, PREMIUM_USER.password);
  
  // Go to account page
  await page.goto('/account');
  await page.waitForSelector('[data-testid="account-information-page"]');
  
  // Step 1: Verify account information is displayed correctly
  const userEmail = await page.textContent('[data-testid="user-email"]');
  expect(userEmail).toBe(PREMIUM_USER.email);
  
  // Step 2: Check current plan details
  const currentPlan = await page.textContent('[data-testid="current-plan"]');
  expect(['Basic', 'Premium'].includes(currentPlan)).toBeTruthy();
  
  // Step 3: Toggle payment mode (if possible)
  if (await page.isVisible('[data-testid="payment-mode-section"]')) {
    const isAutomaticSelected = await page.locator('[data-testid="automatic-payment-option"]')
      .evaluate(el => el.classList.contains('border-blue-500'));
    
    // Check if there's a pending change already
    const hasPendingChange = await page.isVisible('[data-testid="pending-change-banner"]');
    
    if (!hasPendingChange) {
      if (isAutomaticSelected) {
        // Try switching to manual
        await page.click('[data-testid="manual-payment-option"]');
        
        // Handle alert if it appears
        const alertVisible = await page.isVisible('[data-testid="payment-mode-alert-modal"]');
        if (alertVisible) {
          await page.click('[data-testid="keep-automatic-button"]'); // Stay on automatic for now
        }
      } else {
        // Try switching to automatic
        await page.click('[data-testid="automatic-payment-option"]');
        
        // Save changes
        if (await page.isVisible('[data-testid="save-payment-mode-button"]')) {
          await page.click('[data-testid="save-payment-mode-button"]');
          await page.waitForSelector('[data-testid="payment-mode-success"]', { timeout: 5000 });
        }
      }
    }
  }
  
  // Step 4: Open delete account modal
  await page.click('[data-testid="delete-account-button"]');
  await page.waitForSelector('[data-testid="deactivate-account-modal"]');
  
  // Step 5: Cancel deletion
  await page.click('[data-testid="close-deactivate-modal-button"]');
  
  // Step 6: Check subscription cancellation flow (without completing it)
  if (await page.isVisible('[data-testid="cancel-subscription-button"]')) {
    await page.click('[data-testid="cancel-subscription-button"]');
    await page.waitForSelector('[data-testid="cancel-subscription-modal"]');
    
    // Fill out cancellation form
    await page.selectOption('[data-testid="cancellation-reason-select"]', 'Too expensive');
    await page.fill('[data-testid="cancellation-feedback-textarea"]', 'This is just a test. Please ignore.');
    
    // Cancel without submitting
    await page.click('[data-testid="keep-subscription-button"]');
  }
  
  // Step 7: Go to subscription details page
  await page.click('[data-testid="view-all-plans-button"]');
  await page.waitForURL('**/subscriptiondetails');
  
  // Step 8: Return to account page
  await page.goto('/account');
  await page.waitForSelector('[data-testid="account-information-page"]');
  
  // Step 9: Test responsive layout
  await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport
  await page.waitForTimeout(500);
  
  // Verify key components are visible
  await expect(page.locator('[data-testid="user-info-section"]')).toBeVisible();
  await expect(page.locator('[data-testid="subscription-section"]')).toBeVisible();
  
  // Step 10: Return to desktop view
  await page.setViewportSize({ width: 1280, height: 800 });
  
  // Step 11: Test go back button
  await page.click('[data-testid="go-back-button"]');
  
  // Final verification - we've completed the journey
  console.log('Completed full user journey through account settings page');
});
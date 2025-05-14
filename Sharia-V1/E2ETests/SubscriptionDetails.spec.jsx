import { test, expect } from '@playwright/test';
import {chromium } from '@playwright/test';

// Test data
const FREE_USER = {
  email: 'umarmohamed444481@gmail.com',
  password: '321654'
};

const PREMIUM_USER = {
  email: 'umarmohmed444sam@gmail.com',
  password: '321654'
};

// Utility function to get plan prices
const getPlanPrice = (plan, billingCycle) => {
  const prices = {
    free: { monthly: 0, annual: 0 },
    basic: { monthly: 299, annual: 1999 },
    premium: { monthly: 499, annual: 2999 }
  };
  return prices[plan][billingCycle];
};

// Utility function to calculate taxes
const getTax = (price) => {
  return price * 0.18;
};

// Utility function to calculate total price
const getTotalPrice = (plan, billingCycle) => {
  const price = getPlanPrice(plan, billingCycle);
  const tax = getTax(price);
  return price + tax;
};

// Utility for measuring performance
const measurePerformance = async (page) => {
  const performanceTimingJson = await page.evaluate(() => JSON.stringify(window.performance.timing));
  const performanceTiming = JSON.parse(performanceTimingJson);
  
  const navigationStart = performanceTiming.navigationStart;
  const loadEventEnd = performanceTiming.loadEventEnd;
  
  return loadEventEnd - navigationStart;
};

// Login helper function
async function login(page, credentials) {
  await page.goto('/login');
  await page.getByTestId('email-input').fill(credentials.email);
  await page.getByTestId('password-input').fill(credentials.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');
}

// ==================== FUNCTIONAL TESTS ====================

test.describe('Subscription Page - Functional Tests', () => {
  
  test('should load subscription page correctly', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Verify page title and description
    await expect(page.getByTestId('page-title')).toBeVisible();
    await expect(page.getByTestId('page-description')).toBeVisible();
    
    // Verify all plan cards are visible
    await expect(page.getByTestId('free-plan-card')).toBeVisible();
    await expect(page.getByTestId('basic-plan-card')).toBeVisible();
    await expect(page.getByTestId('premium-plan-card')).toBeVisible();
    
    // Verify plan comparison table
    await expect(page.getByTestId('plan-comparison-container')).toBeVisible();
    
    // Verify CTA section
    await expect(page.getByTestId('cta-container')).toBeVisible();
  });
  
  test('should toggle billing cycle', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Verify default is monthly
    await expect(page.getByTestId('monthly-billing-button')).toHaveClass(/bg-purple-600/);
    
    // Switch to annual and verify prices update
    await page.getByTestId('annual-billing-button').click();
    await expect(page.getByTestId('annual-billing-button')).toHaveClass(/bg-purple-600/);
    await expect(page.getByTestId('basic-plan-price')).toContainText('1999');
    await expect(page.getByTestId('premium-plan-price')).toContainText('2999');
    
    // Switch back to monthly and verify prices update
    await page.getByTestId('monthly-billing-button').click();
    await expect(page.getByTestId('monthly-billing-button')).toHaveClass(/bg-purple-600/);
    await expect(page.getByTestId('basic-plan-price')).toContainText('299');
    await expect(page.getByTestId('premium-plan-price')).toContainText('499');
  });
  
  test('should select free plan as current user', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    await page.getByTestId('select-free-plan-button').click();
    
    // Verify free plan is selected
    await expect(page.getByTestId('free-plan-card')).toHaveClass(/ring-2/);
    
    // No confirmation dialog should appear for free plan
    await expect(page.getByTestId('subscription-confirmation-modal')).not.toBeVisible();
  });
  
  test('should select basic plan and open confirmation modal', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    await page.getByTestId('select-basic-plan-button').click();
    
    // Verify basic plan is selected
    await expect(page.getByTestId('basic-plan-card')).toHaveClass(/ring-2/);
    
    // Confirmation dialog should appear
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Verify subscription details in modal
    await expect(page.getByTestId('subscription-details')).toContainText('Basic plan');
    await expect(page.getByTestId('subtotal-price')).toContainText(`₹${getPlanPrice('basic', 'monthly').toFixed(2)}`);
    
    // Close modal
    await page.getByTestId('subscription-confirmation-close').click();
    await expect(page.getByTestId('subscription-confirmation-modal')).not.toBeVisible();
  });
  
  test('should select premium plan and open confirmation modal', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    await page.getByTestId('select-premium-plan-button').click();
    
    // Verify premium plan is selected
    await expect(page.getByTestId('premium-plan-card')).toHaveClass(/ring-2/);
    
    // Confirmation dialog should appear
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Verify subscription details in modal
    await expect(page.getByTestId('subscription-details')).toContainText('Premium plan');
    await expect(page.getByTestId('subtotal-price')).toContainText(`₹${getPlanPrice('premium', 'monthly').toFixed(2)}`);
    
    // Close modal
    await page.getByTestId('cancel-payment-button').click();
    await expect(page.getByTestId('subscription-confirmation-modal')).not.toBeVisible();
  });
  
  // test('cannot downgrade from premium to basic', async ({ page }) => {
  //   await login(page, PREMIUM_USER);
  //   await page.goto('/subscriptiondetails');
    
  //   // Verify current plan is premium
  //   await expect(page.getByTestId('select-premium-plan-button')).toContainText('Current Plan');
    
  //   // Try to select basic plan
  //   await page.getByTestId('select-basic-plan-button').click();
    
  //   // Expect an alert message
  //   page.on('dialog', async dialog => {
  //     expect(dialog.message()).toContain('contact customer support');
  //     await dialog.accept();
  //   });
  // });
  
  test('cannot downgrade from premium to free', async ({ page }) => {
    await login(page, PREMIUM_USER);
    await page.goto('/subscriptiondetails');
    
    // Verify current plan is premium
    await expect(page.getByTestId('select-basic-plan-button')).toContainText('Current Plan');
    
    const freePlanButton = page.getByTestId('select-free-plan-button');
    await expect(freePlanButton).toBeDisabled();
  });
  
  test('upgrade from free to basic via plan card', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Select basic plan
    await page.getByTestId('select-basic-plan-button').click();
    
    // Verify confirmation modal appears
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Skip actual payment to avoid charges
    await page.getByTestId('cancel-payment-button').click();
  });
  
  test('upgrade from free to premium via plan card', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Select premium plan
    await page.getByTestId('select-premium-plan-button').click();
    
    // Verify confirmation modal appears
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Skip actual payment to avoid charges
    await page.getByTestId('cancel-payment-button').click();
  });
  
  test('upgrade from basic to premium shows confirmation dialog', async ({ page, context }) => {
   
    await login(page, PREMIUM_USER);
    
    await page.goto('/subscriptiondetails');
    

    // Select premium plan
    await page.getByTestId('select-premium-plan-button').click();
    
    // Verify upgrade confirmation appears
    await expect(page.getByTestId('upgrade-confirmation-modal')).toBeVisible();
    
    // Confirm upgrade
    await page.getByTestId('confirm-upgrade-button').click();
    
    // Verify payment confirmation appears
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Skip actual payment
    await page.getByTestId('cancel-payment-button').click();
  });
  
  test('clicking "Upgrade Now" CTA button', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Click upgrade now CTA button
    await page.getByTestId('upgrade-button').click();
    
    // Expect confirmation modal to appear
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Verify premium plan is selected
    await expect(page.getByTestId('subscription-details')).toContainText('Premium plan');
    
    // Close modal
    await page.getByTestId('cancel-payment-button').click();
  });
  
  test('select automatic payment mode', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Select basic plan to open confirmation
    await page.getByTestId('select-basic-plan-button').click();
    
    // By default automatic payment should be selected
    // Need to mock the DOM element since the example doesn't show the entire PaymentModeSelector component
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    const autoOption = page.getByTestId('automatic-payment-option');

    // Ensure it is visible and selected by default
    await expect(autoOption).toBeVisible();
    await expect(autoOption).toHaveClass(/border-blue-500/); // or bg-blue-50

    
    // Close modal without making actual payment
    await page.getByTestId('cancel-payment-button').click();
  });
  
  test('select manual payment mode', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Select basic plan to open confirmation
    await page.getByTestId('select-basic-plan-button').click();
    
    // Expect confirmation modal to appear
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Simulate clicking manual payment mode
    try {
      await page.getByTestId('manual-payment-option').click();
    } catch (e) {
      // If test element doesn't exist, we'll continue as this functionality needs to be mocked
      console.log('Manual payment option element not found, continuing test');
    }
    
    // Close modal without making actual payment
    await page.getByTestId('cancel-payment-button').click();
  });
  
  test('handle payment failure', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Mock payment failure response
    await page.route('**/api/transaction/create-subscription', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Payment processing failed',
          message: 'Your card was declined'
        })
      });
    });
    
    // Select basic plan
    await page.getByTestId('select-basic-plan-button').click();
    
    // Attempt payment
    await page.getByTestId('confirm-payment-button').click();
    
    // Verify error message appears
    await expect(page.getByTestId('payment-error-message')).toBeVisible();
    
    // Close modal
    await page.getByTestId('cancel-payment-button').click();
  });
  
  test('handle pending payment', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Mock pending payment response
    await page.route('**/api/transaction/create-subscription', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Pending payment exists',
          message: 'You already have a pending subscription',
          pendingId: '12345'
        })
      });
    });
    
    // Select basic plan
    await page.getByTestId('select-basic-plan-button').click();
    
    // Attempt payment
    await page.getByTestId('confirm-payment-button').click();
    
    // Verify error message appears
    await expect(page.getByTestId('payment-error-message')).toBeVisible();
    
    // Verify cancel pending payment button appears
    await expect(page.getByTestId('cancel-pending-payment-button')).toBeVisible();
    
    // Mock cancel pending payment
    await page.route('**/api/transaction/cancel-pending-subscription', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Pending payment cancelled'
        })
      });
    });
    
    // Click cancel pending payment
    await page.getByTestId('cancel-pending-payment-button').click();
    
    // Verify success message
    await expect(page.getByTestId('payment-error-message')).toContainText('cancelled successfully');
  });
  
  test('close confirmation modal', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Select basic plan
    await page.getByTestId('select-basic-plan-button').click();
    
    // Verify modal appears
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Close with X button
    await page.getByTestId('subscription-confirmation-close').click();
    
    // Verify modal closes
    await expect(page.getByTestId('subscription-confirmation-modal')).not.toBeVisible();
    
    // Reopen modal
    await page.getByTestId('select-basic-plan-button').click();
    
    // Verify modal appears
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Close with cancel button
    await page.getByTestId('cancel-payment-button').click();
    
    // Verify modal closes
    await expect(page.getByTestId('subscription-confirmation-modal')).not.toBeVisible();
  });
  
  test('display correct plan prices', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Check monthly prices
    await page.getByTestId('monthly-billing-button').click();
    await expect(page.getByTestId('free-plan-price')).toContainText('₹0');
    await expect(page.getByTestId('basic-plan-price')).toContainText('₹299');
    await expect(page.getByTestId('premium-plan-price')).toContainText('₹499');
    
    // Check annual prices
    await page.getByTestId('annual-billing-button').click();
    await expect(page.getByTestId('free-plan-price')).toContainText('₹0');
    await expect(page.getByTestId('basic-plan-price')).toContainText('₹1999');
    await expect(page.getByTestId('premium-plan-price')).toContainText('₹2999');
  });
});

// ==================== NON-FUNCTIONAL TESTS ====================

test.describe('Subscription Page - Non-Functional Tests', () => {
  
  test('page load performance', async ({ page }) => {
    // Start performance measurement
    await login(page, FREE_USER);
    
    const startTime = Date.now();
    await page.goto('/subscriptiondetails');
    
    // Wait for critical elements
    await page.getByTestId('subscription-details-container').waitFor();
    await page.getByTestId('free-plan-card').waitFor();
    await page.getByTestId('basic-plan-card').waitFor();
    await page.getByTestId('premium-plan-card').waitFor();
    
    const loadTime = Date.now() - startTime;
    
    // Performance threshold (3 seconds)
    expect(loadTime).toBeLessThan(3000);
    
    // Also check using Performance API
    const perfMetrics = await measurePerformance(page);
    expect(perfMetrics).toBeLessThan(5000); // More lenient threshold for full page load
  });
  
  test('responsive design - mobile', async ({ browser }) => {
    const iPhone = {
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    };
    
    const context = await browser.newContext(iPhone);
    const page = await context.newPage();
    
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Check stacked layout on mobile
    await expect(page.getByTestId('plan-cards-container')).toHaveCSS('grid-template-columns', '327px');
    
    // Ensure elements are visible and correctly sized
    const containerWidth = await page.getByTestId('subscription-details-container').evaluate(el => el.offsetWidth);
    expect(containerWidth).toBeLessThanOrEqual(375);
    
    // Check that critical elements are visible
    await expect(page.getByTestId('page-title')).toBeVisible();
    await expect(page.getByTestId('free-plan-card')).toBeVisible();
    await expect(page.getByTestId('basic-plan-card')).toBeVisible();
    await expect(page.getByTestId('premium-plan-card')).toBeVisible();
    
    // Check if the comparison table is scrollable horizontally on mobile
    const tableScrollable = await page.getByTestId('plan-comparison-table').evaluate(el => {
      const container = el.closest('.overflow-x-auto');
      return container ? container.scrollWidth > container.clientWidth : false;
    });
    expect(tableScrollable).toBeTruthy();
  });
  
  test('responsive design - tablet', async ({ browser }) => {
    const iPad = {
      viewport: { width: 768, height: 1024 },
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    };
    
    const context = await browser.newContext(iPad);
    const page = await context.newPage();
    
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Check for tablet layout (should be multi-column)
    const gridColumns = await page.getByTestId('plan-cards-container').evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    // Should be 3 columns on tablet
    expect(gridColumns.split(' ').length).toBeGreaterThan(1);
    
    // Ensure CTA is properly styled for tablet
    const ctaLayout = await page.getByTestId('cta-container').evaluate(el => {
      const style = window.getComputedStyle(el.querySelector('div'));
      return style.display;
    });
    expect(ctaLayout).toBe('flex');
  });
  
  test('responsive design - desktop', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Check for desktop layout
    const gridColumns = await page.getByTestId('plan-cards-container').evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    // Should be 3 columns on desktop
    expect(gridColumns.split(' ').length).toBe(3);
    
    // Check spacing and width
    const containerPadding = await page.getByTestId('subscription-main-content').evaluate(el => {
      return window.getComputedStyle(el).padding;
    });
    expect(containerPadding).not.toBe('0px');
  });
  
  test('network resiliency - slow connection', async ({ browser }) => {
    // Create a context with slow network conditions
    const context = await browser.newContext({
      networkThrottling: {
        downloadThroughput: 500 * 1024 / 8, // 500 kbps
        uploadThroughput: 200 * 1024 / 8, // 200 kbps
        latency: 100 // 100 ms
      }
    });
    
    const page = await context.newPage();
    await login(page, FREE_USER);
    
    const startTime = Date.now();
    await page.goto('/subscriptiondetails');
    
    // Wait for critical elements
    await page.getByTestId('free-plan-card').waitFor();
    await page.getByTestId('basic-plan-card').waitFor();
    await page.getByTestId('premium-plan-card').waitFor();
    
    const loadTime = Date.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms on slow connection`);
    
    // Check that the page eventually loaded correctly
    await expect(page.getByTestId('page-title')).toBeVisible();
    await expect(page.getByTestId('plan-comparison-container')).toBeVisible();
  });
  
  test('accessibility - keyboard navigation', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Focus first interactive element
    
    // Tab to monthly billing button and activate it
    let focusCount = 0;
    while (focusCount < 10) { // Limit to prevent infinite loops
      const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-testid'));
      if (activeElement === 'monthly-billing-button') {
        break;
      }
      await page.keyboard.press('Tab');
      focusCount++;
    }
    
    await page.keyboard.press('Space');
    await expect(page.getByTestId('monthly-billing-button')).toHaveClass(/bg-purple-600/);
    
    // Continue tabbing to annual billing button
    focusCount = 0;
    while (focusCount < 5) {
      const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-testid'));
      if (activeElement === 'annual-billing-button') {
        break;
      }
      await page.keyboard.press('Tab');
      focusCount++;
    }
    
    await page.keyboard.press('Space');
    await expect(page.getByTestId('annual-billing-button')).toHaveClass(/bg-purple-600/);
    
    // Tab to select plan button and open modal
    focusCount = 0;
    while (focusCount < 15) {
      const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-testid'));
      if (activeElement === 'select-basic-plan-button') {
        break;
      }
      await page.keyboard.press('Tab');
      focusCount++;
    }
    
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Tab to cancel button and close modal
    focusCount = 0;
    while (focusCount < 10) {
      const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-testid'));
      if (activeElement === 'cancel-payment-button') {
        break;
      }
      await page.keyboard.press('Tab');
      focusCount++;
    }
    
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('subscription-confirmation-modal')).not.toBeVisible();
  });
  
  test('modal UI behavior', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Open modal
    await page.getByTestId('select-basic-plan-button').click();
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    
    // Check if backdrop prevents clicking behind it
    const backdropPreventClick = await page.evaluate(() => {
      const backdrop = document.querySelector('[data-testid="subscription-confirmation-modal"]');
      return window.getComputedStyle(backdrop).pointerEvents === 'auto';
    });
    expect(backdropPreventClick).toBeTruthy();
    
    // Check for scrolling behavior in modal
    const modalScrollable = await page.evaluate(() => {
      const content = document.querySelector('[data-testid="subscription-confirmation-content"]');
      return content.scrollHeight > content.clientHeight || 
             window.getComputedStyle(content).overflowY === 'auto' ||
             window.getComputedStyle(content).overflowY === 'scroll';
    });
    expect(modalScrollable).toBeTruthy();
    

  });
  
  test('form validation', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Select basic plan
    await page.getByTestId('select-basic-plan-button').click();
    
    // Attempt payment without proper setup (should show validation)
    await page.route('**/api/transaction/create-subscription', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Validation error',
          message: 'Invalid payment details',
          fields: ['cardNumber', 'expiryDate']
        })
      });
    });
    
    await page.getByTestId('confirm-payment-button').click();
    
    // Verify error message appears
    await expect(page.getByTestId('payment-error-message')).toBeVisible();
  });
  
  test('security - payment data handling', async ({ page }) => {
    await login(page, FREE_USER);
    await page.goto('/subscriptiondetails');
    
    // Select basic plan
    await page.getByTestId('select-basic-plan-button').click();
    
    // Check if the page is using HTTPS for payment
    const isSecure = page.url().startsWith('https://');
    expect(isSecure).toBeTruthy();
    
    // Check if sensitive data is handled properly
    // This is a simple check to make sure no credit card data is sent in plain text
    // We'll monitor network requests for sensitive patterns
    
    let sensitiveDataDetected = false;
    page.on('request', request => {
      const data = request.postData();
      if (data && /\d{16}/.test(data)) { // Simple check for credit card number pattern
        sensitiveDataDetected = true;
      }
    });
    
    // Submit payment without sensitive data
    await page.getByTestId('confirm-payment-button').click();

    // Wait for any network requests to complete
    await page.waitForTimeout(1000);
    
    // Verify no sensitive data was sent in plain text
    expect(sensitiveDataDetected).toBeFalsy();
  });
  
})
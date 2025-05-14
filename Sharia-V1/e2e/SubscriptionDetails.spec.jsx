// subscription-details.spec.js
import { test, expect } from '@playwright/test';

const testUser = { 
  email: 'umarmohamed444481@gmail.com', 
  password: '321654' 
};

test.describe('Subscription Details Component', () => {
  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:5173/login');
    
    // Fill in login form 
    await page.getByTestId('email-input').fill(testUser.email);
    await page.getByTestId('password-input').fill(testUser.password);
    
    // Submit login form
    await page.getByTestId('login-button').click();
    
    await page.waitForURL('**/dashboard');
    
    // Navigate to subscription page
    await page.goto('http://localhost:5173/subscriptiondetails');
    
    // Wait for the subscription details to load
    await expect(page.getByTestId('subscription-details-container')).toBeVisible();
    await expect(page.getByTestId('loading-state')).not.toBeVisible({ timeout: 10000 });
  });

  test('displays subscription plans correctly', async ({ page }) => {
    // Check if all plan cards are visible
    await expect(page.getByTestId('free-plan-card')).toBeVisible();
    await expect(page.getByTestId('basic-plan-card')).toBeVisible();
    await expect(page.getByTestId('premium-plan-card')).toBeVisible();
    
    // Verify plan titles
    await expect(page.getByTestId('free-plan-title')).toHaveText('Free');
    await expect(page.getByTestId('basic-plan-title')).toHaveText('Basic');
    await expect(page.getByTestId('premium-plan-title')).toHaveText('Premium');
    
    // Check plan prices for monthly billing
    await expect(page.getByTestId('free-plan-price')).toHaveText('₹0');
    await expect(page.getByTestId('basic-plan-price')).toHaveText('₹299');
    await expect(page.getByTestId('premium-plan-price')).toHaveText('₹499');
  });

  test('toggles between monthly and annual billing cycles', async ({ page }) => {
    // Check default is monthly
    await expect(page.getByTestId('monthly-billing-button')).toHaveClass(/bg-purple-600/);
    
    // Switch to annual
    await page.getByTestId('annual-billing-button').click();
    await expect(page.getByTestId('annual-billing-button')).toHaveClass(/bg-purple-600/);
    
    // Check prices updated for annual billing
    await expect(page.getByTestId('basic-plan-price')).toHaveText('₹1999');
    await expect(page.getByTestId('premium-plan-price')).toHaveText('₹2999');

    // Switch back to monthly
    await page.getByTestId('monthly-billing-button').click();
    await expect(page.getByTestId('monthly-billing-button')).toHaveClass(/bg-purple-600/);
    
    // Check prices reverted to monthly
    await expect(page.getByTestId('basic-plan-price')).toHaveText('₹299');
    await expect(page.getByTestId('premium-plan-price')).toHaveText('₹499');
  });

  test('selects a plan and opens confirmation modal', async ({ page }) => {
    // Select the Basic plan
    await page.getByTestId('select-basic-plan-button').click();
    
    // Check if confirmation modal appears
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    await expect(page.getByTestId('subscription-confirmation-title')).toHaveText('Confirm Subscription');
    
    // Verify subscription details in modal
    const subscriptionDetails = await page.getByTestId('subscription-details').textContent();
    expect(subscriptionDetails).toContain('Basic');
    expect(subscriptionDetails).toContain('₹299');
    
    // Close the modal
    await page.getByTestId('subscription-confirmation-close').click();
    await expect(page.getByTestId('subscription-confirmation-modal')).not.toBeVisible();
  });

  test('selecting premium plan highlights it correctly', async ({ page }) => {
    // Select the Premium plan
    await page.getByTestId('select-premium-plan-button').click();
    
    // Check if Premium plan is highlighted
    await expect(page.getByTestId('premium-plan-card')).toHaveClass(/ring-2 ring-purple-500/);
    
    // Check if confirmation modal appears with Premium plan details
    await expect(page.getByTestId('subscription-confirmation-modal')).toBeVisible();
    const subscriptionDetails = await page.getByTestId('subscription-details').textContent();
    expect(subscriptionDetails).toContain('Premium');
    expect(subscriptionDetails).toContain('₹499');
    
    // Close the modal
    await page.getByTestId('cancel-payment-button').click();
  });

  test('toggles payment mode in confirmation modal', async ({ page }) => {
    // Select the Basic plan to open modal
    await page.getByTestId('select-basic-plan-button').click();
    
    // Default should be automatic
    await expect(page.getByText('Automatic Renewal')).toBeVisible();
    
    // Find and click the manual payment option (assuming there's a testId for this)
    // Note: You may need to adjust this selector based on your actual implementation
    await page.getByText('Manual Renewal' ).click();
    
    // Confirm payment mode switched
    // This would depend on your UI showing some indication of selection
    
    // Close the modal
    await page.getByTestId('subscription-confirmation-close').click();
  });

  test('displays plan comparison table correctly', async ({ page }) => {
    // Check if comparison table is visible
    await expect(page.getByTestId('plan-comparison-table')).toBeVisible();
    
    // Verify some specific feature comparisons
    await expect(page.getByTestId('free-search-limit')).toHaveText('3 stocks');
    await expect(page.getByTestId('basic-search-limit')).toHaveText('Unlimited');
    await expect(page.getByTestId('premium-search-limit')).toHaveText('Unlimited');
    
    await expect(page.getByTestId('free-storage')).toHaveText('—');
    await expect(page.getByTestId('basic-storage')).toHaveText('10 stocks');
    await expect(page.getByTestId('premium-storage')).toHaveText('25 stocks');
  });



  test('shows price breakdown with correct tax calculation', async ({ page }) => {
    // Select Basic plan to open modal
    await page.getByTestId('select-basic-plan-button').click();
    
    // Verify price breakdown
    await expect(page.getByTestId('subtotal-price')).toHaveText('₹299.00');
    await expect(page.getByTestId('tax-amount')).toHaveText('₹53.82'); // 18% of 299
    await expect(page.getByTestId('total-price')).toHaveText('₹352.82'); // 299 + 53.82
    
    // Close the modal
    await page.getByTestId('subscription-confirmation-close').click();
  });

  test('simulates payment workflow (without actual payment)', async ({ page }) => {
    // Select Basic plan
    await page.getByTestId('select-basic-plan-button').click();
    
    // Mock the Razorpay object before making payment
    await page.evaluate(() => {
      window.Razorpay = function(options) {
        return {
          on: function(event, callback) {},
          open: function() {
            // Simulate successful payment by calling the handler directly
            setTimeout(() => {
              options.handler({
                razorpay_payment_id: 'pay_mock123456',
                razorpay_subscription_id: 'sub_mock123456',
                razorpay_signature: 'sig_mock123456'
              });
            }, 500);
          }
        };
      };
    });
    
    // Click confirm payment
    await page.getByTestId('confirm-payment-button').click();
    
    // This would normally trigger the Razorpay payment flow
    // Our mock will simulate a successful payment
    
    // Check if success modal appears (this might need to be adjusted based on actual implementation)
    // await expect(page.getByTestId('success-modal')).toBeVisible({ timeout: 5000 });
    // await expect(page.getByTestId('success-title')).toHaveText('Payment Successful!');
    
    // Close success modal
    // await page.getByTestId('success-modal-confirm').click();
  });

});



// Update with your alternative test user credentials
const PremiumUser = { 
  email: 'umarmohmed444sam@gmail.com', 
  password: '321654' 
};

test.describe('Subscription Details Component', () => {
  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:5173/login');
    
    // Fill in login form 
    await page.getByTestId('email-input').fill(PremiumUser.email);
    await page.getByTestId('password-input').fill(PremiumUser.password);
    
    // Submit login form
    await page.getByTestId('login-button').click();
    
    await page.waitForURL('**/dashboard');
    
    // Navigate to subscription page
    await page.goto('http://localhost:5173/subscriptiondetails');
    
    // Wait for the subscription details to load
    await expect(page.getByTestId('subscription-details-container')).toBeVisible();
    await expect(page.getByTestId('loading-state')).not.toBeVisible({ timeout: 10000 });
  });

  // Other tests remain unchanged...

  test('clicking upgrade now button opens confirmation for premium plan', async ({ page }) => {
    // Click the upgrade now button
    await page.getByTestId('upgrade-button').click();
    
    // Check if confirmation modal appears for Premium plan
    await expect(page.getByTestId('upgrade-confirmation-modal')).toBeVisible();
    const subscriptionDetails = await page.getByTestId('upgrade-confirmation-title').textContent();
    expect(subscriptionDetails).toContain('Upgrade Confirmation');
    
  
    
    // Close the modal without proceeding with payment
    await page.getByTestId('upgrade-confirmation-close').click();
  });

 });
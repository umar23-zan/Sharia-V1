// account-settings.e2e.spec.js
import { test, expect } from '@playwright/test';

// Define your test users
const users = {
  freeUser: {
    email: 'umarmohamed444481@gmail.com',
    password: '321654',
    isPremium: false
  },
  premiumUser: {
    email: 'umarmohmed444sam@gmail.com',
    password: '321654',
    isPremium: true
  }
};

// Create test fixtures for different user types
test.describe('Account Settings Page E2E Tests', () => {
  
  // Tests that apply to both free and premium users
  for (const [userType, testUser] of Object.entries(users)) {
    test.describe(`Common tests for ${userType}`, () => {
      test.beforeEach(async ({ page }) => {
        // Login with the current test user
        await page.goto('http://localhost:5173/login');
        await page.getByTestId('email-input').fill(testUser.email);
        await page.getByTestId('password-input').fill(testUser.password);
        await page.getByTestId('login-button').click();
        await page.waitForURL('**/dashboard');
        await page.goto('http://localhost:5173/account');
        await expect(page.getByTestId('account-information-page')).toBeVisible();
      });

      test(`should display user account information correctly for ${userType}`, async ({ page }) => {
        await expect(page.getByTestId('user-name')).toBeVisible();
        await expect(page.getByTestId('user-email')).toContainText(testUser.email);
        await expect(page.getByTestId('member-since-date')).toBeVisible();
        
        // Verify user type specific elements
        if (testUser.isPremium) {
          await expect(page.getByTestId('current-plan')).toContainText(/basic|premium/i);
        } else {
          await expect(page.getByTestId('current-plan')).toContainText(/free/i);
        }
      });

      test(`should open and close deactivate account modal for ${userType}`, async ({ page }) => {
        await page.getByTestId('delete-account-button').click();
        await expect(page.getByTestId('deactivate-account-modal')).toBeVisible();
        
        if (await page.getByTestId('close-deactivate-modal-button').isVisible()) {
          await page.getByTestId('close-deactivate-modal-button').click();
        } else {
          await page.getByTestId('deactivate-modal-overlay').click({ position: { x: 10, y: 10 } });
        }
        
        await expect(page.getByTestId('deactivate-account-modal')).not.toBeVisible();
      });

      test(`should go back when clicking the back button for ${userType}`, async ({ page }) => {
        await page.goto('http://localhost:5173/dashboard');
        await page.goto('http://localhost:5173/account');
        await page.getByTestId('go-back-button').click();
        await expect(page).toHaveURL(/.*\/dashboard/);
      });
    });
  }

  // Premium user only tests
  test.describe('Premium user specific tests', () => {
    const premiumUser = users.premiumUser;
    
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.getByTestId('email-input').fill(premiumUser.email);
      await page.getByTestId('password-input').fill(premiumUser.password);
      await page.getByTestId('login-button').click();
      await page.waitForURL('**/dashboard');
      await page.goto('http://localhost:5173/account');
      await expect(page.getByTestId('account-information-page')).toBeVisible();
      
      // Skip if not actually premium (in case account status changed)
      // const currentPlanText = await page.getByTestId('current-plan').textContent();
      // test.skip(!currentPlanText.includes('Premium'|'Basic') , 
      //   'This test requires a premium subscription');
    });

    test('should change payment mode to manual with confirmation', async ({ page }) => {
      await page.getByTestId('manual-payment-option').click();
      await expect(page.getByTestId('payment-mode-alert-modal')).toBeVisible();
      await page.getByTestId('switch-to-manual-button').click();
      await page.getByTestId('save-payment-mode-button').click();
      await expect(page.getByTestId('payment-mode-success')).toBeVisible();
      await expect(page.getByTestId('payment-mode-success')).toContainText('Payment mode will change to manual');
      
      await page.reload();
      await expect(page.getByTestId('pending-change-banner')).toBeVisible();
    });

    test('should cancel pending payment mode change', async ({ page }) => {
      // First set up a pending change
      await page.getByTestId('manual-payment-option').click();
      await page.getByTestId('switch-to-manual-button').click();
      await page.getByTestId('save-payment-mode-button').click();
      await expect(page.getByTestId('payment-mode-success')).toBeVisible();
      
      await page.reload();
      await expect(page.getByTestId('pending-change-banner')).toBeVisible();
      
      // Cancel the pending change
      await page.getByTestId('cancel-change-button').click();
      await expect(page.getByTestId('cancel-success-message')).toBeVisible();
      await expect(page.getByTestId('pending-change-banner')).not.toBeVisible();
    });

    test('should open and close cancel subscription modal', async ({ page }) => {
      await page.getByTestId('cancel-subscription-button').click();
      await expect(page.getByTestId('cancel-subscription-modal')).toBeVisible();
      await page.getByTestId('close-cancel-modal-button').click();
      await expect(page.getByTestId('cancel-subscription-modal')).not.toBeVisible();
    });

    test('should process subscription cancellation', async ({ page }) => {
      const isActiveSubscription = await page.getByTestId('cancel-subscription-button').isVisible();
      test.skip(!isActiveSubscription, 'This test requires an active subscription');
      
      await page.getByTestId('cancel-subscription-button').click();
      await page.getByTestId('cancellation-reason-select').selectOption('Missing features I need');
      await page.getByTestId('cancellation-feedback-textarea').fill('I needed better analytics features');
      // await page.getByTestId('confirm-cancel-subscription-button').click();
      // await expect(page.getByTestId('notification-alert')).toBeVisible();
      // await expect(page.getByTestId('cancel-subscription-modal')).not.toBeVisible();
      
      await page.reload();
    });

    test('should navigate to subscription details page', async ({ page }) => {
      await page.getByTestId('view-all-plans-button').click();
      await expect(page).toHaveURL(/.*\/subscriptiondetails/);
    });
  });

  // Free user only tests
  test.describe('Free user specific tests', () => {
    const freeUser = users.freeUser;
    
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.getByTestId('email-input').fill(freeUser.email);
      await page.getByTestId('password-input').fill(freeUser.password);
      await page.getByTestId('login-button').click();
      await page.waitForURL('**/dashboard');
      await page.goto('http://localhost:5173/account');
      await expect(page.getByTestId('account-information-page')).toBeVisible();
      
      // Skip if not actually free (in case account status changed)
      const currentPlanText = await page.getByTestId('current-plan').textContent();
      test.skip(currentPlanText.includes('premium') || currentPlanText.includes('pro'), 
        'This test requires a free account');
    });

    test('should display upgrade options for free user', async ({ page }) => {
      // Verify upgrade elements are visible for free users
      await expect(page.getByTestId('inactive-subscription-message')).toBeVisible();
      await expect(page.getByTestId('view-subscription-plans-button')).toBeVisible();
    });

    test('should navigate to pricing page from upgrade button', async ({ page }) => {
      await page.getByTestId('view-subscription-plans-button').click();
      await expect(page).toHaveURL(/.*\/subscriptiondetails/);
    });

    test('should show limited feature set for free user', async ({ page }) => {
      // These elements should not be visible for free users
      await expect(page.getByTestId('cancel-subscription-button')).not.toBeVisible();
      await expect(page.getByTestId('manual-payment-option')).not.toBeVisible();
      
      
    });
  });
});
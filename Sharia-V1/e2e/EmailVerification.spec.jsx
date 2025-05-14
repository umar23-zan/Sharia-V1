import { test, expect } from '@playwright/test';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock API responses
const server = setupServer(
  // Token verification endpoint
  rest.post('/api/auth/tokenverify', (req, res, ctx) => {
    const { token } = req.body;
    
    if (token === 'valid-token') {
      return res(ctx.status(200), ctx.json({ success: true }));
    } else {
      return res(ctx.status(400), ctx.json({ msg: 'Invalid or expired token' }));
    }
  }),
  
  // Email verification endpoint
  rest.post('/api/auth/verify', (req, res, ctx) => {
    const { token } = req.body;
    
    if (token === 'valid-token') {
      return res(ctx.status(200), ctx.json({ success: true, data: 'Email verified successfully!' }));
    } else {
      return res(ctx.status(400), ctx.json({ msg: 'Verification failed. The link may be invalid or expired.' }));
    }
  }),
  
  // Resend verification endpoint
  rest.post('/api/auth/resend-verification', (req, res, ctx) => {
    const { email } = req.body;
    
    if (email === 'invalid@example.com') {
      return res(ctx.status(400), ctx.json({ msg: 'User not found' }));
    } else {
      return res(ctx.status(200), ctx.json({ success: true, data: 'Verification email sent successfully' }));
    }
  })
);

test.beforeAll(() => server.listen());
test.afterAll(() => server.close());
test.afterEach(() => server.resetHandlers());

test.describe('Email Verification Page', () => {
  test('displays verification pending state with valid token', async ({ page }) => {
    // Mock the useParams hook to return a valid token
    await page.route('**/*', route => {
      if (route.request().url().includes('/verify/valid-token')) {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ token: 'valid-token' })
        });
      } else {
        route.continue();
      }
    });
    
    await page.goto('http://localhost:5173/verify/valid-token');
    
    // Check initial state
    await expect(page.getByTestId('email-verification-page')).toBeVisible();
    await expect(page.getByTestId('company-logo')).toBeVisible();
    await expect(page.getByTestId('mail-icon')).toBeVisible();
    await expect(page.getByTestId('verification-title')).toBeVisible();
    await expect(page.getByTestId('verify-button')).toBeVisible();
  });
  
  test('handles successful email verification', async ({ page }) => {
    // Mock the API responses
    await page.route('**/api/auth/tokenverify', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.route('**/api/auth/verify', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: 'Email verified successfully!' })
      });
    });
    
    await page.goto('/verify/valid-token');
    
    // Click verify button
    await page.getByTestId('verify-button').click();
    
    // Check loading state
    await expect(page.getByTestId('loading-icon')).toBeVisible();
    await expect(page.getByTestId('verifying-title')).toBeVisible();
    
    // Check success state
    await expect(page.getByTestId('success-icon')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('verify-email')).toBeVisible();
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('proceed-to-login-button')).toBeVisible();
    
    // Test navigation to login
    await page.getByTestId('proceed-to-login-button').click();
    expect(page.url()).toContain('/login');
  });
  
  test('handles verification error with invalid token', async ({ page }) => {
    // Mock the API responses
    await page.route('**/api/auth/tokenverify', async route => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ msg: 'Invalid or expired token' })
      });
    });
    
    await page.goto('/verify/invalid-token');
    
    // Check error state
    await expect(page.getByTestId('error-icon')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('verify-fail')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Invalid or expired token');
    await expect(page.getByTestId('try-signup-again-button')).toBeVisible();
    await expect(page.getByTestId('return-home-button')).toBeVisible();
    
    // Test navigation to signup
    await page.getByTestId('try-signup-again-button').click();
    expect(page.url()).toContain('/signup');
  });
  
  test('shows no token message when token is missing', async ({ page }) => {
    await page.goto('/verify/');
    
    // Click verify button (should show error)
    await page.getByTestId('verify-button').click();
    
    // Check error state
    await expect(page.getByTestId('error-icon')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('error-message')).toContainText('No verification token found');
  });
  
  test('resend verification email flow works correctly', async ({ page }) => {
    // Mock the API responses
    await page.route('**/api/auth/tokenverify', async route => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ msg: 'Invalid or expired token' })
      });
    });
    
    await page.route('**/api/auth/resend-verification', async route => {
      const body = JSON.parse(route.request().postData() || '{}');
      if (body.email === 'test@example.com') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.fulfill({
          status: 400,
          body: JSON.stringify({ msg: 'User not found' })
        });
      }
    });
    
    await page.goto('/verify/invalid-token');
    
    // Open resend form
    await expect(page.getByTestId('resend-section')).toBeVisible();
    await page.getByTestId('resend-link').click();
    await expect(page.getByTestId('resend-form-container')).toBeVisible();
    
    // Submit empty form (should show error)
    await page.getByTestId('resend-submit-button').click();
    await expect(page.getByTestId('resend-error-message')).toBeVisible();
    
    // Submit with valid email
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('resend-submit-button').click();
    
    // Check loading state
    await expect(page.getByTestId('loading-icon-resend')).toBeVisible();
    
    // Check success state
    await expect(page.getByTestId('resend-success-message')).toBeVisible({ timeout: 5000 });
    
    // Form should auto-hide after success
    await expect(page.getByTestId('resend-form-container')).not.toBeVisible({ timeout: 5000 });
  });
  
  test('resend verification handles error state', async ({ page }) => {
    // Mock the API responses
    await page.route('**/api/auth/tokenverify', async route => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ msg: 'Invalid or expired token' })
      });
    });
    
    await page.route('**/api/auth/resend-verification', async route => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ msg: 'User not found' })
      });
    });
    
    await page.goto('/verify/invalid-token');
    
    // Open resend form
    await page.getByTestId('resend-link').click();
    
    // Submit with invalid email
    await page.getByTestId('email-input').fill('invalid@example.com');
    await page.getByTestId('resend-submit-button').click();
    
    // Check error state
    await expect(page.getByTestId('resend-error-message')).toBeVisible({ timeout: 5000 });
  });
  
  test('cancel button closes resend form', async ({ page }) => {
    await page.goto('/verify/invalid-token');
    
    // Open resend form
    await page.getByTestId('resend-link').click();
    await expect(page.getByTestId('resend-form-container')).toBeVisible();
    
    // Click cancel
    await page.getByTestId('cancel-resend-button').click();
    
    // Form should be hidden
    await expect(page.getByTestId('resend-form-container')).not.toBeVisible();
  });
  
  test('navigation to home works correctly', async ({ page }) => {
    // Mock the API responses
    await page.route('**/api/auth/tokenverify', async route => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ msg: 'Invalid or expired token' })
      });
    });
    
    await page.goto('/verify/invalid-token');
    
    // Click return home button
    await page.getByTestId('return-home-button').click();
    expect(page.url()).toContain('/');
  });
});
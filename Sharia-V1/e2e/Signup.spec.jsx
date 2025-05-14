import { test, expect } from '@playwright/test';

test.describe('Signup Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for auth
    await page.route('**/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.route('**/api/auth/google', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ url: 'https://accounts.google.com/auth' })
      });
    });
    
    // Navigate to signup page
    await page.goto('http://localhost:5173/signup');
  });

  test('should display the signup page with all elements', async ({ page }) => {
    // Check page container
    await expect(page.getByTestId('signup-page-container')).toBeVisible();
    
    // Check logo and heading
    await expect(page.getByTestId('company-logo')).toBeVisible();
    await expect(page.getByTestId('signup-heading')).toHaveText('Create Your Account');
    
    // Check form fields
    await expect(page.getByTestId('name-input')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('confirm-password-input')).toBeVisible();
    
    // Check terms checkbox
    await expect(page.getByTestId('terms-input')).toBeVisible();
    
    // Check buttons
    await expect(page.getByTestId('signup-button')).toBeVisible();
    await expect(page.getByTestId('google-signup-button')).toBeVisible();
    
    // Check login redirect link
    await expect(page.getByTestId('login-link')).toBeVisible();
  });

  test('should validate form inputs and show error messages', async ({ page }) => {
    // Click signup without filling anything
    await page.getByTestId('signup-button').click();
    
    // Check error message
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Please enter your name');
    
    // Fill only name
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('signup-button').click();
    
    // Check error message
    await expect(page.getByTestId('error-message')).toContainText('Please enter your email address');
    
    // Fill invalid email
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('signup-button').click();
    
    // Check error message
    await expect(page.getByTestId('error-message')).toContainText('Please enter a valid email address');
    
    // Fill valid email
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('signup-button').click();
    
    // Check error message
    await expect(page.getByTestId('error-message')).toContainText('Password must be at least 6 characters long');
    
    // Fill short password
    await page.getByTestId('password-input').fill('12345');
    await page.getByTestId('signup-button').click();
    
    // Check error message
    await expect(page.getByTestId('error-message')).toContainText('Password must be at least 6 characters long');
    
    // Fill valid password but mismatched
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('confirm-password-input').fill('abcdef');
    await page.getByTestId('signup-button').click();
    
    // Check error message
    await expect(page.getByTestId('error-message')).toContainText('Passwords do not match');
    
    // Fix password match but no terms agreement
    await page.getByTestId('confirm-password-input').fill('123456');
    await page.getByTestId('signup-button').click();
    
    // Check error message
    await expect(page.getByTestId('error-message')).toContainText('You must agree to the Terms and Conditions');
  });

  test('should toggle password visibility', async ({ page }) => {
    // Initial state: password should be hidden
    await expect(page.getByTestId('password-input')).toHaveAttribute('type', 'password');
    
    // Click toggle button
    await page.getByTestId('toggle-password-visibility').click();
    
    // Password should now be visible
    await expect(page.getByTestId('password-input')).toHaveAttribute('type', 'text');
    
    // Click toggle button again
    await page.getByTestId('toggle-password-visibility').click();
    
    // Password should be hidden again
    await expect(page.getByTestId('password-input')).toHaveAttribute('type', 'password');
    
    // Same test for confirm password
    await expect(page.getByTestId('confirm-password-input')).toHaveAttribute('type', 'password');
    await page.getByTestId('toggle-confirm-password-visibility').click();
    await expect(page.getByTestId('confirm-password-input')).toHaveAttribute('type', 'text');
  });

  test('should successfully submit the form with valid data', async ({ page }) => {
    // Mock signup API
    const signupPromise = page.waitForRequest(request => 
      request.url().includes('/api/auth/signup') && 
      request.method() === 'POST'
    );
    
    // Fill valid form data
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password123');
    await page.getByTestId('terms-input').check();
    
    // Submit form
    await page.getByTestId('signup-button').click();
    
    // Wait for request to be made
    await signupPromise;
    
    // Check success message
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('success-message')).toContainText('Signup successful');
    
    // Form should be reset
    await expect(page.getByTestId('name-input')).toHaveValue('');
    await expect(page.getByTestId('email-input')).toHaveValue('');
    await expect(page.getByTestId('password-input')).toHaveValue('');
    await expect(page.getByTestId('confirm-password-input')).toHaveValue('');
    await expect(page.getByTestId('terms-input')).not.toBeChecked();
  });

  test('should show loading state during form submission', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/auth/signup', async (route) => {
      // Wait a bit to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      });
    });
    
    // Fill valid form data
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password123');
    await page.getByTestId('terms-input').check();
    
    // Submit form
    await page.getByTestId('signup-button').click();
    
    // Check loading spinner
    await expect(page.getByTestId('loading-spinner')).toBeVisible();
    
    await expect(page.getByTestId('signup-button')).toContainText('Creating Account');
    
    // Wait for loading to complete
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
  });

  test('should handle signup API errors', async ({ page }) => {
    // Mock API error
    await page.route('**/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ msg: 'Email already exists' })
      });
    });
    
    // Fill valid form data
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password123');
    await page.getByTestId('terms-input').check();
    
    // Submit form
    await page.getByTestId('signup-button').click();
    
    // Check error message
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Email already exists');
  });

  test('should open terms modal when clicking on terms link', async ({ page }) => {
    // Click terms link
    await page.getByTestId('terms-link').click();
    
    // Check if terms modal appears
    await expect(page.getByTestId('terms-modal')).toBeVisible();
  });

  test('should open privacy modal when clicking on privacy link', async ({ page }) => {
    // Click privacy link
    await page.getByTestId('privacy-link').click();
    
    // Check if privacy modal appears
    await expect(page.getByTestId('privacy-modal')).toBeVisible();
  });

  test('should navigate to login page when clicking login link', async ({ page }) => {
    // Setup navigation listener
    const navigationPromise = page.waitForNavigation();
    
    // Click login link
    await page.getByTestId('login-link').click();
    
    // Wait for navigation to complete
    await navigationPromise;
    
    // Check URL is login page
    expect(page.url()).toContain('/login');
  });

  test('should navigate back when clicking back button', async ({ page }) => {
    // Mock home page navigation
    await page.evaluate(() => {
      window.history.pushState({}, '', '/');
      window.history.pushState({}, '', '/signup');
    });
    
    // Setup navigation listener
    const navigationPromise = page.waitForNavigation();
    
    // Click back button
    await page.getByTestId('back-button').click();
    
    // Wait for navigation to complete
    await navigationPromise;
    
    // Check URL is home page
    expect(page.url()).not.toContain('/signup');
  });

  test('should attempt Google signup when clicking Google button', async ({ page }) => {
    // Mock Google auth redirect
    const googleAuthPromise = page.waitForRequest(request => 
      request.url().includes('/api/auth/google')
    );
    
    // Click Google signup button
    await page.getByTestId('google-signup-button').click();
    
    // Wait for Google auth request
    await googleAuthPromise;
    
    // In a real test, we could mock window.location changes to verify the redirect
  });
});
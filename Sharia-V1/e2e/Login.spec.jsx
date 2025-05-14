import { test, expect } from '@playwright/test';

test.describe('Login Page E2E Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    // Navigate to the login page first
    await page.goto('/login');
    
    // Make sure page is fully loaded
    await page.waitForLoadState('networkidle');
    
    // Then clear localStorage
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Failed to clear localStorage:', e);
      }
    });
  });

  test('should display all login page elements correctly', async ({ page }) => {
    // Check if the login page container is visible
    await expect(page.getByTestId('login-page')).toBeVisible();
    
    // Check if the logo is visible
    await expect(page.getByTestId('app-logo')).toBeVisible();
    
    // Check if the welcome heading is visible and has correct text
    await expect(page.getByTestId('welcome-heading')).toBeVisible();
    await expect(page.getByTestId('welcome-heading')).toHaveText('Welcome Back');
    
    // Check if form elements are visible
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('google-login-button')).toBeVisible();
    await expect(page.getByTestId('signup-link')).toBeVisible();
    await expect(page.getByTestId('forgot-password-link')).toBeVisible();
  });

  test('should toggle password visibility when clicking the eye icon', async ({ page }) => {
    // Initially password field should be of type password
    await expect(page.getByTestId('password-input')).toHaveAttribute('type', 'password');
    
    // Click the toggle button
    await page.getByTestId('toggle-password-visibility').click();
    
    // Now password field should be of type text
    await expect(page.getByTestId('password-input')).toHaveAttribute('type', 'text');
    
    // Click the toggle button again
    await page.getByTestId('toggle-password-visibility').click();
    
    // Password field should be back to type password
    await expect(page.getByTestId('password-input')).toHaveAttribute('type', 'password');
  });

  test('should show validation error for empty email', async ({ page }) => {
    // Fill only password field and submit
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    
    // Check if error message appears
    await expect(page.getByTestId('status-message')).toBeVisible();
    await expect(page.getByTestId('status-message')).toContainText('Please enter your email address');
  });

  test('should show validation error for empty password', async ({ page }) => {
    // Fill only email field and submit
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('login-button').click();
    
    // Check if error message appears
    await expect(page.getByTestId('status-message')).toBeVisible();
    await expect(page.getByTestId('status-message')).toContainText('Please enter your password');
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // Fill invalid email and valid password
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    
    // Check if error message appears
    await expect(page.getByTestId('status-message')).toBeVisible();
    await expect(page.getByTestId('status-message')).toContainText('Please enter a valid email address');
  });

  test('should handle successful login', async ({ page }) => {
    // Mock the login API call
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '123',
          email: 'test@example.com',
          name: 'Test User'
        })
      });
    });
    
    // Fill in valid credentials
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    
    // Submit the form
    await page.getByTestId('login-button').click();
    
    // Check for success message
    await expect(page.getByTestId('status-message')).toBeVisible();
    await expect(page.getByTestId('status-message')).toContainText('Login successful!');
    
    // Verify localStorage was updated
    const userEmail = await page.evaluate(() => localStorage.getItem('userEmail'));
    expect(userEmail).toBe('test@example.com');
    
    const userId = await page.evaluate(() => localStorage.getItem('userId'));
    expect(userId).toBe('123');
    
    // Wait for redirect to dashboard (allowing time for the setTimeout in the component)
    await page.waitForURL('/dashboard', { timeout: 2000 });
  });

  test('should handle login failure with invalid credentials', async ({ page }) => {
    // Mock failed login API call - 400 Bad Request (invalid credentials)
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' })
      });
    });
    
    // Fill in credentials
    await page.getByTestId('email-input').fill('wrong@example.com');
    await page.getByTestId('password-input').fill('wrongpassword');
    
    // Submit the form
    await page.getByTestId('login-button').click();
    
    // Check for error message
    await expect(page.getByTestId('status-message')).toBeVisible();
    await expect(page.getByTestId('status-message')).toContainText('Invalid email or password');
    
    // Verify we're still on the login page
    expect(page.url()).toContain('/login');
  });

  test('should handle login failure with server error', async ({ page }) => {
    // Mock failed login API call - 500 Server Error
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server error' })
      });
    });
    
    // Fill in credentials
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    
    // Submit the form
    await page.getByTestId('login-button').click();
    
    // Check for error message
    await expect(page.getByTestId('status-message')).toBeVisible();
    await expect(page.getByTestId('status-message')).toContainText('Server error');
    
    // Verify we're still on the login page
    expect(page.url()).toContain('/login');
  });

  test('should handle network failure during login', async ({ page }) => {
    // Mock network failure during login API call
    await page.route('**/api/auth/login', route => route.abort('failed'));
    
    // Fill in credentials
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    
    // Submit the form
    await page.getByTestId('login-button').click();
    
    // Check for error message
    await expect(page.getByTestId('status-message')).toBeVisible();
    await expect(page.getByTestId('status-message')).toContainText('Something went wrong');
    
    // Verify we're still on the login page
    expect(page.url()).toContain('/login');
  });

  test('should display loading state when submitting form', async ({ page }) => {
    // Create a slow responding mock for the login API
    await page.route('**/api/auth/login', async (route) => {
      // Delay the response to see loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '123',
          email: 'test@example.com',
          name: 'Test User'
        })
      });
    });
    
    // Fill in credentials
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    
    // Submit the form
    await page.getByTestId('login-button').click();
    
    // Check for loading state
    await expect(page.getByTestId('login-button')).toContainText('Logging in...');
    
    // Verify button is disabled during loading
    await expect(page.getByTestId('login-button')).toBeDisabled();
    
    // Wait for success message to appear
    await expect(page.getByTestId('status-message')).toBeVisible();
    await expect(page.getByTestId('status-message')).toContainText('Login successful!');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Click on forgot password link
    await page.getByTestId('forgot-password-link').click();
    
    // Verify navigation to forgot password page
    expect(page.url()).toContain('/forgot-password');
  });

  test('should navigate to signup page', async ({ page }) => {
    // Click on signup link
    await page.getByTestId('signup-link').click();
    
    // Verify navigation to signup page
    expect(page.url()).toContain('/signup');
  });

  test('should navigate back to home page', async ({ page }) => {
    // Click on back button
    await page.getByTestId('back-button').click();
    
    // Verify navigation to home page
    expect(page.url()).toBe('http://localhost:5173/');
  });

  test('should redirect to dashboard if already logged in', async ({ page }) => {
    // Set localStorage to simulate already logged in user
    await page.evaluate(() => {
      localStorage.setItem('userEmail', 'test@example.com');
    });
    
    // Navigate to login page
    await page.goto('/login');
    
    // Should be redirected to dashboard
    await page.waitForURL('/Dashboard');
  });

  // test('should attempt Google sign-in when clicking Google button', async ({ page }) => {
  //   // Mock the Google sign-in process
  //   let _googleSignInCalled = false;
    
  //   // Create a spy on the window.open method which is typically called by initiateGoogleSignIn
  //   await page.addInitScript(() => {
  //     const originalOpen = window.open;
  //     window.open = (...args) => {
  //       window._googleSignInCalled = true;
  //       window._googleSignInUrl = args[0];
  //       return originalOpen(...args);
  //     };
  //   });
    
  //   // Click on Google sign-in button
  //   await page.getByTestId('google-login-button').click();
    
  //   // Check if the Google sign-in was initiated
  //   const googleSignInCalled = await page.evaluate(() => window._googleSignInCalled || false);
  //   expect(googleSignInCalled).toBeTruthy();
    
  //   // Optionally check the URL if your implementation sets a specific URL
  //   const googleSignInUrl = await page.evaluate(() => window._googleSignInUrl || '');
  //   console.log('Google sign-in URL:', googleSignInUrl);
  //   expect(googleSignInUrl).toBeTruthy();
  // });

  

  test('should make form inputs accessibly labeled', async ({ page }) => {
    // Check if email input is properly associated with its label
    const emailLabelFor = await page.getByTestId('email-label').getAttribute('for');
    const emailInputId = await page.getByTestId('email-input').getAttribute('id');
    expect(emailLabelFor).toBe(emailInputId);
    
    // Check if password input is properly associated with its label
    const passwordLabelFor = await page.getByTestId('password-label').getAttribute('for');
    const passwordInputId = await page.getByTestId('password-input').getAttribute('id');
    expect(passwordLabelFor).toBe(passwordInputId);
  });

  test('should disable form inputs during loading state', async ({ page }) => {
    // Create a slow responding mock for the login API
    await page.route('**/api/auth/login', async (route) => {
      // Delay the response to see loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '123',
          email: 'test@example.com',
          name: 'Test User'
        })
      });
    });
    
    // Fill in credentials
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('password123');
    
    // Submit the form
    await page.getByTestId('login-button').click();
    
    // Check that inputs are disabled during loading
    await expect(page.getByTestId('email-input')).toBeDisabled();
    await expect(page.getByTestId('password-input')).toBeDisabled();
    await expect(page.getByTestId('forgot-password-link')).toBeDisabled();
  });
});
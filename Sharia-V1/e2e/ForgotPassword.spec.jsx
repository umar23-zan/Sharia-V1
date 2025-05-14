// forgot-password.spec.js
import { test, expect } from '@playwright/test';

test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to forgot password page
    await page.goto('http://localhost:5173/forgot-password');
  });

  test('should render the forgot password page correctly', async ({ page }) => {
    // Check if the page is rendered
    await expect(page.getByTestId('forgot-password-page')).toBeVisible();
    
    // Check if logo is displayed
    await expect(page.getByTestId('logo')).toBeVisible();
    
    // Check if the form elements are displayed
    await expect(page.getByTestId('forgot-password-form')).toBeVisible();
    await expect(page.getByTestId('email-label')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();
    
    // Check if login link is displayed
    await expect(page.getByTestId('login-link')).toBeVisible();
    await expect(page.getByTestId('login-link')).toHaveText('Log in here');
    
    // Check if back button is displayed
    await expect(page.getByTestId('back-button')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Submit form without entering an email
    await page.getByTestId('submit-button').click();
    
    // Check if browser validation kicks in (this is HTML5 validation)
    const emailInput = page.getByTestId('email-input');
    await expect(emailInput).toBeFocused();
    
    // Enter invalid email format and try to submit
    await emailInput.fill('invalid-email');
    await page.getByTestId('submit-button').click();
    
    // Browser validation should prevent submission
    await expect(emailInput).toBeFocused();
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // Click on the login link
    await page.getByTestId('login-link').click();
    
    // Check if we've navigated to the login page
    await expect(page).toHaveURL('/login');
  });

  test('should go back when back button is clicked', async ({ page }) => {
    // Navigate to some page first so we have history
    await page.goto('/login');
    // Then navigate to forgot-password
    await page.goto('/forgot-password');
    
    // Click the back button
    await page.getByTestId('back-button').click();
    
    // Check if we've navigated back to login
    await expect(page).toHaveURL('/login');
  });

  test('should show success message on successful password reset request', async ({ page }) => {
    // Mock the API response for successful password reset
    await page.route('**/api/auth/forgot-password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ msg: 'Password reset link sent to your email!' })
      });
    });
    
    // Fill the email field
    await page.getByTestId('email-input').fill('user@example.com');
    
    // Submit the form
    await page.getByTestId('submit-button').click();
    
    // Check if loading state is shown (this might be quick, so we need to be careful with timing)
    
    // Check if success message is displayed
    await expect(page.getByTestId('alert-message')).toBeVisible();
    await expect(page.getByTestId('alert-message')).toHaveText('Password reset link sent to your email!');
    
    // Check if email field is cleared
    await expect(page.getByTestId('email-input')).toHaveValue('');
  });

  test('should show error message on failed password reset request', async ({ page }) => {
    // Mock the API response for failed password reset
    await page.route('**/api/auth/forgot-password', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ msg: 'User with this email does not exist.' })
      });
    });
    
    // Fill the email field
    await page.getByTestId('email-input').fill('nonexistent@example.com');
    
    // Submit the form
    await page.getByTestId('submit-button').click();
    
    // Check if error message is displayed
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toHaveText('User with this email does not exist.');
    
    // Check if email field still has the value
    await expect(page.getByTestId('email-input')).toHaveValue('nonexistent@example.com');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock a network error
    await page.route('**/api/auth/forgot-password', async (route) => {
      await route.abort('failed');
    });
    
    // Fill the email field
    await page.getByTestId('email-input').fill('user@example.com');
    
    // Submit the form
    await page.getByTestId('submit-button').click();
    
    // Check if error message is displayed
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toHaveText('Error sending reset password link.');
  });

  test('should disable the form during submission', async ({ page }) => {
    // Set up a delayed response to test loading state
    await page.route('**/api/auth/forgot-password', async (route) => {
      // Delay the response by 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ msg: 'Password reset link sent to your email!' })
      });
    });
    
    // Fill the email field
    await page.getByTestId('email-input').fill('user@example.com');
    
    // Submit the form
    await page.getByTestId('submit-button').click();
    
    // Check if button shows loading state
    await expect(page.getByTestId('submit-button')).toHaveText('✉️ Sending link...');
    
    // Check if input and button are disabled during loading
    await expect(page.getByTestId('email-input')).toBeDisabled();
    await expect(page.getByTestId('submit-button')).toBeDisabled();
    
    // Wait for the loading to complete and check if the form is enabled again
    await expect(page.getByTestId('alert-message')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('email-input')).not.toBeDisabled();
    await expect(page.getByTestId('submit-button')).not.toBeDisabled();
    await expect(page.getByTestId('submit-button')).toHaveText('✉️ Send Reset Link');
  });
});
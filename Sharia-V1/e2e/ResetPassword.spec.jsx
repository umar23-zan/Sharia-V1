import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Reset Password Page', () => {
  const mockToken = 'test-reset-token';
  const baseUrl = 'http://localhost:5173'; // Update with your actual base URL

  test.beforeEach(async ({ page }) => {
    // Navigate to the reset password page with a mock token
    await page.goto(`${baseUrl}/reset-password/${mockToken}`);
  });

  test('should display all required elements on the page', async ({ page }) => {
    // Check presence of main container
    await expect(page.getByTestId('reset-password-container')).toBeVisible();
    
    // Check logo
    await expect(page.getByTestId('logo-image')).toBeVisible();
    
    // Check back button
    await expect(page.getByTestId('back-to-login-button')).toBeVisible();
    
    // Check form elements
    await expect(page.getByTestId('reset-password-form')).toBeVisible();
    await expect(page.getByTestId('password-label')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('confirm-password-label')).toBeVisible();
    await expect(page.getByTestId('confirm-password-input')).toBeVisible();
    await expect(page.getByTestId('toggle-password-visibility')).toBeVisible();
    await expect(page.getByTestId('toggle-confirm-password-visibility')).toBeVisible();
    await expect(page.getByTestId('reset-password-button')).toBeVisible();
    await expect(page.getByTestId('help-text')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByTestId('password-input');
    const confirmPasswordInput = page.getByTestId('confirm-password-input');
    
    // Check initial password field type is "password" (hidden)
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Click toggle buttons
    await page.getByTestId('toggle-password-visibility').click();
    await page.getByTestId('toggle-confirm-password-visibility').click();
    
    // Check that types have changed to "text" (visible)
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    
    // Click toggle buttons again
    await page.getByTestId('toggle-password-visibility').click();
    await page.getByTestId('toggle-confirm-password-visibility').click();
    
    // Check that types have changed back to "password" (hidden)
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  test('should show error when passwords do not match', async ({ page }) => {
    // Enter different passwords
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('confirm-password-input').fill('password456');
    
    // Submit form
    await page.getByTestId('reset-password-button').click();
    
    // Check error message appears
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Passwords do not match');
  });

  test('should show error when password is too short', async ({ page }) => {
    // Enter short password (less than 6 characters)
    await page.getByTestId('password-input').fill('pass');
    await page.getByTestId('confirm-password-input').fill('pass');
    
    // Submit form
    await page.getByTestId('reset-password-button').click();
    
    // Check error message appears
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('at least 6 characters');
  });

  test('should handle successful password reset', async ({ page }) => {
    // Mock the API response
    await page.route(`**/api/auth/reset-password/${mockToken}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password reset successfully.' })
      });
    });
    
    // Enter valid matching passwords
    const password = faker.internet.password({ length: 10 });
    await page.getByTestId('password-input').fill(password);
    await page.getByTestId('confirm-password-input').fill(password);
    
    // Submit form
    await page.getByTestId('reset-password-button').click();
    
    // Check success message appears
    const successMessage = page.getByTestId('success-message');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('Password reset successfully');
    
    // Check form inputs are cleared
    await expect(page.getByTestId('password-input')).toHaveValue('');
    await expect(page.getByTestId('confirm-password-input')).toHaveValue('');
    
    // Check button state shows success
    await expect(page.getByTestId('reset-password-button')).toContainText('Password Reset');
  });

  test('should handle API error response', async ({ page }) => {
    // Mock a failed API response
    await page.route(`**/api/auth/reset-password/${mockToken}`, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Token is invalid or has expired.' })
      });
    });
    
    // Enter valid matching passwords
    const password = faker.internet.password({ length: 10 });
    await page.getByTestId('password-input').fill(password);
    await page.getByTestId('confirm-password-input').fill(password);
    
    // Submit form
    await page.getByTestId('reset-password-button').click();
    
    // Check error message appears with API error
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Token is invalid or has expired');
  });

  test('should navigate back to login page when back button is clicked', async ({ page }) => {
    // Set up navigation listener
    const navigationPromise = page.waitForURL(`${baseUrl}/login`);
    
    // Click back button
    await page.getByTestId('back-to-login-button').click();
    
    // Wait for navigation to complete
    await navigationPromise;
    
    // Verify URL changed to login page
    expect(page.url()).toBe(`${baseUrl}/login`);
  });

  test('should navigate to login after successful password reset', async ({ page }) => {
    // Set up navigation listener
    const navigationPromise = page.waitForURL(`${baseUrl}/login`);
    
    // Mock the API response
    await page.route(`**/api/auth/reset-password/${mockToken}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password reset successfully.' })
      });
    });
    
    // Enter valid matching passwords
    const password = faker.internet.password({ length: 10 });
    await page.getByTestId('password-input').fill(password);
    await page.getByTestId('confirm-password-input').fill(password);
    
    // Submit form
    await page.getByTestId('reset-password-button').click();
    
    // Wait for navigation to complete (after the 3 second timeout)
    await navigationPromise;
    
    // Verify URL changed to login page
    expect(page.url()).toBe(`${baseUrl}/login`);
  });
});
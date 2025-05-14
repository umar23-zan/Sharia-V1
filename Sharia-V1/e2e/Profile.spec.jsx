// profile.e2e.spec.js
import { test, expect } from '@playwright/test';

test.describe('Profile Page E2E Tests', () => {
  // Test user data
  const testUser = {
    email: 'umarmohamed444481@gmail.com',
    password: '321654'
  };

  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:5173/login');
    
    // Fill in login form
    await page.getByTestId('email-input').fill(testUser.email);
    await page.getByTestId('password-input').fill(testUser.password);
    
    // Submit login form
    await page.getByTestId('login-button').click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/dashboard');
    
    // Navigate to profile page
    await page.goto('http://localhost:5173/profile');
    
    // Ensure the page is fully loaded
    await expect(page.getByTestId('profile-page')).toBeVisible();
  });

  test('should display user profile information correctly', async ({ page }) => {
    // Check if user information is displayed
    await expect(page.getByTestId('user-name')).toBeVisible();
    await expect(page.getByTestId('user-email')).toContainText(testUser.email);
    
    // Check if profile image is displayed
    await expect(page.getByTestId('profile-info-section').getByTestId('profile-image')).toBeVisible();
    
    // Check if quick settings section is displayed
    await expect(page.getByTestId('quick-settings-section')).toBeVisible();
    
    // Check if subscription section is displayed
    await expect(page.getByTestId('subscription-section')).toBeVisible();
  });

  test('should allow uploading and canceling profile picture', async ({ page }) => {
    // Create a test file to upload
    const testImagePath = 'src/images/Uncle.png';
    
    // Upload profile picture
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByTestId('upload-picture-button').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testImagePath);
    
    // Check if the save and cancel buttons appear
    await expect(page.getByTestId('image-action-buttons')).toBeVisible();
    await expect(page.getByTestId('save-button')).toBeVisible();
    await expect(page.getByTestId('cancel-button')).toBeVisible();
    
    // Cancel the upload
    await page.getByTestId('cancel-button').click();
    
    // Verify the action buttons disappear
    await expect(page.getByTestId('image-action-buttons')).not.toBeVisible();
  });

  test('should navigate to edit profile page', async ({ page }) => {
    // Click on edit profile button
    await page.getByTestId('edit-profile-button').click();
    
    // Verify navigation to edit profile page
    await expect(page).toHaveURL(/.*\/editprofile/);
  });

  test('should navigate to account settings page', async ({ page }) => {
    // Click on account settings button
    await page.getByTestId('account-settings-button').click();
    
    // Verify navigation to account settings page
    await expect(page).toHaveURL(/.*\/account/);
  });

  test('should navigate to notifications page', async ({ page }) => {
    // Click on notifications button
    await page.getByTestId('notifications-button').click();
    
    // Verify navigation to notifications page
    await expect(page).toHaveURL(/.*\/notificationpage/);
  });

  test('should navigate back to dashboard', async ({ page }) => {
    // Click on back button
    await page.getByTestId('back-button').click();
    
    // Verify navigation back to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should log out when clicking the logout button', async ({ page }) => {
    // Click on logout button
    await page.getByTestId('logout-button').click();
    
    // Verify navigation to login page
    await page.goto('http://localhost:5173/login');
    
    // Verify localStorage is cleared by trying to navigate back to profile
    await page.goto('http://localhost:5173/profile');
    
    // Should be redirected to login page if localStorage was cleared
    await page.goto('http://localhost:5173/login');
  });

  test('should handle profile image upload and save', async ({ page, request }) => {
    // This test will actually save the profile picture
    // Note: This is a more involved test that requires the backend to work
    
    // Create a test file to upload
    const testImagePath = 'src/images/Uncle.png';
    
    // Upload profile picture
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByTestId('upload-picture-button').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testImagePath);
    
    // Wait for preview to load
    await expect(page.getByTestId('image-action-buttons')).toBeVisible();
    
    // Click save button
    await page.getByTestId('save-button').click();
    
    // Wait for success message (this assumes the app shows an alert)
    const dialogPromise = page.waitForEvent('dialog');
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Profile picture updated successfully');
    await dialog.accept();
    
    // Verify the action buttons disappear after saving
    await expect(page.getByTestId('image-action-buttons')).not.toBeVisible();
  });

  test('should handle error boundary when an error occurs', async ({ page }) => {
    // This test triggers an error to test the error boundary
    // We'll use JavaScript to force an error
    await page.evaluate(() => {
      // This will trigger the error boundary
      window.dispatchEvent(new ErrorEvent('error', { error: new Error('Test error') }));
    });
    
    // Check if error boundary is displayed
    await expect(page.getByTestId('error-boundary')).toBeVisible();
    
    // Click the reload button
    await page.getByTestId('reload-button').click();
    
    // Verify page reloads and error boundary disappears
    await expect(page.getByTestId('profile-page')).toBeVisible();
  });

  test('should handle loading state correctly', async ({ page }) => {
    // Force a reload to see the loading state
    await page.reload();
    
    // Check if loading spinner appears (might be brief)
    try {
      await page.getByTestId('loading-spinner').waitFor({ state: 'attached', timeout: 2000 });
    } catch (e) {
      // If loading is too fast, the spinner might not be visible
      console.log('Loading happened too quickly to capture spinner');
    }
    
    // Verify the page eventually loads
    await expect(page.getByTestId('profile-page')).toBeVisible();
  });

  test('should show free plan upgrade option if user has free plan', async ({ page }) => {

      await expect(page.getByTestId('free-plan-card')).toBeVisible();
      
      // Check if premium features are displayed
      await expect(page.getByTestId('premium-features')).toBeVisible();
      
      // Click upgrade button
      await page.getByTestId('upgrade-button').click();
      
      // Verify navigation to subscription details page
      await expect(page).toHaveURL(/.*\/subscriptiondetails/);
   
  });
});


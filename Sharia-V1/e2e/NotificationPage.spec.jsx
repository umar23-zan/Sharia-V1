import { test, expect } from '@playwright/test';

const testUser = {
  email: 'umarmohamed444481@gmail.com',
  password: '321654'
};

test.describe('Notifications Page Tests', () => {
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
    
    // Navigate to notifications page
    await page.goto('http://localhost:5173/notificationpage');
    
    // Ensure the page is fully loaded
    await expect(page.getByTestId('notifications-page')).toBeVisible();
  });

  test('should display notification page UI elements correctly', async ({ page }) => {
    // Check if we're on mobile or desktop view
    const isMobile = await page.getByTestId('mobile-header').isVisible();
    
    if (isMobile) {
      // Check mobile elements
      await expect(page.getByTestId('mobile-header')).toBeVisible();
      await expect(page.getByTestId('back-button-mobile')).toBeVisible();
      await expect(page.getByTestId('mobile-tabs-container')).toBeVisible();
      await expect(page.getByTestId('mobile-tab-all')).toBeVisible();
      await expect(page.getByTestId('mobile-tab-haram')).toBeVisible();
      await expect(page.getByTestId('mobile-tab-uncertain')).toBeVisible();
    } else {
      // Check desktop elements
      await expect(page.getByTestId('desktop-header')).toBeVisible();
      await expect(page.getByTestId('back-button-desktop')).toBeVisible();
      await expect(page.getByTestId('desktop-sidebar')).toBeVisible();
      await expect(page.getByTestId('desktop-tab-all')).toBeVisible();
      await expect(page.getByTestId('desktop-tab-haram')).toBeVisible();
      await expect(page.getByTestId('desktop-tab-uncertain')).toBeVisible();
    }
    
    // Check notifications container (common for both views)
    await expect(page.getByTestId('notifications-container')).toBeVisible();
    
    // Check if either notifications or empty state is visible
    const hasEmptyState = await page.getByTestId('empty-state').isVisible();
    if (hasEmptyState) {
      await expect(page.getByTestId('empty-state')).toBeVisible();
    } else {
      // Wait for loading spinner to disappear if it exists
      if (await page.getByTestId('loading-spinner').isVisible()) {
        await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
      }
      
      // Check if at least one notification is visible
      const notificationCount = await page.locator('[data-testid^="notification-item-"]').count();
      expect(notificationCount).toBeGreaterThan(0);
    }
  });

  test('should switch between tabs correctly', async ({ page }) => {
    // Wait for loading to complete
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Check if we're on mobile or desktop view
    const isMobile = await page.getByTestId('mobile-header').isVisible();
    
    // Test tab switching - first to Haram tab
    if (isMobile) {
      await page.getByTestId('mobile-tab-haram').click();
    } else {
      await page.getByTestId('desktop-tab-haram').click();
    }
    
    // Wait for API call to complete after tab switch
    await page.waitForResponse(response => 
      response.url().includes('/api/notifications') && 
      response.url().includes('type=haram')
    );
    
    // Check if loading spinner appears and then disappears
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Now switch to uncertain tab
    if (isMobile) {
      await page.getByTestId('mobile-tab-uncertain').click();
    } else {
      await page.getByTestId('desktop-tab-uncertain').click();
    }
    
    // Wait for API call to complete after tab switch
    await page.waitForResponse(response => 
      response.url().includes('/api/notifications') && 
      response.url().includes('type=uncertain')
    );
    
    // Check if loading spinner appears and then disappears
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Back to all tab
    if (isMobile) {
      await page.getByTestId('mobile-tab-all').click();
    } else {
      await page.getByTestId('desktop-tab-all').click();
    }
    
    // Wait for API call to complete after tab switch
    await page.waitForResponse(response => 
      response.url().includes('/api/notifications') && 
      response.url().includes('type=all')
    );
    
    // Check if loading spinner appears and then disappears
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('should handle notification interactions correctly', async ({ page }) => {
    // Wait for loading to complete
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Skip test if no notifications are present
    const hasEmptyState = await page.getByTestId('empty-state').isVisible();
    if (hasEmptyState) {
      test.skip();
      return;
    }
    
    // Get the first notification item
    const firstNotification = page.locator('[data-testid^="notification-item-"]').first();
    const notificationId = await firstNotification.getAttribute('data-testid');
    const id = notificationId.replace('notification-item-', '');
    
    // Test delete notification functionality
    const deleteButton = page.getByTestId(`delete-button-${id}`);
    
    // Mock the delete API call
    await page.route(`**/api/notifications/${id}`, async route => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });
    
    // Click delete button
    await deleteButton.click();
    
    // Verify that the notification is removed from the DOM
    await expect(page.getByTestId(`notification-item-${id}`)).not.toBeVisible();
    
    // If there's another notification, test clicking on it
    const remainingNotifications = await page.locator('[data-testid^="notification-item-"]').count();
    if (remainingNotifications > 0) {
      const nextNotification = page.locator('[data-testid^="notification-item-"]').first();
      const nextId = await nextNotification.getAttribute('data-testid').then(id => id.replace('notification-item-', ''));
      
      // Mock the mark as read API call
      await page.route(`**/api/notifications/read/${nextId}`, async route => {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      });
      
      // Get current URL to check navigation after click
      const currentUrl = page.url();
      
      // Intercept navigation
      let navigationPromise;
      if (await nextNotification.getAttribute('data-article-url')) {
        // If this notification has an article URL, it would open in a new tab
        navigationPromise = page.waitForEvent('popup');
      } else {
        // Otherwise it would navigate to a stock page
        navigationPromise = page.waitForNavigation();
      }
      
      // Click on the notification
      await nextNotification.click();
      
      // Wait for navigation or popup
      await navigationPromise;
      
      // If no navigation happened (in case API error), the test should fail
      // The navigation promise above will handle that assertion
    }
  });

  test('should handle back button correctly', async ({ page }) => {
    // Check if we're on mobile or desktop view
    const isMobile = await page.getByTestId('mobile-header').isVisible();
    
    // Click back button based on view
    if (isMobile) {
      await page.getByTestId('back-button-mobile').click();
    } else {
      await page.getByTestId('back-button-desktop').click();
    }
    
    // Expect to navigate back to previous page
    // Note: This will depend on the actual browser history, so we can't assert on a specific URL
    // But we can at least verify we're no longer on the notifications page
    await expect(page.getByTestId('notifications-page')).not.toBeVisible({ timeout: 5000 });
  });

  test('should show unread badge when there are unread notifications', async ({ page }) => {
    // Wait for loading to complete
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Mock response with unread notifications
    await page.route('**/api/notifications*', async route => {
      const mockData = [
        {
          id: '123',
          title: 'Test Notification',
          symbol: 'TSLA',
          description: 'This is a test notification',
          type: 'haram',
          time: '2 hours ago',
          isRead: false
        }
      ];
      await route.fulfill({ status: 200, body: JSON.stringify(mockData) });
    });
    
    // Reload page to force the mock to take effect
    await page.reload();
    
    // Wait for loading to complete again
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Check if we're on mobile or desktop view
    const isMobile = await page.getByTestId('mobile-header').isVisible();
    
    // Check for unread badge based on view
    if (isMobile) {
      await expect(page.getByTestId('unread-badge-mobile')).toBeVisible();
    } else {
      await expect(page.getByTestId('unread-badge-desktop')).toBeVisible();
    }
  });

  test('should show notification type icons correctly', async ({ page }) => {
    // Wait for loading to complete
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Mock response with both types of notifications
    await page.route('**/api/notifications*', async route => {
      const mockData = [
        {
          id: '123',
          title: 'Haram Notification',
          symbol: 'TSLA',
          description: 'This stock has been classified as haram',
          type: 'haram',
          time: '2 hours ago',
          isRead: false
        },
        {
          id: '456',
          title: 'Uncertain Notification',
          symbol: 'AAPL',
          description: 'This stock is under review',
          type: 'uncertain',
          status: 'UNDER REVIEW',
          time: '5 hours ago',
          isRead: true
        }
      ];
      await route.fulfill({ status: 200, body: JSON.stringify(mockData) });
    });
    
    // Reload page to force the mock to take effect
    await page.reload();
    
    // Wait for loading to complete again
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Check for type icons
    await expect(page.getByTestId('haram-icon-123')).toBeVisible();
    await expect(page.getByTestId('uncertain-icon-456')).toBeVisible();
    
    // Check status message
    await expect(page.getByTestId('notification-review-456')).toBeVisible();
  });

  test('should show violations list when available', async ({ page }) => {
    // Wait for loading to complete
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Mock response with violations
    await page.route('**/api/notifications*', async route => {
      const mockData = [
        {
          id: '123',
          title: 'Haram Notification with Violations',
          symbol: 'TSLA',
          description: 'This stock has been classified as haram',
          type: 'haram',
          time: '2 hours ago',
          isRead: false,
          violations: [
            'Interest-based income exceeds 5% threshold',
            'Company has significant debt financing',
            'Involvement in prohibited activities'
          ]
        }
      ];
      await route.fulfill({ status: 200, body: JSON.stringify(mockData) });
    });
    
    // Reload page to force the mock to take effect
    await page.reload();
    
    // Wait for loading to complete again
    if (await page.getByTestId('loading-spinner').isVisible()) {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Check violations container and items
    await expect(page.getByTestId('violations-container-123')).toBeVisible();
    await expect(page.getByTestId('violation-123-0')).toBeVisible();
    await expect(page.getByTestId('violation-123-1')).toBeVisible();
    await expect(page.getByTestId('violation-123-2')).toBeVisible();
    
    // Check content of violations
    await expect(page.getByTestId('violation-123-0')).toContainText('Interest-based income');
    await expect(page.getByTestId('violation-123-1')).toContainText('debt financing');
    await expect(page.getByTestId('violation-123-2')).toContainText('prohibited activities');
  });
});
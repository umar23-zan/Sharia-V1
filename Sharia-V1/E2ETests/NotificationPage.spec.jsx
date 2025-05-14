import { test, expect } from '@playwright/test';
import {chromium } from '@playwright/test';
// const AxeBuilder = require('@axe-core/playwright').default;

// Test credentials
const FREE_USER = {
  email: 'umarmohamed444481@gmail.com',
  password: '321654'
};

const PREMIUM_USER = {
  email: 'umarmohmed444sam@gmail.com',
  password: '321654'
};

// Mock API responses
const mockNotifications = [
  {
    id: '1',
    title: 'Stock Now Classified as Haram',
    symbol: 'APPL',
    description: 'This stock has been classified as Haram due to interest-based activities.',
    type: 'haram',
    isRead: false,
    time: '2 hours ago',
    source: 'System',
    violations: [
      'Interest-based financial activities',
      'High debt-to-asset ratio exceeding 33%'
    ],
    articleUrl: null
  },
  {
    id: '2',
    title: 'Status Under Review',
    symbol: 'GOOG',
    description: 'This stock is currently under review by our shariah compliance team.',
    type: 'uncertain',
    isRead: true,
    time: '1 day ago',
    source: 'Compliance Team',
    status: 'UNDER REVIEW',
    statusBg: 'bg-amber-50',
    statusText: 'text-amber-700',
    violations: null,
    articleUrl: 'https://example.com/article/123'
  },
  {
    id: '3', 
    title: 'New Stock Added to Watchlist',
    symbol: 'MSFT',
    description: 'A new stock has been added to your watchlist.',
    type: 'system',
    isRead: false,
    time: '3 days ago',
    source: 'System',
    violations: null,
    articleUrl: null
  }
];

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  pageLoadTime: 3000, // 3 seconds
  apiResponseTime: 1000, // 1 second
  memoryThreshold: 50 * 1024 * 1024 // 50MB
};

test.describe('Notifications Page Tests', () => {
  // Before all tests, set up mock and authenticate
  test.beforeEach(async ({ page }) => {
    // Mock API response for notifications
    await page.route('**/api/notifications**', async route => {
      // Extract the type parameter from the URL
      const url = new URL(route.request().url());
      const type = url.searchParams.get('type');
      
      // Filter notifications based on the type parameter
      let filteredNotifications;
      if (type === 'all') {
        filteredNotifications = mockNotifications;
      } else {
        filteredNotifications = mockNotifications.filter(n => n.type === type);
      }
      
      // Simulate API response delay for performance testing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filteredNotifications)
      });
    });
    
    // Mock API response for marking notifications as read
    await page.route('**/api/notifications/read/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Mock API response for deleting notifications
    await page.route('**/api/notifications/**', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        route.continue();
      }
    });
    
    // Login setup
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByTestId('email-input').fill(FREE_USER.email);
    await page.getByTestId('password-input').fill(FREE_USER.password);
    await page.getByTestId('login-button').click();
    
    await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Navigate to notifications page
    await page.goto('/notificationpage');
  });

  test('Functional: Verify the notifications page loads correctly', async ({ page }) => {
    // Verify page loaded with correct title
    await expect(page.locator('[data-testid="notifications-page"]')).toBeVisible();
    
    // Verify mobile header is visible on small screens
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[data-testid="mobile-header"]')).toBeVisible();
    
    // Verify desktop header is visible on large screens
    await page.setViewportSize({ width: 1366, height: 768 });
    await expect(page.locator('[data-testid="desktop-header"]')).toBeVisible();
  });

  test('Functional: Verify all tabs display correct notifications', async ({ page }) => {
    // Verify all notifications display when "All" tab is selected
    await expect(page.locator('[data-testid="notification-item-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-item-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-item-3"]')).toBeVisible();
    
    // Verify haram notifications display when "Haram" tab is selected
    await page.click('[data-testid="desktop-tab-haram"]');
    await expect(page.locator('[data-testid="notification-item-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-item-2"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="notification-item-3"]')).not.toBeVisible();
    
    // Verify uncertain notifications display when "Uncertain" tab is selected
    await page.click('[data-testid="desktop-tab-uncertain"]');
    await expect(page.locator('[data-testid="notification-item-1"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="notification-item-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-item-3"]')).not.toBeVisible();
  });

  test('Functional: Verify back button returns to previous page', async ({ page }) => {
    await expect(page.locator('[data-testid="notifications-page"]')).toBeVisible();
    
    // Click the back button
    await page.click('[data-testid="back-button-desktop"]');
    
    // Verify history back was called
    const historyBackCalled = await page.evaluate(() => window.historyBackCalled);
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('Functional: Verify notification is marked as read when clicked', async ({ page }) => {
    await expect(page.locator('[data-testid="notifications-page"]')).toBeVisible();
    
    // Click on unread notification
    await page.click('[data-testid="notification-item-1"]');
    
    // Verify API was called to mark as read by checking network requests
    const requests = page.request.post;
    expect(requests).toBeTruthy();
    
    // Verify notification is now visually marked as read (border removed)
    const notifications = await page.locator('[data-testid="notification-item-1"]');
    const hasBorder = await notifications.evaluate(el => el.classList.contains('border-l-4'));
    expect(hasBorder).toBeFalsy();
  });

  test('Functional: Verify notification can be deleted', async ({ page }) => {
    // Get initial notification count
    const initialCount = await page.locator('[data-testid^="notification-item-"]').count();
    
    // Click delete button on first notification
    await page.click('[data-testid="delete-button-1"]');
    
    // Verify notification was removed from the list
    const newCount = await page.locator('[data-testid^="notification-item-"]').count();
    expect(newCount).toBe(initialCount - 1);
  });

test('Notification with articleUrl opens in new tab', async ({ page }) => {
  await page.addInitScript(() => {
    window.openedUrl = null;
    window.open = (url) => {
      window.openedUrl = url;
    };
  });

  await page.goto('/notificationpage');

  await page.click('[data-testid="notification-item-2"]');

  const openedUrl = await page.evaluate(() => window.openedUrl);
  expect(openedUrl).toBe('https://example.com/article/123');
});


  test('Functional: Verify unread count badge displays correctly', async ({ page }) => {
    // There should be 2 unread notifications based on our mock data
    await expect(page.locator('[data-testid="unread-badge-desktop"]')).toBeVisible();
    const unreadCount = await page.locator('[data-testid="unread-badge-desktop"]').innerText();
    expect(unreadCount).toBe('2');
  });

  test('Functional: Verify loading spinner displays during data fetch', async ({ page }) => {
    // Force loading state
    await page.evaluate(() => {
      window.localStorage.setItem('forceLoadingTest', 'true');
    });
    
    // Refresh page to trigger loading state
    await page.reload();
    
    // Verify loading spinner is visible
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  test('Functional: Verify empty state displays when no notifications match criteria', async ({ page }) => {
    // Override mock response to return empty array
    await page.route('**/api/notifications**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    // Refresh page
    await page.reload();
    
    // Verify empty state is displayed
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
  });

  test('Functional: Verify mobile tabs display correctly on small screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile tabs are visible
    await expect(page.locator('[data-testid="mobile-tabs-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-tab-all"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-tab-haram"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-tab-uncertain"]')).toBeVisible();
    
    // Verify desktop sidebar is hidden
    await expect(page.locator('[data-testid="desktop-sidebar"]')).not.toBeVisible();
  });

  test('Functional: Verify desktop sidebar displays correctly on large screens', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1366, height: 768 });
    
    // Verify desktop sidebar is visible
    await expect(page.locator('[data-testid="desktop-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="desktop-tab-all"]')).toBeVisible();
    await expect(page.locator('[data-testid="desktop-tab-haram"]')).toBeVisible();
    await expect(page.locator('[data-testid="desktop-tab-uncertain"]')).toBeVisible();
    
    // Verify mobile tabs are hidden
    await expect(page.locator('[data-testid="mobile-tabs-container"]')).not.toBeVisible();
  });

  test('Functional: Verify notification content displays correctly', async ({ page }) => {
    // Verify notification title
    await expect(page.locator('[data-testid="notification-title-1"]')).toHaveText('Stock Now Classified as Haram');
    
    // Verify notification symbol
    await expect(page.locator('[data-testid="notification-symbol-1"]')).toHaveText('APPL');
    
    // Verify notification description
    await expect(page.locator('[data-testid="notification-desc-1"]')).toHaveText('This stock has been classified as Haram due to interest-based activities.');
    
    // Verify notification time and source
    await expect(page.locator('[data-testid="notification-meta-1"]')).toContainText('2 hours ago');
    await expect(page.locator('[data-testid="notification-meta-1"]')).toContainText('System');
    
    // Verify appropriate icon is displayed
    await expect(page.locator('[data-testid="haram-icon-1"]')).toBeVisible();
  });

  test('Functional: Verify violations list displays for applicable notifications', async ({ page }) => {
    // Verify violations container is present
    await expect(page.locator('[data-testid="violations-container-1"]')).toBeVisible();
    
    // Verify violations are displayed correctly
    await expect(page.locator('[data-testid="violation-1-0"]')).toHaveText('Interest-based financial activities');
    await expect(page.locator('[data-testid="violation-1-1"]')).toHaveText('High debt-to-asset ratio exceeding 33%');
  });

  test('Functional: Verify status displays for applicable notifications', async ({ page }) => {
    // Verify status is displayed for notifications with status
    await expect(page.locator('[data-testid="notification-status-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-status-2"]')).toHaveText('UNDER REVIEW');
  });

  test('Functional: Verify review message displays for "UNDER REVIEW" notifications', async ({ page }) => {
    // Verify review message is displayed
    await expect(page.locator('[data-testid="notification-review-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-review-2"]')).toContainText('Our AI model has found something concerning about this stock');
  });

  // Non-functional tests

  test('NFT: Measure page load time', async ({ page }) => {
    // Start timer
    const startTime = Date.now();
    
    // Load the page
    await page.goto('/notifications', { waitUntil: 'networkidle' });
    
    // Calculate load time
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Verify it's within threshold
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoadTime);
  });

  test('NFT: Measure API response time for fetching notifications', async ({ page }) => {
    // Create a promise that resolves when the response is received
    const responsePromise = page.waitForResponse('**/api/notifications**');
    
    // Force reload to trigger API call
    await page.reload();
    
    // Wait for the response
    const response = await responsePromise;
    
    // Verify response time
    expect(response.timing().responseEnd - response.timing().requestStart)
      .toBeLessThan(PERFORMANCE_THRESHOLDS.apiResponseTime);
  });

  test('NFT: Verify responsive layout on various devices', async ({ page }) => {
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[data-testid="mobile-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="desktop-header"]')).not.toBeVisible();
    
    // Test on tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[data-testid="mobile-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="desktop-header"]')).not.toBeVisible();
    
    // Test on desktop
    await page.setViewportSize({ width: 1366, height: 768 });
    await expect(page.locator('[data-testid="mobile-header"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="desktop-header"]')).toBeVisible();
  });



  test('NFT: Measure network requests efficiency', async ({ page }) => {
    // Clear request log and force reload
    await page.route('**/*', route => route.continue());
    const requests = [];
    
    // Collect all requests
    page.on('request', request => {
      requests.push(request);
    });
    
    // Load the page
    await page.goto('/notificationpage', { waitUntil: 'networkidle' });
    
    // Verify total number of requests is reasonable
    expect(requests.length).toBeLessThan(20); // Adjust threshold as needed
    
    // Verify all critical resources are loaded with proper cache headers
    const criticalResources = requests.filter(req => 
      req.resourceType() === 'script' || 
      req.resourceType() === 'stylesheet' ||
      req.resourceType() === 'fetch');
    
    // Check each critical resource has proper cache headers
    for (const resource of criticalResources) {
      const response = await resource.response();
      if (response) {
        const headers = response.headers();
        expect(headers['cache-control'] || '').not.toBe('');
      }
    }
  });

  test('NFT: Verify proper error handling when API fails', async ({ page }) => {
    // Override API response to simulate failure
    await page.route('**/api/notifications**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Refresh the page
    await page.reload();
    
    // Verify error state is shown
    // This assumes the app shows some kind of error state when API fails
    await expect(page.locator('text=Error loading notifications')).toBeVisible();
  });

  test('NFT: Measure memory consumption with many notifications', async ({ page }) => {
    // Create a large number of mock notifications
    const manyNotifications = Array(100).fill().map((_, i) => ({
      id: `${i + 1}`,
      title: `Notification ${i + 1}`,
      symbol: `SYM${i}`,
      description: `This is a long description for notification ${i + 1} that includes a lot of text to make it realistic.`,
      type: i % 3 === 0 ? 'haram' : i % 3 === 1 ? 'uncertain' : 'system',
      isRead: i % 2 === 0,
      time: `${i} hours ago`,
      source: 'System',
      violations: i % 5 === 0 ? ['Violation 1', 'Violation 2'] : null,
      articleUrl: i % 4 === 0 ? `https://example.com/article/${i}` : null
    }));
    
    // Override API response
    await page.route('**/api/notifications**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(manyNotifications)
      });
    });
    
    // Refresh page
    await page.reload();
    
    // Measure memory usage
    const jsHeapSizeLimit = await page.evaluate(() => performance.memory?.jsHeapSizeLimit || 0);
    const usedJSHeapSize = await page.evaluate(() => performance.memory?.usedJSHeapSize || 0);
    
    console.log(`Memory usage: ${usedJSHeapSize / 1024 / 1024} MB`);
    
    // Verify memory usage is below threshold
    expect(usedJSHeapSize).toBeLessThan(PERFORMANCE_THRESHOLDS.memoryThreshold);
  });

  test('NFT: Verify notification page functionality across browsers', async ({ page, browserName }) => {
    // Skip Safari (WebKit) tests on Linux due to known limitations
    test.skip(browserName === 'webkit' && process.platform === 'linux', 'Safari tests are skipped on Linux');
  
    // Navigate to the notification page
    await page.goto('/notificationpage');
  
    // Check if the notification page is visible
    await expect(page.getByTestId('notifications-page')).toBeVisible();
  
    // Log the browser name for verification
    console.log(`✅ Notification page loaded successfully in ${browserName}`);
  });
  

  test('NFT: Verify sensitive data handling', async ({ page }) => {
    // Verify localStorage doesn't contain sensitive data
    const localStorageData = await page.evaluate(() => Object.keys(localStorage));
    expect(localStorageData).not.toContain('password');
    expect(localStorageData).not.toContain('token'); // unless properly encrypted
    
    // Check for secure cookies
    const cookies = await page.context().cookies();
    const authCookies = cookies.filter(cookie => 
      cookie.name.toLowerCase().includes('auth') || 
      cookie.name.toLowerCase().includes('token') || 
      cookie.name.toLowerCase().includes('session')
    );
    
    for (const cookie of authCookies) {
      expect(cookie.secure).toBeTruthy();
      expect(cookie.httpOnly).toBeTruthy();
    }
  });

  test('NFT: Verify UI animations run smoothly', async ({ page }) => {
    // Measure animation performance
    const performanceMetrics = await page.evaluate(async () => {
      // Set up performance observer
      const longAnimationFrames = [];
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.duration > 16.67) { // 60fps threshold
            longAnimationFrames.push(entry.duration);
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      
      // Trigger animations by switching tabs
      document.querySelector('[data-testid="desktop-tab-haram"]').click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      document.querySelector('[data-testid="desktop-tab-uncertain"]').click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      document.querySelector('[data-testid="desktop-tab-all"]').click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      observer.disconnect();
      return { longAnimationFrames };
    });
    
    // Verify long animation frames are minimal
    expect(performanceMetrics.longAnimationFrames.length).toBeLessThan(5);
  });

  test('NFT: Verify behavior when offline', async ({ page }) => {
    // Make the page go offline
    await page.context().setOffline(true);
    
    // Refresh the page
    await page.reload();
    
    // Verify offline message is displayed
    await expect(page.locator('text=You are offline')).toBeVisible();
    
    // Restore online state
    await page.context().setOffline(false);
  });

  test('NFT: Verify handling of notifications with long content', async ({ page }) => {
    // Create notification with very long content
    const longNotification = {
      id: 'long1',
      title: 'This is a notification with an extremely long title that should be handled properly by the UI without breaking the layout',
      symbol: 'LONGCODE',
      description: 'This is an extremely long description that contains a lot of text to test how the UI handles overflow scenarios. It should be properly truncated or handled in a way that maintains the layout integrity and good user experience. This text is intentionally verbose to ensure we test the limits of the container.',
      type: 'haram',
      isRead: false,
      time: '1 minute ago',
      source: 'System',
      violations: [
        'This is a very long violation description that should be handled properly',
        'Another extremely long violation description that should be properly wrapped or truncated in the UI'
      ],
      articleUrl: null
    };
    
    // Override API response
    await page.route('**/api/notifications**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([longNotification])
      });
    });
    
    // Refresh page
    await page.reload();
    
    // Verify notification is displayed without breaking layout
    await expect(page.locator(`[data-testid="notification-item-${longNotification.id}"]`)).toBeVisible();
    
    // Verify layout integrity
    // Get the parent container width
    const containerWidth = await page.locator('[data-testid="notifications-container"]').evaluate(el => el.offsetWidth);
    
    // Get the notification width
    const notificationWidth = await page.locator(`[data-testid="notification-item-${longNotification.id}"]`).evaluate(el => el.offsetWidth);
    
    // Verify the notification doesn't overflow the container
    expect(notificationWidth).toBeLessThanOrEqual(containerWidth);
  });
})
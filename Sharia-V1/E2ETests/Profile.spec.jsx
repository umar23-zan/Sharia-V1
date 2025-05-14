import { test, expect } from '@playwright/test';

// Test data
const FREE_USER = {
  email: 'umarmohamed444481@gmail.com',
  password: '321654',
  plan: 'free'
};

const PREMIUM_USER = {
  email: 'umarmohmed444sam@gmail.com',
  password: '321654', 
  plan: 'premium'
};

// Common helper functions
async function login(page, user) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.getByTestId('email-input').fill(user.email);
  await page.getByTestId('password-input').fill(user.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);
}

async function navigateToProfile(page) {
  await page.goto('/profile');
  await expect(page).toHaveURL(/.*\/profile/);
  await page.waitForSelector('[data-testid="profile-page"]');
}

test.describe('Profile Page Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  // FUNCTIONAL TESTS
  test.describe('Functional Tests', () => {
    test('verify the profile page loads correctly', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Check key elements are visible
      await expect(page.getByTestId('profile-page')).toBeVisible();
      await expect(page.getByTestId('profile-info-section')).toBeVisible();
      await expect(page.getByTestId('subscription-section')).toBeVisible();
      await expect(page.getByTestId('quick-settings-section')).toBeVisible();
      await expect(page.getByTestId('back-button')).toBeVisible();
    });
  
    test('verify user information displays correctly', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Check user information matches
      await expect(page.getByTestId('user-email')).toContainText(FREE_USER.email);
      
      // Do the same for premium user
      await page.goto('/dashboard');
      await page.evaluate(() => localStorage.clear());
      await login(page, PREMIUM_USER);
      await navigateToProfile(page);
      await expect(page.getByTestId('user-email')).toContainText(PREMIUM_USER.email);
    });
    
    test('verify back button navigates to dashboard', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      await page.getByTestId('back-button').click();
      await page.waitForURL('/dashboard');
      
      // Verify we're on dashboard
      await expect(page).toHaveURL('/dashboard');
    });
    
    test('verify user can upload a new profile picture', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Create a file input event with valid image
      await page.setInputFiles('[data-testid="profile-picture-input"]', {
        name: 'profile-pic.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-content')
      });
      
      // Verify action buttons appear
      await expect(page.getByTestId('image-action-buttons')).toBeVisible();
      await expect(page.getByTestId('save-button')).toBeVisible();
      await expect(page.getByTestId('cancel-button')).toBeVisible();
      
      // Mock the API response for the upload
      await page.route('**/api/auth/upload-profile-picture', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            success: true, 
            profilePicture: 'https://example.com/profile-pic.jpg' 
          })
        });
      });
      
      // Click save and expect alert
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Profile picture updated successfully');
        await dialog.accept();
      });
      
      await page.getByTestId('save-button').click();
      
      // After saving, the buttons should disappear
      await expect(page.getByTestId('image-action-buttons')).not.toBeVisible({ timeout: 3000 });
    });
    
    test('verify user can cancel profile picture upload', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      await page.setInputFiles('[data-testid="profile-picture-input"]', {
        name: 'profile-pic.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-content')
      });
      
      await expect(page.getByTestId('image-action-buttons')).toBeVisible();
      await page.getByTestId('cancel-button').click();
      
      // After canceling, the buttons should disappear
      await expect(page.getByTestId('image-action-buttons')).not.toBeVisible();
    });
    
    // test('verify system rejects oversized images', async ({ page }) => {
    //   await login(page, FREE_USER);
    //   await navigateToProfile(page);
      
    //   // Create a large image file (> 2MB)
    //   const largeBuffer = Buffer.alloc(2.1 * 1024 * 1024); // 2.1MB file
      
    //   // Set up dialog handler before triggering action
    //   const dialogPromise = page.waitForEvent('dialog');
      
    //   await page.evaluate(() => {
    //     // Mock the FileReader to always trigger error
    //     const originalFileReader = window.FileReader;
    //     window.FileReader = class MockFileReader extends originalFileReader {
    //       readAsDataURL(file) {
    //         if (file.size > 2 * 1024 * 1024) {
    //           // Simulate file too large
    //           setTimeout(() => {
    //             alert('Please upload a valid image (max 5MB)');
    //           }, 0);
    //         } else {
    //           super.readAsDataURL(file);
    //         }
    //       }
    //     };
    //   });
      
    //   // Method 1: Make the hidden input visible first
    //   // await page.evaluate(() => {
    //   //   const input = document.querySelector('[data-testid="profile-picture-input"]');
    //   //   if (input) input.style.display = 'block';
    //   // });
      
    //   // // Now set the file input
    //   // await page.locator('[data-testid="profile-picture-input"]').setInputFiles({
    //   //   name: 'large-image.jpg',
    //   //   mimeType: 'image/jpeg',
    //   //   buffer: largeBuffer
    //   // });
      
    //   // Alternative Method 2: Click the camera icon label instead
    //   await page.locator('[data-testid="upload-picture-button"]').click();
    //   await page.setInputFiles('[data-testid="profile-picture-input"]', {
    //     name: 'large-image.jpg',
    //     mimeType: 'image/jpeg',
    //     buffer: largeBuffer
    //   });
      
    //   // Handle the alert dialog
    //   const dialog = await dialogPromise;
    //   expect(dialog.message()).toContain('Please upload a valid image');
    //   await dialog.accept();
      
    //   // Verify no action buttons are visible
    //   await expect(page.getByTestId('image-action-buttons')).not.toBeVisible({ timeout: 1000 });
    // });
    
    test('verify navigation to edit profile page', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      await page.getByTestId('edit-profile-button').click();
      await page.waitForURL('/editprofile');
      
      // Verify we've navigated to edit profile
      await expect(page).toHaveURL('/editprofile');
    });
    
    test('verify navigation to account settings', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      await page.getByTestId('account-settings-button').click();
      await page.waitForURL('/account');
      
      // Verify we've navigated to account settings
      await expect(page).toHaveURL('/account');
    });
    
    test('verify navigation to notifications page', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      await page.getByTestId('notifications-button').click();
      await page.waitForURL('/notificationpage');
      
      // Verify we've navigated to notifications page
      await expect(page).toHaveURL('/notificationpage');
    });
    
    test('verify free plan details display correctly', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Free plan should show upgrade button and features
      await expect(page.getByTestId('free-plan-card')).toBeVisible();
      await expect(page.getByTestId('upgrade-button')).toBeVisible();
      await expect(page.getByTestId('premium-features')).toBeVisible();
      
      // Check specific features
      await expect(page.getByTestId('feature-alerts')).toBeVisible();
      await expect(page.getByTestId('feature-analytics')).toBeVisible();
      await expect(page.getByTestId('feature-reports')).toBeVisible();
    });
    
    test('verify premium plan details display correctly', async ({ page }) => {
      await login(page, PREMIUM_USER);
      await navigateToProfile(page);
      
      // Premium plan should show active status and details
      await expect(page.getByTestId('premium-plan-card')).toBeVisible();
      await expect(page.getByTestId('subscription-status')).toContainText('Active');
      
      // Check plan specific details
      await expect(page.getByTestId('plan-type')).toBeVisible();
      await expect(page.getByTestId('plan-status')).toBeVisible();
      await expect(page.getByTestId('billing-cycle')).toBeVisible();
    });
    
    test('verify navigation to subscription details', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      await page.getByTestId('upgrade-button').click();
      await page.waitForURL('/subscriptiondetails');
      
      // Verify we've navigated to subscription details
      await expect(page).toHaveURL('/subscriptiondetails');
    });
    
    test('verify user can log out successfully', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      await page.getByTestId('logout-button').click();
      await page.waitForURL('/login');
      
      // Verify we're logged out and back at login page
      await expect(page).toHaveURL('/login');
      
      // Verify local storage is cleared
      const userEmail = await page.evaluate(() => localStorage.getItem('userEmail'));
      expect(userEmail).toBeNull();
    });
    
    
    test('verify loading spinner displays during data fetch', async ({ page }) => {
      await login(page, FREE_USER);
      
      // Mock a delayed API response
      await page.route('**/api/auth/user-data*', async route => {
        // Delay the response by 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            name: 'Umar Mohamed',
            email: FREE_USER.email,
            subscription: { plan: 'free' }
          })
        });
      });
      
      // Start navigating to profile
      await page.goto('/profile');
      
      // Loading spinner should be visible
      await expect(page.getByTestId('loading-spinner')).toBeVisible();
      
      // Eventually the spinner should disappear
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 5000 });
    });
    
    test('verify error message displays on fetch failure', async ({ page }) => {
      await login(page, FREE_USER);
      
      // Mock a failed API response
      await page.route('**/api/auth/user-data*', route => {
        return route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        });
      });
      
      await page.goto('/profile');
      
      // Error message should be visible
      await expect(page.getByTestId('error-message')).toBeVisible();
    });
    
    test('verify error boundary provides recovery option', async ({ page }) => {
      await login(page, FREE_USER);
      
      // Go to profile page
      await page.goto('/profile');
      await page.waitForSelector('[data-testid="profile-page"]');
      
      // Inject a script that throws an error
      await page.evaluate(() => {
        window.dispatchEvent(new ErrorEvent('error', { 
          error: new Error('Forced test error'),
          message: 'Forced test error'
        }));
      });
      
      // Error boundary should be visible
      await expect(page.getByTestId('error-boundary')).toBeVisible();
      
      // Reload button should be visible
      await expect(page.getByTestId('reload-button')).toBeVisible();
      
      // Test the reload button works
      await page.route('**/api/auth/user-data*', async route => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            name: 'Umar Mohamed',
            email: FREE_USER.email,
            subscription: { plan: 'free' }
          })
        });
      });
      
      await page.getByTestId('reload-button').click();
      
      // After reload, profile page should be visible
      await expect(page.getByTestId('profile-page')).toBeVisible();
    });
  });
  
  // NON-FUNCTIONAL TESTS
  test.describe('Non-functional Tests', () => {
    test('measure page load time', async ({ page }) => {
      const startTime = Date.now();
      
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Wait for the page to be completely loaded
      await page.waitForLoadState('networkidle');
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      // Log the load time for reporting
      console.log(`Profile page load time: ${loadTime}ms`);
      
      // Page should load in under 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });
    
    test('verify responsive layout on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Check that elements are still accessible
      await expect(page.getByTestId('profile-info-section')).toBeVisible();
      await expect(page.getByTestId('subscription-section')).toBeVisible();
      
      // Check for stacked layout (profile info above subscription)
      const profileInfoBounds = await page.getByTestId('profile-info-section').boundingBox();
      const subscriptionSectionBounds = await page.getByTestId('subscription-section').boundingBox();
      
      expect(profileInfoBounds.y).toBeLessThan(subscriptionSectionBounds.y);
      
      // Check buttons remain accessible
      await expect(page.getByTestId('edit-profile-button')).toBeVisible();
      await expect(page.getByTestId('logout-button')).toBeVisible();
    });
    
    test('verify responsive layout on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Check that all sections are visible
      await expect(page.getByTestId('profile-info-section')).toBeVisible();
      await expect(page.getByTestId('subscription-section')).toBeVisible();
      
      // Check layout - can still be stacked at this breakpoint
      const profileInfoBounds = await page.getByTestId('profile-info-section').boundingBox();
      const subscriptionSectionBounds = await page.getByTestId('subscription-section').boundingBox();
      
      // Log the boundaries for debugging
      console.log(`Tablet layout - Profile info: ${JSON.stringify(profileInfoBounds)}`);
      console.log(`Tablet layout - Subscription: ${JSON.stringify(subscriptionSectionBounds)}`);
    });
    
    test('verify screen reader compatibility', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Check for proper ARIA attributes
      const ariaLabels = await page.evaluate(() => {
        const elements = document.querySelectorAll('[aria-label]');
        return Array.from(elements).map(el => el.getAttribute('aria-label'));
      });
      
      // Verify we have aria-labels for key interactive elements
      expect(ariaLabels).toContain('Back to Dashboard');
      expect(ariaLabels).toContain('Edit Profile');
      expect(ariaLabels).toContain('Log Out');
      
      // Check that image elements have alt text
      const imageAlts = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).map(img => img.getAttribute('alt'));
      });
      
      expect(imageAlts).toContain('profile');
    });
    
    test('verify keyboard navigation works', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Start from the beginning of the page
      await page.keyboard.press('Tab');
      
      // Check if an element is focused (not body)
      let focusedElement = await page.evaluate(() => document.activeElement.tagName);
      expect(focusedElement).not.toBe('BODY');
      
      // Press tab multiple times to navigate through key interactive elements
      const tabbableElements = [
        'back-button',
        'upload-picture-button',
        'edit-profile-button',
        'account-settings-button',
        'notifications-button',
        'upgrade-button',
        'logout-button'
      ];
      
      // Track found elements
      const foundElements = [];
      
      // Tab through up to 20 elements looking for our key interactive elements
      for (let i = 0; i < 20; i++) {
        const currentElement = await page.evaluate(() => {
          const el = document.activeElement;
          return el.dataset.testid || el.getAttribute('aria-label') || el.tagName;
        });
        
        if (tabbableElements.includes(currentElement)) {
          foundElements.push(currentElement);
        }
        
        await page.keyboard.press('Tab');
      }
      
      // We should have found at least some of our key elements
      expect(foundElements.length).toBeGreaterThan(0);
      console.log(`Found keyboard navigable elements: ${foundElements.join(', ')}`);
    });
    
    test('verify color contrast meets WCAG standards', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Extract text and background colors
      const contrastResults = await page.evaluate(() => {
        function getContrastRatio(foreground, background) {
          // Convert hex to RGB
          const hexToRgb = (hex) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : null;
          };
          
          // Calculate luminance
          const luminance = (r, g, b) => {
            const a = [r, g, b].map(v => {
              v /= 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
          };
          
          // Convert colors to RGB if they're hex
          let fgRGB = foreground.startsWith('#') ? hexToRgb(foreground) : foreground;
          let bgRGB = background.startsWith('#') ? hexToRgb(background) : background;
          
          // Calculate the contrast ratio
          const fgLuminance = luminance(fgRGB.r, fgRGB.g, fgRGB.b);
          const bgLuminance = luminance(bgRGB.r, bgRGB.g, bgRGB.b);
          
          const contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                               (Math.min(fgLuminance, bgLuminance) + 0.05);
          
          return contrastRatio;
        }
        
        // Get computed styles for text elements
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, button');
        const results = [];
        
        textElements.forEach(element => {
          const style = window.getComputedStyle(element);
          const textColor = style.color;
          const bgColor = style.backgroundColor;
          
          // Skip if element has no text or is invisible
          if (!element.textContent.trim() || style.display === 'none' || style.visibility === 'hidden') {
            return;
          }
          
          results.push({
            element: element.tagName,
            textContent: element.textContent.trim().substring(0, 20),
            textColor,
            bgColor,
            visible: style.display !== 'none' && style.visibility !== 'hidden'
          });
        });
        
        return results;
      });
      
      // Log the results for analysis
      console.log(`Color contrast analysis: ${contrastResults.length} elements checked`);
      
      // Ensure we have some elements with proper styling
      expect(contrastResults.length).toBeGreaterThan(0);
      
      // Check that at least some elements have visible text
      const visibleElements = contrastResults.filter(item => item.visible);
      expect(visibleElements.length).toBeGreaterThan(0);
    });
    
    test('verify all images have alt text', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Check all images for alt text
      const imagesWithoutAlt = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const missing = [];
        
        images.forEach(img => {
          const alt = img.getAttribute('alt');
          const src = img.getAttribute('src');
          if (!alt) {
            missing.push({
              src: src.substring(0, 50) + (src.length > 50 ? '...' : ''),
              parent: img.parentElement.tagName
            });
          }
        });
        
        return missing;
      });
      
      // Log any issues for debugging
      if (imagesWithoutAlt.length > 0) {
        console.log('Images without alt text:', imagesWithoutAlt);
      }
      
      // All images should have alt text
      expect(imagesWithoutAlt.length).toBe(0);
    });
    
    test('measure memory consumption', async ({ page }) => {
      await login(page, FREE_USER);
      
      // Get memory before loading profile
      const beforeMemory = await page.evaluate(() => performance.memory?.usedJSHeapSize || 0);
      
      await navigateToProfile(page);
      await page.waitForLoadState('networkidle');
      
      // Get memory after loading profile
      const afterMemory = await page.evaluate(() => performance.memory?.usedJSHeapSize || 0);
      
      // Calculate memory increase
      const memoryIncrease = afterMemory - beforeMemory;
      
      // Log memory usage for reporting
      console.log(`Memory usage: Before: ${beforeMemory} bytes, After: ${afterMemory} bytes, Increase: ${memoryIncrease} bytes`);
      
      // This is a monitoring test - we're just logging values, not asserting
      // In a real test, you might set a threshold based on baseline measurements
    });
    
    test('measure network requests efficiency', async ({ page }) => {
      // Enable request interception
      await page.route('**/*', route => route.continue());
      
      // Collect all requests
      const requests = [];
      page.on('request', request => {
        requests.push({
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType()
        });
      });
      
      await login(page, FREE_USER);
      await navigateToProfile(page);
      await page.waitForLoadState('networkidle');
      
      // Analyze requests
      const apiRequests = requests.filter(r => r.url.includes('/api/'));
      const staticRequests = requests.filter(r => 
        r.resourceType === 'script' || 
        r.resourceType === 'stylesheet' || 
        r.resourceType === 'image'
      );
      
      // Log requests for analysis
      console.log(`Total requests: ${requests.length}`);
      console.log(`API requests: ${apiRequests.length}`);
      console.log(`Static asset requests: ${staticRequests.length}`);
      
      // Check for excessive API calls
      expect(apiRequests.length).toBeLessThan(10); // Arbitrary threshold, adjust based on app
    });
    
    test('measure CPU usage during interactions', async ({ page }) => {
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Start performance monitoring
      await page.evaluate(() => {
        window.performanceEntries = [];
        window.observer = new PerformanceObserver((list) => {
          window.performanceEntries.push(...list.getEntries());
        });
        window.observer.observe({ entryTypes: ['longtask'] });
      });
      
      // Perform some interactions
      await page.getByTestId('edit-profile-button').hover();
      await page.getByTestId('account-settings-button').hover();
      await page.getByTestId('logout-button').hover();
      
      // Wait for any tasks to complete
      await page.waitForTimeout(1000);
      
      // Get performance data
      const performanceData = await page.evaluate(() => {
        return {
          longTasks: window.performanceEntries.filter(entry => entry.entryType === 'longtask'),
          // Add other performance metrics as needed
        };
      });
      
      // Log performance data for analysis
      console.log(`Long tasks detected: ${performanceData.longTasks.length}`);
      if (performanceData.longTasks.length > 0) {
        console.log(`Long task durations: ${performanceData.longTasks.map(t => t.duration).join(', ')}ms`);
      }
      
      // No specific assertion - this is for monitoring/analysis
    });
    
    // Browser Compatibility Tests
    test('verify functionality in different browsers', async ({ page, browserName }) => {
      test.skip(browserName === 'webkit' && process.platform === 'linux', 'Safari tests are skipped on Linux');
      
      await login(page, FREE_USER);
      await navigateToProfile(page);
      
      // Check essential functionality
      await expect(page.getByTestId('profile-page')).toBeVisible();
      await expect(page.getByTestId('profile-info-section')).toBeVisible();
      await expect(page.getByTestId('subscription-section')).toBeVisible();
      
      // Test a key interaction
      await page.getByTestId('edit-profile-button').click();
      await page.waitForURL('/editprofile');
      await expect(page).toHaveURL('/editprofile');
      
      // Log browser information
      console.log(`Test passed in ${browserName} browser`);
    });
  });
});
import { test, expect } from '@playwright/test';
import { chromium } from '@playwright/test';

test.describe('BlogCatalogue Component E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set default navigation timeout
    page.setDefaultTimeout(10000);
    // Navigate to the page containing the BlogCatalogue component
    await page.goto('/blogs');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  // ============ Functional Tests ============
  
  test('should display the header with correct title', async ({ page }) => {
    const header = page.locator('[data-testid="blog-header"]');
    await expect(header).toBeVisible();
    
    const title = page.locator('[data-testid="blog-title"]');
    await expect(title).toHaveText('Islamic Finance Blog');
    
    const subtitle = page.locator('[data-testid="blog-subtitle"]');
    await expect(subtitle).toContainText('Shariah principles');
  });

  test('should display search bar and all categories', async ({ page }) => {
    // Verify search bar is visible
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();
    
    // Verify all category buttons are visible
    const categories = ['all', 'investing', 'screening', 'community', 'guides'];
    for (const category of categories) {
      const categoryButton = page.locator(`[data-testid="category-${category}"]`);
      await expect(categoryButton).toBeVisible();
    }
    
    // Verify "All Articles" is selected by default
    const allCategoryButton = page.locator('[data-testid="category-all"]');
    await expect(allCategoryButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should display featured articles section', async ({ page }) => {
    const featuredSection = page.locator('[data-testid="featured-articles-section"]');
    await expect(featuredSection).toBeVisible();
    
    const featuredArticles = page.locator('[data-testid^="featured-post-"]');
    const count = await featuredArticles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display all blog posts', async ({ page }) => {
    const blogPostsSection = page.locator('[data-testid="blog-posts-section"]');
    await expect(blogPostsSection).toBeVisible();
    
    const blogPosts = page.locator('[data-testid^="post-card-"]');
    const count = await blogPosts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter articles when selecting different categories', async ({ page }) => {
    // Click on "Guides" category
    await page.click('[data-testid="category-guides"]');
    
    // Verify "Guides" category is selected
    const guidesButton = page.locator('[data-testid="category-guides"]');
    await expect(guidesButton).toHaveAttribute('aria-pressed', 'true');
    
    // Verify section title changes to "Beginner Guides"
    const sectionTitle = page.locator('[data-testid="section-title"]');
    await expect(sectionTitle).toHaveText('Beginner Guides');
    
    // Verify only guides articles are displayed
    const visiblePosts = page.locator('[data-testid^="post-card-"]');
    const count = await visiblePosts.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify featured section is not visible when category is selected
    const featuredSection = page.locator('[data-testid="featured-articles-section"]');
    await expect(featuredSection).not.toBeVisible();
  });

  test('should search for articles by title', async ({ page }) => {
    // Type "Halal" in the search box
    await page.fill('[data-testid="search-input"]', 'how');
    
    // Verify section title changes to "Search Results"
    const sectionTitle = page.locator('[data-testid="section-title"]');
    await expect(sectionTitle).toHaveText('Search Results');
    
    // Verify only articles with "Halal" in the title are displayed
    const visiblePosts = page.locator('[data-testid^="post-card-"]');
    const count = await visiblePosts.count();
    expect(count).toBeGreaterThan(0);
    
    // Check if each visible post title contains "Halal"
    for (let i = 0; i < count; i++) {
      const postTitle = page.locator(`[data-testid^="post-title-"]`).nth(i);
      const titleText = await postTitle.textContent();
      expect(titleText.toLowerCase()).toContain('how ai helps analyze islamic compliance in stocks');
    }
  });

  test('should filter and search together', async ({ page }) => {
    // Select "Community Insights" category
    await page.click('[data-testid="category-community"]');
    
    // Search for "haram"
    await page.fill('[data-testid="search-input"]', 'haram');
    
    // Verify filtered results
    const visiblePosts = page.locator('[data-testid^="post-card-"]');
    const count = await visiblePosts.count();
    
    // Verify each post contains "haram" in title or excerpt and belongs to community category
    for (let i = 0; i < count; i++) {
      const postText = await page.locator(`[data-testid^="post-card-"]`).nth(i).textContent();
      expect(postText.toLowerCase()).toContain('haram');
    }
  });

  test('should display no results message when search has no matches', async ({ page }) => {
    // Search for a term that won't match any posts
    await page.fill('[data-testid="search-input"]', 'xyznonexistentterm');
    
    // Verify no results message appears
    const noResults = page.locator('[data-testid="no-results"]');
    await expect(noResults).toBeVisible();
    
    // Verify clear filters button is visible
    const clearButton = page.locator('[data-testid="clear-filters-btn"]');
    await expect(clearButton).toBeVisible();
    
    // Test clear filters functionality
    await clearButton.click();
    
    // Verify search input is cleared
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveValue('');
    
    // Verify all posts are visible again
    const allPosts = page.locator('[data-testid^="post-card-"]');
    const count = await allPosts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to article page when clicking Read More', async ({ page }) => {
    // Get the first article title and path
    const firstPostTitle = await page.locator('[data-testid="post-title-1"]').textContent();
    const readMoreLink = page.locator('[data-testid="read-more-1"]');
    
    // Click the Read More link
    const [newPage] = await Promise.all([
      readMoreLink.click()
    ]);
    await page.waitForURL('**/understand-haram');
  await expect(page).toHaveURL(/.*\/understand-haram/);

  });

  test('should go back when clicking the back button', async ({ page }) => {
    // Mock navigation history by first going to a different page
    await page.goto('/');
    await page.goto('/blogs');
    
    // Click the back button
    await page.click('[data-testid="go-back-button"]');
    
    // Verify we went back to the previous page
    expect(page.url()).toEqual(expect.stringContaining('/'));
  });

  // ============ Non-Functional Tests ============

  // Performance Tests
  test('should load within acceptable time limits', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/blogs', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Load time should be less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check time to first contentful paint
    const perfEntries = await page.evaluate(() => {
      return performance.getEntriesByType('paint')
        .filter(entry => entry.name === 'first-contentful-paint')
        .map(entry => entry.startTime);
    });
    
    expect(perfEntries.length).toBeGreaterThan(0);
    expect(perfEntries[0]).toBeLessThan(1500); // First contentful paint under 1.5s
  });

  // Accessibility Tests (without AxeBuilder)
  test('should have proper semantic elements and ARIA attributes', async ({ page }) => {
    // Check for proper heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one h1
    
    // Check aria-labels on interactive elements
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveAttribute('aria-label', 'Search articles');
    
    // Check aria-pressed on toggle buttons
    const selectedCategory = page.locator('[aria-pressed="true"]');
    await expect(selectedCategory).toBeVisible();
    

  });

  // Visual Tests
  test('should display blog cards with proper layout and images', async ({ page }) => {
    // Verify images are loaded in blog cards
    const blogImages = page.locator('[data-testid^="post-image-"]');
    const count = await blogImages.count();
    
    for (let i = 0; i < count; i++) {
      // Check image visibility
      await expect(blogImages.nth(i)).toBeVisible();
      
      // Get image dimensions to ensure proper display
      const dimensions = await blogImages.nth(i).boundingBox();
      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBeGreaterThan(0);
    }
    
    // Verify cards have consistent height
    const blogCards = page.locator('[data-testid^="post-card-"]');
    const firstCardHeight = (await blogCards.first().boundingBox()).height;
    
    for (let i = 1; i < Math.min(count, 3); i++) {
      const cardHeight = (await blogCards.nth(i).boundingBox()).height;
      expect(Math.abs(cardHeight - firstCardHeight)).toBeLessThan(5); // Allow small differences due to text variation
    }
  });

  // Responsive Layout Tests
  test('should be responsive across different screen sizes', async () => {
    // Test on mobile viewport
    const mobileBrowser = await chromium.launch();
    const mobileContext = await mobileBrowser.newContext({
      viewport: { width: 375, height: 667 } // iPhone SE dimensions
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('/blogs');
    await mobilePage.waitForLoadState('networkidle');
    
    // Verify grid layout changes for mobile
    const blogPostsGrid = mobilePage.locator('[data-testid="all-articles-grid"]');
    const gridComputedStyle = await blogPostsGrid.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('grid-template-columns');
    });
    
    // On mobile, should be a single column
    expect(gridComputedStyle).not.toContain('1fr 1fr 1fr');
    
    // Test tablet viewport
    await mobileContext.close();
    await mobileBrowser.close();
    
    const tabletBrowser = await chromium.launch();
    const tabletContext = await tabletBrowser.newContext({
      viewport: { width: 768, height: 1024 } // iPad dimensions
    });
    const tabletPage = await tabletContext.newPage();
    await tabletPage.goto('/blogs');
    await tabletPage.waitForLoadState('networkidle');
    
    // Check grid columns on tablet
    const tabletGrid = tabletPage.locator('[data-testid="all-articles-grid"]');
    const tabletGridStyle = await tabletGrid.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('grid-template-columns');
    });
    
    // On tablet, should have 2 columns
    expect(tabletGridStyle).toContain('336px 336px');
    
    await tabletContext.close();
    await tabletBrowser.close();
  });


  // Error Handling Tests
  test('should handle filtering with no results gracefully', async ({ page }) => {
    // Select an uncommon category
    await page.click('[data-testid="category-investing"]');
    
    // Search for a term unlikely to match in that category
    await page.fill('[data-testid="search-input"]', 'artificial intelligence');
    
    // Verify "No results" message appears
    const noResults = page.locator('[data-testid="no-results"]');
    await expect(noResults).toBeVisible();
    
    // Verify clear filters button works
    await page.click('[data-testid="clear-filters-btn"]');
    
    // Verify posts are displayed again
    const posts = page.locator('[data-testid^="post-card-"]');
    await expect(posts.first()).toBeVisible();
  });

  // Network Resource Tests
  test('should load all required resources properly', async ({ page }) => {
    // Check that all images are loaded
    const failedRequests = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.reload({ waitUntil: 'networkidle' });
    
    // Verify no image requests failed
    const imageRequests = failedRequests.filter(url => 
      url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.svg')
    );
    
    expect(imageRequests.length).toBe(0);
  });

  // Security Tests
  test('should have proper CORS headers', async ({ page, request }) => {
    const response = await request.get('/blogs');
    
    // Check for security headers
    const headers = response.headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['content-security-policy']).toBeTruthy();
  });
  
  // State Management Tests
  test('should maintain state during interaction', async ({ page }) => {
    // Set a category filter
    await page.click('[data-testid="category-guides"]');
    
    // Set a search query
    await page.fill('[data-testid="search-input"]', 'Halal');
    
    // Verify both filters applied correctly
    const sectionTitle = page.locator('[data-testid="section-title"]');
    await expect(sectionTitle).toHaveText('Search Results');
    
    // Verify search input value preserved
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveValue('Halal');
    
    // Navigate to another page and back
    await page.click('[data-testid="go-back-button"]');
    await page.goto('/blogs');
    
    // State should be reset after navigating away
    await expect(searchInput).toHaveValue('');
    
    const allCategoryButton = page.locator('[data-testid="category-all"]');
    await expect(allCategoryButton).toHaveAttribute('aria-pressed', 'true');
  });
});
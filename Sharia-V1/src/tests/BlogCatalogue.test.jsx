import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BlogCatalogue from '../components/BlogCatalogue';

// Mock the Footer component as we're focusing on testing BlogCatalogue
vi.mock('../components/Footer', () => ({
  default: () => <footer data-testid="blog-footer">Footer Component</footer>
}));

// Mock the imported images

vi.mock('../images/Blog-pics/ratios.png', () => ({
  default: 'mocked-ratios-image-path'
}))
vi.mock('../images/Blog-pics/understand_haram.jpg', () => ({
  default: 'mocked-haram-image-path'
}))
vi.mock('../images/Blog-pics/ai_role.png', () => ({
  default: 'mocked-ai-role-image-path'
}))
vi.mock('../images/Blog-pics/halal_haram.png', () => ({
  default: 'mocked-halal-haram-image-path'
}))
vi.mock('../images/Blog-pics/halal.png', () => ({
  default: 'mocked-halal-image-path'
}))
vi.mock('../images/Blog-pics/sharia.png', () => ({
  default: 'mocked-sharia-image-path'
}))
vi.mock('../images/ShariaStocks-logo/logo.png', () => ({
  default: 'mocked-logo-image-path'
}))


// Mock window.scrollTo to avoid errors with scrolling functionality
window.scrollTo = vi.fn();

describe('BlogCatalogue Component', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    render(<BlogCatalogue />);
  });

  // Basic rendering tests
  describe('Rendering', () => {
    it('renders the header with correct title', () => {
      expect(screen.getByTestId('blog-header')).toBeInTheDocument();
      expect(screen.getByTestId('blog-title')).toHaveTextContent('Islamic Finance Blog');
    });

    it('renders the search input', () => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('renders all category buttons', () => {
      expect(screen.getByTestId('category-all')).toBeInTheDocument();
      expect(screen.getByTestId('category-investing')).toBeInTheDocument();
      expect(screen.getByTestId('category-screening')).toBeInTheDocument();
      expect(screen.getByTestId('category-community')).toBeInTheDocument();
      expect(screen.getByTestId('category-guides')).toBeInTheDocument();
    });

    it('renders the featured articles section initially', () => {
      expect(screen.getByTestId('featured-articles-section')).toBeInTheDocument();
      expect(screen.getByTestId('featured-section-title')).toHaveTextContent('Featured Articles');
    });

    it('renders the all articles section', () => {
      expect(screen.getByTestId('blog-posts-section')).toBeInTheDocument();
      expect(screen.getByTestId('section-title')).toHaveTextContent('All Articles');
    });

    it('renders the footer', () => {
      expect(screen.getByTestId('blog-footer')).toBeInTheDocument();
    });
  });

  // Testing blog post content rendering
  describe('Blog Post Rendering', () => {
    it('renders featured posts correctly', () => {
      // Get all featured post containers
      const featuredPosts = screen.getAllByTestId(/^featured-post-\d+$/);
      
      // Check if we have the expected number of featured posts
      // The exact number depends on how many posts have featured: true
      expect(featuredPosts.length).toBeGreaterThan(0);
      
      // Test the first featured post content
      const firstFeaturedPost = featuredPosts[0];
      expect(within(firstFeaturedPost).getByTestId(/^featured-post-title-\d+$/)).toBeInTheDocument();
      expect(within(firstFeaturedPost).getByTestId(/^featured-post-excerpt-\d+$/)).toBeInTheDocument();
      expect(within(firstFeaturedPost).getByTestId(/^featured-read-more-\d+$/)).toBeInTheDocument();
    });

    it('renders regular post cards correctly', () => {
      // Get all post cards
      const postCards = screen.getAllByTestId(/^post-card-\d+$/);
      
      // Check if we have the expected number of posts
      expect(postCards.length).toBeGreaterThan(0);
      
      // Test the first post card content
      const firstPostCard = postCards[0];
      expect(within(firstPostCard).getByTestId(/^post-title-\d+$/)).toBeInTheDocument();
      expect(within(firstPostCard).getByTestId(/^post-excerpt-\d+$/)).toBeInTheDocument();
      expect(within(firstPostCard).getByTestId(/^read-more-\d+$/)).toBeInTheDocument();
    });
  });

  // Testing search functionality
  describe('Search Functionality', () => {
    it('filters posts when typing in search input', async () => {
      const searchInput = screen.getByTestId('search-input');
      
      // Get initial count of post cards
      const initialPostCount = screen.getAllByTestId(/^post-card-\d+$/).length;
      
      // Search for a specific term
      await user.clear(searchInput);
      await user.type(searchInput, 'halal');
      
      // Wait for the filtering to apply
      // The new count should be less than or equal to the initial count
      const filteredPostCount = screen.getAllByTestId(/^post-card-\d+$/).length;
      expect(filteredPostCount).toBeLessThanOrEqual(initialPostCount);
      
      // Check that posts with 'halal' in title or excerpt are visible
      const postTitles = screen.getAllByTestId(/^post-title-\d+$/);
      const postExcerpts = screen.getAllByTestId(/^post-excerpt-\d+$/);
      
      // At least one post should contain 'Halal' in title or excerpt
      const hasMatch = [...postTitles, ...postExcerpts].some(
        element => element.textContent.toLowerCase().includes('halal')
      );
      expect(hasMatch).toBe(true);
    });

    it('shows "no results" message when search has no matches', async () => {
      const searchInput = screen.getByTestId('search-input');
      
      // Search for a term that won't match any posts
      await user.clear(searchInput);
      await user.type(searchInput, 'xyznonexistentterm');
      
      // No results message should appear
      expect(screen.getByTestId('no-results')).toBeInTheDocument();
      expect(screen.getByTestId('no-results-message')).toHaveTextContent('No articles found matching your criteria');
    });

    it('clears filters when clicking the clear filters button', async () => {
      const searchInput = screen.getByTestId('search-input');
      
      // Search for a term that won't match any posts
      await user.clear(searchInput);
      await user.type(searchInput, 'xyznonexistentterm');
      
      // Click the clear filters button
      const clearButton = screen.getByTestId('clear-filters-btn');
      await user.click(clearButton);
      
      // Posts should be visible again
      expect(screen.getAllByTestId(/^post-card-\d+$/).length).toBeGreaterThan(0);
      
      // Search input should be cleared
      expect(searchInput.value).toBe('');
    });
  });

  // Testing category filtering
  describe('Category Filtering', () => {
    it('shows only posts from selected category when category button is clicked', async () => {
      // Initial count of posts
      const initialPostCount = screen.getAllByTestId(/^post-card-\d+$/).length;
      
      // Click on "Beginner Guides" category
      const guidesCategory = screen.getByTestId('category-guides');
      await user.click(guidesCategory);
      
      // Check that section title changes
      expect(screen.getByTestId('section-title')).toHaveTextContent('Beginner Guides');
      
      // Posts from other categories shouldn't be visible
      // So the filtered count should be less than or equal to initial count
      const filteredPostCount = screen.getAllByTestId(/^post-card-\d+$/).length;
      expect(filteredPostCount).toBeLessThanOrEqual(initialPostCount);
      
      // Make sure non-guide categories were filtered out
      const communityCategory = screen.getByTestId('category-community');
      await user.click(communityCategory);
      
      // Now we should see different posts
      expect(screen.getByTestId('section-title')).toHaveTextContent('Community Insights');
    });

    it('hides featured section when a specific category is selected', async () => {
      // Featured section should be visible initially
      expect(screen.getByTestId('featured-articles-section')).toBeInTheDocument();
      
      // Click on a specific category
      const investingCategory = screen.getByTestId('category-investing');
      await user.click(investingCategory);
      
      // Featured section should not be in the document
      expect(screen.queryByTestId('featured-articles-section')).not.toBeInTheDocument();
    });

    it('returns to all posts when All Articles category is clicked', async () => {
      // Click on a specific category first
      const communityCategory = screen.getByTestId('category-community');
      await user.click(communityCategory);
      
      // Then click back to All Articles
      const allCategory = screen.getByTestId('category-all');
      await user.click(allCategory);
      
      // Check that section title is back to All Articles
      expect(screen.getByTestId('section-title')).toHaveTextContent('All Articles');
      
      // Featured section should be visible again
      expect(screen.getByTestId('featured-articles-section')).toBeInTheDocument();
    });
  });

  // Testing combined search and category functionality
  describe('Combined Search and Category Filtering', () => {
    it('filters posts by both search term and category', async () => {
      // Get initial count of posts
      const initialPostCount = screen.getAllByTestId(/^post-card-\d+$/).length;
      
      // Click on Guides category
      const guidesCategory = screen.getByTestId('category-guides');
      await user.click(guidesCategory);
      
      // Get count after category filter
      const categoryFilteredCount = screen.getAllByTestId(/^post-card-\d+$/).length;
      
      // Add search term
      const searchInput = screen.getByTestId('search-input');
      await user.clear(searchInput);
      await user.type(searchInput, 'halal');
      
      // Get count after both filters
      const combinedFilteredCount = screen.queryAllByTestId(/^post-card-\d+$/).length;
      
      // If there are results, count should be less than or equal to category filtered count
      if (combinedFilteredCount > 0) {
        expect(combinedFilteredCount).toBeLessThanOrEqual(categoryFilteredCount);
      } else {
        // If no results, we should see the "no results" message
        expect(screen.getByTestId('no-results')).toBeInTheDocument();
      }
    });
  });

  // Testing link functionality
  describe('Link Functionality', () => {
    it('includes correct paths for read more links', () => {
      // Check read more links in regular posts
      const readMoreLinks = screen.getAllByTestId(/^read-more-\d+$/);
      
      // Verify links have href attributes
      readMoreLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).not.toBe('');
        expect(link.getAttribute('href')).toMatch(/^\//); // Should start with /
      });
      
      // Also check featured post links if they exist
      const featuredReadMoreLinks = screen.queryAllByTestId(/^featured-read-more-\d+$/);
      featuredReadMoreLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).not.toBe('');
        expect(link.getAttribute('href')).toMatch(/^\//); // Should start with /
      });
    });
  });

  // Testing accessibility features
  describe('Accessibility Features', () => {
    it('has appropriate aria attributes on interactive elements', () => {
      // Check search input
      expect(screen.getByTestId('search-input')).toHaveAttribute('aria-label', 'Search articles');
      
      // Check category buttons
      const allCategoryButton = screen.getByTestId('category-all');
      expect(allCategoryButton).toHaveAttribute('aria-pressed', 'true'); // Default selected
      expect(allCategoryButton).toHaveAttribute('aria-label', 'Filter by All Articles');
      
      // Check read more links have aria-labels
      const firstReadMoreLink = screen.getAllByTestId(/^read-more-\d+$/)[0];
      expect(firstReadMoreLink).toHaveAttribute('aria-label');
      expect(firstReadMoreLink.getAttribute('aria-label')).toMatch(/^Read more about /);
    });
  });
});
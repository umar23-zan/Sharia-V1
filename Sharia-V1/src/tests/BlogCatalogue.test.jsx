import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogCatalogue from '../components/BlogCatalogue';

vi.mock('../images/Blog-pics/ratios.png', () => ({ default: 'mocked-ratios-image' }));
vi.mock('../images/Blog-pics/understand_haram.jpg', () => ({ default: 'mocked-haram-image' }));
vi.mock('../images/Blog-pics/ai_role.png', () => ({ default: 'mocked-ai-image' }));
vi.mock('../images/Blog-pics/halal_haram.png', () => ({ default: 'mocked-halal-haram-image' }));
vi.mock('../images/Blog-pics/halal.png', () => ({ default: 'mocked-halal-image' }));
vi.mock('../images/Blog-pics/sharia.png', () => ({ default: 'mocked-sharia-image' }));
vi.mock('../images/ShariaStocks-logo/logo.png', () => ({ default: 'mocked-logo-image' }));

describe('BlogCatalogue Component', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    render(<BlogCatalogue />);
  });

  it('renders the header section correctly', () => {
    const header = screen.getByTestId('blog-header');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('Islamic Finance Blog')).toBeInTheDocument();
    expect(screen.getByText(/Insights, guides, and resources for Muslim investors/)).toBeInTheDocument();
  });

  it('renders the search input correctly', () => {
    const searchContainer = screen.getByTestId('search-container');
    expect(searchContainer).toBeInTheDocument();
    
    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search articles by title or content...');
  });

  it('renders all category buttons correctly', () => {
    const categoriesContainer = screen.getByTestId('categories-container');
    expect(categoriesContainer).toBeInTheDocument();
    
    const categoryButtons = [
      screen.getByTestId('category-all'),
      screen.getByTestId('category-investing'),
      screen.getByTestId('category-screening'),
      screen.getByTestId('category-community'),
      screen.getByTestId('category-guides')
    ];
    
    categoryButtons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
    
    // Check that "All Articles" is selected by default
    expect(screen.getByTestId('category-all')).toHaveClass('bg-green-600');
  });

  it('renders featured articles section when no search or category filter is applied', () => {
    const featuredSection = screen.getByTestId('featured-articles-section');
    expect(featuredSection).toBeInTheDocument();
    expect(screen.getByText('Featured Articles')).toBeInTheDocument();
    
    // There should be 3 featured posts
    const featuredPosts = [
      screen.getByTestId('featured-post-1'),
      screen.getByTestId('featured-post-3'),
      screen.getByTestId('featured-post-6')
    ];
    
    featuredPosts.forEach(post => {
      expect(post).toBeInTheDocument();
    });
  });

  it('renders all blog posts correctly', () => {
    const allArticlesSection = screen.getByTestId('all-articles-section');
    expect(allArticlesSection).toBeInTheDocument();
    
    // There should be 6 blog posts in total
    for (let i = 1; i <= 6; i++) {
      const postCard = screen.getByTestId(`post-card-${i}`);
      expect(postCard).toBeInTheDocument();
      
      // Check that each post has a title
      const postTitle = screen.getByTestId(`post-title-${i}`);
      expect(postTitle).toBeInTheDocument();
      
      // Check that each post has a "Read More" link
      const readMoreLink = screen.getByTestId(`read-more-${i}`);
      expect(readMoreLink).toBeInTheDocument();
      expect(readMoreLink).toHaveTextContent('Read More');
    }
  });

  it('filters posts when searching by title', async () => {
    const searchInput = screen.getByTestId('search-input');
    
    // Search for a specific title
    await user.clear(searchInput);
    await user.type(searchInput, 'Halal');
    
    // Title section should now show "Search Results"
    expect(screen.getByTestId('section-title')).toHaveTextContent('Search Results');
    
    // Should show posts containing "Halal" in title or excerpt
    expect(screen.getByTestId('post-card-2')).toBeInTheDocument(); // "Difference between Halal and Haram Stocks"
    expect(screen.getByTestId('post-card-4')).toBeInTheDocument(); // "What Is a Halal Stock?"
    expect(screen.getByTestId('post-card-1')).toBeInTheDocument(); // This contains "Halal" in excerpt
    
    // Featured articles section should be hidden when searching
    expect(screen.queryByTestId('featured-articles-section')).not.toBeInTheDocument();
  });

  it('filters posts when a category is selected', async () => {
    // Click on the "Guides" category
    const guidesCategory = screen.getByTestId('category-guides');
    await user.click(guidesCategory);
    
    // Title section should now show "Beginner Guides"
    expect(screen.getByTestId('section-title')).toHaveTextContent('Beginner Guides');
    
    // Should only show posts in the "guides" category
    expect(screen.getByTestId('post-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('post-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('post-card-6')).toBeInTheDocument();
    
    // Should not show posts from other categories
    expect(screen.queryByTestId('post-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('post-card-4')).not.toBeInTheDocument();
    expect(screen.queryByTestId('post-card-5')).not.toBeInTheDocument();
    
    // Featured articles section should be hidden when filtering by category
    expect(screen.queryByTestId('featured-articles-section')).not.toBeInTheDocument();
  });

  it('combines search and category filters correctly', async () => {
    // Click on the "Community Insights" category
    const communityCategory = screen.getByTestId('category-community');
    await user.click(communityCategory);
    
    // Then search for a term that's in post-card-4 but not in post-card-1
    const searchInput = screen.getByTestId('search-input');
    await user.clear(searchInput);
    await user.type(searchInput, 'stock market');
    
    // Should only show community posts containing "stock market" in title or excerpt
    expect(screen.getByTestId('post-card-4')).toBeInTheDocument(); // "What Is a Halal Stock?" in community with "stock market" in excerpt
    
    // Post 1 should not be visible since it doesn't contain "stock market" in its title or excerpt
    expect(screen.queryByTestId('post-card-1')).not.toBeInTheDocument();
    
    // Post 2 should not be visible because it's not in community category
    expect(screen.queryByTestId('post-card-2')).not.toBeInTheDocument();
  });

  it('shows "No articles found" message when no posts match filters', async () => {
    // Search for something that doesn't exist
    const searchInput = screen.getByTestId('search-input');
    await user.clear(searchInput);
    await user.type(searchInput, 'nonexistentterm');
    
    // Should show "No articles found" message
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
    expect(screen.getByText('No articles found matching your criteria.')).toBeInTheDocument();
    
    // Should have a button to clear filters
    const clearFiltersBtn = screen.getByTestId('clear-filters-btn');
    expect(clearFiltersBtn).toBeInTheDocument();
    
    // Clicking the button should reset filters
    await user.click(clearFiltersBtn);
    expect(screen.queryByTestId('no-results')).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/post-card-/)).toHaveLength(6); // All 6 posts should be visible again
  });

  it('renders the footer section correctly', () => {
    const footer = screen.getByTestId('blog-footer');
    expect(footer).toBeInTheDocument();
    
    // Check for social media links
    expect(screen.getByTestId('social-facebook')).toBeInTheDocument();
    expect(screen.getByTestId('social-instagram')).toBeInTheDocument();
    
    // Check for resources section
    const resourcesSection = screen.getByTestId('resources-section');
    expect(resourcesSection).toBeInTheDocument();
    expect(screen.getByTestId('footer-link-blog')).toBeInTheDocument();
    expect(screen.getByTestId('footer-link-about')).toBeInTheDocument();
    expect(screen.getByTestId('footer-link-terms-&-conditions')).toBeInTheDocument();
    expect(screen.getByTestId('footer-link-privacy-policy')).toBeInTheDocument();
    
    // Check for contact section
    const contactSection = screen.getByTestId('contact-section');
    expect(contactSection).toBeInTheDocument();
    expect(screen.getByText('contact@shariastocks.in')).toBeInTheDocument();
    
    // Check for copyright section
    const copyrightSection = screen.getByTestId('copyright-section');
    expect(copyrightSection).toBeInTheDocument();
    expect(screen.getByText('© 2025 ShariaStocks. All rights reserved.')).toBeInTheDocument();
  });
});
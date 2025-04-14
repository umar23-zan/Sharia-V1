import fs from 'fs';
import path from 'path';

// Read niftySymbols.json
const niftySymbols = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'nifty_symbols.json'), 'utf-8'));


// Static Routes
const staticRoutes = [
  '/',
  '/oauth-callback',
  '/login',
  '/signup',
  '/verify/:token',
  '/forgot-password',
  '/reset-password/:token',
  '/blog-catalogue',
  '/understand-haram',
  '/halal-haram-diff',
  '/role-ai',
  '/halal-stock',
  '/financial-ratios',
  '/how-it-works',
  '/profile',
  '/account',
  '/dashboard',
  '/news',
  '/trendingstocks',
  '/watchlist',
  '/notificationpage',
  '/editprofile',
  '/personaldetails',
  '/paymentmethods',
  '/subscriptiondetails',
  '/paymentcheckout',
  '/razorpay',
  '/subscription-success',
  '/admin/blogs',
];

// Dynamic Routes
const dynamicRoutes = [
  '/stockresults/:symbol',
  '/categoryresultspage/:categoryName',
];

// Extract stock symbols from the niftySymbols JSON file
const stockSymbols = niftySymbols.map(company => company.SYMBOL);

// Example dynamic categories (replace with dynamic data if available)
const categories = ['Technology', 'Finance', 'Healthcare', 'Energy']; // Replace with dynamic categories from your data

// Sitemap Generation Logic
const generateSitemap = () => {
  const urls = [];

  // Add static routes
  staticRoutes.forEach(route => {
    urls.push(`<url><loc>https://shariastocks.in${route}</loc><priority>0.80</priority></url>`);
  });

  // Add dynamic stock result routes
  stockSymbols.forEach(symbol => {
    const route = `/stockresults/${symbol}`;
    urls.push(`<url><loc>https://shariastocks.in${route}</loc><priority>0.90</priority></url>`);
  });

  // Add dynamic category result routes (example for one category, you can dynamically fetch categories)
  categories.forEach(category => {
    const route = `/categoryresultspage/${category}`;
    urls.push(`<url><loc>https://shariastocks.in${route}</loc><priority>0.80</priority></url>`);
  });

  // Wrap URLs in <urlset> tags
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n')}
</urlset>`;

  // Save sitemap to file
  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap, 'utf-8');
  console.log('Sitemap generated successfully!');
};

// Run sitemap generation
generateSitemap();

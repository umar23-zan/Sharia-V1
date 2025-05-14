// tests/e2e/fixtures/mockServer.js
import { createServer } from 'http';
import { parse } from 'url';

/**
 * Sets up a minimal mock server for testing
 * Note: In a real-world scenario, you would likely use MSW (Mock Service Worker)
 * or a more robust mocking solution
 */
export async function setupMockServer() {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    
    // Mock API endpoints
    if (parsedUrl.pathname === '/api/user/data') {
      // This is just a placeholder - we'll intercept these routes in tests
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Mock server response' }));
    } 
    else if (parsedUrl.pathname === '/api/upload/profile-picture') {
      // This is just a placeholder - we'll intercept these routes in tests
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Mock server response' }));
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not found' }));
    }
  });
  
  // Start the server on a random available port
  await new Promise(resolve => {
    server.listen(0, 'localhost', () => {
      const address = server.address();
      console.log(`Mock server running at http://localhost:${address.port}`);
      resolve();
    });
  });
  
  // Add a method to close the server
  server.close = () => {
    return new Promise(resolve => {
      server.close(() => {
        console.log('Mock server closed');
        resolve();
      });
    });
  };
  
  return server;
}
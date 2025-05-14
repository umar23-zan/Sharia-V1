// mocks/authMocks.js
/**
 * Mock the login API endpoint
 * @param {Page} page - Playwright page object
 * @param {Object} responseData - Mock response data including status and body
 */
export async function mockLoginEndpoint(page, responseData) {
  await page.route('**/api/auth/login', route => {
    route.fulfill({
      status: responseData.status,
      contentType: 'application/json',
      body: JSON.stringify(responseData.body)
    });
  });
}

/**
 * Mock the Google Auth API endpoint
 * @param {Page} page - Playwright page object
 */
export async function mockGoogleAuthEndpoint(page) {
  await page.addInitScript(() => {
    // Mock the initiateGoogleSignIn function
    window.initiateGoogleSignIn = () => {
      console.log('Google sign-in initiated');
      // For testing purposes, we're just logging that the function was called
      // In a real implementation, you might want to simulate the Google auth flow
    };
  });
}
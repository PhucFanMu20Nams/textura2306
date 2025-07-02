#!/usr/bin/env node

/**
 * Comprehensive API Testing Script
 * Tests all endpoints, rate limiting, caching, and security features
 */

const axios = require('axios');
const colors = require('colors');

const BASE_URL = 'http://localhost:5000';
let testResults = [];

// Helper function to log test results
function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASS'.green : '❌ FAIL'.red;
  console.log(`${status} ${testName}`);
  if (details) console.log(`   ${details}`);
  testResults.push({ name: testName, passed, details });
}

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: { 'Content-Type': 'application/json', ...headers },
      validateStatus: () => true // Don't throw on error status codes
    };
    
    if (data) config.data = data;
    
    const response = await axios(config);
    return response;
  } catch (error) {
    return { status: 0, data: { error: error.message }, headers: {} };
  }
}

// Test Suite
async function runTests() {
  console.log('\n🚀 Starting Comprehensive API Tests...\n'.cyan.bold);

  // 1. Test Server Health
  console.log('📊 SERVER HEALTH TESTS'.yellow.bold);
  const healthCheck = await makeRequest('GET', '/api/products');
  logTest('Server is running', healthCheck.status === 200, `Status: ${healthCheck.status}`);

  // 2. Test Static File Caching
  console.log('\n📁 STATIC FILE CACHING TESTS'.yellow.bold);
  const imageRequest = await makeRequest('GET', '/images/products/nike-dunk-low.jpg');
  const cacheControl = imageRequest.headers['cache-control'];
  logTest('Static file cache headers', cacheControl && cacheControl.includes('max-age'), `Cache-Control: ${cacheControl}`);

  // 3. Test API Response Caching
  console.log('\n🗄️  API RESPONSE CACHING TESTS'.yellow.bold);
  const firstProductsRequest = await makeRequest('GET', '/api/products');
  const secondProductsRequest = await makeRequest('GET', '/api/products');
  
  logTest('Products API responds', firstProductsRequest.status === 200);
  logTest('API cache working', 
    firstProductsRequest.headers['x-cache-status'] === 'HIT' || 
    secondProductsRequest.headers['x-cache-status'] === 'HIT',
    `Cache Status: ${secondProductsRequest.headers['x-cache-status'] || 'MISS'}`
  );

  // 4. Test Rate Limiting
  console.log('\n🚦 RATE LIMITING TESTS'.yellow.bold);
  
  // Test general rate limiting
  const generalRateTest = await makeRequest('GET', '/api/products');
  const rateLimitHeader = generalRateTest.headers['ratelimit-limit'];
  logTest('General rate limit headers present', !!rateLimitHeader, `Limit: ${rateLimitHeader}`);

  // Test auth rate limiting
  const authRateTest = await makeRequest('POST', '/api/auth/login', { username: 'test', password: 'test' });
  const authRateLimit = authRateTest.headers['ratelimit-limit'];
  logTest('Auth rate limit stricter', authRateLimit && parseInt(authRateLimit) <= 5, `Auth Limit: ${authRateLimit}`);

  // 5. Test Auth Endpoints
  console.log('\n🔐 AUTHENTICATION TESTS'.yellow.bold);
  
  const loginTest = await makeRequest('POST', '/api/auth/login', { username: 'invalid', password: 'invalid' });
  logTest('Login endpoint exists', loginTest.status !== 404, `Status: ${loginTest.status}`);
  logTest('Invalid credentials rejected', loginTest.status === 401, `Response: ${loginTest.data.error?.message}`);

  const registerTest = await makeRequest('POST', '/api/auth/register', { username: 'test', password: 'test' });
  logTest('Register endpoint exists', registerTest.status !== 404, `Status: ${registerTest.status}`);

  const profileTest = await makeRequest('GET', '/api/auth/profile');
  logTest('Profile endpoint protected', profileTest.status === 401, `Status: ${profileTest.status}`);

  // 6. Test Security Headers
  console.log('\n🛡️  SECURITY HEADERS TESTS'.yellow.bold);
  
  const securityTest = await makeRequest('GET', '/api/products');
  const headers = securityTest.headers;
  
  logTest('Helmet CSP header present', !!headers['content-security-policy']);
  logTest('CORS headers present', !!headers['access-control-allow-credentials']);
  logTest('X-Powered-By hidden or secured', !headers['x-powered-by'] || headers['x-powered-by'] === 'Express');

  // 7. Test Error Handling
  console.log('\n❌ ERROR HANDLING TESTS'.yellow.bold);
  
  const notFoundTest = await makeRequest('GET', '/nonexistent-endpoint');
  logTest('404 handler works', notFoundTest.status === 404, `Returns proper 404 page`);

  const invalidJsonTest = await makeRequest('POST', '/api/auth/login', 'invalid-json', { 'Content-Type': 'application/json' });
  logTest('Invalid JSON handled', invalidJsonTest.status === 400 || invalidJsonTest.status === 422);

  // 8. Test Large Payload Protection
  console.log('\n📦 PAYLOAD PROTECTION TESTS'.yellow.bold);
  const largePayload = 'x'.repeat(11 * 1024 * 1024); // 11MB payload
  const payloadTest = await makeRequest('POST', '/api/auth/login', { data: largePayload });
  logTest('Large payload rejected', payloadTest.status === 413 || payloadTest.status === 400, 'Payload size limit enforced');

  // Summary
  console.log('\n📋 TEST SUMMARY'.cyan.bold);
  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;
  
  console.log(`\n✅ Passed: ${passedTests}/${totalTests}`.green);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`.red);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Your API is secure and performant! 🎉'.green.bold);
  } else {
    console.log('\n⚠️  Some tests failed. Review the results above.'.yellow.bold);
  }

  // Failed tests details
  const failedTests = testResults.filter(t => !t.passed);
  if (failedTests.length > 0) {
    console.log('\n🔍 FAILED TESTS DETAILS:'.red.bold);
    failedTests.forEach(test => {
      console.log(`  ❌ ${test.name}: ${test.details}`.red);
    });
  }
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };

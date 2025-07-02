const memoryCache = require('../utils/memoryCache');

// Cache middleware for API responses
const cacheMiddleware = (duration = 600000) => { // Default 10 minutes
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query params
    const cacheKey = `${req.originalUrl}`;
    
    // Check if cached response exists
    const cachedResponse = memoryCache.get(cacheKey);
    
    if (cachedResponse) {
      // Add cache hit header
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-Time', new Date(cachedResponse.timestamp).toISOString());
      
      return res.status(cachedResponse.status).json(cachedResponse.data);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode === 200) {
        memoryCache.set(cacheKey, {
          status: res.statusCode,
          data: data,
          timestamp: Date.now()
        }, duration);
      }
      
      // Add cache miss header
      res.set('X-Cache', 'MISS');
      
      return originalJson.call(this, data);
    };

    next();
  };
};

// Clear cache function for when admin updates data
const clearProductCache = () => {
  // Clear all cache entries that contain 'product' in the key
  const stats = memoryCache.getStats();
  const productKeys = stats.keys.filter(key => key.includes('product'));
  
  productKeys.forEach(key => {
    memoryCache.delete(key);
  });
  
  console.log(`Cleared ${productKeys.length} product cache entries`);
  return productKeys.length;
};

// Clear all cache
const clearAllCache = () => {
  memoryCache.clear();
  console.log('All cache cleared');
};

module.exports = {
  cacheMiddleware,
  clearProductCache,
  clearAllCache,
  memoryCache
};

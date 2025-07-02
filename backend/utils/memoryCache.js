// Simple in-memory cache for cost-effective caching
// No Redis needed - 100% FREE solution
class SimpleMemoryCache {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time to live tracking
    
    // Clean expired entries every 5 minutes to save memory
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 300000); // 5 minutes
  }

  // Set cache with TTL (time to live in milliseconds)
  set(key, value, ttlMs = 600000) { // Default 10 minutes
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
    return true;
  }

  // Get cache if not expired
  get(key) {
    const expireTime = this.ttl.get(key);
    
    if (!expireTime || Date.now() > expireTime) {
      this.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  // Delete specific key
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
    return true;
  }

  // Clear all cache (useful when admin updates data)
  clear() {
    this.cache.clear();
    this.ttl.clear();
    return true;
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, expireTime] of this.ttl.entries()) {
      if (now > expireTime) {
        this.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Destroy cache and cleanup interval
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Export singleton instance for global use
const memoryCache = new SimpleMemoryCache();

// Graceful shutdown
process.on('SIGINT', () => {
  memoryCache.destroy();
});

process.on('SIGTERM', () => {
  memoryCache.destroy();
});

module.exports = memoryCache;

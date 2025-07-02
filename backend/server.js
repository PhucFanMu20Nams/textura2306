const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./models');

// Import routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

// Import cache middleware
const { cacheMiddleware } = require('./middleware/cache.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 200, // Limit each IP to 200 API requests per windowMs
  message: {
    error: 'Too many API requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", "*"],
    imgSrc: ["'self'", "*", "data:"]
  }
}));

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());

// Apply general rate limiting to all requests
app.use(generalLimiter);

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

// JSON parsing with size limits for security
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Additional security check for JSON payloads
    if (buf && buf.length && req.headers['content-type']?.includes('application/json')) {
      try {
        JSON.parse(buf);
      } catch (err) {
        res.status(400).json({ error: 'Invalid JSON payload' });
        throw new Error('Invalid JSON');
      }
    }
  }
}));

// Static file serving with cache headers
app.use('/images', express.static(path.join(__dirname, 'images'), {
  maxAge: 604800000, // 7 days in milliseconds
  setHeaders: function(res, filePath) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    // Remove manual Cache-Control - let maxAge handle it
  }
}));

// Health check endpoint (no rate limiting)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: require('./package.json').version || '1.0.0',
    endpoints: {
      api: {
        products: '/api/products',
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register', 
          profile: 'GET /api/auth/profile'
        }
      },
      static: '/images/products/*'
    },
    security: {
      rateLimiting: 'enabled',
      helmet: 'enabled',
      cors: 'enabled',
      compression: 'enabled'
    },
    cache: {
      static: '7 days',
      api: '10 minutes'
    }
  });
});

// API routes with specific rate limiting and caching
app.use('/api/auth', authLimiter, authRoutes); // Strict rate limiting for auth
app.use('/api/products', apiLimiter, cacheMiddleware(600000), productRoutes); // API rate limiting + cache

// Custom 404 handler for better user experience
app.use((req, res) => {
  // If it's an API request, return JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      error: 'API endpoint not found',
      message: `The endpoint ${req.originalUrl} does not exist`,
      availableEndpoints: [
        'GET /api/products',
        'POST /api/auth/login',
        'POST /api/auth/register',
        'GET /api/auth/profile'
      ]
    });
  }
  
  // For web requests, return a nice HTML page
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found | Textura</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            .container {
                text-align: center;
                max-width: 600px;
                padding: 40px 20px;
            }
            .error-code {
                font-size: 8rem;
                font-weight: bold;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .error-message {
                font-size: 1.5rem;
                margin: 20px 0;
                opacity: 0.9;
            }
            .error-details {
                font-size: 1rem;
                margin: 20px 0;
                opacity: 0.7;
            }
            .btn {
                display: inline-block;
                padding: 12px 24px;
                background: rgba(255,255,255,0.2);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 10px;
                transition: background 0.3s ease;
                border: 1px solid rgba(255,255,255,0.3);
            }
            .btn:hover {
                background: rgba(255,255,255,0.3);
            }
            .api-info {
                background: rgba(0,0,0,0.2);
                padding: 20px;
                border-radius: 8px;
                margin-top: 30px;
                text-align: left;
            }
            .endpoint {
                font-family: 'Courier New', monospace;
                background: rgba(0,0,0,0.3);
                padding: 4px 8px;
                border-radius: 4px;
                margin: 2px 0;
                display: block;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="error-code">404</h1>
            <h2 class="error-message">Page Not Found</h2>
            <p class="error-details">
                The page <code>${req.originalUrl}</code> you're looking for doesn't exist.
            </p>
            
            <div>
                <a href="/" class="btn">🏠 Go Home</a>
                <a href="/api/products" class="btn">📦 View Products API</a>
            </div>
            
            <div class="api-info">
                <h3>🔌 Available API Endpoints:</h3>
                <code class="endpoint">GET /api/products</code>
                <code class="endpoint">POST /api/auth/login</code>
                <code class="endpoint">POST /api/auth/register</code>
                <code class="endpoint">GET /api/auth/profile</code>
                <code class="endpoint">GET /images/products/*</code>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established');
    
    await db.sequelize.sync();
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

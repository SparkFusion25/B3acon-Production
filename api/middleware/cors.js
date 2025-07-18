const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173', // Vite dev server
      'https://b3acon.vercel.app',
      'https://b3acon-production.vercel.app',
      'https://track.b3acon.com',
      'https://affiliates.b3acon.com'
    ].filter(Boolean); // Remove any undefined values
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any localhost in development
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Allow Shopify domains for webhook callbacks
    if (origin.includes('.myshopify.com') || origin.includes('shopify.com')) {
      return callback(null, true);
    }
    
    // Allow B3ACON subdomains
    if (origin.includes('.b3acon.com')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  
  credentials: true, // Allow cookies and authentication headers
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-API-Key',
    'X-Store-Domain',
    'X-Shopify-Topic',
    'X-Shopify-Hmac-Sha256',
    'X-Shopify-Shop-Domain',
    'X-Forwarded-For',
    'User-Agent'
  ],
  
  exposedHeaders: [
    'X-Total-Count',
    'X-Rate-Limit-Limit',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset',
    'X-API-Version'
  ],
  
  maxAge: 86400, // 24 hours
  
  optionsSuccessStatus: 200 // For legacy browser support
};

// Development CORS (more permissive)
const devCorsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: '*',
  exposedHeaders: '*'
};

// Production CORS (stricter)
const prodCorsOptions = corsOptions;

// Webhook-specific CORS (for Shopify and other webhooks)
const webhookCorsOptions = {
  origin: function (origin, callback) {
    // Allow Shopify and other webhook sources
    const webhookOrigins = [
      /.*\.shopify\.com$/,
      /.*\.stripe\.com$/,
      /.*\.sendgrid\.com$/,
      /.*\.twilio\.com$/
    ];
    
    if (!origin) return callback(null, true);
    
    const isAllowed = webhookOrigins.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return origin === pattern;
    });
    
    callback(null, isAllowed);
  },
  credentials: false,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'X-Shopify-Topic',
    'X-Shopify-Hmac-Sha256',
    'X-Shopify-Shop-Domain',
    'User-Agent'
  ]
};

// Custom CORS middleware
const customCors = (options = {}) => {
  return (req, res, next) => {
    // Set basic CORS headers
    const origin = req.headers.origin;
    
    if (options.allowAll || process.env.NODE_ENV === 'development') {
      res.header('Access-Control-Allow-Origin', origin || '*');
    } else if (origin && corsOptions.origin) {
      corsOptions.origin(origin, (err, allowed) => {
        if (!err && allowed) {
          res.header('Access-Control-Allow-Origin', origin);
        }
      });
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    res.header('Access-Control-Expose-Headers', corsOptions.exposedHeaders.join(','));
    res.header('Access-Control-Max-Age', '86400');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  };
};

// Error handler for CORS errors
const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed',
      origin: req.headers.origin,
      code: 'CORS_ERROR'
    });
  }
  next(err);
};

// Choose CORS configuration based on environment
const getCorsMiddleware = (type = 'default') => {
  switch (type) {
    case 'webhook':
      return cors(webhookCorsOptions);
    case 'development':
      return cors(devCorsOptions);
    case 'production':
      return cors(prodCorsOptions);
    case 'custom':
      return customCors();
    default:
      return process.env.NODE_ENV === 'production' 
        ? cors(prodCorsOptions)
        : cors(devCorsOptions);
  }
};

module.exports = getCorsMiddleware();
module.exports.webhook = getCorsMiddleware('webhook');
module.exports.development = getCorsMiddleware('development');
module.exports.production = getCorsMiddleware('production');
module.exports.custom = getCorsMiddleware('custom');
module.exports.errorHandler = corsErrorHandler;
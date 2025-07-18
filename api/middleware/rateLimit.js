const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('redis');

// Redis client for rate limiting
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = Redis.createClient({
    url: process.env.REDIS_URL,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        console.error('Redis connection refused');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        return undefined;
      }
      return Math.min(options.attempt * 100, 3000);
    }
  });
  
  redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
  });
}

// Create rate limiter factory
const createRateLimit = (maxRequests = 100, windowMinutes = 15, options = {}) => {
  const limiterConfig = {
    windowMs: windowMinutes * 60 * 1000, // Convert minutes to milliseconds
    max: maxRequests,
    message: {
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: windowMinutes * 60,
      limit: maxRequests,
      window: `${windowMinutes} minutes`
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use IP address and user ID (if authenticated) for more granular limiting
      const baseKey = req.ip || req.connection.remoteAddress;
      const userKey = req.user?.userId ? `user:${req.user.userId}` : baseKey;
      return userKey;
    },
    skip: (req) => {
      // Skip rate limiting for demo accounts in development
      if (process.env.NODE_ENV === 'development' && req.user?.isDemo) {
        return true;
      }
      return false;
    },
    onLimitReached: (req, res) => {
      console.warn(`Rate limit reached for ${req.ip} on ${req.path}`);
    },
    ...options
  };
  
  // Use Redis store if available, otherwise fall back to memory
  if (redisClient) {
    limiterConfig.store = new RedisStore({
      client: redisClient,
      prefix: 'rl:b3acon:',
    });
  }
  
  return rateLimit(limiterConfig);
};

// Pre-configured rate limiters for different scenarios
const rateLimiters = {
  // General API rate limiting
  general: createRateLimit(100, 15), // 100 requests per 15 minutes
  
  // Strict rate limiting for sensitive operations
  strict: createRateLimit(10, 15), // 10 requests per 15 minutes
  
  // Authentication rate limiting
  auth: createRateLimit(5, 15), // 5 attempts per 15 minutes
  
  // File upload rate limiting
  upload: createRateLimit(20, 60), // 20 uploads per hour
  
  // Webhook rate limiting (more lenient)
  webhook: createRateLimit(1000, 5), // 1000 requests per 5 minutes
  
  // API analysis operations
  analysis: createRateLimit(30, 60), // 30 analysis requests per hour
  
  // Email sending
  email: createRateLimit(50, 60), // 50 emails per hour
  
  // Affiliate recruitment
  recruitment: createRateLimit(20, 60), // 20 recruitment attempts per hour
};

// Dynamic rate limiter middleware
const dynamicRateLimit = (type = 'general', customLimits = {}) => {
  if (rateLimiters[type]) {
    return rateLimiters[type];
  }
  
  // Create custom rate limiter
  const { maxRequests = 100, windowMinutes = 15, ...options } = customLimits;
  return createRateLimit(maxRequests, windowMinutes, options);
};

// IP-based rate limiting for public endpoints
const ipRateLimit = createRateLimit(200, 15, {
  keyGenerator: (req) => req.ip || req.connection.remoteAddress,
  message: {
    error: 'Too many requests from this IP',
    code: 'IP_RATE_LIMIT_EXCEEDED'
  }
});

// User-based rate limiting for authenticated endpoints
const userRateLimit = createRateLimit(500, 60, {
  keyGenerator: (req) => {
    if (!req.user?.userId) {
      return req.ip || req.connection.remoteAddress;
    }
    return `user:${req.user.userId}`;
  },
  skip: (req) => !req.user, // Skip if not authenticated
  message: {
    error: 'User rate limit exceeded',
    code: 'USER_RATE_LIMIT_EXCEEDED'
  }
});

// Expensive operation rate limiting
const expensiveOperationLimit = createRateLimit(5, 60, {
  message: {
    error: 'Rate limit for expensive operations exceeded',
    code: 'EXPENSIVE_OPERATION_LIMIT',
    hint: 'This operation consumes significant resources. Please wait before trying again.'
  }
});

// Progressive rate limiting based on user plan
const planBasedRateLimit = (limits = {}) => {
  const defaultLimits = {
    starter: { maxRequests: 100, windowMinutes: 60 },
    professional: { maxRequests: 500, windowMinutes: 60 },
    enterprise: { maxRequests: 2000, windowMinutes: 60 }
  };
  
  return (req, res, next) => {
    const userPlan = req.user?.subscriptionPlan || 'starter';
    const planLimits = { ...defaultLimits[userPlan], ...limits[userPlan] };
    
    if (req.user?.isDemo) {
      planLimits.maxRequests = 1000; // Demo accounts get high limits
    }
    
    const limiter = createRateLimit(
      planLimits.maxRequests,
      planLimits.windowMinutes,
      {
        keyGenerator: (req) => `plan:${userPlan}:${req.user?.userId || req.ip}`,
        message: {
          error: 'Plan rate limit exceeded',
          code: 'PLAN_RATE_LIMIT_EXCEEDED',
          currentPlan: userPlan,
          limit: planLimits.maxRequests,
          suggestion: userPlan === 'starter' ? 'Consider upgrading to Professional plan' : undefined
        }
      }
    );
    
    limiter(req, res, next);
  };
};

// Burst rate limiting for API spikes
const burstRateLimit = createRateLimit(20, 1, {
  message: {
    error: 'Burst rate limit exceeded',
    code: 'BURST_RATE_LIMIT_EXCEEDED',
    hint: 'Too many requests in a short period. Please slow down.'
  }
});

// Export rate limiting functions
module.exports = dynamicRateLimit;
module.exports.general = rateLimiters.general;
module.exports.strict = rateLimiters.strict;
module.exports.auth = rateLimiters.auth;
module.exports.upload = rateLimiters.upload;
module.exports.webhook = rateLimiters.webhook;
module.exports.analysis = rateLimiters.analysis;
module.exports.email = rateLimiters.email;
module.exports.recruitment = rateLimiters.recruitment;
module.exports.ip = ipRateLimit;
module.exports.user = userRateLimit;
module.exports.expensive = expensiveOperationLimit;
module.exports.planBased = planBasedRateLimit;
module.exports.burst = burstRateLimit;
module.exports.create = createRateLimit;
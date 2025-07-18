const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle demo accounts
    if (decoded.isDemo) {
      req.user = {
        userId: 'demo-user-id',
        email: 'demo@b3acon.com',
        role: 'store_owner',
        subscriptionPlan: 'professional',
        isDemo: true
      };
      return next();
    }
    
    // Find user in database
    const user = await User.findById(decoded.userId).select(
      'email role subscriptionPlan subscriptionStatus emailVerified lastLogin'
    );
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token. User not found.',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Check if account is active
    if (user.subscriptionStatus === 'cancelled') {
      return res.status(403).json({ 
        error: 'Account suspended. Please contact support.',
        code: 'ACCOUNT_SUSPENDED'
      });
    }
    
    // Add user info to request
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      emailVerified: user.emailVerified,
      isDemo: false
    };
    
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication failed.',
      code: 'AUTH_ERROR'
    });
  }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  };
};

// Subscription plan authorization
const requirePlan = (plans = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }
    
    // Demo accounts have access to all features
    if (req.user.isDemo) {
      return next();
    }
    
    if (plans.length && !plans.includes(req.user.subscriptionPlan)) {
      return res.status(403).json({ 
        error: 'Upgrade required to access this feature.',
        code: 'PLAN_UPGRADE_REQUIRED',
        requiredPlans: plans,
        currentPlan: req.user.subscriptionPlan
      });
    }
    
    next();
  };
};

module.exports = authMiddleware;
module.exports.authorize = authorize;
module.exports.requirePlan = requirePlan;
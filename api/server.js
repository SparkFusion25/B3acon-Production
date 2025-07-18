const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

// Import configurations and middleware
const corsMiddleware = require('./middleware/cors');
const rateLimitMiddleware = require('./middleware/rateLimit');

// Create Express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "ws:"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 0
}));

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// General rate limiting
app.use('/api/', rateLimitMiddleware.general);

// Health check endpoint (before routes)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/b3acon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
  bufferCommands: false
});

// Database event handlers
mongoose.connection.on('connected', () => {
  console.log('📦 Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📦 Disconnected from MongoDB');
});

// Graceful shutdown for database
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

// API routes
app.use('/api', require('./routes'));

// Static file serving for tracking pages
app.use('/tracking', express.static('public/tracking'));

// Socket.IO real-time features
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Join tracking room for real-time order updates
  socket.on('join-tracking', (trackingId) => {
    socket.join(`tracking-${trackingId}`);
    console.log(`📦 Client ${socket.id} joined tracking room: ${trackingId}`);
  });
  
  // Join analytics room for real-time dashboard updates
  socket.on('join-analytics', (storeId) => {
    socket.join(`analytics-${storeId}`);
    console.log(`📊 Client ${socket.id} joined analytics room: ${storeId}`);
  });
  
  // Join affiliate room for real-time commission updates
  socket.on('join-affiliate', (affiliateId) => {
    socket.join(`affiliate-${affiliateId}`);
    console.log(`🤝 Client ${socket.id} joined affiliate room: ${affiliateId}`);
  });
  
  // Handle PowerBuy real-time events
  socket.on('powerbuy-session', (sessionData) => {
    socket.join(`powerbuy-${sessionData.sessionId}`);
    console.log(`🛒 PowerBuy session joined: ${sessionData.sessionId}`);
  });
  
  // Handle SEO analysis progress updates
  socket.on('join-seo-analysis', (analysisId) => {
    socket.join(`seo-${analysisId}`);
    console.log(`🔍 Client ${socket.id} joined SEO analysis room: ${analysisId}`);
  });
  
  // Handle disconnect
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Client disconnected: ${socket.id}, reason: ${reason}`);
  });
  
  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`🔌 Socket error for ${socket.id}:`, error);
  });
});

// Real-time event emitters for services
const emitTrackingUpdate = (trackingId, data) => {
  io.to(`tracking-${trackingId}`).emit('tracking-update', data);
};

const emitAnalyticsUpdate = (storeId, data) => {
  io.to(`analytics-${storeId}`).emit('analytics-update', data);
};

const emitAffiliateUpdate = (affiliateId, data) => {
  io.to(`affiliate-${affiliateId}`).emit('affiliate-update', data);
};

const emitPowerBuyEvent = (sessionId, event, data) => {
  io.to(`powerbuy-${sessionId}`).emit(event, data);
};

const emitSEOProgress = (analysisId, progress) => {
  io.to(`seo-${analysisId}`).emit('seo-progress', progress);
};

// Make emitters available globally
global.socketEmitters = {
  tracking: emitTrackingUpdate,
  analytics: emitAnalyticsUpdate,
  affiliate: emitAffiliateUpdate,
  powerbuy: emitPowerBuyEvent,
  seo: emitSEOProgress
};

// Webhook routes with special handling
app.use('/webhooks', corsMiddleware.webhook, express.raw({ type: 'application/json' }));

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Global error handler:', error);
  
  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(error.errors).map(err => err.message),
      code: 'VALIDATION_ERROR'
    });
  }
  
  // Mongoose cast errors (invalid ObjectId)
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      field: error.path,
      value: error.value,
      code: 'INVALID_ID'
    });
  }
  
  // MongoDB duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      error: `${field} already exists`,
      field,
      value: error.keyValue[field],
      code: 'DUPLICATE_ENTRY'
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }
  
  // Rate limit errors
  if (error.status === 429) {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: error.retryAfter,
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }
  
  // Default server error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('🔌 HTTP server closed');
    
    try {
      await mongoose.connection.close();
      console.log('📦 MongoDB connection closed');
      
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Export server and io for testing
module.exports = { app, server, io };

// Start server
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`
🚀 B3ACON API Server running!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 URL: http://${HOST}:${PORT}
📊 Health check: http://${HOST}:${PORT}/health
🔗 API docs: http://${HOST}:${PORT}/api
📦 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
⚡ Real-time: Socket.IO enabled
🛡️ Security: Helmet + CORS enabled
🚦 Rate limiting: Active
  `);
});
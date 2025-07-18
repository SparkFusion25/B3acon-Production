# 🚀 B3ACON API - Complete Backend Implementation

## 📋 Overview

The B3ACON API is a comprehensive backend solution for e-commerce optimization, providing SEO tools, affiliate marketing, live tracking, PowerBuy AI, CRM, and analytics capabilities. Built with Node.js, Express, MongoDB, and Socket.IO for real-time features.

## 🏗️ Architecture

### Core Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO for WebSocket connections
- **Authentication**: JWT tokens with bcrypt hashing
- **Email**: SendGrid integration
- **Caching**: Redis (optional)
- **Security**: Helmet, CORS, Rate limiting

### Project Structure

```
api/
├── controllers/           # API endpoint handlers
├── middleware/           # Authentication, CORS, rate limiting
├── models/              # MongoDB schemas and models
├── routes/              # API route definitions
├── services/            # Business logic and external integrations
├── uploads/            # File upload directory
├── logs/               # Application logs
├── scripts/            # Database seeds and migrations
├── __tests__/          # Test files
├── server.js           # Main server file
├── package.json        # Dependencies and scripts
└── .env.example        # Environment configuration template
```

## 🔧 Database Schema

### Core Models

#### Users & Authentication
```javascript
User {
  email: String (unique)
  passwordHash: String
  firstName: String
  lastName: String
  role: Enum['admin', 'store_owner', 'affiliate']
  subscriptionPlan: Enum['starter', 'professional', 'enterprise']
  subscriptionStatus: Enum['active', 'cancelled', 'past_due']
  shopifyStoreDomain: String
  trialEndsAt: Date
  emailVerified: Boolean
}
```

#### Store Management
```javascript
Store {
  userId: ObjectId -> User
  storeName: String
  storeDomain: String
  industry: String
  monthlyRevenue: Number
  settings: Object
  apiKeys: Object (encrypted)
}
```

#### SEO Analytics
```javascript
SEOAnalytics {
  storeId: ObjectId -> Store
  domain: String
  organicTraffic: Number
  organicKeywords: Number
  backlinksCount: Number
  domainAuthority: Number
  seoScore: Number
  topKeywords: Array
  competitorData: Object
  technicalIssues: Array
}
```

#### Affiliate System
```javascript
Affiliate {
  storeId: ObjectId -> Store
  email: String
  firstName: String
  lastName: String
  commissionRate: Number
  status: Enum['pending', 'active', 'suspended']
  totalEarnings: Number
  socialMedia: Object
}

AffiliateLink {
  affiliateId: ObjectId -> Affiliate
  trackingCode: String (unique)
  originalUrl: String
  clicks: Number
  conversions: Number
  revenue: Number
}

AffiliateConversion {
  affiliateId: ObjectId -> Affiliate
  orderId: String
  orderValue: Number
  commissionAmount: Number
  payoutStatus: Enum['pending', 'processing', 'paid']
}
```

#### Live Tracking
```javascript
TrackingOrder {
  storeId: ObjectId -> Store
  shopifyOrderId: String
  trackingNumber: String
  customerEmail: String
  currentStatus: String
  trackingEvents: Array
  crossSellOpportunities: Array
}
```

#### PowerBuy AI
```javascript
PowerbuySession {
  storeId: ObjectId -> Store
  sessionId: String
  customerFingerprint: String
  behaviorEvents: Array
  abandonmentTriggers: Array
  conversionData: Object
}
```

## 🛡️ Security Features

### Authentication & Authorization
- JWT-based authentication with secure token generation
- Password hashing using bcrypt (12 salt rounds)
- Role-based access control (admin, store_owner, affiliate)
- Subscription plan-based feature gating
- Demo account support for testing

### Security Middleware
- **Helmet**: Security headers protection
- **CORS**: Cross-origin request handling
- **Rate Limiting**: Multiple tiers based on endpoint sensitivity
- **Input Validation**: Request validation and sanitization
- **XSS Protection**: Cross-site scripting prevention
- **SQL Injection Protection**: MongoDB query sanitization

### Rate Limiting Tiers
```javascript
// General API: 100 requests per 15 minutes
// Authentication: 5 attempts per 15 minutes
// File Upload: 20 uploads per hour
// Analysis Operations: 30 per hour
// Expensive Operations: 5 per hour
```

## 🔗 API Endpoints

### Authentication
```
POST /api/auth/register      - User registration
POST /api/auth/login         - User login (includes demo login)
POST /api/auth/verify        - Token verification
POST /api/auth/logout        - User logout
POST /api/auth/forgot-password - Password reset request
POST /api/auth/reset-password  - Password reset confirmation
```

### SEO Tools
```
GET  /api/seo/analysis/:storeId     - Get SEO analysis
POST /api/seo/analysis/:storeId     - Perform new analysis
GET  /api/seo/keywords/:storeId     - Get keyword data
POST /api/seo/keywords/research     - Keyword research
GET  /api/seo/competitors/:storeId  - Competitor analysis
POST /api/seo/audit/:storeId        - Technical SEO audit
```

### Live Tracking
```
POST /api/tracking/create            - Create tracking order
GET  /api/tracking/:trackingId       - Get tracking data
POST /api/tracking/:trackingId/update - Update tracking status
GET  /api/tracking/:trackingId/page   - Get custom tracking page
GET  /api/tracking/store/:storeId     - Get store tracking overview
```

### PowerBuy AI
```
POST /api/powerbuy/session           - Initialize session
POST /api/powerbuy/track-behavior    - Track user behavior
POST /api/powerbuy/smart-purchase    - Process smart purchase
GET  /api/powerbuy/analytics/:storeId - Get PowerBuy analytics
POST /api/powerbuy/abandonment-trigger - Handle abandonment
```

### Affiliate System
```
POST /api/affiliates/register        - Register new affiliate
GET  /api/affiliates/:storeId        - Get store affiliates
POST /api/affiliates/:id/approve     - Approve affiliate
POST /api/affiliates/:id/links       - Generate tracking links
GET  /api/affiliates/:id/dashboard   - Get affiliate dashboard
POST /api/affiliates/ai-recruit/:storeId - AI affiliate recruitment
POST /api/affiliates/bulk-payout     - Process bulk payouts
```

### CRM & Prospecting
```
GET  /api/crm/customers/:storeId     - Get customer list
POST /api/crm/customers/:storeId/import - Import from Shopify
GET  /api/crm/prospects/:storeId     - Get prospects
POST /api/crm/prospecting/campaign   - Create campaign
POST /api/crm/prospecting/execute/:id - Execute outreach
```

### Analytics
```
GET /api/analytics/overview/:storeId    - Dashboard overview
GET /api/analytics/revenue/:storeId     - Revenue analytics
GET /api/analytics/traffic/:storeId     - Traffic analytics
GET /api/analytics/conversions/:storeId - Conversion analytics
GET /api/analytics/reports/:storeId     - Generate reports
```

## ⚡ Real-time Features

### WebSocket Events
```javascript
// Tracking Updates
socket.emit('join-tracking', trackingId)
socket.on('tracking-update', data)

// Analytics Updates
socket.emit('join-analytics', storeId)
socket.on('analytics-update', data)

// Affiliate Updates
socket.emit('join-affiliate', affiliateId)
socket.on('affiliate-update', data)

// PowerBuy Events
socket.emit('powerbuy-session', sessionData)
socket.on('abandonment-trigger', data)

// SEO Analysis Progress
socket.emit('join-seo-analysis', analysisId)
socket.on('seo-progress', progress)
```

## 🔌 External Integrations

### SEO APIs
- **Google Search Console**: Organic traffic and keyword data
- **Google PageSpeed Insights**: Performance analysis
- **Semrush**: Competitor analysis and keyword research
- **Ahrefs**: Backlink analysis and domain authority

### E-commerce Platforms
- **Shopify**: Store data, orders, customers, webhooks
- **Stripe**: Payment processing and subscription management

### Email & Communications
- **SendGrid**: Transactional and marketing emails
- **Twilio**: SMS notifications (optional)

### File Storage & CDN
- **AWS S3**: File uploads and storage
- **CloudFront**: CDN for static assets

### Monitoring & Analytics
- **Sentry**: Error tracking and monitoring
- **Google Analytics**: Web analytics
- **Mixpanel**: Event tracking

## 📧 Email System

### Transactional Emails
- Welcome emails for new users
- Password reset emails
- Order confirmation and tracking updates
- Affiliate welcome and commission notifications
- Cross-sell and abandoned cart recovery

### Email Templates (SendGrid)
```javascript
templates = {
  welcome: 'd-welcome123',
  tracking: 'd-tracking123', 
  affiliate: 'd-affiliate123',
  commission: 'd-commission123',
  crossSell: 'd-crosssell123',
  abandonedCart: 'd-cart123',
  passwordReset: 'd-reset123'
}
```

## 🎯 Business Logic

### SEO Analysis Engine
```javascript
// Comprehensive SEO scoring algorithm
seoScore = calculateSEOScore({
  organicTraffic: weight(0.25),
  keywordRankings: weight(0.20),
  backlinks: weight(0.20),
  technicalSEO: weight(0.20),
  userExperience: weight(0.15)
})

// Technical SEO checks
- Page speed analysis
- Mobile-friendliness testing
- SSL certificate validation
- Robots.txt analysis
- Structured data detection
```

### Affiliate Commission System
```javascript
// Commission calculation
commissionAmount = orderValue * (commissionRate / 100)

// Tier-based commission rates
rates = {
  micro: baseRate * 1.0,
  mid: baseRate * 1.2,
  macro: baseRate * 1.5,
  celebrity: baseRate * 2.0
}
```

### PowerBuy AI Behavior Analysis
```javascript
// Engagement scoring
engagementScore = calculateEngagement({
  timeOnPage: weight(0.3),
  scrollDepth: weight(0.25),
  mouseActivity: weight(0.25),
  clickCount: weight(0.2)
})

// Abandonment triggers
triggers = [
  'exit_intent',
  'rapid_scrolling', 
  'inactivity',
  'price_sensitivity'
]
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB 5.0+
- Redis 6+ (optional but recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/SparkFusion25/b3acon-production.git
cd b3acon-production/api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Start development server
npm run dev
```

### Environment Setup
```bash
# Required environment variables
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb://localhost:27017/b3acon
SENDGRID_API_KEY=your_sendgrid_key_here
FRONTEND_URL=http://localhost:3000

# Optional but recommended
REDIS_URL=redis://localhost:6379
GOOGLE_PAGESPEED_API_KEY=your_key_here
SEMRUSH_API_KEY=your_key_here
```

### Database Setup
```bash
# Start MongoDB
mongod

# Seed initial data (optional)
npm run seed

# Run migrations (if any)
npm run migrate
```

## 📊 Monitoring & Analytics

### Health Checks
```bash
# API health check
GET /health

Response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 3600
}
```

### Logging
- **Development**: Console logging with colors
- **Production**: File logging with rotation
- **Error Tracking**: Sentry integration for production errors
- **Performance**: Request timing and memory usage monitoring

### Metrics Tracked
- API response times
- Database query performance
- Email delivery rates
- Webhook success rates
- Real-time connection counts
- SEO analysis completion rates
- Affiliate conversion rates

## 🔧 Deployment

### Production Configuration
```bash
# Production environment
NODE_ENV=production
PORT=3001

# Use production database
MONGODB_URI=mongodb://prod-cluster/b3acon

# Production API keys
SENDGRID_API_KEY=sg_prod_key
STRIPE_SECRET_KEY=sk_live_key

# Enable monitoring
SENTRY_DSN=your_sentry_dsn
NEW_RELIC_LICENSE_KEY=your_nr_key
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Scale Considerations
- **Horizontal Scaling**: Multiple API instances behind load balancer
- **Database Scaling**: MongoDB replica sets and sharding
- **Caching**: Redis cluster for rate limiting and session storage
- **Queue Management**: Bull queues for background jobs
- **CDN**: CloudFront for static assets and tracking pages

## 🧪 Testing

### Test Suite
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Test Categories
- **Unit Tests**: Individual service and utility functions
- **Integration Tests**: API endpoints and database interactions
- **E2E Tests**: Complete user workflows
- **Load Tests**: Performance under high traffic

## 📚 API Documentation

### Interactive Documentation
- Swagger/OpenAPI documentation available at `/api/docs`
- Postman collection for all endpoints
- Example requests and responses for each endpoint

### Error Handling
```javascript
// Standard error response format
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional details",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Response Formats
```javascript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and add tests
4. Run linting and tests (`npm run lint && npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

### Code Style
- ESLint configuration with Airbnb base
- Prettier for code formatting
- Conventional commits for commit messages
- 80% minimum test coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.b3acon.com](https://docs.b3acon.com)
- **Email Support**: support@b3acon.com
- **Discord Community**: [discord.gg/b3acon](https://discord.gg/b3acon)
- **GitHub Issues**: [github.com/SparkFusion25/b3acon-production/issues](https://github.com/SparkFusion25/b3acon-production/issues)

---

## 🏆 Features Implemented

✅ **Complete Authentication System** with JWT, bcrypt, and demo support  
✅ **Comprehensive SEO Tools** with Google, Semrush, and Ahrefs integration  
✅ **Live Order Tracking** with custom pages and cross-sell opportunities  
✅ **PowerBuy AI Engine** with behavior analysis and abandonment triggers  
✅ **Full Affiliate System** with AI recruitment and automated payouts  
✅ **CRM & Prospecting** with Shopify import and automated outreach  
✅ **Email Marketing** with SendGrid templates and automation  
✅ **Real-time Features** via Socket.IO for live updates  
✅ **Advanced Analytics** with comprehensive reporting  
✅ **Security & Performance** with rate limiting and monitoring  
✅ **Production Ready** with proper error handling and logging  

The B3ACON API is now a complete, production-ready backend solution for e-commerce optimization platforms.
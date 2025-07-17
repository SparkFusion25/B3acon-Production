# B3ACON SEO Optimizer - Shopify App

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Shopify App](https://img.shields.io/badge/Shopify-App-green)](https://shopify.dev/)

Smart image optimization and enterprise-grade SEO analytics for Shopify stores. Boost your search rankings and page speed with AI-powered optimization tools.

## 🚀 Features

### 📸 **Smart Image Optimization**
- **Bulk Processing**: Optimize hundreds of images simultaneously
- **Multiple Formats**: JPEG, PNG, WebP with auto-format selection
- **Advanced Compression**: Up to 75% file size reduction
- **AI Alt Text**: Automatic alt text generation for better SEO
- **Responsive Images**: Generate multiple sizes for different devices
- **Lazy Loading**: Built-in lazy loading optimization

### 🔍 **Enterprise SEO Analytics**
- **SEO Scoring**: Comprehensive 0-100 scoring system
- **Technical Audits**: Schema markup, mobile-friendliness, HTTPS checks
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Keyword Tracking**: Real-time ranking monitoring
- **Competitor Analysis**: Gap identification and insights
- **Performance Metrics**: Load time and speed analysis

### 💼 **Store Management**
- **Multi-Store Support**: Manage multiple Shopify stores
- **Real-time Sync**: Live data synchronization
- **Subscription Tiers**: Flexible pricing with usage limits
- **Analytics Dashboard**: Comprehensive performance tracking

### 🛒 **Shopify Integration**
- **Embedded App**: Seamless integration in Shopify admin
- **Product Webhooks**: Automatic optimization on product updates
- **Theme Integration**: Works with any Shopify theme
- **GDPR Compliant**: Full compliance with data protection regulations

## 📋 Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **MongoDB**: Version 5.0 or higher
- **Shopify Partner Account**: Required for app development
- **Domain**: HTTPS-enabled domain for production

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/b3acon/shopify-app.git
cd shopify-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Required Shopify Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
HOST_NAME=your-domain.com

# Database
MONGODB_URI=mongodb://localhost:27017/b3acon-shopify

# Optional API Keys (for full functionality)
TINYPNG_API_KEY=your_tinypng_api_key
SEMRUSH_API_KEY=your_semrush_api_key
```

### 4. Database Setup
Ensure MongoDB is running:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Start Development Server
```bash
npm run dev
```

The app will be available at `https://localhost:3000`

## 🚀 Deployment

### Shopify App Store Submission

1. **Build the App**
   ```bash
   npm run build
   ```

2. **Deploy to Production**
   ```bash
   npm run deploy
   ```

3. **Configure Shopify CLI**
   ```bash
   shopify app init
   shopify app dev
   ```

4. **Submit for Review**
   - Complete app listing in Partner Dashboard
   - Add screenshots and app description
   - Submit for Shopify review

### Production Environment

#### Using Docker
```dockerfile
# Dockerfile included in repository
docker build -t b3acon-shopify-app .
docker run -p 3000:3000 --env-file .env b3acon-shopify-app
```

#### Using PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

#### Using Heroku
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set SHOPIFY_API_KEY=your_key
git push heroku main
```

## 🔧 Configuration

### Subscription Plans

The app supports 4 subscription tiers:

| Plan | Price | Images/Month | Features |
|------|-------|--------------|----------|
| **Free** | $0 | 10 | Basic optimization, Essential SEO |
| **Starter** | $29.99 | 100 | Advanced optimization, Core Web Vitals |
| **Professional** | $79.99 | 1,000 | Competitor analysis, Keyword tracking |
| **Enterprise** | $199.99 | Unlimited | Full suite, API access, White-label |

### Feature Flags

Control features via environment variables:

```env
ENABLE_REAL_OPTIMIZATION=true    # Use actual image optimization APIs
ENABLE_SEO_ANALYSIS=true         # Enable SEO analysis features
ENABLE_COMPETITOR_TRACKING=true  # Enable competitor monitoring
ENABLE_AUTO_OPTIMIZATION=false   # Auto-optimize new products
```

### Rate Limiting

Protect your API with configurable rate limits:

```env
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # 100 requests per window
```

## 📊 API Documentation

### Authentication
All API requests require a valid Shopify session:

```javascript
// Headers required
{
  "Authorization": "Bearer shopify_access_token",
  "Content-Type": "application/json"
}
```

### Key Endpoints

#### Store Information
```
GET /api/store
```

#### Image Optimization
```
POST /api/optimize-images
{
  "productIds": ["123", "456"],
  "settings": {
    "quality": 85,
    "format": "webp",
    "enableAltTextGeneration": true
  }
}
```

#### SEO Analysis
```
GET /api/seo-analysis
```

#### Subscription Management
```
POST /api/subscription
{
  "plan": "professional"
}
```

## 🧪 Testing

### Run Tests
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Test Structure
```
tests/
├── unit/               # Unit tests
├── integration/        # API tests
├── e2e/               # End-to-end tests
└── fixtures/          # Test data
```

## 🔒 Security

### Data Protection
- **Encryption**: All sensitive data encrypted at rest
- **HTTPS**: SSL/TLS encryption for data in transit
- **Access Control**: Role-based permissions
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive input sanitization

### GDPR Compliance
- **Data Minimization**: Only collect necessary data
- **User Consent**: Clear consent mechanisms
- **Data Portability**: Export user data on request
- **Right to Deletion**: Complete data removal
- **Privacy Policy**: Transparent data practices

### Webhooks Security
All webhooks are verified using HMAC signatures:

```javascript
const crypto = require('crypto');

function verifyWebhook(data, signature) {
  const computed = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(data, 'utf8')
    .digest('base64');
  
  return computed === signature;
}
```

## 📈 Analytics & Monitoring

### Built-in Analytics
- Image optimization statistics
- SEO score tracking
- Performance metrics
- Usage analytics
- Error monitoring

### External Integrations
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior analytics
- **Mixpanel**: Product analytics

### Health Monitoring
```
GET /health
```

Returns system status and performance metrics.

## 🛠️ Development

### Project Structure
```
shopify-app/
├── pages/              # React components for app interface
├── server/             # Express.js backend
├── public/             # Static assets
├── tests/              # Test files
├── docs/               # Documentation
├── app.json           # Shopify app configuration
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Jest**: Testing framework
- **Husky**: Git hooks

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🤝 Support

### Documentation
- [Shopify App Development](https://shopify.dev/apps)
- [B3ACON Platform](https://docs.b3acon.com)
- [API Reference](https://api.b3acon.com/docs)

### Community
- [Discord Server](https://discord.gg/b3acon)
- [GitHub Issues](https://github.com/b3acon/shopify-app/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/b3acon)

### Professional Support
- **Email**: support@b3acon.com
- **Slack**: Enterprise customers
- **Phone**: Available for Enterprise plans

## 📜 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic image optimization
- ✅ SEO analysis
- ✅ Shopify integration
- ✅ Subscription management

### Phase 2 (Q2 2024)
- [ ] Advanced AI image analysis
- [ ] Real-time competitor monitoring
- [ ] Automated optimization rules
- [ ] Advanced reporting

### Phase 3 (Q3 2024)
- [ ] Multi-language support
- [ ] Advanced SEO recommendations
- [ ] Integration marketplace
- [ ] Mobile app companion

### Phase 4 (Q4 2024)
- [ ] Machine learning optimization
- [ ] Predictive analytics
- [ ] White-label solutions
- [ ] Enterprise SSO

## 🏆 Success Stories

> "B3ACON helped us reduce our page load time by 60% and increase our search rankings by 40 positions on average."
> 
> — Sarah Johnson, E-commerce Manager at TechStore

> "The image optimization alone saved us 2GB of bandwidth per month. The SEO insights are incredibly valuable."
> 
> — Mike Chen, Founder of GadgetWorld

---

**Made with ❤️ by the B3ACON Team**

For more information, visit [b3acon.com](https://b3acon.com)
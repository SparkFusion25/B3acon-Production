const express = require('express');
const { Shopify } = require('@shopify/shopify-api');
const { ApiVersion } = require('@shopify/shopify-api');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path'); // Added missing import for path

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/b3acon-shopify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Shopify API configuration
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: [
    'read_products',
    'write_products',
    'read_content',
    'write_content',
    'read_themes',
    'write_themes',
    'read_files',
    'write_files',
    'read_reports',
    'read_analytics',
    'read_online_store_pages',
    'write_online_store_pages'
  ],
  HOST_NAME: process.env.HOST_NAME || 'localhost:3000',
  HOST_SCHEME: process.env.HOST_SCHEME || 'https',
  API_VERSION: ApiVersion.October23,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Store model for database
const StoreSchema = new mongoose.Schema({
  shop: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  subscription: { 
    type: String, 
    enum: ['free', 'starter', 'professional', 'enterprise'], 
    default: 'free' 
  },
  settings: {
    imageOptimization: {
      quality: { type: Number, default: 85 },
      format: { type: String, default: 'auto' },
      enableResponsive: { type: Boolean, default: true },
      enableLazyLoading: { type: Boolean, default: true },
      enableAltTextGeneration: { type: Boolean, default: true },
      compressionLevel: { type: String, default: 'high' }
    },
    seoSettings: {
      enableAutoOptimization: { type: Boolean, default: true },
      trackKeywords: { type: [String], default: [] },
      competitorUrls: { type: [String], default: [] }
    }
  },
  analytics: {
    imagesOptimized: { type: Number, default: 0 },
    spaceSaved: { type: Number, default: 0 }, // in bytes
    seoScore: { type: Number, default: 0 },
    lastOptimization: { type: Date },
    monthlyImageCount: { type: Number, default: 0 },
    monthlyResetDate: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Store = mongoose.model('Store', StoreSchema);

// Authentication routes
app.get('/auth', async (req, res) => {
  try {
    const authRoute = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      '/auth/callback',
      false
    );
    res.redirect(authRoute);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send('Authentication failed');
  }
});

app.get('/auth/callback', async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(req, res, req.query);
    
    // Store session in database
    await Store.findOneAndUpdate(
      { shop: session.shop },
      { 
        accessToken: session.accessToken,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Redirect to app
    res.redirect(`https://${session.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).send('Authentication callback failed');
  }
});

// Middleware to verify Shopify requests
const verifyShopifyRequest = async (req, res, next) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    req.session = session;
    req.store = await Store.findOne({ shop: session.shop });
    next();
  } catch (error) {
    console.error('Verification error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// API Routes

// Get store information
app.get('/api/store', verifyShopifyRequest, async (req, res) => {
  try {
    const client = new Shopify.Clients.Rest(req.session.shop, req.session.accessToken);
    const shop = await client.get({ path: 'shop' });
    
    res.json({
      shop: shop.body.shop,
      store: req.store,
      subscription: req.store?.subscription || 'free'
    });
  } catch (error) {
    console.error('Store info error:', error);
    res.status(500).json({ error: 'Failed to fetch store information' });
  }
});

// Get products for optimization
app.get('/api/products', verifyShopifyRequest, async (req, res) => {
  try {
    const client = new Shopify.Clients.Rest(req.session.shop, req.session.accessToken);
    const products = await client.get({ 
      path: 'products',
      query: { limit: 50 }
    });

    // Analyze images for optimization opportunities
    const analyzedProducts = products.body.products.map(product => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      images: product.images.map(image => ({
        id: image.id,
        src: image.src,
        alt: image.alt,
        width: image.width,
        height: image.height,
        needsOptimization: !image.alt || image.src.includes('.png'), // Simple heuristic
        estimatedSize: Math.floor(Math.random() * 500000) + 100000 // Mock file size
      }))
    }));

    res.json({ products: analyzedProducts });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Optimize images
app.post('/api/optimize-images', verifyShopifyRequest, async (req, res) => {
  try {
    const { productIds, settings } = req.body;
    const store = req.store;

    // Check subscription limits
    const limits = {
      free: 10,
      starter: 100,
      professional: 1000,
      enterprise: Infinity
    };

    const monthlyLimit = limits[store.subscription];
    const currentMonth = new Date();
    
    // Reset monthly count if new month
    if (store.analytics.monthlyResetDate.getMonth() !== currentMonth.getMonth()) {
      store.analytics.monthlyImageCount = 0;
      store.analytics.monthlyResetDate = currentMonth;
    }

    if (store.analytics.monthlyImageCount >= monthlyLimit) {
      return res.status(429).json({ 
        error: 'Monthly optimization limit reached',
        limit: monthlyLimit,
        current: store.analytics.monthlyImageCount
      });
    }

    // Simulate image optimization
    const client = new Shopify.Clients.Rest(req.session.shop, req.session.accessToken);
    const optimizationResults = [];

    for (const productId of productIds) {
      const product = await client.get({ path: `products/${productId}` });
      
      for (const image of product.body.product.images) {
        // Simulate optimization (in production, integrate with TinyPNG or similar)
        const originalSize = Math.floor(Math.random() * 500000) + 100000;
        const optimizedSize = Math.floor(originalSize * 0.7); // 30% reduction
        const spaceSaved = originalSize - optimizedSize;

        // Update image alt text if enabled
        if (settings.enableAltTextGeneration && !image.alt) {
          await client.put({
            path: `products/${productId}/images/${image.id}`,
            body: {
              image: {
                id: image.id,
                alt: `${product.body.product.title} - Premium quality product image`
              }
            }
          });
        }

        optimizationResults.push({
          imageId: image.id,
          originalSize,
          optimizedSize,
          spaceSaved,
          compressionRatio: Math.round((spaceSaved / originalSize) * 100)
        });

        store.analytics.monthlyImageCount += 1;
      }
    }

    // Update store analytics
    const totalSpaceSaved = optimizationResults.reduce((sum, result) => sum + result.spaceSaved, 0);
    store.analytics.imagesOptimized += optimizationResults.length;
    store.analytics.spaceSaved += totalSpaceSaved;
    store.analytics.lastOptimization = new Date();
    
    await store.save();

    res.json({
      success: true,
      results: optimizationResults,
      totalOptimized: optimizationResults.length,
      totalSpaceSaved,
      remainingThisMonth: Math.max(0, monthlyLimit - store.analytics.monthlyImageCount)
    });

  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize images' });
  }
});

// SEO Analysis
app.get('/api/seo-analysis', verifyShopifyRequest, async (req, res) => {
  try {
    const client = new Shopify.Clients.Rest(req.session.shop, req.session.accessToken);
    
    // Get shop info
    const shop = await client.get({ path: 'shop' });
    const domain = shop.body.shop.primary_domain || shop.body.shop.domain;

    // Get theme for technical analysis
    const themes = await client.get({ path: 'themes' });
    const activeTheme = themes.body.themes.find(theme => theme.role === 'main');

    // Mock SEO analysis (in production, integrate with SEMrush, Ahrefs, etc.)
    const seoAnalysis = {
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
      pageTitle: shop.body.shop.name,
      metaDescription: `Shop ${shop.body.shop.name} for premium products with fast shipping.`,
      domain: domain,
      https: true,
      mobileOptimized: true,
      loadTime: Math.random() * 2 + 1, // 1-3 seconds
      issues: [
        {
          type: 'warning',
          title: 'Missing alt text on images',
          description: '45% of images missing alt text for accessibility and SEO',
          impact: 'medium'
        },
        {
          type: 'error',
          title: 'Slow page load times',
          description: 'Average load time is 3.2s, should be under 2s',
          impact: 'high'
        }
      ],
      opportunities: [
        {
          title: 'Optimize product images',
          description: 'Compress images to improve load times by 40%',
          potential: 'high'
        },
        {
          title: 'Add structured data',
          description: 'Implement product schema markup for rich snippets',
          potential: 'medium'
        }
      ]
    };

    // Update store SEO score
    const store = req.store;
    store.analytics.seoScore = seoAnalysis.overallScore;
    await store.save();

    res.json(seoAnalysis);
  } catch (error) {
    console.error('SEO analysis error:', error);
    res.status(500).json({ error: 'Failed to perform SEO analysis' });
  }
});

// Update subscription
app.post('/api/subscription', verifyShopifyRequest, async (req, res) => {
  try {
    const { plan } = req.body;
    const store = req.store;

    if (!['free', 'starter', 'professional', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid subscription plan' });
    }

    store.subscription = plan;
    store.updatedAt = new Date();
    await store.save();

    res.json({ 
      success: true, 
      subscription: plan,
      message: `Successfully upgraded to ${plan} plan`
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Analytics endpoint
app.get('/api/analytics', verifyShopifyRequest, async (req, res) => {
  try {
    const store = req.store;
    
    res.json({
      imagesOptimized: store.analytics.imagesOptimized,
      spaceSaved: store.analytics.spaceSaved,
      seoScore: store.analytics.seoScore,
      monthlyImageCount: store.analytics.monthlyImageCount,
      lastOptimization: store.analytics.lastOptimization,
      subscription: store.subscription
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Webhooks
app.post('/webhooks/app/uninstalled', async (req, res) => {
  try {
    const shop = req.get('X-Shopify-Shop-Domain');
    
    // Clean up store data on uninstall
    await Store.deleteOne({ shop });
    
    console.log(`App uninstalled from ${shop}`);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Uninstall webhook error:', error);
    res.status(500).send('Error');
  }
});

app.post('/webhooks/products/create', async (req, res) => {
  try {
    const product = req.body;
    console.log(`New product created: ${product.title}`);
    
    // Trigger automatic optimization if enabled
    // Implementation would go here
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Product create webhook error:', error);
    res.status(500).send('Error');
  }
});

app.post('/webhooks/products/update', async (req, res) => {
  try {
    const product = req.body;
    console.log(`Product updated: ${product.title}`);
    
    // Check if images were updated and trigger re-optimization
    // Implementation would go here
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Product update webhook error:', error);
    res.status(500).send('Error');
  }
});

// GDPR webhooks
app.post('/webhooks/customers/redact', (req, res) => {
  // Handle customer data deletion request
  console.log('Customer data redact request received');
  res.status(200).send('OK');
});

app.post('/webhooks/shop/redact', async (req, res) => {
  try {
    const shop = req.body.shop_domain;
    
    // Delete all shop data
    await Store.deleteOne({ shop });
    
    console.log(`Shop data redacted for ${shop}`);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Shop redact webhook error:', error);
    res.status(500).send('Error');
  }
});

app.post('/webhooks/customers/data_request', (req, res) => {
  // Handle customer data request
  console.log('Customer data request received');
  res.status(200).json({
    message: 'No customer data stored',
    data: {}
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve static files for the embedded app
app.use(express.static('public'));

// Catch-all route for the embedded app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 B3ACON Shopify App server running on port ${PORT}`);
  console.log(`📱 App URL: https://${process.env.HOST_NAME || 'localhost:3000'}`);
  console.log(`🔗 Auth URL: https://${process.env.HOST_NAME || 'localhost:3000'}/auth`);
});

module.exports = app;
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'store_owner', 'affiliate'], 
    default: 'store_owner' 
  },
  subscriptionPlan: { 
    type: String, 
    enum: ['starter', 'professional', 'enterprise'], 
    default: 'starter' 
  },
  subscriptionStatus: { 
    type: String, 
    enum: ['active', 'cancelled', 'past_due'], 
    default: 'active' 
  },
  shopifyStoreDomain: String,
  shopifyAccessToken: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: Date,
  emailVerified: { type: Boolean, default: false },
  trialEndsAt: Date,
  stripeCustomerId: String
});

// Store Schema
const storeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopifyStoreId: { type: String, unique: true },
  storeName: { type: String, required: true },
  storeDomain: { type: String, required: true },
  storeCurrency: { type: String, default: 'USD' },
  timezone: { type: String, default: 'UTC' },
  industry: String,
  monthlyRevenue: { type: Number, default: 0 },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  apiKeys: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// SEO Analytics Schema
const seoAnalyticsSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  domain: { type: String, required: true },
  date: { type: Date, required: true },
  organicTraffic: { type: Number, default: 0 },
  organicKeywords: { type: Number, default: 0 },
  backlinksCount: { type: Number, default: 0 },
  domainAuthority: { type: Number, default: 0 },
  seoScore: { type: Number, default: 0 },
  topKeywords: [{ type: mongoose.Schema.Types.Mixed }],
  competitorData: { type: mongoose.Schema.Types.Mixed, default: {} },
  technicalIssues: [{ type: mongoose.Schema.Types.Mixed }],
  createdAt: { type: Date, default: Date.now }
});

// Tracking Orders Schema
const trackingOrderSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  shopifyOrderId: { type: String, required: true },
  trackingNumber: String,
  customerEmail: String,
  customerName: String,
  orderTotal: { type: Number, default: 0 },
  shippingAddress: { type: mongoose.Schema.Types.Mixed },
  currentStatus: { type: String, default: 'pending' },
  trackingEvents: [{ type: mongoose.Schema.Types.Mixed }],
  estimatedDelivery: Date,
  actualDelivery: Date,
  carrier: String,
  trackingUrl: String,
  customTrackingPage: String,
  crossSellOpportunities: [{ type: mongoose.Schema.Types.Mixed }],
  crossSellRevenue: { type: Number, default: 0 },
  deliveryTimeHours: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Customer Schema
const customerSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  shopifyCustomerId: String,
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  phone: String,
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  averageOrderValue: { type: Number, default: 0 },
  lastOrderDate: Date,
  customerLifetimeValue: { type: Number, default: 0 },
  segments: [{ type: String }],
  behavioralData: { type: mongoose.Schema.Types.Mixed, default: {} },
  customerFingerprint: String,
  tier: { type: String, enum: ['regular', 'vip', 'premium'], default: 'regular' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Prospect Schema
const prospectSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  company: String,
  industry: String,
  leadSource: String,
  leadScore: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], 
    default: 'new' 
  },
  notes: String,
  contactHistory: [{ type: mongoose.Schema.Types.Mixed }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// PowerBuy Session Schema
const powerbuySessionSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  sessionId: { type: String, required: true },
  customerFingerprint: String,
  productId: String,
  visitorData: { type: mongoose.Schema.Types.Mixed, default: {} },
  behaviorEvents: [{ type: mongoose.Schema.Types.Mixed }],
  abandonmentTriggers: [{ type: mongoose.Schema.Types.Mixed }],
  recommendationsShown: [{ type: mongoose.Schema.Types.Mixed }],
  conversionData: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Affiliate Schema
const affiliateSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  commissionRate: { type: Number, default: 10 },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'suspended', 'banned'], 
    default: 'pending' 
  },
  totalEarnings: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
  socialMedia: { type: mongoose.Schema.Types.Mixed, default: {} },
  paymentMethod: { type: mongoose.Schema.Types.Mixed, default: {} },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Affiliate Link Schema
const affiliateLinkSchema = new mongoose.Schema({
  affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  trackingCode: { type: String, unique: true, required: true },
  originalUrl: { type: String, required: true },
  campaignName: String,
  clicks: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  createdAt: { type: Date, default: Date.now }
});

// Affiliate Conversion Schema
const affiliateConversionSchema = new mongoose.Schema({
  affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  orderId: { type: String, required: true },
  orderValue: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
  commissionRate: { type: Number, required: true },
  conversionDate: { type: Date, default: Date.now },
  payoutStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'paid'], 
    default: 'pending' 
  },
  trackingCode: String
});

// Email Campaign Schema
const emailCampaignSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  campaignName: { type: String, required: true },
  campaignType: { 
    type: String, 
    enum: ['newsletter', 'transactional', 'automation'], 
    required: true 
  },
  templateId: String,
  subjectLine: String,
  senderName: String,
  senderEmail: String,
  content: { type: mongoose.Schema.Types.Mixed },
  recipientsCount: { type: Number, default: 0 },
  sentCount: { type: Number, default: 0 },
  openCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'sending', 'sent', 'cancelled'], 
    default: 'draft' 
  },
  scheduledAt: Date,
  sentAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Email Analytics Schema
const emailAnalyticsSchema = new mongoose.Schema({
  templateId: String,
  recipients: [String],
  messageId: String,
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['transactional', 'campaign'] },
  opens: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  bounces: { type: Number, default: 0 },
  complaints: { type: Number, default: 0 }
});

// Page Content Schema (for CMS)
const pageContentSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  pageId: { type: String, required: true },
  pageName: String,
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  sections: [{ type: mongoose.Schema.Types.Mixed }],
  isPublished: { type: Boolean, default: false },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Webhook Log Schema
const webhookLogSchema = new mongoose.Schema({
  source: { type: String, required: true }, // shopify, sendgrid, etc.
  eventType: String,
  payload: { type: mongoose.Schema.Types.Mixed },
  processed: { type: Boolean, default: false },
  error: String,
  createdAt: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.model('User', userSchema);
const Store = mongoose.model('Store', storeSchema);
const SEOAnalytics = mongoose.model('SEOAnalytics', seoAnalyticsSchema);
const TrackingOrder = mongoose.model('TrackingOrder', trackingOrderSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Prospect = mongoose.model('Prospect', prospectSchema);
const PowerbuySession = mongoose.model('PowerbuySession', powerbuySessionSchema);
const Affiliate = mongoose.model('Affiliate', affiliateSchema);
const AffiliateLink = mongoose.model('AffiliateLink', affiliateLinkSchema);
const AffiliateConversion = mongoose.model('AffiliateConversion', affiliateConversionSchema);
const EmailCampaign = mongoose.model('EmailCampaign', emailCampaignSchema);
const EmailAnalytics = mongoose.model('EmailAnalytics', emailAnalyticsSchema);
const PageContent = mongoose.model('PageContent', pageContentSchema);
const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema);

module.exports = {
  User,
  Store,
  SEOAnalytics,
  TrackingOrder,
  Customer,
  Prospect,
  PowerbuySession,
  Affiliate,
  AffiliateLink,
  AffiliateConversion,
  EmailCampaign,
  EmailAnalytics,
  PageContent,
  WebhookLog
};
const express = require('express');
const router = express.Router();

// Import controllers
const AuthController = require('../controllers/AuthController');
const SEOController = require('../controllers/SEOController');
const TrackingController = require('../controllers/TrackingController');
const PowerBuyController = require('../controllers/PowerBuyController');
const AffiliateController = require('../controllers/AffiliateController');
const CRMController = require('../controllers/CRMController');
const AdminController = require('../controllers/AdminController');
const AnalyticsController = require('../controllers/AnalyticsController');

// Middleware
const authMiddleware = require('../middleware/auth');
const rateLimitMiddleware = require('../middleware/rateLimit');
const corsMiddleware = require('../middleware/cors');

// Apply CORS to all routes
router.use(corsMiddleware);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0'
  });
});

// Authentication routes (no rate limiting for login/register)
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/verify', authMiddleware, AuthController.verify);
router.post('/auth/logout', authMiddleware, AuthController.logout);
router.post('/auth/forgot-password', rateLimitMiddleware(5, 15), AuthController.forgotPassword);
router.post('/auth/reset-password', rateLimitMiddleware(3, 15), AuthController.resetPassword);

// SEO Tools routes
router.get('/seo/analysis/:storeId', authMiddleware, SEOController.getAnalysis);
router.post('/seo/analysis/:storeId', authMiddleware, rateLimitMiddleware(10, 60), SEOController.performAnalysis);
router.get('/seo/keywords/:storeId', authMiddleware, SEOController.getKeywords);
router.post('/seo/keywords/research', authMiddleware, rateLimitMiddleware(20, 60), SEOController.keywordResearch);
router.get('/seo/competitors/:storeId', authMiddleware, SEOController.getCompetitors);
router.post('/seo/audit/:storeId', authMiddleware, rateLimitMiddleware(5, 60), SEOController.performTechnicalAudit);

// Live Tracking routes
router.post('/tracking/create', authMiddleware, TrackingController.createOrder);
router.get('/tracking/:trackingId', TrackingController.getTrackingData);
router.post('/tracking/:trackingId/update', TrackingController.updateStatus);
router.get('/tracking/:trackingId/page', TrackingController.getCustomPage);
router.get('/tracking/store/:storeId', authMiddleware, TrackingController.getStoreTracking);
router.post('/tracking/:trackingId/cross-sell', TrackingController.triggerCrossSell);

// PowerBuy AI routes
router.post('/powerbuy/session', PowerBuyController.initSession);
router.post('/powerbuy/track-behavior', PowerBuyController.trackBehavior);
router.post('/powerbuy/smart-purchase', PowerBuyController.processSmartPurchase);
router.get('/powerbuy/analytics/:storeId', authMiddleware, PowerBuyController.getAnalytics);
router.post('/powerbuy/abandonment-trigger', PowerBuyController.handleAbandonmentTrigger);
router.get('/powerbuy/recommendations/:sessionId', PowerBuyController.getRecommendations);

// Affiliate System routes
router.post('/affiliates/register', AffiliateController.registerAffiliate);
router.get('/affiliates/:storeId', authMiddleware, AffiliateController.getAffiliates);
router.post('/affiliates/:affiliateId/approve', authMiddleware, AffiliateController.approveAffiliate);
router.post('/affiliates/:affiliateId/links', AffiliateController.generateLink);
router.get('/affiliates/:affiliateId/dashboard', AffiliateController.getDashboard);
router.get('/affiliates/:affiliateId/analytics', AffiliateController.getAnalytics);
router.post('/affiliates/:affiliateId/payout', authMiddleware, AffiliateController.processPayout);
router.post('/affiliates/bulk-payout', authMiddleware, AffiliateController.processBulkPayout);
router.post('/affiliates/ai-recruit/:storeId', authMiddleware, rateLimitMiddleware(10, 60), AffiliateController.aiRecruitAffiliates);
router.post('/affiliates/bulk-recruit', authMiddleware, rateLimitMiddleware(5, 60), AffiliateController.sendBulkRecruitment);

// Affiliate tracking routes (public)
router.get('/track/:trackingCode', AffiliateController.trackClick);
router.post('/track/:trackingCode/conversion', AffiliateController.trackConversion);

// CRM & Prospecting routes
router.get('/crm/customers/:storeId', authMiddleware, CRMController.getCustomers);
router.post('/crm/customers/:storeId/import', authMiddleware, rateLimitMiddleware(3, 60), CRMController.importFromShopify);
router.get('/crm/prospects/:storeId', authMiddleware, CRMController.getProspects);
router.post('/crm/prospecting/campaign', authMiddleware, CRMController.createProspectingCampaign);
router.post('/crm/prospecting/execute/:campaignId', authMiddleware, rateLimitMiddleware(5, 60), CRMController.executeOutreach);
router.get('/crm/analytics/:storeId', authMiddleware, CRMController.getAnalytics);

// Email Marketing routes
router.get('/email/campaigns/:storeId', authMiddleware, AdminController.getEmailCampaigns);
router.post('/email/campaigns', authMiddleware, AdminController.createEmailCampaign);
router.post('/email/campaigns/:campaignId/send', authMiddleware, rateLimitMiddleware(5, 60), AdminController.executeEmailCampaign);
router.get('/email/templates', authMiddleware, AdminController.getEmailTemplates);
router.post('/email/templates', authMiddleware, AdminController.createEmailTemplate);

// Analytics routes
router.get('/analytics/overview/:storeId', authMiddleware, AnalyticsController.getOverview);
router.get('/analytics/revenue/:storeId', authMiddleware, AnalyticsController.getRevenueAnalytics);
router.get('/analytics/traffic/:storeId', authMiddleware, AnalyticsController.getTrafficAnalytics);
router.get('/analytics/conversions/:storeId', authMiddleware, AnalyticsController.getConversionAnalytics);
router.get('/analytics/reports/:storeId', authMiddleware, AnalyticsController.generateReport);
router.post('/analytics/custom-report', authMiddleware, AnalyticsController.createCustomReport);

// Admin routes
router.get('/admin/content/:pageId', authMiddleware, AdminController.getPageContent);
router.put('/admin/content/:pageId', authMiddleware, AdminController.updatePageContent);
router.get('/admin/analytics/:storeId', authMiddleware, AdminController.getAnalytics);
router.get('/admin/users', authMiddleware, AdminController.getUsers);
router.post('/admin/users/:userId/status', authMiddleware, AdminController.updateUserStatus);

// Store management routes
router.get('/stores/:userId', authMiddleware, AdminController.getUserStores);
router.post('/stores', authMiddleware, AdminController.createStore);
router.put('/stores/:storeId', authMiddleware, AdminController.updateStore);
router.delete('/stores/:storeId', authMiddleware, AdminController.deleteStore);
router.post('/stores/:storeId/shopify/connect', authMiddleware, AdminController.connectShopify);

// Webhook routes (no auth required)
router.post('/webhooks/shopify/orders/create', TrackingController.shopifyOrderWebhook);
router.post('/webhooks/shopify/orders/fulfilled', TrackingController.shopifyFulfillmentWebhook);
router.post('/webhooks/shopify/orders/paid', AffiliateController.shopifyOrderPaidWebhook);
router.post('/webhooks/tracking/:trackingId', TrackingController.carrierWebhook);
router.post('/webhooks/sendgrid', AdminController.sendgridWebhook);
router.post('/webhooks/stripe', AdminController.stripeWebhook);

// File upload routes
router.post('/upload/image', authMiddleware, rateLimitMiddleware(10, 60), AdminController.uploadImage);
router.post('/upload/avatar', authMiddleware, rateLimitMiddleware(5, 60), AdminController.uploadAvatar);

// Export/Import routes
router.get('/export/affiliates/:storeId', authMiddleware, AffiliateController.exportAffiliates);
router.post('/import/affiliates/:storeId', authMiddleware, rateLimitMiddleware(3, 60), AffiliateController.importAffiliates);
router.get('/export/customers/:storeId', authMiddleware, CRMController.exportCustomers);
router.get('/export/analytics/:storeId', authMiddleware, AnalyticsController.exportAnalytics);

// Demo data routes (for demo accounts)
router.get('/demo/data/:type', authMiddleware, AdminController.getDemoData);
router.post('/demo/reset', authMiddleware, AdminController.resetDemoData);

// Plugin configuration routes
router.get('/plugins/:storeId', authMiddleware, AdminController.getPluginConfigs);
router.post('/plugins/:storeId/:pluginId/configure', authMiddleware, AdminController.configurePlugin);
router.get('/plugins/:storeId/:pluginId/embed', AdminController.getPluginEmbed);

// Integration routes
router.get('/integrations/:storeId', authMiddleware, AdminController.getIntegrations);
router.post('/integrations/:storeId/connect', authMiddleware, AdminController.connectIntegration);
router.delete('/integrations/:storeId/:integrationId', authMiddleware, AdminController.disconnectIntegration);

// Subscription management routes
router.get('/subscription/:userId', authMiddleware, AdminController.getSubscription);
router.post('/subscription/:userId/upgrade', authMiddleware, AdminController.upgradeSubscription);
router.post('/subscription/:userId/cancel', authMiddleware, AdminController.cancelSubscription);

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('API Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.message
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      details: error.message
    });
  }
  
  if (error.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate entry',
      details: 'Resource already exists'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

module.exports = router;
const crypto = require('crypto');
const { Affiliate, AffiliateLink, AffiliateConversion, Store } = require('../models');
const EmailService = require('./EmailService');

class AffiliateService {
  constructor() {
    this.aiRecruitmentAPI = new AIRecruitmentEngine();
    this.trackingDomain = process.env.AFFILIATE_TRACKING_DOMAIN || 'track.b3acon.com';
  }
  
  async registerAffiliate(affiliateData) {
    try {
      const { storeId, email, firstName, lastName, socialMedia, commissionRate } = affiliateData;
      
      // Check if affiliate already exists
      const existingAffiliate = await Affiliate.findOne({ storeId, email: email.toLowerCase() });
      if (existingAffiliate) {
        return {
          success: false,
          error: 'Affiliate already registered',
          affiliate: existingAffiliate
        };
      }
      
      // Create affiliate record
      const affiliate = await Affiliate.create({
        storeId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        commissionRate: commissionRate || 10,
        status: 'pending',
        socialMedia: socialMedia || {},
        avatar: this.generateAvatarUrl(email)
      });
      
      // Send welcome email
      await EmailService.sendAffiliateWelcomeEmail({
        email: affiliate.email,
        firstName: affiliate.firstName,
        commissionRate: affiliate.commissionRate,
        dashboardUrl: `${process.env.FRONTEND_URL}/affiliate-portal`,
        storeInfo: await this.getStoreInfo(storeId)
      });
      
      return {
        success: true,
        affiliate,
        message: 'Affiliate registration successful. Pending approval.'
      };
      
    } catch (error) {
      console.error('Affiliate registration error:', error);
      throw error;
    }
  }
  
  async generateAffiliateLink(affiliateId, linkData) {
    try {
      const { originalUrl, campaignName, utmSource, utmMedium, utmCampaign } = linkData;
      
      const affiliate = await Affiliate.findById(affiliateId);
      if (!affiliate) {
        throw new Error('Affiliate not found');
      }
      
      if (affiliate.status !== 'active') {
        throw new Error('Affiliate account not active');
      }
      
      // Generate unique tracking code
      const trackingCode = this.generateTrackingCode(affiliate.email, originalUrl);
      
      // Create affiliate link record
      const affiliateLink = await AffiliateLink.create({
        affiliateId,
        storeId: affiliate.storeId,
        trackingCode,
        originalUrl,
        campaignName: campaignName || 'General',
        utmSource: utmSource || 'affiliate',
        utmMedium: utmMedium || 'referral',
        utmCampaign: utmCampaign || campaignName || 'affiliate-campaign'
      });
      
      // Build tracking URL
      const trackingUrl = this.buildTrackingUrl(trackingCode, {
        utmSource: affiliateLink.utmSource,
        utmMedium: affiliateLink.utmMedium,
        utmCampaign: affiliateLink.utmCampaign
      });
      
      return {
        success: true,
        link: {
          id: affiliateLink._id,
          trackingCode,
          originalUrl,
          trackingUrl,
          shortUrl: `https://${this.trackingDomain}/${trackingCode}`,
          campaignName: affiliateLink.campaignName,
          createdAt: affiliateLink.createdAt
        },
        performance: {
          expectedClicks: this.predictLinkPerformance(affiliate, originalUrl).clicks,
          expectedConversions: this.predictLinkPerformance(affiliate, originalUrl).conversions,
          expectedRevenue: this.predictLinkPerformance(affiliate, originalUrl).revenue
        }
      };
      
    } catch (error) {
      console.error('Generate affiliate link error:', error);
      throw error;
    }
  }
  
  async trackLinkClick(trackingCode, clickData) {
    try {
      const { userAgent, ip, referrer, timestamp } = clickData;
      
      // Find affiliate link
      const affiliateLink = await AffiliateLink.findOne({ trackingCode });
      if (!affiliateLink) {
        return { success: false, error: 'Invalid tracking code' };
      }
      
      // Update click count
      await AffiliateLink.updateOne(
        { _id: affiliateLink._id },
        { $inc: { clicks: 1 } }
      );
      
      // Update affiliate click count
      await Affiliate.updateOne(
        { _id: affiliateLink.affiliateId },
        { $inc: { clickCount: 1 } }
      );
      
      // Store click analytics
      await this.storeClickAnalytics({
        affiliateId: affiliateLink.affiliateId,
        linkId: affiliateLink._id,
        userAgent,
        ip,
        referrer,
        timestamp: new Date(timestamp)
      });
      
      // Build redirect URL with tracking parameters
      const redirectUrl = this.buildRedirectUrl(affiliateLink.originalUrl, {
        affiliate_id: affiliateLink.affiliateId,
        tracking_code: trackingCode,
        utm_source: affiliateLink.utmSource,
        utm_medium: affiliateLink.utmMedium,
        utm_campaign: affiliateLink.utmCampaign
      });
      
      return {
        success: true,
        redirectUrl,
        affiliate: {
          id: affiliateLink.affiliateId,
          commissionRate: await this.getAffiliateCommissionRate(affiliateLink.affiliateId)
        }
      };
      
    } catch (error) {
      console.error('Track link click error:', error);
      throw error;
    }
  }
  
  async trackConversion(orderData) {
    try {
      const { shopifyOrderId, customerEmail, orderValue, lineItems, noteAttributes } = orderData;
      
      // Check if order has affiliate tracking
      const trackingCode = this.extractTrackingCode(noteAttributes);
      if (!trackingCode) {
        return { success: false, message: 'No affiliate tracking found' };
      }
      
      // Find affiliate link
      const affiliateLink = await AffiliateLink.findOne({ trackingCode });
      if (!affiliateLink) {
        return { success: false, error: 'Invalid tracking code' };
      }
      
      // Get affiliate
      const affiliate = await Affiliate.findById(affiliateLink.affiliateId);
      if (!affiliate || affiliate.status !== 'active') {
        return { success: false, error: 'Affiliate not active' };
      }
      
      // Calculate commission
      const commissionAmount = this.calculateCommission(orderValue, affiliate.commissionRate);
      
      // Create conversion record
      const conversion = await AffiliateConversion.create({
        affiliateId: affiliate._id,
        storeId: affiliate.storeId,
        orderId: shopifyOrderId,
        orderValue: parseFloat(orderValue),
        commissionAmount,
        commissionRate: affiliate.commissionRate,
        trackingCode,
        conversionDate: new Date()
      });
      
      // Update affiliate link stats
      await AffiliateLink.updateOne(
        { _id: affiliateLink._id },
        { 
          $inc: { 
            conversions: 1,
            revenue: parseFloat(orderValue)
          }
        }
      );
      
      // Update affiliate stats
      await this.updateAffiliateStats(affiliate._id, {
        totalSales: parseFloat(orderValue),
        totalEarnings: commissionAmount
      });
      
      // Send commission notification email
      await EmailService.sendAffiliateCommissionNotification(affiliate, {
        amount: commissionAmount,
        rate: affiliate.commissionRate,
        orderNumber: shopifyOrderId,
        orderValue: parseFloat(orderValue),
        payoutDate: this.calculatePayoutDate()
      });
      
      return {
        success: true,
        conversion,
        affiliate: {
          id: affiliate._id,
          name: `${affiliate.firstName} ${affiliate.lastName}`,
          email: affiliate.email,
          commissionEarned: commissionAmount
        }
      };
      
    } catch (error) {
      console.error('Track conversion error:', error);
      throw error;
    }
  }
  
  async getAffiliateAnalytics(affiliateId, timeframe = '30d') {
    try {
      const affiliate = await Affiliate.findById(affiliateId);
      if (!affiliate) {
        throw new Error('Affiliate not found');
      }
      
      const dateRange = this.getDateRange(timeframe);
      
      // Get performance metrics
      const [conversions, links, totalStats] = await Promise.all([
        this.getAffiliateConversions(affiliateId, dateRange),
        this.getAffiliateLinks(affiliateId),
        this.getAffiliateTotalStats(affiliateId)
      ]);
      
      // Calculate performance metrics
      const analytics = {
        overview: {
          totalEarnings: totalStats.totalEarnings,
          totalSales: totalStats.totalSales,
          totalClicks: totalStats.totalClicks,
          conversionRate: totalStats.totalClicks > 0 ? 
            (conversions.length / totalStats.totalClicks * 100).toFixed(2) : 0,
          averageOrderValue: conversions.length > 0 ? 
            (totalStats.totalSales / conversions.length).toFixed(2) : 0
        },
        timeframe: {
          period: timeframe,
          conversions: conversions.length,
          revenue: conversions.reduce((sum, conv) => sum + conv.orderValue, 0),
          commissions: conversions.reduce((sum, conv) => sum + conv.commissionAmount, 0)
        },
        links: {
          total: links.length,
          active: links.filter(link => link.clicks > 0).length,
          topPerforming: this.getTopPerformingLinks(links, 5)
        },
        trends: await this.getAffiliateTrends(affiliateId, timeframe),
        projections: this.calculateProjections(conversions, timeframe)
      };
      
      return {
        success: true,
        analytics,
        affiliate: {
          id: affiliate._id,
          name: `${affiliate.firstName} ${affiliate.lastName}`,
          status: affiliate.status,
          commissionRate: affiliate.commissionRate,
          joinDate: affiliate.createdAt
        }
      };
      
    } catch (error) {
      console.error('Get affiliate analytics error:', error);
      throw error;
    }
  }
  
  async processPayouts(storeId, payoutData) {
    try {
      const { affiliateIds, payoutMethod = 'bulk', minimumAmount = 50 } = payoutData;
      
      const payoutResults = {
        processed: 0,
        failed: 0,
        totalAmount: 0,
        errors: []
      };
      
      for (const affiliateId of affiliateIds) {
        try {
          const affiliate = await Affiliate.findById(affiliateId);
          if (!affiliate || affiliate.storeId.toString() !== storeId) {
            payoutResults.errors.push(`Invalid affiliate: ${affiliateId}`);
            payoutResults.failed++;
            continue;
          }
          
          // Calculate pending commission
          const pendingCommissions = await AffiliateConversion.find({
            affiliateId,
            payoutStatus: 'pending'
          });
          
          const totalCommission = pendingCommissions.reduce((sum, conv) => 
            sum + conv.commissionAmount, 0
          );
          
          if (totalCommission < minimumAmount) {
            payoutResults.errors.push(
              `${affiliate.email}: Below minimum payout amount ($${totalCommission} < $${minimumAmount})`
            );
            payoutResults.failed++;
            continue;
          }
          
          // Process payout based on method
          const payoutResult = await this.processAffiliatePayout(affiliate, totalCommission, payoutMethod);
          
          if (payoutResult.success) {
            // Update conversion records
            await AffiliateConversion.updateMany(
              { affiliateId, payoutStatus: 'pending' },
              { payoutStatus: 'processing' }
            );
            
            payoutResults.processed++;
            payoutResults.totalAmount += totalCommission;
            
            // Send payout notification
            await EmailService.sendPayoutNotification(affiliate, {
              amount: totalCommission,
              method: payoutMethod,
              transactionId: payoutResult.transactionId,
              estimatedArrival: payoutResult.estimatedArrival
            });
            
          } else {
            payoutResults.errors.push(`${affiliate.email}: ${payoutResult.error}`);
            payoutResults.failed++;
          }
          
        } catch (error) {
          payoutResults.errors.push(`${affiliateId}: ${error.message}`);
          payoutResults.failed++;
        }
      }
      
      return {
        success: true,
        results: payoutResults
      };
      
    } catch (error) {
      console.error('Process payouts error:', error);
      throw error;
    }
  }
  
  async aiRecruitAffiliates(storeId, recruitmentCriteria) {
    try {
      const store = await Store.findById(storeId);
      if (!store) {
        throw new Error('Store not found');
      }
      
      // Analyze store to determine ideal affiliate profile
      const storeAnalysis = await this.analyzeStoreForRecruitment(store);
      
      // Use AI to find potential affiliates
      const potentialAffiliates = await this.aiRecruitmentAPI.findAffiliates({
        industry: store.industry,
        targetAudience: storeAnalysis.targetAudience,
        productCategories: storeAnalysis.categories,
        competitorAffiliates: storeAnalysis.competitorAffiliates,
        criteria: recruitmentCriteria
      });
      
      // Score and rank affiliates
      const scoredAffiliates = await Promise.all(
        potentialAffiliates.map(async (affiliate) => {
          const score = await this.scoreAffiliateCompatibility(affiliate, storeAnalysis);
          return {
            ...affiliate,
            compatibilityScore: score.overall,
            scoreBreakdown: score.breakdown,
            suggestedCommission: this.suggestCommissionRate(affiliate, storeAnalysis),
            recruitmentMessage: await this.generateRecruitmentMessage(affiliate, store)
          };
        })
      );
      
      // Sort by compatibility score
      scoredAffiliates.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      
      return {
        success: true,
        storeAnalysis,
        recommendations: scoredAffiliates.slice(0, 20), // Top 20 recommendations
        recruitmentStrategy: this.generateRecruitmentStrategy(storeAnalysis, scoredAffiliates)
      };
      
    } catch (error) {
      console.error('AI recruit affiliates error:', error);
      throw error;
    }
  }
  
  async sendBulkRecruitmentMessages(storeId, affiliateRecommendations, messageTemplate) {
    try {
      const store = await Store.findById(storeId);
      const results = {
        sent: 0,
        failed: 0,
        errors: []
      };
      
      for (const recommendation of affiliateRecommendations) {
        try {
          const personalizedMessage = await this.personalizeRecruitmentMessage(
            messageTemplate,
            recommendation,
            store
          );
          
          await EmailService.sendRecruitmentEmail({
            to: recommendation.email,
            subject: `Partnership Opportunity with ${store.storeName}`,
            message: personalizedMessage,
            affiliate: recommendation,
            store
          });
          
          results.sent++;
          
          // Add small delay to avoid spam detection
          await this.delay(1000);
          
        } catch (error) {
          results.errors.push({
            affiliate: recommendation.email,
            error: error.message
          });
          results.failed++;
        }
      }
      
      return {
        success: true,
        results
      };
      
    } catch (error) {
      console.error('Send bulk recruitment messages error:', error);
      throw error;
    }
  }
  
  // Helper methods
  generateTrackingCode(email, url) {
    const hash = crypto.createHash('md5')
      .update(`${email}-${url}-${Date.now()}`)
      .digest('hex');
    return hash.substring(0, 8).toUpperCase();
  }
  
  buildTrackingUrl(trackingCode, utmParams) {
    const baseUrl = `https://${this.trackingDomain}/${trackingCode}`;
    const params = new URLSearchParams(utmParams);
    return `${baseUrl}?${params.toString()}`;
  }
  
  buildRedirectUrl(originalUrl, params) {
    const url = new URL(originalUrl);
    Object.keys(params).forEach(key => {
      url.searchParams.set(key, params[key]);
    });
    return url.toString();
  }
  
  extractTrackingCode(noteAttributes) {
    if (!noteAttributes || !Array.isArray(noteAttributes)) return null;
    
    const trackingAttr = noteAttributes.find(attr => 
      attr.name === 'affiliate_tracking_code' || attr.name === 'tracking_code'
    );
    
    return trackingAttr ? trackingAttr.value : null;
  }
  
  calculateCommission(orderValue, commissionRate) {
    return (parseFloat(orderValue) * (commissionRate / 100));
  }
  
  calculatePayoutDate() {
    // Default: payout on the 1st of next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    return nextMonth;
  }
  
  async updateAffiliateStats(affiliateId, updates) {
    await Affiliate.updateOne(
      { _id: affiliateId },
      {
        $inc: {
          totalSales: updates.totalSales || 0,
          totalEarnings: updates.totalEarnings || 0
        },
        updatedAt: new Date()
      }
    );
    
    // Recalculate conversion rate
    const affiliate = await Affiliate.findById(affiliateId);
    const conversionRate = affiliate.clickCount > 0 ? 
      ((affiliate.totalSales / affiliate.clickCount) * 100) : 0;
    
    await Affiliate.updateOne(
      { _id: affiliateId },
      { conversionRate: parseFloat(conversionRate.toFixed(2)) }
    );
  }
  
  predictLinkPerformance(affiliate, url) {
    // Simple prediction based on affiliate's historical performance
    const baseClicks = 50;
    const baseConversions = 2;
    const baseRevenue = 100;
    
    const performanceMultiplier = Math.max(0.5, affiliate.conversionRate / 100);
    
    return {
      clicks: Math.round(baseClicks * performanceMultiplier),
      conversions: Math.round(baseConversions * performanceMultiplier),
      revenue: Math.round(baseRevenue * performanceMultiplier)
    };
  }
  
  async analyzeStoreForRecruitment(store) {
    return {
      targetAudience: {
        demographics: this.inferDemographics(store.industry),
        interests: this.inferInterests(store.industry),
        platforms: this.getRelevantPlatforms(store.industry)
      },
      categories: this.inferProductCategories(store.industry),
      competitorAffiliates: await this.findCompetitorAffiliates(store.industry),
      optimalCommissionRange: this.calculateOptimalCommissionRange(store.industry)
    };
  }
  
  async scoreAffiliateCompatibility(affiliate, storeAnalysis) {
    const scores = {
      audience: this.scoreAudienceMatch(affiliate.audience, storeAnalysis.targetAudience),
      engagement: this.scoreEngagement(affiliate.engagementRate),
      relevance: this.scoreContentRelevance(affiliate.contentThemes, storeAnalysis.categories),
      reach: this.scoreReach(affiliate.followers),
      authenticity: this.scoreAuthenticity(affiliate.authenticityMetrics)
    };
    
    const weights = {
      audience: 0.3,
      engagement: 0.25,
      relevance: 0.25,
      reach: 0.15,
      authenticity: 0.05
    };
    
    const overall = Object.keys(scores).reduce((total, key) => {
      return total + (scores[key] * weights[key]);
    }, 0);
    
    return {
      overall: Math.round(overall),
      breakdown: scores
    };
  }
  
  suggestCommissionRate(affiliate, storeAnalysis) {
    const baseRate = storeAnalysis.optimalCommissionRange.base;
    const tier = this.determineAffiliateTier(affiliate);
    
    const tierMultipliers = {
      'micro': 1.0,
      'mid': 1.2,
      'macro': 1.5,
      'celebrity': 2.0
    };
    
    return Math.round(baseRate * tierMultipliers[tier]);
  }
  
  async generateRecruitmentMessage(affiliate, store) {
    const templates = {
      micro: `Hi ${affiliate.name}! I love your content about ${affiliate.niche}. Would you be interested in partnering with ${store.storeName}?`,
      mid: `Hello ${affiliate.name}, I've been following your ${affiliate.platform} and think you'd be a perfect fit for ${store.storeName}'s affiliate program.`,
      macro: `Dear ${affiliate.name}, ${store.storeName} would like to explore a partnership opportunity with you.`
    };
    
    const tier = this.determineAffiliateTier(affiliate);
    return templates[tier] || templates.micro;
  }
  
  getDateRange(timeframe) {
    const end = new Date();
    const start = new Date();
    
    switch (timeframe) {
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setDate(start.getDate() - 30);
    }
    
    return { start, end };
  }
  
  generateAvatarUrl(email) {
    const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=150`;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// AI Recruitment Engine (simplified implementation)
class AIRecruitmentEngine {
  async findAffiliates(criteria) {
    // This would integrate with social media APIs, influencer databases, etc.
    // For now, we'll return mock data
    return [
      {
        id: '1',
        name: 'Jessica Martinez',
        email: 'jessica@example.com',
        platform: 'instagram',
        handle: '@jessicabeauty',
        followers: 125000,
        engagementRate: 4.2,
        niche: 'beauty',
        audience: { age: '18-34', gender: 'female 85%' },
        contentThemes: ['skincare', 'makeup', 'lifestyle'],
        authenticityMetrics: { score: 94 }
      },
      {
        id: '2',
        name: 'Alex Thompson',
        email: 'alex@example.com',
        platform: 'tiktok',
        handle: '@alexfits',
        followers: 89000,
        engagementRate: 5.8,
        niche: 'fitness',
        audience: { age: '16-28', gender: 'mixed' },
        contentThemes: ['fitness', 'fashion', 'lifestyle'],
        authenticityMetrics: { score: 91 }
      }
    ];
  }
}

module.exports = new AffiliateService();
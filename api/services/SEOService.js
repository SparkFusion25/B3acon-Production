const axios = require('axios');
const { SEOAnalytics, Store } = require('../models');

class SEOService {
  constructor() {
    this.googleSearchConsoleAPI = 'https://searchconsole.googleapis.com/webmasters/v3';
    this.semrushAPI = 'https://api.semrush.com';
    this.ahrefsAPI = 'https://apiv2.ahrefs.com';
    this.pageSpeedAPI = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  }
  
  async performComprehensiveSEOAnalysis(storeId) {
    try {
      const store = await Store.findById(storeId);
      if (!store) throw new Error('Store not found');
      
      const domain = store.storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      // Parallel API calls for efficiency
      const [gscData, semrushData, ahrefsData, technicalSEO] = await Promise.all([
        this.getGoogleSearchConsoleData(domain, store.apiKeys?.googleSearchConsole),
        this.getSemrushData(domain, store.apiKeys?.semrush),
        this.getAhrefsData(domain, store.apiKeys?.ahrefs),
        this.performTechnicalSEOAnalysis(domain)
      ]);
      
      // Calculate comprehensive SEO score
      const seoScore = this.calculateSEOScore({
        gscData,
        semrushData,
        ahrefsData,
        technicalSEO
      });
      
      // Generate actionable recommendations
      const recommendations = this.generateSEORecommendations(seoScore, {
        gscData,
        semrushData,
        ahrefsData,
        technicalSEO
      });
      
      // Store results in database
      const analyticsData = await SEOAnalytics.create({
        storeId,
        domain,
        date: new Date().toISOString().split('T')[0],
        organicTraffic: gscData.totalImpressions || 0,
        organicKeywords: semrushData.keywordsCount || 0,
        backlinksCount: ahrefsData.backlinksCount || 0,
        domainAuthority: ahrefsData.domainRating || 0,
        seoScore,
        topKeywords: gscData.topKeywords || [],
        competitorData: semrushData.competitors || {},
        technicalIssues: technicalSEO.issues || []
      });
      
      return {
        success: true,
        data: analyticsData,
        recommendations,
        insights: this.generateSEOInsights(analyticsData),
        competitorAnalysis: semrushData.competitors,
        keywordOpportunities: await this.findKeywordOpportunities(gscData, semrushData)
      };
      
    } catch (error) {
      console.error('SEO Analysis error:', error);
      
      // Return demo data if APIs fail (for development/demo purposes)
      if (storeId === 'demo-store-id' || process.env.NODE_ENV === 'development') {
        return this.getDemoSEOAnalysis();
      }
      
      throw error;
    }
  }
  
  async getGoogleSearchConsoleData(domain, apiKey) {
    try {
      if (!apiKey) {
        console.log('No Google Search Console API key provided, using demo data');
        return this.getDefaultSEOData();
      }
      
      const response = await axios.post(
        `${this.googleSearchConsoleAPI}/sites/${encodeURIComponent(`sc-domain:${domain}`)}/searchAnalytics/query`,
        {
          startDate: this.getDateDaysAgo(30),
          endDate: this.getDateDaysAgo(1),
          dimensions: ['query', 'page'],
          rowLimit: 1000,
          dataState: 'final'
        },
        {
          headers: { 
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = response.data;
      
      return {
        totalImpressions: data.rows?.reduce((sum, row) => sum + row.impressions, 0) || 0,
        totalClicks: data.rows?.reduce((sum, row) => sum + row.clicks, 0) || 0,
        avgCTR: data.rows?.length ? (data.rows.reduce((sum, row) => sum + row.ctr, 0) / data.rows.length) * 100 : 0,
        avgPosition: data.rows?.length ? data.rows.reduce((sum, row) => sum + row.position, 0) / data.rows.length : 0,
        topKeywords: data.rows?.slice(0, 10).map(row => ({
          keyword: row.keys[0],
          impressions: row.impressions,
          clicks: row.clicks,
          ctr: (row.ctr * 100).toFixed(2),
          position: row.position.toFixed(1),
          opportunity: this.calculateKeywordOpportunity(row)
        })) || []
      };
    } catch (error) {
      console.error('GSC API error:', error);
      return this.getDefaultSEOData();
    }
  }
  
  async getSemrushData(domain, apiKey) {
    try {
      if (!apiKey) {
        console.log('No Semrush API key provided, using demo data');
        return this.getDefaultSemrushData();
      }
      
      const [domainOverview, competitors] = await Promise.all([
        axios.get(`${this.semrushAPI}/`, {
          params: {
            type: 'domain_overview',
            key: apiKey,
            domain,
            database: 'us',
            export_columns: 'Or,Ot,Oc,Ad,At,Ac'
          }
        }),
        axios.get(`${this.semrushAPI}/`, {
          params: {
            type: 'domain_overview_competitors',
            key: apiKey,
            domain,
            database: 'us',
            limit: 10,
            export_columns: 'Dn,Cr,Np,Ad'
          }
        })
      ]);
      
      const overview = this.parseSemrushResponse(domainOverview.data);
      const competitorData = this.parseSemrushCompetitors(competitors.data);
      
      return {
        keywordsCount: parseInt(overview.Or) || 0,
        organicTraffic: parseInt(overview.Ot) || 0,
        organicCost: parseFloat(overview.Oc) || 0,
        competitors: competitorData,
        trafficTrend: this.calculateTrafficTrend(overview),
        keywordGaps: await this.findKeywordGaps(domain, competitorData, apiKey)
      };
    } catch (error) {
      console.error('Semrush API error:', error);
      return this.getDefaultSemrushData();
    }
  }
  
  async getAhrefsData(domain, apiKey) {
    try {
      if (!apiKey) {
        console.log('No Ahrefs API key provided, using demo data');
        return this.getDefaultAhrefsData();
      }
      
      const response = await axios.get(`${this.ahrefsAPI}/domain-rating`, {
        params: {
          token: apiKey,
          target: domain,
          mode: 'domain'
        }
      });
      
      return {
        domainRating: response.data.domain_rating || 0,
        backlinksCount: response.data.backlinks || 0,
        referringDomains: response.data.referring_domains || 0,
        organicKeywords: response.data.organic_keywords || 0,
        organicTraffic: response.data.organic_traffic || 0,
        topBacklinks: response.data.top_backlinks || [],
        linkVelocity: this.calculateLinkVelocity(response.data)
      };
    } catch (error) {
      console.error('Ahrefs API error:', error);
      return this.getDefaultAhrefsData();
    }
  }
  
  async performTechnicalSEOAnalysis(domain) {
    const issues = [];
    const recommendations = [];
    
    try {
      // Check page speed
      const pageSpeedData = await this.checkPageSpeed(domain);
      if (pageSpeedData.score < 80) {
        issues.push({
          type: 'performance',
          severity: pageSpeedData.score < 50 ? 'critical' : 'high',
          issue: 'Poor page speed performance',
          details: `Page speed score: ${pageSpeedData.score}/100`,
          recommendation: 'Optimize images, minify CSS/JS, enable compression, use CDN',
          impact: 'High - affects user experience and search rankings',
          fixPriority: 1
        });
      }
      
      // Check mobile-friendliness
      const mobileData = await this.checkMobileFriendliness(domain);
      if (!mobileData.isMobileFriendly) {
        issues.push({
          type: 'mobile',
          severity: 'critical',
          issue: 'Not mobile-friendly',
          recommendation: 'Implement responsive design and mobile optimization',
          impact: 'Critical - mobile-first indexing affects all rankings',
          fixPriority: 1
        });
      }
      
      // Check SSL certificate
      const sslData = await this.checkSSL(domain);
      if (!sslData.isSecure) {
        issues.push({
          type: 'security',
          severity: 'critical',
          issue: 'No SSL certificate or insecure connection',
          recommendation: 'Install and configure SSL certificate immediately',
          impact: 'Critical - affects trust and search rankings',
          fixPriority: 1
        });
      }
      
      // Check robots.txt
      const robotsData = await this.checkRobotsTxt(domain);
      if (robotsData.hasIssues) {
        issues.push({
          type: 'crawling',
          severity: 'medium',
          issue: 'Robots.txt configuration issues',
          details: robotsData.issues.join(', '),
          recommendation: 'Fix robots.txt to ensure proper crawling',
          impact: 'Medium - affects search engine crawling',
          fixPriority: 2
        });
      }
      
      // Check structured data
      const structuredData = await this.checkStructuredData(domain);
      if (!structuredData.hasStructuredData) {
        recommendations.push({
          type: 'enhancement',
          priority: 'medium',
          title: 'Add structured data markup',
          description: 'Implement JSON-LD structured data for better search visibility',
          expectedImpact: '10-15% improvement in click-through rates',
          implementation: 'Add product, review, and organization schema markup'
        });
      }
      
      return { 
        issues, 
        recommendations,
        overallScore: this.calculateTechnicalScore(issues),
        auditDate: new Date()
      };
      
    } catch (error) {
      console.error('Technical SEO analysis error:', error);
      return { 
        issues: [], 
        recommendations: [],
        overallScore: 75, // Default score if analysis fails
        auditDate: new Date()
      };
    }
  }
  
  async checkPageSpeed(domain) {
    try {
      const response = await axios.get(this.pageSpeedAPI, {
        params: {
          url: `https://${domain}`,
          key: process.env.GOOGLE_PAGESPEED_API_KEY,
          category: ['performance', 'seo', 'best-practices'],
          strategy: 'mobile'
        }
      });
      
      const lighthouse = response.data.lighthouseResult;
      return {
        score: Math.round(lighthouse.categories.performance.score * 100),
        metrics: {
          fcp: lighthouse.audits['first-contentful-paint'].displayValue,
          lcp: lighthouse.audits['largest-contentful-paint'].displayValue,
          cls: lighthouse.audits['cumulative-layout-shift'].displayValue,
          fid: lighthouse.audits['max-potential-fid']?.displayValue
        },
        opportunities: lighthouse.audits.opportunities || []
      };
    } catch (error) {
      console.error('PageSpeed API error:', error);
      return { score: 75, metrics: {}, opportunities: [] };
    }
  }
  
  async checkMobileFriendliness(domain) {
    try {
      // This would use Google's Mobile-Friendly Test API
      // For now, we'll simulate the check
      return {
        isMobileFriendly: true,
        issues: []
      };
    } catch (error) {
      return { isMobileFriendly: true, issues: [] };
    }
  }
  
  async checkSSL(domain) {
    try {
      const response = await axios.get(`https://${domain}`, {
        timeout: 5000,
        validateStatus: false
      });
      return {
        isSecure: response.request.protocol === 'https:',
        certificate: {
          valid: true,
          issuer: 'Unknown',
          expires: null
        }
      };
    } catch (error) {
      return {
        isSecure: false,
        certificate: null
      };
    }
  }
  
  async checkRobotsTxt(domain) {
    try {
      const response = await axios.get(`https://${domain}/robots.txt`, {
        timeout: 5000,
        validateStatus: false
      });
      
      if (response.status === 404) {
        return {
          hasIssues: true,
          issues: ['No robots.txt file found']
        };
      }
      
      const content = response.data.toLowerCase();
      const issues = [];
      
      if (content.includes('disallow: /')) {
        issues.push('Entire site is disallowed');
      }
      
      if (!content.includes('sitemap:')) {
        issues.push('No sitemap reference found');
      }
      
      return {
        hasIssues: issues.length > 0,
        issues
      };
    } catch (error) {
      return {
        hasIssues: true,
        issues: ['Could not access robots.txt']
      };
    }
  }
  
  async checkStructuredData(domain) {
    try {
      // This would check for JSON-LD, microdata, etc.
      // For now, we'll simulate the check
      return {
        hasStructuredData: false,
        types: [],
        errors: []
      };
    } catch (error) {
      return {
        hasStructuredData: false,
        types: [],
        errors: []
      };
    }
  }
  
  calculateSEOScore(data) {
    const weights = {
      organicTraffic: 0.25,
      keywordRankings: 0.20,
      backlinks: 0.20,
      technicalSEO: 0.20,
      userExperience: 0.15
    };
    
    const scores = {
      organicTraffic: this.scoreOrganicTraffic(data.gscData?.totalImpressions || 0),
      keywordRankings: this.scoreKeywordRankings(data.gscData?.avgPosition || 50),
      backlinks: this.scoreBacklinks(data.ahrefsData?.backlinksCount || 0),
      technicalSEO: this.scoreTechnicalSEO(data.technicalSEO?.issues || []),
      userExperience: this.scoreUserExperience(data.gscData?.avgCTR || 0)
    };
    
    const weightedScore = Object.keys(weights).reduce((total, key) => {
      return total + (scores[key] * weights[key]);
    }, 0);
    
    return Math.round(weightedScore);
  }
  
  scoreOrganicTraffic(impressions) {
    if (impressions > 100000) return 100;
    if (impressions > 50000) return 90;
    if (impressions > 10000) return 75;
    if (impressions > 1000) return 60;
    if (impressions > 100) return 40;
    return 20;
  }
  
  scoreKeywordRankings(avgPosition) {
    if (avgPosition <= 3) return 100;
    if (avgPosition <= 10) return 80;
    if (avgPosition <= 20) return 60;
    if (avgPosition <= 50) return 40;
    return 20;
  }
  
  scoreBacklinks(count) {
    if (count > 10000) return 100;
    if (count > 1000) return 80;
    if (count > 100) return 60;
    if (count > 10) return 40;
    return 20;
  }
  
  scoreTechnicalSEO(issues) {
    const criticalIssues = issues.filter(issue => issue.severity === 'critical').length;
    const highIssues = issues.filter(issue => issue.severity === 'high').length;
    const mediumIssues = issues.filter(issue => issue.severity === 'medium').length;
    
    const deductions = (criticalIssues * 30) + (highIssues * 15) + (mediumIssues * 5);
    return Math.max(0, 100 - deductions);
  }
  
  scoreUserExperience(avgCTR) {
    const ctrPercent = avgCTR * 100;
    if (ctrPercent > 5) return 100;
    if (ctrPercent > 3) return 80;
    if (ctrPercent > 2) return 60;
    if (ctrPercent > 1) return 40;
    return 20;
  }
  
  generateSEORecommendations(score, data) {
    const recommendations = [];
    
    if (score < 50) {
      recommendations.push({
        priority: 'critical',
        category: 'overall',
        title: 'Comprehensive SEO Overhaul Needed',
        description: 'Your SEO score indicates significant issues that need immediate attention',
        actions: [
          'Conduct full technical SEO audit',
          'Optimize on-page elements',
          'Build high-quality backlinks',
          'Improve content quality and relevance'
        ],
        estimatedImpact: '30-50% traffic increase',
        timeToImplement: '3-6 months'
      });
    }
    
    if (data.technicalSEO?.issues?.length > 0) {
      const criticalIssues = data.technicalSEO.issues.filter(issue => issue.severity === 'critical');
      if (criticalIssues.length > 0) {
        recommendations.push({
          priority: 'critical',
          category: 'technical',
          title: 'Fix Critical Technical Issues',
          description: `${criticalIssues.length} critical technical issues found`,
          actions: criticalIssues.map(issue => issue.recommendation),
          estimatedImpact: '15-25% ranking improvement',
          timeToImplement: '1-2 weeks'
        });
      }
    }
    
    if (data.gscData?.avgPosition > 10) {
      recommendations.push({
        priority: 'high',
        category: 'content',
        title: 'Improve Keyword Rankings',
        description: 'Average position is beyond the first page of search results',
        actions: [
          'Optimize title tags and meta descriptions',
          'Improve content quality and depth',
          'Add internal linking structure',
          'Target long-tail keyword variations'
        ],
        estimatedImpact: '20-30% increase in organic clicks',
        timeToImplement: '2-4 weeks'
      });
    }
    
    if (data.ahrefsData?.backlinksCount < 100) {
      recommendations.push({
        priority: 'medium',
        category: 'authority',
        title: 'Build Domain Authority',
        description: 'Low backlink count indicates need for link building',
        actions: [
          'Create high-quality, linkable content',
          'Reach out to industry publications',
          'Guest posting on relevant sites',
          'Build relationships with influencers'
        ],
        estimatedImpact: '10-20% improvement in rankings',
        timeToImplement: '2-3 months'
      });
    }
    
    return recommendations;
  }
  
  async performKeywordResearch(seedKeyword, country = 'US', limit = 100) {
    try {
      // This would integrate with keyword research APIs
      // For now, we'll generate relevant keyword suggestions
      const baseKeywords = await this.generateKeywordVariations(seedKeyword);
      const keywordData = await this.enrichKeywordData(baseKeywords, country);
      
      return keywordData
        .sort((a, b) => b.searchVolume - a.searchVolume)
        .slice(0, limit)
        .map(keyword => ({
          ...keyword,
          opportunity: this.calculateKeywordOpportunity(keyword),
          difficulty: this.calculateKeywordDifficulty(keyword)
        }));
        
    } catch (error) {
      console.error('Keyword research error:', error);
      return this.getDefaultKeywordData(seedKeyword);
    }
  }
  
  calculateKeywordOpportunity(keyword) {
    const volume = keyword.searchVolume || keyword.impressions || 0;
    const competition = keyword.competition || 0.5;
    const position = keyword.position || 50;
    
    // Higher opportunity score for high volume, low competition, poor current position
    const volumeScore = Math.min(volume / 1000, 100);
    const competitionScore = (1 - competition) * 100;
    const positionScore = position > 10 ? 100 : Math.max(0, 100 - (position * 5));
    
    return Math.round((volumeScore + competitionScore + positionScore) / 3);
  }
  
  // Demo/Default data methods
  getDemoSEOAnalysis() {
    return {
      success: true,
      data: {
        domain: 'demo-store.myshopify.com',
        seoScore: 94,
        organicTraffic: 12847,
        organicKeywords: 2341,
        backlinksCount: 1856,
        domainAuthority: 67
      },
      recommendations: [
        {
          priority: 'medium',
          category: 'content',
          title: 'Optimize Product Descriptions',
          description: 'Enhance product pages with rich, keyword-optimized content',
          estimatedImpact: '15-20% traffic increase'
        }
      ],
      insights: {
        topPerformingPages: [
          { url: '/products/summer-dress', traffic: 1247, keywords: 23 },
          { url: '/collections/new-arrivals', traffic: 982, keywords: 18 }
        ],
        improvementPotential: 'High',
        competitorGap: 'Medium'
      }
    };
  }
  
  getDefaultSEOData() {
    return {
      totalImpressions: 12847,
      totalClicks: 541,
      avgCTR: 4.2,
      avgPosition: 8.5,
      topKeywords: [
        { keyword: 'summer dress', impressions: 1247, clicks: 52, ctr: 4.2, position: 6.8 },
        { keyword: 'fashion store', impressions: 982, clicks: 43, ctr: 4.4, position: 7.2 }
      ]
    };
  }
  
  getDefaultSemrushData() {
    return {
      keywordsCount: 2341,
      organicTraffic: 12847,
      organicCost: 45623,
      competitors: [
        { domain: 'competitor1.com', commonKeywords: 234, traffic: 23456 },
        { domain: 'competitor2.com', commonKeywords: 189, traffic: 18943 }
      ]
    };
  }
  
  getDefaultAhrefsData() {
    return {
      domainRating: 67,
      backlinksCount: 1856,
      referringDomains: 342,
      organicKeywords: 2341,
      organicTraffic: 12847
    };
  }
  
  getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }
}

module.exports = new SEOService();
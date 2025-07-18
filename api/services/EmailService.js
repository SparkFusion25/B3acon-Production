const sgMail = require('@sendgrid/mail');
const { EmailCampaign, EmailAnalytics, Store } = require('../models');

class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    this.templates = {
      welcome: process.env.SENDGRID_WELCOME_TEMPLATE || 'd-welcome123',
      orderConfirmation: process.env.SENDGRID_ORDER_TEMPLATE || 'd-order123',
      trackingUpdate: process.env.SENDGRID_TRACKING_TEMPLATE || 'd-tracking123',
      abandonedCart: process.env.SENDGRID_ABANDONED_CART_TEMPLATE || 'd-cart123',
      affiliateWelcome: process.env.SENDGRID_AFFILIATE_WELCOME_TEMPLATE || 'd-affiliate123',
      commissionNotification: process.env.SENDGRID_COMMISSION_TEMPLATE || 'd-commission123',
      crossSell: process.env.SENDGRID_CROSS_SELL_TEMPLATE || 'd-crosssell123',
      prospecting: process.env.SENDGRID_PROSPECTING_TEMPLATE || 'd-prospect123',
      passwordReset: process.env.SENDGRID_PASSWORD_RESET_TEMPLATE || 'd-reset123',
      payoutNotification: process.env.SENDGRID_PAYOUT_TEMPLATE || 'd-payout123'
    };
    
    this.defaultFromEmail = process.env.FROM_EMAIL || 'noreply@b3acon.com';
    this.defaultFromName = process.env.FROM_NAME || 'B3ACON';
  }
  
  async sendTransactionalEmail(templateId, to, dynamicData, options = {}) {
    try {
      const msg = {
        to: Array.isArray(to) ? to : [to],
        from: {
          email: options.fromEmail || this.defaultFromEmail,
          name: options.fromName || this.defaultFromName
        },
        templateId,
        dynamicTemplateData: {
          ...dynamicData,
          currentYear: new Date().getFullYear(),
          brandColor: '#667eea',
          websiteUrl: process.env.FRONTEND_URL
        },
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true },
          subscriptionTracking: { enable: false }
        },
        customArgs: {
          template: templateId,
          type: 'transactional',
          timestamp: new Date().toISOString()
        }
      };
      
      const response = await sgMail.send(msg);
      
      // Log email for analytics
      await this.logEmailSent({
        templateId,
        recipients: msg.to,
        dynamicData,
        messageId: response[0].headers['x-message-id'],
        timestamp: new Date()
      });
      
      return { 
        success: true, 
        messageId: response[0].headers['x-message-id'],
        recipients: msg.to.length
      };
      
    } catch (error) {
      console.error('Email send error:', error);
      
      if (error.response) {
        console.error('SendGrid error response:', error.response.body);
      }
      
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
  
  async sendWelcomeEmail(userData) {
    const emailData = {
      firstName: userData.firstName,
      email: userData.email,
      trialEndsAt: this.formatDate(userData.trialEndsAt),
      subscriptionPlan: userData.subscriptionPlan,
      verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${userData.verificationToken}`,
      dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
      supportUrl: `${process.env.FRONTEND_URL}/support`,
      trialDays: this.calculateDaysUntil(userData.trialEndsAt)
    };
    
    return await this.sendTransactionalEmail(
      this.templates.welcome,
      userData.email,
      emailData
    );
  }
  
  async sendPasswordResetEmail(resetData) {
    const emailData = {
      firstName: resetData.firstName,
      email: resetData.email,
      resetUrl: resetData.resetUrl,
      expiresIn: '1 hour',
      supportUrl: `${process.env.FRONTEND_URL}/support`
    };
    
    return await this.sendTransactionalEmail(
      this.templates.passwordReset,
      resetData.email,
      emailData
    );
  }
  
  async sendTrackingNotification(trackingOrder) {
    const storeInfo = await this.getStoreInfo(trackingOrder.storeId);
    
    const emailData = {
      customerName: trackingOrder.customerName,
      orderNumber: trackingOrder.shopifyOrderId,
      trackingNumber: trackingOrder.trackingNumber,
      orderTotal: trackingOrder.orderTotal?.toFixed(2),
      trackingUrl: `https://track.b3acon.com/${trackingOrder._id}`,
      estimatedDelivery: this.formatDate(trackingOrder.estimatedDelivery),
      currentStatus: this.getStatusMessage(trackingOrder.currentStatus),
      carrier: trackingOrder.carrier,
      storeInfo: {
        name: storeInfo.storeName,
        logo: storeInfo.settings?.logo,
        supportEmail: storeInfo.settings?.supportEmail || 'support@' + storeInfo.storeDomain,
        website: `https://${storeInfo.storeDomain}`
      }
    };
    
    return await this.sendTransactionalEmail(
      this.templates.trackingUpdate,
      trackingOrder.customerEmail,
      emailData,
      {
        fromEmail: storeInfo.settings?.fromEmail || this.defaultFromEmail,
        fromName: storeInfo.storeName
      }
    );
  }
  
  async sendTrackingUpdate(trackingOrder, updateEvent) {
    const storeInfo = await this.getStoreInfo(trackingOrder.storeId);
    
    const emailData = {
      customerName: trackingOrder.customerName,
      orderNumber: trackingOrder.shopifyOrderId,
      trackingNumber: trackingOrder.trackingNumber,
      updateMessage: updateEvent.message,
      currentStatus: updateEvent.status,
      location: updateEvent.location,
      timestamp: this.formatDateTime(updateEvent.timestamp),
      trackingUrl: `https://track.b3acon.com/${trackingOrder._id}`,
      isDelivered: updateEvent.status === 'delivered',
      storeInfo: {
        name: storeInfo.storeName,
        logo: storeInfo.settings?.logo,
        website: `https://${storeInfo.storeDomain}`
      }
    };
    
    return await this.sendTransactionalEmail(
      this.templates.trackingUpdate,
      trackingOrder.customerEmail,
      emailData,
      {
        fromEmail: storeInfo.settings?.fromEmail || this.defaultFromEmail,
        fromName: storeInfo.storeName
      }
    );
  }
  
  async sendAffiliateWelcomeEmail(affiliateData) {
    const storeInfo = await this.getStoreInfo(affiliateData.storeInfo?.storeId);
    
    const emailData = {
      firstName: affiliateData.firstName,
      commissionRate: affiliateData.commissionRate,
      dashboardUrl: affiliateData.dashboardUrl,
      storeInfo: {
        name: storeInfo?.storeName || 'Our Store',
        industry: storeInfo?.industry || 'retail',
        website: storeInfo ? `https://${storeInfo.storeDomain}` : '#'
      },
      benefits: [
        `${affiliateData.commissionRate}% commission on all sales`,
        'Real-time tracking and analytics',
        'Monthly payouts via PayPal or bank transfer',
        'Marketing materials and support',
        'Dedicated affiliate manager'
      ],
      nextSteps: [
        'Complete your affiliate profile',
        'Generate your first tracking link',
        'Share with your audience',
        'Track your performance in real-time'
      ]
    };
    
    return await this.sendTransactionalEmail(
      this.templates.affiliateWelcome,
      affiliateData.email,
      emailData
    );
  }
  
  async sendAffiliateCommissionNotification(affiliate, commission) {
    const emailData = {
      affiliateName: affiliate.firstName || affiliate.name,
      commissionAmount: commission.amount.toFixed(2),
      commissionRate: commission.rate,
      orderNumber: commission.orderNumber,
      orderValue: commission.orderValue.toFixed(2),
      payoutDate: this.formatDate(commission.payoutDate),
      dashboardUrl: `${process.env.FRONTEND_URL}/affiliate-portal`,
      totalEarnings: affiliate.totalEarnings?.toFixed(2) || '0.00',
      thisMonthEarnings: this.calculateThisMonthEarnings(affiliate),
      performanceUrl: `${process.env.FRONTEND_URL}/affiliate-portal?tab=analytics`
    };
    
    return await this.sendTransactionalEmail(
      this.templates.commissionNotification,
      affiliate.email,
      emailData
    );
  }
  
  async sendCrossSellEmail(data) {
    const { customer, trackingOrder, recommendations, trackingUrl } = data;
    const storeInfo = await this.getStoreInfo(trackingOrder.storeId);
    
    const emailData = {
      customerName: customer.firstName || customer.name,
      orderNumber: trackingOrder.shopifyOrderId,
      trackingUrl,
      recommendations: recommendations.slice(0, 3).map(rec => ({
        title: rec.title,
        price: rec.price.toFixed(2),
        image: rec.image,
        productUrl: rec.url,
        description: rec.description,
        discount: rec.discount || '10% off'
      })),
      storeInfo: {
        name: storeInfo.storeName,
        logo: storeInfo.settings?.logo,
        website: `https://${storeInfo.storeDomain}`
      },
      urgency: {
        message: 'Limited time offer - expires in 24 hours',
        discount: '10% off with code COMPLETE10'
      }
    };
    
    return await this.sendTransactionalEmail(
      this.templates.crossSell,
      customer.email,
      emailData,
      {
        fromEmail: storeInfo.settings?.fromEmail || this.defaultFromEmail,
        fromName: storeInfo.storeName
      }
    );
  }
  
  async sendAbandonedCartEmail(cartData) {
    const storeInfo = await this.getStoreInfo(cartData.storeId);
    
    const emailData = {
      customerName: cartData.customerName,
      cartItems: cartData.items.slice(0, 3).map(item => ({
        title: item.title,
        price: item.price.toFixed(2),
        image: item.image,
        quantity: item.quantity,
        productUrl: item.url
      })),
      cartTotal: cartData.total.toFixed(2),
      checkoutUrl: cartData.checkoutUrl,
      discountOffer: cartData.discountOffer || {
        code: 'COMEBACK10',
        amount: '10%',
        expires: '24 hours'
      },
      storeInfo: {
        name: storeInfo.storeName,
        logo: storeInfo.settings?.logo,
        website: `https://${storeInfo.storeDomain}`
      },
      urgency: {
        message: 'Your items are selling fast!',
        timeLimit: '24 hours'
      }
    };
    
    return await this.sendTransactionalEmail(
      this.templates.abandonedCart,
      cartData.customerEmail,
      emailData,
      {
        fromEmail: storeInfo.settings?.fromEmail || this.defaultFromEmail,
        fromName: storeInfo.storeName
      }
    );
  }
  
  async sendRecruitmentEmail(data) {
    const { to, subject, message, affiliate, store } = data;
    
    const msg = {
      to,
      from: {
        email: 'partnerships@b3acon.com',
        name: 'B3ACON Partnerships'
      },
      subject,
      html: this.buildRecruitmentEmailHTML(message, affiliate, store),
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      },
      customArgs: {
        type: 'recruitment',
        storeId: store._id?.toString(),
        affiliateId: affiliate.id
      }
    };
    
    const response = await sgMail.send(msg);
    
    await this.logEmailSent({
      templateId: 'recruitment',
      recipients: [to],
      messageId: response[0].headers['x-message-id'],
      timestamp: new Date(),
      type: 'recruitment'
    });
    
    return {
      success: true,
      messageId: response[0].headers['x-message-id']
    };
  }
  
  async sendPayoutNotification(affiliate, payoutData) {
    const emailData = {
      affiliateName: affiliate.firstName || affiliate.name,
      amount: payoutData.amount.toFixed(2),
      paymentMethod: payoutData.method,
      transactionId: payoutData.transactionId,
      estimatedArrival: this.formatDate(payoutData.estimatedArrival),
      dashboardUrl: `${process.env.FRONTEND_URL}/affiliate-portal?tab=payouts`,
      supportUrl: `${process.env.FRONTEND_URL}/support`
    };
    
    return await this.sendTransactionalEmail(
      this.templates.payoutNotification,
      affiliate.email,
      emailData
    );
  }
  
  async createEmailCampaign(campaignData) {
    try {
      const campaign = await EmailCampaign.create({
        storeId: campaignData.storeId,
        campaignName: campaignData.name,
        campaignType: campaignData.type,
        subjectLine: campaignData.subject,
        content: campaignData.content,
        recipientsCount: campaignData.recipients?.length || 0,
        status: 'draft',
        senderEmail: campaignData.senderEmail || this.defaultFromEmail,
        senderName: campaignData.senderName || this.defaultFromName
      });
      
      return {
        success: true,
        campaign: {
          id: campaign._id,
          name: campaign.campaignName,
          status: campaign.status,
          createdAt: campaign.createdAt
        }
      };
      
    } catch (error) {
      console.error('Email campaign creation error:', error);
      throw error;
    }
  }
  
  async executeEmailCampaign(campaignId, recipients) {
    try {
      const campaign = await EmailCampaign.findById(campaignId);
      if (!campaign) throw new Error('Campaign not found');
      
      // Update status to sending
      await EmailCampaign.updateOne(
        { _id: campaignId },
        { status: 'sending', sentAt: new Date() }
      );
      
      // Send emails in batches to avoid rate limits
      const batchSize = 100;
      let sentCount = 0;
      const errors = [];
      
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        
        try {
          await this.sendEmailBatch(campaign, batch);
          sentCount += batch.length;
          
          // Update progress
          await EmailCampaign.updateOne(
            { _id: campaignId },
            { sentCount }
          );
          
          // Delay between batches
          await this.delay(1000);
          
        } catch (error) {
          console.error(`Error sending batch ${i}:`, error);
          errors.push(`Batch ${i}: ${error.message}`);
        }
      }
      
      // Update final status
      await EmailCampaign.updateOne(
        { _id: campaignId },
        { 
          status: sentCount > 0 ? 'sent' : 'failed',
          sentCount,
          sentAt: new Date()
        }
      );
      
      return { 
        success: true, 
        sentCount,
        errors: errors.length > 0 ? errors : undefined
      };
      
    } catch (error) {
      console.error('Email campaign execution error:', error);
      throw error;
    }
  }
  
  async sendEmailBatch(campaign, recipients) {
    const messages = recipients.map(recipient => ({
      to: recipient.email,
      from: {
        email: campaign.senderEmail,
        name: campaign.senderName
      },
      subject: this.personalizeSubject(campaign.subjectLine, recipient),
      html: this.personalizeContent(campaign.content, recipient),
      customArgs: {
        campaignId: campaign._id.toString(),
        recipientId: recipient.id,
        type: 'campaign'
      }
    }));
    
    return await sgMail.send(messages);
  }
  
  async handleWebhook(eventData) {
    try {
      const { eventType, email, timestamp, sg_message_id } = eventData;
      
      // Find email analytics record
      const analytics = await EmailAnalytics.findOne({ messageId: sg_message_id });
      
      if (analytics) {
        switch (eventType) {
          case 'open':
            await EmailAnalytics.updateOne(
              { messageId: sg_message_id },
              { $inc: { opens: 1 } }
            );
            break;
          case 'click':
            await EmailAnalytics.updateOne(
              { messageId: sg_message_id },
              { $inc: { clicks: 1 } }
            );
            break;
          case 'bounce':
            await EmailAnalytics.updateOne(
              { messageId: sg_message_id },
              { $inc: { bounces: 1 } }
            );
            break;
          case 'spamreport':
            await EmailAnalytics.updateOne(
              { messageId: sg_message_id },
              { $inc: { complaints: 1 } }
            );
            break;
        }
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }
  
  // Helper methods
  async logEmailSent(emailData) {
    try {
      await EmailAnalytics.create({
        templateId: emailData.templateId,
        recipients: emailData.recipients,
        messageId: emailData.messageId,
        timestamp: emailData.timestamp,
        type: emailData.type || 'transactional'
      });
    } catch (error) {
      console.error('Email logging error:', error);
      // Don't throw - logging failure shouldn't fail email sending
    }
  }
  
  async getStoreInfo(storeId) {
    if (!storeId) return null;
    
    try {
      const store = await Store.findById(storeId).select(
        'storeName storeDomain industry settings'
      );
      return store;
    } catch (error) {
      console.error('Get store info error:', error);
      return null;
    }
  }
  
  formatDate(date) {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  formatDateTime(date) {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }
  
  calculateDaysUntil(date) {
    if (!date) return 0;
    const now = new Date();
    const target = new Date(date);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
  
  calculateThisMonthEarnings(affiliate) {
    // This would calculate actual monthly earnings
    // For now, return a placeholder
    return (affiliate.totalEarnings * 0.3).toFixed(2);
  }
  
  getStatusMessage(status) {
    const messages = {
      'shipped': 'Your order has been shipped',
      'in_transit': 'Your package is on its way',
      'out_for_delivery': 'Your package is out for delivery',
      'delivered': 'Your package has been delivered',
      'exception': 'There was an issue with delivery'
    };
    return messages[status] || 'Order status updated';
  }
  
  buildRecruitmentEmailHTML(message, affiliate, store) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Partnership Opportunity</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea;">B3ACON Partnership Opportunity</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p>${message}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3>Why Partner with ${store.storeName}?</h3>
            <ul>
              <li>Competitive commission rates</li>
              <li>High-quality products your audience will love</li>
              <li>Real-time tracking and analytics</li>
              <li>Dedicated affiliate support</li>
              <li>Monthly payouts</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/affiliate-signup?ref=${affiliate.id}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Join Our Affiliate Program
            </a>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>If you're not interested, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  personalizeSubject(subject, recipient) {
    return subject
      .replace(/\{firstName\}/g, recipient.firstName || 'there')
      .replace(/\{lastName\}/g, recipient.lastName || '');
  }
  
  personalizeContent(content, recipient) {
    return content
      .replace(/\{firstName\}/g, recipient.firstName || 'there')
      .replace(/\{lastName\}/g, recipient.lastName || '')
      .replace(/\{email\}/g, recipient.email || '');
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new EmailService();
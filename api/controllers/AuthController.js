const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Store } = require('../models');
const EmailService = require('../services/EmailService');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, shopifyDomain, plan = 'starter' } = req.body;
      
      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Validate password strength
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      
      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);
      
      // Create user
      const user = await User.create({
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        shopifyStoreDomain: shopifyDomain,
        subscriptionPlan: plan,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        emailVerified: false
      });
      
      // Create associated store if Shopify domain provided
      let store = null;
      if (shopifyDomain) {
        try {
          const shopifyStoreId = await this.getShopifyStoreId(shopifyDomain);
          store = await Store.create({
            userId: user._id,
            storeName: `${firstName}'s Store`,
            storeDomain: shopifyDomain,
            shopifyStoreId,
            industry: 'retail', // Default industry
            settings: {
              primaryColor: '#667eea',
              secondaryColor: '#764ba2',
              logo: null,
              emailNotifications: true,
              smsNotifications: false
            }
          });
        } catch (error) {
          console.error('Store creation error:', error);
          // Continue without store - user can add it later
        }
      }
      
      // Generate JWT
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      await User.updateOne(
        { _id: user._id },
        { emailVerificationToken }
      );
      
      // Send welcome email
      try {
        await EmailService.sendWelcomeEmail({
          email: user.email,
          firstName: user.firstName,
          verificationToken: emailVerificationToken,
          trialEndsAt: user.trialEndsAt,
          subscriptionPlan: user.subscriptionPlan
        });
      } catch (emailError) {
        console.error('Welcome email error:', emailError);
        // Don't fail registration if email fails
      }
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: this.sanitizeUser(user),
        store: store ? this.sanitizeStore(store) : null,
        token,
        expiresIn: '7d',
        trialEndsAt: user.trialEndsAt
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: 'Registration failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  async login(req, res) {
    try {
      const { email, password, isDemoAccount } = req.body;
      
      // Handle demo login
      if (isDemoAccount || email === 'demo@b3acon.com') {
        return this.handleDemoLogin(req, res);
      }
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Find user
      const user = await User.findOne({ 
        email: email.toLowerCase() 
      }).populate({
        path: 'stores',
        select: 'storeName storeDomain industry monthlyRevenue settings'
      });
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      // Check if account is suspended
      if (user.subscriptionStatus === 'cancelled') {
        return res.status(403).json({ 
          error: 'Account suspended. Please contact support.',
          code: 'ACCOUNT_SUSPENDED'
        });
      }
      
      // Update last login
      await User.updateOne(
        { _id: user._id }, 
        { 
          lastLogin: new Date(),
          updatedAt: new Date()
        }
      );
      
      // Get user's stores
      const stores = await Store.find({ userId: user._id }).select(
        'storeName storeDomain industry monthlyRevenue settings shopifyStoreId'
      );
      
      // Generate JWT
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Check trial status
      const isTrialExpired = user.trialEndsAt && new Date() > user.trialEndsAt;
      
      res.json({
        success: true,
        message: 'Login successful',
        user: this.sanitizeUser(user),
        stores: stores.map(store => this.sanitizeStore(store)),
        token,
        expiresIn: '7d',
        trialStatus: {
          isActive: !isTrialExpired && user.subscriptionPlan === 'starter',
          endsAt: user.trialEndsAt,
          daysRemaining: this.calculateTrialDaysRemaining(user.trialEndsAt)
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Login failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  async handleDemoLogin(req, res) {
    try {
      // Create demo user object
      const demoUser = {
        _id: 'demo-user-id',
        email: 'demo@b3acon.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'store_owner',
        subscriptionPlan: 'professional',
        isDemo: true,
        emailVerified: true
      };
      
      // Create demo store data
      const demoStore = await this.getDemoStoreData();
      
      // Generate demo token (shorter expiry)
      const token = jwt.sign(
        { 
          userId: demoUser._id, 
          email: demoUser.email, 
          role: demoUser.role,
          isDemo: true 
        },
        process.env.JWT_SECRET,
        { expiresIn: '4h' } // Demo sessions expire in 4 hours
      );
      
      res.json({
        success: true,
        message: 'Demo login successful',
        user: demoUser,
        stores: [demoStore],
        token,
        expiresIn: '4h',
        isDemo: true,
        demoMessage: 'You are in demo mode. All data is simulated and will not be saved.'
      });
      
    } catch (error) {
      console.error('Demo login error:', error);
      res.status(500).json({ error: 'Demo login failed' });
    }
  }
  
  async verify(req, res) {
    try {
      const userId = req.user.userId;
      
      // Handle demo accounts
      if (req.user.isDemo) {
        return res.json({
          success: true,
          user: {
            _id: 'demo-user-id',
            email: 'demo@b3acon.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'store_owner',
            isDemo: true
          },
          stores: [await this.getDemoStoreData()],
          isDemo: true
        });
      }
      
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const stores = await Store.find({ userId }).select(
        'storeName storeDomain industry monthlyRevenue settings'
      );
      
      res.json({
        success: true,
        user: this.sanitizeUser(user),
        stores: stores.map(store => this.sanitizeStore(store)),
        trialStatus: {
          isActive: user.trialEndsAt && new Date() < user.trialEndsAt,
          endsAt: user.trialEndsAt,
          daysRemaining: this.calculateTrialDaysRemaining(user.trialEndsAt)
        }
      });
      
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({ error: 'Token verification failed' });
    }
  }
  
  async logout(req, res) {
    try {
      // In a more complex system, you might blacklist the token
      // For now, we'll just send a success response
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  }
  
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal whether user exists for security
        return res.json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }
      
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
      
      await User.updateOne(
        { _id: user._id },
        {
          passwordResetToken: resetToken,
          passwordResetExpiry: resetTokenExpiry
        }
      );
      
      // Send reset email
      try {
        await EmailService.sendPasswordResetEmail({
          email: user.email,
          firstName: user.firstName,
          resetToken,
          resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        });
      } catch (emailError) {
        console.error('Password reset email error:', emailError);
      }
      
      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
      
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Password reset request failed' });
    }
  }
  
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpiry: { $gt: new Date() }
      });
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
      
      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 12);
      
      // Update user
      await User.updateOne(
        { _id: user._id },
        {
          passwordHash,
          passwordResetToken: null,
          passwordResetExpiry: null,
          updatedAt: new Date()
        }
      );
      
      res.json({
        success: true,
        message: 'Password reset successful'
      });
      
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Password reset failed' });
    }
  }
  
  async getDemoStoreData() {
    return {
      _id: 'demo-store-id',
      storeName: 'Demo Fashion Store',
      storeDomain: 'demo-store.myshopify.com',
      industry: 'fashion',
      monthlyRevenue: 47293,
      isDemo: true,
      settings: {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        logo: '/demo-logo.png'
      },
      demoMetrics: {
        totalRevenue: 47293,
        seoScore: 94,
        conversionRate: 4.2,
        totalVisitors: 12847,
        affiliateRevenue: 8540,
        activeAffiliates: 23,
        trackingOrders: 156,
        emailCampaigns: 8,
        recentActivity: [
          { 
            id: 1, 
            type: 'order', 
            description: 'New order from John D.', 
            amount: 156.99, 
            time: '2 minutes ago',
            icon: '🛒'
          },
          { 
            id: 2, 
            type: 'traffic', 
            description: 'Traffic spike from Google', 
            amount: null, 
            time: '15 minutes ago',
            icon: '📈'
          },
          { 
            id: 3, 
            type: 'affiliate', 
            description: 'New affiliate signup: Sarah M.', 
            amount: null, 
            time: '1 hour ago',
            icon: '🤝'
          },
          { 
            id: 4, 
            type: 'seo', 
            description: 'SEO score improved to 94', 
            amount: null, 
            time: '2 hours ago',
            icon: '🔍'
          }
        ]
      }
    };
  }
  
  async getShopifyStoreId(domain) {
    try {
      // This would make an actual API call to Shopify to get store ID
      // For now, we'll generate a mock ID based on domain
      const hash = crypto.createHash('md5').update(domain).digest('hex');
      return hash.substring(0, 10);
    } catch (error) {
      console.error('Get Shopify store ID error:', error);
      return null;
    }
  }
  
  calculateTrialDaysRemaining(trialEndsAt) {
    if (!trialEndsAt) return 0;
    const now = new Date();
    const trialEnd = new Date(trialEndsAt);
    const diffTime = trialEnd - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
  
  sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    const { passwordHash, passwordResetToken, passwordResetExpiry, emailVerificationToken, ...sanitized } = userObj;
    return sanitized;
  }
  
  sanitizeStore(store) {
    const storeObj = store.toObject ? store.toObject() : store;
    const { shopifyAccessToken, ...sanitized } = storeObj;
    return sanitized;
  }
}

module.exports = new AuthController();
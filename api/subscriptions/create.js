// Subscription Creation Endpoint
// Create trial and paid subscriptions

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      userId, 
      shopUrl, 
      plan = 'trial', 
      shopifyAccessToken,
      email,
      storeName 
    } = req.body;

    // Validate required fields
    if (!shopUrl || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: shopUrl and email are required' 
      });
    }

    // Generate user ID if not provided
    const userIdFinal = userId || generateUserId();

    // Create subscription record
    const subscription = await createSubscription({
      userId: userIdFinal,
      shopUrl,
      plan,
      email,
      storeName,
      status: 'active',
      trialEndsAt: plan === 'trial' ? getTrialEndDate() : null,
      createdAt: new Date().toISOString(),
      shopifyAccessToken: shopifyAccessToken || null
    });

    // Set up trial features
    if (plan === 'trial') {
      await initializeTrialFeatures(userIdFinal, shopUrl);
    }

    // Track subscription creation
    await trackEvent('subscription_created', {
      user_id: userIdFinal,
      shop_url: shopUrl,
      plan: plan,
      trial_end: subscription.trialEndsAt,
      timestamp: new Date().toISOString()
    });

    // Send welcome email (in production)
    await sendWelcomeEmail(email, {
      plan,
      shopUrl,
      trialEndsAt: subscription.trialEndsAt
    });

    return res.status(201).json({
      success: true,
      subscription,
      redirectUrl: `/shopify/dashboard?welcome=true&plan=${plan}`
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    return res.status(500).json({ 
      error: 'Subscription creation failed',
      message: error.message 
    });
  }
}

// Generate unique user ID
function generateUserId() {
  return 'user_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Calculate trial end date (14 days from now)
function getTrialEndDate() {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);
  return trialEnd.toISOString();
}

// Create subscription in database
async function createSubscription(subscriptionData) {
  // In production, this would save to database
  // For now, return the subscription data with ID
  const subscription = {
    id: 'sub_' + Math.random().toString(36).substring(2),
    ...subscriptionData
  };
  
  // Store in localStorage for demo purposes
  if (typeof window !== 'undefined') {
    const existingSubscriptions = JSON.parse(localStorage.getItem('demo_subscriptions') || '[]');
    existingSubscriptions.push(subscription);
    localStorage.setItem('demo_subscriptions', JSON.stringify(existingSubscriptions));
  }
  
  return subscription;
}

// Initialize trial features
async function initializeTrialFeatures(userId, shopUrl) {
  // Set up trial feature flags
  const trialFeatures = {
    seo_audit: true,
    popup_builder: true,
    basic_analytics: true,
    email_capture: true,
    limits: {
      seo_pages: 50,
      popups: 3,
      analytics_retention_days: 7
    }
  };

  // In production, save to database
  console.log(`Initialized trial features for ${userId}:`, trialFeatures);
  return trialFeatures;
}

// Send welcome email
async function sendWelcomeEmail(email, data) {
  // In production, integrate with email service
  console.log(`Welcome email sent to ${email}:`, data);
}

// Track analytics events
async function trackEvent(event, data) {
  // In production, send to analytics service
  console.log(`Analytics: ${event}`, data);
}
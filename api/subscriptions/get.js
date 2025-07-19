// Get User Subscription Endpoint
// Retrieve subscription information for a user

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, shopUrl, email } = req.query;

    // Validate at least one identifier is provided
    if (!userId && !shopUrl && !email) {
      return res.status(400).json({ 
        error: 'Must provide userId, shopUrl, or email' 
      });
    }

    // Find subscription by identifier
    const subscription = await findSubscription({ userId, shopUrl, email });

    if (!subscription) {
      return res.status(404).json({ 
        error: 'Subscription not found' 
      });
    }

    // Check if trial has expired
    const subscriptionWithStatus = await checkTrialStatus(subscription);

    // Track subscription lookup
    await trackEvent('subscription_retrieved', {
      user_id: subscription.userId,
      shop_url: subscription.shopUrl,
      plan: subscription.plan,
      status: subscriptionWithStatus.status,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      subscription: subscriptionWithStatus
    });

  } catch (error) {
    console.error('Subscription retrieval error:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve subscription',
      message: error.message 
    });
  }
}

// Find subscription by various identifiers
async function findSubscription({ userId, shopUrl, email }) {
  // In production, query database
  // For demo, check localStorage
  if (typeof window !== 'undefined') {
    const subscriptions = JSON.parse(localStorage.getItem('demo_subscriptions') || '[]');
    
    return subscriptions.find(sub => 
      (userId && sub.userId === userId) ||
      (shopUrl && sub.shopUrl === shopUrl) ||
      (email && sub.email === email)
    );
  }
  
  // Return demo subscription for testing
  return {
    id: 'sub_demo123',
    userId: userId || 'user_demo123',
    shopUrl: shopUrl || 'demo-store.myshopify.com',
    plan: 'trial',
    status: 'active',
    email: email || 'demo@example.com',
    storeName: 'Demo Store',
    trialEndsAt: getTrialEndDate(),
    createdAt: new Date().toISOString()
  };
}

// Check if trial has expired and update status
async function checkTrialStatus(subscription) {
  const now = new Date();
  const trialEnd = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  
  let updatedSubscription = { ...subscription };
  
  if (subscription.plan === 'trial' && trialEnd && now > trialEnd) {
    updatedSubscription.status = 'trial_expired';
    updatedSubscription.trialExpired = true;
    
    // In production, update database
    console.log(`Trial expired for ${subscription.userId}`);
  }
  
  return updatedSubscription;
}

// Calculate trial end date (14 days from now)
function getTrialEndDate() {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);
  return trialEnd.toISOString();
}

// Track analytics events
async function trackEvent(event, data) {
  // In production, send to analytics service
  console.log(`Analytics: ${event}`, data);
}
// Shopify OAuth Installation Endpoint
// Handle Shopify store connection and app installation

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { shopUrl, plan, callback_url } = req.body;

    // Validate shop URL format
    if (!shopUrl || !shopUrl.includes('.myshopify.com')) {
      return res.status(400).json({ 
        error: 'Invalid shop URL. Must be a valid .myshopify.com domain' 
      });
    }

    // Shopify OAuth configuration
    const SHOPIFY_CONFIG = {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      scope: 'read_products,write_products,read_orders,read_customers,read_analytics',
      redirect_uri: process.env.SHOPIFY_REDIRECT_URI || `${process.env.APP_URL}/api/shopify/callback`
    };

    // Generate OAuth URL for Shopify installation
    const state = generateSecureState({ shopUrl, plan });
    
    const oauthUrl = `https://${shopUrl}/admin/oauth/authorize?` +
      `client_id=${SHOPIFY_CONFIG.client_id}&` +
      `scope=${SHOPIFY_CONFIG.scope}&` +
      `redirect_uri=${encodeURIComponent(SHOPIFY_CONFIG.redirect_uri)}&` +
      `state=${state}`;

    // Track installation attempt
    await trackEvent('shopify_install_started', {
      shop_url: shopUrl,
      plan: plan || 'trial',
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      oauth_url: oauthUrl,
      state: state,
      shop_url: shopUrl,
      plan: plan || 'trial'
    });

  } catch (error) {
    console.error('Shopify installation error:', error);
    return res.status(500).json({ 
      error: 'Installation failed',
      message: error.message 
    });
  }
}

// Generate secure state parameter for OAuth
function generateSecureState(data) {
  const stateData = {
    ...data,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(2)
  };
  
  // In production, this should be properly encrypted
  return Buffer.from(JSON.stringify(stateData)).toString('base64');
}

// Track analytics events
async function trackEvent(event, data) {
  // In production, this would send to analytics service
  console.log(`Analytics: ${event}`, data);
}
export default async function handler(req, res) {
  // Shopify App Proxy Handler
  try {
    const { method, query, body } = req;
    const { shop, timestamp, signature, logged_in_customer_id, ...params } = query;

    // Log proxy request
    console.log('🔄 Shopify Proxy Request:', {
      method,
      shop,
      customer_id: logged_in_customer_id,
      path: req.url,
      timestamp: new Date().toISOString()
    });

    // Validate shop parameter
    if (!shop || !shop.includes('.myshopify.com')) {
      return res.status(400).json({ 
        error: 'Invalid shop parameter',
        liquid_response: '<p>Invalid shop configuration. Please contact support.</p>'
      });
    }

    // Basic proxy functionality - serve embedded app content
    const proxyResponse = {
      shop: shop,
      customer_id: logged_in_customer_id || null,
      app_data: {
        seo_score: 85,
        active_campaigns: 3,
        optimization_suggestions: 12,
        last_updated: new Date().toISOString()
      },
      liquid_response: `
        <div id="b3acon-proxy-widget" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
          text-align: center;
          font-family: Arial, sans-serif;
        ">
          <h3 style="margin: 0 0 10px 0;">🚀 B3ACON SEO Dashboard</h3>
          <p style="margin: 0 0 15px 0;">Current SEO Score: <strong>85/100</strong></p>
          <p style="margin: 0 0 15px 0;">Active Campaigns: <strong>3</strong></p>
          <a href="/apps/b3acon" style="
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            margin-top: 10px;
          ">Open Full Dashboard</a>
        </div>
      `
    };

    // Handle different proxy routes
    if (req.url.includes('/widget')) {
      // Widget display for storefront
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(proxyResponse.liquid_response);
    }

    if (req.url.includes('/api/')) {
      // API responses for AJAX calls
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
        success: true,
        data: proxyResponse.app_data
      });
    }

    // Default proxy response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(proxyResponse);

  } catch (error) {
    console.error('❌ Proxy request error:', error);
    res.status(500).json({ 
      error: 'Internal server error in app proxy',
      liquid_response: '<p>B3ACON app temporarily unavailable. Please try again later.</p>'
    });
  }
}
// Shorter Shopify OAuth authentication handler
export default function handler(req, res) {
  // Handle both query params and POST body for Shopify compatibility
  const params = req.method === 'POST' ? req.body : req.query;
  const { shop, host, hmac, timestamp, code, state } = params;
  
  console.log('🔐 Shopify OAuth (Short URL):', { 
    method: req.method,
    shop, 
    host: !!host, 
    hmac: !!hmac, 
    code: !!code,
    timestamp,
    state 
  });
  
  // Set headers for embedded app
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors https://*.myshopify.com https://admin.shopify.com;");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (!shop) {
    console.log('❌ Missing shop parameter');
    return res.status(400).json({ error: 'Missing shop parameter' });
  }

  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  
  // If we have an authorization code, this is the OAuth callback
  if (code) {
    console.log('✅ OAuth authorization successful, exchanging code for token');
    
    // Redirect to plan selection after successful OAuth
    const redirectUrl = `${baseUrl}/shopify/plans?shop=${shop}&host=${host || ''}&authorized=true`;
    
    const successHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>B3ACON Authorization Complete</title>
    <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background: #f6f6f7; text-align: center;">
    <div style="background: white; border-radius: 8px; padding: 40px; max-width: 500px; margin: 100px auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="width: 60px; height: 60px; background: #00d084; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">✓</div>
        <h2>Authorization Successful!</h2>
        <p>B3ACON has been authorized for <strong>${shop}</strong></p>
        <p>Setting up your marketing dashboard...</p>
    </div>

    <script>
        console.log('🎉 OAuth Success - Redirecting to plan selection');
        
        const shop = '${shop}';
        const host = '${host || ''}';
        
        if (host && window.AppBridge) {
            try {
                const app = window.AppBridge.createApp({
                    apiKey: '${process.env.SHOPIFY_API_KEY || 'your-api-key'}',
                    host: host,
                    forceRedirect: true
                });
                console.log('✅ App Bridge initialized after OAuth');
            } catch (error) {
                console.error('❌ App Bridge Error:', error);
            }
        }
        
        setTimeout(function() {
            window.location.href = '${redirectUrl}';
        }, 2000);
    </script>
</body>
</html>`;
    
    return res.status(200).send(successHtml);
  }
  
  // If no code, redirect to installation
  const installUrl = `${baseUrl}/shopify/install?shop=${shop}&host=${host || ''}`;
  
  const installHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>B3ACON Installation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; margin: 0; padding: 20px; background: #f6f6f7; text-align: center;">
    <div style="padding: 40px;">
        <h3>Setting up B3ACON for your store...</h3>
        <p>Please wait while we initialize your marketing dashboard.</p>
    </div>
    <script>
        setTimeout(function() {
            window.location.href = '${installUrl}';
        }, 2000);
    </script>
</body>
</html>`;

  res.status(200).send(installHtml);
}
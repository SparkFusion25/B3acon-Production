// Shopify OAuth authentication handler - handles callback from Partners OAuth flow
export default function handler(req, res) {
  const { shop, host, hmac, timestamp, code, state } = req.query;
  
  console.log('🔐 Shopify OAuth Callback:', { 
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
  
  if (!shop) {
    return res.status(400).json({ error: 'Missing shop parameter' });
  }

  // In production, you would:
  // 1. Verify the HMAC signature against your secret
  // 2. Exchange authorization code for access token
  // 3. Store the access token securely in your database
  // 4. Create user session
  // 5. Redirect to the app with proper embedded context

  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  
  // If we have an authorization code, this is the OAuth callback
  if (code) {
    console.log('✅ OAuth authorization successful, exchanging code for token');
    // TODO: Exchange code for access token in production
    
    // Redirect to plan selection after successful OAuth
    const redirectUrl = `${baseUrl}/shopify/plans?shop=${shop}&host=${host}&authorized=true`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>B3ACON Authorization Complete</title>
    <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f6f6f7;
            text-align: center;
        }
        .success-card {
            background: white;
            border-radius: 8px;
            padding: 40px;
            max-width: 500px;
            margin: 100px auto;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .success-icon {
            width: 60px;
            height: 60px;
            background: #00d084;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
        }
        .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #008060;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="success-card">
        <div class="success-icon">✓</div>
        <h2>Authorization Successful!</h2>
        <p>B3ACON has been authorized for <strong>${shop}</strong></p>
        <p>Setting up your marketing dashboard...</p>
        <div class="spinner"></div>
    </div>

    <script>
        console.log('🎉 OAuth Success - Redirecting to plan selection');
        
        const shop = '${shop}';
        const host = '${host || ''}';
        
        // Initialize App Bridge if embedded
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
        
        // Redirect to plan selection
        setTimeout(() => {
            window.location.href = '${redirectUrl}';
        }, 2000);
    </script>
</body>
</html>`;
    
    return res.status(200).send(html);
  }
  
  // If no code, this might be initial app load - redirect to installation
  const installUrl = `${baseUrl}/shopify/install?shop=${shop}&host=${host}`;
  
  // Create embedded app HTML response for initial load
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>B3ACON Installation</title>
    <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f6f6f7;
        }
        .loading {
            text-align: center;
            padding: 40px;
        }
        .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #008060;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <h3>Setting up B3ACON for your store...</h3>
        <p>Please wait while we initialize your marketing dashboard.</p>
    </div>

    <script>
        console.log('🔗 Shopify OAuth Handler');
        
        // Initialize App Bridge
        const shop = '${shop}';
        const host = '${host || ''}';
        
        if (host) {
            console.log('🏪 Shop:', shop);
            console.log('🌐 Host:', host);
            
            try {
                const app = window.AppBridge.createApp({
                    apiKey: '${process.env.SHOPIFY_API_KEY || 'your-api-key'}',
                    host: host,
                    forceRedirect: true
                });
                
                console.log('✅ App Bridge initialized');
                
                // Redirect to the installation page within the embedded context
                setTimeout(() => {
                    window.location.href = '${redirectUrl}';
                }, 2000);
                
            } catch (error) {
                console.error('❌ App Bridge Error:', error);
                // Fallback redirect
                window.location.href = '${redirectUrl}';
            }
        } else {
            // Non-embedded fallback
            window.location.href = '${redirectUrl}';
        }
    </script>
</body>
</html>`;

  res.status(200).send(html);
}
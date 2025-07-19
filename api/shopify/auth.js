// Shopify OAuth authentication handler for embedded apps
export default function handler(req, res) {
  const { shop, host, hmac, timestamp, code } = req.query;
  
  // Set headers for embedded app
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors https://*.myshopify.com https://admin.shopify.com;");
  
  if (!shop) {
    return res.status(400).json({ error: 'Missing shop parameter' });
  }

  // In production, you would:
  // 1. Verify the HMAC signature
  // 2. Exchange code for access token
  // 3. Store the access token securely
  // 4. Redirect to the app with proper embedded context

  const cleanShop = shop.replace('.myshopify.com', '');
  
  // For now, redirect to the installation page with embedded context
  const redirectUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/shopify/install?shop=${shop}&host=${host}`;
  
  // Create embedded app HTML response
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
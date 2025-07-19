// Shopify App Entry Point for Embedded Apps
export default function handler(req, res) {
  const { shop, host, hmac, timestamp } = req.query;
  
  console.log('🔗 Shopify App Entry:', { shop, host, hmac: !!hmac });
  
  // Set headers for embedded app
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors https://*.myshopify.com https://admin.shopify.com;");
  
  if (!shop) {
    return res.status(400).json({ error: 'Missing shop parameter' });
  }

  // In production, verify HMAC signature here
  
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  
  // Create embedded app HTML
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>B3ACON - Digital Marketing Dashboard</title>
    <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f6f6f7;
            height: 100vh;
        }
        .app-container {
            width: 100%;
            height: 100vh;
            border: none;
        }
        .loading {
            text-align: center;
            padding: 40px;
            background: white;
            margin: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
    <div id="loading" class="loading">
        <div class="spinner"></div>
        <h3>Loading B3ACON Dashboard...</h3>
        <p>Initializing your marketing command center for ${shop}</p>
    </div>

    <script>
        console.log('🚀 B3ACON Embedded App Starting');
        
        const shop = '${shop}';
        const host = '${host || ''}';
        
        // Initialize App Bridge
        if (host && window.AppBridge) {
            console.log('🏪 Shop:', shop);
            console.log('🌐 Host:', host);
            
            try {
                const app = window.AppBridge.createApp({
                    apiKey: '${process.env.SHOPIFY_API_KEY || 'your-api-key'}',
                    host: host,
                    forceRedirect: true
                });
                
                console.log('✅ App Bridge initialized successfully');
                
                // Load the main app
                setTimeout(() => {
                    const loading = document.getElementById('loading');
                    if (loading) {
                        // Replace loading with iframe to the main app
                        const iframe = document.createElement('iframe');
                        iframe.src = '${baseUrl}/shopify/install?shop=' + shop + '&host=' + host + '&embedded=true';
                        iframe.className = 'app-container';
                        iframe.setAttribute('allow', 'web-share');
                        
                        document.body.replaceChild(iframe, loading);
                    }
                }, 2000);
                
            } catch (error) {
                console.error('❌ App Bridge Error:', error);
                // Fallback to direct load
                window.location.href = '${baseUrl}/shopify/install?shop=' + shop + '&host=' + host;
            }
        } else {
            console.log('⚠️ Not in embedded context or App Bridge not available');
            // Direct load for non-embedded context
            window.location.href = '${baseUrl}/shopify/install?shop=' + shop;
        }
    </script>
</body>
</html>`;

  res.status(200).send(html);
}
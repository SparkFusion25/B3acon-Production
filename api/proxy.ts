import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SHOPIFY_APP_SECRET = process.env.SHOPIFY_API_SECRET;

function verifyProxyRequest(query: any): boolean {
  if (!SHOPIFY_APP_SECRET) {
    console.warn('⚠️ SHOPIFY_APP_SECRET not configured - skipping proxy verification');
    return true;
  }

  const { signature, ...params } = query;
  
  if (!signature) {
    return false;
  }

  // Sort parameters and create query string
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  // Calculate expected signature
  const calculatedSignature = crypto
    .createHmac('sha256', SHOPIFY_APP_SECRET)
    .update(sortedParams)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(calculatedSignature, 'hex')
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Verify the request is from Shopify
    if (!verifyProxyRequest(req.query)) {
      console.error('❌ Invalid proxy request signature');
      return res.status(401).json({ error: 'Unauthorized proxy request' });
    }

    const { shop, path_prefix, ...params } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    const shopDomain = (shop as string).replace('.myshopify.com', '');
    
    console.log('🔄 App proxy request from:', shopDomain, 'Path:', req.url);

    // Find the connected store
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('shop_domain', shopDomain)
      .eq('is_active', true)
      .single();

    if (storeError || !store) {
      return res.status(404).json({ 
        error: 'Store not found or not connected',
        shop: shopDomain
      });
    }

    // Route based on the requested path
    const urlPath = req.url?.split('?')[0] || '';
    
    if (urlPath.includes('/widget')) {
      return handleWidget(req, res, store);
    } else if (urlPath.includes('/api/')) {
      return handleAPI(req, res, store);
    } else if (urlPath.includes('/embed')) {
      return handleEmbed(req, res, store);
    } else {
      return handleDefault(req, res, store);
    }

  } catch (error) {
    console.error('❌ App proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Proxy request failed'
    });
  }
}

// Handle widget requests (embedded storefront widgets)
async function handleWidget(req: VercelRequest, res: VercelResponse, store: any) {
  const widgetHtml = `
    <div id="b3acon-widget" style="
      padding: 20px;
      border: 2px solid #667eea;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      margin: 20px 0;
    ">
      <h3 style="margin: 0 0 10px 0;">⚡ B3ACON SEO Optimization</h3>
      <p style="margin: 0 0 15px 0;">This store is optimized with B3ACON's AI-powered SEO tools</p>
      <div style="display: flex; justify-content: space-around; margin-top: 15px;">
        <div>
          <strong>SEO Score</strong><br>
          <span style="font-size: 24px;">94/100</span>
        </div>
        <div>
          <strong>Performance</strong><br>
          <span style="font-size: 24px;">⚡ Fast</span>
        </div>
        <div>
          <strong>Status</strong><br>
          <span style="font-size: 24px;">✅ Active</span>
        </div>
      </div>
    </div>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(widgetHtml);
}

// Handle API requests (AJAX endpoints)
async function handleAPI(req: VercelRequest, res: VercelResponse, store: any) {
  const urlPath = req.url?.split('?')[0] || '';
  
  if (urlPath.includes('/api/seo-score')) {
    // Mock SEO score API
    const seoData = {
      score: 94,
      recommendations: [
        'Add alt text to 3 images',
        'Optimize meta descriptions',
        'Improve page loading speed'
      ],
      last_updated: new Date().toISOString()
    };
    
    res.status(200).json(seoData);
  } else if (urlPath.includes('/api/performance')) {
    // Mock performance API
    const performanceData = {
      page_speed: 85,
      core_web_vitals: {
        lcp: 2.1,
        fid: 45,
        cls: 0.08
      },
      mobile_friendly: true
    };
    
    res.status(200).json(performanceData);
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
}

// Handle embedded app content
async function handleEmbed(req: VercelRequest, res: VercelResponse, store: any) {
  const embedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>B3ACON Embedded App</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: #f8fafc;
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          background: white; 
          padding: 30px; 
          border-radius: 12px; 
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
        }
        .metric { 
          display: inline-block; 
          margin: 10px; 
          padding: 20px; 
          background: #667eea; 
          color: white; 
          border-radius: 8px; 
          text-align: center;
          min-width: 120px;
        }
        .metric h3 { margin: 0 0 10px 0; }
        .metric .value { font-size: 24px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚡ B3ACON Store Dashboard</h1>
          <p>Connected to: ${store.shop_name}</p>
        </div>
        
        <div class="metrics">
          <div class="metric">
            <h3>SEO Score</h3>
            <div class="value">94/100</div>
          </div>
          <div class="metric">
            <h3>Page Speed</h3>
            <div class="value">85/100</div>
          </div>
          <div class="metric">
            <h3>Mobile Ready</h3>
            <div class="value">✅ Yes</div>
          </div>
          <div class="metric">
            <h3>Status</h3>
            <div class="value">🟢 Active</div>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://b3acon-production-pl15.vercel.app/shopify/dashboard" 
             target="_parent" 
             style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Open Full Dashboard
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(embedHtml);
}

// Handle default proxy requests
async function handleDefault(req: VercelRequest, res: VercelResponse, store: any) {
  const defaultResponse = {
    app: 'B3ACON',
    version: '1.0.0',
    store: {
      name: store.shop_name,
      domain: store.shop_domain,
      connected: true
    },
    features: [
      'SEO Optimization',
      'Performance Monitoring',
      'Analytics Tracking',
      'Mobile Optimization'
    ],
    status: 'active'
  };

  res.status(200).json(defaultResponse);
}
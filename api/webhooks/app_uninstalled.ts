import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

function verifyWebhook(data: string, signature: string): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.warn('⚠️ SHOPIFY_WEBHOOK_SECRET not configured - skipping verification');
    return true; // In development, allow unverified webhooks
  }

  const calculatedSignature = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(data, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'base64'),
    Buffer.from(calculatedSignature, 'base64')
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the webhook signature
    const signature = req.headers['x-shopify-hmac-sha256'] as string;
    const shop = req.headers['x-shopify-shop-domain'] as string;
    
    if (!signature) {
      console.error('❌ Missing webhook signature');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!shop) {
      console.error('❌ Missing shop domain in webhook');
      return res.status(400).json({ error: 'Missing shop domain' });
    }

    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    
    // Verify webhook authenticity
    if (!verifyWebhook(rawBody, signature)) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('📦 App uninstalled webhook received from:', shop);

    // Clean the shop domain
    const shopDomain = shop.replace('.myshopify.com', '');

    // Deactivate the store in database
    const { error: updateError } = await supabase
      .from('shopify_stores')
      .update({ 
        is_active: false,
        last_sync: new Date().toISOString()
      })
      .eq('shop_domain', shopDomain);

    if (updateError) {
      console.error('❌ Error deactivating store:', updateError);
      // Don't return error to Shopify - we still want to acknowledge receipt
    } else {
      console.log('✅ Store deactivated successfully:', shopDomain);
    }

    // Log the uninstallation
    const { error: logError } = await supabase
      .from('app_events')
      .insert({
        event_type: 'app_uninstalled',
        shop_domain: shopDomain,
        event_data: req.body,
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.warn('⚠️ Failed to log uninstall event:', logError);
    }

    // Optional: Clean up sensitive data (depending on your retention policy)
    // await supabase.from('shopify_orders').delete().eq('store_id', storeId);
    // await supabase.from('shopify_customers').delete().eq('store_id', storeId);

    // Return 200 OK to acknowledge receipt
    res.status(200).json({ 
      success: true, 
      message: 'App uninstallation processed successfully',
      shop: shopDomain
    });

  } catch (error) {
    console.error('❌ App uninstall webhook error:', error);
    
    // Still return 200 to Shopify to avoid retries
    res.status(200).json({ 
      success: false, 
      error: 'Internal server error',
      message: 'Webhook received but processing failed'
    });
  }
}
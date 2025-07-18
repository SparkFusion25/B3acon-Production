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
    return true;
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
    const signature = req.headers['x-shopify-hmac-sha256'] as string;
    const shop = req.headers['x-shopify-shop-domain'] as string;
    
    if (!signature) {
      console.error('❌ Missing webhook signature');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const rawBody = JSON.stringify(req.body);
    
    if (!verifyWebhook(rawBody, signature)) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🏪🗑️ Shop data deletion webhook received from:', shop);

    const { shop_id, shop_domain } = req.body;
    const cleanShopDomain = (shop_domain || shop).replace('.myshopify.com', '');

    if (!shop_id && !shop_domain) {
      console.error('❌ Invalid shop data in webhook');
      return res.status(400).json({ error: 'Invalid shop data' });
    }

    // Find the store
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('shop_domain', cleanShopDomain)
      .single();

    if (storeError || !store) {
      console.warn('⚠️ Store not found for deletion:', cleanShopDomain);
      // Still return success - store might already be deleted
      return res.status(200).json({ 
        success: true,
        message: 'Store not found - may already be deleted',
        shop_domain: cleanShopDomain
      });
    }

    const deletionSummary: any = {
      shop_id: shop_id,
      shop_domain: cleanShopDomain,
      store_id: store.id,
      deleted_data: {},
      deletion_date: new Date().toISOString()
    };

    // Delete all related data in the correct order (respecting foreign key constraints)

    // 1. Delete analytics data
    const { data: deletedAnalytics, error: analyticsError } = await supabase
      .from('shopify_analytics')
      .delete()
      .eq('store_id', store.id)
      .select();

    deletionSummary.deleted_data.analytics = {
      deleted: !analyticsError,
      count: deletedAnalytics?.length || 0,
      error: analyticsError?.message
    };

    // 2. Delete webhooks
    const { data: deletedWebhooks, error: webhooksError } = await supabase
      .from('shopify_webhooks')
      .delete()
      .eq('store_id', store.id)
      .select();

    deletionSummary.deleted_data.webhooks = {
      deleted: !webhooksError,
      count: deletedWebhooks?.length || 0,
      error: webhooksError?.message
    };

    // 3. Delete customers
    const { data: deletedCustomers, error: customersError } = await supabase
      .from('shopify_customers')
      .delete()
      .eq('store_id', store.id)
      .select();

    deletionSummary.deleted_data.customers = {
      deleted: !customersError,
      count: deletedCustomers?.length || 0,
      error: customersError?.message
    };

    // 4. Delete orders
    const { data: deletedOrders, error: ordersError } = await supabase
      .from('shopify_orders')
      .delete()
      .eq('store_id', store.id)
      .select();

    deletionSummary.deleted_data.orders = {
      deleted: !ordersError,
      count: deletedOrders?.length || 0,
      error: ordersError?.message
    };

    // 5. Delete products
    const { data: deletedProducts, error: productsError } = await supabase
      .from('shopify_products')
      .delete()
      .eq('store_id', store.id)
      .select();

    deletionSummary.deleted_data.products = {
      deleted: !productsError,
      count: deletedProducts?.length || 0,
      error: productsError?.message
    };

    // 6. Finally, delete the store itself
    const { data: deletedStore, error: storeDeleteError } = await supabase
      .from('shopify_stores')
      .delete()
      .eq('id', store.id)
      .select();

    deletionSummary.deleted_data.store = {
      deleted: !storeDeleteError,
      count: deletedStore?.length || 0,
      error: storeDeleteError?.message
    };

    // Log the deletion request
    const { error: logError } = await supabase
      .from('gdpr_requests')
      .insert({
        request_type: 'shop_redact',
        shop_domain: cleanShopDomain,
        customer_id: null,
        customer_email: null,
        request_data: deletionSummary,
        status: 'completed',
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.warn('⚠️ Failed to log GDPR shop deletion request:', logError);
    }

    // Calculate totals
    const totalDeleted = Object.values(deletionSummary.deleted_data).reduce(
      (sum: number, item: any) => sum + (item.count || 0), 0
    );

    const hasErrors = Object.values(deletionSummary.deleted_data).some(
      (item: any) => item.error
    );

    console.log(`✅ Shop data deletion completed for: ${cleanShopDomain} (${totalDeleted} records)`);

    res.status(200).json({ 
      success: true,
      message: 'Shop data deletion processed successfully',
      shop_domain: cleanShopDomain,
      deletion_summary: {
        total_records_deleted: totalDeleted,
        store_deleted: !!deletionSummary.deleted_data.store?.deleted,
        has_errors: hasErrors,
        breakdown: {
          analytics: deletionSummary.deleted_data.analytics?.count || 0,
          webhooks: deletionSummary.deleted_data.webhooks?.count || 0,
          customers: deletionSummary.deleted_data.customers?.count || 0,
          orders: deletionSummary.deleted_data.orders?.count || 0,
          products: deletionSummary.deleted_data.products?.count || 0,
          store: deletionSummary.deleted_data.store?.count || 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Shop data deletion webhook error:', error);
    
    res.status(200).json({ 
      success: false, 
      error: 'Internal server error',
      message: 'Webhook received but processing failed'
    });
  }
}
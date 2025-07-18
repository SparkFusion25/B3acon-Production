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

    console.log('🗑️ Customer data deletion webhook received from:', shop);

    const { customer, orders_to_redact } = req.body;
    const shopDomain = shop.replace('.myshopify.com', '');

    if (!customer?.id || !customer?.email) {
      console.error('❌ Invalid customer data in webhook');
      return res.status(400).json({ error: 'Invalid customer data' });
    }

    // Find the store
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('id')
      .eq('shop_domain', shopDomain)
      .single();

    if (storeError || !store) {
      console.error('❌ Store not found:', shopDomain);
      return res.status(404).json({ error: 'Store not found' });
    }

    const deletionSummary: any = {
      customer_id: customer.id,
      customer_email: customer.email,
      shop_domain: shopDomain,
      deleted_data: {},
      deletion_date: new Date().toISOString()
    };

    // Delete customer record
    const { data: deletedCustomer, error: customerDeleteError } = await supabase
      .from('shopify_customers')
      .delete()
      .eq('store_id', store.id)
      .eq('shopify_id', customer.id.toString())
      .select();

    if (customerDeleteError) {
      console.error('❌ Error deleting customer:', customerDeleteError);
      deletionSummary.deleted_data.customer = { error: customerDeleteError.message };
    } else {
      deletionSummary.deleted_data.customer = { 
        deleted: !!deletedCustomer?.length,
        count: deletedCustomer?.length || 0
      };
      console.log('✅ Customer record deleted:', customer.email);
    }

    // Delete or anonymize orders if specified
    let ordersAffected = 0;
    if (orders_to_redact && orders_to_redact.length > 0) {
      // Option 1: Complete deletion (if legally required)
      const { data: deletedOrders, error: orderDeleteError } = await supabase
        .from('shopify_orders')
        .delete()
        .eq('store_id', store.id)
        .in('shopify_id', orders_to_redact)
        .select();

      if (orderDeleteError) {
        console.error('❌ Error deleting orders:', orderDeleteError);
        deletionSummary.deleted_data.orders = { error: orderDeleteError.message };
      } else {
        ordersAffected = deletedOrders?.length || 0;
        deletionSummary.deleted_data.orders = { 
          deleted: true,
          count: ordersAffected
        };
        console.log(`✅ ${ordersAffected} orders deleted`);
      }
    } else {
      // Option 2: Anonymize orders (remove PII but keep business data)
      const { data: anonymizedOrders, error: orderAnonymizeError } = await supabase
        .from('shopify_orders')
        .update({
          customer_email: '[REDACTED]',
          customer_name: '[REDACTED]',
          shipping_address: null,
          billing_address: null,
          // Keep financial data for business records
        })
        .eq('store_id', store.id)
        .eq('customer_email', customer.email)
        .select();

      if (orderAnonymizeError) {
        console.error('❌ Error anonymizing orders:', orderAnonymizeError);
        deletionSummary.deleted_data.orders = { error: orderAnonymizeError.message };
      } else {
        ordersAffected = anonymizedOrders?.length || 0;
        deletionSummary.deleted_data.orders = { 
          anonymized: true,
          count: ordersAffected
        };
        console.log(`✅ ${ordersAffected} orders anonymized`);
      }
    }

    // Delete any analytics data related to this customer
    const { error: analyticsDeleteError } = await supabase
      .from('customer_analytics')
      .delete()
      .eq('store_id', store.id)
      .eq('customer_id', customer.id.toString());

    if (analyticsDeleteError) {
      console.warn('⚠️ Error deleting customer analytics:', analyticsDeleteError);
    }

    // Log the deletion request
    const { error: logError } = await supabase
      .from('gdpr_requests')
      .insert({
        request_type: 'customer_redact',
        shop_domain: shopDomain,
        customer_id: customer.id.toString(),
        customer_email: customer.email,
        request_data: deletionSummary,
        status: 'completed',
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.warn('⚠️ Failed to log GDPR deletion request:', logError);
    }

    console.log('✅ Customer data deletion completed for:', customer.email);

    res.status(200).json({ 
      success: true,
      message: 'Customer data deletion processed successfully',
      customer_email: customer.email,
      deletion_summary: {
        customer_deleted: !!deletionSummary.deleted_data.customer?.deleted,
        orders_affected: ordersAffected,
        deletion_type: orders_to_redact?.length > 0 ? 'complete_deletion' : 'anonymization'
      }
    });

  } catch (error) {
    console.error('❌ Customer data deletion webhook error:', error);
    
    res.status(200).json({ 
      success: false, 
      error: 'Internal server error',
      message: 'Webhook received but processing failed'
    });
  }
}
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

    console.log('📋 Customer data request webhook received from:', shop);

    const { customer, orders_requested } = req.body;
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

    // Collect all customer data we have stored
    const customerData: any = {
      request_id: `${customer.id}_${Date.now()}`,
      shop_domain: shopDomain,
      customer: {
        shopify_id: customer.id,
        email: customer.email,
        requested_at: new Date().toISOString()
      },
      data_collected: {}
    };

    // Get customer data from our database
    const { data: customerRecord, error: customerError } = await supabase
      .from('shopify_customers')
      .select('*')
      .eq('store_id', store.id)
      .eq('shopify_id', customer.id.toString())
      .single();

    if (customerRecord) {
      customerData.data_collected.customer_profile = {
        email: customerRecord.email,
        first_name: customerRecord.first_name,
        last_name: customerRecord.last_name,
        phone: customerRecord.phone,
        total_spent: customerRecord.total_spent,
        orders_count: customerRecord.orders_count,
        last_order_date: customerRecord.last_order_date,
        marketing_opt_in: customerRecord.marketing_opt_in,
        tags: customerRecord.tags,
        addresses: customerRecord.addresses,
        created_at: customerRecord.shopify_created_at,
        updated_at: customerRecord.shopify_updated_at
      };
    }

    // Get order data if requested
    if (orders_requested) {
      const { data: orderRecords, error: orderError } = await supabase
        .from('shopify_orders')
        .select('*')
        .eq('store_id', store.id)
        .eq('customer_email', customer.email);

      if (orderRecords && orderRecords.length > 0) {
        customerData.data_collected.orders = orderRecords.map(order => ({
          shopify_id: order.shopify_id,
          order_number: order.order_number,
          total_price: order.total_price,
          currency: order.currency,
          created_at: order.shopify_created_at,
          financial_status: order.financial_status,
          fulfillment_status: order.fulfillment_status,
          line_items: order.line_items,
          shipping_address: order.shipping_address,
          billing_address: order.billing_address
        }));
      }
    }

    // Log the data request
    const { error: logError } = await supabase
      .from('gdpr_requests')
      .insert({
        request_type: 'data_request',
        shop_domain: shopDomain,
        customer_id: customer.id.toString(),
        customer_email: customer.email,
        request_data: customerData,
        status: 'completed',
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.warn('⚠️ Failed to log GDPR request:', logError);
    }

    console.log('✅ Customer data request processed for:', customer.email);

    // In a real implementation, you would:
    // 1. Send this data to the customer via email
    // 2. Store it securely for download
    // 3. Notify your compliance team
    // 4. Set up automatic deletion after retention period

    res.status(200).json({ 
      success: true,
      message: 'Customer data request processed successfully',
      customer_email: customer.email,
      data_summary: {
        customer_profile: !!customerData.data_collected.customer_profile,
        orders_count: customerData.data_collected.orders?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ Customer data request webhook error:', error);
    
    res.status(200).json({ 
      success: false, 
      error: 'Internal server error',
      message: 'Webhook received but processing failed'
    });
  }
}
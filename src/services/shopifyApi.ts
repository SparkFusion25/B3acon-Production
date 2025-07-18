import { supabase } from '../lib/supabase';

export interface ShopifyStore {
  id: string;
  name: string;
  domain: string;
  email: string;
  accessToken: string;
  plan: string;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  images: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    compareAtPrice?: string;
    sku: string;
    inventoryQuantity: number;
  }>;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  lineItems: Array<{
    id: string;
    productId: string;
    title: string;
    quantity: number;
    price: string;
  }>;
  totalPrice: string;
  subtotalPrice: string;
  totalTax: string;
  shippingAddress: any;
  billingAddress: any;
  fulfillmentStatus: string;
  financialStatus: string;
  createdAt: string;
  updatedAt: string;
}

class ShopifyApiService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private redirectUri = `${window.location.origin}/shopify/auth/callback`;

  constructor() {
    this.initializeCredentials();
  }

  private async initializeCredentials() {
    try {
      if (!supabase) {
        console.error('❌ Supabase not configured');
        return;
      }

      // Fetch Shopify credentials from Supabase
      const { data, error } = await supabase
        .from('app_config')
        .select('key, value')
        .in('key', ['Shopify_Client_ID', 'Shopify_API_Secret']);

      if (error) {
        console.error('❌ Error fetching Shopify credentials:', error);
        return;
      }

      if (data) {
        const clientIdRow = data.find(row => row.key === 'Shopify_Client_ID');
        const clientSecretRow = data.find(row => row.key === 'Shopify_API_Secret');
        
        this.clientId = clientIdRow?.value || null;
        this.clientSecret = clientSecretRow?.value || null;

        console.log('✅ Shopify API credentials loaded:', {
          hasClientId: !!this.clientId,
          hasClientSecret: !!this.clientSecret
        });
      }
    } catch (error) {
      console.error('❌ Error initializing Shopify credentials:', error);
    }
  }

  // OAuth Authorization URL
  generateAuthUrl(shop: string, state?: string): string {
    if (!this.clientId) {
      throw new Error('Shopify Client ID not configured');
    }

    const scopes = [
      'read_products',
      'read_orders',
      'read_customers',
      'read_content',
      'read_themes',
      'read_script_tags',
      'write_script_tags',
      'read_analytics'
    ].join(',');

    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: scopes,
      redirect_uri: this.redirectUri,
      state: state || Date.now().toString(),
      response_type: 'code'
    });

    return `https://${shop}.myshopify.com/admin/oauth/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(shop: string, code: string): Promise<{ accessToken: string; scope: string }> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Shopify API credentials not configured');
    }

    try {
      const response = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code
        })
      });

      if (!response.ok) {
        throw new Error(`OAuth token exchange failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        accessToken: data.access_token,
        scope: data.scope
      };
    } catch (error) {
      console.error('❌ Error exchanging code for token:', error);
      throw error;
    }
  }

  // Store access token and shop info in Supabase
  async saveStoreConnection(shop: string, accessToken: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      // Get shop info
      const shopInfo = await this.getShopInfo(shop, accessToken);
      
      const storeData = {
        shop_domain: shop,
        access_token: accessToken,
        shop_name: shopInfo.name,
        shop_email: shopInfo.email,
        plan_name: shopInfo.plan_name,
        currency: shopInfo.currency,
        timezone: shopInfo.iana_timezone,
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString()
      };

      const { error } = await supabase
        .from('shopify_stores')
        .upsert(storeData, { onConflict: 'shop_domain' });

      if (error) {
        throw new Error(`Failed to save store connection: ${error.message}`);
      }

      console.log('✅ Store connection saved successfully');
    } catch (error) {
      console.error('❌ Error saving store connection:', error);
      throw error;
    }
  }

  // Get shop information
  private async getShopInfo(shop: string, accessToken: string): Promise<any> {
    const response = await fetch(`https://${shop}.myshopify.com/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shop info: ${response.statusText}`);
    }

    const data = await response.json();
    return data.shop;
  }

  // Get store from Supabase
  async getConnectedStore(shopDomain: string): Promise<ShopifyStore | null> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('shopify_stores')
        .select('*')
        .eq('shop_domain', shopDomain)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        name: data.shop_name,
        domain: data.shop_domain,
        email: data.shop_email,
        accessToken: data.access_token,
        plan: data.plan_name,
        currency: data.currency,
        timezone: data.timezone,
        createdAt: data.connected_at,
        updatedAt: data.last_sync
      };
    } catch (error) {
      console.error('❌ Error fetching connected store:', error);
      return null;
    }
  }

  // Fetch products from Shopify
  async getProducts(shop: string, accessToken: string, limit = 50): Promise<ShopifyProduct[]> {
    try {
      const response = await fetch(
        `https://${shop}.myshopify.com/admin/api/2024-01/products.json?limit=${limit}`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      return data.products.map(this.transformProduct);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  }

  // Fetch orders from Shopify
  async getOrders(shop: string, accessToken: string, limit = 50): Promise<ShopifyOrder[]> {
    try {
      const response = await fetch(
        `https://${shop}.myshopify.com/admin/api/2024-01/orders.json?limit=${limit}&status=any`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      const data = await response.json();
      return data.orders.map(this.transformOrder);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw error;
    }
  }

  // Get store analytics
  async getStoreAnalytics(shop: string, accessToken: string): Promise<any> {
    try {
      // Fetch multiple analytics endpoints
      const [ordersResponse, productsResponse, customersResponse] = await Promise.all([
        fetch(`https://${shop}.myshopify.com/admin/api/2024-01/orders.json?status=any&limit=250`, {
          headers: { 'X-Shopify-Access-Token': accessToken }
        }),
        fetch(`https://${shop}.myshopify.com/admin/api/2024-01/products.json?limit=250`, {
          headers: { 'X-Shopify-Access-Token': accessToken }
        }),
        fetch(`https://${shop}.myshopify.com/admin/api/2024-01/customers.json?limit=250`, {
          headers: { 'X-Shopify-Access-Token': accessToken }
        })
      ]);

      const orders = await ordersResponse.json();
      const products = await productsResponse.json();
      const customers = await customersResponse.json();

      // Calculate analytics
      const totalRevenue = orders.orders?.reduce((sum: number, order: any) => 
        sum + parseFloat(order.total_price || '0'), 0) || 0;
      
      const totalOrders = orders.orders?.length || 0;
      const totalProducts = products.products?.length || 0;
      const totalCustomers = customers.customers?.length || 0;

      return {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        recentOrders: orders.orders?.slice(0, 10) || [],
        topProducts: products.products?.slice(0, 10) || []
      };
    } catch (error) {
      console.error('❌ Error fetching store analytics:', error);
      throw error;
    }
  }

  // Transform product data
  private transformProduct(product: any): ShopifyProduct {
    return {
      id: product.id.toString(),
      title: product.title,
      handle: product.handle,
      description: product.body_html || '',
      vendor: product.vendor,
      productType: product.product_type,
      tags: product.tags ? product.tags.split(',').map((tag: string) => tag.trim()) : [],
      images: product.images?.map((img: any) => ({
        id: img.id.toString(),
        src: img.src,
        alt: img.alt || ''
      })) || [],
      variants: product.variants?.map((variant: any) => ({
        id: variant.id.toString(),
        title: variant.title,
        price: variant.price,
        compareAtPrice: variant.compare_at_price,
        sku: variant.sku || '',
        inventoryQuantity: variant.inventory_quantity || 0
      })) || [],
      status: product.status,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
  }

  // Transform order data
  private transformOrder(order: any): ShopifyOrder {
    return {
      id: order.id.toString(),
      orderNumber: order.order_number?.toString() || order.name,
      customer: {
        id: order.customer?.id?.toString() || '',
        email: order.customer?.email || '',
        firstName: order.customer?.first_name || '',
        lastName: order.customer?.last_name || ''
      },
      lineItems: order.line_items?.map((item: any) => ({
        id: item.id.toString(),
        productId: item.product_id?.toString() || '',
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })) || [],
      totalPrice: order.total_price,
      subtotalPrice: order.subtotal_price,
      totalTax: order.total_tax,
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      fulfillmentStatus: order.fulfillment_status || 'unfulfilled',
      financialStatus: order.financial_status || 'pending',
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };
  }

  // Check if credentials are configured
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  // Install webhook
  async installWebhook(shop: string, accessToken: string, topic: string, address: string): Promise<void> {
    try {
      const response = await fetch(`https://${shop}.myshopify.com/admin/api/2024-01/webhooks.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          webhook: {
            topic,
            address,
            format: 'json'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to install webhook: ${response.statusText}`);
      }

      console.log(`✅ Webhook installed: ${topic}`);
    } catch (error) {
      console.error(`❌ Error installing webhook for ${topic}:`, error);
      throw error;
    }
  }
}

export const shopifyApi = new ShopifyApiService();
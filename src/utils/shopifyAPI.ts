import axios from 'axios';

// Shopify API configuration
const SHOPIFY_API_VERSION = '2024-01';

interface ShopifyConfig {
  apiKey: string;
  apiSecret: string;
  shopDomain: string;
  accessToken: string;
}

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  product_type: string;
  vendor: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  tags: string;
  status: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    inventory_quantity: number;
  }>;
}

interface ShopifyStore {
  id: number;
  name: string;
  email: string;
  domain: string;
  province: string;
  country: string;
  address1: string;
  zip: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  primary_locale: string;
  address2: string;
  created_at: string;
  updated_at: string;
  country_code: string;
  currency: string;
  customer_email: string;
  timezone: string;
  shop_owner: string;
  money_format: string;
  money_with_currency_format: string;
  weight_unit: string;
  province_code: string;
  taxes_included: boolean;
  auto_configure_tax_inclusivity: boolean;
  tax_shipping: boolean;
  county_taxes: boolean;
  plan_display_name: string;
  plan_name: string;
  has_discounts: boolean;
  has_gift_cards: boolean;
  myshopify_domain: string;
  google_apps_domain: string;
  google_apps_login_enabled: boolean;
  money_in_emails_format: string;
  money_with_currency_in_emails_format: string;
  eligible_for_payments: boolean;
  requires_extra_payments_agreement: boolean;
  password_enabled: boolean;
  has_storefront: boolean;
  eligible_for_card_reader_giveaway: boolean;
  finances: boolean;
  primary_location_id: number;
  checkout_api_supported: boolean;
  multi_location_enabled: boolean;
  setup_required: boolean;
  pre_launch_enabled: boolean;
  enabled_presentment_currencies: string[];
}

class ShopifyAPI {
  private config: ShopifyConfig;

  constructor(config: ShopifyConfig) {
    this.config = config;
  }

  private getApiUrl(endpoint: string): string {
    return `https://${this.config.shopDomain}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`;
  }

  private getHeaders() {
    return {
      'X-Shopify-Access-Token': this.config.accessToken,
      'Content-Type': 'application/json',
    };
  }

  // Get store information
  async getShopInfo(): Promise<ShopifyStore> {
    try {
      const response = await axios.get(this.getApiUrl('shop.json'), {
        headers: this.getHeaders(),
      });
      return response.data.shop;
    } catch (error) {
      console.error('Error fetching shop info:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts(limit: number = 250): Promise<ShopifyProduct[]> {
    try {
      const response = await axios.get(this.getApiUrl(`products.json?limit=${limit}`), {
        headers: this.getHeaders(),
      });
      return response.data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get product by ID
  async getProduct(productId: number): Promise<ShopifyProduct> {
    try {
      const response = await axios.get(this.getApiUrl(`products/${productId}.json`), {
        headers: this.getHeaders(),
      });
      return response.data.product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get pages for SEO analysis
  async getPages(): Promise<any[]> {
    try {
      const response = await axios.get(this.getApiUrl('pages.json'), {
        headers: this.getHeaders(),
      });
      return response.data.pages;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }

  // Get themes for integration
  async getThemes(): Promise<any[]> {
    try {
      const response = await axios.get(this.getApiUrl('themes.json'), {
        headers: this.getHeaders(),
      });
      return response.data.themes;
    } catch (error) {
      console.error('Error fetching themes:', error);
      throw error;
    }
  }

  // Get orders for analytics
  async getOrders(limit: number = 250): Promise<any[]> {
    try {
      const response = await axios.get(this.getApiUrl(`orders.json?limit=${limit}&status=any`), {
        headers: this.getHeaders(),
      });
      return response.data.orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get customers for analytics
  async getCustomers(limit: number = 250): Promise<any[]> {
    try {
      const response = await axios.get(this.getApiUrl(`customers.json?limit=${limit}`), {
        headers: this.getHeaders(),
      });
      return response.data.customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  // Get script tags (for tracking installation)
  async getScriptTags(): Promise<any[]> {
    try {
      const response = await axios.get(this.getApiUrl('script_tags.json'), {
        headers: this.getHeaders(),
      });
      return response.data.script_tags;
    } catch (error) {
      console.error('Error fetching script tags:', error);
      throw error;
    }
  }

  // Create script tag (for app installation)
  async createScriptTag(src: string, event: string = 'onload'): Promise<any> {
    try {
      const response = await axios.post(
        this.getApiUrl('script_tags.json'),
        {
          script_tag: {
            event,
            src,
          },
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.script_tag;
    } catch (error) {
      console.error('Error creating script tag:', error);
      throw error;
    }
  }

  // Analytics methods
  async getAnalytics(startDate: string, endDate: string) {
    try {
      // Get orders in date range
      const orders = await axios.get(
        this.getApiUrl(`orders.json?created_at_min=${startDate}&created_at_max=${endDate}&status=any`),
        { headers: this.getHeaders() }
      );

      // Calculate metrics
      const totalOrders = orders.data.orders.length;
      const totalRevenue = orders.data.orders.reduce((sum: number, order: any) => 
        sum + parseFloat(order.total_price), 0
      );
      
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      return {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        conversionRate: 0, // Would need traffic data
        orders: orders.data.orders,
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const createShopifyAPI = (config: ShopifyConfig) => new ShopifyAPI(config);

// Default configuration from environment variables
export const getShopifyConfig = (): ShopifyConfig => ({
  apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || '',
  apiSecret: import.meta.env.VITE_SHOPIFY_API_SECRET || '',
  shopDomain: 'techstore.myshopify.com', // This would be dynamic in a real app
  accessToken: import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || '',
});

export default ShopifyAPI;
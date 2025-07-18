-- Create app_config table for storing API keys and configuration
CREATE TABLE IF NOT EXISTS app_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopify_stores table for storing connected Shopify stores
CREATE TABLE IF NOT EXISTS shopify_stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_domain VARCHAR(255) UNIQUE NOT NULL,
  shop_name VARCHAR(255) NOT NULL,
  shop_email VARCHAR(255),
  access_token TEXT NOT NULL,
  plan_name VARCHAR(100),
  currency VARCHAR(10),
  timezone VARCHAR(100),
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  webhook_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopify_products table for caching product data
CREATE TABLE IF NOT EXISTS shopify_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopify_id BIGINT NOT NULL,
  store_id UUID REFERENCES shopify_stores(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  handle VARCHAR(255),
  description TEXT,
  vendor VARCHAR(255),
  product_type VARCHAR(255),
  status VARCHAR(50),
  tags TEXT[],
  images JSONB,
  variants JSONB,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shopify_created_at TIMESTAMP WITH TIME ZONE,
  shopify_updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(shopify_id, store_id)
);

-- Create shopify_orders table for caching order data
CREATE TABLE IF NOT EXISTS shopify_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopify_id BIGINT NOT NULL,
  store_id UUID REFERENCES shopify_stores(id) ON DELETE CASCADE,
  order_number VARCHAR(100),
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  total_price DECIMAL(10,2),
  subtotal_price DECIMAL(10,2),
  total_tax DECIMAL(10,2),
  currency VARCHAR(10),
  financial_status VARCHAR(50),
  fulfillment_status VARCHAR(50),
  line_items JSONB,
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shopify_created_at TIMESTAMP WITH TIME ZONE,
  shopify_updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(shopify_id, store_id)
);

-- Create shopify_customers table for caching customer data
CREATE TABLE IF NOT EXISTS shopify_customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopify_id BIGINT NOT NULL,
  store_id UUID REFERENCES shopify_stores(id) ON DELETE CASCADE,
  email VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(50),
  total_spent DECIMAL(10,2),
  orders_count INTEGER DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  addresses JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shopify_created_at TIMESTAMP WITH TIME ZONE,
  shopify_updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(shopify_id, store_id)
);

-- Create shopify_webhooks table for tracking webhook deliveries
CREATE TABLE IF NOT EXISTS shopify_webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES shopify_stores(id) ON DELETE CASCADE,
  webhook_id BIGINT,
  topic VARCHAR(100) NOT NULL,
  address VARCHAR(500) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopify_analytics table for storing analytics data
CREATE TABLE IF NOT EXISTS shopify_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES shopify_stores(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  conversion_rate DECIMAL(5,4) DEFAULT 0,
  traffic_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shopify_stores_domain ON shopify_stores(shop_domain);
CREATE INDEX IF NOT EXISTS idx_shopify_stores_active ON shopify_stores(is_active);
CREATE INDEX IF NOT EXISTS idx_shopify_products_store ON shopify_products(store_id);
CREATE INDEX IF NOT EXISTS idx_shopify_products_shopify_id ON shopify_products(shopify_id);
CREATE INDEX IF NOT EXISTS idx_shopify_orders_store ON shopify_orders(store_id);
CREATE INDEX IF NOT EXISTS idx_shopify_orders_shopify_id ON shopify_orders(shopify_id);
CREATE INDEX IF NOT EXISTS idx_shopify_orders_created ON shopify_orders(shopify_created_at);
CREATE INDEX IF NOT EXISTS idx_shopify_customers_store ON shopify_customers(store_id);
CREATE INDEX IF NOT EXISTS idx_shopify_customers_email ON shopify_customers(email);
CREATE INDEX IF NOT EXISTS idx_shopify_analytics_store_date ON shopify_analytics(store_id, date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at columns
CREATE TRIGGER update_app_config_updated_at BEFORE UPDATE ON app_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopify_stores_updated_at BEFORE UPDATE ON shopify_stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopify_products_updated_at BEFORE UPDATE ON shopify_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopify_orders_updated_at BEFORE UPDATE ON shopify_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopify_customers_updated_at BEFORE UPDATE ON shopify_customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopify_webhooks_updated_at BEFORE UPDATE ON shopify_webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopify_analytics_updated_at BEFORE UPDATE ON shopify_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial app configuration (you'll need to update these values)
INSERT INTO app_config (key, value, description) VALUES 
  ('Shopify_Client_ID', 'your_shopify_client_id_here', 'Shopify App Client ID for OAuth')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO app_config (key, value, description) VALUES 
  ('Shopify_API_Secret', 'your_shopify_api_secret_here', 'Shopify App Client Secret for OAuth')
  ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication system)
CREATE POLICY "Allow authenticated users to read app_config" ON app_config
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations on shopify_stores" ON shopify_stores
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on shopify_products" ON shopify_products
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on shopify_orders" ON shopify_orders
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on shopify_customers" ON shopify_customers
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on shopify_webhooks" ON shopify_webhooks
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on shopify_analytics" ON shopify_analytics
  FOR ALL USING (true);
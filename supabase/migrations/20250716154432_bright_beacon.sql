/*
  # Global Commerce Tables

  1. New Tables
    - `global_commerce_settings` - Global settings for commerce features
    - `tariff_rates` - Tariff rates by country and HS code
    - `hs_codes` - Harmonized System codes database
    - `fta_agreements` - Free Trade Agreements between countries
    - `shipping_rates` - Shipping rate estimates by origin/destination
    - `user_commerce_history` - User's calculation history
    - `commerce_subscriptions` - User subscription levels for commerce features
  
  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Set up admin-only tables
*/

-- Global Commerce Settings
CREATE TABLE IF NOT EXISTS global_commerce_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tariff Rates
CREATE TABLE IF NOT EXISTS tariff_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_country TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  hs_code TEXT NOT NULL,
  duty_rate DECIMAL(5,2) NOT NULL,
  vat_rate DECIMAL(5,2),
  notes TEXT,
  source_url TEXT,
  is_active BOOLEAN DEFAULT true,
  effective_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- HS Codes
CREATE TABLE IF NOT EXISTS hs_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT,
  chapter TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- FTA Agreements
CREATE TABLE IF NOT EXISTS fta_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  countries TEXT[] NOT NULL,
  effective_date DATE,
  expiry_date DATE,
  details JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shipping Rates
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_country TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('ocean', 'air', 'truck', 'rail')),
  base_rate DECIMAL(10,2) NOT NULL,
  additional_fees JSONB DEFAULT '{}',
  transit_time_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  effective_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Commerce History
CREATE TABLE IF NOT EXISTS user_commerce_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plugin_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Commerce Subscriptions
CREATE TABLE IF NOT EXISTS commerce_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_level TEXT NOT NULL CHECK (subscription_level IN ('starter', 'pro', 'enterprise')),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compliance Watchlists
CREATE TABLE IF NOT EXISTS compliance_watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('company', 'individual', 'vessel', 'aircraft')),
  list_name TEXT NOT NULL,
  list_entry_date DATE,
  details JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Freight Rates
CREATE TABLE IF NOT EXISTS freight_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_country TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('ocean', 'air', 'truck', 'rail')),
  base_rate DECIMAL(10,2) NOT NULL,
  additional_fees JSONB DEFAULT '{}',
  transit_time_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  effective_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tariff_rates_countries ON tariff_rates(origin_country, destination_country);
CREATE INDEX IF NOT EXISTS idx_tariff_rates_hs_code ON tariff_rates(hs_code);
CREATE INDEX IF NOT EXISTS idx_hs_codes_code ON hs_codes(code);
CREATE INDEX IF NOT EXISTS idx_hs_codes_category ON hs_codes(category);
CREATE INDEX IF NOT EXISTS idx_fta_agreements_countries ON fta_agreements USING GIN(countries);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_countries ON shipping_rates(origin_country, destination_country);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_mode ON shipping_rates(mode);
CREATE INDEX IF NOT EXISTS idx_user_commerce_history_user_id ON user_commerce_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_commerce_history_plugin_type ON user_commerce_history(plugin_type);
CREATE INDEX IF NOT EXISTS idx_commerce_subscriptions_user_id ON commerce_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_watchlists_entity_name ON compliance_watchlists(entity_name);
CREATE INDEX IF NOT EXISTS idx_freight_rates_countries ON freight_rates(origin_country, destination_country);
CREATE INDEX IF NOT EXISTS idx_freight_rates_mode ON freight_rates(mode);

-- Enable Row Level Security
ALTER TABLE global_commerce_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hs_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fta_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_commerce_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE freight_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Global Commerce Settings (admin only)
CREATE POLICY "Admins can manage global commerce settings" 
ON global_commerce_settings FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Tariff Rates (read-only for all authenticated users, admin for write)
CREATE POLICY "Authenticated users can view tariff rates" 
ON tariff_rates FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admins can manage tariff rates" 
ON tariff_rates FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- HS Codes (read-only for all authenticated users, admin for write)
CREATE POLICY "Authenticated users can view HS codes" 
ON hs_codes FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admins can manage HS codes" 
ON hs_codes FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- FTA Agreements (read-only for all authenticated users, admin for write)
CREATE POLICY "Authenticated users can view FTA agreements" 
ON fta_agreements FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admins can manage FTA agreements" 
ON fta_agreements FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Shipping Rates (read-only for all authenticated users, admin for write)
CREATE POLICY "Authenticated users can view shipping rates" 
ON shipping_rates FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admins can manage shipping rates" 
ON shipping_rates FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- User Commerce History (users can only see their own history)
CREATE POLICY "Users can view their own commerce history" 
ON user_commerce_history FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own commerce history" 
ON user_commerce_history FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Commerce Subscriptions (users can view their own, admins can manage all)
CREATE POLICY "Users can view their own commerce subscriptions" 
ON commerce_subscriptions FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all commerce subscriptions" 
ON commerce_subscriptions FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Compliance Watchlists (read-only for all authenticated users, admin for write)
CREATE POLICY "Authenticated users can view compliance watchlists" 
ON compliance_watchlists FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admins can manage compliance watchlists" 
ON compliance_watchlists FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Freight Rates (read-only for all authenticated users, admin for write)
CREATE POLICY "Authenticated users can view freight rates" 
ON freight_rates FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admins can manage freight rates" 
ON freight_rates FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_global_commerce_settings_updated_at
BEFORE UPDATE ON global_commerce_settings
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_tariff_rates_updated_at
BEFORE UPDATE ON tariff_rates
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_hs_codes_updated_at
BEFORE UPDATE ON hs_codes
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_fta_agreements_updated_at
BEFORE UPDATE ON fta_agreements
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_shipping_rates_updated_at
BEFORE UPDATE ON shipping_rates
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_commerce_subscriptions_updated_at
BEFORE UPDATE ON commerce_subscriptions
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_compliance_watchlists_updated_at
BEFORE UPDATE ON compliance_watchlists
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_freight_rates_updated_at
BEFORE UPDATE ON freight_rates
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert sample data

-- Sample HS Codes
INSERT INTO hs_codes (code, description, category, chapter) VALUES
('8471.30', 'Portable automatic data processing machines, weighing not more than 10 kg', 'Electronics', '84'),
('8517.12', 'Telephones for cellular networks or for other wireless networks', 'Electronics', '85'),
('6204.62', 'Women''s or girls'' trousers, bib and brace overalls, breeches and shorts of cotton', 'Apparel', '62'),
('8708.99', 'Other parts and accessories for motor vehicles', 'Automotive', '87'),
('9503.00', 'Tricycles, scooters, pedal cars and similar wheeled toys', 'Toys', '95')
ON CONFLICT (code) DO NOTHING;

-- Sample Tariff Rates
INSERT INTO tariff_rates (origin_country, destination_country, hs_code, duty_rate, vat_rate, notes) VALUES
('US', 'EU', '8471.30', 0.0, 20.0, 'Duty-free under Information Technology Agreement'),
('CN', 'US', '8517.12', 25.0, 0.0, 'Subject to Section 301 tariffs'),
('EU', 'US', '6204.62', 16.6, 0.0, 'Standard MFN rate applies'),
('JP', 'EU', '8708.99', 4.5, 20.0, 'Reduced rate under EU-Japan EPA'),
('US', 'CA', '9503.00', 0.0, 5.0, 'Duty-free under USMCA')
ON CONFLICT DO NOTHING;

-- Sample FTA Agreements
INSERT INTO fta_agreements (name, countries, effective_date, details) VALUES
('USMCA', ARRAY['US', 'CA', 'MX'], '2020-07-01', '{"successor_to": "NAFTA", "key_provisions": ["Digital Trade", "Labor Standards", "Environmental Standards"]}'),
('EU-Japan EPA', ARRAY['EU', 'JP'], '2019-02-01', '{"eliminates_duties_on": ["Agricultural Products", "Industrial Products"], "includes": ["Services", "Investment"]}'),
('CPTPP', ARRAY['CA', 'MX', 'JP', 'AU', 'NZ', 'SG', 'VN', 'MY', 'BN', 'CL', 'PE'], '2018-12-30', '{"formerly": "TPP", "key_provisions": ["Tariff Reduction", "Digital Trade", "IP Protection"]}')
ON CONFLICT DO NOTHING;

-- Sample Shipping Rates
INSERT INTO shipping_rates (origin_country, destination_country, mode, base_rate, additional_fees, transit_time_days) VALUES
('CN', 'US', 'ocean', 1200.00, '{"fuel_surcharge": 150, "documentation": 75, "handling": 100}', 18),
('US', 'EU', 'air', 850.00, '{"fuel_surcharge": 200, "security": 50, "handling": 150}', 5),
('US', 'CA', 'truck', 450.00, '{"fuel_surcharge": 75, "handling": 50}', 3),
('EU', 'US', 'ocean', 1350.00, '{"fuel_surcharge": 180, "documentation": 85, "handling": 120}', 14)
ON CONFLICT DO NOTHING;

-- Sample Freight Rates
INSERT INTO freight_rates (origin_country, destination_country, mode, base_rate, additional_fees, transit_time_days) VALUES
('CN', 'US', 'ocean', 1200.00, '{"fuel_surcharge": 150, "documentation": 75, "handling": 100}', 18),
('US', 'EU', 'air', 850.00, '{"fuel_surcharge": 200, "security": 50, "handling": 150}', 5),
('US', 'CA', 'truck', 450.00, '{"fuel_surcharge": 75, "handling": 50}', 3),
('EU', 'US', 'ocean', 1350.00, '{"fuel_surcharge": 180, "documentation": 85, "handling": 120}', 14)
ON CONFLICT DO NOTHING;

-- Sample Compliance Watchlists
INSERT INTO compliance_watchlists (entity_name, entity_type, list_name, list_entry_date, details) VALUES
('Restricted Company Ltd', 'company', 'OFAC SDN', '2023-05-15', '{"reason": "Sanctions evasion", "program": "UKRAINE-EO13662"}'),
('Global Trading Corp', 'company', 'BIS Entity List', '2023-03-22', '{"reason": "Military end-use concerns", "federal_register": "88 FR 12345"}'),
('Shipping Vessel Alpha', 'vessel', 'OFAC SSI', '2023-01-10', '{"reason": "Sanctions evasion", "IMO": "1234567"}')
ON CONFLICT DO NOTHING;

-- Sample Global Commerce Settings
INSERT INTO global_commerce_settings (setting_key, setting_value) VALUES
('default_subscription_level', '{"level": "starter", "features": ["hs_finder", "tariff"]}'),
('pro_subscription_features', '{"features": ["hs_finder", "tariff", "landed_cost", "compliance", "freight", "fta"]}'),
('enterprise_subscription_features', '{"features": ["hs_finder", "tariff", "landed_cost", "compliance", "freight", "fta", "tracker"]}'),
('api_endpoints', '{"tariff": "/api/tariff", "hs_finder": "/api/hs-finder", "compliance": "/api/compliance"}')
ON CONFLICT (setting_key) DO NOTHING;
/*
  # Lead Service Functionality

  1. New Tables
    - `lead_services` - Stores available lead generation services
    - `client_lead_services` - Tracks which clients have subscribed to which lead services
    - `lead_sources` - Tracks different sources of leads
    - `subscription_plans` - Stores available subscription plans
    - `promotions` - Stores promotional offers
    - `user_roles` - Defines admin user roles and permissions

  2. Security
    - Enable RLS on all new tables
    - Add policies for admin access
    - Add policies for client access

  3. Changes
    - Add new fields to existing tables
    - Create indexes for performance
*/

-- Create lead_services table
CREATE TABLE IF NOT EXISTS lead_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create client_lead_services table
CREATE TABLE IF NOT EXISTS client_lead_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_service_id UUID NOT NULL REFERENCES lead_services(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  price_override NUMERIC(10,2),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create lead_sources table
CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('monthly', 'quarterly', 'annual')),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  trial_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value NUMERIC(10,2) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  applies_to JSONB DEFAULT '{"plans": [], "services": []}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE RESTRICT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Add lead_source_id to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_source_id UUID REFERENCES lead_sources(id);

-- Add subscription_plan_id to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS subscription_plan_id UUID REFERENCES subscription_plans(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_lead_services_client_id ON client_lead_services(client_id);
CREATE INDEX IF NOT EXISTS idx_client_lead_services_lead_service_id ON client_lead_services(lead_service_id);
CREATE INDEX IF NOT EXISTS idx_leads_lead_source_id ON leads(lead_source_id);
CREATE INDEX IF NOT EXISTS idx_clients_subscription_plan_id ON clients(subscription_plan_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role_id ON admin_users(role_id);

-- Enable Row Level Security
ALTER TABLE lead_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_lead_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lead_services
CREATE POLICY "Admins can manage lead services" ON lead_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Agency users can view lead services" ON lead_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager', 'specialist')
    )
  );

-- Create RLS policies for client_lead_services
CREATE POLICY "Admins can manage client lead services" ON client_lead_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Agency users can view client lead services" ON client_lead_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager', 'specialist')
    )
  );

CREATE POLICY "Clients can view their own lead services" ON client_lead_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_lead_services.client_id
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'client'
      )
    )
  );

-- Create RLS policies for lead_sources
CREATE POLICY "Admins can manage lead sources" ON lead_sources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Agency users can view lead sources" ON lead_sources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager', 'specialist')
    )
  );

-- Create RLS policies for subscription_plans
CREATE POLICY "Admins can manage subscription plans" ON subscription_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "All users can view active subscription plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Create RLS policies for promotions
CREATE POLICY "Admins can manage promotions" ON promotions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "All users can view active promotions" ON promotions
  FOR SELECT USING (
    is_active = true AND 
    (end_date IS NULL OR end_date > now()) AND
    (max_uses IS NULL OR current_uses < max_uses)
  );

-- Create RLS policies for admin_roles
CREATE POLICY "Admins can manage admin roles" ON admin_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for admin_users
CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER handle_lead_services_updated_at BEFORE UPDATE ON lead_services
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_client_lead_services_updated_at BEFORE UPDATE ON client_lead_services
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_lead_sources_updated_at BEFORE UPDATE ON lead_sources
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_admin_roles_updated_at BEFORE UPDATE ON admin_roles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert sample data for lead services
INSERT INTO lead_services (name, description, price, features) VALUES
('Basic Lead Generation', 'Entry-level lead generation service', 299.00, '["Email campaigns", "Social media outreach", "Basic lead scoring"]'),
('Premium Lead Generation', 'Advanced lead generation with multi-channel approach', 599.00, '["Email campaigns", "Social media outreach", "Advanced lead scoring", "Retargeting campaigns", "Lead nurturing workflows"]'),
('Enterprise Lead Generation', 'Comprehensive lead generation solution for large businesses', 999.00, '["Email campaigns", "Social media outreach", "Advanced lead scoring", "Retargeting campaigns", "Lead nurturing workflows", "Custom reporting", "Dedicated account manager"]');

-- Insert sample data for lead sources
INSERT INTO lead_sources (name, description) VALUES
('Website Form', 'Leads captured through website contact forms'),
('Social Media', 'Leads generated from social media campaigns'),
('Email Marketing', 'Leads from email marketing campaigns'),
('Referral', 'Leads referred by existing clients'),
('Trade Show', 'Leads collected at trade shows and events');

-- Insert sample data for subscription plans
INSERT INTO subscription_plans (name, description, price, billing_interval, features) VALUES
('Starter', 'Basic plan for small businesses', 99.00, 'monthly', '["Up to 3 clients", "Basic CRM functionality", "Limited SEO tools", "Email support"]'),
('Professional', 'Comprehensive plan for growing agencies', 299.00, 'monthly', '["Up to 15 clients", "Full CRM functionality", "Complete SEO toolkit", "Email marketing", "Affiliate tracking", "Priority support", "White label options"]'),
('Enterprise', 'Advanced plan for established agencies', 599.00, 'monthly', '["Unlimited clients", "Enterprise CRM", "Advanced SEO tools", "Email automation", "Full affiliate system", "Dedicated account manager", "Custom integrations", "Full white label"]');

-- Insert sample data for promotions
INSERT INTO promotions (code, description, discount_type, discount_value, start_date, end_date, max_uses, applies_to) VALUES
('WELCOME25', 'Welcome discount for new users', 'percentage', 25.00, '2024-01-01', '2024-12-31', 100, '{"plans": ["*"], "services": ["*"]}'),
('SUMMER2024', 'Summer promotion', 'percentage', 15.00, '2024-06-01', '2024-08-31', 50, '{"plans": ["*"], "services": ["*"]}'),
('ENTERPRISE50', 'Enterprise plan discount', 'fixed_amount', 50.00, '2024-01-01', '2024-12-31', NULL, '{"plans": ["Enterprise"], "services": []}');

-- Insert sample data for admin roles
INSERT INTO admin_roles (name, description, permissions) VALUES
('Super Admin', 'Full system access with all permissions', '{"users": {"create": true, "read": true, "update": true, "delete": true}, "billing": {"create": true, "read": true, "update": true, "delete": true}, "settings": {"create": true, "read": true, "update": true, "delete": true}}'),
('Billing Admin', 'Access to billing and subscription management', '{"users": {"create": false, "read": true, "update": false, "delete": false}, "billing": {"create": true, "read": true, "update": true, "delete": true}, "settings": {"create": false, "read": true, "update": false, "delete": false}}'),
('User Admin', 'Access to user management', '{"users": {"create": true, "read": true, "update": true, "delete": true}, "billing": {"create": false, "read": true, "update": false, "delete": false}, "settings": {"create": false, "read": true, "update": false, "delete": false}}');
/*
  # Lead Service Functionality

  1. New Tables
    - `lead_services` - Available lead generation services
    - `client_lead_services` - Client subscriptions to lead services
    - `lead_sources` - Sources of leads (for tracking)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    
  3. Sample Data
    - Add sample lead services
    - Add sample client subscriptions
*/

-- Create lead_services table
CREATE TABLE IF NOT EXISTS lead_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create client_lead_services table
CREATE TABLE IF NOT EXISTS client_lead_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_service_id uuid NOT NULL REFERENCES lead_services(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  price_override numeric(10,2),
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_sources table
CREATE TABLE IF NOT EXISTS lead_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add lead_source_id to leads table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'lead_source_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN lead_source_id uuid REFERENCES lead_sources(id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lead_services_is_active ON lead_services(is_active);
CREATE INDEX IF NOT EXISTS idx_client_lead_services_client_id ON client_lead_services(client_id);
CREATE INDEX IF NOT EXISTS idx_client_lead_services_lead_service_id ON client_lead_services(lead_service_id);
CREATE INDEX IF NOT EXISTS idx_leads_lead_source_id ON leads(lead_source_id);

-- Enable Row Level Security
ALTER TABLE lead_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_lead_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Admins can manage lead services
CREATE POLICY "Admins can manage lead services" ON lead_services
  FOR ALL
  TO public
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Agency users can view lead services
CREATE POLICY "Agency users can view lead services" ON lead_services
  FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager', 'specialist')
  ));

-- Admins can manage client lead services
CREATE POLICY "Admins can manage client lead services" ON client_lead_services
  FOR ALL
  TO public
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Agency users can view client lead services
CREATE POLICY "Agency users can view client lead services" ON client_lead_services
  FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager', 'specialist')
  ));

-- Clients can view their own lead services
CREATE POLICY "Clients can view their own lead services" ON client_lead_services
  FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_lead_services.client_id AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'client'
    )
  ));

-- Admins can manage lead sources
CREATE POLICY "Admins can manage lead sources" ON lead_sources
  FOR ALL
  TO public
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Agency users can view lead sources
CREATE POLICY "Agency users can view lead sources" ON lead_sources
  FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'manager', 'specialist')
  ));

-- Create update triggers
CREATE TRIGGER handle_lead_services_updated_at
  BEFORE UPDATE ON lead_services
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_client_lead_services_updated_at
  BEFORE UPDATE ON client_lead_services
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_lead_sources_updated_at
  BEFORE UPDATE ON lead_sources
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert sample data
INSERT INTO lead_services (name, description, price, features) VALUES
('Basic Lead Generation', 'Entry-level lead generation service with basic targeting', 199.99, '["Basic targeting", "Up to 50 leads/month", "Email delivery", "Basic reporting"]'),
('Premium Lead Generation', 'Advanced lead generation with detailed targeting options', 499.99, '["Advanced targeting", "Up to 200 leads/month", "Email & SMS delivery", "Advanced reporting", "Lead scoring"]'),
('Enterprise Lead Generation', 'Custom lead generation solution for large businesses', 999.99, '["Custom targeting", "Unlimited leads", "Multi-channel delivery", "Custom reporting", "Lead scoring", "CRM integration"]');

INSERT INTO lead_sources (name, description) VALUES
('Website Form', 'Leads captured from website contact forms'),
('Landing Page', 'Leads from dedicated landing pages'),
('Social Media', 'Leads generated through social media campaigns'),
('Paid Advertising', 'Leads from Google Ads, Facebook Ads, etc.'),
('Referral', 'Leads referred by existing clients or partners');

-- Add sample client subscriptions
INSERT INTO client_lead_services (client_id, lead_service_id, status)
SELECT 
  c.id,
  (SELECT id FROM lead_services WHERE name = 'Premium Lead Generation' LIMIT 1),
  'active'
FROM clients c
LIMIT 2;
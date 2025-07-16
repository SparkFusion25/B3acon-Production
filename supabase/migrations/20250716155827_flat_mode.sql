/*
  # Admin Settings for Global Commerce

  1. New Tables
    - `admin_settings` - Global settings for admin panel including landing page content
  
  2. Security
    - Enable RLS on all tables
    - Add admin-only policies
*/

-- Create admin settings table for landing page content and other global settings
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add landing page settings
INSERT INTO admin_settings (key, value, description, is_public)
VALUES 
  (
    'landing_page', 
    '{
      "headlines": [
        "AI-Powered SEO & Marketing",
        "Global Trade Intelligence",
        "Shipment Tracking & Freight Tools",
        "CRM + Outreach Tools",
        "Integrated Analytics & Dashboard"
      ],
      "main_headline": "The Ultimate Marketing Command Center",
      "background_image": "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "cta_primary": "Start Free 14-Day Trial",
      "cta_secondary": "See Plans",
      "cta_tertiary": "Book Demo"
    }',
    'Landing page content and settings',
    true
  ),
  (
    'global_commerce_settings',
    '{
      "api_keys": {
        "aftership": "",
        "freightos": "",
        "avalara": ""
      },
      "plugin_access": {
        "tariff_calculator": "starter",
        "landed_cost": "pro",
        "compliance_checker": "pro",
        "freight_estimator": "pro",
        "shipment_tracker": "enterprise",
        "hs_code_finder": "starter",
        "fta_checker": "pro"
      }
    }',
    'Global commerce settings including API keys and plugin access levels',
    false
  );

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin users can manage admin settings" 
  ON admin_settings 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public users can view public settings" 
  ON admin_settings 
  FOR SELECT 
  TO anon, authenticated 
  USING (is_public = true);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON admin_settings
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Add commerce_subscription entries for existing users
INSERT INTO commerce_subscriptions (user_id, subscription_level, is_active, features)
SELECT 
  profiles.id,
  CASE 
    WHEN profiles.role = 'admin' THEN 'enterprise'
    WHEN profiles.role = 'manager' THEN 'pro'
    WHEN profiles.role = 'specialist' THEN 'pro'
    ELSE 'starter'
  END as subscription_level,
  true as is_active,
  CASE 
    WHEN profiles.role = 'admin' THEN '["tariff_calculator", "landed_cost", "compliance_checker", "freight_estimator", "shipment_tracker", "hs_code_finder", "fta_checker"]'::jsonb
    WHEN profiles.role IN ('manager', 'specialist') THEN '["tariff_calculator", "landed_cost", "compliance_checker", "freight_estimator", "hs_code_finder", "fta_checker"]'::jsonb
    ELSE '["tariff_calculator", "hs_code_finder"]'::jsonb
  END as features
FROM profiles
ON CONFLICT (user_id) DO NOTHING;
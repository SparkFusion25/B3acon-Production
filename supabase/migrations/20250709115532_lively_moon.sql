/*
  # API Keys Management System

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Human readable name for the API key
      - `service` (text, not null) - Service identifier (google_analytics, klaviyo, etc.)
      - `key` (text, not null) - The actual API key
      - `secret` (text, nullable) - Secret key if required by the service
      - `is_active` (boolean, default true) - Whether the key is currently active
      - `expires_at` (timestamptz, nullable) - When the key expires
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `created_by` (uuid, references users.id) - Who created this key

  2. Security
    - Enable RLS on `api_keys` table
    - Add policies for admin and agency user access
    - Create performance indexes

  3. Sample Data
    - Insert sample API keys for common services
*/

-- Create API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  key TEXT NOT NULL,
  secret TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage API keys" ON api_keys;
DROP POLICY IF EXISTS "Agency users can manage API keys" ON api_keys;
DROP POLICY IF EXISTS "Agency users can view API keys" ON api_keys;

-- Create RLS policies
CREATE POLICY "Admins can manage API keys" ON api_keys FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Agency users can manage API keys" ON api_keys FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Agency users can view API keys" ON api_keys FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS handle_api_keys_updated_at ON api_keys;
CREATE TRIGGER handle_api_keys_updated_at 
  BEFORE UPDATE ON api_keys 
  FOR EACH ROW 
  EXECUTE FUNCTION handle_updated_at();

-- Insert sample API keys (only if they don't already exist)
INSERT INTO api_keys (name, service, key, secret, is_active) 
SELECT * FROM (VALUES
  ('Google Analytics', 'google_analytics', 'GA-SAMPLE-KEY-123', NULL, true),
  ('Google Ads', 'google_ads', 'GADS-SAMPLE-KEY-456', 'GADS-SECRET-789', true),
  ('Facebook Ads', 'facebook_ads', 'FB-SAMPLE-KEY-789', 'FB-SECRET-012', true),
  ('Klaviyo', 'klaviyo', 'KLAV-SAMPLE-KEY-345', NULL, true),
  ('Mailchimp', 'mailchimp', 'MC-SAMPLE-KEY-678', NULL, false)
) AS v(name, service, key, secret, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM api_keys WHERE service = v.service
);
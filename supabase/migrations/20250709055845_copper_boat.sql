/*
  # API Keys Management Table

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `name` (text, display name for the API key)
      - `service` (text, service identifier)
      - `key` (text, API key value)
      - `secret` (text, optional secret/token)
      - `is_active` (boolean, whether key is active)
      - `expires_at` (timestamp, optional expiration)
      - `created_by` (uuid, user who created the key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policies for admin and manager access
    - Add policy for specialist read access

  3. Performance
    - Add indexes on service and is_active columns
    - Add updated_at trigger

  4. Sample Data
    - Insert sample API keys for common services
*/

-- Create API Keys table if it doesn't exist
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
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Admins can manage API keys" ON api_keys;
  DROP POLICY IF EXISTS "Agency users can manage API keys" ON api_keys;
  DROP POLICY IF EXISTS "Agency users can view API keys" ON api_keys;
EXCEPTION
  WHEN undefined_object THEN
    -- Policy doesn't exist, continue
    NULL;
END $$;

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

-- Create updated_at trigger if it doesn't exist
DO $$
BEGIN
  -- Drop trigger if it exists
  DROP TRIGGER IF EXISTS handle_api_keys_updated_at ON api_keys;
  
  -- Create the trigger
  CREATE TRIGGER handle_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW 
    EXECUTE FUNCTION handle_updated_at();
EXCEPTION
  WHEN undefined_function THEN
    -- Function doesn't exist, skip trigger creation
    RAISE NOTICE 'handle_updated_at function not found, skipping trigger creation';
END $$;

-- Insert sample API keys only if they don't already exist
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
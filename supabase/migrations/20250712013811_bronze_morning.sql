/*
  # Creative Assets Management

  1. New Tables
    - `creative_assets` - Stores metadata for uploaded creative assets
    - `asset_tags` - Stores tags for assets
  
  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create creative_assets table
CREATE TABLE IF NOT EXISTS creative_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT,
  public_url TEXT,
  mime_type TEXT,
  dimensions JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES profiles(id),
  client_id UUID REFERENCES clients(id),
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create asset_tags table
CREATE TABLE IF NOT EXISTS asset_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES creative_assets(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create asset_shares table
CREATE TABLE IF NOT EXISTS asset_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES creative_assets(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE creative_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_shares ENABLE ROW LEVEL SECURITY;

-- Create update triggers
CREATE TRIGGER update_creative_assets_updated_at
BEFORE UPDATE ON creative_assets
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create policies
CREATE POLICY "Authenticated users can view creative assets"
ON creative_assets
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage their own creative assets"
ON creative_assets
FOR ALL
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can view asset tags"
ON asset_tags
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage their own asset tags"
ON asset_tags
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM creative_assets
    WHERE creative_assets.id = asset_tags.asset_id
    AND creative_assets.created_by = auth.uid()
  )
);

CREATE POLICY "Authenticated users can view asset shares"
ON asset_shares
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage their own asset shares"
ON asset_shares
FOR ALL
TO authenticated
USING (auth.uid() = created_by);

-- Create indexes
CREATE INDEX idx_creative_assets_created_by ON creative_assets(created_by);
CREATE INDEX idx_creative_assets_client_id ON creative_assets(client_id);
CREATE INDEX idx_creative_assets_file_type ON creative_assets(file_type);
CREATE INDEX idx_asset_tags_asset_id ON asset_tags(asset_id);
CREATE INDEX idx_asset_tags_tag ON asset_tags(tag);
CREATE INDEX idx_asset_shares_asset_id ON asset_shares(asset_id);
CREATE INDEX idx_asset_shares_share_token ON asset_shares(share_token);
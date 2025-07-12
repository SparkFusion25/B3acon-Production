/*
  # White Label Settings

  1. New Tables
    - `white_label_settings` - Stores global white label configuration
    - `white_label_themes` - Stores theme templates for white label partners
  
  2. Security
    - Enable RLS on new tables
    - Add policies for admin access
*/

-- Create white_label_settings table
CREATE TABLE IF NOT EXISTS white_label_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create white_label_themes table
CREATE TABLE IF NOT EXISTS white_label_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  primary_color TEXT DEFAULT '#3478F6',
  secondary_color TEXT DEFAULT '#FF6B35',
  font_family TEXT DEFAULT 'Inter',
  custom_css TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE white_label_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_themes ENABLE ROW LEVEL SECURITY;

-- Create update triggers
CREATE TRIGGER update_white_label_settings_updated_at
BEFORE UPDATE ON white_label_settings
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_white_label_themes_updated_at
BEFORE UPDATE ON white_label_themes
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create policies
CREATE POLICY "Admins can manage white label settings"
ON white_label_settings
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can manage white label themes"
ON white_label_themes
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Insert default settings
INSERT INTO white_label_settings (
  setting_key,
  setting_value,
  is_active
) VALUES (
  'global_config',
  '{
    "enable_custom_branding": true,
    "enable_custom_domain": true,
    "enable_white_label_emails": true,
    "enable_custom_reports": true,
    "default_commission_rate": 20,
    "auto_approve_partners": false,
    "default_plan": "professional"
  }'::jsonb,
  true
);

-- Insert default theme
INSERT INTO white_label_themes (
  name,
  description,
  primary_color,
  secondary_color,
  font_family,
  custom_css,
  is_default
) VALUES (
  'B3ACON Default',
  'Default theme for B3ACON white label partners',
  '#3478F6',
  '#FF6B35',
  'Inter',
  '/* Default B3ACON theme CSS */',
  true
);
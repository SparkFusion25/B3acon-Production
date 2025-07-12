/*
  # Settings Theme Color

  1. New Tables
    - `white_label_themes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `primary_color` (text)
      - `secondary_color` (text)
      - `font_family` (text)
      - `custom_css` (text)
      - `is_default` (boolean)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `white_label_themes` table
    - Add policy for admins to manage themes
    - Add policy for all users to view themes
*/

-- Create white_label_themes table if it doesn't exist
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
ALTER TABLE white_label_themes ENABLE ROW LEVEL SECURITY;

-- Create update trigger
CREATE TRIGGER update_white_label_themes_updated_at
BEFORE UPDATE ON white_label_themes
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create policies
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

CREATE POLICY "All users can view white label themes"
ON white_label_themes
FOR SELECT
TO public
USING (true);

-- Insert default themes
INSERT INTO white_label_themes (
  name,
  description,
  primary_color,
  secondary_color,
  font_family,
  is_default
) VALUES (
  'B3ACON Default',
  'Default B3ACON theme with blue and orange gradient',
  '#3478F6',
  '#FF6B35',
  'Inter',
  true
), (
  'Dark Mode',
  'Dark theme with purple accents',
  '#8B5CF6',
  '#EC4899',
  'Inter',
  false
), (
  'Green Business',
  'Professional theme with green accents',
  '#10B981',
  '#059669',
  'Montserrat',
  false
), (
  'Modern Red',
  'Bold theme with red accents',
  '#EF4444',
  '#B91C1C',
  'Poppins',
  false
);
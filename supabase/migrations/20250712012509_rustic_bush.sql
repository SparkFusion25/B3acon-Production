/*
  # Create SEO analysis table

  1. New Tables
    - `seo_analysis` - Stores SEO analysis results for domains
  2. Security
    - Enable RLS on `seo_analysis` table
    - Add policy for authenticated users to manage SEO analysis data
*/

-- Create SEO analysis table
CREATE TABLE IF NOT EXISTS seo_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  results JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on domain for faster lookups
CREATE INDEX IF NOT EXISTS idx_seo_analysis_domain ON seo_analysis(domain);

-- Enable RLS
ALTER TABLE seo_analysis ENABLE ROW LEVEL SECURITY;

-- Create update trigger
CREATE TRIGGER update_seo_analysis_updated_at
BEFORE UPDATE ON seo_analysis
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create policies
CREATE POLICY "Authenticated users can manage SEO analysis data"
ON seo_analysis
FOR ALL
TO authenticated
USING (true);
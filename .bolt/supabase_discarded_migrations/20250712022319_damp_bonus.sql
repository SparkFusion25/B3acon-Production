/*
  # Analytics System

  1. New Tables
    - `performance_metrics` - Stores performance metrics for clients
    - `seo_analysis` - Stores SEO analysis results for domains
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Performance Metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT,
  campaign_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SEO Analysis table
CREATE TABLE IF NOT EXISTS seo_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  results JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_analysis ENABLE ROW LEVEL SECURITY;

-- Create triggers for updated_at
CREATE TRIGGER update_performance_metrics_updated_at
BEFORE UPDATE ON performance_metrics
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_seo_analysis_updated_at
BEFORE UPDATE ON seo_analysis
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_client_id ON performance_metrics(client_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_date ON performance_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_seo_analysis_domain ON seo_analysis(domain);

-- Create RLS policies
-- Authenticated users can manage performance metrics
CREATE POLICY "Authenticated users can manage performance metrics"
ON performance_metrics FOR ALL
TO authenticated
USING (true);

-- Authenticated users can manage SEO analysis data
CREATE POLICY "Authenticated users can manage SEO analysis data"
ON seo_analysis FOR ALL
TO authenticated
USING (true);
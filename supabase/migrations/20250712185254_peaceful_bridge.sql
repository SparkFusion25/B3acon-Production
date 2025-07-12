/*
  # Create Required Tables for B3ACON

  1. New Tables
    - `affiliates` - For affiliate marketing partners
    - `email_campaigns` - For email marketing campaigns
    - `landing_pages` - For landing page builder
    - `leads` - For CRM functionality
    - `deals` - For sales pipeline
    - `activities` - For tracking user activities
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE lead_status AS ENUM ('new', 'qualified', 'contacted', 'nurturing', 'converted', 'lost');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deal_stage') THEN
    CREATE TYPE deal_stage AS ENUM ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
    CREATE TYPE activity_type AS ENUM ('call', 'email', 'meeting', 'note', 'task');
  END IF;
END
$$;

-- Create affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'pending',
  tier TEXT DEFAULT 'bronze',
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  total_referrals INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  payment_method TEXT DEFAULT 'paypal',
  payment_details JSONB DEFAULT '{}',
  referral_code TEXT UNIQUE NOT NULL,
  joined_date TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  content TEXT NOT NULL,
  template_id UUID,
  status TEXT DEFAULT 'draft',
  campaign_type TEXT DEFAULT 'newsletter',
  client_id UUID,
  list_ids JSONB DEFAULT '[]',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  stats JSONB DEFAULT '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "bounced": 0, "unsubscribed": 0, "spam_complaints": 0, "open_rate": 0, "click_rate": 0, "bounce_rate": 0, "unsubscribe_rate": 0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create landing_pages table
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  status TEXT DEFAULT 'draft',
  template_id UUID,
  client_id UUID,
  content JSONB DEFAULT '{"sections": [], "global_styles": {}, "custom_css": "", "custom_js": ""}',
  seo JSONB DEFAULT '{"meta_title": "", "meta_description": "", "meta_keywords": [], "og_title": "", "og_description": "", "og_image": "", "canonical_url": "", "robots": "index,follow", "schema_markup": {}}',
  settings JSONB DEFAULT '{"favicon": "", "google_analytics_id": "", "facebook_pixel_id": "", "custom_tracking_codes": [], "password_protection": {"enabled": false, "password": ""}, "redirect_after_conversion": "", "thank_you_page": ""}',
  analytics JSONB DEFAULT '{"total_views": 0, "unique_visitors": 0, "conversions": 0, "conversion_rate": 0, "bounce_rate": 0, "avg_time_on_page": 0, "traffic_sources": [], "device_breakdown": {"desktop": 0, "mobile": 0, "tablet": 0}, "geographic_data": []}',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID,
  assigned_to UUID,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status lead_status DEFAULT 'new',
  source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  stage deal_stage DEFAULT 'prospecting',
  value NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type activity_type NOT NULL,
  lead_id UUID,
  created_by UUID,
  assigned_to UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create seo_analysis table
CREATE TABLE IF NOT EXISTS seo_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can manage affiliates" ON affiliates
  FOR ALL TO public
  USING (role() = 'authenticated');

CREATE POLICY "Authenticated users can manage email campaigns" ON email_campaigns
  FOR ALL TO public
  USING (role() = 'authenticated');

CREATE POLICY "Authenticated users can manage landing pages" ON landing_pages
  FOR ALL TO public
  USING (role() = 'authenticated');

CREATE POLICY "Authenticated users can manage leads" ON leads
  FOR ALL TO public
  USING (role() = 'authenticated');

CREATE POLICY "Authenticated users can manage deals" ON deals
  FOR ALL TO public
  USING (role() = 'authenticated');

CREATE POLICY "Authenticated users can manage activities" ON activities
  FOR ALL TO public
  USING (role() = 'authenticated');

CREATE POLICY "Authenticated users can manage SEO analysis" ON seo_analysis
  FOR ALL TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_tier ON affiliates(tier);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON landing_pages(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_client_id ON deals(client_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_seo_analysis_domain ON seo_analysis(domain);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_timestamp_affiliates
BEFORE UPDATE ON affiliates
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp_email_campaigns
BEFORE UPDATE ON email_campaigns
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp_landing_pages
BEFORE UPDATE ON landing_pages
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp_leads
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp_deals
BEFORE UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_seo_analysis_updated_at
BEFORE UPDATE ON seo_analysis
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Insert sample data
INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code)
VALUES 
('Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 'SARAH2024'),
('Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 'MIKE2024'),
('Emily Rodriguez', 'emily@growthagency.com', 'Growth Agency', 'pending', 'bronze', 10.00, 'EMILY2024');

INSERT INTO email_campaigns (name, subject, content, status, campaign_type, stats)
VALUES 
('January Newsletter', 'New Year, New Marketing Strategies', '<h1>Welcome to 2024!</h1><p>Here are our top marketing strategies for the new year...</p>', 'sent', 'newsletter', '{"total_sent": 2500, "delivered": 2450, "opened": 1225, "clicked": 245, "open_rate": 50.0, "click_rate": 10.0}'),
('Product Launch', 'Introducing Our Revolutionary New Service', '<h1>Big News!</h1><p>We are excited to announce our latest service offering...</p>', 'scheduled', 'promotional', '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "open_rate": 0, "click_rate": 0}');

INSERT INTO landing_pages (name, title, slug, status, description)
VALUES 
('SaaS Product Launch', 'Revolutionary Project Management Tool', 'saas-launch', 'published', 'Perfect landing page for software launches'),
('E-commerce Store', 'Premium Fashion Collection', 'fashion-store', 'draft', 'Optimized for online retail'),
('Agency Services', 'Digital Marketing Excellence', 'agency-services', 'published', 'Showcase your agency capabilities');
/*
  # Create Required Tables for B3ACON with Existence Checks

  1. New Tables
    - `affiliates` - For affiliate marketing partners
    - `email_campaigns` - For email marketing campaigns
    - `landing_pages` - For landing page builder
    - `leads` - For CRM functionality
    - `deals` - For sales pipeline
    - `activities` - For tracking user activities
    - `seo_analysis` - For storing SEO analysis results
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users with existence checks
  
  3. Sample Data
    - Add sample affiliates, email campaigns, and landing pages
*/

-- Create function to handle updated_at timestamps if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at'
  ) THEN
    CREATE FUNCTION handle_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END
$$;

-- Create Affiliates table if it doesn't exist
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended', 'inactive')),
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  total_referrals INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  payment_method TEXT DEFAULT 'paypal' CHECK (payment_method IN ('paypal', 'bank_transfer', 'check')),
  payment_details JSONB DEFAULT '{}',
  referral_code TEXT UNIQUE NOT NULL,
  joined_date TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Email Campaigns table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  content TEXT NOT NULL,
  template_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused')),
  campaign_type TEXT DEFAULT 'newsletter' CHECK (campaign_type IN ('newsletter', 'promotional', 'automated', 'transactional')),
  client_id UUID,
  list_ids JSONB DEFAULT '[]',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  stats JSONB DEFAULT '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "bounced": 0, "unsubscribed": 0, "spam_complaints": 0, "open_rate": 0, "click_rate": 0, "bounce_rate": 0, "unsubscribe_rate": 0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Landing Pages table if it doesn't exist
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
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

-- Create Leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  website TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  estimated_value INTEGER DEFAULT 0,
  notes TEXT,
  tags JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '{}',
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Deals table if it doesn't exist
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  value INTEGER NOT NULL,
  stage TEXT DEFAULT 'prospecting',
  probability INTEGER DEFAULT 0,
  close_date DATE,
  description TEXT,
  lead_id UUID,
  client_id UUID,
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  lead_id UUID,
  deal_id UUID,
  client_id UUID,
  assigned_to UUID,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create SEO Analysis table if it doesn't exist
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

-- Create RLS Policies with existence checks
DO $$
BEGIN
  -- Affiliates policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'affiliates' AND policyname = 'Authenticated users can view affiliates'
  ) THEN
    CREATE POLICY "Authenticated users can view affiliates" 
      ON affiliates FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'affiliates' AND policyname = 'Authenticated users can manage affiliates'
  ) THEN
    CREATE POLICY "Authenticated users can manage affiliates" 
      ON affiliates FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Email campaigns policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'email_campaigns' AND policyname = 'Authenticated users can view email campaigns'
  ) THEN
    CREATE POLICY "Authenticated users can view email campaigns" 
      ON email_campaigns FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'email_campaigns' AND policyname = 'Authenticated users can manage email campaigns'
  ) THEN
    CREATE POLICY "Authenticated users can manage email campaigns" 
      ON email_campaigns FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Landing pages policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'landing_pages' AND policyname = 'Authenticated users can view landing pages'
  ) THEN
    CREATE POLICY "Authenticated users can view landing pages" 
      ON landing_pages FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'landing_pages' AND policyname = 'Authenticated users can manage landing pages'
  ) THEN
    CREATE POLICY "Authenticated users can manage landing pages" 
      ON landing_pages FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Leads policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Authenticated users can view leads'
  ) THEN
    CREATE POLICY "Authenticated users can view leads" 
      ON leads FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Authenticated users can manage leads'
  ) THEN
    CREATE POLICY "Authenticated users can manage leads" 
      ON leads FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Deals policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'deals' AND policyname = 'Authenticated users can view deals'
  ) THEN
    CREATE POLICY "Authenticated users can view deals" 
      ON deals FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'deals' AND policyname = 'Authenticated users can manage deals'
  ) THEN
    CREATE POLICY "Authenticated users can manage deals" 
      ON deals FOR ALL TO authenticated USING (true);
  END IF;
  
  -- Activities policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Authenticated users can view activities'
  ) THEN
    CREATE POLICY "Authenticated users can view activities" 
      ON activities FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Authenticated users can manage activities'
  ) THEN
    CREATE POLICY "Authenticated users can manage activities" 
      ON activities FOR ALL TO authenticated USING (true);
  END IF;
  
  -- SEO analysis policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'seo_analysis' AND policyname = 'Authenticated users can view SEO analysis'
  ) THEN
    CREATE POLICY "Authenticated users can view SEO analysis" 
      ON seo_analysis FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'seo_analysis' AND policyname = 'Authenticated users can manage SEO analysis'
  ) THEN
    CREATE POLICY "Authenticated users can manage SEO analysis" 
      ON seo_analysis FOR ALL TO authenticated USING (true);
  END IF;
END
$$;

-- Create Triggers for updated_at with existence checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_affiliates_updated_at'
  ) THEN
    CREATE TRIGGER handle_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_email_campaigns_updated_at'
  ) THEN
    CREATE TRIGGER handle_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_landing_pages_updated_at'
  ) THEN
    CREATE TRIGGER handle_landing_pages_updated_at BEFORE UPDATE ON landing_pages FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_leads_updated_at'
  ) THEN
    CREATE TRIGGER handle_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_deals_updated_at'
  ) THEN
    CREATE TRIGGER handle_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_activities_updated_at'
  ) THEN
    CREATE TRIGGER handle_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_seo_analysis_updated_at'
  ) THEN
    CREATE TRIGGER handle_seo_analysis_updated_at BEFORE UPDATE ON seo_analysis FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
END
$$;

-- Create Indexes with existence checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_affiliates_status'
  ) THEN
    CREATE INDEX idx_affiliates_status ON affiliates(status);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_affiliates_tier'
  ) THEN
    CREATE INDEX idx_affiliates_tier ON affiliates(tier);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_affiliates_referral_code'
  ) THEN
    CREATE INDEX idx_affiliates_referral_code ON affiliates(referral_code);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_email_campaigns_status'
  ) THEN
    CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_email_campaigns_campaign_type'
  ) THEN
    CREATE INDEX idx_email_campaigns_campaign_type ON email_campaigns(campaign_type);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_landing_pages_status'
  ) THEN
    CREATE INDEX idx_landing_pages_status ON landing_pages(status);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_landing_pages_slug'
  ) THEN
    CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_leads_status'
  ) THEN
    CREATE INDEX idx_leads_status ON leads(status);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_leads_assigned_to'
  ) THEN
    CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_deals_stage'
  ) THEN
    CREATE INDEX idx_deals_stage ON deals(stage);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_deals_client_id'
  ) THEN
    CREATE INDEX idx_deals_client_id ON deals(client_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_activities_type'
  ) THEN
    CREATE INDEX idx_activities_type ON activities(type);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_seo_analysis_domain'
  ) THEN
    CREATE INDEX idx_seo_analysis_domain ON seo_analysis(domain);
  END IF;
END
$$;

-- Insert Sample Data if tables are empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM affiliates LIMIT 1) THEN
    INSERT INTO affiliates (name, email, company, status, tier, commission_rate, total_earnings, total_referrals, conversion_rate, referral_code)
    VALUES
    ('Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 12450, 8, 12.5, 'SARAH2024'),
    ('Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 8900, 6, 10.2, 'MIKE2024'),
    ('Emily Rodriguez', 'emily@growthagency.com', 'Growth Agency', 'pending', 'bronze', 10.00, 0, 0, 0, 'EMILY2024');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM email_campaigns LIMIT 1) THEN
    INSERT INTO email_campaigns (name, subject, content, status, campaign_type, stats)
    VALUES
    ('January Newsletter', 'New Year, New Marketing Strategies', '<h1>Welcome to 2024!</h1><p>Here are our top marketing strategies for the new year...</p>', 'sent', 'newsletter', '{"total_sent": 2500, "delivered": 2450, "opened": 1225, "clicked": 245, "open_rate": 50.0, "click_rate": 10.0}'),
    ('Product Launch', 'Introducing Our Revolutionary New Service', '<h1>Big News!</h1><p>We are excited to announce our latest service offering...</p>', 'scheduled', 'promotional', '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "open_rate": 0, "click_rate": 0}');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM landing_pages LIMIT 1) THEN
    INSERT INTO landing_pages (name, title, slug, status, description)
    VALUES
    ('SaaS Product Launch', 'Revolutionary Project Management Tool', 'saas-launch', 'published', 'Perfect landing page for software launches'),
    ('E-commerce Store', 'Premium Fashion Collection', 'fashion-store', 'draft', 'Optimized for online retail'),
    ('Agency Services', 'Digital Marketing Excellence', 'agency-services', 'published', 'Showcase your agency capabilities');
  END IF;
END
$$;
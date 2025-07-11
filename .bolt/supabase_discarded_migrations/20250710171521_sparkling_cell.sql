/*
  # Complete B3ACON Database Setup

  1. Schema Setup
    - Custom enum types
    - Core tables (profiles, clients, leads, deals, etc.)
    - Marketing tables (email, landing pages)
    - Affiliate tables
    - Utility tables
    - Indexes and triggers

  2. Security Configuration
    - Row Level Security (RLS) for all tables
    - Access policies for different user roles

  3. Sample Data
    - Demo users with working passwords
    - Sample clients, leads, and projects
    - Marketing data (campaigns, templates)
    - Affiliate data
*/

-- =============================================
-- PART 1: SCHEMA SETUP
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom enum types using safe pattern to avoid errors if they already exist
DO $$ 
BEGIN
  -- Create user_role enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'specialist', 'client');
  END IF;
  
  -- Create subscription_tier enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
    CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise');
  END IF;
  
  -- Create lead_status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE lead_status AS ENUM ('new', 'qualified', 'contacted', 'nurturing', 'converted', 'lost');
  END IF;
  
  -- Create deal_stage enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deal_stage') THEN
    CREATE TYPE deal_stage AS ENUM ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
  END IF;
  
  -- Create activity_type enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
    CREATE TYPE activity_type AS ENUM ('email', 'call', 'meeting', 'note', 'task');
  END IF;
END $$;

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- CORE TABLES
-- =============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'client',
  company_name TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  subscription_tier subscription_tier DEFAULT 'starter',
  monthly_value INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  services JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  assigned_manager UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  website TEXT,
  source TEXT,
  status lead_status DEFAULT 'new',
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  estimated_value INTEGER DEFAULT 0,
  notes TEXT,
  tags JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '{}',
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  value INTEGER NOT NULL,
  stage deal_stage DEFAULT 'prospecting',
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  close_date DATE,
  description TEXT,
  lead_id UUID REFERENCES leads(id),
  client_id UUID REFERENCES clients(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type activity_type NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  lead_id UUID REFERENCES leads(id),
  deal_id UUID REFERENCES deals(id),
  client_id UUID REFERENCES clients(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  budget INTEGER,
  services JSONB DEFAULT '[]',
  client_id UUID NOT NULL REFERENCES clients(id),
  assigned_team JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AFFILIATE MARKETING TABLES
-- =============================================

-- Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Affiliate Links table
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  tracking_url TEXT UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0.00,
  commission_earned DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate Referrals table
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  service_type TEXT NOT NULL,
  deal_value DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'qualified', 'converted', 'lost')),
  referral_date TIMESTAMPTZ DEFAULT NOW(),
  conversion_date TIMESTAMPTZ,
  tracking_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate Commissions table
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES affiliate_referrals(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  payment_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EMAIL MARKETING TABLES
-- =============================================

-- Email Campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  content TEXT NOT NULL,
  template_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused')),
  campaign_type TEXT DEFAULT 'newsletter' CHECK (campaign_type IN ('newsletter', 'promotional', 'automated', 'transactional')),
  client_id UUID REFERENCES clients(id),
  list_ids JSONB DEFAULT '[]',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  stats JSONB DEFAULT '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "bounced": 0, "unsubscribed": 0, "spam_complaints": 0, "open_rate": 0, "click_rate": 0, "bounce_rate": 0, "unsubscribe_rate": 0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Lists table
CREATE TABLE IF NOT EXISTS email_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id),
  subscriber_count INTEGER DEFAULT 0,
  active_subscribers INTEGER DEFAULT 0,
  growth_rate DECIMAL(5,2) DEFAULT 0.00,
  tags JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced', 'complained')),
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  tags JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '{}',
  engagement_score INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Automations table
CREATE TABLE IF NOT EXISTS email_automations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('signup', 'purchase', 'abandoned_cart', 'birthday', 'custom')),
  trigger_conditions JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'draft')),
  client_id UUID REFERENCES clients(id),
  steps JSONB DEFAULT '[]',
  stats JSONB DEFAULT '{"total_triggered": 0, "completed": 0, "conversion_rate": 0, "revenue_generated": 0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'custom' CHECK (category IN ('newsletter', 'promotional', 'welcome', 'abandoned_cart', 'custom')),
  html_content TEXT NOT NULL,
  text_content TEXT,
  thumbnail TEXT,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LANDING PAGE TABLES
-- =============================================

-- Landing Pages table
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  template_id UUID,
  client_id UUID REFERENCES clients(id),
  content JSONB DEFAULT '{"sections": [], "global_styles": {}, "custom_css": "", "custom_js": ""}',
  seo JSONB DEFAULT '{"meta_title": "", "meta_description": "", "meta_keywords": [], "og_title": "", "og_description": "", "og_image": "", "canonical_url": "", "robots": "index,follow", "schema_markup": {}}',
  settings JSONB DEFAULT '{"favicon": "", "google_analytics_id": "", "facebook_pixel_id": "", "custom_tracking_codes": [], "password_protection": {"enabled": false, "password": ""}, "redirect_after_conversion": "", "thank_you_page": ""}',
  analytics JSONB DEFAULT '{"total_views": 0, "unique_visitors": 0, "conversions": 0, "conversion_rate": 0, "bounce_rate": 0, "avg_time_on_page": 0, "traffic_sources": [], "device_breakdown": {"desktop": 0, "mobile": 0, "tablet": 0}, "geographic_data": []}',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Landing Page Templates table
CREATE TABLE IF NOT EXISTS landing_page_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'custom' CHECK (category IN ('business', 'ecommerce', 'saas', 'agency', 'event', 'custom')),
  thumbnail TEXT,
  preview_url TEXT,
  content JSONB DEFAULT '{"sections": [], "global_styles": {}}',
  is_premium BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Landing Page Forms table
CREATE TABLE IF NOT EXISTS landing_page_forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  fields JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{"submit_button_text": "Submit", "success_message": "Thank you!", "error_message": "Please try again", "redirect_url": "", "email_notifications": {"enabled": false, "recipients": [], "subject": ""}, "auto_responder": {"enabled": false, "subject": "", "message": ""}}',
  integrations JSONB DEFAULT '[]',
  analytics JSONB DEFAULT '{"total_submissions": 0, "conversion_rate": 0, "abandonment_rate": 0, "avg_completion_time": 0, "field_analytics": []}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form Submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES landing_page_forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processed', 'spam')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WHITE LABEL & UTILITY TABLES
-- =============================================

-- White Label Partners table
CREATE TABLE IF NOT EXISTS white_label_partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#8B5CF6',
  secondary_color TEXT DEFAULT '#EC4899',
  custom_css TEXT,
  features JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  admin_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (for additional user management)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys table
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

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_subscription ON clients(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_client_id ON deals(client_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_assigned_to ON activities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_tier ON affiliates(tier);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_affiliate_id ON affiliate_links(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate_id ON affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id ON affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_client_id ON email_campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_lists_client_id ON email_lists(client_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_automations_client_id ON email_automations(client_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_client_id ON landing_pages(client_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON landing_pages(status);
CREATE INDEX IF NOT EXISTS idx_landing_page_forms_landing_page_id ON landing_page_forms(landing_page_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- =============================================
-- TRIGGERS
-- =============================================

-- Create or replace triggers for updated_at
DO $$ 
BEGIN
  -- Drop triggers if they exist
  DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
  DROP TRIGGER IF EXISTS handle_clients_updated_at ON clients;
  DROP TRIGGER IF EXISTS handle_leads_updated_at ON leads;
  DROP TRIGGER IF EXISTS handle_deals_updated_at ON deals;
  DROP TRIGGER IF EXISTS handle_activities_updated_at ON activities;
  DROP TRIGGER IF EXISTS handle_projects_updated_at ON projects;
  DROP TRIGGER IF EXISTS handle_affiliates_updated_at ON affiliates;
  DROP TRIGGER IF EXISTS handle_affiliate_links_updated_at ON affiliate_links;
  DROP TRIGGER IF EXISTS handle_affiliate_referrals_updated_at ON affiliate_referrals;
  DROP TRIGGER IF EXISTS handle_affiliate_commissions_updated_at ON affiliate_commissions;
  DROP TRIGGER IF EXISTS handle_email_campaigns_updated_at ON email_campaigns;
  DROP TRIGGER IF EXISTS handle_email_lists_updated_at ON email_lists;
  DROP TRIGGER IF EXISTS handle_email_subscribers_updated_at ON email_subscribers;
  DROP TRIGGER IF EXISTS handle_email_automations_updated_at ON email_automations;
  DROP TRIGGER IF EXISTS handle_email_templates_updated_at ON email_templates;
  DROP TRIGGER IF EXISTS handle_landing_pages_updated_at ON landing_pages;
  DROP TRIGGER IF EXISTS handle_landing_page_templates_updated_at ON landing_page_templates;
  DROP TRIGGER IF EXISTS handle_landing_page_forms_updated_at ON landing_page_forms;
  DROP TRIGGER IF EXISTS handle_white_label_partners_updated_at ON white_label_partners;
  DROP TRIGGER IF EXISTS handle_users_updated_at ON users;
  DROP TRIGGER IF EXISTS handle_api_keys_updated_at ON api_keys;
  
  -- Create triggers
  CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_affiliate_links_updated_at BEFORE UPDATE ON affiliate_links FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_affiliate_referrals_updated_at BEFORE UPDATE ON affiliate_referrals FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_affiliate_commissions_updated_at BEFORE UPDATE ON affiliate_commissions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_email_lists_updated_at BEFORE UPDATE ON email_lists FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_email_subscribers_updated_at BEFORE UPDATE ON email_subscribers FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_email_automations_updated_at BEFORE UPDATE ON email_automations FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_landing_pages_updated_at BEFORE UPDATE ON landing_pages FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_landing_page_templates_updated_at BEFORE UPDATE ON landing_page_templates FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_landing_page_forms_updated_at BEFORE UPDATE ON landing_page_forms FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_white_label_partners_updated_at BEFORE UPDATE ON white_label_partners FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  CREATE TRIGGER handle_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
END $$;

-- =============================================
-- PART 2: SECURITY CONFIGURATION
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
  DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  
  -- Clients policies
  DROP POLICY IF EXISTS "Anyone can view clients" ON clients;
  DROP POLICY IF EXISTS "Anyone can manage clients" ON clients;
  DROP POLICY IF EXISTS "Authenticated users can view clients" ON clients;
  DROP POLICY IF EXISTS "Authenticated users can manage clients" ON clients;
  
  -- Leads policies
  DROP POLICY IF EXISTS "Anyone can manage leads" ON leads;
  DROP POLICY IF EXISTS "Anyone can view leads" ON leads;
  DROP POLICY IF EXISTS "Authenticated users can manage leads" ON leads;
  
  -- Deals policies
  DROP POLICY IF EXISTS "Anyone can manage deals" ON deals;
  DROP POLICY IF EXISTS "Anyone can view deals" ON deals;
  DROP POLICY IF EXISTS "Authenticated users can manage deals" ON deals;
  
  -- Activities policies
  DROP POLICY IF EXISTS "Users can manage their activities" ON activities;
  
  -- Projects policies
  DROP POLICY IF EXISTS "Authenticated users can view projects" ON projects;
  
  -- Affiliates policies
  DROP POLICY IF EXISTS "Anyone can manage affiliates" ON affiliates;
  DROP POLICY IF EXISTS "Anyone can view affiliates" ON affiliates;
  DROP POLICY IF EXISTS "Authenticated users can manage affiliates" ON affiliates;
  
  -- Affiliate links policies
  DROP POLICY IF EXISTS "Authenticated users can view affiliate data" ON affiliate_links;
  
  -- Affiliate referrals policies
  DROP POLICY IF EXISTS "Authenticated users can manage affiliate referrals" ON affiliate_referrals;
  
  -- Affiliate commissions policies
  DROP POLICY IF EXISTS "Authenticated users can manage commissions" ON affiliate_commissions;
  
  -- Email campaigns policies
  DROP POLICY IF EXISTS "Anyone can manage email_campaigns" ON email_campaigns;
  DROP POLICY IF EXISTS "Anyone can view email_campaigns" ON email_campaigns;
  DROP POLICY IF EXISTS "Authenticated users can manage email campaigns" ON email_campaigns;
  
  -- Email lists policies
  DROP POLICY IF EXISTS "Authenticated users can manage email lists" ON email_lists;
  
  -- Email subscribers policies
  DROP POLICY IF EXISTS "Authenticated users can manage subscribers" ON email_subscribers;
  
  -- Email automations policies
  DROP POLICY IF EXISTS "Authenticated users can manage automations" ON email_automations;
  
  -- Email templates policies
  DROP POLICY IF EXISTS "Users can view public templates" ON email_templates;
  
  -- Landing pages policies
  DROP POLICY IF EXISTS "Anyone can manage landing_pages" ON landing_pages;
  DROP POLICY IF EXISTS "Anyone can view landing_pages" ON landing_pages;
  DROP POLICY IF EXISTS "Authenticated users can manage landing pages" ON landing_pages;
  
  -- Landing page templates policies
  DROP POLICY IF EXISTS "Users can view public templates" ON landing_page_templates;
  
  -- Landing page forms policies
  DROP POLICY IF EXISTS "Authenticated users can manage forms" ON landing_page_forms;
  
  -- Form submissions policies
  DROP POLICY IF EXISTS "Authenticated users can view form submissions" ON form_submissions;
  
  -- White label partners policies
  DROP POLICY IF EXISTS "Authenticated users can manage white label partners" ON white_label_partners;
  
  -- Users policies
  DROP POLICY IF EXISTS "Admins can view all users" ON users;
  DROP POLICY IF EXISTS "Users can view own data" ON users;
  
  -- API keys policies
  DROP POLICY IF EXISTS "Admins can manage API keys" ON api_keys;
  DROP POLICY IF EXISTS "Agency users can manage API keys" ON api_keys;
  DROP POLICY IF EXISTS "Agency users can view API keys" ON api_keys;
END $$;

-- Create new policies
-- Profiles policies
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Service role can manage profiles" ON profiles FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Clients policies
CREATE POLICY "Anyone can view clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Anyone can manage clients" ON clients FOR ALL USING (true);
CREATE POLICY "Authenticated users can view clients" ON clients FOR SELECT USING (auth.role() = 'authenticated'::text);
CREATE POLICY "Authenticated users can manage clients" ON clients FOR ALL USING (auth.role() = 'authenticated'::text);

-- Leads policies
CREATE POLICY "Anyone can manage leads" ON leads FOR ALL USING (true);
CREATE POLICY "Anyone can view leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage leads" ON leads FOR ALL USING (auth.role() = 'authenticated'::text);

-- Deals policies
CREATE POLICY "Anyone can manage deals" ON deals FOR ALL USING (true);
CREATE POLICY "Anyone can view deals" ON deals FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage deals" ON deals FOR ALL USING (auth.role() = 'authenticated'::text);

-- Activities policies
CREATE POLICY "Users can manage their activities" ON activities FOR ALL USING ((auth.uid() = assigned_to) OR (auth.uid() = created_by) OR (auth.role() = 'authenticated'::text));

-- Projects policies
CREATE POLICY "Authenticated users can view projects" ON projects FOR SELECT USING (auth.role() = 'authenticated'::text);

-- Affiliates policies
CREATE POLICY "Anyone can manage affiliates" ON affiliates FOR ALL USING (true);
CREATE POLICY "Anyone can view affiliates" ON affiliates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage affiliates" ON affiliates FOR ALL USING (auth.role() = 'authenticated'::text);

-- Affiliate links policies
CREATE POLICY "Authenticated users can view affiliate data" ON affiliate_links FOR SELECT USING (auth.role() = 'authenticated'::text);

-- Affiliate referrals policies
CREATE POLICY "Authenticated users can manage affiliate referrals" ON affiliate_referrals FOR ALL USING (auth.role() = 'authenticated'::text);

-- Affiliate commissions policies
CREATE POLICY "Authenticated users can manage commissions" ON affiliate_commissions FOR ALL USING (auth.role() = 'authenticated'::text);

-- Email campaigns policies
CREATE POLICY "Anyone can manage email_campaigns" ON email_campaigns FOR ALL USING (true);
CREATE POLICY "Anyone can view email_campaigns" ON email_campaigns FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage email campaigns" ON email_campaigns FOR ALL USING (auth.role() = 'authenticated'::text);

-- Email lists policies
CREATE POLICY "Authenticated users can manage email lists" ON email_lists FOR ALL USING (auth.role() = 'authenticated'::text);

-- Email subscribers policies
CREATE POLICY "Authenticated users can manage subscribers" ON email_subscribers FOR ALL USING (auth.role() = 'authenticated'::text);

-- Email automations policies
CREATE POLICY "Authenticated users can manage automations" ON email_automations FOR ALL USING (auth.role() = 'authenticated'::text);

-- Email templates policies
CREATE POLICY "Users can view public templates" ON email_templates FOR SELECT USING (
  is_public = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- Landing pages policies
CREATE POLICY "Anyone can manage landing_pages" ON landing_pages FOR ALL USING (true);
CREATE POLICY "Anyone can view landing_pages" ON landing_pages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage landing pages" ON landing_pages FOR ALL USING (auth.role() = 'authenticated'::text);

-- Landing page templates policies
CREATE POLICY "Users can view public templates" ON landing_page_templates FOR SELECT USING (true);

-- Landing page forms policies
CREATE POLICY "Authenticated users can manage forms" ON landing_page_forms FOR ALL USING (auth.role() = 'authenticated'::text);

-- Form submissions policies
CREATE POLICY "Authenticated users can view form submissions" ON form_submissions FOR SELECT USING (auth.role() = 'authenticated'::text);

-- White label partners policies
CREATE POLICY "Authenticated users can manage white label partners" ON white_label_partners FOR ALL USING (auth.role() = 'authenticated'::text);

-- Users policies
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);

-- API keys policies
CREATE POLICY "Admins can manage API keys" ON api_keys FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Agency users can manage API keys" ON api_keys FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Agency users can view API keys" ON api_keys FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- =============================================
-- PART 3: SAMPLE DATA
-- =============================================

-- Insert demo users into auth.users table if they don't exist
DO $$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users WHERE email = 'sarah@sparkdigital.com';
  
  IF user_count = 0 THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      'authenticated',
      'authenticated',
      'sarah@sparkdigital.com',
      crypt('password', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Sarah Johnson"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ), (
      '00000000-0000-0000-0000-000000000000',
      'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      'authenticated',
      'authenticated',
      'john@techcorp.com',
      crypt('password', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "John Smith"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ), (
      '00000000-0000-0000-0000-000000000000',
      'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      'authenticated',
      'authenticated',
      'mike@sparkdigital.com',
      crypt('password', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Mike Chen"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ), (
      '00000000-0000-0000-0000-000000000000',
      'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
      'authenticated',
      'authenticated',
      'emily@sparkdigital.com',
      crypt('password', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Emily Rodriguez"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Insert corresponding profiles if they don't exist
DO $$
DECLARE
  profile_count integer;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM profiles WHERE email = 'sarah@sparkdigital.com';
  
  IF profile_count = 0 THEN
    INSERT INTO profiles (id, email, full_name, role, company_name, phone, avatar_url) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sarah@sparkdigital.com', 'Sarah Johnson', 'admin', 'Spark Digital Agency', '+1 (555) 123-4567', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'john@techcorp.com', 'John Smith', 'client', 'TechCorp Solutions', '+1 (555) 234-5678', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'mike@sparkdigital.com', 'Mike Chen', 'manager', 'Spark Digital Agency', '+1 (555) 345-6789', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'emily@sparkdigital.com', 'Emily Rodriguez', 'specialist', 'Spark Digital Agency', '+1 (555) 456-7890', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop');
  END IF;
END $$;

-- Insert sample clients if they don't exist
DO $$
DECLARE
  client_count integer;
BEGIN
  SELECT COUNT(*) INTO client_count FROM clients WHERE email = 'contact@techcorp.com';
  
  IF client_count = 0 THEN
    INSERT INTO clients (id, name, email, subscription_tier, monthly_value, services, industry, website, assigned_manager) VALUES
    ('11111111-1111-1111-1111-111111111111', 'TechCorp Solutions', 'contact@techcorp.com', 'enterprise', 8500, '["SEO", "Social Media", "PPC", "Amazon", "CRM"]', 'Technology', 'https://techcorp.com', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('22222222-2222-2222-2222-222222222222', 'RetailMax Inc', 'hello@retailmax.com', 'professional', 4200, '["SEO", "PPC", "Social Media"]', 'Retail', 'https://retailmax.com', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('33333333-3333-3333-3333-333333333333', 'FinanceFlow', 'team@financeflow.com', 'professional', 3800, '["SEO", "CRM"]', 'Finance', 'https://financeflow.com', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('44444444-4444-4444-4444-444444444444', 'EcomStore', 'support@ecomstore.com', 'professional', 5200, '["Amazon", "PPC", "Social Media"]', 'E-commerce', 'https://ecomstore.com', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');
  END IF;
END $$;

-- Insert sample leads if they don't exist
DO $$
DECLARE
  lead_count integer;
BEGIN
  SELECT COUNT(*) INTO lead_count FROM leads WHERE email = 'sarah@techstartup.com';
  
  IF lead_count = 0 THEN
    INSERT INTO leads (id, name, email, company, source, status, score, estimated_value, assigned_to) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sarah Johnson', 'sarah@techstartup.com', 'TechStartup Inc', 'Website', 'qualified', 85, 15000, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mike Chen', 'mike@retailcorp.com', 'RetailCorp', 'LinkedIn', 'contacted', 72, 8500, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Emily Rodriguez', 'emily@financeplus.com', 'FinancePlus', 'Referral', 'nurturing', 68, 12000, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'David Wilson', 'david@growthco.com', 'GrowthCo', 'Google Ads', 'new', 45, 6000, 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');
  END IF;
END $$;

-- Insert sample deals if they don't exist
DO $$
DECLARE
  deal_count integer;
BEGIN
  SELECT COUNT(*) INTO deal_count FROM deals WHERE name = 'TechCorp SEO Expansion';
  
  IF deal_count = 0 THEN
    INSERT INTO deals (id, name, value, stage, probability, close_date, client_id, assigned_to) VALUES
    ('e1111111-1111-1111-1111-111111111111', 'TechCorp SEO Expansion', 15000, 'proposal', 75, '2024-02-15', '11111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('e2222222-2222-2222-2222-222222222222', 'RetailMax PPC Campaign', 8500, 'negotiation', 60, '2024-02-20', '22222222-2222-2222-2222-222222222222', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('e3333333-3333-3333-3333-333333333333', 'FinanceFlow Website Redesign', 12000, 'qualification', 40, '2024-03-01', '33333333-3333-3333-3333-333333333333', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('e4444444-4444-4444-4444-444444444444', 'EcomStore Amazon Optimization', 9500, 'prospecting', 25, '2024-03-15', '44444444-4444-4444-4444-444444444444', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');
  END IF;
END $$;

-- Insert sample activities if they don't exist
DO $$
DECLARE
  activity_count integer;
BEGIN
  SELECT COUNT(*) INTO activity_count FROM activities WHERE subject = 'Follow-up call with TechCorp';
  
  IF activity_count = 0 THEN
    INSERT INTO activities (id, type, subject, description, client_id, assigned_to, created_by, scheduled_at) VALUES
    ('f1111111-1111-1111-1111-111111111111', 'call', 'Follow-up call with TechCorp', 'Discuss SEO expansion proposal', '11111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() + INTERVAL '2 hours'),
    ('f2222222-2222-2222-2222-222222222222', 'email', 'PPC campaign proposal', 'Send detailed PPC strategy document', '22222222-2222-2222-2222-222222222222', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NOW() + INTERVAL '1 day'),
    ('f3333333-3333-3333-3333-333333333333', 'meeting', 'FinanceFlow strategy session', 'Quarterly review and planning', '33333333-3333-3333-3333-333333333333', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NOW() + INTERVAL '3 days'),
    ('f4444444-4444-4444-4444-444444444444', 'task', 'Amazon listing optimization', 'Complete product listing audit', '44444444-4444-4444-4444-444444444444', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', NOW() + INTERVAL '1 week');
  END IF;
END $$;

-- Insert sample projects if they don't exist
DO $$
DECLARE
  project_count integer;
BEGIN
  SELECT COUNT(*) INTO project_count FROM projects WHERE name = 'TechCorp Digital Transformation';
  
  IF project_count = 0 THEN
    INSERT INTO projects (id, name, description, client_id, services, budget, start_date, end_date) VALUES
    ('g1111111-1111-1111-1111-111111111111', 'TechCorp Digital Transformation', 'Complete digital marketing overhaul', '11111111-1111-1111-1111-111111111111', '["SEO", "PPC", "Social Media", "Content Marketing"]', 25000, '2024-01-01', '2024-06-30'),
    ('g2222222-2222-2222-2222-222222222222', 'RetailMax E-commerce Growth', 'Boost online sales and visibility', '22222222-2222-2222-2222-222222222222', '["PPC", "Amazon", "Social Media"]', 15000, '2024-01-15', '2024-04-15'),
    ('g3333333-3333-3333-3333-333333333333', 'FinanceFlow Lead Generation', 'Increase qualified leads by 200%', '33333333-3333-3333-3333-333333333333', '["SEO", "Content Marketing", "CRM"]', 18000, '2024-02-01', '2024-07-31');
  END IF;
END $$;

-- Insert sample affiliates if they don't exist
DO $$
DECLARE
  affiliate_count integer;
BEGIN
  SELECT COUNT(*) INTO affiliate_count FROM affiliates WHERE email = 'sarah@marketingpro.com';
  
  IF affiliate_count = 0 THEN
    INSERT INTO affiliates (id, name, email, company, status, tier, commission_rate, referral_code, total_earnings, total_referrals, conversion_rate) VALUES
    ('h1111111-1111-1111-1111-111111111111', 'Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 'SARAH2024', 12450.00, 8, 12.5),
    ('h2222222-2222-2222-2222-222222222222', 'Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 'MIKE2024', 8900.00, 6, 10.2),
    ('h3333333-3333-3333-3333-333333333333', 'Emily Rodriguez', 'emily@growthagency.com', 'Growth Agency', 'pending', 'bronze', 10.00, 'EMILY2024', 0.00, 0, 0.0);
  END IF;
END $$;

-- Insert sample email campaigns if they don't exist
DO $$
DECLARE
  campaign_count integer;
BEGIN
  SELECT COUNT(*) INTO campaign_count FROM email_campaigns WHERE name = 'January Newsletter';
  
  IF campaign_count = 0 THEN
    INSERT INTO email_campaigns (id, name, subject, content, status, campaign_type, stats) VALUES
    ('i1111111-1111-1111-1111-111111111111', 'January Newsletter', 'New Year, New Marketing Strategies', '<h1>Welcome to 2024!</h1><p>Here are our top marketing strategies for the new year...</p>', 'sent', 'newsletter', '{"total_sent": 2500, "delivered": 2450, "opened": 1225, "clicked": 245, "open_rate": 50.0, "click_rate": 10.0}'),
    ('i2222222-2222-2222-2222-222222222222', 'Product Launch Announcement', 'Introducing Our Revolutionary New Service', '<h1>Big News!</h1><p>We are excited to announce our latest service offering...</p>', 'scheduled', 'promotional', '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "open_rate": 0, "click_rate": 0}');
  END IF;
END $$;

-- Insert sample email templates if they don't exist
DO $$
DECLARE
  template_count integer;
BEGIN
  SELECT COUNT(*) INTO template_count FROM email_templates WHERE name = 'Welcome Email';
  
  IF template_count = 0 THEN
    INSERT INTO email_templates (id, name, category, html_content, is_public) VALUES
    ('j1111111-1111-1111-1111-111111111111', 'Welcome Email', 'welcome', '<h1>Welcome to B3ACON!</h1><p>Thank you for joining us. We are excited to help you grow your business.</p>', true),
    ('j2222222-2222-2222-2222-222222222222', 'Newsletter Template', 'newsletter', '<h1>Monthly Newsletter</h1><p>Here are this month''s updates and insights...</p>', true),
    ('j3333333-3333-3333-3333-333333333333', 'Promotional Email', 'promotional', '<h1>Special Offer!</h1><p>Don''t miss out on this limited-time offer. Act now!</p>', true);
  END IF;
END $$;

-- Insert sample landing pages if they don't exist
DO $$
DECLARE
  page_count integer;
BEGIN
  SELECT COUNT(*) INTO page_count FROM landing_pages WHERE name = 'SaaS Product Launch';
  
  IF page_count = 0 THEN
    INSERT INTO landing_pages (id, name, title, slug, status, description) VALUES
    ('k1111111-1111-1111-1111-111111111111', 'SaaS Product Launch', 'Revolutionary Project Management Tool', 'saas-launch', 'published', 'Perfect landing page for software launches'),
    ('k2222222-2222-2222-2222-222222222222', 'E-commerce Store', 'Premium Fashion Collection', 'fashion-store', 'draft', 'Optimized for online retail'),
    ('k3333333-3333-3333-3333-333333333333', 'Agency Services', 'Digital Marketing Excellence', 'agency-services', 'published', 'Showcase your agency capabilities');
  END IF;
END $$;

-- Insert sample landing page templates if they don't exist
DO $$
DECLARE
  template_count integer;
BEGIN
  SELECT COUNT(*) INTO template_count FROM landing_page_templates WHERE name = 'SaaS Landing';
  
  IF template_count = 0 THEN
    INSERT INTO landing_page_templates (id, name, category, description, is_premium, usage_count, rating) VALUES
    ('l1111111-1111-1111-1111-111111111111', 'SaaS Landing', 'saas', 'Perfect for software and app launches', false, 45, 4.8),
    ('l2222222-2222-2222-2222-222222222222', 'E-commerce Store', 'ecommerce', 'Optimized for online stores and products', true, 32, 4.9),
    ('l3333333-3333-3333-3333-333333333333', 'Agency Portfolio', 'agency', 'Showcase your agency services and portfolio', false, 28, 4.7),
    ('l4444444-4444-4444-4444-444444444444', 'Event Landing', 'event', 'Perfect for conferences and events', true, 19, 4.6);
  END IF;
END $$;

-- Insert sample email lists if they don't exist
DO $$
DECLARE
  list_count integer;
BEGIN
  SELECT COUNT(*) INTO list_count FROM email_lists WHERE name = 'Newsletter Subscribers';
  
  IF list_count = 0 THEN
    INSERT INTO email_lists (id, name, description, subscriber_count, active_subscribers, growth_rate) VALUES
    ('m1111111-1111-1111-1111-111111111111', 'Newsletter Subscribers', 'Main newsletter list for all subscribers', 2500, 2350, 12.5),
    ('m2222222-2222-2222-2222-222222222222', 'VIP Customers', 'High-value customers and prospects', 450, 435, 8.3),
    ('m3333333-3333-3333-3333-333333333333', 'Product Updates', 'Users interested in product announcements', 1800, 1720, 15.7);
  END IF;
END $$;

-- Insert sample users into users table if they don't exist
DO $$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users WHERE email = 'sarah@sparkdigital.com';
  
  IF user_count = 0 THEN
    INSERT INTO users (id, email) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sarah@sparkdigital.com'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'john@techcorp.com'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'mike@sparkdigital.com'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'emily@sparkdigital.com');
  END IF;
END $$;

-- Insert additional demo users for admin@b3acon.com and demo@b3acon.com
DO $$
DECLARE
  admin_count integer;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM auth.users WHERE email = 'admin@b3acon.com';
  
  IF admin_count = 0 THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
      'authenticated',
      'authenticated',
      'admin@b3acon.com',
      crypt('password', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "B3ACON Admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ), (
      '00000000-0000-0000-0000-000000000000',
      'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
      'authenticated',
      'authenticated',
      'demo@b3acon.com',
      crypt('password', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Demo User"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
    
    -- Insert corresponding profiles
    INSERT INTO profiles (id, email, full_name, role, company_name, avatar_url) VALUES
    ('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'admin@b3acon.com', 'B3ACON Admin', 'admin', 'B3ACON', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'),
    ('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'demo@b3acon.com', 'Demo User', 'client', 'Demo Company', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop');
    
    -- Insert into users table
    INSERT INTO users (id, email) VALUES
    ('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'admin@b3acon.com'),
    ('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'demo@b3acon.com');
  END IF;
END $$;
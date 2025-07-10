-- # Fix Database Schema and SQL Errors
--
-- 1. Create missing functions
-- 2. Create required enum types
-- 3. Create all referenced tables
-- 4. Attach updated_at triggers
-- 5. Fix RLS policies
-- 6. Add OAuth configuration

-- =============================================
-- 1. Create the handle_updated_at() Function
-- =============================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 2. Create All Required Types (if missing)
-- =============================================
DO $$
BEGIN
  -- User role enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'specialist', 'client');
  END IF;

  -- Activity type enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
    CREATE TYPE activity_type AS ENUM ('call', 'email', 'meeting', 'note', 'task');
  END IF;

  -- Lead status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE lead_status AS ENUM ('new', 'qualified', 'contacted', 'nurturing', 'converted', 'lost');
  END IF;

  -- Deal stage enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deal_stage') THEN
    CREATE TYPE deal_stage AS ENUM ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
  END IF;

  -- Subscription tier enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
    CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise');
  END IF;
END $$;

-- =============================================
-- 3. Create All Referenced Tables (if missing)
-- =============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'client',
  company_name TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  stripe_customer_id TEXT,
  subscription_tier subscription_tier DEFAULT 'starter',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Email Campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Landing Pages table
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES landing_page_forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processed', 'spam')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- White Label Partners table
CREATE TABLE IF NOT EXISTS white_label_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3478F6',
  secondary_color TEXT DEFAULT '#FF6B35',
  custom_css TEXT,
  features JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  admin_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table for Stripe integration
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  plan_id TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Methods table for Stripe integration
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE,
  type TEXT NOT NULL,
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table for Stripe integration
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  amount_due INTEGER NOT NULL,
  amount_paid INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
  invoice_pdf TEXT,
  hosted_invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. Attach updated_at triggers to all tables
-- =============================================

-- Profiles table trigger
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
CREATE TRIGGER handle_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Clients table trigger
DROP TRIGGER IF EXISTS handle_clients_updated_at ON clients;
CREATE TRIGGER handle_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Leads table trigger
DROP TRIGGER IF EXISTS handle_leads_updated_at ON leads;
CREATE TRIGGER handle_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Deals table trigger
DROP TRIGGER IF EXISTS handle_deals_updated_at ON deals;
CREATE TRIGGER handle_deals_updated_at
BEFORE UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Activities table trigger
DROP TRIGGER IF EXISTS handle_activities_updated_at ON activities;
CREATE TRIGGER handle_activities_updated_at
BEFORE UPDATE ON activities
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Projects table trigger
DROP TRIGGER IF EXISTS handle_projects_updated_at ON projects;
CREATE TRIGGER handle_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Affiliates table trigger
DROP TRIGGER IF EXISTS handle_affiliates_updated_at ON affiliates;
CREATE TRIGGER handle_affiliates_updated_at
BEFORE UPDATE ON affiliates
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Affiliate Links table trigger
DROP TRIGGER IF EXISTS handle_affiliate_links_updated_at ON affiliate_links;
CREATE TRIGGER handle_affiliate_links_updated_at
BEFORE UPDATE ON affiliate_links
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Affiliate Referrals table trigger
DROP TRIGGER IF EXISTS handle_affiliate_referrals_updated_at ON affiliate_referrals;
CREATE TRIGGER handle_affiliate_referrals_updated_at
BEFORE UPDATE ON affiliate_referrals
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Affiliate Commissions table trigger
DROP TRIGGER IF EXISTS handle_affiliate_commissions_updated_at ON affiliate_commissions;
CREATE TRIGGER handle_affiliate_commissions_updated_at
BEFORE UPDATE ON affiliate_commissions
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Email Campaigns table trigger
DROP TRIGGER IF EXISTS handle_email_campaigns_updated_at ON email_campaigns;
CREATE TRIGGER handle_email_campaigns_updated_at
BEFORE UPDATE ON email_campaigns
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Email Lists table trigger
DROP TRIGGER IF EXISTS handle_email_lists_updated_at ON email_lists;
CREATE TRIGGER handle_email_lists_updated_at
BEFORE UPDATE ON email_lists
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Email Subscribers table trigger
DROP TRIGGER IF EXISTS handle_email_subscribers_updated_at ON email_subscribers;
CREATE TRIGGER handle_email_subscribers_updated_at
BEFORE UPDATE ON email_subscribers
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Email Automations table trigger
DROP TRIGGER IF EXISTS handle_email_automations_updated_at ON email_automations;
CREATE TRIGGER handle_email_automations_updated_at
BEFORE UPDATE ON email_automations
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Email Templates table trigger
DROP TRIGGER IF EXISTS handle_email_templates_updated_at ON email_templates;
CREATE TRIGGER handle_email_templates_updated_at
BEFORE UPDATE ON email_templates
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Landing Pages table trigger
DROP TRIGGER IF EXISTS handle_landing_pages_updated_at ON landing_pages;
CREATE TRIGGER handle_landing_pages_updated_at
BEFORE UPDATE ON landing_pages
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Landing Page Templates table trigger
DROP TRIGGER IF EXISTS handle_landing_page_templates_updated_at ON landing_page_templates;
CREATE TRIGGER handle_landing_page_templates_updated_at
BEFORE UPDATE ON landing_page_templates
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Landing Page Forms table trigger
DROP TRIGGER IF EXISTS handle_landing_page_forms_updated_at ON landing_page_forms;
CREATE TRIGGER handle_landing_page_forms_updated_at
BEFORE UPDATE ON landing_page_forms
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- White Label Partners table trigger
DROP TRIGGER IF EXISTS handle_white_label_partners_updated_at ON white_label_partners;
CREATE TRIGGER handle_white_label_partners_updated_at
BEFORE UPDATE ON white_label_partners
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Subscriptions table trigger
DROP TRIGGER IF EXISTS handle_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER handle_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Payment Methods table trigger
DROP TRIGGER IF EXISTS handle_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER handle_payment_methods_updated_at
BEFORE UPDATE ON payment_methods
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Invoices table trigger
DROP TRIGGER IF EXISTS handle_invoices_updated_at ON invoices;
CREATE TRIGGER handle_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- =============================================
-- 5. Fix RLS Policies
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
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Clients policies
CREATE POLICY "Agency users can view clients" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Agency users can manage clients" ON clients FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Clients can view own data" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client' AND company_name = clients.name)
);

-- Leads policies
CREATE POLICY "Agency users can manage leads" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- Deals policies
CREATE POLICY "Agency users can manage deals" ON deals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- Activities policies
CREATE POLICY "Users can manage their activities" ON activities FOR ALL USING (
  auth.uid() = assigned_to OR auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Projects policies
CREATE POLICY "Agency users can view projects" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Clients can view own projects" ON projects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    JOIN clients c ON p.company_name = c.name 
    WHERE p.id = auth.uid() AND p.role = 'client' AND c.id = projects.client_id
  )
);

-- Affiliate policies
CREATE POLICY "Agency users can manage affiliates" ON affiliates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Email marketing policies
CREATE POLICY "Agency users can manage email campaigns" ON email_campaigns FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Agency users can manage email lists" ON email_lists FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Agency users can manage subscribers" ON email_subscribers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Agency users can manage automations" ON email_automations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Users can view public templates" ON email_templates FOR SELECT USING (
  is_public = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- Landing page policies
CREATE POLICY "Agency users can manage landing pages" ON landing_pages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Clients can view own landing pages" ON landing_pages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    JOIN clients c ON p.company_name = c.name 
    WHERE p.id = auth.uid() AND p.role = 'client' AND c.id = landing_pages.client_id
  )
);
CREATE POLICY "Users can view public templates" ON landing_page_templates FOR SELECT USING (true);
CREATE POLICY "Agency users can manage forms" ON landing_page_forms FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Agency users can view form submissions" ON form_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- White label policies
CREATE POLICY "Admins can manage white label partners" ON white_label_partners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Subscription policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Admins can manage all subscriptions" ON subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payment method policies
CREATE POLICY "Users can view own payment methods" ON payment_methods FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Users can manage own payment methods" ON payment_methods FOR ALL USING (
  auth.uid() = user_id
);

-- Invoice policies
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Admins can manage all invoices" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- 6. Create Performance Indexes
-- =============================================
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
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);

-- =============================================
-- 7. Insert Sample Data
-- =============================================

-- Insert sample clients if none exist
INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website)
SELECT 'TechCorp Solutions', 'contact@techcorp.com', 'enterprise', 8500, '["SEO", "Social Media", "PPC", "Amazon", "CRM"]', 'Technology', 'https://techcorp.com'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'contact@techcorp.com');

INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website)
SELECT 'RetailMax Inc', 'hello@retailmax.com', 'professional', 4200, '["SEO", "PPC", "Social Media"]', 'Retail', 'https://retailmax.com'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'hello@retailmax.com');

INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website)
SELECT 'FinanceFlow', 'team@financeflow.com', 'professional', 3800, '["SEO", "CRM"]', 'Finance', 'https://financeflow.com'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'team@financeflow.com');

INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website)
SELECT 'EcomStore', 'support@ecomstore.com', 'professional', 5200, '["Amazon", "PPC", "Social Media"]', 'E-commerce', 'https://ecomstore.com'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = 'support@ecomstore.com');

-- Insert sample leads if none exist
INSERT INTO leads (name, email, company, source, status, score, estimated_value)
SELECT 'Sarah Johnson', 'sarah@techstartup.com', 'TechStartup Inc', 'Website', 'qualified', 85, 15000
WHERE NOT EXISTS (SELECT 1 FROM leads WHERE email = 'sarah@techstartup.com');

INSERT INTO leads (name, email, company, source, status, score, estimated_value)
SELECT 'Mike Chen', 'mike@retailcorp.com', 'RetailCorp', 'LinkedIn', 'contacted', 72, 8500
WHERE NOT EXISTS (SELECT 1 FROM leads WHERE email = 'mike@retailcorp.com');

INSERT INTO leads (name, email, company, source, status, score, estimated_value)
SELECT 'Emily Rodriguez', 'emily@financeplus.com', 'FinancePlus', 'Referral', 'nurturing', 68, 12000
WHERE NOT EXISTS (SELECT 1 FROM leads WHERE email = 'emily@financeplus.com');

INSERT INTO leads (name, email, company, source, status, score, estimated_value)
SELECT 'David Wilson', 'david@growthco.com', 'GrowthCo', 'Google Ads', 'new', 45, 6000
WHERE NOT EXISTS (SELECT 1 FROM leads WHERE email = 'david@growthco.com');

-- Insert sample affiliates if none exist
INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code)
SELECT 'Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 'SARAH2024'
WHERE NOT EXISTS (SELECT 1 FROM affiliates WHERE email = 'sarah@marketingpro.com');

INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code)
SELECT 'Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 'MIKE2024'
WHERE NOT EXISTS (SELECT 1 FROM affiliates WHERE email = 'mike@digitalboost.com');

INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code)
SELECT 'Emily Rodriguez', 'emily@growthagency.com', 'Growth Agency', 'pending', 'bronze', 10.00, 'EMILY2024'
WHERE NOT EXISTS (SELECT 1 FROM affiliates WHERE email = 'emily@growthagency.com');

-- Insert sample email campaigns if none exist
INSERT INTO email_campaigns (name, subject, content, status, campaign_type, stats)
SELECT 'January Newsletter', 'New Year, New Marketing Strategies', '<h1>Welcome to 2024!</h1><p>Here are our top marketing strategies for the new year...</p>', 'sent', 'newsletter', '{"total_sent": 2500, "delivered": 2450, "opened": 1225, "clicked": 245, "open_rate": 50.0, "click_rate": 10.0}'
WHERE NOT EXISTS (SELECT 1 FROM email_campaigns WHERE name = 'January Newsletter');

INSERT INTO email_campaigns (name, subject, content, status, campaign_type, stats)
SELECT 'Product Launch', 'Introducing Our Revolutionary New Service', '<h1>Big News!</h1><p>We are excited to announce our latest service offering...</p>', 'scheduled', 'promotional', '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "open_rate": 0, "click_rate": 0}'
WHERE NOT EXISTS (SELECT 1 FROM email_campaigns WHERE name = 'Product Launch');

-- Insert sample email templates if none exist
INSERT INTO email_templates (name, category, html_content, is_public)
SELECT 'Welcome Email', 'welcome', '<h1>Welcome to B3ACON!</h1><p>Thank you for joining us. We are excited to help you grow your business.</p>', true
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE name = 'Welcome Email');

INSERT INTO email_templates (name, category, html_content, is_public)
SELECT 'Newsletter Template', 'newsletter', '<h1>Monthly Newsletter</h1><p>Here are this month''s updates and insights...</p>', true
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE name = 'Newsletter Template');

INSERT INTO email_templates (name, category, html_content, is_public)
SELECT 'Promotional Email', 'promotional', '<h1>Special Offer!</h1><p>Don''t miss out on this limited-time offer. Act now!</p>', true
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE name = 'Promotional Email');

-- Insert sample landing pages if none exist
INSERT INTO landing_pages (name, title, slug, status, description)
SELECT 'SaaS Product Launch', 'Revolutionary Project Management Tool', 'saas-launch', 'published', 'Perfect landing page for software launches'
WHERE NOT EXISTS (SELECT 1 FROM landing_pages WHERE slug = 'saas-launch');

INSERT INTO landing_pages (name, title, slug, status, description)
SELECT 'E-commerce Store', 'Premium Fashion Collection', 'fashion-store', 'draft', 'Optimized for online retail'
WHERE NOT EXISTS (SELECT 1 FROM landing_pages WHERE slug = 'fashion-store');

INSERT INTO landing_pages (name, title, slug, status, description)
SELECT 'Agency Services', 'Digital Marketing Excellence', 'agency-services', 'published', 'Showcase your agency capabilities'
WHERE NOT EXISTS (SELECT 1 FROM landing_pages WHERE slug = 'agency-services');

-- Insert sample landing page templates if none exist
INSERT INTO landing_page_templates (name, category, description, is_premium)
SELECT 'SaaS Landing', 'saas', 'Perfect for software and app launches', false
WHERE NOT EXISTS (SELECT 1 FROM landing_page_templates WHERE name = 'SaaS Landing');

INSERT INTO landing_page_templates (name, category, description, is_premium)
SELECT 'E-commerce Store', 'ecommerce', 'Optimized for online stores and products', true
WHERE NOT EXISTS (SELECT 1 FROM landing_page_templates WHERE name = 'E-commerce Store');

INSERT INTO landing_page_templates (name, category, description, is_premium)
SELECT 'Agency Portfolio', 'agency', 'Showcase your agency services and portfolio', false
WHERE NOT EXISTS (SELECT 1 FROM landing_page_templates WHERE name = 'Agency Portfolio');

INSERT INTO landing_page_templates (name, category, description, is_premium)
SELECT 'Event Landing', 'event', 'Perfect for conferences and events', true
WHERE NOT EXISTS (SELECT 1 FROM landing_page_templates WHERE name = 'Event Landing');

-- =============================================
-- 8. Configure OAuth Providers
-- =============================================
-- Note: This requires manual configuration in the Supabase dashboard
-- Go to Authentication > Providers and enable:
-- 1. Google
-- 2. Facebook
-- 3. LinkedIn
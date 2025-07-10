# B3ACON Supabase Database Setup Guide
*Simple, step-by-step instructions*

## 🎯 What We're Doing

We're setting up a Supabase database that will store all your B3ACON data including:
- Client information
- Projects and tasks
- Email campaigns
- Landing pages
- Affiliate tracking
- User accounts

## 📋 Step 1: Create Your Supabase Account

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub** (recommended) or email
4. **Verify your email** if prompted

## 🏗️ Step 2: Create Your Project

1. **Click "New Project"**
2. **Fill out the form:**
   - **Organization**: Create new or select existing
   - **Project Name**: `b3acon-production`
   - **Database Password**: Click "Generate a password" and **SAVE THIS PASSWORD**
   - **Region**: Choose closest to you (e.g., "US East" for North America)
   - **Pricing Plan**: Select "Free" to start

3. **Click "Create new project"**
4. **Wait 2-3 minutes** for setup to complete

## 🔧 Step 3: Set Up Your Database

### 3.1 Open SQL Editor
1. **In your Supabase dashboard**, click **"SQL Editor"** in the left sidebar
2. **Click "New query"**

### 3.2 Run Database Setup Commands

**Copy and paste each section below into the SQL Editor and click "RUN" after each one:**

#### Section A: Enable Extensions
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```
*Click "RUN" and wait for success message*

#### Section B: Create User Types
```sql
-- Create user role types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'specialist', 'client');
CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE lead_status AS ENUM ('new', 'qualified', 'contacted', 'nurturing', 'converted', 'lost');
CREATE TYPE deal_stage AS ENUM ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE activity_type AS ENUM ('email', 'call', 'meeting', 'note', 'task');
```
*Click "RUN" and wait for success message*

#### Section C: Create Core Tables
```sql
-- User profiles table
CREATE TABLE profiles (
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
CREATE TABLE clients (
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
CREATE TABLE leads (
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
CREATE TABLE deals (
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
CREATE TABLE activities (
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
CREATE TABLE projects (
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
```
*Click "RUN" and wait for success message*

#### Section D: Create Affiliate Tables
```sql
-- Affiliates table
CREATE TABLE affiliates (
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
CREATE TABLE affiliate_links (
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
CREATE TABLE affiliate_referrals (
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
CREATE TABLE affiliate_commissions (
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
```
*Click "RUN" and wait for success message*

#### Section E: Create Email Marketing Tables
```sql
-- Email Campaigns table
CREATE TABLE email_campaigns (
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
CREATE TABLE email_lists (
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
CREATE TABLE email_subscribers (
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
CREATE TABLE email_automations (
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
CREATE TABLE email_templates (
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
```
*Click "RUN" and wait for success message*

#### Section F: Create Landing Page Tables
```sql
-- Landing Pages table
CREATE TABLE landing_pages (
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
CREATE TABLE landing_page_templates (
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
CREATE TABLE landing_page_forms (
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
CREATE TABLE form_submissions (
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
```
*Click "RUN" and wait for success message*

#### Section G: Create White Label Table
```sql
-- White Label Partners table
CREATE TABLE white_label_partners (
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
```
*Click "RUN" and wait for success message*

## 🔒 Step 4: Set Up Security

### 4.1 Enable Row Level Security
```sql
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
```
*Click "RUN" and wait for success message*

### 4.2 Create Security Policies
```sql
-- User profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Client policies
CREATE POLICY "Agency users can view clients" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Agency users can manage clients" ON clients FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Clients can view own data" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client' AND company_name = clients.name)
);

-- Lead policies
CREATE POLICY "Agency users can manage leads" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- Deal policies
CREATE POLICY "Agency users can manage deals" ON deals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- Activity policies
CREATE POLICY "Users can manage their activities" ON activities FOR ALL USING (
  auth.uid() = assigned_to OR auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Project policies
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
CREATE POLICY "Agency users can view affiliate data" ON affiliate_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Agency users can manage affiliate referrals" ON affiliate_referrals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Agency users can manage commissions" ON affiliate_commissions FOR ALL USING (
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
```
*Click "RUN" and wait for success message*

## ⚡ Step 5: Create Performance Indexes
```sql
-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_subscription ON clients(subscription_tier);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_client_id ON deals(client_id);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_assigned_to ON activities(assigned_to);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_affiliates_status ON affiliates(status);
CREATE INDEX idx_affiliates_tier ON affiliates(tier);
CREATE INDEX idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX idx_affiliate_links_affiliate_id ON affiliate_links(affiliate_id);
CREATE INDEX idx_affiliate_referrals_affiliate_id ON affiliate_referrals(affiliate_id);
CREATE INDEX idx_affiliate_commissions_affiliate_id ON affiliate_commissions(affiliate_id);
CREATE INDEX idx_email_campaigns_client_id ON email_campaigns(client_id);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_email_lists_client_id ON email_lists(client_id);
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX idx_email_automations_client_id ON email_automations(client_id);
CREATE INDEX idx_landing_pages_client_id ON landing_pages(client_id);
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX idx_landing_pages_status ON landing_pages(status);
CREATE INDEX idx_landing_page_forms_landing_page_id ON landing_page_forms(landing_page_id);
CREATE INDEX idx_form_submissions_form_id ON form_submissions(form_id);
```
*Click "RUN" and wait for success message*

## 🔄 Step 6: Create Update Triggers
```sql
-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
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
```
*Click "RUN" and wait for success message*

## 🔑 Step 7: Get Your API Keys

1. **In your Supabase dashboard**, click **"Settings"** in the left sidebar
2. **Click "API"**
3. **Copy these values** (you'll need them later):

   **Project URL:**
   ```
   https://your-project-ref.supabase.co
   ```

   **Anon (public) key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **Service role key:** (keep this secret!)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## ✅ Step 8: Verify Setup

1. **Go to "Table Editor"** in your Supabase dashboard
2. **You should see all these tables:**
   - profiles
   - clients
   - leads
   - deals
   - activities
   - projects
   - affiliates
   - affiliate_links
   - affiliate_referrals
   - affiliate_commissions
   - email_campaigns
   - email_lists
   - email_subscribers
   - email_automations
   - email_templates
   - landing_pages
   - landing_page_templates
   - landing_page_forms
   - form_submissions
   - white_label_partners

## 🎉 You're Done!

Your Supabase database is now fully set up and ready for B3ACON!

**Next Steps:**
1. Save your API keys somewhere safe
2. Update your application's environment variables
3. Test the connection

**Need Help?**
- Check the Supabase logs if something goes wrong
- Make sure you ran each SQL section completely
- Verify all tables appear in the Table Editor

Your database now supports:
- ✅ User management and authentication
- ✅ Client and project tracking
- ✅ CRM with leads and deals
- ✅ Affiliate marketing system
- ✅ Email marketing campaigns
- ✅ Landing page builder
- ✅ White label capabilities
- ✅ Secure access controls
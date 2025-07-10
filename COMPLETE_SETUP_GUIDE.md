# B3ACON - Complete Setup Guide
*Digital Marketing Command Center - Full Production Deployment*

## 🎯 Overview

This guide will take you through the complete setup of B3ACON, from initial deployment to full production configuration with all integrations.

**Your Current Status:**
- ✅ Application built and ready
- 🔄 Needs deployment and database setup
- ⏳ Integrations to configure

## 📋 Prerequisites

Before starting, ensure you have:
- GitHub account
- Email address for accounts
- Credit card for paid services (most have free tiers)
- 30-60 minutes for complete setup

---

## 🚀 STAGE 1: Deploy to Netlify

### Step 1.1: Create GitHub Repository

1. **Go to [github.com](https://github.com)**
2. **Click "New repository"**
3. **Repository settings:**
   - Name: `b3acon-digital-marketing`
   - Description: `B3ACON Digital Marketing Command Center`
   - Set to **Public**
   - Don't initialize (we have existing code)

4. **Push your code:**
```bash
git init
git add .
git commit -m "Initial B3ACON deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/b3acon-digital-marketing.git
git push -u origin main
```

### Step 1.2: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login with GitHub**
3. **Click "Add new site" > "Import an existing project"**
4. **Connect to GitHub** and select your `b3acon-digital-marketing` repository
5. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`
6. **Click "Deploy site"**

**Your site will be live at:** `https://random-name-123456.netlify.app`

### Step 1.3: Custom Domain (Optional)

1. **Buy domain** (recommended: `youragency.com`)
2. **In Netlify:** Site settings > Domain management > Add custom domain
3. **Configure DNS** at your domain provider:
   - Add CNAME record: `www` → `your-netlify-site.netlify.app`
   - Add A record: `@` → `75.2.60.5`

---

## 🗄️ STAGE 2: Set Up Supabase Database

### Step 2.1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up with GitHub**
3. **Create new project:**
   - Name: `b3acon-production`
   - Database password: Generate strong password (save it!)
   - Region: Choose closest to your users
   - Plan: Start with Free tier

### Step 2.2: Configure Database Schema

**Go to SQL Editor in Supabase and run these commands:**

#### A. Enable Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

#### B. Create Custom Types
```sql
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'specialist', 'client');
CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE lead_status AS ENUM ('new', 'qualified', 'contacted', 'nurturing', 'converted', 'lost');
CREATE TYPE deal_stage AS ENUM ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE activity_type AS ENUM ('email', 'call', 'meeting', 'note', 'task');
```

#### C. Core Tables
```sql
-- Profiles table (extends Supabase auth.users)
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

#### D. Affiliate Marketing Tables
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

#### E. Email Marketing Tables
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

#### F. Landing Page Tables
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

#### G. White Label Tables
```sql
-- White Label Partners table
CREATE TABLE white_label_partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
```

### Step 2.3: Enable Row Level Security
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

-- Create essential RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Agency users can view clients" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);
CREATE POLICY "Agency users can manage clients" ON clients FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Clients can view own data" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client' AND company_name = clients.name)
);

CREATE POLICY "Agency users can manage leads" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

CREATE POLICY "Agency users can manage deals" ON deals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'specialist'))
);

CREATE POLICY "Users can manage their activities" ON activities FOR ALL USING (
  auth.uid() = assigned_to OR auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

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

CREATE POLICY "Admins can manage white label partners" ON white_label_partners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

### Step 2.4: Create Performance Indexes
```sql
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

### Step 2.5: Create Update Triggers
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

### Step 2.6: Get Your API Keys

1. **Go to Project Settings > API** in Supabase
2. **Copy these values:**
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🔗 STAGE 3: Connect Netlify to Supabase

### Step 3.1: Add Environment Variables to Netlify

1. **Go to your Netlify dashboard**
2. **Find your B3ACON site**
3. **Go to Site settings > Environment variables**
4. **Add these variables:**

```env
VITE_APP_NAME=B3ACON
VITE_APP_ENV=production
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3.2: Redeploy Site

1. **Go to Deploys tab**
2. **Click "Trigger deploy" > "Deploy site"**
3. **Wait for deployment to complete**

---

## 🔐 STAGE 4: Set Up Authentication

### Step 4.1: Configure Supabase Auth

1. **In Supabase: Authentication > Settings**
2. **Site URL**: `https://your-netlify-site.netlify.app`
3. **Redirect URLs**: Add your Netlify URL
4. **Email templates**: Customize if needed
5. **Enable email confirmations**: Recommended for production

### Step 4.2: Create Admin User

1. **Go to Authentication > Users in Supabase**
2. **Click "Add user"**
3. **Create your admin account:**
   - Email: `your-email@domain.com`
   - Password: Strong password
   - Email confirmed: ✅ Yes
4. **After creation, go to SQL Editor and run:**

```sql
-- Set your user as admin
UPDATE profiles 
SET role = 'admin', full_name = 'Your Name', company_name = 'Your Agency'
WHERE email = 'your-email@domain.com';
```

---

## 📊 STAGE 5: Add Sample Data

### Step 5.1: Create Sample Clients
```sql
-- Insert sample clients
INSERT INTO clients (name, email, subscription_tier, monthly_value, services) VALUES
('TechCorp Solutions', 'contact@techcorp.com', 'enterprise', 8500, '["SEO", "Social Media", "PPC", "Amazon", "CRM"]'),
('RetailMax Inc', 'hello@retailmax.com', 'professional', 4200, '["SEO", "PPC", "Social Media"]'),
('FinanceFlow', 'team@financeflow.com', 'professional', 3800, '["SEO", "CRM"]'),
('EcomStore', 'support@ecomstore.com', 'professional', 5200, '["Amazon", "PPC", "Social Media"]');
```

### Step 5.2: Create Sample Leads
```sql
-- Insert sample leads
INSERT INTO leads (name, email, company, source, status, score, estimated_value) VALUES
('Sarah Johnson', 'sarah@techstartup.com', 'TechStartup Inc', 'Website', 'qualified', 85, 15000),
('Mike Chen', 'mike@retailcorp.com', 'RetailCorp', 'LinkedIn', 'contacted', 72, 8500),
('Emily Rodriguez', 'emily@financeplus.com', 'FinancePlus', 'Referral', 'nurturing', 68, 12000);
```

### Step 5.3: Create Sample Affiliates
```sql
-- Insert sample affiliates
INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code) VALUES
('Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 'SARAH2024'),
('Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 'MIKE2024'),
('Emily Rodriguez', 'emily@growthagency.com', 'Growth Agency', 'pending', 'bronze', 10.00, 'EMILY2024');
```

### Step 5.4: Create Sample Email Templates
```sql
-- Insert sample email templates
INSERT INTO email_templates (name, category, html_content, is_public) VALUES
('Welcome Email', 'welcome', '<h1>Welcome to B3ACON!</h1><p>Thank you for joining us.</p>', true),
('Newsletter Template', 'newsletter', '<h1>Monthly Newsletter</h1><p>Here are this month''s updates...</p>', true),
('Promotional Email', 'promotional', '<h1>Special Offer!</h1><p>Don''t miss out on this limited-time offer.</p>', true);
```

### Step 5.5: Create Sample Landing Page Templates
```sql
-- Insert sample landing page templates
INSERT INTO landing_page_templates (name, category, description, content, is_premium) VALUES
('SaaS Landing', 'saas', 'Perfect for software and app launches', '{"sections": [{"type": "hero", "content": {"headline": "Revolutionary SaaS Solution", "subheadline": "Transform your business today"}}], "global_styles": {}}', false),
('Agency Portfolio', 'agency', 'Showcase your agency services', '{"sections": [{"type": "hero", "content": {"headline": "Digital Marketing Excellence", "subheadline": "We grow your business"}}], "global_styles": {}}', false),
('E-commerce Store', 'ecommerce', 'Optimized for online stores', '{"sections": [{"type": "hero", "content": {"headline": "Premium Products", "subheadline": "Shop the best selection"}}], "global_styles": {}}', true);
```

---

## 🔌 STAGE 6: Set Up Integrations (Optional)

### Google Services
1. **Go to [console.cloud.google.com](https://console.cloud.google.com)**
2. **Create new project: "B3ACON Production"**
3. **Enable APIs:** Search Console, Analytics, Ads, My Business
4. **Create credentials and add to Netlify environment variables**

### Email Marketing Providers
1. **Klaviyo**: Get API key from account settings
2. **Constant Contact**: Create app and get API credentials
3. **Add to Netlify environment variables**

### Social Media APIs
1. **Facebook/Meta**: Create app at developers.facebook.com
2. **LinkedIn**: Create app at developer.linkedin.com
3. **Add credentials to Netlify environment variables**

---

## ✅ STAGE 7: Final Testing

### Step 7.1: Test Authentication
1. **Visit your live site**
2. **Try logging in with your admin credentials**
3. **Verify you can access agency dashboard**

### Step 7.2: Test Core Features
1. **Create a test client**
2. **Add a test lead**
3. **Create a test affiliate**
4. **Test email campaign creation**
5. **Test landing page builder**

### Step 7.3: Test Client Portal
1. **Create a client user in Supabase Auth**
2. **Set their role to 'client' in profiles table**
3. **Test client login and dashboard access**

---

## 🚀 PRODUCTION CHECKLIST

### Security
- ✅ RLS policies enabled
- ✅ Environment variables secured
- ✅ HTTPS enabled (automatic with Netlify)
- ✅ Database backups enabled (Supabase Pro)

### Performance
- ✅ Database indexes created
- ✅ CDN enabled (automatic with Netlify)
- ✅ Image optimization
- ✅ Code splitting

### Monitoring
- ✅ Error tracking (consider Sentry)
- ✅ Analytics (Google Analytics)
- ✅ Uptime monitoring
- ✅ Database monitoring (Supabase dashboard)

### Backup & Recovery
- ✅ Database backups (Supabase automatic)
- ✅ Code repository (GitHub)
- ✅ Environment variables documented
- ✅ Recovery procedures documented

---

## 💰 ESTIMATED COSTS

### Monthly Operating Costs:
- **Netlify Pro**: $19/month (optional, free tier available)
- **Supabase Pro**: $25/month (recommended for production)
- **Domain**: $1-2/month
- **Google APIs**: $0-50/month (usage-based)
- **Email providers**: $20-100/month (based on volume)

**Total: ~$65-200/month** depending on usage and features

---

## 🎯 NEXT STEPS

After completing this setup:

1. **Customize branding** and colors
2. **Add your real client data**
3. **Configure email marketing integrations**
4. **Set up Google API connections**
5. **Create landing page templates**
6. **Train your team** on the platform
7. **Launch to clients**

---

## 🆘 TROUBLESHOOTING

### Common Issues:

**Database Connection Errors:**
- Verify environment variables in Netlify
- Check Supabase project status
- Ensure RLS policies are correct

**Authentication Issues:**
- Check Supabase Auth settings
- Verify redirect URLs
- Ensure user has correct role in profiles table

**Performance Issues:**
- Check database indexes
- Monitor Supabase dashboard
- Optimize queries if needed

**Deployment Issues:**
- Check build logs in Netlify
- Verify all environment variables are set
- Ensure no TypeScript errors

---

## 📞 SUPPORT

If you encounter issues:

1. **Check the browser console** for JavaScript errors
2. **Review Supabase logs** for database issues
3. **Check Netlify deploy logs** for build issues
4. **Verify all environment variables** are correctly set

Your B3ACON platform is now ready for production use! 🎉

**Live URLs:**
- **Application**: Your Netlify URL
- **Database**: Your Supabase dashboard
- **Repository**: Your GitHub repo

Congratulations on deploying your complete digital marketing command center!
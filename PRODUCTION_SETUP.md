# B3ACON Production Setup Guide
*Complete step-by-step production deployment*

## 🎯 Overview

Your B3ACON application is ready for production! This guide will take you through:
1. Setting up a production Supabase database
2. Deploying to Netlify with proper environment variables
3. Configuring authentication
4. Setting up integrations
5. Going live

---

## 🗄️ STEP 1: Create Production Supabase Database

### 1.1 Create New Supabase Project
1. **Go to [supabase.com](https://supabase.com)**
2. **Sign in/Sign up** with GitHub (recommended)
3. **Click "New Project"**
4. **Project Settings:**
   - **Name**: `b3acon-production`
   - **Database Password**: Generate strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Plan**: Start with Free tier (can upgrade later)
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for setup to complete

### 1.2 Set Up Database Schema
1. **Go to SQL Editor** in your Supabase dashboard
2. **Click "New Query"**
3. **Run each section below** (copy/paste and click "RUN"):

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

#### C. Create Core Tables
```sql
-- Profiles table
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

-- Continue with remaining tables...
-- (Copy the complete schema from SUPABASE_SETUP_GUIDE.md)
```

### 1.3 Get Your API Keys
1. **Go to Settings > API** in Supabase
2. **Copy these values:**
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🚀 STEP 2: Deploy to Netlify

### 2.1 Create GitHub Repository
1. **Go to [github.com](https://github.com)**
2. **Click "New repository"**
3. **Repository settings:**
   - Name: `b3acon-production`
   - Description: `B3ACON Digital Marketing Command Center`
   - Set to **Public** or **Private**
   - Don't initialize (we have existing code)

### 2.2 Push Your Code
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial B3ACON production deployment"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/b3acon-production.git

# Push to GitHub
git push -u origin main
```

### 2.3 Deploy to Netlify
1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login with GitHub**
3. **Click "Add new site" > "Import an existing project"**
4. **Connect to GitHub** and select your repository
5. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`
6. **Click "Deploy site"**

### 2.4 Add Environment Variables
1. **In Netlify dashboard**, go to **Site settings > Environment variables**
2. **Add these variables:**

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. **Click "Save"**
4. **Go to Deploys tab** and click **"Trigger deploy"**

---

## 🔐 STEP 3: Set Up Authentication

### 3.1 Configure Supabase Auth
1. **In Supabase: Authentication > Settings**
2. **Site URL**: `https://your-netlify-site.netlify.app`
3. **Redirect URLs**: Add your Netlify URL
4. **Email templates**: Customize if needed

### 3.2 Create Admin User
1. **Go to Authentication > Users** in Supabase
2. **Click "Add user"**
3. **Create admin account:**
   - Email: `your-email@domain.com`
   - Password: Strong password
   - Email confirmed: ✅ Yes

4. **After creation, go to SQL Editor:**
```sql
-- Set your user as admin
UPDATE profiles 
SET role = 'admin', full_name = 'Your Name', company_name = 'Your Agency'
WHERE email = 'your-email@domain.com';
```

---

## 📊 STEP 4: Add Sample Data

Run this in your Supabase SQL Editor:

```sql
-- Insert sample clients
INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry) VALUES
('TechCorp Solutions', 'contact@techcorp.com', 'enterprise', 8500, '["SEO", "Social Media", "PPC"]'::jsonb, 'Technology'),
('RetailMax Inc', 'hello@retailmax.com', 'professional', 4200, '["SEO", "PPC"]'::jsonb, 'Retail'),
('FinanceFlow', 'team@financeflow.com', 'professional', 3800, '["SEO", "CRM"]'::jsonb, 'Finance');

-- Insert sample leads
INSERT INTO leads (name, email, company, source, status, score, estimated_value) VALUES
('Sarah Johnson', 'sarah@techstartup.com', 'TechStartup Inc', 'Website', 'qualified', 85, 15000),
('Mike Chen', 'mike@retailcorp.com', 'RetailCorp', 'LinkedIn', 'contacted', 72, 8500);

-- Insert sample affiliates
INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code) VALUES
('Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 'SARAH2024'),
('Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 'MIKE2024');
```

---

## 🔌 STEP 5: Set Up Integrations (Optional)

### Google Services
1. **Go to [console.cloud.google.com](https://console.cloud.google.com)**
2. **Create project: "B3ACON Production"**
3. **Enable APIs:** Analytics, Search Console, Ads
4. **Create credentials**
5. **Add to Netlify environment variables**

### Email Marketing
1. **Klaviyo**: Get API key from account settings
2. **Constant Contact**: Create app and get credentials
3. **Add to environment variables**

---

## ✅ STEP 6: Final Testing

### 6.1 Test Your Live Site
1. **Visit your Netlify URL**
2. **Try logging in with your admin credentials**
3. **Test all modules:**
   - Client Management
   - CRM Hub
   - Affiliate Marketing
   - Email Marketing
   - Landing Page Builder

### 6.2 Create Test Client User
1. **In Supabase Auth**, create client user
2. **Set role to 'client' in profiles table**
3. **Test client portal access**

---

## 🎯 PRODUCTION CHECKLIST

### Security ✅
- [x] RLS policies enabled
- [x] Environment variables secured
- [x] HTTPS enabled (automatic with Netlify)
- [x] Database backups enabled

### Performance ✅
- [x] Database indexes created
- [x] CDN enabled (automatic with Netlify)
- [x] Code splitting implemented

### Monitoring 📊
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure Google Analytics
- [ ] Set up uptime monitoring
- [ ] Monitor database performance

---

## 💰 ESTIMATED COSTS

### Monthly Operating Costs:
- **Netlify**: Free tier (or $19/month for Pro)
- **Supabase**: Free tier (or $25/month for Pro)
- **Domain**: $1-2/month (optional)
- **Integrations**: $20-100/month (based on usage)

**Total: $0-150/month** depending on features and scale

---

## 🚀 NEXT STEPS

After production setup:

1. **Customize branding** and agency colors
2. **Add your real client data**
3. **Configure email marketing integrations**
4. **Set up Google API connections**
5. **Create landing page templates**
6. **Train your team** on the platform
7. **Launch to clients**

---

## 🆘 TROUBLESHOOTING

### Common Issues:

**Build Errors:**
- Check environment variables are set correctly
- Verify Node.js version (use 18+)
- Check for TypeScript errors

**Database Connection:**
- Verify Supabase URL and key
- Check RLS policies
- Ensure tables exist

**Authentication Issues:**
- Check redirect URLs in Supabase
- Verify user roles in profiles table

---

## 📞 SUPPORT

Your B3ACON platform is now production-ready! 🎉

**Live URLs:**
- **Application**: Your Netlify URL
- **Database**: Your Supabase dashboard
- **Repository**: Your GitHub repo

Congratulations on deploying your complete digital marketing command center!
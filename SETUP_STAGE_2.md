# B3ACON - Stage 2: Add Sample Data & Test Connection

## 🎯 Current Status
Your B3ACON application is deployed at: https://ubiquitous-gecko-278c72.netlify.app

Now we need to:
1. ✅ Test database connection
2. ✅ Add sample data
3. ✅ Verify everything works

## 📊 Step 1: Add Sample Data to Your Database

Go to your **Supabase SQL Editor** and run these commands to add sample data:

### Sample Clients
```sql
-- Insert sample clients
INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website) VALUES
('TechCorp Solutions', 'contact@techcorp.com', 'enterprise', 8500, '["SEO", "Social Media", "PPC", "Amazon", "CRM"]', 'Technology', 'https://techcorp.com'),
('RetailMax Inc', 'hello@retailmax.com', 'professional', 4200, '["SEO", "PPC", "Social Media"]', 'Retail', 'https://retailmax.com'),
('FinanceFlow', 'team@financeflow.com', 'professional', 3800, '["SEO", "CRM"]', 'Finance', 'https://financeflow.com'),
('EcomStore', 'support@ecomstore.com', 'professional', 5200, '["Amazon", "PPC", "Social Media"]', 'E-commerce', 'https://ecomstore.com');
```

### Sample Leads
```sql
-- Insert sample leads
INSERT INTO leads (name, email, company, source, status, score, estimated_value) VALUES
('Sarah Johnson', 'sarah@techstartup.com', 'TechStartup Inc', 'Website', 'qualified', 85, 15000),
('Mike Chen', 'mike@retailcorp.com', 'RetailCorp', 'LinkedIn', 'contacted', 72, 8500),
('Emily Rodriguez', 'emily@financeplus.com', 'FinancePlus', 'Referral', 'nurturing', 68, 12000),
('David Wilson', 'david@growthco.com', 'GrowthCo', 'Google Ads', 'new', 45, 6000);
```

### Sample Affiliates
```sql
-- Insert sample affiliates
INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code) VALUES
('Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 'SARAH2024'),
('Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 'MIKE2024'),
('Emily Rodriguez', 'emily@growthagency.com', 'Growth Agency', 'pending', 'bronze', 10.00, 'EMILY2024');
```

### Sample Email Campaigns
```sql
-- Insert sample email campaigns
INSERT INTO email_campaigns (name, subject, content, status, campaign_type, stats) VALUES
('January Newsletter', 'New Year, New Marketing Strategies', '<h1>Welcome to 2024!</h1><p>Here are our top marketing strategies for the new year...</p>', 'sent', 'newsletter', '{"total_sent": 2500, "delivered": 2450, "opened": 1225, "clicked": 245, "open_rate": 50.0, "click_rate": 10.0}'),
('Product Launch', 'Introducing Our Revolutionary New Service', '<h1>Big News!</h1><p>We are excited to announce our latest service offering...</p>', 'scheduled', 'promotional', '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "open_rate": 0, "click_rate": 0}');
```

### Sample Email Templates
```sql
-- Insert sample email templates
INSERT INTO email_templates (name, category, html_content, is_public) VALUES
('Welcome Email', 'welcome', '<h1>Welcome to B3ACON!</h1><p>Thank you for joining us. We are excited to help you grow your business.</p>', true),
('Newsletter Template', 'newsletter', '<h1>Monthly Newsletter</h1><p>Here are this month''s updates and insights...</p>', true),
('Promotional Email', 'promotional', '<h1>Special Offer!</h1><p>Don''t miss out on this limited-time offer. Act now!</p>', true);
```

### Sample Landing Pages
```sql
-- Insert sample landing pages
INSERT INTO landing_pages (name, title, slug, status, description) VALUES
('SaaS Product Launch', 'Revolutionary Project Management Tool', 'saas-launch', 'published', 'Perfect landing page for software launches'),
('E-commerce Store', 'Premium Fashion Collection', 'fashion-store', 'draft', 'Optimized for online retail'),
('Agency Services', 'Digital Marketing Excellence', 'agency-services', 'published', 'Showcase your agency capabilities');
```

### Sample Landing Page Templates
```sql
-- Insert sample landing page templates
INSERT INTO landing_page_templates (name, category, description, is_premium) VALUES
('SaaS Landing', 'saas', 'Perfect for software and app launches', false),
('E-commerce Store', 'ecommerce', 'Optimized for online stores and products', true),
('Agency Portfolio', 'agency', 'Showcase your agency services and portfolio', false),
('Event Landing', 'event', 'Perfect for conferences and events', true);
```

## 🔧 Step 2: Test Database Connection

After adding the sample data, let's test the connection:

1. **Open your live site**: https://ubiquitous-gecko-278c72.netlify.app
2. **Try logging in** with these credentials:
   - **Agency Login**: sarah@sparkdigital.com / password
   - **Client Login**: john@techcorp.com / password

3. **Check the browser console** (F12) for any connection errors

## ✅ Step 3: Verify Data Loading

Once logged in, you should be able to:

1. **Navigate to different modules** (even if sidebar has display issues)
2. **See sample data** in:
   - Client Management
   - CRM Hub (leads)
   - Affiliate Marketing
   - Email Marketing
   - Landing Page Builder

## 🔍 Step 4: Troubleshooting

If you see connection errors:

1. **Check environment variables** in Netlify:
   - Go to Site settings > Environment variables
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly

2. **Check Supabase project status**:
   - Make sure your Supabase project is active
   - Verify the database URL and keys are correct

3. **Check browser console** for specific error messages

## 🚀 Next Steps

Once the database connection is working:

1. **Stage 3**: Set up authentication with real Supabase auth
2. **Stage 4**: Configure email marketing integrations
3. **Stage 5**: Set up Google API connections
4. **Stage 6**: Deploy to production domain

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify all SQL commands ran successfully
3. Confirm environment variables are set correctly
4. Test the Supabase connection in the dashboard

Let me know when you've completed this stage and we'll move to the next step!
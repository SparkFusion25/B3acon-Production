/*
# B3ACON Sample Data Migration

This migration adds sample data for demonstration purposes:

1. Sample Clients
   - TechCorp Solutions (Enterprise)
   - RetailMax Inc (Professional) 
   - FinanceFlow (Professional)
   - EcomStore (Professional)

2. Sample Leads
   - Various leads in different stages
   - Assigned to different sources

3. Sample Affiliates
   - Different tiers and commission rates
   - Active and pending statuses

4. Sample Email Campaigns
   - Newsletter and promotional campaigns
   - With realistic engagement stats

5. Sample Email Templates
   - Welcome, newsletter, and promotional templates

6. Sample Landing Pages
   - SaaS, e-commerce, and agency pages

7. Sample Landing Page Templates
   - Various categories and premium options

All inserts use conditional logic to avoid duplicates.
*/

-- Insert sample clients
DO $$
BEGIN
  -- TechCorp Solutions
  IF NOT EXISTS (SELECT 1 FROM clients WHERE email = 'contact@techcorp.com') THEN
    INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website) VALUES
    ('TechCorp Solutions', 'contact@techcorp.com', 'enterprise', 8500, '["SEO", "Social Media", "PPC", "Amazon", "CRM"]'::jsonb, 'Technology', 'https://techcorp.com');
  END IF;
  
  -- RetailMax Inc
  IF NOT EXISTS (SELECT 1 FROM clients WHERE email = 'hello@retailmax.com') THEN
    INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website) VALUES
    ('RetailMax Inc', 'hello@retailmax.com', 'professional', 4200, '["SEO", "PPC", "Social Media"]'::jsonb, 'Retail', 'https://retailmax.com');
  END IF;
  
  -- FinanceFlow
  IF NOT EXISTS (SELECT 1 FROM clients WHERE email = 'team@financeflow.com') THEN
    INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website) VALUES
    ('FinanceFlow', 'team@financeflow.com', 'professional', 3800, '["SEO", "CRM"]'::jsonb, 'Finance', 'https://financeflow.com');
  END IF;
  
  -- EcomStore
  IF NOT EXISTS (SELECT 1 FROM clients WHERE email = 'support@ecomstore.com') THEN
    INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website) VALUES
    ('EcomStore', 'support@ecomstore.com', 'professional', 5200, '["Amazon", "PPC", "Social Media"]'::jsonb, 'E-commerce', 'https://ecomstore.com');
  END IF;
END $$;

-- Insert sample leads
DO $$
BEGIN
  -- Sarah Johnson
  IF NOT EXISTS (SELECT 1 FROM leads WHERE email = 'sarah@techstartup.com') THEN
    INSERT INTO leads (name, email, company, source, status, score, estimated_value) VALUES
    ('Sarah Johnson', 'sarah@techstartup.com', 'TechStartup Inc', 'Website', 'qualified', 85, 15000);
  END IF;
  
  -- Mike Chen
  IF NOT EXISTS (SELECT 1 FROM leads WHERE email = 'mike@retailcorp.com') THEN
    INSERT INTO leads (name, email, company, source, status, score, estimated_value) VALUES
    ('Mike Chen', 'mike@retailcorp.com', 'RetailCorp', 'LinkedIn', 'contacted', 72, 8500);
  END IF;
  
  -- Emily Rodriguez
  IF NOT EXISTS (SELECT 1 FROM leads WHERE email = 'emily@financeplus.com') THEN
    INSERT INTO leads (name, email, company, source, status, score, estimated_value) VALUES
    ('Emily Rodriguez', 'emily@financeplus.com', 'FinancePlus', 'Referral', 'nurturing', 68, 12000);
  END IF;
  
  -- David Wilson
  IF NOT EXISTS (SELECT 1 FROM leads WHERE email = 'david@growthco.com') THEN
    INSERT INTO leads (name, email, company, source, status, score, estimated_value) VALUES
    ('David Wilson', 'david@growthco.com', 'GrowthCo', 'Google Ads', 'new', 45, 6000);
  END IF;
END $$;

-- Insert sample affiliates
DO $$
BEGIN
  -- Sarah Johnson (Marketing Pro)
  IF NOT EXISTS (SELECT 1 FROM affiliates WHERE email = 'sarah@marketingpro.com') THEN
    INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code) VALUES
    ('Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 'SARAH2024');
  END IF;
  
  -- Mike Chen (Digital Boost)
  IF NOT EXISTS (SELECT 1 FROM affiliates WHERE email = 'mike@digitalboost.com') THEN
    INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code) VALUES
    ('Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 'MIKE2024');
  END IF;
  
  -- Emily Rodriguez (Growth Agency)
  IF NOT EXISTS (SELECT 1 FROM affiliates WHERE email = 'emily@growthagency.com') THEN
    INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code) VALUES
    ('Emily Rodriguez', 'emily@growthagency.com', 'Growth Agency', 'pending', 'bronze', 10.00, 'EMILY2024');
  END IF;
END $$;

-- Insert sample email campaigns
DO $$
BEGIN
  -- January Newsletter
  IF NOT EXISTS (SELECT 1 FROM email_campaigns WHERE name = 'January Newsletter') THEN
    INSERT INTO email_campaigns (name, subject, content, status, campaign_type, stats) VALUES
    ('January Newsletter', 'New Year, New Marketing Strategies', '<h1>Welcome to 2024!</h1><p>Here are our top marketing strategies for the new year...</p>', 'sent', 'newsletter', '{"total_sent": 2500, "delivered": 2450, "opened": 1225, "clicked": 245, "open_rate": 50.0, "click_rate": 10.0}'::jsonb);
  END IF;
  
  -- Product Launch
  IF NOT EXISTS (SELECT 1 FROM email_campaigns WHERE name = 'Product Launch') THEN
    INSERT INTO email_campaigns (name, subject, content, status, campaign_type, stats) VALUES
    ('Product Launch', 'Introducing Our Revolutionary New Service', '<h1>Big News!</h1><p>We are excited to announce our latest service offering...</p>', 'scheduled', 'promotional', '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "open_rate": 0, "click_rate": 0}'::jsonb);
  END IF;
END $$;

-- Insert sample email templates
DO $$
BEGIN
  -- Welcome Email
  IF NOT EXISTS (SELECT 1 FROM email_templates WHERE name = 'Welcome Email') THEN
    INSERT INTO email_templates (name, category, html_content, is_public) VALUES
    ('Welcome Email', 'welcome', '<h1>Welcome to B3ACON!</h1><p>Thank you for joining us. We are excited to help you grow your business.</p>', true);
  END IF;
  
  -- Newsletter Template
  IF NOT EXISTS (SELECT 1 FROM email_templates WHERE name = 'Newsletter Template') THEN
    INSERT INTO email_templates (name, category, html_content, is_public) VALUES
    ('Newsletter Template', 'newsletter', '<h1>Monthly Newsletter</h1><p>Here are this month''s updates and insights...</p>', true);
  END IF;
  
  -- Promotional Email
  IF NOT EXISTS (SELECT 1 FROM email_templates WHERE name = 'Promotional Email') THEN
    INSERT INTO email_templates (name, category, html_content, is_public) VALUES
    ('Promotional Email', 'promotional', '<h1>Special Offer!</h1><p>Don''t miss out on this limited-time offer. Act now!</p>', true);
  END IF;
END $$;

-- Insert sample landing pages
DO $$
BEGIN
  -- SaaS Product Launch
  IF NOT EXISTS (SELECT 1 FROM landing_pages WHERE slug = 'saas-launch') THEN
    INSERT INTO landing_pages (name, title, slug, status, description) VALUES
    ('SaaS Product Launch', 'Revolutionary Project Management Tool', 'saas-launch', 'published', 'Perfect landing page for software launches');
  END IF;
  
  -- E-commerce Store
  IF NOT EXISTS (SELECT 1 FROM landing_pages WHERE slug = 'fashion-store') THEN
    INSERT INTO landing_pages (name, title, slug, status, description) VALUES
    ('E-commerce Store', 'Premium Fashion Collection', 'fashion-store', 'draft', 'Optimized for online retail');
  END IF;
  
  -- Agency Services
  IF NOT EXISTS (SELECT 1 FROM landing_pages WHERE slug = 'agency-services') THEN
    INSERT INTO landing_pages (name, title, slug, status, description) VALUES
    ('Agency Services', 'Digital Marketing Excellence', 'agency-services', 'published', 'Showcase your agency capabilities');
  END IF;
END $$;

-- Insert sample landing page templates
DO $$
BEGIN
  -- SaaS Landing
  IF NOT EXISTS (SELECT 1 FROM landing_page_templates WHERE name = 'SaaS Landing') THEN
    INSERT INTO landing_page_templates (name, category, description, is_premium) VALUES
    ('SaaS Landing', 'saas', 'Perfect for software and app launches', false);
  END IF;
  
  -- E-commerce Store Template
  IF NOT EXISTS (SELECT 1 FROM landing_page_templates WHERE name = 'E-commerce Store') THEN
    INSERT INTO landing_page_templates (name, category, description, is_premium) VALUES
    ('E-commerce Store', 'ecommerce', 'Optimized for online stores and products', true);
  END IF;
  
  -- Agency Portfolio
  IF NOT EXISTS (SELECT 1 FROM landing_page_templates WHERE name = 'Agency Portfolio') THEN
    INSERT INTO landing_page_templates (name, category, description, is_premium) VALUES
    ('Agency Portfolio', 'agency', 'Showcase your agency services and portfolio', false);
  END IF;
  
  -- Event Landing
  IF NOT EXISTS (SELECT 1 FROM landing_page_templates WHERE name = 'Event Landing') THEN
    INSERT INTO landing_page_templates (name, category, description, is_premium) VALUES
    ('Event Landing', 'event', 'Perfect for conferences and events', true);
  END IF;
END $$;
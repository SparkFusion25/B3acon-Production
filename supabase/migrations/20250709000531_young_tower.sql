/*
  # Add Sample Data for B3ACON

  1. New Data
    - Sample clients with different subscription tiers
    - Sample leads in various stages
    - Sample affiliates with different tiers
    - Sample email campaigns and templates
    - Sample landing pages and templates

  2. Safety
    - Uses ON CONFLICT DO NOTHING to avoid duplicate errors
    - Only adds data if it doesn't already exist
    - Safe to run multiple times

  3. Data Added
    - 4 sample clients (TechCorp, RetailMax, FinanceFlow, EcomStore)
    - 4 sample leads in different stages
    - 3 sample affiliates with different tiers
    - 2 sample email campaigns
    - 3 sample email templates
    - 3 sample landing pages
    - 4 sample landing page templates
*/

-- Insert sample clients (only if they don't exist)
INSERT INTO clients (name, email, subscription_tier, monthly_value, services, industry, website) VALUES
('TechCorp Solutions', 'contact@techcorp.com', 'enterprise', 8500, '["SEO", "Social Media", "PPC", "Amazon", "CRM"]'::jsonb, 'Technology', 'https://techcorp.com'),
('RetailMax Inc', 'hello@retailmax.com', 'professional', 4200, '["SEO", "PPC", "Social Media"]'::jsonb, 'Retail', 'https://retailmax.com'),
('FinanceFlow', 'team@financeflow.com', 'professional', 3800, '["SEO", "CRM"]'::jsonb, 'Finance', 'https://financeflow.com'),
('EcomStore', 'support@ecomstore.com', 'professional', 5200, '["Amazon", "PPC", "Social Media"]'::jsonb, 'E-commerce', 'https://ecomstore.com')
ON CONFLICT (email) DO NOTHING;

-- Insert sample leads (only if they don't exist)
INSERT INTO leads (name, email, company, source, status, score, estimated_value) VALUES
('Sarah Johnson', 'sarah@techstartup.com', 'TechStartup Inc', 'Website', 'qualified', 85, 15000),
('Mike Chen', 'mike@retailcorp.com', 'RetailCorp', 'LinkedIn', 'contacted', 72, 8500),
('Emily Rodriguez', 'emily@financeplus.com', 'FinancePlus', 'Referral', 'nurturing', 68, 12000),
('David Wilson', 'david@growthco.com', 'GrowthCo', 'Google Ads', 'new', 45, 6000)
ON CONFLICT DO NOTHING;

-- Insert sample affiliates (only if they don't exist)
INSERT INTO affiliates (name, email, company, status, tier, commission_rate, referral_code) VALUES
('Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 'SARAH2024'),
('Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 'MIKE2024'),
('Emily Rodriguez', 'emily@growthagency.com', 'Growth Agency', 'pending', 'bronze', 10.00, 'EMILY2024')
ON CONFLICT (email) DO NOTHING;

-- Insert sample email campaigns (only if they don't exist)
INSERT INTO email_campaigns (name, subject, content, status, campaign_type, stats) VALUES
('January Newsletter', 'New Year, New Marketing Strategies', '<h1>Welcome to 2024!</h1><p>Here are our top marketing strategies for the new year...</p>', 'sent', 'newsletter', '{"total_sent": 2500, "delivered": 2450, "opened": 1225, "clicked": 245, "open_rate": 50.0, "click_rate": 10.0}'::jsonb),
('Product Launch', 'Introducing Our Revolutionary New Service', '<h1>Big News!</h1><p>We are excited to announce our latest service offering...</p>', 'scheduled', 'promotional', '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "open_rate": 0, "click_rate": 0}'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert sample email templates (only if they don't exist)
INSERT INTO email_templates (name, category, html_content, is_public) VALUES
('Welcome Email', 'welcome', '<h1>Welcome to B3ACON!</h1><p>Thank you for joining us. We are excited to help you grow your business.</p>', true),
('Newsletter Template', 'newsletter', '<h1>Monthly Newsletter</h1><p>Here are this month''s updates and insights...</p>', true),
('Promotional Email', 'promotional', '<h1>Special Offer!</h1><p>Don''t miss out on this limited-time offer. Act now!</p>', true)
ON CONFLICT DO NOTHING;

-- Insert sample landing pages (only if they don't exist)
INSERT INTO landing_pages (name, title, slug, status, description) VALUES
('SaaS Product Launch', 'Revolutionary Project Management Tool', 'saas-launch', 'published', 'Perfect landing page for software launches'),
('E-commerce Store', 'Premium Fashion Collection', 'fashion-store', 'draft', 'Optimized for online retail'),
('Agency Services', 'Digital Marketing Excellence', 'agency-services', 'published', 'Showcase your agency capabilities')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample landing page templates (only if they don't exist)
INSERT INTO landing_page_templates (name, category, description, is_premium) VALUES
('SaaS Landing', 'saas', 'Perfect for software and app launches', false),
('E-commerce Store', 'ecommerce', 'Optimized for online stores and products', true),
('Agency Portfolio', 'agency', 'Showcase your agency services and portfolio', false),
('Event Landing', 'event', 'Perfect for conferences and events', true)
ON CONFLICT DO NOTHING;
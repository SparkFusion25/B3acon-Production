/*
  # Seed Data for B3ACON Demo
  
  1. Demo Users (auth.users and profiles)
  2. Sample Clients
  3. Sample Leads
  4. Sample Deals
  5. Sample Activities
  6. Sample Projects
  7. Sample Affiliates
  8. Sample Email Campaigns
  9. Sample Landing Pages
  10. Sample Templates
*/

-- Insert demo users into auth.users table
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

-- Insert corresponding profiles
INSERT INTO profiles (id, email, full_name, role, company_name, phone, avatar_url) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sarah@sparkdigital.com', 'Sarah Johnson', 'admin', 'Spark Digital Agency', '+1 (555) 123-4567', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'john@techcorp.com', 'John Smith', 'client', 'TechCorp Solutions', '+1 (555) 234-5678', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'mike@sparkdigital.com', 'Mike Chen', 'manager', 'Spark Digital Agency', '+1 (555) 345-6789', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'emily@sparkdigital.com', 'Emily Rodriguez', 'specialist', 'Spark Digital Agency', '+1 (555) 456-7890', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop');

-- Insert sample clients
INSERT INTO clients (id, name, email, subscription_tier, monthly_value, services, industry, website, assigned_manager) VALUES
('11111111-1111-1111-1111-111111111111', 'TechCorp Solutions', 'contact@techcorp.com', 'enterprise', 8500, '["SEO", "Social Media", "PPC", "Amazon", "CRM"]', 'Technology', 'https://techcorp.com', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('22222222-2222-2222-2222-222222222222', 'RetailMax Inc', 'hello@retailmax.com', 'professional', 4200, '["SEO", "PPC", "Social Media"]', 'Retail', 'https://retailmax.com', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('33333333-3333-3333-3333-333333333333', 'FinanceFlow', 'team@financeflow.com', 'professional', 3800, '["SEO", "CRM"]', 'Finance', 'https://financeflow.com', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('44444444-4444-4444-4444-444444444444', 'EcomStore', 'support@ecomstore.com', 'professional', 5200, '["Amazon", "PPC", "Social Media"]', 'E-commerce', 'https://ecomstore.com', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');

-- Insert sample leads
INSERT INTO leads (id, name, email, company, source, status, score, estimated_value, assigned_to) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sarah Johnson', 'sarah@techstartup.com', 'TechStartup Inc', 'Website', 'qualified', 85, 15000, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mike Chen', 'mike@retailcorp.com', 'RetailCorp', 'LinkedIn', 'contacted', 72, 8500, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Emily Rodriguez', 'emily@financeplus.com', 'FinancePlus', 'Referral', 'nurturing', 68, 12000, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'David Wilson', 'david@growthco.com', 'GrowthCo', 'Google Ads', 'new', 45, 6000, 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');

-- Insert sample deals
INSERT INTO deals (id, name, value, stage, probability, close_date, client_id, assigned_to) VALUES
('e1111111-1111-1111-1111-111111111111', 'TechCorp SEO Expansion', 15000, 'proposal', 75, '2024-02-15', '11111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('e2222222-2222-2222-2222-222222222222', 'RetailMax PPC Campaign', 8500, 'negotiation', 60, '2024-02-20', '22222222-2222-2222-2222-222222222222', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('e3333333-3333-3333-3333-333333333333', 'FinanceFlow Website Redesign', 12000, 'qualification', 40, '2024-03-01', '33333333-3333-3333-3333-333333333333', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('e4444444-4444-4444-4444-444444444444', 'EcomStore Amazon Optimization', 9500, 'prospecting', 25, '2024-03-15', '44444444-4444-4444-4444-444444444444', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');

-- Insert sample activities
INSERT INTO activities (id, type, subject, description, client_id, assigned_to, created_by, scheduled_at) VALUES
('f1111111-1111-1111-1111-111111111111', 'call', 'Follow-up call with TechCorp', 'Discuss SEO expansion proposal', '11111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() + INTERVAL '2 hours'),
('f2222222-2222-2222-2222-222222222222', 'email', 'PPC campaign proposal', 'Send detailed PPC strategy document', '22222222-2222-2222-2222-222222222222', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NOW() + INTERVAL '1 day'),
('f3333333-3333-3333-3333-333333333333', 'meeting', 'FinanceFlow strategy session', 'Quarterly review and planning', '33333333-3333-3333-3333-333333333333', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NOW() + INTERVAL '3 days'),
('f4444444-4444-4444-4444-444444444444', 'task', 'Amazon listing optimization', 'Complete product listing audit', '44444444-4444-4444-4444-444444444444', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', NOW() + INTERVAL '1 week');

-- Insert sample projects
INSERT INTO projects (id, name, description, client_id, services, budget, start_date, end_date) VALUES
('g1111111-1111-1111-1111-111111111111', 'TechCorp Digital Transformation', 'Complete digital marketing overhaul', '11111111-1111-1111-1111-111111111111', '["SEO", "PPC", "Social Media", "Content Marketing"]', 25000, '2024-01-01', '2024-06-30'),
('g2222222-2222-2222-2222-222222222222', 'RetailMax E-commerce Growth', 'Boost online sales and visibility', '22222222-2222-2222-2222-222222222222', '["PPC", "Amazon", "Social Media"]', 15000, '2024-01-15', '2024-04-15'),
('g3333333-3333-3333-3333-333333333333', 'FinanceFlow Lead Generation', 'Increase qualified leads by 200%', '33333333-3333-3333-3333-333333333333', '["SEO", "Content Marketing", "CRM"]', 18000, '2024-02-01', '2024-07-31');

-- Insert sample affiliates
INSERT INTO affiliates (id, name, email, company, status, tier, commission_rate, referral_code, total_earnings, total_referrals, conversion_rate) VALUES
('h1111111-1111-1111-1111-111111111111', 'Sarah Johnson', 'sarah@marketingpro.com', 'Marketing Pro Agency', 'active', 'gold', 15.00, 'SARAH2024', 12450.00, 8, 12.5),
('h2222222-2222-2222-2222-222222222222', 'Mike Chen', 'mike@digitalboost.com', 'Digital Boost', 'active', 'silver', 12.00, 'MIKE2024', 8900.00, 6, 10.2),
('h3333333-3333-3333-3333-333333333333', 'Emily Rodriguez', 'emily@growthagency.com', 'Growth Agency', 'pending', 'bronze', 10.00, 'EMILY2024', 0.00, 0, 0.0);

-- Insert sample email campaigns
INSERT INTO email_campaigns (id, name, subject, content, status, campaign_type, stats) VALUES
('i1111111-1111-1111-1111-111111111111', 'January Newsletter', 'New Year, New Marketing Strategies', '<h1>Welcome to 2024!</h1><p>Here are our top marketing strategies for the new year...</p>', 'sent', 'newsletter', '{"total_sent": 2500, "delivered": 2450, "opened": 1225, "clicked": 245, "open_rate": 50.0, "click_rate": 10.0}'),
('i2222222-2222-2222-2222-222222222222', 'Product Launch Announcement', 'Introducing Our Revolutionary New Service', '<h1>Big News!</h1><p>We are excited to announce our latest service offering...</p>', 'scheduled', 'promotional', '{"total_sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "open_rate": 0, "click_rate": 0}');

-- Insert sample email templates
INSERT INTO email_templates (id, name, category, html_content, is_public) VALUES
('j1111111-1111-1111-1111-111111111111', 'Welcome Email', 'welcome', '<h1>Welcome to B3ACON!</h1><p>Thank you for joining us. We are excited to help you grow your business.</p>', true),
('j2222222-2222-2222-2222-222222222222', 'Newsletter Template', 'newsletter', '<h1>Monthly Newsletter</h1><p>Here are this month''s updates and insights...</p>', true),
('j3333333-3333-3333-3333-333333333333', 'Promotional Email', 'promotional', '<h1>Special Offer!</h1><p>Don''t miss out on this limited-time offer. Act now!</p>', true);

-- Insert sample landing pages
INSERT INTO landing_pages (id, name, title, slug, status, description) VALUES
('k1111111-1111-1111-1111-111111111111', 'SaaS Product Launch', 'Revolutionary Project Management Tool', 'saas-launch', 'published', 'Perfect landing page for software launches'),
('k2222222-2222-2222-2222-222222222222', 'E-commerce Store', 'Premium Fashion Collection', 'fashion-store', 'draft', 'Optimized for online retail'),
('k3333333-3333-3333-3333-333333333333', 'Agency Services', 'Digital Marketing Excellence', 'agency-services', 'published', 'Showcase your agency capabilities');

-- Insert sample landing page templates
INSERT INTO landing_page_templates (id, name, category, description, is_premium, usage_count, rating) VALUES
('l1111111-1111-1111-1111-111111111111', 'SaaS Landing', 'saas', 'Perfect for software and app launches', false, 45, 4.8),
('l2222222-2222-2222-2222-222222222222', 'E-commerce Store', 'ecommerce', 'Optimized for online stores and products', true, 32, 4.9),
('l3333333-3333-3333-3333-333333333333', 'Agency Portfolio', 'agency', 'Showcase your agency services and portfolio', false, 28, 4.7),
('l4444444-4444-4444-4444-444444444444', 'Event Landing', 'event', 'Perfect for conferences and events', true, 19, 4.6);

-- Insert sample email lists
INSERT INTO email_lists (id, name, description, subscriber_count, active_subscribers, growth_rate) VALUES
('m1111111-1111-1111-1111-111111111111', 'Newsletter Subscribers', 'Main newsletter list for all subscribers', 2500, 2350, 12.5),
('m2222222-2222-2222-2222-222222222222', 'VIP Customers', 'High-value customers and prospects', 450, 435, 8.3),
('m3333333-3333-3333-3333-333333333333', 'Product Updates', 'Users interested in product announcements', 1800, 1720, 15.7);

-- Insert sample users into users table
INSERT INTO users (id, email) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sarah@sparkdigital.com'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'john@techcorp.com'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'mike@sparkdigital.com'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'emily@sparkdigital.com');
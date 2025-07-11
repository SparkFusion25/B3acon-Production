/*
  # Row Level Security Policies
  
  1. Enable RLS on all tables
  2. Create comprehensive security policies
  3. Allow public access for demo purposes while maintaining security structure
*/

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

-- Profiles policies
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Service role can manage profiles" ON profiles FOR ALL USING ((jwt() ->> 'role'::text) = 'service_role'::text);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (uid() = id);

-- Clients policies
CREATE POLICY "Anyone can view clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Anyone can manage clients" ON clients FOR ALL USING (true);
CREATE POLICY "Authenticated users can view clients" ON clients FOR SELECT USING (role() = 'authenticated'::text);
CREATE POLICY "Authenticated users can manage clients" ON clients FOR ALL USING (role() = 'authenticated'::text);

-- Leads policies
CREATE POLICY "Anyone can manage leads" ON leads FOR ALL USING (true);
CREATE POLICY "Anyone can view leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage leads" ON leads FOR ALL USING (role() = 'authenticated'::text);

-- Deals policies
CREATE POLICY "Anyone can manage deals" ON deals FOR ALL USING (true);
CREATE POLICY "Anyone can view deals" ON deals FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage deals" ON deals FOR ALL USING (role() = 'authenticated'::text);

-- Activities policies
CREATE POLICY "Users can manage their activities" ON activities FOR ALL USING ((uid() = assigned_to) OR (uid() = created_by) OR (role() = 'authenticated'::text));

-- Projects policies
CREATE POLICY "Authenticated users can view projects" ON projects FOR SELECT USING (role() = 'authenticated'::text);

-- Affiliates policies
CREATE POLICY "Anyone can manage affiliates" ON affiliates FOR ALL USING (true);
CREATE POLICY "Anyone can view affiliates" ON affiliates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage affiliates" ON affiliates FOR ALL USING (role() = 'authenticated'::text);

-- Affiliate links policies
CREATE POLICY "Authenticated users can view affiliate data" ON affiliate_links FOR SELECT USING (role() = 'authenticated'::text);

-- Affiliate referrals policies
CREATE POLICY "Authenticated users can manage affiliate referrals" ON affiliate_referrals FOR ALL USING (role() = 'authenticated'::text);

-- Affiliate commissions policies
CREATE POLICY "Authenticated users can manage commissions" ON affiliate_commissions FOR ALL USING (role() = 'authenticated'::text);

-- Email campaigns policies
CREATE POLICY "Anyone can manage email_campaigns" ON email_campaigns FOR ALL USING (true);
CREATE POLICY "Anyone can view email_campaigns" ON email_campaigns FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage email campaigns" ON email_campaigns FOR ALL USING (role() = 'authenticated'::text);

-- Email lists policies
CREATE POLICY "Authenticated users can manage email lists" ON email_lists FOR ALL USING (role() = 'authenticated'::text);

-- Email subscribers policies
CREATE POLICY "Authenticated users can manage subscribers" ON email_subscribers FOR ALL USING (role() = 'authenticated'::text);

-- Email automations policies
CREATE POLICY "Authenticated users can manage automations" ON email_automations FOR ALL USING (role() = 'authenticated'::text);

-- Email templates policies
CREATE POLICY "Users can view public templates" ON email_templates FOR SELECT USING (
  is_public = true OR EXISTS (SELECT 1 FROM profiles WHERE id = uid() AND role IN ('admin', 'manager', 'specialist'))
);

-- Landing pages policies
CREATE POLICY "Anyone can manage landing_pages" ON landing_pages FOR ALL USING (true);
CREATE POLICY "Anyone can view landing_pages" ON landing_pages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage landing pages" ON landing_pages FOR ALL USING (role() = 'authenticated'::text);

-- Landing page templates policies
CREATE POLICY "Users can view public templates" ON landing_page_templates FOR SELECT USING (true);

-- Landing page forms policies
CREATE POLICY "Authenticated users can manage forms" ON landing_page_forms FOR ALL USING (role() = 'authenticated'::text);

-- Form submissions policies
CREATE POLICY "Authenticated users can view form submissions" ON form_submissions FOR SELECT USING (role() = 'authenticated'::text);

-- White label partners policies
CREATE POLICY "Authenticated users can manage white label partners" ON white_label_partners FOR ALL USING (role() = 'authenticated'::text);

-- Users policies
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = uid() AND role = 'admin')
);
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (uid() = id);

-- API keys policies
CREATE POLICY "Admins can manage API keys" ON api_keys FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = uid() AND role = 'admin')
);
CREATE POLICY "Agency users can manage API keys" ON api_keys FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Agency users can view API keys" ON api_keys FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = uid() AND role IN ('admin', 'manager', 'specialist'))
);
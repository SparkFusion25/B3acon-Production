/*
  # Lead Prospecting Tool Implementation

  1. New Tables
    - `lead_databases` - Stores information about lead databases
    - `lead_prospects` - Stores individual lead prospect data
    - `lead_campaigns` - Stores outreach campaign information
    - `lead_campaign_steps` - Stores steps in outreach campaigns
    - `lead_campaign_results` - Stores results of outreach campaigns

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Changes
    - Add new capabilities to lead_services table
*/

-- Create lead_databases table
CREATE TABLE IF NOT EXISTS lead_databases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  source text NOT NULL,
  total_leads integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_prospects table
CREATE TABLE IF NOT EXISTS lead_prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id uuid REFERENCES lead_databases(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  company text,
  job_title text,
  phone text,
  linkedin_url text,
  website text,
  industry text,
  company_size text,
  location text,
  country text,
  tags text[],
  custom_fields jsonb DEFAULT '{}'::jsonb,
  enrichment_data jsonb DEFAULT '{}'::jsonb,
  is_verified boolean DEFAULT false,
  verification_date timestamptz,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_campaigns table
CREATE TABLE IF NOT EXISTS lead_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  target_audience jsonb DEFAULT '{}'::jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  stats jsonb DEFAULT '{"sent": 0, "opened": 0, "replied": 0, "bounced": 0, "meetings_booked": 0}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_campaign_steps table
CREATE TABLE IF NOT EXISTS lead_campaign_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES lead_campaigns(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  step_type text NOT NULL,
  subject text,
  content text,
  delay_days integer DEFAULT 0,
  delay_hours integer DEFAULT 0,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_campaign_results table
CREATE TABLE IF NOT EXISTS lead_campaign_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES lead_campaigns(id) ON DELETE CASCADE,
  prospect_id uuid REFERENCES lead_prospects(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  bounced_at timestamptz,
  meeting_booked_at timestamptz,
  current_step integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE lead_databases ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_campaign_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_campaign_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Agency users can manage lead databases" ON lead_databases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'specialist')
    )
  );

CREATE POLICY "Agency users can manage lead prospects" ON lead_prospects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'specialist')
    )
  );

CREATE POLICY "Agency users can manage lead campaigns" ON lead_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'specialist')
    )
  );

CREATE POLICY "Agency users can manage campaign steps" ON lead_campaign_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'specialist')
    )
  );

CREATE POLICY "Agency users can manage campaign results" ON lead_campaign_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'specialist')
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_lead_prospects_database_id ON lead_prospects(database_id);
CREATE INDEX idx_lead_prospects_status ON lead_prospects(status);
CREATE INDEX idx_lead_campaigns_client_id ON lead_campaigns(client_id);
CREATE INDEX idx_lead_campaigns_status ON lead_campaigns(status);
CREATE INDEX idx_lead_campaign_steps_campaign_id ON lead_campaign_steps(campaign_id);
CREATE INDEX idx_lead_campaign_results_campaign_id ON lead_campaign_results(campaign_id);
CREATE INDEX idx_lead_campaign_results_prospect_id ON lead_campaign_results(prospect_id);
CREATE INDEX idx_lead_campaign_results_status ON lead_campaign_results(status);

-- Create triggers for updated_at
CREATE TRIGGER handle_lead_databases_updated_at BEFORE UPDATE ON lead_databases
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_lead_prospects_updated_at BEFORE UPDATE ON lead_prospects
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_lead_campaigns_updated_at BEFORE UPDATE ON lead_campaigns
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_lead_campaign_steps_updated_at BEFORE UPDATE ON lead_campaign_steps
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_lead_campaign_results_updated_at BEFORE UPDATE ON lead_campaign_results
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Update lead_services table to include prospecting capabilities
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lead_services') THEN
    UPDATE lead_services
    SET features = features || jsonb_build_array('Lead Prospecting', 'Email Outreach', 'LinkedIn Integration')
    WHERE name = 'Lead Generation';
    
    -- Insert a new lead service if it doesn't exist
    INSERT INTO lead_services (name, description, price, is_active, features)
    SELECT 'B2B Lead Prospecting', 'Advanced B2B lead prospecting with email verification and outreach automation', 1200.00, true, 
           jsonb_build_array('Lead Database Access', 'Email Verification', 'Outreach Automation', 'LinkedIn Integration', 'Meeting Booking')
    WHERE NOT EXISTS (SELECT 1 FROM lead_services WHERE name = 'B2B Lead Prospecting');
  END IF;
END $$;

-- Insert sample data
INSERT INTO lead_databases (name, description, source, total_leads, is_active)
VALUES 
  ('Tech Companies Database', 'Database of technology companies in the US', 'Apollo.io', 5000, true),
  ('Marketing Agencies', 'Marketing agencies in Europe', 'Hunter.io', 2500, true),
  ('E-commerce Retailers', 'Online retailers in North America', 'ZoomInfo', 3200, true);

-- Insert sample lead prospects
INSERT INTO lead_prospects (
  database_id, 
  first_name, 
  last_name, 
  email, 
  company, 
  job_title, 
  linkedin_url, 
  website, 
  industry, 
  company_size, 
  location, 
  country, 
  tags, 
  status
)
SELECT 
  db.id,
  'John',
  'Smith',
  'john.smith@techcompany.com',
  'Tech Company Inc.',
  'Marketing Director',
  'https://linkedin.com/in/johnsmith',
  'https://techcompany.com',
  'Technology',
  '50-200',
  'San Francisco, CA',
  'USA',
  ARRAY['decision-maker', 'marketing', 'tech'],
  'new'
FROM lead_databases db
WHERE db.name = 'Tech Companies Database'
LIMIT 1;

INSERT INTO lead_prospects (
  database_id, 
  first_name, 
  last_name, 
  email, 
  company, 
  job_title, 
  linkedin_url, 
  website, 
  industry, 
  company_size, 
  location, 
  country, 
  tags, 
  status
)
SELECT 
  db.id,
  'Sarah',
  'Johnson',
  'sarah.johnson@marketingpro.com',
  'Marketing Pro Agency',
  'CEO',
  'https://linkedin.com/in/sarahjohnson',
  'https://marketingpro.com',
  'Marketing',
  '10-50',
  'London',
  'UK',
  ARRAY['decision-maker', 'agency', 'marketing'],
  'new'
FROM lead_databases db
WHERE db.name = 'Marketing Agencies'
LIMIT 1;

-- Insert sample campaign
INSERT INTO lead_campaigns (
  name, 
  description, 
  status, 
  target_audience, 
  settings
)
VALUES (
  'Tech Companies Outreach',
  'Outreach campaign targeting marketing directors at tech companies',
  'draft',
  '{"industries": ["Technology"], "job_titles": ["Marketing Director", "CMO", "VP of Marketing"], "company_size": ["50-200", "201-500"]}',
  '{"personalization": true, "follow_ups": 3, "schedule": {"days": ["monday", "tuesday", "wednesday", "thursday"], "time_range": ["9:00", "17:00"]}}'
);

-- Insert sample campaign steps
DO $$
DECLARE
  campaign_id uuid;
BEGIN
  SELECT id INTO campaign_id FROM lead_campaigns WHERE name = 'Tech Companies Outreach' LIMIT 1;
  
  IF campaign_id IS NOT NULL THEN
    INSERT INTO lead_campaign_steps (
      campaign_id,
      step_number,
      step_type,
      subject,
      content,
      delay_days
    ) VALUES
    (
      campaign_id,
      1,
      'email',
      'Improving your marketing ROI',
      'Hi {{first_name}},\n\nI noticed that {{company}} has been expanding its digital presence lately. I wanted to reach out because we''ve helped similar companies in the {{industry}} industry improve their marketing ROI by an average of 35%.\n\nWould you be open to a quick 15-minute call to discuss how we might be able to help?\n\nBest regards,\n{{sender_name}}',
      0
    ),
    (
      campaign_id,
      2,
      'email',
      'Re: Improving your marketing ROI',
      'Hi {{first_name}},\n\nI wanted to follow up on my previous email about improving marketing ROI for {{company}}.\n\nI understand you''re busy, but I thought you might be interested in a case study we published about how we helped a company similar to yours achieve a 42% increase in conversions.\n\nWould you be interested in seeing this case study?\n\nBest regards,\n{{sender_name}}',
      3
    ),
    (
      campaign_id,
      3,
      'email',
      'Last follow-up: Resources for {{company}}',
      'Hi {{first_name}},\n\nI wanted to reach out one last time to offer some free resources that might be helpful for your marketing team at {{company}}.\n\nI''ve put together a package with our latest research on {{industry}} marketing trends and some templates that your team might find useful.\n\nLet me know if you''d like me to send these over.\n\nBest regards,\n{{sender_name}}',
      7
    );
  END IF;
END $$;
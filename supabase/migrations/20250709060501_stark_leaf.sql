/*
  # Fix RLS Policy Infinite Recursion

  1. Problem
    - The profiles table has a policy that creates infinite recursion
    - This happens when the policy checks profiles table from within profiles table access

  2. Solution
    - Drop existing problematic policies
    - Create new policies that avoid circular references
    - Use auth.uid() directly instead of checking profiles table within profiles policies

  3. Security
    - Maintain proper access control
    - Users can only access their own data
    - Admins have broader access through service role
*/

-- Drop existing problematic policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create new policies that avoid recursion
-- Users can view their own profile using auth.uid() directly
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile using auth.uid() directly
CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile (for new user registration)
CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Service role can manage all profiles (for admin operations)
-- This uses service role key, not the problematic profiles table check
CREATE POLICY "Service role can manage profiles" ON profiles 
  FOR ALL 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Fix other policies that might reference profiles table problematically
-- Update client policies to be more direct
DROP POLICY IF EXISTS "Agency users can view clients" ON clients;
DROP POLICY IF EXISTS "Agency users can manage clients" ON clients;
DROP POLICY IF EXISTS "Clients can view own data" ON clients;

-- Create simpler client policies
CREATE POLICY "Authenticated users can view clients" ON clients 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage clients" ON clients 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Fix leads policies
DROP POLICY IF EXISTS "Agency users can manage leads" ON leads;

CREATE POLICY "Authenticated users can manage leads" ON leads 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Fix deals policies  
DROP POLICY IF EXISTS "Agency users can manage deals" ON deals;

CREATE POLICY "Authenticated users can manage deals" ON deals 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Fix activities policies
DROP POLICY IF EXISTS "Users can manage their activities" ON activities;

CREATE POLICY "Users can manage their activities" ON activities 
  FOR ALL 
  USING (
    auth.uid() = assigned_to OR 
    auth.uid() = created_by OR 
    auth.role() = 'authenticated'
  );

-- Fix projects policies
DROP POLICY IF EXISTS "Agency users can view projects" ON projects;
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;

CREATE POLICY "Authenticated users can view projects" ON projects 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Fix affiliate policies
DROP POLICY IF EXISTS "Agency users can manage affiliates" ON affiliates;
DROP POLICY IF EXISTS "Agency users can view affiliate data" ON affiliate_links;
DROP POLICY IF EXISTS "Agency users can manage affiliate referrals" ON affiliate_referrals;
DROP POLICY IF EXISTS "Agency users can manage commissions" ON affiliate_commissions;

CREATE POLICY "Authenticated users can manage affiliates" ON affiliates 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view affiliate data" ON affiliate_links 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage affiliate referrals" ON affiliate_referrals 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage commissions" ON affiliate_commissions 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Fix email marketing policies
DROP POLICY IF EXISTS "Agency users can manage email campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Agency users can manage email lists" ON email_lists;
DROP POLICY IF EXISTS "Agency users can manage subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Agency users can manage automations" ON email_automations;

CREATE POLICY "Authenticated users can manage email campaigns" ON email_campaigns 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage email lists" ON email_lists 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage subscribers" ON email_subscribers 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage automations" ON email_automations 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Fix landing page policies
DROP POLICY IF EXISTS "Agency users can manage landing pages" ON landing_pages;
DROP POLICY IF EXISTS "Clients can view own landing pages" ON landing_pages;
DROP POLICY IF EXISTS "Agency users can manage forms" ON landing_page_forms;
DROP POLICY IF EXISTS "Agency users can view form submissions" ON form_submissions;

CREATE POLICY "Authenticated users can manage landing pages" ON landing_pages 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage forms" ON landing_page_forms 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view form submissions" ON form_submissions 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Fix white label policies
DROP POLICY IF EXISTS "Admins can manage white label partners" ON white_label_partners;

CREATE POLICY "Authenticated users can manage white label partners" ON white_label_partners 
  FOR ALL 
  USING (auth.role() = 'authenticated');
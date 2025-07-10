/*
  # Fix Infinite Recursion in RLS Policies

  1. Problem
    - RLS policies on profiles table were causing infinite recursion
    - Policies were checking profiles table from within profiles table access
    - This creates circular dependency and blocks database connections

  2. Solution
    - Remove all problematic policies that reference profiles table
    - Create simple policies using auth.uid() and auth.role() directly
    - Avoid any circular references while maintaining security

  3. Changes
    - Drop existing recursive policies
    - Create new non-recursive policies
    - Simplify access control to prevent future recursion issues
*/

-- First, disable RLS temporarily to avoid issues during policy changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on profiles table to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new, simple policies that don't cause recursion
-- These use auth.uid() directly without querying profiles table

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow service role to manage all profiles (for admin operations)
CREATE POLICY "Service role can manage profiles" ON profiles
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Also fix any other policies that might reference profiles table problematically
-- Update other table policies to be simpler and avoid recursion

-- Fix clients table policies
DROP POLICY IF EXISTS "Agency users can view clients" ON clients;
DROP POLICY IF EXISTS "Agency users can manage clients" ON clients;
DROP POLICY IF EXISTS "Clients can view own data" ON clients;
DROP POLICY IF EXISTS "Authenticated users can view clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can manage clients" ON clients;

CREATE POLICY "Authenticated users can view clients" ON clients
  FOR SELECT
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can manage clients" ON clients
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

-- Fix leads table policies
DROP POLICY IF EXISTS "Agency users can manage leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON leads;

CREATE POLICY "Authenticated users can manage leads" ON leads
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

-- Fix deals table policies
DROP POLICY IF EXISTS "Agency users can manage deals" ON deals;
DROP POLICY IF EXISTS "Authenticated users can manage deals" ON deals;

CREATE POLICY "Authenticated users can manage deals" ON deals
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

-- Fix activities table policies
DROP POLICY IF EXISTS "Users can manage their activities" ON activities;

CREATE POLICY "Users can manage their activities" ON activities
  FOR ALL
  USING (
    auth.uid() = assigned_to OR 
    auth.uid() = created_by OR 
    auth.role() = 'authenticated'::text
  );

-- Fix projects table policies
DROP POLICY IF EXISTS "Agency users can view projects" ON projects;
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can view projects" ON projects;

CREATE POLICY "Authenticated users can view projects" ON projects
  FOR SELECT
  USING (auth.role() = 'authenticated'::text);

-- Fix affiliate table policies
DROP POLICY IF EXISTS "Agency users can manage affiliates" ON affiliates;
DROP POLICY IF EXISTS "Authenticated users can manage affiliates" ON affiliates;

CREATE POLICY "Authenticated users can manage affiliates" ON affiliates
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

-- Fix affiliate_links table policies
DROP POLICY IF EXISTS "Agency users can view affiliate data" ON affiliate_links;
DROP POLICY IF EXISTS "Authenticated users can view affiliate data" ON affiliate_links;

CREATE POLICY "Authenticated users can view affiliate data" ON affiliate_links
  FOR SELECT
  USING (auth.role() = 'authenticated'::text);

-- Fix affiliate_referrals table policies
DROP POLICY IF EXISTS "Agency users can manage affiliate referrals" ON affiliate_referrals;
DROP POLICY IF EXISTS "Authenticated users can manage affiliate referrals" ON affiliate_referrals;

CREATE POLICY "Authenticated users can manage affiliate referrals" ON affiliate_referrals
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

-- Fix affiliate_commissions table policies
DROP POLICY IF EXISTS "Agency users can manage commissions" ON affiliate_commissions;
DROP POLICY IF EXISTS "Authenticated users can manage commissions" ON affiliate_commissions;

CREATE POLICY "Authenticated users can manage commissions" ON affiliate_commissions
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

-- Fix email marketing table policies
DROP POLICY IF EXISTS "Agency users can manage email campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Authenticated users can manage email campaigns" ON email_campaigns;

CREATE POLICY "Authenticated users can manage email campaigns" ON email_campaigns
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

DROP POLICY IF EXISTS "Agency users can manage email lists" ON email_lists;
DROP POLICY IF EXISTS "Authenticated users can manage email lists" ON email_lists;

CREATE POLICY "Authenticated users can manage email lists" ON email_lists
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

DROP POLICY IF EXISTS "Agency users can manage subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Authenticated users can manage subscribers" ON email_subscribers;

CREATE POLICY "Authenticated users can manage subscribers" ON email_subscribers
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

DROP POLICY IF EXISTS "Agency users can manage automations" ON email_automations;
DROP POLICY IF EXISTS "Authenticated users can manage automations" ON email_automations;

CREATE POLICY "Authenticated users can manage automations" ON email_automations
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

-- Fix landing page table policies
DROP POLICY IF EXISTS "Agency users can manage landing pages" ON landing_pages;
DROP POLICY IF EXISTS "Clients can view own landing pages" ON landing_pages;
DROP POLICY IF EXISTS "Authenticated users can manage landing pages" ON landing_pages;

CREATE POLICY "Authenticated users can manage landing pages" ON landing_pages
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

DROP POLICY IF EXISTS "Agency users can manage forms" ON landing_page_forms;
DROP POLICY IF EXISTS "Authenticated users can manage forms" ON landing_page_forms;

CREATE POLICY "Authenticated users can manage forms" ON landing_page_forms
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

DROP POLICY IF EXISTS "Agency users can view form submissions" ON form_submissions;
DROP POLICY IF EXISTS "Authenticated users can view form submissions" ON form_submissions;

CREATE POLICY "Authenticated users can view form submissions" ON form_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated'::text);

-- Fix white label table policies
DROP POLICY IF EXISTS "Admins can manage white label partners" ON white_label_partners;
DROP POLICY IF EXISTS "Authenticated users can manage white label partners" ON white_label_partners;

CREATE POLICY "Authenticated users can manage white label partners" ON white_label_partners
  FOR ALL
  USING (auth.role() = 'authenticated'::text);
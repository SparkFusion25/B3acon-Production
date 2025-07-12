/*
  # Notification System

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `title` (text)
      - `message` (text)
      - `type` (text)
      - `is_read` (boolean)
      - `data` (jsonb)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `notifications` table
    - Add policy for users to view their own notifications
    - Add policy for admins to manage all notifications
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
ON notifications
FOR SELECT
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON notifications
FOR UPDATE
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications"
ON notifications
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Insert sample notifications
INSERT INTO notifications (
  user_id,
  title,
  message,
  type,
  is_read,
  data
) 
SELECT 
  id,
  'Welcome to B3ACON',
  'Thank you for joining B3ACON. Get started by exploring the dashboard.',
  'welcome',
  false,
  '{}'::jsonb
FROM profiles
WHERE role = 'admin'
LIMIT 1;

INSERT INTO notifications (
  user_id,
  title,
  message,
  type,
  is_read,
  data
) 
SELECT 
  id,
  'New Feature: SEO Intelligence',
  'We''ve added new SEO tools to help you analyze and improve your website rankings.',
  'feature',
  false,
  '{}'::jsonb
FROM profiles
WHERE role = 'admin'
LIMIT 1;

INSERT INTO notifications (
  user_id,
  title,
  message,
  type,
  is_read,
  data
) 
SELECT 
  id,
  'Subscription Renewal',
  'Your subscription will renew in 7 days. Please update your payment method if needed.',
  'billing',
  false,
  '{}'::jsonb
FROM profiles
WHERE role = 'admin'
LIMIT 1;
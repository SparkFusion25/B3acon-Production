/*
  # Customer Support System

  1. New Tables
    - `support_tickets`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients.id)
      - `subject` (text)
      - `description` (text)
      - `status` (text)
      - `priority` (text)
      - `assigned_to` (uuid, references profiles.id)
      - `created_by` (uuid, references profiles.id)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
    
    - `support_messages`
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, references support_tickets.id)
      - `sender_id` (uuid, references profiles.id)
      - `message` (text)
      - `attachments` (jsonb)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for ticket management
    - Add policies for message management
*/

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_client_id ON support_tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_by ON support_tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_sender_id ON support_messages(sender_id);

-- Create update trigger for support_tickets
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for support_tickets
CREATE POLICY "Admins can manage all tickets"
ON support_tickets
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Managers can manage all tickets"
ON support_tickets
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'manager'
  )
);

CREATE POLICY "Specialists can view and update assigned tickets"
ON support_tickets
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'specialist'
  )
);

CREATE POLICY "Specialists can update assigned tickets"
ON support_tickets
FOR UPDATE
TO public
USING (
  assigned_to = auth.uid() AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'specialist'
  )
);

CREATE POLICY "Clients can view and create their own tickets"
ON support_tickets
FOR SELECT
TO public
USING (
  created_by = auth.uid() OR
  client_id IN (
    SELECT id FROM clients
    WHERE clients.id IN (
      SELECT client_id FROM project_tasks
      WHERE assigned_to = auth.uid()
    )
  )
);

CREATE POLICY "Clients can create tickets"
ON support_tickets
FOR INSERT
TO public
WITH CHECK (
  auth.uid() = created_by
);

-- Create policies for support_messages
CREATE POLICY "Users can view messages for tickets they can access"
ON support_messages
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = ticket_id
    AND (
      support_tickets.created_by = auth.uid() OR
      support_tickets.assigned_to = auth.uid() OR
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'manager')
      )
    )
  )
);

CREATE POLICY "Users can create messages for tickets they can access"
ON support_messages
FOR INSERT
TO public
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = ticket_id
    AND (
      support_tickets.created_by = auth.uid() OR
      support_tickets.assigned_to = auth.uid() OR
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'manager')
      )
    )
  )
);

-- Insert sample data
INSERT INTO support_tickets (
  client_id,
  subject,
  description,
  status,
  priority,
  created_by
)
SELECT 
  c.id,
  'Question about SEO report',
  'I have a question about the latest SEO report. Can you explain why our ranking dropped for the keyword "digital marketing services"?',
  'open',
  'medium',
  p.id
FROM clients c
JOIN profiles p ON p.role = 'client'
LIMIT 1;

INSERT INTO support_tickets (
  client_id,
  subject,
  description,
  status,
  priority,
  created_by
)
SELECT 
  c.id,
  'Social media campaign approval',
  'We need to get approval for the holiday social media campaign as soon as possible.',
  'closed',
  'high',
  p.id
FROM clients c
JOIN profiles p ON p.role = 'client'
LIMIT 1;

-- Insert sample messages
INSERT INTO support_messages (
  ticket_id,
  sender_id,
  message
)
SELECT 
  t.id,
  t.created_by,
  'I have a question about the latest SEO report. Can you explain why our ranking dropped for the keyword "digital marketing services"?'
FROM support_tickets t
WHERE t.subject = 'Question about SEO report'
LIMIT 1;

INSERT INTO support_messages (
  ticket_id,
  sender_id,
  message
)
SELECT 
  t.id,
  p.id,
  'Hi there! I''ve looked into this and it appears there was a Google algorithm update that affected rankings in your industry. We''re already working on adjustments to recover the position. I''ll send you a detailed analysis by tomorrow.'
FROM support_tickets t
JOIN profiles p ON p.role = 'admin'
WHERE t.subject = 'Question about SEO report'
LIMIT 1;
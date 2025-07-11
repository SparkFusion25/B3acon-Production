/*
  # Add landing page content table

  1. New Tables
    - `landing_page_content` - Stores content for landing pages
      - `id` (uuid, primary key)
      - `section_key` (text, unique)
      - `title` (text)
      - `subtitle` (text)
      - `description` (text)
      - `button_text` (text)
      - `button_secondary_text` (text)
      - `image_url` (text)
      - `metadata` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `landing_page_content` table
    - Add policy for admins to manage landing content
    - Add policy for anyone to view active landing content
*/

-- Create landing page content table if it doesn't exist
CREATE TABLE IF NOT EXISTS landing_page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_secondary_text TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE landing_page_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage landing content" 
ON landing_page_content 
FOR ALL 
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Anyone can view active landing content" 
ON landing_page_content 
FOR SELECT 
TO public
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_landing_page_content_updated_at
BEFORE UPDATE ON landing_page_content
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Insert default landing page content
INSERT INTO landing_page_content (
  section_key,
  title,
  description,
  metadata,
  is_active
) VALUES (
  'main',
  'B3ACON - Digital Marketing Command Center',
  'The complete digital marketing platform for agencies',
  '{
    "title": "B3ACON - Digital Marketing Command Center",
    "description": "The complete digital marketing platform for agencies",
    "logo": "https://example.com/logo.png",
    "sections": [
      {
        "id": "hero-1",
        "type": "hero",
        "title": "Enterprise-Grade Marketing Command Center",
        "subtitle": "B3ACON provides a comprehensive suite of digital marketing tools to help agencies scale their operations, manage clients, and drive results.",
        "buttonText": "Start Free 14-Day Trial",
        "buttonUrl": "/signup",
        "imageUrl": "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        "id": "features-1",
        "type": "features",
        "title": "All-in-One Marketing Platform",
        "subtitle": "Everything you need to manage your digital marketing operations in one powerful platform.",
        "items": [
          {
            "id": "feature-1",
            "title": "Advanced Analytics",
            "description": "Comprehensive reporting and insights across all marketing channels.",
            "icon": "BarChart3"
          },
          {
            "id": "feature-2",
            "title": "Client Management",
            "description": "Streamline client onboarding, communication, and project management.",
            "icon": "Users"
          },
          {
            "id": "feature-3",
            "title": "Marketing Automation",
            "description": "Automate repetitive tasks and focus on strategy and growth.",
            "icon": "Zap"
          }
        ]
      }
    ],
    "colors": {
      "primary": "#3478F6",
      "secondary": "#FF6B35",
      "background": "#FFFFFF",
      "text": "#121212"
    },
    "meta": {
      "title": "B3ACON - Digital Marketing Command Center",
      "description": "The complete digital marketing platform for agencies",
      "keywords": "digital marketing, agency software, marketing platform, SEO tools"
    }
  }'::jsonb,
  true
) ON CONFLICT (section_key) DO UPDATE
SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  is_active = EXCLUDED.is_active,
  updated_at = now();
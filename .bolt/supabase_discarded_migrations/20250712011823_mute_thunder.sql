/*
  # Create landing page content table

  1. New Tables
    - `landing_page_content` - Stores content for landing pages and sections
  2. Security
    - Enable RLS on `landing_page_content` table
    - Add policy for admins to manage landing content
    - Add policy for anyone to view active landing content
*/

-- Create landing page content table
CREATE TABLE IF NOT EXISTS landing_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_secondary_text TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE landing_page_content ENABLE ROW LEVEL SECURITY;

-- Create update trigger
CREATE TRIGGER update_landing_page_content_updated_at
BEFORE UPDATE ON landing_page_content
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create policies
CREATE POLICY "Admins can manage landing content"
ON landing_page_content
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Anyone can view active landing content"
ON landing_page_content
FOR SELECT
TO public
USING (is_active = true);

-- Insert default content
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
        "title": "Install B3ACON",
        "subtitle": "The enterprise-grade marketing command center for agencies. Manage clients, campaigns, and performance across multiple channels in one powerful platform.",
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
            "title": "CRM",
            "description": "Complete client relationship management with lead tracking, deal pipeline, and activity management.",
            "icon": "Users"
          },
          {
            "id": "feature-2",
            "title": "SEO",
            "description": "Advanced SEO intelligence with keyword research, rank tracking, and site audit tools.",
            "icon": "Target"
          },
          {
            "id": "feature-3",
            "title": "Email",
            "description": "Multi-provider email campaign management with automation and analytics.",
            "icon": "Mail"
          },
          {
            "id": "feature-4",
            "title": "Affiliate",
            "description": "Partner recruitment, commission tracking, and automated payment management.",
            "icon": "Users"
          },
          {
            "id": "feature-5",
            "title": "Analytics",
            "description": "Comprehensive performance tracking and reporting across all marketing channels.",
            "icon": "BarChart3"
          },
          {
            "id": "feature-6",
            "title": "Shopify",
            "description": "Seamless integration with Shopify for e-commerce marketing and analytics.",
            "icon": "ShoppingBag"
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
);
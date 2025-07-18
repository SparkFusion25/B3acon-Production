import React from 'react';
import { Globe, Users, Share, Search, ShoppingBag, Settings } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  activeSubSection?: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, description, icon: Icon }) => (
  <div className="placeholder-view">
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-center space-x-2 text-blue-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Feature in development</span>
        </div>
        <p className="text-blue-600 text-sm mt-2">
          This advanced feature is currently being built and will be available soon.
        </p>
      </div>
    </div>
  </div>
);

export const GlobalCommerceView: React.FC<{ activeSubSection: string }> = () => (
  <PlaceholderView
    title="Global Commerce Hub"
    description="Manage international trade with landed cost calculators, freight rates, shipment tracking, and tariff calculations."
    icon={Globe}
  />
);

export const ClientManagementView: React.FC = () => (
  <PlaceholderView
    title="Client Management"
    description="Comprehensive client portfolio management with detailed analytics and relationship tracking."
    icon={Users}
  />
);

export const TeamManagementView: React.FC = () => (
  <PlaceholderView
    title="Team Management"
    description="Organize your team, assign roles, track performance, and collaborate effectively."
    icon={Users}
  />
);

export const SocialMediaView: React.FC<{ activeSubSection: string }> = () => (
  <PlaceholderView
    title="Social Media Management"
    description="Connect accounts, create posts, schedule content, and analyze social media performance."
    icon={Share}
  />
);

export const LeadProspectingView: React.FC = () => (
  <PlaceholderView
    title="Lead Prospecting"
    description="Advanced AI-powered lead generation and prospecting tools to grow your customer base."
    icon={Search}
  />
);

export const ShopifyIntegrationView: React.FC = () => (
  <PlaceholderView
    title="Shopify Integration"
    description="Connect and manage your Shopify store with advanced e-commerce analytics and automation."
    icon={ShoppingBag}
  />
);

export const AdminPanelView: React.FC<{ activeSubSection: string }> = () => (
  <PlaceholderView
    title="Admin Panel"
    description="System administration, user management, billing, and advanced configuration settings."
    icon={Settings}
  />
);
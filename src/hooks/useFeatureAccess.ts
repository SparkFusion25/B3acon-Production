import { useState, useEffect } from 'react';

interface FeatureAccessRule {
  id: string;
  name: string;
  description: string;
  availableInPlans: string[];
  isEnabled: boolean;
  category: 'seo' | 'analytics' | 'automation' | 'support' | 'integrations' | 'design' | 'commerce';
  component?: string;
}

interface UserPlan {
  planId: string;
  status: 'active' | 'trial' | 'canceled' | 'suspended';
  features: string[];
}

const defaultFeatures: FeatureAccessRule[] = [
  // SEO Features
  {
    id: 'seo-basic',
    name: 'Basic SEO Optimization',
    description: 'Core SEO features: meta tags, alt text, basic optimization',
    availableInPlans: ['basic', 'professional', 'enterprise'],
    isEnabled: true,
    category: 'seo'
  },
  {
    id: 'seo-advanced',
    name: 'Advanced SEO Suite',
    description: 'Schema markup, competitor analysis, advanced optimization',
    availableInPlans: ['professional', 'enterprise'],
    isEnabled: true,
    category: 'seo'
  },
  {
    id: 'image-optimization',
    name: 'Image SEO & Compression',
    description: 'Automated image optimization and SEO enhancement',
    availableInPlans: ['professional', 'enterprise'],
    isEnabled: true,
    category: 'seo',
    component: 'ImageSEOCompression'
  },
  {
    id: 'broken-links',
    name: 'Broken Links Manager',
    description: 'Detect and fix broken links automatically',
    availableInPlans: ['professional', 'enterprise'],
    isEnabled: true,
    category: 'seo',
    component: 'BrokenLinksManager'
  },
  {
    id: 'schema-markup',
    name: 'Schema Markup Generator',
    description: 'Generate and manage JSON-LD structured data',
    availableInPlans: ['professional', 'enterprise'],
    isEnabled: true,
    category: 'seo',
    component: 'SchemaMarkupGenerator'
  },

  // Design & Typewriter Features
  {
    id: 'typewriter-basic',
    name: 'Basic Typewriter Effect',
    description: 'Simple typewriter animations for headlines',
    availableInPlans: ['basic', 'professional', 'enterprise'],
    isEnabled: true,
    category: 'design',
    component: 'Typewriter'
  },
  {
    id: 'typewriter-advanced',
    name: 'Advanced Typewriter Controls',
    description: 'Custom speed, multiple headlines, advanced animations',
    availableInPlans: ['professional', 'enterprise'],
    isEnabled: true,
    category: 'design'
  },
  {
    id: 'typewriter-enterprise',
    name: 'Enterprise Typewriter Suite',
    description: 'Full customization, A/B testing, performance analytics',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'design'
  },
  {
    id: 'mobile-optimization',
    name: 'Mobile Optimization',
    description: 'Responsive design and mobile-first optimization',
    availableInPlans: ['basic', 'professional', 'enterprise'],
    isEnabled: true,
    category: 'design'
  },
  {
    id: 'custom-themes',
    name: 'Custom Theme Builder',
    description: 'Create and customize themes with advanced controls',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'design'
  },

  // Commerce Features
  {
    id: 'buy-button-basic',
    name: 'Basic Buy Button',
    description: 'Simple buy button generator with basic customization',
    availableInPlans: ['basic', 'professional', 'enterprise'],
    isEnabled: true,
    category: 'commerce',
    component: 'BuyButtonGenerator'
  },
  {
    id: 'buy-button-advanced',
    name: 'Advanced Buy Button Suite',
    description: 'Advanced styling, analytics, A/B testing',
    availableInPlans: ['professional', 'enterprise'],
    isEnabled: true,
    category: 'commerce'
  },
  {
    id: 'buy-button-enterprise',
    name: 'Enterprise Buy Button',
    description: 'Full customization, conversion optimization, advanced analytics',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'commerce'
  },
  {
    id: 'amazon-integration',
    name: 'Amazon Integration',
    description: 'Sync products with Amazon, manage reviews and listings',
    availableInPlans: ['professional', 'enterprise'],
    isEnabled: true,
    category: 'integrations'
  },
  {
    id: 'custom-checkout',
    name: 'Custom Checkout Builder',
    description: 'Build custom checkout experiences and flows',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'commerce'
  },
  {
    id: 'upsell-tools',
    name: 'Upsell & Cross-sell Tools',
    description: 'Advanced upselling and cross-selling automation',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'commerce'
  },

  // Analytics Features
  {
    id: 'analytics-basic',
    name: 'Basic Analytics',
    description: 'Core performance metrics and reporting',
    availableInPlans: ['professional', 'enterprise'],
    isEnabled: true,
    category: 'analytics'
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics Suite',
    description: 'Deep insights, custom reports, conversion tracking',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'analytics'
  },
  {
    id: 'real-time-reports',
    name: 'Real-time Reporting',
    description: 'Live data updates and real-time performance monitoring',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'analytics'
  },
  {
    id: 'customer-insights',
    name: 'Customer Insights',
    description: 'Detailed customer behavior analysis and segmentation',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'analytics'
  },
  {
    id: 'data-export',
    name: 'Data Export & API',
    description: 'Export data and access via API for custom integrations',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'analytics'
  },

  // Automation Features
  {
    id: 'automation',
    name: 'Basic Automation',
    description: 'Automated internal linking and basic SEO tasks',
    availableInPlans: ['professional', 'enterprise'],
    isEnabled: true,
    category: 'automation'
  },
  {
    id: 'automation-advanced',
    name: 'Advanced Automation Suite',
    description: 'Advanced workflows, custom triggers, and smart automation',
    availableInPlans: ['enterprise'],
    isEnabled: true,
    category: 'automation'
  }
];

export const useFeatureAccess = () => {
  const [userPlan, setUserPlan] = useState<UserPlan>({
    planId: 'basic',
    status: 'trial',
    features: ['seo-basic', 'typewriter-basic', 'buy-button-basic', 'mobile-optimization']
  });
  const [features, setFeatures] = useState<FeatureAccessRule[]>(defaultFeatures);

  // Load user plan from localStorage or API
  useEffect(() => {
    const loadUserPlan = () => {
      try {
        const storedPlan = localStorage.getItem('shopifyUserPlan');
        if (storedPlan) {
          setUserPlan(JSON.parse(storedPlan));
        }
      } catch (error) {
        console.log('Using default user plan');
      }
    };

    const loadFeatures = () => {
      try {
        const storedFeatures = localStorage.getItem('shopifyFeatures');
        if (storedFeatures) {
          setFeatures(JSON.parse(storedFeatures));
        }
      } catch (error) {
        console.log('Using default features');
      }
    };

    loadUserPlan();
    loadFeatures();
  }, []);

  // Check if user has access to a specific feature
  const hasFeatureAccess = (featureId: string): boolean => {
    const feature = features.find(f => f.id === featureId);
    if (!feature || !feature.isEnabled) return false;

    // Check if feature is available in user's plan
    const planAccess = feature.availableInPlans.includes(userPlan.planId);
    
    // Check if user specifically has this feature (for overrides)
    const userHasFeature = userPlan.features.includes(featureId);
    
    return planAccess && userHasFeature;
  };

  // Get all available features for current user
  const getAvailableFeatures = (): FeatureAccessRule[] => {
    return features.filter(feature => hasFeatureAccess(feature.id));
  };

  // Get features by category
  const getFeaturesByCategory = (category: string): FeatureAccessRule[] => {
    return getAvailableFeatures().filter(feature => feature.category === category);
  };

  // Check if specific component is accessible
  const hasComponentAccess = (componentName: string): boolean => {
    const componentFeatures = features.filter(f => f.component === componentName);
    return componentFeatures.some(feature => hasFeatureAccess(feature.id));
  };

  // Get upgrade suggestion for locked feature
  const getUpgradeSuggestion = (featureId: string): string | null => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return null;

    const availablePlans = feature.availableInPlans;
    const currentPlanIndex = ['basic', 'professional', 'enterprise'].indexOf(userPlan.planId);
    
    for (const plan of ['professional', 'enterprise']) {
      if (availablePlans.includes(plan)) {
        const planIndex = ['basic', 'professional', 'enterprise'].indexOf(plan);
        if (planIndex > currentPlanIndex) {
          return plan;
        }
      }
    }
    
    return null;
  };

  // Update user plan (for admin use)
  const updateUserPlan = (newPlan: Partial<UserPlan>) => {
    const updatedPlan = { ...userPlan, ...newPlan };
    setUserPlan(updatedPlan);
    localStorage.setItem('shopifyUserPlan', JSON.stringify(updatedPlan));
  };

  // Feature access status
  const getFeatureStatus = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return { status: 'unavailable', reason: 'Feature not found' };

    if (!feature.isEnabled) return { status: 'disabled', reason: 'Feature disabled globally' };

    const planAccess = feature.availableInPlans.includes(userPlan.planId);
    const userHasFeature = userPlan.features.includes(featureId);

    if (!planAccess) {
      const suggestedPlan = getUpgradeSuggestion(featureId);
      return { 
        status: 'plan_restricted', 
        reason: `Available in ${feature.availableInPlans.join(', ')} plans`,
        suggestedPlan 
      };
    }

    if (!userHasFeature) {
      return { status: 'feature_disabled', reason: 'Feature not enabled for user' };
    }

    return { status: 'available', reason: 'Full access' };
  };

  return {
    userPlan,
    features,
    hasFeatureAccess,
    getAvailableFeatures,
    getFeaturesByCategory,
    hasComponentAccess,
    getUpgradeSuggestion,
    updateUserPlan,
    getFeatureStatus
  };
};
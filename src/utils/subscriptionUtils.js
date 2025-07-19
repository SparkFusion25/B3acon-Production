// Subscription utilities as specified in SYSTEM_SPECS.md
const PLAN_HIERARCHY = ['trial', 'starter', 'pro', 'enterprise'];

export const hasAccess = (userPlan, requiredPlan) => {
  if (!userPlan || !requiredPlan) return false;
  
  const userLevel = PLAN_HIERARCHY.indexOf(userPlan);
  const requiredLevel = PLAN_HIERARCHY.indexOf(requiredPlan);
  
  // If plan not found in hierarchy, deny access
  if (userLevel === -1 || requiredLevel === -1) return false;
  
  return userLevel >= requiredLevel;
};

export const getPlanLevel = (plan) => {
  return PLAN_HIERARCHY.indexOf(plan);
};

export const isTrialUser = (plan) => {
  return plan === 'trial';
};

export const canUpgrade = (currentPlan) => {
  const currentLevel = PLAN_HIERARCHY.indexOf(currentPlan);
  return currentLevel < PLAN_HIERARCHY.length - 1;
};

export const getNextPlan = (currentPlan) => {
  const currentLevel = PLAN_HIERARCHY.indexOf(currentPlan);
  if (currentLevel >= 0 && currentLevel < PLAN_HIERARCHY.length - 1) {
    return PLAN_HIERARCHY[currentLevel + 1];
  }
  return null;
};

export const SUBSCRIPTION_PLANS = {
  trial: {
    name: "14-Day Trial",
    price: 0,
    duration: 14,
    features: ["basic_seo", "popup_builder", "basic_analytics"],
    limits: {
      seo_pages: 50,
      popups: 3,
      analytics_data_retention: 7
    }
  },
  starter: {
    name: "Starter",
    price: 29,
    features: ["basic_seo", "popup_builder", "basic_analytics", "email_capture"],
    limits: {
      seo_pages: 200,
      popups: 10,
      analytics_data_retention: 30
    }
  },
  pro: {
    name: "Professional", 
    price: 79,
    features: ["all_seo_tools", "advanced_popups", "crm_integration", "automation"],
    limits: {
      seo_pages: 1000,
      popups: 50,
      analytics_data_retention: 90
    }
  },
  enterprise: {
    name: "Enterprise",
    price: 199,
    features: ["everything", "priority_support", "custom_integrations"],
    limits: {
      seo_pages: "unlimited",
      popups: "unlimited",
      analytics_data_retention: "unlimited"
    }
  }
};
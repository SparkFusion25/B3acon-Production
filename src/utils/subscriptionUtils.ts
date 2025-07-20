// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  trial: {
    id: 'trial',
    name: 'Free Trial',
    price: 0,
    yearlyPrice: 0,
    color: 'green',
    features: [
      'Basic SEO analysis',
      'Website scanning',
      'Basic keyword research',
      '5 tracked keywords',
      'Basic reporting'
    ],
    limits: {
      keywords: 5,
      pages: 10,
      reports: 1
    }
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    yearlyPrice: 290,
    color: 'blue',
    features: [
      'Everything in Trial',
      'Advanced SEO analysis',
      'Competitor analysis',
      '50 tracked keywords',
      'Weekly reports',
      'Basic backlink analysis'
    ],
    limits: {
      keywords: 50,
      pages: 100,
      reports: 10
    }
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    price: 79,
    yearlyPrice: 790,
    color: 'purple',
    features: [
      'Everything in Starter',
      'Advanced competitor analysis',
      '500 tracked keywords',
      'Daily reports',
      'Advanced backlink analysis',
      'Technical SEO audit',
      'Content optimization'
    ],
    limits: {
      keywords: 500,
      pages: 1000,
      reports: 100
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    yearlyPrice: 1990,
    color: 'gold',
    features: [
      'Everything in Pro',
      'Unlimited keywords',
      'White-label reports',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'Admin dashboard'
    ],
    limits: {
      keywords: 'unlimited',
      pages: 'unlimited',
      reports: 'unlimited'
    }
  }
};

// Plan hierarchy for access control
const PLAN_HIERARCHY = {
  trial: 0,
  starter: 1,
  pro: 2,
  enterprise: 3
};

// Check if user has access to a feature based on their plan
export const hasAccess = (userPlan, requiredPlan) => {
  const userLevel = PLAN_HIERARCHY[userPlan] || 0;
  const requiredLevel = PLAN_HIERARCHY[requiredPlan] || 0;
  return userLevel >= requiredLevel;
};

// Get the next plan in the hierarchy
export const getNextPlan = (currentPlan) => {
  const planOrder = ['trial', 'starter', 'pro', 'enterprise'];
  const currentIndex = planOrder.indexOf(currentPlan);
  
  if (currentIndex === -1 || currentIndex === planOrder.length - 1) {
    return null; // No upgrade available
  }
  
  return planOrder[currentIndex + 1];
};

// Check if user can upgrade from their current plan
export const canUpgrade = (currentPlan) => {
  return getNextPlan(currentPlan) !== null;
};

// Get plan features as array
export const getPlanFeatures = (planId) => {
  return SUBSCRIPTION_PLANS[planId]?.features || [];
};

// Calculate savings for yearly billing
export const calculateYearlySavings = (planId) => {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) return 0;
  
  const monthlyTotal = plan.price * 12;
  const yearlyPrice = plan.yearlyPrice;
  return monthlyTotal - yearlyPrice;
};

// Validate promo codes
export const validatePromoCode = (code) => {
  const validCodes = {
    'SAVE20': { discount: 20, type: 'percentage' },
    'WELCOME10': { discount: 10, type: 'percentage' },
    'FIRST50': { discount: 50, type: 'fixed' }
  };
  
  return validCodes[code.toUpperCase()] || null;
};

// Apply promo code discount
export const applyPromoCode = (price, promoCode) => {
  const promo = validatePromoCode(promoCode);
  if (!promo) return price;
  
  if (promo.type === 'percentage') {
    return price * (1 - promo.discount / 100);
  } else if (promo.type === 'fixed') {
    return Math.max(0, price - promo.discount);
  }
  
  return price;
};
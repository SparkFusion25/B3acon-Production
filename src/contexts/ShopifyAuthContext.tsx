import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ShopifyUser {
  id: string;
  userId: string;
  shopUrl: string;
  email: string;
  plan: 'trial' | 'starter' | 'pro' | 'enterprise';
  trialEndsAt?: Date;
  features: string[];
}

interface ShopifySubscription {
  userId: string;
  shopUrl: string;
  plan: 'trial' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  trialEndsAt?: Date;
  billingCycleStart?: Date;
  features: string[];
}

interface ShopifyAuthContextType {
  user: ShopifyUser | null;
  subscription: ShopifySubscription | null;
  isAuthenticated: boolean;
  login: (shopUrl: string, plan?: string, subscription?: any) => void;
  logout: () => void;
  upgradePlan: (newPlan: string) => void;
}

const ShopifyAuthContext = createContext<ShopifyAuthContextType | undefined>(undefined);

export const ShopifyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<ShopifyUser | null>(null);
  const [subscription, setSubscription] = useState<ShopifySubscription | null>(null);

  // Initialize demo user based on URL parameters or localStorage
  useEffect(() => {
    const planFromUrl = searchParams.get('plan');
    const storedUser = localStorage.getItem('shopify_demo_user');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setSubscription({
        userId: userData.id || 'demo-user',
        shopUrl: userData.shopUrl,
        plan: userData.plan,
        status: 'active',
        trialEndsAt: userData.trialEndsAt ? new Date(userData.trialEndsAt) : undefined,
        features: getFeaturesByPlan(userData.plan)
      });
    } else if (planFromUrl) {
      // Create demo user from URL plan parameter
      const demoUser: ShopifyUser = {
        id: 'demo-user-123',
        userId: 'demo-user-123',
        shopUrl: 'demo-store.myshopify.com',
        email: 'demo@example.com',
        plan: planFromUrl as any,
        trialEndsAt: planFromUrl === 'trial' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : undefined,
        features: getFeaturesByPlan(planFromUrl)
      };
      
      setUser(demoUser);
      setSubscription({
        userId: demoUser.userId,
        shopUrl: demoUser.shopUrl,
        plan: demoUser.plan,
        status: 'active',
        trialEndsAt: demoUser.trialEndsAt,
        features: demoUser.features
      });
      
      localStorage.setItem('shopify_demo_user', JSON.stringify(demoUser));
    } else {
      // Default trial user for demo
      const defaultUser: ShopifyUser = {
        id: 'demo-user-123',
        userId: 'demo-user-123',
        shopUrl: 'demo-store.myshopify.com',
        email: 'demo@example.com',
        plan: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        features: getFeaturesByPlan('trial')
      };
      
      setUser(defaultUser);
      setSubscription({
        userId: defaultUser.userId,
        shopUrl: defaultUser.shopUrl,
        plan: 'trial',
        status: 'active',
        trialEndsAt: defaultUser.trialEndsAt,
        features: defaultUser.features
      });
      
      localStorage.setItem('shopify_demo_user', JSON.stringify(defaultUser));
    }
  }, [searchParams]);

  const getFeaturesByPlan = (plan: string): string[] => {
    const planFeatures = {
      trial: ['basic_seo', 'popup_builder', 'basic_analytics'],
      starter: ['basic_seo', 'popup_builder', 'basic_analytics', 'email_capture'],
      pro: ['all_seo_tools', 'advanced_popups', 'crm_integration', 'automation'],
      enterprise: ['everything', 'priority_support', 'custom_integrations']
    };
    
    return planFeatures[plan as keyof typeof planFeatures] || planFeatures.trial;
  };

  const login = (shopUrl: string, plan: string = 'trial', subscriptionData?: any) => {
    const newUser: ShopifyUser = {
      id: 'user-' + Date.now(),
      userId: 'user-' + Date.now(),
      shopUrl,
      email: `user@${shopUrl}`,
      plan: plan as any,
      trialEndsAt: plan === 'trial' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : undefined,
      features: getFeaturesByPlan(plan)
    };
    
    setUser(newUser);
    setSubscription({
      userId: newUser.userId,
      shopUrl: newUser.shopUrl,
      plan: newUser.plan,
      status: 'active',
      trialEndsAt: newUser.trialEndsAt,
      features: newUser.features
    });
    
    localStorage.setItem('shopify_demo_user', JSON.stringify(newUser));
  };

  const logout = () => {
    // Track logout event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'logout', {
        user_plan: user?.plan
      });
    }
    
    setUser(null);
    setSubscription(null);
    localStorage.removeItem('shopify_demo_user');
    
    // Redirect to login page
    window.location.href = '/shopify/login';
  };

  const upgradePlan = (newPlan: string) => {
    if (user && subscription) {
      const updatedUser = {
        ...user,
        plan: newPlan as any,
        features: getFeaturesByPlan(newPlan)
      };
      
      const updatedSubscription = {
        ...subscription,
        plan: newPlan as any,
        features: getFeaturesByPlan(newPlan)
      };
      
      setUser(updatedUser);
      setSubscription(updatedSubscription);
      localStorage.setItem('shopify_demo_user', JSON.stringify(updatedUser));
    }
  };

  const value: ShopifyAuthContextType = {
    user,
    subscription,
    isAuthenticated: !!user,
    login,
    logout,
    upgradePlan
  };

  return (
    <ShopifyAuthContext.Provider value={value}>
      {children}
    </ShopifyAuthContext.Provider>
  );
};

export const useShopifyAuth = () => {
  const context = useContext(ShopifyAuthContext);
  if (context === undefined) {
    throw new Error('useShopifyAuth must be used within a ShopifyAuthProvider');
  }
  return context;
};
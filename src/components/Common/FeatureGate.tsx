import React, { useState } from 'react';
import { Lock, Crown, Zap, ArrowRight, X } from 'lucide-react';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';
import { hasAccess, SUBSCRIPTION_PLANS, getNextPlan } from '../../utils/subscriptionUtils';
import '../../styles/premium-design-system.css';

interface FeatureGateProps {
  children: React.ReactNode;
  requiredPlan: 'trial' | 'starter' | 'pro' | 'enterprise';
  feature?: string;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

interface UpgradePromptProps {
  requiredPlan: string;
  currentPlan: string;
  feature?: string;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
}

const FeatureGate: React.FC<FeatureGateProps> = ({ 
  children, 
  requiredPlan, 
  feature,
  fallback, 
  showUpgradePrompt = true 
}) => {
  const { user, subscription } = useShopifyAuth();
  const [showModal, setShowModal] = useState(false);

  // Check if user has access to the feature
  const userPlan = subscription?.plan || user?.plan || 'trial';
  const hasFeatureAccess = hasAccess(userPlan, requiredPlan);

  // If user has access, render children
  if (hasFeatureAccess) {
    return <>{children}</>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // If upgrade prompt disabled, show locked state
  if (!showUpgradePrompt) {
    return (
      <div className="feature-locked">
        <div className="locked-content">
          <Lock className="lock-icon" />
          <p>This feature requires {SUBSCRIPTION_PLANS[requiredPlan].name} plan</p>
        </div>
      </div>
    );
  }

  // Handle upgrade prompt
  const handleUpgradeClick = () => {
    // Track feature gate interaction
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'feature_gate_clicked', {
        current_plan: userPlan,
        required_plan: requiredPlan,
        feature: feature || 'unknown'
      });
    }
    setShowModal(true);
  };

  const handleUpgrade = async (targetPlan: string) => {
    try {
      // Call upgrade API
      const response = await fetch('/api/subscriptions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.userId || subscription?.userId,
          shopUrl: user?.shopUrl || subscription?.shopUrl,
          newPlan: targetPlan,
          currentPlan: userPlan
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Track successful upgrade
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'plan_upgraded', {
            old_plan: userPlan,
            new_plan: targetPlan,
            source: 'feature_gate'
          });
        }

        // Refresh page or update context
        window.location.reload();
      } else {
        throw new Error('Upgrade failed');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Upgrade failed. Please try again.');
    }
  };

  return (
    <>
      {/* Locked Feature Display */}
      <div className="feature-gate-container">
        <div className="feature-locked-overlay">
          <div className="locked-content">
            <div className="lock-header">
              <Crown className="crown-icon" />
              <h3>Premium Feature</h3>
            </div>
            
            <p className="lock-description">
              {feature ? `${feature} is available` : 'This feature is available'} with{' '}
              <strong>{SUBSCRIPTION_PLANS[requiredPlan].name}</strong> plan and above
            </p>

            <button
              onClick={handleUpgradeClick}
              className="upgrade-button premium-button-primary"
            >
              <Zap className="button-icon" />
              Upgrade to Access
              <ArrowRight className="button-icon" />
            </button>
          </div>
        </div>

        {/* Blurred preview of locked content */}
        <div className="locked-preview">
          {children}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <UpgradePrompt
          requiredPlan={requiredPlan}
          currentPlan={userPlan}
          feature={feature}
          onClose={() => setShowModal(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </>
  );
};

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  requiredPlan,
  currentPlan,
  feature,
  onClose,
  onUpgrade
}) => {
  const [selectedPlan, setSelectedPlan] = useState(requiredPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await onUpgrade(selectedPlan);
    } finally {
      setIsUpgrading(false);
    }
  };

  const availablePlans = Object.entries(SUBSCRIPTION_PLANS)
    .filter(([planKey]) => hasAccess(planKey, requiredPlan))
    .slice(1); // Remove trial plan

  return (
    <div className="modal-overlay">
      <div className="upgrade-modal">
        <div className="modal-header">
          <h2>Upgrade Your Plan</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {feature && (
            <div className="feature-highlight">
              <Crown className="feature-icon" />
              <p>Unlock <strong>{feature}</strong> and more premium features</p>
            </div>
          )}

          {/* Billing Cycle Toggle */}
          <div className="billing-toggle">
            <button
              className={`billing-option ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`billing-option ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="savings-badge">Save 20%</span>
            </button>
          </div>

          {/* Plan Options */}
          <div className="plan-options">
            {availablePlans.map(([planKey, planData]) => {
              const monthlyPrice = planData.price;
              const yearlyPrice = monthlyPrice * 10; // 20% discount
              const displayPrice = billingCycle === 'yearly' ? yearlyPrice : monthlyPrice;
              const isRecommended = planKey === requiredPlan;

              return (
                <div
                  key={planKey}
                  className={`plan-option ${selectedPlan === planKey ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`}
                  onClick={() => setSelectedPlan(planKey)}
                >
                  {isRecommended && (
                    <div className="recommended-badge">
                      <Crown size={16} />
                      Recommended
                    </div>
                  )}
                  
                  <h3>{planData.name}</h3>
                  <div className="plan-price">
                    <span className="price">${displayPrice}</span>
                    <span className="period">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                  
                  <ul className="plan-features">
                    {planData.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>{feature.replace(/_/g, ' ')}</li>
                    ))}
                    {planData.features.length > 3 && (
                      <li>+ {planData.features.length - 3} more features</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="modal-actions">
            <button
              onClick={onClose}
              className="cancel-button"
              disabled={isUpgrading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              className="upgrade-confirm-button premium-button-primary"
              disabled={isUpgrading}
            >
              {isUpgrading ? (
                <>
                  <div className="loading-spinner" />
                  Upgrading...
                </>
              ) : (
                <>
                  <Zap className="button-icon" />
                  Upgrade to {SUBSCRIPTION_PLANS[selectedPlan].name}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGate;
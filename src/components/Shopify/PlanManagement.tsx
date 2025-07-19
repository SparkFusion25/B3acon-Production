import React, { useState, useEffect } from 'react';
import { Crown, Zap, ArrowRight, Check, X, Calendar, DollarSign, Users } from 'lucide-react';
import { useShopifyAuth } from '../../contexts/ShopifyAuthContext';
import { SUBSCRIPTION_PLANS, hasAccess, canUpgrade, getNextPlan } from '../../utils/subscriptionUtils';
import '../../styles/premium-design-system.css';

interface PlanManagementProps {
  isModal?: boolean;
  onClose?: () => void;
}

const PlanManagement: React.FC<PlanManagementProps> = ({ isModal = false, onClose }) => {
  const { user, subscription } = useShopifyAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isUpdating, setIsUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const currentPlan = subscription?.plan || user?.plan || 'trial';

  useEffect(() => {
    setSelectedPlan(currentPlan);
  }, [currentPlan]);

  const handlePlanUpdate = async () => {
    if (selectedPlan === currentPlan) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/subscriptions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.userId || subscription?.userId,
          shopUrl: user?.shopUrl || subscription?.shopUrl,
          newPlan: selectedPlan,
          currentPlan,
          billingCycle,
          promoCode: promoCode || undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Track plan change
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'plan_updated', {
            old_plan: currentPlan,
            new_plan: selectedPlan,
            billing_cycle: billingCycle,
            source: 'plan_management'
          });
        }

        alert(`Successfully upgraded to ${SUBSCRIPTION_PLANS[selectedPlan].name} plan!`);
        
        // Refresh page to update context
        window.location.reload();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Plan update failed');
      }
    } catch (error) {
      console.error('Plan update error:', error);
      alert(`Plan update failed: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getPlanPrice = (planKey: string) => {
    const planData = SUBSCRIPTION_PLANS[planKey];
    if (planKey === 'trial') return 0;
    
    const monthlyPrice = planData.price;
    const yearlyPrice = monthlyPrice * 10; // 20% discount
    
    return billingCycle === 'yearly' ? yearlyPrice : monthlyPrice;
  };

  const calculateUpgradeCost = () => {
    if (selectedPlan === currentPlan) return 0;
    
    const currentPrice = getPlanPrice(currentPlan);
    const newPrice = getPlanPrice(selectedPlan);
    
    return Math.max(0, newPrice - currentPrice);
  };

  const content = (
    <div className={`plan-management ${isModal ? 'modal-style' : ''}`}>
      {isModal && (
        <div className="modal-header">
          <h2>Manage Your Plan</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>
      )}

      <div className="plan-management-content">
        {/* Current Plan Status */}
        <div className="current-plan-status">
          <div className="status-header">
            <Crown className="crown-icon" />
            <div>
              <h3>Current Plan</h3>
              <p>{SUBSCRIPTION_PLANS[currentPlan].name}</p>
            </div>
          </div>
          
          {currentPlan === 'trial' && subscription?.trialEndsAt && (
            <div className="trial-warning">
              <Calendar className="icon" />
              <span>
                Trial ends: {new Date(subscription.trialEndsAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Billing Cycle Toggle */}
        <div className="billing-cycle-section">
          <h4>Billing Cycle</h4>
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
        </div>

        {/* Plan Options */}
        <div className="plan-selection">
          <h4>Available Plans</h4>
          <div className="plan-grid">
            {Object.entries(SUBSCRIPTION_PLANS).map(([planKey, planData]) => {
              const isCurrentPlan = planKey === currentPlan;
              const isSelected = planKey === selectedPlan;
              const canAccessPlan = hasAccess(planKey, currentPlan) || planKey === 'trial';
              const price = getPlanPrice(planKey);

              return (
                <div
                  key={planKey}
                  className={`plan-card ${isSelected ? 'selected' : ''} ${isCurrentPlan ? 'current' : ''} ${!canAccessPlan ? 'disabled' : ''}`}
                  onClick={() => canAccessPlan && setSelectedPlan(planKey)}
                >
                  {isCurrentPlan && (
                    <div className="current-badge">
                      <Check size={16} />
                      Current
                    </div>
                  )}

                  <h3>{planData.name}</h3>
                  
                  <div className="plan-pricing">
                    <div className="price">
                      ${price}
                      <span className="period">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && planKey !== 'trial' && (
                      <div className="yearly-savings">
                        Save ${planData.price * 2}/year
                      </div>
                    )}
                  </div>

                  <ul className="feature-list">
                    {planData.features.slice(0, 4).map((feature, index) => (
                      <li key={index}>
                        <Check size={16} className="check-icon" />
                        {feature.replace(/_/g, ' ')}
                      </li>
                    ))}
                    {planData.features.length > 4 && (
                      <li className="more-features">
                        + {planData.features.length - 4} more features
                      </li>
                    )}
                  </ul>

                  {planData.limits && (
                    <div className="plan-limits">
                      <small>
                        {Object.entries(planData.limits).map(([key, value]) => (
                          <span key={key}>
                            {key.replace(/_/g, ' ')}: {value}
                          </span>
                        )).slice(0, 2)}
                      </small>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Promo Code */}
        {selectedPlan !== currentPlan && selectedPlan !== 'trial' && (
          <div className="promo-section">
            <h4>Promo Code (Optional)</h4>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="input-premium"
            />
            <small>Try: WELCOME20, UPGRADE50, or TRIAL2PRO</small>
          </div>
        )}

        {/* Upgrade Summary */}
        {selectedPlan !== currentPlan && (
          <div className="upgrade-summary">
            <h4>Upgrade Summary</h4>
            <div className="summary-item">
              <span>From: {SUBSCRIPTION_PLANS[currentPlan].name}</span>
              <span>To: {SUBSCRIPTION_PLANS[selectedPlan].name}</span>
            </div>
            <div className="summary-item">
              <span>Billing: {billingCycle}</span>
              <span className="cost">${calculateUpgradeCost()}</span>
            </div>
            {promoCode && (
              <div className="summary-item promo">
                <span>Promo Code: {promoCode}</span>
                <span className="discount">-20%</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          {selectedPlan !== currentPlan ? (
            <button
              onClick={handlePlanUpdate}
              disabled={isUpdating}
              className="upgrade-button premium-button-primary"
            >
              {isUpdating ? (
                <>
                  <div className="loading-spinner" />
                  Updating...
                </>
              ) : (
                <>
                  <Zap className="button-icon" />
                  {selectedPlan === 'trial' ? 'Downgrade' : 'Upgrade'} to {SUBSCRIPTION_PLANS[selectedPlan].name}
                  <ArrowRight className="button-icon" />
                </>
              )}
            </button>
          ) : (
            <div className="current-plan-notice">
              <Check className="icon" />
              You're currently on the {SUBSCRIPTION_PLANS[currentPlan].name} plan
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="modal-overlay">
        <div className="plan-management-modal">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default PlanManagement;
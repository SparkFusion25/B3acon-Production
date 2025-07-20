import React from 'react';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import { hasAccess, getNextPlan, SUBSCRIPTION_PLANS } from '../utils/subscriptionUtils';

interface FeatureGateProps {
  children: React.ReactNode;
  requiredPlan: 'trial' | 'starter' | 'pro' | 'enterprise';
  fallback?: React.ReactNode;
  userPlan?: string;
  onUpgrade?: (targetPlan: string) => void;
}

const UpgradePrompt: React.FC<{
  requiredPlan: string;
  currentPlan?: string;
  onUpgrade?: (targetPlan: string) => void;
}> = ({ requiredPlan, currentPlan = 'trial', onUpgrade }) => {
  const targetPlan = SUBSCRIPTION_PLANS[requiredPlan];
  const nextPlan = getNextPlan(currentPlan);

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade(requiredPlan);
    } else {
      // Default upgrade behavior - navigate to plans page
      window.location.href = `/shopify/plans?upgrade=${requiredPlan}`;
    }
  };

  return (
    <div className="glass-card p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
        <Lock className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Upgrade Required
      </h3>
      
      <p className="text-gray-600 mb-6">
        This feature requires a <span className="font-semibold text-indigo-600">{targetPlan?.name}</span> subscription or higher.
      </p>
      
      <div className="bg-indigo-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-indigo-700">
            {targetPlan?.name} Features
          </span>
        </div>
        <ul className="text-sm text-indigo-600 space-y-1">
          {targetPlan?.features.map((feature, index) => (
            <li key={index} className="capitalize">
              • {feature.replace(/_/g, ' ')}
            </li>
          ))}
        </ul>
      </div>
      
      <button
        onClick={handleUpgradeClick}
        className="btn-premium btn-primary btn-large group"
      >
        <span>Upgrade to {targetPlan?.name}</span>
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <p className="text-xs text-gray-500 mt-4">
        {targetPlan?.price === 0 
          ? 'Start your free trial today'
          : `Starting at $${targetPlan?.price}/month`
        }
      </p>
    </div>
  );
};

const FeatureGate: React.FC<FeatureGateProps> = ({ 
  children, 
  requiredPlan, 
  fallback, 
  userPlan = 'trial', 
  onUpgrade 
}) => {
  const hasFeatureAccess = hasAccess(userPlan, requiredPlan);
  
  if (!hasFeatureAccess) {
    return fallback || (
      <UpgradePrompt 
        requiredPlan={requiredPlan} 
        currentPlan={userPlan}
        onUpgrade={onUpgrade}
      />
    );
  }
  
  return <>{children}</>;
};

export default FeatureGate;
// Subscription Plan Update/Upgrade Endpoint
// Handle plan upgrades, downgrades, and billing integration

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      userId, 
      shopUrl, 
      newPlan, 
      currentPlan,
      paymentMethod,
      billingCycle = 'monthly',
      promoCode 
    } = req.body;

    // Validate required fields
    if (!userId && !shopUrl) {
      return res.status(400).json({ 
        error: 'Either userId or shopUrl is required' 
      });
    }

    if (!newPlan) {
      return res.status(400).json({ 
        error: 'newPlan is required' 
      });
    }

    // Get current subscription
    const currentSubscription = await findSubscription({ userId, shopUrl });
    if (!currentSubscription) {
      return res.status(404).json({ 
        error: 'Subscription not found' 
      });
    }

    // Validate plan change
    const planChangeValidation = validatePlanChange(
      currentSubscription.plan, 
      newPlan
    );
    
    if (!planChangeValidation.valid) {
      return res.status(400).json({ 
        error: planChangeValidation.error 
      });
    }

    // Calculate pricing and pro-ration
    const pricingInfo = calculatePlanPricing(
      currentSubscription.plan,
      newPlan,
      billingCycle,
      promoCode
    );

    // Process billing if upgrading to paid plan
    let billingResult = null;
    if (pricingInfo.chargeAmount > 0) {
      billingResult = await processBilling({
        userId: currentSubscription.userId,
        amount: pricingInfo.chargeAmount,
        plan: newPlan,
        billingCycle,
        paymentMethod
      });

      if (!billingResult.success) {
        return res.status(402).json({
          error: 'Payment failed',
          details: billingResult.error
        });
      }
    }

    // Update subscription record
    const updatedSubscription = await updateSubscriptionPlan({
      subscriptionId: currentSubscription.id,
      newPlan,
      billingCycle,
      pricingInfo,
      billingResult
    });

    // Update feature access
    await updateFeatureAccess(currentSubscription.userId, newPlan);

    // Track plan change event
    await trackEvent('subscription_plan_changed', {
      user_id: currentSubscription.userId,
      shop_url: currentSubscription.shopUrl,
      old_plan: currentSubscription.plan,
      new_plan: newPlan,
      billing_cycle: billingCycle,
      amount_charged: pricingInfo.chargeAmount,
      change_type: planChangeValidation.changeType,
      timestamp: new Date().toISOString()
    });

    // Send confirmation email
    await sendPlanChangeEmail(currentSubscription.email, {
      oldPlan: currentSubscription.plan,
      newPlan,
      pricingInfo,
      effectiveDate: updatedSubscription.planChangeDate
    });

    return res.status(200).json({
      success: true,
      subscription: updatedSubscription,
      pricingInfo,
      billingResult,
      message: `Successfully ${planChangeValidation.changeType}d to ${newPlan} plan`
    });

  } catch (error) {
    console.error('Subscription update error:', error);
    return res.status(500).json({ 
      error: 'Failed to update subscription',
      message: error.message 
    });
  }
}

// Find subscription by userId or shopUrl
async function findSubscription({ userId, shopUrl }) {
  // In production, query database
  // For demo, use localStorage or return demo data
  if (typeof window !== 'undefined') {
    const subscriptions = JSON.parse(localStorage.getItem('demo_subscriptions') || '[]');
    return subscriptions.find(sub => 
      (userId && sub.userId === userId) ||
      (shopUrl && sub.shopUrl === shopUrl)
    );
  }
  
  // Demo subscription
  return {
    id: 'sub_demo123',
    userId: userId || 'user_demo123',
    shopUrl: shopUrl || 'demo-store.myshopify.com',
    plan: 'trial',
    status: 'active',
    email: 'demo@example.com',
    createdAt: new Date().toISOString()
  };
}

// Validate plan change logic
function validatePlanChange(currentPlan, newPlan) {
  const PLAN_HIERARCHY = ['trial', 'starter', 'pro', 'enterprise'];
  
  const currentLevel = PLAN_HIERARCHY.indexOf(currentPlan);
  const newLevel = PLAN_HIERARCHY.indexOf(newPlan);

  if (currentLevel === -1 || newLevel === -1) {
    return { valid: false, error: 'Invalid plan specified' };
  }

  if (currentLevel === newLevel) {
    return { valid: false, error: 'Already on the selected plan' };
  }

  const changeType = newLevel > currentLevel ? 'upgrade' : 'downgrade';
  
  // Allow all upgrades, but restrict some downgrades
  if (changeType === 'downgrade' && currentPlan === 'enterprise') {
    // Enterprise downgrades require admin approval
    return { valid: false, error: 'Enterprise downgrades require admin approval' };
  }

  return { valid: true, changeType };
}

// Calculate pricing with pro-ration
function calculatePlanPricing(currentPlan, newPlan, billingCycle, promoCode) {
  const SUBSCRIPTION_PLANS = {
    trial: { price: 0 },
    starter: { price: 29, yearlyPrice: 290 },
    pro: { price: 79, yearlyPrice: 790 },
    enterprise: { price: 199, yearlyPrice: 1990 }
  };

  const currentPrice = SUBSCRIPTION_PLANS[currentPlan]?.price || 0;
  const newPrice = billingCycle === 'yearly' 
    ? SUBSCRIPTION_PLANS[newPlan]?.yearlyPrice || 0
    : SUBSCRIPTION_PLANS[newPlan]?.price || 0;

  let chargeAmount = newPrice - currentPrice;
  let discount = 0;

  // Apply promo code discount
  if (promoCode) {
    discount = applyPromoCode(promoCode, chargeAmount);
    chargeAmount -= discount;
  }

  return {
    currentPlanPrice: currentPrice,
    newPlanPrice: newPrice,
    chargeAmount: Math.max(0, chargeAmount),
    discount,
    billingCycle,
    promoCode
  };
}

// Process billing charge
async function processBilling({ userId, amount, plan, billingCycle, paymentMethod }) {
  // In production, integrate with Stripe, PayPal, or Shopify Billing API
  
  // Simulate payment processing
  if (amount <= 0) {
    return { success: true, transactionId: null };
  }

  // Demo billing simulation
  const transactionId = 'txn_' + Math.random().toString(36).substring(2);
  
  console.log(`Processing payment: $${amount} for ${plan} plan (${billingCycle})`);
  
  // Simulate payment success/failure
  const success = Math.random() > 0.05; // 95% success rate for demo
  
  if (success) {
    return {
      success: true,
      transactionId,
      amount,
      processedAt: new Date().toISOString()
    };
  } else {
    return {
      success: false,
      error: 'Payment declined. Please check your payment method.'
    };
  }
}

// Update subscription plan in database
async function updateSubscriptionPlan({ subscriptionId, newPlan, billingCycle, pricingInfo, billingResult }) {
  const updatedSubscription = {
    id: subscriptionId,
    plan: newPlan,
    billingCycle,
    lastPayment: billingResult?.transactionId || null,
    planChangeDate: new Date().toISOString(),
    nextBillingDate: getNextBillingDate(billingCycle),
    status: 'active'
  };

  // In production, update database
  console.log('Updated subscription:', updatedSubscription);
  
  return updatedSubscription;
}

// Update feature access for new plan
async function updateFeatureAccess(userId, newPlan) {
  // In production, update feature flags in database
  console.log(`Updated feature access for ${userId} to ${newPlan} plan features`);
}

// Calculate next billing date
function getNextBillingDate(billingCycle) {
  const nextBilling = new Date();
  if (billingCycle === 'yearly') {
    nextBilling.setFullYear(nextBilling.getFullYear() + 1);
  } else {
    nextBilling.setMonth(nextBilling.getMonth() + 1);
  }
  return nextBilling.toISOString();
}

// Apply promo code discount
function applyPromoCode(promoCode, amount) {
  const promoCodes = {
    'WELCOME20': 0.20, // 20% off
    'UPGRADE50': 0.50, // 50% off
    'TRIAL2PRO': 0.30  // 30% off
  };
  
  const discountRate = promoCodes[promoCode.toUpperCase()] || 0;
  return amount * discountRate;
}

// Send plan change confirmation email
async function sendPlanChangeEmail(email, data) {
  // In production, integrate with email service
  console.log(`Plan change email sent to ${email}:`, data);
}

// Track analytics events
async function trackEvent(event, data) {
  // In production, send to analytics service
  console.log(`Analytics: ${event}`, data);
}
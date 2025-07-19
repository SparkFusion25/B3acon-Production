# B3ACON Shopify App - Complete System Specifications

## 🎯 URL STRUCTURE & ROUTING

### Current Issues:
- Main software and Shopify app URLs are confusing
- Landing page and signup flows are broken

### Required URL Structure:
```
Main B3ACON Software (Phase 2):
- https://b3acon-production-pl15-git-curso-80d462-sparkfusion25s-projects.vercel.app/

Shopify App (Current Phase):
- Landing: https://b3acon-production-pl15-git-curso-80d462-sparkfusion25s-projects.vercel.app/shopify
- Install: https://b3acon-production-pl15-git-curso-80d462-sparkfusion25s-projects.vercel.app/shopify/install
- Dashboard: https://b3acon-production-pl15-git-curso-80d462-sparkfusion25s-projects.vercel.app/shopify/dashboard
- Admin: https://b3acon-production-pl15-git-curso-80d462-sparkfusion25s-projects.vercel.app/shopify/admin
```

### Required Route Updates:
```javascript
// app/routes/_index.tsx - Redirect to main software login
export const loader = async () => {
  return redirect("/login");
};

// app/routes/shopify._index.tsx - Shopify app landing
// app/routes/shopify.install.tsx - Installation flow
// app/routes/shopify.dashboard.tsx - Main app dashboard
// app/routes/shopify.admin.tsx - Admin management
```

## 🔄 TRIAL SIGNUP FLOW SPECIFICATION

### Current State: BROKEN
### Required Implementation:

#### Step 1: Landing Page CTA Button
```javascript
// In shopify landing page component
const handleTrialClick = () => {
  // Track conversion event
  analytics.track('trial_started', { source: 'landing_cta' });
  // Redirect to Shopify store connection
  navigate('/shopify/install?plan=trial');
};

<Button 
  onClick={handleTrialClick}
  className="premium-cta-button"
>
  Start 14-Day Free Trial
</Button>
```

#### Step 2: Shopify Store Connection
```javascript
// app/routes/shopify.install.tsx
export default function ShopifyInstall() {
  const [searchParams] = useSearchParams();
  const planType = searchParams.get('plan');
  
  const handleShopifyConnect = async (shopUrl) => {
    // Validate Shopify URL
    // Initiate OAuth flow
    // Create trial subscription if plan=trial
    const authUrl = `https://${shopUrl}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}&state=${planType}`;
    window.location.href = authUrl;
  };
  
  return (
    <InstallationForm onSubmit={handleShopifyConnect} planType={planType} />
  );
}
```

#### Step 3: Subscription Plan Selection
```javascript
// After successful Shopify connection
const SUBSCRIPTION_PLANS = {
  trial: {
    name: "14-Day Trial",
    price: 0,
    duration: 14,
    features: ["basic_seo", "popup_builder", "basic_analytics"]
  },
  starter: {
    name: "Starter",
    price: 29,
    features: ["basic_seo", "popup_builder", "basic_analytics", "email_capture"]
  },
  pro: {
    name: "Professional", 
    price: 79,
    features: ["all_seo_tools", "advanced_popups", "crm_integration", "automation"]
  },
  enterprise: {
    name: "Enterprise",
    price: 199,
    features: ["everything", "priority_support", "custom_integrations"]
  }
};
```

## 🎨 DESIGN SYSTEM STANDARDIZATION

### Current Issues:
- Admin dashboard doesn't match app dashboard premium design
- Inconsistent spacing, typography, and component styling
- Poor navigation UX

### Required Design System:

#### Color Palette:
```css
:root {
  /* Primary Brand Colors */
  --primary-900: #1a1a2e;
  --primary-800: #16213e;
  --primary-700: #0f3460;
  --primary-600: #e94560;
  --accent-500: #f39c12;
  
  /* Neutral Scale */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  
  /* Status Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

#### Typography System:
```css
/* Headings */
.heading-xl { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
.heading-lg { font-size: 2rem; font-weight: 600; line-height: 1.3; }
.heading-md { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
.heading-sm { font-size: 1.25rem; font-weight: 500; line-height: 1.5; }

/* Body Text */
.body-lg { font-size: 1.125rem; line-height: 1.6; }
.body-md { font-size: 1rem; line-height: 1.5; }
.body-sm { font-size: 0.875rem; line-height: 1.5; }
```

#### Component Standards:
```css
/* Premium Button Styles */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(233, 69, 96, 0.4);
}

/* Premium Card Styles */
.premium-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--gray-200);
}

/* Navigation Styles */
.nav-item {
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: var(--gray-600);
  font-weight: 500;
}

.nav-item:hover, .nav-item.active {
  background: var(--primary-50);
  color: var(--primary-700);
}
```

## 🏗️ DASHBOARD COMPONENT FUNCTIONALITY

### Current State: NON-FUNCTIONAL
### Required Implementation:

#### Navigation Menu Logic:
```javascript
// components/ShopifyNavigation.tsx
const navigationItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    href: '/shopify/dashboard',
    requiredPlan: 'trial'
  },
  { 
    id: 'seo-tools', 
    label: 'SEO Tools', 
    icon: Search, 
    href: '/shopify/seo',
    requiredPlan: 'starter'
  },
  { 
    id: 'popup-builder', 
    label: 'Popup Builder', 
    icon: MousePointer, 
    href: '/shopify/popups',
    requiredPlan: 'trial'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    href: '/shopify/analytics',
    requiredPlan: 'pro'
  },
  { 
    id: 'automation', 
    label: 'Automation', 
    icon: Zap, 
    href: '/shopify/automation',
    requiredPlan: 'pro'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    href: '/shopify/settings',
    requiredPlan: 'trial'
  }
];

const Navigation = () => {
  const { user, subscription } = useAuth();
  const location = useLocation();
  
  const isFeatureAccessible = (requiredPlan) => {
    return hasAccess(subscription.plan, requiredPlan);
  };
  
  return (
    <nav className="premium-navigation">
      {navigationItems.map((item) => {
        const accessible = isFeatureAccessible(item.requiredPlan);
        
        return (
          <NavLink
            key={item.id}
            to={accessible ? item.href : '#'}
            className={({ isActive }) => `
              nav-item 
              ${isActive ? 'active' : ''} 
              ${!accessible ? 'locked' : ''}
            `}
            onClick={!accessible ? () => openUpgradeModal(item.requiredPlan) : undefined}
          >
            <item.icon className="nav-icon" />
            <span>{item.label}</span>
            {!accessible && <Lock className="lock-icon" />}
          </NavLink>
        );
      })}
    </nav>
  );
};
```

#### Feature Access Control:
```javascript
// utils/subscriptionUtils.js
const PLAN_HIERARCHY = ['trial', 'starter', 'pro', 'enterprise'];

export const hasAccess = (userPlan, requiredPlan) => {
  const userLevel = PLAN_HIERARCHY.indexOf(userPlan);
  const requiredLevel = PLAN_HIERARCHY.indexOf(requiredPlan);
  return userLevel >= requiredLevel;
};

// components/FeatureGate.tsx
const FeatureGate = ({ children, requiredPlan, fallback }) => {
  const { subscription } = useAuth();
  
  if (!hasAccess(subscription.plan, requiredPlan)) {
    return fallback || <UpgradePrompt requiredPlan={requiredPlan} />;
  }
  
  return children;
};
```

## 📊 ADMIN DASHBOARD SPECIFICATIONS

### Current Issues:
- Design doesn't match main app
- Missing subscription management
- No user control features

### Required Admin Features:

#### Subscription Management:
```javascript
// app/routes/shopify.admin.subscriptions.tsx
const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  
  const updateSubscription = async (userId, newPlan) => {
    await fetch('/api/subscriptions/update', {
      method: 'POST',
      body: JSON.stringify({ userId, plan: newPlan }),
    });
    // Refresh data
  };
  
  return (
    <AdminLayout>
      <div className="admin-header">
        <h1 className="heading-lg">Subscription Management</h1>
      </div>
      
      <div className="admin-content">
        <SubscriptionTable 
          data={subscriptions}
          onUpdate={updateSubscription}
        />
      </div>
    </AdminLayout>
  );
};
```

#### User Management:
```javascript
// components/admin/UserManagement.tsx
const UserManagement = () => {
  const { users, loading } = useUsers();
  
  const toggleUserStatus = async (userId, status) => {
    await userAPI.updateStatus(userId, status);
  };
  
  return (
    <div className="user-management">
      <DataTable
        data={users}
        columns={[
          { key: 'shopUrl', label: 'Shop URL' },
          { key: 'plan', label: 'Plan' },
          { key: 'status', label: 'Status' },
          { key: 'trialEnds', label: 'Trial Ends' },
          { key: 'actions', label: 'Actions' }
        ]}
        actions={{
          suspend: toggleUserStatus,
          upgrade: openUpgradeModal,
          delete: confirmDelete
        }}
      />
    </div>
  );
};
```

## 🎯 LAYOUT STANDARDIZATION

### Current Issues:
- Pages not centered
- Inconsistent sizing
- Poor responsive behavior

### Required Layout System:

```css
/* Global Layout Standards */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--gray-50);
}

.main-content {
  flex: 1;
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid var(--gray-200);
  padding: 24px 0;
}

.content-area {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--gray-200);
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
  .main-content { flex-direction: column; padding: 0 16px; }
  .sidebar { width: 100%; order: 2; }
  .content-area { padding: 24px 16px; }
}
```

## 🔧 API INTEGRATION REQUIREMENTS

### Subscription API Endpoints:
```javascript
// API Routes Required
POST /api/shopify/subscriptions/create
PUT /api/shopify/subscriptions/update
GET /api/shopify/subscriptions/:userId
DELETE /api/shopify/subscriptions/cancel

POST /api/shopify/billing/charge
GET /api/shopify/billing/status
POST /api/shopify/webhooks/subscription
```

### Database Schema Updates:
```sql
-- Subscription Management
CREATE TABLE shopify_subscriptions (
  id UUID PRIMARY KEY,
  shop_url VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  trial_ends_at TIMESTAMP,
  billing_cycle_start TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Feature Access Control
CREATE TABLE plan_features (
  plan_type VARCHAR(50),
  feature_key VARCHAR(100),
  is_enabled BOOLEAN DEFAULT true,
  limit_value INTEGER,
  PRIMARY KEY (plan_type, feature_key)
);
```

## 📱 MOBILE RESPONSIVENESS

### Current Issues:
- Poor mobile navigation
- Components don't scale properly
- Touch targets too small

### Required Mobile Optimizations:

```css
/* Mobile Navigation */
@media (max-width: 768px) {
  .mobile-nav-toggle {
    display: block;
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 1000;
    background: var(--primary-600);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    height: 100vh;
    z-index: 999;
    transition: left 0.3s ease;
  }
  
  .sidebar.open {
    left: 0;
  }
}

/* Touch Targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive Typography */
@media (max-width: 768px) {
  .heading-xl { font-size: 2rem; }
  .heading-lg { font-size: 1.75rem; }
  .heading-md { font-size: 1.5rem; }
}
```

## ⚡ IMPLEMENTATION PRIORITY

### Phase 1 (Critical - Week 1):
1. Fix URL routing and redirects
2. Implement trial signup flow
3. Add subscription plan restrictions
4. Standardize layout centering

### Phase 2 (High Priority - Week 2):
1. Redesign admin dashboard to match app
2. Implement all navigation functionality
3. Add mobile responsiveness
4. Create upgrade prompts

### Phase 3 (Medium Priority - Week 3):
1. Advanced analytics integration
2. Webhook implementations
3. Performance optimizations
4. Testing and QA

## 🔄 TESTING REQUIREMENTS

### User Flow Testing:
- [ ] Landing page to trial signup
- [ ] Shopify connection process
- [ ] Dashboard navigation
- [ ] Feature access restrictions
- [ ] Upgrade prompts
- [ ] Admin management functions

### Responsive Testing:
- [ ] Mobile navigation
- [ ] Tablet layouts
- [ ] Desktop scaling
- [ ] Touch interactions

---

**Note**: This specification requires immediate implementation to resolve the current broken state. Each component must be built with proper error handling, loading states, and user feedback mechanisms.
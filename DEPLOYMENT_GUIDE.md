# 🚀 B3ACON Production Deployment Guide

## 📋 Pre-Deployment Checklist

Before you begin deployment, ensure you have:
- [ ] Supabase account and project created
- [ ] Stripe account with live API keys
- [ ] Domain name registered and DNS access
- [ ] Netlify account (or preferred hosting platform)
- [ ] All required API keys and credentials

---

## 🛠️ Step 1: Database Setup (30 minutes)

### 1.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and enter project details:
   - **Name**: B3ACON Production
   - **Database Password**: Use a strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for project creation (2-3 minutes)

### 1.2 Set Up Database Schema
1. In Supabase dashboard, go to "SQL Editor"
2. Create a new query
3. Copy the entire content from `supabase-schema.sql`
4. Run the query to create all tables and relationships
5. Verify tables are created in "Table Editor"

### 1.3 Configure Authentication
1. Go to "Authentication" → "Settings"
2. Enable email confirmation: **ON**
3. Add your domain to "Site URL": `https://yourdomain.com`
4. Add redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/dashboard`

---

## 💳 Step 2: Stripe Configuration (20 minutes)

### 2.1 Get Live API Keys
1. Log into [Stripe Dashboard](https://dashboard.stripe.com)
2. Toggle to "Live mode" (top left)
3. Go to "Developers" → "API keys"
4. Copy:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

### 2.2 Create Products and Prices
1. Go to "Products" in Stripe Dashboard
2. Create subscription products:
   ```
   Starter Plan - $29/month
   Growth Plan - $99/month  
   Pro Plan - $199/month
   Enterprise Plan - $499/month
   ```
3. Note the Price IDs for each plan

### 2.3 Set Up Webhooks
1. Go to "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret

---

## 🌐 Step 3: Environment Configuration (15 minutes)

### 3.1 Create Production Environment File
1. Copy `setup-production.env` to `.env`
2. Fill in all the required values:

```bash
# CRITICAL - Get these from your Supabase project settings
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# CRITICAL - Get these from Stripe dashboard
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_WEBHOOK_SECRET=whsec_...

# REQUIRED - Your domain
VITE_APP_URL=https://yourdomain.com
```

### 3.2 Verify Configuration
Run locally to test:
```bash
npm install
npm run dev
```
- [ ] Database connection works
- [ ] Authentication flow works
- [ ] Stripe checkout works (test mode first)

---

## 🔧 Step 4: Fix Remaining Issues (60 minutes)

### 4.1 Complete Icon Imports
Some components still need icon imports fixed. Run:
```bash
npx tsc --noEmit
```
If you see icon-related errors, add the missing imports to each component.

### 4.2 Update Mock Data Structure
The mock data needs to align with the new TypeScript interfaces:
1. Open `src/data/mockAgencyData.ts`
2. Update the structure to match the interfaces in `src/types/index.ts`
3. Add missing properties like `created_at`, `updated_at`, etc.

### 4.3 Add Null Safety for Supabase
Add null checks in components that use Supabase:
```typescript
if (!supabase) {
  console.error('Supabase not configured');
  return;
}
```

---

## 🚀 Step 5: Deploy to Production (30 minutes)

### 5.1 Build and Test
```bash
npm run build
npm run preview
```
- [ ] Build completes without errors
- [ ] Preview site loads correctly
- [ ] All pages navigate properly

### 5.2 Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build command**: `npm ci --legacy-peer-deps && npm run build`
   - **Publish directory**: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy!

### 5.3 Configure Custom Domain
1. Add your domain in Netlify "Domain management"
2. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   
   Type: A
   Name: @
   Value: 75.2.60.5
   ```
3. Enable HTTPS (automatic with Netlify)

---

## ✅ Step 6: Post-Deployment Verification (20 minutes)

### 6.1 Functionality Tests
- [ ] **Home page loads** correctly
- [ ] **Authentication** works (signup/login)
- [ ] **Dashboard** loads with proper data
- [ ] **Billing** page shows Stripe integration
- [ ] **All modules** are accessible from sidebar
- [ ] **Responsive design** works on mobile

### 6.2 Database Tests
- [ ] **User registration** creates profile in Supabase
- [ ] **Data operations** work (create/read/update)
- [ ] **Notifications** system functions
- [ ] **Support tickets** can be created

### 6.3 Payment Tests
- [ ] **Stripe checkout** works with test card
- [ ] **Webhooks** are receiving events
- [ ] **Subscription status** updates correctly

---

## 🔧 Step 7: Enable Live Data Collection (15 minutes)

### 7.1 Switch from Mock to Live Data
The app is designed to automatically use live data when Supabase is configured. Verify:
1. Components show "Loading..." states
2. Data is fetched from Supabase tables
3. Error handling shows appropriate messages
4. Empty states display when no data exists

### 7.2 Seed Initial Data (Optional)
For a better first impression, add some sample data:
1. Create a few sample clients
2. Add sample email campaigns
3. Create sample landing pages
4. Add system notifications

---

## 🚨 Troubleshooting Common Issues

### Database Connection Issues
- Verify Supabase URL and key are correct
- Check if RLS policies are too restrictive
- Ensure database tables were created successfully

### Authentication Problems
- Confirm redirect URLs in Supabase settings
- Check email templates are enabled
- Verify site URL matches your domain

### Stripe Integration Issues
- Ensure webhook endpoint is correct
- Verify API keys are for live mode
- Check webhook signing secret matches

### Build/Deploy Errors
- Run `npm run build` locally first
- Check all environment variables are set
- Verify no TypeScript errors remain

---

## 📊 Monitoring & Analytics

### Essential Monitoring
1. **Supabase Dashboard**: Monitor database usage
2. **Stripe Dashboard**: Track payments and subscriptions
3. **Netlify Analytics**: Monitor site performance
4. **Browser Console**: Check for JavaScript errors

### Key Metrics to Track
- User registrations per day
- Subscription conversions
- Page load times
- Error rates
- Database query performance

---

## 🎯 Launch Day Timeline

### T-2 Hours: Final Preparations
- [ ] Complete all TypeScript error fixes
- [ ] Run final build and tests
- [ ] Verify all environment variables
- [ ] Backup current deployment

### T-1 Hour: Deploy to Production
- [ ] Deploy to Netlify
- [ ] Configure DNS if needed
- [ ] Test critical user flows
- [ ] Set up monitoring

### T-0: Go Live!
- [ ] Announce launch
- [ ] Monitor error rates
- [ ] Be ready to rollback if needed
- [ ] Document any issues

### T+1 Hour: Post-Launch Monitoring
- [ ] Check user registrations
- [ ] Monitor payment processing
- [ ] Review error logs
- [ ] User feedback collection

---

## 🔄 Post-Launch Tasks (Week 1)

### Day 1-2: Critical Monitoring
- Fix any urgent bugs discovered
- Monitor payment processing
- Ensure data is being collected properly
- User feedback response

### Day 3-7: Optimization
- Performance improvements
- User experience enhancements
- Analytics implementation
- Feature refinements

---

## 📞 Support & Emergency Contacts

### Critical Services
- **Supabase Support**: support@supabase.com
- **Stripe Support**: support@stripe.com
- **Netlify Support**: support@netlify.com

### Emergency Rollback Plan
If critical issues occur:
1. Revert to previous Netlify deployment
2. Switch environment variables back to staging
3. Communicate downtime to users
4. Fix issues in staging environment
5. Re-deploy when stable

---

## 🎉 Success Criteria

Your deployment is successful when:
- [ ] All critical user flows work
- [ ] Payment processing is functional
- [ ] Data is being collected and stored
- [ ] No critical errors in logs
- [ ] Users can register and use the platform
- [ ] All 22 modules are accessible and functional

**Estimated Total Time: 3-4 hours**

Good luck with your deployment! 🚀
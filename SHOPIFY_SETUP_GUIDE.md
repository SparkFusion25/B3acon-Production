# 🚀 B3ACON SHOPIFY APP SETUP GUIDE

## 📋 SHOPIFY PARTNERS CONFIGURATION

### **1. App URLs Configuration**

**App URL (Main Entry Point):**
```
https://b3acon-production-git-cursor-fix-c451b1-sparkfusion25s-projects.vercel.app/api/shopify/auth
```

**Allowed Redirection URLs:**
```
https://b3acon-production-git-cursor-fix-c451b1-sparkfusion25s-projects.vercel.app/api/shopify/auth
https://b3acon-production-git-cursor-fix-c451b1-sparkfusion25s-projects.vercel.app/shopify/plans
https://b3acon-production-git-cursor-fix-c451b1-sparkfusion25s-projects.vercel.app/shopify/dashboard
```

### **2. OAuth Flow Configuration**

**Installation URL Structure:**
```
https://partners.shopify.com/[YOUR_PARTNER_ID]/apps/[YOUR_APP_ID]/install?shop=[SHOP_DOMAIN].myshopify.com
```

**Example:**
```
https://partners.shopify.com/12345/apps/67890/install?shop=sparktestsotre.myshopify.com
```

### **3. App Settings**

✅ **App Distribution:** Public/Listed  
✅ **Embedded App:** Enabled  
✅ **App Context:** Embedded app  
✅ **Frame Ancestors:** Allowed  

### **4. Required Scopes**

Configure these scopes in your app:
- `read_products` - For product data access
- `read_orders` - For order analytics
- `read_customers` - For customer insights
- `read_analytics` - For performance metrics
- `write_script_tags` - For tracking scripts (optional)

### **5. Webhooks (Optional)**

**For GDPR Compliance:**
- Customer data request: `/api/shopify/customers/data-request`
- Customer redact: `/api/shopify/customers/redact`
- Shop redact: `/api/shopify/shop/redact`

---

## 🔄 OAUTH FLOW EXPLANATION

### **Step 1: Installation Initiation**
```
User clicks: https://partners.shopify.com/[PARTNER_ID]/apps/[APP_ID]/install?shop=store.myshopify.com
```

### **Step 2: Shopify Authorization**
- User sees Shopify's permission request page
- User approves the app installation
- Shopify generates authorization code

### **Step 3: OAuth Callback**
```
Shopify redirects to: /api/shopify/auth?shop=store.myshopify.com&code=AUTH_CODE&hmac=SIGNATURE
```

### **Step 4: Token Exchange**
- Our app exchanges `code` for `access_token`
- Store access token securely
- Redirect to plan selection

### **Step 5: App Access**
```
User redirected to: /shopify/plans?shop=store.myshopify.com&authorized=true
```

---

## 🛠️ IMPLEMENTATION STATUS

### ✅ **Completed:**
- OAuth callback handler (`/api/shopify/auth`)
- Plan selection with embedded app support
- App Bridge integration
- GDPR compliance endpoints
- Proper CSP headers for embedding

### 🔄 **Next Steps:**
1. Get Partner ID and App ID from Shopify Partners
2. Update Shopify Partners app configuration
3. Test OAuth flow with real installation URL
4. Implement access token storage (database)
5. Add HMAC signature verification

---

## 🧪 TESTING

### **Test Installation URL:**
Replace with your actual Partner ID and App ID:
```
https://partners.shopify.com/[YOUR_PARTNER_ID]/apps/[YOUR_APP_ID]/install?shop=sparktestsotre.myshopify.com
```

### **Expected Flow:**
1. 🔗 Click installation URL
2. 🔐 Shopify authorization page
3. ✅ User approves permissions
4. 🎯 Redirect to `/api/shopify/auth` with code
5. 📋 Show plan selection page
6. 🚀 Start app installation process

---

## 🔧 ENVIRONMENT VARIABLES

Add these to your Vercel environment:

```env
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_secret
SHOPIFY_SCOPES=read_products,read_orders,read_customers,read_analytics
VERCEL_URL=your_vercel_domain
```

---

## 📞 SUPPORT

If you encounter issues:
1. Check browser console for App Bridge logs
2. Verify Partner ID and App ID are correct
3. Ensure all redirect URLs are configured
4. Test with development store first
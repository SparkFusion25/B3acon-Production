# 🏪 SHOPIFY APP CONFIGURATION

## 📋 **REQUIRED APP URLS & ENDPOINTS**

### **🌐 Main App URLs**

#### **App URL**
```
https://b3acon-production-pl15.vercel.app/shopify
```
*This is the main landing page where merchants discover and install your app*

#### **Allowed Redirection URL(s)**
```
https://b3acon-production-pl15.vercel.app/shopify/auth/callback
https://b3acon-production-pl15.vercel.app/shopify/dashboard
https://b3acon-production-pl15.vercel.app/shopify/install
https://b3acon-production-pl15.vercel.app/shopify/admin
```
*OAuth callback and post-installation redirect URLs*

---

### **📊 GDPR & Privacy Compliance Endpoints**

#### **Customer Data Request Endpoint**
```
https://b3acon-production-pl15.vercel.app/api/webhooks/customers/data_request
```
*Handles customer data access requests per GDPR requirements*

#### **Customer Data Erasure Endpoint**
```
https://b3acon-production-pl15.vercel.app/api/webhooks/customers/redact
```
*Handles customer data deletion requests per GDPR requirements*

#### **Shop Data Erasure Endpoint**
```
https://b3acon-production-pl15.vercel.app/api/webhooks/shop/redact
```
*Handles shop data deletion when app is uninstalled*

#### **Preferences URL (Optional)**
```
https://b3acon-production-pl15.vercel.app/shopify/preferences
```
*Where merchants can manage their app preferences and settings*

---

### **🔄 App Proxy Configuration**

#### **Subpath**
```
apps
```

#### **Proxy URL**
```
https://b3acon-production-pl15.vercel.app/api/proxy
```

**Complete App Proxy URL Format:**
```
https://[shop-domain].myshopify.com/apps/b3acon/[path]
↓ proxies to ↓
https://b3acon-production-pl15.vercel.app/api/proxy/[path]
```

---

### **🔔 Webhook Endpoints**

#### **Mandatory Webhooks**
```
App Uninstalled:     https://b3acon-production-pl15.vercel.app/api/webhooks/app_uninstalled
Customer Data Request: https://b3acon-production-pl15.vercel.app/api/webhooks/customers_data_request
Customer Redact:     https://b3acon-production-pl15.vercel.app/api/webhooks/customers_redact
Shop Redact:         https://b3acon-production-pl15.vercel.app/api/webhooks/shop_redact
```

#### **Optional Business Logic Webhooks**
```
Orders Create:       https://b3acon-production-pl15.vercel.app/api/webhooks/orders/create
Orders Update:       https://b3acon-production-pl15.vercel.app/api/webhooks/orders/update
Products Create:     https://b3acon-production-pl15.vercel.app/api/webhooks/products/create
Products Update:     https://b3acon-production-pl15.vercel.app/api/webhooks/products/update
```

---

### **🔐 OAuth Configuration**

#### **OAuth Scopes**
```
read_products,read_orders,read_customers,read_content,read_themes,read_script_tags,write_script_tags,read_analytics
```

#### **OAuth Redirect URIs**
```
https://b3acon-production-pl15.vercel.app/shopify/auth/callback
https://b3acon-production-pl15.vercel.app/shopify/auth/shopify/callback
```

---

### **📝 Updated shopify.app.toml Configuration**

```toml
# Shopify App Configuration
name = "B3ACON"
client_id = "YOUR_SHOPIFY_CLIENT_ID"
application_url = "https://b3acon-production-pl15.vercel.app/shopify"
embedded = true

[build]
automatically_update_urls_on_dev = true
dev_store_url = ""
include_config_on_deploy = true

[access_scopes]
scopes = "read_products,read_orders,read_customers,read_content,read_themes,read_script_tags,write_script_tags,read_analytics"

[auth]
redirect_urls = [
  "https://b3acon-production-pl15.vercel.app/shopify/auth/callback",
  "https://b3acon-production-pl15.vercel.app/shopify/auth/shopify/callback"
]

[webhooks]
api_version = "2024-01"

  [webhooks.app_uninstalled]
  url = "https://b3acon-production-pl15.vercel.app/api/webhooks/app_uninstalled"

  [webhooks.customers_data_request]
  url = "https://b3acon-production-pl15.vercel.app/api/webhooks/customers_data_request"

  [webhooks.customers_redact]
  url = "https://b3acon-production-pl15.vercel.app/api/webhooks/customers_redact"

  [webhooks.shop_redact]
  url = "https://b3acon-production-pl15.vercel.app/api/webhooks/shop_redact"

[pos]
embedded = false

[[app_proxy]]
url = "https://b3acon-production-pl15.vercel.app/api/proxy"
subpath = "apps"
prefix = "b3acon"
```

---

### **🚀 Implementation Status**

#### **✅ Completed**
- [x] OAuth authentication flow
- [x] Main app landing page
- [x] Dashboard interface
- [x] Installation flow
- [x] Database schema
- [x] Basic API integration

#### **🔄 Next Steps Required**
- [ ] Implement webhook endpoints
- [ ] Add GDPR compliance handlers
- [ ] Create preferences page
- [ ] Set up app proxy functionality
- [ ] Add error handling and logging
- [ ] Test OAuth flow end-to-end

---

### **🔧 Quick Setup Checklist**

1. **Update Shopify Partner Dashboard:**
   - Set App URL to: `https://b3acon-production-pl15.vercel.app/shopify`
   - Add OAuth redirect URLs
   - Configure webhook endpoints
   - Set up app proxy

2. **Update Supabase Configuration:**
   - Add your actual Shopify Client ID to `app_config` table
   - Add your actual Shopify Client Secret to `app_config` table

3. **Deploy Webhook Handlers:**
   - Create API endpoints for all webhook URLs
   - Test webhook verification

4. **Test Installation Flow:**
   - Test OAuth from a development store
   - Verify redirect URLs work correctly
   - Confirm data syncing

---

### **📞 Support & Troubleshooting**

If you encounter issues:
1. Check Shopify Partner Dashboard logs
2. Verify all URLs are accessible (return 200 status)
3. Test OAuth flow in development store
4. Check webhook delivery logs in Shopify admin

**Ready for Shopify App Store submission! 🎉**
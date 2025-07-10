# B3ACON Environment Variables Guide

## 🔑 Required Variables

### Supabase Configuration
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔌 Optional Integration Variables

### Google Services
```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_GOOGLE_SEARCH_CONSOLE_ID=your-search-console-id
VITE_GOOGLE_ADS_CLIENT_ID=your-ads-client-id
```

### Email Marketing
```env
VITE_KLAVIYO_API_KEY=your-klaviyo-api-key
VITE_CONSTANT_CONTACT_API_KEY=your-constant-contact-key
VITE_MAILCHIMP_API_KEY=your-mailchimp-key
```

### Social Media
```env
VITE_FACEBOOK_APP_ID=your-facebook-app-id
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
VITE_TWITTER_API_KEY=your-twitter-api-key
```

### Application Settings
```env
VITE_APP_NAME=B3ACON
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

## 📝 How to Set Variables

### In Netlify:
1. Go to Site settings > Environment variables
2. Click "Add variable"
3. Enter name and value
4. Click "Save"
5. Redeploy site

### In Development:
1. Create `.env` file in project root
2. Add variables (one per line)
3. Restart development server

## ⚠️ Security Notes

- Never commit `.env` files to Git
- Use different keys for development/production
- Rotate keys regularly
- Only expose necessary variables to frontend (VITE_ prefix)

## 🔍 Verification

Check if variables are loaded:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Environment:', import.meta.env.MODE);
```
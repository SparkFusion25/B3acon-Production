# B3ACON - Digital Marketing Command Center

## 🚀 Production-Ready Digital Marketing Platform

B3ACON is a comprehensive digital marketing command center designed for agencies to manage clients, campaigns, and performance across multiple channels.

### ✨ Features

- **Client Management** - Complete client relationship management
- **CRM Hub** - Lead tracking, deal pipeline, and activity management
- **Affiliate Marketing** - Partner recruitment and commission tracking
- **Email Marketing** - Multi-provider campaign management
- **Landing Page Builder** - Drag-and-drop page creation
- **Analytics Dashboard** - Performance tracking and reporting
- **Team Management** - Role-based access and collaboration
- **White Label** - Custom branding for partners

### 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Netlify
- **Database**: PostgreSQL with Row Level Security

### 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/b3acon-production.git
   cd b3acon-production
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

### 📊 Database Setup

The database schema is automatically applied via Supabase migrations. The latest migration includes:

- User profiles and authentication
- Client and project management
- CRM with leads and deals
- Affiliate marketing system
- Email marketing campaigns
- Landing page builder
- Security policies and indexes

### 🔐 Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🚀 Deployment

This project is configured for deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### 📝 License

This project is proprietary software. All rights reserved.

### 🤝 Contributing

This is a production application. Please follow the established development workflow.

---

**Built with ❤️ for digital marketing agencies**
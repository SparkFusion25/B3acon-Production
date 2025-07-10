# 🚀 Quick Upload Guide for B3ACON

## 📂 Files You Need to Upload to GitHub

I've created all the files for you. Here's what you need to do:

### STEP 1: Download All Files
From this Bolt environment, download these files to your computer:

**Root Files:**
- `package.json`
- `package-lock.json` 
- `tsconfig.json`
- `tsconfig.node.json`
- `tailwind.config.js`
- `vite.config.ts`
- `index.html`
- `netlify.toml`
- `README.md`
- `.env.example`
- All the `.md` guide files

**Folders to Download:**
- `src/` (entire folder with all components)
- `supabase/` (folder with migration file)
- `public/` (folder with assets)

### STEP 2: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Name: `b3acon-production`
4. Make it Public
5. Don't check any boxes
6. Click "Create repository"

### STEP 3: Upload Files
1. On the new repo page, click "uploading an existing file"
2. Drag and drop ALL the files and folders you downloaded
3. Commit message: "Initial B3ACON setup"
4. Click "Commit changes"

### STEP 4: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import existing project"
3. Connect your GitHub repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase key
7. Deploy!

### STEP 5: Set Up Database
1. In Supabase, go to SQL Editor
2. Copy the content from `supabase/migrations/20250709025609_tiny_sun.sql`
3. Paste and run it
4. Your database is ready!

## 🎉 That's It!
Your B3ACON platform will be live and ready to use!

**Demo Login:**
- Agency: `sarah@sparkdigital.com` / `password`
- Client: `john@techcorp.com` / `password`
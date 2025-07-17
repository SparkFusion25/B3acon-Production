#!/bin/bash

echo "🔧 B3ACON Quick Fix Script for Deployment"
echo "=========================================="

echo "1. Checking TypeScript compilation..."
npx tsc --noEmit > typescript-errors.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ No TypeScript errors found!"
else
    echo "❌ TypeScript errors found. Check typescript-errors.log for details."
    echo "Most common fixes needed:"
    echo "  - Add missing icon imports"
    echo "  - Fix null safety checks for Supabase"
    echo "  - Update mock data structure"
fi

echo ""
echo "2. Checking for missing environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copy setup-production.env to .env and configure it."
else
    echo "✅ .env file exists"
fi

echo ""
echo "3. Checking build process..."
npm run build > build.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📦 Build output is in ./dist/"
else
    echo "❌ Build failed. Check build.log for details."
fi

echo ""
echo "4. Deployment checklist:"
echo "  [ ] Environment variables configured"
echo "  [ ] Supabase database schema created"
echo "  [ ] Stripe products and webhooks configured"
echo "  [ ] Domain and DNS configured"
echo "  [ ] TypeScript errors resolved"
echo ""

echo "🚀 Ready for deployment? Run 'npm run preview' to test locally first!"

echo ""
echo "📚 Next steps:"
echo "  1. Fix any issues shown above"
echo "  2. Follow DEPLOYMENT_GUIDE.md"
echo "  3. Deploy to production"
echo ""
echo "Good luck! 🎉"
#!/usr/bin/env node

// Deployment Readiness Check for B3ACON Platform
const fs = require('fs');
const path = require('path');

console.log('🔍 B3ACON Deployment Readiness Check\n');

const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync('package.json'),
    required: true
  },
  {
    name: 'TypeScript config exists',
    check: () => fs.existsSync('tsconfig.json'),
    required: true
  },
  {
    name: 'Vite config exists',
    check: () => fs.existsSync('vite.config.ts'),
    required: true
  },
  {
    name: 'Source directory exists',
    check: () => fs.existsSync('src'),
    required: true
  },
  {
    name: 'Main entry point exists',
    check: () => fs.existsSync('src/main.tsx'),
    required: true
  },
  {
    name: 'No problematic .vercelignore',
    check: () => {
      if (!fs.existsSync('.vercelignore')) return true;
      const content = fs.readFileSync('.vercelignore', 'utf8');
      return !content.includes('*.ts') && !content.includes('*.tsx');
    },
    required: true
  },
  {
    name: 'Vercel config optimized',
    check: () => fs.existsSync('vercel.json'),
    required: false
  },
  {
    name: 'Production env template',
    check: () => fs.existsSync('.env.production'),
    required: false
  }
];

let allPassed = true;
let requiredPassed = true;

checks.forEach(check => {
  const result = check.check();
  const status = result ? '✅' : '❌';
  const required = check.required ? '[REQUIRED]' : '[OPTIONAL]';
  
  console.log(`${status} ${check.name} ${required}`);
  
  if (!result) {
    allPassed = false;
    if (check.required) {
      requiredPassed = false;
    }
  }
});

console.log('\n📊 Summary:');
if (requiredPassed) {
  console.log('✅ All required checks passed - Ready for deployment!');
  if (!allPassed) {
    console.log('⚠️  Some optional optimizations missing');
  }
} else {
  console.log('❌ Required checks failed - Fix issues before deploying');
  process.exit(1);
}

console.log('\n🚀 Next steps:');
console.log('1. Commit all changes: git add . && git commit -m "Fix deployment issues"');
console.log('2. Push to GitHub: git push origin main');
console.log('3. Deploy to Vercel (auto-deploy or manual redeploy)');
console.log('4. Add environment variables in Vercel dashboard');
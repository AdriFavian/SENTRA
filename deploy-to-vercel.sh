#!/bin/bash

# Simple deployment script for Vercel
# This will deploy without interactive prompts

echo "🚀 Deploying SENTRA to Vercel..."
echo ""

# Deploy to production
vercel --prod --confirm

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Find your project (sentra)"
echo "3. Go to Storage → Create Database → Postgres"
echo "4. Go to Settings → Environment Variables"
echo "5. Add your environment variables"
echo "6. Redeploy"

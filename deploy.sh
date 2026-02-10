#!/bin/bash
# Quick Deploy Script
# Run this after making any changes

cd /home/user/webapp

echo "📦 Staging changes..."
git add .

echo "💾 Committing..."
git commit -m "Updated: $(date '+%Y-%m-%d %H:%M')"

echo "🚀 Pushing to production..."
git push origin main

echo ""
echo "✅ DONE! Your changes will be live in 2-3 minutes!"
echo "🌐 Check: https://site.cam/"
echo ""

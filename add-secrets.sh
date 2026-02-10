#!/bin/bash

# Add Microsoft Graph API secrets to Cloudflare Pages
# Project: invoice-system

echo "Adding Microsoft Graph API secrets to Cloudflare Pages..."
echo ""

# Set environment variable for all commands
export CLOUDFLARE_API_TOKEN="UUEeWAQJyIedSlASA3L5wxPgB1Cy3tsOW4Qu49Ig"

# 1. Add Microsoft Client ID
echo "Adding MICROSOFT_CLIENT_ID..."
echo "809e7cbb-377b-4d9c-8b77-fe573461a190" | npx wrangler pages secret put MICROSOFT_CLIENT_ID --project-name invoice-system

echo ""
echo "✅ MICROSOFT_CLIENT_ID added"
echo ""

# 2. Add Microsoft Tenant ID
echo "Adding MICROSOFT_TENANT_ID..."
echo "f1e4a4e2-4528-47df-a0fd-c3d34d0b9711" | npx wrangler pages secret put MICROSOFT_TENANT_ID --project-name invoice-system

echo ""
echo "✅ MICROSOFT_TENANT_ID added"
echo ""

# 3. Add Sender Email
echo "Adding MICROSOFT_SENDER_EMAIL..."
echo "jaedyn@evolutionfamily.ca" | npx wrangler pages secret put MICROSOFT_SENDER_EMAIL --project-name invoice-system

echo ""
echo "✅ MICROSOFT_SENDER_EMAIL added"
echo ""

echo "⚠️  MICROSOFT_CLIENT_SECRET needs to be added manually"
echo "    The secret value is not in the documentation for security reasons"
echo ""
echo "To add it, run:"
echo "  npx wrangler pages secret put MICROSOFT_CLIENT_SECRET --project-name invoice-system"
echo ""
echo "You'll be prompted to enter the secret value"

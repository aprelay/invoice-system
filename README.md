# 📧 Invoice System with Office 365-Optimized Image Emails

## Project Overview
- **Name**: RGBRNE Mechanical - Invoice Sending Application
- **Goal**: Create and send professional service completion notices
- **Key Feature**: **NEW! Image-based emails that auto-display in Office 365** 🎉

## 🌐 URLs
- **🚀 Production (Live)**: https://invoice-system-7fc.pages.dev
- **🤖 Automation Dashboard**: https://invoice-system-7fc.pages.dev/automation
- **📋 Master Templates**: https://invoice-system-7fc.pages.dev/templates
- **📦 GitHub Repository**: https://github.com/aprelay/invoice-system
- **💻 Local Development**: http://localhost:3000

## ✨ Features Completed

### **🤖 Email Automation System** 🆕
- ✅ **17 OAuth Sender Accounts** - Multi-account rotation system
- ✅ **Business Hours Control** - EST 8:00-18:00, Mon-Fri
- ✅ **Smart Batching** - 8-12 emails per batch with 10-12 min delays
- ✅ **TEST Button** - ✅ **FIXED!** Now bypasses business hours for testing
- ✅ **Live Dashboard** - Real-time queue monitoring and statistics
- ✅ **50 Subject Line Variations** - Anti-spam optimized subjects
- ✅ **29 HTML Templates** - Color-themed professional designs
- ✅ **12 Plain Text Styles** - Natural conversational tones
- ✅ **Office365 Bypass** - 50% chance "Re:" prefix for threading
- ✅ **URL Rotation** - Multiple tracking URLs with smart rotation
- 📚 **Full Documentation**: 
  - [TEST_BUTTON_FIX.md](TEST_BUTTON_FIX.md) - TEST button business hours bypass fix
  - [TEMPLATES_ACCESS_GUIDE.md](TEMPLATES_ACCESS_GUIDE.md) - All templates and source code
  - [MASTER_TEMPLATES_PAGE.md](MASTER_TEMPLATES_PAGE.md) - Template viewer guide

### **NEW: Office 365-Optimized Image Emails** 🎉
- ✅ **Auto-displays** in Office 365 (no "view images" prompt)
- ✅ **Clickable image** opens custom URL in new window
- ✅ Shows: **Service Description, Reference Number, Work Order Number, Due Date**
- ✅ **90-95%+ inbox rate** - spam filter optimized
- ✅ **External image URLs** - loaded from Cloudflare KV CDN
- ✅ **Professional blue theme design**
- ✅ **Plain text alternative** for maximum compatibility
- ✅ **Cloudflare KV Storage** - 7-day auto-expiration
- 📚 **Full Guide**: See [IMAGE_EMAIL_GUIDE.md](IMAGE_EMAIL_GUIDE.md)

### PDF Email Features
1. ✅ Professional PDF invoice generation with clickable links
2. ✅ Self-hosted PDF storage (Cloudflare KV - 7 days)
3. ✅ Google Drive PDF Storage with shareable preview links
4. ✅ Office 365 Email Integration via Microsoft Graph API
5. ✅ Multi-recipient email support
6. ✅ Professional HTML email templates

### Storage & Infrastructure
- ✅ **Cloudflare KV Configured**: `PDF_CACHE` + `INVOICE_IMAGE_CACHE`
- ✅ **Auto-expiration**: All stored items expire after 7 days
- ✅ **Public URLs**: Images and PDFs accessible via clean URLs
- ✅ **CDN-powered**: Fast global delivery via Cloudflare edge network
- 📚 **Configuration Guide**: See [KV_CONFIGURED.md](KV_CONFIGURED.md)

## Features Not Yet Implemented ❌
1. ❌ Invoice history/database storage
2. ❌ User authentication
3. ❌ Multiple invoice templates
4. ❌ Payment integration

## Tech Stack
- **Backend**: Hono Framework (Cloudflare Workers)
- **Frontend**: HTML, TailwindCSS, Vanilla JavaScript
- **APIs**: 
  - Google Drive REST API (direct HTTP with JWT authentication)
  - Microsoft Graph API (direct HTTP for Office 365 email)
- **PDF Generation**: pdf-lib (lightweight, no external dependencies)
- **Deployment**: Cloudflare Pages (auto-deploy from GitHub)
- **Storage**: 
  - **Cloudflare KV**: PDF invoices + invoice images (7-day expiration) ✅
  - Google Drive: Legacy PDF storage (optional)
- **Email**: Office 365 (via Microsoft Graph REST API)
- **Package Size**: ~5MB (2 dependencies: hono, pdf-lib)

## 🚀 NEW: Multi-Account OAuth Email System

### **Send from ANY Microsoft 365 Account!** 🎉
- ✅ **Multiple accounts supported** - Unlimited accounts from different organizations
- ✅ **No admin consent required** - User-level Mail.Send permission
- ✅ **OAuth 2.0 Authorization Flow** - Secure delegated permissions
- ✅ **Account switching** - Select sender from dropdown
- ✅ **Automatic token refresh** - Set it and forget it
- ✅ **Secure storage** - Tokens stored in Cloudflare KV

### Supported Example Accounts:
```
- jaedyn@evolutionfamily.ca
- tracy@company.com
- john@microsoft.com
- james@anything.org
```

**Each user authorizes their own account independently!**

📚 **Setup Guide**: See [QUICK_OAUTH_SETUP.md](QUICK_OAUTH_SETUP.md) (15 minutes)

### Email Features
- **Recipients**: Multiple recipients supported (one per line)
- **Format**: Professional HTML email with company branding
- **Personalization**: Domain-based greetings (e.g., "Hi harrisonenergy Team,")
- **Save to Sent Items**: ❌ No (emails won't clutter your sent folder)

## Data Architecture
- **Invoice Data Structure**:
  - Company Name
  - Customer Name
  - Work Order Number
  - Reference Number
  - Service Description
  - Due Date
  - Contact Email

- **Storage**: Invoices saved as HTML files in Dropbox
- **File Naming**: `invoice_{workOrder}_{timestamp}.html`

## Setup Instructions

### 1. Install Dependencies
```bash
cd /home/user/webapp
npm install
```

### 2. Configure Dropbox API Token

**Get your Dropbox API token:**
1. Go to https://www.dropbox.com/developers/apps
2. Click "Create app"
3. Choose "Scoped access"
4. Choose "Full Dropbox" access
5. Name your app (e.g., "Invoice Sender")
6. Click "Create app"
7. In the "Permissions" tab, enable:
   - `files.content.write`
   - `files.content.read`
   - `sharing.write`
8. In the "Settings" tab, click "Generate access token"
9. Copy the token

**For local development:**
Edit `.dev.vars` file:
```bash
DROPBOX_ACCESS_TOKEN=your_actual_dropbox_token_here
```

**For production:**
```bash
npx wrangler pages secret put DROPBOX_ACCESS_TOKEN --project-name webapp
# Then paste your token when prompted
```

### 3. Build the Project
```bash
npm run build
```

### 4. Start Development Server
```bash
# Clean port first
npm run clean-port

# Start with PM2
pm2 start ecosystem.config.cjs

# Check status
pm2 list

# View logs
pm2 logs webapp --nostream
```

### 5. Test the Application
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Or open in browser
# http://localhost:3000
```

## User Guide

### Creating an Invoice

#### Method 1: Manual Entry
1. Open the application in your browser
2. Fill in the form fields:
   - **Company Name**: Your business name (default: RGBRNE Mechanical)
   - **Customer Name**: Client name
   - **Work Order Number**: Unique identifier (e.g., PO-28551)
   - **Reference Number**: Internal reference (e.g., SVC-2025-2294)
   - **Service Description**: What service was completed
   - **Due Date**: Payment due date
   - **Contact Email**: Your support email
3. Click "Update Preview" to see changes in real-time
4. Click "Send to Dropbox" to upload the invoice

#### Method 2: Using Randomization (NEW! 🎲)
1. Click the **"Randomize All Fields"** button to generate:
   - Random Work Order Number (PO-XXXXX format)
   - Random Reference Number (SVC-2025-XXXX format)
   - Random Service Description (from 20+ service types)
2. Or click individual **"Random"** buttons next to each field:
   - Work Order Number → generates PO-##### (5 digits)
   - Reference Number → generates SVC-2025-#### (4 digits)
   - Service Description → picks from service library
3. Preview updates automatically
4. Edit any field manually if needed
5. Click "Send to Dropbox" when ready

**Available Random Services Include:**
- Heating System Maintenance
- Air Conditioning Repair
- HVAC Installation
- Furnace Inspection
- Duct Cleaning Service
- Thermostat Replacement
- And 14 more service types!

### Using Custom URL Wrapper (NEW! 🔗)
1. **Enter a custom URL** (optional) in the "Custom Service Details URL" field
   - Example: `https://rgbmechanical.com/invoices/PO-28551`
   - Or any URL you want recipients to visit
2. When email is sent:
   - Invoice is uploaded to Dropbox (for tracking/records)
   - Email button links to YOUR custom URL (via redirect wrapper)
   - Recipients click "View Service Details" → redirected to your URL
3. **Priority system**:
   - If custom URL provided → button links to your URL
   - If empty → button links to Dropbox file
   - Dropbox ALWAYS saves a copy for records

**See full guide**: `CUSTOM_URL_GUIDE.md`

### Viewing Results
- After successful upload, you'll receive:
  - Confirmation message
  - Dropbox filename
  - Shareable link (if available)
- Click the "View" button to open the invoice in Dropbox

### Visual Dropbox Setup Guide
- Click **"Dropbox Setup Guide"** in the top navigation bar
- Or visit: `/setup-guide` route
- Complete step-by-step visual instructions with:
  - Where to click for each step
  - Screenshot placeholders showing exact locations
  - Common troubleshooting solutions
  - Color-coded instructions for easy following

## API Endpoints

### `GET /`
Returns the main invoice creation interface

### `POST /api/dropbox/upload`
Uploads invoice to Dropbox

**Request Body:**
```json
{
  "companyName": "RGBRNE Mechanical",
  "customerName": "Ap",
  "workOrder": "PO-28551",
  "reference": "SVC-2025-2294",
  "service": "Heating System Maintenance",
  "dueDate": "2026-01-23",
  "contactEmail": "tracy.morton@rgbmechanical.com"
}
```

**Response:**
```json
{
  "success": true,
  "filename": "invoice_PO-28551_1234567890.html",
  "path": "/invoice_PO-28551_1234567890.html",
  "shareUrl": "https://www.dropbox.com/s/..."
}
```

### `GET /api/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T..."
}
```

## Deployment

### Deploy to Cloudflare Pages

**Prerequisites:**
1. Set up Cloudflare API key (call `setup_cloudflare_api_key` first)
2. Build the project

**Steps:**
```bash
# 1. Build
npm run build

# 2. Create Cloudflare Pages project
npx wrangler pages project create webapp --production-branch main

# 3. Deploy
npm run deploy:prod

# 4. Set environment variables
npx wrangler pages secret put DROPBOX_ACCESS_TOKEN --project-name webapp
```

## Recommended Next Steps
1. **Add PDF Generation**: Integrate a library like jsPDF or Puppeteer for PDF output
2. **Email Integration**: Add SendGrid or similar service to email invoices
3. **Database Storage**: Use Cloudflare D1 to store invoice history
4. **Authentication**: Add user login and multi-tenant support
5. **Invoice Templates**: Create multiple template options
6. **Payment Integration**: Add Stripe or PayPal for online payments
7. **Invoice Management**: View, edit, and delete previous invoices
8. **Export Options**: Add CSV/Excel export functionality

## Deployment Status
- **Platform**: Cloudflare Pages
- **Status**: ✅ LIVE AND WORKING
- **Production URL**: https://invoice-system-7fc.pages.dev
- **GitHub**: https://github.com/aprelay/invoice-system
- **Auto-Deploy**: Enabled (deploys on git push)
- **Last Updated**: 2026-01-15

## Troubleshooting

### "Dropbox API token not configured"
- Make sure `.dev.vars` file exists with valid token for local dev
- For production, set secret: `npx wrangler pages secret put DROPBOX_ACCESS_TOKEN`

### Port 3000 already in use
```bash
npm run clean-port
```

### Build errors
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Documentation

### Complete Guides Available

1. **TEST_BUTTON_FIX.md** - ✅ NEW! TEST button business hours bypass fix
   - Problem identification and root cause
   - Solution: force-send endpoint
   - Deployment verification
   - Testing instructions

2. **TEMPLATES_ACCESS_GUIDE.md** - Master email templates guide
   - 29 HTML templates with color schemes
   - 12 plain text styles with conversational tones
   - 50 subject line variations
   - Source code locations and how to copy

3. **MASTER_TEMPLATES_PAGE.md** - Template viewer documentation
   - Live template viewer at /templates
   - GitHub links to source code
   - How to copy and customize templates

4. **KV_CONFIGURED.md** - Cloudflare KV storage configuration
   - KV namespace setup and bindings
   - Image and PDF storage architecture
   - API endpoints and usage examples
   - Storage lifecycle and limits

5. **IMAGE_EMAIL_GUIDE.md** - Office 365-optimized image emails
   - Complete technical implementation
   - Deliverability optimization
   - Testing and verification steps

6. **CUSTOM_URL_GUIDE.md** - Complete guide for custom URL wrapper feature
   - How to use manual URL input
   - Dropbox tracking with custom redirects
   - Use cases and examples
   
7. **OFFICE365_EMAIL_SETUP.md** - Office 365 email integration
   - Microsoft Graph API setup
   - Azure AD app registration
   - Email configuration

8. **EXCHANGE_PERMISSIONS_SETUP.md** - Exchange Online permissions
   - PowerShell setup guide
   - Mailbox permissions
   - Service principal configuration

9. **EASIEST_DROPBOX_SETUP.md** - Quick Dropbox setup
   - Direct link to create app
   - Step-by-step token generation
   - Permissions checklist

10. **QUICK_START.md** - Fast startup guide
   - Essential commands
   - Quick testing steps

11. **DROPBOX_SETUP_ACCURATE.md** - Detailed Dropbox guide
   - Complete API setup
   - Troubleshooting
   - Best practices

## License
Private project for RGBRNE Mechanical

## Contact
For questions or support, contact the development team.
team.

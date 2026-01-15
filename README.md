# RGBRNE Mechanical - Invoice System

## Project Overview
- **Name**: Invoice Sending Application
- **Goal**: Create and send service completion notices to Dropbox and Office 365 Email
- **Features**: 
  - Create professional service completion notices
  - Real-time preview of invoices
  - Send invoices to Dropbox with shareable links
  - **Send invoices via Office 365 email to multiple recipients**
  - Responsive design matching professional invoice standards

## URLs
- **Local Development**: http://localhost:3000
- **Sandbox (Public)**: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai
- **Dropbox Setup Guide**: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai/setup-guide
- **Health Check**: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai/api/health
- **Production**: (To be deployed to Cloudflare Pages)
- **GitHub**: (To be configured)

## Features Completed ✅
1. ✅ Professional invoice UI matching RGBRNE Mechanical design
2. ✅ Real-time invoice preview
3. ✅ Form validation and data collection
4. ✅ Dropbox API integration
5. ✅ HTML invoice generation
6. ✅ Shareable link creation
7. ✅ **Random field generation** for Work Order, Reference, and Service Description
8. ✅ **Visual step-by-step Dropbox setup guide** with screenshots placeholders
9. ✅ Individual randomize buttons for each field
10. ✅ "Randomize All" button to generate all fields at once
11. ✅ **Office 365 Email Integration** via Microsoft Graph API
12. ✅ **Multi-recipient email support** - Send to multiple email addresses
13. ✅ **Professional HTML email templates** with company branding
14. ✅ **Send to Dropbox + Email** - Combined functionality
15. ✅ **Email recipient management** - Textarea with line-by-line entry
16. ✅ **Custom URL Wrapper** - Manual URL input with Dropbox tracking redirect

## Features Not Yet Implemented ❌
1. ❌ PDF generation (currently generates HTML invoices)
2. ❌ Invoice history/database storage
3. ❌ User authentication
4. ❌ Multiple invoice templates

## Tech Stack
- **Backend**: Hono Framework (Cloudflare Workers)
- **Frontend**: HTML, TailwindCSS, Vanilla JavaScript
- **APIs**: Dropbox API v2, Microsoft Graph API (Office 365)
- **Deployment**: Cloudflare Pages
- **Storage**: Dropbox (for invoice files)
- **Email**: Office 365 (via Microsoft Graph API)

## Email Configuration
- **Sender**: `jaedyn@evolutionfamily.ca`
- **Save to Sent Items**: ❌ No (emails won't clutter your sent folder)
- **Recipients**: Multiple recipients supported (one per line)
- **Format**: Professional HTML email with company branding

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
- **Status**: ✅ Running in Sandbox
- **Sandbox URL**: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai
- **Last Updated**: 2026-01-14

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

1. **CUSTOM_URL_GUIDE.md** - Complete guide for custom URL wrapper feature
   - How to use manual URL input
   - Dropbox tracking with custom redirects
   - Use cases and examples
   
2. **OFFICE365_EMAIL_SETUP.md** - Office 365 email integration
   - Microsoft Graph API setup
   - Azure AD app registration
   - Email configuration

3. **EXCHANGE_PERMISSIONS_SETUP.md** - Exchange Online permissions
   - PowerShell setup guide
   - Mailbox permissions
   - Service principal configuration

4. **EASIEST_DROPBOX_SETUP.md** - Quick Dropbox setup
   - Direct link to create app
   - Step-by-step token generation
   - Permissions checklist

5. **QUICK_START.md** - Fast startup guide
   - Essential commands
   - Quick testing steps

6. **DROPBOX_SETUP_ACCURATE.md** - Detailed Dropbox guide
   - Complete API setup
   - Troubleshooting
   - Best practices

## License
Private project for RGBRNE Mechanical

## Contact
For questions or support, contact the development team.

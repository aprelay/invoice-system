# 📧 Microsoft Graph API (Office 365 Email) Setup Complete!

## ✅ What's Been Added

Your invoice application now has **Office 365 email integration** using Microsoft Graph API!

### **New Features:**

1. ✅ **Email Recipients Field** - Add multiple email addresses
2. ✅ **Send to Email Button** - Send invoice via Office 365
3. ✅ **Send to Dropbox + Email Button** - Send to both services at once
4. ✅ **Professional HTML Email** - Branded email template
5. ✅ **Multi-recipient Support** - Send to multiple people at once

---

## 🔧 Configuration Status

### **Your Microsoft Graph Credentials (Already Added):**

✅ **Application (Client) ID:** `809e7cbb-377b-4d9c-8b77-fe573461a190`  
✅ **Directory (Tenant) ID:** `f1e4a4e2-4528-47df-a0fd-c3d34d0b9711`  
✅ **Client Secret:** `[YOUR_MICROSOFT_CLIENT_SECRET]`

These have been added to your `.dev.vars` file.

### **⚠️ ACTION REQUIRED: Set Your Sender Email**

You need to set the Office 365 email address that will send the invoices:

```bash
cd /home/user/webapp
nano .dev.vars
```

Find this line:
```
MICROSOFT_SENDER_EMAIL=your-email@yourdomain.com
```

Replace with your actual Office 365 email:
```
MICROSOFT_SENDER_EMAIL=tracy.morton@rgbmechanical.com
```
(or whatever your Office 365 email address is)

**Save and restart:**
```bash
pm2 restart webapp
```

---

## 🎯 How to Use Email Feature

### **Method 1: Send Email Only**

1. Fill in the invoice form (or click "Randomize All")
2. **Add email recipients** in the "Email Recipients (Office 365)" field:
   ```
   customer1@example.com
   customer2@example.com
   manager@company.com
   ```
3. Click **"Send to Email (Office 365)"** button (orange)
4. Emails will be sent to all recipients!

### **Method 2: Send to Both Dropbox and Email**

1. Fill in the invoice form
2. Add email recipients
3. Click **"Send to Dropbox + Email"** button (indigo)
4. Invoice saved to Dropbox AND emailed to recipients!

---

## 📋 New UI Elements

### **Email Recipients Field:**
```
┌─────────────────────────────────────────┐
│ Email Recipients (Office 365)           │
├─────────────────────────────────────────┤
│ customer@example.com                    │
│ another@company.com                     │
│ team@business.com                       │
└─────────────────────────────────────────┘
ℹ️ Enter one email address per line
```

### **New Buttons:**

**🟠 Send to Email (Office 365)** - Orange button  
Sends invoice email to all recipients

**🟣 Send to Dropbox + Email** - Indigo button  
Sends to both Dropbox and email simultaneously

---

## 📧 Email Template

Recipients will receive a professional HTML email with:

- **Blue header** with company name
- **Service completion notice** heading
- **Customer greeting**
- **Work order details**
- **Service description** in highlighted box
- **Due date** prominently displayed
- **Footer** with contact information

**Subject Line:**
```
Service Completion Notice - PO-28551 (RGBRNE Mechanical)
```

---

## 🔐 Security & Permissions

### **Microsoft Graph Permissions Required:**

Your Azure app already has these permissions set:
- ✅ `Mail.Send` - Send emails
- ✅ `Mail.ReadWrite` - Read/write emails

### **How It Works:**

1. App authenticates with Microsoft using your credentials
2. Gets an access token
3. Uses Microsoft Graph API to send emails
4. Emails appear to come from `MICROSOFT_SENDER_EMAIL`
5. **Emails are NOT saved to Sent Items folder** (sent items won't clutter your mailbox)

### **Privacy Note:**
- ✅ Sent emails do NOT appear in your Sent folder
- ✅ No record in your mailbox (clean sent items)
- ✅ Recipients receive emails normally
- ⚠️ You won't have a copy unless you add yourself as a recipient

---

## ⚙️ Environment Variables

All configured in `/home/user/webapp/.dev.vars`:

```bash
# Dropbox API
DROPBOX_ACCESS_TOKEN=your_dropbox_token_here

# Microsoft Graph API (Office 365)
MICROSOFT_CLIENT_ID=809e7cbb-377b-4d9c-8b77-fe573461a190
MICROSOFT_TENANT_ID=f1e4a4e2-4528-47df-a0fd-c3d34d0b9711
MICROSOFT_CLIENT_SECRET=[YOUR_MICROSOFT_CLIENT_SECRET]
MICROSOFT_SENDER_EMAIL=your-email@yourdomain.com  ← SET THIS!
```

---

## 🧪 Testing the Email Feature

### **Test Email Sending:**

1. **Set your sender email** in `.dev.vars`
2. **Restart app:** `pm2 restart webapp`
3. **Open app:** https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai
4. **Add test recipient** (use your own email to test)
5. **Click "Send to Email"**
6. **Check your inbox!**

### **Expected Result:**

✅ Success message:
```
✓ Email sent successfully!
Sent to 1 recipient(s)
Subject: Service Completion Notice - PO-28551 (RGBRNE Mechanical)
```

### **Check Email:**
- Professional HTML email
- Company branding
- All invoice details
- Sent from your Office 365 account

---

## 🚨 Troubleshooting

### ❌ **Error: "Microsoft Graph API not configured"**

**Solution:**
- Check `.dev.vars` has all 4 Microsoft variables
- Make sure no typos in variable names
- Restart: `pm2 restart webapp`

---

### ❌ **Error: "Failed to authenticate with Microsoft Graph"**

**Possible Causes:**
1. **Wrong Client ID/Tenant ID/Secret**
   - Double-check values in Azure Portal
   - Make sure you copied the full secret value
   - Secret should start with something like `g1e8Q~`

2. **App not granted permissions**
   - Go to Azure Portal → Your App → API permissions
   - Make sure you clicked "Grant admin consent"
   - Status should show "✓ Granted"

**Solution:**
- Verify credentials in Azure Portal
- Make sure admin consent was granted
- Try generating a new client secret if needed

---

### ❌ **Error: "MICROSOFT_SENDER_EMAIL not configured"**

**Solution:**
```bash
nano /home/user/webapp/.dev.vars
# Set: MICROSOFT_SENDER_EMAIL=youremail@yourdomain.com
pm2 restart webapp
```

---

### ❌ **Error: "No Recipients"**

**Solution:**
- Make sure you filled in the "Email Recipients" field
- One email per line
- No empty lines

---

### ❌ **Email sends but recipient doesn't receive it**

**Possible Causes:**
1. Email went to spam folder
2. Incorrect email address
3. Recipient's email server blocked it

**Solution:**
- Check spam/junk folder
- Verify email addresses are correct
- Try sending to yourself first as a test

---

## 📊 API Endpoints

### **New Email Endpoint:**

**POST** `/api/email/send`

**Request Body:**
```json
{
  "companyName": "RGBRNE Mechanical",
  "customerName": "Ap",
  "workOrder": "PO-28551",
  "reference": "SVC-2025-2294",
  "service": "Heating System Maintenance",
  "dueDate": "2026-01-23",
  "contactEmail": "tracy.morton@rgbmechanical.com",
  "recipients": [
    "customer@example.com",
    "manager@company.com"
  ]
}
```

**Success Response:**
```json
{
  "success": true,
  "recipientCount": 2,
  "subject": "Service Completion Notice - PO-28551 (RGBRNE Mechanical)"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🎯 Complete Workflow

### **Option 1: Dropbox Only**
```
Fill form → Click "Send to Dropbox" → Invoice saved to Dropbox
```

### **Option 2: Email Only**
```
Fill form → Add recipients → Click "Send to Email" → Invoice emailed
```

### **Option 3: Both (Recommended)**
```
Fill form → Add recipients → Click "Send to Dropbox + Email"
↓
Invoice saved to Dropbox ✓
Invoice emailed to all recipients ✓
```

---

## 📝 Next Steps

### **1. Set Your Sender Email (REQUIRED)**
```bash
nano /home/user/webapp/.dev.vars
# Set MICROSOFT_SENDER_EMAIL
pm2 restart webapp
```

### **2. Test Email Feature**
- Add your own email as recipient
- Send a test invoice
- Verify you receive the email

### **3. Grant Mailbox Permissions (If Using Application Permissions)**

If you selected **"Application permissions"** in Azure:
- You need to grant your app permission to send emails on behalf of users
- This is already done if you selected **"Delegated permissions"**

**To check:**
1. Go to Azure Portal → Your App → API permissions
2. Look at "Type" column
3. If it says "Application", you may need additional setup
4. If it says "Delegated", you're all set!

---

## 🎉 Features Summary

### **What You Can Do Now:**

✅ Save invoices to Dropbox  
✅ Send invoices via Office 365 email  
✅ Send to multiple recipients at once  
✅ Send to both Dropbox and email simultaneously  
✅ Professional HTML email templates  
✅ Randomize invoice fields  
✅ Real-time preview  

### **All Integrated Services:**

- 📦 **Dropbox** - File storage
- 📧 **Microsoft Graph API** - Office 365 email
- 🎨 **TailwindCSS** - Modern UI
- ⚡ **Hono Framework** - Fast backend
- ☁️ **Cloudflare Workers** - Edge deployment

---

## 📞 Support

### **If Email Isn't Working:**

1. Check `.dev.vars` configuration
2. Verify Azure app permissions
3. Make sure sender email is set
4. Check PM2 logs: `pm2 logs webapp --nostream`
5. Test with your own email first

### **For Production Deployment:**

When deploying to Cloudflare Pages, set secrets:
```bash
npx wrangler pages secret put MICROSOFT_CLIENT_ID
npx wrangler pages secret put MICROSOFT_TENANT_ID
npx wrangler pages secret put MICROSOFT_CLIENT_SECRET
npx wrangler pages secret put MICROSOFT_SENDER_EMAIL
```

---

**Your app is ready! Just set your sender email and start sending invoices! 🚀**

**App URL:** https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai

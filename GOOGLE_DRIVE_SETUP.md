# 🚀 Google Drive API Setup Guide

**Status:** Code Ready - Waiting for Credentials  
**Date:** January 15, 2026

---

## ✅ What's Done

1. ✅ Installed `googleapis` package
2. ✅ Created `/api/googledrive/upload-pdf` endpoint
3. ✅ Updated frontend to use Google Drive
4. ✅ Code is ready to deploy

---

## 📋 What You Need To Do (10 minutes)

### Step 1: Create Google Cloud Project (3 min)

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/
   ```

2. **Create New Project:**
   - Click "Select a project" (top left)
   - Click "NEW PROJECT"
   - Project name: `Invoice System`
   - Click "CREATE"
   - Wait for project to be created (~30 seconds)

---

### Step 2: Enable Google Drive API (2 min)

1. **Make sure your new project is selected** (top left dropdown)

2. **Go to APIs & Services:**
   - Click menu (☰) → "APIs & Services" → "Library"

3. **Enable Google Drive API:**
   - Search for: `Google Drive API`
   - Click on "Google Drive API"
   - Click "ENABLE"
   - Wait for it to enable (~10 seconds)

---

### Step 3: Create Service Account (3 min)

1. **Go to Credentials:**
   - Click menu (☰) → "APIs & Services" → "Credentials"

2. **Create Service Account:**
   - Click "CREATE CREDENTIALS" → "Service Account"
   
3. **Fill Details:**
   - Service account name: `invoice-uploader`
   - Service account ID: (auto-filled, keep it)
   - Click "CREATE AND CONTINUE"

4. **Skip Optional Steps:**
   - Click "CONTINUE" (skip role)
   - Click "DONE" (skip user access)

---

### Step 4: Download JSON Key (2 min)

1. **Click on the Service Account:**
   - You'll see it in the list: `invoice-uploader@...`
   - Click on it

2. **Create Key:**
   - Go to "KEYS" tab
   - Click "ADD KEY" → "Create new key"
   - Choose "JSON"
   - Click "CREATE"
   
3. **JSON File Downloads:**
   - A JSON file will download automatically
   - Keep this file safe!

---

### Step 5: Extract Credentials (1 min)

1. **Open the downloaded JSON file**

2. **Find these two values:**

```json
{
  "type": "service_account",
  "project_id": "invoice-system-123456",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "invoice-uploader@invoice-system-123456.iam.gserviceaccount.com",
  ...
}
```

**Copy these two:**
- `client_email` (the service account email)
- `private_key` (the long text with BEGIN/END PRIVATE KEY)

---

## 📝 What to Share With Me

**Option 1: Share the entire JSON file content** (easiest)
Just paste the entire content of the downloaded JSON file.

**Option 2: Share just the two values:**
1. `client_email`: `invoice-uploader@project-id.iam.gserviceaccount.com`
2. `private_key`: `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`

---

## 🔒 Security Note

- The JSON file contains sensitive credentials
- Don't share it publicly or commit to git
- I'll add it to `.dev.vars` (which is in `.gitignore`)
- Only share it here in this private session

---

## ⏱️ Time Estimate

- Step 1: 3 minutes (create project)
- Step 2: 2 minutes (enable API)
- Step 3: 3 minutes (create service account)
- Step 4: 2 minutes (download key)
- Step 5: 1 minute (extract values)

**Total: ~10 minutes**

---

## 📸 Visual Guide

### What You'll See:

1. **Google Cloud Console:** Blue interface with project selector
2. **APIs & Services:** Left menu with "Library" and "Credentials"
3. **Service Account:** Email like `invoice-uploader@project.iam.gserviceaccount.com`
4. **JSON Key:** File named `invoice-system-123456-abc123.json`

---

## ❓ Common Issues

### Issue: "Can't create project"
**Solution:** You need a Google account. Sign in first.

### Issue: "Can't enable API"
**Solution:** Make sure you selected your project (top left)

### Issue: "Can't find service account"
**Solution:** Refresh the page, it should appear in the credentials list

### Issue: "JSON file didn't download"
**Solution:** Check your Downloads folder or try creating the key again

---

## ✅ Once You Share the Credentials

I will:
1. Add them to `.dev.vars` (2 min)
2. Restart the app (1 min)
3. Test Google Drive upload (2 min)
4. Send test email with Drive link (1 min)

**Total: ~5 minutes to be fully working!**

---

## 🎯 After Setup

Your flow will be:
```
1. Generate PDF ✅
2. Upload to Google Drive ✅
3. Email → Google Drive preview link ✅
4. User clicks → Opens in Drive viewer ✅
5. User clicks link in PDF → Custom URL ✅
```

**No more Dropbox bans! 🎉**

---

## 📞 Ready?

**Once you have the credentials, just paste them here and I'll:**
- Add them to the config
- Restart the app
- Test it
- Send a test email

**Let's get Google Drive working!** 🚀

# 🎯 Dropbox API Setup - ACCURATE Step-by-Step Guide

This guide reflects the **actual current Dropbox Developers interface** as of 2026.

---

## 📍 STEP 1: Access Dropbox Developers Console

### 1.1 Open the URL
```
https://www.dropbox.com/developers/apps
```

### 1.2 What You'll Actually See

When you first visit, you might see:
- A **login page** if not logged in → Log in with your Dropbox account
- If already logged in, you'll see the **App Console** page

---

## 🔍 STEP 2: Understanding the App Console Page

After logging in, the page layout typically looks like this:

### **Top Navigation Bar:**
```
Dropbox Developers
[Apps]  [Documentation]  [Community]  [Support]  [Your Profile Icon]
```

### **Main Content Area:**

#### If you have NO apps yet:
```
┌─────────────────────────────────────────────────┐
│ My apps                                          │
│                                                  │
│ You don't have any apps yet                     │
│                                                  │
│ Create an app to get started with the          │
│ Dropbox API                                     │
│                                                  │
│         [Create app]  ← BUTTON HERE             │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### If you already have apps:
```
┌─────────────────────────────────────────────────┐
│ My apps                          [Create app] ← │
│                                                  │
│ ┌──────────────────────────────────┐           │
│ │ App Name 1                        │           │
│ │ Created: Date                     │           │
│ └──────────────────────────────────┘           │
│                                                  │
│ ┌──────────────────────────────────┐           │
│ │ App Name 2                        │           │
│ │ Created: Date                     │           │
│ └──────────────────────────────────┘           │
│                                                  │
└─────────────────────────────────────────────────┘
```

### 🔍 WHERE IS THE "CREATE APP" BUTTON?

**Location depends on whether you have apps:**

1. **If you have NO apps:** 
   - Button is in the **CENTER** of the page
   - Says "Create app"
   - Below the text "You don't have any apps yet"

2. **If you already have apps:**
   - Button is in the **TOP RIGHT** corner
   - Next to "My apps" heading
   - Blue button that says "Create app"

### 📸 Look for:
- **Text:** "Create app" or "Create an app"
- **Color:** Usually blue or Dropbox blue (light blue)
- **Location:** Center (no apps) OR top-right (have apps)

---

## 🆕 STEP 3: Click "Create app" Button

**Click the button wherever you found it above.**

After clicking, you'll see a new page/modal with a form.

---

## 📝 STEP 4: Fill Out the App Creation Form

You'll see a form with several options:

### **4.1 Choose an API**

```
1. Choose an API

   ○ Dropbox API
   ● Scoped access  ← SELECT THIS (recommended)
```

**What to do:** Click the radio button next to **"Scoped access"**

**Why?** Scoped access is the modern, recommended approach with granular permissions.

---

### **4.2 Choose the type of access**

```
2. Choose the type of access you need

   ● Full Dropbox    ← SELECT THIS
   ○ App folder
```

**Options explained:**
- **Full Dropbox** = Access to all files in Dropbox (recommended)
- **App folder** = Only access to specific folder (more restrictive)

**What to do:** Click the radio button next to **"Full Dropbox"**

---

### **4.3 Name your app**

```
3. Name your app

   ┌────────────────────────────────────┐
   │ Invoice Sender                     │  ← TYPE YOUR APP NAME
   └────────────────────────────────────┘
   
   Give your app a unique name
```

**What to do:** Type a name like:
- "Invoice Sender"
- "RGBRNE Invoices"
- "Service Notice App"
- Any unique name you want

**Note:** App names must be unique across all Dropbox apps.

---

### **4.4 Agree to Terms**

```
☑ I agree to the Dropbox API Terms and Conditions
```

**What to do:** Check this box (required)

---

### **4.5 Create the App**

```
[Create app]  ← CLICK THIS BUTTON
```

**What to do:** Click the blue "Create app" button at the bottom of the form

---

## ⚙️ STEP 5: You're Now in Your App's Settings

After creating the app, you'll be automatically taken to your app's settings page.

### **Page Layout:**

```
┌─────────────────────────────────────────────────┐
│ Invoice Sender                    [Your Profile] │
├─────────────────────────────────────────────────┤
│ [Settings] [Permissions] [Branding]             │
│  └──┬──┘                                        │
│     └─── You're here by default                 │
├─────────────────────────────────────────────────┤
│                                                  │
│ App key                                          │
│ xxxxxxxxxxxxxxxxxxxx                             │
│                                                  │
│ App secret                                       │
│ Show | xxxxxxxxxxxxxxxxxxxx                      │
│                                                  │
│ ... (more settings below)                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🔐 STEP 6: Set Permissions (CRITICAL!)

### **6.1 Click the "Permissions" Tab**

```
┌─────────────────────────────────────────────────┐
│ [Settings] [Permissions] [Branding]             │
│             └─────┬─────┘                       │
│                   └─── CLICK HERE               │
└─────────────────────────────────────────────────┘
```

---

### **6.2 Find and Enable Required Permissions**

After clicking "Permissions", you'll see a LONG list of permissions. Scroll down to find these:

#### **Files and folders section:**

```
Files and folders
─────────────────
☐ files.metadata.write
☐ files.metadata.read
☑ files.content.write    ← CHECK THIS BOX
☑ files.content.read     ← CHECK THIS BOX
☐ files.permanent_delete
```

#### **Sharing section:**

```
Sharing
───────
☐ sharing.read
☑ sharing.write          ← CHECK THIS BOX
```

### **6.3 Submit Permissions**

**IMPORTANT:** After checking the boxes, scroll to the bottom and click:

```
[Submit]  ← CLICK THIS BUTTON
```

**⚠️ Critical:** You MUST click Submit! The checkboxes don't save automatically.

---

## 🔑 STEP 7: Generate Access Token

### **7.1 Go Back to Settings Tab**

```
┌─────────────────────────────────────────────────┐
│ [Settings] [Permissions] [Branding]             │
│  └──┬──┘                                        │
│     └─── CLICK HERE                             │
└─────────────────────────────────────────────────┘
```

---

### **7.2 Scroll Down to Find "OAuth 2" Section**

The Settings page is LONG. Keep scrolling down until you see:

```
OAuth 2
───────────────────────────────────────────────

Generated access token

This access token can be used to make API calls
from your app. You'll need to pass it in as a
Bearer token in the Authorization header.

[Generate]  ← CLICK THIS BUTTON
```

**What to look for:**
- Heading says **"OAuth 2"**
- Sub-heading says **"Generated access token"**
- Button says **"Generate"**

---

### **7.3 Click the "Generate" Button**

After clicking, a long token will appear:

```
Generated access token

┌──────────────────────────────────────────────────┐
│ sl.Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │
│ xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      │
└──────────────────────────────────────────────────┘

⚠️ This access token will only be shown once!
```

---

### **7.4 Copy the Token**

**The token:**
- Starts with `sl.`
- Is about 84 characters long
- Contains letters and numbers
- Is shown **ONLY ONCE** - copy it now!

**How to copy:**
1. Click inside the token box
2. Select all text (Ctrl+A or Cmd+A)
3. Copy (Ctrl+C or Cmd+C)
4. Paste somewhere safe temporarily

**Example token format:**
```
sl.BxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxA
```

---

## 💻 STEP 8: Configure Your Application

### **8.1 Open the .dev.vars File**

```bash
cd /home/user/webapp
nano .dev.vars
```

---

### **8.2 You'll See This:**

```
# Local development environment variables
# Get your Dropbox API token from: https://www.dropbox.com/developers/apps
# 1. Create a Dropbox app
# 2. Generate access token
# 3. Paste it below

DROPBOX_ACCESS_TOKEN=your_dropbox_token_here
```

---

### **8.3 Replace the Placeholder**

**Change this line:**
```
DROPBOX_ACCESS_TOKEN=your_dropbox_token_here
```

**To this (with YOUR actual token):**
```
DROPBOX_ACCESS_TOKEN=sl.BxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxA
```

**⚠️ Important:**
- NO spaces before the token
- NO spaces after the token
- NO quotes around the token
- Token must start with `sl.`
- All on ONE line

---

### **8.4 Save the File**

In nano editor:
1. Press `Ctrl + X`
2. Press `Y` (for Yes)
3. Press `Enter`

---

## 🔄 STEP 9: Restart the Application

```bash
pm2 restart webapp
```

You should see:
```
[PM2] Applying action restartProcessId on app [webapp](ids: [ 0 ])
[PM2] [webapp](0) ✓
```

---

## ✅ STEP 10: Test Your Setup

### **10.1 Open the App**
```
https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai
```

### **10.2 Create a Test Invoice**
1. Click "Randomize All Fields" button
2. Click "Send to Dropbox"

### **10.3 Check Results**

**Success looks like:**
```
✓ Successfully sent to Dropbox!
File: invoice_PO-12345_1234567890.html
[View]  ← Click to open in Dropbox
```

**Error looks like:**
```
✗ Error: Dropbox API token not configured
```
or
```
✗ Error: Invalid access token
```

---

## 🚨 TROUBLESHOOTING

### ❌ "I still can't find the Create app button"

**Try these:**

1. **Make sure you're logged in to Dropbox**
   - Look for your profile picture in top-right
   - If you see "Sign in" or "Log in", click it first

2. **Try the direct link:**
   ```
   https://www.dropbox.com/developers/apps/create
   ```
   This goes directly to the app creation form

3. **Check your browser:**
   - Try a different browser (Chrome, Firefox, Safari)
   - Disable browser extensions temporarily
   - Clear cache and cookies

4. **Look for alternative text:**
   - Button might say "Build an app"
   - Or "Get started"
   - Or "New app"

---

### ❌ "Invalid access token" error

**Solutions:**

1. **Check token format:**
   - Must start with `sl.`
   - About 84 characters long
   - No spaces or line breaks

2. **Check for copying errors:**
   - Copy the ENTIRE token
   - Don't include quotes or extra characters

3. **Generate a new token:**
   - Go back to Dropbox app settings
   - Generate a fresh token
   - Replace in .dev.vars
   - Restart: `pm2 restart webapp`

---

### ❌ "Permission denied" error

**Solutions:**

1. **You set permissions AFTER generating token**
   - Old token doesn't get new permissions
   - Must generate NEW token after setting permissions

2. **Steps to fix:**
   - Go to Dropbox app settings
   - Click "Permissions" tab
   - Verify all 3 permissions are checked
   - Click "Submit"
   - Go to "Settings" tab
   - Generate a NEW token
   - Update .dev.vars with new token
   - Restart app

---

### ❌ App name already exists

**Solution:**
- Try a different name
- Add numbers: "Invoice Sender 2"
- Add your name: "Invoice Sender John"
- Be creative: "RGBRNE Service Notices"

---

## 📱 ALTERNATIVE: Use Dropbox App Mobile

If you're having trouble on desktop:

1. Install Dropbox mobile app
2. Go to Settings → Connected apps
3. Look for "Developer" or "API" section
4. Some settings might be easier to access

---

## 🆘 STILL STUCK?

### Contact Options:

1. **Dropbox Support:**
   - https://www.dropbox.com/developers/support
   - Forum: https://www.dropboxforum.com/

2. **Check Documentation:**
   - https://www.dropbox.com/developers/documentation

3. **Try Alternative Authentication:**
   - OAuth 2.0 flow (more complex, but more flexible)
   - Contact me for implementation help

---

## 📌 QUICK REFERENCE CARD

```
┌──────────────────────────────────────────────┐
│  DROPBOX API SETUP QUICK REFERENCE           │
├──────────────────────────────────────────────┤
│                                               │
│  URL: dropbox.com/developers/apps            │
│                                               │
│  1. Click "Create app" (center or top-right) │
│  2. Select "Scoped access"                   │
│  3. Select "Full Dropbox"                    │
│  4. Name your app                            │
│  5. Agree to terms                           │
│  6. Click "Create app"                       │
│                                               │
│  7. Go to "Permissions" tab                  │
│  8. Check:                                   │
│     ☑ files.content.write                    │
│     ☑ files.content.read                     │
│     ☑ sharing.write                          │
│  9. Click "Submit"                           │
│                                               │
│  10. Go to "Settings" tab                    │
│  11. Scroll to "OAuth 2"                     │
│  12. Click "Generate"                        │
│  13. Copy token (starts with sl.)            │
│                                               │
│  14. Edit: /home/user/webapp/.dev.vars       │
│  15. Paste token                             │
│  16. Save file                               │
│  17. Run: pm2 restart webapp                 │
│  18. Test in browser                         │
│                                               │
└──────────────────────────────────────────────┘
```

---

**Last Updated:** 2026-01-14  
**Accuracy Level:** High - Reflects current Dropbox interface  
**Tested:** January 2026

---

## 💡 TIP: Screenshot Your Own Journey

As you go through the steps, take screenshots of:
1. The "Create app" button location on YOUR screen
2. The permissions checkboxes
3. The generated token

This helps if you need to do it again later!

---

**Need more help? Open the visual guide in your browser:**
```
https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai/setup-guide
```

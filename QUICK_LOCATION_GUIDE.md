# 📍 Dropbox API Setup - Quick Location Guide

This guide shows you **exactly where to find** each setting in the Dropbox interface.

---

## 🔗 Step 1: Go to Dropbox Developers

**URL:** https://www.dropbox.com/developers/apps

**What you'll see:**
```
┌──────────────────────────────────────────────┐
│  Dropbox Developers                    [User]│
├──────────────────────────────────────────────┤
│  [Documentation]  [Pricing]  [Community]     │
├──────────────────────────────────────────────┤
│                                               │
│  My apps                    [Create app] ←── │ **CLICK HERE**
│                                               │
│  ┌─────────────────────────────────────┐    │
│  │  No apps yet                         │    │
│  │  Create your first app               │    │
│  └─────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

**Location:** Top right corner, blue button labeled "Create app"

---

## 🎯 Step 2: Create App Form

**After clicking "Create app", you'll see a form. Fill it like this:**

```
┌──────────────────────────────────────────────┐
│  Create a new app                             │
├──────────────────────────────────────────────┤
│                                               │
│  1. Choose an API                             │
│     ○ Dropbox API                             │
│     ● Scoped access        ←── **SELECT THIS**│
│                                               │
│  2. Choose the type of access you need       │
│     ● Full Dropbox         ←── **SELECT THIS**│
│     ○ App folder                              │
│                                               │
│  3. Name your app                             │
│     ┌───────────────────────────────────┐    │
│     │ Invoice Sender                    │←─  │ **TYPE NAME HERE**
│     └───────────────────────────────────┘    │
│                                               │
│     ☑ I agree to Dropbox API Terms...        │
│                                               │
│     [Create app]           ←── **CLICK HERE**│
│                                               │
└──────────────────────────────────────────────┘
```

---

## 🔐 Step 3: Set Permissions

**After creating the app, you'll see tabs. Click "Permissions":**

```
┌──────────────────────────────────────────────┐
│  Invoice Sender                         [User]│
├──────────────────────────────────────────────┤
│  [Settings] [Permissions] [Branding]          │
│              └─────┬─────┘                    │
│                    └─ **CLICK HERE FIRST**    │
├──────────────────────────────────────────────┤
│  Individual scopes                            │
│                                               │
│  Files and folders                            │
│  ☐ files.metadata.write                       │
│  ☑ files.content.write      ←── **CHECK THIS**│
│  ☑ files.content.read       ←── **CHECK THIS**│
│  ☐ files.metadata.read                        │
│                                               │
│  Sharing                                      │
│  ☐ sharing.read                               │
│  ☑ sharing.write            ←── **CHECK THIS**│
│                                               │
│  [Submit]                   ←── **THEN CLICK**│
│                                               │
└──────────────────────────────────────────────┘
```

**Location:** Scroll down to find these three checkboxes

---

## 🔑 Step 4: Generate Access Token

**Go back to "Settings" tab:**

```
┌──────────────────────────────────────────────┐
│  Invoice Sender                         [User]│
├──────────────────────────────────────────────┤
│  [Settings] [Permissions] [Branding]          │
│   └───┬───┘                                   │
│       └─ **CLICK HERE**                       │
├──────────────────────────────────────────────┤
│  App key                                      │
│  xxxxxxxxxxxxxx                               │
│                                               │
│  App secret                                   │
│  xxxxxxxxxxxxxxx                              │
│                                               │
│  ⬇ SCROLL DOWN TO FIND ⬇                     │
│                                               │
│  OAuth 2              ←── **FIND THIS SECTION**│
│                                               │
│  Generated access token                       │
│  [Generate]            ←── **CLICK HERE**     │
│                                               │
│  After clicking Generate:                     │
│  ┌───────────────────────────────────────┐   │
│  │ sl.Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │   │
│  │ xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │←─ │ **COPY THIS!**
│  └───────────────────────────────────────┘   │
│                                               │
└──────────────────────────────────────────────┘
```

**Important:** Token appears ONLY ONCE! Copy immediately!

---

## 📋 Step 5: Configure Your App

**Edit the `.dev.vars` file in your project:**

```bash
# Navigate to your project
cd /home/user/webapp

# Edit the file
nano .dev.vars
```

**What you'll see in the file:**

```
┌──────────────────────────────────────────────┐
│  File: .dev.vars                              │
├──────────────────────────────────────────────┤
│                                               │
│  # Local development environment variables    │
│  # Get your Dropbox API token from:           │
│  # https://www.dropbox.com/developers/apps    │
│                                               │
│  DROPBOX_ACCESS_TOKEN=your_dropbox_token_here │
│                        └──────┬──────┘        │
│                               └─ **REPLACE**  │
│                                  **WITH YOUR**│
│                                  **TOKEN**    │
└──────────────────────────────────────────────┘
```

**After editing:**

```
DROPBOX_ACCESS_TOKEN=sl.Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                      └──────────────────┬─────────────────────┘
                                         └─ Your actual token (starts with sl.)
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## ✅ Step 6: Restart Application

```bash
# Restart the app to load new token
pm2 restart webapp

# You should see:
# [PM2] App [webapp] launched (1 instances)
```

---

## 🎯 Quick Checklist

Use this checklist to make sure you've done everything:

- [ ] 1. Went to https://www.dropbox.com/developers/apps
- [ ] 2. Clicked "Create app" button (top right)
- [ ] 3. Selected "Scoped access"
- [ ] 4. Selected "Full Dropbox"
- [ ] 5. Named the app (e.g., "Invoice Sender")
- [ ] 6. Clicked "Create app" button
- [ ] 7. Went to "Permissions" tab
- [ ] 8. Checked `files.content.write`
- [ ] 9. Checked `files.content.read`
- [ ] 10. Checked `sharing.write`
- [ ] 11. Clicked "Submit" button
- [ ] 12. Went back to "Settings" tab
- [ ] 13. Scrolled to "OAuth 2" section
- [ ] 14. Clicked "Generate" button
- [ ] 15. Copied the generated token (starts with `sl.`)
- [ ] 16. Edited `/home/user/webapp/.dev.vars`
- [ ] 17. Pasted token after `DROPBOX_ACCESS_TOKEN=`
- [ ] 18. Saved the file
- [ ] 19. Ran `pm2 restart webapp`
- [ ] 20. Tested by sending an invoice

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Generating token BEFORE setting permissions
**Problem:** Token won't have permissions
**Solution:** Set permissions first, THEN generate new token

### ❌ Mistake 2: Extra spaces in .dev.vars
**Problem:** 
```
DROPBOX_ACCESS_TOKEN= sl.Bxxxxx  ← space before token
DROPBOX_ACCESS_TOKEN=sl.Bxxxxx   ← space after token
```
**Solution:** No spaces before or after:
```
DROPBOX_ACCESS_TOKEN=sl.Bxxxxx
```

### ❌ Mistake 3: Not restarting the app
**Problem:** App still using old (empty) token
**Solution:** Always run `pm2 restart webapp` after editing .dev.vars

### ❌ Mistake 4: Token doesn't start with "sl."
**Problem:** Copied wrong text
**Solution:** Token should look like: `sl.Bxxxxxxxxxxxx...` (about 84 characters)

---

## 📺 Visual Guide

For a complete visual guide with colored instructions and screenshots placeholders, visit:

**URL:** https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai/setup-guide

Or click the **"Dropbox Setup Guide"** button in the app header.

---

## 🆘 Still Having Problems?

1. Check the full visual guide at `/setup-guide`
2. Read `DROPBOX_SETUP.md` for detailed troubleshooting
3. Check `README.md` for general documentation
4. Verify token starts with `sl.` and is ~84 characters long
5. Make sure all three permissions are checked
6. Generate a NEW token if permissions were added after first generation

---

**Last Updated:** 2026-01-14  
**Version:** 2.0 (with randomization features)

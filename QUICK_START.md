# 🎯 Quick Start: Get Your Dropbox API Token

## ⚡ FASTEST METHOD - Use Direct Link!

### Step 1: Click This Link
```
👉 https://www.dropbox.com/developers/apps/create
```

### Step 2: Fill the Form
- Select: **Scoped access**
- Select: **Full Dropbox**
- Name: **Invoice Sender**
- Check: **I agree to terms**
- Click: **Create app**

### Step 3: Set Permissions
Click **"Permissions"** tab, check these 3 boxes:
- ☑ `files.content.write`
- ☑ `files.content.read`
- ☑ `sharing.write`

Click **"Submit"** button!

### Step 4: Generate Token
Click **"Settings"** tab, scroll down to **"OAuth 2"**, click **"Generate"**

Copy the token (starts with `sl.`)

### Step 5: Configure App
```bash
cd /home/user/webapp
nano .dev.vars
```

Replace `your_dropbox_token_here` with your actual token:
```
DROPBOX_ACCESS_TOKEN=sl.your_token_here
```

Save (Ctrl+X, Y, Enter) and restart:
```bash
pm2 restart webapp
```

### Step 6: Test!
Open app and click "Send to Dropbox" 🎉

---

## 📚 Need More Help?

### If the direct link doesn't work:
1. **EASIEST_DROPBOX_SETUP.md** - Alternative methods and troubleshooting
2. **DROPBOX_SETUP_ACCURATE.md** - Detailed step-by-step with UI descriptions
3. **QUICK_LOCATION_GUIDE.md** - ASCII diagrams showing button locations
4. **Visual Guide** - https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai/setup-guide

---

## ⚠️ Can't Find "Create app" Button?

### Try These:

1. **Direct Link:** https://www.dropbox.com/developers/apps/create
2. **Log in first:** https://www.dropbox.com/login
3. **Then go to:** https://www.dropbox.com/developers/apps
4. **Look for:**
   - Center of page (if no apps)
   - Top-right corner (if you have apps)
   - Text: "Create", "New", "Build", or "Get started"

---

## 🎲 New Features in Your App

- **Randomize All Fields** button - Generate sample data instantly
- **Individual Random buttons** - Randomize specific fields
- **20+ Service types** - Heating, AC, HVAC, Plumbing, etc.
- **Auto-update preview** - See changes in real-time

---

**Your Invoice App:** https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai

**Visual Setup Guide:** https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai/setup-guide

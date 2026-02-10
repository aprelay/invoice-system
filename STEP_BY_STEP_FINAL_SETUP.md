# 🚀 Step-by-Step: Final Setup (5 Minutes)

## 📋 Overview

You're almost done! Just 2 more steps:
1. ✅ Set up Cloudflare API Token (2 min)
2. ✅ Create OAUTH_TOKENS KV Namespace (2 min)
3. ✅ Deploy (1 min)

---

## STEP 1: Set Up Cloudflare API Token (2 minutes)

### Visual Guide:

#### 1.1 Click the "Deploy" Tab
```
Look at the LEFT SIDEBAR of this interface
You'll see tabs like: Code, Deploy, Settings, etc.
👆 Click on "Deploy"
```

#### 1.2 You'll See Instructions to Create API Token
The Deploy tab will show you:
- How to create a Cloudflare API token
- Where to enter the token
- How to save it

#### 1.3 Create Cloudflare API Token

**Open a new browser tab and go to:**
```
https://dash.cloudflare.com/profile/api-tokens
```

**Or navigate manually:**
```
Cloudflare Dashboard (dash.cloudflare.com)
  → Click your profile icon (top right)
  → My Profile
  → API Tokens (left sidebar)
  → Click "Create Token"
```

#### 1.4 Create Custom Token

1. **Click:** "Create Token"
2. **Click:** "Get started" next to "Create Custom Token"
3. **Fill in the form:**

   **Token name:**
   ```
   Wrangler Deploy Token
   ```

   **Permissions:** (Add these 3 permissions)
   
   | Account | Permission Type | Permission |
   |---------|----------------|------------|
   | Your Account | Account | Cloudflare Pages | Edit |
   | Your Account | Account | Workers KV Storage | Edit |
   | Your Account | Account | Account Settings | Read |

4. **Account Resources:**
   - Include: `All accounts`
   - Or select your specific account

5. **Client IP Address Filtering:** (Optional)
   - Leave empty for now

6. **TTL (Time to Live):**
   - Choose how long token is valid (e.g., 1 year)

7. **Click:** "Continue to summary"

8. **Click:** "Create Token"

#### 1.5 Copy the Token

You'll see a screen with your API token:
```
Your API Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANT:** 
- Copy this token immediately
- You won't be able to see it again!
- Store it somewhere safe temporarily

#### 1.6 Save Token in Deploy Tab

1. Go back to the "Deploy" tab in this interface
2. Paste your API token in the provided field
3. Click "Save" or "Submit"
4. ✅ Token saved!

---

## STEP 2: Create OAUTH_TOKENS KV Namespace (2 minutes)

Now that your Cloudflare API token is configured, you can create the KV namespace.

### 2.1 Open Terminal/Command Line

If you're in the web interface, open the terminal or use the command section.

### 2.2 Navigate to Project Directory

```bash
cd /home/user/webapp
```

### 2.3 Create KV Namespace

Run this command:
```bash
npx wrangler kv:namespace create OAUTH_TOKENS
```

### 2.4 Expected Output

You should see:
```
🌀 Creating namespace with title "invoice-system-OAUTH_TOKENS"
✨ Success!
Add the following to your wrangler.jsonc file:
{ binding = "OAUTH_TOKENS", id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" }
                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                  Copy this ID!
```

**⚠️ IMPORTANT:** Copy the namespace ID (the long string of characters)

### 2.5 Update wrangler.jsonc

#### Option A: Manual Edit

1. Open `wrangler.jsonc` in the editor
2. Find the `kv_namespaces` section
3. Add the new namespace:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "invoice-system",
  "compatibility_date": "2026-01-15",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  "kv_namespaces": [
    {
      "binding": "PDF_CACHE",
      "id": "07c8386508f94337b24a634c62b5d680"
    },
    {
      "binding": "INVOICE_IMAGE_CACHE",
      "id": "431a64f33af9450b986ad3a25f0acfd3"
    },
    {
      "binding": "OAUTH_TOKENS",
      "id": "PASTE_YOUR_KV_ID_HERE"  // ← Replace with the ID you copied
    }
  ]
}
```

4. Save the file

#### Option B: Automated (Run Command)

If you have the KV ID, run:
```bash
# Replace YOUR_KV_ID with the actual ID from step 2.4
echo 'Replace KV ID in wrangler.jsonc with: YOUR_KV_ID'
```

Then I can help you update the file automatically.

### 2.6 Commit Changes to Git

```bash
cd /home/user/webapp
git add wrangler.jsonc
git commit -m "➕ Add OAUTH_TOKENS KV namespace"
git push origin main
```

---

## STEP 3: Build and Deploy (1 minute)

### 3.1 Build the Project

```bash
cd /home/user/webapp
npm run build
```

**Expected output:**
```
✓ 268 modules transformed.
dist/_worker.js  664.92 kB
✓ built in 4s
```

### 3.2 Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy dist --project-name invoice-system
```

**Expected output:**
```
✨ Compiled Worker successfully
✨ Success! Uploaded 1 files (3 seconds)
✨ Deployment complete! Take a peek over at
   https://abc123.invoice-system-7fc.pages.dev
```

### 3.3 Verify Deployment

You'll receive a deployment URL. The production URL is:
```
https://invoice-system-7fc.pages.dev
```

---

## STEP 4: Test Your OAuth Multi-Account System! 🎮

### 4.1 Visit the Accounts Page

Open your browser and go to:
```
https://invoice-system-7fc.pages.dev/accounts
```

### 4.2 Add Your First Account

1. You'll see a button: **"Add New Account"** or **"Add Microsoft Account"**
2. Click it
3. You'll be redirected to Microsoft login page
4. **Sign in** with your Microsoft 365 account (e.g., jaedyn@evolutionfamily.ca)
5. Microsoft will ask for permission: **"This app would like to send mail on your behalf"**
6. Click **"Accept"** or **"Grant permission"**
7. You'll be redirected back to the accounts page
8. ✅ Your account now appears in the list!

### 4.3 Send Your First Invoice from OAuth Account

1. Go to the main page:
   ```
   https://invoice-system-7fc.pages.dev/
   ```

2. You'll see a new dropdown: **"Sender Account (OAuth)"**

3. Click the dropdown and select your account:
   ```
   [ Select account... ▼ ]
   → jaedyn@evolutionfamily.ca ✅
   ```

4. Fill in the invoice details:
   - **Company Name:** RGBRNE Mechanical (or edit it)
   - **Customer Name:** Auto-detected or type name
   - **Invoice Template:** Select from dropdown (e.g., "Commercial Refrigeration Repair")
   - **Contact Email:** ap@rgbmechanical.com (or edit it)
   - **Custom URL:** https://rgbmechanical.com/invoice (or your URL)
   - **Email Recipients:** Enter recipient email(s), one per line

5. Click: **"Send Image Email (Office 365 Optimized)"**

6. Wait a few seconds...

7. ✅ **Success!** You'll see:
   ```
   ✅ Success! HTML Invoice Sent
   Invoice: PO-12345
   Recipients: 1
   ```

8. **Check the recipient's inbox** - email should arrive in 30-60 seconds!

---

## 🎉 SUCCESS! You're Done!

### ✅ What You've Accomplished:

1. ✅ OAuth 2.0 multi-account system fully implemented
2. ✅ Azure AD App configured
3. ✅ Environment variables added to Cloudflare
4. ✅ OAUTH_TOKENS KV namespace created
5. ✅ Deployed to production
6. ✅ First Microsoft 365 account added
7. ✅ First invoice sent from OAuth account!

### 🎮 What You Can Do Now:

#### Add More Accounts:
```
1. Go to: https://invoice-system-7fc.pages.dev/accounts
2. Click: "Add New Account"
3. Sign in with another Microsoft 365 account
4. Repeat for unlimited accounts!

Examples:
- jaedyn@evolutionfamily.ca ✅
- tracy@company.com
- john@microsoft.com
- james@anything.org
```

#### Switch Between Accounts:
```
1. Go to invoice page
2. Select different account from dropdown
3. Send invoice from that account
4. Done!
```

#### Remove Accounts:
```
1. Go to: https://invoice-system-7fc.pages.dev/accounts
2. Click "Remove" next to any account
3. Account removed (user will need to re-authorize if they want to add it again)
```

---

## 📊 Quick Reference

### Your URLs:
- **Production:** https://invoice-system-7fc.pages.dev
- **Accounts Page:** https://invoice-system-7fc.pages.dev/accounts
- **GitHub:** https://github.com/aprelay/invoice-system
- **Cloudflare Dashboard:** https://dash.cloudflare.com

### Your Credentials (Local):
```bash
# View your Azure credentials
cat /home/user/webapp/.azure-credentials.txt

# View your local environment variables
cat /home/user/webapp/.dev.vars
```

### Common Commands:
```bash
# Build project
cd /home/user/webapp && npm run build

# Deploy to production
cd /home/user/webapp && npx wrangler pages deploy dist --project-name invoice-system

# Create KV namespace
cd /home/user/webapp && npx wrangler kv:namespace create NAMESPACE_NAME

# Check Cloudflare authentication
cd /home/user/webapp && npx wrangler whoami
```

---

## 🚨 Troubleshooting

### Issue: "KV namespace OAUTH_TOKENS not found"

**Solution:**
Make sure you:
1. Created the KV namespace: `npx wrangler kv:namespace create OAUTH_TOKENS`
2. Copied the namespace ID
3. Updated `wrangler.jsonc` with the ID
4. Redeployed: `npm run build && npx wrangler pages deploy dist`

### Issue: OAuth redirect fails

**Possible causes:**
1. Environment variables not set correctly
2. Redirect URI mismatch in Azure AD

**Solution:**
1. Check Cloudflare Dashboard → invoice-system → Settings → Environment variables
2. Verify `OAUTH_REDIRECT_URI` is: `https://invoice-system-7fc.pages.dev/auth/callback`
3. Check Azure AD App → Authentication → Redirect URIs matches exactly

### Issue: "Failed to send email"

**Possible causes:**
1. Account not authorized
2. Token expired

**Solution:**
1. Go to accounts page
2. Remove the account
3. Add it again (re-authorize)
4. Try sending again

---

## 📚 Documentation Files

All documentation is in `/home/user/webapp/`:

1. **ENV_VARS_CONFIRMED.md** - Confirmation of env vars setup ✅
2. **QUICK_CLOUDFLARE_SETUP.md** - Quick environment variables guide
3. **CLOUDFLARE_ENV_VARS_GUIDE.md** - Detailed env vars guide
4. **FINAL_SETUP_STEPS.md** - Complete setup checklist
5. **QUICK_OAUTH_SETUP.md** - OAuth quick guide
6. **SETUP_OAUTH_ACCOUNTS.md** - Comprehensive OAuth docs
7. **OAUTH_IMPLEMENTATION_COMPLETE.md** - Implementation status

---

## ✅ Checklist Summary

- [x] OAuth code implemented
- [x] Azure AD App created
- [x] Environment variables configured in Cloudflare
- [ ] Cloudflare API token set up (Deploy tab) ← **YOU ARE HERE**
- [ ] OAUTH_TOKENS KV namespace created
- [ ] wrangler.jsonc updated with KV ID
- [ ] Deployed to production
- [ ] First account added via OAuth
- [ ] First invoice sent

---

## 🎯 YOUR NEXT ACTION

**RIGHT NOW:**
1. **Click the "Deploy" tab** in the left sidebar
2. Follow instructions to create/save Cloudflare API token
3. Come back and run: `npx wrangler kv:namespace create OAUTH_TOKENS`
4. Update `wrangler.jsonc` with the KV ID
5. Deploy: `npm run build && npx wrangler pages deploy dist`

**That's it! 5 minutes to completion!** 🚀

# 📋 Step-by-Step Guide: Adding Environment Variables in Cloudflare

## 🎯 Goal
Add 4 OAuth environment variables to your Cloudflare Pages project

---

## 📝 Prerequisites

Before you start, have your credentials ready:

```bash
# View your Azure credentials
cd /home/user/webapp
cat .azure-credentials.txt
```

You'll need these 4 values:
1. ✅ **Application (client) ID** - from .azure-credentials.txt
2. ✅ **Client Secret** - from .azure-credentials.txt
3. ✅ **Tenant ID** - Use `common`
4. ✅ **Redirect URI** - `https://invoice-system-7fc.pages.dev/auth/callback`

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Cloudflare Dashboard
1. **Open your browser**
2. **Go to:** https://dash.cloudflare.com
3. **Log in** with your Cloudflare credentials

![Cloudflare Login Page]

---

### Step 2: Navigate to Workers & Pages
1. On the left sidebar, you'll see a menu
2. **Click on:** "Workers & Pages"
3. You'll see a list of your projects

![Workers & Pages Menu]

---

### Step 3: Find Your Project
1. Look for your project named: **"invoice-system"**
2. **Click on** "invoice-system"
3. You'll be taken to the project dashboard

![Project List]

**If you don't see "invoice-system":**
- You may need to deploy it first
- Run: `cd /home/user/webapp && npm run build && npx wrangler pages deploy dist --project-name invoice-system`
- Then come back to this page

---

### Step 4: Go to Settings
1. At the top of the page, you'll see tabs: Overview, Deployments, Settings, etc.
2. **Click on:** "Settings"
3. You'll see the settings page

![Settings Tab]

---

### Step 5: Navigate to Environment Variables
1. On the Settings page, scroll down to find sections
2. Look for: **"Environment variables"** or **"Variables"**
3. **Click on:** "Environment variables" section

![Environment Variables Section]

**You'll see:**
- A list of existing variables (if any)
- A button to add new variables

---

### Step 6: Add Variable #1 - OAUTH_CLIENT_ID

1. **Click:** "Add variable" button
2. You'll see a form with two fields:

   **Variable name:** (text input)
   ```
   OAUTH_CLIENT_ID
   ```

   **Value:** (text input)
   ```
   Paste your Application (client) ID from .azure-credentials.txt
   ```

3. **Important:** Check the box for **"Encrypt"** ✅
   - This ensures the value is stored securely

4. **Click:** "Save" or "Add"

![Add Variable Form]

---

### Step 7: Add Variable #2 - OAUTH_CLIENT_SECRET

1. **Click:** "Add variable" button again
2. Fill in the form:

   **Variable name:**
   ```
   OAUTH_CLIENT_SECRET
   ```

   **Value:**
   ```
   Paste your Client Secret from .azure-credentials.txt
   ```

3. **Check:** "Encrypt" box ✅
4. **Click:** "Save" or "Add"

---

### Step 8: Add Variable #3 - OAUTH_TENANT_ID

1. **Click:** "Add variable" button again
2. Fill in the form:

   **Variable name:**
   ```
   OAUTH_TENANT_ID
   ```

   **Value:**
   ```
   common
   ```

3. **Check:** "Encrypt" box ✅
4. **Click:** "Save" or "Add"

---

### Step 9: Add Variable #4 - OAUTH_REDIRECT_URI

1. **Click:** "Add variable" button again
2. Fill in the form:

   **Variable name:**
   ```
   OAUTH_REDIRECT_URI
   ```

   **Value:**
   ```
   https://invoice-system-7fc.pages.dev/auth/callback
   ```

3. **Check:** "Encrypt" box ✅
4. **Click:** "Save" or "Add"

---

### Step 10: Verify All Variables Added

You should now see all 4 environment variables in the list:

```
✅ OAUTH_CLIENT_ID          (encrypted)
✅ OAUTH_CLIENT_SECRET      (encrypted)
✅ OAUTH_TENANT_ID          (encrypted)
✅ OAUTH_REDIRECT_URI       (encrypted)
```

**Important Notes:**
- The values should show as "••••••••" (hidden/encrypted)
- You won't be able to see the actual values after saving (security feature)
- If you made a mistake, you can edit or delete and re-add

---

### Step 11: Save Changes (if needed)

Some versions of Cloudflare Dashboard require you to:
1. Scroll to the bottom of the page
2. **Click:** "Save" or "Deploy changes"

**Others save automatically** after adding each variable.

---

### Step 12: Verify Variables Are Active

1. Go back to the "Overview" tab
2. Look for recent deployments
3. You may see a new deployment triggered automatically

**If not, manually redeploy:**
```bash
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name invoice-system
```

---

## ✅ Verification Checklist

After adding all variables, verify:

- [ ] All 4 variables are visible in the Environment Variables section
- [ ] All variables show as "encrypted" or values are hidden
- [ ] Variable names are spelled correctly (case-sensitive!)
- [ ] No extra spaces in variable names or values

### Expected Result:

| Variable Name | Status | Value Preview |
|--------------|--------|---------------|
| OAUTH_CLIENT_ID | ✅ Encrypted | ••••••••••••• |
| OAUTH_CLIENT_SECRET | ✅ Encrypted | ••••••••••••• |
| OAUTH_TENANT_ID | ✅ Encrypted | ••••••••••••• |
| OAUTH_REDIRECT_URI | ✅ Encrypted | ••••••••••••• |

---

## 🎮 Test the Setup

After adding variables and deploying:

1. **Open:** https://invoice-system-7fc.pages.dev/accounts
2. **Click:** "Add New Account"
3. **Expected:** You'll be redirected to Microsoft login
4. **Sign in** with your Microsoft 365 account
5. **Grant permission:** Mail.Send
6. **Expected:** Redirected back with account added

**If it works:** ✅ Setup complete!
**If it fails:** Check the troubleshooting section below

---

## 🚨 Troubleshooting

### Issue: Can't find "invoice-system" project

**Solution:**
1. Deploy your project first:
   ```bash
   cd /home/user/webapp
   npm run build
   npx wrangler pages deploy dist --project-name invoice-system
   ```
2. Refresh the Cloudflare Dashboard
3. "invoice-system" should now appear

---

### Issue: "Add variable" button is grayed out

**Solution:**
- You may not have permission
- Check if you're the account owner
- Try refreshing the page
- Log out and log back in

---

### Issue: OAuth fails after adding variables

**Possible causes:**
1. **Variable names have typos** - Check spelling (case-sensitive!)
2. **Values have extra spaces** - Trim spaces before/after
3. **Wrong Client Secret** - Double-check from .azure-credentials.txt
4. **Project not redeployed** - Redeploy after adding variables

**Solutions:**
```bash
# View your credentials again
cat .azure-credentials.txt

# Verify variable names (copy-paste to avoid typos):
OAUTH_CLIENT_ID
OAUTH_CLIENT_SECRET
OAUTH_TENANT_ID
OAUTH_REDIRECT_URI

# Redeploy
npm run build
npx wrangler pages deploy dist --project-name invoice-system
```

---

### Issue: Variables not showing in deployment

**Solution:**
1. Go to: Settings → Environment variables
2. Check if variables are under **"Production"** environment
3. If under "Preview" only, add them to "Production" too
4. Redeploy

---

## 🎯 Quick Reference

### Variable Summary Table

| # | Variable Name | Value Source | Example Value |
|---|--------------|--------------|---------------|
| 1 | `OAUTH_CLIENT_ID` | .azure-credentials.txt | a1fcb2e0-****-****-****-******** |
| 2 | `OAUTH_CLIENT_SECRET` | .azure-credentials.txt | EgP8Q~~********************* |
| 3 | `OAUTH_TENANT_ID` | Type manually | `common` |
| 4 | `OAUTH_REDIRECT_URI` | Type manually | https://invoice-system-7fc.pages.dev/auth/callback |

### Cloudflare Dashboard Navigation

```
https://dash.cloudflare.com
  └─ Workers & Pages (left sidebar)
      └─ invoice-system (click project name)
          └─ Settings (top tab)
              └─ Environment variables (section)
                  └─ Add variable (button) ← Click here 4 times
```

---

## 🔗 Useful Links

- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Cloudflare Docs - Environment Variables:** https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables
- **Your Project (after setup):** https://invoice-system-7fc.pages.dev
- **Accounts Page:** https://invoice-system-7fc.pages.dev/accounts

---

## ✅ Next Steps

After completing this guide:

1. ✅ All 4 environment variables added
2. ✅ Project redeployed (automatic or manual)
3. ➡️ **Test the OAuth flow:**
   - Go to: https://invoice-system-7fc.pages.dev/accounts
   - Click: "Add New Account"
   - Sign in and authorize
4. ➡️ **Send your first invoice:**
   - Select sender account
   - Fill invoice details
   - Send!

---

## 🎉 Success!

**Once you see all 4 variables in Cloudflare Dashboard, you're done with this step!**

**Next:** Test the OAuth flow to make sure everything works!

**If you have issues:** Check the troubleshooting section above or refer to FINAL_SETUP_STEPS.md

---

**Questions? Need help?**
- All credentials are in: `.azure-credentials.txt`
- Full documentation: QUICK_OAUTH_SETUP.md, SETUP_OAUTH_ACCOUNTS.md
- Troubleshooting: See above or FINAL_SETUP_STEPS.md

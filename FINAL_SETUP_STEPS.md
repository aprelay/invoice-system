# 🚀 Final Setup Steps - READY TO COMPLETE!

## ✅ Progress So Far

### ✅ COMPLETED:
1. ✅ **OAuth code fully implemented** (src/index.tsx)
2. ✅ **Azure AD App created** ✨
   - Credentials stored securely in `.azure-credentials.txt` (local only)
   - ⚠️ **NEVER commit .azure-credentials.txt to git!**
3. ✅ **Local credentials configured** (.dev.vars)
4. ✅ **Service running locally** on port 3000
5. ✅ **Accounts page accessible** at `/accounts`

---

## 🔴 REMAINING STEPS (10 minutes)

### Step 1: Configure Cloudflare API Key (2 min)

**You need to do this in the web interface:**

1. **Click on the "Deploy" tab** in the sidebar
2. **Follow the instructions** to create a Cloudflare API token
3. **Enter your API key** and save it

**After saving, come back here and continue.**

---

### Step 2: Create KV Namespace (3 min)

**Run this command after Cloudflare API key is configured:**

```bash
cd /home/user/webapp
npx wrangler kv:namespace create OAUTH_TOKENS
```

**Expected output:**
```
🌀 Creating namespace with title "webapp-OAUTH_TOKENS"
✨ Success!
Add the following to your wrangler.jsonc file:
{ binding = "OAUTH_TOKENS", id = "xxxxxxxxxxxxxxxxxxxxxxxx" }
```

**Copy the ID and update `wrangler.jsonc`:**

```jsonc
{
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
      "id": "YOUR_NEW_KV_ID_HERE"  // ← Paste the ID here
    }
  ]
}
```

---

### Step 3: Set Production Environment Variables (5 min)

**⚠️ Your Azure credentials are in `.azure-credentials.txt` file (local only)**

```bash
# First, view your credentials
cat .azure-credentials.txt
```

**Method 1: Using Wrangler CLI (after API key is configured)**

```bash
cd /home/user/webapp

# You'll need to paste values from .azure-credentials.txt when prompted

npx wrangler secret put OAUTH_CLIENT_ID --project-name invoice-system
# Paste: Application (client) ID

npx wrangler secret put OAUTH_CLIENT_SECRET --project-name invoice-system
# Paste: Client Secret

npx wrangler secret put OAUTH_TENANT_ID --project-name invoice-system
# Paste: common

npx wrangler secret put OAUTH_REDIRECT_URI --project-name invoice-system
# Paste: https://invoice-system-7fc.pages.dev/auth/callback
```

**Method 2: Via Cloudflare Dashboard (easier)**

1. Go to: https://dash.cloudflare.com
2. Navigate: **Workers & Pages** → **invoice-system** → **Settings** → **Variables**
3. Click: **Add variable** (4 times for each secret)
4. Add these as **Environment variables** (encrypted):

| Variable Name | Value |
|--------------|-------|
| `OAUTH_CLIENT_ID` | Get from `.azure-credentials.txt` |
| `OAUTH_CLIENT_SECRET` | Get from `.azure-credentials.txt` |
| `OAUTH_TENANT_ID` | `common` |
| `OAUTH_REDIRECT_URI` | `https://invoice-system-7fc.pages.dev/auth/callback` |

5. Click **Save**

---

### Step 4: Deploy to Production (2 min)

```bash
cd /home/user/webapp

# Build
npm run build

# Deploy
npx wrangler pages deploy dist --project-name invoice-system
```

**Expected output:**
```
✨ Success! Uploaded 1 files (3.21 sec)

✨ Deployment complete! Take a peek over at
   https://xxxxxxxx.invoice-system-7fc.pages.dev
```

---

## 🎮 Testing the OAuth Flow

### Test 1: Local Development (Now)

```
1. Open: http://localhost:3000/accounts
2. Click: "Add New Account"
3. Result: You'll see an error about KV namespace (expected - need to create it first)
```

### Test 2: After KV Namespace Created

```
1. Open: http://localhost:3000/accounts
2. Click: "Add New Account"
3. Redirected to: Microsoft login
4. Sign in: Use any Microsoft 365 account
5. Grant permission: Mail.Send
6. Redirected back: Account appears in list
```

### Test 3: Production (After Deployment)

```
1. Open: https://invoice-system-7fc.pages.dev/accounts
2. Click: "Add New Account"
3. Sign in: With Microsoft 365 account
4. Result: Account added successfully
```

### Test 4: Send Email from OAuth Account

```
1. Open: https://invoice-system-7fc.pages.dev/
2. Sender dropdown: Select your account
3. Fill invoice details
4. Click: "Send Image Email"
5. Result: Email sent from selected account!
```

---

## ✅ Complete Setup Checklist

### Pre-requisites:
- [x] Azure AD App created
- [x] Credentials saved in `.azure-credentials.txt`
- [x] Local credentials configured
- [x] Code fully implemented
- [x] Service running locally

### To Do Now:
- [ ] Configure Cloudflare API key (Deploy tab)
- [ ] Create OAUTH_TOKENS KV namespace
- [ ] Update wrangler.jsonc with KV ID
- [ ] Set production environment variables
- [ ] Deploy to Cloudflare Pages
- [ ] Test OAuth flow locally
- [ ] Test OAuth flow in production
- [ ] Add first Microsoft 365 account
- [ ] Send test email from OAuth account

---

## 🔗 Quick Reference

### Your Azure AD App:
**⚠️ Credentials stored in:** `.azure-credentials.txt` (local file, not in git)

To view your credentials:
```bash
cat .azure-credentials.txt
```

### Redirect URIs:
- **Local:** `http://localhost:3000/auth/callback`
- **Production:** `https://invoice-system-7fc.pages.dev/auth/callback`

### URLs:
- **Local Accounts:** http://localhost:3000/accounts
- **Production:** https://invoice-system-7fc.pages.dev
- **Production Accounts:** https://invoice-system-7fc.pages.dev/accounts
- **GitHub:** https://github.com/aprelay/invoice-system

### Cloudflare:
- **Dashboard:** https://dash.cloudflare.com
- **Project:** invoice-system
- **KV Namespaces:** PDF_CACHE, INVOICE_IMAGE_CACHE, OAUTH_TOKENS (to be created)

---

## 🚨 Important Security Notes

### ⚠️ Your Credentials:
- ✅ Stored in `.azure-credentials.txt` (local only)
- ✅ Stored in `.dev.vars` (local only, gitignored)
- ❌ **NEVER commit these files to GitHub!**
- ✅ `.gitignore` already configured to exclude them

### 🔒 Production Secrets:
- Store in Cloudflare as encrypted environment variables
- Never expose in frontend code
- Only accessible to backend Workers

---

## 📞 Next Steps Summary

**RIGHT NOW:**
1. Go to **Deploy tab** → Configure Cloudflare API key
2. Come back and run: `npx wrangler kv:namespace create OAUTH_TOKENS`
3. Update `wrangler.jsonc` with KV ID
4. Set production secrets (via Cloudflare Dashboard or Wrangler CLI)
5. Deploy: `npm run build && npx wrangler pages deploy dist`

**THEN:**
1. Visit: https://invoice-system-7fc.pages.dev/accounts
2. Click: "Add New Account"
3. Sign in with your Microsoft 365 account
4. Start sending invoices from multiple accounts!

---

## 🎉 Almost There!

**You're 95% done! Just need to:**
1. ✅ Configure Cloudflare API key
2. ✅ Create KV namespace
3. ✅ Set production secrets
4. ✅ Deploy

**Total time: ~10 minutes**

**Then you can send invoices from ANY Microsoft 365 account! 🚀**

---

**Questions? Check:**
- QUICK_OAUTH_SETUP.md
- SETUP_OAUTH_ACCOUNTS.md
- OAUTH_IMPLEMENTATION_COMPLETE.md

# ⚡ Quick OAuth Setup (15 Minutes)

## 🎯 Goal
Send invoices from **multiple Microsoft 365 accounts** across different organizations without admin consent.

---

## 📋 What You Need

1. **Microsoft 365 accounts** (the emails you want to send from)
2. **Azure Portal access** (any account can create apps)
3. **Cloudflare API token** (for KV namespace creation)

---

## ⚡ 3-Step Setup

### Step 1: Create Azure AD App (5 min)

```bash
# Go to: https://portal.azure.com
# Navigate: Azure Active Directory → App registrations → New registration

Name: Invoice System OAuth
Account types: Multitenant (any Azure AD directory)
Redirect URI: https://invoice-system-7fc.pages.dev/auth/callback

# After creation, copy:
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Directory (tenant) ID: common

# Create Client Secret:
Certificates & secrets → New client secret → Copy value immediately

# Add Permission:
API permissions → Add permission → Microsoft Graph → Delegated → Mail.Send
(No admin consent required!)
```

### Step 2: Configure Cloudflare (7 min)

**Option A: Via Cloudflare Dashboard (Easier)**
```
1. Go to: Cloudflare Dashboard → Workers & Pages → invoice-system → Settings → Variables
2. Add these encrypted secrets:
   - OAUTH_CLIENT_ID = <your client ID>
   - OAUTH_CLIENT_SECRET = <your client secret>
   - OAUTH_TENANT_ID = common
   - OAUTH_REDIRECT_URI = https://invoice-system-7fc.pages.dev/auth/callback
```

**Option B: Via Wrangler CLI**
```bash
npx wrangler secret put OAUTH_CLIENT_ID
npx wrangler secret put OAUTH_CLIENT_SECRET
npx wrangler secret put OAUTH_TENANT_ID
npx wrangler secret put OAUTH_REDIRECT_URI
```

**Create KV Namespace:**
```bash
npx wrangler kv:namespace create OAUTH_TOKENS

# Copy the ID from output, then update wrangler.jsonc:
{
  "kv_namespaces": [
    ...,
    {
      "binding": "OAUTH_TOKENS",
      "id": "your-kv-id-here"
    }
  ]
}
```

### Step 3: Deploy & Test (3 min)

```bash
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name invoice-system

# Open: https://invoice-system-7fc.pages.dev/accounts
# Click: "Add Microsoft Account"
# Sign in with your Microsoft 365 account
# Grant Mail.Send permission
# Done! Account added.
```

---

## 🎮 How to Use

### Add Accounts (2 min per account)

```
1. Open: https://invoice-system-7fc.pages.dev/accounts
2. Click: "Add Microsoft Account"
3. Sign in: jaedyn@evolutionfamily.ca (or any Microsoft 365 email)
4. Grant: Mail.Send permission
5. Redirected back → Account added!

Repeat for:
- tracy@company.com
- john@microsoft.com
- james@anything.org
```

### Send Email from Any Account

```
1. Open: https://invoice-system-7fc.pages.dev/
2. Sender Account dropdown:
   [ Select account... ▼ ]
   - jaedyn@evolutionfamily.ca
   - tracy@company.com
   - john@microsoft.com
   - james@anything.org

3. Select sender
4. Fill invoice details
5. Click "Send Image Email"
6. Done! Email sent from selected account.
```

---

## 🚨 Troubleshooting

### "OAUTH_TOKENS KV namespace not configured"
→ Create KV namespace (Step 2) and update wrangler.jsonc

### "OAuth client not configured"
→ Set environment variables in Cloudflare (Step 2)

### "Redirect URI mismatch"
→ Make sure Azure AD and Cloudflare have same redirect URI:
  `https://invoice-system-7fc.pages.dev/auth/callback`

### "Admin consent required"
→ Use **Delegated** permissions, not Application permissions

### "Token expired"
→ System auto-refreshes. If fails, remove account and re-add.

---

## ✅ Setup Checklist

- [ ] Create Azure AD App (5 min)
- [ ] Set Cloudflare secrets (7 min)
- [ ] Create OAUTH_TOKENS KV namespace
- [ ] Update wrangler.jsonc
- [ ] Deploy to Cloudflare Pages (3 min)
- [ ] Add first account (2 min)
- [ ] Test sending email (1 min)
- [ ] Add more accounts as needed

**Total: ~15-20 minutes**

---

## 🎯 What This Gives You

✅ Send from **unlimited accounts**
✅ **Any organization** (not just yours)
✅ **No admin consent** required
✅ Users authorize **their own accounts**
✅ **Secure** token storage
✅ **Automatic** token refresh
✅ **Easy** account management

---

## 📚 Full Documentation

- **SETUP_OAUTH_ACCOUNTS.md** - Comprehensive setup guide
- **OAUTH_MULTI_ACCOUNT_SETUP.md** - Technical implementation details
- **README.md** - Project overview

---

## 🎉 Done!

**Your multi-account OAuth system is ready to use!**

Just follow the 3 steps above and you'll be sending invoices from multiple Microsoft 365 accounts in 15 minutes.

**No admin consent. No restrictions. Just works.**

---

## 🔗 Quick Links

- **Azure Portal:** https://portal.azure.com
- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Invoice System:** https://invoice-system-7fc.pages.dev/
- **Accounts Page:** https://invoice-system-7fc.pages.dev/accounts
- **Add Account:** https://invoice-system-7fc.pages.dev/auth/microsoft

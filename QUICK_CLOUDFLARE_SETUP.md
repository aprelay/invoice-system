# 🎯 QUICK START: Add Cloudflare Environment Variables

## 📋 What You Need
```bash
# View your credentials first
cd /home/user/webapp
cat .azure-credentials.txt
```

---

## 🚀 Steps (5 minutes)

### 1. Open Cloudflare Dashboard
```
🌐 Go to: https://dash.cloudflare.com
🔐 Log in
```

### 2. Navigate to Your Project
```
📁 Left Sidebar → Click "Workers & Pages"
📋 Find "invoice-system" in the list
👆 Click on "invoice-system"
```

### 3. Open Settings
```
⚙️ Top tabs → Click "Settings"
📊 Scroll to "Environment variables" section
```

### 4. Add Variable #1
```
➕ Click "Add variable"

Name:   OAUTH_CLIENT_ID
Value:  [Paste from .azure-credentials.txt - Application (client) ID]
✅ Check "Encrypt"
💾 Click "Save"
```

### 5. Add Variable #2
```
➕ Click "Add variable"

Name:   OAUTH_CLIENT_SECRET
Value:  [Paste from .azure-credentials.txt - Client Secret]
✅ Check "Encrypt"
💾 Click "Save"
```

### 6. Add Variable #3
```
➕ Click "Add variable"

Name:   OAUTH_TENANT_ID
Value:  common
✅ Check "Encrypt"
💾 Click "Save"
```

### 7. Add Variable #4
```
➕ Click "Add variable"

Name:   OAUTH_REDIRECT_URI
Value:  https://invoice-system-7fc.pages.dev/auth/callback
✅ Check "Encrypt"
💾 Click "Save"
```

---

## ✅ Verify

You should see:
```
✅ OAUTH_CLIENT_ID          ••••••••••••• (encrypted)
✅ OAUTH_CLIENT_SECRET      ••••••••••••• (encrypted)
✅ OAUTH_TENANT_ID          ••••••••••••• (encrypted)
✅ OAUTH_REDIRECT_URI       ••••••••••••• (encrypted)
```

---

## 🎮 Test It

```
1. Go to: https://invoice-system-7fc.pages.dev/accounts
2. Click: "Add New Account"
3. Sign in with Microsoft 365
4. Done! Account added ✅
```

---

## 📚 Need More Details?

**See:** CLOUDFLARE_ENV_VARS_GUIDE.md (full step-by-step with screenshots)

---

## 🚨 Troubleshooting

**Can't find "invoice-system"?**
```bash
# Deploy it first
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name invoice-system
```

**OAuth not working?**
- Check variable names (case-sensitive!)
- Remove extra spaces from values
- Verify you checked "Encrypt" for each
- Redeploy after adding variables

---

## ✨ Done!

Once all 4 variables are added → You're ready to use OAuth multi-account! 🚀

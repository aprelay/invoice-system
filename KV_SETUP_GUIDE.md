# 🔧 Cloudflare KV Setup - Quick Guide

## ⚠️ Important: KV Namespace Setup Required

The invoice image storage requires a Cloudflare KV namespace to be created and bound to your Pages project.

---

## 📋 Setup Steps (5 minutes)

### **Option 1: Via Cloudflare Dashboard (Recommended)**

#### **Step 1: Create KV Namespace**
1. Go to https://dash.cloudflare.com/
2. Select your account
3. Click **"Workers & Pages"** in left sidebar
4. Click **"KV"** tab
5. Click **"Create namespace"** button
6. Enter name: `invoice-image-cache`
7. Click **"Add"**
8. **Copy the Namespace ID** (looks like: `abc123def456...`)

#### **Step 2: Bind KV to Pages Project**
1. In Cloudflare Dashboard, go to **Workers & Pages**
2. Click on your project: **`invoice-system-7fc`**
3. Click **"Settings"** tab
4. Scroll to **"Functions"** section
5. Find **"KV namespace bindings"**
6. Click **"Add binding"**
7. Fill in:
   - **Variable name**: `PDF_CACHE` (MUST be exactly this)
   - **KV namespace**: Select `invoice-image-cache` from dropdown
8. Click **"Save"**

#### **Step 3: Redeploy**
1. Go to **"Deployments"** tab
2. Click on latest deployment
3. Click **"Retry deployment"** or **"Manage deployment"** → **"Retry deployment"**
4. Wait ~60 seconds for deployment to complete

---

### **Option 2: Via Wrangler CLI (Advanced)**

If you prefer command line:

```bash
# 1. Create KV namespace
npx wrangler kv:namespace create PDF_CACHE

# Output will show:
# [[kv_namespaces]]
# binding = "PDF_CACHE"
# id = "your-namespace-id-here"

# 2. Update wrangler.jsonc with the ID from step 1
# (I'll do this for you after you create the namespace)

# 3. Deploy
npm run deploy:prod
```

---

## 🎯 Quick Visual Guide

### **Finding KV in Dashboard:**

```
Cloudflare Dashboard
    ↓
Workers & Pages (left sidebar)
    ↓
KV tab (top navigation)
    ↓
Create namespace button (blue button)
    ↓
Name: invoice-image-cache
```

### **Binding KV to Project:**

```
Workers & Pages
    ↓
invoice-system-7fc (your project)
    ↓
Settings tab
    ↓
Scroll to "Functions" section
    ↓
KV namespace bindings
    ↓
Add binding
    ↓
Variable name: PDF_CACHE
KV namespace: invoice-image-cache
```

---

## ✅ Verification

After setup, check if it works:

1. **Test the app**: https://invoice-system-7fc.pages.dev
2. **Send test email** with the green button
3. **Check browser console** (F12):
   - Should see: "✅ Image stored successfully"
   - Should see: "✅ Image URL: https://..."
4. **Check email**: Image should display automatically

### **If Still Getting Error:**

**Check binding name:**
- Must be EXACTLY: `PDF_CACHE` (case-sensitive)
- If you named it differently, let me know and I'll update the code

**Check deployment:**
- Make sure you redeployed after adding the binding
- KV bindings only work after deployment

---

## 🔄 Alternative: Update Code to Use Different Binding Name

If you want to use a different name (not `PDF_CACHE`), let me know and I can update the code to match.

---

## 📝 What KV Does

**Cloudflare KV** is a key-value storage service that:
- ✅ Stores invoice images for 7 days
- ✅ Serves them globally via CDN
- ✅ Free tier: 100,000 reads/day
- ✅ Perfect for this use case

---

## 🆘 Need Help?

**Common Issues:**

1. **"PDF_CACHE not configured"**
   - Solution: Create KV namespace and bind it (steps above)

2. **"KV namespace not found"**
   - Solution: Make sure variable name is exactly `PDF_CACHE`

3. **"Still not working after binding"**
   - Solution: Redeploy the project (Deployments → Retry deployment)

---

## 🚀 Next Steps

1. **Create KV namespace** (2 minutes)
2. **Bind to project** (1 minute)  
3. **Redeploy** (1 minute)
4. **Test** (30 seconds)

Total time: **~5 minutes** ⏱️

Then your invoice emails will work perfectly in Office 365! 🎉

---

**Let me know once you've created the KV namespace, and I can help verify the setup!**

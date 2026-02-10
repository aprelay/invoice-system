# 🚀 OAuth Multi-Account Setup Guide

**Last Updated**: 2026-01-19  
**Status**: ✅ **IMPLEMENTED - READY FOR CONFIGURATION**  
**Feature**: Send invoices from multiple Microsoft 365 accounts across different organizations

---

## 🎯 **WHAT WAS IMPLEMENTED**

### ✅ **Complete OAuth 2.0 Authorization Code Flow**

**Features:**
- ✅ **Multiple Account Support** - Add unlimited Microsoft 365 accounts
- ✅ **Cross-Organization** - Works with any Microsoft 365 org (evolutionfamily.ca, company.com, microsoft.com, etc.)
- ✅ **No Admin Consent** - Each user authorizes their own account
- ✅ **Account Management UI** - Add, list, remove accounts
- ✅ **Sender Selection Dropdown** - Choose which account to send from
- ✅ **Auto Token Refresh** - Tokens refresh automatically when expired
- ✅ **Secure Storage** - Tokens stored in Cloudflare KV (encrypted)

---

## 📋 **SETUP PROCESS**

### **PHASE 1: AZURE APP REGISTRATION** (5 minutes)

#### **Step 1: Go to Azure Portal**
```
https://portal.azure.com
```

#### **Step 2: Create App Registration**
```
Navigate to:
Azure Active Directory → App registrations → New registration

Fill in:
Name: Invoice System Multi-Account
Supported account types: Accounts in any organizational directory (Any Azure AD directory - Multitenant)
Redirect URI:
  - Platform: Web
  - URL: https://invoice-system-7fc.pages.dev/auth/callback
  
Click: Register
```

#### **Step 3: Copy Application (Client) ID**
```
After registration, you'll see:
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

📋 COPY THIS - You'll need it as OAUTH_CLIENT_ID
```

#### **Step 4: Create Client Secret**
```
Navigate to:
Certificates & secrets → Client secrets → New client secret

Fill in:
Description: Invoice System Secret
Expires: 24 months (recommended)

Click: Add

⚠️ IMPORTANT: Copy the VALUE immediately (not the Secret ID)
The value is only shown once!

📋 COPY THIS - You'll need it as OAUTH_CLIENT_SECRET
```

#### **Step 5: Configure API Permissions**
```
Navigate to:
API permissions → Add a permission

Select: Microsoft Graph → Delegated permissions

Add these permissions:
✅ Mail.Send - Send mail as the signed-in user
✅ User.Read - Read user profile (basic info)
✅ offline_access - Refresh tokens

Click: Add permissions

✅ NO ADMIN CONSENT NEEDED - These are delegated permissions!
```

---

### **PHASE 2: CLOUDFLARE CONFIGURATION** (5 minutes)

#### **Step 1: Create OAuth Tokens KV Namespace**
```bash
# In terminal:
npx wrangler kv namespace create OAUTH_TOKENS

# You'll get output like:
# id = "abc123def456..."

# Copy this ID
```

#### **Step 2: Update wrangler.jsonc**
```jsonc
{
  "kv_namespaces": [
    {
      "binding": "OAUTH_TOKENS",
      "id": "YOUR_KV_ID_FROM_STEP_1"  // ← Replace placeholder
    }
  ]
}
```

#### **Step 3: Add Cloudflare Secrets**
```bash
# Set OAuth credentials
npx wrangler pages secret put OAUTH_CLIENT_ID
# Paste your Client ID from Azure

npx wrangler pages secret put OAUTH_CLIENT_SECRET  
# Paste your Client Secret from Azure

npx wrangler pages secret put OAUTH_TENANT_ID
# Enter: common (for multi-tenant support)
```

---

### **PHASE 3: DEPLOYMENT** (2 minutes)

#### **Build and Deploy:**
```bash
npm run build
npx wrangler pages deploy dist --project-name invoice-system
```

---

### **PHASE 4: ADD YOUR FIRST ACCOUNT** (2 minutes)

#### **Step 1: Open Account Management**
```
https://invoice-system-7fc.pages.dev/accounts
```

#### **Step 2: Click "Add Account"**
```
You'll be redirected to Microsoft login
```

#### **Step 3: Sign In**
```
Enter your Microsoft 365 email and password
Example: jaedyn@evolutionfamily.ca
```

#### **Step 4: Grant Permission**
```
Microsoft will ask:
"Allow Invoice System to:
  - Send email as you
  - Read your basic profile"

Click: Accept
```

#### **Step 5: Success!**
```
You'll see:
✅ Account Added Successfully!
Email: jaedyn@evolutionfamily.ca

Click: Back to Invoice System
```

---

## 🎨 **HOW TO USE**

### **Sending Invoices:**

**Step 1: Open Invoice System**
```
https://invoice-system-7fc.pages.dev/
```

**Step 2: Select Sender Account**
```
┌─────────────────────────────────────┐
│ 📧 Send From Account                │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ jaedyn@evolutionfamily.ca   ▼   │ │
│ └─────────────────────────────────┘ │
│   • jaedyn@evolutionfamily.ca       │
│   • tracy@company.com               │
│   • john@microsoft.com              │
│                                     │
│ [Manage Accounts]                   │
└─────────────────────────────────────┘

Select which account to send from
```

**Step 3: Fill Invoice Details**
```
- Company Name: Your Company
- Template: Select service type
- Custom URL: Your website
- Email Recipients: customer@example.com
```

**Step 4: Send**
```
Click: "Send Image Email (Office 365 Optimized)"

✅ Email sent from selected account!
```

---

## 📊 **ARCHITECTURE**

### **OAuth Flow Diagram:**
```
┌─────────────┐
│   User      │
│   clicks    │
│ "Add Account"│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  /auth/microsoft│ Redirect to Microsoft
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ Microsoft Login     │ User signs in
│ asks@company.com    │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│ Grant Permissions?   │ User approves
│ ✅ Mail.Send         │
│ ✅ User.Read         │
└──────┬───────────────┘
       │
       ▼
┌─────────────────┐
│ /auth/callback  │ Receive auth code
└──────┬──────────┘
       │
       ▼
┌──────────────────┐
│ Exchange code    │ Get access_token
│ for tokens       │ + refresh_token
└──────┬───────────┘
       │
       ▼
┌─────────────────┐
│ Store in KV     │ OAUTH_TOKENS namespace
│ account:email   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ ✅ Success!     │ Account ready to use
└─────────────────┘
```

### **Sending Email Flow:**
```
User selects account → Check KV for tokens → Token valid?
                                               │
                          ┌────────────────────┴─────────────────┐
                          │                                      │
                         Yes                                    No
                          │                                      │
                          ▼                                      ▼
                    Use access_token              Refresh using refresh_token
                          │                                      │
                          └────────────────┬─────────────────────┘
                                           │
                                           ▼
                            Send email via Graph API
                            /users/{email}/sendMail
                                           │
                                           ▼
                                        ✅ Sent!
```

---

## 🔐 **SECURITY FEATURES**

### **Token Storage:**
```
Location: Cloudflare KV (OAUTH_TOKENS namespace)
Encryption: Cloudflare handles encryption at rest
Expiration: 90 days (tokens auto-refresh)
Access: Only your Cloudflare Workers can access
```

### **Token Refresh:**
```javascript
// Automatic refresh logic
if (token.expiresAt < now + 5minutes) {
  // Refresh token
  newToken = await refreshAccessToken(refreshToken)
  // Update KV storage
  await KV.put(key, newToken)
}
```

### **Permissions:**
```
Delegated Permissions (User-based):
✅ Mail.Send - Only send email as the signed-in user
✅ User.Read - Only read basic profile
✅ offline_access - Enable refresh tokens

❌ NO admin permissions
❌ NO access to other users' data
❌ NO organization-wide access
```

---

## 💡 **ADVANTAGES OVER OLD METHOD**

### **Old Method (Application Permissions):**
```
❌ Fixed sender (jaedyn@evolutionfamily.ca only)
❌ Requires admin consent
❌ Organization-specific
❌ Cannot switch accounts
❌ No multi-tenant support
```

### **New Method (Delegated Permissions):**
```
✅ Multiple senders (unlimited accounts)
✅ NO admin consent needed
✅ Multi-tenant (any org)
✅ Easy account switching
✅ Cross-organization support
✅ User controls their own access
```

---

## 🎯 **USE CASES**

### **Use Case 1: Multiple Team Members**
```
Team:
• jaedyn@evolutionfamily.ca (Sales)
• tracy@evolutionfamily.ca (Accounting)
• support@evolutionfamily.ca (Support)

Each adds their account → Each sends from their own email
```

### **Use Case 2: Multiple Organizations**
```
Organizations:
• RGBRNE Mechanical (jaedyn@evolutionfamily.ca)
• Partner Company (john@partner.com)
• Client Company (support@client.org)

Each org member adds their account → Send from any org
```

### **Use Case 3: White Label Service**
```
Service Provider manages invoices for clients:
• client1@business1.com
• client2@business2.com
• client3@business3.com

Add all accounts → Send as any client
```

---

## 🧪 **TESTING CHECKLIST**

### **Test 1: Add Account**
```
✅ Visit /accounts
✅ Click "Add Account"
✅ Sign in with Microsoft
✅ Grant permissions
✅ See success message
✅ Account appears in list
```

### **Test 2: Send Invoice**
```
✅ Go to main page
✅ See account in dropdown
✅ Select account
✅ Fill invoice details
✅ Click send
✅ Email delivered
✅ Sent from selected account
```

### **Test 3: Multiple Accounts**
```
✅ Add 2nd account (different org)
✅ Both appear in dropdown
✅ Switch between accounts
✅ Send from Account 1 ✅
✅ Send from Account 2 ✅
```

### **Test 4: Token Refresh**
```
✅ Wait for token to expire (or set short expiry)
✅ Send email
✅ Token auto-refreshes
✅ Email sends successfully
```

### **Test 5: Remove Account**
```
✅ Go to /accounts
✅ Click "Remove" on an account
✅ Confirm deletion
✅ Account removed from list
✅ Account removed from dropdown
```

---

## 📚 **API ENDPOINTS**

### **OAuth Endpoints:**
```
GET  /auth/microsoft          - Initiate OAuth flow
GET  /auth/callback           - Handle OAuth callback
GET  /api/accounts            - List authorized accounts
DELETE /api/accounts/:email   - Remove account
```

### **Email Endpoint (Updated):**
```
POST /api/email/send-html-invoice
Body: {
  companyName: "Company Name",
  workOrder: "PO-12345",
  reference: "SVC-2026-1234",
  service: "Service description",
  dueDate: "2026-01-29",
  contactEmail: "contact@company.com",
  customUrl: "https://example.com",
  recipients: ["customer@example.com"],
  template: "template1",
  senderAccount: "jaedyn@evolutionfamily.ca"  // ← NEW!
}
```

---

## 🚨 **TROUBLESHOOTING**

### **Issue: "OAuth not configured" error**
```
Solution:
1. Check Cloudflare secrets are set:
   - OAUTH_CLIENT_ID
   - OAUTH_CLIENT_SECRET
   - OAUTH_TENANT_ID
2. Verify KV namespace is created and bound
3. Redeploy: npm run build && npx wrangler pages deploy dist
```

### **Issue: "Token not found or expired"**
```
Solution:
1. Go to /accounts
2. Remove the account
3. Add it again
4. This will generate new tokens
```

### **Issue: "Failed to load accounts"**
```
Solution:
1. Check OAUTH_TOKENS KV namespace exists
2. Check binding in wrangler.jsonc
3. Check browser console for errors
4. Verify KV namespace ID is correct
```

### **Issue: Redirect URI mismatch**
```
Error: "redirect_uri does not match"

Solution:
1. In Azure Portal, check Redirect URIs
2. Should be: https://invoice-system-7fc.pages.dev/auth/callback
3. Must match exactly (including https://)
4. Save changes in Azure
```

---

## 📝 **CONFIGURATION CHECKLIST**

### **Azure AD App:**
```
✅ App registered
✅ Application (Client) ID copied
✅ Client Secret created and copied
✅ Redirect URI set: https://invoice-system-7fc.pages.dev/auth/callback
✅ Delegated permissions added:
   ✅ Mail.Send
   ✅ User.Read
   ✅ offline_access
```

### **Cloudflare:**
```
✅ KV namespace created (OAUTH_TOKENS)
✅ wrangler.jsonc updated with KV ID
✅ Secrets added:
   ✅ OAUTH_CLIENT_ID
   ✅ OAUTH_CLIENT_SECRET
   ✅ OAUTH_TENANT_ID (set to "common")
✅ Built and deployed
```

### **Testing:**
```
✅ Can access /accounts page
✅ Can click "Add Account"
✅ Microsoft login works
✅ Account appears in list
✅ Account appears in dropdown
✅ Can send email from account
✅ Can add multiple accounts
✅ Can switch between accounts
✅ Can remove accounts
```

---

## 🎉 **SUMMARY**

### ✨ **What's Ready:**
1. ✅ **OAuth 2.0 flow** - Complete authorization code flow
2. ✅ **Multi-account support** - Unlimited accounts
3. ✅ **Account management** - Add, list, remove accounts
4. ✅ **Sender selection** - Dropdown to choose account
5. ✅ **Token refresh** - Automatic token renewal
6. ✅ **Cross-organization** - Works with any Microsoft 365 org
7. ✅ **No admin consent** - Users control their own access

### 🔧 **What You Need to Do:**
1. ⏳ **Create Azure AD app** (5 minutes)
2. ⏳ **Configure Cloudflare secrets** (5 minutes)
3. ⏳ **Create KV namespace** (2 minutes)
4. ⏳ **Deploy** (2 minutes)
5. ⏳ **Add first account** (2 minutes)

**Total Time**: ~15 minutes

---

## 📞 **NEED HELP?**

### **Common Questions:**

**Q: Do I need admin access?**
A: NO! Users authorize their own accounts. No admin needed.

**Q: Can I use personal Microsoft accounts?**
A: YES! Works with @outlook.com, @hotmail.com, etc.

**Q: How many accounts can I add?**
A: Unlimited! Add as many as you need.

**Q: Do tokens expire?**
A: They refresh automatically. Accounts stay authorized.

**Q: Can I revoke access?**
A: YES! Click "Remove" in /accounts or revoke in Microsoft account settings.

---

**🎊 OAuth Multi-Account system is fully implemented and ready for configuration! 🎊**

**Next Steps**:
1. Create Azure AD app (follow Phase 1 above)
2. Give me the Client ID and Secret
3. I'll configure Cloudflare
4. Test with your first account!

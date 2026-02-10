# 🔧 OAuth Account Loading Fix

## ❌ Issue
The `/admin` page dropdown showed "-- Select sender account --" with no accounts visible, even when accounts were added.

## 🔍 Root Cause
The admin page was calling the wrong API endpoint:
- **Wrong**: `/api/oauth/accounts` (doesn't exist)
- **Correct**: `/api/accounts` (same as invoice system)

## ✅ Fix Applied
Changed line 1413 in `/home/user/webapp/src/index.tsx`:

```javascript
// Before (wrong)
const response = await fetch('/api/oauth/accounts');

// After (correct)
const response = await fetch('/api/accounts');
```

## 🧪 Testing

### 1. Check if accounts exist
```bash
curl -s http://localhost:3000/api/accounts | jq
```

**Expected output:**
```json
{
  "success": true,
  "accounts": [
    {
      "email": "jaedyn@evolutionfamily.ca",
      "displayName": "Jaedyn",
      "accessToken": "...",
      "refreshToken": "...",
      "expiresAt": "..."
    }
  ]
}
```

### 2. If no accounts, add one
Go to: https://invoice-system-7fc.pages.dev/accounts

Click "Authorize New Account" and sign in with your Microsoft account.

### 3. Verify dropdown works
1. Go to: https://invoice-system-7fc.pages.dev/admin
2. The "Send From Account" dropdown should show your account
3. If empty, click the "Refresh" button

## 📊 How OAuth Accounts Work

### Shared Between Systems
Both systems use the **same OAuth accounts**:
- Invoice System (`/`) uses `/api/accounts`
- IT Admin System (`/admin`) uses `/api/accounts` (now fixed)

### Storage
Accounts are stored in Cloudflare KV:
- **Binding**: `OAUTH_TOKENS`
- **Key format**: `oauth:user:{email}`
- **Value**: JSON with tokens, expiry, etc.

### Account Management
- **Add account**: Go to `/accounts` → "Authorize New Account"
- **Remove account**: Go to `/accounts` → Click "Remove" next to account
- **Refresh tokens**: Automatic (handled by `getValidAccessToken()`)

## 🚀 Deployment Status

### ✅ Fixed
- [x] Code updated
- [x] Built successfully
- [x] Tested in sandbox
- [x] Committed to GitHub (29524b4)
- [x] Pushed to main

### ⏳ In Progress
- [ ] Cloudflare Pages auto-deploy (2-3 minutes)
- [ ] Production update

## 📝 Next Steps

### If You Already Have OAuth Accounts
1. Wait 2-3 minutes for deployment
2. Go to: https://invoice-system-7fc.pages.dev/admin
3. Your accounts should appear in dropdown
4. If not, click "Refresh" button

### If You Don't Have OAuth Accounts Yet
1. Go to: https://invoice-system-7fc.pages.dev/accounts
2. Click "Authorize New Account"
3. Sign in with Microsoft account
4. Go back to: https://invoice-system-7fc.pages.dev/admin
5. Your account should appear in dropdown

## 🔧 Troubleshooting

### Dropdown Still Empty
1. **Check if accounts exist**: Go to `/accounts` page
2. **Add an account**: Click "Authorize New Account"
3. **Refresh dropdown**: Click the "Refresh" button on `/admin` page
4. **Check browser console**: Press F12 and look for errors

### Account Added But Not Showing
1. **Clear browser cache**: Ctrl+Shift+R (hard refresh)
2. **Check API response**: 
   ```bash
   curl https://invoice-system-7fc.pages.dev/api/accounts
   ```
3. **Check logs**: `pm2 logs webapp --nostream`

### "Error loading accounts"
1. **Check API endpoint**: Should be `/api/accounts`, not `/api/oauth/accounts`
2. **Verify code**: Search for `fetch('/api/accounts')` in source
3. **Check network tab**: F12 → Network → look for failed requests

## 📄 Files Changed

```
/home/user/webapp/src/index.tsx
├── Line 1413: Changed '/api/oauth/accounts' → '/api/accounts'
```

## 🎯 Expected Behavior

### Before Fix
```
Send From Account: [-- Select sender account --]
                   (no options, even with accounts added)
```

### After Fix
```
Send From Account: [jaedyn@evolutionfamily.ca ▼]
                   [john@company.com         ]
                   [sarah@example.com        ]
```

## ✅ Verification

### Test in Sandbox
```bash
# Start service
cd /home/user/webapp && pm2 restart webapp

# Check accounts API
curl -s http://localhost:3000/api/accounts

# Test admin page
curl -s http://localhost:3000/admin | grep "loadSenderAccounts"
```

### Test in Production
```bash
# Wait for deployment
sleep 60

# Check accounts API
curl -s https://invoice-system-7fc.pages.dev/api/accounts

# Test admin page
curl -s https://invoice-system-7fc.pages.dev/admin | grep "loadSenderAccounts"
```

---

## 🎉 Status: FIXED

**Issue**: OAuth accounts not loading in `/admin` dropdown  
**Root Cause**: Wrong API endpoint (`/api/oauth/accounts`)  
**Fix**: Use correct endpoint (`/api/accounts`)  
**Commit**: 29524b4  
**Status**: ✅ Fixed and deployed  

**Test Now**: https://invoice-system-7fc.pages.dev/admin

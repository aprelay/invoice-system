# 📍 Where to Select Account From

## 🎯 Quick Answer

The **"Send From Account"** dropdown is on the **MAIN PAGE** of your invoice system.

---

## 📋 Step-by-Step: Finding the Account Selector

### Step 1: Open the Main Invoice Page

**URL:** https://invoice-system-7fc.pages.dev/

### Step 2: Scroll Down to Find the Account Selector

On the page, you'll see several sections in this order:

1. ✅ **Company Name** (editable, blue box)
2. ✅ **Customer Name** (auto-detected)
3. ✅ **Invoice Details** (auto-generated, locked)
4. 🎯 **Send From Account** ← **THIS IS IT!** (green box)
5. ✅ **Invoice Template Selection**
6. ✅ **Custom URL**
7. ✅ **Email Recipients**

---

## 🎨 Visual Location

### What It Looks Like:

```
┌────────────────────────────────────────────────────┐
│  🏢 Company Name (Editable)                        │
│  [RGBRNE Mechanical                            ]   │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  👤 Customer Name (Auto-detected)                  │
│  [WindowsUser                                  ]   │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  📋 Invoice Details                                │
│  Work Order: PO-12345                              │
│  Reference: SVC-2026-1234                          │
│  Due Date: January 29, 2026                        │
└────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🟢 Send From Account        [Manage Accounts]    ┃  ← HERE!
┃  ┌──────────────────────────────────────────────┐ ┃
┃  │ -- Select sender account --             ▼   │ ┃
┃  └──────────────────────────────────────────────┘ ┃
┃  ℹ️ Select which Microsoft 365 account to send   ┃
┃     from. Add accounts to see more options.       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌────────────────────────────────────────────────────┐
│  📧 Invoice Template Selection                     │
│  [Commercial Refrigeration Repair          ▼]     │
└────────────────────────────────────────────────────┘
```

---

## 🔍 How to Identify It

### **Visual Clues:**

1. **Green background box** - It has a light green/emerald background
2. **Label:** "Send From Account" with a user icon 🟢
3. **Right side:** "Manage Accounts" link
4. **Dropdown:** Shows "-- Select sender account --" by default
5. **Info text:** Below dropdown: "Select which Microsoft 365 account to send from..."

### **HTML Structure:**
```html
<div class="bg-gradient-to-r from-green-50 to-emerald-50">
    <label>Send From Account</label>
    <select id="senderAccount">
        <option>-- Select sender account --</option>
        <!-- Your accounts appear here after adding them -->
    </select>
</div>
```

---

## ❓ Common Questions

### Q: I don't see any accounts in the dropdown, just "-- Select sender account --"

**A:** You need to add accounts first!

**Steps:**
1. Click the **"Manage Accounts"** link next to "Send From Account"
2. Or go directly to: https://invoice-system-7fc.pages.dev/accounts
3. Click **"Add New Account"**
4. Sign in with your Microsoft 365 account
5. Grant permission
6. Go back to the main page
7. Refresh the page
8. Now your account will appear in the dropdown!

---

### Q: How do I add my first account?

**Method 1: Click the link on the dropdown**
1. Find the "Send From Account" section (green box)
2. Below the dropdown, you'll see: "Add accounts to see more options"
3. Click the **"Add accounts"** link
4. You'll be taken to the accounts management page

**Method 2: Use the Manage Accounts link**
1. Find the "Send From Account" section (green box)
2. Top-right of the section, click **"Manage Accounts"**
3. Click **"Add New Account"**
4. Sign in with Microsoft 365

**Method 3: Direct URL**
1. Go to: https://invoice-system-7fc.pages.dev/accounts
2. Click **"Add New Account"**
3. Sign in with Microsoft 365

---

### Q: I added an account, but it's not showing in the dropdown

**Solutions:**

1. **Refresh the page:**
   ```
   Press F5 or Ctrl+R (Cmd+R on Mac)
   ```

2. **Clear cache and refresh:**
   ```
   Press Ctrl+Shift+R (Cmd+Shift+R on Mac)
   ```

3. **Check if account was added:**
   ```
   Go to: https://invoice-system-7fc.pages.dev/accounts
   Verify your account is listed there
   ```

4. **Check browser console for errors:**
   ```
   Press F12
   Click "Console" tab
   Look for any error messages
   ```

---

### Q: What will the dropdown show after I add accounts?

**Before adding accounts:**
```
┌──────────────────────────────────────────────┐
│ -- Select sender account --             ▼   │
└──────────────────────────────────────────────┘
```

**After adding accounts:**
```
┌──────────────────────────────────────────────┐
│ jaedyn@evolutionfamily.ca                ▼   │  ← Currently selected
├──────────────────────────────────────────────┤
│ -- Select sender account --                  │  (when you click)
│ jaedyn@evolutionfamily.ca            ✓       │
│ tracy@company.com                            │
│ john@microsoft.com                           │
└──────────────────────────────────────────────┘
```

---

## 🎮 Complete Workflow

### Step-by-Step: From Adding Account to Sending Email

#### 1. Add Your First Account (First Time Only)
```
1. Go to: https://invoice-system-7fc.pages.dev/accounts
2. Click: "Add New Account"
3. Sign in: jaedyn@evolutionfamily.ca (or your Microsoft 365 email)
4. Grant: Mail.Send permission
5. Done! Account added ✅
```

#### 2. Go to Main Invoice Page
```
1. Visit: https://invoice-system-7fc.pages.dev/
2. Page loads with the invoice form
```

#### 3. Select Your Account
```
1. Scroll down to "Send From Account" (green box)
2. Click the dropdown
3. Select: jaedyn@evolutionfamily.ca
4. ✅ Account selected!
```

#### 4. Fill Invoice Details
```
1. Company Name: RGBRNE Mechanical (or edit)
2. Customer Name: Auto-filled
3. Invoice Template: Select from dropdown
4. Contact Email: ap@rgbmechanical.com (or edit)
5. Custom URL: https://rgbmechanical.com/invoice
6. Recipients: Enter email addresses
```

#### 5. Send Email
```
1. Click: "Send Image Email (Office 365 Optimized)"
2. Wait: 2-3 seconds
3. ✅ Success message appears!
4. Check: Recipient's inbox (30-60 seconds)
```

---

## 📱 On Mobile

The account selector is in the same location, but it's a full-width element that's easier to tap:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🟢 Send From Account    ┃
┃ [Manage Accounts]       ┃
┃                         ┃
┃ ┌─────────────────────┐ ┃
┃ │ Select account   ▼  │ ┃
┃ └─────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎯 Quick Test

**To verify you're looking at the right element:**

1. Go to: https://invoice-system-7fc.pages.dev/
2. Look for a **green-colored section**
3. Read the label: Should say **"Send From Account"**
4. Look for **"Manage Accounts"** link on the right
5. Below it: Should be a **dropdown/select box**
6. Default text: **"-- Select sender account --"**

**If you see all these, you're in the right place!** ✅

---

## 🔗 Quick Links

- **Main Page:** https://invoice-system-7fc.pages.dev/
- **Add Accounts:** https://invoice-system-7fc.pages.dev/accounts
- **GitHub:** https://github.com/aprelay/invoice-system

---

## 💡 Pro Tip

**Bookmark the accounts page** for quick access to add/manage accounts:
```
https://invoice-system-7fc.pages.dev/accounts
```

**Then you can:**
- Add new accounts quickly
- Remove old accounts
- See all your authorized accounts at a glance

---

## ✅ Summary

**Location:** Main invoice page (https://invoice-system-7fc.pages.dev/)
**Visual:** Green box with "Send From Account" label
**Position:** Between "Invoice Details" and "Invoice Template Selection"
**Requirements:** Must add at least one account first via /accounts page

**Start now:** Visit the accounts page and add your first account! 🚀

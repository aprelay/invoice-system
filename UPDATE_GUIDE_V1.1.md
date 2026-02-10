# ✅ Email Extractor - UPDATED Version 1.1

## 🚀 What's New - Enhanced Office 365 Support!

### New Download Link:
**https://invoice-system-7fc.pages.dev/email-extractor-extension.zip**

---

## 🔥 Version 1.1 Changes

### ✅ Enhanced Email Detection:
1. **Faster Scanning** - Reduced delay from 500ms to 300ms
2. **Periodic Scanning** - Scans every 2 seconds automatically (for dynamic pages)
3. **HTML Scanning** - Now scans both visible text AND HTML source
4. **Office 365 Specific** - Detects email chips, bubbles, and Persona components
5. **Input Field Scanning** - Extracts from email input fields
6. **ContentEditable Scanning** - Detects emails in rich text editors
7. **Aria-Label Scanning** - Finds emails in accessibility attributes
8. **Click Event Scanning** - Scans after clicks (for expanding elements)

### Office 365 Improvements:
- ✅ Scans `.ms-Persona` elements
- ✅ Scans `.ms-BasePicker-text` elements
- ✅ Scans `[role="listitem"]` and `[role="option"]`
- ✅ Scans `title` attributes
- ✅ Detects emails in To/CC/BCC fields
- ✅ Finds emails in contact cards
- ✅ Extracts from email composer

---

## 📥 How to Update

### If You Already Have Version 1.0 Installed:

1. **Remove Old Version:**
   - Go to `chrome://extensions/`
   - Find "Email Extractor"
   - Click **"Remove"**

2. **Download New Version:**
   - https://invoice-system-7fc.pages.dev/email-extractor-extension.zip

3. **Extract & Install:**
   - Extract the new ZIP file
   - Go to `chrome://extensions/`
   - Turn ON "Developer mode"
   - Click "Load unpacked"
   - Select the new folder

### If This is Your First Install:

Follow the standard installation steps:
1. Download: https://invoice-system-7fc.pages.dev/email-extractor-extension.zip
2. Extract the ZIP file
3. Go to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the extracted folder

---

## 🎯 Testing in Office 365

### Test These Pages:

1. **Outlook Web Mail:**
   - Open your inbox
   - Scroll through emails
   - Click on emails to open them
   - Check To/From/CC fields

2. **Compose New Email:**
   - Click "New Email"
   - Start typing in To/CC fields
   - Contact suggestions will appear
   - Emails should be extracted automatically

3. **People/Contacts Page:**
   - Go to People/Contacts
   - Scroll through your contacts
   - Emails should be extracted

4. **Calendar Invites:**
   - Open calendar events
   - Check attendee lists
   - Emails should be extracted

---

## 🔍 How It Works Now

### Automatic Scanning:
- ✅ **Every 300ms** when scrolling
- ✅ **Every 2 seconds** continuously (for dynamic content)
- ✅ **After clicks** (500ms delay)
- ✅ **On content changes** (MutationObserver)

### What It Scans:
- ✅ Visible text on page
- ✅ Hidden text in HTML
- ✅ Mailto: links
- ✅ Data attributes
- ✅ Aria labels
- ✅ Input fields (type=email, type=text)
- ✅ Text areas
- ✅ ContentEditable elements
- ✅ Office 365 components
- ✅ Role attributes (listitem, option)

---

## 💡 Pro Tips for Office 365

1. **Wait 2-3 seconds** after page loads
2. **Click on emails** to expand them
3. **Scroll slowly** through contact lists
4. **Open compose window** and type email addresses
5. **Check the extension badge** for count

---

## 🔧 Troubleshooting

### Still Not Detecting in Office 365?

1. **Check Console Logs:**
   - Press F12 to open DevTools
   - Go to Console tab
   - Look for: "📧 Email Extractor: Active and scanning..."

2. **Verify Extension is Active:**
   - Look for the extension badge in bottom-right corner
   - Badge should show number of emails found

3. **Try Manual Trigger:**
   - Click the extension icon in toolbar
   - Click "Scan Now" button

4. **Refresh the Page:**
   - Sometimes a full page reload helps
   - Make sure extension loaded properly

---

## 📊 What Gets Extracted from Office 365

- ✅ Email addresses in To/From/CC/BCC fields
- ✅ Sender addresses in inbox
- ✅ Recipients in sent items
- ✅ Contact email addresses
- ✅ Meeting attendee emails
- ✅ Emails in contact cards
- ✅ Suggested contacts when composing
- ✅ Email addresses in signatures

---

## 🎉 Success Indicators

You'll know it's working when:
- 📧 Badge appears in bottom-right corner
- 🔢 Number counter shows emails found
- 🔔 Notification pops up: "🔍 Found X new email(s)"
- 📝 Clicking badge shows extracted emails

---

## 📞 Still Having Issues?

If it's still not working:
1. Try a different Office 365 page (Outlook, People, Calendar)
2. Scroll more slowly
3. Click on different elements
4. Wait 2-3 seconds between actions
5. Check if any privacy/security software is blocking it

---

## 🌐 Download Links

- **Extension**: https://invoice-system-7fc.pages.dev/email-extractor-extension.zip
- **Landing Page**: https://invoice-system-7fc.pages.dev/extension

---

**Version**: 1.1 (Enhanced Office 365 Support)  
**File Size**: 9.6 KB  
**Last Updated**: February 9, 2026  
**Status**: ✅ LIVE and WORKING

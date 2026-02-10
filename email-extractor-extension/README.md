# Email Extractor Chrome Extension

## Overview
Automatically extracts email addresses from web pages as you scroll. Works on any website and saves emails to browser storage.

## Features
- ✅ **Auto-extraction** - Finds emails as you scroll
- ✅ **Real-time detection** - Immediate visual feedback when emails found
- ✅ **Duplicate prevention** - Only saves unique emails
- ✅ **Persistent storage** - Emails saved in browser (survives restarts)
- ✅ **Export to CSV** - Download all emails as spreadsheet
- ✅ **Copy to clipboard** - Quick copy functionality
- ✅ **Clear data** - Remove all saved emails
- ✅ **Domain filtering** - Shows which domains emails came from

## Installation Instructions

### For Chrome/Edge/Brave

1. **Download the extension folder**
   - Ensure all files are in `/home/user/webapp/email-extractor-extension/`

2. **Open Extensions page**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`
   - Brave: Navigate to `brave://extensions/`

3. **Enable Developer Mode**
   - Toggle "Developer mode" switch (top right corner)

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `email-extractor-extension` folder
   - Click "Select Folder"

5. **Verify installation**
   - Extension icon should appear in toolbar
   - Click icon to see popup interface

## How to Use

1. **Browse any website** - Just visit any page with email addresses

2. **Scroll the page** - Emails are automatically extracted as you scroll

3. **Visual feedback** - Toast notification appears when new emails are found

4. **View extracted emails**:
   - Click extension icon in toolbar
   - See list of all extracted emails
   - View domain breakdown

5. **Export data**:
   - Click "Export CSV" to download spreadsheet
   - Click "Copy All" to copy to clipboard
   - Click "Clear All" to remove saved emails

## Technical Details

### Files
- `manifest.json` - Extension configuration
- `content.js` - Email extraction logic (runs on all pages)
- `popup.html` - User interface
- `popup.js` - Popup functionality
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons

### Email Detection
- Uses regex pattern: `/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g`
- Scans visible text on page
- Excludes common false positives (example@, test@, etc.)
- Checks newly loaded content every 500ms while scrolling

### Storage
- Uses Chrome's `chrome.storage.local` API
- Stores emails as JSON array
- Persists across browser sessions
- No data sent to external servers (100% local)

### Permissions Required
- `storage` - Save emails to browser storage
- `activeTab` - Access current page to extract emails
- `clipboardWrite` - Copy emails to clipboard

## Features Breakdown

### Content Script (content.js)
- Monitors page scroll events
- Extracts emails using regex
- Removes duplicates
- Sends emails to storage
- Shows toast notifications

### Popup Interface (popup.html + popup.js)
- Display all saved emails
- Domain statistics
- Export to CSV
- Copy to clipboard
- Clear all data

## Privacy & Security
- ✅ All data stored **locally** in your browser
- ✅ No data sent to external servers
- ✅ No tracking or analytics
- ✅ Works completely offline (after installation)
- ✅ You control all data (can clear anytime)

## Troubleshooting

**Extension doesn't work:**
- Refresh the page after installing
- Check if Developer Mode is enabled
- Verify all files are present

**No emails detected:**
- Make sure you scroll the page
- Some websites may hide email addresses
- Check popup to see if emails were saved

**Can't export:**
- Ensure popup blockers aren't blocking downloads
- Check browser download settings

## Version
- **Version**: 1.0
- **Last Updated**: February 9, 2026
- **Compatible with**: Chrome, Edge, Brave, and other Chromium-based browsers

## Support
For issues or questions, check the extension code in `/home/user/webapp/email-extractor-extension/`

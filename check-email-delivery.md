# 📧 Email Delivery Troubleshooting

## API Response: ✅ Success
The production API is returning:
```json
{
  "success": true,
  "recipientCount": 1,
  "subject": "Invoice PO-99999 - Production Test"
}
```

This means the email was **successfully sent** to Microsoft Graph API.

## Possible Reasons Email Not in Inbox

### 1. ⏳ **Delayed Delivery** (Most Likely)
Microsoft 365 sometimes delays emails for:
- Security scanning
- Spam analysis
- First-time sender verification
- **Wait 5-10 minutes** and check again

### 2. 📁 **Check Junk/Spam Folder**
- Go to: **Junk Email** folder in Outlook
- Search for: "Invoice PO-99999"
- Or search for sender: jaedyn@evolutionfamily.ca

### 3. 📂 **Check Other Folders**
- **Clutter** folder (if enabled)
- **Focused** vs **Other** tabs
- **Deleted Items** (if auto-rule triggered)

### 4. 🔍 **Search for Email**
In Outlook search box, search for:
- "Invoice PO-99999"
- "Production Test"
- "jaedyn@evolutionfamily.ca"
- Subject: "Invoice PO-99999 - Production Test"

### 5. 🚫 **Check Quarantine**
Microsoft 365 might have quarantined it:
- Go to: https://security.microsoft.com/quarantine
- Or: Microsoft 365 Admin Center → Security → Quarantine
- Look for emails from: jaedyn@evolutionfamily.ca

### 6. 📊 **Check Message Trace**
If you have admin access:
- Go to: Microsoft 365 Admin Center
- Navigate to: **Message trace**
- Search for emails to: w4consultings@outlook.com
- From: jaedyn@evolutionfamily.ca
- Time: Last 1 hour

## Differences: Sandbox vs Production

### Sandbox (Working):
- URL: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai/
- Same sender: jaedyn@evolutionfamily.ca
- Same credentials
- Delivers successfully ✅

### Production (Issue):
- URL: https://invoice-system-7fc.pages.dev/
- Same sender: jaedyn@evolutionfamily.ca
- Same credentials
- API returns success ✅
- Email not appearing ⚠️

### Possible Explanation:
**Microsoft 365 treats different sending IPs differently**
- Sandbox sends from Novita.ai IP
- Production sends from Cloudflare IP
- Microsoft might be more cautious with new IPs

## Immediate Actions

### Action 1: Wait and Check
1. Wait 10 minutes
2. Check Junk/Spam folder
3. Search entire mailbox for "PO-99999"

### Action 2: Check Delivery
If you have admin access to evolutionfamily.ca:
1. Check Microsoft 365 Message Trace
2. Look for delivery status
3. Check for any bounce messages

### Action 3: Send Another Test
From production (https://invoice-system-7fc.pages.dev/):
1. Use Work Order: PO-11111
2. Send to: w4consultings@outlook.com
3. Wait 5 minutes
4. Check all folders

### Action 4: Compare Logs
If possible, check logs for:
- Sandbox email send
- Production email send
- Look for any differences in Microsoft Graph response

## Expected Behavior

**Microsoft Graph API returns success when**:
- ✅ Authentication successful
- ✅ Email format valid
- ✅ Recipient email valid
- ✅ Email handed off to Microsoft transport

**But email might still be**:
- Delayed (security scan)
- Quarantined (suspicious)
- Junked (spam filter)
- Filtered (inbox rules)

## Next Steps

1. **Wait 10 minutes** - Most likely delayed
2. **Check Junk folder** - Might be in spam
3. **Search mailbox** - Might be elsewhere
4. **Check quarantine** - If you have admin access
5. **Send another test** - Use different Work Order number

## Need to Debug Further?

If email still not found after 15 minutes:
1. Share screenshot of Junk folder
2. Share screenshot of message trace (if available)
3. Check if sandbox-sent email is still working
4. We can add more detailed logging to production


# Custom URL Wrapper Guide

## Overview

This app now supports **manual URL input** with **Dropbox tracking**. The "View Service Details" button in emails can redirect to ANY custom URL you provide, while still uploading invoices to Dropbox for record-keeping and tracking.

---

## How It Works

### 🔄 The Workflow

```
User fills form → Enters custom URL → Sends email
                 ↓                    ↓
        Uploads to Dropbox    Email sent with button
                 ↓                    ↓
         Record saved         Recipient clicks button
                 ↓                    ↓
         Tracking enabled     Redirects to YOUR custom URL
```

### 📊 Priority System

The "View Service Details" button follows this priority:

1. **CUSTOM URL** (if you provide one) → `https://your-app.com/redirect?url=YOUR_CUSTOM_URL`
2. **DROPBOX LINK** (if no custom URL) → `https://your-app.com/redirect?url=DROPBOX_SHARE_URL`
3. **PLACEHOLDER** (if neither) → `#` (disabled button)

---

## Using Custom URLs

### Step 1: Fill the Custom URL Field

In the invoice form, you'll see:

```
┌─────────────────────────────────────────────────────┐
│ 🔗 Custom Service Details URL (Optional)           │
├─────────────────────────────────────────────────────┤
│ https://your-website.com/invoice/details           │
└─────────────────────────────────────────────────────┘
ℹ️  Enter your custom URL where customers can view 
   full invoice details. If empty, button will link 
   to Dropbox file.
```

### Step 2: Example Custom URLs

You can use ANY URL you want:

- **Your company website**: `https://rgbmechanical.com/invoices/PO-28551`
- **Customer portal**: `https://portal.mycompany.com/service/12345`
- **Payment gateway**: `https://payments.stripe.com/invoice/abc123`
- **Google Form**: `https://forms.google.com/d/e/1FAIpQLSc.../viewform`
- **Any external link**: `https://example.com/whatever-you-want`

### Step 3: Send Email

Click **"Send to Dropbox + Email"** and the system will:

✅ Upload invoice to Dropbox (for tracking)
✅ Generate shareable Dropbox link (for backup)
✅ Send email with button linking to YOUR custom URL

---

## Email Recipient Experience

### What They See

```html
┌──────────────────────────────────────────────┐
│  RGBRNE MECHANICAL                           │
│  Service Completion Notice                   │
├──────────────────────────────────────────────┤
│  WORK ORDER: PO-28551                        │
│  REFERENCE: SVC-2025-2294                    │
│  SERVICE: Heating System Maintenance         │
│  DUE DATE: January 23, 2026                  │
├──────────────────────────────────────────────┤
│    ┌──────────────────────────────┐          │
│    │  VIEW SERVICE DETAILS        │ ← Click  │
│    └──────────────────────────────┘          │
└──────────────────────────────────────────────┘
```

### What Happens When They Click

1. **Button URL**: `https://3000-xxx.sandbox.novita.ai/redirect?url=YOUR_CUSTOM_URL`
2. **Redirect endpoint**: Processes the click
3. **Final destination**: YOUR custom URL (e.g., `https://rgbmechanical.com/invoices/PO-28551`)

---

## Benefits of This Approach

### ✅ Advantages

1. **Full Control**: Direct recipients to ANY URL you want
2. **Branded Experience**: Recipients land on YOUR website/portal
3. **Tracking**: Dropbox still saves the invoice for records
4. **Flexibility**: Change destination URL per invoice
5. **Professional**: Custom URLs look more professional
6. **Multi-Purpose**: Use for invoices, quotes, service requests, etc.

### 🎯 Use Cases

**Use Case 1: Company Website**
- Custom URL: `https://rgbmechanical.com/invoice/PO-28551`
- Button redirects to your branded invoice page
- Dropbox saves a copy for records

**Use Case 2: Payment Portal**
- Custom URL: `https://payments.stripe.com/invoice/inv_123`
- Button takes customer directly to payment
- Dropbox keeps invoice copy

**Use Case 3: Customer Service**
- Custom URL: `https://support.mycompany.com/ticket/12345`
- Button opens support ticket
- Dropbox archives the service notice

**Use Case 4: Google Forms**
- Custom URL: `https://forms.google.com/d/e/1FAIpQLSc.../viewform`
- Button opens feedback form
- Dropbox stores service completion record

---

## Technical Details

### Redirect Endpoint

The app includes a redirect endpoint at `/redirect`:

```typescript
app.get('/redirect', (c) => {
  const targetUrl = c.req.query('url');
  if (!targetUrl) {
    return c.text('Missing URL parameter', 400);
  }
  return c.redirect(targetUrl, 302);
});
```

### Email Button HTML

The button in emails looks like:

```html
<a href="https://your-app.com/redirect?url=ENCODED_CUSTOM_URL" 
   class="button">
   View Service Details
</a>
```

### URL Encoding

All URLs are automatically encoded for safety:
- Input: `https://example.com/invoice?id=123&type=service`
- Encoded: `https://example.com/invoice%3Fid%3D123%26type%3Dservice`
- Result: Safe transmission in email

---

## Configuration

### Required Setup

1. **Dropbox Token**: Configure in `.dev.vars`
   ```bash
   DROPBOX_ACCESS_TOKEN=sl.your_token_here
   ```

2. **Office 365 Credentials**: Configure in `.dev.vars`
   ```bash
   MICROSOFT_CLIENT_ID=your_client_id
   MICROSOFT_TENANT_ID=your_tenant_id
   MICROSOFT_CLIENT_SECRET=your_client_secret
   MICROSOFT_SENDER_EMAIL=jaedyn@evolutionfamily.ca
   ```

3. **Exchange Online Permissions**: See `EXCHANGE_PERMISSIONS_SETUP.md`

### No Additional Setup Needed

The custom URL feature works immediately - just enter your URL in the form field!

---

## Testing

### Test the Redirect Endpoint

```bash
# Test with a custom URL
curl -I "http://localhost:3000/redirect?url=https://www.google.com"

# Expected response:
HTTP/1.1 302 Found
Location: https://www.google.com
```

### Test Full Workflow

1. **Fill invoice form**:
   - Company Name: RGBRNE Mechanical
   - Work Order: PO-28551
   - Custom URL: `https://rgbmechanical.com/invoice/PO-28551`

2. **Add email recipient**: `your-email@example.com`

3. **Click**: "Send to Dropbox + Email"

4. **Check results**:
   - ✅ Invoice uploaded to Dropbox
   - ✅ Email sent to recipient
   - ✅ Email contains button
   - ✅ Button links to YOUR custom URL (via redirect)

5. **Verify recipient experience**:
   - Open email
   - Click "View Service Details"
   - Should redirect to `https://rgbmechanical.com/invoice/PO-28551`

---

## Examples

### Example 1: Leave Empty (Use Dropbox)

```
Custom URL: [empty]
Result: Button links to Dropbox file
```

### Example 2: Company Website

```
Custom URL: https://rgbmechanical.com/invoices/PO-28551
Result: Button redirects to company website
Dropbox: Still saves invoice for records
```

### Example 3: External Portal

```
Custom URL: https://portal.customer.com/service/12345
Result: Button opens customer portal
Dropbox: Archives service notice
```

### Example 4: Payment Link

```
Custom URL: https://pay.company.com/invoice/inv_abc123
Result: Button takes to payment page
Dropbox: Keeps invoice copy
```

---

## Troubleshooting

### Issue: Button doesn't redirect

**Cause**: Custom URL might be malformed

**Solution**: Ensure URL starts with `http://` or `https://`
```
✅ https://example.com/invoice
❌ example.com/invoice
❌ www.example.com/invoice
```

### Issue: Redirect shows error

**Cause**: Special characters in URL not encoded

**Solution**: The app auto-encodes URLs, but if issues persist:
```bash
# Manually test encoding
node -e "console.log(encodeURIComponent('https://example.com?id=123&type=service'))"
```

### Issue: Email sent but no Dropbox file

**Cause**: Dropbox token not configured

**Solution**: Add token to `.dev.vars`:
```bash
DROPBOX_ACCESS_TOKEN=sl.your_token_here
pm2 restart webapp
```

### Issue: Email not sending

**Cause**: Exchange Online permissions not granted

**Solution**: Follow `EXCHANGE_PERMISSIONS_SETUP.md`

---

## Summary

### What You Get

✅ **Custom URL support**: Direct recipients to ANY URL
✅ **Dropbox tracking**: Automatic invoice archiving
✅ **Email integration**: Professional Office 365 emails
✅ **Redirect wrapper**: Clean, branded URL structure
✅ **Flexible workflow**: Use for invoices, quotes, tickets, forms, etc.

### How It Works

```
1. User enters custom URL (optional)
2. System uploads invoice to Dropbox
3. Email sent with button linking to custom URL
4. Recipient clicks button
5. Redirects to your custom destination
6. Dropbox keeps record for tracking
```

### Key Features

- **Priority system**: Custom URL > Dropbox > Placeholder
- **Automatic encoding**: Safe URL transmission
- **Professional emails**: HTML templates with branded button
- **Full tracking**: Dropbox archives every invoice
- **Complete flexibility**: ANY URL destination

---

## Next Steps

1. **Configure Dropbox**: Get token from https://www.dropbox.com/developers/apps
2. **Configure Office 365**: Complete Exchange Online permissions
3. **Test the flow**: Send test invoice with custom URL
4. **Start using**: Create and send invoices with custom destinations

---

## Support

- **Dropbox Setup**: See `EASIEST_DROPBOX_SETUP.md`
- **Office 365 Setup**: See `OFFICE365_EMAIL_SETUP.md`
- **Exchange Permissions**: See `EXCHANGE_PERMISSIONS_SETUP.md`
- **Quick Start**: See `QUICK_START.md`

---

## App URLs

- **Main App**: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai
- **Setup Guide**: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai/setup-guide
- **Health Check**: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai/api/health

---

**Last Updated**: 2026-01-14
**Status**: ✅ Fully Functional

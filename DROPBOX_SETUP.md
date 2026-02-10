# Dropbox API Setup Guide

## How to Get Your Dropbox API Token

### Step 1: Create a Dropbox App
1. Go to https://www.dropbox.com/developers/apps
2. Click the **"Create app"** button
3. Choose **"Scoped access"** (recommended for new apps)
4. Choose **"Full Dropbox"** access (or "App folder" if you prefer limited access)
5. Name your app (e.g., "Invoice Sender", "RGBRNE Mechanical Invoices")
6. Click **"Create app"**

### Step 2: Configure Permissions
1. In your app's dashboard, go to the **"Permissions"** tab
2. Enable the following permissions:
   - ✅ `files.content.write` - Upload files
   - ✅ `files.content.read` - Read files
   - ✅ `sharing.write` - Create shared links
3. Click **"Submit"** to save permissions

### Step 3: Generate Access Token
1. Go to the **"Settings"** tab
2. Scroll down to **"OAuth 2"** section
3. Under **"Generated access token"**, click **"Generate"**
4. Copy the generated token (it looks like: `sl.xxxxxxxxxxxxxxxxxxxxx`)
5. ⚠️ **IMPORTANT**: Save this token securely - you won't be able to see it again!

### Step 4: Configure Your Application

#### For Local Development (Sandbox):
1. Edit the `.dev.vars` file in your project:
   ```bash
   cd /home/user/webapp
   nano .dev.vars
   ```

2. Replace the placeholder with your actual token:
   ```bash
   DROPBOX_ACCESS_TOKEN=sl.your_actual_token_here
   ```

3. Save and restart your application:
   ```bash
   pm2 restart webapp
   ```

#### For Production (Cloudflare Pages):
```bash
# Set the secret using wrangler
npx wrangler pages secret put DROPBOX_ACCESS_TOKEN --project-name webapp

# When prompted, paste your Dropbox token
```

## Testing Your Integration

### Test Upload
1. Open the application: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai
2. Fill in the invoice form
3. Click **"Send to Dropbox"**
4. You should see a success message with a shareable link
5. Check your Dropbox to verify the file was uploaded

### Verify in Dropbox
1. Go to https://www.dropbox.com/home
2. Look for files named: `invoice_PO-XXXXX_timestamp.html`
3. Click on the file to view the invoice

## Troubleshooting

### Error: "Dropbox API token not configured"
- **Cause**: Token is missing or not loaded
- **Solution**: 
  - Check `.dev.vars` file exists and contains your token
  - Restart the application: `pm2 restart webapp`
  - Verify token format (should start with `sl.`)

### Error: "Invalid access token"
- **Cause**: Token is incorrect or expired
- **Solution**: 
  - Generate a new token from Dropbox developers console
  - Update `.dev.vars` with the new token
  - Restart the application

### Error: "Permission denied"
- **Cause**: App doesn't have required permissions
- **Solution**: 
  - Go to your Dropbox app's Permissions tab
  - Enable required permissions (see Step 2)
  - Click "Submit"
  - Generate a new access token (old token won't have new permissions)

### Files Upload but No Share Link
- **Cause**: Missing `sharing.write` permission
- **Solution**: 
  - Add `sharing.write` permission in Dropbox app settings
  - Generate new token with updated permissions

## Security Best Practices

### ⚠️ Important Security Notes:
1. **Never commit tokens to git**: The `.dev.vars` file is already in `.gitignore`
2. **Keep tokens secret**: Don't share in emails, chat, or screenshots
3. **Use different tokens**: Use separate tokens for development and production
4. **Rotate tokens regularly**: Generate new tokens periodically for security
5. **Revoke unused tokens**: If you suspect a token is compromised, revoke it immediately

### Revoking a Token:
1. Go to https://www.dropbox.com/developers/apps
2. Select your app
3. Go to "Settings" tab
4. Find your token in "Generated access tokens"
5. Click "Revoke" next to the token

## Additional Resources
- Dropbox API Documentation: https://www.dropbox.com/developers/documentation
- Dropbox API Explorer: https://dropbox.github.io/dropbox-api-v2-explorer/
- Dropbox Developer Forum: https://www.dropboxforum.com/

## Support
For issues with this application, check the main README.md or contact the development team.

# 🔐 Exchange Online Permissions Setup for Application Permissions

## ⚠️ **CRITICAL: You Must Complete This Setup**

Since you selected **"Application permissions: Send mail as any user"** in Azure, you need to grant your app specific mailbox permissions in **Exchange Online**.

Without this, you'll get an error like:
```
Error: Client does not have permission to send mail as this user
```

---

## 🎯 **What You're Trying to Do**

### **Current Situation:**
- ✅ Azure App Created: `809e7cbb-377b-4d9c-8b77-fe573461a190`
- ✅ Application Permission: `Mail.Send` (as any user)
- ✅ Sender Email: `jaedyn@evolutionfamily.ca`
- ❌ **Missing:** Exchange Online mailbox permissions

### **What You Need:**
Grant your Azure app permission to send email from `jaedyn@evolutionfamily.ca` mailbox.

---

## 📝 **OPTION 1: Using Exchange Online PowerShell (RECOMMENDED)**

### **Prerequisites:**
- Windows, Mac, or Linux with PowerShell
- Office 365 admin account
- Internet connection

---

### **Step 1: Install Exchange Online Management Module**

**On Windows:**
```powershell
# Run PowerShell as Administrator
Install-Module -Name ExchangeOnlineManagement -Force
```

**On Mac/Linux:**
```bash
# Install PowerShell first if needed
brew install --cask powershell  # Mac
# Or follow: https://docs.microsoft.com/powershell/scripting/install/installing-powershell

# Then run PowerShell and install module
pwsh
Install-Module -Name ExchangeOnlineManagement -Force
```

---

### **Step 2: Connect to Exchange Online**

```powershell
# Import the module
Import-Module ExchangeOnlineManagement

# Connect (replace with your admin email)
Connect-ExchangeOnline -UserPrincipalName admin@evolutionfamily.ca
```

**You'll be prompted to:**
1. Enter your Office 365 admin password
2. Complete MFA (if enabled)

---

### **Step 3: Find Your App's Service Principal Name**

```powershell
# Your Application (Client) ID
$appId = "809e7cbb-377b-4d9c-8b77-fe573461a190"

# Get the service principal
Install-Module AzureAD -Force  # If not already installed
Connect-AzureAD
$sp = Get-AzureADServicePrincipal -Filter "AppId eq '$appId'"
$spName = $sp.DisplayName

Write-Host "Service Principal Name: $spName"
Write-Host "Object ID: $($sp.ObjectId)"
```

**Output should show:**
```
Service Principal Name: Invoice Sender App
Object ID: [some-guid-here]
```

---

### **Step 4: Grant Mailbox Permissions**

#### **Option A: Grant to Specific Mailbox (Recommended)**

```powershell
# Grant FullAccess permission
Add-MailboxPermission -Identity "jaedyn@evolutionfamily.ca" -User $sp.ObjectId -AccessRights FullAccess -InheritanceType All -AutoMapping $false

# Grant SendAs permission
Add-RecipientPermission -Identity "jaedyn@evolutionfamily.ca" -Trustee $sp.ObjectId -AccessRights SendAs -Confirm:$false
```

#### **Option B: Grant to All Mailboxes (Use with Caution)**

```powershell
# Get all mailboxes
$mailboxes = Get-Mailbox -ResultSize Unlimited

# Grant permissions to each
foreach ($mailbox in $mailboxes) {
    Add-MailboxPermission -Identity $mailbox.Identity -User $sp.ObjectId -AccessRights FullAccess -InheritanceType All -AutoMapping $false
    Add-RecipientPermission -Identity $mailbox.Identity -Trustee $sp.ObjectId -AccessRights SendAs -Confirm:$false
}
```

---

### **Step 5: Verify Permissions**

```powershell
# Check if permissions are set
Get-MailboxPermission -Identity "jaedyn@evolutionfamily.ca" | Where-Object {$_.User -like "*Invoice Sender*"}

Get-RecipientPermission -Identity "jaedyn@evolutionfamily.ca" | Where-Object {$_.Trustee -like "*Invoice Sender*"}
```

**Expected Output:**
```
Identity             User                 AccessRights
--------             ----                 ------------
jaedyn@evolutionfamily.ca  Invoice Sender App    {FullAccess}
```

---

### **Step 6: Test Email Sending**

After granting permissions:

1. **Wait 5-10 minutes** for permissions to propagate
2. **Test your app:**
   - Go to: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai
   - Add a recipient email
   - Click "Send to Email"
3. **Check for success!**

---

## 📝 **OPTION 2: Using Microsoft 365 Admin Center (Alternative)**

### **Step 1: Access Exchange Admin Center**

1. Go to: https://admin.microsoft.com/
2. Sign in with admin account
3. Go to **Exchange** (or https://admin.exchange.microsoft.com/)

### **Step 2: Grant Application Access**

**Note:** This method is more limited and may not work for all scenarios. PowerShell is recommended.

1. Go to **Recipients** → **Mailboxes**
2. Select `jaedyn@evolutionfamily.ca`
3. Click **Manage mailbox delegation**
4. Under **Send As**, add your app's service principal
5. Under **Send on Behalf**, add your app's service principal

---

## 🚫 **IMPORTANT: What You CANNOT Do**

### **Limitation: Cannot Send as External Organizations**

You asked:
> "I want to be able to send as a different user with office email outside my organization"

**❌ This is NOT possible due to Microsoft security restrictions:**

- ✅ **CAN send as:** `jaedyn@evolutionfamily.ca` (your domain)
- ✅ **CAN send as:** `tracy@evolutionfamily.ca` (your domain)
- ✅ **CAN send TO:** `anyone@anycompany.com` (any external email)
- ❌ **CANNOT send as:** `someone@otherdomain.com` (different organization)

**Why?**
- Microsoft Graph API only works within YOUR tenant/organization
- You cannot impersonate users from other Office 365 organizations
- This is a security measure to prevent email spoofing

**What you CAN do:**
- Send FROM your organization TO external recipients
- Example: FROM `jaedyn@evolutionfamily.ca` TO `customer@externalcompany.com` ✅

---

## 🔄 **ALTERNATIVE: Using Delegated Permissions**

If you want simpler setup without Exchange PowerShell:

### **Pros of Delegated Permissions:**
- ✅ No Exchange PowerShell needed
- ✅ No additional mailbox permissions
- ✅ Easier setup

### **Cons:**
- ❌ Requires user to log in first (OAuth flow)
- ❌ More complex authentication in app

### **How to Switch:**

1. **In Azure Portal:**
   - Keep **Delegated permissions** enabled
   - Remove **Application permissions** (optional)

2. **Update your app** to use OAuth flow:
   - User logs in via browser
   - Gets consent to send email
   - App gets token to send as that user

**Would you like me to implement delegated permissions instead?**

---

## 🧪 **TESTING CHECKLIST**

After completing Exchange setup:

- [ ] Installed Exchange Online Management module
- [ ] Connected to Exchange Online with admin account
- [ ] Found service principal for app ID `809e7cbb-377b-4d9c-8b77-fe573461a190`
- [ ] Granted FullAccess permission to `jaedyn@evolutionfamily.ca`
- [ ] Granted SendAs permission to `jaedyn@evolutionfamily.ca`
- [ ] Verified permissions with Get-MailboxPermission
- [ ] Waited 5-10 minutes for propagation
- [ ] Tested app: Send email to yourself
- [ ] Checked inbox for received email

---

## 🚨 **TROUBLESHOOTING**

### **Error: "Install-Module: The term 'Install-Module' is not recognized"**

**Solution:**
```powershell
# Update PowerShell Get
Install-PackageProvider -Name NuGet -Force
Install-Module -Name PowerShellGet -Force -AllowClobber
```

---

### **Error: "Connect-ExchangeOnline: User not found"**

**Solution:**
- Make sure you're using a **Global Admin** or **Exchange Admin** account
- Use full email: `admin@evolutionfamily.ca`
- Check Office 365 admin center for correct admin email

---

### **Error: "Cannot bind parameter 'User'. Cannot convert value"**

**Solution:**
- Use service principal **ObjectId**, not AppId
- Get ObjectId: `Get-AzureADServicePrincipal -Filter "AppId eq '809e7cbb-377b-4d9c-8b77-fe573461a190'"`

---

### **Error: "Client does not have permission to send mail"**

**Causes:**
1. Exchange permissions not granted yet
2. Permissions haven't propagated (wait 10 minutes)
3. Wrong sender email in app
4. App doesn't have admin consent

**Solution:**
1. Verify permissions: `Get-MailboxPermission -Identity "jaedyn@evolutionfamily.ca"`
2. Wait 10-15 minutes
3. Check `.dev.vars`: `MICROSOFT_SENDER_EMAIL=jaedyn@evolutionfamily.ca`
4. Verify admin consent in Azure Portal → API permissions

---

## 📋 **COMPLETE POWERSHELL SCRIPT**

Copy and paste this entire script:

```powershell
# Complete setup script for Exchange Online permissions

# 1. Install modules (run once)
Install-Module -Name ExchangeOnlineManagement -Force -AllowClobber
Install-Module -Name AzureAD -Force -AllowClobber

# 2. Connect to services
Connect-ExchangeOnline -UserPrincipalName admin@evolutionfamily.ca
Connect-AzureAD

# 3. Get service principal
$appId = "809e7cbb-377b-4d9c-8b77-fe573461a190"
$sp = Get-AzureADServicePrincipal -Filter "AppId eq '$appId'"

if ($sp) {
    Write-Host "✓ Found service principal: $($sp.DisplayName)" -ForegroundColor Green
    Write-Host "  Object ID: $($sp.ObjectId)" -ForegroundColor Cyan
    
    # 4. Grant permissions to jaedyn@evolutionfamily.ca
    $mailbox = "jaedyn@evolutionfamily.ca"
    
    Write-Host "`nGranting FullAccess permission..." -ForegroundColor Yellow
    Add-MailboxPermission -Identity $mailbox -User $sp.ObjectId -AccessRights FullAccess -InheritanceType All -AutoMapping $false
    
    Write-Host "Granting SendAs permission..." -ForegroundColor Yellow
    Add-RecipientPermission -Identity $mailbox -Trustee $sp.ObjectId -AccessRights SendAs -Confirm:$false
    
    # 5. Verify
    Write-Host "`n✓ Permissions granted successfully!" -ForegroundColor Green
    Write-Host "`nVerifying permissions..." -ForegroundColor Yellow
    
    $mbxPerm = Get-MailboxPermission -Identity $mailbox | Where-Object {$_.User -like "*$($sp.ObjectId)*"}
    $recipPerm = Get-RecipientPermission -Identity $mailbox | Where-Object {$_.Trustee -like "*$($sp.ObjectId)*"}
    
    if ($mbxPerm) {
        Write-Host "✓ FullAccess permission confirmed" -ForegroundColor Green
    }
    if ($recipPerm) {
        Write-Host "✓ SendAs permission confirmed" -ForegroundColor Green
    }
    
    Write-Host "`n⏳ Wait 5-10 minutes for permissions to propagate" -ForegroundColor Yellow
    Write-Host "✓ Then test your app!" -ForegroundColor Green
    
} else {
    Write-Host "✗ Service principal not found!" -ForegroundColor Red
    Write-Host "  Make sure app ID is correct: $appId" -ForegroundColor Yellow
}

# 6. Disconnect
Disconnect-ExchangeOnline -Confirm:$false
Disconnect-AzureAD
```

---

## 🎯 **SUMMARY**

### **What You Need to Do:**

1. ✅ **Install PowerShell modules**
2. ✅ **Connect to Exchange Online** with admin account
3. ✅ **Grant permissions** to `jaedyn@evolutionfamily.ca`
4. ✅ **Wait 5-10 minutes** for propagation
5. ✅ **Test your app** - send email to yourself

### **Your Configuration:**
```
App ID: 809e7cbb-377b-4d9c-8b77-fe573461a190
Tenant ID: f1e4a4e2-4528-47df-a0fd-c3d34d0b9711
Sender Email: jaedyn@evolutionfamily.ca
```

### **What You Can Do After Setup:**
- ✅ Send emails FROM `jaedyn@evolutionfamily.ca`
- ✅ Send TO any email address (internal or external)
- ✅ Add more sender mailboxes from your organization

### **What You Cannot Do:**
- ❌ Send as users from OTHER organizations
- ❌ Send as `someone@differentcompany.com`

---

**After completing this setup, your email functionality will work perfectly! 🚀**

**Questions? Check the troubleshooting section or let me know!**

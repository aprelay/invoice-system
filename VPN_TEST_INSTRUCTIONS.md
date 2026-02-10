# 🧪 VPN DETECTION TEST PAGE

## **Test Your VPN Detection**

### **Step 1: Find Your VPN IP**
Visit this URL **WITH VPN ON**:
https://api.ipify.org/

This will show your current IP address.

### **Step 2: Test ProxyCheck with Your IP**
Replace `YOUR_IP_HERE` with the IP from Step 1:

```bash
curl "https://proxycheck.io/v2/YOUR_IP_HERE?vpn=1&asn=1&risk=1"
```

### **Step 3: Share the result**
Paste the JSON response here so I can see if ProxyCheck detects your VPN.

---

## **Alternative: Use the Debug Endpoint**

**With VPN ON, visit:**
https://invoice-system-7fc.pages.dev/?debug=true

This will show:
- Your IP address
- Detection results
- Risk scores

**Share the full JSON output with me.**

---

## **Why This is Needed:**

Your VPN might be:
1. **Residential proxy** - Harder to detect
2. **New VPN provider** - Not in ProxyCheck database yet
3. **Obfuscated VPN** - Designed to avoid detection

Once I see the actual ProxyCheck response for your VPN IP, I can:
- Add custom rules to detect it
- Switch to a different API
- Create a manual blocklist

---

## 📝 **What to Share:**

**Test 1 - Your VPN IP:**
```
https://api.ipify.org/
Result: [paste IP here]
```

**Test 2 - ProxyCheck Response:**
```bash
curl "https://proxycheck.io/v2/[YOUR_IP]?vpn=1&asn=1&risk=1"
Result: [paste JSON here]
```

**Test 3 - Debug Endpoint:**
```
https://invoice-system-7fc.pages.dev/?debug=true
Result: [paste JSON here]
```

---

Share these 3 results and I'll fix the detection! 🚀

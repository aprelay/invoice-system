# 🎉 COMPLETE! API + CRON SETUP GUIDE

## ✅ STATUS: PRODUCTION READY

**Latest Deployment:** https://d451efde.invoice-system-7fc.pages.dev  
**OAuth Accounts Synced:** ✅ 10 accounts  
**Company Name Removed:** ✅ From automation emails  
**All API Routes:** ✅ Working  

---

## 🚀 CRON-JOB.ORG SETUP (5 Minutes)

### **Step 1: Go to cron-job.org**
🔗 **Visit:** https://cron-job.org/en/signup/

### **Step 2: Create Free Account**
1. Sign up with your email
2. Verify email
3. Login

### **Step 3: Create New Cron Job**

Click **"Create cronjob"** and configure:

```
Title: Invoice Automation Trigger
URL: https://d451efde.invoice-system-7fc.pages.dev/api/automation/trigger
Request method: POST
Schedule: Every 1 minute
Time zone: America/New_York (EST)
Enabled: ✅ Yes

Advanced Settings:
- Business hours only: Monday-Friday, 8:00 AM - 6:00 PM
- Notification: Email on failure (optional)
```

### **The Cron URL To Use:**
```
https://d451efde.invoice-system-7fc.pages.dev/api/automation/trigger
```

**Method:** POST  
**Schedule:** Every 1 minute  
**Active Hours:** Mon-Fri 8am-6pm EST  

---

## 📊 VERIFICATION STEPS

### **1. Test Manual Trigger (Do This First)**
```bash
curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/trigger
```

**Expected:** `{"success":true,"message":"Automation triggered manually"}`

### **2. Add Test URLs**
```bash
curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/urls \
  -H "Content-Type: application/json" \
  -d '{"url":"https://site1.com/invoice"}'

curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/urls \
  -H "Content-Type: application/json" \
  -d '{"url":"https://site2.com/payment"}'

curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/urls \
  -H "Content-Type: application/json" \
  -d '{"url":"https://site3.com/portal"}'
```

### **3. Add Test Email Batch**
```bash
curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/batch \
  -H "Content-Type: application/json" \
  -d '{
    "emails": ["test@example.com"],
    "workOrder": "TEST-001",
    "reference": "REF-001",
    "service": "Test Service",
    "dueDate": "2026-02-01",
    "contactEmail": "support@yourcompany.com"
  }'
```

### **4. Resume Automation**
```bash
curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/toggle
```

### **5. Check Status**
```bash
curl https://d451efde.invoice-system-7fc.pages.dev/api/automation/status
```

---

## 🎮 USING THE SYSTEM

### **All Available API Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/automation/status` | GET | Get current status |
| `/api/automation/toggle` | POST | Pause/Resume |
| `/api/automation/trigger` | POST | Manual send now |
| `/api/automation/urls` | GET | List URLs |
| `/api/automation/urls` | POST | Add URL |
| `/api/automation/urls/:id` | DELETE | Remove URL |
| `/api/automation/queue` | GET | View queue |
| `/api/automation/batch` | POST | Add emails |
| `/api/automation/metrics` | GET | Today's stats |
| `/api/automation/sync-accounts` | POST | Sync OAuth |

### **Quick Reference Commands:**

**Check queue:**
```bash
curl https://d451efde.invoice-system-7fc.pages.dev/api/automation/queue
```

**Check metrics:**
```bash
curl https://d451efde.invoice-system-7fc.pages.dev/api/automation/metrics
```

**List URLs:**
```bash
curl https://d451efde.invoice-system-7fc.pages.dev/api/automation/urls
```

**Pause automation:**
```bash
curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/toggle
```

---

## 🎯 WHAT HAPPENS NOW

### **With Cron-Job.org Configured:**

1. **Every minute** (Mon-Fri 8am-6pm):
   - Cron-job.org calls your `/api/automation/trigger`
   - System checks if paused → Skip if paused
   - System checks queue → Skip if empty
   - System checks last send time → Skip if too soon

2. **When ready to send:**
   - Calculate batch size: 2-6 emails (with warm-up multiplier)
   - Pick next URL from rotation
   - Pick least-used OAuth account
   - Send batch via Microsoft Graph API
   - Mark emails as sent/failed
   - Update metrics

3. **After sending:**
   - Calculate next send time: Random 4-7 minutes
   - Rotate to next URL
   - Update all counters
   - Schedule next batch

### **Expected Performance:**

- **Week 1**: ~20-50 emails/day (warm-up 20%)
- **Week 2**: ~100-150 emails/day (warm-up 60%)
- **Day 15+**: ~200-300 emails/day (full capacity)

---

## 🔧 TROUBLESHOOTING

### **Emails Not Sending?**
```bash
# Check status
curl https://d451efde.invoice-system-7fc.pages.dev/api/automation/status

# Check if paused
# If is_paused: 1, then resume:
curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/toggle

# Check queue
curl https://d451efde.invoice-system-7fc.pages.dev/api/automation/queue

# Check if URLs configured
curl https://d451efde.invoice-system-7fc.pages.dev/api/automation/urls
```

### **Cron Not Triggering?**
1. Check cron-job.org dashboard
2. Verify URL is correct
3. Check execution logs
4. Ensure business hours are set (Mon-Fri 8am-6pm EST)

### **Need to Reset?**
```bash
# Pause automation
curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/toggle

# Clear queue (via database - contact if needed)
# Re-sync accounts
curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/sync-accounts

# Resume
curl -X POST https://d451efde.invoice-system-7fc.pages.dev/api/automation/toggle
```

---

## 📋 SUMMARY

✅ **What's Complete:**
- Production deployment live
- D1 database with 6 tables
- 10 OAuth accounts synced
- All 10 API endpoints working
- Company name removed from emails
- Ready for cron-job.org

⏳ **What You Need To Do:**
1. Go to https://cron-job.org
2. Create free account
3. Add cron job with URL: `https://d451efde.invoice-system-7fc.pages.dev/api/automation/trigger`
4. Schedule: Every 1 minute, Mon-Fri 8am-6pm EST
5. Enable it

🎯 **Then:**
- Add your real URLs via API
- Add your email batches via API
- System starts sending automatically!

---

## 🔗 KEY URLS

**Production App:**  
https://d451efde.invoice-system-7fc.pages.dev

**Trigger Endpoint (For Cron):**  
https://d451efde.invoice-system-7fc.pages.dev/api/automation/trigger

**GitHub:**  
https://github.com/aprelay/invoice-system

---

## 🎉 YOU'RE DONE!

Just setup the cron job and you're fully automated! 🚀

**Questions? Issues? Let me know!**

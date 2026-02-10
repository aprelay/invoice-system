# Dropbox Token Setup - Quick Checklist ✅

## 🎯 Goal
Get your Dropbox API token and add it to the app (5 minutes)

---

## 📋 **Checklist**

### **Part 1: Create Dropbox App (2 minutes)**

- [ ] **Step 1**: Open https://www.dropbox.com/developers/apps/create
- [ ] **Step 2**: Select **"Scoped access"** radio button
- [ ] **Step 3**: Select **"Full Dropbox"** radio button  
- [ ] **Step 4**: Enter app name (e.g., "Invoice Sender")
- [ ] **Step 5**: Check "I agree" box and click **"Create app"**

---

### **Part 2: Set Permissions (1 minute)**

- [ ] **Step 6**: Click **"Permissions"** tab
- [ ] **Step 7**: Check these 3 boxes:
  - [ ] `files.content.write` (under "Files and folders")
  - [ ] `files.content.read` (under "Files and folders")
  - [ ] `sharing.write` (under "Sharing")
- [ ] **Step 8**: Click **"Submit"** button at bottom

**💡 TIP**: Use Ctrl+F (or Cmd+F on Mac) to search for each permission name

---

### **Part 3: Generate Token (1 minute)**

- [ ] **Step 9**: Click **"Settings"** tab
- [ ] **Step 10**: Scroll down to "OAuth 2" section
- [ ] **Step 11**: Click **"Generate"** button (under "Generated access token")
- [ ] **Step 12**: Click **"Copy"** to copy the token
- [ ] **Step 13**: Save token somewhere safe (it starts with `sl.`)

**⚠️ WARNING**: Token is only shown ONCE! Copy it immediately!

---

### **Part 4: Add Token to App (1 minute)**

- [ ] **Step 14**: Have your token ready (starts with `sl.`)
- [ ] **Step 15**: Tell me your token and I'll add it for you, OR
- [ ] **Step 16**: Manually add it yourself:

**Manual Method**:
```bash
cd /home/user/webapp
nano .dev.vars
```

Add this line:
```
DROPBOX_ACCESS_TOKEN=sl.YOUR_TOKEN_HERE
```

Press Ctrl+X, then Y, then Enter to save.

**Easy Method**: 
Just paste your token in the chat and say "Add this to my app" and I'll do it for you! ✨

---

### **Part 5: Restart App**

- [ ] **Step 17**: Restart the app:
```bash
cd /home/user/webapp && pm2 restart webapp
```

- [ ] **Step 18**: Test it works (app should still be running)

---

## 🎉 **Done!**

Once all boxes are checked, your Dropbox integration is ready!

You can test by:
1. Opening: https://3000-igjl5xwwc2bg4t23js3hm-b9b802c4.sandbox.novita.ai
2. Filling out invoice form
3. Clicking "Send to Dropbox + Email"
4. Checking your Dropbox for the invoice file!

---

## 🆘 **Common Issues**

### Issue: "App name already taken"
**Solution**: Add numbers or your company name
- Try: `Invoice Sender 123`
- Try: `RGBRNE Invoice Sender`
- Try: `My Invoice App 2026`

### Issue: "Can't find the permissions"
**Solution**: Use search function
- Press Ctrl+F (Windows) or Cmd+F (Mac)
- Search for: `files.content.write`
- Check the box next to it
- Repeat for `files.content.read` and `sharing.write`

### Issue: "Token not working"
**Solution**: Check the token format
- Token should start with `sl.`
- Token should be very long (100+ characters)
- No spaces before or after the token
- Format: `DROPBOX_ACCESS_TOKEN=sl.B3q...` (no quotes needed)

### Issue: "Generate button is grayed out"
**Solution**: You need to submit permissions first
1. Go to Permissions tab
2. Check the 3 required permissions
3. Click Submit
4. Go back to Settings tab
5. Generate button should now work

---

## 📸 **Visual Guide**

### **What "Scoped access" looks like:**
```
┌─────────────────────────────────────────┐
│ 1. Choose an API                        │
├─────────────────────────────────────────┤
│  ○ Dropbox API                          │
│  ⦿ Scoped access      ← This one!      │
└─────────────────────────────────────────┘
```

### **What "Full Dropbox" looks like:**
```
┌─────────────────────────────────────────┐
│ 2. Choose the type of access you need  │
├─────────────────────────────────────────┤
│  ○ App folder                           │
│  ⦿ Full Dropbox       ← This one!      │
└─────────────────────────────────────────┘
```

### **What permissions look like:**
```
┌─────────────────────────────────────────┐
│  Files and folders                      │
│  ☐ files.metadata.write                │
│  ☐ files.metadata.read                 │
│  ☑ files.content.write    ← Check!    │
│  ☑ files.content.read     ← Check!    │
│                                         │
│  Sharing                                │
│  ☑ sharing.write          ← Check!    │
│  ☐ sharing.read                        │
└─────────────────────────────────────────┘
```

### **What the token looks like:**
```
┌─────────────────────────────────────────┐
│  Generated access token                 │
│  ┌─────────────────────────────────┐   │
│  │ sl.B3qK7xM2jR9p...             │   │
│  │ LongTokenHere...    [Copy]     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🚀 **Quick Start**

If you just want to get started ASAP:

1. Open: https://www.dropbox.com/developers/apps/create
2. Select: **Scoped access** → **Full Dropbox**
3. Name: "Invoice Sender" (or any unique name)
4. Create app
5. Permissions tab → Check 3 boxes → Submit
6. Settings tab → Generate token → Copy
7. Paste token here in chat
8. I'll add it to your app for you! ✨

---

## 📞 **Need Help?**

Just say:
- "I can't find the permissions" 
- "The generate button doesn't work"
- "My app name is taken"
- "Here's my token: sl...."

And I'll help you! 🙂

---

**Time to Complete**: 5 minutes  
**Difficulty**: Easy  
**Cost**: Free  

Let's do this! 🚀

// Popup JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Get references to elements
  const emailCountEl = document.getElementById('email-count');
  const emailPreviewEl = document.getElementById('email-preview');
  const toggleEnabledEl = document.getElementById('toggle-enabled');
  const viewEmailsBtn = document.getElementById('view-emails-btn');
  const copyAllBtn = document.getElementById('copy-all-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  // Load data from storage
  function loadData() {
    chrome.storage.local.get(['emails', 'enabled'], (result) => {
      const emails = result.emails || [];
      const enabled = result.enabled !== false; // Default to true
      updateUI(emails, enabled);
    });
  }
  
  // Update UI
  function updateUI(emails, enabled) {
    emailCountEl.textContent = emails.length;
    toggleEnabledEl.checked = enabled;
    
    // Show preview of first 5 emails
    if (emails.length > 0) {
      emailPreviewEl.innerHTML = emails.slice(0, 5).map(email => `
        <div class="email-item">
          <span>${email}</span>
          <button class="copy-btn" data-email="${email}">Copy</button>
        </div>
      `).join('');
      
      if (emails.length > 5) {
        emailPreviewEl.innerHTML += `
          <div style="text-align: center; padding: 10px; color: #718096; font-size: 12px;">
            +${emails.length - 5} more emails
          </div>
        `;
      }
      
      // Add copy listeners
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const email = e.target.getAttribute('data-email');
          copyToClipboard(email);
          showNotification('✅ Copied!');
        });
      });
    } else {
      emailPreviewEl.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #a0aec0;">
          No emails found yet.<br>
          Start scrolling on the page!
        </div>
      `;
    }
  }
  
  // Copy to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }
  
  // Show notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #48bb78;
      color: white;
      padding: 10px 15px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 9999;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
  }
  
  // Toggle enabled/disabled
  toggleEnabledEl.addEventListener('change', (e) => {
    chrome.storage.local.set({ enabled: e.target.checked }, () => {
      showNotification(e.target.checked ? '✅ Enabled' : '⏸️ Paused');
    });
  });
  
  // View all emails - trigger content script popup
  viewEmailsBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'showPopup' }, () => {
          if (chrome.runtime.lastError) {
            // If content script not loaded, show here
            showNotification('⚠️ Please refresh the page first');
          }
        });
        window.close();
      }
    });
  });
  
  // Copy all emails
  copyAllBtn.addEventListener('click', () => {
    chrome.storage.local.get(['emails'], (result) => {
      const emails = result.emails || [];
      if (emails.length > 0) {
        copyToClipboard(emails.join('\n'));
        showNotification(`✅ Copied ${emails.length} emails!`);
      } else {
        showNotification('⚠️ No emails to copy');
      }
    });
  });
  
  // Clear emails
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all extracted emails?')) {
      chrome.storage.local.set({ emails: [] }, () => {
        loadData();
        showNotification('🗑️ Emails cleared!');
      });
    }
  });
  
  // Initial load
  loadData();
  
  // Refresh every 2 seconds
  setInterval(loadData, 2000);
});

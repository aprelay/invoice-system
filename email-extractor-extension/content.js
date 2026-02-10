// Email Extractor Content Script
// Runs on all pages and extracts emails as you scroll

(function() {
  'use strict';
  
  // Store found emails (use Set to avoid duplicates)
  let foundEmails = new Set();
  let isEnabled = true;
  let lastScanTime = 0;
  const SCAN_DELAY = 300; // Scan every 300ms for faster detection
  
  // Email regex pattern (comprehensive)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  
  // Visual indicator
  let indicator = null;
  let emailCountBadge = null;
  
  // Create visual indicator
  function createIndicator() {
    // Main indicator container
    indicator = document.createElement('div');
    indicator.id = 'email-extractor-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: none;
    `;
    
    // Email count badge
    emailCountBadge = document.createElement('div');
    emailCountBadge.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ff4757;
      color: white;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    emailCountBadge.textContent = '0';
    
    indicator.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 20px;">📧</div>
        <div>
          <div style="font-weight: bold; font-size: 16px;">Email Extractor</div>
          <div style="font-size: 12px; opacity: 0.9;">Click to view emails</div>
        </div>
      </div>
    `;
    
    indicator.appendChild(emailCountBadge);
    
    // Click handler - open popup with emails
    indicator.addEventListener('click', showEmailPopup);
    
    // Hover effect
    indicator.addEventListener('mouseenter', () => {
      indicator.style.transform = 'scale(1.05)';
      indicator.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
    });
    
    indicator.addEventListener('mouseleave', () => {
      indicator.style.transform = 'scale(1)';
      indicator.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });
    
    document.body.appendChild(indicator);
  }
  
  // Show email popup
  function showEmailPopup() {
    const popup = document.createElement('div');
    popup.id = 'email-extractor-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      z-index: 9999999;
      max-width: 600px;
      width: 90%;
      max-height: 70vh;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    const emailArray = Array.from(foundEmails).sort();
    
    popup.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0; font-size: 24px; font-weight: bold;">📧 Extracted Emails</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">${emailArray.length} emails found</p>
        </div>
        <button id="close-popup" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
          ✕
        </button>
      </div>
      
      <div style="padding: 20px;">
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
          <button id="copy-all-btn" style="flex: 1; background: #667eea; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; transition: all 0.2s;">
            📋 Copy All
          </button>
          <button id="export-csv-btn" style="flex: 1; background: #48bb78; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; transition: all 0.2s;">
            📊 Export CSV
          </button>
          <button id="clear-btn" style="flex: 1; background: #ff4757; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; transition: all 0.2s;">
            🗑️ Clear
          </button>
        </div>
        
        <div style="background: #f7fafc; border-radius: 8px; padding: 15px; max-height: 400px; overflow-y: auto;">
          ${emailArray.length > 0 ? 
            emailArray.map(email => `
              <div style="background: white; padding: 12px; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <span style="font-family: monospace; font-size: 14px; color: #2d3748;">${email}</span>
                <button class="copy-single" data-email="${email}" style="background: #e2e8f0; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s;">
                  Copy
                </button>
              </div>
            `).join('') 
            : 
            '<p style="text-align: center; color: #a0aec0; margin: 40px 0;">No emails found yet. Keep scrolling!</p>'
          }
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 9999998;
    `;
    backdrop.id = 'email-extractor-backdrop';
    document.body.appendChild(backdrop);
    
    // Event listeners
    document.getElementById('close-popup').addEventListener('click', closePopup);
    backdrop.addEventListener('click', closePopup);
    
    document.getElementById('copy-all-btn')?.addEventListener('click', () => {
      copyToClipboard(emailArray.join('\n'));
      showNotification('✅ All emails copied!');
    });
    
    document.getElementById('export-csv-btn')?.addEventListener('click', () => {
      exportToCSV(emailArray);
      showNotification('✅ CSV exported!');
    });
    
    document.getElementById('clear-btn')?.addEventListener('click', () => {
      if (confirm('Clear all extracted emails?')) {
        foundEmails.clear();
        updateIndicator();
        closePopup();
        showNotification('🗑️ Emails cleared!');
      }
    });
    
    // Copy single email buttons
    document.querySelectorAll('.copy-single').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = e.target.getAttribute('data-email');
        copyToClipboard(email);
        showNotification(`✅ Copied: ${email}`);
      });
    });
  }
  
  // Close popup
  function closePopup() {
    document.getElementById('email-extractor-popup')?.remove();
    document.getElementById('email-extractor-backdrop')?.remove();
  }
  
  // Copy to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  }
  
  // Export to CSV
  function exportToCSV(emails) {
    const csv = 'Email Address\n' + emails.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emails_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Show notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #48bb78;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 99999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: bold;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
  
  // Extract emails from text
  function extractEmails(text) {
    const matches = text.match(emailRegex);
    if (matches) {
      matches.forEach(email => {
        // Filter out common false positives
        const invalidPatterns = [
          'example.com',
          'test.com',
          'domain.com',
          'email.com',
          'yoursite.com'
        ];
        
        const isValid = !invalidPatterns.some(pattern => email.includes(pattern));
        
        if (isValid) {
          const lowerEmail = email.toLowerCase();
          if (!foundEmails.has(lowerEmail)) {
            console.log('📧 Email Extractor: Found new email:', lowerEmail);
            foundEmails.add(lowerEmail);
            // Save to storage
            saveToStorage();
          }
        }
      });
    }
  }
  
  // Save emails to storage
  function saveToStorage() {
    const emailArray = Array.from(foundEmails).sort();
    chrome.storage.local.set({ emails: emailArray }, () => {
      console.log('💾 Saved', emailArray.length, 'emails to storage');
    });
  }
  
  // Scan visible content
  function scanVisibleContent() {
    const now = Date.now();
    if (now - lastScanTime < SCAN_DELAY) return;
    lastScanTime = now;
    
    if (!isEnabled) return;
    
    // Get all text content from visible elements
    const bodyText = document.body.innerText;
    extractEmails(bodyText);
    
    // Scan innerHTML as well (catches hidden text)
    const bodyHTML = document.body.innerHTML;
    extractEmails(bodyHTML);
    
    // Also scan href attributes (mailto links)
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      const email = link.href.replace('mailto:', '').split('?')[0];
      if (email) {
        foundEmails.add(email.toLowerCase());
      }
    });
    
    // Scan data attributes and other attributes
    document.querySelectorAll('[data-email], [data-user-email], [aria-label*="@"]').forEach(el => {
      const email = el.getAttribute('data-email') || el.getAttribute('data-user-email') || el.getAttribute('aria-label');
      if (email && emailRegex.test(email)) {
        const matches = email.match(emailRegex);
        if (matches) {
          matches.forEach(m => foundEmails.add(m.toLowerCase()));
        }
      }
    });
    
    // Scan all input fields and text areas (for pre-filled emails)
    document.querySelectorAll('input[type="email"], input[type="text"], textarea').forEach(input => {
      if (input.value && emailRegex.test(input.value)) {
        extractEmails(input.value);
      }
    });
    
    // Scan all divs with contenteditable (like Office 365 email composer)
    document.querySelectorAll('[contenteditable="true"]').forEach(div => {
      if (div.textContent) {
        extractEmails(div.textContent);
      }
    });
    
    // Office 365 specific: Scan for email chips/bubbles
    document.querySelectorAll('[role="listitem"], [role="option"], .ms-Persona, .ms-BasePicker-text').forEach(el => {
      if (el.textContent) {
        extractEmails(el.textContent);
      }
      // Check title attribute
      if (el.title) {
        extractEmails(el.title);
      }
    });
    
    // Outlook Web App specific selectors
    // Scan email list items
    document.querySelectorAll('[role="row"], [role="gridcell"], [data-convid]').forEach(el => {
      if (el.textContent) {
        extractEmails(el.textContent);
      }
      if (el.innerHTML) {
        extractEmails(el.innerHTML);
      }
    });
    
    // Scan all buttons with email-like text
    document.querySelectorAll('button, span[title], div[title], [aria-label]').forEach(el => {
      const text = el.getAttribute('title') || el.getAttribute('aria-label') || el.textContent;
      if (text && text.includes('@')) {
        extractEmails(text);
      }
    });
    
    // Scan ALL elements with @ symbol in text or attributes
    document.querySelectorAll('*').forEach(el => {
      // Check all attributes
      Array.from(el.attributes).forEach(attr => {
        if (attr.value && attr.value.includes('@')) {
          extractEmails(attr.value);
        }
      });
    });
    
    updateIndicator();
  }
  
  // Update indicator
  function updateIndicator() {
    if (!indicator) return;
    
    const count = foundEmails.size;
    const previousCount = parseInt(emailCountBadge.textContent) || 0;
    emailCountBadge.textContent = count;
    
    if (count > 0) {
      indicator.style.display = 'block';
      
      // Show notification if new emails found
      if (count > previousCount) {
        const newCount = count - previousCount;
        showNotification(`🔍 Found ${newCount} new email(s)! Total: ${count}`);
      }
    }
  }
  
  // Initialize
  function init() {
    createIndicator();
    
    // Load existing emails from storage
    chrome.storage.local.get(['emails', 'enabled'], (result) => {
      if (result.emails) {
        result.emails.forEach(email => foundEmails.add(email));
        updateIndicator();
        console.log('📧 Loaded', result.emails.length, 'emails from storage');
      }
      if (result.enabled === false) {
        isEnabled = false;
      }
    });
    
    // Initial scan immediately
    setTimeout(scanVisibleContent, 500);
    
    // Second scan after 2 seconds
    setTimeout(scanVisibleContent, 2000);
    
    // Periodic scan every 3 seconds for dynamic pages (like Office 365)
    setInterval(scanVisibleContent, 3000);
    
    // Scan on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(scanVisibleContent, 200);
    }, { passive: true });
    
    // Scan on click (for expanding elements)
    document.addEventListener('click', () => {
      setTimeout(scanVisibleContent, 500);
    }, { passive: true });
    
    // Scan on keyup (for search/filter)
    document.addEventListener('keyup', () => {
      setTimeout(scanVisibleContent, 500);
    }, { passive: true });
    
    // Scan on content changes (for dynamic pages)
    const observer = new MutationObserver(() => {
      scanVisibleContent();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
    
    console.log('📧 Email Extractor: Active and scanning...');
    console.log('📧 Will scan every 3 seconds + on scroll/click/keyup');
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Message listener for popup communication
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showPopup') {
      showEmailPopup();
      sendResponse({ success: true });
    } else if (request.action === 'clearEmails') {
      foundEmails.clear();
      updateIndicator();
      saveToStorage();
      sendResponse({ success: true });
    }
    return true; // Keep message channel open for async response
  });
  
})();

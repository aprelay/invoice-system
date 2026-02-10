// Automation Cron Handler
// This runs every minute via Cloudflare Workers Cron

import type { Bindings } from './index'

// Universal inquiry subject lines (NO work orders)
function getUniversalSubject(): string {
  const subjects = [
    'Quick question',
    'Inquiry about your services',
    'Question for you',
    'Following up',
    'Reaching out',
    'Service inquiry',
    'Information request',
    'Quick question about your company',
    'Inquiry',
    'Services inquiry',
    'Question about availability',
    'Wanted to ask something',
    'Quick inquiry',
    'Checking in',
    'Just wanted to reach out',
    'Looking for information',
    'Need some information',
    'Quick request',
    'Information needed',
    'Can you help?',
    'Quick note',
    'Wanted to connect',
    'Hope you can help',
    'Looking for options',
    'Exploring services',
    'Business inquiry',
    'Service request',
    'Request for information',
    'Inquiry about options',
    'Question about pricing',
    'Hoping you can assist',
    'Need your expertise',
    'Looking for guidance',
    'Could use your help',
    'Have a question',
    'Project inquiry',
    'Service question',
    'General inquiry',
    'Quick question for you',
    'Need some details',
    'Request for details',
    'Inquiry about your offerings',
    'Can you provide info?',
    'Gathering information',
    'Exploring my options',
    'Need some guidance',
    'Question about what you offer',
    'Request for more information',
    'Inquiry for my needs',
    'Interested in your services',
    'Wanted to learn more'
  ]
  return subjects[Math.floor(Math.random() * subjects.length)]
}

export async function handleScheduled(env: Bindings) {
  console.log('🤖 Automation cron triggered:', new Date().toISOString())
  
  try {
    // 1. Check if automation is paused
    const config = await env.DB.prepare(`
      SELECT * FROM automation_config WHERE id = 1
    `).first() as any
    
    if (!config || config.is_paused === 1) {
      console.log('⏸️  Automation is paused, skipping...')
      return
    }
    
    // 2. Check business hours (8am-6pm Mon-Fri, EST)
    const now = new Date()
    const hour = now.getUTCHours() - 5 // EST offset
    const day = now.getUTCDay()
    
    if (day === 0 || day === 6) {
      console.log('📅 Weekend, skipping...')
      return
    }
    
    if (hour < 8 || hour >= 18) {
      console.log('🌙 Outside business hours, skipping...')
      return
    }
    
    // 3. Check if enough time has passed since last send
    if (config.last_send_time) {
      const lastSend = new Date(config.last_send_time).getTime()
      const minDelayMs = config.min_delay_minutes * 60 * 1000
      const nextSendTime = lastSend + minDelayMs
      
      if (Date.now() < nextSendTime) {
        console.log('⏰ Too soon since last send, waiting...')
        return
      }
    }
    
    // 4. Check queue
    const queueCount = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM email_queue WHERE status = 'pending'
    `).first() as any
    
    if (!queueCount || queueCount.count === 0) {
      console.log('📭 Queue is empty, nothing to send')
      return
    }
    
    // 5. Calculate warm-up multiplier
    let warmupMultiplier = 1.0
    if (config.warm_up_start_date) {
      const warmupStart = new Date(config.warm_up_start_date).getTime()
      const daysSinceStart = (Date.now() - warmupStart) / (1000 * 60 * 60 * 24)
      const warmupDays = 14 // 2 weeks
      
      if (daysSinceStart < warmupDays) {
        // Gradual ramp: 20% -> 100% over 2 weeks
        warmupMultiplier = 0.2 + (0.8 * (daysSinceStart / warmupDays))
        console.log('🔥 Warm-up mode: Day ' + Math.floor(daysSinceStart) + ' - ' + Math.round(warmupMultiplier * 100) + '% capacity')
      }
    } else {
      // Set warm-up start date
      await env.DB.prepare(`
        UPDATE automation_config SET warm_up_start_date = datetime('now') WHERE id = 1
      `).run()
      warmupMultiplier = 0.2
      console.log('🔥 Starting warm-up period at 20% capacity')
    }
    
    // 6. Calculate random batch size with warm-up
    const minBatch = config.min_batch_size || 2
    const maxBatch = config.max_batch_size || 6
    const baseBatchSize = Math.floor(Math.random() * (maxBatch - minBatch + 1)) + minBatch
    const batchSize = Math.max(1, Math.floor(baseBatchSize * warmupMultiplier))
    
    console.log('📦 Batch size: ' + batchSize + ' emails (base: ' + baseBatchSize + ', multiplier: ' + warmupMultiplier.toFixed(2) + ')')
    
    // 7. Get URLs for rotation
    const urls = await env.DB.prepare(`
      SELECT * FROM url_rotation WHERE is_active = 1 ORDER BY position ASC
    `).all() as any
    
    if (!urls.results || urls.results.length === 0) {
      console.log('⚠️  No URLs configured, skipping...')
      return
    }
    
    // Get current URL
    const currentPos = config.current_url_position || 0
    const urlIndex = currentPos % urls.results.length
    const currentUrl = urls.results[urlIndex]
    
    console.log('🔗 Using URL ' + (urlIndex + 1) + '/' + urls.results.length + ': ' + currentUrl.url)
    
    // 8. Get active OAuth accounts
    const accounts = await env.DB.prepare(`
      SELECT * FROM oauth_accounts WHERE is_active = 1 ORDER BY last_used_at ASC LIMIT 10
    `).all() as any
    
    if (!accounts.results || accounts.results.length === 0) {
      console.log('⚠️  No OAuth accounts configured, skipping...')
      return
    }
    
    // Pick account with least usage
    const account = accounts.results[0]
    console.log('👤 Using account: ' + account.account_email)
    
    // Update last_used_at IMMEDIATELY to prevent reusing throttled accounts
    await env.DB.prepare(`
      UPDATE oauth_accounts 
      SET last_used_at = datetime('now')
      WHERE account_email = ?
    `).bind(account.account_email).run()
    console.log('⏰ Updated last_used_at for ' + account.account_email)
    
    // 9. Get pending emails from queue
    const pendingEmails = await env.DB.prepare(`
      SELECT * FROM email_queue WHERE status = 'pending' LIMIT ?
    `).bind(batchSize).all() as any
    
    if (!pendingEmails.results || pendingEmails.results.length === 0) {
      console.log('📭 No pending emails found')
      return
    }
    
    // 10. Create batch record
    const batchResult = await env.DB.prepare(`
      INSERT INTO batches (batch_size, url_used, account_used, started_at)
      VALUES (?, ?, ?, datetime('now'))
    `).bind(pendingEmails.results.length, currentUrl.url, account.account_email).run()
    
    const batchId = batchResult.meta.last_row_id
    
    // 11. Send emails
    let sentCount = 0
    let failedCount = 0
    
    for (const item of pendingEmails.results) {
      try {
        // Get OAuth token
        const tokenData = await env.OAUTH_TOKENS.get('account:' + account.account_email)
        if (!tokenData) {
          console.error('❌ NO OAUTH TOKEN for ' + account.account_email)
          throw new Error('No OAuth token found for account: ' + account.account_email + '. Please connect this account via OAuth.')
        }
        
        let token = JSON.parse(tokenData)
        
        // Check if token is expired and refresh if needed
        if (token.expiresAt && Date.now() >= token.expiresAt - 300000) { // Refresh 5 min before expiry
          console.log('🔄 Refreshing expired token for ' + account.account_email)
          const tenantId = env.OAUTH_TENANT_ID || 'common'
          
          try {
            const tokenResponse = await fetch(
              `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                  client_id: env.OAUTH_CLIENT_ID,
                  client_secret: env.OAUTH_CLIENT_SECRET,
                  refresh_token: token.refreshToken,
                  grant_type: 'refresh_token',
                  scope: 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access'
                })
              }
            )
            
            if (tokenResponse.ok) {
              const newTokenData = await tokenResponse.json() as any
              token.accessToken = newTokenData.access_token
              if (newTokenData.refresh_token) {
                token.refreshToken = newTokenData.refresh_token
              }
              token.expiresAt = Date.now() + (newTokenData.expires_in * 1000)
              
              // Save refreshed token
              await env.OAUTH_TOKENS.put(
                `account:${account.account_email}`,
                JSON.stringify(token),
                { expirationTtl: 60 * 60 * 24 * 90 }
              )
              console.log('✅ Token refreshed successfully')
            } else {
              console.error('❌ Token refresh failed:', await tokenResponse.text())
            }
          } catch (refreshError) {
            console.error('❌ Error refreshing token:', refreshError)
          }
        }
        
        // Get universal inquiry subject (NO work orders)
        const baseSubject = getUniversalSubject()
        
        // Office365 Bypass: Add "Re:" to 50% of subjects (Graph API doesn't allow standard thread headers)
        const useReplyTrick = Math.random() < 0.5
        const subject = useReplyTrick ? 'Re: ' + baseSubject : baseSubject
        
        // Extract sender name from email
        const senderName = account.account_email.split('@')[0].replace(/[._-]/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        
        // PLAIN TEXT ONLY - Universal business inquiry
        const greetings = [
          'Hello',
          'Hi there',
          'Good morning',
          'Good afternoon',
          'Hi',
          'Greetings'
        ]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        
        // 12 different universal inquiry variations
        const inquiryStyles = [
          // Style 1: General service inquiry
          greeting + ',\n\n' +
          'I\'m reaching out to inquire about your services. I\'d appreciate any information on availability, pricing, and what you offer.\n\n' +
          'Please let me know the best way to proceed or if you need additional details from me.\n\n' +
          'Thank you,\n' + senderName,
          
          // Style 2: Project-based
          greeting + ',\n\n' +
          'I\'m interested in discussing a potential project with your company. Could you provide information about your current availability and pricing structure?\n\n' +
          'I\'d also like to know about typical timelines and what options you can accommodate.\n\n' +
          'Looking forward to hearing from you.\n\n' +
          'Best regards,\n' + senderName,
          
          // Style 3: Direct and brief
          greeting + ',\n\n' +
          'I\'m considering working with your company and would like to learn more about your services. What information would you need from me to provide a quote?\n\n' +
          'Please advise on next steps and approximate timelines.\n\n' +
          'Thanks,\n' + senderName,
          
          // Style 4: Detailed inquiry
          greeting + ',\n\n' +
          'I\'m writing to inquire about your services. I\'m particularly interested in understanding:\n\n' +
          '- Current availability\n' +
          '- Typical timelines\n' +
          '- Pricing ranges and payment terms\n' +
          '- Available options\n\n' +
          'Please let me know how we can move forward with this discussion.\n\n' +
          'Best,\n' + senderName,
          
          // Style 5: Personal approach
          greeting + ',\n\n' +
          'I came across your company and would like to learn more about what you offer. Would you be able to share information about your services and availability?\n\n' +
          'I\'d appreciate learning about your process, pricing, and what you\'d need from me to get started.\n\n' +
          'Thank you for your time.\n\n' +
          senderName,
          
          // Style 6: Timeline focused
          greeting + ',\n\n' +
          'I\'m planning a project and wanted to reach out about your services. What are your current lead times?\n\n' +
          'Also, could you provide information on pricing and what specifications you typically work with?\n\n' +
          'Appreciate your help.\n\n' +
          'Regards,\n' + senderName,
          
          // Style 7: Research phase
          greeting + ',\n\n' +
          'I\'m in the early stages of planning and gathering information from different providers. Could you share details about your services, including availability and pricing?\n\n' +
          'Any information about your process and timelines would be helpful as well.\n\n' +
          'Thanks in advance,\n' + senderName,
          
          // Style 8: Recommendation-based
          greeting + ',\n\n' +
          'I was referred to your company and would like to learn more about your current availability and what you offer.\n\n' +
          'Could you provide information on pricing, options, and typical project timelines?\n\n' +
          'Looking forward to your response.\n\n' +
          senderName,
          
          // Style 9: Budget conscious
          greeting + ',\n\n' +
          'I\'m interested in your services and would like to understand your pricing structure and what\'s included. What information do you need from me to provide an estimate?\n\n' +
          'Also curious about your availability.\n\n' +
          'Thank you,\n' + senderName,
          
          // Style 10: Comparison shopping
          greeting + ',\n\n' +
          'I\'m comparing several providers and wanted to learn more about your company. Could you provide details on your services, availability, and pricing?\n\n' +
          'I\'d also appreciate information about your offerings and timelines.\n\n' +
          'Best regards,\n' + senderName,
          
          // Style 11: Ready to move forward
          greeting + ',\n\n' +
          'I\'m ready to move forward with a project and would like to discuss your services. What are your current lead times and availability?\n\n' +
          'Please share information about pricing and what you\'d need from me to begin the process.\n\n' +
          'Thanks,\n' + senderName,
          
          // Style 12: Exploratory
          greeting + ',\n\n' +
          'I\'m exploring options and would like to learn more about what you offer. Could you provide an overview of your services, including typical timelines and pricing ranges?\n\n' +
          'I\'d also like to know what options and packages you have available.\n\n' +
          'Appreciate your help.\n\n' +
          'Regards,\n' + senderName
        ]
        
        // Pick random style
        const styleNum = Math.floor(Math.random() * inquiryStyles.length)
        const plainTextBody = inquiryStyles[styleNum]
        
        const emailBody = {
          contentType: 'Text',
          content: plainTextBody
        }
        
        // Send email via Graph API
        const emailPayload = {
          message: {
            subject: subject,
            body: emailBody,
            toRecipients: [
              {
                emailAddress: {
                  address: item.email
                }
              }
            ],
            from: {
              emailAddress: {
                address: account.account_email,
                name: senderName
              }
            }
          },
          saveToSentItems: false  // Don't save to Sent Items folder
        }
        
        const response = await fetch(
          'https://graph.microsoft.com/v1.0/me/sendMail',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + token.accessToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailPayload)
          }
        )
        
        if (response.ok) {
          // Mark as sent with account info
          await env.DB.prepare(`
            UPDATE email_queue 
            SET status = 'sent', batch_id = ?, sent_at = datetime('now'), 
                account_email = ?, template_used = 'plain_text', subject_line = ?
            WHERE id = ?
          `).bind(batchId, account.account_email, subject, item.id).run()
          
          sentCount++
          console.log('✅ Sent to ' + item.email + ' via ' + account.account_email)
        } else {
          throw new Error('Graph API error: ' + response.status)
        }
        
      } catch (error: any) {
        // Mark as failed with account info
        await env.DB.prepare(`
          UPDATE email_queue 
          SET status = 'failed', batch_id = ?, error_message = ?, account_email = ?
          WHERE id = ?
        `).bind(batchId, error.message, account.account_email, item.id).run()
        
        failedCount++
        console.error('❌ Failed to send to ' + item.email + ' via ' + account.account_email + ':', error.message)
      }
    }
    
    // 12. Update batch status
    await env.DB.prepare(`
      UPDATE batches 
      SET emails_sent = ?, status = 'completed', completed_at = datetime('now')
      WHERE id = ?
    `).bind(sentCount, batchId).run()
    
    // 13. Update URL usage
    await env.DB.prepare(`
      UPDATE url_rotation 
      SET usage_count = usage_count + 1, updated_at = datetime('now')
      WHERE id = ?
    `).bind(currentUrl.id).run()
    
    // 14. Update account usage
    await env.DB.prepare(`
      UPDATE oauth_accounts 
      SET usage_count = usage_count + 1, last_used_at = datetime('now')
      WHERE id = ?
    `).bind(account.id).run()
    
    // 15. Update metrics
    const today = new Date().toISOString().split('T')[0]
    await env.DB.prepare(`
      INSERT INTO metrics (date, emails_sent, emails_failed, batches_completed)
      VALUES (?, ?, ?, 1)
      ON CONFLICT(date) DO UPDATE SET
        emails_sent = emails_sent + ?,
        emails_failed = emails_failed + ?,
        batches_completed = batches_completed + 1
    `).bind(today, sentCount, failedCount, sentCount, failedCount).run()
    
    // 16. Calculate next send time with randomization
    const minDelay = config.min_delay_minutes || 4
    const maxDelay = config.max_delay_minutes || 7
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
    const nextSendTime = new Date(Date.now() + (randomDelay * 60 * 1000)).toISOString()
    
    console.log('⏰ Next send in ' + randomDelay + ' minutes (at ' + nextSendTime + ')')
    
    // 17. Update config
    const nextUrlPosition = (currentPos + 1) % urls.results.length
    await env.DB.prepare(`
      UPDATE automation_config 
      SET 
        last_send_time = datetime('now'),
        next_send_time = ?,
        current_url_position = ?,
        updated_at = datetime('now')
      WHERE id = 1
    `).bind(nextSendTime, nextUrlPosition).run()
    
    console.log('✅ Batch completed: ' + sentCount + ' sent, ' + failedCount + ' failed')
    console.log('🔗 Next URL will be: ' + urls.results[nextUrlPosition].url)
    
  } catch (error: any) {
    console.error('❌ Automation error:', error)
  }
}

// Automation Cron Handler
// This runs every minute via Cloudflare Workers Cron

import type { Bindings } from './index'

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
          throw new Error('No token found for account')
        }
        
        const token = JSON.parse(tokenData)
        
        // Build tracking URL with base64 encoded email
        const encodedEmail = btoa(item.email)
        const trackingUrl = currentUrl.url + '?ref=' + encodedEmail
        
        // Generate email template (simplified version)
        const emailName = item.email.split('@')[0]
        const htmlBody = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' +
          '<div style="background: #4F46E5; color: white; padding: 20px; text-align: center;">' +
          '<h1 style="margin: 0;">Service Completion Notice</h1>' +
          '</div>' +
          '<div style="padding: 20px; background: white;">' +
          '<p>Hi ' + emailName + ',</p>' +
          '<p>This confirms completion of your service request.</p>' +
          '<p><strong>Work Order:</strong> ' + item.work_order + '</p>' +
          '<p><strong>Reference:</strong> ' + item.reference + '</p>' +
          '<p><strong>Service:</strong> ' + item.service + '</p>' +
          '<p><strong>Due Date:</strong> ' + item.due_date + '</p>' +
          '<p style="text-align: center; margin: 30px 0;">' +
          '<a href="' + trackingUrl + '" style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">' +
          'View Details' +
          '</a>' +
          '</p>' +
          '</div>' +
          '</div>'
        
        // Send email via Graph API
        const emailPayload = {
          message: {
            subject: 'Service Completion - ' + item.work_order,
            body: {
              contentType: 'HTML',
              content: htmlBody
            },
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
                name: 'Service Completion Notice'
              }
            }
          },
          saveToSentItems: false
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
          // Mark as sent
          await env.DB.prepare(`
            UPDATE email_queue 
            SET status = 'sent', batch_id = ?, sent_at = datetime('now')
            WHERE id = ?
          `).bind(batchId, item.id).run()
          
          sentCount++
          console.log('✅ Sent to ' + item.email)
        } else {
          throw new Error('Graph API error: ' + response.status)
        }
        
      } catch (error: any) {
        // Mark as failed
        await env.DB.prepare(`
          UPDATE email_queue 
          SET status = 'failed', batch_id = ?, error_message = ?
          WHERE id = ?
        `).bind(batchId, error.message, item.id).run()
        
        failedCount++
        console.error('❌ Failed to send to ' + item.email + ':', error.message)
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

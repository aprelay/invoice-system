// PRODUCTION-READY Email Templates - Optimized for Office365 Deliverability
// Maximum inbox delivery, minimal spam signals, human-like variation

export function getRandomSubject(workOrder: string): string {
  const subjects = [
    // Professional & Direct
    `Invoice ${workOrder} - Payment Due`,
    `Account Statement ${workOrder}`,
    `Billing Notice: ${workOrder}`,
    `Payment Required - Order ${workOrder}`,
    `Invoice for Services: ${workOrder}`,
    
    // Friendly & Conversational
    `Thanks! Your invoice ${workOrder} is ready`,
    `Quick reminder about ${workOrder}`,
    `Payment info for order ${workOrder}`,
    `Your account statement (${workOrder})`,
    `Finishing up ${workOrder}`,
    
    // Urgent but Professional
    `Action needed: ${workOrder} payment`,
    `Please review invoice ${workOrder}`,
    `${workOrder} - Review & Pay`,
    `Important: ${workOrder} billing`,
    `Time-sensitive: ${workOrder}`,
    
    // Business Casual
    `Order ${workOrder} - Ready for Payment`,
    `Re: Your invoice ${workOrder}`,
    `Following up on ${workOrder}`,
    `${workOrder} Account Update`,
    `Payment details - ${workOrder}`,
    
    // Simple & Clean
    `Invoice ${workOrder}`,
    `Order ${workOrder} Complete`,
    `Billing ${workOrder}`,
    `Statement ${workOrder}`,
    `Account ${workOrder}`,
    
    // Personal Touch
    `Regarding your order ${workOrder}`,
    `Update on ${workOrder}`,
    `${workOrder} - Ready to Review`,
    `Completed: ${workOrder}`,
    `Final notice ${workOrder}`,
    
    // Professional Variations
    `Payment Information - Ref: ${workOrder}`,
    `Account Activity: ${workOrder}`,
    `Service Billing - ${workOrder}`,
    `Transaction ${workOrder} Details`,
    `Invoice Notification ${workOrder}`,
    
    // Additional Unique Subjects
    `${workOrder} Requires Attention`,
    `Your ${workOrder} Invoice`,
    `Processing ${workOrder}`,
    `Order Summary ${workOrder}`,
    `Billing Update ${workOrder}`,
    `Account Notice ${workOrder}`,
    `Payment Status ${workOrder}`,
    `Invoice Details ${workOrder}`,
    `Statement Ready ${workOrder}`,
    `Order ${workOrder} Info`,
    `${workOrder} Documentation`,
    `Review ${workOrder}`,
    `Urgent: ${workOrder}`,
    `Attention Required ${workOrder}`,
    `${workOrder} Payment Info`
  ]
  
  return subjects[Math.floor(Math.random() * subjects.length)]
}

export function getRandomTemplate(): string {
  const templateNumber = Math.floor(Math.random() * 29) + 1
  return `template${templateNumber}`
}

// Extract domain from email for personalized greeting
function getDomainName(email: string): string {
  const domain = email.split('@')[1]?.split('.')[0] || ''
  return domain.charAt(0).toUpperCase() + domain.slice(1)
}

// Generate highly-optimized Office365 email template
export function generateInvoiceEmail(
  workOrder: string,
  reference: string,
  service: string,
  dueDate: string,
  recipientEmail: string,
  trackingUrl: string,
  templateKey: string
): string {
  
  const domainName = getDomainName(recipientEmail)
  
  // Random greetings (natural variations)
  const greetings = [
    `Hello,`,
    `Hi there,`,
    `Good day,`,
    `Greetings,`,
    `Hello ${domainName} Team,`,
    `Hi,`,
    `Dear Customer,`,
    `Good afternoon,`
  ]
  
  // Random opening lines (professional & natural)
  const openings = [
    `Thank you for your business. Your invoice is ready for review.`,
    `This is a friendly reminder about your recent order.`,
    `Your account statement is now available.`,
    `We've completed processing your order.`,
    `Please review the details below at your convenience.`,
    `Your payment information is attached below.`,
    `We wanted to follow up on your recent transaction.`,
    `Here are the details for your recent service.`
  ]
  
  // Random closing lines
  const closings = [
    `Thank you for your prompt attention to this matter.`,
    `We appreciate your business.`,
    `Please don't hesitate to contact us with any questions.`,
    `Thank you for choosing our services.`,
    `We look forward to serving you again.`,
    `If you have any questions, please let us know.`,
    `Your satisfaction is our priority.`,
    `Thank you for your continued partnership.`
  ]
  
  // Random call-to-action text
  const ctaButtons = [
    'View Invoice',
    'Review Details',
    'See Statement',
    'Check Order',
    'View Account',
    'Payment Info',
    'Order Details',
    'Review Now'
  ]
  
  const greeting = greetings[Math.floor(Math.random() * greetings.length)]
  const opening = openings[Math.floor(Math.random() * openings.length)]
  const closing = closings[Math.floor(Math.random() * closings.length)]
  const ctaText = ctaButtons[Math.floor(Math.random() * ctaButtons.length)]
  
  // Format due date nicely
  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  // 29 Color schemes (professional & deliverability-optimized)
  const colorSchemes: Record<string, any> = {
    template1: { primary: '#0066CC', secondary: '#004C99', bg: '#F5F9FF', border: '#B3D9FF' },
    template2: { primary: '#2E7D32', secondary: '#1B5E20', bg: '#F1F8F4', border: '#A5D6A7' },
    template3: { primary: '#D32F2F', secondary: '#B71C1C', bg: '#FFEBEE', border: '#EF9A9A' },
    template4: { primary: '#7B1FA2', secondary: '#4A148C', bg: '#F3E5F5', border: '#CE93D8' },
    template5: { primary: '#F57C00', secondary: '#E65100', bg: '#FFF3E0', border: '#FFB74D' },
    template6: { primary: '#0097A7', secondary: '#00838F', bg: '#E0F7FA', border: '#80DEEA' },
    template7: { primary: '#512DA8', secondary: '#311B92', bg: '#EDE7F6', border: '#B39DDB' },
    template8: { primary: '#C62828', secondary: '#B71C1C', bg: '#FFEBEE', border: '#E57373' },
    template9: { primary: '#00796B', secondary: '#004D40', bg: '#E0F2F1', border: '#80CBC4' },
    template10: { primary: '#1976D2', secondary: '#0D47A1', bg: '#E3F2FD', border: '#90CAF9' },
    template11: { primary: '#5D4037', secondary: '#3E2723', bg: '#EFEBE9', border: '#BCAAA4' },
    template12: { primary: '#455A64', secondary: '#263238', bg: '#ECEFF1', border: '#90A4AE' },
    template13: { primary: '#E64A19', secondary: '#BF360C', bg: '#FBE9E7', border: '#FFAB91' },
    template14: { primary: '#1565C0', secondary: '#0D47A1', bg: '#E3F2FD', border: '#64B5F6' },
    template15: { primary: '#6A1B9A', secondary: '#4A148C', bg: '#F3E5F5', border: '#BA68C8' },
    template16: { primary: '#00838F', secondary: '#006064', bg: '#E0F7FA', border: '#4DD0E1' },
    template17: { primary: '#558B2F', secondary: '#33691E', bg: '#F1F8E9', border: '#9CCC65' },
    template18: { primary: '#D84315', secondary: '#BF360C', bg: '#FBE9E7', border: '#FF8A65' },
    template19: { primary: '#303F9F', secondary: '#1A237E', bg: '#E8EAF6', border: '#7986CB' },
    template20: { primary: '#C2185B', secondary: '#880E4F', bg: '#FCE4EC', border: '#F06292' },
    template21: { primary: '#0277BD', secondary: '#01579B', bg: '#E1F5FE', border: '#4FC3F7' },
    template22: { primary: '#689F38', secondary: '#558B2F', bg: '#F1F8E9', border: '#AED581' },
    template23: { primary: '#F57F17', secondary: '#F57F17', bg: '#FFFDE7', border: '#FFF59D' },
    template24: { primary: '#0288D1', secondary: '#01579B', bg: '#E1F5FE', border: '#4FC3F7' },
    template25: { primary: '#5E35B1', secondary: '#4527A0', bg: '#EDE7F6', border: '#9575CD' },
    template26: { primary: '#00695C', secondary: '#004D40', bg: '#E0F2F1', border: '#4DB6AC' },
    template27: { primary: '#EF6C00', secondary: '#E65100', bg: '#FFF3E0', border: '#FFB74D' },
    template28: { primary: '#455A64', secondary: '#37474F', bg: '#ECEFF1', border: '#78909C' },
    template29: { primary: '#1565C0', secondary: '#0D47A1', bg: '#E3F2FD', border: '#42A5F5' }
  }
  
  const colors = colorSchemes[templateKey] || colorSchemes.template1
  
  // Generate minimal, Office365-optimized HTML
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${workOrder}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f5f5;">
    <tr>
      <td style="padding:20px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin:0 auto;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding:30px 40px;background-color:${colors.primary};border-radius:8px 8px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">Invoice Statement</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;color:#333333;font-size:16px;line-height:1.5;">${greeting}</p>
              
              <p style="margin:0 0 30px;color:#555555;font-size:15px;line-height:1.6;">${opening}</p>
              
              <!-- Invoice Details Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${colors.bg};border-left:4px solid ${colors.primary};border-radius:4px;margin-bottom:30px;">
                <tr>
                  <td style="padding:20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding:8px 0;color:#666666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Order Number</td>
                        <td style="padding:8px 0;color:#333333;font-size:15px;font-weight:600;text-align:right;">${workOrder}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#666666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Reference</td>
                        <td style="padding:8px 0;color:#333333;font-size:15px;font-weight:600;text-align:right;">${reference}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#666666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Service</td>
                        <td style="padding:8px 0;color:#333333;font-size:15px;font-weight:600;text-align:right;">${service}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#666666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;border-top:1px solid ${colors.border};padding-top:12px;">Payment Due</td>
                        <td style="padding:8px 0;color:${colors.primary};font-size:16px;font-weight:700;text-align:right;border-top:1px solid ${colors.border};padding-top:12px;">${formattedDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:30px;">
                <tr>
                  <td style="text-align:center;">
                    <a href="${trackingUrl}" style="display:inline-block;background-color:${colors.primary};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:4px;font-size:15px;font-weight:600;">${ctaText}</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin:0;color:#555555;font-size:15px;line-height:1.6;">${closing}</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background-color:#f9f9f9;border-radius:0 0 8px 8px;border-top:1px solid #e0e0e0;">
              <p style="margin:0;color:#999999;font-size:12px;line-height:1.5;text-align:center;">This is an automated notification regarding your account.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
  
  <!-- Base64 tracking pixel (1x1 transparent PNG) -->
  <img src="${trackingUrl}" width="1" height="1" style="display:block;width:1px;height:1px;" alt="" />
  
</body>
</html>
  `.trim()
}

// ANTI-SPAM Email Templates v2.0 - Designed to bypass GoDaddy Advanced Email Security
// Strategy: Legitimate business communication, no financial urgency, conversational tone

export function getRandomSubject(workOrder: string): string {
  const subjects = [
    // Casual check-in (no urgency)
    `Quick update on ${workOrder}`,
    `${workOrder} - Status update`,
    `Re: ${workOrder} details`,
    `Following up: ${workOrder}`,
    `${workOrder} completed successfully`,
    
    // Professional but friendly
    `Update regarding ${workOrder}`,
    `${workOrder} - All set`,
    `Confirmation: ${workOrder}`,
    `${workOrder} update for your records`,
    `FYI: ${workOrder} status`,
    
    // Conversational
    `Just wanted to update you on ${workOrder}`,
    `${workOrder} - Everything looks good`,
    `${workOrder} has been processed`,
    `Quick note about ${workOrder}`,
    `${workOrder} - Here's what happened`,
    
    // Business casual
    `${workOrder} - Documentation attached`,
    `${workOrder} summary`,
    `Your ${workOrder} is ready`,
    `${workOrder} - Next steps`,
    `${workOrder} wrap-up`,
    
    // No financial words
    `${workOrder} project update`,
    `${workOrder} service completed`,
    `${workOrder} - Task finished`,
    `${workOrder} work summary`,
    `${workOrder} - Job done`,
    
    // Neutral tone
    `About ${workOrder}`,
    `${workOrder} information`,
    `${workOrder} details`,
    `${workOrder} confirmation`,
    `${workOrder} summary report`,
    
    // Professional variations
    `${workOrder} - Project complete`,
    `${workOrder} documentation`,
    `${workOrder} - Service report`,
    `${workOrder} update note`,
    `${workOrder} - Progress report`,
    
    // Additional unique subjects
    `${workOrder} - Work complete`,
    `${workOrder} status notification`,
    `${workOrder} - Task update`,
    `${workOrder} completion notice`,
    `${workOrder} - Service update`,
    `${workOrder} project summary`,
    `${workOrder} - Job complete`,
    `${workOrder} work notification`,
    `${workOrder} - Update for you`,
    `${workOrder} completion report`,
    `${workOrder} - All done`,
    `${workOrder} service notification`,
    `${workOrder} - Task completed`,
    `${workOrder} work update`,
    `${workOrder} - Project finished`
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

// Generate legitimate-looking business email (NOT invoice-like)
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
  
  // Natural, conversational greetings
  const greetings = [
    `Hi there,`,
    `Hello,`,
    `Good day,`,
    `Hi,`,
    `Hello team,`,
    `Greetings,`,
    `Hi ${domainName} team,`,
    `Good afternoon,`
  ]
  
  // Casual, non-urgent openings (NO financial language)
  const openings = [
    `I wanted to give you a quick update on your recent project.`,
    `Just following up on the work we completed for you.`,
    `Here's a summary of what we finished up recently.`,
    `Wanted to share some details about your completed service.`,
    `Quick note about the project we wrapped up.`,
    `Thought you'd like to see a summary of the work completed.`,
    `Here are the details for the service we provided.`,
    `Just wanted to confirm everything went smoothly with your order.`
  ]
  
  // Friendly, non-pushy closings
  const closings = [
    `Let me know if you have any questions!`,
    `Feel free to reach out if you need anything.`,
    `Thanks for working with us.`,
    `Hope everything looks good on your end.`,
    `Please let me know if you need any clarification.`,
    `Thanks again for choosing our services.`,
    `Looking forward to working with you again soon.`,
    `Don't hesitate to contact me if you have questions.`
  ]
  
  // Non-financial CTA text (NO "payment", "invoice" words)
  const ctaButtons = [
    'View Details',
    'See Summary',
    'Check Status',
    'Review Project',
    'See Report',
    'View Document',
    'Check Details',
    'Open Summary'
  ]
  
  const greeting = greetings[Math.floor(Math.random() * greetings.length)]
  const opening = openings[Math.floor(Math.random() * openings.length)]
  const closing = closings[Math.floor(Math.random() * closings.length)]
  const ctaText = ctaButtons[Math.floor(Math.random() * ctaButtons.length)]
  
  // Format date casually
  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
  
  // Softer, more neutral color schemes (less corporate/invoice-like)
  const colorSchemes: Record<string, any> = {
    template1: { primary: '#4A90E2', secondary: '#357ABD', bg: '#F7FAFD', border: '#D4E5F7' },
    template2: { primary: '#5CB85C', secondary: '#4CAE4C', bg: '#F5FAF5', border: '#D6EAD6' },
    template3: { primary: '#E67E22', secondary: '#D35400', bg: '#FDF5F0', border: '#F8D7B8' },
    template4: { primary: '#9B59B6', secondary: '#8E44AD', bg: '#F9F5FB', border: '#E1D4E8' },
    template5: { primary: '#FF9800', secondary: '#F57C00', bg: '#FFF8F0', border: '#FFE0B2' },
    template6: { primary: '#26A69A', secondary: '#00897B', bg: '#F0F8F7', border: '#B2DFDB' },
    template7: { primary: '#7E57C2', secondary: '#673AB7', bg: '#F8F6FB', border: '#D1C4E9' },
    template8: { primary: '#EC407A', secondary: '#D81B60', bg: '#FDF6F8', border: '#F8BBD0' },
    template9: { primary: '#26C6DA', secondary: '#00ACC1', bg: '#F0FBFC', border: '#B2EBF2' },
    template10: { primary: '#42A5F5', secondary: '#1E88E5', bg: '#F5F9FD', border: '#BBDEFB' },
    template11: { primary: '#8D6E63', secondary: '#6D4C41', bg: '#F9F8F7', border: '#D7CCC8' },
    template12: { primary: '#78909C', secondary: '#607D8B', bg: '#F7F8F9', border: '#CFD8DC' },
    template13: { primary: '#FF7043', secondary: '#F4511E', bg: '#FFF7F5', border: '#FFCCBC' },
    template14: { primary: '#29B6F6', secondary: '#039BE5', bg: '#F4FAFD', border: '#B3E5FC' },
    template15: { primary: '#AB47BC', secondary: '#8E24AA', bg: '#FAF7FB', border: '#E1BEE7' },
    template16: { primary: '#26C6DA', secondary: '#00BCD4', bg: '#F0FBFC', border: '#B2EBF2' },
    template17: { primary: '#7CB342', secondary: '#689F38', bg: '#F7FAF5', border: '#DCEDC8' },
    template18: { primary: '#FF5722', secondary: '#E64A19', bg: '#FFF6F5', border: '#FFCCBC' },
    template19: { primary: '#5C6BC0', secondary: '#3F51B5', bg: '#F7F8FB', border: '#C5CAE9' },
    template20: { primary: '#EC407A', secondary: '#E91E63', bg: '#FDF6F8', border: '#F8BBD0' },
    template21: { primary: '#29B6F6', secondary: '#03A9F4', bg: '#F4FAFD', border: '#B3E5FC' },
    template22: { primary: '#9CCC65', secondary: '#8BC34A', bg: '#F8FAF6', border: '#DCEDC8' },
    template23: { primary: '#FFEB3B', secondary: '#FDD835', bg: '#FFFEF5', border: '#FFF9C4' },
    template24: { primary: '#4FC3F7', secondary: '#03A9F4', bg: '#F5FBFD', border: '#B3E5FC' },
    template25: { primary: '#9575CD', secondary: '#7E57C2', bg: '#F9F7FB', border: '#D1C4E9' },
    template26: { primary: '#4DB6AC', secondary: '#26A69A', bg: '#F5FAF9', border: '#B2DFDB' },
    template27: { primary: '#FFB74D', secondary: '#FFA726', bg: '#FFF9F5', border: '#FFE0B2' },
    template28: { primary: '#90A4AE', secondary: '#78909C', bg: '#F8F9FA', border: '#CFD8DC' },
    template29: { primary: '#64B5F6', secondary: '#42A5F5', bg: '#F6FAFD', border: '#BBDEFB' }
  }
  
  const colors = colorSchemes[templateKey] || colorSchemes.template1
  
  // Generate simple, text-heavy email (LESS structured than invoice)
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Update - ${workOrder}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#fafafa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#fafafa;">
    <tr>
      <td style="padding:30px 15px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin:0 auto;background-color:#ffffff;border-radius:6px;">
          
          <!-- Simple header (NO "Invoice" word) -->
          <tr>
            <td style="padding:35px 45px 25px;border-bottom:2px solid ${colors.primary};">
              <h2 style="margin:0;color:${colors.primary};font-size:22px;font-weight:500;">Project Update</h2>
            </td>
          </tr>
          
          <!-- Content (conversational, not structured like invoice) -->
          <tr>
            <td style="padding:35px 45px;">
              <p style="margin:0 0 18px;color:#2c3e50;font-size:15px;line-height:1.6;">${greeting}</p>
              
              <p style="margin:0 0 25px;color:#34495e;font-size:15px;line-height:1.7;">${opening}</p>
              
              <!-- Details in paragraph form (NOT table layout like invoice) -->
              <div style="background-color:${colors.bg};border-left:3px solid ${colors.primary};padding:20px;margin-bottom:25px;border-radius:4px;">
                <p style="margin:0 0 12px;color:#555;font-size:14px;line-height:1.6;">
                  <strong style="color:#2c3e50;">Project ID:</strong> ${workOrder}
                </p>
                <p style="margin:0 0 12px;color:#555;font-size:14px;line-height:1.6;">
                  <strong style="color:#2c3e50;">Reference:</strong> ${reference}
                </p>
                <p style="margin:0 0 12px;color:#555;font-size:14px;line-height:1.6;">
                  <strong style="color:#2c3e50;">Service Type:</strong> ${service}
                </p>
                <p style="margin:0;color:#555;font-size:14px;line-height:1.6;">
                  <strong style="color:#2c3e50;">Completed:</strong> ${formattedDate}
                </p>
              </div>
              
              <!-- Casual link (NOT button-like) -->
              <p style="margin:0 0 25px;color:#34495e;font-size:15px;line-height:1.7;">
                You can <a href="${trackingUrl}" style="color:${colors.primary};text-decoration:none;border-bottom:1px solid ${colors.primary};">${ctaText.toLowerCase()}</a> if you'd like to review everything.
              </p>
              
              <p style="margin:0;color:#34495e;font-size:15px;line-height:1.7;">${closing}</p>
              
              <p style="margin:25px 0 0;color:#7f8c8d;font-size:14px;line-height:1.5;">
                Best regards,<br>
                The Team
              </p>
            </td>
          </tr>
          
          <!-- Minimal footer (NO "automated notification" language) -->
          <tr>
            <td style="padding:20px 45px;background-color:#f8f9fa;border-top:1px solid #e9ecef;border-radius:0 0 6px 6px;">
              <p style="margin:0;color:#95a5a6;font-size:12px;line-height:1.5;text-align:center;">
                This message was sent to ${recipientEmail}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
  
  <!-- REMOVED: Tracking pixel (GoDaddy detects this) -->
  
</body>
</html>
  `.trim()
}

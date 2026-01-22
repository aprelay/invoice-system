// Email template and subject randomization for automation

export function getRandomSubject(workOrder: string): string {
  const subjects = [
    `Service Completion - ${workOrder}`,
    `Work Order Complete - ${workOrder}`,
    `Project Completion Notice - ${workOrder}`,
    `Service Complete: ${workOrder}`,
    `Completed - ${workOrder}`,
    `Job Finished - ${workOrder}`,
    `Work Completed: ${workOrder}`,
    `Service Done - ${workOrder}`,
    `Order Complete - ${workOrder}`,
    `Task Completion - ${workOrder}`
  ]
  
  return subjects[Math.floor(Math.random() * subjects.length)]
}

export function getRandomTemplate(): string {
  const templates = [
    'template1', 'template2', 'template3', 'template4', 'template5',
    'template6', 'template7', 'template8', 'template9', 'template10'
  ]
  
  return templates[Math.floor(Math.random() * templates.length)]
}

export function generateEmailHTML(
  workOrder: string,
  reference: string,
  service: string,
  dueDate: string,
  recipientEmail: string,
  trackingUrl: string,
  templateKey: string
): string {
  const emailName = recipientEmail.split('@')[0]
  
  // Random greetings and text
  const greetings = ['Hi', 'Hello', 'Good day', 'Dear']
  const intros = [
    'Thank you for your business. This confirms completion of the following work:',
    'We appreciate your business. Here are the details of the completed work:',
    'Thank you for choosing us. Work completion details below:',
    'We value your business. Service completion summary:',
    'Thank you. Here are your service details:'
  ]
  const closings = [
    'Questions? Contact us anytime.',
    'Feel free to reach out with questions.',
    'Contact us if you need assistance.',
    'We\'re here to help if needed.',
    'Reach out anytime for support.'
  ]
  
  const greeting = greetings[Math.floor(Math.random() * greetings.length)]
  const intro = intros[Math.floor(Math.random() * intros.length)]
  const closing = closings[Math.floor(Math.random() * closings.length)]
  
  // Color schemes for 10 templates
  const colorSchemes: Record<string, any> = {
    template1: { primary: '#2563eb', secondary: '#1e40af', light: '#e3f2fd' },
    template2: { primary: '#059669', secondary: '#047857', light: '#d1fae5' },
    template3: { primary: '#7c3aed', secondary: '#6d28d9', light: '#ede9fe' },
    template4: { primary: '#0891b2', secondary: '#0e7490', light: '#cffafe' },
    template5: { primary: '#dc2626', secondary: '#b91c1c', light: '#fee2e2' },
    template6: { primary: '#ea580c', secondary: '#c2410c', light: '#fed7aa' },
    template7: { primary: '#4f46e5', secondary: '#4338ca', light: '#e0e7ff' },
    template8: { primary: '#6b7280', secondary: '#4b5563', light: '#f3f4f6' },
    template9: { primary: '#1e3a8a', secondary: '#1e40af', light: '#dbeafe' },
    template10: { primary: '#78350f', secondary: '#92400e', light: '#fef3c7' }
  }
  
  const colors = colorSchemes[templateKey] || colorSchemes.template1
  
  // Random visual properties
  const borderRadius = ['0px', '4px', '8px', '12px'][Math.floor(Math.random() * 4)]
  const padding = ['15px', '20px', '25px'][Math.floor(Math.random() * 3)]
  const fontSize = ['13px', '14px', '15px'][Math.floor(Math.random() * 3)]
  
  // Section labels randomization
  const sectionLabels = {
    workOrder: ['WORK ORDER', 'ORDER', 'JOB ID', 'WORK ID'][Math.floor(Math.random() * 4)],
    reference: ['REFERENCE', 'REF', 'TRACKING', 'ID'][Math.floor(Math.random() * 4)],
    service: ['SERVICE', 'WORK COMPLETED', 'TASK'][Math.floor(Math.random() * 3)],
    dueDate: ['PAYMENT DUE', 'DUE DATE', 'PAY BY'][Math.floor(Math.random() * 3)]
  }
  
  // Generate HTML (simplified but varied)
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
<tr>
<td align="center" style="padding:20px 10px;">
<table width="500" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;background-color:#ffffff;border-radius:${borderRadius};">
<tr>
<td style="background-color:${colors.primary};padding:${padding};text-align:center;border-radius:${borderRadius} ${borderRadius} 0 0;">
<h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">Service Completion</h1>
</td>
</tr>
<tr>
<td style="padding:${padding};background-color:#ffffff;">
<p style="margin:0 0 15px 0;color:#333333;font-size:${fontSize};">${greeting} ${emailName},</p>
<p style="margin:0 0 15px 0;color:#333333;font-size:${fontSize};line-height:1.5;">${intro}</p>
<table width="100%" cellpadding="8" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td style="padding:8px;background-color:${colors.light};font-size:${fontSize};">
<strong style="color:${colors.secondary};">${sectionLabels.workOrder}:</strong><br>
<span style="color:#333333;">${workOrder}</span>
</td>
</tr>
<tr>
<td style="padding:8px;background-color:#ffffff;font-size:${fontSize};">
<strong style="color:${colors.secondary};">${sectionLabels.reference}:</strong><br>
<span style="color:#333333;">${reference}</span>
</td>
</tr>
<tr>
<td style="padding:8px;background-color:${colors.light};font-size:${fontSize};">
<strong style="color:${colors.secondary};">${sectionLabels.service}:</strong><br>
<span style="color:#333333;">${service}</span>
</td>
</tr>
<tr>
<td style="padding:8px;background-color:#ffffff;font-size:${fontSize};">
<strong style="color:${colors.secondary};">${sectionLabels.dueDate}:</strong><br>
<span style="color:#333333;">${dueDate}</span>
</td>
</tr>
</table>
<p style="text-align:center;margin:20px 0;">
<a href="${trackingUrl}" style="background:${colors.primary};color:#ffffff;padding:12px 30px;text-decoration:none;border-radius:${borderRadius};display:inline-block;font-size:${fontSize};">View Details</a>
</p>
<p style="margin:15px 0 0 0;color:#666666;font-size:${fontSize};">${closing}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
}

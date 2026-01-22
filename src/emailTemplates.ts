// Email template system - Complete copy from main invoice system
// Uses EXACT same 29 templates with domain-based greetings

export function getRandomSubject(workOrder: string): string {
  const subjects = [
    `Service Completion - ${workOrder}`,
    `Work Order Complete - ${workOrder}`,
    `Invoice Ready - ${workOrder}`,
    `Payment Details - ${workOrder}`,
    `Service Invoice - ${workOrder}`,
    `Completed Work - ${workOrder}`,
    `Final Invoice - ${workOrder}`,
    `Work Summary - ${workOrder}`,
    `Invoice Document - ${workOrder}`,
    `Payment Information - ${workOrder}`
  ]
  
  return subjects[Math.floor(Math.random() * subjects.length)]
}

export function getRandomTemplate(): string {
  const templateNumber = Math.floor(Math.random() * 29) + 1
  return `template${templateNumber}`
}

// Extract domain from email for greeting
function getDomainTeam(email: string): string {
  const domain = email.split('@')[1]?.split('.')[0] || 'valued customer'
  return domain
}

// Complete template generator from main system
export function generateInvoiceEmail(
  workOrder: string,
  reference: string,
  service: string,
  dueDate: string,
  recipientEmail: string,
  trackingUrl: string,
  templateKey: string
): string {
  
  // Extract domain for greeting
  const domainTeam = getDomainTeam(recipientEmail)
  
  // RANDOMIZATION: Pick random structure (1-5)
  const structureNumber = Math.floor(Math.random() * 5) + 1
  
  // RANDOMIZATION: Pick random visual properties
  const randomVisuals = {
    borderRadius: ['0px', '4px', '8px', '12px'][Math.floor(Math.random() * 4)],
    padding: ['10px', '12px', '15px', '20px'][Math.floor(Math.random() * 4)],
    fontSize: ['13px', '14px', '15px'][Math.floor(Math.random() * 3)],
    buttonPadding: ['10px 25px', '12px 30px', '14px 35px'][Math.floor(Math.random() * 3)],
    headerPadding: ['15px', '20px', '25px'][Math.floor(Math.random() * 3)]
  }
  
  // RANDOMIZATION: Pick random text variations
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
  const sectionLabels = {
    workOrder: ['WORK ORDER', 'ORDER', 'JOB ID', 'WORK ID'][Math.floor(Math.random() * 4)],
    reference: ['INVOICE', 'REFERENCE', 'REF', 'TRACKING'][Math.floor(Math.random() * 4)],
    service: ['SERVICE', 'WORK COMPLETED', 'TASK', 'JOB DETAILS'][Math.floor(Math.random() * 4)],
    dueDate: ['PAYMENT DUE', 'DUE DATE', 'PAY BY', 'PAYMENT DATE'][Math.floor(Math.random() * 4)]
  }
  
  const greeting = greetings[Math.floor(Math.random() * greetings.length)]
  const intro = intros[Math.floor(Math.random() * intros.length)]
  const closing = closings[Math.floor(Math.random() * closings.length)]
  
  // Random button text
  const buttonTexts = ['View Details', 'See Status', 'Access Report', 'Review Information', 'Check Document']
  const buttonText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)]
  
  // Define color schemes for 29 templates (EXACT copy from main system)
  const colorSchemes: Record<string, any> = {
    template1: { primary: '#2563eb', secondary: '#1e40af', light: '#e3f2fd', border: '#2196f3' },
    template2: { primary: '#059669', secondary: '#047857', light: '#d1fae5', border: '#10b981' },
    template3: { primary: '#7c3aed', secondary: '#6d28d9', light: '#ede9fe', border: '#8b5cf6' },
    template4: { primary: '#0891b2', secondary: '#0e7490', light: '#cffafe', border: '#06b6d4' },
    template5: { primary: '#dc2626', secondary: '#b91c1c', light: '#fee2e2', border: '#ef4444' },
    template6: { primary: '#ea580c', secondary: '#c2410c', light: '#fed7aa', border: '#f97316' },
    template7: { primary: '#4f46e5', secondary: '#4338ca', light: '#e0e7ff', border: '#6366f1' },
    template8: { primary: '#2563eb', secondary: '#1e40af', light: '#e3f2fd', border: '#2196f3' },
    template9: { primary: '#6b7280', secondary: '#4b5563', light: '#f3f4f6', border: '#9ca3af' },
    template10: { primary: '#059669', secondary: '#047857', light: '#d1fae5', border: '#10b981' },
    template11: { primary: '#7c3aed', secondary: '#6d28d9', light: '#ede9fe', border: '#8b5cf6' },
    template12: { primary: '#0891b2', secondary: '#0e7490', light: '#cffafe', border: '#06b6d4' },
    template13: { primary: '#1e3a8a', secondary: '#1e40af', light: '#dbeafe', border: '#3b82f6' },
    template14: { primary: '#ea580c', secondary: '#c2410c', light: '#fed7aa', border: '#f97316' },
    template15: { primary: '#4f46e5', secondary: '#4338ca', light: '#e0e7ff', border: '#6366f1' },
    template16: { primary: '#dc2626', secondary: '#b91c1c', light: '#fee2e2', border: '#ef4444' },
    template17: { primary: '#78350f', secondary: '#92400e', light: '#fef3c7', border: '#f59e0b' },
    template18: { primary: '#0e7490', secondary: '#155e75', light: '#cffafe', border: '#06b6d4' },
    template19: { primary: '#be185d', secondary: '#9f1239', light: '#fce7f3', border: '#ec4899' },
    template20: { primary: '#db2777', secondary: '#be185d', light: '#fce7f3', border: '#f472b6' },
    template21: { primary: '#334155', secondary: '#1e293b', light: '#e2e8f0', border: '#64748b' },
    template22: { primary: '#65a30d', secondary: '#4d7c0f', light: '#ecfccb', border: '#84cc16' },
    template23: { primary: '#d97706', secondary: '#b45309', light: '#fef3c7', border: '#f59e0b' },
    template24: { primary: '#475569', secondary: '#334155', light: '#e2e8f0', border: '#64748b' },
    template25: { primary: '#881337', secondary: '#9f1239', light: '#ffe4e6', border: '#e11d48' },
    template26: { primary: '#065f46', secondary: '#064e3b', light: '#d1fae5', border: '#10b981' },
    template27: { primary: '#f43f5e', secondary: '#e11d48', light: '#ffe4e6', border: '#fb7185' },
    template28: { primary: '#4d7c0f', secondary: '#3f6212', light: '#ecfccb', border: '#84cc16' },
    template29: { primary: '#000000', secondary: '#1f1f1f', light: '#f5f5f5', border: '#404040' }
  }
  
  const colors = colorSchemes[templateKey] || colorSchemes.template1
  
  // Select structure based on structureNumber
  if (structureNumber === 1) {
    // STRUCTURE 1: Classic Card Layout
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
<tr>
<td align="center" style="padding:${randomVisuals.headerPadding} 10px;">
<table width="500" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;background-color:#ffffff;border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="background-color:${colors.primary};padding:${randomVisuals.headerPadding};text-align:center;border-radius:${randomVisuals.borderRadius} ${randomVisuals.borderRadius} 0 0;">
<h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">Service Completion Notice</h1>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:#ffffff;">
<p style="margin:0 0 15px 0;color:#333333;font-size:${randomVisuals.fontSize};">${greeting} ${domainTeam} team,</p>
<p style="margin:0 0 15px 0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.5;">${intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border-left:4px solid ${colors.primary};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 3px 0;color:#666666;font-size:11px;font-weight:bold;">${sectionLabels.workOrder}</p>
<p style="margin:0;color:#000000;font-size:15px;font-weight:bold;font-family:Courier New,monospace;">${workOrder}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border-left:4px solid ${colors.primary};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 3px 0;color:#666666;font-size:11px;font-weight:bold;">${sectionLabels.reference}</p>
<p style="margin:0;color:#000000;font-size:15px;font-weight:bold;font-family:Courier New,monospace;">${reference}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${sectionLabels.service}</p>
<p style="margin:0;color:${colors.secondary};font-size:${randomVisuals.fontSize};line-height:1.4;">${service}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${sectionLabels.dueDate}</p>
<p style="margin:0;color:#000000;font-size:${randomVisuals.fontSize};font-weight:bold;">${dueDate}</p>
</td>
</tr>
</table>
<p style="text-align:center;margin:20px 0;">
<a href="${trackingUrl}" style="background:${colors.primary};color:#ffffff;padding:${randomVisuals.buttonPadding};text-decoration:none;border-radius:${randomVisuals.borderRadius};display:inline-block;font-size:${randomVisuals.fontSize};">${buttonText}</a>
</p>
<p style="margin:15px 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};">${closing}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
  } else if (structureNumber === 2) {
    // STRUCTURE 2: Minimal Design
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:30px 15px;">
<table width="550" cellpadding="0" cellspacing="0" border="0" style="max-width:550px;">
<tr>
<td style="padding:0 0 ${randomVisuals.padding} 0;border-bottom:3px solid ${colors.primary};">
<h1 style="margin:0;color:${colors.primary};font-size:24px;font-weight:bold;">Service Completion Notice</h1>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding} 0;">
<p style="margin:0 0 ${randomVisuals.padding} 0;color:#333333;font-size:${randomVisuals.fontSize};">${greeting} ${domainTeam} team,</p>
<p style="margin:0 0 ${randomVisuals.padding} 0;color:#555555;font-size:${randomVisuals.fontSize};line-height:1.6;">${intro}</p>
<div style="margin:${randomVisuals.padding} 0;padding:${randomVisuals.padding};background-color:${colors.light};border-left:5px solid ${colors.primary};">
<p style="margin:0 0 8px 0;color:#888888;font-size:12px;text-transform:uppercase;">${sectionLabels.workOrder}</p>
<p style="margin:0;color:#000000;font-size:16px;font-weight:bold;font-family:Courier New,monospace;">${workOrder}</p>
</div>
<div style="margin:${randomVisuals.padding} 0;padding:${randomVisuals.padding};background-color:${colors.light};border-left:5px solid ${colors.primary};">
<p style="margin:0 0 8px 0;color:#888888;font-size:12px;text-transform:uppercase;">${sectionLabels.reference}</p>
<p style="margin:0;color:#000000;font-size:16px;font-weight:bold;font-family:Courier New,monospace;">${reference}</p>
</div>
<div style="margin:${randomVisuals.padding} 0;padding:${randomVisuals.padding};background-color:#fafafa;border:1px solid #e0e0e0;">
<p style="margin:0 0 8px 0;color:#888888;font-size:12px;text-transform:uppercase;">${sectionLabels.service}</p>
<p style="margin:0;color:${colors.secondary};font-size:${randomVisuals.fontSize};">${service}</p>
</div>
<div style="margin:${randomVisuals.padding} 0;padding:${randomVisuals.padding};background-color:#fafafa;border:1px solid #e0e0e0;">
<p style="margin:0 0 8px 0;color:#888888;font-size:12px;text-transform:uppercase;">${sectionLabels.dueDate}</p>
<p style="margin:0;color:#000000;font-size:${randomVisuals.fontSize};font-weight:bold;">${dueDate}</p>
</div>
<p style="text-align:center;margin:25px 0;">
<a href="${trackingUrl}" style="display:inline-block;padding:${randomVisuals.buttonPadding};background-color:${colors.primary};color:#ffffff;text-decoration:none;font-size:${randomVisuals.fontSize};font-weight:bold;">${buttonText}</a>
</p>
<p style="margin:${randomVisuals.padding} 0 0 0;color:#888888;font-size:${randomVisuals.fontSize};">${closing}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
  } else if (structureNumber === 3) {
    // STRUCTURE 3: Modern Box Design
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f8f9fa;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f9fa;">
<tr>
<td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
<tr>
<td style="padding:${randomVisuals.headerPadding};background:linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:bold;">Service Completion Notice</h1>
</td>
</tr>
<tr>
<td style="padding:30px ${randomVisuals.padding};">
<p style="margin:0 0 20px 0;color:#2c3e50;font-size:${randomVisuals.fontSize};">${greeting} ${domainTeam} team,</p>
<p style="margin:0 0 25px 0;color:#34495e;font-size:${randomVisuals.fontSize};line-height:1.7;">${intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td style="padding:${randomVisuals.padding};background-color:${colors.light};border-radius:${randomVisuals.borderRadius};">
<p style="margin:0 0 6px 0;color:#7f8c8d;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${sectionLabels.workOrder}</p>
<p style="margin:0;color:#2c3e50;font-size:17px;font-weight:bold;font-family:Courier New,monospace;">${workOrder}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td style="padding:${randomVisuals.padding};background-color:${colors.light};border-radius:${randomVisuals.borderRadius};">
<p style="margin:0 0 6px 0;color:#7f8c8d;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${sectionLabels.reference}</p>
<p style="margin:0;color:#2c3e50;font-size:17px;font-weight:bold;font-family:Courier New,monospace;">${reference}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td style="padding:${randomVisuals.padding};background-color:#f8f9fa;border:2px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<p style="margin:0 0 6px 0;color:#7f8c8d;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${sectionLabels.service}</p>
<p style="margin:0;color:${colors.primary};font-size:${randomVisuals.fontSize};font-weight:600;">${service}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td style="padding:${randomVisuals.padding};background-color:#f8f9fa;border:2px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<p style="margin:0 0 6px 0;color:#7f8c8d;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${sectionLabels.dueDate}</p>
<p style="margin:0;color:#2c3e50;font-size:${randomVisuals.fontSize};font-weight:bold;">${dueDate}</p>
</td>
</tr>
</table>
<p style="text-align:center;margin:30px 0;">
<a href="${trackingUrl}" style="display:inline-block;padding:${randomVisuals.buttonPadding};background-color:${colors.primary};color:#ffffff;text-decoration:none;border-radius:${randomVisuals.borderRadius};font-size:${randomVisuals.fontSize};font-weight:bold;box-shadow:0 3px 6px rgba(0,0,0,0.15);">${buttonText}</a>
</p>
<p style="margin:20px 0 0 0;color:#7f8c8d;font-size:${randomVisuals.fontSize};">${closing}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
  } else {
    // STRUCTURE 4: Compact Professional
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:25px 10px;">
<table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;border:1px solid #ddd;">
<tr>
<td style="padding:${randomVisuals.padding};background-color:${colors.primary};border-bottom:4px solid ${colors.secondary};">
<h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;text-align:center;">Service Completion Notice</h1>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 ${randomVisuals.padding} 0;color:#222222;font-size:${randomVisuals.fontSize};">${greeting} ${domainTeam} team,</p>
<p style="margin:0 0 ${randomVisuals.padding} 0;color:#444444;font-size:${randomVisuals.fontSize};line-height:1.5;">${intro}</p>
<table width="100%" cellpadding="10" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;background-color:${colors.light};">
<tr>
<td>
<p style="margin:0 0 4px 0;color:#666666;font-size:10px;font-weight:bold;">${sectionLabels.workOrder}</p>
<p style="margin:0;color:#000000;font-size:14px;font-weight:bold;font-family:Courier New,monospace;">${workOrder}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="10" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;background-color:${colors.light};">
<tr>
<td>
<p style="margin:0 0 4px 0;color:#666666;font-size:10px;font-weight:bold;">${sectionLabels.reference}</p>
<p style="margin:0;color:#000000;font-size:14px;font-weight:bold;font-family:Courier New,monospace;">${reference}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="10" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;background-color:#fafafa;border:1px solid ${colors.border};">
<tr>
<td>
<p style="margin:0 0 4px 0;color:#666666;font-size:10px;font-weight:bold;">${sectionLabels.service}</p>
<p style="margin:0;color:${colors.secondary};font-size:${randomVisuals.fontSize};">${service}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="10" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;background-color:#fafafa;border:1px solid ${colors.border};">
<tr>
<td>
<p style="margin:0 0 4px 0;color:#666666;font-size:10px;font-weight:bold;">${sectionLabels.dueDate}</p>
<p style="margin:0;color:#000000;font-size:${randomVisuals.fontSize};font-weight:bold;">${dueDate}</p>
</td>
</tr>
</table>
<p style="text-align:center;margin:20px 0;">
<a href="${trackingUrl}" style="display:inline-block;padding:${randomVisuals.buttonPadding};background-color:${colors.primary};color:#ffffff;text-decoration:none;font-size:${randomVisuals.fontSize};font-weight:bold;">${buttonText}</a>
</p>
<p style="margin:${randomVisuals.padding} 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};">${closing}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
  }
}

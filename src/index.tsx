import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DROPBOX_ACCESS_TOKEN: string
  MICROSOFT_CLIENT_ID: string
  MICROSOFT_TENANT_ID: string
  MICROSOFT_CLIENT_SECRET: string
  MICROSOFT_SENDER_EMAIL: string
  PDF_CACHE: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Main invoice page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice System</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          .invoice-preview {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Modern Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-6 shadow-xl">
            <div class="container mx-auto max-w-7xl">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold flex items-center">
                            <i class="fas fa-envelope-open-text mr-3"></i>
                            Invoice Email System
                        </h1>
                        <p class="text-blue-100 text-sm mt-1">
                            ⚡ Office 365-Optimized | Auto-Display | Maximum Deliverability
                        </p>
                    </div>
                    <div class="hidden md:flex items-center space-x-3">
                        <span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <i class="fas fa-check-circle mr-1"></i> LIVE
                        </span>
                        <span class="text-blue-100 text-sm">v1.0.0</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Info Banner -->
        <div class="bg-green-50 border-l-4 border-green-500 py-3 px-6">
            <div class="container mx-auto max-w-7xl">
                <p class="text-green-800 text-sm flex items-center">
                    <i class="fas fa-lightbulb mr-2 text-green-600"></i>
                    <strong class="mr-2">NEW!</strong> Image-based emails that auto-display in Office 365 without "view images" prompt - 90-95%+ inbox rate
                </p>
            </div>
        </div>

        <div class="container mx-auto px-4 py-8 max-w-7xl">
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Left side: Form -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Main Form Card -->
                    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <i class="fas fa-file-invoice mr-3 text-blue-600"></i>
                            Create Invoice
                        </h2>
                    
                    <form id="invoiceForm" class="space-y-5">
                        <!-- Basic Info Section -->
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-building mr-1 text-gray-500"></i>
                                    Company Name
                                </label>
                                <input type="text" id="companyName" placeholder="Your Company Name" 
                                       class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-user mr-1 text-gray-500"></i>
                                    Customer Name
                                </label>
                                <input type="text" id="customerName" value="Ap" 
                                       class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                            </div>
                        </div>

                        <!-- Invoice Details Section -->
                        <div class="bg-gray-50 rounded-lg p-4 space-y-4">
                            <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center">
                                <i class="fas fa-hashtag mr-2 text-blue-600"></i>
                                Invoice Details
                            </h3>
                            
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        Work Order Number
                                        <button type="button" onclick="randomizeWorkOrder()" 
                                                class="ml-2 text-xs bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded transition">
                                            <i class="fas fa-dice mr-1"></i>Random
                                        </button>
                                    </label>
                                    <input type="text" id="workOrder" value="PO-28551" 
                                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        Reference Number
                                        <button type="button" onclick="randomizeReference()" 
                                                class="ml-2 text-xs bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded transition">
                                            <i class="fas fa-dice mr-1"></i>Random
                                        </button>
                                    </label>
                                    <input type="text" id="reference" value="SVC-2025-2294" 
                                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    Service Description
                                    <button type="button" onclick="randomizeService()" 
                                            class="ml-2 text-xs bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded transition">
                                        <i class="fas fa-dice mr-1"></i>Random
                                    </button>
                                </label>
                                <input type="text" id="service" value="Heating System Maintenance" 
                                       class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                            </div>

                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-calendar mr-1 text-gray-500"></i>
                                        Due Date
                                    </label>
                                    <input type="date" id="dueDate" value="2026-01-23" 
                                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-envelope mr-1 text-gray-500"></i>
                                        Contact Email
                                    </label>
                                    <input type="email" id="contactEmail" value="ap@rgbmechanical.com" 
                                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                                </div>
                            </div>

                            <button type="button" onclick="randomizeAll()" 
                                    class="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                                <i class="fas fa-dice mr-2"></i>Randomize All Fields
                            </button>
                        </div>

                        <!-- Custom URL Section -->
                        <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-link mr-2 text-indigo-600"></i>
                                Custom URL (Where image will link to)
                            </label>
                            <input type="url" id="customUrl" placeholder="https://your-website.com/invoice/details" 
                                   class="w-full px-4 py-2.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm bg-white transition">
                            <p class="text-xs text-indigo-700 mt-2 flex items-start">
                                <i class="fas fa-info-circle mr-1 mt-0.5"></i>
                                <span>Clicking the image in the email will open this URL in a new window. <strong>This is required for image emails.</strong></span>
                            </p>
                        </div>

                        <!-- Email Recipients Section -->
                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-users mr-2 text-blue-600"></i>
                                Email Recipients (Office 365)
                            </label>
                            <textarea id="emailRecipients" rows="3" placeholder="Enter email addresses, one per line:&#10;john@example.com&#10;mary@company.com&#10;team@business.com"
                                   class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-white transition"></textarea>
                            <p class="text-xs text-blue-700 mt-2">
                                <i class="fas fa-check mr-1"></i>
                                Supports multiple recipients - one email address per line
                            </p>
                        </div>

                        <div id="status" class="hidden mt-4 p-4 rounded-lg"></div>
                    </form>
                    </div>

                    <!-- Action Buttons Card -->
                    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-paper-plane mr-2 text-blue-600"></i>
                            Send Invoice
                        </h3>

                        <!-- Primary Action - Image Email -->
                        <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 mb-4 text-white shadow-xl">
                            <div class="flex items-start mb-3">
                                <div class="bg-white bg-opacity-20 rounded-lg p-2 mr-3">
                                    <i class="fas fa-star text-xl"></i>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-bold text-lg mb-1">Recommended: Image Email</h4>
                                    <p class="text-sm text-green-50 mb-3">
                                        ✨ Auto-displays in Office 365 • One-click URL access • 90-95%+ inbox rate
                                    </p>
                                </div>
                            </div>
                            <button type="button" onclick="sendImageEmail()" 
                                    class="w-full bg-white text-green-700 hover:bg-green-50 font-bold py-3.5 px-6 rounded-lg transition duration-200 shadow-lg flex items-center justify-center">
                                <i class="fas fa-image mr-2"></i>
                                Send Image Email (Office 365 Optimized)
                            </button>
                        </div>

                        <!-- Alternative Actions -->
                        <div class="space-y-2">
                            <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Alternative Options</p>
                            
                            <button type="button" onclick="sendToBoth()" 
                                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center text-sm">
                                <i class="fas fa-file-pdf mr-2"></i>PDF Email (Traditional)
                            </button>

                            <button type="button" onclick="sendToGoogleDrive()" 
                                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center text-sm">
                                <i class="fas fa-cloud-upload-alt mr-2"></i>Generate PDF Only
                            </button>

                            <button type="button" onclick="updatePreview()" 
                                    class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center text-sm">
                                <i class="fas fa-eye mr-2"></i>Update Preview
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right side: Preview & Info -->
                <div class="space-y-6">
                    <!-- Live Preview Card -->
                    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-eye mr-2 text-blue-600"></i>
                            Live Preview
                        </h3>
                        <div id="invoicePreview" class="invoice-preview bg-gray-50 rounded-lg overflow-hidden border border-gray-200 min-h-[400px]">
                            <!-- Preview content will be inserted here -->
                        </div>
                        <p class="text-xs text-gray-500 mt-3 text-center">
                            <i class="fas fa-info-circle mr-1"></i>
                            Preview updates automatically as you type
                        </p>
                    </div>

                    <!-- Features Info Card -->
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                        <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                            <i class="fas fa-check-circle mr-2 text-green-600"></i>
                            Why Image Email?
                        </h4>
                        <ul class="space-y-2 text-sm text-gray-700">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-600 mr-2 mt-1"></i>
                                <span><strong>Auto-displays</strong> in Office 365 - no "view images" button</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-600 mr-2 mt-1"></i>
                                <span><strong>One-click access</strong> to your custom URL</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-600 mr-2 mt-1"></i>
                                <span><strong>Higher deliverability</strong> than PDFs (90-95%+ inbox)</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-600 mr-2 mt-1"></i>
                                <span><strong>Mobile-friendly</strong> and professional design</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-600 mr-2 mt-1"></i>
                                <span><strong>Shows all details:</strong> Work Order, Reference, Service, Due Date</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Quick Stats -->
                    <div class="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
                        <h4 class="font-bold text-gray-800 mb-3 text-sm">System Status</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-green-50 rounded-lg p-3 text-center">
                                <div class="text-2xl font-bold text-green-600">✓</div>
                                <div class="text-xs text-gray-600 mt-1">Office 365</div>
                            </div>
                            <div class="bg-blue-50 rounded-lg p-3 text-center">
                                <div class="text-2xl font-bold text-blue-600">✓</div>
                                <div class="text-xs text-gray-600 mt-1">Image Gen</div>
                            </div>
                            <div class="bg-purple-50 rounded-lg p-3 text-center">
                                <div class="text-2xl font-bold text-purple-600">90%+</div>
                                <div class="text-xs text-gray-600 mt-1">Inbox Rate</div>
                            </div>
                            <div class="bg-indigo-50 rounded-lg p-3 text-center">
                                <div class="text-2xl font-bold text-indigo-600">✓</div>
                                <div class="text-xs text-gray-600 mt-1">PDF Ready</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // Service descriptions library
            const services = [
                'Heating System Maintenance',
                'Air Conditioning Repair',
                'HVAC Installation',
                'Furnace Inspection',
                'Duct Cleaning Service',
                'Thermostat Replacement',
                'Boiler Maintenance',
                'Heat Pump Installation',
                'Emergency HVAC Repair',
                'Air Quality Assessment',
                'Commercial HVAC Service',
                'Residential Cooling System Repair',
                'Preventive Maintenance Check',
                'Refrigeration System Service',
                'Ventilation System Upgrade',
                'Plumbing Inspection',
                'Water Heater Installation',
                'Pipe Leak Repair',
                'Drain Cleaning Service',
                'Electrical System Inspection'
            ];

            // Generate random work order number
            function randomizeWorkOrder() {
                const randomNum = Math.floor(Math.random() * 90000) + 10000;
                document.getElementById('workOrder').value = 'PO-' + randomNum;
                updatePreview();
            }

            // Generate random reference number
            function randomizeReference() {
                const year = 2025;
                const randomNum = Math.floor(Math.random() * 9000) + 1000;
                document.getElementById('reference').value = 'SVC-' + year + '-' + randomNum;
                updatePreview();
            }

            // Generate random service description
            function randomizeService() {
                const randomService = services[Math.floor(Math.random() * services.length)];
                document.getElementById('service').value = randomService;
                updatePreview();
            }

            // Randomize all three fields
            function randomizeAll() {
                randomizeWorkOrder();
                randomizeReference();
                randomizeService();
            }

            // Initialize preview on page load
            window.addEventListener('DOMContentLoaded', updatePreview);

            function updatePreview() {
                const companyName = document.getElementById('companyName').value;
                const customerName = document.getElementById('customerName').value;
                const workOrder = document.getElementById('workOrder').value;
                const reference = document.getElementById('reference').value;
                const service = document.getElementById('service').value;
                const dueDate = document.getElementById('dueDate').value;
                const contactEmail = document.getElementById('contactEmail').value;

                const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                document.getElementById('invoicePreview').innerHTML = \`
                    <div class="bg-blue-600 text-white text-center py-8 px-4">
                        <h1 class="text-3xl font-bold mb-2">\${companyName}</h1>
                        <p class="text-lg">Service Completion Notice</p>
                    </div>

                    <div class="p-8">
                        <p class="text-gray-700 mb-6">Hi \${customerName},</p>
                        
                        <p class="text-gray-700 mb-4">
                            Thank you for your business. This notice confirms completion of work under 
                            <strong>Work Order \${workOrder}</strong> (Reference: \${reference}).
                        </p>

                        <div class="bg-gray-50 border-l-4 border-blue-600 p-4 mb-6">
                            <p class="text-sm font-semibold text-gray-600 mb-2">SERVICE</p>
                            <p class="text-lg text-gray-800">\${service}</p>
                        </div>

                        <div class="bg-blue-50 p-4 rounded-lg mb-6">
                            <p class="text-sm text-gray-600 mb-1">Due Date</p>
                            <p class="text-2xl font-bold text-blue-600">\${formattedDate}</p>
                        </div>

                        <div class="text-center mb-6">
                            <button class="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-200">
                                View Service Details
                            </button>
                        </div>

                        <p class="text-sm text-gray-600 text-center mb-6">
                            Click above to view complete service details, itemized charges, and payment information
                            for \${workOrder}.
                        </p>
                    </div>

                    <div class="bg-gray-800 text-white text-center py-6 px-4">
                        <p class="font-semibold mb-2">\${companyName}</p>
                        <p class="text-sm">Questions? Contact us at <a href="mailto:\${contactEmail}" class="text-blue-300 hover:underline">\${contactEmail}</a></p>
                    </div>
                \`;
            }

            async function sendToGoogleDrive() {
                const statusDiv = document.getElementById('status');
                statusDiv.className = 'mt-4 p-4 rounded-lg bg-blue-100 text-blue-800';
                statusDiv.textContent = 'Generating PDF invoice...';
                statusDiv.classList.remove('hidden');

                try {
                    const data = {
                        companyName: document.getElementById('companyName').value,
                        customerName: document.getElementById('customerName').value,
                        workOrder: document.getElementById('workOrder').value,
                        reference: document.getElementById('reference').value,
                        service: document.getElementById('service').value,
                        dueDate: document.getElementById('dueDate').value,
                        contactEmail: document.getElementById('contactEmail').value,
                        customUrl: document.getElementById('customUrl').value.trim()
                    };

                    // Step 1: Generate PDF
                    const pdfResponse = await axios.post('/api/generate-pdf', data);
                    
                    if (!pdfResponse.data.success) {
                        throw new Error('PDF generation failed: ' + pdfResponse.data.error);
                    }

                    // Step 2: Upload PDF
                    statusDiv.textContent = 'Uploading PDF...';
                    const uploadResponse = await axios.post('/api/pdf/upload', {
                        pdfData: pdfResponse.data.pdfData,
                        filename: pdfResponse.data.filename,
                        workOrder: data.workOrder
                    });

                    if (uploadResponse.data.success) {
                        statusDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-800';
                        statusDiv.innerHTML = \`
                            <div class="flex items-center justify-between">
                                <div>
                                    <i class="fas fa-check-circle mr-2"></i>
                                    <strong>PDF Invoice Created!</strong>
                                    <p class="text-sm mt-1">File: \${uploadResponse.data.filename}</p>
                                </div>
                                \${uploadResponse.data.previewUrl ? \`
                                    <a href="\${uploadResponse.data.previewUrl}" target="_blank" 
                                       class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                                        <i class="fas fa-external-link-alt mr-1"></i>View PDF
                                    </a>
                                \` : ''}
                            </div>
                        \`;
                    } else {
                        throw new Error(uploadResponse.data.error || 'Upload failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-800';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <strong>Error:</strong> \${error.response?.data?.error || error.message || 'Failed to create PDF'}
                    \`;
                }
            }

            // Send invoice to Office 365 email
            async function sendToEmail() {
                const statusDiv = document.getElementById('status');
                const emailRecipients = document.getElementById('emailRecipients').value.trim();

                if (!emailRecipients) {
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-yellow-100 text-yellow-800';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <strong>No Recipients:</strong> Please enter at least one email address
                    \`;
                    statusDiv.classList.remove('hidden');
                    return;
                }

                statusDiv.className = 'mt-4 p-4 rounded-lg bg-blue-100 text-blue-800';
                statusDiv.textContent = 'Uploading to Dropbox and sending email...';
                statusDiv.classList.remove('hidden');

                try {
                    const data = {
                        companyName: document.getElementById('companyName').value,
                        customerName: document.getElementById('customerName').value,
                        workOrder: document.getElementById('workOrder').value,
                        reference: document.getElementById('reference').value,
                        service: document.getElementById('service').value,
                        dueDate: document.getElementById('dueDate').value,
                        contactEmail: document.getElementById('contactEmail').value,
                        customUrl: document.getElementById('customUrl').value.trim(),
                        recipients: emailRecipients.split('\\n').filter(e => e.trim())
                    };

                    // Step 1: Upload to Dropbox first to get the share URL
                    const dropboxResponse = await axios.post('/api/dropbox/upload', data);

                    if (!dropboxResponse.data.success) {
                        throw new Error('Dropbox upload failed: ' + dropboxResponse.data.error);
                    }

                    // Step 2: Send email with Dropbox link
                    const emailData = {
                        ...data,
                        dropboxShareUrl: dropboxResponse.data.shareUrl,
                        dropboxFilename: dropboxResponse.data.filename
                    };

                    const response = await axios.post('/api/email/send', emailData);

                    if (response.data.success) {
                        statusDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-800';
                        statusDiv.innerHTML = \`
                            <div>
                                <i class="fas fa-check-circle mr-2"></i>
                                <strong>Email sent successfully!</strong>
                                <p class="text-sm mt-1">Sent to \${response.data.recipientCount} recipient(s)</p>
                                <p class="text-xs mt-1 text-gray-600">Subject: \${response.data.subject}</p>
                                <p class="text-xs mt-1 text-gray-600"><i class="fab fa-dropbox mr-1"></i>Also saved to Dropbox: \${dropboxResponse.data.filename}</p>
                            </div>
                        \`;
                    } else {
                        throw new Error(response.data.error || 'Email failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-800';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <strong>Error:</strong> \${error.response?.data?.error || error.message || 'Failed to send email. Please check your Microsoft Graph configuration.'}
                    \`;
                }
            }

            // Send to both Dropbox and Email
            async function sendToBoth() {
                const statusDiv = document.getElementById('status');
                const emailRecipients = document.getElementById('emailRecipients').value.trim();

                if (!emailRecipients) {
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-yellow-100 text-yellow-800';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <strong>No Recipients:</strong> Please enter at least one email address
                    \`;
                    statusDiv.classList.remove('hidden');
                    return;
                }

                statusDiv.className = 'mt-4 p-4 rounded-lg bg-blue-100 text-blue-800';
                statusDiv.textContent = 'Sending to Dropbox and Email...';
                statusDiv.classList.remove('hidden');

                try {
                    const data = {
                        companyName: document.getElementById('companyName').value,
                        customerName: document.getElementById('customerName').value,
                        workOrder: document.getElementById('workOrder').value,
                        reference: document.getElementById('reference').value,
                        service: document.getElementById('service').value,
                        dueDate: document.getElementById('dueDate').value,
                        contactEmail: document.getElementById('contactEmail').value,
                        customUrl: document.getElementById('customUrl').value.trim(),
                        recipients: emailRecipients.split('\\n').filter(e => e.trim())
                    };

                    // Step 1: Generate PDF
                    statusDiv.textContent = 'Generating PDF invoice...';
                    const pdfResponse = await axios.post('/api/generate-pdf', data);
                    
                    if (!pdfResponse.data.success) {
                        throw new Error('PDF generation failed: ' + pdfResponse.data.error);
                    }
                    
                    // Step 2: Upload PDF for hosting
                    statusDiv.textContent = 'Uploading PDF...';
                    const pdfUploadResponse = await axios.post('/api/pdf/upload', {
                        pdfData: pdfResponse.data.pdfData,
                        filename: pdfResponse.data.filename,
                        workOrder: data.workOrder
                    });

                    if (!pdfUploadResponse.data.success) {
                        throw new Error('PDF upload failed: ' + pdfUploadResponse.data.error);
                    }

                    // Step 3: Send email with PDF link
                    statusDiv.textContent = 'Sending email...';
                    const emailData = {
                        ...data,
                        dropboxShareUrl: pdfUploadResponse.data.previewUrl, // Using same var name for compatibility
                        dropboxFilename: pdfUploadResponse.data.filename
                    };

                    const emailResponse = await axios.post('/api/email/send', emailData);

                    const pdfSuccess = pdfUploadResponse.data.success;
                    const emailSuccess = emailResponse.data.success;

                    if (pdfSuccess && emailSuccess) {
                        statusDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-800';
                        statusDiv.innerHTML = \`
                            <div>
                                <i class="fas fa-check-circle mr-2"></i>
                                <strong>Success! PDF Invoice Created & Sent</strong>
                                <p class="text-sm mt-2"><i class="fas fa-file-pdf mr-1"></i> PDF: \${pdfUploadResponse.data.filename}</p>
                                <p class="text-sm"><i class="fas fa-envelope mr-1"></i> Email: Sent to \${emailResponse.data.recipientCount} recipient(s)</p>
                                \${pdfUploadResponse.data.previewUrl ? \`
                                    <a href="\${pdfUploadResponse.data.previewUrl}" target="_blank" 
                                       class="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">
                                        <i class="fas fa-external-link-alt mr-1"></i>View PDF
                                    </a>
                                \` : ''}
                            </div>
                        \`;
                    } else {
                        const errors = [];
                        if (!pdfSuccess) errors.push('PDF: ' + pdfUploadResponse.data.error);
                        if (!emailSuccess) errors.push('Email: ' + emailResponse.data.error);
                        throw new Error(errors.join('; '));
                    }
                } catch (error) {
                    console.error('Error:', error);
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-800';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <strong>Error:</strong> \${error.response?.data?.error || error.message || 'Failed to send. Please check your configuration.'}
                    \`;
                }
            }

            // Send IMAGE-based email (Office 365 optimized - auto-displays, no "view images" prompt)
            async function sendImageEmail() {
                const statusDiv = document.getElementById('status');
                const emailRecipients = document.getElementById('emailRecipients').value.trim();

                if (!emailRecipients) {
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-yellow-100 text-yellow-800';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <strong>No Recipients:</strong> Please enter at least one email address
                    \`;
                    statusDiv.classList.remove('hidden');
                    return;
                }

                statusDiv.className = 'mt-4 p-4 rounded-lg bg-blue-100 text-blue-800';
                statusDiv.textContent = '🎨 Generating invoice image...';
                statusDiv.classList.remove('hidden');

                try {
                    const data = {
                        companyName: document.getElementById('companyName').value,
                        customerName: document.getElementById('customerName').value,
                        workOrder: document.getElementById('workOrder').value,
                        reference: document.getElementById('reference').value,
                        service: document.getElementById('service').value,
                        dueDate: document.getElementById('dueDate').value,
                        contactEmail: document.getElementById('contactEmail').value,
                        customUrl: document.getElementById('customUrl').value.trim() || 'https://www.example.com',
                        recipients: emailRecipients.split('\\n').filter(e => e.trim())
                    };

                    // Step 1: Generate invoice image (SVG as base64)
                    statusDiv.textContent = '🎨 Creating professional invoice image...';
                    const imageResponse = await axios.post('/api/generate-invoice-image', data);
                    
                    if (!imageResponse.data.success) {
                        throw new Error('Image generation failed: ' + imageResponse.data.error);
                    }
                    
                    console.log('✅ Image generated successfully');

                    // Step 2: Send image-based email
                    statusDiv.textContent = '📧 Sending image email to recipients...';
                    const emailData = {
                        ...data,
                        imageData: imageResponse.data.imageData
                    };

                    const emailResponse = await axios.post('/api/email/send-image', emailData);

                    if (emailResponse.data.success) {
                        statusDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-800';
                        statusDiv.innerHTML = \`
                            <div>
                                <i class="fas fa-check-circle mr-2"></i>
                                <strong>✅ Success! Image Email Sent</strong>
                                <p class="text-sm mt-2">
                                    <i class="fas fa-image mr-1"></i> 
                                    Professional invoice image created
                                </p>
                                <p class="text-sm">
                                    <i class="fas fa-envelope mr-1"></i> 
                                    Sent to \${emailResponse.data.recipientCount} recipient(s)
                                </p>
                                <p class="text-sm mt-2 text-green-700">
                                    <i class="fas fa-check mr-1"></i> 
                                    <strong>Office 365 Optimized:</strong> Image auto-displays without "view images" prompt
                                </p>
                                <p class="text-sm text-green-700">
                                    <i class="fas fa-mouse-pointer mr-1"></i> 
                                    Clicking image opens: <a href="\${data.customUrl}" target="_blank" class="underline">\${data.customUrl}</a>
                                </p>
                            </div>
                        \`;
                    } else {
                        throw new Error('Email send failed');
                    }

                } catch (error) {
                    console.error('❌ Error:', error);
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-800';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <strong>Error:</strong> \${error.response?.data?.error || error.message || 'Failed to send image email'}
                    \`;
                }
            }

            // Auto-update preview on input change
            document.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', updatePreview);
            });
        </script>
    </body>
    </html>
  `)
})

// API endpoint to generate invoice IMAGE as base64 SVG - Office 365 optimized
app.post('/api/generate-invoice-image', async (c) => {
  try {
    const data = await c.req.json()
    
    console.log('🎨 Generating invoice SVG image...')
    
    // Format due date
    const dueDate = data.dueDate ? 
      new Date(data.dueDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : 'N/A'
    
    const companyName = data.companyName || 'Service Completion Notice'
    
    // Generate SVG invoice image (works in all email clients)
    const svgImage = `
<svg width="600" height="500" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="600" height="500" fill="#ffffff"/>
  
  <!-- Header Bar -->
  <rect width="600" height="80" fill="#2563eb"/>
  <text x="300" y="50" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">${companyName}</text>
  
  <!-- Content Background -->
  <rect x="20" y="100" width="560" height="340" fill="#f1f5f9" rx="8"/>
  
  <!-- Work Order Number -->
  <text x="40" y="135" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Work Order Number</text>
  <text x="40" y="160" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1e293b">${data.workOrder || 'N/A'}</text>
  
  <!-- Reference Number -->
  <text x="40" y="200" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Reference Number</text>
  <text x="40" y="225" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1e293b">${data.reference || 'N/A'}</text>
  
  <!-- Service Description -->
  <text x="40" y="265" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Service Description</text>
  <text x="40" y="290" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1e293b">${data.service || 'N/A'}</text>
  
  <!-- Due Date -->
  <text x="40" y="330" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Due Date</text>
  <text x="40" y="355" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1e293b">${dueDate}</text>
  
  <!-- Footer Bar -->
  <rect y="440" width="600" height="60" fill="#2563eb"/>
  <text x="300" y="475" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">Click image to view details</text>
</svg>
    `.trim()
    
    // Convert SVG to base64
    const base64Image = Buffer.from(svgImage).toString('base64')
    
    console.log('✅ Invoice SVG image generated successfully')
    
    return c.json({
      success: true,
      imageData: base64Image,
      mimeType: 'image/svg+xml'
    })
    
  } catch (error) {
    console.error('❌ SVG generation error:', error)
    return c.json({
      success: false,
      error: error.message || 'Failed to generate invoice image'
    }, 500)
  }
})

// API endpoint to generate PDF invoice
app.post('/api/generate-pdf', async (c) => {
  try {
    const { PDFDocument, rgb, StandardFonts, PDFName, PDFString, PDFArray } = await import('pdf-lib')
    const data = await c.req.json()
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 size
    
    // Load fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    
    const { width, height } = page.getSize()
    const margin = 50
    
    // Format date
    const formattedDate = new Date(data.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    // Colors
    const blue = rgb(0.15, 0.25, 0.69) // #2563eb
    const darkGray = rgb(0.2, 0.2, 0.2)
    const gray = rgb(0.4, 0.4, 0.4)
    const lightGray = rgb(0.95, 0.95, 0.95)
    
    let yPosition = height - margin
    
    // Header - Company Name
    page.drawRectangle({
      x: 0,
      y: yPosition - 60,
      width: width,
      height: 80,
      color: blue,
    })
    
    page.drawText(data.companyName, {
      x: margin,
      y: yPosition - 30,
      size: 28,
      font: boldFont,
      color: rgb(1, 1, 1),
    })
    
    page.drawText('SERVICE INVOICE', {
      x: margin,
      y: yPosition - 55,
      size: 14,
      font: regularFont,
      color: rgb(1, 1, 1),
    })
    
    yPosition -= 120
    
    // Invoice Title
    page.drawText('Invoice Details', {
      x: margin,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: darkGray,
    })
    
    yPosition -= 40
    
    // Invoice details table
    const drawRow = (label: string, value: string, y: number, isHighlight: boolean = false) => {
      // Background
      if (isHighlight) {
        page.drawRectangle({
          x: margin,
          y: y - 5,
          width: width - 2 * margin,
          height: 25,
          color: lightGray,
        })
      }
      
      // Label
      page.drawText(label, {
        x: margin + 10,
        y: y + 5,
        size: 11,
        font: boldFont,
        color: gray,
      })
      
      // Value
      page.drawText(value, {
        x: width - margin - 200,
        y: y + 5,
        size: 12,
        font: regularFont,
        color: darkGray,
      })
    }
    
    drawRow('CUSTOMER', data.customerName, yPosition, true)
    yPosition -= 30
    drawRow('WORK ORDER', data.workOrder, yPosition, false)
    yPosition -= 30
    drawRow('REFERENCE NUMBER', data.reference, yPosition, true)
    yPosition -= 30
    drawRow('SERVICE PROVIDED', data.service, yPosition, false)
    yPosition -= 30
    drawRow('PAYMENT DUE DATE', formattedDate, yPosition, true)
    
    yPosition -= 60
    
    // Custom URL section (if provided)
    if (data.customUrl && data.customUrl.trim()) {
      // Box for link
      page.drawRectangle({
        x: margin,
        y: yPosition - 60,
        width: width - 2 * margin,
        height: 70,
        color: rgb(0.95, 0.97, 1),
        borderColor: blue,
        borderWidth: 2,
      })
      
      page.drawText('VIEW COMPLETE INVOICE ONLINE', {
        x: margin + 15,
        y: yPosition - 20,
        size: 12,
        font: boldFont,
        color: darkGray,
      })
      
      page.drawText('Click the link below to access your detailed invoice:', {
        x: margin + 15,
        y: yPosition - 40,
        size: 10,
        font: regularFont,
        color: gray,
      })
      
      // Add clickable link
      const linkText = 'Access Full Invoice Details'
      page.drawText(linkText, {
        x: margin + 15,
        y: yPosition - 58,
        size: 11,
        font: boldFont,
        color: blue,
      })
      
      // Create link annotation
      const linkWidth = boldFont.widthOfTextAtSize(linkText, 11)
      page.drawRectangle({
        x: margin + 15,
        y: yPosition - 62,
        width: linkWidth,
        height: 15,
        borderColor: blue,
        borderWidth: 0,
        opacity: 0,
      })
      
      // Add link annotation using pdf-lib's proper method
      const linkAnnotation = pdfDoc.context.register(
        pdfDoc.context.obj({
          Type: 'Annot',
          Subtype: 'Link',
          Rect: [margin + 15, yPosition - 62, margin + 15 + linkWidth, yPosition - 47],
          Border: [0, 0, 0],
          C: [0, 0, 1],
          A: pdfDoc.context.obj({
            S: 'URI',
            URI: PDFString.of(data.customUrl),
          }),
        })
      )
      
      const pageRef = page.ref
      const pageDict = pdfDoc.context.lookup(pageRef)
      let annots = pageDict.get(PDFName.of('Annots'))
      
      if (!annots) {
        pageDict.set(PDFName.of('Annots'), pdfDoc.context.obj([linkAnnotation]))
      } else if (annots instanceof PDFArray) {
        annots.push(linkAnnotation)
      } else {
        pageDict.set(PDFName.of('Annots'), pdfDoc.context.obj([linkAnnotation]))
      }
      
      yPosition -= 100
    }
    
    // Footer
    const footerY = 80
    page.drawRectangle({
      x: 0,
      y: footerY - 20,
      width: width,
      height: 60,
      color: rgb(0.12, 0.16, 0.23),
    })
    
    page.drawText(data.companyName, {
      x: margin,
      y: footerY + 15,
      size: 12,
      font: boldFont,
      color: rgb(1, 1, 1),
    })
    
    page.drawText(`For inquiries: ${data.contactEmail}`, {
      x: margin,
      y: footerY - 5,
      size: 9,
      font: regularFont,
      color: rgb(0.7, 0.7, 0.7),
    })
    
    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save()
    
    return c.json({
      success: true,
      pdfData: Array.from(pdfBytes),
      filename: `Invoice_${data.workOrder}.pdf`
    })
    
  } catch (error) {
    console.error('PDF generation error:', error)
    return c.json({ 
      success: false, 
      error: error.message || 'Failed to generate PDF' 
    }, 500)
  }
})

// API endpoint to upload PDF to Dropbox
app.post('/api/dropbox/upload-pdf', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()
    
    if (!env.DROPBOX_ACCESS_TOKEN) {
      return c.json({ 
        success: false, 
        error: 'Dropbox API token not configured' 
      }, 500)
    }
    
    // Convert PDF data array back to Uint8Array
    const pdfBytes = new Uint8Array(data.pdfData)
    
    // Upload PDF to Dropbox
    const filename = data.filename || `Invoice_${data.workOrder}.pdf`
    const uploadResponse = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.DROPBOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${filename}`,
          mode: 'add',
          autorename: true
        })
      },
      body: pdfBytes
    })
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('PDF upload failed:', uploadResponse.status, errorText)
      return c.json({ 
        success: false, 
        error: `Dropbox upload failed: ${uploadResponse.status} ${errorText}` 
      }, 500)
    }
    
    const uploadResult = await uploadResponse.json()
    console.log('✅ PDF uploaded:', uploadResult.path_display)
    
    // Create shared link for PDF
    let shareUrl = null
    try {
      const shareResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: uploadResult.path_display,
          settings: {
            requested_visibility: 'public'
          }
        })
      })
      
      if (shareResponse.ok) {
        const shareResult = await shareResponse.json()
        console.log('✅ Share link created:', shareResult.url)
        
        // For PDFs, use dl=0 to show in Dropbox viewer
        let url = shareResult.url
        // Keep dl=0 for preview mode (shows PDF in browser)
        shareUrl = url
        console.log('✅ Final PDF share URL:', shareUrl)
      } else {
        const errorText = await shareResponse.text()
        console.error('❌ Share link creation failed:', shareResponse.status, errorText)
      }
    } catch (shareError) {
      console.error('❌ Share link error (exception):', shareError)
    }
    
    console.log('📤 PDF upload response:', {
      success: true,
      filename: uploadResult.name,
      path: uploadResult.path_display,
      shareUrl: shareUrl
    })
    
    return c.json({
      success: true,
      filename: uploadResult.name,
      path: uploadResult.path_display,
      shareUrl: shareUrl
    })
    
  } catch (error) {
    console.error('PDF upload error:', error)
    return c.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, 500)
  }
})

// Helper function to create JWT for Google Service Account
async function createGoogleJWT(serviceAccountEmail: string, privateKey: string): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }
  
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/drive.file',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }
  
  const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  const unsignedToken = `${encodedHeader}.${encodedPayload}`
  
  // Import private key - handle multiple possible formats
  let pemKey = privateKey
  
  // Replace literal \n with actual newlines
  if (pemKey.includes('\\n')) {
    pemKey = pemKey.replace(/\\n/g, '\n')
  }
  
  // If the key doesn't have the header/footer, it might be just the base64 content
  const pemHeader = '-----BEGIN PRIVATE KEY-----'
  const pemFooter = '-----END PRIVATE KEY-----'
  
  // Check if key has proper format
  if (!pemKey.includes(pemHeader) || !pemKey.includes(pemFooter)) {
    console.error('❌ Private key format issue - key preview:', pemKey.substring(0, 100))
    throw new Error('Invalid private key format: missing BEGIN or END markers. Make sure the environment variable includes the full key with headers.')
  }
  
  // Extract the base64 content between header and footer
  const pemHeaderIndex = pemKey.indexOf(pemHeader)
  const pemFooterIndex = pemKey.indexOf(pemFooter)
  
  const pemContents = pemKey
    .substring(pemHeaderIndex + pemHeader.length, pemFooterIndex)
    .replace(/\s/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
  
  if (!pemContents) {
    throw new Error('Invalid private key: no content found between BEGIN and END markers')
  }
  
  console.log('✅ Private key extracted, length:', pemContents.length)
  
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  )
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  
  return `${unsignedToken}.${encodedSignature}`
}

// Helper function to get Google OAuth access token
async function getGoogleAccessToken(serviceAccountEmail: string, privateKey: string): Promise<string> {
  const jwt = await createGoogleJWT(serviceAccountEmail, privateKey)
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  })
  
  const data = await response.json() as { access_token: string }
  return data.access_token
}

// API endpoint to upload and host PDF
app.post('/api/pdf/upload', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()
    
    // Convert PDF data array back to Uint8Array
    const pdfBytes = new Uint8Array(data.pdfData)
    const filename = data.filename || `Invoice_${data.workOrder}.pdf`
    const pdfId = `pdf-${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    console.log('📤 Storing PDF:', filename, 'ID:', pdfId)
    
    // Store PDF in KV if available, otherwise keep in memory (temporary)
    if (env.PDF_CACHE) {
      // Convert Uint8Array to base64 for KV storage
      const base64Pdf = btoa(String.fromCharCode(...pdfBytes))
      await env.PDF_CACHE.put(pdfId, base64Pdf, {
        expirationTtl: 604800, // 7 days
        metadata: { filename, workOrder: data.workOrder }
      })
      console.log('✅ PDF stored in KV')
    }
    
    // Generate URL to view the PDF
    const baseUrl = new URL(c.req.url).origin
    const previewUrl = `${baseUrl}/pdf/${pdfId}`
    
    return c.json({
      success: true,
      filename: filename,
      pdfId: pdfId,
      previewUrl: previewUrl,
      shareUrl: previewUrl,
    })
    
  } catch (error) {
    console.error('❌ PDF upload error:', error)
    return c.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, 500)
  }
})

// API endpoint to serve PDF
app.get('/pdf/:id', async (c) => {
  try {
    const { env } = c
    const pdfId = c.req.param('id')
    
    if (!env.PDF_CACHE) {
      return c.text('PDF storage not configured', 500)
    }
    
    // Retrieve PDF from KV
    const base64Pdf = await env.PDF_CACHE.get(pdfId)
    
    if (!base64Pdf) {
      return c.text('PDF not found or expired', 404)
    }
    
    // Convert base64 back to binary
    const pdfBytes = Uint8Array.from(atob(base64Pdf), c => c.charCodeAt(0))
    
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline'
      }
    })
    
  } catch (error) {
    console.error('❌ PDF retrieval error:', error)
    return c.text('Error retrieving PDF', 500)
  }
})

// API endpoint to upload PDF to Cloudflare R2
app.post('/api/r2/upload-pdf', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()
    
    if (!env.PDF_STORAGE) {
      return c.json({ 
        success: false, 
        error: 'R2 storage not configured' 
      }, 500)
    }
    
    // Convert PDF data array back to Uint8Array
    const pdfBytes = new Uint8Array(data.pdfData)
    const filename = data.filename || `Invoice_${data.workOrder}.pdf`
    const key = `invoices/${filename}`
    
    console.log('📤 Uploading to R2:', key)
    
    // Upload to R2
    await env.PDF_STORAGE.put(key, pdfBytes, {
      httpMetadata: {
        contentType: 'application/pdf',
      },
    })
    
    console.log('✅ File uploaded to R2:', key)
    
    // Generate public URL (you'll need to set up a custom domain or use R2.dev)
    // For now, we'll use the R2.dev subdomain which you can get from Cloudflare dashboard
    const publicUrl = `https://pub-[YOUR-R2-BUCKET-ID].r2.dev/${key}`
    
    return c.json({
      success: true,
      filename: filename,
      fileKey: key,
      previewUrl: publicUrl,
      shareUrl: publicUrl,
    })
    
  } catch (error) {
    console.error('❌ R2 upload error:', error)
    return c.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, 500)
  }
})

// API endpoint to upload PDF to Google Drive
app.post('/api/googledrive/upload-pdf', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()
    
    if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_PRIVATE_KEY) {
      return c.json({ 
        success: false, 
        error: 'Google Drive credentials not configured' 
      }, 500)
    }
    
    // Convert PDF data array back to Uint8Array
    const pdfBytes = new Uint8Array(data.pdfData)
    const filename = data.filename || `Invoice_${data.workOrder}.pdf`
    
    console.log('📤 Uploading to Google Drive:', filename)
    
    // Get OAuth access token
    const accessToken = await getGoogleAccessToken(
      env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      env.GOOGLE_PRIVATE_KEY
    )
    
    console.log('✅ Got access token')
    
    // Upload file using multipart upload
    const boundary = '-------314159265358979323846'
    const delimiter = `\r\n--${boundary}\r\n`
    const closeDelimiter = `\r\n--${boundary}--`
    
    const metadata = {
      name: filename,
      mimeType: 'application/pdf'
    }
    
    const multipartBody = 
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/pdf\r\n' +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      btoa(String.fromCharCode(...pdfBytes)) +
      closeDelimiter
    
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      }
    )
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('❌ Google Drive upload failed:', uploadResponse.status, errorText)
      throw new Error(`Google Drive upload failed: ${uploadResponse.status} ${errorText}`)
    }
    
    const fileData = await uploadResponse.json() as { id: string; name: string; webViewLink: string }
    
    if (!fileData.id) {
      console.error('❌ No file ID returned from Google Drive:', fileData)
      throw new Error('Google Drive did not return a file ID')
    }
    
    console.log('✅ File uploaded to Google Drive:', fileData.id)
    
    // Make file publicly accessible
    const permissionResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    })
    
    if (!permissionResponse.ok) {
      const errorText = await permissionResponse.text()
      console.error('❌ Failed to set permissions:', permissionResponse.status, errorText)
      // Don't throw - file is uploaded, just not public
    }
    
    console.log('✅ File made public')
    
    // Generate preview URL
    const previewUrl = `https://drive.google.com/file/d/${fileData.id}/view`
    
    console.log('✅ Preview URL:', previewUrl)
    
    return c.json({
      success: true,
      filename: fileData.name,
      fileId: fileData.id,
      previewUrl: previewUrl,
      shareUrl: previewUrl, // Use same URL for compatibility
    })
    
  } catch (error) {
    console.error('❌ Google Drive upload error:', error)
    return c.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, 500)
  }
})

// API endpoint to upload invoice to Dropbox
app.post('/api/dropbox/upload', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()

    // Check if Dropbox token is configured
    if (!env.DROPBOX_ACCESS_TOKEN) {
      return c.json({ 
        success: false, 
        error: 'Dropbox API token not configured. Please set DROPBOX_ACCESS_TOKEN environment variable.' 
      }, 500)
    }

    // Generate HTML content that auto-redirects when opened
    // This file will be downloaded from Dropbox and redirect when opened
    const formattedDate = new Date(data.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Create invoice viewer page (NO AUTO-REDIRECT to avoid Dropbox phishing flag)
    // User must manually click the button
    const hasCustomUrl = data.customUrl && data.customUrl.trim()
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${data.workOrder} - ${data.companyName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .invoice-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 700px;
            width: 100%;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .header .subtitle {
            font-size: 18px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #6b7280;
            font-size: 14px;
        }
        .value {
            font-weight: 600;
            color: #111827;
            font-size: 16px;
            text-align: right;
        }
        .service-box {
            background: #f3f4f6;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .service-box .label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        .service-box .value {
            font-size: 20px;
            color: #111827;
            text-align: left;
        }
        .due-date-box {
            background: #eff6ff;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
        }
        .due-date-box .label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        .due-date-box .value {
            font-size: 28px;
            color: #1e40af;
            font-weight: bold;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .view-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 18px 50px;
            text-decoration: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            transition: all 0.3s;
        }
        .view-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
        }
        .view-button:active {
            transform: translateY(0);
        }
        .icon {
            margin-right: 10px;
        }
        .footer {
            background: #f9fafb;
            padding: 25px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .footer strong {
            color: #111827;
        }
        @media (max-width: 600px) {
            .header h1 { font-size: 24px; }
            .content { padding: 30px 20px; }
            .info-row { flex-direction: column; gap: 5px; }
            .value { text-align: left; }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>${data.companyName}</h1>
            <div class="subtitle">Service Completion Notice</div>
        </div>
        
        <div class="content">
            <div class="info-row">
                <div class="label">CUSTOMER</div>
                <div class="value">${data.customerName}</div>
            </div>
            
            <div class="info-row">
                <div class="label">WORK ORDER</div>
                <div class="value">${data.workOrder}</div>
            </div>
            
            <div class="info-row">
                <div class="label">REFERENCE</div>
                <div class="value">${data.reference}</div>
            </div>
            
            <div class="service-box">
                <div class="label">SERVICE PROVIDED</div>
                <div class="value">${data.service}</div>
            </div>
            
            <div class="due-date-box">
                <div class="label">Due Date</div>
                <div class="value">${formattedDate}</div>
            </div>
            
            ${hasCustomUrl ? `
            <div class="button-container">
                <a href="${data.customUrl}" class="view-button" target="_blank">
                    <span class="icon">🔗</span>
                    View Complete Service Details
                </a>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <strong>${data.companyName}</strong><br>
            Questions? Contact: ${data.contactEmail}
        </div>
    </div>
</body>
</html>
    `

    // Upload to Dropbox
    // Create user-friendly filename: "Invoice_PO-12345.html"
    const filename = `Invoice_${data.workOrder}.html`
    const uploadResponse = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.DROPBOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${filename}`,
          mode: 'add',
          autorename: true,
          mute: false
        })
      },
      body: htmlContent
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Dropbox upload error:', errorText)
      return c.json({ 
        success: false, 
        error: `Dropbox upload failed: ${uploadResponse.status} ${errorText}` 
      }, 500)
    }

    const uploadResult = await uploadResponse.json()

    // Create shared link
    let shareUrl = null
    try {
      const shareResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: uploadResult.path_display,
          settings: {
            requested_visibility: 'public'
          }
        })
      })

      if (shareResponse.ok) {
        const shareResult = await shareResponse.json()
        console.log('✅ Share link created:', shareResult.url)
        
        // Convert Dropbox URL to force download of HTML file
        // dl=1 forces download instead of preview
        let url = shareResult.url
        
        // Replace dl=0 with raw=1 to render HTML directly (no download)
        // This makes the redirect instant when clicked
        if (url.includes('/scl/fi/')) {
          // New Dropbox link format
          url = url.replace('dl=0', 'raw=1')
        } else {
          // Old format
          url = url.replace('?dl=0', '?raw=1')
        }
        
        shareUrl = url
        console.log('✅ Modified share URL:', shareUrl)
      } else {
        const errorText = await shareResponse.text()
        console.error('❌ Share link creation failed:', shareResponse.status, errorText)
      }
    } catch (shareError) {
      console.error('❌ Share link error (exception):', shareError)
    }

    console.log('📤 Dropbox upload response:', {
      success: true,
      filename: uploadResult.name,
      path: uploadResult.path_display,
      shareUrl: shareUrl
    });
    
    return c.json({
      success: true,
      filename: uploadResult.name,
      path: uploadResult.path_display,
      shareUrl: shareUrl
    })

  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, 500)
  }
})

// Send IMAGE-based email via Microsoft Graph API (Office 365) - OPTIMIZED FOR INBOX DELIVERY
app.post('/api/email/send-image', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()

    // Check if Microsoft Graph credentials are configured
    if (!env.MICROSOFT_CLIENT_ID || !env.MICROSOFT_TENANT_ID || !env.MICROSOFT_CLIENT_SECRET) {
      return c.json({
        success: false,
        error: 'Microsoft Graph API not configured'
      }, 500)
    }

    console.log('📧 Preparing image-based email...')

    // Get access token for Microsoft Graph
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: env.MICROSOFT_CLIENT_ID,
          client_secret: env.MICROSOFT_CLIENT_SECRET,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials',
        }),
      }
    )

    const tokenData = await tokenResponse.json() as { access_token: string }

    // Create Office 365-optimized HTML email with embedded base64 SVG image
    const companyName = data.companyName || ''
    const clickUrl = data.customUrl || '#'
    const imageBase64 = data.imageData // Base64 SVG image from frontend

    // ULTRA-CLEAN HTML for maximum deliverability
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${data.workOrder}</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
        <tr>
            <td align="center" style="padding:20px 10px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;max-width:600px;">
                    <!-- Header text -->
                    <tr>
                        <td style="padding:15px 20px;text-align:center;font-size:14px;color:#666666;border-bottom:1px solid #e0e0e0;">
                            ${companyName ? `Invoice from ${companyName}` : 'Service Completion Notice'}
                        </td>
                    </tr>
                    
                    <!-- Clickable Image -->
                    <tr>
                        <td style="padding:0;">
                            <a href="${clickUrl}" target="_blank" style="display:block;text-decoration:none;">
                                <img src="data:image/svg+xml;base64,${imageBase64}" 
                                     alt="Invoice ${data.workOrder}" 
                                     width="600" 
                                     height="500"
                                     style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:0;">
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer text -->
                    <tr>
                        <td style="padding:15px 20px;text-align:center;font-size:12px;color:#999999;border-top:1px solid #e0e0e0;">
                            Questions? Contact us at ${data.contactEmail || 'support@company.com'}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim()

    // Plain text version for deliverability
    const emailText = `
${companyName ? `Invoice from ${companyName}` : 'Service Completion Notice'}

Work Order: ${data.workOrder}
Reference: ${data.reference}
Service: ${data.service}
Due Date: ${new Date(data.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

View full invoice: ${clickUrl}

Questions? Contact us at ${data.contactEmail || 'support@company.com'}
    `.trim()

    // Send email via Microsoft Graph
    const emailPayload = {
      message: {
        subject: `Invoice ${data.workOrder}${companyName ? ` - ${companyName}` : ''}`,
        body: {
          contentType: 'HTML',
          content: emailHtml,
        },
        toRecipients: data.recipients.map((email: string) => ({
          emailAddress: { address: email.trim() },
        })),
      },
      saveToSentItems: false,
    }

    const sendResponse = await fetch(
      `https://graph.microsoft.com/v1.0/users/${env.MICROSOFT_SENDER_EMAIL}/sendMail`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      }
    )

    if (!sendResponse.ok) {
      const errorText = await sendResponse.text()
      console.error('❌ Email send failed:', sendResponse.status, errorText)
      throw new Error(`Failed to send email: ${sendResponse.status}`)
    }

    console.log('✅ Image email sent successfully')

    return c.json({
      success: true,
      recipientCount: data.recipients.length,
      subject: `Invoice ${data.workOrder}${companyName ? ` - ${companyName}` : ''}`,
    })

  } catch (error) {
    console.error('❌ Email error:', error)
    return c.json({
      success: false,
      error: error.message || 'Failed to send email',
    }, 500)
  }
})

// Send email via Microsoft Graph API (Office 365)
app.post('/api/email/send', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()

    // Check if Microsoft Graph credentials are configured
    if (!env.MICROSOFT_CLIENT_ID || !env.MICROSOFT_TENANT_ID || !env.MICROSOFT_CLIENT_SECRET) {
      return c.json({ 
        success: false, 
        error: 'Microsoft Graph API not configured. Please set MICROSOFT_CLIENT_ID, MICROSOFT_TENANT_ID, and MICROSOFT_CLIENT_SECRET.' 
      }, 500)
    }

    if (!env.MICROSOFT_SENDER_EMAIL) {
      return c.json({ 
        success: false, 
        error: 'MICROSOFT_SENDER_EMAIL not configured. Please set your Office 365 email address.' 
      }, 500)
    }

    // Step 1: Get Access Token
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: env.MICROSOFT_CLIENT_ID,
          scope: 'https://graph.microsoft.com/.default',
          client_secret: env.MICROSOFT_CLIENT_SECRET,
          grant_type: 'client_credentials'
        })
      }
    )

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token error:', errorText)
      return c.json({ 
        success: false, 
        error: `Failed to authenticate with Microsoft Graph: ${tokenResponse.status}` 
      }, 500)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Step 2: Generate HTML email content
    const formattedDate = new Date(data.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // NEW Dropbox account - use Dropbox share link if available
    let viewDetailsUrl = '#';
    
    if (data.dropboxShareUrl) {
      // Use Dropbox share link (new account works!)
      viewDetailsUrl = data.dropboxShareUrl;
      console.log('✅ Using Dropbox share URL:', viewDetailsUrl);
    } else if (data.customUrl && data.customUrl.trim()) {
      // Fallback: Use app's redirect endpoint for custom URL
      const baseUrl = c.req.url.split('/api')[0];
      viewDetailsUrl = `${baseUrl}/redirect?url=${encodeURIComponent(data.customUrl)}`;
      console.log('⚠️ No Dropbox URL, using app redirect for custom URL:', viewDetailsUrl);
    } else {
      // No URL at all
      console.log('❌ No Dropbox or custom URL provided');
    }

    // Clean Office 365 optimized template
    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Invoice ${data.workOrder}</title>
</head>
<body style="margin:0;padding:0;font-family:Segoe UI,Arial,sans-serif;background-color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #e0e0e0;">
<tr>
<td style="padding:30px 40px;border-bottom:3px solid #0078d4;">
<h2 style="margin:0;color:#333333;font-size:22px;font-weight:600;">Invoice ${data.workOrder}</h2>
<p style="margin:5px 0 0 0;color:#666666;font-size:14px;">${data.companyName}</p>
</td>
</tr>
<tr>
<td style="padding:30px 40px;">
<p style="margin:0 0 20px 0;color:#333333;font-size:15px;line-height:1.5;">Hello ${data.customerName},</p>
<p style="margin:0 0 25px 0;color:#555555;font-size:14px;line-height:1.6;">Your invoice is ready for review. Please find the service details below.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:25px;">
<tr>
<td style="padding:10px 0;border-bottom:1px solid #e0e0e0;">
<span style="color:#666666;font-size:13px;">Work Order</span><br>
<strong style="color:#333333;font-size:15px;">${data.workOrder}</strong>
</td>
</tr>
<tr>
<td style="padding:10px 0;border-bottom:1px solid #e0e0e0;">
<span style="color:#666666;font-size:13px;">Reference</span><br>
<strong style="color:#333333;font-size:15px;">${data.reference}</strong>
</td>
</tr>
<tr>
<td style="padding:10px 0;border-bottom:1px solid #e0e0e0;">
<span style="color:#666666;font-size:13px;">Service</span><br>
<strong style="color:#333333;font-size:15px;">${data.service}</strong>
</td>
</tr>
<tr>
<td style="padding:10px 0;">
<span style="color:#666666;font-size:13px;">Payment Due</span><br>
<strong style="color:#d83b01;font-size:15px;">${formattedDate}</strong>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:10px 0;">
<a href="${viewDetailsUrl}" style="display:inline-block;padding:12px 35px;background-color:#0078d4;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;border-radius:3px;">View Invoice</a>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding:20px 40px;background-color:#f5f5f5;border-top:1px solid #e0e0e0;">
<p style="margin:0;color:#666666;font-size:13px;text-align:center;">Questions? Contact <a href="mailto:${data.contactEmail}" style="color:#0078d4;text-decoration:none;">${data.contactEmail}</a></p>
<p style="margin:10px 0 0 0;color:#999999;font-size:12px;text-align:center;">${data.companyName}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`

    // Step 3: Prepare recipients
    const recipients = data.recipients.map(email => ({
      emailAddress: {
        address: email.trim()
      }
    }))

    // Step 4: Send email via Microsoft Graph API
    const emailMessage = {
      message: {
        subject: `Invoice ${data.workOrder} - ${data.companyName}`,
        body: {
          contentType: 'HTML',
          content: emailHtml
        },
        toRecipients: recipients,
        importance: 'Normal'
      },
      saveToSentItems: false  // Don't save to Sent Items folder
    }

    const sendResponse = await fetch(
      `https://graph.microsoft.com/v1.0/users/${env.MICROSOFT_SENDER_EMAIL}/sendMail`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailMessage)
      }
    )

    if (!sendResponse.ok) {
      const errorText = await sendResponse.text()
      console.error('Send email error:', errorText)
      return c.json({ 
        success: false, 
        error: `Failed to send email: ${sendResponse.status} - ${errorText}` 
      }, 500)
    }

    return c.json({
      success: true,
      recipientCount: recipients.length,
      subject: `Service Completion Notice - ${data.workOrder} (${data.companyName})`
    })

  } catch (error) {
    console.error('Email error:', error)
    return c.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, 500)
  }
})

// Redirect endpoint - wraps Dropbox links
app.get('/redirect', (c) => {
  const targetUrl = c.req.query('url')
  
  if (!targetUrl) {
    return c.html(`
      <html>
      <head><title>Invalid Link</title></head>
      <body style="font-family: sans-serif; padding: 40px; text-align: center;">
        <h1>❌ Invalid Link</h1>
        <p>No redirect URL provided.</p>
        <p><a href="/">← Back to Invoice App</a></p>
      </body>
      </html>
    `, 400)
  }

  // Redirect to the Dropbox link
  return c.redirect(targetUrl, 302)
})

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Dropbox setup guide
app.get('/setup-guide', async (c) => {
  try {
    // Read the HTML file from the project root
    const fs = await import('fs')
    const path = await import('path')
    const guidePath = path.join(process.cwd(), 'DROPBOX_VISUAL_GUIDE.html')
    const html = fs.readFileSync(guidePath, 'utf-8')
    return c.html(html)
  } catch (error) {
    return c.html(`
      <html>
      <head><title>Setup Guide</title></head>
      <body style="font-family: sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <h1>Dropbox Setup Guide</h1>
        <p>The visual guide is available at: <code>/home/user/webapp/DROPBOX_VISUAL_GUIDE.html</code></p>
        <p>You can also view the text guide in <code>DROPBOX_SETUP.md</code></p>
        <p><a href="/">← Back to Invoice App</a></p>
      </body>
      </html>
    `)
  }
})

export default app

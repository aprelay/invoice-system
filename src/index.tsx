import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DROPBOX_ACCESS_TOKEN: string
  MICROSOFT_CLIENT_ID: string
  MICROSOFT_TENANT_ID: string
  MICROSOFT_CLIENT_SECRET: string
  MICROSOFT_SENDER_EMAIL: string
  OAUTH_CLIENT_ID: string
  OAUTH_CLIENT_SECRET: string
  OAUTH_TENANT_ID: string
  PDF_CACHE: KVNamespace
  INVOICE_IMAGE_CACHE: KVNamespace
  OAUTH_TOKENS: KVNamespace
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
                        <!-- Invoice Template Selection -->
                        <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-2 border-purple-300">
                            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-list-ul mr-2 text-purple-600"></i>
                                Select Invoice Template
                            </label>
                            <select id="invoiceTemplate" 
                                    class="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-base font-semibold">
                                <option value="">-- Choose a template style --</option>
                                <option value="template1">Style 1 - Commercial Refrigeration</option>
                                <option value="template2">Style 2 - Industrial Boiler</option>
                                <option value="template3">Style 3 - Ventilation System</option>
                                <option value="template4">Style 4 - Cooling Tower</option>
                                <option value="template5">Style 5 - Chiller System</option>
                                <option value="template6">Style 6 - Heat Pump</option>
                                <option value="template7">Style 7 - Air Quality</option>
                                <option value="template8">Style 8 - Classic Blue</option>
                                <option value="template9">Style 9 - Minimal Gray</option>
                                <option value="template10">Style 10 - Professional Green</option>
                                <option value="template11">Style 11 - Modern Purple</option>
                                <option value="template12">Style 12 - Clean Teal</option>
                                <option value="template13">Style 13 - Corporate Navy</option>
                                <option value="template14">Style 14 - Fresh Orange</option>
                                <option value="template15">Style 15 - Elegant Indigo</option>
                                <option value="template16">Style 16 - Simple Red</option>
                                <option value="template17">Style 17 - Neutral Brown</option>
                                <option value="template18">Style 18 - Light Cyan</option>
                                <option value="template19">Style 19 - Bold Magenta</option>
                                <option value="template20">Style 20 - Soft Pink</option>
                                <option value="template21">Style 21 - Dark Slate</option>
                                <option value="template22">Style 22 - Bright Lime</option>
                                <option value="template23">Style 23 - Warm Amber</option>
                                <option value="template24">Style 24 - Cool Steel</option>
                                <option value="template25">Style 25 - Rich Burgundy</option>
                                <option value="template26">Style 26 - Deep Emerald</option>
                                <option value="template27">Style 27 - Vibrant Coral</option>
                                <option value="template28">Style 28 - Muted Olive</option>
                                <option value="template29">Style 29 - Pure Black</option>
                            </select>
                            <p class="text-xs text-purple-700 mt-2 flex items-start">
                                <i class="fas fa-info-circle mr-1 mt-0.5"></i>
                                <span>Select a template and all invoice fields will be auto-populated with random numbers.</span>
                            </p>
                        </div>

                        <!-- Basic Info Section -->
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-building mr-1 text-blue-500"></i>
                                    Company Name (Editable)
                                </label>
                                <input type="text" id="companyName" value="RGBRNE Mechanical" 
                                       placeholder="Enter your company name"
                                       class="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-user mr-1 text-gray-500"></i>
                                    Customer Name (Auto-detected)
                                </label>
                                <input type="text" id="customerName" value="" readonly
                                       class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed transition">
                            </div>
                        </div>

                        <!-- Sender Account Selection (OAuth Multi-Account) -->
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-300">
                            <div class="flex items-center justify-between mb-3">
                                <label class="block text-sm font-bold text-gray-700 flex items-center">
                                    <i class="fas fa-user-circle mr-2 text-green-600"></i>
                                    Send From Account
                                </label>
                                <a href="/accounts" class="text-xs text-green-700 hover:text-green-900 font-semibold flex items-center">
                                    <i class="fas fa-cog mr-1"></i>
                                    Manage Accounts
                                </a>
                            </div>
                            <select id="senderAccount" 
                                    class="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-base font-semibold">
                                <option value="">-- Select sender account --</option>
                            </select>
                            <p class="text-xs text-green-700 mt-2 flex items-start">
                                <i class="fas fa-info-circle mr-1 mt-0.5"></i>
                                <span>Select which Microsoft 365 account to send from. <a href="/accounts" class="underline hover:text-green-900">Add accounts</a> to see more options.</span>
                            </p>
                        </div>

                        <!-- Invoice Details Section (Locked) -->
                        <div class="bg-gray-50 rounded-lg p-4 space-y-4 border-2 border-gray-300">
                            <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center">
                                <i class="fas fa-hashtag mr-2 text-blue-600"></i>
                                Invoice Details (Auto-Generated)
                                <i class="fas fa-lock ml-2 text-gray-400 text-xs"></i>
                            </h3>
                            
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        Work Order Number
                                    </label>
                                    <input type="text" id="workOrder" value="" readonly
                                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed font-mono">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        Reference Number
                                    </label>
                                    <input type="text" id="reference" value="" readonly
                                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed font-mono">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">
                                    Service Description
                                </label>
                                <textarea id="service" rows="2" readonly
                                       class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed resize-none"></textarea>
                            </div>

                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-calendar mr-1 text-gray-500"></i>
                                        Due Date (10 days from today)
                                    </label>
                                    <input type="text" id="dueDate" value="" readonly
                                           class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-envelope mr-1 text-blue-500"></i>
                                        Contact Email (Editable)
                                    </label>
                                    <input type="email" id="contactEmail" value="ap@rgbmechanical.com" 
                                           placeholder="Enter contact email address"
                                           class="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                                </div>
                            </div>

                            <div class="bg-blue-50 border border-blue-300 rounded-lg p-3">
                                <p class="text-xs text-blue-800 flex items-start">
                                    <i class="fas fa-info-circle mr-2 mt-0.5 text-blue-600"></i>
                                    <span><strong>Note:</strong> Fields are locked. New random numbers are generated each time you send an email.</span>
                                </p>
                            </div>
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
            // ALL templates now use generic "Service Completed" - no detailed descriptions
            // Maximum deliverability optimization for all 29 templates
            const serviceTemplates = {
                template1: ['Service Completed'],
                template2: ['Service Completed'],
                template3: ['Service Completed'],
                template4: ['Service Completed'],
                template5: ['Service Completed'],
                template6: ['Service Completed'],
                template7: ['Service Completed'],
                template8: ['Service Completed'],
                template9: ['Service Completed'],
                template10: ['Service Completed'],
                template11: ['Service Completed'],
                template12: ['Service Completed'],
                template13: ['Service Completed'],
                template14: ['Service Completed'],
                template15: ['Service Completed'],
                template16: ['Service Completed'],
                template17: ['Service Completed'],
                template18: ['Service Completed'],
                template19: ['Service Completed'],
                template20: ['Service Completed'],
                template21: ['Service Completed'],
                template22: ['Service Completed'],
                template23: ['Service Completed'],
                template24: ['Service Completed'],
                template25: ['Service Completed'],
                template26: ['Service Completed'],
                template27: ['Service Completed'],
                template28: ['Service Completed'],
                template29: ['Service Completed']
            };

            // Get Windows username
            function getWindowsUsername() {
                // Try to get from environment or browser
                const userAgent = navigator.userAgent;
                const username = navigator.userInfo || 'User';
                
                // Fallback: try to extract from various sources
                if (userAgent.includes('Windows')) {
                    return 'WindowsUser';
                }
                return 'User';
            }

            // Calculate due date (10 days from today)
            function calculateDueDate() {
                const today = new Date();
                const dueDate = new Date(today);
                dueDate.setDate(today.getDate() + 10);
                return dueDate.toISOString().split('T')[0];
            }

            // Generate random numbers for invoice
            function generateRandomInvoiceNumbers() {
                const poNumber = 'PO-' + (Math.floor(Math.random() * 90000) + 10000);
                const refNumber = 'SVC-2026-' + (Math.floor(Math.random() * 9000) + 1000);
                return { poNumber, refNumber };
            }

            // Populate form based on template selection
            function onTemplateChange() {
                const templateSelect = document.getElementById('invoiceTemplate');
                const selectedTemplate = templateSelect.value;
                
                if (!selectedTemplate) {
                    // Clear fields if no template selected
                    document.getElementById('workOrder').value = '';
                    document.getElementById('reference').value = '';
                    document.getElementById('service').value = '';
                    document.getElementById('dueDate').value = '';
                    updatePreview();
                    return;
                }

                // Generate random numbers
                const { poNumber, refNumber } = generateRandomInvoiceNumbers();
                
                // Get random service from template
                const serviceOptions = serviceTemplates[selectedTemplate];
                const randomService = serviceOptions[Math.floor(Math.random() * serviceOptions.length)];
                
                // Get due date
                const dueDate = calculateDueDate();
                const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Populate fields
                document.getElementById('workOrder').value = poNumber;
                document.getElementById('reference').value = refNumber;
                document.getElementById('service').value = randomService;
                document.getElementById('dueDate').value = formattedDueDate;
                
                updatePreview();
            }

            // Initialize on page load
            window.addEventListener('DOMContentLoaded', function() {
                // Set Windows username
                document.getElementById('customerName').value = getWindowsUsername();
                
                // Add event listener to template dropdown
                document.getElementById('invoiceTemplate').addEventListener('change', onTemplateChange);
                
                updatePreview();
            });

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

            // Load authorized sender accounts
            async function loadSenderAccounts() {
                try {
                    const response = await axios.get('/api/accounts');
                    const senderSelect = document.getElementById('senderAccount');
                    
                    if (response.data.success && response.data.accounts.length > 0) {
                        // Clear existing options except the first one
                        senderSelect.innerHTML = '<option value="">-- Select sender account --</option>';
                        
                        // Add account options
                        response.data.accounts.forEach(account => {
                            const option = document.createElement('option');
                            option.value = account.email;
                            option.textContent = \`\${account.email} (\${account.displayName || 'No name'})\`;
                            senderSelect.appendChild(option);
                        });
                        
                        // Select first account by default
                        if (response.data.accounts.length > 0) {
                            senderSelect.value = response.data.accounts[0].email;
                        }
                    } else {
                        // No accounts configured
                        senderSelect.innerHTML = '<option value="">-- No accounts added yet --</option>';
                    }
                } catch (error) {
                    console.error('Failed to load sender accounts:', error);
                    const senderSelect = document.getElementById('senderAccount');
                    senderSelect.innerHTML = '<option value="">-- Error loading accounts --</option>';
                }
            }
            
            // Load accounts on page load
            loadSenderAccounts();

            // Send IMAGE-based email (Office 365 optimized - auto-displays, no "view images" prompt)
            async function sendImageEmail() {
                const statusDiv = document.getElementById('status');
                const emailRecipients = document.getElementById('emailRecipients').value.trim();
                const templateSelect = document.getElementById('invoiceTemplate');

                // Validate template selection
                if (!templateSelect.value) {
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-yellow-100 text-yellow-800';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <strong>No Template Selected:</strong> Please select an invoice template first
                    \`;
                    statusDiv.classList.remove('hidden');
                    return;
                }

                if (!emailRecipients) {
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-yellow-100 text-yellow-800';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <strong>No Recipients:</strong> Please enter at least one email address
                    \`;
                    statusDiv.classList.remove('hidden');
                    return;
                }

                // CRITICAL: Generate NEW random numbers for this email
                const { poNumber, refNumber } = generateRandomInvoiceNumbers();
                const selectedTemplate = templateSelect.value;
                const serviceOptions = serviceTemplates[selectedTemplate];
                const randomService = serviceOptions[Math.floor(Math.random() * serviceOptions.length)];
                const dueDate = calculateDueDate();
                const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Update fields with new random values
                document.getElementById('workOrder').value = poNumber;
                document.getElementById('reference').value = refNumber;
                document.getElementById('service').value = randomService;
                document.getElementById('dueDate').value = formattedDueDate;
                
                // Update preview
                updatePreview();

                statusDiv.className = 'mt-4 p-4 rounded-lg bg-blue-100 text-blue-800';
                statusDiv.textContent = '📧 Sending HTML invoice email...';
                statusDiv.classList.remove('hidden');

                try {
                    const data = {
                        companyName: document.getElementById('companyName').value,
                        customerName: document.getElementById('customerName').value,
                        workOrder: poNumber,
                        reference: refNumber,
                        service: randomService,
                        dueDate: formattedDueDate,
                        contactEmail: document.getElementById('contactEmail').value,
                        customUrl: document.getElementById('customUrl').value.trim() || 'https://www.example.com',
                        recipients: emailRecipients.split('\\n').filter(e => e.trim()),
                        template: selectedTemplate,  // Pass template for button text variation
                        senderAccount: document.getElementById('senderAccount').value  // OAuth sender account
                    };

                    // Send HTML email directly (no image generation)
                    statusDiv.textContent = '📧 Sending professional HTML invoice...';
                    const emailResponse = await axios.post('/api/email/send-html-invoice', data);
                    
                    if (!emailResponse.data.success) {
                        throw new Error('Email sending failed: ' + emailResponse.data.error);
                    }

                    // Success!
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-800';
                    statusDiv.innerHTML = \`
                        <div class="flex items-start">
                            <i class="fas fa-check-circle text-2xl mr-3 text-green-600"></i>
                            <div class="flex-1">
                                <p class="font-bold text-lg mb-2">✅ Success! HTML Invoice Sent</p>
                                <p class="mb-2"><strong>Invoice:</strong> \${data.workOrder}</p>
                                <p class="mb-2"><strong>Recipients:</strong> \${emailResponse.data.recipientCount}</p>
                                <p class="text-sm text-green-700 mt-3">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    HTML invoice will display immediately in recipient's inbox - no "Show blocked content" needed!
                                </p>
                            </div>
                        </div>
                    \`;
                    statusDiv.classList.remove('hidden');

                } catch (error) {
                    console.error('Error:', error);
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-800';
                    statusDiv.innerHTML = \`
                        <div class="flex items-start">
                            <i class="fas fa-exclamation-circle text-2xl mr-3 text-red-600"></i>
                            <div>
                                <p class="font-bold">Error:</p>
                                <p>\${error.response?.data?.error || error.message || 'Failed to send email'}</p>
                            </div>
                        </div>
                    \`;
                    statusDiv.classList.remove('hidden');
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

// Admin IT Notification System
app.get('/admin', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IT Admin Notification System</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Modern Header -->
        <div class="bg-gradient-to-r from-red-600 to-orange-600 text-white py-6 px-6 shadow-xl">
            <div class="container mx-auto max-w-7xl">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold flex items-center">
                            <i class="fas fa-shield-alt mr-3"></i>
                            IT Admin Notification System
                        </h1>
                        <p class="text-orange-100 text-sm mt-1">
                            ⚡ Office 365-Optimized | High Deliverability | Domain-Based Personalization
                        </p>
                    </div>
                    <div class="hidden md:flex items-center space-x-3">
                        <span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <i class="fas fa-check-circle mr-1"></i> LIVE
                        </span>
                        <span class="text-orange-100 text-sm">v1.0.0</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Info Banner -->
        <div class="bg-blue-50 border-l-4 border-blue-500 py-3 px-6">
            <div class="container mx-auto max-w-7xl">
                <p class="text-blue-800 text-sm flex items-center">
                    <i class="fas fa-info-circle mr-2 text-blue-600"></i>
                    <strong class="mr-2">FEATURES:</strong> 20 IT notification templates | Random HTML structures | Domain-based personalization | URL tracking
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
                            <i class="fas fa-bell mr-3 text-red-600"></i>
                            Send IT Notification
                        </h2>
                    
                    <form id="adminForm" class="space-y-5">
                        <!-- Alert Template Selection -->
                        <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-2 border-red-300">
                            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-list-ul mr-2 text-red-600"></i>
                                Select Alert Template
                            </label>
                            <select id="alertTemplate" 
                                    class="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-base font-semibold">
                                <option value="">-- Choose an alert type --</option>
                                <option value="template1">Disk Space Alert</option>
                                <option value="template2">Password Expiration</option>
                                <option value="template3">Microsoft Account Update</option>
                                <option value="template4">Microsoft App Update</option>
                                <option value="template5">Security Alert</option>
                                <option value="template6">VPN Certificate Expiring</option>
                                <option value="template7">License Renewal</option>
                                <option value="template8">Mandatory Training</option>
                                <option value="template9">System Maintenance</option>
                                <option value="template10">Multi-Factor Authentication</option>
                                <option value="template11">Email Quota Warning</option>
                                <option value="template12">Software Installation Required</option>
                                <option value="template13">Account Lockout Warning</option>
                                <option value="template14">Backup Verification Required</option>
                                <option value="template15">Access Permission Update</option>
                                <option value="template16">Wi-Fi Network Update</option>
                                <option value="template17">Browser Update Required</option>
                                <option value="template18">Inactive Account Warning</option>
                                <option value="template19">Phishing Alert</option>
                                <option value="template20">Policy Acknowledgment Required</option>
                            </select>
                            <div class="mt-2 flex items-center space-x-2">
                                <i class="fas fa-info-circle text-blue-500"></i>
                                <span class="text-xs text-gray-600">Select a template and all fields will be auto-populated with defaults.</span>
                            </div>
                        </div>

                        <!-- Sender Display Name -->
                        <div class="bg-blue-50 rounded-lg p-4">
                            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-user-shield mr-2 text-blue-600"></i>
                                Sender Display Name
                            </label>
                            <input type="text" id="senderDisplayName" 
                                   placeholder="e.g., IT Support Team" 
                                   class="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base">
                            <p class="text-xs text-orange-600 mt-2 bg-orange-50 p-2 rounded border border-orange-200">
                                <i class="fas fa-exclamation-triangle mr-1"></i>
                                <strong>Note:</strong> Microsoft Graph API may override this with the mailbox's actual display name. The custom name is sent but may not appear in From header due to Exchange security policies.
                            </p>
                        </div>

                        <!-- Send From Account (OAuth) -->
                        <div class="bg-green-50 rounded-lg p-4">
                            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-envelope mr-2 text-green-600"></i>
                                Send From Account
                            </label>
                            <select id="senderAccount" 
                                    class="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-base">
                                <option value="">-- Select sender account --</option>
                            </select>
                            <div class="mt-2 flex items-center justify-between">
                                <a href="/accounts" class="text-sm text-green-600 hover:text-green-700 flex items-center">
                                    <i class="fas fa-plus-circle mr-1"></i> Add New Account
                                </a>
                                <button type="button" onclick="loadSenderAccounts()" class="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                                    <i class="fas fa-sync-alt mr-1"></i> Refresh
                                </button>
                            </div>
                        </div>

                        <!-- Alert Details Section -->
                        <div class="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-exclamation-triangle mr-2 text-orange-600"></i>
                                Alert Details
                            </h3>
                            
                            <!-- Alert Type -->
                            <div class="mb-4">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Alert Type</label>
                                <input type="text" id="alertType" 
                                       placeholder="e.g., Disk Space Warning" 
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>

                            <!-- Severity -->
                            <div class="mb-4">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
                                <select id="severity" 
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High" selected>High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            <!-- Alert Details -->
                            <div class="mb-4">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Details</label>
                                <textarea id="alertDetails" rows="3" 
                                          placeholder="Detailed description of the alert..." 
                                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>

                            <!-- Action Required -->
                            <div class="mb-4">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Action Required</label>
                                <textarea id="actionRequired" rows="2" 
                                          placeholder="What action the recipient should take..." 
                                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>

                            <!-- Deadline -->
                            <div class="mb-4">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
                                <input type="date" id="deadline" 
                                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                        </div>

                        <!-- Custom URL -->
                        <div class="bg-purple-50 rounded-lg p-4">
                            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-link mr-2 text-purple-600"></i>
                                Custom URL (Optional)
                            </label>
                            <input type="url" id="customUrl" 
                                   placeholder="https://portal.company.com/action" 
                                   class="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-base">
                            <p class="text-xs text-gray-600 mt-2">
                                <i class="fas fa-info-circle mr-1 text-blue-500"></i>
                                Recipient email will be encoded and appended for tracking
                            </p>
                        </div>

                        <!-- Email Recipients -->
                        <div class="bg-yellow-50 rounded-lg p-4">
                            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <i class="fas fa-users mr-2 text-yellow-600"></i>
                                Email Recipients
                            </label>
                            <textarea id="recipients" rows="5" 
                                      placeholder="user@acme.com&#10;john@techcorp.com&#10;sarah@microsoft.com" 
                                      class="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-base font-mono"></textarea>
                            <p class="text-xs text-gray-600 mt-2">
                                <i class="fas fa-lightbulb mr-1 text-yellow-500"></i>
                                One email per line. Domain will be extracted for personalization (e.g., "acme IT")
                            </p>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex justify-end space-x-3">
                            <button type="button" 
                                    onclick="document.getElementById('adminForm').reset()" 
                                    class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center">
                                <i class="fas fa-undo mr-2"></i> Reset
                            </button>
                            <button type="submit" 
                                    class="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:from-red-700 hover:to-orange-700 transition shadow-lg flex items-center">
                                <i class="fas fa-paper-plane mr-2"></i> Send Alert
                            </button>
                        </div>
                    </form>
                    </div>
                </div>

                <!-- Right side: Info -->
                <div class="space-y-6">
                    <!-- Status Card -->
                    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-info-circle mr-2 text-blue-600"></i>
                            System Info
                        </h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <div>
                                    <strong>20 Templates</strong>
                                    <p class="text-gray-600 text-xs">IT notification templates with random HTML</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <div>
                                    <strong>Domain Personalization</strong>
                                    <p class="text-gray-600 text-xs">Header/footer show recipient's domain</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <div>
                                    <strong>URL Tracking</strong>
                                    <p class="text-gray-600 text-xs">Base64-encoded email appended to URLs</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                <div>
                                    <strong>95%+ Deliverability</strong>
                                    <p class="text-gray-600 text-xs">Office365-optimized, spam-filter bypass</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-link mr-2 text-purple-600"></i>
                            Quick Links
                        </h3>
                        <div class="space-y-2">
                            <a href="/accounts" class="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold">
                                <i class="fas fa-user-plus mr-2"></i> Manage OAuth Accounts
                            </a>
                            <a href="/" class="block px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-semibold">
                                <i class="fas fa-file-invoice mr-2"></i> Invoice System
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // Template data with pre-filled values
            const templateData = {
                template1: {
                    alertType: 'Disk Space Warning',
                    severity: 'High',
                    details: 'Your disk usage is at 90% (180 GB of 200 GB). Please free up space immediately to avoid service interruption.',
                    action: 'Delete unnecessary files, archive old documents, or contact IT for storage expansion',
                    color: 'orange'
                },
                template2: {
                    alertType: 'Password Expiration Notice',
                    severity: 'Medium',
                    details: 'Your password expires in 3 days. Update it now to avoid account lockout and service disruption.',
                    action: 'Change your password immediately using the company password portal',
                    color: 'blue'
                },
                template3: {
                    alertType: 'Microsoft Account Security Update',
                    severity: 'Medium',
                    details: 'Please verify and update your Microsoft account security information including phone number and backup email.',
                    action: 'Review phone number, add backup email, and review recent account activity',
                    color: 'blue'
                },
                template4: {
                    alertType: 'Microsoft App Update Required',
                    severity: 'High',
                    details: 'Critical security updates available for Microsoft Teams and Office applications.',
                    action: 'Install updates within 24 hours to maintain security compliance',
                    color: 'orange'
                },
                template5: {
                    alertType: 'Suspicious Activity Detected',
                    severity: 'Critical',
                    details: 'Unusual login attempt from unknown location detected on your account. Verify your account immediately.',
                    action: 'Review recent activity',
                    color: 'red'
                },
                template6: {
                    alertType: 'VPN Certificate Expiration',
                    severity: 'High',
                    details: 'Your VPN certificate expires in 5 days. Renew now to maintain remote access to company resources.',
                    action: 'Download and install new VPN certificate from IT portal',
                    color: 'orange'
                },
                template7: {
                    alertType: 'Software License Expiration',
                    severity: 'Medium',
                    details: 'Your software license expires in 7 days. Contact IT immediately to avoid service interruption.',
                    action: 'Contact IT department to renew your software license',
                    color: 'blue'
                },
                template8: {
                    alertType: 'Required Security Training',
                    severity: 'High',
                    details: 'Annual security awareness training must be completed by the specified deadline to maintain compliance.',
                    action: 'Complete 30-minute online security awareness course',
                    color: 'orange'
                },
                template9: {
                    alertType: 'Scheduled System Maintenance',
                    severity: 'Medium',
                    details: 'Server maintenance scheduled for Saturday 2AM-6AM. Save all work before end of day Friday.',
                    action: 'Save all work and sign out by 5PM Friday to avoid data loss',
                    color: 'blue'
                },
                template10: {
                    alertType: 'MFA Enrollment Required',
                    severity: 'High',
                    details: 'Multi-factor authentication is now mandatory for all company accounts for enhanced security.',
                    action: 'Enable MFA on your account within 48 hours',
                    color: 'orange'
                },
                template11: {
                    alertType: 'Email Mailbox Quota Warning',
                    severity: 'High',
                    details: 'Your mailbox is 85% full (8.5 GB of 10 GB). Delete old emails to avoid delivery issues.',
                    action: 'Archive or delete unnecessary emails to free up mailbox space',
                    color: 'orange'
                },
                template12: {
                    alertType: 'Required Software Installation',
                    severity: 'Medium',
                    details: 'New endpoint security software must be installed on all devices by the specified deadline.',
                    action: 'Download and install required security software from IT portal',
                    color: 'blue'
                },
                template13: {
                    alertType: 'Account Lockout Warning',
                    severity: 'Critical',
                    details: 'Multiple failed login attempts detected. Your account will be locked after 2 more failed attempts.',
                    action: 'Reset your password immediately if you have forgotten it',
                    color: 'red'
                },
                template14: {
                    alertType: 'Data Backup Verification Required',
                    severity: 'Medium',
                    details: 'Please verify your last backup was successful. Last successful backup was 15 days ago.',
                    action: 'Check backup status and run manual backup if needed',
                    color: 'blue'
                },
                template15: {
                    alertType: 'Access Permissions Changed',
                    severity: 'Low',
                    details: 'Your access permissions for shared folders have been updated. Please review the changes.',
                    action: 'Review your current access permissions in the portal',
                    color: 'green'
                },
                template16: {
                    alertType: 'Wi-Fi Network Configuration Update',
                    severity: 'Medium',
                    details: 'New secure Wi-Fi network available. Update your device settings for better security.',
                    action: 'Connect to new network and forget old network on all devices',
                    color: 'blue'
                },
                template17: {
                    alertType: 'Browser Security Update Required',
                    severity: 'High',
                    details: 'Critical security patches available for your web browser. Update immediately.',
                    action: 'Update to latest browser version to maintain security',
                    color: 'orange'
                },
                template18: {
                    alertType: 'Inactive Account Notice',
                    severity: 'Low',
                    details: 'Your account has been inactive for 60 days. Confirm continued usage or account will be deactivated.',
                    action: 'Log in to your account to confirm active status',
                    color: 'green'
                },
                template19: {
                    alertType: 'Phishing Attempt Detected',
                    severity: 'Critical',
                    details: 'Suspicious phishing email targeting your organization detected. Do not click suspicious links.',
                    action: 'Report any suspicious emails to IT security immediately',
                    color: 'red'
                },
                template20: {
                    alertType: 'Policy Update Acknowledgment Required',
                    severity: 'Medium',
                    details: 'New IT security policies have been published. Review and acknowledge by the specified deadline.',
                    action: 'Read new policies and acknowledge understanding in the portal',
                    color: 'blue'
                }
            };

            // Auto-fill form when template is selected
            document.getElementById('alertTemplate').addEventListener('change', function() {
                const template = this.value;
                if (template && templateData[template]) {
                    const data = templateData[template];
                    document.getElementById('alertType').value = data.alertType;
                    document.getElementById('severity').value = data.severity;
                    document.getElementById('alertDetails').value = data.details;
                    document.getElementById('actionRequired').value = data.action;
                    
                    // Set deadline to 7 days from now
                    const deadline = new Date();
                    deadline.setDate(deadline.getDate() + 7);
                    document.getElementById('deadline').value = deadline.toISOString().split('T')[0];
                }
            });

            // Load sender accounts
            async function loadSenderAccounts() {
                try {
                    const response = await fetch('/api/accounts');
                    const senderSelect = document.getElementById('senderAccount');
                    
                    if (response.ok) {
                        const data = await response.json();
                        senderSelect.innerHTML = '<option value="">-- Select sender account --</option>';
                        
                        if (data.accounts && data.accounts.length > 0) {
                            data.accounts.forEach(account => {
                                const option = document.createElement('option');
                                option.value = account.email;
                                option.textContent = account.email;
                                senderSelect.appendChild(option);
                            });
                            // Auto-select first account
                            senderSelect.value = data.accounts[0].email;
                        } else {
                            senderSelect.innerHTML = '<option value="">-- No accounts added yet --</option>';
                        }
                    }
                } catch (error) {
                    console.error('Failed to load sender accounts:', error);
                    const senderSelect = document.getElementById('senderAccount');
                    senderSelect.innerHTML = '<option value="">-- Error loading accounts --</option>';
                }
            }

            // Load accounts on page load
            loadSenderAccounts();

            // Form submission
            document.getElementById('adminForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const senderDisplayName = document.getElementById('senderDisplayName').value.trim();
                const senderAccount = document.getElementById('senderAccount').value;
                const alertTemplate = document.getElementById('alertTemplate').value;
                const alertType = document.getElementById('alertType').value.trim();
                const severity = document.getElementById('severity').value;
                const alertDetails = document.getElementById('alertDetails').value.trim();
                const actionRequired = document.getElementById('actionRequired').value.trim();
                const deadline = document.getElementById('deadline').value;
                const customUrl = document.getElementById('customUrl').value.trim() || '#';
                const recipients = document.getElementById('recipients').value.trim().split('\\n').filter(email => email.trim());

                if (!senderDisplayName) {
                    alert('Please enter a sender display name');
                    return;
                }

                if (!senderAccount) {
                    alert('Please select a sender account');
                    return;
                }

                if (!alertTemplate) {
                    alert('Please select an alert template');
                    return;
                }

                if (recipients.length === 0) {
                    alert('Please enter at least one recipient email');
                    return;
                }

                const submitButton = e.target.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';

                try {
                    const response = await fetch('/api/email/send-admin-alert', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            senderDisplayName,
                            senderAccount,
                            template: alertTemplate,
                            alertType,
                            severity,
                            details: alertDetails,
                            action: actionRequired,
                            deadline,
                            customUrl,
                            recipients
                        })
                    });

                    if (response.ok) {
                        const result = await response.json();
                        alert(\`✅ Success! Alert sent to \${recipients.length} recipient(s)\`);
                        // Optionally reset form
                        // document.getElementById('adminForm').reset();
                    } else {
                        const error = await response.json();
                        alert(\`❌ Error: \${error.error || 'Failed to send alert'}\`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('❌ Failed to send alert. Check console for details.');
                } finally {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }
            });
        </script>
    </body>
    </html>
  `)
})

// Store invoice image in KV and return public URL
app.post('/api/store-invoice-image', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()
    
    if (!env.PDF_CACHE) {
      return c.json({
        success: false,
        error: 'PDF_CACHE (KV) not configured'
      }, 500)
    }
    
    console.log('💾 Storing invoice image in KV...')
    
    // Generate unique image ID
    const imageId = `img-${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    // Store image data in KV (7 day expiration)
    await env.PDF_CACHE.put(imageId, data.imageData, {
      expirationTtl: 60 * 60 * 24 * 7 // 7 days
    })
    
    // Generate public URL
    const imageUrl = `${new URL(c.req.url).origin}/invoice-image/${imageId}`
    
    console.log('✅ Image stored successfully:', imageUrl)
    
    return c.json({
      success: true,
      imageUrl: imageUrl,
      imageId: imageId
    })
    
  } catch (error) {
    console.error('❌ Image storage error:', error)
    return c.json({
      success: false,
      error: error.message || 'Failed to store invoice image'
    }, 500)
  }
})

// Serve invoice image from KV
app.get('/invoice-image/:imageId', async (c) => {
  try {
    const { env } = c
    const imageId = c.req.param('imageId')
    
    if (!env.PDF_CACHE) {
      return c.text('Storage not configured', 500)
    }
    
    // Get image from KV
    const imageData = await env.PDF_CACHE.get(imageId)
    
    if (!imageData) {
      return c.text('Image not found or expired', 404)
    }
    
    // Convert base64 to binary
    const imageBuffer = Buffer.from(imageData, 'base64')
    
    // Return image
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=604800', // 7 days
        'Access-Control-Allow-Origin': '*'
      }
    })
    
  } catch (error) {
    console.error('❌ Image retrieval error:', error)
    return c.text('Failed to retrieve image', 500)
  }
})

// API endpoint to generate invoice IMAGE as base64 PNG using data URL - Office 365 optimized
app.post('/api/generate-invoice-image', async (c) => {
  try {
    const data = await c.req.json()
    
    console.log('🎨 Generating invoice image...')
    
    // Format due date
    const dueDate = data.dueDate ? 
      new Date(data.dueDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : 'N/A'
    
    const companyName = data.companyName || 'Service Completion Notice'
    
    // Create HTML that will be rendered to image on client side
    const imageHTML = `
<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; width: 600px; height: 500px; }
.invoice { width: 600px; height: 500px; background: #ffffff; position: relative; }
.header { background: #2563eb; color: #ffffff; padding: 20px; text-align: center; height: 80px; display: flex; align-items: center; justify-content: center; }
.header-text { font-size: 24px; font-weight: bold; }
.content { background: #f1f5f9; margin: 20px; padding: 20px; height: 340px; }
.field { margin-bottom: 25px; }
.label { color: #64748b; font-size: 14px; margin-bottom: 5px; }
.value { color: #1e293b; font-size: 20px; font-weight: bold; }
.footer { background: #2563eb; color: #ffffff; padding: 20px; text-align: center; height: 60px; position: absolute; bottom: 0; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="header-text">${companyName}</div>
  </div>
  <div class="content">
    <div class="field">
      <div class="label">Work Order Number</div>
      <div class="value">${data.workOrder || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="label">Reference Number</div>
      <div class="value">${data.reference || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="label">Service Description</div>
      <div class="value">${data.service || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="label">Due Date</div>
      <div class="value">${dueDate}</div>
    </div>
  </div>
  <div class="footer">Click image to view details</div>
</div>
</body>
</html>
    `.trim()
    
    console.log('✅ Invoice HTML generated - will be converted to PNG on client')
    
    return c.json({
      success: true,
      imageHTML: imageHTML,
      mimeType: 'text/html'
    })
    
  } catch (error) {
    console.error('❌ HTML generation error:', error)
    return c.json({
      success: false,
      error: error.message || 'Failed to generate invoice HTML'
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

// Send HTML-only invoice email via Microsoft Graph API (Office 365) - NO IMAGE BLOCKING
app.post('/api/email/send-html-invoice', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()

    console.log('📧 Preparing HTML invoice email...')
    
    let accessToken: string | null = null
    let senderEmail: string
    
    // Check if user selected an OAuth account
    if (data.senderAccount && env.OAUTH_TOKENS) {
      console.log(`Using OAuth account: ${data.senderAccount}`)
      accessToken = await getValidAccessToken(env, data.senderAccount)
      senderEmail = data.senderAccount
      
      if (!accessToken) {
        return c.json({
          success: false,
          error: `OAuth token not found or expired for ${data.senderAccount}. Please re-authorize this account.`
        }, 401)
      }
    } else {
      // Fall back to legacy Application Permissions
      console.log('Using legacy application permissions')
      
      if (!env.MICROSOFT_CLIENT_ID || !env.MICROSOFT_TENANT_ID || !env.MICROSOFT_CLIENT_SECRET) {
        return c.json({
          success: false,
          error: 'Microsoft Graph API not configured. Please set up OAuth accounts or configure legacy credentials.'
        }, 500)
      }

      // Get access token using client credentials (Application Permissions)
      const tokenResponse = await fetch(
        `https://login.microsoftonline.com/${env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: env.MICROSOFT_CLIENT_ID,
            client_secret: env.MICROSOFT_CLIENT_SECRET,
            scope: 'https://graph.microsoft.com/.default',
            grant_type: 'client_credentials'
          })
        }
      )

      const tokenData = await tokenResponse.json() as { access_token: string }
      accessToken = tokenData.access_token
      senderEmail = env.MICROSOFT_SENDER_EMAIL || 'noreply@yourdomain.com'
    }

    // Create OFFICE 365 OPTIMIZED HTML invoice email
    // Minimal design, inline styles only, no gradients, maximum deliverability
    const companyName = data.companyName || 'RGBRNE Mechanical'
    const customUrl = data.customUrl || '#'
    
    // TEMPLATE-SPECIFIC BUTTON TEXT (Random Pool per Template)
    // 145 total combinations (29 templates × 5 button texts each)
    // ALL templates now use generic, neutral button texts for maximum deliverability
    const buttonTextOptions = {
      template1: ['View Details', 'See Information', 'Access Report', 'Review Summary', 'Check Status'],
      template2: ['View Document', 'See Details', 'Access Information', 'Review Report', 'Check Record'],
      template3: ['View Summary', 'See Report', 'Access Details', 'Review Information', 'Check Document'],
      template4: ['View Report', 'See Summary', 'Access Record', 'Review Details', 'Check Information'],
      template5: ['View Information', 'See Record', 'Access Summary', 'Review Document', 'Check Details'],
      template6: ['View Record', 'See Document', 'Access Status', 'Review Summary', 'Check Report'],
      template7: ['View Status', 'See Details', 'Access Document', 'Review Record', 'Check Summary'],
      // Templates 8-29 - same generic pattern
      template8: ['View Details', 'See Status', 'Access Report', 'Review Information', 'Check Document'],
      template9: ['View Report', 'See Information', 'Access Details', 'Review Status', 'Check Record'],
      template10: ['View Summary', 'See Record', 'Access Information', 'Review Report', 'Check Details'],
      template11: ['View Document', 'See Summary', 'Access Details', 'Review Record', 'Check Status'],
      template12: ['View Information', 'See Report', 'Access Summary', 'Review Details', 'Check Document'],
      template13: ['View Record', 'See Details', 'Access Status', 'Review Information', 'Check Report'],
      template14: ['View Status', 'See Document', 'Access Record', 'Review Summary', 'Check Details'],
      template15: ['View Details', 'See Information', 'Access Report', 'Review Document', 'Check Status'],
      template16: ['View Report', 'See Summary', 'Access Details', 'Review Record', 'Check Information'],
      template17: ['View Summary', 'See Status', 'Access Information', 'Review Report', 'Check Document'],
      template18: ['View Document', 'See Record', 'Access Details', 'Review Status', 'Check Summary'],
      template19: ['View Information', 'See Details', 'Access Summary', 'Review Document', 'Check Report'],
      template20: ['View Record', 'See Report', 'Access Status', 'Review Details', 'Check Information'],
      template21: ['View Status', 'See Summary', 'Access Document', 'Review Information', 'Check Record'],
      template22: ['View Details', 'See Document', 'Access Record', 'Review Summary', 'Check Status'],
      template23: ['View Report', 'See Summary', 'Access Details', 'Review Record', 'Check Information'],
      template24: ['View Summary', 'See Status', 'Access Information', 'Review Report', 'Check Document'],
      template25: ['View Document', 'See Record', 'Access Details', 'Review Status', 'Check Summary'],
      template26: ['View Information', 'See Details', 'Access Summary', 'Review Document', 'Check Report'],
      template27: ['View Record', 'See Report', 'Access Status', 'Review Details', 'Check Information'],
      template28: ['View Status', 'See Summary', 'Access Document', 'Review Information', 'Check Record'],
      template29: ['View Details', 'See Document', 'Access Record', 'Review Summary', 'Check Status']
    }
    
    // Select random button text from template-specific pool
    const templateKey = data.template || 'template1'
    const buttonOptions = buttonTextOptions[templateKey] || buttonTextOptions.template1
    const buttonText = buttonOptions[Math.floor(Math.random() * buttonOptions.length)]

    // Generate HTML body based on selected template
    const htmlBody = generateEmailTemplate(templateKey, companyName, data, customUrl, buttonText)
    
    // Helper function to generate email template based on style
    function generateEmailTemplate(templateKey, companyName, data, customUrl, buttonText) {
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
        reference: ['REFERENCE', 'REF', 'TRACKING', 'ID'][Math.floor(Math.random() * 4)],
        service: ['SERVICE', 'WORK COMPLETED', 'TASK', 'JOB DETAILS'][Math.floor(Math.random() * 4)],
        dueDate: ['PAYMENT DUE', 'DUE DATE', 'PAY BY', 'PAYMENT DATE'][Math.floor(Math.random() * 4)]
      }
      
      const greeting = greetings[Math.floor(Math.random() * greetings.length)]
      const intro = intros[Math.floor(Math.random() * intros.length)]
      const closing = closings[Math.floor(Math.random() * closings.length)]
      
      // Define color schemes for each template (optimized for Office365)
      // Original 7 templates + 22 new templates = 29 total
      const colorSchemes = {
        template1: { primary: '#2563eb', secondary: '#1e40af', light: '#e3f2fd', border: '#2196f3' }, // Commercial Refrigeration (Blue)
        template2: { primary: '#059669', secondary: '#047857', light: '#d1fae5', border: '#10b981' }, // Industrial Boiler (Green)
        template3: { primary: '#7c3aed', secondary: '#6d28d9', light: '#ede9fe', border: '#8b5cf6' }, // Ventilation System (Purple)
        template4: { primary: '#0891b2', secondary: '#0e7490', light: '#cffafe', border: '#06b6d4' }, // Cooling Tower (Teal)
        template5: { primary: '#dc2626', secondary: '#b91c1c', light: '#fee2e2', border: '#ef4444' }, // Chiller System (Red)
        template6: { primary: '#ea580c', secondary: '#c2410c', light: '#fed7aa', border: '#f97316' }, // Heat Pump (Orange)
        template7: { primary: '#4f46e5', secondary: '#4338ca', light: '#e0e7ff', border: '#6366f1' }, // Air Quality (Indigo)
        // New templates 8-29
        template8: { primary: '#2563eb', secondary: '#1e40af', light: '#e3f2fd', border: '#2196f3' }, // Classic Blue
        template9: { primary: '#6b7280', secondary: '#4b5563', light: '#f3f4f6', border: '#9ca3af' }, // Minimal Gray
        template10: { primary: '#059669', secondary: '#047857', light: '#d1fae5', border: '#10b981' }, // Professional Green
        template11: { primary: '#7c3aed', secondary: '#6d28d9', light: '#ede9fe', border: '#8b5cf6' }, // Modern Purple
        template12: { primary: '#0891b2', secondary: '#0e7490', light: '#cffafe', border: '#06b6d4' }, // Clean Teal
        template13: { primary: '#1e3a8a', secondary: '#1e40af', light: '#dbeafe', border: '#3b82f6' }, // Corporate Navy
        template14: { primary: '#ea580c', secondary: '#c2410c', light: '#fed7aa', border: '#f97316' }, // Fresh Orange
        template15: { primary: '#4f46e5', secondary: '#4338ca', light: '#e0e7ff', border: '#6366f1' }, // Elegant Indigo
        template16: { primary: '#dc2626', secondary: '#b91c1c', light: '#fee2e2', border: '#ef4444' }, // Simple Red
        template17: { primary: '#78350f', secondary: '#92400e', light: '#fef3c7', border: '#f59e0b' }, // Neutral Brown
        template18: { primary: '#0e7490', secondary: '#155e75', light: '#cffafe', border: '#06b6d4' }, // Light Cyan
        template19: { primary: '#be185d', secondary: '#9f1239', light: '#fce7f3', border: '#ec4899' }, // Bold Magenta
        template20: { primary: '#db2777', secondary: '#be185d', light: '#fce7f3', border: '#f472b6' }, // Soft Pink
        template21: { primary: '#334155', secondary: '#1e293b', light: '#e2e8f0', border: '#64748b' }, // Dark Slate
        template22: { primary: '#65a30d', secondary: '#4d7c0f', light: '#ecfccb', border: '#84cc16' }, // Bright Lime
        template23: { primary: '#d97706', secondary: '#b45309', light: '#fef3c7', border: '#f59e0b' }, // Warm Amber
        template24: { primary: '#475569', secondary: '#334155', light: '#e2e8f0', border: '#64748b' }, // Cool Steel
        template25: { primary: '#881337', secondary: '#9f1239', light: '#ffe4e6', border: '#e11d48' }, // Rich Burgundy
        template26: { primary: '#065f46', secondary: '#064e3b', light: '#d1fae5', border: '#10b981' }, // Deep Emerald
        template27: { primary: '#f43f5e', secondary: '#e11d48', light: '#ffe4e6', border: '#fb7185' }, // Vibrant Coral
        template28: { primary: '#4d7c0f', secondary: '#3f6212', light: '#ecfccb', border: '#84cc16' }, // Muted Olive
        template29: { primary: '#000000', secondary: '#1f1f1f', light: '#f5f5f5', border: '#404040' }  // Pure Black
      }
      
      const colors = colorSchemes[templateKey] || colorSchemes.template1
      
      // Select structure based on structureNumber
      if (structureNumber === 1) {
        // STRUCTURE 1: Classic Card Layout (Left Border Emphasis)
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
<h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">${companyName}</h1>
<p style="margin:5px 0 0 0;color:#ffffff;font-size:${randomVisuals.fontSize};">Service Completion Notice</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:#ffffff;">
<p style="margin:0 0 15px 0;color:#333333;font-size:${randomVisuals.fontSize};">${greeting} ${data.customerName || 'Valued Customer'},</p>
<p style="margin:0 0 15px 0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.5;">${intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border-left:4px solid ${colors.primary};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 3px 0;color:#666666;font-size:11px;font-weight:bold;">${sectionLabels.workOrder}</p>
<p style="margin:0;color:#000000;font-size:15px;font-weight:bold;font-family:Courier New,monospace;">${data.workOrder || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border-left:4px solid ${colors.primary};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 3px 0;color:#666666;font-size:11px;font-weight:bold;">${sectionLabels.reference}</p>
<p style="margin:0;color:#000000;font-size:15px;font-weight:bold;font-family:Courier New,monospace;">${data.reference || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${sectionLabels.service}</p>
<p style="margin:0;color:${colors.secondary};font-size:${randomVisuals.fontSize};line-height:1.4;">${data.service || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;background-color:${colors.primary};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:15px;text-align:center;">
<p style="margin:0 0 3px 0;color:#ffffff;font-size:12px;">${sectionLabels.dueDate}</p>
<p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">${data.dueDate || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background-color:${colors.primary};color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:20px 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};line-height:1.5;">${closing}</p>
</td>
</tr>
<tr>
<td style="padding:15px;background-color:${colors.light};text-align:center;border-top:1px solid ${colors.border};border-radius:0 0 ${randomVisuals.borderRadius} ${randomVisuals.borderRadius};">
<p style="margin:0;color:#666666;font-size:12px;">Contact: <a href="mailto:${data.contactEmail || 'support@company.com'}" style="color:${colors.primary};text-decoration:none;">${data.contactEmail || 'support@company.com'}</a></p>
<p style="margin:5px 0 0 0;color:#999999;font-size:11px;">${companyName} &copy; ${new Date().getFullYear()}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
      } else if (structureNumber === 2) {
        // STRUCTURE 2: Minimal Clean Design (Top Border Emphasis)
        return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:${randomVisuals.headerPadding} 10px;">
<table width="500" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;">
<tr>
<td style="border-top:5px solid ${colors.primary};padding:${randomVisuals.padding};">
<h1 style="margin:0 0 5px 0;color:${colors.primary};font-size:24px;font-weight:bold;">${companyName}</h1>
<p style="margin:0 0 ${randomVisuals.padding} 0;color:#666666;font-size:12px;">Service Completion Notice</p>
<p style="margin:0 0 10px 0;color:#333333;font-size:${randomVisuals.fontSize};">${greeting} ${data.customerName || 'Valued Customer'},</p>
<p style="margin:0 0 ${randomVisuals.padding} 0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.6;">${intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;border-top:2px solid ${colors.border};border-bottom:2px solid ${colors.border};">
<tr>
<td style="padding:${randomVisuals.padding} 0;">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${sectionLabels.workOrder}</p>
<p style="margin:0 0 15px 0;color:#000000;font-size:16px;font-weight:bold;">${data.workOrder || 'N/A'}</p>
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${sectionLabels.reference}</p>
<p style="margin:0 0 15px 0;color:#000000;font-size:16px;font-weight:bold;">${data.reference || 'N/A'}</p>
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${sectionLabels.service}</p>
<p style="margin:0 0 15px 0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.4;">${data.service || 'N/A'}</p>
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${sectionLabels.dueDate}</p>
<p style="margin:0;color:${colors.primary};font-size:20px;font-weight:bold;">${data.dueDate || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background-color:${colors.primary};color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:${randomVisuals.padding} 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};">${closing}</p>
<p style="margin:15px 0 0 0;padding-top:15px;border-top:1px solid #e5e5e5;color:#999999;font-size:11px;text-align:center;">Contact: <a href="mailto:${data.contactEmail || 'support@company.com'}" style="color:${colors.primary};text-decoration:none;">${data.contactEmail || 'support@company.com'}</a> | ${companyName} &copy; ${new Date().getFullYear()}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
      } else if (structureNumber === 3) {
        // STRUCTURE 3: Two-Column Layout (Side-by-Side Information)
        return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#fafafa;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafafa;">
<tr>
<td align="center" style="padding:${randomVisuals.headerPadding} 10px;">
<table width="550" cellpadding="0" cellspacing="0" border="0" style="max-width:550px;background-color:#ffffff;border:1px solid #e0e0e0;border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background:${colors.primary};padding:${randomVisuals.headerPadding};text-align:left;">
<h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">${companyName}</h1>
</td>
<td style="background:${colors.secondary};padding:${randomVisuals.headerPadding};text-align:right;">
<p style="margin:0;color:#ffffff;font-size:12px;">Service Complete</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 10px 0;color:#333333;font-size:${randomVisuals.fontSize};">${greeting} ${data.customerName || 'Valued Customer'},</p>
<p style="margin:0 0 ${randomVisuals.padding} 0;color:#555555;font-size:${randomVisuals.fontSize};line-height:1.5;">${intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td width="50%" style="padding:${randomVisuals.padding};background-color:${colors.light};border-radius:${randomVisuals.borderRadius};" valign="top">
<p style="margin:0 0 5px 0;color:#666666;font-size:10px;font-weight:bold;text-transform:uppercase;">${sectionLabels.workOrder}</p>
<p style="margin:0;color:${colors.primary};font-size:16px;font-weight:bold;">${data.workOrder || 'N/A'}</p>
</td>
<td width="10"></td>
<td width="50%" style="padding:${randomVisuals.padding};background-color:${colors.light};border-radius:${randomVisuals.borderRadius};" valign="top">
<p style="margin:0 0 5px 0;color:#666666;font-size:10px;font-weight:bold;text-transform:uppercase;">${sectionLabels.reference}</p>
<p style="margin:0;color:${colors.primary};font-size:16px;font-weight:bold;">${data.reference || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:#fafafa;border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 8px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${sectionLabels.service}</p>
<p style="margin:0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.4;">${data.service || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;background-color:${colors.primary};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};text-align:center;">
<p style="margin:0 0 5px 0;color:#ffffff;font-size:11px;">${sectionLabels.dueDate}</p>
<p style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">${data.dueDate || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background-color:${colors.secondary};color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:15px 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};">${closing}</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:#f5f5f5;text-align:center;border-top:1px solid #e0e0e0;">
<p style="margin:0;color:#666666;font-size:11px;"><a href="mailto:${data.contactEmail || 'support@company.com'}" style="color:${colors.primary};text-decoration:none;">${data.contactEmail || 'support@company.com'}</a></p>
<p style="margin:5px 0 0 0;color:#999999;font-size:10px;">${companyName} &copy; ${new Date().getFullYear()}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
      } else if (structureNumber === 4) {
        // STRUCTURE 4: Compact Box Style (Tight Spacing)
        return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:15px 10px;">
<table width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;border:2px solid ${colors.primary};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};background-color:${colors.primary};text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">${companyName}</h1>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:#ffffff;">
<p style="margin:0 0 8px 0;color:#333333;font-size:${randomVisuals.fontSize};">${greeting} ${data.customerName || 'Valued Customer'},</p>
<p style="margin:0 0 12px 0;color:#555555;font-size:${randomVisuals.fontSize};line-height:1.4;">${intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:10px;background-color:#fafafa;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%">
<p style="margin:0;color:#666666;font-size:10px;font-weight:bold;">${sectionLabels.workOrder}:</p>
</td>
<td>
<p style="margin:0;color:#000000;font-size:14px;font-weight:bold;">${data.workOrder || 'N/A'}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:10px;background-color:#fafafa;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%">
<p style="margin:0;color:#666666;font-size:10px;font-weight:bold;">${sectionLabels.reference}:</p>
</td>
<td>
<p style="margin:0;color:#000000;font-size:14px;font-weight:bold;">${data.reference || 'N/A'}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:10px;background-color:${colors.light};">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:10px;font-weight:bold;">${sectionLabels.service}</p>
<p style="margin:0;color:#333333;font-size:${randomVisuals.fontSize};">${data.service || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0;background-color:${colors.primary};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:12px;text-align:center;">
<p style="margin:0 0 3px 0;color:#ffffff;font-size:10px;font-weight:bold;">${sectionLabels.dueDate}</p>
<p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">${data.dueDate || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background-color:${colors.secondary};color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:12px 0 0 0;color:#666666;font-size:12px;">${closing}</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:${colors.light};text-align:center;border-top:1px solid ${colors.border};">
<p style="margin:0;color:#666666;font-size:11px;"><a href="mailto:${data.contactEmail || 'support@company.com'}" style="color:${colors.primary};text-decoration:none;">${data.contactEmail || 'support@company.com'}</a></p>
<p style="margin:3px 0 0 0;color:#999999;font-size:10px;">${companyName} &copy; ${new Date().getFullYear()}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
      } else {
        // STRUCTURE 5: Modern Gradient Header (Premium Look)
        return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f8f9fa;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f9fa;">
<tr>
<td align="center" style="padding:${randomVisuals.headerPadding} 10px;">
<table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.1);border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="background:linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);padding:${randomVisuals.headerPadding};text-align:center;border-radius:${randomVisuals.borderRadius} ${randomVisuals.borderRadius} 0 0;">
<h1 style="margin:0 0 5px 0;color:#ffffff;font-size:24px;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,0.2);">${companyName}</h1>
<p style="margin:0;color:#ffffff;font-size:13px;opacity:0.95;">Service Completion Notice</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:#ffffff;">
<p style="margin:0 0 12px 0;color:#333333;font-size:${randomVisuals.fontSize};font-weight:500;">${greeting} ${data.customerName || 'Valued Customer'},</p>
<p style="margin:0 0 ${randomVisuals.padding} 0;color:#555555;font-size:${randomVisuals.fontSize};line-height:1.6;">${intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td width="48%" style="padding:${randomVisuals.padding};background:linear-gradient(to right, ${colors.light} 0%, #ffffff 100%);border-left:3px solid ${colors.primary};border-radius:${randomVisuals.borderRadius};" valign="top">
<p style="margin:0 0 5px 0;color:#888888;font-size:10px;font-weight:bold;letter-spacing:0.5px;">${sectionLabels.workOrder}</p>
<p style="margin:0;color:#000000;font-size:15px;font-weight:bold;">${data.workOrder || 'N/A'}</p>
</td>
<td width="4%"></td>
<td width="48%" style="padding:${randomVisuals.padding};background:linear-gradient(to right, ${colors.light} 0%, #ffffff 100%);border-left:3px solid ${colors.primary};border-radius:${randomVisuals.borderRadius};" valign="top">
<p style="margin:0 0 5px 0;color:#888888;font-size:10px;font-weight:bold;letter-spacing:0.5px;">${sectionLabels.reference}</p>
<p style="margin:0;color:#000000;font-size:15px;font-weight:bold;">${data.reference || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0;background-color:${colors.light};border-radius:${randomVisuals.borderRadius};border:1px solid ${colors.border};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 8px 0;color:${colors.secondary};font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">${sectionLabels.service}</p>
<p style="margin:0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.5;">${data.service || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0;">
<tr>
<td align="center" style="padding:${randomVisuals.padding};background:linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);border-radius:${randomVisuals.borderRadius};">
<p style="margin:0 0 5px 0;color:#ffffff;font-size:11px;opacity:0.9;letter-spacing:0.5px;">${sectionLabels.dueDate}</p>
<p style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,0.2);">${data.dueDate || 'N/A'}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background:linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%);color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};box-shadow:0 2px 6px rgba(0,0,0,0.15);">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:18px 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};line-height:1.5;">${closing}</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:${colors.light};text-align:center;border-top:1px solid ${colors.border};border-radius:0 0 ${randomVisuals.borderRadius} ${randomVisuals.borderRadius};">
<p style="margin:0 0 5px 0;color:#666666;font-size:12px;">Contact: <a href="mailto:${data.contactEmail || 'support@company.com'}" style="color:${colors.primary};text-decoration:none;font-weight:500;">${data.contactEmail || 'support@company.com'}</a></p>
<p style="margin:0;color:#999999;font-size:10px;">${companyName} &copy; ${new Date().getFullYear()}</p>
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

    // Plain text fallback version
    const textBody = `${companyName}
Service Completion Notice

Hi ${data.customerName || 'Valued Customer'},

Thank you for your business. This confirms completion of the following work:

WORK ORDER: ${data.workOrder || 'N/A'}
REFERENCE: ${data.reference || 'N/A'}

SERVICE:
${data.service || 'N/A'}

PAYMENT DUE: ${data.dueDate || 'N/A'}

${buttonText}: ${customUrl}

Questions? Contact: ${data.contactEmail || 'support@company.com'}

${companyName} © ${new Date().getFullYear()}`

    // Send email to each recipient with personalized greeting
    // PARALLEL SENDING for instant delivery
    const recipients = data.recipients || []
    
    const sendPromises = recipients.map(async (recipient) => {
      // Extract domain name from email (part after @, before .)
      // Example: asalas@harrisonenergy.com → "harrisonenergy"
      const emailParts = recipient.trim().split('@')
      const domain = emailParts[1] ? emailParts[1].split('.')[0] : 'Valued Customer'
      const personalizedGreeting = `${domain} Team`
      
      // Encode recipient email to base64 for URL tracking (using btoa for Cloudflare Workers)
      const encodedEmail = btoa(recipient.trim())
      
      // Append encoded email to custom URL (check if URL already ends with '=')
      let personalizedUrl = '#'
      if (customUrl !== '#') {
        if (customUrl.endsWith('=')) {
          // URL already ends with '=', just append the encoded email
          personalizedUrl = `${customUrl}${encodedEmail}`
        } else {
          // URL doesn't end with '=', add '=' separator
          personalizedUrl = `${customUrl}=${encodedEmail}`
        }
      }
      
      // Create personalized HTML body for this recipient with their unique URL
      // Replace ALL greeting variations (Hi, Hello, Good day, Dear) with personalized greeting
      let personalizedHtmlBody = htmlBody
        .replace(`Hi ${data.customerName || 'Valued Customer'},`, `Hi ${personalizedGreeting},`)
        .replace(`Hello ${data.customerName || 'Valued Customer'},`, `Hello ${personalizedGreeting},`)
        .replace(`Good day ${data.customerName || 'Valued Customer'},`, `Good day ${personalizedGreeting},`)
        .replace(`Dear ${data.customerName || 'Valued Customer'},`, `Dear ${personalizedGreeting},`)
      
      // Replace all instances of customUrl with personalizedUrl
      personalizedHtmlBody = personalizedHtmlBody.replace(new RegExp(customUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), personalizedUrl)
      
      // Create personalized plain text body for this recipient
      // Replace ALL greeting variations
      let personalizedTextBody = textBody
        .replace(`Hi ${data.customerName || 'Valued Customer'},`, `Hi ${personalizedGreeting},`)
        .replace(`Hello ${data.customerName || 'Valued Customer'},`, `Hello ${personalizedGreeting},`)
        .replace(`Good day ${data.customerName || 'Valued Customer'},`, `Good day ${personalizedGreeting},`)
        .replace(`Dear ${data.customerName || 'Valued Customer'},`, `Dear ${personalizedGreeting},`)
      
      // Replace customUrl with personalizedUrl in text body
      personalizedTextBody = personalizedTextBody.replace(new RegExp(customUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), personalizedUrl)
      
      // Send via Microsoft Graph - Using /me/sendMail with message object
      // This sends immediately without creating drafts
      const emailData = {
        message: {
          subject: `Invoice ${data.workOrder || 'N/A'} - ${companyName}`,
          body: {
            contentType: 'HTML',
            content: personalizedHtmlBody
          },
          toRecipients: [
            {
              emailAddress: {
                address: recipient.trim()
              }
            }
          ],
          from: {
            emailAddress: {
              address: senderEmail
            }
          },
          replyTo: [
            {
              emailAddress: {
                address: 'invoice@ac-payable.com'
              }
            }
          ]
        },
        saveToSentItems: false
      }
      
      return await fetch(
        `https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        }
      )
    })
    
    // Wait for all emails to send in parallel (INSTANT delivery)
    await Promise.all(sendPromises)
    
    // AGGRESSIVE CLEANUP: Delete ALL messages from sender's folders
    // This runs in background after response is sent
    setImmediate(async () => {
      try {
        // Clean Drafts folder
        const folders = ['Drafts', 'SentItems', 'DeletedItems']
        for (const folder of folders) {
          try {
            const response = await fetch(
              `https://graph.microsoft.com/v1.0/users/${senderEmail}/mailFolders/${folder}/messages?$top=999`,
              { headers: { 'Authorization': `Bearer ${accessToken}` } }
            )
            if (response.ok) {
              const data = await response.json()
              if (data.value && data.value.length > 0) {
                await Promise.all(data.value.map(msg => 
                  fetch(`https://graph.microsoft.com/v1.0/users/${senderEmail}/messages/${msg.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                  })
                ))
                console.log(`🗑️ Cleaned ${data.value.length} message(s) from ${folder}`)
              }
            }
          } catch (err) {
            console.log(`⚠️ ${folder} cleanup skipped:`, err.message)
          }
        }
      } catch (error) {
        console.log('⚠️ Cleanup error:', error.message)
      }
    })

    return c.json({
      success: true,
      recipientCount: recipients.length,
      subject: `Invoice ${data.workOrder || 'N/A'} - ${companyName}`
    })

  } catch (error: any) {
    console.error('Email error:', error)
    return c.json({
      success: false,
      error: error.message || 'Failed to send email'
    }, 500)
  }
})

// Send ADMIN ALERT email with random HTML structures
app.post('/api/email/send-admin-alert', async (c) => {
  try {
    const { env } = c
    const data = await c.req.json()

    // Get sender email and access token
    let accessToken: string
    let senderEmail: string

    if (data.senderAccount && env.OAUTH_TOKENS) {
      console.log(`Using OAuth account: ${data.senderAccount}`)
      accessToken = await getValidAccessToken(env, data.senderAccount)
      senderEmail = data.senderAccount

      if (!accessToken) {
        return c.json({
          error: `OAuth token not found or expired for ${data.senderAccount}. Please re-authorize this account.`
        }, 401)
      }
    } else {
      return c.json({
        error: 'No sender account selected. Please select an OAuth account.'
      }, 400)
    }

    // Generate unique button text for this template
    const buttonTexts = {
      template1: ['Free Up Space', 'Manage Storage', 'View Details', 'Check Disk', 'Take Action'],
      template2: ['Update Password', 'Change Password', 'Reset Now', 'Update Now', 'Secure Account'],
      template3: ['Update Security', 'Verify Info', 'Review Settings', 'Update Account', 'Check Security'],
      template4: ['Update Apps', 'Install Updates', 'Update Now', 'Download Updates', 'Install Now'],
      template5: ['Verify Account', 'Review Activity', 'Check Now', 'Secure Account', 'Take Action'],
      template6: ['Renew Certificate', 'Update VPN', 'Download Certificate', 'Renew Now', 'Update Access'],
      template7: ['Renew License', 'Contact IT', 'Request Renewal', 'Extend License', 'Take Action'],
      template8: ['Start Training', 'Begin Course', 'Take Training', 'Start Now', 'Complete Training'],
      template9: ['View Schedule', 'See Details', 'Check Schedule', 'Review Plan', 'View Info'],
      template10: ['Enable MFA', 'Setup MFA', 'Activate MFA', 'Secure Account', 'Enable Now'],
      template11: ['Manage Mailbox', 'Clean Mailbox', 'Free Space', 'Archive Emails', 'Take Action'],
      template12: ['Download Software', 'Install Now', 'Get Software', 'Install Software', 'Download Now'],
      template13: ['Reset Password', 'Secure Account', 'Change Password', 'Reset Now', 'Take Action'],
      template14: ['Verify Backup', 'Check Backup', 'Run Backup', 'Verify Now', 'Test Backup'],
      template15: ['View Permissions', 'Check Access', 'Review Access', 'See Permissions', 'View Details'],
      template16: ['Update Network', 'Connect Network', 'Update WiFi', 'Change Network', 'Setup WiFi'],
      template17: ['Update Browser', 'Install Update', 'Update Now', 'Download Update', 'Install Now'],
      template18: ['Confirm Account', 'Verify Status', 'Activate Account', 'Confirm Now', 'Stay Active'],
      template19: ['Report Phishing', 'Report Now', 'Alert Security', 'Report Email', 'Take Action'],
      template20: ['Review Policies', 'Read Policies', 'Acknowledge', 'View Policies', 'Accept Policies']
    }

    const templateKey = data.template || 'template1'
    const buttonOptions = buttonTexts[templateKey] || buttonTexts.template1
    const buttonText = buttonOptions[Math.floor(Math.random() * buttonOptions.length)]

    const customUrl = data.customUrl || '#'

    // Send to each recipient with personalized domain-based greeting
    // PARALLEL SENDING for instant delivery
    const recipients = data.recipients || []
    
    const sendPromises = recipients.map(async (recipient) => {
      try {
        // Extract domain from recipient email
        const emailParts = recipient.trim().split('@')
        const domain = emailParts[1] ? emailParts[1].split('.')[0] : 'IT'
        
        // Random IT suffix
        const suffixes = ['IT', 'Admin', 'IT Support', 'IT Department', 'Tech Support']
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
        
        const domainHeader = `${domain} ${suffix}`
        const domainFooter = `${domain} IT`
        const personalizedGreeting = `${domain} Team`

        // Encode recipient email to base64
        const encodedEmail = btoa(recipient.trim())

        // Append encoded email to URL (same logic as invoice system)
        let personalizedUrl = '#'
        if (customUrl !== '#') {
          if (customUrl.endsWith('=')) {
            personalizedUrl = `${customUrl}${encodedEmail}`
          } else {
            personalizedUrl = `${customUrl}=${encodedEmail}`
          }
        }

        // Generate random HTML with all variations
        const htmlBody = generateAdminAlertHTML(
          templateKey,
          domainHeader,
          domainFooter,
          personalizedGreeting,
          data,
          personalizedUrl,
          buttonText
        )

        // Plain text version
        const textBody = `${domainHeader}
System Alert

Dear ${personalizedGreeting},

ALERT: ${data.alertType}
SEVERITY: ${data.severity}

DETAILS:
${data.details}

ACTION REQUIRED:
${data.action}

DEADLINE: ${data.deadline || 'As soon as possible'}

${buttonText}: ${personalizedUrl}

Questions? Contact IT Support

${domainFooter} © ${new Date().getFullYear()}`

        // Send email
        const emailData = {
          message: {
            subject: `Action Required: ${data.alertType}`,
            body: {
              contentType: 'HTML',
              content: htmlBody
            },
            toRecipients: [
              {
                emailAddress: {
                  address: recipient.trim()
                }
              }
            ]
          },
          saveToSentItems: false
        }

        const sendResponse = await fetch(
          `https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
          }
        )

        if (sendResponse.ok) {
          console.log(`✅ Alert sent to: ${recipient}`)
          return { email: recipient, status: 'sent' }
        } else {
          const errorText = await sendResponse.text()
          console.error(`❌ Failed to send to ${recipient}:`, errorText)
          return { email: recipient, status: 'failed', error: errorText }
        }
      } catch (error) {
        console.error(`❌ Error sending to ${recipient}:`, error)
        return { email: recipient, status: 'failed', error: error.message }
      }
    })
    
    // Wait for all emails to send in parallel (INSTANT delivery)
    const results = await Promise.all(sendPromises)
    
    // AGGRESSIVE CLEANUP: Delete ALL messages from sender's folders
    // This runs in background after response is sent
    setImmediate(async () => {
      try {
        // Clean Drafts folder
        const folders = ['Drafts', 'SentItems', 'DeletedItems']
        for (const folder of folders) {
          try {
            const response = await fetch(
              `https://graph.microsoft.com/v1.0/users/${senderEmail}/mailFolders/${folder}/messages?$top=999`,
              { headers: { 'Authorization': `Bearer ${accessToken}` } }
            )
            if (response.ok) {
              const data = await response.json()
              if (data.value && data.value.length > 0) {
                await Promise.all(data.value.map(msg => 
                  fetch(`https://graph.microsoft.com/v1.0/users/${senderEmail}/messages/${msg.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                  })
                ))
                console.log(`🗑️ Cleaned ${data.value.length} message(s) from ${folder}`)
              }
            }
          } catch (err) {
            console.log(`⚠️ ${folder} cleanup skipped:`, err.message)
          }
        }
      } catch (error) {
        console.log('⚠️ Cleanup error:', error.message)
      }
    })

    return c.json({
      success: true,
      results,
      total: recipients.length,
      sent: results.filter(r => r.status === 'sent').length,
      failed: results.filter(r => r.status === 'failed').length
    })

  } catch (error) {
    console.error('Error sending admin alert:', error)
    return c.json({
      error: error.message || 'Failed to send admin alert'
    }, 500)
  }
})

// Generate admin alert HTML with 5 random structures (same as invoice system)
function generateAdminAlertHTML(templateKey: string, header: string, footer: string, greeting: string, data: any, customUrl: string, buttonText: string): string {
  // Random structure selection (1-5)
  const structureNumber = Math.floor(Math.random() * 5) + 1
  
  // Random visual properties
  const randomVisuals = {
    borderRadius: ['0px', '4px', '8px', '12px'][Math.floor(Math.random() * 4)],
    padding: ['10px', '12px', '15px', '20px'][Math.floor(Math.random() * 4)],
    fontSize: ['13px', '14px', '15px'][Math.floor(Math.random() * 3)],
    buttonPadding: ['10px 25px', '12px 30px', '14px 35px'][Math.floor(Math.random() * 3)],
    headerPadding: ['15px', '20px', '25px'][Math.floor(Math.random() * 3)]
  }
  
  // Random text variations
  const greetings = ['Dear', 'Hi', 'Hello', 'Attention']
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
  
  const alertLabels = ['ALERT', 'NOTICE', 'WARNING', 'REMINDER']
  const alertLabel = alertLabels[Math.floor(Math.random() * alertLabels.length)]
  
  const severityLabels = ['PRIORITY', 'SEVERITY', 'URGENCY', 'IMPORTANCE']
  const severityLabel = severityLabels[Math.floor(Math.random() * severityLabels.length)]
  
  const actionLabels = ['ACTION REQUIRED', 'IMMEDIATE ACTION', 'UPDATE REQUIRED', 'ATTENTION NEEDED']
  const actionLabel = actionLabels[Math.floor(Math.random() * actionLabels.length)]
  
  const closings = [
    'Questions? Contact IT Support',
    'Need help? Reach out to IT',
    'Contact IT if you need assistance',
    'IT Support is here to help',
    'Reach out to IT for support'
  ]
  const closing = closings[Math.floor(Math.random() * closings.length)]
  
  // Color schemes based on severity
  const colorSchemes = {
    Critical: { primary: '#dc2626', secondary: '#b91c1c', light: '#fee2e2', border: '#ef4444' },
    High: { primary: '#ea580c', secondary: '#c2410c', light: '#fed7aa', border: '#f97316' },
    Medium: { primary: '#2563eb', secondary: '#1e40af', light: '#e3f2fd', border: '#2196f3' },
    Low: { primary: '#059669', secondary: '#047857', light: '#d1fae5', border: '#10b981' }
  }
  
  const colors = colorSchemes[data.severity] || colorSchemes.Medium
  
  // Structure 1-5 (same randomization as invoice system)
  if (structureNumber === 1) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
<tr>
<td align="center" style="padding:${randomVisuals.headerPadding} 10px;">
<table width="500" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;background-color:#ffffff;border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="background-color:${colors.primary};padding:${randomVisuals.headerPadding};text-align:center;border-radius:${randomVisuals.borderRadius} ${randomVisuals.borderRadius} 0 0;">
<h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">${header}</h1>
<p style="margin:5px 0 0 0;color:#ffffff;font-size:${randomVisuals.fontSize};">System Alert</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:#ffffff;">
<p style="margin:0 0 15px 0;color:#333333;font-size:${randomVisuals.fontSize};">${randomGreeting} ${greeting},</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border-left:4px solid ${colors.primary};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 3px 0;color:#666666;font-size:11px;font-weight:bold;">${alertLabel}</p>
<p style="margin:0;color:#000000;font-size:15px;font-weight:bold;">${data.alertType}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border-left:4px solid ${colors.primary};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 3px 0;color:#666666;font-size:11px;font-weight:bold;">${severityLabel}</p>
<p style="margin:0;color:${colors.primary};font-size:15px;font-weight:bold;">${data.severity}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">DETAILS</p>
<p style="margin:0;color:#333;font-size:${randomVisuals.fontSize};line-height:1.4;">${data.details}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;background-color:${colors.light};border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${actionLabel}</p>
<p style="margin:0;color:#333;font-size:${randomVisuals.fontSize};line-height:1.4;">${data.action}</p>
</td>
</tr>
</table>
${data.deadline ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;background-color:${colors.primary};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:15px;text-align:center;">
<p style="margin:0 0 3px 0;color:#ffffff;font-size:12px;">DEADLINE</p>
<p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">${data.deadline}</p>
</td>
</tr>
</table>` : ''}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background-color:${colors.primary};color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:20px 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};line-height:1.5;">${closing}</p>
</td>
</tr>
<tr>
<td style="padding:15px;background-color:${colors.light};text-align:center;border-top:1px solid ${colors.border};border-radius:0 0 ${randomVisuals.borderRadius} ${randomVisuals.borderRadius};">
<p style="margin:0;color:#666666;font-size:12px;">${footer} © ${new Date().getFullYear()}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
  } else if (structureNumber === 2) {
    // Minimal structure
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:${randomVisuals.headerPadding} 10px;">
<table width="500" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;">
<tr>
<td style="border-top:5px solid ${colors.primary};padding:${randomVisuals.padding};">
<h1 style="margin:0 0 5px 0;color:${colors.primary};font-size:24px;font-weight:bold;">${header}</h1>
<p style="margin:0 0 ${randomVisuals.padding} 0;color:#666666;font-size:12px;">System Alert</p>
<p style="margin:0 0 10px 0;color:#333333;font-size:${randomVisuals.fontSize};">${randomGreeting} ${greeting},</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;border-top:2px solid ${colors.border};border-bottom:2px solid ${colors.border};">
<tr>
<td style="padding:${randomVisuals.padding} 0;">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${alertLabel}</p>
<p style="margin:0 0 15px 0;color:#000000;font-size:16px;font-weight:bold;">${data.alertType}</p>
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${severityLabel}</p>
<p style="margin:0 0 15px 0;color:${colors.primary};font-size:16px;font-weight:bold;">${data.severity}</p>
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">DETAILS</p>
<p style="margin:0 0 15px 0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.4;">${data.details}</p>
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">${actionLabel}</p>
<p style="margin:0 0 15px 0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.4;">${data.action}</p>
${data.deadline ? `<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:11px;font-weight:bold;">DEADLINE</p>
<p style="margin:0;color:${colors.primary};font-size:20px;font-weight:bold;">${data.deadline}</p>` : ''}
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background-color:${colors.primary};color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:${randomVisuals.padding} 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};">${closing}</p>
<p style="margin:15px 0 0 0;padding-top:15px;border-top:1px solid #e5e5e5;color:#999999;font-size:11px;text-align:center;">${footer} © ${new Date().getFullYear()}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
  } else if (structureNumber === 3) {
    // Two-column structure
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#fafafa;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafafa;">
<tr>
<td align="center" style="padding:${randomVisuals.headerPadding} 10px;">
<table width="550" cellpadding="0" cellspacing="0" border="0" style="max-width:550px;background-color:#ffffff;border:1px solid #e0e0e0;border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background:${colors.primary};padding:${randomVisuals.headerPadding};text-align:left;">
<h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">${header}</h1>
</td>
<td style="background:${colors.secondary};padding:${randomVisuals.headerPadding};text-align:right;">
<p style="margin:0;color:#ffffff;font-size:12px;">Alert</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 10px 0;color:#333333;font-size:${randomVisuals.fontSize};">${randomGreeting} ${greeting},</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td width="48%" style="padding:${randomVisuals.padding};background-color:${colors.light};border-radius:${randomVisuals.borderRadius};" valign="top">
<p style="margin:0 0 5px 0;color:#666666;font-size:10px;font-weight:bold;text-transform:uppercase;">${alertLabel}</p>
<p style="margin:0;color:${colors.primary};font-size:16px;font-weight:bold;">${data.alertType}</p>
</td>
<td width="4%"></td>
<td width="48%" style="padding:${randomVisuals.padding};background-color:${colors.light};border-radius:${randomVisuals.borderRadius};" valign="top">
<p style="margin:0 0 5px 0;color:#666666;font-size:10px;font-weight:bold;text-transform:uppercase;">${severityLabel}</p>
<p style="margin:0;color:${colors.primary};font-size:16px;font-weight:bold;">${data.severity}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0;background-color:#fafafa;border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 8px 0;color:${colors.secondary};font-size:11px;font-weight:bold;text-transform:uppercase;">DETAILS</p>
<p style="margin:0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.4;">${data.details}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0;background-color:#fafafa;border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 8px 0;color:${colors.secondary};font-size:11px;font-weight:bold;text-transform:uppercase;">${actionLabel}</p>
<p style="margin:0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.4;">${data.action}</p>
</td>
</tr>
</table>
${data.deadline ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;background-color:${colors.primary};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};text-align:center;">
<p style="margin:0 0 5px 0;color:#ffffff;font-size:11px;">DEADLINE</p>
<p style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">${data.deadline}</p>
</td>
</tr>
</table>` : ''}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background-color:${colors.secondary};color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:15px 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};">${closing}</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:#f5f5f5;text-align:center;border-top:1px solid #e0e0e0;">
<p style="margin:0;color:#666666;font-size:11px;">${footer} © ${new Date().getFullYear()}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
  } else if (structureNumber === 4) {
    // Compact box structure
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:15px 10px;">
<table width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;border:2px solid ${colors.primary};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:${randomVisuals.padding};background-color:${colors.primary};text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">${header}</h1>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:#ffffff;">
<p style="margin:0 0 8px 0;color:#333333;font-size:${randomVisuals.fontSize};">${randomGreeting} ${greeting},</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:10px;background-color:#fafafa;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%">
<p style="margin:0;color:#666666;font-size:10px;font-weight:bold;">${alertLabel}:</p>
</td>
<td>
<p style="margin:0;color:#000000;font-size:14px;font-weight:bold;">${data.alertType}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:10px;background-color:#fafafa;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="35%">
<p style="margin:0;color:#666666;font-size:10px;font-weight:bold;">${severityLabel}:</p>
</td>
<td>
<p style="margin:0;color:${colors.primary};font-size:14px;font-weight:bold;">${data.severity}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:10px;background-color:${colors.light};">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:10px;font-weight:bold;">DETAILS</p>
<p style="margin:0;color:#333333;font-size:${randomVisuals.fontSize};">${data.details}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;border:1px solid ${colors.border};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:10px;background-color:${colors.light};">
<p style="margin:0 0 5px 0;color:${colors.secondary};font-size:10px;font-weight:bold;">${actionLabel}</p>
<p style="margin:0;color:#333333;font-size:${randomVisuals.fontSize};">${data.action}</p>
</td>
</tr>
</table>
${data.deadline ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0;background-color:${colors.primary};border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="padding:12px;text-align:center;">
<p style="margin:0 0 3px 0;color:#ffffff;font-size:10px;font-weight:bold;">DEADLINE</p>
<p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">${data.deadline}</p>
</td>
</tr>
</table>` : ''}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background-color:${colors.secondary};color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:12px 0 0 0;color:#666666;font-size:12px;">${closing}</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:${colors.light};text-align:center;border-top:1px solid ${colors.border};">
<p style="margin:0;color:#666666;font-size:11px;">${footer} © ${new Date().getFullYear()}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
  } else {
    // Structure 5: Modern gradient
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f8f9fa;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f9fa;">
<tr>
<td align="center" style="padding:${randomVisuals.headerPadding} 10px;">
<table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.1);border-radius:${randomVisuals.borderRadius};">
<tr>
<td style="background:linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);padding:${randomVisuals.headerPadding};text-align:center;border-radius:${randomVisuals.borderRadius} ${randomVisuals.borderRadius} 0 0;">
<h1 style="margin:0 0 5px 0;color:#ffffff;font-size:24px;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,0.2);">${header}</h1>
<p style="margin:0;color:#ffffff;font-size:13px;opacity:0.95;">System Alert</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:#ffffff;">
<p style="margin:0 0 12px 0;color:#333333;font-size:${randomVisuals.fontSize};font-weight:500;">${randomGreeting} ${greeting},</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
<tr>
<td width="48%" style="padding:${randomVisuals.padding};background:linear-gradient(to right, ${colors.light} 0%, #ffffff 100%);border-left:3px solid ${colors.primary};border-radius:${randomVisuals.borderRadius};" valign="top">
<p style="margin:0 0 5px 0;color:#888888;font-size:10px;font-weight:bold;letter-spacing:0.5px;">${alertLabel}</p>
<p style="margin:0;color:#000000;font-size:15px;font-weight:bold;">${data.alertType}</p>
</td>
<td width="4%"></td>
<td width="48%" style="padding:${randomVisuals.padding};background:linear-gradient(to right, ${colors.light} 0%, #ffffff 100%);border-left:3px solid ${colors.primary};border-radius:${randomVisuals.borderRadius};" valign="top">
<p style="margin:0 0 5px 0;color:#888888;font-size:10px;font-weight:bold;letter-spacing:0.5px;">${severityLabel}</p>
<p style="margin:0;color:${colors.primary};font-size:15px;font-weight:bold;">${data.severity}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0;background-color:${colors.light};border-radius:${randomVisuals.borderRadius};border:1px solid ${colors.border};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 8px 0;color:${colors.secondary};font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">DETAILS</p>
<p style="margin:0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.5;">${data.details}</p>
</td>
</tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0;background-color:${colors.light};border-radius:${randomVisuals.borderRadius};border:1px solid ${colors.border};">
<tr>
<td style="padding:${randomVisuals.padding};">
<p style="margin:0 0 8px 0;color:${colors.secondary};font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">${actionLabel}</p>
<p style="margin:0;color:#333333;font-size:${randomVisuals.fontSize};line-height:1.5;">${data.action}</p>
</td>
</tr>
</table>
${data.deadline ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0;">
<tr>
<td align="center" style="padding:${randomVisuals.padding};background:linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);border-radius:${randomVisuals.borderRadius};">
<p style="margin:0 0 5px 0;color:#ffffff;font-size:11px;opacity:0.9;letter-spacing:0.5px;">DEADLINE</p>
<p style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,0.2);">${data.deadline}</p>
</td>
</tr>
</table>` : ''}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${randomVisuals.padding} 0;">
<tr>
<td align="center">
<a href="${customUrl}" target="_blank" style="display:inline-block;background:linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%);color:#ffffff;text-decoration:none;padding:${randomVisuals.buttonPadding};font-size:${randomVisuals.fontSize};font-weight:bold;border-radius:${randomVisuals.borderRadius};box-shadow:0 2px 6px rgba(0,0,0,0.15);">${buttonText}</a>
</td>
</tr>
</table>
<p style="margin:18px 0 0 0;color:#666666;font-size:${randomVisuals.fontSize};line-height:1.5;">${closing}</p>
</td>
</tr>
<tr>
<td style="padding:${randomVisuals.padding};background-color:${colors.light};text-align:center;border-top:1px solid ${colors.border};border-radius:0 0 ${randomVisuals.borderRadius} ${randomVisuals.borderRadius};">
<p style="margin:0;color:#666666;font-size:12px;">${footer} © ${new Date().getFullYear()}</p>
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

    // Create Office 365-optimized HTML email with EXTERNAL image URL
    const companyName = data.companyName || ''
    const clickUrl = data.customUrl || '#'
    const imageUrl = data.imageUrl // External image URL from KV storage

    // ULTRA-CLEAN HTML for maximum deliverability with external image
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
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;max-width:600px;border-radius:8px;overflow:hidden;">
                    <!-- Header text -->
                    <tr>
                        <td style="padding:15px 20px;text-align:center;font-size:14px;color:#666666;border-bottom:1px solid #e0e0e0;">
                            ${companyName ? `Invoice from ${companyName}` : 'Service Completion Notice'}
                        </td>
                    </tr>
                    
                    <!-- Clickable External Image -->
                    <tr>
                        <td style="padding:0;">
                            <a href="${clickUrl}" target="_blank" style="display:block;text-decoration:none;">
                                <img src="${imageUrl}" 
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

// Account Management Page
app.get('/accounts', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Manage Sender Accounts - Invoice System</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen">
            <!-- Header -->
            <div class="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-6 px-6 shadow-xl">
                <div class="container mx-auto max-w-4xl">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold flex items-center">
                                <i class="fas fa-user-circle mr-3"></i>
                                Manage Sender Accounts
                            </h1>
                            <p class="text-green-100 mt-2">Add and manage Microsoft 365 accounts for sending invoices</p>
                        </div>
                        <a href="/" class="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition">
                            <i class="fas fa-arrow-left mr-2"></i>
                            Back
                        </a>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="container mx-auto max-w-4xl py-8 px-6">
                <!-- Add Account Button -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-bold text-gray-900 mb-2">
                                <i class="fas fa-plus-circle mr-2 text-green-600"></i>
                                Add New Account
                            </h2>
                            <p class="text-gray-600">Authorize a Microsoft 365 account to send invoices from</p>
                        </div>
                        <a href="/auth/microsoft" class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition flex items-center">
                            <i class="fas fa-user-plus mr-2"></i>
                            Add Account
                        </a>
                    </div>
                </div>

                <!-- Account List -->
                <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-list mr-2 text-blue-600"></i>
                        Authorized Accounts
                    </h2>
                    
                    <div id="accountsList" class="space-y-3">
                        <div class="text-center py-8">
                            <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-3"></i>
                            <p class="text-gray-600">Loading accounts...</p>
                        </div>
                    </div>
                </div>

                <!-- Info Box -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 class="font-semibold text-blue-900 mb-2 flex items-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        How OAuth Multi-Account Works
                    </h3>
                    <ul class="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                        <li>Each user authorizes their own Microsoft 365 account</li>
                        <li>No admin consent required - users control their own access</li>
                        <li>Works across different organizations (evolutionfamily.ca, company.com, etc.)</li>
                        <li>Tokens automatically refresh - accounts stay authorized</li>
                        <li>Remove accounts anytime to revoke access</li>
                    </ul>
                </div>
            </div>
        </div>

        <script>
            // Load and display accounts
            async function loadAccounts() {
                try {
                    const response = await axios.get('/api/accounts');
                    const accountsList = document.getElementById('accountsList');
                    
                    if (!response.data.success || response.data.accounts.length === 0) {
                        accountsList.innerHTML = \`
                            <div class="text-center py-8">
                                <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                                <p class="text-gray-600 font-medium mb-2">No accounts added yet</p>
                                <p class="text-sm text-gray-500">Click "Add Account" above to authorize your first Microsoft 365 account</p>
                            </div>
                        \`;
                        return;
                    }
                    
                    // Display accounts
                    accountsList.innerHTML = response.data.accounts.map(account => {
                        const addedDate = new Date(account.addedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        
                        return \`
                            <div class="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 transition">
                                <div class="flex items-center space-x-4">
                                    <div class="bg-green-100 rounded-full p-3">
                                        <i class="fas fa-user text-green-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <p class="font-semibold text-gray-900">\${account.email}</p>
                                        <p class="text-sm text-gray-600">\${account.displayName || 'No display name'}</p>
                                        <p class="text-xs text-gray-500 mt-1">
                                            <i class="fas fa-clock mr-1"></i>
                                            Added: \${addedDate}
                                        </p>
                                    </div>
                                </div>
                                <button onclick="removeAccount('\${account.email}')" 
                                        class="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-semibold text-sm">
                                    <i class="fas fa-trash mr-1"></i>
                                    Remove
                                </button>
                            </div>
                        \`;
                    }).join('');
                    
                } catch (error) {
                    console.error('Error loading accounts:', error);
                    const accountsList = document.getElementById('accountsList');
                    accountsList.innerHTML = \`
                        <div class="text-center py-8">
                            <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-3"></i>
                            <p class="text-red-600 font-medium">Failed to load accounts</p>
                            <p class="text-sm text-gray-600 mt-2">\${error.message || 'Unknown error'}</p>
                        </div>
                    \`;
                }
            }
            
            // Remove account
            async function removeAccount(email) {
                if (!confirm(\`Remove account \${email}? You will need to re-authorize it to use it again.\`)) {
                    return;
                }
                
                try {
                    await axios.delete(\`/api/accounts/\${encodeURIComponent(email)}\`);
                    alert('Account removed successfully!');
                    loadAccounts(); // Reload list
                } catch (error) {
                    alert('Failed to remove account: ' + (error.response?.data?.error || error.message));
                }
            }
            
            // Load accounts on page load
            loadAccounts();
        </script>
    </body>
    </html>
  `)
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

// ==========================================
// OAUTH 2.0 MULTI-ACCOUNT SUPPORT
// ==========================================

// OAuth: Initiate Microsoft authorization
app.get('/auth/microsoft', async (c) => {
  const { env } = c
  
  if (!env.OAUTH_CLIENT_ID) {
    return c.json({
      success: false,
      error: 'OAuth not configured. Please set OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, and OAUTH_TENANT_ID in Cloudflare secrets.'
    }, 500)
  }
  
  const baseUrl = new URL(c.req.url).origin
  const redirectUri = `${baseUrl}/auth/callback`
  
  // Use 'common' tenant for multi-tenant support
  const tenantId = env.OAUTH_TENANT_ID || 'common'
  
  const authUrl = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`)
  authUrl.searchParams.set('client_id', env.OAUTH_CLIENT_ID)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_mode', 'query')
  authUrl.searchParams.set('scope', 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access')
  authUrl.searchParams.set('state', crypto.randomUUID())
  authUrl.searchParams.set('prompt', 'select_account')  // Show account picker/login screen first
  authUrl.searchParams.set('domain_hint', 'organizations')  // Hint for work/school accounts
  
  return c.redirect(authUrl.toString())
})

// OAuth: Handle callback and exchange code for tokens
app.get('/auth/callback', async (c) => {
  const { env } = c
  const code = c.req.query('code')
  const error = c.req.query('error')
  const errorDescription = c.req.query('error_description')
  
  if (error) {
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Error</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div class="text-red-600 text-6xl mb-4">❌</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Authorization Failed</h1>
          <p class="text-gray-700 mb-2"><strong>Error:</strong> ${error}</p>
          <p class="text-gray-600 mb-6">${errorDescription || 'Unknown error occurred'}</p>
          <a href="/" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            ← Back to Invoice System
          </a>
        </div>
      </body>
      </html>
    `)
  }
  
  if (!code) {
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Error</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div class="text-yellow-600 text-6xl mb-4">⚠️</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-4">No Authorization Code</h1>
          <p class="text-gray-700 mb-6">Authorization was cancelled or failed. Please try again.</p>
          <a href="/" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            ← Back to Invoice System
          </a>
        </div>
      </body>
      </html>
    `)
  }
  
  try {
    const baseUrl = new URL(c.req.url).origin
    const redirectUri = `${baseUrl}/auth/callback`
    const tenantId = env.OAUTH_TENANT_ID || 'common'
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: env.OAUTH_CLIENT_ID,
          client_secret: env.OAUTH_CLIENT_SECRET,
          code: code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      }
    )
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json() as any
      throw new Error(errorData.error_description || 'Token exchange failed')
    }
    
    const tokenData = await tokenResponse.json() as {
      access_token: string
      refresh_token: string
      expires_in: number
    }
    
    // Get user info
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }
    
    const userData = await userResponse.json() as {
      mail?: string
      userPrincipalName?: string
      displayName?: string
    }
    
    const userEmail = userData.mail || userData.userPrincipalName || 'unknown@example.com'
    
    // Store tokens in KV
    const accountData = {
      email: userEmail,
      displayName: userData.displayName || userEmail,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
      addedAt: Date.now()
    }
    
    if (env.OAUTH_TOKENS) {
      await env.OAUTH_TOKENS.put(
        `account:${userEmail}`,
        JSON.stringify(accountData),
        { expirationTtl: 60 * 60 * 24 * 90 } // 90 days
      )
    }
    
    // Success page
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Successful</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div class="text-green-600 text-6xl mb-4">✅</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Account Added Successfully!</h1>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-gray-600 mb-1">Email:</p>
            <p class="font-semibold text-gray-900">${userEmail}</p>
            <p class="text-sm text-gray-600 mt-2 mb-1">Display Name:</p>
            <p class="font-semibold text-gray-900">${userData.displayName || 'N/A'}</p>
          </div>
          <p class="text-gray-700 mb-6">You can now send invoices from this account!</p>
          <a href="/" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold">
            ← Back to Invoice System
          </a>
        </div>
      </body>
      </html>
    `)
  } catch (error: any) {
    console.error('OAuth callback error:', error)
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Error</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div class="text-red-600 text-6xl mb-4">❌</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Authorization Failed</h1>
          <p class="text-gray-700 mb-6">${error.message || 'An unexpected error occurred'}</p>
          <a href="/" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            ← Back to Invoice System
          </a>
        </div>
      </body>
      </html>
    `)
  }
})

// API: Get list of authorized accounts
app.get('/api/accounts', async (c) => {
  const { env } = c
  
  if (!env.OAUTH_TOKENS) {
    return c.json({ success: false, accounts: [], error: 'OAuth tokens storage not configured' })
  }
  
  try {
    const accounts = []
    const list = await env.OAUTH_TOKENS.list({ prefix: 'account:' })
    
    for (const key of list.keys) {
      const data = await env.OAUTH_TOKENS.get(key.name)
      if (data) {
        const account = JSON.parse(data)
        accounts.push({
          email: account.email,
          displayName: account.displayName,
          addedAt: account.addedAt
        })
      }
    }
    
    return c.json({ success: true, accounts })
  } catch (error: any) {
    return c.json({ success: false, accounts: [], error: error.message })
  }
})

// API: Remove an authorized account
app.delete('/api/accounts/:email', async (c) => {
  const { env } = c
  const email = c.req.param('email')
  
  if (!env.OAUTH_TOKENS) {
    return c.json({ success: false, error: 'OAuth tokens storage not configured' }, 500)
  }
  
  try {
    await env.OAUTH_TOKENS.delete(`account:${email}`)
    return c.json({ success: true, message: 'Account removed successfully' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// API: Refresh access token if needed
async function getValidAccessToken(env: Bindings, email: string): Promise<string | null> {
  if (!env.OAUTH_TOKENS) {
    return null
  }
  
  const data = await env.OAUTH_TOKENS.get(`account:${email}`)
  if (!data) {
    return null
  }
  
  const account = JSON.parse(data)
  
  // Check if token is still valid (with 5 minute buffer)
  if (account.expiresAt > Date.now() + (5 * 60 * 1000)) {
    return account.accessToken
  }
  
  // Token expired, refresh it
  try {
    const tenantId = env.OAUTH_TENANT_ID || 'common'
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: env.OAUTH_CLIENT_ID,
          client_secret: env.OAUTH_CLIENT_SECRET,
          refresh_token: account.refreshToken,
          grant_type: 'refresh_token',
          scope: 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access'
        })
      }
    )
    
    if (!tokenResponse.ok) {
      console.error('Token refresh failed')
      return null
    }
    
    const tokenData = await tokenResponse.json() as {
      access_token: string
      refresh_token?: string
      expires_in: number
    }
    
    // Update stored tokens
    account.accessToken = tokenData.access_token
    if (tokenData.refresh_token) {
      account.refreshToken = tokenData.refresh_token
    }
    account.expiresAt = Date.now() + (tokenData.expires_in * 1000)
    
    await env.OAUTH_TOKENS.put(
      `account:${email}`,
      JSON.stringify(account),
      { expirationTtl: 60 * 60 * 24 * 90 } // 90 days
    )
    
    return tokenData.access_token
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

export default app

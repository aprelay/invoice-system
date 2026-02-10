// TCP/IP and HTTP Header Analysis
// Detects bots based on HTTP headers, TLS fingerprints, and connection patterns

export interface TCPAnalysisResult {
  isBotUserAgent: boolean;
  hasSuspiciousHeaders: boolean;
  hasMissingHeaders: boolean;
  isRDP: boolean; // NEW: RDP detection
  isCloudProvider: boolean; // NEW: Datacenter detection
  httpVersion: string;
  tlsVersion: string;
  riskScore: number; // 0-15 for TCP layer
  signals: string[];
}

// Known bot user agents patterns
const BOT_PATTERNS = [
  /bot|google|yandex|baidu|bing|msn|duckduck|teoma|slurp|crawler|spider|robot|crawling|facebook/i,
  /Googlebot|bingbot|slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|facebookexternalhit|ia_archiver/i,
  /apache|wget|curl|libwww|urllib|http|client|python|java|go-http|axios/i,
  /headless|phantom|selenium|webdriver|puppeteer|playwright|scrapy/i
];

// Microsoft-specific patterns - Office365 SafeLinks, Outlook scanners, Defender
const MICROSOFT_BOT_PATTERNS = [
  /microsoft|office365|safelinks|outlook|defender|msnbot|bingbot|bingpreview/i,
  /O365LinkProtection|Office365|SafeLinks|OutlookActivity/i,
  /Microsoft Office.*Verification/i,
  /Microsoft Threat Protection/i,
  /Windows Defender/i,
  /Microsoft Edge.*SafeLink/i,
  /Outlook-iOS|Outlook-Android/i, // Mobile Outlook scanners
  /Microsoft Exchange/i,
  /Microsoft Security/i
];

// Expected headers for real browsers
const EXPECTED_HEADERS = [
  'accept',
  'accept-language',
  'accept-encoding',
  'user-agent',
  'cache-control'
];

export function analyzeTCPHeaders(request: Request): TCPAnalysisResult {
  const signals: string[] = [];
  let riskScore = 0;

  const userAgent = request.headers.get('User-Agent') || '';
  const accept = request.headers.get('Accept') || '';
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  const acceptEncoding = request.headers.get('Accept-Encoding') || '';

  // =================================
  // RDP DETECTION (CRITICAL FOR YOUR USE CASE)
  // =================================
  let isRDP = false;
  
  // Chrome Remote Desktop detection
  if (/Chrome Remote Desktop/i.test(userAgent)) {
    isRDP = true;
    signals.push('chrome-remote-desktop');
    riskScore += 25;
  }
  
  // Microsoft Remote Desktop detection
  if (/Microsoft Remote Desktop|RDP|RemoteApp/i.test(userAgent)) {
    isRDP = true;
    signals.push('microsoft-rdp');
    riskScore += 25;
  }
  
  // TeamViewer, AnyDesk, etc.
  if (/TeamViewer|AnyDesk|VNC|Remote|Desktop/i.test(userAgent)) {
    isRDP = true;
    signals.push('remote-desktop-tool');
    riskScore += 20;
  }
  
  // Missing critical browser headers (common in RDP)
  const hasSecHeaders = request.headers.has('sec-ch-ua') || 
                       request.headers.has('sec-fetch-site') ||
                       request.headers.has('sec-fetch-mode');
  
  if (!hasSecHeaders && userAgent.includes('Chrome')) {
    isRDP = true;
    signals.push('rdp-missing-sec-headers');
    riskScore += 20;
  }

  // =================================
  // DATACENTER / CLOUD PROVIDER DETECTION
  // =================================
  let isCloudProvider = false;
  
  const cloudKeywords = [
    'digitalocean', 'ovh', 'linode', 'vultr', 'hetzner',
    'aws', 'amazon', 'azure', 'google cloud', 'gcp',
    'scaleway', 'contabo', 'hosting', 'vps', 'dedicated',
    'server', 'datacenter', 'cloud'
  ];
  
  const userAgentLower = userAgent.toLowerCase();
  if (cloudKeywords.some(keyword => userAgentLower.includes(keyword))) {
    isCloudProvider = true;
    signals.push('cloud-provider-ua');
    riskScore += 15;
  }

  // Check for bot user agent
  let isBotUserAgent = false;
  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      isBotUserAgent = true;
      signals.push('bot-user-agent');
      riskScore += 10;
      break;
    }
  }

  // Check for Microsoft bot patterns
  for (const pattern of MICROSOFT_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      signals.push('microsoft-bot');
      riskScore += 12;
      break;
    }
  }

  // Check for missing headers
  const missingHeaders: string[] = [];
  for (const header of EXPECTED_HEADERS) {
    if (!request.headers.get(header)) {
      missingHeaders.push(header);
    }
  }

  const hasMissingHeaders = missingHeaders.length > 2;
  if (hasMissingHeaders) {
    signals.push(`missing-headers: ${missingHeaders.join(', ')}`);
    riskScore += 5;
  }

  // Check for suspicious Accept header
  if (!accept || accept === '*/*') {
    signals.push('suspicious-accept');
    riskScore += 3;
  }

  // Check for missing Accept-Language
  if (!acceptLanguage) {
    signals.push('no-accept-language');
    riskScore += 3;
  }

  // Check for unusual Accept-Encoding
  if (!acceptEncoding || !acceptEncoding.includes('gzip')) {
    signals.push('unusual-accept-encoding');
    riskScore += 2;
  }

  // Check for HTTP/2 vs HTTP/1.1 (bots often use HTTP/1.1)
  // @ts-ignore - Cloudflare specific
  const httpVersion = request.cf?.httpProtocol || 'unknown';
  if (httpVersion === 'HTTP/1.1') {
    signals.push('http1.1');
    riskScore += 2;
  } else if (httpVersion === 'HTTP/1.0') {
    signals.push('http1.0');
    riskScore += 5;
  }

  // Check TLS version
  // @ts-ignore - Cloudflare specific
  const tlsVersion = request.cf?.tlsVersion || 'unknown';
  if (tlsVersion && tlsVersion.startsWith('TLSv1.0')) {
    signals.push('old-tls');
    riskScore += 5;
  }

  // Check header order (simplified - real implementation would check full order)
  const headerNames = Array.from(request.headers.keys());
  const hasSuspiciousHeaders = 
    headerNames.length < 5 ||  // Too few headers
    (headerNames[0] !== 'host' && headerNames[1] !== 'host'); // Host not first or second

  if (hasSuspiciousHeaders) {
    signals.push('suspicious-header-order');
    riskScore += 3;
  }

  // Check for automation tools in headers
  const referer = request.headers.get('Referer') || '';
  const origin = request.headers.get('Origin') || '';
  
  if (!referer && !origin && request.method === 'GET') {
    signals.push('no-referer-origin');
    riskScore += 2;
  }

  // Cap at 50 (increased from 15 to account for RDP)
  riskScore = Math.min(riskScore, 50);

  return {
    isBotUserAgent,
    hasSuspiciousHeaders,
    hasMissingHeaders,
    isRDP,
    isCloudProvider,
    httpVersion,
    tlsVersion,
    riskScore,
    signals
  };
}

// Check for specific bot patterns in User-Agent
export function isBotUserAgent(userAgent: string): boolean {
  if (!userAgent) return true; // No UA = bot

  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
}

// Check for Microsoft security scanners
export function isMicrosoftBot(userAgent: string): boolean {
  if (!userAgent) return false;

  for (const pattern of MICROSOFT_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
}

// Analyze JA3 TLS fingerprint (simplified)
// In production, you'd use actual JA3 library
export function analyzeJA3(request: Request): { isBotFingerprint: boolean; fingerprint: string } {
  // @ts-ignore - Cloudflare specific
  const tlsVersion = request.cf?.tlsVersion || '';
  // @ts-ignore - Cloudflare specific
  const tlsCipher = request.cf?.tlsCipher || '';

  // Simplified bot detection based on TLS
  const isBotFingerprint = 
    tlsVersion.startsWith('TLSv1.0') || 
    tlsVersion.startsWith('TLSv1.1') ||
    !tlsCipher;

  const fingerprint = `${tlsVersion}:${tlsCipher}`;

  return { isBotFingerprint, fingerprint };
}

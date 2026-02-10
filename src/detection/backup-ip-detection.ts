// Alternative IP Detection using multiple free APIs
// When IPQualityScore fails, use backup services

export interface BackupIPDetection {
  isVPN: boolean;
  isProxy: boolean;
  isDatacenter: boolean;
  isBot: boolean;
  isp: string;
  organization: string;
  fraudScore: number;
  riskScore: number;
  source: string;
}

// Backup API 1: IPHub.info (via proxy)
async function detectWithIPHub(ip: string): Promise<BackupIPDetection | null> {
  try {
    const response = await fetch(`https://ip-api.com/json/${ip}?fields=status,message,country,isp,org,as,mobile,proxy,hosting,query`);
    const data = await response.json();
    
    if (data.status === 'fail') {
      return null;
    }

    const isHosting = data.hosting === true;
    const isProxy = data.proxy === true;
    const isMobile = data.mobile === true;
    
    // Check ASN and org for VPN/proxy/datacenter patterns
    const org = (data.org || '').toLowerCase();
    const isp = (data.isp || '').toLowerCase();
    const asn = (data.as || '').toLowerCase();
    
    const vpnKeywords = ['vpn', 'proxy', 'datacenter', 'hosting', 'server', 'cloud', 'virtual', 
                         'amazon', 'aws', 'google', 'azure', 'digital ocean', 'linode', 'vultr',
                         'ovh', 'hetzner', 'contabo', 'cogent', 'psychz'];
    
    const isVPN = vpnKeywords.some(keyword => 
      org.includes(keyword) || isp.includes(keyword) || asn.includes(keyword)
    );
    
    let riskScore = 0;
    if (isVPN || isProxy || isHosting) riskScore += 40;
    if (!isMobile && isHosting) riskScore += 10;
    
    return {
      isVPN: isVPN || isProxy,
      isProxy: isProxy,
      isDatacenter: isHosting,
      isBot: false,
      isp: data.isp || 'Unknown',
      organization: data.org || 'Unknown',
      fraudScore: riskScore,
      riskScore: Math.min(riskScore, 50),
      source: 'ip-api.com'
    };
  } catch (error) {
    console.error('[IP-API ERROR]', error);
    return null;
  }
}

// Backup API 2: IPinfo.io
async function detectWithIPInfo(ip: string): Promise<BackupIPDetection | null> {
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    const data = await response.json();
    
    if (data.bogon) {
      return null;
    }

    const org = (data.org || '').toLowerCase();
    const hostname = (data.hostname || '').toLowerCase();
    
    const suspiciousKeywords = ['vpn', 'proxy', 'datacenter', 'hosting', 'server', 'cloud',
                                'amazon', 'aws', 'google', 'azure', 'digital', 'linode', 'vultr',
                                'ovh', 'hetzner', 'contabo', 'as', 'asn'];
    
    const isSuspicious = suspiciousKeywords.some(keyword => 
      org.includes(keyword) || hostname.includes(keyword)
    );
    
    const isDatacenter = org.includes('hosting') || org.includes('datacenter') || org.includes('server');
    
    let riskScore = 0;
    if (isSuspicious) riskScore += 35;
    if (isDatacenter) riskScore += 15;
    
    return {
      isVPN: isSuspicious,
      isProxy: isSuspicious,
      isDatacenter: isDatacenter,
      isBot: false,
      isp: data.org || 'Unknown',
      organization: data.org || 'Unknown',
      fraudScore: riskScore,
      riskScore: Math.min(riskScore, 50),
      source: 'ipinfo.io'
    };
  } catch (error) {
    console.error('[IPINFO ERROR]', error);
    return null;
  }
}

// Enhanced detection with fallback chain
export async function detectIPWithFallback(ip: string, ipqsKey?: string): Promise<BackupIPDetection> {
  // Try IP-API first (most reliable free service)
  const ipApiResult = await detectWithIPHub(ip);
  if (ipApiResult && (ipApiResult.isVPN || ipApiResult.isProxy || ipApiResult.isDatacenter)) {
    console.log('[IP DETECTION] Using ip-api.com:', ipApiResult);
    return ipApiResult;
  }

  // Try IPInfo as backup
  const ipInfoResult = await detectWithIPInfo(ip);
  if (ipInfoResult && (ipInfoResult.isVPN || ipInfoResult.isProxy || ipInfoResult.isDatacenter)) {
    console.log('[IP DETECTION] Using ipinfo.io:', ipInfoResult);
    return ipInfoResult;
  }

  // If both free services found nothing suspicious, return the cleaner result
  if (ipApiResult) {
    console.log('[IP DETECTION] No threats detected via ip-api.com');
    return ipApiResult;
  }

  // Ultimate fallback
  console.log('[IP DETECTION] All services failed, using safe fallback');
  return {
    isVPN: false,
    isProxy: false,
    isDatacenter: false,
    isBot: false,
    isp: 'Unknown',
    organization: 'Unknown',
    fraudScore: 0,
    riskScore: 0,
    source: 'fallback'
  };
}

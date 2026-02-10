// IP Detection using IPQualityScore API
// Detects: VPN, Proxy, Datacenter, Bots, Tor

export interface IPQSResponse {
  success: boolean;
  message?: string;
  fraud_score: number;
  country_code: string;
  region: string;
  city: string;
  ISP: string;
  ASN: number;
  organization: string;
  is_crawler: boolean;
  timezone: string;
  mobile: boolean;
  host: string;
  proxy: boolean;
  vpn: boolean;
  tor: boolean;
  active_vpn: boolean;
  active_tor: boolean;
  recent_abuse: boolean;
  bot_status: boolean;
  connection_type: string;
  abuse_velocity: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  request_id: string;
}

export interface IPDetectionResult {
  isVPN: boolean;
  isProxy: boolean;
  isDatacenter: boolean;
  isBot: boolean;
  isTor: boolean;
  fraudScore: number;
  isp: string;
  organization: string;
  connectionType: string;
  riskScore: number; // 0-50 for IP layer
}

export async function detectIP(
  ip: string,
  cfProperties?: any // Cloudflare request properties
): Promise<IPDetectionResult> {
  console.log(`[IP DETECTION] Checking IP: ${ip}`);
  
  // ALWAYS use manual blocklist first - 100% reliable
  const manualCheck = checkManualBlocklist(ip);
  if (manualCheck.isVPN) {
    console.log('🚨 BLOCKED BY MANUAL BLOCKLIST!');
    return manualCheck;
  }

  // Use Cloudflare threat intelligence if available
  if (cfProperties) {
    console.log('[CF THREAT] Using Cloudflare data');
    const threatScore = cfProperties.threat_score || 0; // 0-100 (usually not available on Pages)
    const asn = cfProperties.asn || 0;
    const asnOrg = cfProperties.asn_org || '';
    const country = cfProperties.country || '';
    const colo = cfProperties.colo || '';
    
    console.log(`[CF DATA] ASN: ${asn}, Country: ${country}, Colo: ${colo}, Org: ${asnOrg}, Threat: ${threatScore}`);
    
    // Known VPN/Datacenter ASNs (add more as you discover them)
    const suspiciousASNs = [
      16509, // Amazon AWS
      15169, // Google Cloud
      8075,  // Microsoft Azure
      8068,  // Microsoft (Office365 ranges)
      3598,  // Microsoft (Office365 ranges)
      14061, // DigitalOcean
      20473, // Choopa (Vultr)
      24940, // Hetzner
      16276, // OVH
      13335, // Cloudflare (proxies)
      51167, // Contabo
      63949, // Linode
      // Add VPN provider ASNs here
      // Mullvad: Various ASNs
      // NordVPN: 209 (Tesonet)
      // ExpressVPN: Various
    ];
    
    const isSuspiciousASN = suspiciousASNs.includes(asn);
    
    // Check organization name for VPN/hosting keywords
    const suspiciousOrgs = [
      // VPN Providers
      'vpn', 'proxy', 'nordvpn', 'expressvpn', 'mullvad', 'proton',
      'private internet', 'surfshark', 'cyberghost', 'ipvanish',
      'windscribe', 'purevpn', 'tunnelbear', 'hotspot shield',
      'hide.me', 'torguard', 'perfect privacy', 'airvpn',
      // Hosting/Datacenter
      'hosting', 'datacenter', 'data center', 'cloud', 'server', 'digital ocean',
      'amazon', 'google', 'microsoft', 'azure', 'aws', 'ovh', 'hetzner',
      'linode', 'vultr', 'scaleway', 'contabo', 'online.net',
      // More datacenter keywords
      'colocation', 'colo', 'dedicated', 'virtual', 'vps', 'ec2',
      'compute', 'infrastructure', 'network solutions', 'cdn',
      // Office365/Microsoft scanners
      'office 365', 'office365', 'o365', 'safelinks', 'outlook',
      'microsoft corporation', 'microsoft online', 'exchange online'
    ];
    
    const orgLower = asnOrg.toLowerCase();
    const isVPNOrDatacenter = suspiciousOrgs.some(term => orgLower.includes(term)) || isSuspiciousASN;
    
    // ULTRA AGGRESSIVE threat detection
    const isHighThreat = threatScore >= 10;
    const isMediumThreat = threatScore >= 5;
    
    if (isVPNOrDatacenter) {
      console.log(`🚨 SUSPICIOUS ASN/ORG DETECTED!`);
      console.log(`   ASN: ${asn}, Org: ${asnOrg}`);
      
      return {
        isVPN: true,
        isProxy: true,
        isDatacenter: true,
        isBot: false,
        isTor: false,
        fraudScore: 85,
        isp: country || 'Unknown',
        organization: asnOrg || `ASN ${asn}`,
        connectionType: 'VPN/Datacenter',
        riskScore: 50
      };
    }
    
    // Always try IP-API lookup for better VPN/hosting detection (free, no key needed)
    // IP-API is more accurate than Cloudflare for VPN/hosting detection
    if (asn) {
      console.log('[IP-API] Checking with IP-API for VPN/hosting detection...');
      try {
        const ipApiUrl = `http://ip-api.com/json/${ip}?fields=status,org,as,hosting,proxy`;
        const ipApiResponse = await fetch(ipApiUrl, {
          signal: AbortSignal.timeout(3000)
        });
        
        if (ipApiResponse.ok) {
          const ipApiData = await ipApiResponse.json();
          console.log('[IP-API] Response:', JSON.stringify(ipApiData));
          
          if (ipApiData.status === 'success') {
            const org = ipApiData.org || ipApiData.as || '';
            const isHosting = ipApiData.hosting === true;
            const isProxy = ipApiData.proxy === true;
            
            const orgLower = org.toLowerCase();
            const isVPNOrDatacenterByOrg = suspiciousOrgs.some(term => orgLower.includes(term));
            
            if (isHosting || isProxy || isVPNOrDatacenterByOrg) {
              console.log(`🚨 IP-API DETECTED: ${isHosting ? 'Hosting' : ''} ${isProxy ? 'Proxy' : ''} ${isVPNOrDatacenterByOrg ? 'VPN/DC' : ''}`);
              console.log(`   Org: ${org}`);
              
              return {
                isVPN: isProxy || isVPNOrDatacenterByOrg,
                isProxy: isProxy || isVPNOrDatacenterByOrg,
                isDatacenter: isHosting,
                isBot: false,
                isTor: false,
                fraudScore: 80,
                isp: country || 'Unknown',
                organization: org,
                connectionType: isProxy ? 'Proxy' : 'Datacenter',
                riskScore: 45
              };
            }
          }
        }
      } catch (error) {
        console.error('[IP-API] Lookup failed:', error);
      }
    }
    
    if (isHighThreat) {
      console.log(`🚨 HIGH THREAT SCORE: ${threatScore}`);
      return {
        isVPN: false,
        isProxy: true, // Flag as proxy for medium threats
        isDatacenter: false,
        isBot: true,
        isTor: false,
        fraudScore: threatScore,
        isp: cfProperties.country || 'Unknown',
        organization: asnOrg || 'Unknown',
        connectionType: 'Suspicious',
        riskScore: Math.min(threatScore + 10, 50)
      };
    }
  }
  
  // Fallback to residential
  console.log('[DETECTION] No threats detected - allowing');
  return {
    isVPN: false,
    isProxy: false,
    isDatacenter: false,
    isBot: false,
    isTor: false,
    fraudScore: 0,
    isp: cfProperties?.country || 'Unknown',
    organization: cfProperties?.asn_org || 'Residential',
    connectionType: 'Residential',
    riskScore: 0
  };
}

// Manual blocklist for known VPN IPs - 100% reliable
function checkManualBlocklist(ip: string): IPDetectionResult {
  console.log('[MANUAL BLOCKLIST] Checking IP:', ip);
  
  // Manual VPN IP blocklist (add known VPN IPs here)
  const knownVPNIPs = [
    '23.234.76.33', // Mozilla VPN / Mullvad
    // ADD YOUR CURRENT VPN IP HERE!
    // Get it from: https://api.ipify.org/
  ];
  
  // Manual VPN IP ranges (CIDR blocks)
  // Popular VPN providers
  const vpnIPRanges = [
    '23.234.76.0/27', // Mullvad/Mozilla VPN range
    '185.220.100.0/22', // Tor exit nodes
    '185.220.102.0/24', // Tor exit nodes
    // Add more VPN ranges as you discover them
  ];
  
  // Check if IP is in manual blocklist
  const isBlockedIP = knownVPNIPs.includes(ip);
  
  // Check if IP is in VPN range
  const isInVPNRange = vpnIPRanges.some(range => {
    const [rangeIP, bits] = range.split('/');
    const rangeParts = rangeIP.split('.').map(Number);
    const ipParts = ip.split('.').map(Number);
    const mask = -1 << (32 - parseInt(bits));
    
    const rangeNum = (rangeParts[0] << 24) + (rangeParts[1] << 16) + (rangeParts[2] << 8) + rangeParts[3];
    const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
    
    return (rangeNum & mask) === (ipNum & mask);
  });
  
  if (isBlockedIP || isInVPNRange) {
    console.log('[MANUAL BLOCKLIST] ⛔ IP IS BLOCKED!');
    return {
      isVPN: true,
      isProxy: true,
      isDatacenter: true,
      isBot: false,
      isTor: false,
      fraudScore: 95,
      isp: 'Blocked',
      organization: 'Manual VPN Blocklist',
      connectionType: 'VPN',
      riskScore: 50
    };
  }
  
  // Not in blocklist - return safe result
  return {
    isVPN: false,
    isProxy: false,
    isDatacenter: false,
    isBot: false,
    isTor: false,
    fraudScore: 0,
    isp: 'Not Blocked',
    organization: 'Not Blocked',
    connectionType: 'Unknown',
    riskScore: 0
  };
}

// Check if IP should be blocked (quick decision)
export function shouldBlockIP(detection: IPDetectionResult): boolean {
  // Block if VPN, proxy, or high fraud score
  if (detection.isVPN || detection.isProxy || detection.isTor) {
    return true;
  }

  if (detection.fraudScore >= 75) {
    return true;
  }

  if (detection.isBot && detection.isDatacenter) {
    return true;
  }

  return false;
}

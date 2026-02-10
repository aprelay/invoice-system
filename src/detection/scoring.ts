// Bayesian ML Scoring Engine
// Combines all detection layers into final risk score

import type { IPDetectionResult } from './ip-detection';
import type { FingerprintResult } from './fingerprint';
import type { TCPAnalysisResult } from './tcp-analysis';

export interface DetectionResult {
  ip: IPDetectionResult;
  fingerprint?: FingerprintResult;
  tcp: TCPAnalysisResult;
}

export interface RiskScore {
  total: number; // 0-100
  breakdown: {
    ip: number;       // 0-50
    fingerprint: number; // 0-25
    tcp: number;      // 0-15
    tls: number;      // 0-10
  };
  decision: 'allow' | 'block' | 'suspicious';
  confidence: number; // 0-100
  reasons: string[];
}

export function calculateRiskScore(detection: DetectionResult): RiskScore {
  const reasons: string[] = [];
  
  // IP Layer (0-50 points, weight: 50%)
  const ipScore = detection.ip.riskScore; // Already 0-50
  
  if (detection.ip.isVPN) {
    reasons.push('VPN detected');
  }
  if (detection.ip.isProxy) {
    reasons.push('Proxy detected');
  }
  if (detection.ip.isDatacenter) {
    reasons.push('Datacenter IP');
  }
  if (detection.ip.isBot) {
    reasons.push('Bot IP');
  }
  if (detection.ip.isTor) {
    reasons.push('Tor exit node');
  }
  if (detection.ip.fraudScore >= 75) {
    reasons.push(`High fraud score: ${detection.ip.fraudScore}`);
  }

  // Fingerprint Layer (0-25 points, weight: 25%)
  const fingerprintScore = detection.fingerprint?.riskScore || 0; // Already 0-25
  
  if (detection.fingerprint) {
    if (detection.fingerprint.isHeadless) {
      reasons.push('Headless browser detected');
    }
    if (detection.fingerprint.isAutomation) {
      reasons.push('Automation detected (webdriver)');
    }
    if (detection.fingerprint.isSuspicious) {
      reasons.push('Suspicious browser fingerprint');
    }
  }

  // TCP Layer (0-15 points, weight: 15%)
  const tcpScore = detection.tcp.riskScore; // Already 0-15
  
  if (detection.tcp.isBotUserAgent) {
    reasons.push('Bot User-Agent detected');
  }
  if (detection.tcp.hasMissingHeaders) {
    reasons.push('Missing expected HTTP headers');
  }
  if (detection.tcp.hasSuspiciousHeaders) {
    reasons.push('Suspicious header patterns');
  }

  // TLS Layer (0-10 points, weight: 10%)
  let tlsScore = 0;
  if (detection.tcp.tlsVersion.startsWith('TLSv1.0') || 
      detection.tcp.tlsVersion.startsWith('TLSv1.1')) {
    tlsScore = 10;
    reasons.push('Old TLS version');
  }

  // Calculate total score
  const total = ipScore + fingerprintScore + tcpScore + tlsScore;

  // Determine decision
  let decision: 'allow' | 'block' | 'suspicious';
  if (total >= 70) {
    decision = 'block';
  } else if (total >= 40) {
    decision = 'suspicious';
  } else {
    decision = 'allow';
  }

  // Calculate confidence (based on number of signals)
  const signalCount = reasons.length;
  let confidence = 50; // Base confidence
  
  if (signalCount >= 5) {
    confidence = 95;
  } else if (signalCount >= 3) {
    confidence = 85;
  } else if (signalCount >= 2) {
    confidence = 70;
  } else if (signalCount === 1) {
    confidence = 60;
  }

  // Adjust confidence based on score extremes
  if (total >= 80 || total <= 10) {
    confidence = Math.min(confidence + 10, 100);
  }

  return {
    total,
    breakdown: {
      ip: ipScore,
      fingerprint: fingerprintScore,
      tcp: tcpScore,
      tls: tlsScore
    },
    decision,
    confidence,
    reasons
  };
}

// Bayesian probability calculation
export function calculateBayesianProbability(detection: DetectionResult): number {
  // Prior probability (base rate of bots in traffic)
  const P_Bot = 0.15; // Assume 15% of traffic is bots
  const P_NotBot = 1 - P_Bot;

  // Likelihood of observing signals given bot/not-bot
  let P_Signals_Given_Bot = 1.0;
  let P_Signals_Given_NotBot = 1.0;

  // VPN signal
  if (detection.ip.isVPN) {
    P_Signals_Given_Bot *= 0.7;     // 70% of bots use VPNs
    P_Signals_Given_NotBot *= 0.05; // 5% of real users use VPNs
  }

  // Proxy signal
  if (detection.ip.isProxy) {
    P_Signals_Given_Bot *= 0.8;     // 80% of bots use proxies
    P_Signals_Given_NotBot *= 0.02; // 2% of real users use proxies
  }

  // Datacenter IP
  if (detection.ip.isDatacenter) {
    P_Signals_Given_Bot *= 0.9;     // 90% of bots from datacenters
    P_Signals_Given_NotBot *= 0.01; // 1% of real users from datacenters
  }

  // Bot User-Agent
  if (detection.tcp.isBotUserAgent) {
    P_Signals_Given_Bot *= 0.95;    // 95% of bots have bot UA
    P_Signals_Given_NotBot *= 0.001; // 0.1% of real users have bot UA
  }

  // Webdriver/automation
  if (detection.fingerprint?.isAutomation) {
    P_Signals_Given_Bot *= 0.85;    // 85% of bots use automation tools
    P_Signals_Given_NotBot *= 0.001; // 0.1% of real users have automation
  }

  // Headless browser
  if (detection.fingerprint?.isHeadless) {
    P_Signals_Given_Bot *= 0.75;    // 75% of bots are headless
    P_Signals_Given_NotBot *= 0.005; // 0.5% of real users use headless
  }

  // Calculate posterior probability using Bayes' theorem
  // P(Bot|Signals) = P(Signals|Bot) * P(Bot) / P(Signals)
  const P_Signals = (P_Signals_Given_Bot * P_Bot) + (P_Signals_Given_NotBot * P_NotBot);
  const P_Bot_Given_Signals = (P_Signals_Given_Bot * P_Bot) / P_Signals;

  // Return probability as percentage
  return Math.min(P_Bot_Given_Signals * 100, 100);
}

// Get human-readable decision explanation
export function getDecisionExplanation(score: RiskScore): string {
  if (score.decision === 'block') {
    return `BLOCKED: High risk score (${score.total}/100). ${score.reasons.join(', ')}. Confidence: ${score.confidence}%.`;
  } else if (score.decision === 'suspicious') {
    return `SUSPICIOUS: Moderate risk score (${score.total}/100). ${score.reasons.join(', ')}. Consider additional verification.`;
  } else {
    return `ALLOWED: Low risk score (${score.total}/100). Appears to be legitimate user. Confidence: ${score.confidence}%.`;
  }
}

// Log detection for analytics
export function logDetection(
  detection: DetectionResult,
  score: RiskScore,
  ip: string,
  userAgent: string
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    decision: score.decision,
    riskScore: score.total,
    confidence: score.confidence,
    breakdown: score.breakdown,
    signals: {
      vpn: detection.ip.isVPN,
      proxy: detection.ip.isProxy,
      datacenter: detection.ip.isDatacenter,
      bot: detection.ip.isBot,
      tor: detection.ip.isTor,
      automation: detection.fingerprint?.isAutomation || false,
      headless: detection.fingerprint?.isHeadless || false,
      botUA: detection.tcp.isBotUserAgent
    },
    reasons: score.reasons
  };

  console.log('[DETECTION]', JSON.stringify(logEntry));
}

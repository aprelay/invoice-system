// JavaScript Fingerprinting
// Collects browser characteristics to detect automation/bots

export interface FingerprintData {
  canvas: string;
  webgl: string;
  audio: string;
  fonts: string[];
  screen: ScreenInfo;
  navigator: NavigatorInfo;
  webdriver: boolean;
  headless: boolean;
  automation: boolean;
  plugins: string[];
  timezone: string;
  language: string[];
  hardware: HardwareInfo;
}

export interface ScreenInfo {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelRatio: number;
}

export interface NavigatorInfo {
  userAgent: string;
  platform: string;
  vendor: string;
  language: string;
  languages: string[];
  onLine: boolean;
  cookieEnabled: boolean;
  doNotTrack: string | null;
}

export interface HardwareInfo {
  cores: number;
  memory: number | null;
  battery: boolean;
  touchSupport: boolean;
}

export interface FingerprintResult {
  fingerprint: string; // Unique hash
  isHeadless: boolean;
  isAutomation: boolean;
  isSuspicious: boolean;
  riskScore: number; // 0-25 for JS layer
  signals: string[]; // List of suspicious signals
}

// Client-side fingerprinting code (will be injected in HTML)
export const CLIENT_FINGERPRINT_SCRIPT = `
(function() {
  // Canvas Fingerprint
  function getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      
      canvas.width = 200;
      canvas.height = 50;
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('IPQS 🔒 Canvas', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('IPQS 🔒 Canvas', 4, 17);
      
      return canvas.toDataURL();
    } catch (e) {
      return 'error';
    }
  }

  // WebGL Fingerprint
  function getWebGLFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'no-webgl';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug-info';
      
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      
      return \`\${vendor}~\${renderer}\`;
    } catch (e) {
      return 'error';
    }
  }

  // Audio Fingerprint
  function getAudioFingerprint() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return 'no-audio';
      
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const analyser = context.createAnalyser();
      const gainNode = context.createGain();
      const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
      
      gainNode.gain.value = 0;
      oscillator.type = 'triangle';
      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start(0);
      
      const data = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(data);
      
      oscillator.stop();
      context.close();
      
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        hash += data[i];
      }
      
      return hash.toString();
    } catch (e) {
      return 'error';
    }
  }

  // Detect available fonts
  function getFonts() {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testFonts = [
      'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
      'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS',
      'Impact', 'Lucida Console', 'Tahoma', 'Century Gothic'
    ];
    
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return [];
    
    const baselines = {};
    for (const baseFont of baseFonts) {
      context.font = testSize + ' ' + baseFont;
      baselines[baseFont] = context.measureText(testString).width;
    }
    
    const detected = [];
    for (const font of testFonts) {
      let isDetected = false;
      for (const baseFont of baseFonts) {
        context.font = testSize + ' ' + font + ',' + baseFont;
        const width = context.measureText(testString).width;
        if (width !== baselines[baseFont]) {
          isDetected = true;
          break;
        }
      }
      if (isDetected) detected.push(font);
    }
    
    return detected;
  }

  // Detect automation/headless browsers
  function detectAutomation() {
    const signals = [];
    
    // Check navigator.webdriver
    if (navigator.webdriver) {
      signals.push('webdriver');
    }
    
    // Check for automation properties
    if (window.document.__selenium_unwrapped || window.document.__webdriver_evaluate || window.document.__driver_evaluate) {
      signals.push('selenium');
    }
    
    if (window.navigator.webdriver) {
      signals.push('navigator-webdriver');
    }
    
    // Check for missing properties
    if (!window.navigator.plugins || window.navigator.plugins.length === 0) {
      signals.push('no-plugins');
    }
    
    // Check for headless Chrome
    if (navigator.userAgent.includes('HeadlessChrome')) {
      signals.push('headless-chrome');
    }
    
    // Check for PhantomJS
    if (window._phantom || window.callPhantom) {
      signals.push('phantomjs');
    }
    
    // Check Chrome CDP
    if (window.chrome && window.chrome.runtime) {
      signals.push('chrome-runtime');
    }
    
    // Check for inconsistent properties
    if (navigator.plugins.length === 0 && navigator.mimeTypes.length === 0) {
      signals.push('no-plugins-mimetypes');
    }
    
    return signals;
  }

  // Collect all fingerprint data
  const fingerprint = {
    canvas: getCanvasFingerprint(),
    webgl: getWebGLFingerprint(),
    audio: getAudioFingerprint(),
    fonts: getFonts(),
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1
    },
    navigator: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor || 'unknown',
      language: navigator.language,
      languages: navigator.languages ? Array.from(navigator.languages) : [navigator.language],
      onLine: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || null
    },
    hardware: {
      cores: navigator.hardwareConcurrency || 0,
      memory: navigator.deviceMemory || null,
      battery: 'getBattery' in navigator,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    },
    automation: detectAutomation(),
    timestamp: Date.now()
  };

  // Send to server
  fetch('/api/fingerprint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fingerprint)
  }).catch(() => {});
})();
`;

// Server-side fingerprint analysis
export function analyzeFingerprintData(data: FingerprintData): FingerprintResult {
  const signals: string[] = [];
  let riskScore = 0;

  // Check for webdriver
  if (data.webdriver) {
    signals.push('webdriver-detected');
    riskScore += 15;
  }

  // Check for headless browser indicators
  if (data.canvas === 'no-canvas' || data.webgl === 'no-webgl') {
    signals.push('missing-canvas-webgl');
    riskScore += 10;
  }

  // Check plugins
  if (!data.plugins || data.plugins.length === 0) {
    signals.push('no-plugins');
    riskScore += 5;
  }

  // Check fonts (real browsers have more fonts)
  if (data.fonts && data.fonts.length < 5) {
    signals.push('few-fonts');
    riskScore += 5;
  }

  // Check hardware concurrency
  if (data.hardware.cores === 0 || data.hardware.cores > 32) {
    signals.push('suspicious-hardware');
    riskScore += 5;
  }

  // Check screen dimensions
  if (data.screen.width < 800 || data.screen.height < 600) {
    signals.push('unusual-screen-size');
    riskScore += 3;
  }

  // Check user agent
  if (data.navigator.userAgent.includes('HeadlessChrome') || 
      data.navigator.userAgent.includes('PhantomJS')) {
    signals.push('headless-user-agent');
    riskScore += 15;
  }

  // Cap at 25 (JS fingerprint layer max)
  riskScore = Math.min(riskScore, 25);

  // Generate unique fingerprint hash
  const fingerprintString = JSON.stringify({
    canvas: data.canvas.substring(0, 100),
    webgl: data.webgl,
    audio: data.audio,
    fonts: data.fonts.sort().join(','),
    screen: data.screen
  });
  
  const fingerprint = simpleHash(fingerprintString);

  return {
    fingerprint,
    isHeadless: signals.includes('missing-canvas-webgl') || signals.includes('headless-user-agent'),
    isAutomation: data.webdriver || signals.includes('webdriver-detected'),
    isSuspicious: riskScore > 10,
    riskScore,
    signals
  };
}

// Simple hash function
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

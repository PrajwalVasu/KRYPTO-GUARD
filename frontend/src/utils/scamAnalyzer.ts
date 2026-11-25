import type { AnalysisResult } from '../types';

export function analyzeScamInput(
  type: 'text' | 'url' | 'call',
  content: string
): AnalysisResult {
  const text = content.toLowerCase().trim();

  if (!text || text.length < 5) {
    return {
      riskLevel: 'inconclusive',
      score: 10,
      summary: 'Insufficient details provided to perform analysis.',
      detectedFlags: [
        {
          title: 'Too Short / Incomplete Data',
          description: 'Please paste a complete SMS, message text, website address, or phone call description.',
          severity: 'info'
        }
      ],
      whyItIsSuspicious: [
        'A full analysis requires the complete message context or website URL.'
      ],
      recommendedActions: [
        'Paste the entire message body or describe the caller’s exact words and demands.'
      ],
      disclaimer: 'Educational Heuristic Demonstration: This tool evaluates common red flags. It does not certify any message as safe.'
    };
  }

  const flags: { title: string; description: string; severity: 'critical' | 'warning' | 'info' }[] = [];
  const whyReasons: string[] = [];
  const actions: string[] = [];
  let score = 0;

  // 1. Remote Access Software Keywords (CRITICAL)
  const remoteKeywords = ['anydesk', 'teamviewer', 'quicksupport', 'rustdesk', 'screen share', 'remote desktop'];
  const foundRemote = remoteKeywords.some(kw => text.includes(kw));
  if (foundRemote) {
    score += 45;
    flags.push({
      title: 'Remote Screen-Sharing Request Detected',
      description: 'Mentions remote access tools (AnyDesk, TeamViewer, QuickSupport). Fraudsters use these to view your screen and intercept bank OTPs.',
      severity: 'critical'
    });
    whyReasons.push('Legitimate banks, police, or telecom providers never demand that you install remote screen-sharing applications.');
    actions.push('Do NOT install any remote desktop applications.');
    actions.push('If already installed, immediately disconnect Wi-Fi/data and uninstall the app.');
  }

  // 2. Sensitive Credential Request (CRITICAL)
  const credentialKeywords = ['otp', 'upi pin', 'atm pin', 'cvv', 'password', 'net banking password', 'card expiry'];
  const foundCredentials = credentialKeywords.some(kw => text.includes(kw));
  if (foundCredentials) {
    score += 40;
    flags.push({
      title: 'Request for Sensitive Financial Credentials',
      description: 'Contains requests for OTP, UPI PIN, CVV, or passwords. Genuine organizations never request your secret PIN or OTP.',
      severity: 'critical'
    });
    whyReasons.push('UPI PIN is strictly for paying out money, and OTP is your secret security key.');
    actions.push('NEVER enter your UPI PIN or disclose an OTP to anyone.');
  }

  // 3. Intimidation, Fear, & Artificial Urgency (HIGH)
  const urgencyKeywords = [
    'immediately', 'blocked today', 'disconnected tonight', 'power cut', 'within 24 hours',
    'police arrest', 'digital arrest', 'customs', 'cbi', 'narcotics', 'fir registered', 'court order', 'illegal parcel'
  ];
  const foundUrgency = urgencyKeywords.some(kw => text.includes(kw));
  if (foundUrgency) {
    score += 30;
    flags.push({
      title: 'High Urgency / Fear-Inducing Threats',
      description: 'Uses intimidation or immediate deadlines (power cut tonight, account blocked, police arrest) to force panic and bypass logical caution.',
      severity: 'warning'
    });
    whyReasons.push('Scammers rely on artificial urgency to prevent you from consulting family members or verifying with official sources.');
    actions.push('Stay calm. Utility companies and legal authorities do not cut power or issue arrest warrants via an informal text or call.');
  }

  // 4. Financial Baits & Unrealistic Lures (HIGH)
  const lureKeywords = [
    'kbc', 'lottery', 'winner', 'cash prize', 'earn 5000', 'part time job', 'telegram task',
    'like youtube', 'guaranteed return', 'double your money', 'free diamonds', 'work from home'
  ];
  const foundLure = lureKeywords.some(kw => text.includes(kw));
  if (foundLure) {
    score += 35;
    flags.push({
      title: 'Unrealistic Financial Bait / Prize Lure',
      description: 'Promises large sums of money, lottery prizes, or guaranteed daily earnings for minimal effort (liking videos, reviewing hotels).',
      severity: 'warning'
    });
    whyReasons.push('Unrealistic earnings are psychological hooks used by task fraud syndicates and lottery cartels.');
    actions.push('Remember: If it looks too good to be true, it is guaranteed to be a financial trap.');
  }

  // 5. Suspicious Domains, URLs, & Web Elements (CRITICAL / HIGH)
  if (type === 'url' || text.includes('http://') || text.includes('https://') || text.includes('.xyz') || text.includes('.top') || text.includes('bit.ly') || text.includes('t.me')) {
    const hasSuspiciousTld = text.includes('.xyz') || text.includes('.top') || text.includes('.site') || text.includes('.online') || text.includes('.club') || text.includes('.ru');
    const hasShortener = text.includes('bit.ly') || text.includes('tinyurl') || text.includes('t.me') || text.includes('cutt.ly');
    const hasFakeBrand = text.includes('sbi-') || text.includes('hdfc-') || text.includes('kyc-update') || text.includes('yono-') || text.includes('electricity-');
    const isInsecureHttp = text.includes('http://');

    if (hasSuspiciousTld || hasFakeBrand) {
      score += 45;
      flags.push({
        title: 'High-Risk Deceptive Domain Name',
        description: 'The link uses low-trust top-level domains (.xyz, .top) or mimics official brands with hyphenated keywords (e.g. sbi-kyc-update).',
        severity: 'critical'
      });
      whyReasons.push('Official banking institutions in India use verified .bank.in, .co.in, or strictly registered official domains like sbi.co.in.');
      actions.push('Do NOT open the link or enter any phone number or bank details.');
    } else if (hasShortener) {
      score += 25;
      flags.push({
        title: 'Masked URL Shortener Detected',
        description: 'Uses a link shortener (bit.ly, t.me, tinyurl) which conceals the real final destination of the webpage.',
        severity: 'warning'
      });
      whyReasons.push('Shortened links are frequently used in SMS smishing to hide fraudulent server addresses.');
      actions.push('Avoid clicking links that hide their real domain address.');
    } else if (isInsecureHttp) {
      score += 20;
      flags.push({
        title: 'Unencrypted HTTP Connection',
        description: 'Website lacks modern SSL encryption (HTTP instead of HTTPS). Sensitive data can be easily intercepted.',
        severity: 'warning'
      });
    }
  }

  // 6. Suspicious 10-Digit Helpline Numbers
  const phoneRegex = /(?:call|contact|officer|care).*?(?:\+91[\-\s]?)?[6-9]\d{9}/i;
  if (phoneRegex.test(text) && (text.includes('officer') || text.includes('bank') || text.includes('electricity') || text.includes('support'))) {
    score += 25;
    flags.push({
      title: 'Personal Mobile Number Posed as Official Helpline',
      description: 'A personal 10-digit mobile number is presented as an official bank manager, electricity officer, or cyber investigator.',
      severity: 'warning'
    });
    whyReasons.push('Official institutions operate toll-free 1800 numbers or registered institutional landlines, never personal mobile numbers.');
    actions.push('Do NOT call the personal mobile number provided in the message.');
  }

  // Default baseline checks if no flags hit
  if (flags.length === 0) {
    return {
      riskLevel: 'low-risk',
      score: 15,
      summary: 'No immediate high-risk warning flags detected in the sample provided.',
      detectedFlags: [
        {
          title: 'Standard Caution Advised',
          description: 'While this sample lacks common scam trigger keywords (such as OTP requests, remote tools, or overt threats), always verify independently.',
          severity: 'info'
        }
      ],
      whyItIsSuspicious: [
        'Scammers continuously evolve their language and may craft personalized messages.'
      ],
      recommendedActions: [
        'Check the sender identifier (official banks use 6-character headers like VK-HDFCBK, not personal phone numbers).',
        'Never disclose passwords or OTPs even if a follow-up message appears normal.'
      ],
      disclaimer: 'Educational Heuristic Demonstration: This tool evaluates common red flags. It does not certify any message as safe.'
    };
  }

  // Risk categorization
  let riskLevel: 'high' | 'suspicious' | 'low-risk' = 'low-risk';
  if (score >= 60) {
    riskLevel = 'high';
  } else if (score >= 30) {
    riskLevel = 'suspicious';
  }

  if (actions.length === 0) {
    actions.push('Do not share any personal or banking information.');
    actions.push('Verify directly with the official organization through their verified app.');
  }

  actions.push('If you already transferred funds, immediately call 1930 to freeze the transaction.');

  const summary = riskLevel === 'high'
    ? 'CRITICAL ALERT: Multiple high-risk digital fraud indicators detected. This closely matches active scam patterns.'
    : 'CAUTION: Suspicious elements detected. Exercise extreme vigilance before proceeding.';

  return {
    riskLevel,
    score: Math.min(score, 100),
    summary,
    detectedFlags: flags,
    whyItIsSuspicious: whyReasons,
    recommendedActions: actions,
    disclaimer: 'Educational Simulation: This analysis uses cybersecurity heuristics to identify common deception patterns. It is not an official intelligence verdict and does not replace human caution.'
  };
}

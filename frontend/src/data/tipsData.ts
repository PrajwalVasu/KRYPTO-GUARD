import type { DailyTip, BankContact, JargonTerm } from '../types';

export const DAILY_TIPS: DailyTip[] = [
  {
    id: 1,
    category: 'UPI Golden Rule',
    tip: 'You NEVER need to enter your UPI PIN to receive money into your bank account.',
    actionableStep: 'If a buyer or caller asks you to enter your PIN to claim funds, disconnect immediately. It is 100% a scam.',
    forAudience: 'all'
  },
  {
    id: 2,
    category: 'Bank Security',
    tip: 'Banks will never ask you to update KYC by clicking on a link sent in an SMS.',
    actionableStep: 'For KYC updates, always visit your home branch in person or use the bank’s official mobile app.',
    forAudience: 'seniors'
  },
  {
    id: 3,
    category: 'Student Safety',
    tip: 'No legitimate employer charges "registration fees" or "security deposits" for work-from-home jobs.',
    actionableStep: 'If a Telegram recruiter asks you to pay money to unlock tasks, block them instantly.',
    forAudience: 'students'
  },
  {
    id: 4,
    category: 'Emergency 1930',
    tip: 'The first 2 hours after a financial scam is the "Golden Hour".',
    actionableStep: 'Dial 1930 immediately to freeze fraudulent money transfers before the scammer withdraws it from an ATM.',
    forAudience: 'all'
  },
  {
    id: 5,
    category: 'Remote Access Warning',
    tip: 'Never install AnyDesk, TeamViewer, or QuickSupport on instructions from an unknown caller.',
    actionableStep: 'These apps allow callers to view your screen in real time and intercept your banking OTPs.',
    forAudience: 'seniors'
  },
  {
    id: 6,
    category: 'Social Media Shield',
    tip: 'Never send money to a friend based solely on an Instagram or WhatsApp text message.',
    actionableStep: 'Always make a direct phone call to hear their voice and confirm the emergency.',
    forAudience: 'students'
  },
  {
    id: 7,
    category: 'Aadhaar Protection',
    tip: 'Always use "Masked Aadhaar" (which shows only the last 4 digits) for general identity proof.',
    actionableStep: 'Lock your Aadhaar biometrics using the official mAadhaar mobile app.',
    forAudience: 'all'
  }
];

export const BANK_CONTACTS: BankContact[] = [
  {
    name: 'State Bank of India (SBI)',
    tollFree: '1800 1234 / 1800 2100',
    fraudEmail: 'customercare@sbi.co.in',
    smsBlockCode: 'SMS "BLOCK <last 4 digits of card>" to 567676',
    logoColor: 'bg-blue-600'
  },
  {
    name: 'HDFC Bank',
    tollFree: '1800 1600 / 1800 2600',
    fraudEmail: 'report.fraud@hdfcbank.com',
    smsBlockCode: 'Call phone banking immediately or use HDFC Mobile App',
    logoColor: 'bg-sky-700'
  },
  {
    name: 'ICICI Bank',
    tollFree: '1800 1080',
    fraudEmail: 'antiphishing@icicibank.com',
    smsBlockCode: 'SMS "BLOCK <Card last 4 digits>" to 9215676766',
    logoColor: 'bg-amber-700'
  },
  {
    name: 'Punjab National Bank (PNB)',
    tollFree: '1800 1800 / 1800 2021',
    fraudEmail: 'care@pnb.co.in',
    smsBlockCode: 'SMS "HOT <Card Number>" to 5607040',
    logoColor: 'bg-rose-700'
  },
  {
    name: 'Axis Bank',
    tollFree: '1860 419 5555 / 1860 500 5555',
    fraudEmail: 'customer.service@axisbank.com',
    smsBlockCode: 'SMS "BLOCK <Card Number>" to 5676782',
    logoColor: 'bg-pink-800'
  },
  {
    name: 'Bank of Baroda',
    tollFree: '1800 5700 / 1800 5000',
    fraudEmail: 'cbp.frauddesk@bankofbaroda.com',
    smsBlockCode: 'SMS "BLOCK <Last 4 digits>" to 8422009988',
    logoColor: 'bg-orange-600'
  }
];

export const JARGON_TERMS: JargonTerm[] = [
  {
    term: 'UPI PIN (Personal Identification Number)',
    hindiTerm: 'यूपीआई पिन',
    meaning: 'A secret 4 or 6-digit number that authorises money to be DEDUCTED from your bank account.',
    realWorldAnalogy: 'Think of it like the physical signature on a cheque. You never sign a blank cheque to receive money!',
    safetyTakeaway: 'You ONLY type your UPI PIN when you want to PAY someone, NEVER to receive money.'
  },
  {
    term: 'OTP (One Time Password)',
    hindiTerm: 'ओटीपी (एक बार का पासवर्ड)',
    meaning: 'A temporary 6-digit verification code sent to your phone to confirm a financial transaction or login.',
    realWorldAnalogy: 'It is like the physical lock key to your locker. Sharing it gives the other person immediate access.',
    safetyTakeaway: 'Banks, police, or delivery agents NEVER have legitimate authority to ask you for your OTP.'
  },
  {
    term: 'Phishing / Smishing',
    hindiTerm: 'फ़िशिंग / फर्जी लिंक',
    meaning: 'Deceptive messages or websites that look identical to real banks or utilities to trick you into entering passwords.',
    realWorldAnalogy: 'Like putting bait on a fishing hook. The bait looks appetizing, but hides a sharp trap.',
    safetyTakeaway: 'Never click links inside unexpected SMS messages claiming your account or bill is overdue.'
  },
  {
    term: 'Remote Access App (AnyDesk / TeamViewer)',
    hindiTerm: 'रिमोट एक्सेस ऐप',
    meaning: 'Software that allows another person on the internet to see your mobile screen and control your device.',
    realWorldAnalogy: 'Like handing over the steering wheel of your car to a complete stranger on the highway.',
    safetyTakeaway: 'If a caller instructs you to download AnyDesk or TeamViewer, hang up immediately.'
  },
  {
    term: 'QR Code (Quick Response)',
    hindiTerm: 'क्यूआर कोड',
    meaning: 'A square barcode containing payment routing information.',
    realWorldAnalogy: 'Scanning a QR code in a payment app is telling your bank: "I want to send money to this person".',
    safetyTakeaway: 'Scanning a QR code can NEVER add money to your account. It only initiates a payment OUT of your account.'
  },
  {
    term: 'Digital Arrest',
    hindiTerm: 'डिजिटल अरेस्ट (फर्जी पुलिस कॉल)',
    meaning: 'A fictitious scam term used by fraudsters posing as police, CBI, or customs to keep you on Skype/video call until you pay money.',
    realWorldAnalogy: 'A pure extortion theater where actors wear counterfeit police badges.',
    safetyTakeaway: 'Under Indian law, NO police department can place you under "Digital Arrest" via a phone call.'
  }
];

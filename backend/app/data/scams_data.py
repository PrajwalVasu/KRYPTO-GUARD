# backend/app/data/scams_data.py

SCAM_CATEGORIES = [
  {
    "id": "banking-upi-fraud",
    "title": "Banking and UPI Payment Fraud",
    "shortTitle": "UPI & Banking",
    "audience": "all",
    "icon": "CreditCard",
    "badge": "High Frequency",
    "tagline": "Fake QR codes, UPI PIN traps, and money request illusions",
    "description": "Fraudsters manipulate victims into entering their UPI PIN under the false premise that it is required to receive money, or use cloned banking apps to display fake payment success screens.",
    "howItHappens": [
      {
        "step": 1,
        "title": "Initial Contact & Lure",
        "description": "Scammer contacts you pretending to be an online buyer (e.g., on OLX), an army officer, or an official wanting to transfer funds to you."
      },
      {
        "step": 2,
        "title": "The QR Code or Collect Request",
        "description": "They send a QR code via WhatsApp or a Collect Request on PhonePe/Google Pay/Paytm saying: \"Scan this and enter your UPI PIN to receive money in your account.\""
      },
      {
        "step": 3,
        "title": "The Theft",
        "description": "The moment you enter your UPI PIN, money is debited FROM your bank account instead of being credited."
      }
    ],
    "realLifeScenario": {
      "victimProfile": "Ramesh Sharma, 62, retired teacher in Pune",
      "story": "Ramesh posted an old sofa on an online resale marketplace. Within 15 minutes, a buyer calling himself \"Captain Vikram\" called and agreed to pay without negotiation. The buyer sent a QR code on WhatsApp stating: \"Sir, this is Indian Army verification QR. Scan it and enter your PIN so government funds credit directly to your account.\" Ramesh complied and lost ₹28,000 in seconds.",
      "messagePreview": {
        "sender": "+91 98210 XXXXX (Buyer)",
        "body": "Sir, sending ₹15,000 for sofa. Kindly scan this QR code and approve with your UPI PIN to claim money instantly.",
        "timestamp": "11:15 AM",
        "type": "whatsapp"
      }
    },
    "warningSigns": [
      "Anyone telling you that you need to enter your UPI PIN to RECEIVE or credit money.",
      "Receiving a PhonePe, Google Pay, or Paytm \"Collect Request\" from an unknown user.",
      "Callers identifying as \"Army Officers\", \"Customs Staff\", or \"Govt Officials\" insisting on immediate cashless payments.",
      "Screenshots of successful transfers with mismatched fonts or blurred transaction IDs."
    ],
    "shieldRules": [
      "GOLDEN RULE: UPI PIN is ONLY entered to SEND money, never to receive money.",
      "To receive money on UPI, the sender only needs your UPI ID or mobile number. No action or PIN is required from you.",
      "Never scan any QR code sent to you on WhatsApp or Telegram by strangers.",
      "Check your official bank SMS notification or passbook directly, not a screenshot sent by the other party."
    ],
    "whatToDoIfAffected": [
      "Immediately open your UPI app and unlink or freeze your linked bank account.",
      "Call 1930 (National Cybercrime Helpline) within the golden hour (first 2 hours).",
      "Contact your bank customer care immediately to block debit card & net banking credentials.",
      "Note down the UTR / UPI Transaction ID and file a formal report on cybercrime.gov.in."
    ],
    "commonKeywords": ["upi", "qr code", "pin", "receive money", "olx", "phonepe", "gpay", "paytm", "collect request"]
  },
  {
    "id": "phishing-fake-links",
    "title": "Phishing SMS & Malicious Links",
    "shortTitle": "Phishing & Links",
    "audience": "all",
    "icon": "Link",
    "badge": "Critical Threat",
    "tagline": "Fake electricity bills, courier customs alerts, and bank KYC threats",
    "description": "Deceptive SMS and email messages containing malicious links engineered to harvest your banking credentials, passwords, or install malware on your smartphone.",
    "howItHappens": [
      {
        "step": 1,
        "title": "Alarming Urgent Notification",
        "description": "You receive an urgent SMS: \"Your power will be cut tonight at 9:30 PM due to unpaid bill\" or \"Your SBI account is blocked due to expired KYC.\""
      },
      {
        "step": 2,
        "title": "Clicking the Fake Portal",
        "description": "The link leads to an identical-looking fake bank or electricity portal designed to capture your login ID, password, and OTP."
      },
      {
        "step": 3,
        "title": "Account Takeover",
        "description": "The fraudster enters your harvested credentials into the real portal and uses the OTP you unknowingly typed into the fake website to drain your funds."
      }
    ],
    "realLifeScenario": {
      "victimProfile": "Kavita Patel, 58, homemaker in Ahmedabad",
      "story": "Kavita received an SMS at 8:00 PM: \"Dear Consumer, your electricity power will be disconnected at 9:30 PM tonight by officer because your previous bill was not updated. Call our electric officer at 98765xxxxx.\" Panicking about power cut at night, she called the number. The man spoke authoritatively, sent an APK app link via SMS to \"pay ₹10 penalty\", and wiped out her savings account balance.",
      "messagePreview": {
        "sender": "VK-ELCBRD",
        "body": "Dear Consumer, Your electricity connection will be disconnected tonight at 9.30 PM due to unpaid bill. Immediately contact Electricity Officer on 93452XXXXX to avoid power cut.",
        "timestamp": "08:04 PM",
        "type": "sms"
      }
    },
    "warningSigns": [
      "Urgent threats of immediate disconnection, account suspension, or police arrest.",
      "Personal 10-digit mobile numbers listed as \"Customer Support\" or \"Officer Helpline\".",
      "Web links using suspicious endings (.xyz, .top, .online, .site, bit.ly, or misspellings like sbi-kyc-update.com).",
      "Demanding payment of token amounts (e.g. ₹5 or ₹10) through a custom APK link."
    ],
    "shieldRules": [
      "Official organizations send messages with registered sender headers (like AD-SBIBNK or VM-MSEB), never random 10-digit phone numbers.",
      "Never download APK files sent via SMS, WhatsApp, or third-party websites.",
      "Always pay utility bills directly through official utility portals or verified bill payment apps.",
      "Banks never ask you to update KYC by clicking an external link in an SMS."
    ],
    "whatToDoIfAffected": [
      "Turn on Airplane mode immediately to stop remote data transmission if an app was downloaded.",
      "Uninstall any newly installed application from your device settings.",
      "Immediately call your bank helpline to freeze net banking and debit cards.",
      "Dial 1930 to report the incident and get transaction holds placed."
    ],
    "commonKeywords": ["electricity", "disconnection", "kyc", "account blocked", "apk", "bill unpaid", "pan card update"]
  },
  {
    "id": "social-media-impersonation",
    "title": "Social Media & Impersonation Scams",
    "shortTitle": "Social Media Fraud",
    "audience": "students",
    "icon": "Users",
    "badge": "Targeting Youth",
    "tagline": "Cloned profiles, fake emergency loans, and AI voice cloning",
    "description": "Scammers clone photos and names of your friends or relatives to beg for urgent medical funds on Instagram or WhatsApp, or use AI deepfakes to simulate distress.",
    "howItHappens": [
      {
        "step": 1,
        "title": "Profile Cloning or Compromise",
        "description": "Scammers create a duplicate Instagram or Facebook profile with your real friend’s public photo and bio, or hijack an existing profile."
      },
      {
        "step": 2,
        "title": "Urgent Distress Message",
        "description": "They message you: \"Hey bro, I am in a hospital/police emergency, my UPI daily limit is reached. Can you please transfer ₹5,000? Will return by evening.\""
      },
      {
        "step": 3,
        "title": "Emotional Exploitation",
        "description": "Because you trust your friend, you quickly transfer money to an unknown UPI ID provided in the chat."
      }
    ],
    "realLifeScenario": {
      "victimProfile": "Aman Verma, 21, college engineering student in Bengaluru",
      "story": "Aman got a direct message on Instagram from his close college friend Sneha’s account. The message read: \"Aman, I am stuck at a medical store with an injured friend and my GPay is declining. Can you send ₹4,500 to this UPI ID? I will pay you back tomorrow.\" Aman transferred the amount. The next morning in class, Sneha revealed her account had been hacked and 8 friends had been duped.",
      "messagePreview": {
        "sender": "@sneha_v_official (DM)",
        "body": "Aman please help! Stuck at clinic, my card is blocked. Urgent ₹4,500 needed for medicine. Send to clinic UPI: medassist99@upi. Will pay back in morning promise!",
        "timestamp": "10:45 PM",
        "type": "whatsapp"
      }
    },
    "warningSigns": [
      "Sudden request for money or gift cards from a friend or relative via social media DM.",
      "The recipient UPI ID or bank account name does not match your friend’s name.",
      "Excuses why they cannot speak on a normal voice or video call (\"network is bad\", \"I am inside hospital ICU\").",
      "New account asking you to re-follow them claiming their old account was lost."
    ],
    "shieldRules": [
      "ALWAYS call your friend directly on their regular phone number before sending even 1 rupee.",
      "Insist on hearing their voice on a direct cellular phone call.",
      "Never send funds to a third-party UPI handle given in a social media message.",
      "Enable Two-Factor Authentication (2FA) with an authenticator app on all your social media accounts."
    ],
    "whatToDoIfAffected": [
      "Report the fake or compromised profile directly to Instagram/Facebook/WhatsApp.",
      "Warn mutual friends immediately on your status or group chats to prevent further victims.",
      "Report the fraudulent transaction reference to your UPI provider and bank.",
      "File an online incident report on cybercrime.gov.in."
    ],
    "commonKeywords": ["instagram", "friend", "emergency money", "hospital", "borrow", "hacked account", "dm"]
  },
  {
    "id": "job-internship-fraud",
    "title": "Job & Internship Fraud",
    "shortTitle": "Fake Jobs & Tasks",
    "audience": "students",
    "icon": "Briefcase",
    "badge": "Student Alert",
    "tagline": "Telegram task scams, YouTube video rating traps, and forged offer letters",
    "description": "Targeting students and fresh graduates with lucrative \"Work From Home\" offers, paying small initial sums (₹150-₹500) before demanding huge \"prepaid investment deposits\".",
    "howItHappens": [
      {
        "step": 1,
        "title": "Unsolicited WhatsApp/Telegram Offer",
        "description": "You get a message: \"Part-time job: Like 3 YouTube videos or review hotels on Google Maps and earn ₹3,000 per day. No experience needed.\""
      },
      {
        "step": 2,
        "title": "The Confidence Trap (Bait)",
        "description": "You like 3 videos, send screenshots, and they actually pay you ₹200 via UPI to build complete trust."
      },
      {
        "step": 3,
        "title": "The Investment Shakedown",
        "description": "They add you to a VIP Telegram group and offer \"Crypto/Merchant tasks\": deposit ₹5,000 to earn ₹8,000. When you deposit, your money is locked unless you deposit ₹50,000 more."
      }
    ],
    "realLifeScenario": {
      "victimProfile": "Pooja Nair, 22, final year B.Com student in Kochi",
      "story": "Pooja was seeking work-from-home options to support her tuition fees. She joined a Telegram channel offering hotel rating jobs. She completed simple tasks and received ₹350 into her bank account. Convinced it was legitimate, she took up a \"Prepaid VIP Merchant Task\" depositing ₹10,000. The app showed fake profits of ₹16,000, but when she attempted to withdraw, the administrator demanded ₹35,000 more as \"TDS clearance tax\".",
      "messagePreview": {
        "sender": "+1 (424) XXX-XXXX (HR Global)",
        "body": "Dear Candidate, HR Team selected your resume for Google Rating Part-time Job. Daily payout ₹2,000-₹5,000. Work 30 mins from phone. Telegram HR: @Recruiter_Priya",
        "timestamp": "09:20 AM",
        "type": "whatsapp"
      }
    },
    "warningSigns": [
      "High daily pay (₹3,000 - ₹10,000) promised for elementary tasks like clicking \"Like\" or rating hotels.",
      "Recruitment conducted entirely via Telegram or WhatsApp without any official interview or company email (@company.com).",
      "Being asked to pay a \"registration fee\", \"security deposit\", or \"task balance\" to withdraw your own earnings.",
      "Unsolicited job messages sent from international country codes (+1, +44, +62)."
    ],
    "shieldRules": [
      "Legitimate employers NEVER ask candidates to pay money for equipment, training, or task unlocking.",
      "Verify company openings on their official career portal (e.g., careers.google.com), never via Telegram channels.",
      "If someone gives you \"free money\" for liking videos, it is a psychological bait to lure you into a large financial trap.",
      "Do not share your bank passbook or Aadhaar with unknown recruiters on chat apps."
    ],
    "whatToDoIfAffected": [
      "Stop paying immediately! Scammers will keep inventing new \"taxes\" and \"fees\" to bleed you dry.",
      "Take complete screenshots of the Telegram chat, user IDs, and transaction UTR details.",
      "Report the bank accounts and UPI IDs used by the scammers to 1930 immediately.",
      "Block the contacts and file a complaint on the National Cybercrime Reporting Portal."
    ],
    "commonKeywords": ["part time job", "telegram", "youtube like", "work from home", "daily payout", "prepaid task"]
  },
  {
    "id": "shopping-marketplace-fraud",
    "title": "Shopping & Marketplace Fraud",
    "shortTitle": "Fake Shopping",
    "audience": "all",
    "icon": "ShoppingBag",
    "badge": "Everyday Trap",
    "tagline": "Fake Instagram storefronts, 90% discount electronics, and parcel scams",
    "description": "Fraudulent shopping websites and social media ads advertising luxury sneakers, iPhones, or clothing at 80% discounts, taking upfront payments and disappearing.",
    "howItHappens": [
      {
        "step": 1,
        "title": "Sponsored Social Media Ad",
        "description": "You see an Instagram or Facebook ad showing branded shoes or gadgets at unrealistically low prices (e.g. ₹999 for ₹15,000 sneakers)."
      },
      {
        "step": 2,
        "title": "Prepaid Only Checkout",
        "description": "The website disables Cash on Delivery (COD) citing \"flash sale rules\" and demands upfront UPI or credit card payment."
      },
      {
        "step": 3,
        "title": "Ghosted & Blocked",
        "description": "No tracking details are provided, customer care emails bounce, and the website vanishes within a week."
      }
    ],
    "realLifeScenario": {
      "victimProfile": "Aditya Sen, 20, college student in Kolkata",
      "story": "Aditya saw an Instagram sponsored reel advertising Apple AirPods Pro for ₹1,499 during a \"Customs Seizure Clearance Sale\". The website looked identical to a genuine store with reviews and countdown timers. He paid via UPI. Three weeks passed without any delivery. The support email was non-existent and the Instagram page had disabled comments.",
      "messagePreview": {
        "sender": "DEALS-INDIA",
        "body": "MEGA CLEARANCE: Apple AirPods Pro 2nd Gen @ ₹1,499 only! Limited 20 units left. Order now: http://gadget-grab-loot24.store (Prepaid only)",
        "timestamp": "02:40 PM",
        "type": "sms"
      }
    },
    "warningSigns": [
      "Discounts that seem too good to be true (e.g., 80% to 90% off flagship electronics).",
      "Websites with no physical business address, no working telephone number, and generic gmail support addresses.",
      "Disabling Cash On Delivery (COD) on first-time orders.",
      "Comments on social media posts are turned off or strictly filtered."
    ],
    "shieldRules": [
      "If a deal looks too good to be true, it is 100% a scam.",
      "Check website age on whois.domaintools.com — fake scam sites are usually registered less than 30 days ago.",
      "Opt for Cash on Delivery (COD) whenever purchasing from an unfamiliar online store.",
      "Stick to reputed ecommerce marketplaces for electronics and high-value items."
    ],
    "whatToDoIfAffected": [
      "Contact your bank or card issuer immediately to request a chargeback or dispute the transaction.",
      "Report the scam Instagram ad and URL to Google Safe Browsing and Meta ad transparency.",
      "Save order confirmation screenshots and submit a fraud complaint on cybercrime.gov.in."
    ],
    "commonKeywords": ["discount", "clearance sale", "airpods", "cheap iphone", "fake website", "cod unavailable"]
  },
  {
    "id": "identity-theft-sim-swap",
    "title": "Identity Theft & SIM Swap Scams",
    "shortTitle": "Identity Theft & SIM",
    "audience": "all",
    "icon": "ShieldAlert",
    "badge": "Critical Severity",
    "tagline": "Aadhaar misuse, unauthorized eSIM transfers, and biometric cloning",
    "description": "Criminals obtain your personal identifiers to clone your phone SIM card or apply for micro-loans in your name, intercepting your two-factor OTPs completely silently.",
    "howItHappens": [
      {
        "step": 1,
        "title": "Harvesting Identity Data",
        "description": "Scammers collect your Aadhaar number, PAN card photocopy, and birth date from leaked databases or fake job applications."
      },
      {
        "step": 2,
        "title": "Fraudulent SIM Replacement",
        "description": "They pose as you at a telecom store or trick you into forwarding an eSIM activation QR code or sending a SIM swap SMS."
      },
      {
        "step": 3,
        "title": "Silent OTP Interception",
        "description": "Your physical phone suddenly loses all network signal (\"No Service\"). The scammer receives all your bank OTPs on their new SIM card."
      }
    ],
    "realLifeScenario": {
      "victimProfile": "Vikramaditya Rao, 65, retired civil engineer in Hyderabad",
      "story": "Vikramaditya received a call from someone claiming to be an Airtel executive offering \"Free upgrade to 5G VIP Super SIM\". The caller asked him to send an SMS text \"SIM 1234567890\" to 121. Within 2 hours, his phone showed \"No Service\". Thinking it was a tower glitch, he went to sleep. By morning, scammers had logged into his net banking using OTPs sent to their cloned SIM and transferred ₹6.5 Lakhs.",
      "messagePreview": {
        "sender": "+91 97110 XXXXX (Caller)",
        "body": "Airtel Urgent: Your 4G SIM will stop working from midnight. To continue 5G services, forward this code to 121: \"SIM <19-digit-number>\".",
        "timestamp": "04:15 PM",
        "type": "sms"
      }
    },
    "warningSigns": [
      "Sudden and unexplained loss of cellular network (\"No Service\" or \"Emergency Calls Only\") for hours in a familiar coverage area.",
      "Calls from telecom operators asking you to forward codes, click eSIM links, or send specific messages to 121/199.",
      "Unsolicited SMS alerts stating \"Your SIM upgrade request has been registered\".",
      "Receiving OTP requests for services or loans you never applied for."
    ],
    "shieldRules": [
      "If your mobile phone suddenly shows \"No Service\" unexpectedly, contact your telecom operator immediately from another phone.",
      "Never forward telecom activation codes or eSIM QR codes to anyone.",
      "Lock your Aadhaar biometrics using the official mAadhaar app or UIDAI portal.",
      "Always share \"Masked Aadhaar\" (which hides the first 8 digits) for identity verification."
    ],
    "whatToDoIfAffected": [
      "Immediately visit the nearest official telecom store with your original ID to reclaim your mobile number.",
      "Contact all your linked banks from another phone to immediately lock online banking.",
      "Check your CIBIL / credit report on cibil.com for unauthorized loans taken in your name.",
      "Report the identity theft immediately to 1930 and the local police cyber cell."
    ],
    "commonKeywords": ["sim swap", "no service", "esim", "aadhaar lock", "pan card", "telecom upgrade", "5g sim"]
  },
  {
    "id": "investment-lottery-scams",
    "title": "Investment & Lottery Scams",
    "shortTitle": "Investment & Lottery",
    "audience": "seniors",
    "icon": "TrendingUp",
    "badge": "Massive Financial Loss",
    "tagline": "Guaranteed 50% returns, fake KBC lotteries, and WhatsApp stock groups",
    "description": "Fraudsters prey on savings and retirement funds with promises of risk-free multi-fold returns, fake stock trading apps, or grand prize lottery claims.",
    "howItHappens": [
      {
        "step": 1,
        "title": "The Unsolicited Invitation",
        "description": "You are added to a WhatsApp or Telegram group named \"Institutional High Return Stock Tips\" or receive an audio letter claiming you won ₹25 Lakhs in KBC."
      },
      {
        "step": 2,
        "title": "The Illusory Dashboard",
        "description": "They give you access to a fake trading portal or app where your balance falsely displays 300% growth in a week."
      },
      {
        "step": 3,
        "title": "The Exit Extortion",
        "description": "When you ask to withdraw your profits, they claim your account is frozen by SEBI/tax authorities and demand you deposit 30% more in \"processing fees\"."
      }
    ],
    "realLifeScenario": {
      "victimProfile": "Bimal Sen, 68, retired bank officer in Lucknow",
      "story": "Bimal was added to a WhatsApp group titled \"VIP Wealth Creators by Dr. Sharma\". Group members shared screenshots of daily ₹50,000 profits from institutional IPO trading. Bimal started with ₹50,000. Within 10 days, his simulated dashboard showed ₹1,80,000. Feeling confident, he invested his entire retirement gratuity of ₹18 Lakhs. When he clicked withdraw, the admin demanded ₹4.5 Lakhs for \"capital gains tax\". He never received a single rupee.",
      "messagePreview": {
        "sender": "+92 300 XXXXXXX (KBC Lucky Draw)",
        "body": "Namaskar! Your SIM number has won ₹25,00,000 cash in KBC All India WhatsApp Lucky Draw! To claim your cheque, contact KBC Manager Rana Pratap on WhatsApp.",
        "timestamp": "11:00 AM",
        "type": "whatsapp"
      }
    },
    "warningSigns": [
      "Promises of \"guaranteed\" or \"risk-free\" returns above standard market benchmarks (e.g., 20%-50% monthly).",
      "Investment groups on WhatsApp/Telegram with anonymous admins and foreign country numbers.",
      "Instructions to transfer investment funds into personal savings accounts instead of SEBI-registered brokers.",
      "Lottery or prize notifications for contests or draws you never entered."
    ],
    "shieldRules": [
      "In finance: HIGHER RETURN ALWAYS MEANS HIGHER RISK. Anyone promising guaranteed abnormal returns is a criminal.",
      "Only invest through SEBI-registered brokers (e.g. Zerodha, Groww, ICICI Direct, HDFC Sky) verified on sebi.gov.in.",
      "No lottery in the world gives prizes to people who never bought a ticket.",
      "Never pay money to receive prize money."
    ],
    "whatToDoIfAffected": [
      "Do not pay any \"withdrawal fees\" or \"tax release payments\" — they are fabricated extortion attempts.",
      "Report the fraudulent bank accounts where you transferred money to 1930 immediately.",
      "Preserve all bank transaction statements, UTR numbers, and WhatsApp chat archives.",
      "File a comprehensive complaint on cybercrime.gov.in and report the fake entity to SEBI SCORES."
    ],
    "commonKeywords": ["kbc", "lottery", "guaranteed returns", "crypto trading", "stock tips", "sebi", "wealth group"]
  },
  {
    "id": "otp-remote-access-scams",
    "title": "OTP Theft & Remote Access Scams",
    "shortTitle": "Remote Access & OTP",
    "audience": "seniors",
    "icon": "PhoneCall",
    "badge": "High Danger for Seniors",
    "tagline": "Fake customer care, AnyDesk/TeamViewer traps, and digital arrest threats",
    "description": "Imposters claiming to be bank managers, telecom engineers, or police officers intimidate seniors into installing remote-screen sharing apps or disclosing OTPs.",
    "howItHappens": [
      {
        "step": 1,
        "title": "The Authoritative Phone Call",
        "description": "A caller claiming to be an RBI official, SBI security manager, or Police Inspector warns that your pension account is compromised or a parcel with narcotics was found in your name."
      },
      {
        "step": 2,
        "title": "Remote App Installation",
        "description": "They instruct you to download an app like AnyDesk, TeamViewer QuickSupport, or RustDesk from the Play Store to \"run a security patch\" or \"complete video verification\"."
      },
      {
        "step": 3,
        "title": "Live Screen Surveillance",
        "description": "They ask for the 9-digit session code. Once shared, they can see your phone screen in real time, watch you enter passwords, and steal OTPs as they arrive."
      }
    ],
    "realLifeScenario": {
      "victimProfile": "Shakuntala Devi, 71, pensioner in Delhi",
      "story": "Shakuntala received a call from a man speaking polite Hindi, claiming to be from the State Bank pension department. He stated that her digital life certificate was failing to upload and her monthly pension would stop unless updated today. He guided her to install \"QuickSupport\" from Play Store and asked for the 9-digit code displayed on screen. Within 10 minutes, notifications popped up showing three transactions totaling ₹1.2 Lakhs debited from her account.",
      "messagePreview": {
        "sender": "+91 88000 XXXXX (Caller)",
        "body": "Alert from Central Police Control: A FedEx courier containing illegal passports and drugs has been intercepted in your name. Connect on Skype/AnyDesk immediately for digital statement.",
        "timestamp": "03:15 PM",
        "type": "call"
      }
    },
    "warningSigns": [
      "Anyone asking you to download AnyDesk, TeamViewer, RustDesk, or QuickSupport on your mobile phone or computer.",
      "Callers threatening \"Digital Arrest\", Skype police interrogation, or immediate arrest over a phone call.",
      "Anyone asking you to read out a 6-digit or 4-digit code (OTP) sent to your phone.",
      "Customer support numbers found via ordinary Google searches (which are often paid scammer ads)."
    ],
    "shieldRules": [
      "GOLDEN RULE: There is NO legal concept of \"Digital Arrest\" in Indian law. Police or CBI never interrogate via WhatsApp or Skype.",
      "NEVER install remote desktop tools (AnyDesk/TeamViewer) on the instruction of any caller.",
      "NEVER share OTP with ANYONE — bank managers, police officers, and army personnel have zero authority to ask for OTP.",
      "Always find customer care numbers only inside your official banking app or on the back of your physical ATM debit card."
    ],
    "whatToDoIfAffected": [
      "Disconnect your Wi-Fi and mobile data immediately to cut off the remote screen connection.",
      "Turn off your phone and uninstall AnyDesk / TeamViewer using safe mode or settings.",
      "Use another phone to call your bank immediately and place an emergency freeze on all accounts.",
      "Dial 1930 without delay to register a police cybercrime complaint."
    ],
    "commonKeywords": ["anydesk", "teamviewer", "quicksupport", "otp", "digital arrest", "police call", "pension update"]
  }
]

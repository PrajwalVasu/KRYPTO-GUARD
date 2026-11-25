# backend/app/data/quiz_data.py

QUIZ_QUESTIONS = [
  {
    "id": 1,
    "scenario": "Online Resale / QR Code",
    "contextTag": "UPI & Payments",
    "categoryId": "banking-upi-fraud",
    "audience": "all",
    "question": "A buyer on an online marketplace agrees to buy your old table and sends you a QR code on WhatsApp, saying: \"Scan this QR code and enter your UPI PIN to receive ₹5,000 directly into your bank account.\" What should you do?",
    "options": [
      {
        "id": "A",
        "text": "Scan the QR code and enter your PIN, because the buyer seems genuine and polite.",
        "isCorrect": False
      },
      {
        "id": "B",
        "text": "Do NOT scan it. You NEVER need to enter your UPI PIN to receive money.",
        "isCorrect": True
      },
      {
        "id": "C",
        "text": "Enter a wrong PIN first to test if the QR code is real.",
        "isCorrect": False
      },
      {
        "id": "D",
        "text": "Ask the buyer to send ₹10 first to test the connection.",
        "isCorrect": False
      }
    ],
    "explanation": "UPI PIN is strictly meant for DEBITING (sending) money from your account. To receive money, the sender only needs your mobile number or UPI ID — no QR scanning or PIN entry is ever required from you.",
    "safetyRule": "Golden Rule: UPI PIN is ONLY entered to SEND money, NEVER to receive money."
  },
  {
    "id": 2,
    "scenario": "Courier & Customs Arrest Threat",
    "contextTag": "Impersonation & Fear",
    "categoryId": "otp-remote-access-scams",
    "audience": "seniors",
    "question": "You receive a phone call from someone claiming to be a Mumbai Police officer and FedEx customs agent. They claim a parcel with illegal passports and contraband has been sent in your name, and threaten \"Digital Arrest\" unless you transfer ₹50,000 for verification. What is the truth?",
    "options": [
      {
        "id": "A",
        "text": "Transfer the money immediately to avoid being put in jail.",
        "isCorrect": False
      },
      {
        "id": "B",
        "text": "Offer to settle with the officer for half the amount.",
        "isCorrect": False
      },
      {
        "id": "C",
        "text": "Hang up immediately. There is no concept of \"Digital Arrest\" in Indian law; police never demand money transfers over phone calls.",
        "isCorrect": True
      },
      {
        "id": "D",
        "text": "Install Skype or AnyDesk as they instruct to give your official statement.",
        "isCorrect": False
      }
    ],
    "explanation": "Scammers use fear, forged police uniforms, and fake arrest warrants over Skype/WhatsApp video calls. Real police officers never conduct investigations or demand monetary deposits over phone calls or video apps.",
    "safetyRule": "There is NO \"Digital Arrest\" in India. Disconnect the call and report the caller to 1930."
  },
  {
    "id": 3,
    "scenario": "Student Part-time Job Offer",
    "contextTag": "Employment Fraud",
    "categoryId": "job-internship-fraud",
    "audience": "students",
    "question": "You receive a WhatsApp message offering a work-from-home job: \"Like 3 YouTube videos and earn ₹3,000 per day.\" You liked 3 videos and they actually sent ₹150 to your UPI. Now they ask you to deposit ₹3,000 into a \"VIP Merchant Task\" to earn ₹5,000. What is happening?",
    "options": [
      {
        "id": "A",
        "text": "This is a genuine high-paying job, so you should deposit ₹3,000 to double your earnings.",
        "isCorrect": False
      },
      {
        "id": "B",
        "text": "This is a classic Telegram task trap. The initial ₹150 was psychological bait to steal your larger deposit.",
        "isCorrect": True
      },
      {
        "id": "C",
        "text": "Deposit ₹1,000 first to see if they give partial profit.",
        "isCorrect": False
      },
      {
        "id": "D",
        "text": "Invite your friends so you can earn referral commission together.",
        "isCorrect": False
      }
    ],
    "explanation": "Fraudsters pay small token sums upfront (₹100-₹300) to gain your trust. Once you deposit larger sums (₹3,000, ₹10,000, or more), they freeze your funds and demand endless additional \"clearance fees\".",
    "safetyRule": "No legitimate employer ever asks candidates to deposit money to work or withdraw earnings."
  },
  {
    "id": 4,
    "scenario": "Electricity Bill Disconnection SMS",
    "contextTag": "Phishing SMS",
    "categoryId": "phishing-fake-links",
    "audience": "seniors",
    "question": "You receive an SMS at 8 PM: \"Dear Consumer, your electricity will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer immediately at 9876543210.\" What should be your response?",
    "options": [
      {
        "id": "A",
        "text": "Immediately call the 10-digit number because you cannot stay without power at night.",
        "isCorrect": False
      },
      {
        "id": "B",
        "text": "Do not call the number. Check your electricity bill status independently on your official board portal or consumer app.",
        "isCorrect": True
      },
      {
        "id": "C",
        "text": "Forward the message to all your neighbours so they can also call the officer.",
        "isCorrect": False
      },
      {
        "id": "D",
        "text": "Reply to the SMS asking for the officer’s employee ID card photo.",
        "isCorrect": False
      }
    ],
    "explanation": "Electricity utility boards never send disconnection threats with personal 10-digit phone numbers, nor do they cut power at night without prior formal legal notice. Scammers use nighttime panic to make victims install remote apps.",
    "safetyRule": "Always verify utility bills on official state electricity websites, never through SMS contacts."
  },
  {
    "id": 5,
    "scenario": "Urgent Friend Distress DM",
    "contextTag": "Social Media",
    "categoryId": "social-media-impersonation",
    "audience": "students",
    "question": "A close school friend sends you an urgent Instagram Direct Message: \"Bro, my wallet is stolen and I am at hospital. Please send ₹4,000 to this medical UPI ID right now, I will return tomorrow.\" What must you do first?",
    "options": [
      {
        "id": "A",
        "text": "Immediately send the ₹4,000 on GPay to help your friend in an emergency.",
        "isCorrect": False
      },
      {
        "id": "B",
        "text": "Make a direct phone call to your friend’s regular mobile number to verify if it is really them.",
        "isCorrect": True
      },
      {
        "id": "C",
        "text": "Ask them to send a selfie from the hospital before paying.",
        "isCorrect": False
      },
      {
        "id": "D",
        "text": "Send half the money (₹2,000) just to be safe.",
        "isCorrect": False
      }
    ],
    "explanation": "Social media profiles are frequently hacked or duplicated. The fastest, safest verification is a direct regular phone call to your friend’s known phone number to speak to them in person.",
    "safetyRule": "Never transfer emergency money based solely on social media DMs or WhatsApp chats. Always call directly."
  },
  {
    "id": 6,
    "scenario": "Remote Access / AnyDesk Trap",
    "contextTag": "Remote App Theft",
    "categoryId": "otp-remote-access-scams",
    "audience": "seniors",
    "question": "A polite caller claiming to be from your bank customer care says: \"To unblock your debit card, please install AnyDesk / QuickSupport from Play Store and tell me the 9-digit code.\" What happens if you share the code?",
    "options": [
      {
        "id": "A",
        "text": "The caller gets direct visual control of your smartphone screen and can see all your private banking OTPs.",
        "isCorrect": True
      },
      {
        "id": "B",
        "text": "Your card gets safely unblocked by bank technicians.",
        "isCorrect": False
      },
      {
        "id": "C",
        "text": "It only allows the caller to see your photo, nothing else.",
        "isCorrect": False
      },
      {
        "id": "D",
        "text": "The app is a standard bank security tool that protects against viruses.",
        "isCorrect": False
      }
    ],
    "explanation": "AnyDesk, TeamViewer, and QuickSupport are remote desktop tools. Giving a stranger your 9-digit code allows them to view your screen in real time, see your banking passwords, and read OTPs to empty your bank accounts.",
    "safetyRule": "Banks NEVER ask customers to install AnyDesk or TeamViewer. Treat any such request as fraud."
  },
  {
    "id": 7,
    "scenario": "Online Gaming / Free In-Game Currency",
    "contextTag": "Gaming & Youth",
    "categoryId": "phishing-fake-links",
    "audience": "students",
    "question": "A player in an online multiplayer game sends a link: \"Click here to claim 5,000 Free Diamonds/Credits. Login with your Google or Steam credentials to redeem.\" What is the danger?",
    "options": [
      {
        "id": "A",
        "text": "There is no danger if you change your password right after claiming.",
        "isCorrect": False
      },
      {
        "id": "B",
        "text": "The link is a phishing page designed to steal your gaming and email account credentials.",
        "isCorrect": True
      },
      {
        "id": "C",
        "text": "You will only receive 1,000 diamonds instead of 5,000.",
        "isCorrect": False
      },
      {
        "id": "D",
        "text": "It only works on Android devices, not on computers.",
        "isCorrect": False
      }
    ],
    "explanation": "Third-party \"free diamond/skins generator\" sites are phishing portals. Once you enter your email and password, scammers steal your game account, inventory, and potentially your linked payment cards.",
    "safetyRule": "Never log into your accounts via links shared inside game chats or third-party web portals."
  },
  {
    "id": 8,
    "scenario": "The Golden Hour Rule",
    "contextTag": "Emergency Protocol",
    "categoryId": "banking-upi-fraud",
    "audience": "all",
    "question": "If you or an elderly family member accidentally falls victim to an online financial fraud and money is debited, what is the most critical immediate step?",
    "options": [
      {
        "id": "A",
        "text": "Wait 3 days for the bank to automatically reverse the transaction.",
        "isCorrect": False
      },
      {
        "id": "B",
        "text": "Immediately call 1930 (Cybercrime Helpline) and your bank within the \"Golden Hour\" to freeze the transfer.",
        "isCorrect": True
      },
      {
        "id": "C",
        "text": "Delete the banking app and turn off your phone.",
        "isCorrect": False
      },
      {
        "id": "D",
        "text": "Hire a private online recovery agent on Instagram who promises to hack your money back.",
        "isCorrect": False
      }
    ],
    "explanation": "The first 2 hours after a fraudulent transaction is called the \"Golden Hour\". Calling 1930 enables authorities to trigger an immediate inter-bank freeze before the fraudster can withdraw the cash from an ATM.",
    "safetyRule": "Call 1930 immediately! Speed is the single biggest factor in recovering stolen funds."
  },
  {
    "id": 9,
    "scenario": "Google Search Customer Care Trap",
    "contextTag": "Search Engine Spoofing",
    "categoryId": "otp-remote-access-scams",
    "audience": "seniors",
    "question": "You want to contact your airline or Swiggy/Zomato support. You search Google for \"customer care number\" and call the first phone number in the search results. Why is this dangerous?",
    "options": [
      {
        "id": "A",
        "text": "Fraudsters post fake phone numbers on Google Maps and search ads disguised as genuine customer care.",
        "isCorrect": True
      },
      {
        "id": "B",
        "text": "Google search charges international calling fees for customer care numbers.",
        "isCorrect": False
      },
      {
        "id": "C",
        "text": "The search results only show automated AI bots that cannot answer calls.",
        "isCorrect": False
      },
      {
        "id": "D",
        "text": "It is completely safe as Google verifies all phone numbers on the internet.",
        "isCorrect": False
      }
    ],
    "explanation": "Scammers create fake Google business listings and paid ads displaying their own mobile numbers as customer care for airlines, couriers, banks, and food delivery apps. Always find contact info inside the official mobile app.",
    "safetyRule": "Never rely on random Google search results for customer care numbers. Use official apps only."
  },
  {
    "id": 10,
    "scenario": "Password Security & Public Wi-Fi",
    "contextTag": "Digital Hygiene",
    "categoryId": "identity-theft-sim-swap",
    "audience": "students",
    "question": "You are studying at a railway station or cafe and connect to \"Free_Public_WiFi\". What should you avoid doing while connected to this open network?",
    "options": [
      {
        "id": "A",
        "text": "Reading a public Wikipedia article or news website.",
        "isCorrect": False
      },
      {
        "id": "B",
        "text": "Checking the local weather forecast.",
        "isCorrect": False
      },
      {
        "id": "C",
        "text": "Logging into your bank account or performing financial transactions without a secure VPN.",
        "isCorrect": True
      },
      {
        "id": "D",
        "text": "Listening to music through downloaded offline tracks.",
        "isCorrect": False
      }
    ],
    "explanation": "Unsecured public Wi-Fi networks can be intercepted by hackers running \"Man-in-the-Middle\" or rogue hotspot attacks to sniff unencrypted passwords and session cookies.",
    "safetyRule": "Use your phone mobile data or a trusted VPN when accessing net banking or entering passwords."
  }
]

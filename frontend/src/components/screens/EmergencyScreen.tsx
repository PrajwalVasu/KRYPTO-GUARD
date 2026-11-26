import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BANK_CONTACTS } from '../../data/tipsData';
import {
  PhoneCall,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Volume2,
  Copy,
  Info
} from 'lucide-react';

export const EmergencyScreen: React.FC = () => {
  const { speakText } = useApp();
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(id);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const stepsToReport = [
    {
      step: 1,
      title: 'Freeze Bank Accounts Immediately',
      desc: 'Call your bank fraud helpline or send the emergency SMS block code to freeze debit cards, net banking, and UPI access before money moves further.'
    },
    {
      step: 2,
      title: 'Dial Cybercrime Helpline 1930 (Golden Hour)',
      desc: 'Dial 1930 from any phone in India. The operator records the transaction UTR number, beneficiary bank, and triggers an inter-bank stop payment freeze.'
    },
    {
      step: 3,
      title: 'File Formal Police Complaint at cybercrime.gov.in',
      desc: 'Log onto the official National Cyber Crime Reporting Portal. Submit all screenshots, phone numbers, transaction IDs, and get an official FIR acknowledgement.'
    },
    {
      step: 4,
      title: 'Preserve All Evidence',
      desc: 'Do not delete chats, SMS, call records, or APK files. Take clear screenshots showing timestamps, UPI reference IDs, and recipient handles.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
          <PhoneCall className="w-4 h-4" />
          <span>Immediate Emergency Incident Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Emergency Help & Cyber Crime Reporting
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          If you or someone in your family has fallen victim to digital fraud, act swiftly. Follow official government and banking procedures to freeze stolen funds.
        </p>
      </div>

      {/* Mandatory Official Guidance Notice */}
      <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-slate-900">Official Disclaimer: </strong>
          KRYPTOGUARD provides educational guidance and verified official emergency contact information. This app does NOT directly file police complaints or freeze bank accounts on your behalf. You must contact your bank and the official 1930 helpline directly.
        </div>
      </div>

      {/* Golden Hour Urgent Callout */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>The "Golden Hour" Protocol (First 2 Hours)</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Call 1930 Immediately to Stop Payment Flow
          </h2>

          <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
            When cyber fraudsters steal money, they rapidly move it through multiple "mule" bank accounts. Calling <strong>1930</strong> within the first 2 hours enables the Indian Financial Cyber Fraud Reporting System to freeze the money before the criminal can withdraw cash from an ATM.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="tel:1930"
              className="inline-flex items-center gap-2 bg-white text-rose-900 hover:bg-rose-50 font-black px-6 py-3.5 rounded-xl text-sm shadow-lg transition-transform hover:scale-102"
            >
              <PhoneCall className="w-4 h-4 text-rose-700" />
              <span>Direct Dial 1930 (Toll-Free)</span>
            </a>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-rose-950/60 hover:bg-rose-950 text-white border border-rose-400/30 font-semibold px-5 py-3.5 rounded-xl text-sm backdrop-blur-md transition-all"
            >
              <span>National Cyber Portal (cybercrime.gov.in)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Step Immediate Action Plan */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Step-by-Step Reporting Guidance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stepsToReport.map(s => (
            <div
              key={s.step}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                  {s.step}
                </span>
                <h4 className="font-bold text-sm text-slate-900">{s.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Preservation Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Crucial Evidence Preservation Checklist</span>
          </div>
          <button
            onClick={() =>
              speakText(
                'When reporting to 1930, keep these 5 items ready: Bank transaction UTR number, Fraudster phone number or UPI handle, Screenshots of chat or SMS, Your bank account statement, and exact date and timestamp.'
              )
            }
            className="text-xs text-teal-700 flex items-center gap-1 font-semibold"
          >
            <Volume2 className="w-3.5 h-3.5" /> Listen
          </button>
        </div>

        <p className="text-xs text-slate-600">
          When you call 1930 or file on cybercrime.gov.in, the officers require these exact details to trace the payment:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">12-Digit Transaction UTR / Ref Number:</strong>
              Found in your bank SMS notification or UPI transaction history.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">Fraudster’s Identifier:</strong>
              Their phone number, UPI VPA (e.g., name@okhdfc), or website URL.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">Exact Date & Timestamp:</strong>
              The precise minute the unauthorized debit occurred.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">Original Unedited Screenshots:</strong>
              Screenshots of the SMS, WhatsApp chat, or QR code used.
            </div>
          </div>
        </div>
      </div>

      {/* Major Bank Emergency Contact Directory */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Emergency Bank Hotlines & Card Block Directory
          </h3>
          <p className="text-xs text-slate-500">
            Official toll-free fraud reporting numbers for major Indian banks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BANK_CONTACTS.map((bank, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${bank.logoColor}`} />
                  <h4 className="font-bold text-sm text-slate-900">{bank.name}</h4>
                </div>
                <button
                  onClick={() => handleCopy(bank.tollFree, bank.name)}
                  title="Copy number"
                  className="p-1 text-slate-400 hover:text-teal-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Toll-Free Helpline:</span>
                  <a
                    href={`tel:${bank.tollFree.split('/')[0].trim()}`}
                    className="font-bold text-teal-800 hover:underline"
                  >
                    {bank.tollFree}
                  </a>
                  {copiedBank === bank.name && (
                    <span className="text-[10px] text-emerald-600 font-bold ml-2">Copied!</span>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Fraud Email:</span>
                  <span className="font-mono text-slate-600 text-[11px] select-all break-all">
                    {bank.fraudEmail}
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Instant Card Block:</span>
                  <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono break-words">
                    {bank.smsBlockCode}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical What NOT to Do */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 space-y-3 text-xs text-rose-950">
        <h4 className="font-bold text-sm text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Crucial Precautions: What NOT to Do After Fraud</span>
        </h4>
        <ul className="space-y-1.5 pl-5 list-disc leading-relaxed">
          <li><strong>Never hire "Recovery Agents" or "Hackers" on Instagram/Telegram:</strong> They are secondary scammers who will steal more money by promising to hack back your funds.</li>
          <li><strong>Do not delete chats or call logs:</strong> They are required legal proof for the police investigation.</li>
          <li><strong>Never pay "clearance fees" or "tax deposits"</strong> to withdraw locked money from fraudulent trading or job portals.</li>
        </ul>
      </div>
    </div>
  );
};

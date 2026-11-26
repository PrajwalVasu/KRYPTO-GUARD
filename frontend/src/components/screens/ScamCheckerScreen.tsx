import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeScamInput } from '../../utils/scamAnalyzer';
import type { AnalysisResult } from '../../types';
import {
  ShieldAlert,
  MessageSquare,
  Globe,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Share2,
  RotateCcw,
  Volume2,
  Info
} from 'lucide-react';

export const ScamCheckerScreen: React.FC = () => {
  const { setCurrentScreen, speakText } = useApp();

  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'call'>('text');
  const [inputContent, setInputContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pre-filled realistic samples for users to test immediately
  const samplePresets = [
    {
      label: '⚡ Electricity Bill Threat',
      type: 'text' as const,
      text: 'Dear Consumer, Your electricity connection will be disconnected tonight at 9.30 PM due to unpaid bill. Immediately contact Electricity Officer on 93452XXXXX to avoid power cut.'
    },
    {
      label: '🏦 SBI KYC Blocked SMS',
      type: 'text' as const,
      text: 'Dear Customer, Your SBI YONO account is suspended due to pending PAN/KYC update. Kindly click http://sbi-kyc-verify82.xyz and update within 2 hours or your account will be blocked.'
    },
    {
      label: '💼 Telegram Student Job',
      type: 'text' as const,
      text: 'Part-time Work From Home: Earn ₹3,000 - ₹8,000 daily by simply rating hotels and liking YouTube videos. Join our official Telegram VIP group now: t.me/fast_earn_2026'
    },
    {
      label: '💸 OLX Buyer QR Trap',
      type: 'text' as const,
      text: 'Buyer: Sir I have transferred ₹12,000 for your old table. Please scan this QR code on Google Pay and enter your UPI PIN to approve the credit into your bank account.'
    },
    {
      label: '📞 AnyDesk Customer Care Call',
      type: 'call' as const,
      text: 'Caller claims to be from Bank technical support: "Sir, to fix your 5G network and card security, please download AnyDesk / QuickSupport from Play Store and tell me the 9-digit code on your screen."'
    },
    {
      label: '🥗 Genuine Food Delivery OTP',
      type: 'text' as const,
      text: 'Your OTP for Swiggy food delivery is 628104. Valid for 5 minutes. Please do not share this OTP with anyone, including delivery executives.'
    }
  ];

  const handleRunAnalysis = () => {
    if (!inputContent.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeScamInput(activeTab, inputContent);
      setAnalysisResult(res);
      setIsAnalyzing(false);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 600);
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setActiveTab(preset.type);
    setInputContent(preset.text);
    setAnalysisResult(null);
  };

  const handleReset = () => {
    setInputContent('');
    setAnalysisResult(null);
  };

  const handleShareReport = () => {
    if (!analysisResult) return;
    const reportText = `🛡️ *KRYPTOGUARD Scam Analysis Report*:\nRisk Level: ${analysisResult.riskLevel.toUpperCase()} (Score: ${analysisResult.score}/100)\n\nSummary: ${analysisResult.summary}\n\nWarning Flags: ${analysisResult.detectedFlags.map(f => `\n- ${f.title}`).join('')}\n\n*Action*: ${analysisResult.recommendedActions[0] || 'Do not click links or share OTP.'}\n\nStay alert! Call 1930 for cyber fraud emergencies.`;

    if (navigator.share) {
      navigator.share({ title: 'KRYPTOGUARD Scam Report', text: reportText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Title & Purpose */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Interactive Deception Heuristic Analyzer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Scam Checker & Link Inspector
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Paste a suspicious SMS message, enter a dubious website URL, or describe a suspicious phone call. Our cybersecurity heuristic engine checks for fear tactics, remote tool installation, deceptive domains, and OTP traps.
        </p>
      </div>

      {/* Mandatory Educational Transparency Notice */}
      <div className="bg-slate-100 border border-slate-300/80 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-slate-900">Educational Simulation Notice: </strong>
          This analyzer uses rule-based cybersecurity heuristics to detect common patterns of deception. We will <em>never</em> certify any unknown message or link as guaranteed safe. Always verify independently through official apps or bank customer care.
        </div>
      </div>

      {/* Sample Presets to try */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 block">
          Try a Realistic Real-World Sample:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-teal-400 text-slate-700 text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Input Mode Tabs */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50/70 p-2 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('text');
              setAnalysisResult(null);
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'text'
                ? 'bg-white text-[#0F766E] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>SMS / WhatsApp Message</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('url');
              setAnalysisResult(null);
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'url'
                ? 'bg-white text-[#0F766E] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>Suspicious Link / URL</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('call');
              setAnalysisResult(null);
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'call'
                ? 'bg-white text-[#0F766E] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span>Phone Call / Caller Demands</span>
          </button>
        </div>

        {/* Text Area */}
        <div className="p-4 sm:p-6 space-y-4">
          <label className="block text-xs font-bold text-slate-700">
            {activeTab === 'text'
              ? 'Paste the complete SMS, WhatsApp text, or Telegram message below:'
              : activeTab === 'url'
              ? 'Enter the suspicious website URL or domain name:'
              : 'Describe what the caller said, who they claimed to be, and what they demanded:'}
          </label>

          <textarea
            rows={5}
            value={inputContent}
            onChange={e => setInputContent(e.target.value)}
            placeholder={
              activeTab === 'text'
                ? 'e.g., "Dear customer, your bank account is suspended due to pending KYC. Click link..."'
                : activeTab === 'url'
                ? 'e.g., http://sbi-kyc-update.xyz or http://gift-loot-sale.online'
                : 'e.g., "A caller claiming to be a police officer from Mumbai Customs said a parcel in my name has illegal passports and told me to install AnyDesk..."'
            }
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-y"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-400">
              * Privacy Protected: Input is analyzed client-side for educational purposes. Never store credentials.
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {inputContent && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={handleRunAnalysis}
                disabled={!inputContent.trim() || isAnalyzing}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:bg-slate-300 text-white text-xs font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-102"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Red Flags...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Analyze Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 5: SCAM ANALYSIS RESULTS */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div
            className={`rounded-3xl p-4 sm:p-8 border shadow-lg ${
              analysisResult.riskLevel === 'high'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : analysisResult.riskLevel === 'suspicious'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-current/15">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-md shrink-0 ${
                    analysisResult.riskLevel === 'high'
                      ? 'bg-rose-600'
                      : analysisResult.riskLevel === 'suspicious'
                      ? 'bg-amber-600'
                      : 'bg-slate-700'
                  }`}
                >
                  {analysisResult.riskLevel === 'high' ? (
                    <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
                  ) : analysisResult.riskLevel === 'suspicious' ? (
                    <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
                  ) : (
                    <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                        analysisResult.riskLevel === 'high'
                          ? 'bg-rose-200 text-rose-900'
                          : analysisResult.riskLevel === 'suspicious'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {analysisResult.riskLevel === 'high'
                        ? 'High-Risk Scam Indicators Detected'
                        : analysisResult.riskLevel === 'suspicious'
                        ? 'Suspicious Patterns Found'
                        : 'Low-Risk / Inconclusive'}
                    </span>
                    <span className="text-xs font-bold opacity-75">
                      Threat Score: {analysisResult.score}/100
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight mt-1 break-words">
                    {analysisResult.summary}
                  </h2>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() =>
                    speakText(
                      `${analysisResult.summary}. Threat score: ${analysisResult.score}. Recommended action: ${analysisResult.recommendedActions[0]}`
                    )
                  }
                  title="Listen to result"
                  className="p-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-800 border border-slate-200 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShareReport}
                  title="Share warning with family"
                  className="p-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-800 border border-slate-200 transition-colors relative"
                >
                  <Share2 className="w-4 h-4" />
                  {copied && (
                    <span className="absolute -top-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Warning Flags Breakdown */}
            <div className="py-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider opacity-80">
                Detected Red Flags & Heuristic Signals ({analysisResult.detectedFlags.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.detectedFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-current/10 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          flag.severity === 'critical'
                            ? 'bg-rose-600'
                            : flag.severity === 'warning'
                            ? 'bg-amber-600'
                            : 'bg-blue-600'
                        }`}
                      />
                      <h4 className="font-bold text-sm text-slate-900">{flag.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-4">
                      {flag.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Suspicious & Action Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-current/15">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Why this content is dangerous:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysisResult.whyItIsSuspicious.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-600">&bull;</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Recommended Immediate Actions:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                  {analysisResult.recommendedActions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Emergency Forwarding Strip */}
            <div className="mt-6 pt-4 border-t border-current/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-600">
                Did you already click this link or transfer funds?
              </span>

              <button
                onClick={() => setCurrentScreen('emergency')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 shadow-sm transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Go to Emergency Protocol & Dial 1930</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

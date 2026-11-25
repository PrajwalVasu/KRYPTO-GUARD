import React from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCall, ExternalLink, Heart, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentScreen, setShowJargonModal } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Urgent Helpline Callout Banner */}
        <div className="bg-gradient-to-r from-teal-900/60 to-slate-800 border border-teal-500/30 rounded-2xl p-6 sm:p-8 mb-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Victim of Digital Fraud? Act in the Golden Hour</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Dial 1930 Immediately or File Online at cybercrime.gov.in
            </h3>
            <p className="text-sm text-slate-300">
              The first 2 hours are crucial to freezing stolen funds within the Indian inter-bank payment gateway before withdrawal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:1930"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-900/30 transition-all hover:scale-102"
            >
              <PhoneCall className="w-4 h-4" />
              Call Helpline 1930
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              National Cyber Portal <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4 Column Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs">
                <img src="/logo.png" alt="KRYPTO GUARD Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                KRYPTO<span className="text-teal-400">GUARD</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students, families, and senior citizens with practical cyber defense awareness and fraud prevention guidance.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setShowJargonModal(true)}
                className="text-xs text-teal-400 hover:text-teal-300 underline font-medium"
              >
                Browse Cyber Jargon Dictionary &rarr;
              </button>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="hover:text-white transition-colors"
                >
                  Home Safety Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentScreen('learn')}
                  className="hover:text-white transition-colors"
                >
                  8 Fraud Categories & Red Flags
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentScreen('checker')}
                  className="hover:text-white transition-colors"
                >
                  Heuristic Scam Message Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentScreen('quiz')}
                  className="hover:text-white transition-colors"
                >
                  Interactive Safety Scenario Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentScreen('emergency')}
                  className="hover:text-white transition-colors"
                >
                  Emergency Bank Directory & Reporting
                </button>
              </li>
            </ul>
          </div>

          {/* Golden Rules */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              3 Golden Cyber Rules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">1.</span>
                <span>UPI PIN is strictly to PAY money, never to receive.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">2.</span>
                <span>Banks never ask you to install AnyDesk or TeamViewer.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">3.</span>
                <span>Never trust caller ID or Google search customer care.</span>
              </li>
            </ul>
          </div>

          {/* Official Indian Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Official Indian Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  National Cyber Crime Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  RBI Kehta Hai (Financial Literacy) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://sancharsaathi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  Sanchar Saathi (Block Stolen Phone) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://uidai.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  UIDAI mAadhaar (Biometric Lock) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Transparency Notice */}
        <div className="text-[11px] text-slate-500 space-y-2 text-center sm:text-left">
          <p>
            <strong className="text-slate-400">Educational Project Disclaimer:</strong> KRYPTOGUARD is an independent community education platform designed to raise awareness against digital fraud for students and senior citizens. This application does NOT file official police reports, freeze bank accounts directly, or connect to live surveillance intelligence. Always report incidents directly to the official National Cyber Crime Reporting Portal (<a href="https://cybercrime.gov.in" className="underline hover:text-slate-300">cybercrime.gov.in</a>) or dial helpline 1930.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2">
            <span>Built for Cyber Safety and Digital Fraud Awareness &bull; Free & Open Community Education</span>
            <span className="flex items-center gap-1">
              Stay Vigilant. Protect Your Family <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

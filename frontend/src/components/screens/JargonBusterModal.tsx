import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JARGON_TERMS } from '../../data/tipsData';
import { BookOpen, X, Search, Lightbulb, ShieldCheck, Volume2 } from 'lucide-react';

export const JargonBusterModal: React.FC = () => {
  const { showJargonModal, setShowJargonModal, speakText } = useApp();
  const [search, setSearch] = useState('');

  if (!showJargonModal) return null;

  const filtered = JARGON_TERMS.filter(
    item =>
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      (item.hindiTerm && item.hindiTerm.includes(search)) ||
      item.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-teal-800 to-[#0F766E] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Cyber Jargon Buster</h2>
              <p className="text-xs text-teal-100">Simple English & Hindi explanations of tricky cyber terms</p>
            </div>
          </div>
          <button
            onClick={() => setShowJargonModal(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search terms (e.g. UPI PIN, OTP, Remote App, Phishing)..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 divide-y divide-slate-100">
          {filtered.map((item, idx) => (
            <div key={idx} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <h3 className="font-bold text-base text-[#0F172A]">{item.term}</h3>
                  {item.hindiTerm && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/50">
                      {item.hindiTerm}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => speakText(`${item.term}. ${item.meaning}. Analogy: ${item.realWorldAnalogy}. Takeaway: ${item.safetyTakeaway}`)}
                  title="Read aloud"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{item.meaning}</p>

              {/* Real World Analogy */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/50 flex items-start gap-2.5 text-xs text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950">Real-World Analogy: </span>
                  {item.realWorldAnalogy}
                </div>
              </div>

              {/* Golden Takeaway */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/50 flex items-start gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950">Safety Rule: </span>
                  {item.safetyTakeaway}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching terms found. Try searching for "OTP" or "UPI".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => setShowJargonModal(false)}
            className="px-5 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59] transition-colors"
          >
            Close Dictionary
          </button>
        </div>
      </div>
    </div>
  );
};

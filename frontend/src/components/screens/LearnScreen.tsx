import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SCAM_CATEGORIES } from '../../data/scamsData';
import {
  Search,
  BookOpen,
  Volume2,
  AlertTriangle,
  ShieldCheck,
  LifeBuoy,
  PhoneCall,
  CheckCircle2,
  X,
  CreditCard,
  Link,
  Users,
  Briefcase,
  ShoppingBag,
  ShieldAlert,
  TrendingUp,
  ArrowRight,
  Loader2
} from 'lucide-react';

export const LearnScreen: React.FC = () => {
  const {
    targetAudience,
    selectedScamId,
    setSelectedScamId,
    completedLessons,
    markLessonComplete,
    unmarkLessonComplete,
    setCurrentScreen,
    speakText,
    isAuthenticated,
    setShowAuthModal,
    setAuthModalMessage
  } = useApp();

  const [search, setSearch] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'students' | 'seniors'>('all');
  const [isLessonMutating, setIsLessonMutating] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);

  // Currently opened scam detail modal
  const activeScam = SCAM_CATEGORIES.find(s => s.id === selectedScamId);

  // Filtered categories
  const filteredScams = SCAM_CATEGORIES.filter(scam => {
    const matchesAudience =
      activeCategoryFilter === 'all'
        ? targetAudience === 'all' || scam.audience === 'all' || scam.audience === targetAudience
        : scam.audience === 'all' || scam.audience === activeCategoryFilter;

    const matchesSearch =
      scam.title.toLowerCase().includes(search.toLowerCase()) ||
      scam.tagline.toLowerCase().includes(search.toLowerCase()) ||
      scam.description.toLowerCase().includes(search.toLowerCase()) ||
      scam.commonKeywords.some(kw => kw.toLowerCase().includes(search.toLowerCase()));

    return matchesAudience && matchesSearch;
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="w-6 h-6 text-[#0F766E]" />;
      case 'Link': return <Link className="w-6 h-6 text-blue-600" />;
      case 'Users': return <Users className="w-6 h-6 text-purple-600" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-amber-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-rose-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-red-600" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'PhoneCall': return <PhoneCall className="w-6 h-6 text-orange-600" />;
      default: return <BookOpen className="w-6 h-6 text-[#0F766E]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Fraud Academy & Prevention Guide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learn About Frauds & Red Flags
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Deep dive into the 8 most widespread digital frauds in India with real scenarios, red flags, and recovery guides.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search frauds (e.g. AnyDesk, QR code, UPI, jobs)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-2xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeCategoryFilter === 'all'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All 8 Scam Categories
        </button>
        <button
          onClick={() => setActiveCategoryFilter('seniors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeCategoryFilter === 'seniors'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          👵 Senior Citizen Priorities
        </button>
        <button
          onClick={() => setActiveCategoryFilter('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeCategoryFilter === 'students'
              ? 'bg-[#0F766E] text-white shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🎓 Student & Youth Priorities
        </button>
      </div>

      {/* Grid of Scam Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScams.map(scam => {
          const isCompleted = completedLessons.includes(scam.id);
          return (
            <div
              key={scam.id}
              onClick={() => setSelectedScamId(scam.id)}
              className="group bg-white rounded-3xl border border-slate-200/90 p-6 hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-slate-50 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(scam.icon)}
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Learned
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200/60">
                      {scam.badge}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors">
                  {scam.title}
                </h2>
                <p className="text-xs text-teal-800 font-semibold mt-1">
                  {scam.tagline}
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {scam.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F766E]">
                <span>Read Full Lesson & Red Flags</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredScams.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <p className="text-slate-500 text-sm">No scam categories found matching your search.</p>
          <button
            onClick={() => {
              setSearch('');
              setActiveCategoryFilter('all');
            }}
            className="text-xs font-bold text-[#0F766E] underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Interactive Detail Modal / Full Reading View */}
      {activeScam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white flex items-start justify-between gap-3 sm:gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-emerald-100">
                    {activeScam.badge}
                  </span>
                  <span className="text-xs text-teal-100">
                    {activeScam.audience === 'seniors'
                      ? 'Elder Care Focus'
                      : activeScam.audience === 'students'
                      ? 'Student Focus'
                      : 'General Public'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {activeScam.title}
                </h2>
                <p className="text-xs sm:text-sm text-teal-100 mt-1">
                  {activeScam.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    speakText(
                      `${activeScam.title}. ${activeScam.description}. Real life story: ${activeScam.realLifeScenario.story}. Key shield rule: ${activeScam.shieldRules[0]}`
                    )
                  }
                  title="Listen to this lesson"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedScamId(null);
                    setLessonError(null);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-8 overflow-y-auto space-y-6 sm:space-y-8">
              {/* Overview */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-900 mb-2">
                  What is this scam?
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeScam.description}
                </p>
              </div>

              {/* Step by Step Timeline */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-900 mb-3">
                  How does it happen? (Step-by-Step)
                </h3>
                <div className="space-y-3">
                  {activeScam.howItHappens.map(step => (
                    <div
                      key={step.step}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5"
                    >
                      <span className="w-7 h-7 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                        {step.step}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Realistic Real Life Scenario & Message Preview */}
              <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Real-Life Case Scenario</span>
                </div>

                <div className="text-xs text-amber-950 font-medium">
                  <strong>Case Profile: </strong>
                  {activeScam.realLifeScenario.victimProfile}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-white/70 p-4 rounded-xl border border-amber-200/50">
                  "{activeScam.realLifeScenario.story}"
                </p>

                {/* Simulated Message Preview Box */}
                {activeScam.realLifeScenario.messagePreview && (
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 sm:p-4 text-xs font-mono border border-slate-800 space-y-1.5 shadow-inner overflow-x-auto">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400 border-b border-slate-800 pb-1 font-sans">
                      <span className="break-all">Sender: {activeScam.realLifeScenario.messagePreview.sender}</span>
                      <span>{activeScam.realLifeScenario.messagePreview.timestamp}</span>
                    </div>
                    <p className="text-emerald-300 font-sans text-xs pt-1 break-words">
                      {activeScam.realLifeScenario.messagePreview.body}
                    </p>
                  </div>
                )}
              </div>

              {/* Red Flags Checklist */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Deadly Warning Signs (Red Flags)</span>
                </h3>
                <div className="space-y-2">
                  {activeScam.warningSigns.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60 flex items-start gap-2.5 text-xs text-rose-950"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                      <span className="leading-relaxed font-medium">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shield Rules (How to Protect) */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>How to Protect Yourself (Shield Rules)</span>
                </h3>
                <div className="space-y-2">
                  {activeScam.shieldRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-start gap-2.5 text-xs text-emerald-950"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to do if Affected */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  <LifeBuoy className="w-4 h-4" />
                  <span>What to do if already affected (Emergency Recovery)</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  {activeScam.whatToDoIfAffected.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">{idx + 1}.</span>
                      <span className="leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <button
                  disabled={isLessonMutating}
                  onClick={async () => {
                    if (isLessonMutating) return;

                    // Require sign-in before saving lesson completion
                    if (!isAuthenticated) {
                      setAuthModalMessage({
                        title: 'Sign in to save your learning progress.',
                        message: 'Create an account or sign in to track completed lessons, monitor your Reflex Score, and continue learning across sessions.'
                      });
                      setShowAuthModal(true);
                      return;
                    }

                    setIsLessonMutating(true);
                    setLessonError(null);
                    try {
                      if (completedLessons.includes(activeScam.id)) {
                        await unmarkLessonComplete(activeScam.id);
                      } else {
                        await markLessonComplete(activeScam.id);
                      }
                    } catch (err: unknown) {
                      const msg = err instanceof Error ? err.message : 'Failed to update lesson status';
                      setLessonError(msg);
                    } finally {
                      setIsLessonMutating(false);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                    completedLessons.includes(activeScam.id)
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-[#0F766E] hover:bg-[#115E59] text-white'
                  } disabled:opacity-50`}
                >
                  {isLessonMutating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : completedLessons.includes(activeScam.id) ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : null}
                  <span>
                    {completedLessons.includes(activeScam.id)
                      ? '✓ Completed (Click to Unmark)'
                      : '✓ Mark This Lesson'}
                  </span>
                </button>
                {lessonError && (
                  <span className="text-[11px] text-rose-600 font-semibold">{lessonError}</span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedScamId(null);
                    setLessonError(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedScamId(null);
                    setCurrentScreen('checker');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1 transition-colors"
                >
                  <span>Test in Scam Checker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

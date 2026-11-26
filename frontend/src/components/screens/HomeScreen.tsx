import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAILY_TIPS } from '../../data/tipsData';
import { SCAM_CATEGORIES } from '../../data/scamsData';
import {
  ShieldAlert,
  BookOpen,
  Award,
  PhoneCall,
  Volume2,
  Share2,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    setCurrentScreen,
    targetAudience,
    openScamDetail,
    speakText,
    completedLessons,
    quizScore,
    isAuthenticated,
    progress,
    quizHistory,
  } = useApp();

  const [tipIndex, setTipIndex] = useState(0);
  const [copiedTip, setCopiedTip] = useState(false);

  // Filter tips by audience
  const relevantTips = DAILY_TIPS.filter(
    t => t.forAudience === 'all' || t.forAudience === targetAudience
  );
  const currentTip = relevantTips[tipIndex % relevantTips.length] || DAILY_TIPS[0];

  const nextTip = () => {
    setTipIndex(prev => (prev + 1) % relevantTips.length);
  };

  const handleShareTip = () => {
    const text = `🚨 *Cyber Safety Tip from KRYPTOGUARD*:\n\n"${currentTip.tip}"\n\n👉 *What to do*: ${currentTip.actionableStep}\n\nStay safe! Dial 1930 for cyber fraud emergencies.`;
    if (navigator.share) {
      navigator.share({ title: 'KRYPTOGUARD Safety Tip', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedTip(true);
      setTimeout(() => setCopiedTip(false), 2000);
    }
  };

  const calculateProgress = () => {
    const total = SCAM_CATEGORIES.length;
    const completed = completedLessons.length;
    return Math.min(Math.round((completed / total) * 100), 100);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Live Threat Alert Bar for India */}
      <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
          <p className="text-xs sm:text-sm text-amber-950 font-medium">
            <strong className="font-bold text-amber-900">Current Threat Alert: </strong>
            Fraudulent "Electricity Bill Disconnection" SMS and "Digital Arrest" calls are active. Never call 10-digit numbers sent in SMS!
          </p>
        </div>
        <button
          onClick={() => openScamDetail('phishing-fake-links')}
          className="text-xs font-bold text-amber-900 underline shrink-0 hover:text-amber-700 hidden sm:inline"
        >
          Read Details &rarr;
        </button>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F766E] via-[#115E59] to-[#0F172A] p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {targetAudience === 'seniors'
                  ? 'Senior Citizen Protection Active'
                  : targetAudience === 'students'
                  ? 'Student Cyber Defense Active'
                  : 'All-Round Cyber Defense Active'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {targetAudience === 'seniors'
                ? 'Stay Safe from Fake Bank Calls & UPI Traps'
                : targetAudience === 'students'
                ? 'Spot Fake Job Offers, Gaming Scams & Cloned Accounts'
                : 'Defend Your Family Against Digital Fraud & Online Theft'}
            </h1>

            <p className="text-sm sm:text-base text-teal-100 leading-relaxed">
              KRYPTOGUARD explains online scams in plain language with real-world examples, warning signs, and immediate recovery steps.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentScreen('checker')}
                className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm shadow-md transition-all hover:scale-102"
              >
                <ShieldAlert className="w-4 h-4 text-slate-950" />
                <span>Check Suspicious Message</span>
              </button>

              <button
                onClick={() => setCurrentScreen('learn')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-5 py-3 rounded-xl text-sm backdrop-blur-md transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse 8 Scam Types</span>
              </button>
            </div>
          </div>

          {/* Quick Safety Score Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full lg:w-72 shrink-0 space-y-4">
            <div className="flex items-center justify-between text-xs text-teal-200">
              <span>Your Safety Readiness</span>
              <span className="font-bold text-white">
                {isAuthenticated && progress
                  ? `${progress.lessons.completionPercentage}% Complete`
                  : `${calculateProgress()}% Complete`}
              </span>
            </div>

            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    isAuthenticated && progress
                      ? progress.lessons.completionPercentage
                      : calculateProgress()
                  }%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="block text-lg font-bold text-white">
                  {isAuthenticated && progress
                    ? `${progress.lessons.completed}/${progress.lessons.total}`
                    : `${completedLessons.length}/8`}
                </span>
                <span className="text-teal-200 text-[11px]">Lessons Studied</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl min-w-0">
                <span className="block text-sm sm:text-lg font-bold text-white break-words">
                  {isAuthenticated && progress
                    ? progress.reflexScore.isCalibrated
                      ? `${progress.reflexScore.score}/100`
                      : `${progress.reflexScore.score}/40`
                    : quizScore
                    ? `${quizScore.score}/${quizScore.total}`
                    : 'Unattempted'}
                </span>
                <span className="text-teal-200 text-[11px]">
                  {isAuthenticated && progress
                    ? progress.reflexScore.isCalibrated
                      ? 'Reflex Score'
                      : 'Provisional Score'
                    : 'Quiz Score'}
                </span>
              </div>
            </div>

            {/* Authenticated Reflex Score Rank & Calibration Explanation */}
            {isAuthenticated && progress && (
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between text-[11px] text-teal-100 font-semibold">
                  <span className="truncate">{progress.reflexScore.rankTitle}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-emerald-200 shrink-0">
                    {progress.reflexScore.isCalibrated ? 'Calibrated' : 'Provisional'}
                  </span>
                </div>
                {!progress.reflexScore.isCalibrated && (
                  <p className="text-[10px] text-amber-200/90 leading-tight">
                    {progress.reflexScore.explanation}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => setCurrentScreen('quiz')}
              className="w-full text-center text-xs text-emerald-200 hover:text-white font-bold flex items-center justify-center gap-1 pt-1"
            >
              <span>
                {isAuthenticated && progress
                  ? progress.quizzes.totalAttempts > 0
                    ? 'Retake Safety Quiz'
                    : 'Take Safety Quiz to Calibrate'
                  : quizScore
                  ? 'Retake Safety Quiz'
                  : 'Take Safety Quiz'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weak Areas to Review Section */}
      {isAuthenticated && progress && progress.weakCategories && progress.weakCategories.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4 mt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Weak Areas to Review</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {progress.weakCategories.map((wc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-teal-400 hover:bg-teal-50/20 transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  if (!wc.isLessonCompleted) {
                    openScamDetail(wc.categoryId);
                  }
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-medium text-slate-900">{wc.categoryTitle}</span>
                  {wc.isLessonCompleted ? (
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Lesson Completed</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Needs Review</span>
                  )}
                </div>
                <div className="text-sm text-slate-600">
                  Incorrect Answers: {wc.incorrectAnswersCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Personalized Learning Recommendations for Authenticated Users */}
      {isAuthenticated && progress && progress.recommendations && progress.recommendations.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-[#0F766E]">
                  Personalized Priorities
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Recommended Next Steps
                </h2>
              </div>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline font-medium">
              Rank: {progress.reflexScore.rankTitle}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {progress.recommendations.slice(0, 3).map((rec, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (rec.categoryId && rec.categoryId !== 'general-review') {
                    openScamDetail(rec.categoryId);
                  } else {
                    setCurrentScreen('learn');
                  }
                }}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-teal-400 hover:bg-teal-50/20 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        rec.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : rec.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{rec.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {rec.reason}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F766E]">
                  <span>{rec.categoryId !== 'general-review' ? 'Study Lesson' : 'Review Tips'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

{/* Quiz History Section */}
        {isAuthenticated && quizHistory && quizHistory.attempts && quizHistory.attempts.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4 mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Recent Quiz Attempts</h2>
            <ul className="divide-y divide-slate-200">
              {quizHistory.attempts.map((attempt, idx) => (
                <li key={idx} className="py-3 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {attempt.rankTitle} – {attempt.score}/{attempt.total} ({attempt.percentage}%)
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(attempt.createdAt).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Daily Safety Tip of the Day */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-[#0F766E]">
                  Daily Cyber Shield Tip
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {currentTip.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {currentTip.tip}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => speakText(`${currentTip.tip}. Actionable Advice: ${currentTip.actionableStep}`)}
              title="Listen to tip"
              className="p-2 rounded-xl text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleShareTip}
              title="Share on WhatsApp or Copy"
              className="p-2 rounded-xl text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-colors relative"
            >
              <Share2 className="w-5 h-5" />
              {copiedTip && (
                <span className="absolute -top-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
            <button
              onClick={nextTip}
              title="Next Tip"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next</span>
            </button>
          </div>
        </div>

        <div className="pt-4 flex items-start gap-3 text-sm text-slate-600">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-900">Action Step: </strong>
            {currentTip.actionableStep}
          </p>
        </div>
      </div>

      {/* 4 Core Action Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Core Protection Modules
            </h2>
            <p className="text-xs text-slate-500">
              Interactive tools designed to spot, understand, and stop digital fraud.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Scam Checker */}
          <div
            onClick={() => setCurrentScreen('checker')}
            className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                Simulated Analyzer
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors mt-1">
                Scam Checker
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Paste suspicious SMS, test a URL, or describe a suspicious phone call to inspect red flags.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#0F766E] mt-4 pt-3 border-t border-slate-100">
              <span>Test a Message</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Learn Hub */}
          <div
            onClick={() => setCurrentScreen('learn')}
            className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[10px] uppercase font-bold text-[#0F766E] tracking-wider">
                Knowledge Base
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors mt-1">
                Learn Frauds
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Detailed breakdowns of UPI traps, fake jobs, electricity SMS threats, and AnyDesk tricks.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#0F766E] mt-4 pt-3 border-t border-slate-100">
              <span>Explore 8 Types</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Safety Quiz */}
          <div
            onClick={() => setCurrentScreen('quiz')}
            className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                Reflex Trainer
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-1">
                Safety Quiz
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Test your instincts with 10 realistic scenario challenges tailored to students and elders.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-700 mt-4 pt-3 border-t border-slate-100">
              <span>Start Challenge</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Emergency Assistance */}
          <div
            onClick={() => setCurrentScreen('emergency')}
            className="group bg-rose-50/70 p-6 rounded-3xl border border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
                Emergency 1930
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-700 transition-colors mt-1">
                Emergency Help
              </h3>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                The Golden Hour guide, official 1930 helpline dialer, and bank hotlines to block stolen funds.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-rose-700 mt-4 pt-3 border-t border-rose-200">
              <span>Get Immediate Help</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Topics for Current Audience */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {targetAudience === 'seniors'
                ? 'High-Priority Threats for Senior Citizens'
                : targetAudience === 'students'
                ? 'High-Priority Scams Targeting Students'
                : 'Most Common Digital Scams in India'}
            </h2>
            <p className="text-xs text-slate-500">
              Real-world examples and the exact warning signs to remember.
            </p>
          </div>
          <button
            onClick={() => setCurrentScreen('learn')}
            className="text-xs font-bold text-[#0F766E] hover:underline hidden sm:inline"
          >
            View all 8 &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCAM_CATEGORIES.slice(0, 3).map(scam => (
            <div
              key={scam.id}
              onClick={() => openScamDetail(scam.id)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200/50">
                    {scam.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{scam.shortTitle}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{scam.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {scam.tagline}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F766E]">Read Prevention Steps</span>
                <ChevronRight className="w-4 h-4 text-[#0F766E]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

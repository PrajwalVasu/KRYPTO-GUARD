import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, PhoneCall, VolumeX, Eye, BookOpen, User, GraduationCap, HeartHandshake, LogIn, LogOut } from 'lucide-react';
import type { TargetAudience } from '../../types';

export const Header: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    targetAudience,
    setTargetAudience,
    fontSize,
    cycleFontSize,
    highContrast,
    toggleHighContrast,
    language,
    toggleLanguage,
    isSpeaking,
    stopSpeaking,
    setShowJargonModal,
    setShowOnboarding,
    user,
    isAuthenticated,
    logout,
    setShowAuthModal,
    setAuthError,
    setAuthModalMessage
  } = useApp();

  const audienceLabels: { id: TargetAudience; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'all', label: language === 'hi' ? 'सभी के लिए' : 'All Topics', icon: <User className="w-3.5 h-3.5" />, desc: 'Complete fraud safety guide' },
    { id: 'students', label: language === 'hi' ? 'छात्र (Students)' : 'Students & Youth', icon: <GraduationCap className="w-3.5 h-3.5" />, desc: 'Gaming, Jobs, Privacy' },
    { id: 'seniors', label: language === 'hi' ? 'वरिष्ठ नागरिक (Seniors)' : 'Senior Citizens', icon: <HeartHandshake className="w-3.5 h-3.5" />, desc: 'Bank calls, UPI, OTPs' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Emergency Hotline Top Ribbon */}
      <div className="bg-[#0F766E] text-white px-4 py-1.5 text-xs sm:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="font-semibold text-emerald-100">
              {language === 'hi' ? 'आपातकालीन राष्ट्रीय साइबर हेल्पलाइन:' : 'National Cybercrime Helpline:'}
            </span>
            <a
              href="tel:1930"
              className="underline font-bold text-white hover:text-emerald-200 transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 inline" /> 1930 (Toll-Free)
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowJargonModal(true)}
              className="hidden sm:inline-flex items-center gap-1 text-emerald-100 hover:text-white transition-colors text-xs font-semibold px-2 py-0.5 rounded bg-teal-800/60 hover:bg-teal-800"
            >
              <BookOpen className="w-3 h-3" />
              {language === 'hi' ? 'शब्दावली (Jargon Buster)' : 'Jargon Buster'}
            </button>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-200 hover:text-white underline truncate hidden md:inline"
            >
              cybercrime.gov.in
            </a>
          </div>
        </div>
      </div>

      {/* Main App Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0F766E] to-[#115E59] flex items-center justify-center text-white shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-[#0F172A]">
                  KRYPTO<span className="text-[#0F766E]">GUARD</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-[#0F766E] border border-teal-200/60 hidden sm:inline-block">
                  Safety Shield
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
                {language === 'hi' ? 'डिजिटल धोखाधड़ी से सुरक्षा व जागरूकता' : 'Digital Fraud & Cyber Safety Awareness'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentScreen === 'home'
                  ? 'bg-teal-50 text-[#0F766E] border border-teal-200/70 shadow-2xs'
                  : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/70'
              }`}
            >
              {language === 'hi' ? 'होम डैशबोर्ड' : 'Home'}
            </button>
            <button
              onClick={() => setCurrentScreen('learn')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentScreen === 'learn'
                  ? 'bg-teal-50 text-[#0F766E] border border-teal-200/70 shadow-2xs'
                  : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/70'
              }`}
            >
              {language === 'hi' ? 'घोटाले जानें' : 'Learn About Frauds'}
            </button>
            <button
              onClick={() => setCurrentScreen('checker')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentScreen === 'checker'
                  ? 'bg-teal-50 text-[#0F766E] border border-teal-200/70 shadow-2xs'
                  : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {language === 'hi' ? 'स्कैम चेकर' : 'Scam Checker'}
            </button>
            <button
              onClick={() => setCurrentScreen('quiz')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentScreen === 'quiz'
                  ? 'bg-teal-50 text-[#0F766E] border border-teal-200/70 shadow-2xs'
                  : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/70'
              }`}
            >
              {language === 'hi' ? 'सुरक्षा क्विज़' : 'Safety Quiz'}
            </button>
            <button
              onClick={() => setCurrentScreen('emergency')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentScreen === 'emergency'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                  : 'text-rose-600 hover:bg-rose-50/60'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              {language === 'hi' ? 'आपातकालीन सहायता (1930)' : 'Emergency Help'}
            </button>
          </nav>

          {/* Accessibility & Quick Controls Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Voice Assistance Stop/Status */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                title="Stop reading aloud"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-100 text-[#0F766E] border border-teal-300 text-xs font-bold animate-pulse"
              >
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Mute Audio</span>
              </button>
            )}

            {/* Text Size Scaler */}
            <button
              onClick={cycleFontSize}
              title={`Change Text Size (Current: ${fontSize})`}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-bold"
              aria-label="Adjust font size"
            >
              <span className="text-sm">A</span>
              <span className="text-xs text-teal-700 font-extrabold">
                {fontSize === 'normal' ? '1x' : fontSize === 'large' ? '1.2x' : '1.4x'}
              </span>
            </button>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              title="Toggle High Contrast Mode"
              className={`p-2 rounded-lg border transition-colors ${
                highContrast
                  ? 'bg-slate-900 text-amber-300 border-slate-900'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              aria-label="Toggle high contrast"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Change Language"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors text-xs font-bold"
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>

            {/* Guide & Orientation button */}
            <button
              onClick={() => setShowOnboarding(true)}
              title="View Onboarding Guide"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-teal-200 text-[#0F766E] hover:bg-teal-50 transition-colors text-xs font-bold"
            >
              Guide
            </button>

            {/* Authentication Button & User Profile Controls */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
                <div
                  title={`Signed in as ${user.name} (${user.email})`}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200/80 text-[#0F766E]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0F766E] text-white text-[10px] font-black flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold max-w-[90px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={() => logout()}
                  title={language === 'hi' ? 'लॉग आउट' : 'Sign Out'}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors text-xs font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{language === 'hi' ? 'लॉग आउट' : 'Sign Out'}</span>
                </button>
              </div>
            ) : (
              <div className="pl-1 border-l border-slate-200">
                <button
                  onClick={() => {
                    setAuthError(null);
                    setAuthModalMessage(null);
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold shadow-xs transition-all hover:scale-102"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'साइन इन' : 'Sign In'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Audience Selector Bar */}
        <div className="py-2.5 border-t border-slate-100 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 shrink-0">
            <span>Tailor For:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {audienceLabels.map(item => (
              <button
                key={item.id}
                onClick={() => setTargetAudience(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  targetAudience === item.id
                    ? 'bg-[#0F766E] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1 text-xs text-slate-500">
            <span className="font-medium text-slate-600">
              {targetAudience === 'seniors'
                ? '👵 Senior Mode Active: Simplified language & larger touch targets'
                : targetAudience === 'students'
                ? '🎓 Student Mode Active: Focus on online gaming, fake jobs & social media'
                : '🛡️ Comprehensive Mode: Showing all fraud categories'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
